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

  flexEnabled?: boolean; // if flex is enabled on this row
  flexTimeRemaining?: number;
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

  const showFlex =
    props.flexEnabled && props.highlighted && props.timeRemaining <= 0; // todo: calculate this better
  const timeRemaining = !props.flexEnabled
    ? props.timeRemaining
    : Math.max(0, props.timeRemaining); // if flex is on, don't bring the main time below 0 - the negative will be shown in the flex time

  return (
    <View>
      <View
        style={{
          ...rowStyle,
          ...(showFlex ? styles.topRowWithFlex : {}),
        }}
      >
        <Text style={textStyle}>{props.name}</Text>
        <Text style={textStyle}>{formatTime(timeRemaining)}</Text>
      </View>
      {showFlex && (
        <View
          style={{
            ...rowStyle,
            ...(showFlex ? styles.bottomRowWithFlex : {}),
          }}
        >
          <Text style={textStyle}>Swing Time</Text>
          <Text style={textStyle}>{formatTime(props.flexTimeRemaining)}</Text>
        </View>
      )}
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
  topRowWithFlex: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  bottomRowWithFlex: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 16,
  },
});
export default TimeSummaryRow;
