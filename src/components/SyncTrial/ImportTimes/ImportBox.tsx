import React, { FC, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import ImportBoxOption from './ImportBoxOption';
import StageSelector from './StageSelector';
import { getStageName, getTrialStages } from '../../../constants/trial-stages';
import { Trial, getStageTime } from '../../../controllers/trial';
import { formatTime } from '../../../utils';
import Button from '../../Button';
import Card from '../../Card';
import LinkButton from '../../LinkButton';
import Text from '../../Text';
import { SyncTrialTransferredData } from '../SyncTrial';

interface ImportBoxProps {
  data: SyncTrialTransferredData;
  trial: Trial;
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
    const replaceTime = formatTime(getStageTime(data as Trial, stage));
    return `Your time ${time} · Replace with ${replaceTime}`;
  };

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

      <Button
        title="Import"
        onPress={() => handleImportPress()}
        style={{ width: '100%', marginHorizontal: 0 }}
      />
      <View style={{ width: 10, height: 7 }} />
      <LinkButton title="Scan Again" />
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
});

export default ImportBox;
