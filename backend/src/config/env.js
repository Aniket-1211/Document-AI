const getEnv = () => {
  return {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    googleGenAiApiKey: process.env.GOOGLE_GENAI_API_KEY,
    googleChatModel: process.env.GOOGLE_CHAT_MODEL || "gemini-3-flash-preview",
    googleEmbeddingModel:
      process.env.GOOGLE_EMBEDDING_MODEL || "gemini-embedding-001",
  };
};

export { getEnv };
