import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { formatTime } from '../../../utils';

interface TimeSummaryRowProps {
  name: string;
  time: number;
  highlighted: boolean;
  highlightColor: string;
}

const TimeSummaryRow: FC<TimeSummaryRowProps> = (props) => {
  const rowStyle = {
    ...styles.row,
    backgroundColor: props.highlighted ? props.highlightColor : 'white',
  };

  const textStyle = {
    ...styles.text,
    color: props.highlighted ? 'white' : 'black',
  };

  return (
    <View style={rowStyle}>
      <Text style={textStyle}>{props.name}</Text>
      <Text style={textStyle}>{formatTime(props.time)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 12,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
});
export default TimeSummaryRow;
