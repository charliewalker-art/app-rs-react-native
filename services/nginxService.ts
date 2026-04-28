import { GestionNginx, ConfigurationNginx } from "@/types/nginx";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const commonHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

async function callNginx(endpoint: string): Promise<GestionNginx> {
  const response = await fetch(`${API_BASE_URL}/api/nginx/${endpoint}`, {
    method: "POST",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export const installNginx   = () => callNginx("install");
export const uninstallNginx = () => callNginx("uninstall");
export const startNginx     = () => callNginx("start");
export const stopNginx      = () => callNginx("stop");
export const restartNginx   = () => callNginx("restart");

export async function configurerNginxDomaine(nomDomaine: string): Promise<ConfigurationNginx> {
  const response = await fetch(`${API_BASE_URL}/api/nginx/configure`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({ nomDomaine }),
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}