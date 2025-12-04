import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Switch, View , ScrollView } from 'react-native';

import Option from './Option';
import colors from '../../constants/colors';
import {
  getSettings,
  setSettings,
  SettingsSetup,
} from '../../controllers/settings';
import TimeEditor from '../TimeEditor/TimeEditor';
import { PickByValue } from 'utility-types';
import {
  ScreenNavigationOptions,
  ScreenProps,
} from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import Text from '../Text';
import Link from '../Link';

export const setupSettingsScreenOptions: ScreenNavigationOptions<ScreenName.SETUP_SETTINGS> =
  {
    headerTitle: 'Advanced Trial Setup',
  };

const SetupSettings: FC<ScreenProps<ScreenName.SETUP_SETTINGS>> = ({
  navigation,
}) => {
  const [setupState, setSetupState] = useState<SettingsSetup | null>(null);

  useEffect(() => {
    getSettings().then((settings) => {
      setSetupState(settings.setup);
    });
  }, []);

  if (!setupState) {
    return null;
  }

  const handleSetupChange = (newSetup: SettingsSetup) => {
    setSetupState(newSetup);
    setSettings({
      setup: newSetup,
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
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.description, styles.warningDescription]}>
        Most users will not need to change these settings.
      </Text>
      <Text style={styles.description}>
        Changes will only apply to new trials.
      </Text>
      <Text style={styles.description}>
        To reset to your league&apos;s default settings, re-select your league
        on the league settings screen:
      </Text>
      <Link
        border
        title="League Settings"
        onPress={() => navigation.navigate(ScreenName.LEAGUE_SELECTION)}
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
});

export default SetupSettings;
