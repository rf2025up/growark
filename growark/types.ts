
export enum TabType {
  HOME = 'HOME',
  CLASS = 'CLASS',
  HABIT = 'HABIT',
  SETTINGS = 'SETTINGS'
}

export enum ScoreCategory {
  ONE = 'I. 学习成果与高价值奖励',
  TWO = 'II. 自主管理与习惯养成 (午托篇)',
  THREE = 'III. 自主管理与学习过程 (晚辅篇)',
  FOUR = 'IV. 学习效率与时间管理',
  FIVE = 'V. 质量、进步与整理',
  SIX = 'VI. 纪律与惩罚细则',
  CUSTOM = '自定义类别'
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  points: number;
  exp: number;
  level: number;
  className: string;
  teamId?: string;
  habitStats?: Record<string, number>; 
  challengeHistory?: StudentChallengeRecord[];
  pkHistory?: StudentPKRecord[];
  taskHistory?: StudentTaskRecord[];
  badgeHistory?: StudentBadgeRecord[];
}

export interface Team {
  id: string;
  name: string;
  members?: string[];
}

export interface Challenge {
  id: string;
  title: string;
  desc: string;
  status: 'active' | 'completed';
  result?: 'success' | 'fail';
  participants: string[];
  rewardPoints: number;
  rewardExp?: number;
  date?: string;
}

export interface StudentChallengeRecord {
  id: string;
  title: string;
  result: 'success' | 'fail';
  points: number;
  exp?: number;
  date: string;
}

export interface StudentPKRecord {
  id: string;
  pkId: string;
  topic: string;
  opponentId: string;
  opponentName?: string;
  result: 'win' | 'lose';
  date: string;
}

export interface StudentTaskRecord {
  id: string;
  taskId: string;
  title: string;
  exp: number;
  date: string;
}

export interface StudentBadgeRecord {
  id: string;
  badgeId: string;
  name: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  desc: string;
  expValue: number;
  createdAt: string;
  assignedTo?: string[];
}

export interface PKMatch {
  id: string;
  studentA: string;
  studentB: string;
  topic: string;
  status: 'pending' | 'finished';
  winnerId?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
}

export interface PointPreset {
  id?: string;
  label: string;
  value: number;
  category: string;
}