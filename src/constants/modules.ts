export const MODULES = {
  EXPENSES: {
    id: 'expenses',
    reducerKey: 'expensesReducer',
    storageKey: 'expenses:items',
    displayName: 'Expense Tracker',
    description: 'Add, view, and categorize transactions.',
    icon: 'receipt',
    analyticsKey: 'module_expenses',
  },
  CREDITSCORE: {
    id: 'creditscore',
    reducerKey: 'creditScoreReducer',
    storageKey: 'creditscore:data',
    displayName: 'Credit Score Dashboard',
    description: 'View mock score and improvement tips.',
    icon: 'chart-line',
    analyticsKey: 'module_creditscore',
  },
  GOALS: {
    id: 'goals',
    reducerKey: 'goalsReducer',
    storageKey: 'goals:items',
    displayName: 'Goals Planner',
    description: 'Create and track your financial goals.',
    icon: 'bullseye-arrow',
    analyticsKey: 'module_goals',
  },
} as const;

export type ModuleReducerKey = typeof MODULES[keyof typeof MODULES]['reducerKey'];
