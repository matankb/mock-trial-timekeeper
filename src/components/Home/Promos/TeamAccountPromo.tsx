import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FC } from 'react';

import Promo from './Promo';
import colors from '../../../constants/colors';
import { ScreenName } from '../../../constants/screen-names';
import { TEAM_ACCOUNT_PROMO_ENABLED } from '../../../constants/feature-flags';
import { RouteProps } from '../../../Navigation';

interface TeamAccountPromoProps {
  inline?: boolean;
}

const TeamAccountPromo: FC<TeamAccountPromoProps> = ({ inline }) => {
  const navigation = useNavigation<NavigationProp<RouteProps>>();

  if (!TEAM_ACCOUNT_PROMO_ENABLED) {
    return null;
  }

  return (
    <Promo
      onPress={() => {
        navigation.navigate(ScreenName.TEAM_ACCOUNT_POPUP);
      }}
      title="Introducing Team Accounts"
      subtitle="See all your team's times in one place, for free. Tap here to learn more."
      badge="NEW"
      badgeColor={colors.BRIGHT_GREEN}
      inline={inline}
    />
  );
};

export default TeamAccountPromo;
