import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { Authority } from "@/types/authority";
import { Certificat } from "@/types/certificat";
import { getAuthorities, generateAuthority, getCRL, downloadRootCert } from "@/services/authorityService";
import { getCertificats, genererCertificat, revoquerCertificat, retablirCertificat } from "@/services/certificatService";
import AuthorityList from "@/components/authority/AuthorityList";
import AuthorityForm from "@/components/authority/AuthorityForm";
import CertificatCard from "@/components/authority/CertificatCard";
import CertificatForm from "@/components/authority/CertificatForm";
import { ScrollView } from "react-native";

type Tab = "autorites" | "certificats";

type AuthorityFormData = {
  name: string;
  organization: string;
  country: string;
  state: string;
  locality: string;
  validityYears: string;
};

type CertificatFormData = {
  commonName: string;
  country: string;
  days: string;
  authorityId: string;
};

const emptyAuthorityForm: AuthorityFormData = {
  name: "", organization: "", country: "", state: "", locality: "", validityYears: "10",
};

const emptyCertificatForm: CertificatFormData = {
  commonName: "", country: "MG", days: "365", authorityId: "",
};

export default function PKI() {
  const [activeTab, setActiveTab] = useState<Tab>("autorites");
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthorityForm, setShowAuthorityForm] = useState(false);
  const [showCertificatForm, setShowCertificatForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authorityForm, setAuthorityForm] = useState<AuthorityFormData>(emptyAuthorityForm);
  const [certificatForm, setCertificatForm] = useState<CertificatFormData>(emptyCertificatForm);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAuthorities(), getCertificats()])
      .then(([auths, certs]) => {
        setAuthorities(auths);
        setCertificats(certs);
      })
      .catch((e) => Toast.show({ type: "error", text1: "Erreur", text2: e.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleGenerateAuthority = async () => {
    if (!authorityForm.name || !authorityForm.organization || !authorityForm.country) {
      Toast.show({ type: "error", text1: "Champs manquants", text2: "Nom, organisation et pays sont obligatoires" });
      return;
    }
    setSubmitting(true);
    try {
      await generateAuthority({ ...authorityForm, validityYears: parseInt(authorityForm.validityYears) });
      Toast.show({ type: "success", text1: "Succès", text2: "Autorité générée !" });
      setShowAuthorityForm(false);
      setAuthorityForm(emptyAuthorityForm);
      loadData();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateCertificat = async () => {
    if (!certificatForm.commonName || !certificatForm.authorityId) {
      Toast.show({ type: "error", text1: "Champs manquants", text2: "Domaine et ID autorité sont obligatoires" });
      return;
    }
    setSubmitting(true);
    try {
      await genererCertificat({
        commonName: certificatForm.commonName,
        country: certificatForm.country,
        days: parseInt(certificatForm.days),
        authorityId: parseInt(certificatForm.authorityId),
      });
      Toast.show({ type: "success", text1: "Succès", text2: "Certificat généré !" });
      setShowCertificatForm(false);
      setCertificatForm(emptyCertificatForm);
      loadData();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCRL = async (id: number) => {
    try {
      const result = await getCRL(id);
      Toast.show({ type: "success", text1: "CRL mis à jour", text2: result });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    }
  };

  const handleRevoquer = async (id: number) => {
    try {
      await revoquerCertificat(id);
      Toast.show({ type: "success", text1: "Révoqué", text2: "Certificat révoqué !" });
      loadData();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    }
  };

  const handleRetablir = async (id: number) => {
    try {
      await retablirCertificat(id);
      Toast.show({ type: "success", text1: "Rétabli", text2: "Certificat rétabli !" });
      loadData();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    }
  };

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
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

      {/* Onglets */}
      <View className="flex-row mx-5 mb-4 bg-gray-800 rounded-xl p-1">
        <TouchableOpacity
          onPress={() => setActiveTab("autorites")}
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === "autorites" ? "bg-blue-600" : ""}`}
        >
          <Text className={`font-bold text-sm ${activeTab === "autorites" ? "text-white" : "text-gray-400"}`}>
            Autorités
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("certificats")}
          className={`flex-1 py-2 rounded-lg items-center ${activeTab === "certificats" ? "bg-blue-600" : ""}`}
        >
          <Text className={`font-bold text-sm ${activeTab === "certificats" ? "text-white" : "text-gray-400"}`}>
            Certificats
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bouton créer */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-white font-bold text-lg">
          {activeTab === "autorites" ? "Liste des Autorités" : "Liste des Certificats"}
        </Text>
        <TouchableOpacity
          onPress={() => activeTab === "autorites" ? setShowAuthorityForm(true) : setShowCertificatForm(true)}
          className="bg-green-500 py-2 px-4 rounded-xl"
        >
          <Text className="text-white font-bold text-sm">+ Créer</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      {activeTab === "autorites" ? (
        <AuthorityList
          authorities={authorities}
          onCRL={handleCRL}
          onDownload={downloadRootCert}
        />
      ) : (
        <ScrollView className="flex-1 px-4">
          {certificats.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">Aucun certificat trouvé</Text>
            </View>
          ) : (
            certificats.map((cert) => (
              <CertificatCard
                key={cert.id}
                certificat={cert}
                onRevoquer={handleRevoquer}
                onRetablir={handleRetablir}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Forms */}
      <AuthorityForm
        visible={showAuthorityForm}
        form={authorityForm}
        submitting={submitting}
        onChange={(key, val) => setAuthorityForm((prev) => ({ ...prev, [key]: val }))}
        onSubmit={handleGenerateAuthority}
        onCancel={() => setShowAuthorityForm(false)}
      />

<CertificatForm
  visible={showCertificatForm}
  form={certificatForm}
  submitting={submitting}
  authorities={authorities}
  onChange={(key, val) => setCertificatForm((prev) => ({ ...prev, [key]: val }))}
  onSubmit={handleGenerateCertificat}
  onCancel={() => setShowCertificatForm(false)}
/>
    
    </View>
  );
}