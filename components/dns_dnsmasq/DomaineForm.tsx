import {
  View, Text, TextInput, TouchableOpacity, Modal,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";

type Props = {
  visible: boolean;
  nom: string;
  adresseIp: string;
  submitting: boolean;
  isEdit: boolean;
  onChangeNom: (val: string) => void;
  onChangeIp: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function DomaineForm({
  visible, nom, adresseIp, submitting, isEdit,
  onChangeNom, onChangeIp, onSubmit, onCancel
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6">
            <Text className="text-white text-xl font-bold mb-5">
              {isEdit ? "Modifier le domaine" : "Nouveau domaine"}
            </Text>
            {!isEdit && (
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-1">Nom du domaine *</Text>
                <TextInput
                  value={nom}
                  onChangeText={onChangeNom}
                  placeholder="ex: serveur-app.mg"
                  placeholderTextColor="#6b7280"
                  className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
                />
              </View>
            )}
            <View className="mb-4">
              <Text className="text-gray-400 text-xs mb-1">Adresse IP *</Text>
              <TextInput
                value={adresseIp}
                onChangeText={onChangeIp}
                placeholder="ex: 192.168.1.10"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
              />
            </View>
            <View className="flex-row gap-3 mt-2 mb-6">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 py-4 rounded-2xl border border-gray-700 items-center"
              >
                <Text className="text-gray-400 font-semibold">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                disabled={submitting}
                className="flex-1 bg-blue-600 py-4 rounded-2xl items-center"
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white font-bold">
                      {isEdit ? "Modifier" : "Ajouter"}
                    </Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}