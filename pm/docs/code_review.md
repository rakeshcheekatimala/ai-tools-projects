# Code Review Feedback

## Overall Assessment

The project is well-structured for an MVP. The backend (FastAPI + SQLite) and frontend (Next.js 16 + React 19 + @dnd-kit) work together effectively. The test coverage is good (20 passed, 3 skipped on backend; 12 passed on frontend).

---

## Issues Found

### 1. ESLint Configuration Error (High Priority) - FIXED

**File:** `frontend/eslint.config.mjs`

**Problem:** The ESLint 9 flat config was using incorrect imports.

**Solution:** Downgraded to ESLint 8 and created `.eslintrc.json` with proper configuration. The flat config file was removed.

### 2. No Input Sanitization on Card Details - FIXED

**Files:** `backend/app/routes/board.py`, `backend/app/ai.py`

**Problem:** The `CardCreate` model accepted `details` field but there was no HTML sanitization, which could lead to XSS risks.

**Solution:** Added `html-sanitizer` library and implemented sanitization for:
- Card title and details when creating cards via API (`board.py`)
- Card title and details when updating cards via API (`board.py`)
- Card title and details when creating cards via AI chat (`ai.py`)
- Card title and details when updating cards via AI chat (`ai.py`)

### 3. Potential Race Condition in Drag-and-Drop - FIXED

**Files:** `frontend/src/components/KanbanBoard.tsx`, `frontend/src/app/page.tsx`

**Problem:** The optimistic UI update and API call happened simultaneously. If the API failed, the UI state became inconsistent.

**Solution:** 
- Modified `KanbanBoard.tsx` to only do optimistic updates when no `onMoveCard` callback is provided
- Modified `page.tsx` to store the previous board state before the optimistic update and rollback to it if the API call fails

---

## Minor Improvements (Not Addressed)

### 1. Unused Code

- `frontend/src/lib/kanban.ts:28-82` - `initialData` is used in unit tests, so it was kept.

### 2. Hardcoded Credentials

- `frontend/src/app/page.tsx:24` - Credentials are hardcoded in the frontend. This is acceptable for MVP but note that actual auth would need backend verification for production.

### 3. No Rate Limiting on Chat API

- `backend/app/routes/chat.py` - The AI chat endpoint has no rate limiting, which could lead to excessive API costs.

### 4. Missing TypeScript Strict Mode

- `frontend/tsconfig.json` - Consider enabling `strict: true` for better type safety.

---

## What Works Well

1. **Clean Architecture** - Clear separation between routes, models, and database
2. **Good Test Coverage** - 98% backend coverage as mentioned in PLAN.md
3. **Proper Error Handling** - Most API endpoints handle errors gracefully
4. **Drag-and-Drop** - Well-implemented with @dnd-kit
5. **Structured AI Output** - Good approach with Pydantic models for AI actions
6. **Rollback Logic** - Now properly handles failed drag-and-drop operations

---

## Verification

All tests pass:
- Backend: 20 passed, 3 skipped
- Frontend: 12 passed
- ESLint: No errors
