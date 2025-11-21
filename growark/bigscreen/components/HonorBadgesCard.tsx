import React, { useMemo } from 'react';
import { Student, Badge } from '../types';

interface HonorBadgesCardProps {
  students: Student[];
}

const BadgeDisplayCard: React.FC<{ student: Student, badge: Badge }> = ({ student, badge }) => {
    const fmt = (s?: string) => {
        if (!s) return ''
        const d = new Date(s)
        const y = d.getFullYear()
        const m = `${d.getMonth()+1}`.padStart(2,'0')
        const dd = `${d.getDate()}`.padStart(2,'0')
        return `${y}-${m}-${dd}`
    }
    return (
        <div className="relative w-72 h-48 flex-shrink-0 bg-slate-800/60 backdrop-blur-md border border-yellow-500/30 rounded-lg shadow-md p-4 flex flex-col justify-between text-white mx-4 overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <span className="text-8xl font-black text-slate-500 opacity-30 transform -rotate-12 blur-sm">
                    {badge.name}
                </span>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-start gap-4">
                    <img src={badge.image} alt={badge.name} className="w-20 h-20 rounded-full border-2 border-yellow-400 object-cover"/>
                    <div className="flex-1 text-right">
                        <h3 className="text-lg font-bold">{student.name}</h3>
                        <p className="text-md font-semibold text-yellow-300">{badge.name}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-slate-300 italic line-clamp-2">"{badge.description}"</p>
                    <div className="border-t border-slate-700 mt-2 pt-2 text-xs text-slate-400 text-right">
                        加冕于: {fmt(badge.awardedDate)}
                    </div>
                </div>
            </div>
        </div>
    );
};


const HonorBadgesCard: React.FC<HonorBadgesCardProps> = ({ students }) => {
  const studentsWithBadges = useMemo(() => {
    return students
      .filter(s => s.badges && s.badges.length > 0)
      .flatMap(student => 
        student.badges.map(badge => ({
          student,
          badge,
          // Unique key for each awarded badge
          key: `${student.id}-${badge.id}` 
        }))
      );
  }, [students]);

  if (studentsWithBadges.length === 0) {
    return null; // Don't render anything if no one has badges
  }

  // Duplicate the array for a seamless loop
  const duplicatedBadges = [...studentsWithBadges, ...studentsWithBadges];

  return (
    <div className="relative w-full overflow-hidden group h-52 -mb-2 pt-2 border-t-2 border-yellow-400/50 shadow-[0_-5px_25px_-5px_rgba(250,204,21,0.3)]">
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
      
        <div className="flex absolute top-4 left-0 w-max animate-scroll group-hover:pause">
            {duplicatedBadges.map(({ student, badge, key }, index) => (
                <BadgeDisplayCard key={`${key}-${index}`} student={student} badge={badge} />
            ))}
        </div>

        <style>{`
            @keyframes scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            .animate-scroll {
                animation: scroll 50s linear infinite;
            }
            .pause {
                animation-play-state: paused;
            }
        `}</style>
    </div>
  );
};

export default HonorBadgesCard;
