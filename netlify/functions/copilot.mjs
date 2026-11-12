// Netlify Function: the "server" for the AI Copilot.
// The Gemini API key lives here (in the Netlify environment variable VISIONFORGE_GEMINI_KEY), never in the browser.

// Models are tried in order. If one is busy or unavailable, the next one is used.
const MODELS_TO_TRY = [...new Set([process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-3-flash-preview'].filter(Boolean))];
const RETRY_WITH_NEXT_MODEL_STATUSES = [404, 429, 500, 503];
const MAX_MESSAGES = 10; // only the most recent messages are sent to the AI
const MAX_CHARACTERS_PER_MESSAGE = 1000;
const PER_MODEL_TIMEOUT_MS = 9000; // if one model is too slow, give up on it and try the next
const TOTAL_TIME_BUDGET_MS = 20000; // stay under the website's own 24 second wait

const SYSTEM_PROMPT = `You are the VisionForge AI Study-Abroad Copilot. You help students from Pakistan plan to study abroad.
Language: reply in the same language the student writes in (English, Urdu script, or Roman Urdu).
Style: friendly, clear, practical, at most 150 words. Use plain text only, with no markdown symbols such as ** or #. Short lines or simple numbered steps are fine.
Be honest: if you are not sure about a rule, fee or deadline, say so and tell the student to check the official portal. Never invent numbers.
Quick facts from the VisionForge database (verified Oct-Nov 2026, always tell students to re-check official sources):
- Germany: blocked account about 11,904 EUR (about PKR 3.6 million); most public universities have no tuition; IELTS 6.5+; 18-month job-seeking visa after graduation; portal daad.de.
- United Kingdom: tuition about 13,000-25,000 GBP per year; bank statement held for 28 consecutive days; IELTS UKVI 6.0-7.0; 2-year Graduate Route visa; portal gov.uk/student-visa.
- United States: tuition about 20,000-45,000 USD per year; I-20, SEVIS fee 350 USD, DS-160, F-1 interview; 1-year OPT (3 years for STEM); portal travel.state.gov.
- Canada: GIC of 20,635 CAD; tuition about 17,000-35,000 CAD per year; IELTS 6.5 overall; PGWP up to 3 years.
- Australia: living requirement 29,710 AUD per year; tuition about 22,000-42,000 AUD; IELTS 6.5; Subclass 485 graduate visa.
If asked about something unrelated to studying abroad, politely steer back to study-abroad topics.`;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function cleanText(value, maxLength) {
  return String(value ?? '').slice(0, maxLength);
}

// Turns the chat from the website into the format Gemini expects:
// roles must be "user" / "model", the chat must start with the user, and the last message must be the user's.
function buildGeminiContents(messages) {
  const recentMessages = messages.slice(-MAX_MESSAGES);
  const contents = [];
  for (const message of recentMessages) {
    const role = message && message.sender === 'user' ? 'user' : 'model';
    const text = cleanText(message && message.text, MAX_CHARACTERS_PER_MESSAGE).trim();
    if (!text) continue;
    if (contents.length === 0 && role === 'model') continue; // skip the greeting at the start
    const previous = contents[contents.length - 1];
    if (previous && previous.role === role) {
      previous.parts[0].text += '\n' + text; // merge two messages in a row from the same side
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }
  return contents;
}

function describeProfile(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const fields = {
    'Target country': profile.targetCountry,
    'Target degree': profile.targetDegree,
    'Field of study': profile.fieldOfStudy,
    'Current university': profile.institution,
    'CGPA': profile.cgpa,
    'IELTS score': profile.ieltsScore,
    'Budget (PKR)': profile.budgetPKR,
    'Intake': profile.intake,
  };
  const lines = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `- ${label}: ${cleanText(value, 80)}`);
  return lines.length ? `\nStudent profile:\n${lines.join('\n')}` : '';
}

export default async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Use POST' }, 405);
  }

  // Remove accidental spaces or quote marks around the key
  // Our own variable name on purpose: Netlify's AI Gateway fills in GEMINI_API_KEY with its own token,
  // which Google rejects as "API key not valid".
  const apiKey = (process.env.VISIONFORGE_GEMINI_KEY || '').trim().replace(/^["']+|["']+$/g, '');
  if (!apiKey) {
    return jsonResponse({ error: 'VISIONFORGE_GEMINI_KEY is not set on the server' }, 500);
  }

  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  if (!Array.isArray(requestBody.messages)) {
    return jsonResponse({ error: 'messages must be a list' }, 400);
  }
  const contents = buildGeminiContents(requestBody.messages);
  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    return jsonResponse({ error: 'The last message must come from the user' }, 400);
  }

  const buildGeminiRequest = (model) => {
    const generationConfig = { temperature: 0.6, maxOutputTokens: 2048 };
    // Gemini 2.5 Flash "thinks" before answering by default, which makes replies slow.
    // Budget 0 turns that off. Only sent to 2.5 Flash; other models would reject this setting.
    if (model === 'gemini-2.5-flash') {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    return {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT + describeProfile(requestBody.profile) }] },
      contents,
      generationConfig,
    };
  };

  const startTime = Date.now();
  let lastStatus = 0;
  let cutOffReply = ''; // an answer that stopped early; only used if no model gives a complete one
  for (const model of MODELS_TO_TRY) {
    const timeLeft = TOTAL_TIME_BUDGET_MS - (Date.now() - startTime);
    if (timeLeft < 3000) break; // not enough time left for another try

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), Math.min(PER_MODEL_TIMEOUT_MS, timeLeft));
    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify(buildGeminiRequest(model)),
          signal: controller.signal,
        }
      );

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts ?? [];
        const reply = parts.map((part) => part.text ?? '').join('').trim();
        if (reply && candidate?.finishReason === 'MAX_TOKENS') {
          // The model ran out of room mid-answer (thinking models spend part of it on thinking)
          console.error('Gemini answer was cut off (MAX_TOKENS) with model', model);
          if (reply.length > cutOffReply.length) cutOffReply = reply;
          lastStatus = 206;
          continue; // try the next model for a complete answer
        }
        if (reply) return jsonResponse({ reply });
        console.error('Gemini returned an empty answer with model', model);
        lastStatus = 204;
        continue; // try the next model
      }

      const errorText = await geminiResponse.text();
      console.error('Gemini error', geminiResponse.status, 'model:', model, errorText.slice(0, 500));
      lastStatus = geminiResponse.status;
      if (errorText.includes('API_KEY_INVALID')) {
        // Safe hint for debugging: shows the key's length and first letters only, never the whole key
        console.error(`Key seen by the function: length ${apiKey.length}, starts with "${apiKey.slice(0, 4)}"`);
      }
      if (!RETRY_WITH_NEXT_MODEL_STATUSES.includes(geminiResponse.status)) break; // e.g. bad key: trying again will not help
    } catch (error) {
      // Timed out or network problem: log it and try the next model
      console.error('Gemini request failed or timed out, model:', model, error && error.name);
      lastStatus = 504;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  if (cutOffReply) return jsonResponse({ reply: cutOffReply });
  return jsonResponse({ error: `AI service error (${lastStatus})` }, 502);
};
