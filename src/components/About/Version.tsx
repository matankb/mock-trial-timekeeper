import { useUpdates } from 'expo-updates';
import { ScreenNavigationOptions } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import { FC, useState } from 'react';
import Constants from 'expo-constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';

import Card from '../Card';
import Button from '../Button';
import useTheme from '../../hooks/useTheme';
import { Theme } from '../../types/theme';
import colors from '../../constants/colors';
import Text from '../Text';

export const versionScreenOptions: ScreenNavigationOptions<ScreenName.VERSION> =
  {
    headerTitle: 'App Version',
  };

export const Version: FC = () => {
  const updates = useUpdates();
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const nativeVersion = Constants.expoConfig?.version ?? 'Unknown';
  const updateId = updates.currentlyRunning?.updateId ?? 'Unknown';
  const availableUpdate = updates.availableUpdate?.createdAt
    ? new Date(updates.availableUpdate.createdAt).toISOString()
    : 'None';

  const labelStyle = {
    ...styles.label,
    color: theme === Theme.LIGHT ? 'gray' : 'darkgray',
  };

  const handleCopy = async () => {
    const info = `Native App Version: ${nativeVersion}\nUpdate ID: ${updateId}\nAvailable Update: ${availableUpdate}`;
    await Clipboard.setStringAsync(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.infoCard}>
        <View style={styles.row}>
          <MaterialIcons
            name="info-outline"
            size={20}
            color={colors.BACKGROUND_GRAY}
          />
          <Text style={styles.infoText}>
            Most users will not need this information. If you report a bug, we
            may use this to help diagnose the issue.
          </Text>
        </View>
      </Card>

      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={labelStyle}>Native App Version</Text>
          <Text style={styles.text}>{nativeVersion}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={labelStyle}>Update ID</Text>
          <Text style={[styles.text]}>{updateId}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={labelStyle}>Available Update</Text>
          <Text style={styles.text}>{availableUpdate}</Text>
        </View>
      </Card>

      <Button
        title={copied ? 'Copied!' : 'Copy to Clipboard'}
        onPress={handleCopy}
        style={copied ? styles.copiedButton : undefined}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  infoCard: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.BACKGROUND_GRAY,
    flex: 1,
    lineHeight: 20,
  },
  detailsCard: {
    paddingVertical: 5,
  },
  detailRow: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  copiedButton: {
    backgroundColor: colors.GREEN,
  },
});

export default Version;
