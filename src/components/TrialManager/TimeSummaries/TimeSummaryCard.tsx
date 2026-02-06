import React, { FC } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Card from '../../Card';
import { formatTime } from '../../../utils';
import colors from '../../../constants/colors';

export interface TimeSummaryRowData {
  name: string;
  timeRemaining: number;
  highlighted?: boolean;
  highlightColor?: string;
}
interface TimeSummaryCardProps {
  title: string;
  overtime?: number;
  color: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const TimeSummaryCard: FC<TimeSummaryCardProps> = ({
  title,
  overtime,
  color,
  children,
  fullWidth = false,
}) => {
  return (
    <Card style={{ ...styles.container, ...(fullWidth && styles.fullWidth) }}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            ...styles.title,
            color,
          }}
        >
          {title}
        </Text>
        {overtime !== undefined && overtime > 0 && (
          <Text style={styles.warning}>{formatTime(overtime)} over time</Text>
        )}
      </View>

      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        flex: 1,
        width: 'auto',
        marginHorizontal: 'auto',
      },
    }),
  },
  fullWidth: {
    ...Platform.select({
      web: {
        width: '90%',
      },
    }),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  warning: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: colors.WARNING_RED,
    paddingHorizontal: 5,
    paddingVertical: 1,
    top: 1.5, // slight adjustment for visual alignment
    borderRadius: 5,
  },
});
export default TimeSummaryCard;
