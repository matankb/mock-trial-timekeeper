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

type SyncTrialProps = NativeStackScreenProps<RouteProps, ScreenName.SYNC_TRIAL>;

export interface SyncTrialRouteProps {
  trialId: string;
}

export const syncTrialScreenOptions: NativeStackNavigationOptions = {
  title: 'Sync Times',
};

export type SyncTrialTransferredData = Pick<Trial, 'times' | 'name'>;

export enum SyncTrialMode {
  Import,
  Export,
}

const SyncTrial: FC<SyncTrialProps> = ({ route }) => {
  const { trialId } = route.params;

  const [mode, setMode] = useState(SyncTrialMode.Import);

  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <SyncTrialTabs mode={mode} setMode={setMode} />
        {mode === SyncTrialMode.Import && <ImportTimes trialId={trialId} />}
        {mode === SyncTrialMode.Export && <ExportTimes trialId={trialId} />}
      </ScrollView>
    </BottomSheetModalProvider>
  );
};

export default SyncTrial;
