import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { getEnv } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const startServer = async () => {
  try {
    await connectDB();

    const { port } = getEnv();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
