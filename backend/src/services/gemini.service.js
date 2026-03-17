import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const getModel = () =>
  genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: { temperature: 0.2, topP: 0.95, maxOutputTokens: 8192 },
  });

export async function* streamReview(prompt) {
  const result = await getModel().generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

export async function generateReview(prompt) {
  const result = await getModel().generateContent(prompt);
  return result.response.text();
}
