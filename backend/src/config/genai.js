import { GoogleGenAI } from "@google/genai";

let genAiClient;

const getGenAiClient = () => {
  if (genAiClient) {
    return genAiClient;
  }

  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not defined");
  }

  genAiClient = new GoogleGenAI({ apiKey });
  return genAiClient;
};

export default getGenAiClient;
