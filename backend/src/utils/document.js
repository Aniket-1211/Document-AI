const getFileExtension = (fileName = "") => {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
};

const normalizeDocumentType = ({ fileName, mimeType }) => {
  const extension = getFileExtension(fileName);

  if (mimeType === "application/pdf" || extension === "pdf") {
    return { extension, documentType: "pdf" };
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return { extension, documentType: "docx" };
  }

  if (mimeType === "application/msword" || extension === "doc") {
    return { extension, documentType: "doc" };
  }

  if (mimeType === "text/plain" || extension === "txt") {
    return { extension, documentType: "txt" };
  }

  throw new Error("Unsupported document type");
};

const estimateTokenCount = (text = "") => {
  return Math.ceil(text.length / 4);
};

const chunkText = (text, chunkSize = 1500, overlap = 200) => {
  const cleanedText = text.replace(/\s+/g, " ").trim();

  if (!cleanedText) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < cleanedText.length) {
    const end = Math.min(start + chunkSize, cleanedText.length);
    const chunk = cleanedText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === cleanedText.length) {
      break;
    }

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
};

export { getFileExtension, normalizeDocumentType, estimateTokenCount, chunkText };
