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

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('submissions')
      .select('id, title, photo_url, description, submitter_name, created_at, media_type, relationship')
      .eq('status', 'approved')
      .order('created_at', { ascending: true })

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

    // Video uploaded client-side — URL arrives ready-made
    const preUploadedUrl = (formData.get('photo_url') as string)?.trim()
    if (preUploadedUrl) {
      photo_url = preUploadedUrl
      resolved_media_type = 'video'
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

    const { error: insertError } = await db.from('submissions').insert({
      title,
      description,
      submitter_name,
      submitter_email,
      photo_url,
      media_type: resolved_media_type,
      relationship: ['family', 'friend', 'colleague', 'other'].includes(relationship) ? relationship : 'other',
      status: 'approved',
    })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
