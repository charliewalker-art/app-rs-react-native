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

export default function NginxControls({ loading, actions }: Props) {
  return (
    <View className="px-5 mb-5">
      <Text className="text-white font-bold text-lg mb-3">Controles Serveur</Text>
      <View className="flex-row flex-wrap gap-2">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={action.onPress}
            disabled={loading}
            style={{ backgroundColor: action.color }}
            className="py-3 px-4 rounded-xl items-center flex-1 min-w-[45%]"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-bold text-sm">
                {action.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}