import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ScreenProps } from "../../types/navigation";
import { ScreenName } from "../../constants/screen-names";
import Button from "../Button";
import Text from "../Text";
import Link from "../Link";
import colors from "../../constants/colors";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../types/theme";

type TeamAccountExplainerProps = ScreenProps<ScreenName.TEAM_ACCOUNT_EXPLAINER>;

export const teamAccountExplainerScreenOptions = {
  title: "School Accounts",
  headerBackTitle: "Home",
};

const TeamAccountExplainer: FC<TeamAccountExplainerProps> = ({
  navigation,
}) => {
  const handleGetStarted = () => {
    navigation.navigate(ScreenName.TEAM_ACCOUNT_SIGNUP);
  };
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "white" }}
    >
      <View style={styles.heroSection}>
        <View style={styles.iconRow}>
          <View style={[styles.iconContainer, styles.appIconContainer]}>
            <Image
              source={require("../../../assets/icon-transparent.png")}
              style={styles.appIcon}
            />
          </View>
          <View style={styles.plusContainer}>
            <MaterialIcons
              name="add"
              size={24}
              color={theme === Theme.LIGHT ? "#999" : "#666"}
            />
          </View>
          <View style={[styles.iconContainer, styles.teamIconContainer]}>
            <MaterialIcons name="people" size={44} color={colors.GREEN} />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Introducing School Accounts</Text>
        <Text style={styles.text} lightColor="#333">
          School Accounts let you and your teammates share trial times. No more
          sending screenshots in your team&apos;s group chat: with a team
          account, everyone stays in sync.
        </Text>
        <Text style={styles.text} lightColor="#333">
          Create a school account, invite your teammates, and see all your
          team&apos;s times in one place. It&apos;s completely free.
        </Text>
      </View>

      <Link
        title="How does it work?"
        onPress={() =>
          navigation.navigate(ScreenName.TEAM_ACCOUNT_HOW_IT_WORKS)}
        border
      />
      <View style={styles.footer}>
        <Button title="Get Started" onPress={handleGetStarted} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    marginTop: 10,
    aspectRatio: 2.29,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    paddingBottom: 20,
  },
  // TODO: extract this to a common component
  heroSection: {
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  appIconContainer: {
    backgroundColor: "rgba(24, 93, 184, 0.12)",
  },
  appIcon: {
    width: 65,
    aspectRatio: 1,
  },
  plusContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  teamIconContainer: {
    backgroundColor: "rgba(21, 158, 113, 0.12)",
  },
});

export default TeamAccountExplainer;
