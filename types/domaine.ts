export type Domaine = {
  id: number;
  nom: string;
  adresseIp: string;
  dateCreation: string;
  dateModification: string;
  wanUrl: string | null;
};

export type InstallationDnsmasq = {
  id: number;
  dateExecution: string;
  statut: string;
  logOutput: string;
};