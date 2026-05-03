import { View, Text, TouchableOpacity } from "react-native";
import { Domaine } from "@/types/domaine";
import { Ionicons } from "@expo/vector-icons"; // Assure-toi d'avoir @expo/vector-icons installé

type Props = {
  domaine: Domaine;
  onSupprimer: (id: number) => void;
};

export default function DomaineCard({ domaine, onSupprimer }: Props) {
  return (
    <View className="bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Text className="text-white font-bold text-base mr-2">🌐 {domaine.nom}</Text>
          <View className="bg-blue-600 px-2 py-0.5 rounded-full">
            <Text className="text-white text-[10px] font-bold">ACTIF</Text>
          </View>
        </View>

        {/* Bouton Supprimer avec icône */}
        <TouchableOpacity 
          onPress={() => onSupprimer(domaine.id)}
          className="p-1"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View className="space-y-1">
        <Text className="text-gray-400 text-sm">
          IP : <Text className="text-gray-300">{domaine.adresseIp}</Text>
        </Text>
        
        {domaine.wanUrl && (
          <View className="flex-row items-center mt-1">
            <Text className="text-blue-400 text-sm">🔗 </Text>
            <Text 
              selectable={true} 
              className="text-blue-400 text-sm underline"
            >
              {domaine.wanUrl}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}