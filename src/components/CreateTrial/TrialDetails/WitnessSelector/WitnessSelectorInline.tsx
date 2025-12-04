import { Promos } from '../../../../controllers/promos';
import { usePromo } from '../../../../hooks/usePromos';
import CreateTrialSection from '../../CreateTrialSection';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Promo from '../../../Home/Promos/Promo';
import { MaterialIcons } from '@expo/vector-icons';
import WitnessSelector from './WitnessSelector';
import colors from '../../../../constants/colors';
import Text from '../../../Text';

export const WitnessSelectorInline = () => {
  const promo = usePromo(Promos.WITNESS_CALL);

  if (promo.loading) {
    return null;
  }

  return (
    <CreateTrialSection
      title="Witness Call"
      color={colors.ORANGE}
      subtitle="Optional"
    >
      {promo.enabled && (
        <View>
          <View style={styles.promoContainer}>
            <Promo
              inline
              title="Introducing Witness Calls"
              subtitle="You can now optionally add the witness call order to your trial, letting you see the witness name for each examination, instead of just a number."
              badge="NEW"
              badgeColor={colors.ORANGE}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => promo.dismiss()}
          >
            <Text style={styles.buttonText}>Set witness call</Text>
            <MaterialIcons
              name="navigate-next"
              size={25}
              color={colors.ORANGE}
              style={styles.buttonArrow}
            />
          </TouchableOpacity>
        </View>
      )}
      {!promo.enabled && <WitnessSelector inline />}
    </CreateTrialSection>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  buttonArrow: {
    // offset slight visual difference between text and arrow, despite align-items: center
    marginTop: 2,
  },
  promoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    paddingLeft: 10,
    color: colors.ORANGE,
  },
});
