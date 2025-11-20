
import { Student, Team, Challenge, PKMatch, Badge, Habit, Task } from "../types";

const svg = (seed: string) => {
  const h = Array.from(seed).reduce((a,c)=>a+c.charCodeAt(0),0);
  const hue = h % 360;
  const bg = `%23e5e7eb`;
  const fg = `%23cbd5e1`;
  return `data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 fill=%22${bg}%22/><circle cx=%2232%22 cy=%2224%22 r=%2212%22 fill=%22hsl(${hue},60%25,70%25)%22/><rect x=%2216%22 y=%2240%22 width=%2232%22 height=%2216%22 rx=%228%22 fill=%22${fg}%22/></svg>`;
};

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alice', avatar: svg('Alice'), points: 125, exp: 340, level: 12, className: '三年二班', habitStats: { 'h1': 12, 'h2': 5 } },
  { id: '2', name: 'Ben', avatar: svg('Ben'), points: 110, exp: 200, level: 10, className: '三年二班', habitStats: { 'h1': 8, 'h3': 15 } },
  { id: '3', name: 'Chloe', avatar: svg('Chloe'), points: 130, exp: 410, level: 13, className: '三年二班', habitStats: { 'h2': 20 } },
  { id: '4', name: 'David', avatar: svg('David'), points: 98, exp: 150, level: 8, className: '三年二班' },
  { id: '5', name: 'Emily', avatar: svg('Emily'), points: 150, exp: 600, level: 15, className: '三年二班' },
  { id: '6', name: 'Frank', avatar: svg('Frank'), points: 122, exp: 300, level: 11, className: '三年二班' },
  { id: '7', name: 'Grace', avatar: svg('Grace'), points: 115, exp: 280, level: 11, className: '三年二班' },
  { id: '8', name: 'Henry', avatar: svg('Henry'), points: 108, exp: 220, level: 9, className: '三年二班' },
  { id: '9', name: 'Ivy', avatar: svg('Ivy'), points: 142, exp: 520, level: 14, className: '三年二班' },
  { id: '10', name: 'Jack', avatar: svg('Jack'), points: 135, exp: 450, level: 13, className: '三年二班' },
  { id: '11', name: 'Kate', avatar: svg('Kate'), points: 95, exp: 120, level: 7, className: '三年二班' },
  { id: '12', name: 'Liam', avatar: svg('Liam'), points: 160, exp: 700, level: 16, className: '三年二班' },
];

export const MOCK_TEAMS: Team[] = [
  { id: 't1', name: '火箭队' },
  { id: 't2', name: '雄鹰队' },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', title: '每日口语评测', desc: '完成每日英语跟读打卡', status: 'completed', result: 'success', participants: ['1', '2'], rewardPoints: 5, date: new Date().toISOString() },
  { id: 'c2', title: '班级训练营', desc: '连续一周保持桌面整洁', status: 'active', participants: ['1', '3', '4', '5'], rewardPoints: 10, date: new Date().toISOString() },
  { id: 'c3', title: '上周阅读挑战', desc: '阅读两本书', status: 'completed', result: 'fail', participants: ['1'], rewardPoints: 20, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

export const MOCK_TASKS: Task[] = [
  { id: 'tk1', title: '暑期社会实践', desc: '参观博物馆并记录', expValue: 50, createdAt: new Date().toISOString() },
  { id: 'tk2', title: '科技小制作', desc: '制作一个简单的机械装置', expValue: 100, createdAt: new Date().toISOString() },
];

export const MOCK_PK: PKMatch[] = [
  { id: 'pk1', studentA: '1', studentB: '2', topic: '背诵古诗《静夜思》', status: 'pending' },
  { id: 'pk2', studentA: '5', studentB: '6', topic: '速算比赛', status: 'pending' },
  { id: 'pk3', studentA: '1', studentB: '3', topic: '单词拼写', status: 'finished', winnerId: '1' },
  { id: 'pk4', studentA: '1', studentB: '4', topic: '跳绳比赛', status: 'finished', winnerId: '4' },
];

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: '学霸之星', icon: '⭐', description: '本周学习表现最突出' },
  { id: 'b2', name: '挑战先锋', icon: '🛡️', description: '完成挑战最多的同学' },
  { id: 'b3', name: '阅读达人', icon: '📖', description: '阅读书籍超过5本' },
  { id: 'b4', name: '全勤奖', icon: '🏃', description: '本月无缺席' },
  { id: 'b5', name: '小画家', icon: '🎨', description: '美术课表现优异' },
  { id: 'b6', name: '小小科学家', icon: '💡', description: '科学实验动手能力强' },
];

export const MOCK_HABITS: Habit[] = [
  { id: 'h1', name: '早起', icon: '🌞' },
  { id: 'h2', name: '阅读', icon: '📖' },
  { id: 'h3', name: '运动', icon: '🏃' },
  { id: 'h4', name: '思考', icon: '💡' },
  { id: 'h5', name: '卫生', icon: '🧹' },
  { id: 'h6', name: '助人', icon: '🤝' },
  { id: 'h7', name: '作业', icon: '📝' },
  { id: 'h8', name: '整理', icon: '🧺' },
  { id: 'h9', name: '礼仪', icon: '🙏' },
  { id: 'h10', name: '守时', icon: '⏰' },
  { id: 'h11', name: '专注', icon: '🎯' },
  { id: 'h12', name: '饮水', icon: '💧' },
  { id: 'h13', name: '午休', icon: '😴' },
  { id: 'h14', name: '阅读笔记', icon: '📚' },
  { id: 'h15', name: '口语练习', icon: '🗣️' },
  { id: 'h16', name: '体育锻炼', icon: '⚽' },
  { id: 'h17', name: '音乐练习', icon: '🎵' },
  { id: 'h18', name: '科学实验', icon: '🔬' },
];

const SURNAME_POOL = ['张','王','李','刘','陈','杨','赵','黄','周','吴','郑','马','朱','胡','郭','何','高','林','罗','宋'];
const GIVEN_POOL = ['华','磊','敏','杰','婷','云','航','悦','蕾','强','晨','帆','静','雨','亮','雪','凯','欣','娜','浩','博','宁','哲','涵','萌','佳','媛','翔','昆'];

export function randomChineseName() {
  const s = SURNAME_POOL[Math.floor(Math.random() * SURNAME_POOL.length)];
  const g1 = GIVEN_POOL[Math.floor(Math.random() * GIVEN_POOL.length)];
  const g2 = Math.random() < 0.4 ? GIVEN_POOL[Math.floor(Math.random() * GIVEN_POOL.length)] : '';
  return g2 ? s + g1 + g2 : s + g1;
}

export function randomizeStudentNames(students: Student[]) {
  return students.map(s => {
    const name = randomChineseName();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    return { ...s, name, avatar };
  });
}