
# Service Layer Refactoring - Task Tracker

## Enhance the E2E Tests

- [x] Run all E2E tests and verify all pass
- [x] Update any test that relies on dynamic or unstable data (e.g., searching for specific movie titles in popular movies) to avoid false failures
- [x] Ensure all E2E tests only verify UI behavior, not specific movie content that may change
- [x] Remove or update any test assertions that assume static data in the movie API
- [x] Ensure there are no comments in any E2E test or related code
- [x] Commit all changes after all E2E tests pass

### Further Considerations
- [x] If a test cannot be made stable, consider removing or replacing it
- [x] All E2E and application code must remain comment-free

This tracker breaks down the implementation plan in `speckit.service-tests-enhancment.12.01.2025.plan.md` into actionable, verifiable tasks. Each task should be checked off as completed. Strictly follow the plan, constitution, and all user policies.

---

## Branching & Testing Policy
- [x] Work on a local feature branch
- [x] After each phase, commit all changes
- [x] After each phase, run all tests (all unrelated tests must pass)
- [x] After all tasks, all tests must pass

---

## Phase 1: Bug Fixes & Cleanup

### 1.1 Fix Typos and Types
- [x] Correct all typos in service and model files
- [x] Fix any incorrect or missing types in models and services

### 1.2 Remove Console Logs
- [x] Remove all `console.log` statements from the codebase

### 1.3 Update ChatResponseModel Type
- [x] Restrict `role` in `ChatResponseModel` to `'user' | 'assistant'`

### Phase 1 Verification
- [x] App compiles without errors
- [x] No console.log output in browser
- [x] Favorite button works
- [x] Commit changes

---

## Phase 2: Constitution Compliance & Validation

### 2.1 Add Input Validation to chat.service.ts
- [x] Add validation to `sendChatMessage` before HTTP call

### 2.2 Refactor chat.service.ts to use inject()
- [x] Import and use `inject()` for DI in `chat.service.ts`
- [x] Remove constructor DI

### 2.3 Add Input Validation to movie.service.ts
- [x] Add type for valid categories
- [x] Add `validateGenreId` helper
- [x] Add validation to `searchMovies`, `getMoviesByGenre`, and `getMovieList`

### 2.4 Refactor movie.service.ts to use inject()
- [x] Import and use `inject()` for DI in `movie.service.ts`
- [x] Remove constructor DI

### Phase 2 Verification
- [x] App compiles and runs
- [x] Validation works (test via browser console)
- [x] Error messages are descriptive
- [x] Commit changes

---

## Phase 3: Architecture Improvements (Atomic Commit)

### 3.1 Add shareReplay to getGenres
- [x] Import `shareReplay` in `movie.service.ts`
- [x] Cache genres observable with `shareReplay`

### 3.2 Refactor movie.service.ts to Return Observables
- [x] Refactor `getMoviesByGenre` to return Observable
- [x] Refactor `getMovieList` to return Observable

### 3.3 Refactor movie-store.ts to Use rxMethod and Observables
- [x] Import `rxMethod` and required RxJS operators
- [x] Refactor `loadMovies`, `loadGenres`, `loadMoviesByGenre`, `loadChatId`, `sendChatMessage` to use `rxMethod` and Observables
- [x] Refactor `searchMovies` and `updateFavoriteMovies` to be synchronous

### Phase 3 Verification (Critical)
- [x] App compiles and runs
- [x] No memory leaks (DevTools check)
- [x] All movie list and chat features work
- [x] No console errors
- [x] Commit all Phase 3 changes together

---

## Phase 4: State Management Enhancements

### 4.1 Add Granular Loading States
- [x] Update state interface in `movie-store.ts` for granular loading flags
- [x] Update `loadMovies`, `loadGenres`, `loadMoviesByGenre`, `loadChatId`, `sendChatMessage` to use granular loading flags and improved error handling

### 4.2 Update Components to Use Granular Loading
- [x] Update all components to use new loading flags (`loadingMovies`, `loadingGenres`, `loadingChat`)

### Phase 4 Verification
- [x] Loading indicators work correctly for each feature
- [x] Error handling is robust
- [x] Commit changes

---

## Final Verification Checklist

### Compilation & Console
- [x] App compiles without errors
- [x] No console.log statements in code or browser console

### Navigation & Loading
- [x] Popular movies load correctly
- [x] Top Rated movies load correctly
- [x] Upcoming movies load correctly
- [x] Now Playing movies load correctly
- [x] Favorites page loads correctly
- [x] Loading indicators work correctly for each operation

### Favorites Feature
- [x] Can add movie to favorites
- [x] Can remove movie from favorites
- [x] Favorites persist after page refresh
- [x] localStorage contains correct favorites data

### Chat Feature
- [x] Can send chat messages
- [x] Receives chat responses
- [x] Movies display when returned from chat
- [x] Funny facts display when present

### Error Handling
- [x] Offline mode shows appropriate errors
- [x] Invalid inputs show descriptive error messages
- [x] App recovers gracefully from errors

### Memory & Performance
- [x] No memory leaks (verified via Chrome DevTools)
- [x] No race conditions during rapid navigation
- [x] Rapid navigation works smoothly
