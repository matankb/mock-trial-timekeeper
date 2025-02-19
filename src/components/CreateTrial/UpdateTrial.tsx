import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, View, StyleSheet, Alert } from 'react-native';

import {
  CreateTrialHeaderRight,
  CreateTrialHeaderLeft,
} from './CreateTrialHeader';
import TrialDetails from './TrialDetails/TrialDetails';
import TrialNameInput from './TrialNameInput';
import { RouteProps } from '../../Navigation';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import {
  CreateTrialContext,
  emptyCreateTrialState,
} from '../../context/CreateTrialContext';
import { Theme } from '../../context/ThemeContext';
import { Settings, getSettings } from '../../controllers/settings';
import {
  uploadTrialToSchoolAccount,
  validateTrialDetails,
} from '../../controllers/trial';
import useTheme from '../../hooks/useTheme';
import useTrial from '../../hooks/useTrial';
import { Side } from '../../types/side';
import { openBugReportEmail, showBugReportAlert } from '../../utils/bug-report';
import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../utils/supabase';
import Button from '../Button';
import Text from '../Text';

type UpdateTrialProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.UPDATE_TRIAL
>;

export interface UpdateTrialRouteProps {
  trialId: string;
  isBeforeUpload?: boolean;
}

export const updateTrialScreenOptions = ({
  navigation,
}): NativeStackNavigationOptions => ({
  title: 'Edit Trial',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerLeft: () => <CreateTrialHeaderLeft navigation={navigation} />,
    headerRight: () => (
      <CreateTrialHeaderRight flexEnabled={false} onFlexToggle={() => {}} />
    ),
  }),
});

const UpdateTrial: FC<UpdateTrialProps> = ({ navigation, route }) => {
  const [trial, setTrial] = useTrial(route.params?.trialId);
  const theme = useTheme();

  const isBeforeUpload = route.params?.isBeforeUpload;

  // Create Trial State
  const [settings, setSettings] = useState<Settings>(null);
  const [name, setName] = useState(trial.name);
  const [flexEnabled, setFlexEnabled] = React.useState(false);

  // Trial Details State
  // If school account is not connected, these are not used
  const [round, setRound] = useState<number | null>(null);
  const [side, setSide] = useState<Side | null>(null);
  const [createTrialState, setCreateTrialState] =
    useContext(CreateTrialContext);

  // UI state
  const [tournamentLoading, setTournamentLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load the trial details into the local state
  useEffect(() => {
    setName(trial.name);

    if (trial.details) {
      setRound(trial.details.round);
      setSide(trial.details.side);
    }
  }, [trial]);

  // Load settings
  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  // Reset the context state on load
  useEffect(() => {
    if (trial.details) {
      setCreateTrialState((oldState) => {
        const isSameTournament =
          oldState.tournamentId === trial.details.tournamentId;
        return {
          ...oldState,
          pWitnessCall: trial.details.witnesses.p,
          dWitnessCall: trial.details.witnesses.d,
          tournamentId: trial.details.tournamentId,

          // reset the tournament name and team id if the tournament has changed
          // this will trigger a loadTournament call
          tournamentName: isSameTournament ? oldState.tournamentName : null,
          teamId: isSameTournament ? oldState.teamId : null,
        };
      });
    } else {
      setCreateTrialState(emptyCreateTrialState);
    }
  }, [trial]);

  // Load the tournament details from the db into the context
  const loadTournament = async () => {
    if (!settings.schoolAccount.connected || !trial.details?.tournamentId) {
      return;
    }

    setTournamentLoading(true);
    const { data, error } = await supabase
      .from('tournaments')
      .select('name, team_id')
      .eq('id', trial.details?.tournamentId)
      .single();

    if (error) {
      showBugReportAlert(
        'Error loading tournament information',
        'Please make sure you are connected to the internet and try again, or contact support',
        error,
      );
      return;
    }

    setCreateTrialState((oldState) => ({
      ...oldState,
      tournamentName: data.name,
      teamId: data.team_id,
    }));

    setTournamentLoading(false);
  };

  useEffect(() => {
    if (!trial.details?.tournamentId) {
      return;
    }

    // If we already have the tournament name, don't load it again
    if (createTrialState.tournamentName) {
      return;
    }

    loadTournament();
  }, [
    trial.details?.tournamentId,
    createTrialState.teamId,
    createTrialState.tournamentName,
  ]);

  // Hydrate controls
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CreateTrialHeaderRight
          onFlexToggle={() => setFlexEnabled(!flexEnabled)}
          flexEnabled={flexEnabled}
        />
      ),
    });
  }, [setFlexEnabled, flexEnabled]);

  // Merge the existing trial with the new data
  const mergedTrial = useMemo(() => {
    const newTrial = {
      ...trial,
      name,
      details: {
        ...trial.details,
        tournamentId: createTrialState.tournamentId,
        round,
        side,
        witnesses: {
          p: createTrialState.pWitnessCall,
          d: createTrialState.dWitnessCall,
        },
      },
    };

    return newTrial;
  }, [
    trial,
    name,
    round,
    side,
    createTrialState.dWitnessCall,
    createTrialState.pWitnessCall,
  ]);

  const handleSavePress = useCallback(async () => {
    setTrial(mergedTrial);

    if (!isBeforeUpload) {
      navigation.goBack(); // close modal
      return;
    }

    // Upload the trial to the dashboard
    setUploading(true);
    const { error } = await uploadTrialToSchoolAccount(trial);
    setUploading(false);

    if (error) {
      Alert.alert(
        'There was a problem uploading your trial',
        'Make sure you are connected to the internet and try again, or contact support.',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
          {
            text: 'Contact Support',
            onPress: () => {
              const reportableError = supabaseDbErrorToReportableError(error);
              openBugReportEmail(reportableError);
            },
          },
        ],
      );
    } else {
      Alert.alert('Trial uploaded!', '', [
        {
          text: 'Close',
          style: 'cancel',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  }, [mergedTrial]);

  const trialDetailsValid = useMemo(() => {
    const valid = validateTrialDetails(mergedTrial);
    return valid;
  }, [mergedTrial]);

  if (!settings) {
    return null;
  }

  return (
    <View
      style={{
        ...styles.container,
        ...(theme === Theme.DARK && {
          backgroundColor: colors.BACKGROUND_GRAY,
        }),
      }}
    >
      <View>
        {flexEnabled && (
          <Text style={styles.flexEnabled}>Swing time enabled</Text>
        )}
        {route.params.isBeforeUpload && (
          <Text style={styles.unfinishedDetailsWarning}>
            Please finish setting up your trial before uploading to your school
            account
          </Text>
        )}
        <TrialNameInput name={name} setName={setName} autoFocus={false} />
        {settings.schoolAccount.connected && (
          <TrialDetails
            navigation={navigation}
            tournamentLoading={tournamentLoading}
            side={side}
            round={round}
            setSide={setSide}
            setRound={setRound}
            showWarnings={route.params.isBeforeUpload}
          />
        )}
        {isBeforeUpload && !uploading && (
          <Button
            title={route.params?.isBeforeUpload ? 'Save and Upload' : 'Save'}
            disabled={!trialDetailsValid}
            onPress={handleSavePress}
          />
        )}
        {isBeforeUpload && uploading && (
          <Button title="Uploading..." disabled onPress={() => {}} />
        )}
        {!isBeforeUpload && <Button title="Save" onPress={handleSavePress} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 30,
  },
  flexEnabled: {
    color: 'gray',
    marginTop: 13,
    marginBottom: -10,
    fontSize: 16,
    textAlign: 'center',
  },
  unfinishedDetailsWarning: {
    backgroundColor: '#fff7c2',
    borderColor: '#f2d930',
    borderWidth: 1,
    // color: 'gray',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    width: '90%',
    marginHorizontal: 'auto',
    marginTop: 20,
    fontSize: 16,
  },
});

export default UpdateTrial;
