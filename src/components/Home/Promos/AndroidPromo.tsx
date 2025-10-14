import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FC } from 'react';
import { StyleSheet } from 'react-native';

import Promo from './Promo';

/**
 * Android beta test promotional message.
 * *Currently unused*
 */

interface AndroidPromoProps {
  onPress: any;
}

const AndroidPromo: FC<AndroidPromoProps> = ({ onPress }) => {
  // Only show on Android
  // if (Platform.OS !== 'android') {
  //   return null;
  // }

  const icon = (
    <FontAwesome name="android" size={35} color="#3DDC84" style={styles.icon} />
  );

  return (
    <Promo
      onPress={onPress}
      icon={icon}
      title="Thanks for using Mock Timer!"
      subtitle="You're one of our first users on Android. Tap here to leave feedback."
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 3,
  },
});

export default AndroidPromo;
