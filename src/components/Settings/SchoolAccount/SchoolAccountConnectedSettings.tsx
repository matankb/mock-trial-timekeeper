/**
 * The settings for the school account, when the user is signed in to a school account
 */

import { Entypo, Ionicons } from '@expo/vector-icons';
import { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../../../constants/colors';
import { ScreenName } from '../../../constants/screen-names';
import { Theme } from '../../../types/theme';
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
import { usePostHog } from 'posthog-react-native';
import Link from '../../Link';
import { useNavigation } from '../../../types/navigation';

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
  const posthog = usePostHog();
  const navigation = useNavigation();

  // Data State
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [teamPickerVisible, setTeamPickerVisible] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSchoolData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schools')
      .select('name, teams(name, id)')
      .maybeSingle();
    setLoading(false);

    if (error) {
      setError(supabaseDbErrorToReportableError(error));
      posthog.capture('error', {
        message: 'Error fetching school data',
        error: JSON.stringify(error),
      });
      return;
    }

    if (!data) {
      setError(new Error('School data returned as undefined'));
      return;
    }

    setSchoolName(data.name);
    setTeams(data.teams);
  };

  const handleSignOut = async () => {
    supabase.auth.signOut({
      scope: 'local', // sign out on this device only
    });
    await handleSchoolAccountSettingsChange({
      connected: false,
      teamId: null,
      coachMode: false,
    });

    // This is a hack because otherwise,
    // when going back the home screen will not refresh with the team ID
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenName.HOME }],
    });
  };

  useEffect(() => {
    getSchoolData();
  }, [schoolAccountSettings.teamId]);

  const signOutButton = (
    <TouchableOpacity onPress={handleSignOut}>
      <Text style={styles.signOutButton}>Sign Out</Text>
    </TouchableOpacity>
  );

  const team = teams?.find((team) => team.id === schoolAccountSettings.teamId);
  const teamOptions = teams?.map((team) => ({
    label: team.name,
    value: team.id,
  }));

  return (
    <SettingSection title="School Account" headerRight={signOutButton}>
      <Option name="Your School" loading={!schoolName}>
        <Text style={{ fontSize: 16 }}>{schoolName}</Text>
      </Option>
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

      {teams && teamOptions && (
        <Picker
          title="Select Team"
          visible={teamPickerVisible}
          items={teamOptions}
          selected={schoolAccountSettings.teamId ?? undefined}
          onSelect={(teamId) =>
            handleSchoolAccountSettingsChange({
              ...schoolAccountSettings,
              teamId,
            })
          }
          onClose={() => setTeamPickerVisible(false)}
        />
      )}

      <View style={styles.divider} />

      {/* TODO: generalize this toggle setting component */}

      <View style={{ paddingBottom: 10, paddingLeft: 10, paddingRight: 5 }}>
        <Link
          title="Manage School Account"
          inline
          onPress={() => {
            navigation.navigate(ScreenName.SCHOOL_ACCOUNT_MANAGER as never);
          }}
        />
      </View>

      {
        <Option
          name="Coach Mode"
          description="See trials from all teams in your school"
          handlePress={() => {
            handleSchoolAccountSettingsChange({
              ...schoolAccountSettings,
              coachMode: !schoolAccountSettings.coachMode,
            });
          }}
        >
          <Ionicons
            name="checkmark"
            size={24}
            color={colors.HEADER_BLUE}
            style={{
              opacity: schoolAccountSettings.coachMode ? 1 : 0,
            }}
          />
        </Option>
      }

      {error && (
        <View>
          <Text style={styles.error}>
            There was a problem loading your school&apos;s teams. Please try
            again, or contact support.
          </Text>
          <LinkButton
            title="Contact Support"
            onPress={() => {
              openBugReportEmail(error);
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
  signOutButton: {
    color: colors.RED,
    fontSize: 16,
    marginRight: 10,
    marginTop: -1,
  },
  teamName: {
    fontSize: 16,
  },
  error: {
    color: colors.RED,
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
    marginVertical: 10,
  },
});

export default SchoolAccountConnectedSettings;
