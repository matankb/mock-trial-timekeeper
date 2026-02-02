import { FC, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

import { ScreenProps } from "../../types/navigation";
import { ScreenName } from "../../constants/screen-names";
import Text from "../Text";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../types/theme";

type SlideData = {
  image: number;
  text: string;
  subtitle: string;
};

type TeamAccountHowItWorksProps = ScreenProps<
  ScreenName.TEAM_ACCOUNT_HOW_IT_WORKS
>;

export const teamAccountHowItWorksScreenOptions = {
  title: "School Accounts",
  headerBackTitle: "Back",
};

const PAGINATION_HEIGHT = 180;

const TeamAccountHowItWorks: FC<TeamAccountHowItWorksProps> = ({
  route,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const theme = useTheme();
  const isDark = theme === Theme.DARK;
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  const carouselHeight = screenHeight - PAGINATION_HEIGHT;

  const signedIn = route.params?.signedIn ?? false;

  const slides: SlideData[] = signedIn
    ? [
      {
        image: require("../../../assets/promos/team-trials/6-upload.png"),
        text: "Upload the trial",
        subtitle:
          "When the round is finished, tap the button to upload your trial",
      },
      {
        image: require(
          "../../../assets/promos/team-trials/6.5-upload-menu.png",
        ),
        text: "Upload the trial",
        subtitle:
          "You can also always upload the trial from the three dot menu.",
      },
      {
        image: require("../../../assets/promos/team-trials/7-home.png"),
        text: "See all your team's trials",
        subtitle:
          "All of the uploaded trials will be visible to everyone signed in to the account.",
      },
      {
        image: require("../../../assets/promos/team-trials/8-trial-list.png"),
        text: "See all your team's trials",
        subtitle: "Trials will be organized by tournament and round.",
      },
    ]
    : [
      {
        image: require("../../../assets/promos/team-trials/1-signup.png"),
        text: "Sign up for a school account",
        subtitle:
          "Create a free team account to get started syncing trial times.",
      },
      {
        image: require("../../../assets/promos/team-trials/3-login.png"),
        text: "Log in to your account",
        subtitle:
          "Everyone on your team can log in to your school account in the app's settings.",
      },
      {
        image: require("../../../assets/promos/team-trials/4-select-team.png"),
        text: "Select your team",
        subtitle: "After logging in, members can chose which team they're on.",
      },
      {
        image: require("../../../assets/promos/team-trials/5-create-trial.png"),
        text: "Time your trial",
        subtitle:
          "Set up your trial as usual, with a few more details to stay organized. The timer works the same way.",
      },
      {
        image: require("../../../assets/promos/team-trials/6-upload.png"),
        text: "Upload trial times",
        subtitle:
          "When a trial finishes, the timekeeper uploads the trial to the team account.",
      },
      {
        image: require("../../../assets/promos/team-trials/7-home.png"),
        text: "See all your team's times",
        subtitle:
          "All of the uploaded trials will be visible to everyone signed in to the account.",
      },
      {
        image: require("../../../assets/promos/team-trials/8-trial-list.png"),
        text: "See all your team's trials",
        subtitle: "Trials will be organized by tournament and round.",
      },
      {
        image: require(
          "../../../assets/promos/team-trials/9-trial-breakdown.png",
        ),
        text: "See the trial times",
        subtitle: "Examination times and time remaining.",
      },
    ];

  const renderItem = ({ item, index }: { item: SlideData; index: number }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.imageContainer, { height: carouselHeight - 120 }]}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.explanationText} lightColor="#333">
            {item.text}
          </Text>
          <Text style={styles.subtitleText} lightColor="#666">
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Carousel
        ref={carouselRef}
        width={screenWidth}
        height={carouselHeight}
        data={slides}
        renderItem={renderItem}
        onProgressChange={progress}
        loop={false}
        pagingEnabled
        enabled
      />
      <Pagination.Basic
        progress={progress}
        data={slides}
        dotStyle={{
          backgroundColor: isDark ? "#444" : "#ccc",
          borderRadius: 4,
          width: 8,
          height: 8,
        }}
        activeDotStyle={{
          backgroundColor: "#007AFF",
          borderRadius: 4,
          overflow: "hidden",
        }}
        containerStyle={styles.pagination}
        onPress={onPressPagination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  slide: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
    height: 100,
    justifyContent: "center",
  },
  explanationText: {
    fontSize: 23,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: 400,
  },
  subtitleText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: {
    gap: 8,
    paddingVertical: 20,
    paddingBottom: 10,
  },
});

export default TeamAccountHowItWorks;
