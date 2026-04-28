export type GestionNginx = {
  id: number;
  dateExecution: string;
  action: string;
  statut: string;
  logOutput: string;
};

export type ConfigurationNginx = {
  id: number;
  nomDomaine: string;
  dateExecution: string;
  statut: string;
  logOutput: string;
  wanUrl: string | null;
};