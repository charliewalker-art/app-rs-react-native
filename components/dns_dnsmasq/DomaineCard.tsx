import { View, Text, TouchableOpacity } from "react-native";
import { Domaine } from "@/types/domaine";

type Props = {
  domaine: Domaine;
  onModifier: (domaine: Domaine) => void;
  onSupprimer: (id: number) => void;
};

export default function DomaineCard({ domaine, onModifier, onSupprimer }: Props) {
  return (
    <View className="bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-700">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-white font-bold text-base">🌐 {domaine.nom}</Text>
        <View className="bg-blue-600 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">ACTIF</Text>
        </View>
      </View>
      <Text className="text-gray-400 text-sm">IP : {domaine.adresseIp}</Text>
      {domaine.wanUrl && (
        <Text className="text-blue-400 text-sm mt-1">🔗 {domaine.wanUrl}</Text>
      )}
      <View className="flex-row gap-2 mt-3">
        <TouchableOpacity
          onPress={() => onModifier(domaine)}
          className="flex-1 bg-amber-500 py-2 rounded-xl items-center"
        >
          <Text className="text-white text-xs font-bold">Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSupprimer(domaine.id)}
          className="flex-1 bg-red-500 py-2 rounded-xl items-center"
        >
          <Text className="text-white text-xs font-bold">Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}