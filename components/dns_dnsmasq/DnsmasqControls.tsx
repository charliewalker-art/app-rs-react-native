import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

type Action = {
  label: string;
  color: string;
  onPress: () => void;
};

type Props = {
  loading: boolean;
  actions: Action[];
};

export default function DnsmasqControls({ loading, actions }: Props) {
  return (
    <View className="px-5 mb-6">
      <View className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest">Service Dnsmasq</Text>
          {loading && <ActivityIndicator size="small" color="#3B82F6" />}
        </View>
        <View className="flex-row flex-wrap gap-2">
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={action.onPress}
              disabled={loading}
              className="py-2 px-3 rounded-lg border border-gray-600 flex-1 min-w-[30%]"
            >
              <Text 
                className="text-center font-semibold text-[10px] uppercase" 
                style={{ color: action.color }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}