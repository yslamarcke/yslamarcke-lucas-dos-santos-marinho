
import React, { useState } from 'react';
import { Report, TeamUser, TeamInstruction, BroadcastMessage } from '../types';
import { Button } from './Button';
import { Shield, LogOut, Megaphone, Bell, UserCircle, Briefcase, CheckSquare, Clock, Map, ArrowRight } from 'lucide-react';

interface TeamViewProps {
  reports: Report[];
  onUpdateStatus: (id: string, status: Report['status']) => void;
  currentUser: TeamUser | null;
  allUsers: TeamUser[];
  onLogin: (user: TeamUser) => void;
  onLogout: () => void;
  instructions: TeamInstruction[];
  onAddInstruction: (msg: string) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  broadcasts: BroadcastMessage[];
}

export const TeamView: React.FC<TeamViewProps> = ({ 
  reports, 
  onUpdateStatus, 
  currentUser, 
  allUsers,
  onLogin, 
  onLogout,
  instructions,
  onAddInstruction,
  addToast,
  broadcasts
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'broadcast'>('tasks');
  const [newInstruction, setNewInstruction] = useState('');

  const teamBroadcasts = broadcasts.filter(b => b.target === 'teams' || b.target === 'all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = allUsers.find(u => u.username === username && (u.password === password || (!u.password && password === '1234')));
    if (user) {
      onLogin(user);
      setUsername('');
      setPassword('');
      addToast(`Bem-vindo, ${user.name}`, 'success');
    } else {
      addToast('Credenciais inválidas.', 'error');
    }
  };

  // --- LOGIN SCREEN ---
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-amber-600">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-4 rounded-full">
               <Briefcase className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Equipes da Prefeitura</h2>
          <p className="text-center text-gray-500 mb-6">Área restrita operacional.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Usuário</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded-lg mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg mt-1" />
            </div>
            <Button type="submit" fullWidth size="lg">Acessar</Button>
          </form>

          <div className="mt-8 space-y-2">
             <button onClick={() => {setUsername('lider.limpeza'); setPassword('1234')}} className="w-full p-2 bg-gray-50 text-xs flex justify-between rounded hover:bg-gray-100">
                <span>Líder Limpeza</span> <ArrowRight className="w-3 h-3"/>
             </button>
             <button onClick={() => {setUsername('lider.agua'); setPassword('1234')}} className="w-full p-2 bg-blue-50 text-xs flex justify-between rounded hover:bg-blue-100 text-blue-800">
                <span>Líder SAAE (Água)</span> <ArrowRight className="w-3 h-3"/>
             </button>
             <button onClick={() => {setUsername('jose'); setPassword('1234')}} className="w-full p-2 bg-gray-50 text-xs flex justify-between rounded hover:bg-gray-100">
                <span>Funcionário (Membro)</span> <ArrowRight className="w-3 h-3"/>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter Reports by Specialty (STRICT SILO)
  const mySpecialtyReports = reports.filter(r => r.category === currentUser.specialty && r.status !== 'resolved');
  const myInstructions = instructions.filter(i => i.specialty === currentUser.specialty);

  // --- LEADER & MEMBER DASHBOARD (Simplified Combined) ---
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
           <div className={`p-3 rounded-full ${currentUser.role === 'leader' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <UserCircle className="w-8 h-8" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-sm text-gray-500">{currentUser.role === 'leader' ? 'Líder de Equipe' : 'Funcionário'} • Setor: {currentUser.specialty}</p>
           </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}><LogOut className="w-4 h-4 mr-2" /> Sair</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* LEFT: INFO & INSTRUCTIONS */}
         <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
               <h3 className="font-bold text-amber-900 mb-4 flex items-center"><Bell className="w-5 h-5 mr-2" /> Quadro de Avisos</h3>
               {teamBroadcasts.map(bc => (
                  <div key={bc.id} className="bg-white p-3 rounded-lg shadow-sm mb-2 border-l-4 border-red-500">
                     <p className="font-bold text-xs uppercase text-red-500">{bc.senderName}</p>
                     <p className="text-sm">{bc.message}</p>
                  </div>
               ))}
               {myInstructions.map(i => (
                  <div key={i.id} className="bg-white p-3 rounded-lg shadow-sm mb-2 border-l-4 border-amber-500">
                     <p className="font-bold text-xs uppercase text-amber-600">Líder da Equipe</p>
                     <p className="text-sm">{i.message}</p>
                  </div>
               ))}
               {teamBroadcasts.length === 0 && myInstructions.length === 0 && <p className="text-sm text-amber-700/50">Nenhum aviso.</p>}
            </div>

            {currentUser.role === 'leader' && (
               <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-2">Enviar Orientação</h3>
                  <textarea 
                     className="w-full border rounded p-2 text-sm mb-2" 
                     rows={3}
                     placeholder="Mensagem para sua equipe..."
                     value={newInstruction}
                     onChange={e => setNewInstruction(e.target.value)}
                  />
                  <Button fullWidth onClick={() => {
                     if(newInstruction) { onAddInstruction(newInstruction); setNewInstruction(''); addToast('Enviado', 'success'); }
                  }}>Enviar</Button>
               </div>
            )}
         </div>

         {/* RIGHT: TASKS */}
         <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
               <CheckSquare className="w-5 h-5 mr-2" /> Tarefas do Setor: {currentUser.specialty}
            </h3>
            
            <div className="space-y-4">
               {mySpecialtyReports.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                     <p className="text-gray-500">Nenhuma solicitação pendente para este setor.</p>
                  </div>
               ) : (
                  mySpecialtyReports.map(report => (
                     <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                           {report.imageUrl ? <img src={report.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">Sem Foto</div>}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{report.priority} Priority</span>
                              <span className="text-xs text-gray-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> {report.timestamp.toLocaleDateString()}</span>
                           </div>
                           <h4 className="font-bold text-lg text-gray-800">{report.category}</h4>
                           <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                           <p className="text-xs text-gray-500 mb-4 flex items-center gap-1"><Map className="w-3 h-3" /> {report.location}, nº {report.addressNumber || 'S/N'}</p>
                           
                           {report.citizenName && (
                              <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                                 <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                                    {report.citizenPhoto ? <img src={report.citizenPhoto} className="w-full h-full object-cover"/> : null}
                                 </div>
                                 <span className="text-xs text-gray-600">Solicitado por: <strong>{report.citizenName}</strong></span>
                              </div>
                           )}

                           <div className="flex gap-2">
                              {report.status === 'pending' && (
                                 <Button variant="secondary" size="sm" onClick={() => { onUpdateStatus(report.id, 'in_progress'); addToast('Iniciado', 'info'); }}>Iniciar</Button>
                              )}
                              <Button size="sm" onClick={() => { onUpdateStatus(report.id, 'resolved'); addToast('Concluído!', 'success'); }}>Concluir</Button>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
