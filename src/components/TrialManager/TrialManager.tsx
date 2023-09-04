import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import React, { FC, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import merge from 'ts-deepmerge';

import AllLoss from './AllLoss';
import Controls from './Controls';
import OptionsMenu from './OptionsMenu';
import TimeSummaries from './TimeSummaries/TimeSummaries';
import {
  getNextStage,
  getPrevStage,
  getStageName,
} from '../../constants/trial-stages';
import { TrialsContext } from '../../context/TrialsContext';
import {
  Trial,
  deleteTrial,
  setTrialToStorage,
  getStageTime,
  calculateNewTrialTime,
} from '../../controllers/trial';
import Link from '../Link';

interface TrialManagerProps {
  setTrialState: (newTrialState: Trial) => void;
  handleDelete: () => void;
  navigation: NavigationProp<any>;
  route: RouteProp<any>; // TODO: type this better :)
}

const TrialManager: FC<TrialManagerProps> = (props) => {
  const intervalId = React.useRef<NodeJS.Timeout>();
  const [counting, setCounting] = React.useState(null);
  const startedCounting = React.useRef<number>(null);
  const timeBeforeCounting = React.useRef<number>(null);
  const [allTrials, setAllTrials] = useContext(TrialsContext);

  const trial = allTrials.find(
    (trial) => trial.id === props.route.params.trialId,
  );

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

  // React.useEffect(
  //   () =>
  //     props.navigation.addListener("beforeRemove", (e) => {
  //       if (!counting) {
  //         return;
  //       }

  //       // Prevent default behavior of leaving the screen
  //       e.preventDefault();

  //       // Prompt the user before leaving the screen
  //       Alert.alert(
  //         "Pause timer?",
  //         "The timer is currently running. Are you sure you want to go back and pause the timer?",
  //         [
  //           { text: "Don't leave", style: "cancel", onPress: () => {} },
  //           {
  //             text: "Discard",
  //             style: "destructive",
  //             // If the user confirmed, then we dispatch the action we blocked earlier
  //             // This will continue the action that had triggered the removal of the screen
  //             onPress: () => navigation.dispatch(e.data.action),
  //           },
  //         ]
  //       );
  //     }),
  //   [navigation, hasUnsavedChanges]
  // );

  useEffect(() => {
    if (!trial) {
      return;
    }

    const optionsMenu = (
      <OptionsMenu
        trialName={trial.name}
        handleDelete={handleDelete}
        handleRename={handleRename}
      />
    );

    props.navigation.setOptions({
      headerRight: () => optionsMenu,
    });
  }, [trial]);

  const updateTrial = (newTrialState: Partial<Trial>) => {
    // TODO: def use reducers here
    const newTrial = merge(trial, newTrialState);
    const newTrials = allTrials.map((trial) => {
      if (trial.id === newTrial.id) {
        return newTrial;
      }
      return trial;
    });
    setAllTrials(newTrials);
    setTrialToStorage(newTrial);
  };

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
    updateTrial({
      stage: getNextStage(trial.stage),
    });
  };

  const prevStage = () => {
    pauseTimer();
    updateTrial({
      stage: getPrevStage(trial.stage),
    });
  };

  const incrementCurrentTime = () => {
    if (
      startedCounting.current === null ||
      timeBeforeCounting.current === null
    ) {
      return;
    }

    // instead of incrementing by 1, increment by the number of seconds since last increment
    // to account for the screen turning off
    const seconds = Math.floor((Date.now() - startedCounting.current) / 1000);
    const timeToSet = timeBeforeCounting.current + seconds;

    updateTrial(calculateNewTrialTime(trial, timeToSet, trial.stage));
  };

  // when this is called, the user has already confirmed
  const handleDelete = () => {
    setAllTrials(
      allTrials.filter((trial) => trial.id !== props.route.params.trialId),
    );
    deleteTrial(trial.id);
    props.navigation.goBack();
  };

  const handleRename = (name: string) => {
    setAllTrials(
      allTrials.map((trial) => {
        if (trial.id === props.route.params.trialId) {
          return { ...trial, name };
        }
        return trial;
      }),
    );
    props.navigation.setOptions({ title: name });
    updateTrial({ name });
  };

  if (!trial) {
    return null;
  }

  const { stage } = trial;

  const breakdownLink = (
    <Link
      title="Individual Times"
      onPress={() => {
        props.navigation.navigate('breakdown', {
          trialId: trial.id,
          trialName: trial.name, // name included to set as header title
        });
      }}
    />
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ height: '100%' }}
    >
      <View style={{ width: '100%', marginBottom: 10 }}>
        <AllLoss allLossTime={trial.setup.allLoss} />
        <TimeSummaries trial={trial} />
        {breakdownLink}
      </View>
      <Controls
        currentStageName={getStageName(stage)}
        isPaused={!counting}
        handlePause={pauseTimer}
        handlePrevious={prevStage}
        handleNext={nextStage}
        handlePlay={startTimer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: "100%",
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
