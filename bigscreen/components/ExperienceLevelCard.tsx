import React, { useMemo } from 'react';
import { Student } from '../types';
import LeaderboardCard from './LeaderboardCard';
import { calculateLevel } from '../types';

interface ExperienceLevelCardProps {
  students: Student[];
}

const ExperienceLevelCard: React.FC<ExperienceLevelCardProps> = ({ students }) => {
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => b.total_exp - a.total_exp);
  }, [students]);

  return (
    <LeaderboardCard title="经验与等级">
      <ol className="space-y-2 text-sm pr-2 h-full overflow-y-auto">
        {sortedStudents.map((student, index) => {
          const { level, progress } = calculateLevel(student.total_exp);
          return (
            <li key={student.id} className="flex items-center space-x-3 p-2 bg-slate-800/40 rounded-md">
              <span className="font-bold w-6 text-center text-slate-400">{index + 1}</span>
              <img src={student.avatar_url} alt={student.name} className="w-8 h-8 rounded-full border border-slate-600" />
              <div className="flex-grow">
                <div className="font-semibold text-white truncate">{student.name}</div>
                <div className="flex items-center mt-1">
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
              </div>
              <div className="text-right w-20">
                <div className="font-bold text-cyan-300">等级 {level}</div>
                <div className="text-xs text-slate-400">{student.total_exp.toLocaleString()} 经验</div>
              </div>
            </li>
          );
        })}
      </ol>
    </LeaderboardCard>
  );
};

export default ExperienceLevelCard;
