# AI Astrologer — Composable Conversation Experience

A React Native + TypeScript chat screen that renders **dynamic, extensible
recommendation experiences** alongside a conversation timeline.

The emphasis is architecture: a **normalized, offline-first store** where a
reaction to one message re-renders only that message, new "conversation
experiences" (recommendation / author types) plug in **by registration**, and
persistence is **scoped per conversation** so the design scales past the single
screen it ships with.

---

## Data model

The domain is fully normalized. Messages live in a hashMap keyed by
`messageId`, with a separate array giving their order — so a message can change
in place without disturbing the list. Types live in
[`src/types/conversation.d.ts`](src/types/conversation.d.ts); value sets are
enums in [`src/enums/conversation.ts`](src/enums/conversation.ts).

```ts
type Conversation = {
  conversationId: string;
  title?: string;
  participantIds: string[];        // userIds
  createdAt: number;
  updatedAt?: number;
};

type User = {                      // one stable identity per participant type
  userId: string;                  // SENDER_ID: 'system' | 'ai' | 'human' | 'local-user'
  authorType: MessageAuthorType;   // 'user' | 'ai' | 'human' | 'system'
  displayName: string;
  icon?: string;
};

type Message = {
  messageId: string;
  conversationId: string;          // every message is scoped to a conversation
  senderId: string;                // → resolves to a User in usersById
  clientRequestId?: string;        // idempotency key for optimistic sends
  type: MessageAuthorType;         // denormalized render hint (keeps grouping/registry simple)
  text: string;
  createdAt: number;
  status?: MessageDeliveryStatus;  // 'sending' | 'sent' | 'failed' (optimistic user msgs)
  reactions: Reaction[];           // like/dislike + comments, per user
  recommendations: Recommendation[];
  replyToMessageId?: string;       // resolved to a preview at render time
};

type Reaction = {
  messageId: string;
  userId: string;                  // who reacted
  reactionType: ReactionType;      // 'like' | 'dislike' | … (open-ended)
  comments: string[];              // e.g. the selected dislike reasons
  createdAt: number;
};

type Recommendation = {
  id: string;
  type: RecommendationType;        // known enum OR any string (extensibility seam)
  title: string;
  subtitle?: string;
  meta?: Record<string, unknown>;  // arbitrary payload for richer experiences
};
```

### Redux state shape

```ts
type ConversationState = {
  loadStatus: LOAD_STATUS;
  usersById: Record<string, User>;
  conversationsById: Record<string, Conversation>;
  activeConversationId: string | null;
  messagesById: Record<string, Message>;  // the hashMap
  messageOrder: string[];                  // chronological queue of messageIds
};
```

`messageOrder` is the single source of order; `messagesById` is the single
source of message content. This split is what makes granular re-renders possible
(see below).

---

## High-level architecture

Components never call the API or dispatch raw actions directly. All
orchestration funnels through a singleton **controller**; the UI only
**subscribes to the store**, which leaves room to add throttling/batching later
without touching components.

```
                ┌─────────────────────────────────────────────┐
                │                    UI (React)                 │
                │  ConversationScreen                           │
                │    • useSelector(loadStatus)                  │
                │    • useSelector(messageOrder.length)         │
                │  ConversationTimeline                         │
                │    • useSelector(messageOrder) ──► FlashList  │
                │  MessageRow  (one per id, React.memo)         │
                │    • useSelector(messagesById[id]) ◄── self-  │
                │      subscribes to ITS OWN message only       │
                └───────────────┬──────────────▲───────────────┘
                   calls methods │              │ subscribe (react-redux)
                                 ▼              │
                ┌─────────────────────────────────────────────┐
                │           ConversationController              │
                │  (singleton — the only place that mutates)    │
                │  sendMessage · deliver · retry · delete       │
                │  toggleReaction · toggleReason · hydrate      │
                └──────┬───────────────┬───────────────┬───────┘
                       │ dispatch      │ fetch/send    │ read/write
                       ▼               ▼               ▼
             ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
             │ Redux store  │  │ mock API     │  │ AsyncStorage     │
             │ (normalized) │  │ (latency +   │  │ index + per-     │
             │              │  │  failure)    │  │ conversation blob│
             └──────────────┘  └──────────────┘  └──────────────────┘
```

- **Store**: plain `redux` (no RTK/reselect), one `conversationReducer` slice.
  A [singleton bridge](src/store/commonStore.ts) lets the controller
  `dispatch`/`getState` outside the React tree.
- **Controller**: [`ConversationController`](src/controllers/ConversationController.ts)
  owns API calls, optimistic updates, reactions and persistence.
- **Persistence**: [`AsyncStorageController`](src/controllers/AsyncStorageController.ts)
  with a write-through in-memory cache.
- **Design system / theming**: UI is built from `src/common/ui` primitives that
  read colors from `AppContext` (light/dark toggle in the header).

---

## Re-rendering optimizations

The goal: reacting to one message must **not** re-render the whole list. The
decisions that get us there:

1. **Normalized store (`messagesById` + `messageOrder`).** Message content and
   message order are separate references.
2. **In-place updates keep `messageOrder` identity.** `PATCH_MESSAGE`,
   `ADD_REACTION` and `REMOVE_REACTION` return the **same** `messageOrder` array
   reference and replace only the one changed entry in `messagesById`
   ([`conversationReducer.ts`](src/reducers/conversationReducer.ts)). Anything
   subscribed to `messageOrder` therefore bails out of re-render
   (react-redux `===` check).
3. **Rows self-subscribe by id.** [`MessageRow`](src/features/conversation/components/messages/MessageRow.tsx)
   is `React.memo` and selects `messagesById[messageId]` — only the row whose
   message changed re-renders.
4. **Timeline skeleton memoized on `messageOrder` alone.** Date separators and
   grouping read only immutable fields (`createdAt`, `type`), so the skeleton is
   rebuilt only when messages are added/removed — never on a reaction
   ([`timelineBuilder.ts`](src/features/conversation/components/timeline/timelineBuilder.ts),
   [`ConversationTimeline.tsx`](src/features/conversation/components/timeline/ConversationTimeline.tsx)).
5. **Primitive selectors for derived data.** Reply previews select the target's
   `type`/`text` (primitives), so reacting to a replied-to message doesn't
   re-render the replying row.
6. **Narrow selectors + stable handlers.** The screen never selects the whole
   slice; long-press/retry/reaction handlers are `useCallback`-stable so
   memoized rows survive parent re-renders.
7. **UI subscribes to the store, not to props.** A single choke point (redux)
   means throttling/batching can be layered in later without component changes.

---

## Data flow: API → UI

Optimistic send, reconciled against the (mock) API:

```
Composer.onSend(text)
  → ConversationController.sendMessage(text, replyToMessageId?)
      • build optimistic Message { status: 'sending', clientRequestId, … }
      • ADD_MESSAGE  ──► reducer: messagesById[+id], messageOrder:[…, id]
      • deliver():
          mockConversationApi.sendMessage(text, conversationId)
            ├─ success → PATCH_MESSAGE(id, {status:'sent'})   (in place)
            │            ADD_MESSAGE(aiReply)                 (new row)
            │            persist(activeConversationId)
            └─ failure → PATCH_MESSAGE(id, {status:'failed'}) → inline Retry
```

How a change reaches the screen:

```
reducer updates messagesById / messageOrder
  → messageOrder changed?  yes → ConversationTimeline rebuilds skeleton → FlashList
                           no  → only the affected MessageRow (its useSelector) re-renders
  → renderItem picks a renderer via messageRegistry(message.type)
      user → UserMessage · ai → AIMessage · human → HumanMessage · system → SystemMessage
```

Launch/hydrate: `App` calls `ConversationController.hydrate()`, which reads the
persisted **index** (users + conversation records + active id), then lazy-loads
the **active conversation's** messages; if nothing is stored it falls back to
`loadInitial()` (seed via the mock API).

---

## Recommendation strategy — extend by registration, not modification

Each AI `Message` carries a `recommendations: Recommendation[]`. Presentation is
driven by a **registry** that maps a recommendation `type` → a descriptor
(icon, accent, CTA, optional custom body), with a **fallback** for unknown types
and a **runtime registration** seam
([`recommendationRegistry.tsx`](src/features/conversation/components/recommendations/recommendationRegistry.tsx)).

- An AI message renders a horizontal `RecommendationCarousel`; each
  `RecommendationCard` is themed entirely by its type descriptor.
- **Unknown types fall back** to a generic card — so the client can render a
  **future backend experience before its dedicated renderer ships**
  (`RecommendationType` is `enum | (string & {})`).
- A type can bring **richer UI** via a `renderBody` descriptor (see the `tarot`
  example), without touching the carousel or timeline.
- `registerRecommendation(type, descriptor)` adds an experience at runtime.

The same pattern maps author `type` → bubble component in the
[message registry](src/features/conversation/components/messages/messageRegistry.ts).

| Registry | Maps | Add a new… | File |
| --- | --- | --- | --- |
| Recommendation | `type` → descriptor | recommendation experience | `recommendations/recommendationRegistry.tsx` |
| Message | author `type` → bubble | message/author type | `messages/messageRegistry.ts` |

---

## Optimistic like / dislike (reactions)

Reactions supersede the old feedback model and are applied **optimistically** —
the store updates synchronously so the UI reflects the tap with zero latency,
then persists.

- **Instant, local first.** `toggleReaction(messageId, reactionType)` dispatches
  `ADD_REACTION` / `REMOVE_REACTION` immediately; the affected `MessageRow`
  re-renders on its own, nothing else does.
- **Like/dislike are mutually exclusive.** Setting 👍 clears 👎 (and vice
  versa); tapping the active one toggles it off.
- **Dislike reasons = comments.** Selecting 👎 expands reason chips (Inaccurate,
  Too Generic, Didn't Help, Too Long); each is stored as a string in that
  reaction's `comments[]` via `toggleReason`.
- **Reactions are per-user.** [`FeedbackBar`](src/features/conversation/components/messages/FeedbackBar.tsx)
  derives the viewer's state by filtering `message.reactions` on the local
  `userId`, so the model already supports multiple reactors.
- **Persisted.** Every toggle writes the active conversation's blob, so
  reactions survive a relaunch.
- **Backend-ready.** There is no server for reactions today, so the optimistic
  write is authoritative. With a real API the same entry point would fire the
  request after the optimistic dispatch and **roll back** (re-dispatch the
  inverse) on failure — the store shape already supports it.

---

## Persistence layout (scoped by conversation)

```
conversation:index                    → { usersById, conversationsById, activeConversationId }
conversation:messages:<conversationId> → { messagesById, messageOrder }   (one per conversation)
```

`persist(conversationId?)` writes the small shared index plus **one**
conversation's messages (defaulting to the active one), so a write to one
conversation never rewrites another. `sending`/`failed` drafts are dropped from
both the map and the order, so in-flight messages never rehydrate.

---

## Project structure

```
src/
  types/conversation.d.ts             # domain model (open-ended by design)
  enums/conversation.ts               # author, status, reaction, recommendation enums
  data/seed.ts                        # normalized seed: users + conversation + messages
  controllers/
    ConversationController.ts         # singleton orchestrator (API, optimistic, reactions, persist)
    AsyncStorageController.ts         # AsyncStorage + write-through cache
    apis/mockConversationApi.ts       # simulated fetch/send (latency + failure flags)
  reducers/                           # conversationReducer + action enums
  store/                              # createStore + singleton bridge + rootReducers
  features/conversation/
    screens/ConversationScreen.tsx
    components/
      timeline/                       # FlashList timeline, skeleton builder, date separators
      messages/                       # ChatBubble + per-author renderers + registry + FeedbackBar
      recommendations/                # carousel + card + registry (the extensibility core)
      composer/                       # composer + reply preview
      actions/                        # long-press action sheet
      states/                         # loading / empty / error
  common/ui/                          # theme-aware design system (Text, Card, Button…)
  context/appContext.tsx              # theme provider (light/dark)
  navigation/ | constants/ | utils/
```

---

## Simulating states

[`controllers/apis/mockConversationApi.ts`](src/controllers/apis/mockConversationApi.ts):

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
