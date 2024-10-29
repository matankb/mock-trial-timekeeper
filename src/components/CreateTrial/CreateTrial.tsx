import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { FC, useContext, useEffect } from 'react';
import { Platform, View, StyleSheet, Alert } from 'react-native';

import AllLossSelector from './AllLossSelector';
import {
  CreateTrialHeaderRight,
  CreateTrialHeaderLeft,
} from './CreateTrialHeader';
import TrialNameInput from './TrialNameInput';
import { RouteProps } from '../../Navigation';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import { Theme } from '../../context/ThemeContext';
import { TrialsContext } from '../../context/TrialsContext';
import { Settings, getSettings } from '../../controllers/settings';
import { createNewTrial } from '../../controllers/trial';
import useTheme from '../../hooks/useTheme';
import Button from '../Button';
import Text from '../Text';

const ALL_LOSS_MINUTES = 180;

type CreateTrialProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.CREATE_TRIAL
>;

export const createTrialScreenOptions = ({
  navigation,
}): NativeStackNavigationOptions => ({
  title: 'Create Trial',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerLeft: () => <CreateTrialHeaderLeft navigation={navigation} />,
    headerRight: () => (
      <CreateTrialHeaderRight flexEnabled={false} onFlexToggle={() => {}} />
    ),
  }),
});

const CreateTrial: FC<CreateTrialProps> = ({ navigation }) => {
  const theme = useTheme();

  const [settings, setSettings] = React.useState<Settings>(null);
  const [trials, setTrials] = useContext(TrialsContext);
  const [name, setName] = React.useState('');
  const [flexEnabled, setFlexEnabled] = React.useState(false);
  const [allLossTime, setAllLossTime] = React.useState(
    Date.now() + ALL_LOSS_MINUTES * 60 * 1000,
  );

  // Load settings
  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

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

  const validateInputs = () => {
    if (name === '') {
      return 'Please enter a name for the trial';
    } else if (allLossTime < Date.now()) {
      return 'Please enter an All-Loss time in the future';
    }
  };

  const handleCreatePress = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    const trial = await createNewTrial(name, allLossTime, flexEnabled);
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
        <TrialNameInput name={name} setName={setName} />
        {settings.setup.allLossEnabled && (
          <AllLossSelector
            allLossTime={allLossTime}
            setAllLossTime={setAllLossTime}
          />
        )}

        <Button title="Create Trial" onPress={handleCreatePress} />
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
});

export default CreateTrial;
