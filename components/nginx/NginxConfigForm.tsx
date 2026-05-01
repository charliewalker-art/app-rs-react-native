import {
  View, Text, TouchableOpacity, Modal,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Domaine } from "@/types/domaine";

type Props = {
  visible: boolean;
  domaines: Domaine[];
  selectedDomaine: string;
  selectedFichier: any;
  submitting: boolean;
  onSelect: (nom: string) => void;
  onFichierPicked: (fichier: any) => void;
  onSubmitConfig: () => void;
  onSubmitUpload: () => void;
  onCancel: () => void;
};

export default function NginxConfigForm({
  visible, domaines, selectedDomaine, selectedFichier,
  submitting, onSelect, onFichierPicked, onSubmitConfig, onSubmitUpload, onCancel
}: Props) {

  const handlePickFile = async () => {
    if (!selectedDomaine) {
      Alert.alert("Erreur", "Sélectionne d'abord un domaine");
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        onFichierPicked(result.assets[0]);
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sélectionner le fichier");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[85%]">
            <Text className="text-white text-xl font-bold mb-2">
              Gérer un domaine
            </Text>
            <Text className="text-gray-400 text-sm mb-5">
              Sélectionne le domaine à configurer ou uploader
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Liste des domaines */}
              {domaines.map((domaine) => (
                <TouchableOpacity
                  key={domaine.id}
                  onPress={() => onSelect(domaine.nom)}
                  className={`flex-row items-center justify-between p-3 rounded-xl mb-2 border ${
                    selectedDomaine === domaine.nom
                      ? "border-blue-500 bg-blue-600/20"
                      : "border-gray-700 bg-gray-800"
                  }`}
                >
                  <View>
                    <Text className="text-white font-semibold text-sm">🌐 {domaine.nom}</Text>
                    <Text className="text-gray-400 text-xs">{domaine.adresseIp}</Text>
                  </View>
                  {selectedDomaine === domaine.nom && (
                    <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <View className="h-px bg-gray-700 my-4" />

              {/* Sélectionner fichier ZIP */}
              <TouchableOpacity
                onPress={handlePickFile}
                disabled={!selectedDomaine}
                className={`py-3 rounded-xl items-center mb-2 border border-dashed ${
                  selectedDomaine ? "border-green-500 bg-green-600/10" : "border-gray-600 bg-gray-800"
                }`}
              >
                <Text className={`font-bold text-sm ${selectedDomaine ? "text-green-400" : "text-gray-500"}`}>
                  📂 {selectedFichier ? selectedFichier.name : "Sélectionner un ZIP"}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {selectedDomaine ? `Pour ${selectedDomaine}` : "Sélectionne d'abord un domaine"}
                </Text>
              </TouchableOpacity>

              {/* Bouton Upload */}
              <TouchableOpacity
                onPress={onSubmitUpload}
                disabled={submitting || !selectedFichier || !selectedDomaine}
                className={`py-3 rounded-xl items-center mb-3 ${
                  selectedFichier && selectedDomaine ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-sm">⬆️ Uploader le ZIP</Text>
                )}
              </TouchableOpacity>

              <View className="h-px bg-gray-700 mb-4" />

              {/* Boutons Annuler / Configurer */}
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-4 rounded-2xl border border-gray-700 items-center"
                >
                  <Text className="text-gray-400 font-semibold">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onSubmitConfig}
                  disabled={submitting || !selectedDomaine}
                  className={`flex-1 py-4 rounded-2xl items-center ${
                    selectedDomaine ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold">⚙️ Configurer</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}