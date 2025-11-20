import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const adminToken = process.env.ADMIN_TOKEN
  const headerToken = req.headers['x-admin-token']
  if (!adminToken || headerToken !== adminToken) return res.status(401).json({ error: 'unauthorized' })

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return res.status(500).json({ error: 'missing_supabase_env' })

  const supabase = createClient(url, serviceKey)

  let body
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body } catch { return res.status(400).json({ error: 'invalid_json' }) }
  const studentId = body?.student_id as string
  const badgeId = body?.badge_id as string
  const awardedDate = body?.awarded_date as string | undefined
  if (!studentId || !badgeId) return res.status(400).json({ error: 'missing_params' })

  const { data, error } = await supabase.from('awarded_badges').insert({
    student_id: studentId,
    badge_id: badgeId,
    awarded_date: awardedDate ?? new Date().toISOString(),
  }).select()
  if (error) return res.status(500).json({ error: 'insert_failed', details: error.message })
  return res.status(200).json({ ok: true, awarded: data })
}

