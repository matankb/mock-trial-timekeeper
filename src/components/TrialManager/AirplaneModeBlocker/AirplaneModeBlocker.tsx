import { Feather } from '@expo/vector-icons';
import { getNetworkStateAsync, isAirplaneModeEnabledAsync } from 'expo-network';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Button as UIButton,
  Platform,
} from 'react-native';

import overrideWarningText from './override-warning';
import { AirplaneBlockerContext } from '../../../context/AirplaneBlockerContext';
import { Theme } from '../../../context/ThemeContext';
import useTheme from '../../../hooks/useTheme';
import Button from '../../Button';
import LinkButton from '../../LinkButton';
import Text from '../../Text';

interface AirplaneModeBlockerProps {
  children: React.ReactNode;
}

const AirplaneModeBlocker: FC<AirplaneModeBlockerProps> = ({ children }) => {
  const theme = useTheme();

  const [showWarning, setShowWarning] = useState(false);
  const [airplaneBlockerState, setAirplaneBlockerState] = useContext(
    AirplaneBlockerContext,
  );

  const checkNetworkConnected = async () => {
    if (Platform.OS === 'android') {
      const airplaneMode = await isAirplaneModeEnabledAsync();
      setShowWarning(!airplaneMode);
    } else {
      const network = await getNetworkStateAsync();
      setShowWarning(network.isConnected);
    }
  };

  const handleOverridePress = () => {
    Alert.alert('Are you sure you want to continue?', overrideWarningText, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Continue',
        style: 'destructive',
        onPress: () => {
          setShowWarning(false);
          setAirplaneBlockerState({ hide: true });
        },
      },
    ]);
  };

  useEffect(() => {
    if (!airplaneBlockerState.hide) {
      checkNetworkConnected();
    }
  }, []);

  if (airplaneBlockerState.hide || !showWarning) {
    return <View>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={60} color="gray" />
      <Text style={styles.text}>Enable Airplane Mode</Text>
      <Text
        style={{
          ...styles.instructions,
          color: theme === Theme.LIGHT ? 'gray' : 'lightgray',
        }}
      >
        It looks like your device is connected to the internet. According to
        AMTA rules, you must enable Airplane Mode and turn off Wi-Fi to use the
        timer during sanctioned tournaments.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Check Airplane Mode Status Again"
          onPress={() => checkNetworkConnected()}
        />
      </View>
      <LinkButton title="Continue Anyways" onPress={handleOverridePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 40,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 20,
  },
  instructions: {
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AirplaneModeBlocker;
