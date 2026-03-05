import { FC, useEffect, useState } from 'react';

import Promo from './Promo';
import colors from '../../../constants/colors';
import { ScreenName } from '../../../constants/screen-names';
import { TEAM_ACCOUNT_PROMO_ENABLED } from '../../../constants/feature-flags';
import { useNavigation } from '../../../types/navigation';
import { useSettings } from '../../../hooks/useSettings';
import { supabase } from '../../../utils/supabase';
import { posthog } from '../../../utils/posthog';
import { LeagueFeature } from '../../../constants/leagues';
import { useLeagueFeatureFlag } from '../../../hooks/useLeague';

interface TeamAccountPromoProps {
  inline?: boolean;
}

const TeamAccountPromo: FC<TeamAccountPromoProps> = ({ inline }) => {
  const navigation = useNavigation();
  const { settings } = useSettings();

  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    const getSchoolName = async () => {
      if (!TEAM_ACCOUNT_PROMO_ENABLED) {
        return;
      }

      if (!settings.schoolAccount.connected || !settings.schoolAccount.teamId) {
        return;
      }

      const { data, error } = await supabase
        .from('teams')
        .select('id, schools(name)')
        .eq('id', settings.schoolAccount.teamId)
        .single();

      if (error) {
        posthog.capture('error', {
          message: 'Error fetching team school name in promo',
          error: JSON.stringify(error),
        });
      }

      if (data) {
        setSchoolName(data.schools?.name);
      }
    };

    getSchoolName();
  }, [settings.schoolAccount.connected, settings.schoolAccount.teamId]);

  const showPromo =
    useLeagueFeatureFlag(LeagueFeature.TEAM_ACCOUNTS) &&
    TEAM_ACCOUNT_PROMO_ENABLED;

  if (!showPromo) {
    return null;
  }

  if (settings.schoolAccount.connected) {
    return (
      <Promo
        onPress={() => {
          navigation.navigate(ScreenName.TEAM_ACCOUNT_HOW_IT_WORKS, {
            signedIn: true,
          });
        }}
        title={schoolName ?? 'Your School Account'}
        subtitle="See all your team's times in one place. When your trial is finished, upload it to your school account. Tap here to learn more."
        badge="CONNECTED"
        badgeColor={colors.GREEN}
        inline={inline}
      />
    );
  }

  return (
    <Promo
      onPress={() => {
        navigation.navigate(ScreenName.TEAM_ACCOUNT_EXPLAINER);
      }}
      title="Introducing School Accounts"
      subtitle="See all your team's times in one place, for free. Tap here to learn more."
      badge="NEW"
      badgeColor={colors.GREEN}
      inline={inline}
    />
  );
};

export default TeamAccountPromo;
