import React, { FC } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import Option from './Option';
import SettingSection from './SettingSection';
import colors from '../../constants/colors';
import { defaultSettings, SettingsSetup } from '../../controllers/settings';
import { TrialSetup } from '../../controllers/trial';
import LinkButton from '../LinkButton';
import TimeEditor from '../TimeEditor/TimeEditor';

interface SetupSettingsProps {
  setup: SettingsSetup;
  handleSetupChange: (setup: SettingsSetup) => void;
}

const SetupSettings: FC<SetupSettingsProps> = ({
  setup,
  handleSetupChange,
}) => {
  const createSetupToggleOption = (
    name: string,
    property: keyof TrialSetup,
  ) => (
    <Option name={name}>
      <Switch
        value={setup[property] as boolean}
        onValueChange={() => {
          handleSetupChange({ ...setup, [property]: !setup[property] });
        }}
        trackColor={{ true: colors.HEADER_BLUE }}
      />
    </Option>
  );

  const createSetupTimeOption = (name: string, property: keyof TrialSetup) => (
    <Option name={name}>
      <TimeEditor
        value={setup[property] as number}
        name={name}
        onChange={(value) => {
          handleSetupChange({ ...setup, [property]: value });
        }}
      />
    </Option>
  );

  const handleSetupReset = () => {
    handleSetupChange(defaultSettings.setup);
  };

  return (
    <SettingSection
      title="Trial Setup"
      description="Changes will only apply to new trials"
      headerRight={<LinkButton title="Reset" onPress={handleSetupReset} />}
    >
      {createSetupToggleOption('Enable Pretrial Timer', 'pretrialEnabled')}
      {createSetupToggleOption('Enable All-Loss Timer', 'allLossEnabled')}
      {createSetupToggleOption(
        'Separate Statement Times',
        'statementsSeparate',
      )}
      <View style={styles.divider} />
      {setup.pretrialEnabled &&
        createSetupTimeOption('Pretrial', 'pretrialTime')}

      {setup.statementsSeparate ? (
        <>
          {createSetupTimeOption('Opening Statements', 'openTime')}
          {createSetupTimeOption('Closing Statements', 'closeTime')}
        </>
      ) : (
        createSetupTimeOption('Statements', 'statementTime')
      )}

      {createSetupTimeOption('Direct Examinations', 'directTime')}
      {createSetupTimeOption('Cross Examinations', 'crossTime')}
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    marginVertical: 10,
  },
});

export default SetupSettings;
