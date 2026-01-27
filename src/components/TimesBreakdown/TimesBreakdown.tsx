import React, { useEffect } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";

import TimesBreakdownSection, { TimeSection } from "./TimesBreakdownSection";
import { ScreenName } from "../../constants/screen-names";
import { calculateNewTrialTime } from "../../controllers/trial";
import useTrial from "../../hooks/useTrial";
import LinkButton from "../LinkButton";
import { TrialStage } from "../../constants/trial-stages";
import { ScreenNavigationOptions, ScreenProps } from "../../types/navigation";
import { getSideName } from "../../hooks/useLeagueFeatureFlag";

export interface TimeBreakdownRouteProps {
  trialId: string;
  trialName: string;
}

export const timesBreakdownScreenOptions: ScreenNavigationOptions<
  ScreenName.TIMES_BREAKDOWN
> = ({ route }) => ({
  title: Platform.OS === "ios"
    ? `${route.params.trialName} Individual Times`
    : "Individual Times",
  headerBackButtonDisplayMode: "minimal",
  headerRight: () => <LinkButton title="Edit" onPress={() => {}} />,
});

const TimeBreakdown: React.FC<ScreenProps<ScreenName.TIMES_BREAKDOWN>> = ({
  route,
  navigation,
}) => {
  const [trial, setTrial] = useTrial(route.params.trialId);
  const [editing, setEditing] = React.useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing
          ? <LinkButton title="Done" onPress={() => setEditing(false)} />
          : <LinkButton title="Edit" onPress={() => setEditing(true)} />,
    });
  }, [editing]);

  if (!trial) {
    return null;
  }

  const handleTimeEdit = (stage: TrialStage, newTime: number) => {
    const newTrial = calculateNewTrialTime(trial, newTime, stage);
    setTrial(newTrial);
  };

  const createTimeBreakdownSection = (
    title: string,
    timeSections: TimeSection[],
  ) => {
    return (
      <TimesBreakdownSection
        title={title}
        trial={trial}
        timeSections={timeSections}
        onEdit={handleTimeEdit}
        editing={editing}
      />
    );
  };

  const { reexaminationsEnabled } = trial.setup;
  const piSideName = getSideName("p", trial.league);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {trial.setup.pretrialEnabled &&
          createTimeBreakdownSection("Pretrial", [
            ["pretrial.pros", "pretrial.def"],
          ])}
        {createTimeBreakdownSection("Opening Statements", [
          ["open.pros", "open.def"],
        ])}
        {createTimeBreakdownSection(`${piSideName} Case in Chief`, [
          [
            "cic.pros.one.direct",
            reexaminationsEnabled && "cic.pros.one.redirect",
            "cic.pros.one.cross",
            reexaminationsEnabled && "cic.pros.one.recross",
          ],
          [
            "cic.pros.two.direct",
            reexaminationsEnabled && "cic.pros.two.redirect",
            "cic.pros.two.cross",
            reexaminationsEnabled && "cic.pros.two.recross",
          ],
          [
            "cic.pros.three.direct",
            "cic.pros.three.cross",
            ...(trial.setup.reexaminationsEnabled
              ? ([
                "cic.pros.three.redirect",
                "cic.pros.three.recross",
              ] satisfies TrialStage[])
              : []),
          ],
        ])}
        {createTimeBreakdownSection("Defense Case in Chief", [
          [
            "cic.def.one.direct",
            reexaminationsEnabled && "cic.def.one.redirect",
            "cic.def.one.cross",
            reexaminationsEnabled && "cic.def.one.recross",
          ],
          [
            "cic.def.two.direct",
            reexaminationsEnabled && "cic.def.two.redirect",
            "cic.def.two.cross",
            reexaminationsEnabled && "cic.def.two.recross",
          ],
          [
            "cic.def.three.direct",
            reexaminationsEnabled && "cic.def.three.redirect",
            "cic.def.three.cross",
            reexaminationsEnabled && "cic.def.three.recross",
          ],
        ])}
        {createTimeBreakdownSection("Closing Statements", [
          ["close.pros", "close.def", "rebuttal"],
        ])}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 10,
  },
});

export default TimeBreakdown;
