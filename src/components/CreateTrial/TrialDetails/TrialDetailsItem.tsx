import { MaterialIcons } from '@expo/vector-icons';
import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface TrialDetailsItemProps {
  title: string;
  value: string;
  onPress: () => void;
  warning?: boolean;
  loading?: boolean;
}

const WARNING_COLOR = '#cd3b1c';

const TrialDetailsItem: FC<TrialDetailsItemProps> = ({
  title,
  value,
  onPress,
  warning,
  loading,
}) => {
  const content = (
    <View style={styles.internalContainerRight}>
      <Text style={[styles.subtitle, warning && styles.warning]}>{value}</Text>
      <MaterialIcons
        name="navigate-next"
        size={25}
        color={warning ? WARNING_COLOR : 'gray'}
      />
    </View>
  );

  const loadingIndicator = <ActivityIndicator size="small" color="gray" />;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.internalContainer}>
        <Text style={[styles.text, warning && styles.warning]}>{title}</Text>
        {loading ? loadingIndicator : content}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  containerBorder: {
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  internalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  internalContainerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
  warning: {
    color: WARNING_COLOR,
    fontWeight: 'bold',
  },
});
export default TrialDetailsItem;
