# Processing Flow

## Upload Flow

1. User uploads one file using `POST /api/documents/upload`.
2. Backend validates file type and 10 MB size limit.
3. Backend stores the file in GridFS.
4. Backend creates a `documents` record.
5. Backend starts processing automatically.

## Processing Pipeline

1. Detect document type from MIME type and extension.
2. Read the file from GridFS.
3. Extract text based on file type.
4. Save extracted text into the `documents` record.
5. Split the text into chunks with overlap.
6. Generate embeddings for each chunk using Google GenAI.
7. Store chunk data in `document_chunks`.
8. Update the document with chunk count and completion state.

## File-Type Strategy

- `pdf`: extract text with PDF parser
- `docx`: extract text with DOCX parser
- `txt`: convert file buffer directly to text
- `doc`: required in scope, implementation strategy to be finalized during coding

## Question Answering Flow

1. User sends a question to `POST /api/documents/:documentId/ask`.
2. Backend verifies user ownership and that document processing is complete.
3. Backend generates an embedding for the question.
4. Backend runs MongoDB Atlas Vector Search on `document_chunks`.
5. Backend retrieves the most relevant chunks for that document.
6. Backend sends the retrieved chunks plus the user question to Google GenAI.
7. Backend receives grounded answer.
8. Backend saves the exchange in `chats`.
9. Backend returns answer and citations.

## Status Flow

Frontend should poll `GET /api/documents/:documentId/status` while processing is in progress.

Useful statuses:

- `pending`
- `processing`
- `completed`
- `failed`

Useful current steps:

- `uploaded`
- `extracting_text`
- `chunking_text`
- `generating_embeddings`
- `storing_chunks`
- `completed`
