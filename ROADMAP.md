# Scope Labs Take-Home Roadmap

## 1. Product Goal

Build a small educational video application that feels fast, clear, and calm. A user can browse their video library, open a lesson, watch it with complete playback controls, add a video, and join the lesson discussion.

The working product name is **Scope Learn**. The product will use a modern, minimal visual system. The video and its learning context will stay at the center of each screen.

## 2. Success Criteria

The first release is complete when a reviewer can:

- See all videos for the configured assessment user.
- Select a video and open a stable watch URL.
- Play, pause, seek, change volume, mute, change playback speed, and enter full screen.
- Create a video with a title, description, and valid video URL.
- See comments for the selected video.
- Add a comment with a display name.
- Use the main flows with a keyboard and on a small screen.
- See useful loading, empty, success, and error states.
- Follow the README to install, run, test, and build the app with Bun.

## 3. Confirmed API Contract

Base URL: `https://take-home-assessment-423502.uc.r.appspot.com/api`

| Method | Path | Purpose | Input |
| --- | --- | --- | --- |
| `GET` | `/videos?user_id={user_id}` | Get one user's videos | Required `user_id` query value |
| `GET` | `/videos/single?video_id={video_id}` | Get one video | Required `video_id` query value |
| `POST` | `/videos` | Create a video | `user_id`, `title`, `description`, `video_url` |
| `PUT` | `/videos` | Edit a video | `video_id`, `title`, `description` |
| `GET` | `/videos/comments?video_id={video_id}` | Get video comments | Required `video_id` query value |
| `POST` | `/videos/comments` | Create a comment | `video_id`, `content`, `user_id` |

The API documentation describes successful responses as strings. A read-only check confirmed that the video list has the shape `{ "videos": [] }` when it is empty. Phase 1 will record all real response shapes before UI work begins. The API adapter will normalize these responses so that API details do not enter UI components.

The assessment user ID will be a public build-time value in snake case. The app will read it from `VITE_USER_ID`. It must contain the candidate's first and last name, for example `john_smith`.

## 4. Final Stack

### Core

- **React + TypeScript + Vite:** A small client application does not need a server framework. Vite gives a simple build and development setup.
- **Bun:** Package manager and command runner. The repository will commit `bun.lock`.
- **React Router:** Stable URLs such as `/` and `/watch/:videoId` make selection, refresh, and browser navigation work correctly.
- **TanStack Query:** It will own API cache, loading state, error state, request retry rules, and cache updates after writes.

### Forms and UI

- **React Hook Form + Zod:** Shared input rules for video and comment forms.
- **Tailwind CSS:** A small token-based design system with responsive utility styles.
- **Lucide React:** One consistent icon set.
- **Native HTML video controls plus a focused custom control layer:** The player will use the browser media and Fullscreen APIs. The custom layer will expose clear speed and volume controls.

### Quality

- **Vitest + React Testing Library:** Unit and component tests.
- **Mock Service Worker:** Deterministic API success, empty, slow, and error cases.
- **Playwright:** A small end-to-end suite for the critical user paths.
- **ESLint + Prettier:** Static checks and stable formatting.

No global client state library is planned. Server data belongs in TanStack Query. The route owns video selection. Forms and player controls keep local state.

## 5. User Experience Plan

### Information Architecture

- `/` — Video library with a compact product header, a short learning prompt, the video grid, and an **Add video** action.
- `/watch/:videoId` — Video player, lesson title and description, video navigation, and discussion.
- A modal or side sheet — New video form. It keeps the current page visible and returns the user to the new lesson after success.

A separate marketing splash page is not part of the first release. The library will provide a small branded introduction without adding a step before the core task.

### Desktop Layout

- A narrow header contains the brand, library link, and primary action.
- The library uses a clear grid with large video previews, title, short description, and a visible play action.
- The watch page uses a large player column and a discussion panel. Related library items stay easy to reach.

### Mobile Layout

- The player comes first.
- Lesson details and discussion follow in one column.
- Main actions have touch targets of at least 44 by 44 CSS pixels.
- The new video form uses a full-height sheet.

### Visual Direction

- Warm off-white surfaces, near-black text, one restrained indigo accent, and a soft green success color.
- Clear type hierarchy with generous space and short line lengths.
- Subtle borders and shadows. Motion will explain state change and will respect reduced-motion settings.
- Video preview art will use deterministic color fields and title initials when a reliable thumbnail is not available.

### Important States

- Skeletons for the first library and lesson load.
- A useful first-video empty state.
- Inline retry actions for API failures.
- Clear URL and required-field errors before form submission.
- Disabled submit actions while a write is in progress.
- Success feedback after a video or comment is created.
- A player error panel for an unsupported or unreachable video URL.

## 6. Architecture

Planned source structure:

```text
src/
  app/             # Router, providers, app shell
  components/      # Shared UI primitives
  features/
    comments/      # Comment list, form, queries
    player/        # Media adapter and player controls
    videos/        # Library, watch view, create form, queries
  lib/
    api/           # HTTP client, endpoints, response normalization
    config/        # Validated public environment values
    validation/    # Shared Zod schemas
  styles/          # Design tokens and global styles
  test/            # Test setup, server, and fixtures
```

### Data Rules

- Define TypeScript types at the API boundary.
- Parse unknown JSON before components use it.
- Use one query-key factory for videos and comments.
- Invalidate the video list after video creation.
- Add a successful comment to the comment cache or invalidate that video's comments.
- Use `AbortSignal` from TanStack Query in fetch calls.
- Show useful messages for network, validation, and unexpected response errors.

### Player Rules

- Support direct browser-playable media URLs first, including MP4 and WebM.
- Keep provider detection behind a media adapter so YouTube support can be added without changes to the watch page.
- Expose speed choices of 0.5, 0.75, 1, 1.25, 1.5, and 2 times.
- Expose volume, mute, seek, elapsed time, duration, play or pause, and full screen.
- Support Space or K for play and pause, M for mute, arrow keys for seek or volume, and F for full screen when the player has focus.
- Use the native video element as the source of truth for player time and state.

## 7. Delivery Phases and Commits

Each phase must end in a working state. Commit names can change when the exact work is known, but each commit must have one purpose.

### Phase 0 — Plan and Repository

- [x] Inspect the API documentation.
- [x] Confirm the local Bun runtime.
- [x] Select the stack and application structure.
- [x] Write this roadmap.
- [ ] Set the candidate `VITE_USER_ID` before API write tests.

Planned commit:

1. `docs: add implementation roadmap`

### Phase 1 — Foundation and API Contract

- [ ] Create the Vite React TypeScript app with Bun.
- [ ] Add router, query provider, global styles, lint, format, and test setup.
- [ ] Add `.env.example` with `VITE_API_BASE_URL` and `VITE_USER_ID`.
- [ ] Probe each API operation with disposable test data and record real response fixtures.
- [ ] Implement the typed API client and response normalization.
- [ ] Add unit tests for response parsing and errors.

Planned commits:

1. `chore: scaffold the React application`
2. `feat: add the typed video API client`

### Phase 2 — App Shell and Video Library

- [ ] Build the responsive shell and design tokens.
- [ ] Load the configured user's videos.
- [ ] Build video cards and deterministic preview art.
- [ ] Add loading, empty, and error states.
- [ ] Add route-based video selection.
- [ ] Test library states and keyboard navigation.

Planned commit:

1. `feat: add the responsive video library`

### Phase 3 — Watch Experience

- [ ] Build the lesson page and direct-media player.
- [ ] Add seek, play, pause, volume, mute, speed, and full-screen controls.
- [ ] Add player keyboard commands and visible focus states.
- [ ] Add unsupported-media and playback error states.
- [ ] Test player state logic and the main controls.

Planned commit:

1. `feat: add the accessible lesson player`

### Phase 4 — Create Video Flow

- [ ] Build the responsive modal or sheet.
- [ ] Validate title, description, and URL.
- [ ] Submit with the configured assessment user ID.
- [ ] Update the library cache and open the created video.
- [ ] Add pending, success, and server error feedback.
- [ ] Test form validation and submission.

Planned commit:

1. `feat: add video creation`

### Phase 5 — Comments

- [ ] Load comments only for the selected video.
- [ ] Build readable comment items with generated avatars.
- [ ] Add display-name and comment fields.
- [ ] Update comments after a successful write.
- [ ] Add empty, pending, and error states.
- [ ] Test comment load and submission.

Planned commit:

1. `feat: add lesson discussions`

### Phase 6 — Quality and Submission

- [ ] Test the full app at mobile, tablet, and desktop widths.
- [ ] Check keyboard use, focus order, contrast, labels, and reduced motion.
- [ ] Test slow network, offline, empty, validation, API error, and invalid media cases.
- [ ] Run type checks, lint, unit tests, end-to-end tests, and the production build.
- [ ] Remove development logs and confirm that no secret is in the client bundle.
- [ ] Write the final README with setup, architecture, choices, trade-offs, and test steps.
- [ ] Capture desktop and mobile screenshots and add them to the README.

Planned commits:

1. `test: cover critical user paths`
2. `docs: add submission guide and screenshots`
3. `chore: prepare the production submission`

## 8. Test Matrix

| Area | Main checks |
| --- | --- |
| API adapter | Valid data, empty data, malformed data, 4xx, 5xx, network failure, abort |
| Library | Loading, empty, populated, retry, selection, responsive grid |
| Player | Load, play, pause, seek, speed, volume, mute, full screen, keyboard, media error |
| Video form | Required fields, invalid URL, duplicate submit guard, success, server error |
| Comments | Loading, empty, populated, validation, write success, write failure |
| Accessibility | Landmark order, labels, focus, keyboard access, contrast, reduced motion |
| End to end | Open lesson, create video, create comment, refresh a deep link |

## 9. Scope Control

### Required for Submission

- Video list and selection.
- Video creation.
- Comment list and creation.
- Full playback controls, speed, volume, and full screen.
- Responsive and accessible states.
- Tests, README, and screenshots.

### Optional After the Required Work Is Stable

- YouTube provider adapter.
- Edit video title and description with the available `PUT /videos` operation.
- Search and sort for a large library.
- Saved volume and speed preferences.
- A small page transition or player entrance motion.

### Not Planned

- Authentication or account management.
- Video file upload or storage.
- Likes, follows, playlists, or analytics.
- A separate marketing site.
- A custom backend or proxy unless browser CORS rules make it necessary.

## 10. Known Risks and Responses

| Risk | Response |
| --- | --- |
| API response documentation is incomplete | Record real fixtures and normalize all unknown data at the API boundary. |
| The API list is filtered by one user ID | Make the required candidate ID a validated environment value. |
| A URL is not direct playable media | Show a useful error; keep provider support behind an adapter; add YouTube only after core work is stable. |
| The remote API is slow or unavailable | Show skeletons, bounded retry behavior, clear errors, and manual retry. Use mocks for deterministic tests. |
| Full-screen APIs differ by browser | Use the standard Fullscreen API with a clear fallback and test in Chromium and WebKit. |
| Visual polish can expand the task | Complete one simple design system and all required states before optional motion or provider work. |

## 11. Definition of Done for Every Phase

- The app builds and the changed flow works.
- Types, lint, and related tests pass.
- Loading, empty, error, and success states are complete where applicable.
- Keyboard and small-screen use are checked.
- The commit has one clear purpose and does not include unrelated files.
- This roadmap is updated when a decision or scope item changes.
