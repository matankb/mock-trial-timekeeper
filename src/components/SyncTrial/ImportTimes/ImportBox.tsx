import { Feather } from '@expo/vector-icons';
import React, { FC, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import ImportBoxOption from './ImportBoxOption';
import StageSelector from './StageSelector';
import colors from '../../../constants/colors';
import { getStageName, getTrialStages } from '../../../constants/trial-stages';
import { Trial, getStageTime } from '../../../controllers/trial';
import { formatTime } from '../../../utils';
import Button from '../../Button';
import Card from '../../Card';
import LinkButton from '../../LinkButton';
import Text from '../../Text';
import { SyncTrialTransferredData } from '../SyncTrialTypes';

interface ImportBoxProps {
  data: SyncTrialTransferredData;
  trial: Trial;
  counting: boolean;
  handleImportConfirm: (mode: ImportMode, stage?: string) => void;
}

export enum ImportMode {
  CurrentStage,
  CustomStage,
  All,
}

const ImportBox: FC<ImportBoxProps> = ({
  data,
  trial,
  counting,
  handleImportConfirm,
}) => {
  const [mode, setMode] = useState(ImportMode.CurrentStage);
  const [customStage, setCustomStage] = useState<string>(null);

  const trialStages = useMemo(() => getTrialStages(trial), [trial]);
  const handleImportPress = () => {
    let stage: string = null;
    if (mode === ImportMode.CurrentStage) {
      stage = trial.stage;
    } else if (mode === ImportMode.CustomStage) {
      stage = customStage;
    }

    handleImportConfirm(mode, stage);
  };

  const getTimeDescription = (stage: string) => {
    const time = formatTime(getStageTime(trial, stage));
    const replaceTime = formatTime(getStageTime(data.data as Trial, stage));
    return `Your time ${time} · Replace with ${replaceTime}`;
  };

  const getOptionPermitted = () => {
    if (mode === ImportMode.CurrentStage) {
      return !counting;
    } else if (mode === ImportMode.CustomStage) {
      return !counting || customStage !== trial.stage;
    } else if (mode === ImportMode.All) {
      return !counting;
    }
  };

  const optionPermitted = getOptionPermitted();
  const buttonDisabled =
    !optionPermitted || (mode === ImportMode.CustomStage && !customStage);

  return (
    <Card>
      <View style={styles.optionWrap}>
        <Text style={styles.title}>Import Times from Drexel R1</Text>
      </View>
      <ImportBoxOption
        name={`Time for ${getStageName(trial.stage)}`}
        description={getTimeDescription(trial.stage)}
        active={mode === ImportMode.CurrentStage}
        handlePress={() => setMode(ImportMode.CurrentStage)}
      />
      <ImportBoxOption
        active={mode === ImportMode.CustomStage}
        handlePress={() => setMode(ImportMode.CustomStage)}
        description={customStage && getTimeDescription(customStage)}
      >
        <Text>Time for </Text>
        <StageSelector
          stage={customStage}
          stages={trialStages}
          handleStageChange={(newStage) => {
            setCustomStage(newStage);
            setMode(ImportMode.CustomStage);
          }}
        />
      </ImportBoxOption>
      <ImportBoxOption
        name="All times"
        active={mode === ImportMode.All}
        handlePress={() => setMode(ImportMode.All)}
      />

      {!optionPermitted && (
        <View style={styles.errorWrap}>
          <Feather name="alert-circle" size={30} color="gray" />
          <Text style={styles.error}>
            Cannot import the current stage while the timer is running.
          </Text>
        </View>
      )}

      <Button
        title="Import"
        onPress={() => handleImportPress()}
        style={{ width: '100%', marginHorizontal: 0 }}
        disabled={buttonDisabled}
      />
      <View style={{ width: 10, height: 7 }} />
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <LinkButton title="Scan Again" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  optionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorWrap: {
    padding: 15,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  error: {
    marginLeft: 10,
    flex: 1,
    color: colors.BACKGROUND_GRAY,
    textAlign: 'left',
    fontSize: 14,
  },
});

export default ImportBox;
