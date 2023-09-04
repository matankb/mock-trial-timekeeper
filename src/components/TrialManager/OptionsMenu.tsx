import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  ActionSheetIOS,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface OptionsMenuProps {
  trialName: string;
  handleDelete: () => void;
  handleRename: (name: string) => void;
}

const OptionsMenu: FC<OptionsMenuProps> = ({
  trialName,
  handleDelete,
  handleRename,
}) => {
  const handleOptionsPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Rename', 'Delete'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          showRenamePrompt();
          // setResult(String(Math.floor(Math.random() * 100) + 1));
        } else if (buttonIndex === 2) {
          showDeleteConfirmation();
        }
      },
    );
  };

  const showRenamePrompt = () => {
    Alert.prompt(
      'Rename Trial',
      `Enter a name name for ${trialName}`,
      (name) => {
        if (name) {
          handleRename(name);
        }
      },
    );
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Trial',
      `Are you sure you want to delete ${trialName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: handleDelete,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <TouchableOpacity onPress={handleOptionsPress}>
      <MaterialCommunityIcons
        name="dots-horizontal-circle-outline"
        size={24}
        color="#007AFF"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
export default OptionsMenu;
