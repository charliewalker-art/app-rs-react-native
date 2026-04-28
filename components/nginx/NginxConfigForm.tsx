import {
  View, Text, TouchableOpacity, Modal,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import { Domaine } from "@/types/domaine";

type Props = {
  visible: boolean;
  domaines: Domaine[];
  selectedDomaine: string;
  submitting: boolean;
  onSelect: (nom: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function NginxConfigForm({
  visible, domaines, selectedDomaine, submitting, onSelect, onSubmit, onCancel
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[80%]">
            <Text className="text-white text-xl font-bold mb-2">
              Configurer un domaine
            </Text>
            <Text className="text-gray-400 text-sm mb-5">
              Sélectionne le domaine à configurer sur Nginx
            </Text>

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

            <View className="flex-row gap-3 mt-4 mb-6">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 py-4 rounded-2xl border border-gray-700 items-center"
              >
                <Text className="text-gray-400 font-semibold">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                disabled={submitting || !selectedDomaine}
                className={`flex-1 py-4 rounded-2xl items-center ${
                  selectedDomaine ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white font-bold">Configurer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}