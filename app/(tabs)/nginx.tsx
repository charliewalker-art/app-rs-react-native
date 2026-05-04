import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Domaine } from "@/types/domaine";
import { configurerNginxDomaine, uploadSite } from "@/services/nginxService";
import { getDomaines } from "@/services/domaineService";
import NginxConfigForm from "@/components/nginx/NginxConfigForm";

export default function Nginx() {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectedFichier, setSelectedFichier] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleDeploy = async () => {
    if (!selectedDomaine) return;
    setSubmitting(true);

    try {
      const configResult = await configurerNginxDomaine(selectedDomaine);

      if (configResult.statut === "CONFIGURATION_REUSSIE") {
        Toast.show({ type: "success", text1: "Configuration reussie", text2: selectedDomaine });

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

  return (
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-6 bg-gray-900 border-b border-gray-800">
        <Text className="text-white text-3xl font-bold tracking-tight">Nginx</Text>
        <Text className="text-gray-500 text-sm mt-1">Déployez et configurez vos sites web</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 mt-6">
        <TouchableOpacity
          onPress={() => {
            fetchDomaines();
            setShowConfigForm(true);
          }}
          className="bg-blue-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-base"> Gérer un domaine</Text>
        </TouchableOpacity>
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