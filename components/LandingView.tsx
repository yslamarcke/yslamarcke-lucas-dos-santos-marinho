
import React from 'react';
import { AUTHOR, YEAR } from '../constants';
import { SystemConfig } from '../types';
import { Button } from './Button';
import { ShareButton } from './ShareButton';
import { CheckCircle, Users, Building, Mountain, Trees, Sprout, ShieldCheck } from 'lucide-react';

interface LandingViewProps {
  onEnterApp: (role: 'citizen' | 'team' | 'government' | 'admin') => void;
  config: SystemConfig;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, config }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center relative">
        
        {/* Strategic Share Button - Absolute Top Right */}
        <div className="absolute top-4 right-4">
           <ShareButton 
             variant="outline" 
             label="Espalhar a ideia"
             title={config.appName}
             text={`Conheça o ${config.appName}: ${config.appSlogan}. Baixe agora e ajude a cuidar da nossa cidade!`}
             className="border-emerald-200 text-emerald-700 bg-white/80 backdrop-blur-sm"
           />
        </div>

        {/* Logo Icon */}
        <div className="mb-6 p-6 bg-white rounded-full shadow-xl ring-8 ring-green-100 flex items-center justify-center relative overflow-hidden animate-bounce-slow">
          <Mountain className="w-20 h-20 text-emerald-700 relative z-10" />
          <Trees className="w-12 h-12 text-green-500 absolute bottom-4 right-4 opacity-80 z-20" />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          {config.appName}
        </h1>
        <p className="text-xl md:text-2xl text-emerald-800 max-w-2xl font-light italic mb-8">
          "{config.appSlogan}"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
          {/* Card Cidadão */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-emerald-500 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('citizen')}>
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
               <Users className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Sou Cidadão</h3>
            <p className="text-sm text-gray-600">Viu algo errado na rua? Tire uma foto e mande pra gente.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">Acessar</Button>
          </div>
          
          {/* Card Equipe */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-amber-600 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('team')}>
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
               <CheckCircle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Sou da Equipe</h3>
            <p className="text-sm text-gray-600">Receba suas tarefas e cuide da nossa cidade.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full border-amber-200 text-amber-700 hover:bg-amber-50">Entrar</Button>
          </div>
          
          {/* Card Prefeitura */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-b-4 border-gray-600 cursor-pointer group transform hover:-translate-y-1 duration-200" onClick={() => onEnterApp('government')}>
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
               <Building className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Prefeitura</h3>
            <p className="text-sm text-gray-600">Gestão completa e monitoramento em tempo real.</p>
            <Button variant="outline" size="sm" className="mt-4 w-full hover:bg-gray-100 text-gray-800">Painel Gestor</Button>
          </div>
        </div>

        {/* Feature Highlights (Rural/Nature Theme) */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Mountain className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Do Interior à Capital</h4>
                 <p className="text-sm text-gray-600">Feito para atender a realidade das nossas serras e cidades.</p>
              </div>
           </div>
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Sprout className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Cidade Limpa e Verde</h4>
                 <p className="text-sm text-gray-600">Tecnologia ajudando a preservar nosso ambiente.</p>
              </div>
           </div>
           <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-emerald-700">
                 <Users className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="font-bold text-gray-900">Comunidade Unida</h4>
                 <p className="text-sm text-gray-600">O povo colaborando com a gestão pública.</p>
              </div>
           </div>
        </div>
      </div>

      <footer className="py-6 text-center text-emerald-800/60 text-sm border-t border-emerald-100 bg-white/30 backdrop-blur-sm">
        <p>Criado por: {AUTHOR}</p>
        <p>Ano: {YEAR} • Paraíba, Brasil • Versão {config.version}</p>
        <button 
           onClick={() => onEnterApp('admin')}
           className="mt-4 text-xs font-semibold text-emerald-800/40 hover:text-amber-600 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
           <ShieldCheck className="w-3 h-3" /> Área do Desenvolvedor
        </button>
      </footer>
    </div>
  );
};
