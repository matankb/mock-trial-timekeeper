import React, { FC, useEffect, useState } from 'react';
import { Platform, StyleSheet, Alert, ScrollView } from 'react-native';

import AllLossSelector from './AllLossSelector';
import TrialDetails from './TrialDetails/TrialDetails';
import { WitnessSelectorInline } from './TrialDetails/WitnessSelector/WitnessSelectorInline';
import TrialNameInput from './TrialNameInput';
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
import { useLeagueFeatureFlag } from '../../hooks/useLeagueFeatureFlag';

const ALL_LOSS_MINUTES = 180;

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

  // Create Trial State
  const settings = useSettings();
  const witnessSelectionEnabled = useLeagueFeatureFlag(
    LeagueFeature.WITNESS_SELECTION,
  );

  const {
    trials: { trials, setTrials },
    createTrial: { createTrialState, setCreateTrialState },
  } = useProvidedContext();

  const [name, setName] = useState('');
  const [allLossTime, setAllLossTime] = React.useState(
    Date.now() + ALL_LOSS_MINUTES * 60 * 1000,
  );

  // Trial Details State
  // If school account is not connected, these are not used
  const [round, setRound] = useState<RoundNumber | null>(null);
  const [side, setSide] = useState<Side | null>(null);

  // Reset the context state on load
  useEffect(() => {
    setCreateTrialState(emptyCreateTrialState);
  }, []);

  const validateInputs = () => {
    if (name === '') {
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

    const error = validateInputs();
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    const witnesses = {
      p: createTrialState.pWitnessCall,
      d: createTrialState.dWitnessCall,
    };

    const details = settings?.schoolAccount?.connected
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

  if (!settings) {
    return null;
  }

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
      <TrialNameInput name={name} setName={setName} />

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
      {showWitnessSelector && <WitnessSelectorInline />}

      <Button title="Create Trial" onPress={handleCreatePress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
});

export default CreateTrial;
