import { Entypo } from '@expo/vector-icons';
import { Picker as NativePicker } from '@react-native-picker/picker';
import React, { FC } from 'react';
import {
  Alert,
  AlertButton,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Theme } from '../../../../types/theme';
import useTheme from '../../../../hooks/useTheme';
import { Side } from '../../../../types/side';
import Text from '../../../Text';
import { useProvidedContext } from '../../../../context/ContextProvider';
import { LeagueWitnessSet } from '../../../../constants/leagues';
import { useLeagueSideName } from '../../../../hooks/useLeagueFeatureFlag';

interface WitnessSelectorItemProps {
  leagueWitnesses: LeagueWitnessSet;
  side: Side;
  position: number;
  witness: string | null;
  onSelect: (newWitness: string | null) => void;
  inline?: boolean;
}

/**
 * Given the side and the list of already selected witnesses, return the list of available witnesses
 */
function getAvailableWitnesses(
  leagueWitnesses: LeagueWitnessSet,
  side: Side,
  selected: string[],
) {
  console.log('leagueWitnesses', leagueWitnesses);
  const sideWitnesses = leagueWitnesses[side];
  const swingWitnesses = leagueWitnesses.swing;

  return [...sideWitnesses, ...swingWitnesses].filter(
    (witness) => !selected.includes(witness),
  );
}

const WitnessSelectorItem: FC<WitnessSelectorItemProps> = ({
  leagueWitnesses,
  side,
  position,
  witness,
  onSelect,
  inline,
}) => {
  const theme = useTheme();
  const sideName = useLeagueSideName(side);
  const {
    createTrial: {
      createTrialState: { pWitnessCall, dWitnessCall },
    },
  } = useProvidedContext();

  const selected = [...pWitnessCall, ...dWitnessCall].filter((w) => w !== null);

  const label = witness
    ? `${position + 1}. ${witness}`
    : `${sideName} Witness #${position + 1}`;

  // On iOS, show a modal with the list of available witnesses
  const showWitnessOptions = () => {
    const witnesses = getAvailableWitnesses(leagueWitnesses, side, selected);
    const name = `${sideName} Witness #${position + 1}`;

    const options: AlertButton[] = [
      ...witnesses.map((w) => ({
        text: w,
        onPress: () => onSelect(w),
      })),
      {
        text: `Cancel`,
      },
    ];

    if (witness) {
      options.push({
        text: `Clear ${name}`,
        // style: 'destructive',
        onPress: () => onSelect(null),
      });
    }

    Alert.alert(`Select ${name}`, '', options);
  };

  // On Android, show a picker with the list of available witnesses
  // since modals can only have three buttons
  if (Platform.OS === 'android') {
    return (
      <NativePicker selectedValue={witness} onValueChange={onSelect}>
        <NativePicker.Item label={witness || label} value={witness} />
        {getAvailableWitnesses(leagueWitnesses, side, selected).map((w) => (
          <NativePicker.Item key={w} label={w} value={w} />
        ))}
      </NativePicker>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, inline && styles.inlineContainer]}
      onPress={showWitnessOptions}
    >
      <Text style={[styles.name, !witness && styles.unselectedName]}>
        {label}
      </Text>
      <Entypo
        name="chevron-small-down"
        size={24}
        color={theme === Theme.DARK ? 'lightgray' : 'gray'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingVertical: 12,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  inlineContainer: {
    padding: 0,
  },
  name: {
    fontSize: 16,
  },
  unselectedName: {
    color: '#878787',
  },
});

export default WitnessSelectorItem;
