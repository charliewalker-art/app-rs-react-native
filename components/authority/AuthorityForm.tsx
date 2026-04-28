import {
  View, Text, TextInput, TouchableOpacity, Modal,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";

type FormData = {
  name: string;
  organization: string;
  country: string;
  state: string;
  locality: string;
  validityYears: string;
};

type Props = {
  visible: boolean;
  form: FormData;
  submitting: boolean;
  onChange: (key: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const fields = [
  { key: "name", label: "Nom *" },
  { key: "organization", label: "Organisation *" },
  { key: "country", label: "Pays * (ex: MG)" },
  { key: "state", label: "État / Région" },
  { key: "locality", label: "Localité" },
  { key: "validityYears", label: "Validité (années)", keyboard: "numeric" },
];

export default function AuthorityForm({ visible, form, submitting, onChange, onSubmit, onCancel }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[90%]">
            <Text className="text-white text-xl font-bold mb-5">
              Nouvelle autorité
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {fields.map((field) => (
                <View key={field.key} className="mb-4">
                  <Text className="text-gray-400 text-xs mb-1">{field.label}</Text>
                  <TextInput
                    value={form[field.key as keyof FormData]}
                    onChangeText={(val) => onChange(field.key as keyof FormData, val)}
                    keyboardType={field.keyboard as any ?? "default"}
                    className="bg-gray-800 text-white rounded-xl px-4 py-3 text-sm border border-gray-700"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              ))}
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}