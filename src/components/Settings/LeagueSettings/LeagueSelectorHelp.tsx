import Card from '../../Card';
import Text from '../../Text';
import { openSupportEmail } from '../../../utils/bug-report';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Link from '../../Link';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

interface HelpTextProps {
  children: React.ReactNode;
}

const HelpText: FC<HelpTextProps> = ({ children }) => {
  return (
    <Text style={styles.text} lightColor="#676767">
      {children}
    </Text>
  );
};

export const LeagueSelectorHelp: FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="school-outline"
            size={28}
            style={styles.icon}
          />
          <Text style={styles.title}>Current college students</Text>
        </View>
        <HelpText>
          If you are an undergraduate college student in the United States,
          select &quot;College Mock Trial&quot;.
        </HelpText>
        <HelpText>
          If you are an undergraduate college student at a Canadian university
          that competes in the United States, select &quot;College Mock
          Trial&quot;.
        </HelpText>
        <HelpText>
          If you are a college student in a different country, Mock Trial Timer
          does not currently support your league.
        </HelpText>
        <View style={styles.titleContainer}>
          <Feather name="book" size={20} style={styles.icon} />
          <Text style={styles.title}>Current high school students</Text>
        </View>
        <HelpText>
          If you are a high school student in one of the supported states
          (Minnesota, Florida, or Idaho), select &quot;High School Mock
          Trial&quot; in your state.
        </HelpText>
        <HelpText>
          If you are a high school student in another state, Mock Trial Timer
          does not currently support your league.
        </HelpText>

        <View style={styles.titleContainer}>
          <MaterialIcons name="question-mark" size={20} style={styles.icon} />
          <Text style={styles.title}>Questions?</Text>
        </View>
        <HelpText>
          Please ask your coach, captain, or advisor for assistance, or contact
          Mock Trial Timer support.
        </HelpText>
      </Card>
      <Link
        title="Contact Mock Trial Timer Support"
        onPress={openSupportEmail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    paddingHorizontal: 20,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    display: 'flex',
  },
  icon: {
    color: '#676767',
    display: 'none',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
