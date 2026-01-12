import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Switch, View, ScrollView } from 'react-native';

import Option from './Option';
import colors from '../../constants/colors';
import {
  getSettings,
  setLeague,
  setSettings,
  SettingsAdditionalSetup,
  SettingsSetup,
} from '../../controllers/settings';
import TimeEditor from '../TimeEditor/TimeEditor';
import { PickByValue } from 'utility-types';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import Text from '../Text';
import Link from '../Link';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettingsLeague } from '../../hooks/useSettings';
import { leagueNames } from '../../constants/leagues';
import Button from '../Button';

export const setupSettingsScreenOptions: ScreenNavigationOptions<ScreenName.SETUP_SETTINGS> =
  {
    headerTitle: 'Advanced Trial Setup',
  };

const SetupSettings: FC<ScreenProps<ScreenName.SETUP_SETTINGS>> = ({
  navigation,
}) => {
  const [setupState, setSetupState] = useState<SettingsSetup | null>(null);
  const [additionalSetupState, setAdditionalSetupState] =
    useState<SettingsAdditionalSetup | null>(null);

  const league = useSettingsLeague();

  useEffect(() => {
    getSettings().then((settings) => {
      setSetupState(settings.setup);
      setAdditionalSetupState(settings.additionalSetup);
    });
  }, []);

  if (!setupState || !additionalSetupState || !league) {
    return null;
  }

  const handleSetupChange = (newSetup: SettingsSetup) => {
    setSetupState(newSetup);
    setSettings({
      setup: newSetup,
    });
  };

  const handleAdditionalSetupChange = (
    newAdditionalSetup: SettingsAdditionalSetup,
  ) => {
    setAdditionalSetupState(newAdditionalSetup);
    setSettings({
      additionalSetup: newAdditionalSetup,
    });
  };

  const createSetupToggleOption = (
    name: string,
    property: keyof PickByValue<SettingsSetup, boolean>,
  ) => (
    <Option name={name}>
      <Switch
        value={setupState[property]}
        onValueChange={() => {
          handleSetupChange({
            ...setupState,
            [property]: !setupState[property],
          });
        }}
        trackColor={{ true: colors.HEADER_BLUE }}
      />
    </Option>
  );

  const createSetupTimeOption = (
    name: string,
    property: keyof PickByValue<SettingsSetup, number>,
  ) => (
    <Option name={name}>
      <TimeEditor
        value={setupState[property]}
        name={name}
        onChange={(value) => {
          handleSetupChange({ ...setupState, [property]: value });
        }}
      />
    </Option>
  );

  // Reset the settings to the league's default settings
  const handleReset = async () => {
    const newSettings = await setLeague(league);
    setSetupState(newSettings.setup);
    setAdditionalSetupState(newSettings.additionalSetup);
  };

  const createAdditionalSetupTimeOption = (
    name: string,
    property: keyof PickByValue<SettingsAdditionalSetup, number>,
  ) => (
    <Option name={name}>
      <TimeEditor
        value={additionalSetupState[property]}
        name={name}
        onChange={(value) => {
          handleAdditionalSetupChange({
            ...additionalSetupState,
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
      {createSetupToggleOption('Enable Pretrial Timer', 'pretrialEnabled')}
      {createSetupToggleOption(
        'Enable Closings Preperation Timer',
        'jointPrepClosingsEnabled',
      )}
      {createSetupToggleOption(
        'Enable Team Conference Timer',
        'jointConferenceEnabled',
      )}
      {createSetupToggleOption(
        'Enable Rebuttal Maximum Time',
        'rebuttalMaxEnabled',
      )}
      {createSetupToggleOption('Enable All-Loss Timer', 'allLossEnabled')}
      {createSetupToggleOption(
        'Separate Statement Times',
        'statementsSeparate',
      )}
      {createSetupToggleOption(
        'Enable Reexaminations',
        'reexaminationsEnabled',
      )}
      <View style={styles.divider} />
      {setupState.pretrialEnabled &&
        createSetupTimeOption('Pretrial', 'pretrialTime')}

      {setupState.statementsSeparate ? (
        <>
          {createSetupTimeOption('Opening Statements', 'openTime')}
          {createSetupTimeOption('Closing Statements', 'closeTime')}
        </>
      ) : (
        createSetupTimeOption('Statements', 'statementTime')
      )}

      {createSetupTimeOption('Direct Examinations', 'directTime')}
      {createSetupTimeOption('Cross Examinations', 'crossTime')}
      {setupState.jointPrepClosingsEnabled &&
        createSetupTimeOption('Closings Preperation', 'jointPrepClosingsTime')}
      {setupState.jointConferenceEnabled &&
        createSetupTimeOption('Team Conference', 'jointConferenceTime')}
      {setupState.rebuttalMaxEnabled &&
        createSetupTimeOption('Rebuttal Maximum Time', 'rebuttalMaxTime')}
      {setupState.allLossEnabled &&
        createAdditionalSetupTimeOption('All-Loss Duration', 'allLossDuration')}
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
