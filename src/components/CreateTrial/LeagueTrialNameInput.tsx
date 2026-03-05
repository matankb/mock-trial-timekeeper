/**
 * Some leagues (e.g, Idaho) have custom trial name inputs.
 * This component is used to create a custom trial name input for those leagues.
 * It then takes the inputs and puts it into a single string title,
 * which gets saved to the actual trial, so we don't need to make it work throughout the rest of the app.
 * That means that UpdateTrial just uses a regular TextInput for the trial name.
 */

import { View, StyleSheet } from 'react-native';
import { FC, useEffect, useState } from 'react';
import TextInput from '../TextInput';
import CreateTrialSection from './CreateTrialSection';
import colors from '../../constants/colors';
import { useSettingsLeague, useLeagueSideName } from '../../hooks/useLeague';
import { League } from '../../constants/leagues';

interface LeagueTrialNameInputProps {
  setName: (name: string) => void;
  validate: boolean;
}

// Currently, only Idaho uses this, and so this is hardcoded for Idaho.
const LeagueTrialNameInput: FC<LeagueTrialNameInputProps> = ({
  setName,
  validate,
}) => {
  const pSideName = useLeagueSideName('p');
  const league = useSettingsLeague();

  if (league !== League.Idaho) {
    console.warn('LeagueTrialNameInput is only supported for Idaho');
  }

  //  note that "round" here is different than AMTA round number
  const [round, setRound] = useState<string>('');
  const [courtroom, setCourtroom] = useState<string>('');
  const [plaintiffTeamCode, setPlaintiffTeamCode] = useState<string>('');
  const [defenseTeamCode, setDefenseTeamCode] = useState<string>('');

  // When an input is edited, update both the internal state, and derive the full
  // trial name to pass to the parent.
  // this is a bit of a code smell
  useEffect(() => {
    if (!round || !courtroom || !plaintiffTeamCode || !defenseTeamCode) {
      return setName('');
    }

    // Only set the name if all inputs are valid
    setName(
      `Round ${round} - ${plaintiffTeamCode} v. ${defenseTeamCode} (Court ${courtroom})`,
    );
  }, [round, courtroom, plaintiffTeamCode, defenseTeamCode, setName]);

  return (
    <CreateTrialSection title="Trial Details" color={colors.DARK_GREEN}>
      <View style={styles.roundCourtroomContainer}>
        <TextInput
          placeholder="Round #"
          value={round}
          onChangeText={setRound}
          inline
          style={styles.smallInput}
          error={validate && !round}
          border
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Courtroom #"
          value={courtroom}
          onChangeText={setCourtroom}
          inline
          style={styles.smallInput}
          error={validate && !courtroom}
          border
          keyboardType="numeric"
        />
      </View>
      <View style={styles.teamCodeContainer}>
        <TextInput
          placeholder={`${pSideName} Team Code`}
          value={plaintiffTeamCode}
          onChangeText={setPlaintiffTeamCode}
          style={styles.largeInput}
          error={validate && !plaintiffTeamCode}
          full
          border
        />
        <TextInput
          placeholder="Defense Team Code"
          value={defenseTeamCode}
          onChangeText={setDefenseTeamCode}
          style={styles.largeInput}
          error={validate && !defenseTeamCode}
          full
          border
        />
      </View>
    </CreateTrialSection>
  );
};

const styles = StyleSheet.create({
  roundCourtroomContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 10,
  },
  smallInput: {
    width: 'auto',
    flex: 1,
  },
  largeInput: {
    marginTop: 15,
  },
  teamCodeContainer: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
});

export default LeagueTrialNameInput;
