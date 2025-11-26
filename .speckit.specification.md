# Service Layer Enhancement & Bug Fixes - Specification

## Overview
Comprehensive refactoring of three core services to fix critical bugs, eliminate anti-patterns, and ensure compliance with project constitution and Angular best practices.

## Services in Scope
- `chat.service.ts` - Chat/AI integration service
- `movie.service.ts` - TMDB movie API service  
- `movie-store.ts` - NgRx signal store for state management

## Clarifications & Important Notes

### Scope of Changes
1. **Breaking Changes Expected**: RX-2.2 will require updating `movie-store.ts` to subscribe to returned Observables
2. **Call Sites to Update**: 
   - `movie-list.component.ts` (line 30) - calls `store.updateFavoriteMovies()`
   - `movie-store.ts` (lines 39, 69, 96) - calls `movieService` methods
3. **Type Update Required**: `ChatResponseModel.role` should be `'user' | 'assistant'` not `string`

### Implementation Details

#### chat.service.ts - Type Safety
- **CF-1.2**: Current return type is `Observable<{ messages: ChatResponseModel[] }>` but should be `Observable<{ funnyFact?: string; messages: ChatResponseModel[] }>` to match actual API response and usage in `movie-store.ts` line 120
- **CF-1.3**: Create interface for API response:
  ```typescript
  interface ChatApiResponse {
    funnyFact?: string;
    messages: {
      role: 'user' | 'assistant';
      text: string;
      movieList?: ChatbotMovieModel[] | null;
    }[];
  }
  ```
- **VE-1.1**: Validation should throw Error with message like `'Chat ID is required'` if empty/null
- **VE-1.2**: Validation should throw Error with message like `'Message cannot be empty'` if invalid

#### movie.service.ts - RxJS Pattern Change
- **RX-2.2**: This is a MAJOR change requiring refactoring:
  - Current: `getMovieList()` and `getMoviesByGenre()` return `void` and internally call `moviesSubject$.next()`
  - New: Should return `Observable<TmdbMovieModel[]>` and NOT manage subscriptions
  - Consequence: `movie-store.ts` must be updated to subscribe to these Observables properly
  - The `movies$` observable should still exist for filtering/searching, but data loading becomes consumer responsibility

- **SM-2.1 & SM-2.2**: localStorage implementation:
  - Key: `'movie-tracker-favorites'`
  - Save: `localStorage.setItem('movie-tracker-favorites', JSON.stringify(this.favoriteMovies))`
  - Load: Wrap in try-catch, default to `[]` if JSON.parse fails or key doesn't exist
  - Initialize in constructor or use initialization pattern with `inject()`

- **VE-2.2**: Valid categories from TMDB API:
  - `'popular'` - endpoint: `/3/movie/popular`
  - `'top_rated'` - endpoint: `/3/movie/top_rated`
  - `'upcoming'` - endpoint: `/3/movie/upcoming`
  - `'now_playing'` - endpoint: `/3/movie/now_playing`
  - `'favorite'` - special case, handled locally
  - Error message format: `"Invalid category: {value}. Expected: popular, top_rated, upcoming, now_playing, or favorite"`

#### movie-store.ts - Anti-pattern Elimination
- **CF-3.1**: The problem explained:
  ```typescript
  // WRONG (current code):
  async loadMovies(): Promise<void> {
    await movieService.movies$.subscribe(...)  // await on subscription!
  }
  
  // CORRECT:
  loadMovies(): void {
    movieService.movies$.subscribe(...)  // no async/await
  }
  
  // BETTER (with rxMethod):
  loadMovies: rxMethod<{category: string, page: number}>((params$) => 
    params$.pipe(
      switchMap(({category, page}) => movieService.getMovieList(category, page)),
      tap((movies) => patchState(store, { movies, loading: false })),
      catchError((error) => { /* handle */ })
    )
  )
  ```

- **CF-3.2**: Nested subscription example from current code (lines 39-49):
  ```typescript
  // WRONG:
  await movieService.getMovieList(category, page, sortBy);
  await movieService.movies$.subscribe({...})  // nested!
  
  // CORRECT (after RX-2.2 fix):
  movieService.getMovieList(category, page, sortBy).pipe(
    tap((movies) => patchState(store, { movies, loading: false })),
    catchError((error) => of(patchState(store, { error, loading: false })))
  ).subscribe()
  ```

- **CF-3.3**: Memory leak explanation:
  - Every `subscribe()` in movie-store creates subscription that's never unsubscribed
  - Solution 1: Use `rxMethod()` which auto-manages subscriptions
  - Solution 2: Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop`
  - Solution 3: Store subscriptions and cleanup in destroy hook (not recommended for signal stores)

- **SM-3.1**: Granular loading states:
  ```typescript
  const initialMovieState = {
    loadingMovies: false,
    loadingGenres: false,
    loadingChat: false,
    // ... other state
  }
  ```
  This prevents race condition where clicking "Popular" then immediately "Top Rated" shows wrong loading state.

- **TS-3.1**: Error type example:
  ```typescript
  interface ServiceError {
    message: string;
    code?: string;
    originalError?: unknown;
  }
  
  const initialMovieState = {
    error: null as ServiceError | null,
    // ...
  }
  ```

### Dependencies Between Changes

#### Phase 1 Dependencies
- None - all changes are independent
- Can be safely committed without breaking functionality

#### Phase 2 Dependencies  
- VE-1.1 and VE-1.2 should be implemented before changing to `inject()` to ensure validation logic is solid
- Validation changes can be committed separately from inject() refactoring

#### Phase 3 Dependencies (CRITICAL - SINGLE COMMIT REQUIRED)
- **⚠️ WARNING: These changes MUST be done in a single atomic commit**
- **Breaking intermediate state:** Fixing movie.service.ts alone will break movie-store.ts
- **Implementation order within the commit:**
  1. First: Fix RX-2.2 in `movie.service.ts` (return Observables instead of void)
  2. Second: Fix CF-3.1, CF-3.2, CF-3.3 in `movie-store.ts` (remove async/await, eliminate nested subscriptions)
  3. Third: Update method signatures to return `void` instead of `Promise<void>`
  4. Optional: Implement PI-3.1 (rxMethod enhancement)
- **Why single commit:** The service method signature change breaks all consumers immediately
- **Testing after commit:** Run app, verify no console errors, test all movie list views

#### Phase 4 Dependencies
- SM-3.1 (granular loading states) can be done independently
- TS-3.1 (error typing) should be done before EH-3.1 (error handling)
- SM-3.2 (localStorage in store) depends on SM-2.1 and SM-2.2 (localStorage in service) being complete

### Testing Strategy (Manual Verification)
Since this project uses E2E tests only, manual verification is required after each phase:

#### After Phase 1: Critical Bugs Fixed
**Compilation Check:**
- Run `npm start` - app should compile without TypeScript errors
- Check browser console - no runtime errors

**Verification Steps:**
1. Open app in browser
2. Navigate to Popular movies - should load without errors
3. Click favorite button - should work (typo fix verified)
4. Check browser console - no `console.log` statements should appear

---

#### After Phase 2: Constitution Compliance
**Validation Testing:**
1. Open browser DevTools Console
2. In Console, attempt invalid operations:
   ```javascript
   // Test validation (if exposed, otherwise test through UI)
   // Invalid category should throw descriptive error
   // Empty search should be handled gracefully
   ```
3. Verify error messages are descriptive and match format:
   - "Invalid category: {value}. Expected: popular, top_rated, upcoming, now_playing, or favorite"
   - "Chat ID is required"
   - "Message cannot be empty"

**Service Method Testing:**
1. Navigate to Popular movies page
2. Navigate to Top Rated movies page
3. Navigate to Upcoming movies page
4. Navigate to Now Playing movies page
5. Navigate to My Favorites page
6. Test chat functionality
7. Verify all pages load without errors

---

#### After Phase 3: Architecture Improvements (CRITICAL)
**⚠️ Memory Leak Detection (Chrome DevTools):**

1. **Open Memory Profiler:**
   - Press F12 → Performance tab → Memory
   - Or: Three-dot menu → More tools → Task Manager

2. **Baseline Measurement:**
   - Load app, wait 5 seconds
   - Take heap snapshot (click "Take snapshot")
   - Note memory usage

3. **Stress Test:**
   - Rapidly navigate: Popular → Top Rated → Upcoming → Now Playing → Favorites
   - Repeat 10 times quickly
   - Take another heap snapshot

4. **Memory Analysis:**
   - Compare snapshots
   - Look for "Detached DOM nodes" (should be minimal)
   - Memory should stabilize, not grow indefinitely
   - Click garbage collection icon (trash can), memory should drop

5. **Subscription Leak Check:**
   - In snapshot comparison, filter for "Subscription"
   - Should not see growing number of unsubscribed Subscriptions

**Race Condition Testing:**
1. Navigate to Popular movies
2. **Immediately** (within 1 second) navigate to Top Rated
3. Verify: Correct movies load (Top Rated, not Popular)
4. Check loading state: Should show/hide appropriately
5. Repeat with other combinations

**Chat Functionality:**
1. Open chat interface
2. Send message
3. Verify response appears
4. Check funnyFact displays if present
5. Verify movies display if returned

---

#### After Phase 4: State Management Enhancements
**localStorage Persistence Testing:**

1. **Setup:**
   - Open browser DevTools → Application tab → Local Storage
   - Clear all localStorage: Right-click → Clear
   - Refresh page

2. **Add Favorites:**
   - Navigate to Popular movies
   - Click favorite (star) on 3 different movies
   - In Application tab, verify `movie-tracker-favorites` key exists
   - Click on key, verify JSON array with 3 movies

3. **Persistence Test:**
   - With favorites added, refresh page (F5)
   - Navigate to My Favorites
   - Verify: All 3 favorited movies still appear
   - Check localStorage: Still contains same data

4. **Edge Cases:**
   - Manually corrupt localStorage (in DevTools, edit value to invalid JSON: `{broken}`)
   - Refresh page
   - App should not crash (fallback to empty array)
   - Try adding new favorite - should work

**Loading State Testing:**
1. Open browser DevTools → Network tab
2. Throttle network: Set to "Slow 3G"
3. Navigate to Popular movies - watch loading indicator
4. While loading, navigate to Top Rated
5. Verify: 
   - Each navigation shows appropriate loading state
   - No "flash" of wrong content
   - Loading states don't interfere with each other

**Error Handling:**
1. In Network tab, set offline mode
2. Try to load movies
3. Verify: Error state displays with meaningful message
4. Go back online
5. Retry - should work

---

### Manual Verification Checklist

After all phases complete, verify:

- [ ] App compiles without TypeScript errors
- [ ] No console.log statements in browser console
- [ ] All movie list pages load (Popular, Top Rated, Upcoming, Now Playing, Favorites)
- [ ] Favorite toggle works on all pages
- [ ] Favorites persist after page refresh
- [ ] Search functionality works
- [ ] Chat functionality works
- [ ] No memory leaks (verified with Chrome DevTools)
- [ ] No race conditions when rapidly navigating
- [ ] Error messages are descriptive and helpful
- [ ] Loading states work correctly
- [ ] localStorage inspection shows valid JSON
- [ ] App handles corrupted localStorage gracefully
- [ ] All navigation flows work smoothly

---

## What Needs to Change

### chat.service.ts

#### Critical Fixes
- [ ] **CF-1.1**: Use `inject()` function instead of constructor injection for HttpClient
- [ ] **CF-1.2**: Fix return type of `sendChatMessage` method to `Observable<{ funnyFact?: string; messages: ChatResponseModel[] }>`
- [ ] **CF-1.3**: Remove `any` types from `mapResponse` method - properly type the parameter and internal operations

#### Constitution Compliance
- [ ] All services must use `inject()` function per constitution

#### Type Safety
- [ ] **TS-1.1**: Add explicit return types to all public methods
- [ ] **TS-1.2**: Add explicit return types to all private methods

#### Validation & Error Handling
- [ ] **VE-1.1**: Validate chatId before making request (guard against empty/null)
- [ ] **VE-1.2**: Validate message before sending (guard against empty/whitespace, trim input)

---

### movie.service.ts

#### Critical Fixes
- [ ] **CF-2.1**: Use `inject()` function instead of constructor injection for HttpClient
- [ ] **CF-2.2**: Fix typo: `updateFavotie` → `updateFavorite` (update all call sites)
- [ ] **CF-2.3**: Remove console.log statement (line 68)
- [ ] **CF-2.4**: Use strict equality `===` instead of loose `==` (line 67)

#### Constitution Compliance
- [ ] All services must use `inject()` function per constitution

#### Type Safety
- [ ] **TS-2.1**: Add explicit return types to all methods

#### RxJS Improvements
- [ ] **RX-2.1**: Use `shareReplay(1)` for genre caching to prevent multiple API calls
- [ ] **RX-2.2**: Return Observables instead of void from data methods (`getMoviesByGenre`, `getMovieList`) - remove imperative subscription logic, let consumers subscribe

#### State Management
- [ ] **SM-2.1**: Persist favoriteMovies to localStorage on every update (key: `'movie-tracker-favorites'`)
- [ ] **SM-2.2**: Initialize favorites from localStorage on service initialization (handle invalid JSON gracefully)

#### Validation & Error Handling
- [ ] **VE-2.1**: Validate page numbers (must be positive integer)
- [ ] **VE-2.2**: Validate category parameter (only allow: 'popular', 'top_rated', 'favorite')
- [ ] **VE-2.3**: Validate genre ID (must be positive integer)
- [ ] **VE-2.4**: Guard against empty search queries

---

### movie-store.ts

#### Critical Fixes - Anti-patterns
- [ ] **CF-3.1**: Remove async/await with Observables - Observables are NOT Promises
  - Remove ALL `async` keywords from methods
  - Remove ALL `await` keywords before Observable subscriptions
- [ ] **CF-3.2**: Eliminate nested subscriptions - use RxJS operators (`switchMap`, `tap`, `catchError`)
- [ ] **CF-3.3**: Fix memory leaks from unsubscribed observables - use `takeUntilDestroyed()` or `rxMethod()` from @ngrx/signals
- [ ] **CF-3.4**: Remove console.log from onInit hook

#### Pattern Improvements
- [ ] **PI-3.1**: Use `rxMethod()` from `@ngrx/signals/rxjs-interop` for automatic subscription management
- [ ] **PI-3.2**: Use consistent reactive patterns - prefer fully reactive with proper operators

#### Type Safety
- [ ] **TS-3.1**: Properly type error state (create Error type or use Error class, not null)
- [ ] **TS-3.2**: Methods should return `void` (not `Promise<void>`)

#### State Management
- [ ] **SM-3.1**: Add loading states per operation type (`loadingMovies`, `loadingGenres`, `loadingChat`) to prevent race conditions
- [ ] **SM-3.2**: Persist favoriteMovies to localStorage (sync with MovieService)

#### Validation
- [ ] **VE-3.1**: Validate chatId before sending message (check if exists)
- [ ] **VE-3.2**: Validate search query (guard against empty strings, trim whitespace)
- [ ] **VE-3.3**: Validate parameters in all methods (delegate to service validation)

#### Error Handling
- [ ] **EH-3.1**: Handle errors with meaningful messages (typed error objects, user-friendly messages)

---

## Success Criteria Checklist

### Code Quality
- [ ] Zero `any` types in service layer
- [ ] All methods have explicit return types
- [ ] No console.log statements
- [ ] Strict equality (===) used throughout
- [ ] All typos fixed

### Architecture & Patterns
- [ ] All services use `inject()` function (no constructor injection)
- [ ] No async/await with Observables
- [ ] No nested subscriptions
- [ ] No memory leaks (all subscriptions managed)
- [ ] Consistent reactive patterns

### State Management
- [ ] Favorites persist to localStorage
- [ ] Favorites restore from localStorage on load
- [ ] Loading states prevent race conditions
- [ ] Error states properly typed and handled

### Validation
- [ ] All inputs validated (chatId, category, genre, page, search)
- [ ] Meaningful error messages
- [ ] Guards against edge cases

---

## Rollout Plan

### Phase 1: Fix Critical Bugs (No Breaking Changes)
1. Remove console.log statements
2. Fix typo: updateFavotie → updateFavorite
3. Fix loose equality: == → ===
4. Add return types where missing
5. Remove any types

### Phase 2: Constitution Compliance (Minor Breaking)
1. Refactor to inject() function
2. Add validation guards
3. Add error handling

### Phase 3: Architecture Improvements (Major Refactor)
1. Fix async/await anti-pattern
2. Eliminate nested subscriptions
3. Implement proper subscription management
4. Add localStorage persistence
5. Use rxMethod() for async operations

### Phase 4: State Management Enhancements
1. Add granular loading states
2. Improve error typing
3. Add cache management
