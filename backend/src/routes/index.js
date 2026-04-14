import express from "express";
import authRoutes from "./authRoutes.js";
import documentRoutes from "./documentRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);

export default router;
