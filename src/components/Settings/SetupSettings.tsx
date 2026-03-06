import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Option from './Option';
import colors from '../../constants/colors';
import {
  setLeague,
  SettingsAdditionalSetup,
  SettingsSetup,
} from '../../controllers/settings';
import TimeEditor from '../TimeEditor/TimeEditor';
import { PickByValue } from 'utility-types';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import Text from '../Text';
import { useSettingsLeague } from '../../hooks/useLeague';
import { leagueNames } from '../../constants/leagues';
import Button from '../Button';
import { useSettings } from '../../hooks/useSettings';

export const setupSettingsScreenOptions: ScreenNavigationOptions<ScreenName.SETUP_SETTINGS> =
  {
    headerTitle: 'Advanced Trial Setup',
  };

const SetupSettings: FC<ScreenProps<ScreenName.SETUP_SETTINGS>> = () => {
  const { settings, setSettings } = useSettings();
  const league = useSettingsLeague();

  const handleSetupChange = (newSetup: SettingsSetup) => {
    setSettings({
      setup: newSetup,
    });
  };

  const handleAdditionalSetupChange = (
    newAdditionalSetup: SettingsAdditionalSetup,
  ) => {
    setSettings({
      additionalSetup: newAdditionalSetup,
    });
  };

  const createSetupTimeOption = (
    name: string,
    property: keyof PickByValue<SettingsSetup, number>,
  ) => (
    <Option name={name}>
      <TimeEditor
        value={settings.setup[property]}
        name={name}
        onChange={(value) => {
          handleSetupChange({ ...settings.setup, [property]: value });
        }}
      />
    </Option>
  );

  // Reset the settings to the league's default settings
  const handleReset = async () => {
    const newSettings = await setLeague(league);
    setSettings(newSettings);
  };

  const createAdditionalSetupTimeOption = (
    name: string,
    property: keyof PickByValue<SettingsAdditionalSetup, number>,
  ) => (
    <Option name={name}>
      <TimeEditor
        value={settings.additionalSetup[property]}
        name={name}
        onChange={(value) => {
          handleAdditionalSetupChange({
            ...settings.additionalSetup,
            [property]: value,
          });
        }}
      />
    </Option>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.description, styles.warningDescription]}>
        Most users will not need to change these settings.
      </Text>
      <Text style={styles.description}>
        Changes will only apply to new trials.
      </Text>
      <View style={styles.divider} />
      <Button
        title={`Reset to ${leagueNames[league]} Settings`}
        onPress={handleReset}
        style={styles.resetButton}
      />
      <View style={styles.divider} />
      {createSetupTimeOption('Statements', 'statementTime')}
      {createSetupTimeOption('Direct Examinations', 'directTime')}
      {createSetupTimeOption('Cross Examinations', 'crossTime')}
      {createAdditionalSetupTimeOption('All-Loss Duration', 'allLossDuration')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    marginVertical: 10,
  },
  container: {
    padding: 10,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    padding: 10,
    color: 'gray',
  },
  warningDescription: {
    color: colors.WARNING_RED,
    fontWeight: 500,
  },
  resetButton: {
    backgroundColor: colors.DARK_GREEN,
    marginTop: 0,
  },
});

export default SetupSettings;
