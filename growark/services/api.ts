const getBase = () => {
  const w = typeof window !== 'undefined' ? (window as any) : undefined
  const winBase = w && w.__ENV__ && w.__ENV__.API_BASE_URL
  const procBase = (typeof process !== 'undefined' && process.env && (process.env.API_BASE_URL as any))
  return winBase || procBase || ''
}

const post = async (path: string, data: any) => {
  const base = getBase()
  if (!base) return
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.ok
}

export const apiUpdateScore = async (ids: string[], points: number, reason: string, exp?: number) => {
  return post('/score', { ids, points, reason, exp })
}

export const apiHabitCheckIn = async (studentIds: string[], habitId: string) => {
  return post('/habit-checkin', { studentIds, habitId })
}

export const apiChallengeStatus = async (id: string, result: 'success'|'fail', payload: any) => {
  return post('/challenge-status', { id, result, ...payload })
}

export const apiPKWinner = async (id: string, winnerId: string, payload: any) => {
  return post('/pk-winner', { id, winnerId, ...payload })
}

export const apiCompleteTask = async (id: string, payload: any) => {
  return post('/task-complete', { id, ...payload })
}

export const apiGrantBadge = async (badgeId: string, studentId: string, payload: any) => {
  return post('/badge-grant', { badgeId, studentId, ...payload })
}