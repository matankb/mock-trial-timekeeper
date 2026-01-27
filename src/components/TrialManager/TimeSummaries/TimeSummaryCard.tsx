import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "../../Card";
import { formatTime } from "../../../utils";
import colors from "../../../constants/colors";

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
}

const TimeSummaryCard: FC<TimeSummaryCardProps> = ({
  title,
  overtime,
  color,
  children,
}) => {
  return (
    <Card>
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
          <Text style={styles.warning}>
            {formatTime(overtime)} over time
          </Text>
        )}
      </View>

      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 7,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  warning: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: colors.WARNING_RED,
    paddingHorizontal: 5,
    paddingVertical: 1,
    top: 1.5, // slight adjustment for visual alignment
    borderRadius: 5,
  },
});
export default TimeSummaryCard;
