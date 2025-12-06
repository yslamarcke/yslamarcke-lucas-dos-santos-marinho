
import { Report, TeamUser, TeamInstruction, GovernmentUser, BroadcastMessage, AdminUser, Municipality, SystemConfig } from './types';

// Static constants that don't change dynamically
export const AUTHOR = "Yslamarcke Lucas dos Santos Marinho";
export const YEAR = 2025;

export const DEFAULT_CONFIG: SystemConfig = {
  appName: "ZelaPB",
  appSlogan: "Transformando solicitações em soluções.",
  version: "1.0.0",
  maintenanceMode: false,
  allowRegistrations: true,
  primaryColorName: "Emerald Green"
};

export const GAMIFICATION_LEVELS = [
  { level: 1, name: "Cidadão Iniciante", minPoints: 0 },
  { level: 2, name: "Cidadão Atento", minPoints: 100 },
  { level: 3, name: "Fiscal do Bairro", minPoints: 300 },
  { level: 4, name: "Guardião da Cidade", minPoints: 600 },
  { level: 5, name: "Prefeito Honorário", minPoints: 1000 },
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    description: 'Vazamento de água limpa na rua principal.',
    category: 'Saneamento', // Vai pro SAAE
    priority: 'High',
    status: 'pending',
    location: 'Rua Pedro I',
    addressNumber: '45',
    coordinates: { x: 30, y: 40 },
    citizenName: 'João Silva',
    timestamp: new Date('2025-05-10T10:00:00'),
  },
  {
    id: '2',
    description: 'Buraco enorme impedindo passagem de carros.',
    category: 'Infraestrutura', // Vai pra Obras
    priority: 'Medium',
    status: 'in_progress',
    location: 'Rua das Flores',
    addressNumber: '120',
    coordinates: { x: 60, y: 20 },
    citizenName: 'Maria Oliveira',
    timestamp: new Date('2025-05-11T14:30:00'),
  },
  {
    id: '3',
    description: 'Lâmpada do poste queimada há 3 dias.',
    category: 'Iluminação', // Vai pra Iluminação
    priority: 'Low',
    status: 'resolved',
    location: 'Av. Brasil',
    addressNumber: '500',
    coordinates: { x: 80, y: 70 },
    citizenName: 'Carlos Souza',
    timestamp: new Date('2025-05-09T09:15:00'),
  }
];

export const MOCK_TEAM_USERS: TeamUser[] = [
  { id: 'l1', name: 'Roberto (Líder Limpeza)', username: 'lider.limpeza', role: 'leader', specialty: 'Limpeza Urbana' },
  { id: 'l2', name: 'Ana (Líder Obras)', username: 'lider.infra', role: 'leader', specialty: 'Infraestrutura' },
  { id: 'l3', name: 'Carlos (Líder Luz)', username: 'lider.luz', role: 'leader', specialty: 'Iluminação' },
  { id: 'l4', name: 'Marcos (Líder SAAE)', username: 'lider.agua', role: 'leader', specialty: 'Saneamento' },
  { id: 'm1', name: 'José (Gari)', username: 'jose', role: 'member', specialty: 'Limpeza Urbana' },
  { id: 'm4', name: 'Pedro (Encanador)', username: 'pedro', role: 'member', specialty: 'Saneamento' },
];

export const MOCK_GOV_USERS: GovernmentUser[] = [
  { id: 'g1', name: 'Prefeito João', username: 'prefeito', role: 'mayor', department: 'Gabinete' },
  { id: 'g2', name: 'Sec. Maria (Obras)', username: 'sec.obras', role: 'secretary', department: 'Infraestrutura' },
  { id: 'g3', name: 'Sec. Roberto (SAAE)', username: 'sec.agua', role: 'secretary', department: 'Saneamento' },
  { id: 'g4', name: 'Sec. Luzia (Iluminação)', username: 'sec.luz', role: 'secretary', department: 'Iluminação' },
];

export const MOCK_ADMIN: AdminUser = {
  id: 'admin_yslamarcke',
  name: 'Yslamarcke Marinho',
  username: 'yslamarcke',
  role: 'super_admin'
};

export const INITIAL_MUNICIPALITIES: Municipality[] = [
  {
    id: 'm1',
    name: 'Campina Grande',
    mayorName: 'Bruno Cunha Lima',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-01-15'),
    nextPaymentDate: new Date('2025-06-15')
  },
  {
    id: 'm2',
    name: 'João Pessoa',
    mayorName: 'Cícero Lucena',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-02-10'),
    nextPaymentDate: new Date('2025-06-10')
  },
  {
    id: 'm3',
    name: 'Patos',
    mayorName: 'Nabor Wanderley',
    contractValue: 5000,
    status: 'blocked',
    joinedDate: new Date('2024-03-01'),
    nextPaymentDate: new Date('2025-05-01')
  },
  {
    id: 'm4',
    name: 'Sousa',
    mayorName: 'Fábio Tyrone',
    contractValue: 5000,
    status: 'active',
    joinedDate: new Date('2024-04-20'),
    nextPaymentDate: new Date('2025-06-20')
  }
];

export const INITIAL_INSTRUCTIONS: TeamInstruction[] = [
  {
    id: 'i1',
    leaderName: 'Roberto (Líder Limpeza)',
    specialty: 'Limpeza Urbana',
    message: 'Atenção equipe: Priorizar coleta na zona norte hoje devido ao evento na praça.',
    timestamp: new Date()
  }
];

export const INITIAL_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'b1',
    senderName: 'Prefeitura Municipal',
    senderRole: 'Gabinete',
    target: 'citizens',
    title: 'Campanha Cidade Limpa',
    message: 'Neste sábado teremos um mutirão de limpeza no centro. Participe!',
    timestamp: new Date('2025-05-12T08:00:00'),
    priority: 'Normal'
  },
];
