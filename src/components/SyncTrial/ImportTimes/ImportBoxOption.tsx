import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import Text from '../../Text';

interface ImportBoxOptionProps {
  active: boolean;
  handlePress: () => void;
  children?: React.ReactNode;
  name?: string;
  description?: string;
}

const ImportBoxOption: FC<ImportBoxOptionProps> = ({
  active,
  handlePress,
  children,
  name,
  description,
}) => {
  return (
    <TouchableOpacity style={styles.option} onPress={() => handlePress()}>
      <View
        style={{
          ...styles.bubble,
          ...(active && { backgroundColor: colors.GREEN }),
        }}
      />
      <View style={styles.text}>
        {children && <View style={styles.childrenWrap}>{children}</View>}
        {name && <Text>{name}</Text>}
        {description && active && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'top',
    padding: 10,
    gap: 3,
  },
  childrenWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bubble: {
    verticalAlign: 'top',
    width: 20,
    height: 20,
    marginRight: 7,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.GREEN,
  },
  text: {
    display: 'flex',
    gap: 4,
  },
  description: {
    color: 'gray',
  },
});

export default ImportBoxOption;
