# AI Astrologer — Composable Conversation Experience

A React Native + TypeScript implementation of a modern AI conversation screen that
renders **dynamic, extensible recommendation experiences** alongside a chat timeline.

The emphasis is architecture: how new "conversation experiences" (recommendation
types, message author types) can be added **without touching the core rendering
pipeline**.

## Design principle: extend by registration, not modification

The app leans on one idea applied in two places — a **registry** that maps a
`type` string to a renderer/descriptor, with a **fallback** for unknown types and
a **runtime registration** seam. New experiences plug in by adding a registry
entry; the timeline, message and card components never change.

| Registry | Maps | Add a new… | File |
| --- | --- | --- | --- |
| Recommendation | `type` → descriptor (icon, accent, CTA, optional custom body) | recommendation experience | `features/conversation/components/recommendations/recommendationRegistry.tsx` |
| Message | author `type` → bubble component | message/author type | `features/conversation/components/messages/messageRegistry.ts` |

Unknown recommendation types fall back to a generic card, so the client can render
**future backend experiences before a dedicated renderer ships**.

## Project structure

```
src/
  features/conversation/          # the entire feature, self-contained
    types.ts                      # domain model (open-ended by design)
    data/seed.ts                  # initial mock payload (assignment schema, extended)
    api/mockConversationApi.ts    # simulated fetch/send (latency + failure flags)
    hooks/useConversation.ts      # selector for the conversation slice
    utils/clipboard.ts            # copy support
    screens/ConversationScreen.tsx
    components/
      timeline/                   # FlashList timeline, date separators, grouping
      messages/                   # ChatBubble + per-author renderers + registry
      recommendations/            # carousel + card + registry (the core)
      composer/                   # composer + reply preview
      actions/                    # long-press action sheet
      states/                     # loading / empty / error
    __tests__/                    # reducer, registry, timeline-builder unit tests
  reducers/                       # conversationReducer + action enums
  controllers/                    # ConversationController (singleton orchestrator)
  common/ui/                      # theme-aware design system (Text, Card, Button…)
  context/appContext.tsx          # theme provider (light/dark)
  store/ | navigation/ | constants/
```

### Architecture

- **State**: a single Redux store with a namespaced `conversationReducer` slice.
- **Controllers**: `ConversationController` is a singleton that owns all
  orchestration (API calls, optimistic updates, persistence) and dispatches into
  Redux — components stay declarative and never call the API directly.
- **Design system**: all UI is built from `src/common/ui` primitives and reads
  colors from `AppContext`, so the whole screen is theme-aware (toggle in the header).
- **Persistence**: `AsyncStorageController` persists settled messages under
  `conversation:messages`; only delivered messages are stored, so `sending`/`failed`
  drafts never rehydrate.

## Part A — Composable conversation

- **Timeline** (`ConversationTimeline`) — virtualized via `@shopify/flash-list`,
  with chat-native `maintainVisibleContentPosition` (render-from-bottom +
  auto-scroll) and a manual `scrollToEnd` guarantee on send.
- **Message types** — `user`, `ai`, `human`, `system`, each a registered renderer.
- **Date separators & grouping** — `timelineBuilder.ts` is a pure function that
  turns the message list into rows, inserting day separators and flagging the
  first/last message of each same-author group. Unit tested.
- **Recommendations** — an AI message renders a horizontal `RecommendationCarousel`
  of cards; each card is driven entirely by its type descriptor. Tapping a card
  shows an `Alert`.

## Part B — Production interactions

- **Long-press actions** — Reply / Copy / Delete via a bottom action sheet.
  Delete removes the message and updates state while preserving scroll position;
  Reply raises a preview strip above the composer.
- **AI feedback** — 👍 / 👎 per AI message; selecting 👎 expands reason chips
  (Inaccurate, Too Generic, Didn't Help, Too Long). All persisted to local state.
- **Sending** — messages are added optimistically (`sending`), the API delay is
  simulated, then reconciled to `sent` or `failed` with an inline **Retry**.
- **Loading / empty / error** — initial `Loading conversation…`, `Start your
  conversation.` empty state, and an `Unable to load conversation.` error with Retry.

## Simulating states

`features/conversation/api/mockConversationApi.ts`:

- `SIMULATE_INITIAL_LOAD_FAILURE` — set `true` to exercise the error/retry state.
- `SEND_FAILURE_RATE` — probability a sent message fails (default `0.25`), drives
  the Failed/Retry flow.

## Run

```sh
npm start
```

```sh
npm run ios
```

```sh
npm run android
```
