import { FC, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ScreenName } from '../../../constants/screen-names';
import { setSettings } from '../../../controllers/settings';
import { showBugReportAlert } from '../../../utils/bug-report';
import { supabase } from '../../../utils/supabase';
import Button from '../../Button';
import TeamAccountPromo from '../../Home/Promos/TeamAccountPromo';
import colors from '../../../constants/colors';
import { NavigationProp } from '../../../types/navigation';
import useTheme from '../../../hooks/useTheme';
import { Theme } from '../../../types/theme';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '../../Text';

export const schoolAccountLoginScreenOptions = {
  title: 'Connect School Account',
};

interface SchoolAccountLoginProps {
  navigation: NavigationProp<ScreenName.SCHOOL_ACCOUNT_LOGIN>;
}

const SchoolAccountLogin: FC<SchoolAccountLoginProps> = ({ navigation }) => {
  const theme = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [schoolName, setSchoolName] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) {
      setLoading(false);

      // Handle invalid credentials separately, since this a common, expected error
      const isInvalidCredentials =
        error.message === 'Invalid login credentials';

      const message = isInvalidCredentials
        ? 'Incorrect username or password'
        : 'There was a problem connecting to your school account.';

      const subtitle = isInvalidCredentials
        ? 'Please check your credentials and try again, or contact support.'
        : `Error: ${error.message}. Please try again or contact support.`;

      showBugReportAlert(message, subtitle, error);
      return;
    }

    // Then get the teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name');

    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('name')
      .single();

    const afterLoginError = teamsError || schoolError;
    if (afterLoginError) {
      handleAfterLoginError(afterLoginError);
      return;
    }

    setLoading(false);

    // Set school name for display
    setSchoolName(school?.name || null);

    if (teams.length === 1) {
      setSettings({
        schoolAccount: {
          connected: true,
          teamId: teams[0].id,
          coachMode: false,
        },
      });

      Alert.alert(`Connected to ${school?.name}!`, '', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: ScreenName.HOME }],
            });
          },
        },
      ]);

      return;
    }

    // Multiple teams - set first team as default and show selection UI
    if (teams.length > 0) {
      // Set first team as default
      setSettings({
        schoolAccount: {
          connected: true,
          teamId: teams[0].id,
          coachMode: false,
        },
      });

      // Show team selection UI
      setTeams(teams);
      setShowTeamSelection(true);
    }
  };

  // Handle an error with fetching team or school data
  const handleAfterLoginError = (error: Error) => {
    setLoading(false);
    showBugReportAlert(
      "You're signed in, but there was a problem loading your team's information.",
      `Error: ${error.message}. Please close and re-open the app, or contact support.`,
      error,
    );
  };

  const handleTeamSelect = (teamId: string) => {
    setSettings({
      schoolAccount: {
        connected: true,
        teamId,
        coachMode: false,
      },
    });

    // This is a hack because the settings screen will not refresh with the team ID
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenName.HOME }],
    });
  };

  const handleCoachModeSelect = () => {
    // Set first team as default, but enable coach mode
    const firstTeamId = teams.length > 0 ? teams[0].id : null;
    setSettings({
      schoolAccount: {
        connected: true,
        teamId: firstTeamId,
        coachMode: true,
      },
    });

    // This is a hack because the settings screen will not refresh with the team ID
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenName.HOME }],
    });
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY,
      color: theme === Theme.LIGHT ? 'black' : 'white',
      borderColor: theme === Theme.LIGHT ? '#e0e0e0' : '#3a3a3c',
    },
  ];

  const scrollViewStyle = [
    styles.scrollView,
    {
      backgroundColor:
        theme === Theme.LIGHT ? '#f5f5f7' : colors.BACKGROUND_GRAY,
    },
  ];

  const banner = (
    <View style={styles.heroSection}>
      <View style={styles.iconRow}>
        <View style={[styles.iconContainer, styles.appIconContainer]}>
          <Image
            source={require('../../../../assets/icon-transparent.png')}
            style={styles.appIcon}
          />
        </View>
        <View style={styles.plusContainer}>
          <MaterialIcons
            name="add"
            size={24}
            color={theme === Theme.LIGHT ? '#999' : '#666'}
          />
        </View>
        <View style={[styles.iconContainer, styles.teamIconContainer]}>
          <MaterialIcons name="people" size={44} color={colors.GREEN} />
        </View>
      </View>
    </View>
  );

  if (showTeamSelection) {
    return (
      <ScrollView
        style={scrollViewStyle}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {banner}
        <View style={styles.section}>
          <Text style={styles.teamSelectionTitle}>
            Connected to {schoolName}
          </Text>
          <Text style={styles.teamSelectionSubtitle}>
            Please select your team
          </Text>

          <View
            style={[
              styles.teamsList,
              {
                backgroundColor:
                  theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY,
              },
            ]}
          >
            {[...teams]
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((team, index) => (
                <TouchableOpacity
                  key={team.id}
                  style={[
                    styles.teamItem,
                    index < teams.length - 1 && styles.teamItemBorder,
                    {
                      borderBottomColor:
                        theme === Theme.LIGHT ? '#f0f0f0' : '#3a3a3c',
                    },
                  ]}
                  onPress={() => handleTeamSelect(team.id)}
                >
                  <Text style={styles.teamName}>{team.name}</Text>
                </TouchableOpacity>
              ))}

            <TouchableOpacity
              style={[
                styles.coachModeItem,
                {
                  borderTopColor: theme === Theme.LIGHT ? '#f0f0f0' : '#3a3a3c',
                },
              ]}
              onPress={handleCoachModeSelect}
            >
              <View style={styles.coachModeContent}>
                <Text style={styles.coachModeText}>Coach Mode</Text>
                <Text style={styles.coachModeDescription}>
                  See trials from all teams in your school
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={scrollViewStyle}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {banner}

      <TextInput
        style={inputStyle}
        value={username}
        onChangeText={setUsername}
        placeholder="School Username"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholderTextColor={colors.PLACEHOLDER_GRAY}
      />

      <TextInput
        style={inputStyle}
        value={password}
        onChangeText={setPassword}
        placeholder="School Password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        placeholderTextColor={colors.PLACEHOLDER_GRAY}
      />

      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.BLUE}
          style={styles.loading}
        />
      ) : (
        <Button
          title="Connect"
          onPress={handleSignIn}
          disabled={!username || !password}
          style={styles.button}
        />
      )}

      <TeamAccountPromo />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  appIconContainer: {
    backgroundColor: 'rgba(24, 93, 184, 0.12)',
  },
  appIcon: {
    width: 65,
    aspectRatio: 1,
  },
  plusContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamIconContainer: {
    backgroundColor: 'rgba(21, 158, 113, 0.12)',
  },
  input: {
    padding: 15,
    fontSize: 16,
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 0,
    // borderColor: '#e0e0e0',
  },
  button: {
    width: '90%',
    marginTop: 25,
    marginBottom: 5,
  },
  loading: {
    marginTop: 30,
    marginBottom: 10,
  },
  section: {
    padding: 20,
  },
  teamSelectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  teamSelectionSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  teamsList: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  teamItemBorder: {
    borderBottomWidth: 1,
  },
  teamName: {
    fontSize: 16,
    flex: 1,
  },
  coachModeItem: {
    padding: 15,
    borderTopWidth: 1,
  },
  coachModeContent: {
    flex: 1,
  },
  coachModeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  coachModeDescription: {
    fontSize: 14,
    marginTop: 3,
    color: 'gray',
  },
});

export default SchoolAccountLogin;
