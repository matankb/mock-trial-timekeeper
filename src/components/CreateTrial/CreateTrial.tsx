import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { FC, useContext } from 'react';
import { Platform, View, StyleSheet, Alert } from 'react-native';

import AllLossSelector from './AllLossSelector';
import CreateTrialHeaderIcon from './CreateTrialHeaderIcon';
import TrialNameInput from './TrialNameInput';
import { RouteProps } from '../../App';
import { ScreenName } from '../../constants/screen-names';
import { TrialsContext } from '../../context/TrialsContext';
import { createNewTrial } from '../../controllers/trial';
import Button from '../Button';

const ALL_LOSS_MINUTES = 180;

type CreateTrialProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.CREATE_TRIAL
>;

export const createTrialScreenOptions = ({
  navigation,
}): NativeStackNavigationOptions => ({
  presentation: 'modal',
  title: 'Create Trial',
  headerLeft:
    Platform.OS === 'ios'
      ? () => <CreateTrialHeaderIcon navigation={navigation} />
      : () => <View />,
});

const CreateTrial: FC<CreateTrialProps> = ({ navigation }) => {
  const [trials, setTrials] = useContext(TrialsContext);
  const [name, setName] = React.useState('');
  const [allLossTime, setAllLossTime] = React.useState(
    Date.now() + ALL_LOSS_MINUTES * 60 * 1000,
  );

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

  return (
    <View style={styles.container}>
      <View>
        <TrialNameInput name={name} setName={setName} />
        <AllLossSelector
          allLossTime={allLossTime}
          setAllLossTime={setAllLossTime}
        />
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
