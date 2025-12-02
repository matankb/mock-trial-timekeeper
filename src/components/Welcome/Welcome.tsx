import { ScrollView, StyleSheet } from 'react-native';
import { FC } from 'react';
import { ScreenNavigationOptions } from '../../types/navigation';
import { ScreenName } from '../../constants/screen-names';
import WelcomeHeader from './WelcomeHeader';
import LeagueSelector from '../Settings/LeagueSettings/LeagueSelector';
import Text from '../Text';

export const welcomeScreenOptions: ScreenNavigationOptions<ScreenName.WELCOME> =
  {
    headerTitle: () => <WelcomeHeader />,
  };

const Welcome: FC = () => {
  return (
    <ScrollView>
      <Text style={styles.description}>
        Please select your mock trial league
      </Text>
      <LeagueSelector />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  description: {
    color: '#535353',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default Welcome;
