import { Certificat } from "@/types/certificat";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const commonHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export async function getCertificats(): Promise<Certificat[]> {
  const response = await fetch(`${API_BASE_URL}/api/certificates/list`, {
    method: "GET",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.json();
}

export async function genererCertificat(data: {
  commonName: string;
  country: string;
  days: number;
  authorityId: number;
}): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/certificates/generate`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.text();
}

export async function revoquerCertificat(id: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/certificates/revoke/${id}`, {
    method: "POST",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.text();
}

export async function retablirCertificat(id: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/certificates/unrevoke/${id}`, {
    method: "PUT",
    headers: commonHeaders,
  });
  if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
  return response.text();
}