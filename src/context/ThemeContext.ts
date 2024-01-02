import { createContext } from 'react';

export enum Theme {
  LIGHT,
  DARK,
}

export const ThemeContext = createContext<[Theme, React.Dispatch<Theme>]>(null);
