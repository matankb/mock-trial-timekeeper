/**
 * The settings for the school account, when the user is *not* signed in to a school account
 */
import { MaterialIcons } from '@expo/vector-icons';
import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '../../Text';
import SettingSection from '../SettingSection';
import TeamAccountPromo from '../../Home/Promos/TeamAccountPromo';

interface SchoolAccountUnconnectedSettingsProps {
  onPress: () => void;
}

const SchoolAccountUnconnectedSettings: FC<
  SchoolAccountUnconnectedSettingsProps
> = ({ onPress }) => {
  return (
    <SettingSection title="School Account">
      <View style={styles.promoContainer}>
        <TeamAccountPromo inline />
      </View>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>Connect Account</Text>
        <MaterialIcons name="navigate-next" size={28} color="gray" />
      </TouchableOpacity>
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
