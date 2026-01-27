import CreateTrialSection from "../../CreateTrialSection";
import WitnessSelector from "./WitnessSelector";
import colors from "../../../../constants/colors";
import { League } from "../../../../constants/leagues";
import { FC } from "react";

interface WitnessSelectorInlineProps {
  league: League;
}

export const WitnessSelectorInline: FC<WitnessSelectorInlineProps> = ({
  league,
}) => {
  return (
    <CreateTrialSection
      title="Witness Call"
      color={colors.ORANGE}
      subtitle="Optional"
    >
      <WitnessSelector inline league={league} />
    </CreateTrialSection>
  );
};
