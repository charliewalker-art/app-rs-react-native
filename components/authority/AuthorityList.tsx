import { ScrollView } from "react-native";
import { Authority } from "@/types/authority";
import AuthorityCard from "./AuthorityCard";

type Props = {
  authorities: Authority[];
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityList({ authorities, onCRL, onDownload }: Props) {
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
      {authorities.map((item) => (
        <AuthorityCard
          key={item.id}
          item={item}
          onCRL={onCRL}
          onDownload={onDownload}
        />
      ))}
    </ScrollView>
  );
}