export type IExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  timestamp: number;
};

export type IExpensesReducer = {
  items: IExpenseItem[];
};

export type ICreditTip = {
  id: string;
  title: string;
  description: string;
};

export type CurrencyMeta = {
  code: string;
  name: string;
  countryCode: string;
};

export type ICreditScoreReducer = {
  score: number;
  tips: ICreditTip[];
};

export type IGoalItem = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  updatedAt: number;
};

export type IGoalsReducer = {
  items: IGoalItem[];
};
