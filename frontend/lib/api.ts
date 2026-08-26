// Thin client for the FastAPI backend. See docs/API-CONTRACT.md §9.
// Every request/response body here is the same integer-sen JSON shape
// documented in §1-§5 -- this file must never format currency itself.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
