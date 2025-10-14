/**
 * This screen shows users the information to fill out on the AMTA-provided
 * Timekeeper - Time Report form.
 * ! Important: Currently ONLY FOR FLEX TRIALS, normal trials have a different form.
 */

import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import useTrial from '../../hooks/useTrial';
import { piSideName } from '../../utils';
import Text from '../Text';

type TimeBreakdownProps = NativeStackScreenProps<
  RouteProps,
  ScreenName.TIMES_BREAKDOWN
>;

export interface TimeReportRouteProps {
  trialId: string;
  trialName: string;
}

export const timeReportScreenOptions = ({
  route,
}): NativeStackNavigationOptions => ({
  title: 'Timekeeper - Time Report',
  headerBackButtonDisplayMode: 'minimal',
});

const TimeReport: FC<TimeBreakdownProps> = ({ route }) => {
  const [trial] = useTrial(route.params.trialId);

  const createGridCell = (
    text?: string,
    textColor?: string,
    backgroundColor?: string,
  ) => {
    return (
      <View
        style={{
          ...styles.gridItem,
          backgroundColor: backgroundColor ? backgroundColor : 'transparent',
        }}
      >
        {text && (
          <Text
            style={{
              ...styles.gridText,
              color: textColor ? textColor : 'black',
            }}
          >
            {text}
          </Text>
        )}
      </View>
    );
  };

  const createTimeGridCell = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      <View style={styles.gridItem}>
        <Text style={styles.gridTimeText}>
          <Text style={styles.timeValueText}>
            &nbsp;&nbsp;{minutes}&nbsp;&nbsp;
          </Text>{' '}
          min.
        </Text>
        <Text style={styles.gridTimeText}>
          <Text style={styles.timeValueText}>
            &nbsp;&nbsp;{seconds}&nbsp;&nbsp;
          </Text>{' '}
          sec.
        </Text>
      </View>
    );
  };

  const pDirectTime =
    trial.times.prosCic.witnessOne.direct +
    trial.times.prosCic.witnessTwo.direct +
    trial.times.prosCic.witnessThree.direct;
  const pCrossTime =
    trial.times.defCic.witnessOne.cross +
    trial.times.defCic.witnessTwo.cross +
    trial.times.defCic.witnessThree.cross;
  const dDirectTime =
    trial.times.defCic.witnessOne.direct +
    trial.times.defCic.witnessTwo.direct +
    trial.times.defCic.witnessThree.direct;
  const dCrossTime =
    trial.times.prosCic.witnessOne.cross +
    trial.times.prosCic.witnessTwo.cross +
    trial.times.prosCic.witnessThree.cross;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {createGridCell()}
        {/* Colors taken from time report sheet */}
        {createGridCell(`${piSideName}'s Time Used`, 'black', '#d9d9d9')}
        {createGridCell("Defense's Time Used", 'white', '#545454')}
        {createGridCell('Direct Examinations')}
        {createTimeGridCell(pDirectTime)}
        {createTimeGridCell(dDirectTime)}
        {createGridCell('Cross Examinations')}
        {createTimeGridCell(pCrossTime)}
        {createTimeGridCell(dCrossTime)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: 'white',
  },
  gridItem: {
    width: '33.33%',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderWidth: 1,
    borderColor: '#000',
  },
  gridTimeText: {
    textAlign: 'center',
  },
  gridText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  timeValueText: {
    textDecorationLine: 'underline',
  },
});

export default TimeReport;
