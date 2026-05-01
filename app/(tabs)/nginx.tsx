import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestionNginx } from "@/types/nginx";
import { Domaine } from "@/types/domaine";
import {
  installNginx, uninstallNginx, startNginx, stopNginx,
  restartNginx, configurerNginxDomaine, uploadSite
} from "@/services/nginxService";
import { getDomaines } from "@/services/domaineService";
import NginxControls from "@/components/nginx/NginxControls";
import NginxConfigForm from "@/components/nginx/NginxConfigForm";

export default function Nginx() {
  const [loading, setLoading] = useState(false);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectedFichier, setSelectedFichier] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [historique, setHistorique] = useState<GestionNginx[]>([]);

  const fetchDomaines = async () => {
    try {
      const data = await getDomaines();
      setDomaines(data);
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDomaines();
    }, [])
  );

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

  // SEQUENCE CORRIGEE : Configuration PUIS Upload
  const handleDeploy = async () => {
    if (!selectedDomaine) return;
    setSubmitting(true);

    try {
      // 1. Configurer d'abord (Creation des dossiers/conf sur le serveur)
      const configResult = await configurerNginxDomaine(selectedDomaine);
      
      if (configResult.statut === "CONFIGURATION_REUSSIE") {
        Toast.show({ type: "success", text1: "Configuration reussie", text2: selectedDomaine });

        // 2. Upload ensuite seulement si la config a reussi et qu'un fichier est present
        if (selectedFichier) {
          const uploadResult = await uploadSite(selectedDomaine, selectedFichier);
          Toast.show({ type: "success", text1: "Upload reussi", text2: uploadResult.statut });
        }
      } else {
        Toast.show({ type: "error", text1: "Echec configuration", text2: configResult.statut });
      }

      setShowConfigForm(false);
      setSelectedDomaine("");
      setSelectedFichier(null);
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur de deploiement", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const nginxActions = [
    { label: "Installer", color: "#3B82F6", onPress: () => handleNginxAction(installNginx, "Installation") },
    { label: "Demarrer", color: "#10B981", onPress: () => handleNginxAction(startNginx, "Demarrage") },
    { label: "Arreter", color: "#EF4444", onPress: () => handleNginxAction(stopNginx, "Arret") },
    { label: "Redemarrer", color: "#F59E0B", onPress: () => handleNginxAction(restartNginx, "Redemarrage") },
    { label: "Desinstaller", color: "#6B7280", onPress: () => handleNginxAction(uninstallNginx, "Desinstallation") },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-5 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">Nginx</Text>
        <Text className="text-gray-400 text-sm mt-1">Gerez le serveur web et vos domaines.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <NginxControls loading={loading} actions={nginxActions} />

        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={() => {
              fetchDomaines();
              setShowConfigForm(true);
            }}
            className="bg-indigo-600 py-3 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Gerer un domaine</Text>
          </TouchableOpacity>
        </View>

        {historique.length > 0 && (
          <View className="px-5">
            <Text className="text-white font-bold text-lg mb-3">Historique</Text>
            {historique.map((item, index) => (
              <View key={index} className="bg-gray-800 rounded-xl p-3 mb-2 border border-gray-700">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white font-semibold text-sm">{item.action?.toUpperCase()}</Text>
                  <View className={`px-2 py-1 rounded-full ${item.statut.includes("REUSSI") ? "bg-green-500" : "bg-red-500"}`}>
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
        selectedFichier={selectedFichier}
        submitting={submitting}
        onSelect={setSelectedDomaine}
        onFichierPicked={setSelectedFichier}
        onSubmit={handleDeploy}
        onCancel={() => {
          setShowConfigForm(false);
          setSelectedDomaine("");
          setSelectedFichier(null);
        }}
      />
    </View>
  );
}