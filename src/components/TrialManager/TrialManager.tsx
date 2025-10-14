import {
  NativeStackScreenProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import React, { FC, useContext, useEffect, useState } from 'react';
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
  getStageName,
} from '../../constants/trial-stages';
import { TrialsContext } from '../../context/TrialsContext';
import {
  deleteTrial,
  getStageTime,
  calculateNewTrialTime,
} from '../../controllers/trial';
import useTrial from '../../hooks/useTrial';
import Link from '../Link';

type TrialManagerProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.TRIAL_MANAGER
>;

export interface TrialManagerRouteProps {
  trialName: string;
  trialId: string;
}

export const trialManagerScreenOptions = ({ route }: TrialManagerProps) => ({
  title: route.params.trialName,
  headerBackTitle: 'Home',
});

const TrialManager: FC<TrialManagerProps> = (props) => {
  const [trial, setTrial] = useTrial(props.route.params.trialId);

  const intervalId = React.useRef<NodeJS.Timeout>();
  const [counting, setCounting] = useState(null);
  const startedCounting = React.useRef<number>(null);
  const timeBeforeCounting = React.useRef<number>(null);
  const [allTrials, setAllTrials] = useContext(TrialsContext);

  useKeepAwake();

  // Clear interval on unmount
  useEffect(() => {
    if (counting) {
      intervalId.current = setInterval(() => incrementCurrentTime(), 200);
    }

    return () => {
      clearInterval(intervalId.current);
    };
  }, [counting, trial]);

  useEffect(() => {
    if (!trial) {
      return;
    }

    const optionsMenu = (
      <OptionsMenu
        navigation={props.navigation}
        trial={trial}
        handleDelete={handleDelete}
      />
    );

    props.navigation.setOptions({
      headerRight: () => optionsMenu,
    });
  }, [trial]);

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
  const handleDelete = () => {
    const filteredTrials = allTrials.filter(
      (trial) => trial.id !== props.route.params.trialId,
    );
    setAllTrials(filteredTrials);
    deleteTrial(trial.id);
    props.navigation.goBack();
  };

  if (!trial) {
    return null;
  }

  const handleIndividualTimesPress = () => {
    props.navigation.navigate(ScreenName.TIMES_BREAKDOWN, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  const handleTimekeeperReportPress = () => {
    props.navigation.navigate(ScreenName.TIMEKEEPER_REPORT, {
      trialId: trial.id,
      trialName: trial.name,
    });
  };

  const { stage } = trial;
  const showTimekeeperReport =
    trial.setup.flexEnabled &&
    // show the timekeeper report once the user moves into closings
    // and then keep showing once closings have started
    (stage === 'close.pros' ||
      stage === 'close.def' ||
      stage === 'rebuttal' ||
      trial.times.close.pros > 0 ||
      trial.times.close.def > 0);

  return (
    <AirplaneModeBlocker>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ height: '100%' }}
      >
        <View style={{ width: '100%', marginBottom: 10 }}>
          {trial.setup.allLossEnabled && (
            <AllLoss
              flexEnabled={trial.setup.flexEnabled}
              allLossTime={trial.loss}
            />
          )}
          <TimeSummaries trial={trial} />
          <Link title="Individual Times" onPress={handleIndividualTimesPress} />
          {showTimekeeperReport && (
            <Link
              title="Timekeeper Report Sheet"
              onPress={handleTimekeeperReportPress}
            />
          )}
        </View>
        <Controls
          currentStageName={getStageName(trial)}
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
