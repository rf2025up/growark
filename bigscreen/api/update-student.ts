import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const allowPublic = (process.env.ALLOW_PUBLIC_WRITE === 'true')
  if (!allowPublic) {
    const adminToken = process.env.ADMIN_TOKEN
    const headerToken = req.headers['x-admin-token']
    if (!adminToken || headerToken !== adminToken) return res.status(401).json({ error: 'unauthorized' })
  }

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return res.status(500).json({ error: 'missing_supabase_env' })

  const supabase = createClient(url, serviceKey)

  let body
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body } catch { return res.status(400).json({ error: 'invalid_json' }) }
  let studentId = body?.student_id as string | undefined
  const studentName = body?.student_name as string | undefined
  if (!studentId && studentName) {
    const { data: sRow } = await supabase.from('students').select('id').eq('name', studentName).limit(1).maybeSingle()
    if (sRow?.id) {
      studentId = sRow.id as string
    } else {
      const insertRes = await supabase.from('students').insert({ name: studentName, experience: 0, points: 0 }).select('id').single()
      if (insertRes.error || !insertRes.data?.id) return res.status(500).json({ error: 'create_student_failed' })
      studentId = insertRes.data.id as string
    }
  }
  const expInc = Number(body?.experience_inc ?? 0)
  const pointsInc = Number(body?.points_inc ?? 0)
  if (!studentId) return res.status(400).json({ error: 'missing_student_id_or_name' })

  const { error: insErr } = await supabase.from('award_points_to_students').insert({
    student_id: studentId,
    challenge_id: body?.challenge_id ?? null,
    points_inc: pointsInc,
    experience_inc: expInc,
    note: body?.note ?? null,
    teacher_id: body?.teacher_id ?? null,
  })
  if (insErr) {
    const { data: current, error: err0 } = await supabase.from('students').select('experience,points').eq('id', studentId).single()
    if (err0) return res.status(500).json({ error: 'fetch_failed', details: err0.message })
    const { error: err1 } = await supabase.from('students').update({
      experience: (current?.experience ?? 0) + expInc,
      points: (current?.points ?? 0) + pointsInc,
    }).eq('id', studentId)
    if (err1) return res.status(500).json({ error: 'update_failed', details: err1.message })
  }

  const { data: after } = await supabase.from('students').select('id,name,experience,points').eq('id', studentId).single()
  return res.status(200).json({ ok: true, student: after })
}
