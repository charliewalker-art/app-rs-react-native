import { Tabs } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import AppHeader from "@/components/AppHeader";
import AppTabBar from "@/components/AppTabBar";

export default function TabLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tabs
      tabBar={() => <AppTabBar />}
      screenOptions={{
        header: ({ route }) => (
          <AppHeader
            title={route.name === "index" ? "Accueil" : route.name}
            theme={theme}
            onToggle={toggleTheme}
          />
        ),
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="apropos" />
      <Tabs.Screen name="presentation" />
    </Tabs>
  );
}