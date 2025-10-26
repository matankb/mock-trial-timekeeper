import { useActionSheet } from '@expo/react-native-action-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import { HeaderButton } from '@react-navigation/elements';

import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import {
  Trial,
  uploadTrialToSchoolAccount,
  validateTrialDetails,
} from '../../controllers/trial';
import { useSettings } from '../../hooks/useSettings';
import { showBugReportAlert } from '../../utils/bug-report';
import { supabaseDbErrorToReportableError } from '../../utils/supabase';

import { NavigationProp } from '../../types/navigation';

interface OptionsMenuProps {
  navigation: NavigationProp<
    ScreenName.TRIAL_MANAGER | ScreenName.UPDATE_TRIAL
  >;
  trial: Trial;
  handleDelete: () => void;
}

interface OptionsConfig {
  options: { name: string; onPress: () => void }[];
  destructiveButtonIndex: number;
  cancelButtonIndex: number;
}

const OptionsMenu: FC<OptionsMenuProps> = ({
  navigation,
  trial,
  handleDelete,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  // TODO: check if this is reactive in the case where the view is not reloaded because
  // the same trial is visited
  const settings = useSettings();

  const [uploading, setUploading] = useState(false);

  // ===============================
  // Generic Action Sheet & Handlers
  // ===============================

  const optionsWithUpload: OptionsConfig = {
    options: [
      { name: 'Edit Trial', onPress: () => handleEditTrialPress() },
      { name: 'Upload to Team Account', onPress: () => handleUploadPress() },
      { name: 'Delete Trial', onPress: () => handleDeletePress() },
      { name: 'Cancel', onPress: () => {} },
    ],
    destructiveButtonIndex: 2,
    cancelButtonIndex: 3,
  };

  const optionsWithoutUpload: OptionsConfig = {
    options: [
      { name: 'Edit Trial', onPress: () => handleEditTrialPress() },
      { name: 'Delete Trial', onPress: () => handleDeletePress() },
      { name: 'Cancel', onPress: () => {} },
    ],
    destructiveButtonIndex: 1,
    cancelButtonIndex: 2,
  };

  const optionsConfig = settings?.schoolAccount?.connected
    ? optionsWithUpload
    : optionsWithoutUpload;

  const handleOptionsPress = () => {
    showActionSheetWithOptions(
      {
        options: optionsConfig.options.map((option) => option.name),
        destructiveButtonIndex: optionsConfig.destructiveButtonIndex,
        cancelButtonIndex: optionsConfig.cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === undefined) {
          return;
        }

        const handler = optionsConfig.options[buttonIndex]?.onPress;
        if (typeof handler === 'function') {
          handler();
        }
      },
    );
  };

  const handleEditTrialPress = () => {
    navigation.navigate(ScreenName.UPDATE_TRIAL, {
      trialId: trial.id,
    });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Trial',
      `Are you sure you want to delete ${trial.name}?`,
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

  const handleUploadPress = async () => {
    if (!validateTrialDetails(trial)) {
      navigation.navigate(ScreenName.UPDATE_TRIAL, {
        trialId: trial.id,
        isBeforeUpload: true,
      });
      return;
    }

    setUploading(true);

    const { error } = await uploadTrialToSchoolAccount(trial);
    setUploading(false);

    if (error) {
      const reportableError = supabaseDbErrorToReportableError(error);
      showBugReportAlert(
        'There was a problem uploading your trial',
        'Make sure you are connected to the internet and try again, or contact support.',
        reportableError,
      );
    } else {
      Alert.alert('Trial uploaded!');
    }
  };

  return (
    <View>
      <HeaderButton onPress={handleOptionsPress}>
        {uploading && <ActivityIndicator size="small" color="gray" />}
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={24}
          color={colors.HEADER_BLUE}
        />
      </HeaderButton>
    </View>
  );
};

export default OptionsMenu;
