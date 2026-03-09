import { ScrollView, StyleSheet, View } from 'react-native';
import { FC } from 'react';
import { ScreenNavigationOptions } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import WelcomeHeader from './WelcomeHeader';
import LeagueSelector from '../Settings/LeagueSettings/LeagueSelector';
import Text from '../Text';

export const welcomeScreenOptions: ScreenNavigationOptions<ScreenName.WELCOME> =
  {
    title: 'Mock Trial Timer', // for web
    headerTitle: () => <WelcomeHeader />,
  };

const Welcome: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Please select your mock trial league
      </Text>
      <LeagueSelector />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    height: '100%',
  },
  description: {
    color: '#535353',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default Welcome;
