import { createClient } from '@supabase/supabase-js'

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || url.startsWith('your_')) {
    throw new Error('Supabase environment variables are not configured. See SETUP.md.')
  }
  return createClient(url, key)
}

export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url.startsWith('your_')) {
    throw new Error('Supabase environment variables are not configured. See SETUP.md.')
  }
  return createClient(url, key)
}
