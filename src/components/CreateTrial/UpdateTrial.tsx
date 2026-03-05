import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';

import { CreateTrialHeaderLeft } from './CreateTrialHeader';
import TrialDetails from './TrialDetails/TrialDetails';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import { CreateTrialState } from '../../context/CreateTrialContext';
import { Theme } from '../../types/theme';
import { validateTrialDetails } from '../../controllers/trial';
import useTheme from '../../hooks/useTheme';
import useTrial from '../../hooks/useTrial';
import { Side } from '../../types/side';
import { showBugReportAlert } from '../../utils/bug-report';
import {
  supabase,
  supabaseDbErrorToReportableError,
} from '../../utils/supabase';
import Button from '../Button';
import Text from '../Text';
import { WitnessSelectorInline } from './TrialDetails/WitnessSelector/WitnessSelectorInline';
import { RoundNumber } from '../../types/round-number';
import AllLossSelector from './AllLossSelector';
import { useProvidedContext } from '../../context/ContextProvider';
import { useSettings } from '../../hooks/useSettings';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { useLeagueFeatureFlag } from '../../hooks/useLeague';
import { LeagueFeature } from '../../constants/leagues';
import TextInput from '../TextInput';
import { useUploadTrial } from '../../hooks/useUploadTrial';
export interface UpdateTrialRouteProps {
  trialId: string;
  isBeforeUpload?: boolean;
  onlyWitnessesMissing?: boolean;
}

export const updateTrialScreenOptions: ScreenNavigationOptions<
  ScreenName.UPDATE_TRIAL
> = ({ navigation }) => ({
  title: 'Edit Trial',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerLeft: () => <CreateTrialHeaderLeft navigation={navigation} />,
  }),
});

const UpdateTrial: FC<ScreenProps<ScreenName.UPDATE_TRIAL>> = ({
  navigation,
  route,
}) => {
  const [trial, setTrial] = useTrial(route.params?.trialId);
  const theme = useTheme();

  const witnessSelectionEnabled = useLeagueFeatureFlag(
    LeagueFeature.WITNESS_SELECTION,
  );

  const isBeforeUpload = route.params?.isBeforeUpload;

  // Create Trial State
  const { settings } = useSettings();
  const [name, setName] = useState(trial.name);
  const [allLossTime, setAllLossTime] = useState(trial.loss);

  // Trial Details State
  // If school account is not connected, these are not used
  const [round, setRound] = useState<RoundNumber | null>(null);
  const [side, setSide] = useState<Side | null>(null);
  const {
    createTrial: { createTrialState, setCreateTrialState },
  } = useProvidedContext();

  // UI state
  const [tournamentLoading, setTournamentLoading] = useState(false);

  // Load the trial details into the local state
  useEffect(() => {
    setName(trial.name);

    if (trial.details) {
      setRound(trial.details.round);
      setSide(trial.details.side);
    }
  }, [trial]);

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
  }, [trial, setCreateTrialState]);

  // Load the tournament details from the db into the context
  const loadTournament = useCallback(async () => {
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
        supabaseDbErrorToReportableError(error),
      );
      return;
    }

    setCreateTrialState((oldState) => ({
      ...oldState,
      tournamentName: data.name,
      teamId: data.team_id,
    }));

    setTournamentLoading(false);
  }, [
    settings,
    trial.details?.tournamentId,
    setCreateTrialState,
    setTournamentLoading,
  ]);

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

    if (settings.schoolAccount.connected) {
      newTrial.details = {
        ...trial.details,
        tournamentId: createTrialState.tournamentId,
        round: round,
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

  const { handleUpload, uploading } = useUploadTrial({ trial: mergedTrial });

  const handleSavePress = useCallback(async () => {
    setTrial(mergedTrial);

    if (!isBeforeUpload) {
      navigation.goBack(); // close modal
      return;
    }

    // This should not happen, since save button is disabled if trial details are not valid
    if (!validateTrialDetails(mergedTrial, false)) {
      Alert.alert('Please fill out all trial details before uploading');
      return;
    }

    // Upload the trial to the dashboard
    await handleUpload();

    Alert.alert('Trial uploaded!', '', [
      {
        text: 'Close',
        style: 'cancel',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  }, [mergedTrial, isBeforeUpload, navigation, setTrial, handleUpload]);

  const trialDetailsValid = useMemo(() => {
    const validForUpload = validateTrialDetails(mergedTrial, false);
    const validWithWitnesses = validateTrialDetails(mergedTrial, true);

    return {
      validForUpload,
      validWithWitnesses,
    };
  }, [mergedTrial]);

  const showWitnessSelector =
    !settings.schoolAccount.connected && witnessSelectionEnabled;

  return (
    <ScrollView
      style={{
        ...(theme === Theme.DARK && {
          backgroundColor: colors.BACKGROUND_GRAY,
        }),
      }}
      contentContainerStyle={styles.container}
    >
      {route.params.isBeforeUpload && (
        <Text style={styles.unfinishedDetailsWarning}>
          {route.params.onlyWitnessesMissing ? (
            // TODO: better copy here...
            <Text style={{ fontWeight: 'normal' }}>
              <Text style={{ fontWeight: 'bold' }}>
                Do you want to select the witnesses that were called?&nbsp;
              </Text>{' '}
              It is optional, but can be helpful for your teammates to find
              their times.
            </Text>
          ) : (
            'Please finish setting up your trial before uploading to your school'
          )}
        </Text>
      )}

      <TextInput value={name} onChangeText={setName} />
      {settings.schoolAccount.connected && (
        <TrialDetails
          navigation={navigation}
          tournamentLoading={tournamentLoading}
          side={side}
          round={round}
          setSide={setSide}
          setRound={setRound}
          showWarnings={!!route.params.isBeforeUpload}
        />
      )}
      {!isBeforeUpload && trial.setup.allLossEnabled && (
        <AllLossSelector
          allLossTime={allLossTime}
          setAllLossTime={setAllLossTime}
        />
      )}
      {showWitnessSelector && <WitnessSelectorInline league={trial.league} />}
      {isBeforeUpload && !uploading && (
        <Button
          title={
            route.params?.isBeforeUpload
              ? route.params.onlyWitnessesMissing &&
                !trialDetailsValid.validWithWitnesses
                ? 'Upload With Missing Witnesses'
                : 'Save and Upload'
              : 'Save'
          }
          disabled={!trialDetailsValid.validForUpload}
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
    ...Platform.select({
      web: {
        width: 800,
        marginHorizontal: 'auto',
      },
    }),
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
