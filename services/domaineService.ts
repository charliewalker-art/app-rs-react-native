import { Domaine } from "@/types/domaine";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const commonHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export async function getDomaines(): Promise<Domaine[]> {
  const response = await fetch(`${API_BASE_URL}/api/domaines`, {
    method: "GET",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function ajouterDomaine(nom: string, adresseIp: string): Promise<Domaine> {
  const response = await fetch(`${API_BASE_URL}/api/domaines`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({ nom, adresseIp }),
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function modifierDomaine(id: number, adresseIp: string): Promise<Domaine> {
  const response = await fetch(`${API_BASE_URL}/api/domaines/${id}`, {
    method: "PUT",
    headers: commonHeaders,
    body: JSON.stringify({ adresseIp }),
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function supprimerDomaine(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/domaines/${id}`, {
    method: "DELETE",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
}