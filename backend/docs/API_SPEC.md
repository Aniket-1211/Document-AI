# API Specification

## Auth APIs

### `POST /api/auth/register`

Create a new user account.

Request body:

```json
{
  "name": "Aman",
  "email": "aman@example.com",
  "password": "strong-password"
}
```

### `POST /api/auth/login`

Authenticate user and set JWT in secure HTTP-only cookie.

Request body:

```json
{
  "email": "aman@example.com",
  "password": "strong-password"
}
```

### `POST /api/auth/logout`

Clear authentication cookie.

### `GET /api/auth/me`

Return the currently logged-in user using the auth cookie.

## Document APIs

### `POST /api/documents/upload`

Upload a document and start processing automatically.

Rules:

- accepts one file
- max file size: 10 MB
- allowed types: `pdf`, `doc`, `docx`, `txt`
- stores file in GridFS
- creates document record
- starts processing immediately

Example response:

```json
{
  "success": true,
  "message": "Document uploaded successfully. Processing started.",
  "data": {
    "documentId": "doc123",
    "fileName": "contract.pdf",
    "documentType": "pdf",
    "processingStatus": "processing",
    "currentStep": "extracting_text"
  }
}
```

### `GET /api/documents`

List all documents belonging to the logged-in user.

### `GET /api/documents/:documentId`

Return one document's metadata.

### `GET /api/documents/:documentId/status`

Return processing progress for the document.

Example response:

```json
{
  "success": true,
  "data": {
    "documentId": "doc123",
    "processingStatus": "processing",
    "currentStep": "generating_embeddings",
    "pageCount": 12,
    "chunkCount": 24,
    "errorMessage": null
  }
}
```

### `DELETE /api/documents/:documentId`

Delete:

- document metadata
- GridFS file
- chunk records
- chat history for that document

## Chat APIs

### `POST /api/documents/:documentId/ask`

Ask a question about one uploaded document.

Request body:

```json
{
  "question": "What is the contract start date?"
}
```

Expected behavior:

- validate document ownership
- ensure document processing is completed
- create embedding for question
- run vector search on document chunks
- send relevant chunks plus question to LLM
- save question and answer in chat history
- return answer with source snippets

Example response:

```json
{
  "success": true,
  "data": {
    "answer": "The contract starts on 1 January 2026.",
    "sources": [
      {
        "chunkId": "chunk001",
        "pageNumber": 1,
        "text": "This agreement starts on 1 January 2026."
      }
    ]
  }
}
```

### `GET /api/documents/:documentId/chats`

Return chat history for one document.
