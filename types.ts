
export type UserRole = 'citizen' | 'team' | 'government' | 'landing' | 'admin';

export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

// Departamentos Estritos para Roteamento
export type Department = 'Limpeza Urbana' | 'Infraestrutura' | 'Iluminação' | 'Saneamento';

export type TeamSpecialty = Department | 'Geral';

export interface SystemConfig {
  appName: string;
  appSlogan: string;
  version: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  primaryColorName: string;
}

export interface CitizenProfile {
  id: string;
  name: string;
  age: string;
  photoUrl?: string; // Foto de identificação
  phone: string;
  neighborhood: string;
  street: string;
  number: string;
  points: number;
  level: number;
}

export interface TeamUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'leader' | 'member';
  specialty: TeamSpecialty;
}

export interface GovernmentUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: 'mayor' | 'secretary';
  department: Department | 'Gabinete'; // Gabinete vê tudo, Secretário só vê seu setor
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: 'super_admin';
}

export interface Municipality {
  id: string;
  name: string;
  mayorName: string;
  contractValue: number;
  status: 'active' | 'blocked' | 'pending';
  joinedDate: Date;
  nextPaymentDate: Date;
}

export interface TeamInstruction {
  id: string;
  leaderName: string;
  specialty: TeamSpecialty;
  message: string;
  timestamp: Date;
}

export interface BroadcastMessage {
  id: string;
  senderName: string;
  senderRole: string;
  target: 'citizens' | 'teams' | 'all';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'Normal' | 'Urgent';
}

export interface Report {
  id: string;
  description: string;
  category: Department; // Roteamento obrigatório
  priority: 'Low' | 'Medium' | 'High';
  status: ReportStatus;
  location: string;
  coordinates?: { x: number, y: number }; // Para o mapa interativo
  citizenName?: string;
  citizenPhoto?: string;
  contactPhone?: string;
  addressNumber?: string;
  timestamp: Date;
  imageUrl?: string;
  aiAnalysis?: string;
}

export interface DashboardStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  efficiency: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}
