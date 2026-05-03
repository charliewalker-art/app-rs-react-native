import { View, Text } from "react-native";
import { Globe } from "lucide-react-native";
import { Domaine } from "@/types/domaine";

type Props = {
  domaines: Domaine[];
};

export default function DomainsList({ domaines }: Props) {
  return (
    <View className="px-5 mb-5">
      <Text className="text-white font-bold text-lg mb-3">Domaines récents</Text>
      {domaines.length === 0 ? (
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700 items-center">
          <Text className="text-gray-500 text-sm">Aucun domaine</Text>
        </View>
      ) : (
        domaines.slice(0, 3).map((domaine) => (
          <View key={domaine.id} className="bg-gray-800 rounded-2xl p-4 mb-2 border border-gray-700">
            <View className="flex-row items-center gap-2 mb-1">
              <Globe size={16} color="#3b82f6" />
              <Text className="text-white font-semibold text-sm">{domaine.nom}</Text>
            </View>
            <Text className="text-gray-400 text-xs">IP : {domaine.adresseIp}</Text>
            {domaine.wanUrl && (
              <Text className="text-blue-400 text-xs mt-1">🔗 {domaine.wanUrl}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}