import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { GestionNginx } from "@/types/nginx";
import { Domaine } from "@/types/domaine";
import {
  installNginx, uninstallNginx, startNginx, stopNginx,
  restartNginx, configurerNginxDomaine
} from "@/services/nginxService";
import { getDomaines } from "@/services/domaineService";
import NginxControls from "@/components/nginx/NginxControls";
import NginxConfigForm from "@/components/nginx/NginxConfigForm";

export default function Nginx() {
  const [loading, setLoading] = useState(false);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [historique, setHistorique] = useState<GestionNginx[]>([]);

  useEffect(() => {
    getDomaines()
      .then(setDomaines)
      .catch((e) => Toast.show({ type: "error", text1: "Erreur", text2: e.message }));
  }, []);

  const handleNginxAction = async (action: () => Promise<GestionNginx>, label: string) => {
    setLoading(true);
    try {
      const result = await action();
      setHistorique((prev) => [result, ...prev]);
      Toast.show({ type: "success", text1: label, text2: result.statut });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigurer = async () => {
    if (!selectedDomaine) return;
    setSubmitting(true);
    try {
      const result = await configurerNginxDomaine(selectedDomaine);
      Toast.show({
        type: result.statut === "CONFIGURATION_REUSSIE" ? "success" : "error",
        text1: result.statut === "CONFIGURATION_REUSSIE" ? "Configuré !" : "Échec",
        text2: result.wanUrl ?? result.statut,
      });
      setShowConfigForm(false);
      setSelectedDomaine("");
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const nginxActions = [
    { label: "Installer", icon: "📦", color: "#3B82F6", onPress: () => handleNginxAction(installNginx, "Installation") },
    { label: "Démarrer", icon: "▶️", color: "#10B981", onPress: () => handleNginxAction(startNginx, "Démarrage") },
    { label: "Arrêter", icon: "⏹️", color: "#EF4444", onPress: () => handleNginxAction(stopNginx, "Arrêt") },
    { label: "Redémarrer", icon: "🔄", color: "#F59E0B", onPress: () => handleNginxAction(restartNginx, "Redémarrage") },
    { label: "Désinstaller", icon: "🗑️", color: "#6B7280", onPress: () => handleNginxAction(uninstallNginx, "Désinstallation") },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">Nginx</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Gérez le serveur web Nginx et vos domaines.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contrôles */}
        <NginxControls loading={loading} actions={nginxActions} />

        {/* Bouton configurer domaine */}
        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={() => setShowConfigForm(true)}
            className="bg-indigo-600 py-3 rounded-xl items-center"
          >
            <Text className="text-white font-bold">⚙️ Configurer un domaine</Text>
          </TouchableOpacity>
        </View>

        {/* Historique */}
        {historique.length > 0 && (
          <View className="px-5">
            <Text className="text-white font-bold text-lg mb-3">Historique</Text>
            {historique.map((item, index) => (
              <View key={index} className="bg-gray-800 rounded-xl p-3 mb-2 border border-gray-700">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white font-semibold text-sm">{item.action?.toUpperCase()}</Text>
                  <View className={`px-2 py-1 rounded-full ${item.statut.includes("REUSSI") || item.statut.includes("DONE") ? "bg-green-500" : "bg-red-500"}`}>
                    <Text className="text-white text-xs font-bold">{item.statut}</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-xs mt-1">{item.dateExecution}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <NginxConfigForm
        visible={showConfigForm}
        domaines={domaines}
        selectedDomaine={selectedDomaine}
        submitting={submitting}
        onSelect={setSelectedDomaine}
        onSubmit={handleConfigurer}
        onCancel={() => { setShowConfigForm(false); setSelectedDomaine(""); }}
      />
    </View>
  );
}