
import React from 'react';

interface LeaderboardCardProps {
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ title, children, rightSlot }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg h-full flex flex-col">
      <div className="grid grid-cols-3 items-center px-3 py-3 border-b border-slate-700/50 flex-shrink-0">
        <div></div>
        <div className="text-xl font-bold text-center">
          {title}
        </div>
        <div className="justify-self-end">{rightSlot}</div>
      </div>
      <div className="p-2 sm:p-3 overflow-y-auto flex-grow min-h-0">
        {children}
      </div>
    </div>
  );
};

export default LeaderboardCard;