
import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ShareButton } from './ShareButton';
import { analyzeReport } from '../services/geminiService';
import { Report, CitizenProfile, BroadcastMessage, Department } from '../types';
import { Camera, MapPin, Loader2, Send, CheckCircle2, User, RefreshCcw, X, Image as ImageIcon, Megaphone, Edit, Map as MapIcon, LogOut } from 'lucide-react';
import { GamificationCard } from './GamificationCard';
import { ChatWidget } from './ChatWidget';
import { MapView } from './MapView';

interface CitizenViewProps {
  onSubmitReport: (report: Omit<Report, 'id' | 'status' | 'timestamp'>) => void;
  reports: Report[];
  profile: CitizenProfile | null;
  onRegister: (profile: CitizenProfile) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  broadcasts: BroadcastMessage[];
}

export const CitizenView: React.FC<CitizenViewProps> = ({ onSubmitReport, reports, profile, onRegister, addToast, broadcasts }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // States for Confirming Route
  const [isAnalysed, setIsAnalysed] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<{category: string, priority: string, summary: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Department>('Infraestrutura');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Registration State
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(!!profile);
  const [regForm, setRegForm] = useState<Partial<CitizenProfile>>({ 
    name: '', age: '', phone: '', neighborhood: '', street: '', number: '' 
  });
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const citizenBroadcasts = broadcasts.filter(b => b.target === 'citizens' || b.target === 'all');

  // --- LOGIN WITH GOOGLE SIMULATION ---
  const handleGoogleLogin = () => {
    setIsGoogleLoggedIn(true);
    addToast('Login com Google realizado com sucesso!', 'success');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.name && regForm.neighborhood && regForm.street) {
      const newProfile: CitizenProfile = {
        id: Date.now().toString(),
        name: regForm.name!,
        age: regForm.age || '18',
        phone: regForm.phone || '',
        neighborhood: regForm.neighborhood!,
        street: regForm.street!,
        number: regForm.number || 'S/N',
        points: 0,
        level: 1,
        photoUrl: profilePhoto || undefined
      };
      onRegister(newProfile);
      addToast(`Perfil criado! Bem-vindo ao ZelaPB, ${newProfile.name}.`, 'success');
    }
  };

  const handlePreSubmitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location || !profile) return;
    setIsAnalyzing(true);
    
    // 1. Analyze with AI
    const analysis = await analyzeReport(description);
    
    setPendingAnalysis(analysis);
    setSelectedCategory(analysis.category as Department); // Suggestion
    setIsAnalyzing(false);
    setIsAnalysed(true); // Move to confirmation step
  };

  const handleFinalSubmit = () => {
    if (!pendingAnalysis || !profile) return;

    onSubmitReport({
      description,
      location,
      addressNumber: profile.number,
      category: selectedCategory, // User confirmed category
      priority: pendingAnalysis.priority as any,
      aiAnalysis: pendingAnalysis.summary,
      imageUrl: capturedImage || undefined,
      citizenName: profile.name,
      citizenPhoto: profile.photoUrl,
      contactPhone: profile.phone,
      coordinates: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 } // Simulating coords
    });

    // Reset
    setDescription('');
    setLocation('');
    setCapturedImage(null);
    setIsAnalysed(false);
    setPendingAnalysis(null);
    
    // Award Points (Gamification)
    const updatedProfile = { ...profile, points: profile.points + 50 };
    if (updatedProfile.points >= 100 && profile.level === 1) updatedProfile.level = 2;
    // (Simple logic, can be expanded)
    onRegister(updatedProfile); 

    addToast("Solicitação enviada para o setor responsável! +50 XP", "success");
  };

  // --- CAMERA LOGIC ---
  const startCamera = async (forProfile = false) => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      addToast("Erro na câmera.", "error");
      setShowCamera(false);
    }
  };

  const capturePhoto = (forProfile = false) => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        if (forProfile) setProfilePhoto(dataUrl);
        else setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setShowCamera(false);
  };

  // --- VIEW 1: LOGIN ---
  if (!isGoogleLoggedIn) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
           <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <User className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Entrar no ZelaPB</h2>
              <p className="text-gray-500 mb-8 text-sm">Faça login para gerenciar suas solicitações e acumular pontos.</p>
              
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C.79 9.81 0 12.9 0 16c0 3.1.79 6.19 2.18 8.95l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 4.63c1.61 0 3.09.56 4.23 1.64l3.18-3.18C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 <span className="font-medium text-gray-700">Continuar com Google</span>
              </button>
           </div>
        </div>
     )
  }

  // --- VIEW 2: PROFILE SETUP (First Time) ---
  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-4 pt-10">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Complete seu Perfil</h2>
            <p className="text-gray-500 text-sm">Seus dados ajudam a agilizar o atendimento.</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Photo Upload Simulation */}
            <div className="flex justify-center mb-4">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200">
                     {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-gray-400" />}
                  </div>
                  <button type="button" onClick={() => startCamera(true)} className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700">
                     <Camera className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
            {showCamera && (
               <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover" />
                 <button type="button" onClick={() => capturePhoto(true)} className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                 </button>
               </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" required className="w-full p-2 border rounded mt-1" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-medium text-gray-700">Idade</label>
                  <input type="number" className="w-full p-2 border rounded mt-1" value={regForm.age} onChange={e => setRegForm({...regForm, age: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <input type="tel" className="w-full p-2 border rounded mt-1" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} />
               </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Bairro</label>
              <input type="text" required className="w-full p-2 border rounded mt-1" value={regForm.neighborhood} onChange={e => setRegForm({...regForm, neighborhood: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Rua</label>
                  <input type="text" required className="w-full p-2 border rounded mt-1" value={regForm.street} onChange={e => setRegForm({...regForm, street: e.target.value})} />
               </div>
               <div>
                  <label className="text-sm font-medium text-gray-700">Nº</label>
                  <input type="text" required className="w-full p-2 border rounded mt-1" value={regForm.number} onChange={e => setRegForm({...regForm, number: e.target.value})} />
               </div>
            </div>
            
            <Button type="submit" fullWidth className="mt-4">Salvar e Continuar</Button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 3: MAIN DASHBOARD ---
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      <GamificationCard profile={profile} />

      {/* Official Broadcasts */}
      {citizenBroadcasts.length > 0 && (
         <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sky-900 flex items-center mb-2 text-sm">
               <Megaphone className="w-4 h-4 mr-2 text-sky-600" />
               Avisos da Prefeitura
            </h3>
            {citizenBroadcasts.slice().reverse().map(bc => (
               <div key={bc.id} className="bg-white p-3 rounded-xl border border-sky-100 text-sm mb-2 last:mb-0">
                  <span className="font-bold text-gray-800 block">{bc.title}</span>
                  <span className="text-gray-600">{bc.message}</span>
               </div>
            ))}
         </div>
      )}
      
      {/* Map View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
         <MapView reports={reports} />
      </div>

      {/* NEW REPORT FORM */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Send className="text-emerald-600 w-5 h-5" />
          Abrir Nova Solicitação
        </h2>
        
        {!isAnalysed ? (
          <form onSubmit={handlePreSubmitAnalysis} className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema (Ex: Cano estourado na rua da minha casa...)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
              required
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Endereço do problema"
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                required
              />
              <button 
                type="button"
                onClick={() => setLocation(`${profile.street}, ${profile.number} - ${profile.neighborhood}`)}
                className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                title="Usar meu endereço"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* Evidence Photo */}
            {!showCamera && !capturedImage && (
              <button 
                type="button"
                onClick={() => startCamera(false)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-emerald-600 font-medium hover:bg-emerald-50 flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" /> Adicionar Foto (Evidência)
              </button>
            )}

            {showCamera && (
               <div className="relative bg-black rounded-lg overflow-hidden h-48">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 <button type="button" onClick={() => capturePhoto(false)} className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-white rounded-full">
                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                 </button>
                 <button type="button" onClick={stopCamera} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full"><X className="w-4 h-4"/></button>
               </div>
            )}

            {capturedImage && (
               <div className="relative h-48 rounded-lg overflow-hidden">
                  <img src={capturedImage} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setCapturedImage(null)} className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded shadow"><X className="w-4 h-4"/></button>
               </div>
            )}

            <Button type="submit" fullWidth disabled={isAnalyzing}>
               {isAnalyzing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analisando Setor...</> : 'Continuar'}
            </Button>
          </form>
        ) : (
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-fade-in">
             <h3 className="font-bold text-emerald-800 mb-2">Confirme o Destino</h3>
             <p className="text-sm text-emerald-700 mb-4">
                A IA identificou que este problema pertence ao setor de <strong>{pendingAnalysis?.category}</strong>. Está correto?
             </p>
             
             <div className="mb-4">
                <label className="text-xs font-bold uppercase text-emerald-600 mb-1 block">Setor Responsável (Secretaria)</label>
                <select 
                  className="w-full p-2 rounded border border-emerald-300 bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Department)}
                >
                   <option value="Limpeza Urbana">Limpeza Urbana (Lixo, Varrição)</option>
                   <option value="Infraestrutura">Infraestrutura (Buracos, Calçadas, Obras)</option>
                   <option value="Iluminação">Iluminação Pública (Postes, Lâmpadas)</option>
                   <option value="Saneamento">Saneamento (Água, Esgoto - SAAE)</option>
                </select>
             </div>
             
             <div className="flex gap-2">
                <Button variant="outline" fullWidth onClick={() => setIsAnalysed(false)} className="bg-white">Voltar</Button>
                <Button fullWidth onClick={handleFinalSubmit}>Confirmar e Enviar</Button>
             </div>
          </div>
        )}
      </div>

      {/* RECENT REPORTS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Minhas Solicitações</h3>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-gray-400 text-center text-sm">Nenhuma solicitação feita.</p>
          ) : (
            reports.slice().reverse().map(report => (
              <div key={report.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className={`w-2 h-full absolute left-0 top-0 rounded-l-lg ${
                   report.status === 'resolved' ? 'bg-green-500' : report.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                }`}></div>
                
                {report.imageUrl ? (
                   <img src={report.imageUrl} className="w-12 h-12 rounded object-cover bg-gray-200" />
                 ) : (
                   <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400" /></div>
                 )}
                
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{report.category}</h4>
                      <span className="text-xs text-gray-500">{report.timestamp.toLocaleDateString()}</span>
                   </div>
                   <p className="text-xs text-gray-600 truncate">{report.description}</p>
                   <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                      <MapPin className="w-3 h-3" /> {report.location}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};
