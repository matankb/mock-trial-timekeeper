import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUpdates, reloadAsync } from 'expo-updates';
import { useState } from 'react';
import { showBugReportAlert } from '../../utils/bug-report';

const UpdateAlert = () => {
  const updates = useUpdates();

  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await reloadAsync();
    } catch (error) {
      setLoading(false);
      showBugReportAlert(
        'There was a problem updating Mock Trial Timer',
        'Please try closing and reoping the app',
        error as Error, // TODO: type this better
      );
    }
  };

  if (!updates.isUpdateAvailable) {
    return null;
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.textContainer}>
        <Ionicons name="sparkles" size={18} color="white" style={styles.icon} />
        <Text style={styles.title}>App update available</Text>
      </View>
      <View style={styles.textContainer}>
        <View style={[styles.updateButton, loading && styles.loadingButton]}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={styles.activityIndicator}
            />
          ) : (
            <Text style={styles.updateButtonText}>Update</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 10,
    paddingHorizontal: 25,
    backgroundColor: colors.GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: 'white',
    fontWeight: 600,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: colors.DARK_GREEN,
    borderRadius: 10,
  },
  loadingButton: {
    paddingVertical: 4,
    paddingRight: 25,
    paddingLeft: 26,
  },
  updateButtonText: {
    fontSize: 16,
    color: 'white',
  },
  activityIndicator: {
    marginHorizontal: 10,
  },
});

export default UpdateAlert;
