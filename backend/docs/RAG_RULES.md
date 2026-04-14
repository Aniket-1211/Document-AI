# RAG Rules

## What This Project Uses

This backend uses Retrieval-Augmented Generation (RAG).

## Meaning

- retrieval: find relevant document chunks
- augmentation: pass retrieved chunks into the LLM prompt
- generation: generate the final answer from those chunks

## Answer Rules

### Answer only from document content

The model should use only the uploaded document content provided in retrieved chunks.

### If answer is not found, say so clearly

The model should explicitly respond that the answer could not be found in the uploaded document instead of guessing.

### Return source snippets or citations

Each answer should include supporting chunk snippets and metadata such as page number when available.

## Why These Rules Matter

- reduces hallucinations
- improves trust
- lets users verify answers
- keeps the system document-grounded instead of acting like a general chatbot

## Prompting Direction

The answer-generation prompt should instruct the model to:

- use only the provided context
- not use outside knowledge
- say when the answer is not in the document
- answer clearly and concisely
- return grounded evidence
