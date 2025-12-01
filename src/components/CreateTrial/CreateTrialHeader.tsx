import { FC } from 'react';
import { Button } from 'react-native';

import { ScreenName } from '../../constants/screen-names';
import { NavigationProp } from '../../types/navigation';

interface CreateTrialHeaderLeftProps {
  navigation: NavigationProp<ScreenName.CREATE_TRIAL | ScreenName.UPDATE_TRIAL>;
}

export const CreateTrialHeaderLeft: FC<CreateTrialHeaderLeftProps> = ({
  navigation,
}) => <Button title="Cancel" onPress={() => navigation.goBack()} />;
