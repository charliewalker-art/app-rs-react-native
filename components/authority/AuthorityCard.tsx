import { View, Text } from "react-native";
import { Authority } from "@/types/authority";
import AuthorityActions from "./AuthorityActions";

type Props = {
  item: Authority;
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityCard({ item, onCRL, onDownload }: Props) {
  return (
    <View style={{
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 15,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: "#6366f1",
    }}>
      <Text style={{ fontWeight: "bold", fontSize: 16, color: "#1f2937" }}>{item.name}</Text>
      <Text style={{ color: "#6b7280", marginTop: 4 }}>Organisation : {item.organization}</Text>
      <Text style={{ color: "#6b7280" }}>Pays : {item.country} — {item.state}</Text>
      <Text style={{ color: "#6b7280" }}>Localité : {item.locality}</Text>
      <Text style={{
        marginTop: 6,
        color: item.timeLeft === "Expiré" ? "#ef4444" : "#10b981",
        fontWeight: "600",
      }}>
        ⏱ {item.timeLeft}
      </Text>
      <AuthorityActions id={item.id} onCRL={onCRL} onDownload={onDownload} />
    </View>
  );
}