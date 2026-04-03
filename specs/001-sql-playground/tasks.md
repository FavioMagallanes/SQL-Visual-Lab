# Tasks: SQL Visual Playground

**Input**: Design documents from `/specs/001-sql-playground/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not included (per constitution: testing prohibited unless explicitly requested).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, copy WASM binary, create project structure

- [x] T001 Install new dependencies: `pnpm add zustand sql.js framer-motion`
- [x] T002 Copy sql.js WASM binary to public directory: `public/sql-wasm.wasm`
- [x] T003 Add postinstall script to `package.json` for WASM binary copy
- [x] T004 [P] Create feature directory structure under `src/features/` (sql-engine, editor, visualizer, ai-assistant) and `src/shared/`
- [x] T005 [P] Configure path alias `@/*` in `tsconfig.json` to include `src/` if needed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, SQL engine, and Zustand store that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define shared TypeScript types (QueryResult, QueryType, DatabaseState) in `src/features/sql-engine/types/index.ts`
- [x] T007 Implement query parser (detect SELECT/INSERT/UPDATE/DELETE/JOIN, block DROP/ALTER) in `src/features/sql-engine/lib/query-parser.ts`
- [x] T008 Implement seed data with characters, teams, and fan_clubs tables in `src/features/sql-engine/lib/seed-data.ts`
- [x] T009 Implement database manager (sql.js init, execute, reset, destroy lifecycle) in `src/features/sql-engine/lib/database-manager.ts`
- [x] T010 Implement Zustand SQL store (state, actions, module-level DB ref) in `src/features/sql-engine/store/sql-store.ts`
- [x] T011 Implement `useSqlDatabase` hook (init on mount, cleanup on unmount) in `src/features/sql-engine/hooks/use-sql-database.ts`
- [x] T012 Implement `useQueryExecutor` hook (debounced execution via store) in `src/features/sql-engine/hooks/use-query-executor.ts`
- [x] T013 [P] Create two-panel layout shell component in `src/shared/components/app-layout.tsx`
- [x] T014 [P] Create shared types in `src/shared/types/index.ts`

**Checkpoint**: SQL engine fully functional — can init DB, execute queries, get results, reset, and destroy. Layout shell ready.

---

## Phase 3: User Story 1 — Instant Data Exploration (Priority: P1) 🎯 MVP

**Goal**: User opens the app and immediately sees a pre-loaded query with results. Editing the query auto-updates the results table after a debounce.

**Independent Test**: Open the app → verify default query `SELECT * FROM characters` is pre-filled → results table shows data → modify query → results update automatically after pause.

### Implementation for User Story 1

- [x] T015 [P] [US1] Define editor types in `src/features/editor/types/index.ts`
- [x] T016 [P] [US1] Define visualizer types in `src/features/visualizer/types/index.ts`
- [x] T017 [US1] Implement `useDebouncedQuery` hook (watch input, 300ms debounce, trigger executeQuery) in `src/features/editor/hooks/use-debounced-query.ts`
- [x] T018 [US1] Create SQL editor component (textarea with default query pre-filled) in `src/features/editor/components/sql-editor.tsx`
- [x] T019 [US1] Create results table component (dynamic columns/rows from QueryResult) in `src/features/visualizer/components/results-table.tsx`
- [x] T020 [US1] Create reset database button component in `src/shared/components/reset-database-button.tsx`
- [x] T021 [US1] Compose main page: init DB, wire editor → store → table in `app/page.tsx`
- [x] T022 [US1] Add error display for SQL syntax errors (inline, user-friendly) in `app/page.tsx`

**Checkpoint**: MVP complete — user sees data on load, edits query, results update live, errors shown, reset button works.

---

## Phase 4: User Story 2 — Visual Feedback for SQL Operations (Priority: P2)

**Goal**: DELETE rows fade out, JOIN columns show color blocks, SELECT highlights specific columns. Visual animations make SQL operations intuitive.

**Independent Test**: Run `DELETE FROM characters WHERE id = 1` → row fades out. Run a JOIN → columns color-coded. Run `SELECT name FROM characters` → name column highlighted.

### Implementation for User Story 2

- [x] T023 [P] [US2] Implement `useAnimationConfig` hook (map QueryType → Framer Motion variants) in `src/features/visualizer/hooks/use-animation-config.ts`
- [x] T024 [US2] Create animated row component with `AnimatePresence` exit animation (fade-out for DELETE) in `src/features/visualizer/components/animated-row.tsx`
- [x] T025 [US2] Create column highlight component (color blocks for JOIN, emphasis for SELECT) in `src/features/visualizer/components/column-highlight.tsx`
- [x] T026 [US2] Integrate animated rows into results table, replacing static rows in `src/features/visualizer/components/results-table.tsx`
- [x] T027 [US2] Add previousResults tracking to SQL store for diff-based animations in `src/features/sql-engine/store/sql-store.ts`
- [x] T028 [US2] Add source-table metadata detection for JOIN column coloring in `src/features/sql-engine/lib/query-parser.ts`

**Checkpoint**: All three animation types working — DELETE fade-out, JOIN color blocks, SELECT column highlight. Previous stories still functional.

---

## Phase 5: User Story 3 — AI-Powered Query Explanation (Priority: P3)

**Goal**: User presses "The Human Button" and gets a plain-language explanation in Spanish of their query or error.

**Independent Test**: Write a valid complex query → press button → see Spanish explanation. Write invalid query → press button → see friendly error explanation. Press with empty editor → see helpful prompt.

### Implementation for User Story 3

- [x] T029 [P] [US3] Define AI assistant types (ExplainRequest, ExplainResponse, ExplanationState) in `src/features/ai-assistant/types/index.ts`
- [x] T030 [US3] Implement AI explanation API route (system prompt in Spanish, proxy to AI service) in `app/api/explain/route.ts`
- [x] T031 [US3] Implement explanation service (construct prompt, call API route) in `src/features/ai-assistant/lib/explanation-service.ts`
- [x] T032 [US3] Implement `useQueryExplanation` hook (fetch explanation, loading/error state) in `src/features/ai-assistant/hooks/use-query-explanation.ts`
- [x] T033 [US3] Create "The Human Button" component (trigger button with loading state) in `src/features/ai-assistant/components/human-button.tsx`
- [x] T034 [US3] Create collapsible explanation panel component (display AI response with typography) in `src/features/ai-assistant/components/explanation-panel.tsx`
- [x] T035 [US3] Integrate AI assistant into main page layout (below editor, collapsible) in `app/page.tsx`
- [x] T036 [US3] Add `.env.local` with `OPENAI_API_KEY` placeholder and update `.env.example`

**Checkpoint**: "The Human Button" works end-to-end — explanations in Spanish, error handling, loading states, fallback message when service unavailable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [x] T037 [P] Add responsive adjustments for the two-panel layout in `src/shared/components/app-layout.tsx`
- [x] T038 [P] Add result row cap (max 100 rows displayed) with message in `src/features/visualizer/components/results-table.tsx`
- [x] T039 [P] Add keyboard shortcut (Ctrl+Enter) for manual query execution in `src/features/editor/components/sql-editor.tsx`
- [x] T040 Add empty state and "no results" visual feedback in `src/features/visualizer/components/results-table.tsx`
- [x] T041 Run quickstart.md validation — verify full setup and all features work
- [x] T042 Final code cleanup: verify no `any`, no `forwardRef`, all `export const`, kebab-case files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) + User Story 1 (needs results-table.tsx to integrate animations)
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) — can start in parallel with US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational — standalone MVP
- **US2 (P2)**: Depends on US1 (integrates animations into results-table.tsx created in US1)
- **US3 (P3)**: Depends only on Foundational — can be developed in parallel with US2

### Within Each User Story

- Types before implementation
- Library/service code before hooks
- Hooks before components
- Components before page integration

### Parallel Opportunities

**Phase 1**: T004 and T005 can run in parallel
**Phase 2**: T013 and T014 can run in parallel with each other (and after T006-T012 are complete)
**Phase 3 (US1)**: T015 and T016 can run in parallel (types)
**Phase 4 (US2)**: T023 can run in parallel with earlier tasks in the phase
**Phase 5 (US3)**: T029 can run in parallel. US3 can start in parallel with US2 after Foundational
**Phase 6**: T037, T038, T039 can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch type definitions in parallel:
Task T015: "Define editor types in src/features/editor/types/index.ts"
Task T016: "Define visualizer types in src/features/visualizer/types/index.ts"

# Then sequentially:
Task T017: "Implement useDebouncedQuery hook"
Task T018: "Create SQL editor component"
Task T019: "Create results table component"
Task T020: "Create reset database button"
Task T021: "Compose main page"
Task T022: "Add error display"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T014)
3. Complete Phase 3: User Story 1 (T015-T022)
4. **STOP and VALIDATE**: Open app → see data → edit query → results update → reset works
5. Deploy/demo if ready — this IS the MVP

### Incremental Delivery

1. Setup + Foundational → Engine ready ✅
2. Add User Story 1 → Interactive playground working → **MVP!** 🎯
3. Add User Story 2 → Animations bring queries to life
4. Add User Story 3 → AI assistant makes it beginner-friendly
5. Polish → Production-ready

### Parallel Team Strategy

With multiple developers after Foundational is complete:

- **Developer A**: User Story 1 (P1) → then User Story 2 (P2, depends on US1)
- **Developer B**: User Story 3 (P3, independent) → then Polish

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task following Conventional Commits (English)
- No tests unless explicitly requested (constitution rule)
- All files must use kebab-case naming
- All exports must use `export const` with arrow functions
- No `any` type, no `forwardRef`
