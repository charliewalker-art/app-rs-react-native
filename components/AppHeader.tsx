import { View, Text } from "react-native";
import ThemeToggleButton from "./ThemeToggleButton";

type Props = {
  title: string;
  theme: "light" | "dark";
  onToggle: () => void;
};

export default function AppHeader({ title, theme, onToggle }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1f2937",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
        {title}
      </Text>
      <ThemeToggleButton theme={theme} onToggle={onToggle} />
    </View>
  );
}