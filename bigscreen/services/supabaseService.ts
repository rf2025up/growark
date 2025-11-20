import { Student, Team, Challenge, Badge } from '../types';
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseEnabled = !!supabase;

let localTeams: Team[] = [
  { id: 1, name: '新星前锋', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
  { id: 2, name: '旋涡毒蛇', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { id: 3, name: '猩红守卫', color: 'bg-red-500', textColor: 'text-red-400' },
  { id: 4, name: '翡翠哨兵', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
];

let localStudents: Student[] = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  name: `学生${index + 1}`,
  team_id: localTeams[(index % localTeams.length)].id,
  total_exp: Math.floor(Math.random() * 500) + 50,
  total_points: Math.floor(Math.random() * 100) + 10,
  avatar_url: `https://i.pravatar.cc/100?u=${index + 1}`,
  badges: [],
}));

let localBadges: Badge[] = [];

let localChallenges: Challenge[] = [
  { id: 1, title: '一周阅读挑战', description: '完成5本指定书籍的阅读笔记', challenger: { name: '芬利', avatar: `https://i.pravatar.cc/100?u=5` }, status: '进行中' },
  { id: 2, title: '编程马拉松', description: '在48小时内完成一个小型应用原型', challenger: { name: '摩根', avatar: `https://i.pravatar.cc/100?u=9` }, status: '进行中' },
  { id: 3, title: '艺术创想家', description: '创作一幅以“未来”为主题的数字画作', challenger: { name: '斯凯勒', avatar: `https://i.pravatar.cc/100?u=14` }, status: '进行中' },
  { id: 4, title: '数学难题攻克', description: '解决研究院发布的3道超高难度数学题', challenger: { name: '亚历克斯', avatar: `https://i.pravatar.cc/100?u=1` }, status: '进行中' },
  { id: 5, title: '历史研究报告', description: '撰写一份关于特定历史时期的深度研究报告', challenger: { name: '罗文', avatar: `https://i.pravatar.cc/100?u=13` }, status: '已完成' },
];

const teamUuidToNum = new Map<string, number>();
let nextTeamNumId = 1;
const getTeamNumId = (uuid?: string | null) => {
  if (!uuid) return 0;
  const existing = teamUuidToNum.get(uuid);
  if (existing) return existing;
  const id = nextTeamNumId++;
  teamUuidToNum.set(uuid, id);
  return id;
};

const mapTeam = (row: any): Team => ({
  id: getTeamNumId(row.id),
  name: row.name,
  color: row.color ?? 'bg-cyan-500',
  textColor: row.text_color ?? 'text-cyan-400',
});

const studentUuidToNum = new Map<string, number>();
let nextStudentNumId = 1;
const getStudentNumId = (uuid?: string | null) => {
  if (!uuid) return nextStudentNumId++;
  const existing = studentUuidToNum.get(uuid);
  if (existing) return existing;
  const id = nextStudentNumId++;
  studentUuidToNum.set(uuid, id);
  return id;
};

const mapStudent = (row: any): Student => ({
  id: getStudentNumId(row.id),
  name: row.name,
  team_id: getTeamNumId(row.team_id),
  total_exp: row.experience ?? row.total_exp ?? 0,
  total_points: row.points ?? row.total_points ?? 0,
  avatar_url: row.avatar_url ?? '',
});

const mapBadge = (row: any): Badge => ({
  id: row.id,
  name: row.name,
  description: row.description,
  image: row.image,
  icon: row.icon,
  awardedDate: row.awarded_date ?? row.awarded_at ?? '',
});

const mapChallenge = (row: any): Challenge => ({
  id: row.id,
  title: row.title,
  description: row.description,
  challenger: { name: row.challenger_name, avatar: row.challenger_avatar },
  status: row.status,
});

const fetchTeams = async (): Promise<Team[]> => {
  if (!supabase) return localTeams;
  const { data, error } = await supabase
    .from('teams')
    .select('id,name,color,text_color');
  if (error || !data) return localTeams;
  return data.map(mapTeam);
};

const fetchStudents = async (): Promise<Student[]> => {
  if (!supabase) return localStudents;
  const { data, error } = await supabase
    .from('students')
    .select('id,name,avatar_url,experience,points,team_id');
  if (error || !data) return localStudents;
  return data.map(mapStudent);
};

const fetchStudentBadges = async (): Promise<Record<number, Badge[]>> => {
  if (!supabase) return {};
  const [awardedRes, badgesRes] = await Promise.all([
    supabase.from('awarded_badges').select('student_id,badge_id,awarded_date,awarded_at'),
    supabase.from('badges').select('id,name,description,image_url,icon,created_at'),
  ]);
  if (awardedRes.error || badgesRes.error || !awardedRes.data || !badgesRes.data) return {};
  const badgeMap = new Map<string, any>();
  badgesRes.data.forEach((b: any) => badgeMap.set(b.id, b));
  const result: Record<number, Badge[]> = {};
  awardedRes.data.forEach((row: any) => {
    const sid = getStudentNumId(row.student_id);
    const bRow = badgeMap.get(row.badge_id);
    if (!bRow) return;
    const badge = mapBadge({ ...bRow, awarded_date: row.awarded_date, awarded_at: row.awarded_at });
    const list = result[sid] || [];
    list.push(badge);
    result[sid] = list;
  });
  return result;
};

const fetchChallenges = async (): Promise<Challenge[]> => {
  if (!supabase) return localChallenges;
  const { data, error } = await supabase
    .from('challenges')
    .select('id,title,description,status,challenger_id');
  if (error || !data) return localChallenges;
  const students = await fetchStudents();
  const sMap = new Map<number, Student>(students.map(s => [s.id, s]));
  return data.map((row: any) => {
    const challenger = sMap.get(getStudentNumId(row.challenger_id));
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      challenger: { name: challenger?.name ?? '', avatar: challenger?.avatar_url ?? '' },
    } as Challenge;
  });
};

export const getInitialData = async (): Promise<{ students: Student[]; teams: Team[] }> => {
  const [teams, students] = await Promise.all([fetchTeams(), fetchStudents()]);
  const baseStudents = students && students.length > 0 ? students : localStudents;
  if (supabase) {
    const badgeMap = await fetchStudentBadges();
    const withBadges = baseStudents.map(s => ({ ...s, badges: badgeMap[s.id] || [] }));
    return { students: withBadges, teams: teams && teams.length > 0 ? teams : localTeams };
  }
  return { students: baseStudents, teams: teams && teams.length > 0 ? teams : localTeams };
};

export const getChallenges = async (): Promise<Challenge[]> => {
  return await fetchChallenges();
};

interface SubscriptionPayload {
  updatedStudents: Student[];
}

export const subscribeToStudentChanges = (callback: (payload: SubscriptionPayload) => void): (() => void) => {
  if (!supabase) {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * localStudents.length);
      const expChange = Math.floor(Math.random() * 15) + 5;
      const pointsChange = Math.floor(Math.random() * 4) + 1;
      localStudents = localStudents.map((s, i) => i === randomIndex ? { ...s, total_exp: s.total_exp + expChange, total_points: s.total_points + pointsChange } : s);
      callback({ updatedStudents: [...localStudents] });
    }, 2000);
    return () => clearInterval(intervalId);
  }

  const channel = supabase.channel('students_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, async () => {
      const updated = await fetchStudents();
      const badgeMap = await fetchStudentBadges();
      const withBadges = updated.map(s => ({ ...s, badges: badgeMap[s.id] || [] }));
      callback({ updatedStudents: withBadges });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToChallengeChanges = (callback: (updated: Challenge[]) => void): (() => void) => {
  if (!supabase) return () => {};
  const channel = supabase.channel('challenges_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, async () => {
      const updated = await fetchChallenges();
      callback(updated);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const subscribeToBadgeAwards = (callback: (updatedStudents: Student[]) => void): (() => void) => {
  if (!supabase) return () => {};
  const channel = supabase.channel('awarded_badges_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'awarded_badges' }, async () => {
      const students = await fetchStudents();
      const badgeMap = await fetchStudentBadges();
      const withBadges = students.map(s => ({ ...s, badges: badgeMap[s.id] || [] }));
      callback(withBadges);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};
