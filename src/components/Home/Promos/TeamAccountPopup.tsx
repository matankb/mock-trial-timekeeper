import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import * as Linking from 'expo-linking';
import Text from '../../Text';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Button from '../../Button';

export const teamAccountPopupScreenOptions: NativeStackNavigationOptions = {
  title: 'Introducing Team Accounts',
  presentation: 'modal',
};

interface PromoImageProps {
  source: ImageSourcePropType;
  width: number;
  height: number;
}

const PromoImage = ({ source, width, height }: PromoImageProps) => {
  const ratio = Dimensions.get('window').width / width;
  const imageHeight = height * ratio;

  return (
    <Image source={source} style={[styles.image, { height: imageHeight }]} />
  );
};

export const TeamAccountPopup = () => {
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Introducing Team Accounts</Text>
          <Text style={styles.subtitle}>
            Take your mock trial practice to the next level with collaborative
            features designed for teams
          </Text>
        </View>

        {/* First Image */}
        <PromoImage
          source={require('../../../../assets/promos/examinations.jpg')}
          width={820}
          height={544}
        />

        {/* First Promotional Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Streamlined Examinations</Text>
          <Text style={styles.promoText}>
            Coordinate witness examinations with your team in real-time. Share
            notes, track timing, and ensure everyone stays on the same page
            during practice sessions.
          </Text>
        </View>

        {/* Second Image */}
        <PromoImage
          source={require('../../../../assets/promos/dashboard.jpg')}
          width={888}
          height={1554}
        />

        {/* Second Promotional Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Comprehensive Dashboard</Text>
          <Text style={styles.promoText}>
            Monitor your team's progress with detailed analytics and performance
            insights. Track individual and team improvements over time with our
            intuitive dashboard.
          </Text>
        </View>

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Elevate Your Practice?</Text>
          <Text style={styles.ctaText}>
            Join thousands of mock trial teams who have already upgraded their
            practice sessions
          </Text>
        </View>
      </ScrollView>

      <Button
        title="Sign Up"
        onPress={() => Linking.openURL('https://mocktrialtimer.com')}
        style={styles.floatingButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 20,
    paddingBottom: 150,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  promoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  promoText: {
    fontSize: 16,
    color: '#5a6c7d',
    lineHeight: 24,
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: '#3498db',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 16,
    color: '#ecf0f1',
    textAlign: 'center',
    lineHeight: 22,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
});
