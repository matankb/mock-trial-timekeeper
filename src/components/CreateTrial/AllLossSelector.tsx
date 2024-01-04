import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { FC } from 'react';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';

import colors from '../../constants/colors';

interface AllLossSelectorProps {
  allLossTime: number;
  setAllLossTime: (newTime: number) => void;
}

const AllLossSelector: FC<AllLossSelectorProps> = ({
  allLossTime,
  setAllLossTime,
}) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const iosTimePicker = (
    <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={new Date(allLossTime)}
        mode="time"
        is24Hour
        onChange={(e) => setAllLossTime(e.nativeEvent.timestamp)}
        display="spinner"
        themeVariant="light"
      />
    </View>
  );

  const androidTimePicker = (
    <Pressable
      onPress={() => setShowPicker(true)}
      style={styles.androidTimePickerContainer}
    >
      <Text
        style={{
          fontSize: 18,
        }}
      >
        {new Date(allLossTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <Feather name="edit-2" size={20} color="gray" />
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(allLossTime)}
          mode="time"
          onChange={(e) => {
            setAllLossTime(e.nativeEvent.timestamp);
            setShowPicker(false);
          }}
          display="spinner"
        />
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>All-Loss Time</Text>
      </View>
      {Platform.OS === 'ios' ? iosTimePicker : androidTimePicker}
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
  androidTimePickerContainer: {
    padding: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default AllLossSelector;
