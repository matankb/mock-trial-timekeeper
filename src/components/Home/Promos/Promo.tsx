import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import Card from '../../Card';
import Text from '../../Text';

interface PromoProps {
  onPress?: () => void;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  inline?: boolean;
}

const Promo: FC<PromoProps> = ({
  onPress,
  icon,
  title,
  subtitle,
  badge,
  badgeColor,
  inline,
}) => {
  return (
    <Card
      style={inline ? styles.inlineContainer : styles.container}
      onPress={onPress}
    >
      {icon}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          {badge && (
            <Text style={[styles.badge, { backgroundColor: badgeColor }]}>
              {badge}
            </Text>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    color: 'gray',
    marginTop: 5,
  },
  badge: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  inlineContainer: {
    padding: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
});

export default Promo;
