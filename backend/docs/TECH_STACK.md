# Tech Stack

## Backend

- Node.js
- Express.js

## Database and Storage

- MongoDB Atlas
- GridFS for uploaded files
- MongoDB Atlas Vector Search for semantic retrieval

## AI

- Google GenAI via `@google/genai`
- embeddings for document chunks and user questions
- generation for final grounded answers

## Authentication

- JWT
- secure HTTP-only cookies

## Likely Packages

- `express`
- `mongoose`
- `mongodb`
- `multer`
- `cookie-parser`
- `cors`
- `jsonwebtoken`
- `bcryptjs`
- `dotenv`
- `@google/genai`
- `pdf-parse`
- `mammoth`

## File-Type Handling Direction

- `pdf` -> parse text with PDF library
- `docx` -> parse text with DOCX library
- `txt` -> read file buffer as plain text
- `doc` -> support required, but may need a separate extraction strategy during implementation

## Important Notes

- the same embedding model must be used for both chunk embeddings and question embeddings
- extraction and chunking are backend logic, not LLM tasks
- Google GenAI is used for embeddings and final answer generation
