import { useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import { TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import Dialog from 'react-native-dialog';

import colors from '../../constants/colors';

interface OptionsMenuProps {
  trialName: string;
  flexEnabled: boolean;
  handleDelete: () => void;
  handleRename: (name: string) => void;
  handleFlexToggle: () => void;
}

const OptionsMenu: FC<OptionsMenuProps> = ({
  trialName,
  flexEnabled,
  handleDelete,
  handleRename,
  handleFlexToggle,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [androidRenameDialogShown, setAndroidRenameDialogShown] =
    useState(false);
  const [androidNewName, setAndroidNewName] = useState(trialName);

  // ===============================
  // Generic Action Sheet & Handlers
  // ===============================

  const handleOptionsPress = () => {
    const flexActionText = flexEnabled ? 'Disable' : 'Enable';

    showActionSheetWithOptions(
      {
        options: [
          `${flexActionText} Swing Time Experiment`,
          'Rename',
          'Delete',
          'Cancel',
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          handleFlexToggle();
        } else if (buttonIndex === 1) {
          handleRenamePress();
        } else if (buttonIndex === 2) {
          handleDeletePress();
        }
      },
    );
  };

  const handleRenamePress = () => {
    if (Platform.OS === 'ios') {
      showIosRenamePrompt();
    } else {
      setAndroidRenameDialogShown(true);
    }
  };

  const handleDeletePress = () => {
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

  // =====================
  // OS-specific handlers
  // ====================

  const showIosRenamePrompt = () => {
    Alert.prompt(
      'Rename Trial',
      `Enter a new name for ${trialName}`,
      (name) => {
        if (name) {
          handleRename(name);
        }
      },
      'plain-text',
      trialName,
    );
  };

  const androidRenameDialog = (
    <Dialog.Container visible={androidRenameDialogShown}>
      <Dialog.Title style={{ color: 'black' }}>Rename</Dialog.Title>
      <Dialog.Description>Enter a new name for {trialName}</Dialog.Description>
      <Dialog.Input
        value={androidNewName}
        onChangeText={setAndroidNewName}
        style={styles.androidInput}
      />
      <Dialog.Button
        label="Cancel"
        onPress={() => {
          setAndroidRenameDialogShown(false);
          setAndroidNewName(trialName);
        }}
      />
      <Dialog.Button
        label="Rename"
        onPress={() => {
          setAndroidRenameDialogShown(false);
          handleRename(androidNewName);
        }}
      />
    </Dialog.Container>
  );

  return (
    <TouchableOpacity onPressOut={handleOptionsPress}>
      <MaterialCommunityIcons
        name="dots-horizontal-circle-outline"
        size={24}
        color={colors.HEADER_BLUE}
      />
      {androidRenameDialogShown && androidRenameDialog}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionWrapper: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
  androidTitle: {
    // in dark mode, the title and background are both white by default
    color: 'black',
  },
  androidInput: {
    color: 'black',
  },
});

export default OptionsMenu;
