import { getEnabledModules, getModuleById } from '../registry';
import { expensesReducer } from '../../reducers/expensesReducer';
import { goalsReducer } from '../../reducers/goalsReducer';
import { creditScoreReducer } from '../../reducers/creditScoreReducer';
import { EXPENSES, GOALS, CREDIT_SCORE } from '../../reducers/actions';

describe('modular architecture', () => {
  it('returns enabled modules from registry', () => {
    const modules = getEnabledModules();
    expect(modules.length).toBe(3);
    expect(modules.map((item) => item.id)).toEqual(
      expect.arrayContaining(['expenses', 'creditscore', 'goals']),
    );
  });

  it('returns module by id', () => {
    const moduleDefinition = getModuleById('expenses');
    expect(moduleDefinition?.displayName).toBe('Expense Tracker');
  });

  it('updates expenses slice without affecting other slices', () => {
    const expenseState = expensesReducer(undefined, {
      type: EXPENSES.SET_ITEMS,
      payload: {
        items: [
          {
            id: 'expense-1',
            title: 'Groceries',
            amount: 10,
            category: 'Food',
            timestamp: Date.now(),
          },
        ],
      },
    });

    const goalsState = goalsReducer(undefined, { type: '@@INIT' } as any);
    expect(expenseState.items.length).toBe(1);
    expect(goalsState.items.length).toBe(0);
  });

  it('upserts goal item into goals slice', () => {
    const state = goalsReducer(undefined, {
      type: GOALS.UPSERT_ITEM,
      payload: {
        items: [
          {
            id: 'goal-1',
            name: 'Emergency fund',
            targetAmount: 1000,
            savedAmount: 200,
            updatedAt: Date.now(),
          },
        ],
      },
    });

    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('Emergency fund');
  });

  it('sets credit dashboard payload', () => {
    const state = creditScoreReducer(undefined, {
      type: CREDIT_SCORE.SET_DASHBOARD,
      payload: {
        score: 740,
        tips: [
          {
            id: 'tip-x',
            title: 'Mock tip',
            description: 'Test payload',
          },
        ],
      },
    });

    expect(state.score).toBe(740);
    expect(state.tips.length).toBe(1);
  });
});
