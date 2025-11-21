import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Student, Team, calculateLevel } from '../types';
import CrownIcon from './icons/CrownIcon';

interface StudentLeaderboardProps {
  students: Student[];
  teamsMap: Map<string, Team>;
  onAvatarChange: (studentId: string, newAvatarUrl: string) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
);

const AvatarUploader: React.FC<{ student: Student; onAvatarChange: StudentLeaderboardProps['onAvatarChange']; className?: string }> = ({ student, onAvatarChange, className }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1024KB limit
            alert("图片大小不能超过 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                onAvatarChange(student.id, result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`relative group flex-shrink-0 ${className}`} onClick={() => fileInputRef.current?.click()}>
            <img
                src={student.avatar_url}
                alt={student.name}
                className="w-full h-full rounded-full object-cover group-hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <UploadIcon />
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
        </div>
    );
};


const ChampionCard: React.FC<{ student: Student; team?: Team; onAvatarChange: StudentLeaderboardProps['onAvatarChange'] }> = ({ student, team, onAvatarChange }) => {
    const { level } = calculateLevel(student.total_exp);
    return (
        <div className="p-3 rounded-xl mb-2 bg-gradient-to-br from-yellow-800/30 via-slate-800/20 to-slate-800/20 border-2 border-yellow-400/80">
            <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <AvatarUploader student={student} onAvatarChange={onAvatarChange} className="w-16 h-16 border-4 border-yellow-400 shadow-lg rounded-full"/>
                    <CrownIcon className="w-8 h-8 text-yellow-300 absolute -top-3 right-0 transform rotate-12 z-20" />
                </div>
                <div className="flex-grow relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white relative z-10">{student.name}</h3>
                    <p className={`text-base font-semibold ${team?.textColor ?? 'text-gray-400'} relative z-10`}>
                        {team?.name ?? '无战队'}
                    </p>
                    <span className="absolute right-0 -bottom-4 text-7xl font-black text-white opacity-10 select-none z-0 transform">
                        NO.1
                    </span>
                </div>
                 <div className="flex-shrink-0 bg-slate-900/40 rounded-lg px-4 py-1.5 flex items-center gap-4">
                     <div className="text-center">
                         <div className="font-bold text-2xl text-blue-400">
                            {level}
                        </div>
                        <div className="text-xs text-slate-400">等级</div>
                    </div>
                    <div className="w-px h-10 bg-slate-700"></div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-yellow-300 tracking-wider">
                            {student.total_exp.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">经验</div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const StudentLeaderboard: React.FC<StudentLeaderboardProps> = ({ students, teamsMap, onAvatarChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const runnersUpContainerRef = useRef<HTMLDivElement>(null);
  const champion = students[0];
  const runnersUp = students.slice(1);
  const championTeam = champion ? teamsMap.get(champion.team_id) : undefined;

  // Effect to dynamically calculate items per page based on container size
  useEffect(() => {
    const container = runnersUpContainerRef.current;
    if (!container || runnersUp.length === 0) return;

    const observer = new ResizeObserver(() => {
        const containerHeight = container.clientHeight;
        const sampleItem = container.querySelector('li');
        if (!sampleItem) return;

        const gridGap = 8; // Corresponds to `gap-2` in Tailwind
        const itemHeight = sampleItem.offsetHeight + gridGap;
        if (itemHeight <= 0) return;

        const isTwoColumns = window.innerWidth >= 768; // `md` breakpoint
        const columns = isTwoColumns ? 2 : 1;
        
        // Calculate how many rows can fit, ensuring at least 1 row.
        const rows = Math.max(1, Math.floor(containerHeight / itemHeight));
        const newItemsPerPage = rows * columns;
        
        setItemsPerPage(current => {
          if (newItemsPerPage > 0 && newItemsPerPage !== current) {
            // For two columns, it's better to have an even number of items
            return isTwoColumns ? Math.floor(newItemsPerPage / 2) * 2 : newItemsPerPage;
          }
          return current;
        });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [runnersUp.length]);

  const pages = useMemo(() => {
    const result = [];
    if (itemsPerPage > 0) {
      for (let i = 0; i < runnersUp.length; i += itemsPerPage) {
          result.push(runnersUp.slice(i, i + itemsPerPage));
      }
    }
    return result.length > 0 ? result : [[]];
  }, [runnersUp, itemsPerPage]);

  const totalPages = pages.length;

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000); // Change page every 5 seconds
    return () => clearInterval(timer);
  }, [totalPages]);

  if (students.length === 0 || !champion) {
    return <div className="text-center p-8 text-slate-500">暂无学生数据</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ChampionCard student={champion} team={championTeam} onAvatarChange={onAvatarChange} />
      
      <div className="h-px bg-slate-700 my-2"></div>

      <div className="flex-grow overflow-hidden relative" ref={runnersUpContainerRef}>
        <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <ul key={pageIndex} className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full flex-shrink-0 h-full content-start">
              {page.map((student, studentIndexInPage) => {
                const team = teamsMap.get(student.team_id);
                const rank = pageIndex * itemsPerPage + studentIndexInPage + 2;
                const { level, progress } = calculateLevel(student.total_exp);

                return (
                  <li
                    key={student.id}
                    className="flex flex-col p-2 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-center w-full">
                        <span className="text-3xl font-bold italic w-12 text-yellow-400 text-center">{rank}</span>
                        <AvatarUploader student={student} onAvatarChange={onAvatarChange} className="w-8 h-8 rounded-full mr-2 border border-slate-600"/>

                        <div className="flex-grow overflow-hidden">
                            <div className="font-semibold text-white truncate text-sm">{student.name}</div>
                            <div className="flex gap-x-2">
                                <div className="text-xs text-slate-300">
                                    {student.total_exp.toLocaleString()} 经验
                                </div>
                                <div className="text-xs text-slate-500">
                                    {student.total_points.toLocaleString()} 积分
                                </div>
                            </div>
                        </div>
                        <div className="text-right ml-2">
                            <div className="font-bold text-sm text-blue-400">
                                等级 {level}
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-1.5">
                        <div className="bg-cyan-400 h-1 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentLeaderboard;
