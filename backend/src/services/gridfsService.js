import { ObjectId } from "mongodb";

import { getGridFsBucket } from "../config/db.js";

const uploadBufferToGridFs = ({ buffer, fileName, mimeType, metadata = {} }) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFsBucket();
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: mimeType,
      metadata,
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.end(buffer);
  });
};

const readFileBufferFromGridFs = (fileId) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFsBucket();
    const normalizedId = typeof fileId === "string" ? new ObjectId(fileId) : fileId;
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(normalizedId);

    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("error", reject);
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

const deleteFileFromGridFs = async (fileId) => {
  const bucket = getGridFsBucket();
  const normalizedId = typeof fileId === "string" ? new ObjectId(fileId) : fileId;
  await bucket.delete(normalizedId);
};

export { uploadBufferToGridFs, readFileBufferFromGridFs, deleteFileFromGridFs };
