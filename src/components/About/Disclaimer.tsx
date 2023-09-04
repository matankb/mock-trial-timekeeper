import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Disclaimer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Mock Trial Timekeeper is permitted at AMTA-sanctioned competitions
        (Regionals, ORCS, and Nationals). See "AMTA Policy" for more. However,
        it may not be permitted at invitationals. Always check with invitational
        staff before using this app during rounds.
      </Text>
      <Text style={styles.text}>
        Mock Trial Timekeeper is not affiliated with or endorsed by AMTA.
      </Text>
      <Text style={styles.text}>
        Mock Trial Timekeeper is provided “as is”, without warranty of any kind.
        While we are confident that this application functions correctly, we
        disclaim any liability for any software errors, including any problems
        of any kind that may arise from using this application during a
        competition, or any other problems that may arise from using this
        application in any other situation.
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
