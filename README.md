# Bright Hub (Modular Mini-Apps)

This project implements a container React Native app that hosts multiple independent mini-apps in the same codebase.

## Architecture Overview

The app follows a **host shell + module registry** approach:

- Host shell lives in `src/navigation` and `src/screens`:
  - `HubHome` lists enabled mini-apps.
  - `ModuleHost` loads and mounts selected module roots.
- Modules are isolated under `src/modules/<module-name>`.
- A typed registry in `src/modules/registry` controls module metadata, enablement, and lazy loading.
- Shared global services:
  - Navigation container and shell routing
  - Redux store with namespaced module slices
  - Shared design system and theme context
  - Shared persistence adapter (`AsyncStorageController`)

## Module Loading Strategy

1. `HubHome` reads enabled modules from registry (`getEnabledModules()`).
2. User taps a module card.
3. Host navigates to `MODULE_HOST_SCREEN` with `moduleId`.
4. `ModuleHost` resolves module config, lazy-loads module root via `loadRoot()`, and renders it.

This makes each mini-app pluggable and easy to enable/disable via registry config.

## Mini-Apps

### 1) Expense Tracker (`src/modules/expenses`)
- Internal stack:
  - `EXPENSES_HOME_SCREEN`
  - `EXPENSES_ADD_SCREEN`
- Features:
  - Add expenses (title, amount, category)
  - View summary and expense list
  - Delete expense items
- Persistence key: `expenses:items`

### 2) Credit Score Dashboard (`src/modules/creditscore`)
- Internal stack:
  - `CREDITSCORE_HOME_SCREEN`
  - `CREDITSCORE_TIPS_SCREEN`
- Features:
  - View mock credit score
  - Refresh score and sample tips
  - Open detailed tips screen
- Persistence key: `creditscore:data`

### 3) Goals Planner (`src/modules/goals`)
- Internal stack:
  - `GOALS_HOME_SCREEN`
  - `GOALS_UPSERT_SCREEN`
- Features:
  - Create goals with target/saved values
  - Track progress with visual progress bar
  - Delete goals
- Persistence key: `goals:items`

## Shared Design System

Reusable UI primitives live in `src/common/ui`:

- `Button`
- `Card`
- `Text`
- `Input`
- Tokens in `tokens.ts` (`spacing`, `radius`, `shadow`, `typography`)

All modules consume these components for consistent look and behavior. Theme colors are sourced from container `AppContext`.

## State Management

A single Redux store is used with namespaced slices:

- `expensesReducer`
- `creditScoreReducer`
- `goalsReducer`

Module reducers are isolated and accessed by their own controllers.

## Persistence & Hydration

Persistence uses `AsyncStorage` via `AsyncStorageController`.

- Hydration is triggered in `App.tsx` on app launch.
- Each module has its own controller hydrate method:
  - `ExpensesController.hydrate()`
  - `CreditScoreController.hydrate()`
  - `GoalsController.hydrate()`

Module data survives app reloads independently.

## Run Instructions

```sh
npm start
```

```sh
npm run android
```

```sh
npm run ios
```

## Tests

```sh
npm test
```

## Demo Checklist

- [ ] Show Hub Home listing all enabled mini-apps
- [ ] Open each mini-app from container
- [ ] Demonstrate each module has its own internal navigation
- [ ] Demonstrate persistence after app reload:
  - [ ] Expenses restored
  - [ ] Credit score/tips restored
  - [ ] Goals restored
- [ ] Show shared UI consistency across modules
