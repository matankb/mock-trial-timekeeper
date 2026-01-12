import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';

import TimesBreakdownSection, { TimeSection } from './TimesBreakdownSection';
import { ScreenName } from '../../constants/screen-names';
import { calculateNewTrialTime } from '../../controllers/trial';
import useTrial from '../../hooks/useTrial';
import LinkButton from '../LinkButton';
import { TrialStage } from '../../constants/trial-stages';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { useLeagueSideName } from '../../hooks/useLeagueFeatureFlag';

export interface TimeBreakdownRouteProps {
  trialId: string;
  trialName: string;
}

export const timesBreakdownScreenOptions: ScreenNavigationOptions<
  ScreenName.TIMES_BREAKDOWN
> = ({ route }) => ({
  title:
    Platform.OS === 'ios'
      ? `${route.params.trialName} Individual Times`
      : 'Individual Times',
  headerBackButtonDisplayMode: 'minimal',
  headerRight: () => <LinkButton title="Edit" onPress={() => {}} />,
});

const TimeBreakdown: React.FC<ScreenProps<ScreenName.TIMES_BREAKDOWN>> = ({
  route,
  navigation,
}) => {
  const [trial, setTrial] = useTrial(route.params.trialId);
  const [editing, setEditing] = React.useState(false);

  const trialDate = trial ? new Date(trial.date) : undefined;
  const piSideName = useLeagueSideName('p', trialDate);

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

  const handleTimeEdit = (stage: TrialStage, newTime: number) => {
    const newTrial = calculateNewTrialTime(trial, newTime, stage);
    setTrial(newTrial);
  };

  const createTimeBreakdownSection = (
    title: string,
    timeSections: TimeSection[],
  ) => {
    return (
      <TimesBreakdownSection
        title={title}
        trial={trial}
        timeSections={timeSections}
        onEdit={handleTimeEdit}
        editing={editing}
      />
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {createTimeBreakdownSection('Opening Statements', [
          ['open.pros', 'open.def'],
        ])}
        {createTimeBreakdownSection(`${piSideName} Case in Chief`, [
          ['cic.pros.one.direct', 'cic.pros.one.cross'],
          ['cic.pros.two.direct', 'cic.pros.two.cross'],
          ['cic.pros.three.direct', 'cic.pros.three.cross'],
        ])}
        {createTimeBreakdownSection('Defense Case in Chief', [
          ['cic.def.one.direct', 'cic.def.one.cross'],
          ['cic.def.two.direct', 'cic.def.two.cross'],
          ['cic.def.three.direct', 'cic.def.three.cross'],
        ])}
        {createTimeBreakdownSection('Closing Statements', [
          ['close.pros', 'close.def'],
          ['rebuttal'],
        ])}
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
