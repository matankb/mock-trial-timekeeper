import { FC, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import LeagueCard from './LeagueCard';
import Button from '../../Button';
import colors from '../../../constants/colors';
import { League, leagueNames } from '../../../constants/leagues';
import { LeagueSelectorHelp } from './LeagueSelectorHelp';
import { useSettings } from '../../../hooks/useSettings';
import { setLeague } from '../../../controllers/settings';
import { useNavigation } from '../../../types/navigation';
import { ScreenName } from '../../../constants/screen-names';
import Link from '../../Link';

const LeagueSelector: FC = () => {
  const navigation = useNavigation();
  const settings = useSettings();

  const [selected, setSelected] = useState<League | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (settings && selected === null) {
      setSelected(settings.league.league);
    }
  }, [settings, selected]);

  const handleConfirm = async () => {
    if (selected) {
      await setLeague(selected);
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

    const confirmationText = `Please confirm that you are competing in ${leagueNames[selected]}.`;

    const buttonText = `Confirm ${leagueNames[selected]}`;

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
      <View>
        <LeagueCard
          selected={selected === League.AMTA}
          onSelect={() => setSelected(League.AMTA)}
          name={leagueNames[League.AMTA]}
          description="American Mock Trial Association"
          image={require('../../../../assets/leagues/amta.png')}
        />
        <LeagueCard
          selected={selected === League.Minnesota}
          onSelect={() => setSelected(League.Minnesota)}
          name="High School Mock Trial in Minnesota"
          image={require('../../../../assets/leagues/minnesota.jpg')}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
        />
        {showHelp ? (
          <LeagueSelectorHelp />
        ) : (
          <Link
            title="Which league should I select?"
            onPress={() => setShowHelp(true)}
            orientation="vertical"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingBottom: 50,
  },
  description: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
    fontSize: 16,
    color: colors.PLACEHOLDER_GRAY,
  },
  buttonsContainer: {
    display: 'flex',
    gap: 10,
  },
});

export default LeagueSelector;
