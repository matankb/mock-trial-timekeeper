import { FC } from 'react';
import { ScreenName } from '../../../constants/screen-names';
import { ScreenNavigationOptions } from '../../../types/navigation';
import LeagueSelector from './LeagueSelector';

export const leagueSelectionScreenOptions: ScreenNavigationOptions<ScreenName.LEAGUE_SELECTION> =
  {
    title: 'Select League',
  };

const LeagueSelectionScreen: FC = () => {
  return <LeagueSelector />;
};

export default LeagueSelectionScreen;
