import { FC } from 'react';

import Promo from './Promo';
import colors from '../../../constants/colors';
import { ScreenName } from '../../../constants/screen-names';
import { TEAM_ACCOUNT_PROMO_ENABLED } from '../../../constants/feature-flags';
import { useNavigation } from '../../../types/navigation';

interface TeamAccountPromoProps {
  inline?: boolean;
}

const TeamAccountPromo: FC<TeamAccountPromoProps> = ({ inline }) => {
  const navigation = useNavigation();

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
      badgeColor={colors.GREEN}
      inline={inline}
    />
  );
};

export default TeamAccountPromo;
