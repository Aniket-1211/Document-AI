# Doc AI

Doc AI is a full-stack document intelligence app that helps users upload files, process them into searchable knowledge, and chat with document-grounded answers using a Retrieval-Augmented Generation (RAG) workflow.

## Features

- User authentication (sign up, sign in, logout)
- Upload support for common document formats
- Background document processing with status tracking
- Document library with metadata (type, size, pages, chunks, upload date)
- AI chat interface for asking questions about processed documents
- Source-grounded response flow with persisted chat history

## Project Structure

- `frontend/` - React + Vite client (Tailwind-based UI)
- `backend/` - Node.js + Express API
- `backend/docs/` - architecture/process documentation

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- React Toastify
- React Markdown

### Backend

- Node.js (ES modules)
- Express
- MongoDB + Mongoose
- Multer / GridFS for file handling and storage
- JWT + cookies for auth
- Google GenAI SDK for embeddings and answer generation

## How It Works

1. User uploads a document.
2. Backend stores file and metadata.
3. Processing extracts text, chunks content, and creates embeddings.
4. Processed chunks are indexed for retrieval.
5. User asks a question in chat.
6. Relevant chunks are retrieved and passed to the model.
7. Grounded answer is returned and saved in chat history.

## Local Setup

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment

- Backend: create/update `backend/.env` (use `backend/.env.example` as reference)
- Frontend: create/update `frontend/.env` and set API base URL if needed

### 3) Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## Main Routes (Frontend)

- `/signin`
- `/signup`
- `/upload`
- `/documents`
- `/chat`

## Notes

- Document processing status is surfaced in the Documents page.
- Upload flow redirects users to Documents after successful upload.
- This repository includes separate READMEs inside `frontend/` and `backend/` for stack-specific details.
