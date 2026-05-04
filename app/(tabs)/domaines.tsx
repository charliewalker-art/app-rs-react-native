import {  useState } from "react";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
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

  // Recharge à chaque fois qu'on revient sur la page
  useFocusEffect(
    useCallback(() => {
      loadDomaines();
    }, [])
  );

  const handleAjouter = async () => {
    if (!nom || !adresseIp) {
      Toast.show({ type: "error", text1: "Champs manquants", text2: "Nom et IP sont obligatoires" });
      return;
    }
    setSubmitting(true);
    try {
      await ajouterDomaine(nom, adresseIp);
      Toast.show({ type: "success", text1: "Succes", text2: "Domaine ajoute" });
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
      Toast.show({ type: "success", text1: "Succes", text2: "Domaine modifie" });
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
      Toast.show({ type: "success", text1: "Supprime", text2: "Domaine supprime" });
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
    { label: "Demarrer", color: "#10B981", onPress: () => handleDnsAction(startDnsmasq, "Demarrage") },
    { label: "Arreter", color: "#EF4444", onPress: () => handleDnsAction(stopDnsmasq, "Arret") },
    { label: "Redemarrer", color: "#F59E0B", onPress: () => handleDnsAction(restartDnsmasq, "Redemarrage") },
    { label: "Desinstaller", color: "#6B7280", onPress: () => handleDnsAction(uninstallDnsmasq, "Desinstallation") },
  ];

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );

  return (
    
    <View className="flex-1 bg-gray-900">
      <View className="px-6 pt-12 pb-6 bg-gray-900 border-b border-gray-800">
        <Text className="text-gray-500 text-sm mt-1">Gestion Dnsmasq et Domaines</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mt-4">
          <DnsmasqControls loading={dnsLoading} actions={dnsActions} />
        </View>

        <View className="px-6 pb-32">
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">
            Liste des domaines ({domaines.length})
          </Text>

          {domaines.length === 0 ? (
            <View className="items-center py-12 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700">
              <Text className="text-gray-600">Aucun domaine configure</Text>
            </View>
          ) : (
            domaines.map((domaine) => (
              <DomaineCard
                key={domaine.id}
                domaine={domaine}
              
                onSupprimer={handleSupprimer}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowForm(true)}
        className="absolute bottom-8 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-blue-500/40"
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>

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