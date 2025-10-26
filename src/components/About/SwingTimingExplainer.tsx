import {
  NativeStackNavigationOptions,
  NativeStackOptionsArgs,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import LinkButton from '../LinkButton';
import Text from '../Text';
import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';

type SwingTimingExplainerOptionsArgs = NativeStackOptionsArgs<
  RouteProps,
  ScreenName.SWING_TIMING_EXPLAINER
>;

export const swingTimingExplainerScreenOptions = ({
  navigation,
}: SwingTimingExplainerOptionsArgs): NativeStackNavigationOptions => ({
  title: 'Swing Timing Explainer',
  presentation: 'modal',
  headerRight: () => (
    <LinkButton title="Close" onPress={() => navigation.goBack()} />
  ),
});

const SwingTimingExplainer: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        AMTA is testing out a new swing timing system at certain invitationals.
      </Text>
      <Text style={styles.text}>
        If you are at one of these invitationals, here&apos;s how to use Mock
        Timer to keep track of the new swing timing.
      </Text>
      <Text style={styles.step}>
        1. Turn on Swing Time Experiment when you create a new trial.
      </Text>
      <Text style={styles.text}>
        Tap on the menu in the top-right hand corner, then check off &quot;Swing
        Time Experiment&quot;. Make sure to do this for every new round. If you
        forget, you can turn it on later by tapping on the same menu button on
        the trial screen.
      </Text>
      <Text style={styles.step}>2. Use the app as you normally would.</Text>
      <Text style={styles.text}>
        If either team uses swing time, the app will automatically move time
        over from directs to crosses and vice versa.
      </Text>
      <Text style={styles.step}>
        3. When the trial is over, fill in the Time Report sheet.
      </Text>
      <Text style={styles.text}>
        At the end of the trial, a link will appear to a screen called
        &quot;Timekeeper Report Sheet&quot;. Copy the numbers on that screen
        onto the physical sheet you were given.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
  },
  step: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default SwingTimingExplainer;
