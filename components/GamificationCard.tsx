
import React from 'react';
import { CitizenProfile } from '../types';
import { GAMIFICATION_LEVELS } from '../constants';
import { Trophy, Star, TrendingUp } from 'lucide-react';

interface Props {
  profile: CitizenProfile;
}

export const GamificationCard: React.FC<Props> = ({ profile }) => {
  const currentLevel = GAMIFICATION_LEVELS.find(l => l.level === profile.level) || GAMIFICATION_LEVELS[0];
  const nextLevel = GAMIFICATION_LEVELS.find(l => l.level === profile.level + 1);
  
  const progress = nextLevel 
    ? ((profile.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy className="w-32 h-32" />
       </div>
       
       <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full border-4 border-white/30 overflow-hidden bg-white">
             {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                   {profile.name.charAt(0)}
                </div>
             )}
          </div>
          <div>
             <h3 className="font-bold text-lg">{profile.name}</h3>
             <div className="flex items-center gap-2 text-emerald-100 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{currentLevel.name} (Nível {profile.level})</span>
             </div>
          </div>
       </div>

       <div className="mt-6 relative z-10">
          <div className="flex justify-between text-xs font-medium mb-1 opacity-90">
             <span>{profile.points} XP</span>
             <span>{nextLevel ? nextLevel.minPoints : 'Max'} XP</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
             <div 
               className="bg-yellow-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
               style={{ width: `${progress}%` }}
             ></div>
          </div>
          <p className="text-xs mt-2 text-center text-emerald-100">
             {nextLevel ? `Faltam ${nextLevel.minPoints - profile.points} pontos para virar ${nextLevel.name}!` : 'Você é uma lenda urbana!'}
          </p>
       </div>
    </div>
  );
};
