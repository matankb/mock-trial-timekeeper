import { Feather } from '@expo/vector-icons';
import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import SettingSection from '../SettingSection';

interface SchoolAccountOfflineProps {
  accountConnected: boolean;
}

const SchoolAccountOffline: FC<SchoolAccountOfflineProps> = ({
  accountConnected,
}) => {
  const description = accountConnected
    ? 'Connected to your school account'
    : undefined;

  const text = accountConnected
    ? 'Turn on Wi-Fi to change your school account settings.'
    : 'Turn on Wi-Fi to connect to your school account.';

  return (
    <SettingSection title="School Account" description={description}>
      <View style={styles.container}>
        <Feather name="wifi-off" size={20} color="gray" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    marginLeft: 10,
    color: 'gray',
  },
});

export default SchoolAccountOffline;
