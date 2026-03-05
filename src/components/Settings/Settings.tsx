import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import AppearenceSettings from './AppearenceSettings';
import SchoolAccountSettings from './SchoolAccount/SchoolAccountSettings';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import {
  SettingsSchoolAccount,
  SettingsTheme,
  settingsThemeToThemeContextTheme,
} from '../../controllers/settings';
import { useProvidedContext } from '../../context/ContextProvider';
import LeagueSettings from './LeagueSettings/LeagueSettings';
import Link from '../Link';
import { LeagueFeature } from '../../constants/leagues';
import { useLeagueFeatureFlag } from '../../hooks/useLeague';
import { openSupportEmail } from '../../utils/bug-report';
import { useSettings } from '../../hooks/useSettings';

type SettingsProps = NativeStackScreenProps<RouteProps, ScreenName.SETTINGS>;

export const settingsScreenOptions = {
  title: 'Settings',
  headerBackTitle: 'Home',
};

const Settings: FC<SettingsProps> = ({ navigation }) => {
  const {
    theme: { setTheme },
  } = useProvidedContext();
  const { settings, setSettings } = useSettings();

  const teamAccountsEnabled = useLeagueFeatureFlag(LeagueFeature.TEAM_ACCOUNTS);

  const handleThemeChange = (theme: SettingsTheme) => {
    setTheme(settingsThemeToThemeContextTheme(theme));
    setSettings({ theme });
  };

  const handleSchoolAccountChange = (schoolAccount: SettingsSchoolAccount) => {
    return setSettings({ schoolAccount });
  };

  const handleSetupSettings = () => {
    navigation.navigate(ScreenName.SETUP_SETTINGS);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LeagueSettings />
      <AppearenceSettings
        theme={settings.theme}
        handleThemeChange={handleThemeChange}
      />
      {teamAccountsEnabled && (
        <SchoolAccountSettings
          navigation={navigation}
          schoolAccountSettings={settings.schoolAccount}
          handleSchoolAccountSettingsChange={handleSchoolAccountChange}
        />
      )}
      <Link title="Advanced Trial Setup" onPress={handleSetupSettings} />
      <Link title="Contact Support" onPress={openSupportEmail} />
      <View style={{ marginBottom: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    ...Platform.select({
      web: {
        width: 800,
        marginHorizontal: 'auto',
      },
    }),
  },
  sectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  sectionDescription: {
    padding: 10,
    paddingVertical: 5,
    color: 'gray',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Settings;
