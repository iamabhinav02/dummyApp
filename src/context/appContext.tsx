import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { IContext } from '../types/context';
import { THEME_TYPE } from '../enums/common';
import { COLORS } from '../constants/colors';

const initialState: IContext = {
  theme: THEME_TYPE.LIGHT,
  toggleTheme: () => {},
  colors: COLORS[THEME_TYPE.LIGHT],
};

const AppContext = createContext<IContext>(initialState);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(initialState.theme);

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEME_TYPE.LIGHT ? THEME_TYPE.DARK : THEME_TYPE.LIGHT);
  }, [theme]);

  const colors = useMemo(() => COLORS[theme], [theme]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useAppContext must be used inside GlobalProvider');
  }

  return ctx;
};
