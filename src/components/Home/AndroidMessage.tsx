import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FC } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import Card from '../Card';
import Text from '../Text';

interface BetaTestNotificationProps {
  onPress: any;
}

const BetaTestNotification: FC<BetaTestNotificationProps> = ({ onPress }) => {
  // Only show on Android
  if (Platform.OS !== 'android') {
    return null;
  }

  return (
    <Card style={styles.container} onPress={onPress}>
      <FontAwesome
        name="android"
        size={35}
        color="#3DDC84"
        style={styles.icon}
      />
      <View>
        <Text style={styles.header}>Thanks for using Mock Timer!</Text>
        <Text style={styles.subheader}>
          You're one of our first users on Android. Tap here to leave feedback.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 3,
  },
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  header: { fontSize: 16 },
  subheader: { color: 'gray', marginTop: 5, paddingRight: 20 },
});

export default BetaTestNotification;
