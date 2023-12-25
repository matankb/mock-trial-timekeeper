import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { RouteProps } from '../../App';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';

type HomeHeaderIconProps = NativeStackScreenProps<RouteProps, ScreenName.HOME>;

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
