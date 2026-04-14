import mammoth from "mammoth";
import pdfParse from "pdf-parse";

import Document from "../models/Document.js";
import DocumentChunk from "../models/DocumentChunk.js";
import { generateEmbedding } from "./genaiService.js";
import { readFileBufferFromGridFs } from "./gridfsService.js";
import { chunkText, estimateTokenCount } from "../utils/document.js";

const updateDocumentProgress = async (documentId, updates) => {
  await Document.findByIdAndUpdate(documentId, {
    ...updates,
    updatedAt: new Date(),
  });
};

const extractTextFromBuffer = async ({ buffer, documentType }) => {
  if (documentType === "pdf") {
    const result = await pdfParse(buffer);

    return {
      text: result.text || "",
      pageCount: result.numpages || 0,
    };
  }

  if (documentType === "docx") {
    const result = await mammoth.extractRawText({ buffer });

    return {
      text: result.value || "",
      pageCount: 0,
    };
  }

  if (documentType === "txt") {
    return {
      text: buffer.toString("utf-8"),
      pageCount: 0,
    };
  }

  if (documentType === "doc") {
    throw new Error(
      "Legacy .doc extraction is not configured yet. Please use pdf, docx, or txt for now."
    );
  }

  throw new Error("Unsupported document type for text extraction");
};

const processDocument = async (documentId) => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new Error("Document not found for processing");
  }

  try {
    await updateDocumentProgress(documentId, {
      processingStatus: "processing",
      currentStep: "extracting_text",
      errorMessage: null,
    });

    const buffer = await readFileBufferFromGridFs(document.gridFsFileId);
    const extracted = await extractTextFromBuffer({
      buffer,
      documentType: document.documentType,
    });

    const normalizedText = extracted.text.replace(/\u0000/g, "").trim();

    if (!normalizedText) {
      throw new Error("No readable text could be extracted from the document");
    }

    await updateDocumentProgress(documentId, {
      extractedText: normalizedText,
      pageCount: extracted.pageCount,
      currentStep: "chunking_text",
    });

    const chunks = chunkText(normalizedText);

    if (!chunks.length) {
      throw new Error("No chunks could be generated from the extracted text");
    }

    await updateDocumentProgress(documentId, {
      currentStep: "generating_embeddings",
    });

    const chunkDocs = [];

    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      const embedding = await generateEmbedding(chunk);

      chunkDocs.push({
        documentId: document._id,
        userId: document.userId,
        chunkIndex: index,
        pageNumber: null,
        text: chunk,
        embedding,
        tokenCount: estimateTokenCount(chunk),
      });
    }

    await updateDocumentProgress(documentId, {
      currentStep: "storing_chunks",
    });

    await DocumentChunk.deleteMany({ documentId: document._id });
    await DocumentChunk.insertMany(chunkDocs);

    await updateDocumentProgress(documentId, {
      processingStatus: "completed",
      currentStep: "completed",
      chunkCount: chunkDocs.length,
      errorMessage: null,
    });
  } catch (error) {
    await updateDocumentProgress(documentId, {
      processingStatus: "failed",
      currentStep: "failed",
      errorMessage: error.message,
    });

    throw error;
  }
};

export { processDocument };
