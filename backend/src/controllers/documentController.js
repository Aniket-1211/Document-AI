import mongoose from "mongoose";

import Chat from "../models/Chat.js";
import Document from "../models/Document.js";
import asyncHandler from "../utils/asyncHandler.js";
import { normalizeDocumentType } from "../utils/document.js";
import { uploadBufferToGridFs, deleteFileFromGridFs } from "../services/gridfsService.js";
import { processDocument } from "../services/documentProcessingService.js";
import DocumentChunk from "../models/DocumentChunk.js";
import { generateAnswer } from "../services/genaiService.js";
import { searchRelevantChunks } from "../services/vectorSearchService.js";

const ensureValidDocumentId = (documentId) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    const error = new Error("Invalid document id");
    error.statusCode = 400;
    throw error;
  }
};

const findOwnedDocument = async (documentId, userId) => {
  ensureValidDocumentId(documentId);

  const document = await Document.findOne({
    _id: documentId,
    userId,
  });

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  return document;
};

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Document file is required",
    });
  }

  const { originalname, mimetype, size, buffer } = req.file;
  const { extension, documentType } = normalizeDocumentType({
    fileName: originalname,
    mimeType: mimetype,
  });

  const gridFsFileId = await uploadBufferToGridFs({
    buffer,
    fileName: originalname,
    mimeType: mimetype,
    metadata: {
      userId: req.user._id.toString(),
      documentType,
    },
  });

  const document = await Document.create({
    userId: req.user._id,
    fileName: originalname,
    mimeType: mimetype,
    extension,
    documentType,
    gridFsFileId,
    fileSize: size,
    uploadStatus: "uploaded",
    processingStatus: "processing",
    currentStep: "extracting_text",
  });

  setImmediate(() => {
    processDocument(document._id).catch((error) => {
      console.error(`Document processing failed for ${document._id}`, error);
    });
  });

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully. Processing started.",
    data: {
      documentId: document._id,
      fileName: document.fileName,
      documentType: document.documentType,
      processingStatus: document.processingStatus,
      currentStep: document.currentStep,
    },
  });
});

const listDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-extractedText")
    .lean();

  res.status(200).json({
    success: true,
    data: documents,
  });
});

const getDocument = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.params.documentId, req.user._id);

  res.status(200).json({
    success: true,
    data: document,
  });
});

const getDocumentStatus = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.params.documentId, req.user._id);

  res.status(200).json({
    success: true,
    data: {
      documentId: document._id,
      processingStatus: document.processingStatus,
      currentStep: document.currentStep,
      pageCount: document.pageCount,
      chunkCount: document.chunkCount,
      errorMessage: document.errorMessage,
    },
  });
});

const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  const document = await findOwnedDocument(req.params.documentId, req.user._id);

  if (document.processingStatus !== "completed") {
    return res.status(409).json({
      success: false,
      message: "Document is not ready for questions yet",
    });
  }

  const relevantChunks = await searchRelevantChunks({
    documentId: document._id.toString(),
    userId: req.user._id.toString(),
    question,
    limit: 5,
  });

  const context = relevantChunks.map((chunk, index) => {
    const page = chunk.pageNumber ? `Page ${chunk.pageNumber}` : "Page unknown";
    return `[Source ${index + 1} - ${page}]\n${chunk.text}`;
  }).join("\n\n");

  const answer = await generateAnswer({
    question,
    context,
  });

  const sources = relevantChunks.map((chunk) => ({
    chunkId: chunk._id,
    pageNumber: chunk.pageNumber ?? null,
    text: chunk.text,
  }));

  const chat = await Chat.create({
    userId: req.user._id,
    documentId: document._id,
    question: question.trim(),
    answer: answer || "I could not find that information in the uploaded document.",
    sources,
  });

  res.status(200).json({
    success: true,
    data: {
      chatId: chat._id,
      answer: chat.answer,
      sources: chat.sources,
    },
  });
});

const getDocumentChats = asyncHandler(async (req, res) => {
  await findOwnedDocument(req.params.documentId, req.user._id);

  const chats = await Chat.find({
    documentId: req.params.documentId,
    userId: req.user._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: chats,
  });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const document = await findOwnedDocument(req.params.documentId, req.user._id);

  await Promise.all([
    Chat.deleteMany({ documentId: document._id, userId: req.user._id }),
    DocumentChunk.deleteMany({ documentId: document._id, userId: req.user._id }),
  ]);

  try {
    await deleteFileFromGridFs(document.gridFsFileId);
  } catch (error) {
    console.error(`Failed to delete GridFS file for document ${document._id}`, error);
  }

  await Document.findByIdAndDelete(document._id);

  res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
});

export {
  uploadDocument,
  listDocuments,
  getDocument,
  getDocumentStatus,
  askQuestion,
  getDocumentChats,
  deleteDocument,
};
