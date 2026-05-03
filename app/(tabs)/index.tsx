import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import Toast from "react-native-toast-message";
import { Domaine } from "@/types/domaine";
import { Certificat } from "@/types/certificat";
import { Authority } from "@/types/authority";
import { getDomaines } from "@/services/domaineService";
import { getCertificats } from "@/services/certificatService";
import { getAuthorities } from "@/services/authorityService";
import { restartNginx } from "@/services/nginxService";
import { restartDnsmasq } from "@/services/dnsmasqService";
import HeaderDashboard from "@/components/dashboard/HeaderDashboard";
import ServiceStatusCard from "@/components/dashboard/ServiceStatusCard";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const [autorites, setAutorites] = useState<Authority[]>([]);
  const [restartingNginx, setRestartingNginx] = useState(false);
  const [restartingDns, setRestartingDns] = useState(false);

  const fetchData = async () => {
    try {
      const [dom, certs, auths] = await Promise.all([
        getDomaines(),
        getCertificats(),
        getAuthorities(),
      ]);
      setDomaines(dom);
      setCertificats(certs);
      setAutorites(auths);
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleRestartNginx = async () => {
    setRestartingNginx(true);
    try {
      await restartNginx();
      Toast.show({ type: "success", text1: "Nginx redémarré !" });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setRestartingNginx(false);
    }
  };

  const handleRestartDns = async () => {
    setRestartingDns(true);
    try {
      await restartDnsmasq();
      Toast.show({ type: "success", text1: "DNS redémarré !" });
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Erreur", text2: e.message });
    } finally {
      setRestartingDns(false);
    }
  };

  if (loading) return (
    <View className="flex-1 bg-gray-900 items-center justify-center">
      <ActivityIndicator color="#3b82f6" size="large" />
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
      }
    >
      <HeaderDashboard
        nbDomaines={domaines.length}
        nbCertificats={certificats.length}
        nbAutorites={autorites.length}
      />

      <View className="flex-row justify-between px-5 mb-5">
        <ServiceStatusCard
          title="Nginx"
          type="nginx"
          onRestart={handleRestartNginx}
          restarting={restartingNginx}
        />
        <ServiceStatusCard
          title="DNS"
          type="dns"
          onRestart={handleRestartDns}
          restarting={restartingDns}
        />
      </View>
    </ScrollView>
  );
}