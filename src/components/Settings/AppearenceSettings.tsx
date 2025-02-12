import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';

import Option from './Option';
import SettingSection from './SettingSection';
import colors from '../../constants/colors';
import { SettingsTheme } from '../../controllers/settings';

interface AppearenceSettingsProps {
  theme: SettingsTheme;
  handleThemeChange: (theme: SettingsTheme) => void;
}

const AppearenceSettings: FC<AppearenceSettingsProps> = ({
  theme,
  handleThemeChange,
}) => {
  const createThemeOption = (name: string, themeOption: SettingsTheme) => (
    <Option name={name} handlePress={() => handleThemeChange(themeOption)}>
      <Ionicons
        name="checkmark"
        size={24}
        color={colors.HEADER_BLUE}
        style={{
          opacity: theme === themeOption ? 1 : 0,
        }}
      />
    </Option>
  );

  return (
    <SettingSection title="Appearence">
      {createThemeOption('Light', SettingsTheme.LIGHT)}
      {createThemeOption('Dark', SettingsTheme.DARK)}
      {createThemeOption('Automatic', SettingsTheme.AUTO)}
    </SettingSection>
  );
};

export default AppearenceSettings;
