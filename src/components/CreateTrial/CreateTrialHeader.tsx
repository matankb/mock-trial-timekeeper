import { useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import { Button, TouchableOpacity } from 'react-native';

import colors from '../../constants/colors';
import { FLEX_TIMING_ENABLED } from '../../constants/feature-flags';

interface CreateTrialHeaderLeftProps {
  navigation: NavigationProp<never>;
}

export const CreateTrialHeaderLeft: FC<CreateTrialHeaderLeftProps> = ({
  navigation,
}) => <Button title="Cancel" onPress={() => navigation.goBack()} />;

interface CreateTrialHeaderRightProps {
  flexEnabled: boolean; // whether flex is enabled for this trial, not whether it is enabled as a feature globally
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

  if (!FLEX_TIMING_ENABLED) {
    return null;
  }

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
