import { MaterialIcons } from '@expo/vector-icons';
import React, { FC, ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TrialDetailsItemProps {
  title: string;
  badge?: string;
  value: string;
  onPress?: () => void;
  warning?: boolean;
  loading?: boolean;
  expandedContent?: ReactNode;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

const WARNING_COLOR = '#cd3b1c';

const TrialDetailsItem: FC<TrialDetailsItemProps> = ({
  title,
  badge,
  value,
  onPress,
  warning,
  loading,
  expandedContent,
  expanded,
  onExpandChange,
}) => {
  const handlePress = () => {
    if (expandedContent && onExpandChange) {
      const newExpanded = !expanded;
      onExpandChange(newExpanded);
    } else if (onPress) {
      onPress();
    }
  };

  const content = (
    <View style={styles.internalContainerRight}>
      <Text style={[styles.subtitle, warning && styles.warning]}>{value}</Text>
      <MaterialIcons
        name={expandedContent && expanded ? 'expand-less' : 'navigate-next'}
        size={25}
        color={warning ? WARNING_COLOR : 'gray'}
      />
    </View>
  );

  const loadingIndicator = <ActivityIndicator size="small" color="gray" />;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, expanded && styles.containerExpanded]}
    >
      <View style={styles.internalContainer}>
        <View style={styles.internalContainerLeft}>
          <Text style={[styles.text, warning && styles.warning]}>{title}</Text>
          {badge && <Text style={styles.badge}>{badge}</Text>}
        </View>
        {loading ? loadingIndicator : content}
      </View>
      {expanded && expandedContent && (
        <View style={styles.expandedContent}>{expandedContent}</View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  containerExpanded: {
    backgroundColor: '#f5f5f5be',
    borderTopWidth: 1,
    borderColor: '#ededed',
    borderBottomWidth: 1,
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
  internalContainerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  expandedContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    gap: 5,
  },
  internalContainerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    fontSize: 12,
    backgroundColor: '#fbbb60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    color: 'white',
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
