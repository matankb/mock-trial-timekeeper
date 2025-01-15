import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import { ActionSheetIOS, Button, TouchableOpacity } from 'react-native';

import colors from '../../constants/colors';
import { useActionSheet } from '@expo/react-native-action-sheet';

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
  const { showActionSheetWithOptions } = useActionSheet();
  const flexActionText = flexEnabled ? 'Disable' : 'Enable';

  const handleOptionsPress = () => {
    showActionSheetWithOptions(
      {
        options: [`${flexActionText} Swing Time Experiment`, 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          onFlexToggle();
        }
      },
    );
  };

  return (
    <TouchableOpacity onPressOut={handleOptionsPress}>
      <MaterialCommunityIcons
        name="dots-horizontal-circle-outline"
        size={24}
        color={colors.HEADER_BLUE}
      />
    </TouchableOpacity>
  );
};
