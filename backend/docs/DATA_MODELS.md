# Data Models

## Collections

- `users`
- `documents`
- `document_chunks`
- `chats`
- `fs.files` and `fs.chunks` from GridFS

## `users`

Example shape:

```json
{
  "_id": "user123",
  "name": "Aman",
  "email": "aman@example.com",
  "passwordHash": "hashed-password",
  "createdAt": "2026-04-13T10:00:00Z",
  "updatedAt": "2026-04-13T10:00:00Z"
}
```

## `documents`

Example shape:

```json
{
  "_id": "doc123",
  "userId": "user123",
  "fileName": "contract.pdf",
  "mimeType": "application/pdf",
  "extension": "pdf",
  "documentType": "pdf",
  "gridFsFileId": "661a1f...",
  "fileSize": 245678,
  "uploadStatus": "uploaded",
  "processingStatus": "processing",
  "currentStep": "extracting_text",
  "extractedText": "",
  "pageCount": 0,
  "chunkCount": 0,
  "ocrUsed": false,
  "errorMessage": null,
  "createdAt": "2026-04-13T10:00:00Z",
  "updatedAt": "2026-04-13T10:00:00Z"
}
```

Suggested status values:

- `uploadStatus`: `uploaded`
- `processingStatus`: `pending`, `processing`, `completed`, `failed`
- `currentStep`: `uploaded`, `extracting_text`, `chunking_text`, `generating_embeddings`, `storing_chunks`, `completed`

## `document_chunks`

Example shape:

```json
{
  "_id": "chunk001",
  "documentId": "doc123",
  "userId": "user123",
  "chunkIndex": 0,
  "pageNumber": 1,
  "text": "This agreement starts on 1 January 2026.",
  "embedding": [0.012, -0.334, 0.981],
  "tokenCount": 120,
  "createdAt": "2026-04-13T10:03:00Z"
}
```

Notes:

- chunk records should be stored separately from `documents`
- vector search index should be created on the `embedding` field
- filters should support `documentId` and `userId`

## `chats`

Example shape:

```json
{
  "_id": "chat001",
  "userId": "user123",
  "documentId": "doc123",
  "question": "When does the contract start?",
  "answer": "The contract starts on 1 January 2026.",
  "sources": [
    {
      "chunkId": "chunk001",
      "pageNumber": 1,
      "text": "This agreement starts on 1 January 2026."
    }
  ],
  "createdAt": "2026-04-13T10:06:00Z"
}
```

## Vector Index Direction

Atlas vector index should target the `document_chunks.embedding` field and allow filters on:

- `documentId`
- `userId`
