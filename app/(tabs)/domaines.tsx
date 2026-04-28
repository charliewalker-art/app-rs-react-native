import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { Domaine } from "@/types/domaine";
import {
  getDomaines, ajouterDomaine, modifierDomaine, supprimerDomaine
} from "@/services/domaineService";
import {
  installDnsmasq, uninstallDnsmasq, startDnsmasq, stopDnsmasq, restartDnsmasq
} from "@/services/dnsmasqService";
import DomaineCard from "@/components/dns_dnsmasq/DomaineCard";
import DomaineForm from "@/components/dns_dnsmasq/DomaineForm";
import DnsmasqControls from "@/components/dns_dnsmasq/DnsmasqControls";

export default function Domaines() {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nom, setNom] = useState("");
  const [adresseIp, setAdresseIp] = useState("");
  const [editDomaine, setEditDomaine] = useState<Domaine | null>(null);

  const loadDomaines = () => {
    setLoading(true);
    getDomaines()
      .then(setDomaines)
      .catch((e) => Toast.show({ type: "error", text1: "Erreur", text2: e.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDomaines(); }, []);

  const handleAjouter = async () => {
    if (!nom || !adresseIp) {
      Toast.show({ type: "error", text1: "Champs manquants", text2: "Nom et IP sont obligatoires" });
      return;
    }
    setSubmitting(true);
    try {
      await ajouterDomaine(nom, adresseIp);
      Toast.show({ type: "success", text1: "Succès", text2: "Domaine ajouté !" });
      setShowForm(false);
      setNom("");
      setAdresseIp("");
      loadDomaines();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModifier = async () => {
    if (!editDomaine || !adresseIp) return;
    setSubmitting(true);
    try {
      await modifierDomaine(editDomaine.id, adresseIp);
      Toast.show({ type: "success", text1: "Succès", text2: "Domaine modifié !" });
      setEditDomaine(null);
      setAdresseIp("");
      loadDomaines();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupprimer = async (id: number) => {
    try {
      await supprimerDomaine(id);
      Toast.show({ type: "success", text1: "Supprimé", text2: "Domaine supprimé !" });
      loadDomaines();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    }
  };

  const handleDnsAction = async (action: () => Promise<any>, label: string) => {
    setDnsLoading(true);
    try {
      const result = await action();
      Toast.show({ type: "success", text1: label, text2: result.statut });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setDnsLoading(false);
    }
  };

  const dnsActions = [
    { label: "Installer", color: "#3B82F6", onPress: () => handleDnsAction(installDnsmasq, "Installation") },
    { label: "Démarrer", color: "#10B981", onPress: () => handleDnsAction(startDnsmasq, "Démarrage") },
    { label: "Arrêter", color: "#EF4444", onPress: () => handleDnsAction(stopDnsmasq, "Arrêt") },
    { label: "Redémarrer", color: "#F59E0B", onPress: () => handleDnsAction(restartDnsmasq, "Redémarrage") },
    { label: "Désinstaller", color: "#6B7280", onPress: () => handleDnsAction(uninstallDnsmasq, "Désinstallation") },
  ];

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-white text-2xl font-bold">DNS & Domaines</Text>
        <Text className="text-gray-400 text-sm mt-1">
          Gérez vos domaines et le service Dnsmasq.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contrôles Dnsmasq */}
        <DnsmasqControls loading={dnsLoading} actions={dnsActions} />

        {/* Liste des domaines */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-lg">Liste des Domaines</Text>
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-blue-600 py-2 px-4 rounded-xl"
            >
              <Text className="text-white font-bold text-sm">+ Ajouter</Text>
            </TouchableOpacity>
          </View>

          {domaines.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">Aucun domaine trouvé</Text>
            </View>
          ) : (
            domaines.map((domaine) => (
              <DomaineCard
                key={domaine.id}
                domaine={domaine}
                onModifier={(d) => { setEditDomaine(d); setAdresseIp(d.adresseIp); }}
                onSupprimer={handleSupprimer}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Form Ajouter */}
      <DomaineForm
        visible={showForm}
        nom={nom}
        adresseIp={adresseIp}
        submitting={submitting}
        isEdit={false}
        onChangeNom={setNom}
        onChangeIp={setAdresseIp}
        onSubmit={handleAjouter}
        onCancel={() => { setShowForm(false); setNom(""); setAdresseIp(""); }}
      />

      {/* Form Modifier */}
      <DomaineForm
        visible={editDomaine !== null}
        nom={editDomaine?.nom ?? ""}
        adresseIp={adresseIp}
        submitting={submitting}
        isEdit={true}
        onChangeNom={() => {}}
        onChangeIp={setAdresseIp}
        onSubmit={handleModifier}
        onCancel={() => { setEditDomaine(null); setAdresseIp(""); }}
      />
    </View>
  );
}