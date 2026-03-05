import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Card from '../Card';
import Text from '../Text';

interface SettingSectionProps {
  title: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection: FC<SettingSectionProps> = ({
  children,
  title,
  headerRight,
}) => {
  return (
    <Card>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionName}>{title}</Text>

        {headerRight}
      </View>

      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  sectionDescription: {
    padding: 10,
    paddingVertical: 5,
    color: 'gray',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingSection;
