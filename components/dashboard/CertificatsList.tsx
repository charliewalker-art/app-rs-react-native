import { View, Text } from "react-native";
import { Shield } from "lucide-react-native";
import { Certificat } from "@/types/certificat";

type Props = {
  certificats: Certificat[];
};

export default function CertificatsList({ certificats }: Props) {
  return (
    <View className="px-5 mb-5">
      <Text className="text-white font-bold text-lg mb-3">Certificats récents</Text>
      {certificats.length === 0 ? (
        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700 items-center">
          <Text className="text-gray-500 text-sm">Aucun certificat</Text>
        </View>
      ) : (
        certificats.slice(0, 3).map((cert) => (
          <View key={cert.id} className="bg-gray-800 rounded-2xl p-4 mb-2 border border-gray-700">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-2">
                <Shield size={16} color={cert.status === "VALID" ? "#10b981" : "#ef4444"} />
                <Text className="text-white font-semibold text-sm">{cert.commonName}</Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${cert.status === "VALID" ? "bg-green-500" : "bg-red-500"}`}>
                <Text className="text-white text-xs font-bold">
                  {cert.status === "VALID" ? "VALIDE" : "RÉVOQUÉ"}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 text-xs">Autorité : {cert.authorityName}</Text>
            <Text className={`text-xs mt-1 ${cert.timeLeft === "Expiré" ? "text-red-400" : "text-gray-500"}`}>
              ⏱ {cert.timeLeft}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}