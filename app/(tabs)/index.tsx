import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Shield, Globe, Server, Activity, Plus, Upload, RefreshCw } from "lucide-react-native";
import { getDomaines } from "@/services/domaineService";
import { getCertificats } from "@/services/certificatService";
import { restartNginx } from "@/services/nginxService";
import { restartDnsmasq } from "@/services/dnsmasqService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ domaines: 0, certifs: 0 });

  // Chargement des données
  const fetchData = async () => {
    try {
      const [domaines, certifs] = await Promise.all([
        getDomaines(),
        getCertificats()
      ]);
      setStats({
        domaines: domaines.length,
        certifs: certifs.length
      });
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-900 px-4 pt-12"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
    >
      {/* Header */}
      <View className="mb-8">
        <Text className="text-gray-400 text-lg">Bonjour, Charlie</Text>
        <Text className="text-white text-3xl font-bold">État du Serveur</Text>
      </View>

      {/* Section Statut des Services */}
      <View className="flex-row justify-between mb-6">
        <ServiceCard 
          title="Nginx" 
          status="Actif" 
          icon={<Server size={24} color="#3b82f6" />} 
          onRestart={() => restartNginx()}
        />
        <ServiceCard 
          title="DNS" 
          status="Actif" 
          icon={<Activity size={24} color="#10b981" />} 
          onRestart={() => restartDnsmasq()}
        />
      </View>

      {/* Section Statistiques */}
      <View className="bg-gray-800 p-6 rounded-3xl flex-row justify-around mb-8">
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{stats.domaines}</Text>
          <Text className="text-gray-400">Domaines</Text>
        </View>
        <View className="w-[1px] bg-gray-700" />
        <View className="items-center">
          <Text className="text-white text-2xl font-bold">{stats.certifs}</Text>
          <Text className="text-gray-400">Certificats</Text>
        </View>
      </View>

      {/* Actions Rapides */}
      <Text className="text-white text-xl font-bold mb-4">Actions rapides</Text>
      <View className="flex-row flex-wrap justify-between">
        <QuickAction label="Domaine" icon={<Plus color="white" />} color="bg-blue-600" />
        <QuickAction label="Upload" icon={<Upload color="white" />} color="bg-purple-600" />
        <QuickAction label="SSL" icon={<Shield color="white" />} color="bg-emerald-600" />
        <QuickAction label="Sync" icon={<RefreshCw color="white" />} color="bg-orange-600" />
      </View>
    </ScrollView>
  );
}

// Sous-composant pour les cartes Nginx/DNS
function ServiceCard({ title, status, icon, onRestart }: any) {
  return (
    <View className="bg-gray-800 w-[48%] p-4 rounded-3xl border border-gray-700">
      <View className="flex-row justify-between items-center mb-3">
        {icon}
        <TouchableOpacity onPress={onRestart}>
          <RefreshCw size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
      <Text className="text-white font-bold text-lg">{title}</Text>
      <Text className="text-emerald-500">{status}</Text>
    </View>
  );
}

// Sous-composant pour les boutons d'actions
function QuickAction({ label, icon, color }: any) {
  return (
    <TouchableOpacity className="w-[23%] items-center mb-6">
      <View className={`${color} p-4 rounded-2xl mb-2`}>
        {icon}
      </View>
      <Text className="text-gray-400 text-xs font-medium">{label}</Text>
    </TouchableOpacity>
  );
}