import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '../../../constants/colors';
import { Theme } from '../../../types/theme';
import useTheme from '../../../hooks/useTheme';
import { formatTime } from '../../../utils';

interface TimeSummaryRowProps {
  name: string;
  timeRemaining: number;
  highlighted: boolean;
  highlightColor: string;
}

const TimeSummaryRow: FC<TimeSummaryRowProps> = (props) => {
  const theme = useTheme();

  const defaultRowBackground =
    theme === Theme.LIGHT ? 'white' : colors.BACKGROUND_GRAY;

  const rowStyle = {
    ...styles.row,
    backgroundColor: props.highlighted
      ? props.highlightColor
      : defaultRowBackground,
  };

  const defaultTextColor = theme === Theme.LIGHT ? 'black' : 'white';

  const textStyle = {
    ...styles.text,
    color: props.highlighted ? 'white' : defaultTextColor,
  };

  return (
    <View>
      <View style={rowStyle}>
        <Text style={textStyle}>{props.name}</Text>
        <Text style={textStyle}>{formatTime(props.timeRemaining)}</Text>
      </View>
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
