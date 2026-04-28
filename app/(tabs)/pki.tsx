import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
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

export default function PKI() {
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
      Toast.show({
        type: "error",
        text1: "Champs manquants",
        text2: "Nom, organisation et pays sont obligatoires",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await generateAuthority({ ...form, validityYears: parseInt(form.validityYears) });
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Autorité générée avec succès !",
        position: "top",
        visibilityTime: 3000,
      });
      setShowForm(false);
      setForm(emptyForm);
      loadAuthorities();
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: e.message,
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCRL = async (id: number) => {
    try {
      const result = await getCRL(id);
      Toast.show({
        type: "success",
        text1: "CRL mis à jour",
        text2: result,
        position: "top",
        visibilityTime: 3000,
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: e.message,
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );

  if (error) return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-4">
      <Text className="text-red-400 text-center mb-4">{error}</Text>
      <TouchableOpacity
        onPress={loadAuthorities}
        className="bg-blue-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-bold">Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">PKI Management</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Gérez vos autorités de certification et certificats.
        </Text>
      </View>

      {/* Titre + Bouton créer */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-white font-bold text-lg">Liste des Autorités</Text>
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          className="bg-green-500 py-2 px-4 rounded-xl flex-row items-center gap-1"
        >
          <Text className="text-white font-bold text-sm">+ Créer une autorité</Text>
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