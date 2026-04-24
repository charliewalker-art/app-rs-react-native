import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { getAuthorities } from "@/services/authorityService";
import { Authority } from "@/types/authority";

export default function Index() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAuthorities()
      .then(setAuthorities)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4 text-gray-800">
        Autorités de certification
      </Text>

      {authorities.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: 10,
            padding: 15,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: "#6366f1",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: "#1f2937" }}>
            {item.name}
          </Text>
          <Text style={{ color: "#6b7280", marginTop: 4 }}>
            Organisation : {item.organization}
          </Text>
          <Text style={{ color: "#6b7280" }}>
            Pays : {item.country}
          </Text>
          <Text
            style={{
              marginTop: 8,
              color: item.timeLeft === "Expiré" ? "#ef4444" : "#10b981",
              fontWeight: "600",
            }}
          >
            ⏱ {item.timeLeft}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}