# Authentication Flow

## Approach

Use JWT-based authentication with secure HTTP-only cookies.

## Why Cookie-Based Auth

- token is not exposed to frontend JavaScript
- better protection against client-side token theft
- frontend does not need to manually store tokens in local storage
- `GET /api/auth/me` becomes the standard session-check endpoint

## Auth Flow

1. User registers with `POST /api/auth/register`.
2. User logs in with `POST /api/auth/login`.
3. Backend creates JWT.
4. Backend sets JWT in secure HTTP-only cookie.
5. Frontend calls `GET /api/auth/me` on app load to detect current user.
6. Protected routes read the cookie and verify the user.
7. `POST /api/auth/logout` clears the cookie.

## Cookie Settings

Recommended settings:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "strict"` or `sameSite: "lax"`
- expiry with a sensible max age

## Protected Route Rules

All document and chat routes should:

- verify that the auth cookie exists
- verify that the JWT is valid
- attach the current user to the request
- verify document ownership before reading or modifying a document
