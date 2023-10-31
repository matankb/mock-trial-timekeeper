import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Button } from 'react-native';

import { TimeEditHandler } from './TimeEditor';
import TimesBreakdownSection from './TimesBreakdownSection';
import { TrialsContext } from '../../context/TrialsContext';
import {
  Trial,
  getTrialFromStorage,
  setTrialToStorage,
  calculateNewTrialTime,
} from '../../controllers/trial';

interface TimeBreakdownRouteParams {
  trialId: string;
}

interface TimeBreakdownProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

const TimeBreakdown: React.FC<TimeBreakdownProps> = ({ route, navigation }) => {
  const [trials, setTrials] = React.useContext(TrialsContext);
  const [editing, setEditing] = React.useState(false);

  const trial = trials.find((trial) => trial.id === route.params.trialId);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing ? (
          <Button title="Done" onPress={() => setEditing(false)} />
        ) : (
          <Button title="Edit" onPress={() => setEditing(true)} />
        ),
    });
  }, [editing]);

  if (!trial) {
    return null;
  }

  const { times } = trial;

  const createEditHandler = (stage: string): TimeEditHandler => {
    return (newTime: number) => {
      const newTrial = calculateNewTrialTime(trial, newTime, stage);

      // TODO: use reducer here instead of this mess
      const newTrials = trials.map((t) => {
        if (t.id === newTrial.id) {
          return newTrial;
        }
        return trial;
      });

      setTrials(newTrials);
      setTrialToStorage(newTrial);
    };
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <TimesBreakdownSection
          title="Opening Statements"
          times={[
            [
              [
                'Prosecution Opening',
                times.open.pros,
                createEditHandler('open.pros'),
              ],
              [
                'Defense Opening',
                times.open.def,
                createEditHandler('open.def'),
              ],
            ],
          ]}
          editing={editing}
        />
        <TimesBreakdownSection
          title="Prosecution Case in Chief"
          times={[
            [
              [
                'Witness 1 Direct',
                times.prosCic.witnessOne.direct,
                createEditHandler('cic.pros.one.direct'),
              ],
              [
                'Witness 1 Cross',
                times.prosCic.witnessOne.cross,
                createEditHandler('cic.pros.one.cross'),
              ],
            ],
            [
              [
                'Witness 2 Direct',
                times.prosCic.witnessTwo.direct,
                createEditHandler('cic.pros.two.direct'),
              ],
              [
                'Witness 2 Cross',
                times.prosCic.witnessTwo.cross,
                createEditHandler('cic.pros.two.cross'),
              ],
            ],
            [
              [
                'Witness 3 Direct',
                times.prosCic.witnessThree.direct,
                createEditHandler('cic.pros.three.direct'),
              ],
              [
                'Witness 3 Cross',
                times.prosCic.witnessThree.cross,
                createEditHandler('cic.pros.three.cross'),
              ],
            ],
          ]}
          editing={editing}
        />
        <TimesBreakdownSection
          title="Defense Case in Chief"
          times={[
            [
              [
                'Witness 1 Direct',
                times.defCic.witnessOne.direct,
                createEditHandler('cic.def.one.direct'),
              ],
              [
                'Witness 1 Cross',
                times.defCic.witnessOne.cross,
                createEditHandler('cic.def.one.cross'),
              ],
            ],
            [
              [
                'Witness 2 Direct',
                times.defCic.witnessTwo.direct,
                createEditHandler('cic.def.two.direct'),
              ],
              [
                'Witness 2 Cross',
                times.defCic.witnessTwo.cross,
                createEditHandler('cic.def.two.cross'),
              ],
            ],
            [
              [
                'Witness 3 Direct',
                times.defCic.witnessThree.direct,
                createEditHandler('cic.def.three.direct'),
              ],
              [
                'Witness 3 Cross',
                times.defCic.witnessThree.cross,
                createEditHandler('cic.def.three.cross'),
              ],
            ],
          ]}
          editing={editing}
        />
        <TimesBreakdownSection
          title="Closing Statements"
          times={[
            [
              [
                'Prosecution Closing',
                times.close.pros,
                createEditHandler('close.pros'),
              ],
              [
                'Defense Closing',
                times.close.def,
                createEditHandler('close.def'),
              ],
              ['Rebuttal', times.rebuttal, createEditHandler('rebuttal')],
            ],
          ]}
          editing={editing}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default TimeBreakdown;
