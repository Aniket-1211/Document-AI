import express from "express";

import {
  askQuestion,
  deleteDocument,
  getDocument,
  getDocumentChats,
  getDocumentStatus,
  listDocuments,
  uploadDocument,
} from "../controllers/documentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("document"), uploadDocument);
router.get("/", listDocuments);
router.get("/:documentId/status", getDocumentStatus);
router.post("/:documentId/ask", askQuestion);
router.get("/:documentId/chats", getDocumentChats);
router.get("/:documentId", getDocument);
router.delete("/:documentId", deleteDocument);

export default router;
