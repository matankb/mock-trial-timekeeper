import React, { FC, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '../../constants/colors';
import { formatTimeWords } from '../../utils';

interface AllLossProps {
  allLossTime: number;
}

const ALERT_CUTOFF_MINUTES = 20;

const AllLoss: FC<AllLossProps> = ({ allLossTime }) => {
  const interval = React.useRef<NodeJS.Timeout>();
  const [refresh, setRefresh] = React.useState(0);

  const timeRemaining = Math.floor((allLossTime - Date.now()) / 1000);
  const allLossPassed = timeRemaining <= 0;
  const highlightText =
    !allLossPassed && timeRemaining < ALERT_CUTOFF_MINUTES * 60;

  useEffect(() => {
    if (allLossPassed) {
      return;
    }

    interval.current = setInterval(() => setRefresh(Math.random()), 1000);

    return () => {
      clearInterval(interval.current);
    };
  });

  return (
    <View>
      <Text
        style={{
          ...styles.container,
          ...(highlightText ? styles.highlight : {}),
        }}
      >
        {allLossPassed
          ? 'All-Loss has passed'
          : `All-Loss in ${formatTimeWords(timeRemaining)}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: 'gray',
    marginVertical: 3,
    fontSize: 15,
    textAlign: 'center',
  },
  highlight: {
    color: colors.RED,
  },
});
export default AllLoss;
