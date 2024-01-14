import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { ScrollView } from 'react-native';

import ExportTimes from './ExportTimes/ExportTimes';
import ImportTimes from './ImportTimes/ImportTimes';
import SyncTrialTabs from './SyncTrialTabs/SyncTrialTabs';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import { Trial } from '../../controllers/trial';
import { SyncTrialMode } from './SyncTrialTypes';

type SyncTrialProps = NativeStackScreenProps<RouteProps, ScreenName.SYNC_TRIAL>;

export interface SyncTrialRouteProps {
  trialId: string;
  counting: boolean; // whether the timer is currently counting
}

export const syncTrialScreenOptions: NativeStackNavigationOptions = {
  title: 'Sync Times',
};

const SyncTrial: FC<SyncTrialProps> = ({ navigation, route }) => {
  const { trialId, counting } = route.params;

  const [mode, setMode] = useState(SyncTrialMode.Import);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <SyncTrialTabs mode={mode} setMode={setMode} />
        {mode === SyncTrialMode.Import && (
          <ImportTimes
            trialId={trialId}
            counting={counting}
            handleClose={handleClose}
          />
        )}
        {mode === SyncTrialMode.Export && <ExportTimes trialId={trialId} />}
      </ScrollView>
    </BottomSheetModalProvider>
  );
};

export default SyncTrial;
