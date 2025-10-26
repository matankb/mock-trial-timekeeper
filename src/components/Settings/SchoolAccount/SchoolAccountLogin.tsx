import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { ScreenName } from '../../../constants/screen-names';
import { setSettings } from '../../../controllers/settings';
import { showBugReportAlert } from '../../../utils/bug-report';
import { supabase } from '../../../utils/supabase';
import Button from '../../Button';
import TeamAccountPromo from '../../Home/Promos/TeamAccountPromo';
import colors from '../../../constants/colors';
import { NavigationProp } from '../../../types/navigation';

export const schoolAccountLoginScreenOptions = {
  title: 'Connect School Account',
};

interface SchoolAccountLoginProps {
  navigation: NavigationProp<ScreenName.SCHOOL_ACCOUNT_LOGIN>;
}

const SchoolAccountLogin: FC<SchoolAccountLoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

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

    Alert.alert(
      `Connected to ${school?.name}`,
      'Please select your team',
      teams.map((team) => ({
        text: team.name,
        onPress: () => {
          setSettings({
            schoolAccount: {
              connected: true,
              teamId: team.id,
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

  // Handle an error with fetching team or school data
  const handleAfterLoginError = (error: Error) => {
    showBugReportAlert(
      "You're signed in, but there was a problem loading your team's information.",
      `Error: ${error.message}. Please close and re-open the app, or contact support.`,
      error,
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Team Username"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholderTextColor={colors.PLACEHOLDER_GRAY}
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor={colors.PLACEHOLDER_GRAY}
      />

      {loading ? (
        <ActivityIndicator size="small" color="gray" style={styles.loading} />
      ) : (
        <Button
          title="Connect"
          onPress={handleSignIn}
          disabled={!username || !password}
        />
      )}

      <TeamAccountPromo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  explanation: {
    marginTop: 20,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  form: {
    width: '100%',
    padding: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
  },
});

export default SchoolAccountLogin;
