import {
  ScreenNavigationOptions,
  ScreenProps,
} from '../../../../types/navigation';
import { Platform } from 'react-native';
import { ScreenName } from '../../../../constants/screen-names';
import WitnessSelector from './WitnessSelector';
import { FC } from 'react';
import LinkButton from '../../../LinkButton';

export const witnessSelectorScreenOptions: ScreenNavigationOptions<
  ScreenName.WITNESS_SELECTOR
> = ({ navigation }) => ({
  title: 'Select Witness',
  ...(Platform.OS === 'ios' && {
    presentation: 'modal',
    headerRight: () => (
      <LinkButton title="Done" onPress={() => navigation.goBack()} />
    ),
  }),
});

const WitnessSelectorScreen: FC<
  ScreenProps<ScreenName.WITNESS_SELECTOR>
> = () => {
  // This component is needed to wrap the WitnessSelector component in a screen,
  // since the WitnessSelector component takes non-screen props.
  return <WitnessSelector inline={false} />;
};

export default WitnessSelectorScreen;
