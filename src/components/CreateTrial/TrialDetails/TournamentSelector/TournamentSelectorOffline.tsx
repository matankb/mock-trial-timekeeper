import { Feather } from '@expo/vector-icons';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { Theme } from '../../../../context/ThemeContext';
import useTheme from '../../../../hooks/useTheme';
import Text from '../../../Text';

const TournamentSelectorOffline: FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={60} color="gray" />
      <Text style={styles.text}>You're Offline</Text>
      <Text
        style={{
          ...styles.instructions,
          color: theme === Theme.LIGHT ? 'gray' : 'lightgray',
        }}
      >
        Please connect to the internet to choose your tournament.
      </Text>
      <Text style={styles.warning}>
        Remember: You must turn on Airplane Mode back on and turn off Wi-Fi to
        use the timer during sanctioned tournaments.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 20,
  },
  instructions: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  warning: {
    backgroundColor: '#fff7c2',
    borderColor: '#f2d930',
    borderWidth: 1,
    // color: 'gray',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default TournamentSelectorOffline;
