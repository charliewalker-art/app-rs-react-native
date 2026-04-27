import { Authority } from "@/types/authority";
import { Linking } from "react-native";

// Utilisation directe de la variable d'environnement Expo
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const commonHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

/**
 * GET - Récupère la liste de toutes les autorités
 */
export async function getAuthorities(): Promise<Authority[]> {
  console.log("Tentative de récupération sur :", `${API_BASE_URL}/api/authorities/list`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/authorities/list`, {
      method: "GET",
      headers: commonHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API list:", errorText);
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur réseau getAuthorities:", error);
    throw error;
  }
}

/**
 * POST - Génère une nouvelle autorité
 * Spring Boot attend : name, organization, country, state, locality, expiryYears
 */
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
    headers: commonHeaders,
    body: JSON.stringify({
      name: data.name,
      organization: data.organization,
      country: data.country,
      state: data.state,
      locality: data.locality,
      expiryYears: data.validityYears, // Correction pour correspondre au backend
    }),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(`Erreur génération: ${errorMsg}`);
  }
  
  return response.text();
}

/**
 * GET - Récupère le CRL d'une autorité
 */
export async function getCRL(id: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/authorities/${id}/crl`, {
    method: "GET",
    headers: commonHeaders,
  });

  if (!response.ok) throw new Error("Impossible de récupérer le CRL");
  return response.text();
}

/**
 * GET - Télécharge le certificat root via le navigateur
 */
export async function downloadRootCert(id: number): Promise<void> {
  const url = `${API_BASE_URL}/api/authorities/download-root/${id}`;
  
  // Note: Comme c'est un téléchargement direct, le navigateur affichera 
  // peut-être l'avertissement ngrok une fois avant le téléchargement.
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error("Impossible d'ouvrir l'URL de téléchargement");
  }
}