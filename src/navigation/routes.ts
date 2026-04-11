import { ModuleId } from '../types/modules';

export const ROUTES = {
  HUB_HOME_SCREEN: '@ROUTES/HUB_HOME_SCREEN',
  MODULE_HOST_SCREEN: '@ROUTES/MODULE_HOST_SCREEN',
  MODULES: {
    EXPENSES: {
      HOME: '@ROUTES/EXPENSES/HOME',
      ADD: '@ROUTES/EXPENSES/ADD',
    },
    CREDITSCORE: {
      HOME: '@ROUTES/CREDITSCORE/HOME',
      TIPS: '@ROUTES/CREDITSCORE/TIPS',
    },
    GOALS: {
      HOME: '@ROUTES/GOALS/HOME',
      UPSERT: '@ROUTES/GOALS/UPSERT',
    },
  },
} as const;

export type RootStackParamList = {
  [ROUTES.HUB_HOME_SCREEN]: undefined;
  [ROUTES.MODULE_HOST_SCREEN]: {
    moduleId: ModuleId;
  };
};

export type ExpensesStackParamList = {
  [ROUTES.MODULES.EXPENSES.HOME]: undefined;
  [ROUTES.MODULES.EXPENSES.ADD]: undefined;
};

export type CreditScoreStackParamList = {
  [ROUTES.MODULES.CREDITSCORE.HOME]: undefined;
  [ROUTES.MODULES.CREDITSCORE.TIPS]: undefined;
};

export type GoalsStackParamList = {
  [ROUTES.MODULES.GOALS.HOME]: undefined;
  [ROUTES.MODULES.GOALS.UPSERT]: undefined;
};
