import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { RouteProps } from '../../Navigation';
import colors from '../../constants/colors';
import { ScreenName } from '../../constants/screen-names';
import { HeaderButton } from '@react-navigation/elements';

type HomeHeaderIconProps = NativeStackScreenProps<RouteProps, ScreenName.HOME>;

export const HomeHeaderIconLeft: FC<HomeHeaderIconProps> = ({ navigation }) => (
  <HeaderButton onPress={() => navigation.navigate(ScreenName.ABOUT)}>
    <Ionicons
      name="information-circle-outline"
      size={26}
      color={colors.HEADER_BLUE}
    />
  </HeaderButton>
);

export const HomeHeaderIconRight: FC<HomeHeaderIconProps> = ({
  navigation,
}) => (
  <HeaderButton onPress={() => navigation.navigate(ScreenName.SETTINGS)}>
    <Ionicons name="settings-outline" size={25} color={colors.HEADER_BLUE} />
  </HeaderButton>
);
