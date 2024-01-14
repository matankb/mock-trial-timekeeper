import React, { FC, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import useTrial from '../../../hooks/useTrial';
import Text from '../../Text';
import {
  SYNC_TRIAL_KEY,
  SYNC_TRIAL_SCHEMA_VERSION,
  SyncTrialTransferredData,
} from '../SyncTrialTypes';

interface ExportTimesProps {
  trialId: string;
}

const ExportTimes: FC<ExportTimesProps> = ({ trialId }) => {
  const [trial] = useTrial(trialId);
  const { width } = useWindowDimensions();

  const qrData = useMemo(() => {
    const transferData: SyncTrialTransferredData = {
      key: SYNC_TRIAL_KEY,
      version: SYNC_TRIAL_SCHEMA_VERSION,
      data: {
        times: trial.times,
        name: trial.name,
      },
    };

    return JSON.stringify(transferData);
  }, [trial.times, trial.name]);

  return (
    <View style={styles.container}>
      <QRCode value={qrData} size={width * 0.8} />
      <Text style={styles.instructions}>
        Show this QR Code to the other timekeeper
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 5,
  },
  instructions: {
    color: 'gray',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ExportTimes;
