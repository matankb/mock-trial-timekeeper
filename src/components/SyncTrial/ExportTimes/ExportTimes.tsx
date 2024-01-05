import React, { FC, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import useTrial from '../../../hooks/useTrial';
import Text from '../../Text';
import { SyncTrialTransferredData } from '../SyncTrial';

interface ExportTimesProps {
  trialId: string;
}

const ExportTimes: FC<ExportTimesProps> = ({ trialId }) => {
  const [trial] = useTrial(trialId);

  const qrData = useMemo(() => {
    const transferData: SyncTrialTransferredData = {
      times: trial.times,
      name: trial.name,
    };

    return JSON.stringify(transferData);
  }, [trial.times, trial.name]);

  return (
    <View style={styles.container}>
      <QRCode value={qrData} size={300} />
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
  },
  instructions: {
    color: 'gray',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ExportTimes;
