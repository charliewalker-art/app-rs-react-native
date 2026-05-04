import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthContext from "@/context/AuthContext";

const VALID_USERNAME = "charlie";
const VALID_PASSWORD = "charlie";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Toast.show({ type: "error", text1: "Champs manquants", text2: "Remplissez tous les champs" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        setIsLoggedIn(true);
        Toast.show({ type: "success", text1: "Bienvenue Charlie !" });
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: "Identifiants incorrects" });
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginForm
          username={username}
          password={password}
          loading={loading}
          onChangeUsername={setUsername}
          onChangePassword={setPassword}
          onSubmit={handleLogin}
        />
        <Toast />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout: handleLogout }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="light" />
      <Toast />
    </AuthContext.Provider>
  );
}