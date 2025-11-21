import React from 'react';
import { Challenge } from '../types';
import LeaderboardCard from './LeaderboardCard';

interface ChallengeArenaCardProps {
  challenges: Challenge[];
}

const ChallengeArenaCard: React.FC<ChallengeArenaCardProps> = ({ challenges }) => {
  const allChallenges = challenges;
  
  // Ensure we have enough items for a seamless scroll
  const displayChallenges = allChallenges.length > 0 ? [...allChallenges, ...allChallenges] : [];

  return (
    <LeaderboardCard title="挑战擂台">
      {displayChallenges.length === 0 ? (
         <div className="flex items-center justify-center h-full text-slate-500">暂无挑战</div>
      ) : (
        <div className="h-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-max animate-scroll-vertical">
            {displayChallenges.map((challenge, index) => (
              <div key={`${challenge.id}-${index}`} className="flex items-center p-2 mb-2 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                <img 
                  src={challenge.challenger.avatar} 
                  alt={challenge.challenger.name} 
                  className="w-9 h-9 rounded-full border-2 border-purple-400 mr-3 flex-shrink-0"
                />
                <div className="flex-grow overflow-hidden">
                  <h4 className="font-bold text-sm text-purple-300 truncate">{challenge.title}</h4>
                  <p className="text-xs text-slate-400 truncate">挑战者: {challenge.challenger.name}</p>
                </div>
                {challenge.status === '进行中' && (
                  <span className="text-xs font-semibold bg-purple-500/50 text-purple-200 px-2 py-0.5 rounded-full ml-2">进行中</span>
                )}
                {challenge.status === '成功' && (
                  <span className="text-xs font-semibold bg-emerald-500/80 text-white px-2 py-0.5 rounded-full ml-2">成功</span>
                )}
                {challenge.status === '失败' && (
                  <span className="text-xs font-semibold bg-red-500/80 text-white px-2 py-0.5 rounded-full ml-2">失败</span>
                )}
              </div>
            ))}
          </div>
          
          <style>{`
            @keyframes scroll-vertical {
              from { transform: translateY(0); }
              to { transform: translateY(-50%); }
            }
            .animate-scroll-vertical {
              /* Adjust duration based on content height */
              animation: scroll-vertical ${allChallenges.length * 5}s linear infinite;
            }
          `}</style>
        </div>
      )}
    </LeaderboardCard>
  );
};

export default ChallengeArenaCard;