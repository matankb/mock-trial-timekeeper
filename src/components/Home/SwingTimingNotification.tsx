import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import colors from '../../constants/colors';
import Card from '../Card';
import Text from '../Text';

interface SwingTimingNotificationProps {
  onPress: any;
}

const SwingTimingNotification: FC<SwingTimingNotificationProps> = ({
  onPress,
}) => {
  return (
    <Card style={styles.container} onPress={onPress}>
      <MaterialIcons
        name="tips-and-updates"
        size={33}
        color={colors.BRIGHT_GREEN}
      />
      <View>
        <Text style={styles.header}>Using the experimental timing system?</Text>
        <Text style={styles.subheader}>Tap here to learn more</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  header: { fontSize: 16 },
  subheader: { color: 'gray', marginTop: 5 },
});

export default SwingTimingNotification;
