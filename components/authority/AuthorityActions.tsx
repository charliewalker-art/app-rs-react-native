import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  id: number;
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityActions({ id, onCRL, onDownload }: Props) {
  return (
    <View className="flex-row gap-2 mt-3">
      <TouchableOpacity
        onPress={() => onCRL(id)}
        className="flex-1 bg-amber-500 py-2 rounded-xl items-center"
      >
        <Text className="text-white text-xs font-bold">Mettre à jour CRL</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDownload(id)}
        className="flex-1 bg-emerald-500 py-2 rounded-xl items-center"
      >
        <Text className="text-white text-xs font-bold">Télécharger cert</Text>
      </TouchableOpacity>
    </View>
  );
}