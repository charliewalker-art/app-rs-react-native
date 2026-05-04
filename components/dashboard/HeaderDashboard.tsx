import { View, Text, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

type Props = {
  nbDomaines: number;
  nbCertificats: number;
  nbAutorites: number;
};

export default function HeaderDashboard({ nbDomaines, nbCertificats, nbAutorites }: Props) {
  const { logout } = useAuth();

  return (
    <View className="px-5 pt-6 pb-4">
      <View className="flex-row items-center justify-between mb-1">
      
        <TouchableOpacity
          onPress={logout}
          className="flex-row items-center gap-1 bg-gray-800 px-3 py-2 rounded-xl border border-gray-700"
        >
          <LogOut size={16} color="#ef4444" />
          <Text className="text-red-400 text-xs font-semibold">Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-white text-3xl font-bold mt-1">État du Serveur</Text>
      <View className="bg-gray-800 rounded-2xl p-4 mt-4 flex-row justify-around border border-gray-700">
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{nbDomaines}</Text>
          <Text className="text-gray-400 text-xs mt-1">Domaines</Text>
        </View>
        <View className="w-px bg-gray-700" />
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{nbCertificats}</Text>
          <Text className="text-gray-400 text-xs mt-1">Certificats</Text>
        </View>
        <View className="w-px bg-gray-700" />
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{nbAutorites}</Text>
          <Text className="text-gray-400 text-xs mt-1">Autorités</Text>
        </View>
      </View>
    </View>
  );
}