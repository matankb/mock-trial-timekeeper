import { FC } from 'react';
import { ScreenName } from '../../../constants/screen-names';
import { ScreenNavigationOptions } from '../../../types/navigation';
import LeagueSelector from './LeagueSelector';
import { ScrollView } from 'react-native';

export const leagueSelectionScreenOptions: ScreenNavigationOptions<ScreenName.LEAGUE_SELECTION> =
  {
    title: 'Select League',
  };

const LeagueSelectionScreen: FC = () => {
  return (
    <ScrollView>
      <LeagueSelector />
    </ScrollView>
  );
};

export default LeagueSelectionScreen;
