import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import {
  ActionSheetIOS,
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Dialog from 'react-native-dialog';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import colors from '../../constants/colors';
import { Theme } from '../../context/ThemeContext';
import useTheme from '../../hooks/useTheme';

interface OptionsMenuProps {
  trialName: string;
  handleSync: () => void;
  handleDelete: () => void;
  handleRename: (name: string) => void;
}

const OptionsMenu: FC<OptionsMenuProps> = ({
  trialName,
  handleSync,
  handleDelete,
  handleRename,
}) => {
  const [androidRenameDialogShown, setAndroidRenameDialogShown] =
    useState(false);
  const [androidNewName, setAndroidNewName] = useState(trialName);

  const handleOptionsPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Sync', 'Rename', 'Delete'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleSync();
        } else if (buttonIndex === 2) {
          showIosRenamePrompt();
        } else if (buttonIndex === 3) {
          showDeleteConfirmation();
        }
      },
    );
  };

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

  const iosMenu = (
    <MaterialCommunityIcons
      name="dots-horizontal-circle-outline"
      size={24}
      color={colors.HEADER_BLUE}
      onPress={handleOptionsPress}
    />
  );

  const androidMenu = (
    <Menu>
      <MenuTrigger>
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={24}
          color={colors.HEADER_BLUE}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionTouchable: {
            padding: 10,
          },
        }}
      >
        <MenuOption
          customStyles={{ optionWrapper: styles.optionWrapper }}
          onSelect={() => setAndroidRenameDialogShown(true)}
        >
          <Text style={styles.optionText}>Rename</Text>
        </MenuOption>

        <MenuOption
          customStyles={{ optionWrapper: styles.optionWrapper }}
          onSelect={() => showDeleteConfirmation()}
        >
          <Text style={{ ...styles.optionText, color: 'red' }}>Delete</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );

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
    <TouchableOpacity onPress={handleOptionsPress}>
      {Platform.OS === 'ios' && iosMenu}
      {Platform.OS === 'android' && (
        <>
          {androidMenu}
          {androidRenameDialog}
        </>
      )}
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
