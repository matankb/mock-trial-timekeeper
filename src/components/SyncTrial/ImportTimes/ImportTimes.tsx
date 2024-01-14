import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import merge from 'ts-deepmerge';

import ImportBox, { ImportMode } from './ImportBox';
import QRScanner from './QRScanner';
import ScanErrorAlert from './ScanErrorAlert';
import {
  Trial,
  calculateNewTrialTime,
  getStageTime,
} from '../../../controllers/trial';
import useTrial from '../../../hooks/useTrial';
import { isValidJson } from '../../../utils';
import Text from '../../Text';
import {
  SYNC_TRIAL_KEY,
  SYNC_TRIAL_SCHEMA_VERSION,
  ScanError,
  SyncTrialTransferredData,
} from '../SyncTrialTypes';

interface ImportTimesProps {
  trialId: string;
  counting: boolean;
  handleClose: () => void;
}

const ImportTimes: FC<ImportTimesProps> = ({
  trialId,
  counting,
  handleClose,
}) => {
  const [trial, setTrial] = useTrial(trialId);
  const [scanError, setScanError] = useState<ScanError>(null);

  const [importedData, setImportedData] = useState<SyncTrialTransferredData>({
    key: SYNC_TRIAL_KEY,
    version: SYNC_TRIAL_SCHEMA_VERSION,
    data: trial,
  });

  const handleScan = (data: string) => {
    // when there are multiple schemas, this will try to convert the schema
    if (!isValidJson(data)) {
      return setScanError(ScanError.NotJSON);
    }

    const scannedData = JSON.parse(data);

    if (scannedData?.key !== SYNC_TRIAL_KEY) {
      return setScanError(ScanError.WrongKey);
    }

    if (scannedData?.version !== SYNC_TRIAL_SCHEMA_VERSION) {
      return setScanError(ScanError.WrongSchema);
    }

    setImportedData(scannedData);
  };

  const handleImportConfirm = async (mode: ImportMode, stage: string) => {
    if (!importedData) {
      return;
    }

    let newTrial: Trial = merge({}, trial);

    if (mode === ImportMode.All) {
      newTrial.times = importedData.data.times;
    } else {
      const stageTime = getStageTime(importedData.data as Trial, stage);
      newTrial = calculateNewTrialTime(trial, stageTime, stage);
    }

    await setTrial(newTrial);

    handleClose();
  };

  return (
    <View style={styles.container}>
      <QRScanner
        scanned={!!importedData}
        error={!!scanError}
        handleScan={handleScan}
      />

      {!(importedData || scanError) && (
        <Text style={styles.instructions}>
          Scan the QR Code in the other timekeeper's app
        </Text>
      )}
      {importedData && (
        <ImportBox
          trial={trial}
          data={importedData}
          counting={counting}
          handleImportConfirm={handleImportConfirm}
        />
      )}
      {scanError && (
        <ScanErrorAlert
          error={scanError}
          handleScanAgain={() => setScanError(null)}
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
