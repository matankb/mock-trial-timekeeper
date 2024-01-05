import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import SyncTrialTab from './SyncTrialTab';
import { SyncTrialMode } from '../SyncTrial';

interface SyncTrialTabsProps {
  mode: SyncTrialMode;
  setMode: (mode: SyncTrialMode) => void;
}

const SyncTrialTabs: FC<SyncTrialTabsProps> = ({ mode, setMode }) => {
  return (
    <View style={styles.tabs}>
      <SyncTrialTab
        title="Import Their Times"
        onPress={() => setMode(SyncTrialMode.Import)}
        active={mode === SyncTrialMode.Import}
      />
      <SyncTrialTab
        title="Export My Times"
        onPress={() => setMode(SyncTrialMode.Export)}
        active={mode === SyncTrialMode.Export}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    marginBottom: 10,
    backgroundColor: 'white',
    marginTop: 0,
    borderRadius: 0,
    alignSelf: 'center',
  },
});

export default SyncTrialTabs;
