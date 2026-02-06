import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import colors from '../../../constants/colors';
import { ScreenName } from '../../../constants/screen-names';
import { Tables } from '../../../types/supabase';
import { ScreenNavigationOptions } from '../../../types/navigation';
import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../../utils/supabase';
import {
  openSupportEmail,
  showBugReportAlert,
} from '../../../utils/bug-report';
import Text from '../../Text';
import Link from '../../Link';
import { usePostHog } from 'posthog-react-native';

export const schoolAccountManagerScreenOptions: ScreenNavigationOptions<ScreenName.SCHOOL_ACCOUNT_MANAGER> =
  {
    title: 'Manage School Account',
  };

type Team = Pick<Tables<'teams'>, 'name' | 'id'>;

const SchoolAccountManager: FC = () => {
  const posthog = usePostHog();

  const [teams, setTeams] = useState<Team[] | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('schools')
      .select('id, teams(name, id)')
      .maybeSingle();

    setLoading(false);

    if (error) {
      showBugReportAlert(
        'There was a problem loading your teams',
        'Please try again later, or contact support.',
        supabaseDbErrorToReportableError(error),
      );
      posthog.capture('error', {
        message: 'Error fetching teams in manager',
        error: JSON.stringify(error),
      });
      return;
    }

    if (!data) {
      showBugReportAlert(
        'There was a problem loading your teams',
        'Please try again later, or contact support.',
        new Error('School data returned as undefined'),
      );
      return;
    }

    setSchoolId(data.id);
    setTeams(data.teams);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleRenameTeam = async (teamId: string, currentName: string) => {
    Alert.prompt(
      'Rename Team',
      'Enter a new name for this team',
      async (newName) => {
        if (!newName || newName.trim() === '') {
          Alert.alert('Error', 'Team name cannot be empty');
          return;
        }

        if (newName.trim() === currentName) {
          return;
        }

        const { error } = await supabase
          .from('teams')
          .update({ name: newName.trim() })
          .eq('id', teamId);

        if (error) {
          Alert.alert('Error', 'Failed to rename team. Please try again.');
          posthog.capture('error', {
            message: 'Error renaming team',
            error: JSON.stringify(error),
          });
          return;
        }

        // Update local state
        setTeams(
          (prevTeams) =>
            prevTeams?.map((team) =>
              team.id === teamId ? { ...team, name: newName.trim() } : team,
            ) ?? null,
        );
      },
      'plain-text',
      currentName,
    );
  };

  const handleAddTeam = () => {
    if (!schoolId) {
      Alert.alert('Error', 'School ID not found. Please try again.');
      return;
    }

    Alert.prompt(
      'Add Team',
      'Enter a name for the new team',
      async (teamName) => {
        if (!teamName || teamName.trim() === '') {
          Alert.alert('Error', 'Team name cannot be empty');
          return;
        }

        const { data, error } = await supabase
          .from('teams')
          .insert({ name: teamName.trim(), school_id: schoolId })
          .select('id, name')
          .single();

        if (error) {
          showBugReportAlert(
            'Error',
            'There was a problem creating your team. Please try again.',
            supabaseDbErrorToReportableError(error),
          );
          return;
        }

        // Update local state
        setTeams((prevTeams) => [...(prevTeams ?? []), data]);
      },
      'plain-text',
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.HEADER_BLUE} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.teamsList}>
          {teams?.map((team) => (
            <TouchableOpacity
              key={team.id}
              style={styles.teamItem}
              onPress={() => handleRenameTeam(team.id, team.name)}
            >
              <Text style={styles.teamName}>{team.name}</Text>
              <MaterialIcons name="edit" size={20} color="gray" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addTeamButton}
            onPress={handleAddTeam}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={colors.HEADER_BLUE}
            />
            <Text style={styles.addTeamText}>Add Team</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Link title="Need help? Contact Support" onPress={openSupportEmail} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.RED,
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  teamsList: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  teamName: {
    fontSize: 16,
    flex: 1,
  },
  addTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  addTeamText: {
    fontSize: 16,
    color: colors.HEADER_BLUE,
  },
});

export default SchoolAccountManager;
