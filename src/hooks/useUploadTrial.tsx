import { useState } from 'react';
import { Alert } from 'react-native';

import { ScreenName } from '../constants/screen-names';
import {
  Trial,
  uploadTrialToSchoolAccount,
  validateTrialDetails,
} from '../controllers/trial';
import { useNavigation } from '../types/navigation';
import { showBugReportAlert } from '../utils/bug-report';
import { supabaseDbErrorToReportableError } from '../utils/supabase';
import { useNetworkState } from 'expo-network';

interface UseUploadTrialParams {
  trial: Trial;
}

export const useUploadTrial = ({ trial }: UseUploadTrialParams) => {
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);

  const network = useNetworkState();

  const handleUpload = async () => {
    if (!network.isConnected) {
      Alert.alert(
        'You are offline.',
        'Once the trial is over, please connect to the internet to upload your trial.',
      );
      return;
    }

    if (!validateTrialDetails(trial)) {
      navigation.navigate(ScreenName.UPDATE_TRIAL, {
        trialId: trial.id,
        isBeforeUpload: true,
        onlyWitnessesMissing: validateTrialDetails(trial, false),
      });
      return;
    }

    setUploading(true);

    const { error } = await uploadTrialToSchoolAccount(trial);
    setUploading(false);

    if (error) {
      showBugReportAlert(
        'There was a problem uploading your trial',
        'Make sure you are connected to the internet and try again, or contact support.',
        supabaseDbErrorToReportableError(error),
      );
    } else {
      Alert.alert('Trial uploaded!');
    }
  };

  return {
    handleUpload,
    uploading,
  };
};
