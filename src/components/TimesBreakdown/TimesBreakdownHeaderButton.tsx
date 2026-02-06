import { Platform, StyleSheet, View } from "react-native";
import LinkButton from "../LinkButton";
import { FC } from "react";

interface TimesBreakdownHeaderButtonProps {
  title: string;
  onPress: () => void;
}

const TimesBreakdownHeaderButton: FC<TimesBreakdownHeaderButtonProps> = (
  { title, onPress },
) => {
  return (
    <View style={styles.headerButton}>
      <LinkButton title={title} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    ...Platform.select({
      web: {
        // margin is automatically added on mobile, but not on web
        marginRight: 10,
      },
    }),
  },
});

export default TimesBreakdownHeaderButton;
