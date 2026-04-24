import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  id: number;
  onCRL: (id: number) => void;
  onDownload: (id: number) => void;
};

export default function AuthorityActions({ id, onCRL, onDownload }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
      <TouchableOpacity
        onPress={() => onCRL(id)}
        style={{ backgroundColor: "#f59e0b", padding: 8, borderRadius: 6, flex: 1, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Mettre à jour CRL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDownload(id)}
        style={{ backgroundColor: "#10b981", padding: 8, borderRadius: 6, flex: 1, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>Télécharger cert</Text>
      </TouchableOpacity>
    </View>
  );
}