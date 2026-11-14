const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  }
  return model;
}

/**
 * Generate an AI response from Gemini.
 * @param {string} prompt - The user/system prompt
 * @param {object} options - { temperature, maxTokens, systemContext, mode }
 *   mode: 'analysis' (temp 0.3) | 'assistant' (temp 0.7) | custom
 * @returns {{ success: boolean, data: any, tokensUsed: number|null, model: string }}
 */
async function generateAIResponse(prompt, options = {}) {
  try {
    const ai = getModel();

    const temperature =
      options.temperature ??
      (options.mode === 'analysis' ? 0.3 : options.mode === 'assistant' ? 0.7 : 0.5);

    const generationConfig = {
      temperature,
      maxOutputTokens: options.maxTokens || 4096,
    };

    const parts = [];
    if (options.systemContext) {
      parts.push({ text: `System: ${options.systemContext}\n\n${prompt}` });
    } else {
      parts.push({ text: prompt });
    }

    const result = await ai.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();
    const tokensUsed = response.usageMetadata
      ? response.usageMetadata.totalTokenCount
      : null;

    // Attempt to parse JSON if the response looks like JSON
    let data = text;
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      try {
        data = JSON.parse(jsonMatch[1].trim());
      } catch {
        data = text;
      }
    }

    return { success: true, data, tokensUsed, model: GEMINI_MODEL };
  } catch (error) {
    console.error('[GeminiClient] Error:', error.message);
    return {
      success: false,
      data: null,
      tokensUsed: null,
      model: GEMINI_MODEL,
      error: 'AI service is temporarily unavailable. Please try again later.',
      fallback: true,
    };
  }
}

/**
 * Generate a structured JSON response conforming to a schema description.
 * @param {string} prompt
 * @param {object} schema - JSON schema description for the expected output
 * @returns {{ success: boolean, data: any, tokensUsed: number|null, model: string }}
 */
async function generateStructuredResponse(prompt, schema) {
  const structuredPrompt = `${prompt}

You MUST respond with valid JSON only, no markdown, no explanation.
The JSON must conform to this schema:
${JSON.stringify(schema, null, 2)}`;

  try {
    const ai = getModel();

    const result = await ai.generateContent({
      contents: [{ role: 'user', parts: [{ text: structuredPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
    });

    const response = result.response;
    const text = response.text();
    const tokensUsed = response.usageMetadata
      ? response.usageMetadata.totalTokenCount
      : null;

    // Strip markdown fences if present
    const cleaned = text.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleaned);

    return { success: true, data, tokensUsed, model: GEMINI_MODEL };
  } catch (error) {
    console.error('[GeminiClient] Structured response error:', error.message);
    return {
      success: false,
      data: null,
      tokensUsed: null,
      model: GEMINI_MODEL,
      error: 'AI service is temporarily unavailable. Please try again later.',
      fallback: true,
    };
  }
}

module.exports = { generateAIResponse, generateStructuredResponse };
