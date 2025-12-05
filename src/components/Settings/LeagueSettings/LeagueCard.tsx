import { FC } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import Text from '../../Text';
import { Image } from 'expo-image';
import Card from '../../Card';

interface LeagueProps {
  name: string;
  image: ImageSourcePropType;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

const LeagueCard: FC<LeagueProps> = ({
  name,
  image,
  description,
  selected,
  onSelect,
}) => {
  return (
    <Card
      style={StyleSheet.flatten([
        styles.container,
        selected && styles.selected,
      ])}
      onPress={onSelect}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  image: {
    height: 50,
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    gap: 7,
  },
  name: {
    fontSize: 18,
    fontWeight: 500,
  },
  description: {
    fontSize: 15,
    color: 'gray',
  },
  selected: {
    backgroundColor: '#4473ff30',
  },
});

export default LeagueCard;
