# Backend Planning

This folder contains the backend planning and requirement documents for the document Q&A RAG project.

## Purpose

The backend will:

- accept document uploads
- store files in MongoDB GridFS
- extract text from supported file types
- chunk text and generate embeddings
- store chunks in MongoDB Atlas Vector Search
- answer user questions using RAG
- keep users authenticated with secure HTTP-only cookies

## V1 Scope

- backend: Node.js + Express
- database: MongoDB Atlas
- file storage: GridFS
- vector search: MongoDB Atlas Vector Search
- AI provider: Google GenAI
- auth: JWT in secure HTTP-only cookies
- supported document types: pdf, doc, docx, txt
- max file size: 10 MB
- chat scope: one document at a time
- processing starts automatically right after upload
- answers must be grounded in the uploaded document

## Folder Map

- `docs/PROJECT_OVERVIEW.md` - overall product and backend scope
- `docs/TECH_STACK.md` - chosen stack and package direction
- `docs/API_SPEC.md` - V1 backend endpoints
- `docs/AUTH_FLOW.md` - cookie-based authentication design
- `docs/DATA_MODELS.md` - MongoDB collections and document shapes
- `docs/PROCESSING_FLOW.md` - upload, processing, retrieval, and answer flow
- `docs/RAG_RULES.md` - answer behavior rules and RAG grounding rules
- `docs/IMPLEMENTATION_ORDER.md` - suggested backend build order
