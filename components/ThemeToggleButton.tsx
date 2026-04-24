import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export default function ThemeToggleButton({ theme, onToggle }: Props) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        backgroundColor: theme === "dark" ? "#374151" : "#e5e7eb",
        padding: 8,
        borderRadius: 20,
      }}
    >
      <Ionicons
        name={theme === "dark" ? "sunny" : "moon"}
        size={20}
        color={theme === "dark" ? "#facc15" : "#6366f1"}
      />
    </TouchableOpacity>
  );
}