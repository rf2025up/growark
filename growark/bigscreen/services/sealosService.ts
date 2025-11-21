import { Student, Team, Challenge, Badge } from '../types'

const getBase = () => {
  const w: any = typeof window !== 'undefined' ? (window as any) : undefined
  const winBase = w && w.__ENV && w.__ENV.API_BASE_URL
  const procBase = (typeof process !== 'undefined' && process.env && (process.env.API_BASE_URL as any))
  return winBase || procBase || ''
}
const base = getBase()

const now = () => Date.now()
const daysAgo = (d: number) => now() - d * 24 * 60 * 60 * 1000

let teams: Team[] = [
  { id: 't1', name: '新星前锋', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
  { id: 't2', name: '旋涡毒蛇', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { id: 't3', name: '猩红守卫', color: 'bg-red-500', textColor: 'text-red-400' },
  { id: 't4', name: '翡翠哨兵', color: 'bg-emerald-500', textColor: 'text-emerald-400' },
]

let students: Student[] = []

let badges: Badge[] = [
  { id: 'b1', name: '学霸之星', description: '学习表现突出', image: `https://i.pravatar.cc/100?u=badge1`, icon: '⭐', awardedDate: new Date(daysAgo(2)).toISOString() },
  { id: 'b2', name: '挑战先锋', description: '完成挑战最多', image: `https://i.pravatar.cc/100?u=badge2`, icon: '🛡️', awardedDate: new Date(daysAgo(5)).toISOString() }
]

type PKMatch = { id: string; student_a: string; student_b: string; topic: string; status: 'pending' | 'finished'; winner_id?: string; updated_at: string }
type StudentTask = { id: string; student_id: string; title: string; status: 'completed' | 'pending'; completed_at?: string }

let pkMatches: PKMatch[] = []
let challenges: Challenge[] = []
let recentTasks: StudentTask[] = []

export const getStudents = async (): Promise<Student[]> => {
  try {
    if (!base) throw new Error('no base')
    const res = await fetch(`${base}/students`)
    if (res.ok) {
      const data = await res.json()
      students = data.students || []
    }
  } catch {}
  if (!students || students.length === 0) {
    const colors = [
      { color: 'bg-cyan-500', textColor: 'text-cyan-400' },
      { color: 'bg-purple-500', textColor: 'text-purple-400' },
      { color: 'bg-red-500', textColor: 'text-red-400' },
      { color: 'bg-emerald-500', textColor: 'text-emerald-400' }
    ]
    students = Array.from({ length: 20 }).map((_, index) => ({
      id: String(index + 1),
      name: `学生${index + 1}`,
      team_id: teams[(index % teams.length)].id,
      total_exp: Math.floor(Math.random() * 500) + 50,
      total_points: Math.floor(Math.random() * 100) + 10,
      avatar_url: `https://i.pravatar.cc/100?u=${index + 1}`,
      badges: []
    }))
    teams = teams.map((t, i) => ({ ...t, ...colors[i % colors.length] }))
  }
  return students
}

export const getTeams = async (): Promise<Team[]> => teams
export const getChallenges = async (): Promise<Challenge[]> => challenges
export const getBadges = async (): Promise<Record<string, Badge[]>> => {
  const result: Record<string, Badge[]> = {}
  students.forEach(s => { result[s.id] = s.badges || [] })
  return result
}
export const getPKs = async (_sinceDays = 7): Promise<PKMatch[]> => pkMatches
export const getRecentTasks = async (_sinceDays = 7): Promise<StudentTask[]> => recentTasks
export type { PKMatch, StudentTask }

export const subscribeToStudentChanges = (cb: (payload: { updatedStudents: Student[] }) => void) => {
  if (!base) return () => {}
  const es = new EventSource(`${base}/events`)

  // Helper to refetch students from server
  const refetchStudents = async () => {
    try {
      const res = await fetch(`${base}/students`)
      if (res.ok) {
        const data = await res.json()
        students = data.students || []
        cb({ updatedStudents: students })
      }
    } catch (e) {
      console.error('refetch_students_error:', e)
    }
  }

  es.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (!msg || !msg.type) return

      // Handle different event types
      switch (msg.type) {
        case 'score':
        case 'habit':
        case 'challenge':
        case 'pk':
        case 'task':
        case 'badge':
          // Any of these events could affect student data, so refetch
          refetchStudents()
          break

        case 'ping':
          // Keepalive message, ignore
          break

        case 'connected':
          // Connection established, could refetch initial data
          refetchStudents()
          break
      }
    } catch (e) {
      console.error('sse_message_error:', e)
    }
  }

  es.onerror = (e) => {
    console.error('sse_error:', e)
  }

  return () => es.close()
}