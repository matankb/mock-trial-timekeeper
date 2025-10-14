import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';

export const disclaimerScreenOptions = {
  title: 'Disclaimer',
};

const Disclaimer = () => {
  const theme = useTheme();

  const textStyle = {
    ...styles.text,
    ...(theme === Theme.DARK && { color: 'white' }),
  };

  return (
    <View style={styles.container}>
      <Text style={textStyle}>
        Mock Trial Timekeeper is permitted at AMTA-sanctioned competitions
        (Regionals, ORCS, and Nationals). See "AMTA Policy" for more. However,
        it may not be permitted at invitationals. Always check with invitational
        staff before using this app during rounds.
      </Text>
      <Text style={textStyle}>
        Mock Trial Timekeeper is not affiliated with or endorsed by AMTA.
      </Text>
      <Text style={textStyle}>
        Mock Trial Timekeeper is provided “as is”, without warranty of any kind.
        While we are confident that this application functions correctly, we
        disclaim any liability for any software errors, including any problems
        of any kind that may arise from using this application during a
        competition, or any other problems that may arise from using this
        application in any other situation.
      </Text>
      <Text style={textStyle}>
        In addition to the above disclaimer, we especially warn against using
        this application improperly during a competition. In particular, any
        mobile devices used during rounds must be in Airplane Mode and
        disconnected from WiFi. While this application attempts to detect and
        warn against these conditions, it is not guaranteed to do so correctly.
        It is the user's responsibility to ensure that their device is in
        Airplane Mode and disconnected from WiFi before using this application
        during a competition. We are not responsible for any sanction that may
        result from improperly using this application during a competition.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Disclaimer;
