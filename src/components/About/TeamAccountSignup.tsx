import { FC, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import TextInput from '../TextInput';
import { validate } from 'email-validator';

import { ScreenProps, useNavigation } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import Button from '../Button';
import Text from '../Text';
import useTheme from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import colors from '../../constants/colors';
import { openSupportEmail, showBugReportAlert } from '../../utils/bug-report';
import Link from '../Link';
import { supabase } from '../../utils/supabase';
import { setSettings } from '../../controllers/settings';
import AddTeam from './AddTeam';

type TeamAccountSignupProps = ScreenProps<ScreenName.TEAM_ACCOUNT_SIGNUP>;

export const teamAccountSignupScreenOptions = {
  title: 'Create School Account',
  headerBackTitle: 'Back',
};

const TeamAccountSignup: FC<TeamAccountSignupProps> = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDark = theme === Theme.DARK;

  const [schoolName, setSchoolName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teams, setTeams] = useState<string[]>(['']);

  const removeTeam = (index: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter((_, i) => i !== index));
    }
  };

  const updateTeam = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  const handleSubmit = async () => {
    // Validation
    if (!schoolName.trim()) {
      Alert.alert('Error', 'Please enter your school name');
      return;
    }
    if (!validate(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (teams.some((t) => !t.trim())) {
      Alert.alert('Error', 'Please fill in all team names');
      return;
    }

    const { error: signUpError, data: user } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      showBugReportAlert(
        'Error',
        'There was a problem creating your account',
        signUpError,
      );
      return;
    }

    const { error: schoolError, data: school } = await supabase
      .from('schools')
      .insert({
        name: schoolName,
        user_id: user?.user?.id ?? '',
      })
      .select('id')
      .single();

    if (schoolError) {
      showBugReportAlert(
        'Error',
        'There was a problem creating your school account',
        schoolError,
      );
    }

    if (!school?.id) {
      showBugReportAlert(
        'Error',
        'There was a problem creating your school account',
        new Error(
          `School ID not returned from insertion ${JSON.stringify(school)}`,
        ),
      );
      return;
    }

    const { error: teamsError, data: createdTeams } = await supabase
      .from('teams')
      .insert(
        teams.map((team) => ({
          name: team,
          school_id: school.id,
        })),
      )
      .select('id, name');

    if (teamsError) {
      showBugReportAlert(
        'Error',
        'There was a problem creating your teams',
        teamsError,
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      showBugReportAlert(
        'Error',
        'Your team account was created, but there was a problem signing in. Please try to sign in to the account, or contact support.',
        signInError,
      );
      return;
    }

    Alert.alert(
      `Successfully created school account for ${schoolName}!`,
      'Please select your team. If you are a coach, you can select any team, then select Coach Mode in settings.',
      createdTeams?.map((team) => ({
        text: team.name,
        onPress: async () => {
          await setSettings({
            schoolAccount: {
              connected: true,
              teamId: team.id,
              coachMode: false,
            },
          });

          // This is a hack because the settings screen will not refresh with the team ID
          navigation.reset({
            index: 0,
            routes: [{ name: ScreenName.HOME }],
          });
        },
      })),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={[styles.scrollView, isDark && styles.scrollViewDark]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Text style={styles.sectionDescription} lightColor="#666">
            Create a shared account for your school&apos;s mock trial
            organization. Everyone will use the same email and password to sign
            in.
          </Text>

          <TextInput
            value={schoolName}
            onChangeText={setSchoolName}
            placeholder="School Name"
            border
            full
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            keyboardType="email-address"
            border
            full
          />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Password"
            border
            full
          />
          <Text style={styles.exampleText} lightColor="#666">
            Password must be at least 6 characters
          </Text>
          <TextInput
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Confirm Password"
            border
            full
          />
        </View>

        {/* Teams Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teams</Text>
          <Text style={styles.sectionDescription} lightColor="#666">
            Add your teams below. When a member signs in, they&apos;ll select
            which team they&apos;re on, and will only see trials for that team.
            You can always add or change teams later.
          </Text>

          <Text style={styles.sectionDescription} lightColor="#666">
            If your school only has one team, members will automatically be
            added to that team.
          </Text>

          {teams.map((team, index) => (
            <View key={index} style={styles.teamRow}>
              <TextInput
                value={team}
                onChangeText={(value) => updateTeam(index, value)}
                placeholder={`Team ${index + 1} name`}
                border
                inline
                autoFocus={false}
              />
              {teams.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeTeam(index)}
                  style={styles.removeButton}
                >
                  <MaterialIcons
                    name="delete"
                    size={23}
                    color={colors.WARNING_RED}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <AddTeam onAdd={(teamName) => setTeams([...teams, teamName])} />
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Link border title="Contact Support" onPress={openSupportEmail} />
          <Button title="Create Account" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  scrollViewDark: {
    backgroundColor: '#000',
  },
  container: {
    paddingBottom: 50,
    paddingTop: 20,
  },
  section: {
    display: 'flex',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    marginTop: 10,
  },
  card: {
    width: '100%',
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  labelSpacing: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#333',
    color: '#fff',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  removeButton: {
    top: 8,
  },
  footer: {
    marginTop: 10,
    padding: 0,
  },
});

export default TeamAccountSignup;
