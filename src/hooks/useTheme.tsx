import { useProvidedContext } from '../context/ContextProvider';

const useTheme = () => {
  const { theme } = useProvidedContext();

  if (theme.theme === null) {
    throw new Error('Attempting to access theme before theme is loaded.');
  }

  return theme.theme;
};

export default useTheme;
