import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_DIMENSION = 1800
const QUALITY = 80

async function compressImage(buffer: Buffer): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  return sharp(buffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer()
}

async function sendEmails(opts: {
  submitter_name: string
  submitter_email: string
  title: string
  status: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail = process.env.FROM_EMAIL
  if (!apiKey || !adminEmail || !fromEmail) return

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  const adminPanel = `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
  const autoApproved = opts.status === 'approved'

  // Admin notification
  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New memory submitted: "${opts.title}"`,
    html: `
      <p>Hi,</p>
      <p><strong>${opts.submitter_name}</strong> just submitted a memory titled <strong>"${opts.title}"</strong>.</p>
      ${autoApproved
        ? `<p>It has been <strong>automatically approved</strong> and is now live on the site.</p>`
        : `<p>It is currently <strong>pending review</strong> — visit the admin panel to approve or reject it.</p>`
      }
      <p><a href="${adminPanel}">Open Admin Panel →</a></p>
    `,
  }).catch(console.error)

  // Submitter confirmation
  await resend.emails.send({
    from: fromEmail,
    to: opts.submitter_email,
    subject: 'Thank you for sharing your memory of Steve',
    html: `
      <p>Hi ${opts.submitter_name},</p>
      <p>Thank you so much for taking the time to share your memory of Steve. It means a great deal to him and to the whole family.</p>
      ${autoApproved
        ? `<p>Your memory is now live on the site. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/stories">View it here →</a></p>`
        : `<p>Your memory has been received and will appear on the site once reviewed.</p>`
      }
      <p>With gratitude,<br/>The Beal Family</p>
    `,
  }).catch(console.error)
}

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('submissions')
      .select('id, title, photo_url, photo_urls, description, submitter_name, created_at, media_type, relationship')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ submissions: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ submissions: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const submitter_name = (formData.get('submitter_name') as string)?.trim()
    const submitter_email = (formData.get('submitter_email') as string)?.trim()
    const photo = formData.get('photo') as File | null
    const media_type = (formData.get('media_type') as string) ?? 'image'
    const relationship = (formData.get('relationship') as string) ?? 'other'

    if (!title || !description || !submitter_name || !submitter_email) {
      return NextResponse.json({ error: 'Title, story, name, and email are required.' }, { status: 400 })
    }

    const db = supabaseAdmin()
    let photo_url = ''
    let resolved_media_type = 'text'

    // Media uploaded client-side — URL arrives ready-made (bypasses Vercel's 4.5 MB body limit)
    const preUploadedUrl = (formData.get('photo_url') as string)?.trim()
    const preUploadedMediaType = (formData.get('media_type') as string)?.trim()
    const photo_urls = (formData.get('photo_urls') as string)?.trim() || null
    if (preUploadedUrl) {
      photo_url = preUploadedUrl
      resolved_media_type = preUploadedMediaType === 'image' ? 'image' : 'video'
    } else if (photo && photo.size > 0) {
      const isImage = photo.type.startsWith('image/')
      if (!isImage) {
        return NextResponse.json({ error: 'File must be an image.' }, { status: 400 })
      }
      const rawBuffer = Buffer.from(await photo.arrayBuffer())
      const uploadBuffer = await compressImage(rawBuffer)
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error: uploadError } = await db.storage
        .from('photos')
        .upload(filename, uploadBuffer, { contentType: 'image/jpeg', upsert: false })
      if (uploadError) {
        return NextResponse.json({ error: 'Failed to upload file. Make sure the "photos" storage bucket exists in Supabase.' }, { status: 500 })
      }
      const { data: urlData } = db.storage.from('photos').getPublicUrl(filename)
      photo_url = urlData.publicUrl
      resolved_media_type = 'image'
    }

    // Rate limit: more than 3 submissions from the same email in the last hour → pending review
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: recentCount } = await db
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('submitter_email', submitter_email)
      .gte('created_at', oneHourAgo)

    const status = (recentCount ?? 0) >= 3 ? 'pending' : 'approved'

    const { error: insertError } = await db.from('submissions').insert({
      title,
      description,
      submitter_name,
      submitter_email,
      photo_url,
      photo_urls,
      media_type: resolved_media_type,
      relationship: ['family', 'friend', 'colleague', 'other'].includes(relationship) ? relationship : 'other',
      status,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
    }

    // Send emails (silently skipped if RESEND_API_KEY / ADMIN_EMAIL / FROM_EMAIL not set)
    await sendEmails({ submitter_name, submitter_email, title, status })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
