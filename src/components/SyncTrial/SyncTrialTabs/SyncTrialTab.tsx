import React, { FC } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import colors from '../../../constants/colors';

interface SyncTrialTabProps {
  title: string;
  onPress: () => void;
  active: boolean;
}

const SyncTrialTab: FC<SyncTrialTabProps> = ({ title, onPress, active }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        ...styles.tab,
        ...(active && {
          backgroundColor: colors.BLUE,
        }),
      }}
    >
      <Text style={{ ...styles.tabText, ...(active && { color: 'white' }) }}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 15,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '50%',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
export default SyncTrialTab;
