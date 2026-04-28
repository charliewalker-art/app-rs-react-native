import { InstallationDnsmasq } from "@/types/domaine";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const commonHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

async function callDnsmasq(endpoint: string): Promise<InstallationDnsmasq> {
  const response = await fetch(`${API_BASE_URL}/api/installation-dns/${endpoint}`, {
    method: "POST",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export const installDnsmasq  = () => callDnsmasq("run");
export const uninstallDnsmasq = () => callDnsmasq("uninstall");
export const startDnsmasq    = () => callDnsmasq("start");
export const stopDnsmasq     = () => callDnsmasq("stop");
export const restartDnsmasq  = () => callDnsmasq("restart");