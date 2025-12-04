import React, { FC } from 'react';

import { ScreenName } from '../../../constants/screen-names';
import { useNavigation } from '../../../types/navigation';
import SettingSection from '../SettingSection';
import Link from '../../Link';
import { StyleSheet, View } from 'react-native';
import { useSettingsLeague } from '../../../hooks/useSettings';
import { leagueNames, League } from '../../../constants/leagues';

const LeagueSettings: FC = () => {
  const navigation = useNavigation();

  const league = useSettingsLeague();
  const description = league === League.AMTA ? '(AMTA)' : '';

  return (
    <SettingSection title="League">
      <View style={styles.container}>
        <Link
          title={league ? leagueNames[league] : ''}
          subtitle={description}
          onPress={() => navigation.navigate(ScreenName.LEAGUE_SELECTION)}
          inline
        />
      </View>
    </SettingSection>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 5,
  },
});

export default LeagueSettings;
