import { Entypo } from '@expo/vector-icons';
import { useNetworkState } from 'expo-network';
import React, { FC, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import TournamentList from './TournamentList';
import TournamentSelectorOffline from './TournamentSelectorOffline';
import colors from '../../../../constants/colors';
import { getSettings } from '../../../../controllers/settings';
import { Tables } from '../../../../types/supabase';
import { showBugReportAlert } from '../../../../utils/bug-report';
import { supabase } from '../../../../utils/supabase';
import Card from '../../../Card';
import LinkButton from '../../../LinkButton';
import Picker from '../../../Picker';
import Text from '../../../Text';
import { ScreenName } from '../../../../constants/screen-names';
import { ScreenNavigationOptions } from '../../../../types/navigation';
import { useProvidedContext } from '../../../../context/ContextProvider';
import TeamSelector from './TeamSelector';

type Tournament = Pick<Tables<'tournaments'>, 'id' | 'name'>;
type Team = Pick<Tables<'teams'>, 'id' | 'name'>;

export const tournamentSelectorScreenOptions: ScreenNavigationOptions<
  ScreenName.TOURNAMENT_SELECTOR
> = ({ navigation }) => ({
  title: 'Select Tournament',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
  }),
  headerRight: () => (
    <LinkButton title="Done" onPress={() => navigation.goBack()} />
  ),
});

const TournamentSelector: FC = () => {
  const network = useNetworkState();

  /**
   * ================
   * > State
   * ================
   */

  // Since the tournament state must be shared with the CreateTrial screen, we store it in a context
  const {
    createTrial: { createTrialState, setCreateTrialState },
  } = useProvidedContext();
  const { tournamentId, teamId } = createTrialState;

  // Database State
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // UI State
  const [teamPickerVisible, setTeamPickerVisible] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingTournaments, setLoadingTournaments] = useState(false);

  /**
   * ================
   * > Data Fetching
   * ================
   */

  // Load the default team from settings into state, if it exists
  // This is loaded optimistically to begin fetching the tournaments as soon as possible
  const loadDefaultTeam = async () => {
    const settings = await getSettings();
    if (settings.schoolAccount.teamId) {
      setCreateTrialState((oldState) => ({
        ...oldState,
        teamId: settings.schoolAccount.teamId,
      }));
    }
  };

  const getTournaments = async (teamId: string) => {
    setLoadingTournaments(true);

    const { data, error } = await supabase
      .from('tournaments')
      .select('id, name')
      .eq('team_id', teamId);

    if (error) {
      showBugReportAlert(
        "There was a problem loading your team's tournaments",
        'Please try again, or contact support.',
        error,
      );
      return;
    }

    setTournaments(data);
    setLoadingTournaments(false);
  };

  useEffect(() => {
    loadDefaultTeam();
  }, []);

  useEffect(() => {
    if (teamId) {
      getTournaments(teamId);
    }
  }, [teamId]);

  /**
   * ================
   * > Event Handlers
   * ================
   */

  const handleTournamentSelect = (tournament: Tournament) => {
    setCreateTrialState((oldState) => ({
      ...oldState,
      tournamentId: tournament.id,
      tournamentName: tournament.name,
    }));
  };

  const handleAddNewTournament = async (name: string) => {
    if (!name.trim() || !teamId) {
      return;
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert({ name, team_id: teamId })
      .select('name, id')
      .single();

    if (error) {
      showBugReportAlert(
        'There was a problem adding a new tournament',
        'Please try again, or contact support.',
        error,
      );
      return;
    }

    // Update the UI, and select the new tournament
    setTournaments([...tournaments, data]);
    setCreateTrialState((oldState) => ({
      ...oldState,
      tournamentId: data.id,
      tournamentName: data.name,
    }));
  };

  if (!network.isConnected) {
    return <TournamentSelectorOffline />;
  }

  /**
   * ================
   * > Component
   * ================
   */

  return (
    <ScrollView style={styles.container}>
      <TeamSelector
        selectedTeamId={teamId}
        setSelectedTeamId={(teamId) =>
          setCreateTrialState((oldState) => ({
            ...oldState,
            teamId,
          }))
        }
      />
      <Card style={styles.tournamentCard}>
        <TournamentList
          tournaments={tournaments}
          selectedTournamentId={tournamentId}
          loading={loadingTournaments}
          onSelectTournament={handleTournamentSelect}
          onAddNewTournament={handleAddNewTournament}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tournamentCard: {
    padding: 0,
  },
  sectionName: {
    fontSize: 16,
    padding: 16,
    color: '#333',
  },
});

export default TournamentSelector;
