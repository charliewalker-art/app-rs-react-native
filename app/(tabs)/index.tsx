import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { getAuthorities, generateAuthority, getCRL, downloadRootCert } from "@/services/authorityService";
import { Authority } from "@/types/authority";
import AuthorityList from "@/components/authority/AuthorityList";
import AuthorityForm from "@/components/authority/AuthorityForm";

type FormData = {
  name: string;
  organization: string;
  country: string;
  state: string;
  locality: string;
  validityYears: string;
};

const emptyForm: FormData = {
  name: "", organization: "", country: "", state: "", locality: "", validityYears: "10",
};

export default function Index() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const loadAuthorities = () => {
    setLoading(true);
    getAuthorities()
      .then(setAuthorities)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAuthorities(); }, []);

  const handleGenerate = async () => {
    if (!form.name || !form.organization || !form.country) {
      Alert.alert("Erreur", "Nom, organisation et pays sont obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      await generateAuthority({ ...form, validityYears: parseInt(form.validityYears) });
      Alert.alert("Succès", "Autorité générée !");
      setShowForm(false);
      setForm(emptyForm);
      loadAuthorities();
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCRL = async (id: number) => {
    try {
      const result = await getCRL(id);
      Alert.alert("CRL mis à jour", result);
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    }
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );

  if (error) return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-red-500 text-center">{error}</Text>
      <TouchableOpacity onPress={loadAuthorities} style={{ marginTop: 12, backgroundColor: "#6366f1", padding: 10, borderRadius: 8 }}>
        <Text style={{ color: "#fff" }}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          style={{ backgroundColor: "#6366f1", padding: 14, borderRadius: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>+ Nouvelle autorité</Text>
        </TouchableOpacity>
      </View>

      <AuthorityList
        authorities={authorities}
        onCRL={handleCRL}
        onDownload={downloadRootCert}
      />

      <AuthorityForm
        visible={showForm}
        form={form}
        submitting={submitting}
        onChange={(key, val) => setForm((prev) => ({ ...prev, [key]: val }))}
        onSubmit={handleGenerate}
        onCancel={() => setShowForm(false)}
      />
    </View>
  );
}