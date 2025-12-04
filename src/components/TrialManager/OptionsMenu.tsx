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
import { LeagueFeature } from '../../constants/leagues';
import { useLeagueFeatureFlag } from '../../hooks/useLeagueFeatureFlag';
import { Falsy, isFalsy } from 'utility-types';
import LinkButton from '../LinkButton';

interface OptionsMenuProps {
  navigation: NavigationProp<
    ScreenName.TRIAL_MANAGER | ScreenName.UPDATE_TRIAL
  >;
  trial: Trial;
  editingTimes: boolean;
  handleDelete: () => void;
  handleEditTimes: () => void;
  handleEditTimesFinish: () => void;
}

interface OptionConfig {
  name: string;
  onPress: () => void;
  destructive?: boolean;
  cancel?: boolean;
}

const OptionsMenu: FC<OptionsMenuProps> = ({
  navigation,
  trial,
  editingTimes,
  handleDelete,
  handleEditTimes,
  handleEditTimesFinish,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  // TODO: check if this is reactive in the case where the view is not reloaded because
  // the same trial is visited
  const settings = useSettings();

  const witnessSelectionEnabled = useLeagueFeatureFlag(
    LeagueFeature.WITNESS_SELECTION,
  );
  const timesBreakdownEnabled = useLeagueFeatureFlag(
    LeagueFeature.TIMES_BREAKDOWN,
  );

  const [uploading, setUploading] = useState(false);

  // ==================
  // Action Sheet Items
  // ==================

  const editTrialLabel =
    witnessSelectionEnabled || trial.setup.allLossEnabled
      ? 'Edit Trial'
      : // if these two features are disabled, the only functionality is to rename the trial.
        'Rename Trial';

  const options: (OptionConfig | Falsy)[] = [
    { name: editTrialLabel, onPress: () => handleEditTrialPress() },
    settings?.schoolAccount?.connected && {
      name: 'Upload to Team Account',
      onPress: () => handleUploadPress(),
    },
    !timesBreakdownEnabled && {
      name: 'Edit Times',
      onPress: () => handleEditTimes(),
    },
    {
      name: 'Delete Trial',
      onPress: () => handleDeletePress(),
      destructive: true,
    },
    { name: 'Cancel', onPress: () => {}, cancel: true },
  ];

  const handleOptionsPress = () => {
    const visibleOptions = options.filter(
      (x): x is OptionConfig => !isFalsy(x),
    );

    const destructiveButtonIndex =
      visibleOptions.findIndex((option) => option.destructive) ?? -1;
    const cancelButtonIndex =
      visibleOptions.findIndex((option) => option.cancel) ?? -1;

    showActionSheetWithOptions(
      {
        options: visibleOptions.map((option) => option.name),
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === undefined) {
          return;
        }

        const handler = visibleOptions[buttonIndex]?.onPress;
        if (typeof handler === 'function') {
          handler();
        }
      },
    );
  };

  // =====================
  // Action Sheet Handlers
  // =====================

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

  if (editingTimes) {
    return (
      <View>
        <HeaderButton onPress={handleEditTimesFinish}>
          <LinkButton title="Done" onPress={handleEditTimesFinish} />
        </HeaderButton>
      </View>
    );
  }

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
