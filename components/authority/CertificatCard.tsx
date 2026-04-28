import { View, Text, TouchableOpacity } from "react-native";
import { Certificat } from "@/types/certificat";

type Props = {
  certificat: Certificat;
  onRevoquer: (id: number) => void;
  onRetablir: (id: number) => void;
};

export default function CertificatCard({ certificat, onRevoquer, onRetablir }: Props) {
  const isRevoked = certificat.status === "REVOKED";
  const isExpired = certificat.timeLeft === "Expiré";

  return (
    <View className="bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white font-bold text-base">🔒 {certificat.commonName}</Text>
        <View className={`px-3 py-1 rounded-full ${isRevoked ? "bg-red-500" : "bg-green-500"}`}>
          <Text className="text-white text-xs font-bold">
            {isRevoked ? "RÉVOQUÉ" : "VALIDE"}
          </Text>
        </View>
      </View>

      <Text className="text-gray-400 text-sm">Pays : {certificat.country}</Text>
      <Text className="text-gray-400 text-sm">Autorité : {certificat.authorityName}</Text>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-gray-500 text-sm">Expire dans :</Text>
        <Text className={`text-sm font-semibold ${isExpired ? "text-red-400" : "text-gray-300"}`}>
          {certificat.timeLeft}
        </Text>
      </View>

      {/* On n'affiche la vue des boutons que si le certificat est révoqué */}
      {isRevoked && (
        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={() => onRetablir(certificat.id)}
            className="flex-1 bg-green-500 py-2 rounded-xl items-center"
          >
            <Text className="text-white text-xs font-bold">Rétablir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}