import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FC } from 'react';

import Promo from './Promo';
import colors from '../../../constants/colors';
import { FLEX_TIMING_ENABLED } from '../../../constants/feature-flags';

/**
 * Swing timing promotional message, shown during the 2024-2025 season.
 * *Currently unused*
 */

interface SwingTimingPromoProps {
  onPress: any;
}

const SwingTimingPromo: FC<SwingTimingPromoProps> = ({ onPress }) => {
  if (!FLEX_TIMING_ENABLED) {
    return null;
  }

  return (
    <Promo
      onPress={onPress}
      icon={
        <MaterialIcons
          name="tips-and-updates"
          size={33}
          color={colors.BRIGHT_GREEN}
        />
      }
      title="Using the experimental timing system?"
      subtitle="Tap here to learn more"
    />
  );
};

export default SwingTimingPromo;
