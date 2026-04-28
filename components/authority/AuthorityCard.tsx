import { View, Text } from "react-native";
import { Authority } from "@/types/authority";
import AuthorityActions from "./AuthorityActions";

type Props = {
  item: Authority;
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityCard({ item, onCRL, onDownload }: Props) {
  const isExpired = item.timeLeft === "Expiré";
  return (
    <View className="bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-white font-bold text-base">🛡 {item.name}</Text>
        </View>
        <View className="bg-green-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">ACTIVE</Text>
        </View>
      </View>
      <Text className="text-gray-400 text-sm mb-1">
        CN={item.name}, O={item.organization}
      </Text>
      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-gray-500 text-sm">Valide jusqu'au:</Text>
        <Text className={`text-sm font-semibold ${isExpired ? "text-red-400" : "text-gray-300"}`}>
          {item.timeLeft}
        </Text>
      </View>
      <AuthorityActions id={item.id} onCRL={onCRL} onDownload={onDownload} />
    </View>
  );
}