# AI Astrologer — Composable Conversation Experience

A React Native + TypeScript chat screen that renders extensible recommendation
experiences over a conversation timeline. The focus is architecture: a
**normalized, offline-first store** where reacting to one message re-renders only
that message, experiences that plug in **by registration**, and persistence
**scoped per conversation** so it scales past the single screen it ships with.

## Project structure

Feature-first: everything for the conversation lives under one folder; shared
concerns sit at the top level.

```
src/
  types/ enums/ data/seed.ts        # domain model, enums, normalized seed
  controllers/                      # ConversationController, AsyncStorage, mock API
  reducers/ store/                  # normalized redux slice + singleton store bridge
  features/conversation/            # screen + timeline / messages / recommendations / composer / actions / states
  common/ui/                        # design system (Text, Card, Button, Divider, BottomSheet, Chip…)
  context/ navigation/ constants/ utils/
```

## Component architecture

- **Container vs. presentational.** The screen and the singleton controller hold
  orchestration; components stay declarative. Components never call the API or
  dispatch directly.
- **Registry-driven renderers.** Author `type` → bubble component
  ([`messageRegistry`](src/features/conversation/components/messages/messageRegistry.ts))
  and recommendation `type` → card descriptor. New types plug in by registration;
  the timeline never changes.
- **Composition over props sprawl.** A shared `ChatBubble` handles alignment,
  header, reply strip and "extras"; each author renderer supplies only its
  differences.
- **Atomic UI primitives.** Generic, domain-free pieces live in `common/ui`
  (`Text`, `Card`, `Button`, `Divider`, `BottomSheet`, `Chip`); feature
  components compose them.
- **Self-subscribing rows.** Each [`MessageRow`](src/features/conversation/components/messages/MessageRow.tsx)
  reads only its own message from the store (see Performance).

## State management approach

Plain `redux` (no RTK/reselect) with one normalized `conversationReducer` slice.
Content and order are separate references, so a message can change in place
without disturbing the list.

```ts
ConversationState {
  loadStatus; usersById; conversationsById; activeConversationId;
  messagesById: Record<id, Message>;   // content (the hashMap)
  messageOrder: string[];              // order (the queue)
}
```

- A [singleton bridge](src/store/commonStore.ts) lets the
  [`ConversationController`](src/controllers/ConversationController.ts) dispatch
  and read state outside the React tree — it is the only place that mutates
  (send/deliver/retry/delete, reactions, hydrate, persist).
- The UI only **subscribes** (via `useSelector`), which keeps a single choke
  point where throttling/batching could be added later.
- Full domain types (`Conversation`, `Message`, `Reaction`, `User`,
  `Recommendation`) live in [`src/types/conversation.d.ts`](src/types/conversation.d.ts).

## Recommendation rendering strategy

Each AI message carries `recommendations[]`, rendered in a carousel. A
[registry](src/features/conversation/components/recommendations/recommendationRegistry.tsx)
maps a recommendation `type` → descriptor (icon, accent, CTA, optional custom
`renderBody`), with:

- a **fallback** descriptor for unknown types — so a future backend experience
  renders before its dedicated renderer ships (`type` is `enum | (string & {})`);
- a **runtime** `registerRecommendation(type, descriptor)` to add experiences
  without editing the registry.

## Performance considerations

The goal: reacting to one message must not re-render the list.

1. Normalized store — separate refs for content and order.
2. `PATCH_MESSAGE`/`ADD_REACTION`/`REMOVE_REACTION` return the **same
   `messageOrder` reference** and replace one entry, so list subscribers bail out
   (react-redux `===`).
3. Rows are `React.memo` and `useSelector(messagesById[id])` — only the changed
   row re-renders.
4. The timeline skeleton (date separators + grouping) is memoized on
   `messageOrder` alone, since grouping reads only immutable fields.
5. Reply previews use primitive selectors; the screen uses narrow selectors +
   `useCallback` handlers; the list is virtualized with `@shopify/flash-list`.
6. Persistence is **per conversation** (`conversation:messages:<id>` + a small
   shared index), so a write to one conversation never rewrites another.

## Trade-offs made due to time constraints

- **No automated tests** — verification was type-check + lint + manual runs.
- **Mock backend.** Sends simulate latency/failure; reactions have no server, so
  optimistic writes are authoritative (the roll-back-on-failure path is described
  but not wired).
- **Single active conversation in memory.** Persistence is already per
  conversation, but the store holds one active conversation's messages;
  conversation switching (loading another blob into state) and any list UI aren't
  built.
- **Feedback folded into reactions** (like/dislike as reaction types, reasons as
  `comments`) — pragmatic, slightly overloads the reaction concept.
- **`moment` + relative date labels** — "Today"/"Yesterday" can go stale across midnight without a new dispatch.

## Architectural trade-offs vs. a realtime chatbot

This is built as a **client-authoritative, request/response** app. A realtime
chatbot would reshape several seams:

- **Transport.** `fetchConversation`/`sendMessage` are one-shot calls. Realtime
  needs a persistent WebSocket/SSE connection with reconnect/backoff, an outbound
  offline queue, and connection-state UI.
- **Streaming replies.** The AI reply lands as one whole `ADD_MESSAGE`. A chatbot
  streams tokens — you'd append deltas via frequent `PATCH_MESSAGE`, which makes
  the per-message granular re-render (and the "subscribe-only" seam for
  throttling token bursts) load-bearing rather than a nicety.
- **Source of truth.** Here optimistic writes are final. Realtime is
  server-authoritative: the optimistic send must reconcile against the server's
  echo by `clientRequestId` and roll back on failure (the id exists; the path
  isn't wired).
- **Ordering & dedup.** A single client appends in insertion order. Realtime
  needs server sequence numbers/timestamps to order across senders and to dedup
  on reconnect — `messageOrder` would be derived from server order, not append
  order.
- **Presence & receipts.** No typing indicators, presence, read receipts, or
  delivery acks — all push-driven state a realtime app must model and merge.
- **History & sync scale.** The whole conversation sits in memory and one
  AsyncStorage blob per conversation. Realtime needs paginated/windowed history
  with cursors, incremental sync, eviction, and multi-device convergence
  (last-write-wins / CRDT for reactions) instead of local-only persistence.

## Simulating states

In [`mockConversationApi.ts`](src/controllers/apis/mockConversationApi.ts):
`SIMULATE_INITIAL_LOAD_FAILURE` (error/retry) and `SEND_FAILURE_RATE` (default `0.25`).

## Run

```sh
npm start
npm run ios
npm run android
```
