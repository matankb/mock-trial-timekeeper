import { FC } from 'react';
import { StyleSheet } from 'react-native';

import Promo from './Promo';
import { League } from '../../../constants/leagues';
import { useSettingsLeague } from '../../../hooks/useLeague';
import { useNavigation } from '../../../types/navigation';
import { ScreenName } from '../../../constants/screen-names';
import { Image } from 'expo-image';

const ArizonaPromo: FC = () => {
  const league = useSettingsLeague();
  const navigation = useNavigation();

  if (league !== League.Arizona) {
    return null;
  }

  const icon = (
    <Image
      source={require('../../../../assets/leagues/arizona.png')}
      style={styles.icon}
    />
  );

  return (
    <Promo
      onPress={() => {
        navigation.navigate(ScreenName.SETUP_SETTINGS);
      }}
      icon={icon}
      title="Arizona High School Mock Trial"
      subtitle="Time limits for openings, directs, and crosses are suggested guidelines. Tap here to change them."
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    // marginRight: 3,
    marginLeft: -5,
  },
});

export default ArizonaPromo;
