import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '../../../Card';
import { FC, useEffect, useState } from 'react';
import Text from '../../../Text';
import { supabase } from '../../../../utils/supabase';
import { showBugReportAlert } from '../../../../utils/bug-report';
import { getSettings } from '../../../../controllers/settings';
import { Tables } from '../../../../types/supabase';
import Picker from '../../../Picker';
import { Entypo } from '@expo/vector-icons';
import colors from '../../../../constants/colors';

type Team = Pick<Tables<'teams'>, 'id' | 'name'>;

interface TeamSelectorProps {
  selectedTeamId: string | null;
  setSelectedTeamId: (teamId: string) => void;
}

const TeamSelector: FC<TeamSelectorProps> = ({
  selectedTeamId,
  setSelectedTeamId,
}) => {
  const [teamPickerVisible, setTeamPickerVisible] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  const getTeams = async () => {
    setLoadingTeams(true);
    const { data, error } = await supabase.from('teams').select('id, name');
    setLoadingTeams(false);

    if (error) {
      showBugReportAlert(
        'There was a problem loading your teams',
        'Please try again, or contact support.',
        error,
      );
      return;
    }

    setTeams(data);

    // If the default teamId is not set, select the first team
    // Use getSettings directly to avoid race conditions with `loadDefaultTeam`
    const settings = await getSettings();
    if (!settings.schoolAccount.teamId) {
      setSelectedTeamId(data[0].id);
    }
  };

  const teamPicker = (
    <Picker
      title="Select Team"
      visible={teamPickerVisible}
      onClose={() => setTeamPickerVisible(false)}
      items={teams.map((team) => ({
        label: team.name,
        value: team.id,
      }))}
      selected={selectedTeamId ?? undefined}
      onSelect={(value) => setSelectedTeamId(value)}
    />
  );

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <Card onPress={() => setTeamPickerVisible(true)} style={styles.teamCard}>
      <Text style={styles.sectionName}>Your Team</Text>
      <View>
        {loadingTeams ? (
          <ActivityIndicator size="small" color="gray" />
        ) : (
          <TouchableOpacity style={styles.teamSelector}>
            <Text
              style={[
                styles.teamName,
                !selectedTeamId && styles.placeholderText,
              ]}
            >
              {teams.find((team) => team.id === selectedTeamId)?.name ||
                'Select a team'}
            </Text>
            <Entypo
              name="chevron-small-down"
              size={25}
              color={colors.HEADER_BLUE}
            />
          </TouchableOpacity>
        )}
      </View>

      {teamPicker}
    </Card>
  );
};

const styles = StyleSheet.create({
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  sectionName: {
    fontSize: 16,
    padding: 16,
    color: '#333',
  },
  teamSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  teamName: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
});

export default TeamSelector;
