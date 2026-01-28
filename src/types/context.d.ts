import { IColors } from '../constants/colors';
import { THEME_TYPE } from '../enums/common';

export type IContext = {
  theme: THEME_TYPE,
  toggleTheme: () => void;
  colors: IColors,
};
