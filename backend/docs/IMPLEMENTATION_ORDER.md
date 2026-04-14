# Implementation Order

## Recommended Build Sequence

1. Initialize Node.js backend with Express.
2. Connect MongoDB Atlas.
3. Set up user model and auth flow.
4. Implement secure cookie-based JWT auth.
5. Set up GridFS upload pipeline.
6. Add `POST /api/documents/upload`.
7. Add document model and processing status tracking.
8. Implement text extraction by file type.
9. Implement chunking logic.
10. Add Google GenAI embedding service.
11. Store chunks and embeddings in MongoDB.
12. Configure Atlas Vector Search index.
13. Add `GET /api/documents/:documentId/status`.
14. Add `POST /api/documents/:documentId/ask`.
15. Add chat history storage and retrieval.
16. Add delete flow for document, GridFS file, chunks, and chats.

## Suggested Backend Modules

- `config`
- `models`
- `controllers`
- `routes`
- `middlewares`
- `services`
- `utils`

## Suggested Service Split

- auth service
- GridFS upload service
- document extraction service
- chunking service
- embedding service
- vector search service
- answer generation service
- chat service
