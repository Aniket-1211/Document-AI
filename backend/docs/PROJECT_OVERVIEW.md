# Project Overview

## Product Goal

Build a backend for a document-based question answering application where users upload a document and then ask questions about that document. The AI should answer using only the uploaded document content.

## Core User Flow

1. User registers or logs in.
2. User uploads a document.
3. Backend stores the file in MongoDB GridFS.
4. Backend starts processing immediately after upload.
5. Backend extracts text from the file.
6. Backend splits text into chunks.
7. Backend generates embeddings for each chunk.
8. Backend stores chunk data in MongoDB.
9. User asks questions about that document.
10. Backend retrieves relevant chunks and sends them to the LLM.
11. Backend returns an answer with citations.

## V1 Decisions

- single backend service
- one document chat at a time
- max upload size: 10 MB
- support `pdf`, `doc`, `docx`, `txt`
- use MongoDB for both metadata and file storage
- use MongoDB Atlas Vector Search for retrieval
- use Google GenAI for embeddings and answer generation
- use secure HTTP-only cookie auth

## Non-Functional Requirements

- reject unsupported file types
- reject files over 10 MB
- verify document ownership on protected document routes
- do not expose AI keys to frontend
- show processing progress
- return clear failure states when processing cannot complete
- keep answers grounded in document content
