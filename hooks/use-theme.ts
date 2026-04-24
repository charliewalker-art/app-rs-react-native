import { useState } from "react";
import { useColorScheme } from "react-native";

export function useTheme() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(systemTheme ?? "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}