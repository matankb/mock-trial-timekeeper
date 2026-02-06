import React, { FC, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TimeEditorAndroidDialog from './TimeEditorAndroidDialog';
import { pad } from '../../utils';
import TimeEditorInput from './TimeEditorInput';

interface TimeEditorProps {
  value: number; // time in seconds
  name: string; // name of stage
  inline?: boolean;
  highlighted?: boolean;

  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;

  onChange: (newValue: number) => void;
}

const TimeEditor: FC<TimeEditorProps> = ({
  value,
  name,
  inline,
  highlighted,
  hoursLabel,
  minutesLabel,
  secondsLabel,
  onChange,
}) => {
  const [androidHoursDialogShown, setAndroidHoursDialogShown] = useState(false);
  const [androidMinutesDialogShown, setAndroidMinutesDialogShown] =
    useState(false);
  const [androidSecondsDialogShown, setAndroidSecondsDialogShown] =
    useState(false);

  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const displayHours = value >= 3600;

  const validateInput = (input: string, allowOver59 = false) => {
    const number = input.length > 0 ? Number(input) : 0;
    let error = null;
    if (isNaN(number)) {
      error = 'Please enter a number';
    } else if (!allowOver59 && number > 59) {
      error = 'Please enter a number less than 60';
    } else if (number < 0) {
      error = 'Please enter a positive number';
    } else if (Math.floor(number) !== number) {
      error = 'Please enter a whole number';
    } else if (input.length === 0) {
      error = 'Please enter a number';
    }
    return { error, newValue: number };
  };

  const handleIOSInputPress = (
    label: string,
    value: number,
    handleSave: (newValue: string) => void,
  ) => {
    Alert.prompt(
      label,
      `For ${name}`,
      handleSave,
      'plain-text',
      pad(value),
      'numeric',
    );
  };

  const handleIOSHoursPress = () => {
    return handleIOSInputPress(
      hoursLabel ?? 'Enter a new hours value',
      hours,
      handleHoursSave,
    );
  };

  const handleIOSMinutesPress = () => {
    return handleIOSInputPress(
      minutesLabel ?? 'Enter a new minutes value',
      minutes,
      handleMinutesSave,
    );
  };

  const handleIOSSecondsPress = () => {
    return handleIOSInputPress(
      secondsLabel ?? 'Enter a new seconds value',
      seconds,
      handleSecondsSave,
    );
  };

  const handleHoursSave = (newHours: string) => {
    const { error, newValue } = validateInput(newHours, true);
    if (error) {
      return Alert.alert(error);
    }
    onChange(newValue * 3600 + minutes * 60 + seconds);
  };

  const handleMinutesSave = (newMinutes: string) => {
    const { error, newValue } = validateInput(newMinutes);
    if (error) {
      return Alert.alert(error);
    }
    onChange(hours * 3600 + newValue * 60 + seconds);
  };

  const handleSecondsSave = (newSeconds: string) => {
    const { error, newValue } = validateInput(newSeconds);
    if (error) {
      return Alert.alert(error);
    }
    onChange(hours * 3600 + minutes * 60 + newValue);
  };

  const androidHoursDialog = (
    <TimeEditorAndroidDialog
      visible={androidHoursDialogShown}
      field="hours"
      stage={name}
      value={hours}
      hoursLabel={hoursLabel}
      minutesLabel={minutesLabel}
      secondsLabel={secondsLabel}
      handleSave={(newHours) => {
        setAndroidHoursDialogShown(false);
        handleHoursSave(newHours);
      }}
      handleCancel={() => {
        setAndroidHoursDialogShown(false);
      }}
    />
  );

  const androidMinutesDialog = (
    <TimeEditorAndroidDialog
      visible={androidMinutesDialogShown}
      field="minutes"
      stage={name}
      value={minutes}
      hoursLabel={hoursLabel}
      minutesLabel={minutesLabel}
      secondsLabel={secondsLabel}
      handleSave={(newMinutes) => {
        setAndroidMinutesDialogShown(false);
        handleMinutesSave(newMinutes);
      }}
      handleCancel={() => {
        setAndroidMinutesDialogShown(false);
      }}
    />
  );

  const androidSecondsDialog = (
    <TimeEditorAndroidDialog
      visible={androidSecondsDialogShown}
      field="seconds"
      stage={name}
      value={seconds}
      hoursLabel={hoursLabel}
      minutesLabel={minutesLabel}
      secondsLabel={secondsLabel}
      handleSave={(newSeconds) => {
        setAndroidSecondsDialogShown(false);
        handleSecondsSave(newSeconds);
      }}
      handleCancel={() => {
        setAndroidSecondsDialogShown(false);
      }}
    />
  );

  const handleHoursPress = () => {
    if (Platform.OS === 'ios') {
      handleIOSHoursPress();
    } else {
      setAndroidHoursDialogShown(true);
    }
  };

  const handleMinutesPress = () => {
    if (Platform.OS === 'ios') {
      handleIOSMinutesPress();
    } else {
      setAndroidMinutesDialogShown(true);
    }
  };

  const handleSecondsPress = () => {
    if (Platform.OS === 'ios') {
      handleIOSSecondsPress();
    } else {
      setAndroidSecondsDialogShown(true);
    }
  };

  return (
    <View style={[styles.container, inline && styles.containerInline]}>
      {displayHours && (
        <>
          <TimeEditorInput
            value={hours}
            onPress={handleHoursPress}
            onChange={handleHoursSave}
            inline={inline}
          />
          <Text style={highlighted && styles.highlightedText}>:</Text>
        </>
      )}
      <TimeEditorInput
        value={minutes}
        onPress={handleMinutesPress}
        onChange={handleMinutesSave}
        inline={inline}
      />
      <Text style={highlighted && styles.highlightedText}>:</Text>
      <TimeEditorInput
        value={seconds}
        onPress={handleSecondsPress}
        onChange={handleSecondsSave}
        inline={inline}
      />
      {Platform.OS === 'android' && (
        <>
          {displayHours && androidHoursDialog}
          {androidMinutesDialog}
          {androidSecondsDialog}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 5,
    borderRadius: 7,
    justifyContent: 'space-between',
  },
  containerInline: {
    marginBottom: 0.3,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 7,
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputInline: {
    width: 40,
    height: 'auto',
    padding: 6,
  },
  highlightedText: {
    color: 'white',
  },
});
export default TimeEditor;
