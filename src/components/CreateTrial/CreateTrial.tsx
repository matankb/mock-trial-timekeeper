import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { FC, useContext, useEffect } from 'react';
import { Platform, View, StyleSheet, Alert } from 'react-native';

import AllLossSelector from './AllLossSelector';
import CreateTrialHeaderIcon from './CreateTrialHeaderIcon';
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
    headerLeft: () => <CreateTrialHeaderIcon navigation={navigation} />,
  }),
});

const CreateTrial: FC<CreateTrialProps> = ({ navigation }) => {
  const theme = useTheme();

  const [settings, setSettings] = React.useState<Settings>(null);
  const [trials, setTrials] = useContext(TrialsContext);
  const [name, setName] = React.useState('');
  const [allLossTime, setAllLossTime] = React.useState(
    Date.now() + ALL_LOSS_MINUTES * 60 * 1000,
  );

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

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

    const trial = await createNewTrial(name, allLossTime);
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
});

export default CreateTrial;
