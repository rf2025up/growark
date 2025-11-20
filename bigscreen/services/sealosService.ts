import { Student, Team, Challenge, Badge } from '../types'

const now = () => Date.now()
const daysAgo = (d: number) => now() - d * 24 * 60 * 60 * 1000

let teams: Team[] = [
  { id: 't1', name: '新星前锋', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
  { id: 't2', name: '旋涡毒蛇', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { id: 't3', name: '猩红守卫', color: 'bg-red-500', textColor: 'text-red-400' },
  { id: 't4', name: '翡翠哨兵', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
]

let students: Student[] = Array.from({ length: 20 }).map((_, index) => ({
  id: String(index + 1),
  name: `学生${index + 1}`,
  team_id: teams[(index % teams.length)].id,
  total_exp: Math.floor(Math.random() * 500) + 50,
  total_points: Math.floor(Math.random() * 100) + 10,
  avatar_url: `https://i.pravatar.cc/100?u=${index + 1}`,
  badges: []
}))

let badges: Badge[] = [
  { id: 'b1', name: '学霸之星', description: '学习表现突出', image: `https://i.pravatar.cc/100?u=badge1`, icon: '⭐', awardedDate: new Date(daysAgo(2)).toISOString() },
  { id: 'b2', name: '挑战先锋', description: '完成挑战最多', image: `https://i.pravatar.cc/100?u=badge2`, icon: '🛡️', awardedDate: new Date(daysAgo(5)).toISOString() }
]

students = students.map((s, i) => ({
  ...s,
  badges: i % 5 === 0 ? badges : []
}))

type PKMatch = { id: string; student_a: string; student_b: string; topic: string; status: 'pending' | 'finished'; winner_id?: string; updated_at: string }
type StudentTask = { id: string; student_id: string; title: string; status: 'completed' | 'pending'; completed_at?: string }

let pkMatches: PKMatch[] = [
  { id: 'pk1', student_a: '1', student_b: '2', topic: '背古诗', status: 'pending', updated_at: new Date(daysAgo(1)).toISOString() },
  { id: 'pk2', student_a: '3', student_b: '4', topic: '速算', status: 'finished', winner_id: '3', updated_at: new Date(daysAgo(2)).toISOString() },
  { id: 'pk3', student_a: '5', student_b: '6', topic: '英语拼写', status: 'finished', winner_id: '6', updated_at: new Date(daysAgo(6)).toISOString() }
]

let challenges: Challenge[] = [
  { id: 'c11', title: '一周阅读挑战', description: '完成 5 本书笔记', challenger: { name: '芬利', avatar: `https://i.pravatar.cc/100?u=5` }, status: '进行中' },
  { id: 'c12', title: '艺术创作', description: '未来主题数字画', challenger: { name: '摩根', avatar: `https://i.pravatar.cc/100?u=9` }, status: '进行中' },
  { id: 'c13', title: '数学速算', description: '三位数心算竞赛', challenger: { name: '亚历克斯', avatar: `https://i.pravatar.cc/100?u=1` }, status: '失败' }
]

let recentTasks: StudentTask[] = [
  { id: 'st101', student_id: '7', title: '科技小制作', status: 'completed', completed_at: new Date(daysAgo(3)).toISOString() },
  { id: 'st102', student_id: '8', title: '历史研究报告', status: 'completed', completed_at: new Date(daysAgo(6)).toISOString() }
]

export const getStudents = async (): Promise<Student[]> => students
export const getTeams = async (): Promise<Team[]> => teams
export const getChallenges = async (): Promise<Challenge[]> => challenges
export const getBadges = async (): Promise<Record<string, Badge[]>> => {
  const result: Record<string, Badge[]> = {}
  students.forEach(s => { result[s.id] = s.badges || [] })
  return result
}
export const getPKs = async (sinceDays = 7): Promise<PKMatch[]> => {
  const cutoff = daysAgo(sinceDays)
  return pkMatches.filter(p => Date.parse(p.updated_at) >= cutoff).sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pending' ? -1 : 1
    return Date.parse(b.updated_at) - Date.parse(a.updated_at)
  })
}
export const getRecentTasks = async (sinceDays = 7): Promise<StudentTask[]> => {
  const cutoff = daysAgo(sinceDays)
  return recentTasks.filter(t => t.completed_at && Date.parse(t.completed_at) >= cutoff).sort((a, b) => Date.parse(b.completed_at || '') - Date.parse(a.completed_at || ''))
}
export type { PKMatch, StudentTask }
export const subscribeToStudentChanges = (_: (payload: { updatedStudents: Student[] }) => void) => () => {}
export const subscribeToChallengeChanges = (_: (updated: Challenge[]) => void) => () => {}
export const subscribeToPKChanges = (_: (updated: PKMatch[]) => void) => () => {}
export const subscribeToTaskChanges = (_: (updated: StudentTask[]) => void) => () => {}