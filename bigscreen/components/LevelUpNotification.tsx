import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Student, Team } from '../types';

interface LevelUpNotificationProps {
  student: Student;
  team?: Team;
  newLevel: number;
  onComplete: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-4" style={style}></div>
);

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ student, team, newLevel, onComplete }) => {
  const [animationState, setAnimationState] = useState('entering');

  // Refs to handle closing logic and prevent stale closures/multiple calls
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const isClosingRef = useRef(false);

  const triggerClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    setAnimationState('exiting');
    
    // Call onComplete after the exit animation finishes
    setTimeout(() => {
      onCompleteRef.current();
    }, 500); // This duration should match the exit animation duration
  }, []);


  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setAnimationState('visible');
    }, 100);

    // Automatically trigger the close animation after a delay
    const autoCloseTimer = setTimeout(triggerClose, 4500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [triggerClose]);

  const confetti = Array.from({ length: 50 }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
      transform: `rotate(${Math.random() * 360}deg)`,
      backgroundColor: ['#fde047', '#f97316', '#22c55e', '#3b82f6', '#a855f7'][i % 5],
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <>
      <div 
        onClick={triggerClose}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 cursor-pointer ${animationState === 'entering' || animationState === 'exiting' ? 'opacity-0' : 'opacity-100'}`}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-hidden">
        {/* Confetti container */}
        <div className="absolute inset-0 z-0">{confetti}</div>
        
        {/* Main Card */}
        <div 
          className={`relative p-6 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-cyan-400 shadow-2xl shadow-cyan-500/30 w-full max-w-md text-center transform transition-all duration-500 ease-out
            ${animationState === 'entering' ? 'scale-50 opacity-0 -translate-y-10' : ''}
            ${animationState === 'exiting' ? 'scale-95 opacity-0 translate-y-10' : ''}
            ${animationState === 'visible' ? 'scale-100 opacity-100 translate-y-0' : ''}
          `}
        >
           <div className="absolute -top-px -left-px -right-px -bottom-px rounded-2xl animate-pulse-border bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.3),rgba(255,255,255,0))] pointer-events-none"></div>

          <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            恭喜升级!
          </h2>
          
          <img
            src={student.avatar_url}
            alt={student.name}
            className="w-28 h-28 rounded-full object-cover mx-auto my-4 border-4 border-cyan-400 shadow-lg"
          />

          <h3 className="text-3xl font-bold text-white">{student.name}</h3>
          <p className={`text-lg font-semibold ${team?.textColor ?? 'text-gray-400'}`}>
            {team?.name ?? '无战队'}
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xl text-slate-400">等级</span>
            <span className="text-6xl font-black text-cyan-300 animate-level-thump">
              {newLevel}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-border {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        .animate-pulse-border {
            animation: pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes level-thump {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }
        .animate-level-thump {
            animation: level-thump 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default LevelUpNotification;
