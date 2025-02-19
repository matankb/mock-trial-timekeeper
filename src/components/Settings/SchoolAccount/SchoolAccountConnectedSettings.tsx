/**
 * The settings for the school account, when the user is signed in to a school account
 */

import { Entypo } from '@expo/vector-icons';
import { PostgrestError } from '@supabase/supabase-js';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../../../constants/colors';
import { Theme } from '../../../context/ThemeContext';
import { SettingsSchoolAccount } from '../../../controllers/settings';
import useTheme from '../../../hooks/useTheme';
import { Tables } from '../../../types/supabase';
import { openBugReportEmail } from '../../../utils/bug-report';
import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../../utils/supabase';
import LinkButton from '../../LinkButton';
import Picker from '../../Picker';
import Text from '../../Text';
import Option from '../Option';
import SettingSection from '../SettingSection';

type Team = Pick<Tables<'teams'>, 'name' | 'id'>;

interface SchoolAccountConnectedSettingsProps {
  schoolAccountSettings: SettingsSchoolAccount;
  handleSchoolAccountSettingsChange: (
    schoolAccount: SettingsSchoolAccount,
  ) => void;
}

const SchoolAccountConnectedSettings: FC<
  SchoolAccountConnectedSettingsProps
> = ({ schoolAccountSettings, handleSchoolAccountSettingsChange }) => {
  const theme = useTheme();

  // Data State
  const [schoolName, setSchoolName] = useState('Your school');
  const [teams, setTeams] = useState<Team[] | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [teamPickerVisible, setTeamPickerVisible] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const getSchoolData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schools')
      .select('name, teams(name, id)')
      .maybeSingle();
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    setSchoolName(data.name);
    setTeams(data.teams);
  };

  const handleSignOut = () => {
    supabase.auth.signOut({
      scope: 'local', // sign out on this device only
    });
    handleSchoolAccountSettingsChange({ connected: false, teamId: null });
  };

  useEffect(() => {
    getSchoolData();
  }, [schoolAccountSettings.teamId]);

  const signOutButton = (
    <LinkButton title="Sign Out" color={colors.RED} onPress={handleSignOut} />
  );

  const team = teams?.find((team) => team.id === schoolAccountSettings.teamId);
  const teamOptions = teams?.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  return (
    <SettingSection
      title="School Account"
      description={`Connected to ${schoolName}`}
      headerRight={signOutButton}
    >
      <Option
        name="Your Team"
        handlePress={() => setTeamPickerVisible(true)}
        loading={loading}
      >
        <View style={styles.teamWrapper}>
          <Text style={styles.teamName}>{team?.name}</Text>
          <Entypo
            name="chevron-small-down"
            size={24}
            color={theme === Theme.DARK ? 'lightgray' : 'gray'}
          />
        </View>
      </Option>

      {teams && (
        <Picker
          title="Select Team"
          visible={teamPickerVisible}
          items={teamOptions}
          selected={schoolAccountSettings.teamId}
          onSelect={(teamId) =>
            handleSchoolAccountSettingsChange({
              connected: true,
              teamId,
            })
          }
          onClose={() => setTeamPickerVisible(false)}
        />
      )}

      {error && (
        <View>
          <Text style={styles.error}>
            There was a problem loading your school's teams. Please try again,
            or contact support.
          </Text>
          <LinkButton
            title="Contact Support"
            onPress={() => {
              openBugReportEmail(supabaseDbErrorToReportableError(error));
            }}
          />
        </View>
      )}
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  teamWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  teamName: {
    fontSize: 16,
  },
  error: {
    color: colors.RED,
    padding: 10,
  },
});

export default SchoolAccountConnectedSettings;
