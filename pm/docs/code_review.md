# Code Review Feedback

## Overall Assessment

The project is well-structured for an MVP. The backend (FastAPI + SQLite) and frontend (Next.js 16 + React 19 + @dnd-kit) work together effectively. The test coverage is good (20 passed, 3 skipped on backend; 12 passed on frontend).

---

## Issues Found

### 1. ESLint Configuration Error (High Priority)

**File:** `frontend/eslint.config.mjs:1`

The ESLint 9 flat config is using incorrect imports:

```javascript
import { defineConfig, globalIgnores } from "eslint/config";  // Wrong
```

This should use `eslint/config` differently for flat config. The config file needs fixing to make `npm run lint` work.

### 2. Missing Dependency Installation in Dockerfile

**File:** `Dockerfile:22-25`

The Dockerfile installs Python dependencies but doesn't install Node modules properly during build. The frontend build happens but the container may fail if frontend needs to rebuild.

### 3. No Input Sanitization on Card Details

**Files:** `backend/app/models.py:19`, `backend/app/routes/board.py:157`

The `CardCreate` model accepts `details` field but there's no HTML sanitization. If this becomes a multi-user app with shared boards, XSS could be a risk.

### 4. Potential Race Condition in Drag-and-Drop

**File:** `frontend/src/components/KanbanBoard.tsx:107-114`

The optimistic UI update and API call happen simultaneously. If the API fails, the UI state becomes inconsistent. Consider adding rollback logic.

### 5. Missing Error Handling for Invalid Column IDs

**File:** `backend/app/routes/board.py:60-76`

When updating a column, if the column doesn't exist for the user's board, it returns 404. However, the error message could be more descriptive.

---

## Minor Improvements

### 1. Unused Code

- `frontend/src/lib/kanban.ts:28-82` - `initialData` is defined but no longer used since API-driven data replaced it. Consider removing for cleaner codebase.

### 2. Hardcoded Credentials

- `frontend/src/app/page.tsx:24` - Credentials are hardcoded in the frontend. This is acceptable for MVP but note that actual auth would need backend verification.

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

---

## Recommended Fixes

1. Fix `eslint.config.mjs` for ESLint 9 flat config
2. Remove unused `initialData` from kanban.ts
3. Add basic HTML sanitization for card details
4. Consider adding rollback logic for failed drag-and-drop operations
