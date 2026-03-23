import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import LeagueCard from './LeagueCard';
import Button from '../../Button';
import TextInput from '../../TextInput';
import { League, leagueNames } from '../../../constants/leagues';
import { useSettings } from '../../../hooks/useSettings';
import { setLeague } from '../../../controllers/settings';
import { useNavigation } from '../../../types/navigation';
import Link from '../../Link';
import { ScreenName } from '../../../constants/screen-names';

interface LeagueSelectorItem {
  league: League;
  name: string;
  description?: string;
  image: number;
  searchTerms?: string[];
}

// TODO: type this so it's enforced.
const LEAGUE_LIST: LeagueSelectorItem[] = [
  {
    league: League.AMTA,
    name: 'College Mock Trial',
    description: 'American Mock Trial Association',
    image: require('../../../../assets/leagues/amta.png'),
    searchTerms: ['amta'],
  },
  {
    league: League.Arizona,
    name: 'High School Mock Trial in Arizona',
    image: require('../../../../assets/leagues/arizona.png'),
  },
  {
    league: League.CNMI,
    name: 'High School Mock Trial in CNMI',
    description: 'Commonwealth of the Northern Mariana Islands',
    image: require('../../../../assets/leagues/cnmi.jpg'),
  },
  {
    league: League.Florida,
    name: 'High School Mock Trial in Florida',
    image: require('../../../../assets/leagues/florida.png'),
  },
  {
    league: League.Idaho,
    name: 'High School Mock Trial in Idaho',
    image: require('../../../../assets/leagues/idaho.jpg'),
  },
  {
    league: League.Minnesota,
    name: 'High School Mock Trial in Minnesota',
    image: require('../../../../assets/leagues/minnesota.jpg'),
  },
  {
    league: League.Missouri,
    name: 'High School Mock Trial in Missouri',
    image: require('../../../../assets/leagues/missouri.png'),
  },
  {
    league: League.NorthDakota,
    name: 'High School Mock Trial in North Dakota',
    image: require('../../../../assets/leagues/north-dakota.png'),
  },
];

const normalizeForSearch = (s: string) => {
  return s.toLowerCase().trim();
};

const LeagueSelector: FC = () => {
  const navigation = useNavigation();
  const { settings, setSettings } = useSettings();

  const [selected, setSelected] = useState<League | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selected === null) {
      setSelected(settings.league.league);
    }
  }, [settings, selected]);

  const filteredLeagues = useMemo(() => {
    const query = normalizeForSearch(searchQuery);

    return LEAGUE_LIST.filter((item) => {
      if (!query) {
        return true;
      }

      const name = normalizeForSearch(item.name);
      const description = normalizeForSearch(item.description ?? '');
      const searchTerms =
        item.searchTerms?.map((term) => normalizeForSearch(term)) || [];

      return (
        name.includes(query) ||
        description.includes(query) ||
        searchTerms.some((term) => term.includes(query))
      );
    }).sort((a, b) => {
      // Ensure the first item is the selected league
      if (a.league === settings.league.league) return -1;
      if (b.league === settings.league.league) return 1;

      return 0;
    });
  }, [searchQuery, settings.league.league]);

  const handleConfirm = async () => {
    if (selected) {
      const newSettings = await setLeague(selected);
      setSettings(newSettings);
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenName.HOME }],
      });
    }
  };

  const handleContinue = () => {
    if (!selected) {
      return;
    }

    const confirmationText = `Please confirm that you are competing in ${
      leagueNames[selected]
    }.`;

    const buttonText = `Confirm ${leagueNames[selected]}`;

    if (Platform.OS === 'web') {
      handleConfirm();
      return;
    }

    Alert.alert(
      'Confirm League',
      `${confirmationText}\n\nYou can change this later in the settings.`,
      [
        { text: 'Go Back', onPress: () => setSelected(null) },
        { text: buttonText, onPress: handleConfirm },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search leagues"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ScrollView style={styles.leaguesContainer}>
        {filteredLeagues.map((item, index) => (
          <LeagueCard
            key={item.league}
            index={index}
            selected={selected === item.league}
            onSelect={() => setSelected(item.league)}
            name={item.name}
            description={item.description}
            image={item.image}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
        />
        <Link
          title="Which league should I select?"
          onPress={() => navigation.navigate(ScreenName.LEAGUE_SELECTOR_HELP)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    height: '100%',
    ...Platform.select({
      web: {
        width: 800,
        marginHorizontal: 'auto',
      },
    }),
  },
  searchBar: {
    // marginBottom: 10,
    marginTop: 20,
  },
  leaguesContainer: {
    // backgroundColor: 'red',
    marginTop: 10,
  },
  buttonsContainer: {
    display: 'flex',
    gap: 5,
    // backgroundColor: 'blue',
  },
});

export default LeagueSelector;
