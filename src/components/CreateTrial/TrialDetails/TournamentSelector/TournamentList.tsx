import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import AddTournament from './AddTournament';
import colors from '../../../../constants/colors';
import { Tables } from '../../../../types/supabase';
import Text from '../../../Text';

type Tournament = Pick<Tables<'tournaments'>, 'id' | 'name'>;

interface TournamentListProps {
  tournaments: Tournament[];
  selectedTournamentId?: string;
  loading?: boolean;
  onSelectTournament: (tournament: Tournament) => void;
  onAddNewTournament: (name: string) => void;
}

const TournamentList: FC<TournamentListProps> = ({
  tournaments,
  selectedTournamentId,
  loading,
  onSelectTournament,
  onAddNewTournament,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="gray" />
      </View>
    );
  }

  if (tournaments.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No tournaments yet</Text>
        <AddTournament onAddNewTournament={onAddNewTournament} />
      </View>
    );
  }

  return (
    <>
      {tournaments.map((tournament) => (
        <TouchableOpacity
          key={tournament.id}
          style={styles.tournamentItem}
          onPress={() => onSelectTournament(tournament)}
        >
          <Text
            style={[
              styles.tournamentText,
              selectedTournamentId === tournament.id &&
                styles.selectedTournamentText,
            ]}
          >
            {tournament.name}
          </Text>
          {selectedTournamentId === tournament.id && (
            <MaterialIcons name="check" size={20} color={colors.HEADER_BLUE} />
          )}
        </TouchableOpacity>
      ))}
      <AddTournament onAddNewTournament={onAddNewTournament} />
    </>
  );
};

const styles = StyleSheet.create({
  tournamentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tournamentText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTournamentText: {
    color: colors.HEADER_BLUE,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateContainer: {
    display: 'flex',
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
});

export default TournamentList;
