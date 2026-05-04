import { View, Text } from "react-native";
import { Server, Activity } from "lucide-react-native";

type Props = {
  title: string;
  type: "nginx" | "dns";
};

export default function ServiceStatusCard({ title, type }: Props) {
  return (
    <View className="bg-gray-800 w-[48%] p-4 rounded-2xl border border-gray-700">
      <View className="mb-3">
        {type === "nginx"
          ? <Server size={24} color="#3b82f6" />
          : <Activity size={24} color="#10b981" />
        }
      </View>
      <Text className="text-white font-bold text-lg">{title}</Text>
      <View className="flex-row items-center gap-1 mt-1">
        <View className="w-2 h-2 rounded-full bg-emerald-500" />
        <Text className="text-emerald-500 text-sm">Actif</Text>
      </View>
    </View>
  );
}