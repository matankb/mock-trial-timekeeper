import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { FC, useEffect, useMemo, useState } from 'react';

import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../utils/supabase';
import { showBugReportAlert } from '../../utils/bug-report';
import { useSettings } from '../../hooks/useSettings';
import { ScreenProps } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import TrialsList from './TrialsList/TrialsList';
import { Trial } from '../../controllers/trial';
import { getSideName } from '../../hooks/useLeague';
import colors from '../../constants/colors';
import Text from '../Text';
import { usePostHog } from 'posthog-react-native';

export const teamTrialsScreenOptions = {
  title: 'Team Trials',
  headerBackTitle: 'Home',
};

const fetchAllData = async (teamId: string) => {
  const trials = await supabase
    .from('tournaments')
    .select('*, trials(*), teams(name)')
    .eq('team_id', teamId);

  if (trials.error) {
    showBugReportAlert(
      'Error fetching trials',
      'Try again later',
      trials.error,
    );
  }

  return trials.data;
};

type TournamentData = Awaited<ReturnType<typeof fetchAllData>>;

type OrderedTournament = NonNullable<TournamentData>[number] & {
  trials: Trial[];
};

export const TeamTrials: FC<ScreenProps<ScreenName.TEAM_TRIALS>> = ({
  navigation,
}) => {
  const { settings } = useSettings();
  const posthog = usePostHog();

  const [tournaments, setTournaments] = useState<TournamentData | null>(null);

  useEffect(() => {
    const fetchTournaments = async (teamId: string) => {
      let query = supabase
        .from('tournaments')
        .select('*, trials(*), teams(name)');

      if (!settings.schoolAccount.coachMode) {
        query = query.eq('team_id', teamId);
      }

      const { data: trials, error } = await query;

      if (error) {
        showBugReportAlert(
          "There was a problem loading your team's tournaments",
          'Please try again later, or contact support.',
          supabaseDbErrorToReportableError(error),
        );
        return;
      }

      if (trials) {
        setTournaments(trials);
      }
    };

    const fetchTeamName = async (teamId: string) => {
      if (settings?.schoolAccount?.coachMode) {
        return;
      }

      const { data, error } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();

      // Since this just affects the header title, no need to show an error,
      // as it falls back to the default title.
      if (error) {
        posthog.capture('error', {
          message: 'Error fetching team name',
          error: JSON.stringify(error),
        });
      }

      navigation.setOptions({
        title: `${data?.name} Trials`,
      });
    };

    const teamId = settings?.schoolAccount?.teamId;
    if (teamId) {
      fetchTeamName(teamId);
      fetchTournaments(teamId);
    }
  }, [
    settings.schoolAccount.teamId,
    settings.schoolAccount.coachMode,
    navigation,
    posthog,
  ]);

  const orderedTournaments = useMemo((): OrderedTournament[] | null => {
    if (!tournaments) {
      return null;
    }

    // Create a copy to avoid mutating the original array
    const sortedTournaments = [...tournaments].sort((a, b) => {
      const aTrial = a.trials?.[0]?.data as unknown as Trial;
      const bTrial = b.trials?.[0]?.data as unknown as Trial;

      // Handle cases where tournaments have no trials
      if (!aTrial && !bTrial) return 0;
      if (!aTrial) return 1;
      if (!bTrial) return -1;

      return bTrial.date - aTrial.date;
    });

    // Sort the trials within each tournament by round number (round 1 first, then 2, etc.)
    return sortedTournaments.map((tournament) => ({
      ...tournament,
      trials: tournament.trials
        .map((trial) => trial.data as unknown as Trial)
        .sort((a, b) => {
          const aRound = a.details?.round;
          const bRound = b.details?.round;

          return (aRound ?? 0) - (bRound ?? 0);
        }),
    })) as OrderedTournament[];
  }, [tournaments]);

  if (!tournaments) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  const handleTrialSelect = (trial: Trial, tournamentName: string) => {
    navigation.navigate(ScreenName.TEAM_TIMES_BREAKDOWN, {
      trialId: trial.id,

      // Component will use these to set the header title
      // As soon as component is mounted
      trialName: trial.name,
      tournamentName,
      round: trial.details?.round ?? undefined,
      side: trial.details?.side ?? undefined,
    });
  };

  const getTrialTitle = (trial: Trial) => {
    const round = trial.details?.round;
    if (!round) {
      return trial.name;
    }

    return `Round ${round}`;
  };

  const getTrialSubtitle = (trial: Trial) => {
    const round = trial.details?.round;

    // If no round, the title is the name, so no subtitle needed
    if (!round) {
      return null;
    }

    return trial.details?.side
      ? getSideName(trial.details?.side, trial.league)
      : null;
  };

  const getTournamentTitle = (tournament: OrderedTournament) => {
    if (settings?.schoolAccount?.coachMode) {
      return tournament.name + ' (' + tournament.teams.name + ')';
    }

    return tournament.name;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tournamentsList}>
        {orderedTournaments?.length === 0 && (
          <Text style={styles.noTrials}>
            Your team hasn&apos;t uploaded any trials yet
          </Text>
        )}
        {orderedTournaments?.map((tournament) => (
          <View key={tournament.id} style={styles.tournamentSection}>
            <TrialsList
              title={getTournamentTitle(tournament)}
              orderedTrials={tournament.trials}
              handleSelect={(trial) =>
                handleTrialSelect(trial, tournament.name)
              }
              getTrialTitle={getTrialTitle}
              getTrialSubtitle={getTrialSubtitle}
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Missing trials? Make sure your team&apos;s timekeeper uploaded them to
          your school account, or contact support for help.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noTrials: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.PLACEHOLDER_GRAY,
  },
  container: {
    paddingTop: 10,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tournamentsList: {
    marginTop: 10,
  },
  tournamentSection: {
    marginBottom: 15,
  },
  loading: {
    marginTop: 20,
  },
  footer: {
    marginTop: 17,
    padding: 10,
    paddingHorizontal: 15,
  },
  footerText: {
    color: 'gray',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
