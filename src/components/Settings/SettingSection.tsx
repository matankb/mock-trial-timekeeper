import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Card from '../Card';
import Text from '../Text';

interface SettingSectionProps {
  title: string;
  description?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection: FC<SettingSectionProps> = ({
  children,
  title,
  description,
  headerRight,
}) => {
  return (
    <Card>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionName}>{title}</Text>
          {description && (
            <Text style={styles.sectionDescription}>{description}</Text>
          )}
        </View>

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
  },
});

export default SettingSection;
