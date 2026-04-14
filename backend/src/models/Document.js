import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: ["pdf", "doc", "docx", "txt"],
    },
    gridFsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadStatus: {
      type: String,
      default: "uploaded",
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    currentStep: {
      type: String,
      default: "uploaded",
    },
    extractedText: {
      type: String,
      default: "",
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
