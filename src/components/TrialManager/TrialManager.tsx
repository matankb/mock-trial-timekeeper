import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AirplaneModeBlocker from './AirplaneModeBlocker/AirplaneModeBlocker';
import AllLoss from './AllLoss';
import Controls from './Controls';
import OptionsMenu from './OptionsMenu';
import TimeSummaries from './TimeSummaries/TimeSummaries';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import {
  getNextStage,
  getPrevStage,
  getCurrentStageName,
} from '../../constants/trial-stages';
import {
  deleteTrial,
  getStageTime,
  calculateNewTrialTime,
} from '../../controllers/trial';
import useTrial from '../../hooks/useTrial';
import { useProvidedContext } from '../../context/ContextProvider';
import { ScreenNavigationOptions } from '../../types/navigation';
import { LeagueFeature } from '../../constants/leagues';
import { useLeagueFeatureFlag } from '../../hooks/useLeagueFeatureFlag';
import Link from '../Link';

type TrialManagerProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.TRIAL_MANAGER
>;

export interface TrialManagerRouteProps {
  trialName: string;
  trialId: string;
}

export const trialManagerScreenOptions: ScreenNavigationOptions<
  ScreenName.TRIAL_MANAGER
> = ({ route }) => ({
  title: route.params.trialName,
  headerBackTitle: 'Home',
});

const TrialManager: FC<TrialManagerProps> = (props) => {
  const [trial, setTrial] = useTrial(props.route.params.trialId);
  const timeBreakdownEnabled = useLeagueFeatureFlag(
    LeagueFeature.TIMES_BREAKDOWN,
  );

  const intervalId = React.useRef<NodeJS.Timeout>(null);
  const [counting, setCounting] = useState(false);
  const [editingTimes, setEditingTimes] = useState(false);
  const startedCounting = React.useRef<number>(null);
  const timeBeforeCounting = React.useRef<number>(null);
  const {
    trials: { trials: allTrials, setTrials: setAllTrials },
  } = useProvidedContext();

  useKeepAwake();

  // Clear interval on unmount
  useEffect(() => {
    if (counting) {
      intervalId.current = setInterval(() => incrementCurrentTime(), 200);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [counting, trial]);

  const startTimer = () => {
    startedCounting.current = Date.now();
    timeBeforeCounting.current = getStageTime(trial, trial.stage);
    setCounting(true);
  };

  const pauseTimer = () => {
    startedCounting.current = null;
    timeBeforeCounting.current = null;
    setCounting(false);
  };

  const nextStage = () => {
    pauseTimer();
    setTrial({
      stage: getNextStage(trial),
    });
  };

  const prevStage = () => {
    pauseTimer();
    setTrial({
      stage: getPrevStage(trial),
    });
  };

  const incrementCurrentTime = () => {
    if (
      startedCounting.current === null ||
      timeBeforeCounting.current === null
    ) {
      return;
    }

    // instead of incrementing by 1, increment by the number of seconds since timer began
    // to account for the screen turning off
    const seconds = Math.floor((Date.now() - startedCounting.current) / 1000);
    const timeToSet = timeBeforeCounting.current + seconds;

    setTrial(calculateNewTrialTime(trial, timeToSet, trial.stage));
  };

  // when this is called, the user has already confirmed
  const handleDelete = useCallback(() => {
    // TODO: test if this gets re-rendered every second or whatever.
    if (!allTrials) {
      throw new Error(
        'Attempted to delete trials, but all trials have not been initialized.',
      );
    }

    const filteredTrials = allTrials.filter(
      (trial) => trial.id !== props.route.params.trialId,
    );
    setAllTrials(filteredTrials);
    deleteTrial(trial.id);
    props.navigation.goBack();
  }, [
    allTrials,
    props.route.params.trialId,
    props.navigation,
    trial.id,
    setAllTrials,
  ]);

  const handleIndividualTimesPress = () => {
    props.navigation.navigate(ScreenName.TIMES_BREAKDOWN, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  useEffect(() => {
    if (!trial) {
      return;
    }

    const optionsMenu = (
      <OptionsMenu
        navigation={props.navigation}
        trial={trial}
        editingTimes={editingTimes}
        handleDelete={handleDelete}
        handleEditTimes={() => setEditingTimes(true)}
        handleEditTimesFinish={() => setEditingTimes(false)}
      />
    );

    props.navigation.setOptions({
      headerRight: () => optionsMenu,
    });
  }, [trial, editingTimes, props.navigation, handleDelete]);

  if (!trial) {
    return null;
  }

  return (
    <AirplaneModeBlocker>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ height: '100%' }}
      >
        <View style={{ width: '100%', marginBottom: 10 }}>
          {trial.setup.allLossEnabled && <AllLoss allLossTime={trial.loss} />}
          <TimeSummaries trial={trial} editingTimes={editingTimes} />
          {timeBreakdownEnabled && (
            <Link
              title="Individual Times"
              onPress={handleIndividualTimesPress}
            />
          )}
        </View>
        <Controls
          currentStageName={getCurrentStageName(trial)}
          isPaused={!counting}
          handlePause={pauseTimer}
          handlePrevious={prevStage}
          handleNext={nextStage}
          handlePlay={startTimer}
        />
      </ScrollView>
    </AirplaneModeBlocker>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 35,
    paddingTop: 10,
  },
});

export default TrialManager;
