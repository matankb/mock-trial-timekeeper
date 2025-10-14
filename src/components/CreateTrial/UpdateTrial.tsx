import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, StyleSheet, Alert, ScrollView } from 'react-native';

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
  CreateTrialState,
} from '../../context/CreateTrialContext';
import { Theme } from '../../types/theme';
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
import { WitnessSelectorInline } from './TrialDetails/WitnessSelector/WitnessSelectorInline';
import { FLEX_TIMING_ENABLED } from '../../constants/feature-flags';
import { RoundNumber } from '../../types/round-number';
import AllLossSelector from './AllLossSelector';

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
    headerRight: FLEX_TIMING_ENABLED
      ? () => (
          <CreateTrialHeaderRight flexEnabled={false} onFlexToggle={() => {}} />
        )
      : undefined,
  }),
});

const UpdateTrial: FC<UpdateTrialProps> = ({ navigation, route }) => {
  const [trial, setTrial] = useTrial(route.params?.trialId);
  const theme = useTheme();

  const isBeforeUpload = route.params?.isBeforeUpload;

  // Create Trial State
  const [settings, setSettings] = useState<Settings | null>(null);
  const [name, setName] = useState(trial.name);
  const [flexEnabled, setFlexEnabled] = React.useState(false);
  const [allLossTime, setAllLossTime] = useState(trial.loss);

  // Trial Details State
  // If school account is not connected, these are not used
  const [round, setRound] = useState<RoundNumber | null>(null);
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
    setCreateTrialState((oldState) => {
      const isSameTournament =
        oldState.tournamentId === trial.details?.tournamentId;

      return {
        ...oldState,
        pWitnessCall: trial.witnesses.p,
        dWitnessCall: trial.witnesses.d,
        tournamentId: trial.details?.tournamentId ?? null,

        // reset the tournament name and team id if the tournament has changed
        // this will trigger a loadTournament call
        tournamentName: isSameTournament ? oldState.tournamentName : null,
        teamId: isSameTournament ? oldState.teamId : null,
      } satisfies CreateTrialState;
    });
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
    loadTournament,
  ]);

  // Hydrate controls
  useEffect(() => {
    navigation.setOptions({
      headerRight: FLEX_TIMING_ENABLED
        ? () => (
            <CreateTrialHeaderRight
              onFlexToggle={() => setFlexEnabled(!flexEnabled)}
              flexEnabled={flexEnabled}
            />
          )
        : undefined,
    });
  }, [setFlexEnabled, flexEnabled, navigation]);

  // Merge the existing trial with the new data
  const mergedTrial = useMemo(() => {
    const newTrial = {
      ...trial,
      name,
      loss: allLossTime,
      witnesses: {
        p: createTrialState.pWitnessCall,
        d: createTrialState.dWitnessCall,
      },
    };

    if (settings?.schoolAccount?.connected) {
      newTrial.details = {
        ...trial.details,
        tournamentId: createTrialState.tournamentId,
        round,
        side,
      };
    }

    return newTrial;
  }, [
    trial,
    name,
    round,
    side,
    createTrialState.dWitnessCall,
    createTrialState.pWitnessCall,
    settings,
    createTrialState.tournamentId,
    allLossTime,
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
  }, [mergedTrial, isBeforeUpload, navigation, setTrial]);

  const trialDetailsValid = useMemo(() => {
    const valid = validateTrialDetails(mergedTrial);
    return valid;
  }, [mergedTrial]);

  if (!settings) {
    return null;
  }

  return (
    <ScrollView
      style={{
        ...(theme === Theme.DARK && {
          backgroundColor: colors.BACKGROUND_GRAY,
        }),
      }}
      contentContainerStyle={styles.container}
    >
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
      {!isBeforeUpload && trial.setup.allLossEnabled && (
        <AllLossSelector
          allLossTime={allLossTime}
          setAllLossTime={setAllLossTime}
        />
      )}
      {!settings.schoolAccount.connected && <WitnessSelectorInline />}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
