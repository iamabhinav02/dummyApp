import { STORAGE_KEYS } from '../constants/storage';
import { MODULES } from '../constants/modules';
import { CREDIT_SCORE } from '../reducers/actions';
import CommonReduxStore from '../store/commonStore';
import { ICreditScoreReducer, ICreditTip } from '../types/reducers';
import { AsyncStorageController } from './AsyncStorageController';

const TIP_POOL: ICreditTip[] = [
  {
    id: 'tip-1',
    title: 'Pay bills on time',
    description: 'Set reminders so every bill is paid before the due date.',
  },
  {
    id: 'tip-2',
    title: 'Keep credit usage low',
    description: 'Stay below 30% utilization to reduce risk signals.',
  },
  {
    id: 'tip-3',
    title: 'Avoid multiple hard inquiries',
    description: 'Apply for credit only when needed and space out applications.',
  },
  {
    id: 'tip-4',
    title: 'Review your report regularly',
    description: 'Dispute incorrect records quickly to protect your score.',
  },
];

const randomScore = () => Math.floor(Math.random() * (810 - 620 + 1)) + 620;

const randomTips = (): ICreditTip[] => {
  return [...TIP_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
};

export const CreditScoreController = {
  async hydrate() {
    const data = await AsyncStorageController.get<ICreditScoreReducer>(STORAGE_KEYS.CREDITSCORE_DATA);
    if (!data) {
      return;
    }

    const state = CommonReduxStore.getInstance().getState()[MODULES.CREDITSCORE.reducerKey] as ICreditScoreReducer;
    CommonReduxStore.getInstance().dispatch({
      type: CREDIT_SCORE.SET_DASHBOARD,
      payload: {
        score: data.score ?? state.score,
        tips: data.tips?.length ? data.tips : state.tips,
      },
    });
  },

  async refreshDashboard() {
    const payload: ICreditScoreReducer = {
      score: randomScore(),
      tips: randomTips(),
    };

    CommonReduxStore.getInstance().dispatch({
      type: CREDIT_SCORE.SET_DASHBOARD,
      payload,
    });

    await AsyncStorageController.set(STORAGE_KEYS.CREDITSCORE_DATA, payload);
  },
};
