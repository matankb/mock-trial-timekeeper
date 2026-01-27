import React, { FC, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import AirplaneModeWarning from './AirplaneModeWarning';
import { HomeHeaderIconLeft, HomeHeaderIconRight } from './HomeHeaderIcons';
import TeamAccountPromo from './Promos/TeamAccountPromo';
import { ScreenName } from '../../constants/screen-names';
import Button from '../Button';
import { ScreenNavigationOptions, ScreenProps } from '../../types/navigation';
import { useProvidedContext } from '../../context/ContextProvider';
import HomeTrialsList from './TrialsList/HomeTrialsList';
import { useSettings } from '../../hooks/useSettings';
import UpdateAlert from "../UpdateAlert/UpdateAlert";

export const homeScreenOptions: ScreenNavigationOptions<ScreenName.HOME> = {
  title: 'Mock Trial Timer',
  headerTitleAlign: 'center',
};

const Home: FC<ScreenProps<ScreenName.HOME>> = ({ navigation, route }) => {
  const {
    trials: { trials },
  } = useProvidedContext();

  const settings = useSettings();

  useEffect(() => {
    if (settings && settings.league.league === null) {
      navigation.replace(ScreenName.WELCOME);
    }
  }, [settings, navigation]);

  // This is a workaround to prevent a known issue
  // Ideally, options would be set in homeScreenOptions
  // see: https://github.com/react-navigation/react-navigation/issues/8657
  const setHeaderButtons = () => {
    navigation.setOptions({
      headerLeft: () => (
        <HomeHeaderIconLeft navigation={navigation} route={route} />
      ),
      headerRight: () => (
        <HomeHeaderIconRight navigation={navigation} route={route} />
      ),
    });
  };

  if (!trials) {
    return;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onLayout={() => setHeaderButtons()}
    >
      <View>
        <UpdateAlert />
        <HomeTrialsList trials={trials} navigation={navigation} />
        <Button
          title="New Trial"
          onPress={() => navigation.navigate(ScreenName.CREATE_TRIAL)}
        />
      </View>
      <View>
        <TeamAccountPromo />
        <AirplaneModeWarning />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 40,
    height: '100%',
  },
});

export default Home;
