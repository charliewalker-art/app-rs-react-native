import { View, Text } from "react-native";

type Props = {
  nbDomaines: number;
  nbCertificats: number;
  nbAutorites: number;
};

export default function HeaderDashboard({ nbDomaines, nbCertificats, nbAutorites }: Props) {
  return (
    <View className="px-5 pt-6 pb-4">
      <Text className="text-gray-400 text-base">Bonjour, Charlie 👋</Text>
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