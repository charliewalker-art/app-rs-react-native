import {
  View, Text, TextInput, TouchableOpacity, Modal,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { Authority } from "@/types/authority";

type FormData = {
  commonName: string;
  country: string;
  days: string;
  authorityId: string;
};

type Props = {
  visible: boolean;
  form: FormData;
  submitting: boolean;
  authorities: Authority[];
  onChange: (key: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function CertificatForm({ visible, form, submitting, authorities, onChange, onSubmit, onCancel }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View className="flex-1 bg-black/60 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[90%]">
            <Text className="text-white text-xl font-bold mb-5">Nouveau certificat</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Nom de domaine */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-1">Nom de domaine *</Text>
                <TextInput
                  value={form.commonName}
                  onChangeText={(val) => onChange("commonName", val)}
                  placeholder="ex: serveur-app.mg"
                  placeholderTextColor="#6b7280"
                  className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
                />
              </View>

              {/* Pays */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-1">Pays *</Text>
                <TextInput
                  value={form.country}
                  onChangeText={(val) => onChange("country", val)}
                  placeholder="ex: MG"
                  placeholderTextColor="#6b7280"
                  className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
                />
              </View>

              {/* Validité */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-1">Validité (jours)</Text>
                <TextInput
                  value={form.days}
                  onChangeText={(val) => onChange("days", val)}
                  placeholder="ex: 365"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
                />
              </View>

              {/* Sélection autorité */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs mb-2">Autorité *</Text>
                {authorities.map((auth) => (
                  <TouchableOpacity
                    key={auth.id}
                    onPress={() => onChange("authorityId", String(auth.id))}
                    className={`flex-row items-center justify-between p-3 rounded-xl mb-2 border ${
                      form.authorityId === String(auth.id)
                        ? "border-blue-500 bg-blue-600/20"
                        : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <View>
                      <Text className="text-white font-semibold text-sm">{auth.name}</Text>
                      <Text className="text-gray-400 text-xs">{auth.organization} — {auth.country}</Text>
                    </View>
                    {form.authorityId === String(auth.id) && (
                      <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Boutons */}
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
                    : <Text className="text-white font-bold">Générer</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}