import getGenAiClient from "../config/genai.js";
import { getEnv } from "../config/env.js";

const normalizeEmbeddingValues = (embeddingResponse) => {
  if (!embeddingResponse) {
    throw new Error("No embedding response received from Google GenAI");
  }

  if (
    Array.isArray(embeddingResponse.embeddings) &&
    embeddingResponse.embeddings[0]?.values
  ) {
    return embeddingResponse.embeddings[0].values;
  }

  if (embeddingResponse.embedding?.values) {
    return embeddingResponse.embedding.values;
  }

  throw new Error("Unable to read embedding values from Google GenAI response");
};

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required to generate an embedding");
  }

  const client = getGenAiClient();
  const { googleEmbeddingModel } = getEnv();

  const response = await client.models.embedContent({
    model: googleEmbeddingModel,
    contents: [text],
  });

  return normalizeEmbeddingValues(response);
};

const generateAnswer = async ({ question, context, systemInstruction }) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required for answer generation");
  }

  const client = getGenAiClient();
  const { googleChatModel } = getEnv();

  const prompt = [
    systemInstruction ||
      "Answer only from the provided document context. If the answer is not present, say that you could not find it in the uploaded document.",
    "",
    "Document context:",
    context || "No context provided.",
    "",
    `User question: ${question}`,
  ].join("\n");

  const response = await client.models.generateContent({
    model: googleChatModel,
    contents: prompt,
  });

  return response.text || "";
};

export { generateEmbedding, generateAnswer };
