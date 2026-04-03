# Feature Specification: SQL Visual Playground

**Feature Branch**: `001-sql-playground`  
**Created**: April 3, 2026  
**Status**: Draft  
**Input**: User description: "SQL-Visual-Lab: An interactive SQL playground for beginners. Goal: Eliminate learning friction through immediate visual feedback."

## Clarifications

### Session 2026-04-03

- Q: What is the main layout structure? → A: Two vertical panels — editor on the left, results table on the right. AI explanation appears as a collapsible panel below the editor.
- Q: How to handle destructive schema operations and data recovery? → A: Block DROP/ALTER with a friendly message. Provide a visible "Reset Database" button so users can restore all data to the initial state at any time.
- Q: How are Characters and Teams related for JOIN practice? → A: A bridge table `fan_clubs` connects characters to teams (e.g., "Yoda is a fan of Real Madrid"), enabling meaningful and fun JOIN queries.
- Q: In what language should AI explanations be generated? → A: Always in Spanish, as the target audience is Spanish-speaking beginners and non-technical profiles.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Instant Data Exploration (Priority: P1)

A beginner opens the application and immediately sees a pre-loaded SQL query (`SELECT * FROM ...`) with its results displayed in a table. Without any setup or configuration, the user can start exploring data from a fun, pre-loaded dataset (Star Wars characters and Champions League teams). The user modifies the query in the editor, and results update automatically after a short pause in typing.

**Why this priority**: This is the core value proposition. If the user can't see data instantly and interact with it reactively, nothing else matters. It delivers the "zero friction" promise from second one.

**Independent Test**: Can be fully tested by opening the app, verifying the initial query is pre-written, results are visible, editing the query, and confirming the table updates automatically.

**Acceptance Scenarios**:

1. **Given** the user opens the application for the first time, **When** the page loads, **Then** a default query `SELECT * FROM characters` is pre-filled in the editor and results are displayed in the table immediately.
2. **Given** the user is viewing the editor, **When** they modify the query to `SELECT name, team FROM characters`, **Then** after a brief pause in typing, the results table updates to show only the requested columns.
3. **Given** the user types an incomplete query, **When** they are still actively typing, **Then** the system waits until they pause before executing to avoid unnecessary errors.
4. **Given** the in-memory database is loaded, **When** the user queries any available table, **Then** the results display correctly with all rows and columns.

---

### User Story 2 - Visual Feedback for SQL Operations (Priority: P2)

When a user executes different types of SQL operations, the results table provides visual animations that illustrate what the operation did. DELETE operations show fading rows, JOIN operations highlight data combination with colored blocks, and SELECT operations highlight the selected columns. This helps the user understand the impact of their commands intuitively.

**Why this priority**: Visual feedback is the key differentiator that transforms a plain SQL tool into a learning experience. It directly addresses the user story of "understanding the impact of commands without fear."

**Independent Test**: Can be tested by executing DELETE, JOIN, and SELECT queries independently and verifying each animation triggers correctly.

**Acceptance Scenarios**:

1. **Given** the user runs `DELETE FROM characters WHERE id = 1`, **When** the operation completes, **Then** the affected row fades out smoothly before being removed from the table.
2. **Given** the user runs a `JOIN` query between two tables, **When** the results appear, **Then** columns from each source table are visually distinguished with different color blocks.
3. **Given** the user runs `SELECT name, team FROM characters`, **When** the results display, **Then** the selected columns are highlighted/emphasized compared to any previously visible columns.
4. **Given** the user runs a query that returns no affected rows, **When** the operation completes, **Then** the system provides clear visual feedback that nothing changed.

---

### User Story 3 - AI-Powered Query Explanation (Priority: P3)

A user who doesn't fully understand SQL can press "The Human Button" to get a plain-language explanation of what their query does or what went wrong. For syntax errors, the assistant explains the mistake in friendly, non-technical language. For successful complex queries, it explains the result in simple terms.

**Why this priority**: This feature serves users who are completely new to SQL (like marketing profiles). While extremely valuable for accessibility, the playground is still usable without it for users who have basic SQL knowledge.

**Independent Test**: Can be tested by writing a valid complex query and pressing the button to get an explanation, then writing an invalid query and pressing the button to get error guidance.

**Acceptance Scenarios**:

1. **Given** the user has written a valid complex query (e.g., a JOIN with WHERE clause), **When** they press "The Human Button", **Then** the system displays a plain-language explanation of what the query does and what the results mean.
2. **Given** the user has written a query with a syntax error, **When** they press "The Human Button", **Then** the system explains the error in friendly language and suggests how to fix it.
3. **Given** the user presses "The Human Button" with an empty editor, **When** the button is pressed, **Then** the system provides a helpful prompt suggesting a starting query.
4. **Given** the AI explanation is loading, **When** the user waits, **Then** a clear loading indicator is shown so the user knows the system is working.

---

### Edge Cases

- What happens when the user writes a query that would drop or alter the schema of the in-memory database? The system blocks DROP TABLE, ALTER TABLE and similar schema-destructive operations, displaying a friendly message explaining why. A visible "Reset Database" button is always available to restore all data to the initial state.
- How does the system handle very large result sets from queries without LIMIT? The results table should paginate or cap displayed rows with a clear message.
- What happens when the user rapidly types and deletes, triggering many execution attempts? The debounce mechanism should cancel pending executions and only run the latest query.
- What happens if the AI explanation service is temporarily unavailable? A friendly fallback message should be displayed instead of a technical error.
- What happens when the user refreshes the page? The database should reset to its initial state with the default query pre-loaded.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST load an in-memory SQL database with a pre-configured fun dataset containing three tables: `characters` (Star Wars), `teams` (Champions League), and `fan_clubs` (bridge table connecting characters to teams) on application start without any user configuration.
- **FR-002**: System MUST pre-fill the SQL editor with a default query (`SELECT * FROM characters`) and display its results automatically on first load.
- **FR-003**: System MUST provide a reactive SQL editor that automatically executes queries after the user stops typing (debounce behavior).
- **FR-004**: System MUST display query results in a dynamic table that updates in real-time as queries are executed.
- **FR-005**: System MUST animate deleted rows with a fade-out effect when a DELETE operation is executed.
- **FR-006**: System MUST visually distinguish columns from different source tables using color blocks when a JOIN operation is executed.
- **FR-007**: System MUST highlight/emphasize the selected columns in the results table when a SELECT query specifies particular columns.
- **FR-008**: System MUST provide "The Human Button" that triggers an AI-powered plain-language explanation in Spanish of the current query or its errors.
- **FR-009**: System MUST display SQL syntax errors in a user-friendly format, distinguishing them from successful query results.
- **FR-010**: System MUST reset the in-memory database to its initial state when the user refreshes the page.
- **FR-011**: System MUST block destructive schema operations (DROP TABLE, ALTER TABLE) and display a friendly message explaining why they are not allowed.
- **FR-012**: System MUST support at least SELECT, INSERT, UPDATE, DELETE, and JOIN operations on the in-memory dataset.
- **FR-013**: System MUST present a two-panel vertical layout: SQL editor on the left, results table on the right. The AI explanation panel MUST appear as a collapsible section below the editor.
- **FR-014**: System MUST provide a visible "Reset Database" button that restores all data to the initial pre-loaded state at any time.

### Key Entities

- **Character**: Represents a Star Wars character with attributes such as name, affiliation, species, and homeworld.
- **Team**: Represents a Champions League football team with attributes such as name, country, league, and stadium.
- **Fan Club**: Bridge entity connecting characters to teams (e.g., "Yoda is a fan of Real Madrid"). Enables meaningful JOIN queries between the two main tables. Attributes: character reference, team reference, membership year.
- **Query**: Represents a user-written SQL statement. Has a type (SELECT, DELETE, JOIN, etc.), execution status (success/error), and result set.
- **Explanation**: Represents an AI-generated plain-language description of a query's behavior or error. Linked to a specific query.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can see data displayed on screen within 2 seconds of opening the application, with zero configuration required.
- **SC-002**: Query results update within 500 milliseconds after the user stops typing.
- **SC-003**: 90% of first-time users can successfully modify the default query and see updated results within their first minute of use.
- **SC-004**: Visual animations (fade-out for DELETE, color blocks for JOIN, highlight for SELECT) are clearly distinguishable and complete within 400 milliseconds.
- **SC-005**: AI explanations are written in Spanish at a reading level accessible to non-technical users (no jargon, plain language).
- **SC-006**: The application functions entirely in the browser with no backend server or database setup required by the user.

## Assumptions

- Users have a modern web browser (Chrome, Firefox, Safari, Edge — latest 2 versions).
- The in-memory database is ephemeral — data resets on page refresh and is not persisted between sessions.
- The pre-loaded dataset is small enough to fit comfortably in browser memory (hundreds of rows, not thousands).
- "The Human Button" relies on an external AI service; the core playground functionality (editor + table + animations) works independently of it.
- Mobile support is not a priority for v1; the layout is optimized for desktop/laptop screens.
- The application is a single-page experience with no authentication, accounts, or multi-user features.
