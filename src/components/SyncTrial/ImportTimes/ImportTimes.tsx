import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import merge from 'ts-deepmerge';

import ImportBox, { ImportMode } from './ImportBox';
import QRScanner from './QRScanner';
import {
  Trial,
  calculateNewTrialTime,
  getStageTime,
} from '../../../controllers/trial';
import useTrial from '../../../hooks/useTrial';
import Text from '../../Text';
import { SyncTrialTransferredData } from '../SyncTrial';

interface ImportTimesProps {
  trialId: string;
  handleClose: () => void;
}

const ImportTimes: FC<ImportTimesProps> = ({ trialId, handleClose }) => {
  const [trial, setTrial] = useTrial(trialId);

  const [importedData, setImportedData] =
    useState<SyncTrialTransferredData>(null);

  const handleScan = (data: string) => {
    setImportedData(JSON.parse(data));
  };

  const handleImportConfirm = async (mode: ImportMode, stage: string) => {
    if (!importedData) {
      return;
    }

    let newTrial: Trial = merge({}, trial);

    if (mode === ImportMode.All) {
      newTrial.times = importedData.times;
    } else {
      const stageTime = getStageTime(importedData as Trial, stage);
      newTrial = calculateNewTrialTime(trial, stageTime, stage);
    }

    await setTrial(newTrial);

    handleClose();
  };

  return (
    <View style={styles.container}>
      <QRScanner scanned={!!importedData} handleScan={handleScan} />

      {!importedData && (
        <Text style={styles.instructions}>
          Scan the QR Code in the other timekeeper's app
        </Text>
      )}
      {importedData && (
        <ImportBox
          trial={trial}
          data={importedData}
          handleImportConfirm={handleImportConfirm}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  instructions: {
    color: 'gray',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ImportTimes;
