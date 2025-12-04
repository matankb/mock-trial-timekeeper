import { FC } from 'react';
import { Trial } from '../../../controllers/trial';
import TrialsList from './TrialsList';
import TrialListItem from '../TrialListItem';
import { useSettings } from '../../../hooks/useSettings';
import { NavigationProp } from '@react-navigation/native';
import { ScreenName } from '../../../constants/screen-names';
import { RouteProps } from '../../../Navigation';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../constants/colors';
import { TEAM_TRIALS_IN_APP_ENABLED } from '../../../constants/feature-flags';

interface HomeTrialsListProps {
  trials: Trial[];
  navigation: NavigationProp<RouteProps>;
}

const MAX_DISPLAYED_TRIALS = 9;

const HomeTrialsList: FC<HomeTrialsListProps> = ({ trials, navigation }) => {
  // TODO: will this be reactive if the user logs in and then goes back home?
  // maybe I should make generic useStorage hook that syncs to both settings and AsyncStorage
  // Although maybe it'll be fine when the user logs in, because then they
  // auto-navigate to home - but what if they log out? Hmm...
  const settings = useSettings();

  const orderedTrials = trials
    .sort((a, b) => b.date - a.date)
    .slice(0, MAX_DISPLAYED_TRIALS);

  const handleTrialSelect = (trial: Trial) => {
    navigation.navigate(ScreenName.TRIAL_MANAGER, {
      trialId: trial.id,
      trialName: trial.name, // name included to set as header title
    });
  };

  const handleAllTrialsPress = () => {
    navigation.navigate(ScreenName.ALL_TRIALS);
  };

  const handleTeamTrialsPress = () => {
    navigation.navigate(ScreenName.TEAM_TRIALS);
  };

  // Additional links

  const showAllTrialsLink = trials.length > MAX_DISPLAYED_TRIALS;
  const showTeamTrialsLink =
    TEAM_TRIALS_IN_APP_ENABLED && !!settings?.schoolAccount?.connected;

  const allTrialsLink = (
    <TrialListItem
      title="Older Trials"
      key="all_trials"
      onPress={handleAllTrialsPress}
      divider={showTeamTrialsLink}
      icon={
        <MaterialIcons
          name="history"
          size={24}
          color={colors.BACKGROUND_GRAY}
        />
      }
    />
  );

  const teamTrialsLink = (
    <TrialListItem
      title="Your Team's Trials"
      key="team_trials"
      onPress={handleTeamTrialsPress}
      divider={false}
      icon={<MaterialIcons name="people" size={24} color={colors.GREEN} />}
    />
  );
  return (
    <TrialsList
      orderedTrials={orderedTrials}
      handleSelect={handleTrialSelect}
      additionalTrialItems={[
        showAllTrialsLink && allTrialsLink,
        /* TODO: how this interacts with "no trials yet!" state */
        showTeamTrialsLink && teamTrialsLink,
      ]}
    />
  );
};

export default HomeTrialsList;
