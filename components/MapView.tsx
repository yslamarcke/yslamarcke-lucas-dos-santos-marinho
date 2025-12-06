
import React from 'react';
import { Report } from '../types';
import { MapPin } from 'lucide-react';

interface Props {
  reports: Report[];
}

export const MapView: React.FC<Props> = ({ reports }) => {
  return (
    <div className="bg-slate-200 rounded-xl overflow-hidden h-[300px] relative shadow-inner border border-slate-300 group">
       {/* Fake Map Background */}
       <div 
         className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_of_Campina_Grande%2C_Para%C3%ADba%2C_Brazil.png')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
       ></div>
       
       {/* Grid Lines for tech feel */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow text-xs font-bold text-slate-700 z-10">
          Mapa de Solicitações em Tempo Real
       </div>

       {/* Markers */}
       {reports.map((report) => (
          <div 
             key={report.id}
             className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform z-10"
             style={{ 
               left: `${report.coordinates?.x || Math.random() * 80 + 10}%`, 
               top: `${report.coordinates?.y || Math.random() * 80 + 10}%` 
             }}
             title={`${report.category}: ${report.description}`}
          >
             <div className={`
                p-1.5 rounded-full shadow-lg border-2 border-white 
                ${report.category === 'Saneamento' ? 'bg-blue-500' : 
                  report.category === 'Iluminação' ? 'bg-yellow-500' :
                  report.category === 'Infraestrutura' ? 'bg-orange-500' : 'bg-emerald-500'}
             `}>
                <MapPin className="w-4 h-4 text-white" />
             </div>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                {report.category}
             </div>
          </div>
       ))}
    </div>
  );
};
