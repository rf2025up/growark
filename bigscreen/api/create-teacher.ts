import { createClient } from '@supabase/supabase-js'

const genPwd = () => Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-10)

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
  const email = body?.email as string
  const password = (body?.password as string) || genPwd()
  if (!email) return res.status(400).json({ error: 'missing_email' })

  const userRes = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
  if (userRes.error) return res.status(500).json({ error: 'create_user_failed', details: userRes.error.message })

  const userId = userRes.data.user?.id
  if (!userId) return res.status(500).json({ error: 'user_id_missing' })

  const insertRes = await supabase.from('teachers').insert({ user_id: userId })
  if (insertRes.error && insertRes.error.message?.includes('relation')) return res.status(500).json({ error: 'teachers_table_missing' })
  if (insertRes.error && insertRes.error.code !== '23505') return res.status(500).json({ error: 'insert_teacher_failed', details: insertRes.error.message })

  return res.status(200).json({ ok: true, user_id: userId, email, password })
}

