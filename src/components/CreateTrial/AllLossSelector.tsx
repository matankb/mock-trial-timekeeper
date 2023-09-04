import DateTimePicker from '@react-native-community/datetimepicker';
import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import colors from '../../constants/colors';

interface AllLossSelectorProps {
  allLossTime: number;
  setAllLossTime: (newTime: number) => void;
}

const AllLossSelector: FC<AllLossSelectorProps> = ({
  allLossTime,
  setAllLossTime,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All-Loss Time</Text>
      </View>
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(allLossTime)}
          mode="time"
          is24Hour
          onChange={(e) => setAllLossTime(e.nativeEvent.timestamp)}
          display="spinner"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: colors.GREEN,
    paddingVertical: 2,
    paddingLeft: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  headerText: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: 'white',
  },
});
export default AllLossSelector;
