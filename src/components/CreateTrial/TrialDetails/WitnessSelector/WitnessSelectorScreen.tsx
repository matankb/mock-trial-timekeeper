import {
  ScreenNavigationOptions,
  ScreenProps,
} from '../../../../types/navigation';
import { Platform } from 'react-native';
import { ScreenName } from '../../../../constants/screen-names';
import WitnessSelector from './WitnessSelector';
import { FC } from 'react';
import LinkButton from '../../../LinkButton';
import { useSettingsLeague } from '../../../../hooks/useLeague';

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
  // TODO: (CRITICAL??): I think we should be passing in the league here in some way...
  const league = useSettingsLeague();
  return <WitnessSelector inline={false} league={league} />;
};

export default WitnessSelectorScreen;
