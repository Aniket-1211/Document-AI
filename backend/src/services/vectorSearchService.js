import mongoose from "mongoose";

import DocumentChunk from "../models/DocumentChunk.js";
import { generateEmbedding } from "./genaiService.js";

const buildKeywordSet = (text) => {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter((token) => token.length > 2)
  );
};

const leadingChunkFallbackSearch = async ({
  documentId,
  userId,
  limit = 5,
}) => {
  return DocumentChunk.find({ documentId, userId })
    .sort({ chunkIndex: 1 })
    .limit(limit)
    .select("text pageNumber chunkIndex")
    .lean();
};

const keywordFallbackSearch = async ({ documentId, userId, question, limit = 5 }) => {
  const chunks = await DocumentChunk.find({ documentId, userId })
    .select("text pageNumber chunkIndex")
    .lean();

  const questionTokens = buildKeywordSet(question);

  const scoredChunks = chunks
    .map((chunk) => {
      const chunkTokens = buildKeywordSet(chunk.text);
      let score = 0;

      questionTokens.forEach((token) => {
        if (chunkTokens.has(token)) {
          score += 1;
        }
      });

      return {
        ...chunk,
        score,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.chunkIndex - b.chunkIndex;
    });

  const matchedChunks = scoredChunks
    .filter((chunk) => chunk.score > 0)
    .slice(0, limit);

  if (matchedChunks.length > 0) {
    return matchedChunks;
  }

  return leadingChunkFallbackSearch({ documentId, userId, limit });
};

const searchRelevantChunks = async ({ documentId, userId, question, limit = 5 }) => {
  const questionEmbedding = await generateEmbedding(question);

  try {
    const chunks = await mongoose.connection.db
      .collection("documentchunks")
      .aggregate([ 
        {
          $vectorSearch: {
            index: "document_chunks_vector_index",
            path: "embedding",
            queryVector: questionEmbedding,
            numCandidates: 100,
            limit,
            filter: {
              documentId: new mongoose.Types.ObjectId(documentId),
              userId: new mongoose.Types.ObjectId(userId),
            },
          },
        },
        {
          $project: {
            text: 1,
            pageNumber: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    if (!chunks.length) {
      return keywordFallbackSearch({ documentId, userId, question, limit });
    }

    return chunks;
  } catch (error) {
    return keywordFallbackSearch({ documentId, userId, question, limit });
  }
};

export { searchRelevantChunks };
