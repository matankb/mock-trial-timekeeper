/**
 * The settings for the school account, when the user is *not* signed in to a school account
 */
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import SettingSection from '../SettingSection';
import TeamAccountPromo from '../../Home/Promos/TeamAccountPromo';
import Link from '../../Link';
import { ScreenName } from '../../../constants/screen-names';
import { useNavigation } from '../../../types/navigation';
import { TEAM_ACCOUNT_PROMO_ENABLED } from '../../../constants/feature-flags';

interface SchoolAccountUnconnectedSettingsProps {
  onPress: () => void;
}

const SchoolAccountUnconnectedSettings: FC<
  SchoolAccountUnconnectedSettingsProps
> = ({ onPress }) => {
  const navigation = useNavigation();

  return (
    <SettingSection title="School Account">
      <View style={styles.promoContainer}>
        <TeamAccountPromo inline />
      </View>
      <View style={styles.links}>
        <Link title="Connect School Account" onPress={onPress} inline />
        {TEAM_ACCOUNT_PROMO_ENABLED && (
          <Link
            title="Create School Account"
            onPress={() => navigation.navigate(ScreenName.TEAM_ACCOUNT_SIGNUP)}
            inline
          />
        )}
      </View>
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  links: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 10,
  },
  promoContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
});

export default SchoolAccountUnconnectedSettings;
