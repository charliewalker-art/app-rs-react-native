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
  { key: "country", label: "Pays * (ex: FR)" },
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
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: "90%",
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#1f2937" }}>
              Nouvelle autorité
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {fields.map((field) => (
                <View key={field.key} style={{ marginBottom: 12 }}>
                  <Text style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>{field.label}</Text>
                  <TextInput
                    value={form[field.key as keyof FormData]}
                    onChangeText={(val) => onChange(field.key as keyof FormData, val)}
                    keyboardType={field.keyboard as any ?? "default"}
                    style={{
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 14,
                      color: "#1f2937",
                    }}
                  />
                </View>
              ))}

              <View style={{ flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={{ flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center" }}
                >
                  <Text style={{ color: "#6b7280" }}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onSubmit}
                  disabled={submitting}
                  style={{ flex: 1, backgroundColor: "#6366f1", padding: 14, borderRadius: 10, alignItems: "center" }}
                >
                  {submitting
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{ color: "#fff", fontWeight: "bold" }}>Générer</Text>
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