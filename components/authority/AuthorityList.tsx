import { ScrollView, Text, View } from "react-native";
import { Authority } from "@/types/authority";
import AuthorityCard from "./AuthorityCard";

type Props = {
  authorities: Authority[];
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityList({ authorities, onCRL, onDownload }: Props) {
  return (
    <ScrollView className="flex-1 px-4">
      {authorities.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-gray-500 text-sm">Aucune autorité trouvée</Text>
        </View>
      ) : (
        authorities.map((item) => (
          <AuthorityCard
            key={item.id}
            item={item}
            onCRL={onCRL}
            onDownload={onDownload}
          />
        ))
      )}
    </ScrollView>
  );
}