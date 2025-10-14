import { Entypo } from '@expo/vector-icons';
import { Picker as NativePicker } from '@react-native-picker/picker';
import React, { FC, useContext } from 'react';
import {
  Alert,
  AlertButton,
  AlertOptions,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  DEFENSE_WITNESSES,
  PLAINTIFF_WITNESSES,
  SWING_WITNESSES,
} from '../../../../constants/witnesses';
import { CreateTrialContext } from '../../../../context/CreateTrialContext';
import { Theme } from '../../../../types/theme';
import useTheme from '../../../../hooks/useTheme';
import { Side } from '../../../../types/side';
import { getSideName } from '../../../../utils';
import Text from '../../../Text';

interface WitnessSelectorItemProps {
  side: Side;
  position: number;
  witness: string | null;
  onSelect: (newWitness: string) => void;
  inline?: boolean;
}

/**
 * Given the side and the list of already selected witnesses, return the list of available witnesses
 */
function getAvailableWitnesses(side: Side, selected: string[]) {
  const sideConstrainedWitnesses =
    side === 'p' ? PLAINTIFF_WITNESSES : DEFENSE_WITNESSES;

  return [...sideConstrainedWitnesses, ...SWING_WITNESSES].filter(
    (witness) => !selected.includes(witness),
  );
}

const WitnessSelectorItem: FC<WitnessSelectorItemProps> = ({
  side,
  position,
  witness,
  onSelect,
  inline,
}) => {
  const theme = useTheme();

  const [{ pWitnessCall, dWitnessCall }] = useContext(CreateTrialContext);
  const selected = [...pWitnessCall, ...dWitnessCall];

  const label = witness
    ? `${position + 1}. ${witness}`
    : `${getSideName(side)} Witness #${position + 1}`;

  // On iOS, show a modal with the list of available witnesses
  const showWitnessOptions = () => {
    const selected = [...pWitnessCall, ...dWitnessCall];
    const witnesses = getAvailableWitnesses(side, selected);
    const name = `${getSideName(side)} Witness #${position + 1}`;

    const options = witnesses.map((w) => ({
      text: w,
      onPress: () => onSelect(w),
    }));

    Alert.alert(`Select ${getSideName(side)} Witness #${position + 1}`, '', [
      ...options,
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  // On Android, show a picker with the list of available witnesses
  // since modals can only have three buttons
  if (Platform.OS === 'android') {
    return (
      <NativePicker selectedValue={witness} onValueChange={onSelect}>
        <NativePicker.Item label={witness || label} value={witness} />
        {getAvailableWitnesses(side, selected).map((w) => (
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
});

export default WitnessSelectorItem;
