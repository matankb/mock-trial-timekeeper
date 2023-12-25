import { NativeStackScreenProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RouteProps } from '../../App';
import { ScreenName } from '../../constants/screen-names';
import Card from '../Card';
import Link from '../Link';

type AboutProps = NativeStackScreenProps<RouteProps, ScreenName.ABOUT>;

export const aboutScreenOptions = {
  headerBackTitle: 'Home',
};

const About: FC<AboutProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Card style={{ marginBottom: 10 }}>
          <Text style={styles.text}>
            Mock Trial Timekeeper helps you timekeep for AMTA Mock Trial
            competitions!
          </Text>
          <Text style={styles.text}>
            This app is permitted at all AMTA-sanctioned tournaments (see AMTA
            Policy for more). Not affiliated with or endorsed by AMTA.
          </Text>
          <Text style={styles.text}>
            If you like Mock Trial Timekeeper, please leave a review!
          </Text>
        </Card>
        <Link
          title="Contact Us"
          onPress={() =>
            Linking.openURL(
              `mailto:205matan@gmail.com?subject=${encodeURIComponent(
                'Mock Trial Timekeeper - Contact',
              )}`,
            )
          }
        />
        <Link
          title="Disclaimer"
          onPress={() => navigation.navigate(ScreenName.DISCLAIMER)}
        />
        <Link
          title="AMTA Policy"
          onPress={() => navigation.navigate(ScreenName.AMTA_POLICY)}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Version {Constants.expoConfig.version}
        </Text>
        <Text style={styles.footerText}>Created by Matan Kotler-Berkowitz</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // paddingHorizontal: 20,
    // backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  text: {
    lineHeight: 25,
    // paddingRight: "6%",
    // paddingLeft: "6%",
    marginTop: 10,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    // fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
    color: 'gray',
  },
});

export default About;
