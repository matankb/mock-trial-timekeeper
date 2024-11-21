import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import { ActionSheetIOS, Button } from 'react-native';

import colors from '../../constants/colors';

interface CreateTrialHeaderLeftProps {
  navigation: NavigationProp<never>;
}

export const CreateTrialHeaderLeft: FC<CreateTrialHeaderLeftProps> = ({
  navigation,
}) => <Button title="Cancel" onPress={() => navigation.goBack()} />;

interface CreateTrialHeaderRightProps {
  flexEnabled: boolean;
  onFlexToggle: () => void;
}

export const CreateTrialHeaderRight: FC<CreateTrialHeaderRightProps> = ({
  flexEnabled,
  onFlexToggle,
}) => {
  const flexCheckMark = flexEnabled ? '✓' : '';

  const handleOptionsPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', `${flexCheckMark} Swing Time Experiment`],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          onFlexToggle();
        }
      },
    );
  };

  return (
    <MaterialCommunityIcons
      name="dots-horizontal-circle-outline"
      size={24}
      color={colors.HEADER_BLUE}
      onPress={handleOptionsPress}
    />
  );
};
