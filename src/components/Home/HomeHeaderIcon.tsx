import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

interface HomeHeaderIconProps {
  navigation: NavigationProp<any>;
}

// TODO: extract this color variable
// TODO: and all color variables, generally
const HomeHeaderIcon: FC<HomeHeaderIconProps> = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('About')}>
    <Ionicons name="information-circle-outline" size={26} color="#007AFF" />
  </TouchableOpacity>
);

export default HomeHeaderIcon;
