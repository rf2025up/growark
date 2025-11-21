import React from 'react';
import { Achievement } from '../types';
import LeaderboardCard from './LeaderboardCard';

interface HonorCardProps {
  achievements: Achievement[];
}

const HonorCard: React.FC<HonorCardProps> = ({ achievements }) => {
  return (
    <LeaderboardCard title="最近成就">
      <ul className="space-y-2 pr-2 max-h-64 overflow-y-auto">
        {achievements.length === 0 && (
            <li className="text-center text-slate-500 py-8">等待新的成就...</li>
        )}
        {achievements.map((ach) => (
          <li
            key={ach.timestamp}
            className="flex items-center space-x-3 p-2 bg-slate-800/40 rounded-md animate-fade-in"
          >
            <img 
              src={ach.studentAvatar} 
              alt={ach.studentName} 
              className={`w-9 h-9 rounded-full border-2 ${ach.teamColor}`}
            />
            <div className="flex-grow text-sm">
              <p className="font-semibold text-white">
                {ach.studentName}
              </p>
              <p className="text-slate-400">
                获得了 <span className="font-bold text-emerald-400">+{ach.pointsChange} 积分</span> & <span className="font-bold text-cyan-400">+{ach.expChange} 经验</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </LeaderboardCard>
  );
};

export default HonorCard;