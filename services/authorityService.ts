import Constants from "expo-constants";
import { Authority } from "@/types/authority";

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl;

// GET - liste toutes les autorités
export async function getAuthorities(): Promise<Authority[]> {
  const response = await fetch(`${API_BASE_URL}/api/authorities/list`);
  if (!response.ok) throw new Error("Erreur lors de la récupération");
  return response.json();
}

// POST - générer une nouvelle autorité
// Spring Boot attend : name, organization, country, state, locality, expiryYears
export async function generateAuthority(data: {
  name: string;
  organization: string;
  country: string;
  state: string;
  locality: string;
  validityYears: number;
}): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/authorities/generate`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", // évite la page d'avertissement ngrok
    },
    body: JSON.stringify({
      name: data.name,
      organization: data.organization,
      country: data.country,
      state: data.state,
      locality: data.locality,
      expiryYears: data.validityYears, // ← Spring Boot attend "expiryYears"
    }),
  });
  if (!response.ok) throw new Error("Erreur génération");
  return response.text();
}

// GET - mettre à jour le CRL d'une autorité
export async function getCRL(id: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/authorities/${id}/crl`, {
    headers: { "ngrok-skip-browser-warning": "true" },
  });
  if (!response.ok) throw new Error("Erreur CRL");
  return response.text();
}

// GET - télécharger le certificat root
export async function downloadRootCert(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/authorities/download-root/${id}`;
  const { Linking } = require("react-native");
  await Linking.openURL(url);
}