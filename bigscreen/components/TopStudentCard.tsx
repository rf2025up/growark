import React from 'react';
import { Student, Team } from '../types';
import CrownIcon from './icons/CrownIcon';

interface TopStudentCardProps {
  student: Student;
  team?: Team;
}

const TopStudentCard: React.FC<TopStudentCardProps> = ({ student, team }) => {
  return (
    <div className="bg-gradient-to-br from-yellow-900/40 via-slate-800/50 to-slate-800/50 backdrop-blur-sm border border-yellow-400/60 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center h-full">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">积分冠军</h2>
      <div className="relative">
        <img 
          src={student.avatar_url} 
          alt={student.name} 
          className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg" 
        />
        <CrownIcon className="w-10 h-10 text-yellow-300 absolute -top-4 -right-4 transform rotate-12" />
      </div>
      <h3 className="mt-4 text-3xl font-bold text-white">{student.name}</h3>
      <p className={`text-lg font-semibold ${team?.textColor ?? 'text-gray-400'}`}>
        {team?.name ?? '无战队'}
      </p>
      <div className="mt-4 bg-slate-900/50 border border-slate-700 rounded-full px-6 py-2">
        <span className="text-3xl font-black text-yellow-300 tracking-wider">
          {student.total_points.toLocaleString()}
        </span>
        <span className="ml-2 text-slate-400">积分</span>
      </div>
    </div>
  );
};

export default TopStudentCard;