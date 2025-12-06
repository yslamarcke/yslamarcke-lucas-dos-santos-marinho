
import React, { useState, useMemo } from 'react';
import { Report, GovernmentUser, BroadcastMessage, TeamUser, TeamSpecialty } from '../types';
import { MOCK_GOV_USERS } from '../constants';
import { Button } from './Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, Radio, LogOut, ArrowRight, Building, Lock, Trash2, Map as MapIcon, UserPlus, Briefcase } from 'lucide-react';
import { MapView } from './MapView';

interface CityHallViewProps {
  reports: Report[];
  currentUser: GovernmentUser | null;
  onLogin: (user: GovernmentUser) => void;
  onLogout: () => void;
  broadcasts: BroadcastMessage[];
  onAddBroadcast: (title: string, message: string, target: 'citizens' | 'teams' | 'all', priority: 'Normal' | 'Urgent') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  allTeamUsers: TeamUser[];
  onRegisterMember: (user: TeamUser) => void;
  onRemoveMember: (id: string) => void;
}

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626'];

export const CityHallView: React.FC<CityHallViewProps> = ({ 
  reports, currentUser, onLogin, onLogout, 
  allTeamUsers, onRegisterMember, onRemoveMember, addToast 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'team_mgmt'>('dashboard');

  // New Team Member State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUser, setNewMemberUser] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'leader' | 'member'>('member');

  // SILO LOGIC: Filter data based on Secretary's department
  // If 'Gabinete' (Mayor), see everything. Else, see only department stuff.
  const filteredReports = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.department === 'Gabinete') return reports;
    return reports.filter(r => r.category === currentUser.department);
  }, [reports, currentUser]);

  const filteredTeam = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.department === 'Gabinete') return allTeamUsers;
    return allTeamUsers.filter(u => u.specialty === currentUser.department);
  }, [allTeamUsers, currentUser]);

  // Stats calculation on FILTERED data
  const stats = useMemo(() => {
    const total = filteredReports.length;
    const resolved = filteredReports.filter(r => r.status === 'resolved').length;
    const pending = filteredReports.filter(r => r.status === 'pending').length;
    const efficiency = total ? Math.round((resolved / total) * 100) : 0;
    
    // Status Pie Data
    const statusData = [
       { name: 'Resolvido', value: resolved },
       { name: 'Andamento', value: filteredReports.filter(r => r.status === 'in_progress').length },
       { name: 'Pendente', value: pending }
    ].filter(d => d.value > 0);

    return { total, resolved, pending, efficiency, statusData };
  }, [filteredReports]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_GOV_USERS.find(u => u.username === username && (u.password === password || (!u.password && password === '1234')));
    if (user) onLogin(user);
    else addToast('Acesso negado.', 'error');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Auto-assign specialty based on Secretary's department
    // If Mayor, default to 'Geral' or force user to pick (simplified here to Limpeza for Mayor)
    const specialty = currentUser.department === 'Gabinete' ? 'Limpeza Urbana' : currentUser.department as TeamSpecialty;

    onRegisterMember({
       id: Date.now().toString(),
       name: newMemberName,
       username: newMemberUser,
       password: '123', // Default
       role: newMemberRole,
       specialty: specialty
    });
    setNewMemberName('');
    setNewMemberUser('');
    addToast('Funcionário adicionado.', 'success');
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-gray-800">
            <Building className="w-10 h-10 text-gray-800 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-6">Acesso Governamental</h2>
            <form onSubmit={handleLogin} className="space-y-4">
               <input type="text" placeholder="Usuário" className="w-full p-3 border rounded" value={username} onChange={e => setUsername(e.target.value)} />
               <input type="password" placeholder="Senha" className="w-full p-3 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
               <Button type="submit" fullWidth className="bg-gray-800 hover:bg-gray-900">Entrar</Button>
            </form>
            <div className="mt-6 space-y-2">
               <button onClick={() => {setUsername('prefeito'); setPassword('1234')}} className="text-xs w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">Prefeito (Gabinete) - Vê tudo</button>
               <button onClick={() => {setUsername('sec.obras'); setPassword('1234')}} className="text-xs w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">Sec. Obras (Infraestrutura)</button>
               <button onClick={() => {setUsername('sec.agua'); setPassword('1234')}} className="text-xs w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded">Sec. SAAE (Saneamento)</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 h-fit p-4">
         <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="font-bold text-gray-800">{currentUser.name}</h2>
            <p className="text-xs text-gray-500 uppercase">{currentUser.department}</p>
         </div>
         <nav className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-gray-100 font-bold' : 'text-gray-600'}`}>
               <TrendingUp className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('team_mgmt')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'team_mgmt' ? 'bg-gray-100 font-bold' : 'text-gray-600'}`}>
               <Users className="w-4 h-4" /> Minha Equipe
            </button>
            <button onClick={onLogout} className="w-full text-left p-2 rounded flex items-center gap-2 text-red-600 hover:bg-red-50 mt-4">
               <LogOut className="w-4 h-4" /> Sair
            </button>
         </nav>
      </div>

      <div className="flex-1 space-y-6">
         {activeTab === 'dashboard' && (
            <>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                  <h1 className="text-xl font-bold">Painel de {currentUser.department}</h1>
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Eficiência: {stats.efficiency}%</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                     <p className="text-xs text-gray-500 uppercase">Solicitações Totais</p>
                     <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                     <p className="text-xs text-gray-500 uppercase">Resolvidos</p>
                     <p className="text-3xl font-bold text-emerald-600">{stats.resolved}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                     <p className="text-xs text-gray-500 uppercase">Pendentes</p>
                     <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                  </div>
               </div>

               <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                  <MapView reports={filteredReports} />
               </div>

               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64">
                  <h3 className="font-bold mb-4">Status dos Chamados</h3>
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={stats.statusData} innerRadius={40} outerRadius={70} fill="#8884d8" dataKey="value">
                           {stats.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </>
         )}

         {activeTab === 'team_mgmt' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Gestão de Equipe ({currentUser.department})
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* List */}
                  <div>
                     <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Funcionários Ativos</h4>
                     {filteredTeam.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum funcionário cadastrado nesta secretaria.</p>
                     ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                           {filteredTeam.map(user => (
                              <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                 <div>
                                    <p className="font-bold text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role === 'leader' ? 'Líder' : 'Membro'} • {user.username}</p>
                                 </div>
                                 <button onClick={() => {
                                    if(window.confirm(`Demitir ${user.name}?`)) onRemoveMember(user.id);
                                 }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Add Form */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                     <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center"><UserPlus className="w-4 h-4 mr-2"/> Cadastrar Novo</h4>
                     <form onSubmit={handleRegister} className="space-y-3">
                        <input type="text" placeholder="Nome Completo" className="w-full p-2 border rounded text-sm" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} required />
                        <input type="text" placeholder="Login" className="w-full p-2 border rounded text-sm" value={newMemberUser} onChange={e => setNewMemberUser(e.target.value)} required />
                        <select className="w-full p-2 border rounded text-sm" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value as any)}>
                           <option value="member">Membro Operacional</option>
                           <option value="leader">Líder de Equipe</option>
                        </select>
                        <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">
                           Nota: O funcionário será automaticamente vinculado ao setor de <strong>{currentUser.department}</strong>.
                        </div>
                        <Button fullWidth size="sm" type="submit">Cadastrar</Button>
                     </form>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};
