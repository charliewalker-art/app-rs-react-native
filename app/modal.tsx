import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-2xl font-bold">Modal</Text>
      <Link href="/" dismissTo>
        <Text className="text-blue-500">Retour à l'accueil</Text>
      </Link>
    </View>
  );
} 