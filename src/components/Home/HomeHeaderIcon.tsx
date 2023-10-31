import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';

interface HomeHeaderIconProps {
  navigation: NavigationProp<any>;
}
const HomeHeaderIcon: FC<HomeHeaderIconProps> = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate(ScreenName.ABOUT)}>
    <Ionicons
      name="information-circle-outline"
      size={26}
      color={colors.HEADER_BLUE}
    />
  </TouchableOpacity>
);

export default HomeHeaderIcon;
