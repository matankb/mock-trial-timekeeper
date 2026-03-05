import React, { FC, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';

import AllLossSelector from './AllLossSelector';
import TrialDetails from './TrialDetails/TrialDetails';
import { WitnessSelectorInline } from './TrialDetails/WitnessSelector/WitnessSelectorInline';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import { emptyCreateTrialState } from '../../context/CreateTrialContext';
import { Theme } from '../../types/theme';
import { createNewTrial } from '../../controllers/trial';
import useTheme from '../../hooks/useTheme';
import { Side } from '../../types/side';
import Button from '../Button';
import { RoundNumber } from '../../types/round-number';
import { useProvidedContext } from '../../context/ContextProvider';
import { useSettings } from '../../hooks/useSettings';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { CreateTrialHeaderLeft } from './CreateTrialHeader';
import { LeagueFeature } from '../../constants/leagues';
import { useLeagueFeatureFlag, useSettingsLeague } from '../../hooks/useLeague';
import TextInput from '../TextInput';
import LeagueTrialNameInput from './LeagueTrialNameInput';

export const createTrialScreenOptions: ScreenNavigationOptions<
  ScreenName.CREATE_TRIAL
> = ({ navigation }) => ({
  title: 'Create Trial',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerLeft: () => <CreateTrialHeaderLeft navigation={navigation} />,
  }),
});

const CreateTrial: FC<ScreenProps<ScreenName.CREATE_TRIAL>> = ({
  navigation,
}) => {
  const theme = useTheme();
  const league = useSettingsLeague();

  // Create Trial State
  const { settings } = useSettings();
  const witnessSelectionEnabled = useLeagueFeatureFlag(
    LeagueFeature.WITNESS_SELECTION,
  );
  const customTrialNameInputEnabled = useLeagueFeatureFlag(
    LeagueFeature.CUSTOM_TRIAL_NAME_INPUT,
  );

  const {
    trials: { trials, setTrials },
    createTrial: { createTrialState, setCreateTrialState },
  } = useProvidedContext();

  const [name, setName] = useState('');
  const [allLossTime, setAllLossTime] = React.useState(0);
  const [validateTrialName, setValidateTrialName] = useState(false);

  // Trial Details State
  // If school account is not connected, these are not used
  const [round, setRound] = useState<RoundNumber | null>(null);
  const [side, setSide] = useState<Side | null>(null);

  // Reset the context state on load
  useEffect(() => {
    setCreateTrialState(emptyCreateTrialState);
  }, []);

  useEffect(() => {
    const duration = settings.additionalSetup.allLossDuration; // duration in seconds
    const allLossTime = Date.now() + duration * 1000;

    setAllLossTime(allLossTime);
  }, [settings]);

  const validateInputs = () => {
    if (name === '') {
      if (customTrialNameInputEnabled) {
        return 'Please finish entering the trial details';
      }
      return 'Please enter a name for the trial';
    } else if (allLossTime < Date.now()) {
      return 'Please enter an All-Loss time in the future';
    }
  };

  const handleCreatePress = async () => {
    if (!trials) {
      throw new Error(
        'Attempting to create trial, but trials have not been loaded in context.',
      );
    }

    const validationError = validateInputs();
    if (validationError) {
      if (Platform.OS === 'web') {
        alert(validationError);
      }

      setValidateTrialName(true);
      Alert.alert('Error', validationError);
      return;
    }

    const witnesses = {
      p: createTrialState.pWitnessCall,
      d: createTrialState.dWitnessCall,
    };

    const details = settings.schoolAccount.connected
      ? {
          round,
          side,
          tournamentId: createTrialState.tournamentId,
        }
      : undefined;

    const trial = await createNewTrial(name, allLossTime, witnesses, details);
    setTrials([...trials, trial]);

    navigation.goBack(); // close modal
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name,
    });
  };
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
      {customTrialNameInputEnabled ? (
        <LeagueTrialNameInput setName={setName} validate={validateTrialName} />
      ) : (
        <TextInput
          placeholder="Trial Name"
          value={name}
          onChangeText={setName}
          error={validateTrialName && name === ''}
        />
      )}

      {settings.schoolAccount.connected && (
        <TrialDetails
          showWarnings={false}
          tournamentLoading={false}
          navigation={navigation}
          side={side}
          round={round}
          setSide={setSide}
          setRound={setRound}
        />
      )}
      {settings.setup.allLossEnabled && (
        <AllLossSelector
          allLossTime={allLossTime}
          setAllLossTime={setAllLossTime}
        />
      )}
      {showWitnessSelector && <WitnessSelectorInline league={league} />}

      <Button title="Create Trial" onPress={handleCreatePress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    ...Platform.select({
      web: {
        width: 800,
        marginHorizontal: 'auto',
      },
    }),
  },
});

export default CreateTrial;
