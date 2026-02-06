import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { ScreenName } from '../../constants/screen-names';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { useEffect, useState } from 'react';
import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../utils/supabase';
import { getTotalTimes, Trial } from '../../controllers/trial';
import TimesBreakdownSection from './TimesBreakdownSection';
import { TrialStage } from '../../constants/trial-stages';
import { showBugReportAlert } from '../../utils/bug-report';
import { Side } from '../../types/side';

export interface TeamTimesBreakdownRouteProps {
  trialId: string;
  trialName: string;
  round?: number;
  tournamentName: string;
  side?: Side;
}

const getHeaderTitle = (route: TeamTimesBreakdownRouteProps) => {
  if (!route.round) {
    return route.trialName;
  }

  const sideLabel = route.side
    ? ` (${route.side?.slice(0, 1).toUpperCase()})`
    : '';
  return `${route.tournamentName}, Round ${route.round}${sideLabel}`;
};

export const teamTimesBreakdownScreenOptions: ScreenNavigationOptions<
  ScreenName.TEAM_TIMES_BREAKDOWN
> = ({ route }) => ({
  title: getHeaderTitle(route.params),
  headerBackButtonDisplayMode: 'minimal',
});

const TeamTimesBreakdown: React.FC<
  ScreenProps<ScreenName.TEAM_TIMES_BREAKDOWN>
> = ({ route }) => {
  const [trial, setTrial] = useState<Trial | null>(null);

  useEffect(() => {
    const fetchTrial = async () => {
      const { data: trial, error } = await supabase
        .from('trials')
        .select('*')
        .eq('id', route.params.trialId)
        .single();

      if (error) {
        showBugReportAlert(
          'There was a problem loading this trial',
          'Please try again later, or contact support.',
          supabaseDbErrorToReportableError(error),
        );
        return;
      }

      if (!trial) {
        return;
      }

      setTrial(trial.data as unknown as Trial);
    };

    fetchTrial();
  }, [route.params.trialId]);

  if (!trial) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (!trial.details?.side) {
    return <Text>No side selected</Text>;
  }

  const timeRemaining = getTotalTimes(trial);
  const sideTimeRemaining = timeRemaining[trial.details.side];
  const isPros = trial.details.side === 'p';

  const createTimeBreakdownSection = (
    title: string,
    stages: TrialStage[],
    used: number,
    remaining: number,
  ) => {
    return (
      <TimesBreakdownSection
        title={title}
        trial={trial}
        timeSections={[stages]}
        summaryItems={[
          ['Total', used],
          ['Time Remaining', remaining],
        ]}
        minimalStageNames={true}
      />
    );
  };

  // TODO: support redirects and whatnot
  const statementStages: TrialStage[] = isPros
    ? ['open.pros', 'close.pros', 'rebuttal']
    : ['open.def', 'close.def'];
  const directStages: TrialStage[] = isPros
    ? ['cic.pros.one.direct', 'cic.pros.two.direct', 'cic.pros.three.direct']
    : ['cic.def.one.direct', 'cic.def.two.direct', 'cic.def.three.direct'];
  const crossStages: TrialStage[] = isPros
    ? ['cic.def.one.cross', 'cic.def.two.cross', 'cic.def.three.cross'] // when pi side, crosses are of the def witnesses
    : ['cic.pros.one.cross', 'cic.pros.two.cross', 'cic.pros.three.cross'];

  // TODO: handle if statements are together vs. seperate? Does the dashboard do this currently??
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {createTimeBreakdownSection(
        'Statements',
        statementStages,
        sideTimeRemaining.used.statements,
        sideTimeRemaining.remaining.statements,
      )}
      {createTimeBreakdownSection(
        'Direct Examinations',
        directStages,
        sideTimeRemaining.used.direct,
        sideTimeRemaining.remaining.direct,
      )}
      {createTimeBreakdownSection(
        'Cross Examinations',
        crossStages,
        sideTimeRemaining.used.cross,
        sideTimeRemaining.remaining.cross,
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 25,
  },
  loading: {
    marginTop: 20,
  },
});

export default TeamTimesBreakdown;
