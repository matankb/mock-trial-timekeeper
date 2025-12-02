import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

const WelcomeHeader: FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icon-transparent.png')}
        style={styles.icon}
      />
      <Text style={styles.title}>Mock Trial Timer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  icon: {
    width: 40,
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
});

export default WelcomeHeader;
