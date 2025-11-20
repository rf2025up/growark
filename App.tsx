
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ClassManage from './pages/ClassManage';
import Habits from './pages/Habits';
import Settings from './pages/Settings';

import { MOCK_STUDENTS, MOCK_CHALLENGES, MOCK_TASKS, MOCK_PK, MOCK_BADGES, MOCK_HABITS, randomizeStudentNames, randomChineseName } from './services/mockData';
import { POINT_PRESETS as INITIAL_PRESETS } from './constants';
import { Student, Habit, PointPreset, ScoreCategory, Challenge, PKMatch, Badge, Task } from './types';

function App() {
  const cartoonAvatar = (seed: string) => {
    const s = Array.from(seed).reduce((a,c)=>a+c.charCodeAt(0),0);
    const hue = s % 360;
    const skin = `hsl(${(hue+30)%360},70%,85%)`;
    const hair = `hsl(${(hue+200)%360},60%,35%)`;
    const shirt = `hsl(${(hue+120)%360},60%,70%)`;
    const bag = `hsl(${(hue+180)%360},30%,40%)`;
    const sky1 = `hsl(${(hue+180)%360},80%,92%)`;
    const sky2 = `hsl(${(hue+180)%360},80%,85%)`;
    const grass = `hsl(${(hue+90)%360},50%,85%)`;
    const building = `#ffedd5`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stop-color='${sky1}'/>
          <stop offset='100%' stop-color='${sky2}'/>
        </linearGradient>
      </defs>
      <rect width='64' height='64' fill='url(#g)'/>
      <rect x='0' y='46' width='64' height='18' fill='${grass}'/>
      <rect x='18' y='28' width='28' height='12' fill='${building}' rx='2'/>
      <rect x='24' y='30' width='16' height='8' fill='#ffffff' rx='1'/>
      <circle cx='14' cy='40' r='5' fill='#86efac'/>
      <circle cx='50' cy='40' r='5' fill='#86efac'/>
      <circle cx='40' cy='12' r='3' fill='#ffffff' opacity='0.8'/>
      <circle cx='44' cy='14' r='2' fill='#ffffff' opacity='0.8'/>
      <circle cx='22' cy='13' r='2' fill='#ffffff' opacity='0.8'/>
      <circle cx='32' cy='24' r='12' fill='${skin}'/>
      <path d='M20 20 C24 15,40 15,44 20 L44 22 C40 18,24 18,20 22 Z' fill='${hair}'/>
      <circle cx='27' cy='24' r='2' fill='#111827'/>
      <circle cx='37' cy='24' r='2' fill='#111827'/>
      <path d='M28 30 C32 33,36 33,36 30' stroke='#111827' stroke-width='2' fill='none' stroke-linecap='round'/>
      <rect x='22' y='36' width='20' height='14' rx='7' fill='${shirt}'/>
      <path d='M24 36 L24 50' stroke='${bag}' stroke-width='2'/>
      <path d='M40 36 L40 50' stroke='${bag}' stroke-width='2'/>
    </svg>`;
    return `data:image/svg+xml;utf8,${svg.replace(/#/g,'%23')}`;
  };
  const expForLevel = (lvl: number) => Math.floor(100 * Math.pow(1.25, Math.max(0, lvl-1)));
  const calcLevelFromExp = (totalExp: number) => {
    let acc = 0;
    let lvl = 1;
    while (totalExp - acc >= expForLevel(lvl)) {
      acc += expForLevel(lvl);
      lvl += 1;
    }
    return lvl;
  };
  // Global State
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  
  // Lifted State for Class Management Features
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [pkMatches, setPkMatches] = useState<PKMatch[]>(MOCK_PK);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [classes, setClasses] = useState<string[]>(['三年一班','三年二班','三年三班']);
  const [identity, setIdentity] = useState<'teacher'|'principal'>('teacher');
  const [teacherClass, setTeacherClass] = useState<string>('三年一班');

  // Lifted Score State for Synchronization
  const [scorePresets, setScorePresets] = useState<PointPreset[]>(INITIAL_PRESETS);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});

  // Initialize Category Names
  useEffect(() => {
    const initialNames: Record<string, string> = {};
    initialNames[ScoreCategory.ONE] = '学习成果';
    initialNames[ScoreCategory.TWO] = '午托管理';
    initialNames[ScoreCategory.THREE] = '自主性';
    initialNames[ScoreCategory.FOUR] = '学习效率';
    initialNames[ScoreCategory.FIVE] = '学习质量';
    initialNames[ScoreCategory.SIX] = '违纪扣分';
    setCategoryNames(initialNames);
  }, []);

  useEffect(() => {
    const names = ['庞子玮','刘凡兮','余沁妍','吴逸桐','刘润霖','肖正楠','王彦舒','陈金锐','宋子晨','徐汇洋','黄衍恺','舒昱恺','方景怡','廖研曦','廖一凡','唐艺馨','何泽昕','陈笑妍','彭柏成','樊牧宸','曾欣媛','肖雨虹','宁可歆','廖潇然','肖浩轩','陈梓萌','彭斯晟','谭雨涵'];
    const cls = ['三年一班','三年二班','三年三班'];
    const arr: Student[] = names.map((name, i) => ({
      id: `${i+1}`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      points: 0,
      exp: 0,
      level: 1,
      className: cls[i % cls.length],
      habitStats: Object.fromEntries(MOCK_HABITS.map(h => [h.id, 0]))
    }));
    setStudents(arr);
    setPkMatches([]);
    setChallenges([]);
    setTasks([]);
  }, []);

  useEffect(() => {
    if (!teacherClass && classes.length > 0) {
      setTeacherClass(classes[0]);
    }
  }, [classes]);

  const handleUpdateScore = (ids: string[], points: number, reason: string, exp?: number) => {
    setStudents(prev => prev.map(s => {
        if (ids.includes(s.id)) {
            const newPoints = s.points + points;
            const additionalExp = exp !== undefined ? exp : (points > 0 ? Math.abs(points * 10) : 0);
            const newExp = s.exp + additionalExp;
            const newLevel = calcLevelFromExp(newExp);
            console.log(`[WS-Mock] POINTS_UPDATED: Student ${s.name} points ${points}, exp ${additionalExp}. Total: ${newPoints}`);
            return { ...s, points: newPoints, exp: newExp, level: newLevel };
        }
        return s;
    }));
  };

  const handleHabitCheckIn = (studentIds: string[], habitId: string) => {
      handleUpdateScore(studentIds, 5, '习惯打卡');
      console.log(`[WS-Mock] HABIT_CHECKIN: ${studentIds.length} students for habit ${habitId}`);
  };
  
  const handleUpdateHabits = (newHabits: Habit[]) => {
      setHabits(newHabits);
  };

  const handleUpdateScorePresets = (newPresets: PointPreset[]) => {
      setScorePresets(newPresets);
  };

  const handleUpdateCategoryNames = (newNames: Record<string, string>) => {
      setCategoryNames(newNames);
  };

  // New Handler: Add a fresh category
  const handleAddCategory = (categoryName: string) => {
      const newKey = `CAT_${Date.now()}`;
      setCategoryNames(prev => ({
          ...prev,
          [newKey]: categoryName
      }));
  };

  // New Handler: Update Challenge Status (Success/Fail)
  const handleChallengeStatus = (id: string, result: 'success' | 'fail') => {
      setChallenges(prev => prev.map(c => {
          if (c.id === id) {
              if (result === 'success' && c.status === 'active') {
                  handleUpdateScore(c.participants, c.rewardPoints, `挑战成功: ${c.title}`, c.rewardExp);
              }
              return { ...c, status: 'completed', result };
          }
          return c;
      }));
      const ch = challenges.find(c => c.id === id);
      if (ch) {
        setStudents(prev => prev.map(s => {
          if (ch.participants.includes(s.id)) {
            const rec = {
              id: ch.id,
              title: ch.title,
              result,
              points: result === 'success' ? ch.rewardPoints : 0,
              exp: result === 'success' ? ch.rewardExp : undefined,
              date: new Date().toISOString()
            };
            const bonusMin = Math.floor((ch.rewardExp || 0) * 0.10);
            const bonusMax = Math.floor((ch.rewardExp || 0) * 0.30);
            const bonus = result === 'success' ? Math.floor(Math.random() * (bonusMax - bonusMin + 1)) + bonusMin : 0;
            const newExp = s.exp + bonus;
            const newLevel = calcLevelFromExp(newExp);
            return { ...s, exp: newExp, level: newLevel, challengeHistory: [ ...(s.challengeHistory || []), rec ] };
          }
          return s;
        }));
      }
  };

  // New Handler: Update PK Winner
  const handlePKWinner = (id: string, winnerId: string) => {
      setPkMatches(prev => prev.map(pk => {
          if (pk.id === id) {
              const loserId = pk.studentA === winnerId ? pk.studentB : pk.studentA;
              handleUpdateScore([winnerId], 20, `PK获胜: ${pk.topic}`);
              handleUpdateScore([loserId], 5, `PK参与: ${pk.topic}`); // Consolation points
              return { ...pk, status: 'finished', winnerId };
          }
          return pk;
      }));

      const pk = pkMatches.find(p => p.id === id);
      if (pk) {
        const date = new Date().toISOString();
        setStudents(prev => prev.map(s => {
          if (s.id === pk.studentA || s.id === pk.studentB) {
            const opponentId = s.id === pk.studentA ? pk.studentB : pk.studentA;
            const opponentName = prev.find(x => x.id === opponentId)?.name;
            const result: 'win' | 'lose' = s.id === winnerId ? 'win' : 'lose';
            const rec = { id: `${id}-${s.id}`, pkId: id, topic: pk.topic, opponentId, opponentName, result, date };
            const need = expForLevel(s.level);
            const pkExp = Math.floor(need * 0.05);
            const newExp = s.exp + pkExp;
            const newLevel = calcLevelFromExp(newExp);
            return { ...s, exp: newExp, level: newLevel, pkHistory: [ ...(s.pkHistory || []), rec ] };
          }
          return s;
        }));
      }
  };

  const handleCompleteTask = (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const date = new Date().toISOString();
      // award exp and record history
      setStudents(prev => prev.map(s => {
          if (task.assignedTo?.includes(s.id)) {
              const newExp = s.exp + task.expValue;
              const newLevel = calcLevelFromExp(newExp);
              const rec = { id: `${id}-${s.id}`, taskId: id, title: task.title, exp: task.expValue, date };
              return { ...s, exp: newExp, level: newLevel, taskHistory: [ ...(s.taskHistory || []), rec ] };
          }
          return s;
      }));
      // remove from active tasks
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  // New Handler: Grant Badge
  const handleBadgeGrant = (badgeId: string, studentId: string) => {
      const badge = badges.find(b => b.id === badgeId);
      if (badge) {
          handleUpdateScore([studentId], 50, `获得勋章: ${badge.name}`, 200);
          const date = new Date().toISOString();
          setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
              const rec = { id: `${badgeId}-${date}`, badgeId, name: badge.name, date };
              return { ...s, badgeHistory: [ ...(s.badgeHistory || []), rec ] };
            }
            return s;
          }));
      }
  };

  // New Handler: Add Badge
  const handleAddBadge = (newBadge: Badge) => {
      setBadges(prev => [...prev, newBadge]);
  }

  return (
    <Router>
      <div className="antialiased text-gray-800 max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl overflow-hidden relative">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                students={students} 
                onUpdateScore={handleUpdateScore} 
                scorePresets={scorePresets}
                categoryNames={categoryNames}
                identity={identity}
                classes={classes}
                teacherClass={teacherClass}
              />
            } 
          />
          <Route 
            path="/class" 
            element={
              <ClassManage 
                students={students}
                challenges={challenges}
                tasks={tasks}
                pkMatches={pkMatches}
                badges={badges}
                scorePresets={scorePresets}
                categoryNames={categoryNames}
                onUpdateScorePresets={handleUpdateScorePresets}
                onUpdateCategoryNames={handleUpdateCategoryNames}
                
                onAddCategory={handleAddCategory}
                onChallengeStatus={handleChallengeStatus}
                onPKWinner={handlePKWinner}
                 onGrantBadge={handleBadgeGrant}
                 onAddBadge={handleAddBadge}
                 
                 setChallenges={setChallenges}
                 setPkMatches={setPkMatches}
                 setStudents={setStudents}
                 onCompleteTask={handleCompleteTask}
                 setTasks={setTasks}
                 setBadges={setBadges}
                 identity={identity}
                 teacherClass={teacherClass}
                 setTeacherClass={setTeacherClass}
                classes={classes}
              />
            } 
          />
          <Route 
            path="/habit" 
            element={
                <Habits 
                    habits={habits} 
                    students={students} 
                    onCheckIn={handleHabitCheckIn}
                    onUpdateHabits={handleUpdateHabits}
                    identity={identity}
                    teacherClass={teacherClass}
                />
            } 
          />
          <Route path="/settings" element={<Settings classes={classes} setClasses={setClasses} identity={identity} setIdentity={setIdentity} teacherClass={teacherClass} setTeacherClass={setTeacherClass} />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
