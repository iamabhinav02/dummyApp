import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IContext } from '../types/context';
import { THEME_TYPE } from '../enums/common';
import { COLORS } from '../constants/colors';
import { AsyncStorageController } from '../controllers/AsyncStorageController';
import { STORAGE_KEYS } from '../constants/storage';

const initialState: IContext = {
  theme: THEME_TYPE.LIGHT,
  toggleTheme: () => {},
  colors: COLORS[THEME_TYPE.LIGHT],
};

const isThemeType = (value: unknown): value is THEME_TYPE =>
  value === THEME_TYPE.LIGHT || value === THEME_TYPE.DARK;

const AppContext = createContext<IContext>(initialState);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(initialState.theme);

  // Hydrate the persisted theme on app start.
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await AsyncStorageController.get<THEME_TYPE>(STORAGE_KEYS.THEME_MODE);
      if (isMounted && isThemeType(stored)) {
        setTheme(stored);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === THEME_TYPE.LIGHT ? THEME_TYPE.DARK : THEME_TYPE.LIGHT;
    setTheme(next);
    AsyncStorageController.set(STORAGE_KEYS.THEME_MODE, next);
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
