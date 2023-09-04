import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import { Button } from 'react-native';

interface CreateTrialHeaderIconProps {
  navigation: NavigationProp<never>;
}

const CreateTrialHeaderIcon: FC<CreateTrialHeaderIconProps> = ({
  navigation,
}) => <Button title="Cancel" onPress={() => navigation.goBack()} />;

export default CreateTrialHeaderIcon;
