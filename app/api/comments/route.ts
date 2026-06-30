import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const submission_id = req.nextUrl.searchParams.get('submission_id')
  if (!submission_id) {
    return NextResponse.json({ error: 'submission_id is required.' }, { status: 400 })
  }

  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('comments')
      .select('id, submission_id, commenter_name, body, created_at')
      .eq('submission_id', submission_id)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ comments: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const submission_id = (body.submission_id as string)?.trim()
    const commenter_name = (body.commenter_name as string)?.trim()
    const commentBody = (body.body as string)?.trim()

    if (!submission_id || !commenter_name || !commentBody) {
      return NextResponse.json({ error: 'Name and comment are required.' }, { status: 400 })
    }
    if (commenter_name.length > 80) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }
    if (commentBody.length > 1000) {
      return NextResponse.json({ error: 'Comment is too long (1000 characters max).' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Basic spam guard: cap at 10 comments per submission per IP-less window isn't available,
    // so instead cap how many comments can land on one submission within a short window.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count: recentCount } = await db
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('submission_id', submission_id)
      .gte('created_at', fiveMinutesAgo)

    if ((recentCount ?? 0) >= 20) {
      return NextResponse.json({ error: 'Too many comments right now — please try again shortly.' }, { status: 429 })
    }

    const { data, error: insertError } = await db
      .from('comments')
      .insert({ submission_id, commenter_name, body: commentBody })
      .select('id, submission_id, commenter_name, body, created_at')
      .single()

    if (insertError) {
      return NextResponse.json({ error: 'Failed to post comment.' }, { status: 500 })
    }

    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
