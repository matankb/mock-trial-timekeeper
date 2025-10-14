import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RouteProps } from '../../Navigation';
import { ScreenName } from '../../constants/screen-names';
import { Theme } from '../../types/theme';
import useTheme from '../../hooks/useTheme';
import Card from '../Card';
import Link from '../Link';

type AboutProps = NativeStackScreenProps<RouteProps, ScreenName.ABOUT>;

export const aboutScreenOptions = {
  title: 'About',
  headerBackTitle: 'Home',
};

const About: FC<AboutProps> = ({ navigation }) => {
  const theme = useTheme();

  const textStyle = {
    ...styles.text,
    ...(theme === Theme.DARK && { color: 'white' }),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Card style={{ marginBottom: 10 }}>
          <Text style={textStyle}>
            Mock Trial Timekeeper helps you timekeep for AMTA Mock Trial
            competitions!
          </Text>
          <Text style={textStyle}>
            This app is permitted at all AMTA-sanctioned tournaments (see AMTA
            Policy for more). Not affiliated with or endorsed by AMTA.
          </Text>
          <Text style={textStyle}>
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
