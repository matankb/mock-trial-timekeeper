import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Button,
  Platform,
} from 'react-native';

import { TimeEditHandler } from './TimeEditor';
import TimesBreakdownSection from './TimesBreakdownSection';
import { RouteProps } from '../../App';
import { ScreenName } from '../../constants/screen-names';
import { TrialsContext } from '../../context/TrialsContext';
import {
  setTrialToStorage,
  calculateNewTrialTime,
} from '../../controllers/trial';
import { piSideName } from '../../utils';
import LinkButton from '../LinkButton';
import useTrial from '../../hooks/useTrial';

type TimeBreakdownProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.TIMES_BREAKDOWN
>;

export interface TimeBreakdownRouteProps {
  trialId: string;
  trialName: string;
}

export const timesBreakdownScreenOptions = ({
  route,
}): NativeStackNavigationOptions => ({
  title:
    Platform.OS === 'ios'
      ? `${route.params.trialName} Individual Times`
      : 'Individual Times',
  headerBackTitleVisible: false,
  headerRight: () => <LinkButton title="Edit" onPress={() => {}} />,
});

const TimeBreakdown: React.FC<TimeBreakdownProps> = ({ route, navigation }) => {
  const [trial, setTrial] = useTrial(route.params.trialId);
  const [editing, setEditing] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing ? (
          <LinkButton title="Done" onPress={() => setEditing(false)} />
        ) : (
          <LinkButton title="Edit" onPress={() => setEditing(true)} />
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
      setTrial(newTrial);
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
                `${piSideName} Opening`,
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
          title={`${piSideName} Case in Chief`}
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
                `${piSideName} Closing`,
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
    paddingBottom: 10,
  },
});

export default TimeBreakdown;
