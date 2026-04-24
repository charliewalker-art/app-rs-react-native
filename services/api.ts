import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;
import { Authority } from "@/types/authority";

export async function getAuthorities(): Promise<Authority[]> {
  const response = await fetch(`${API_BASE_URL}/api/authorities/list`);
  if (!response.ok) throw new Error("Erreur lors de la récupération");
  return response.json();
}