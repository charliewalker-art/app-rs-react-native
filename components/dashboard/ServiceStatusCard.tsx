import { View, Text, TouchableOpacity } from "react-native";
import { Server, Activity, RefreshCw } from "lucide-react-native";

type Props = {
  title: string;
  type: "nginx" | "dns";
  onRestart: () => void;
  restarting: boolean;
};

export default function ServiceStatusCard({ title, type, onRestart, restarting }: Props) {
  return (
    <View className="bg-gray-800 w-[48%] p-4 rounded-2xl border border-gray-700">
      <View className="flex-row justify-between items-center mb-3">
        {type === "nginx"
          ? <Server size={24} color="#3b82f6" />
          : <Activity size={24} color="#10b981" />
        }
        <TouchableOpacity onPress={onRestart} disabled={restarting}>
          <RefreshCw size={18} color={restarting ? "#6b7280" : "#9ca3af"} />
        </TouchableOpacity>
      </View>
      <Text className="text-white font-bold text-lg">{title}</Text>
      <View className="flex-row items-center gap-1 mt-1">
        <View className="w-2 h-2 rounded-full bg-emerald-500" />
        <Text className="text-emerald-500 text-sm">Actif</Text>
      </View>
    </View>
  );
}