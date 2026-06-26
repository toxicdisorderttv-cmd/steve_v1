export interface Submission {
  id: string
  title: string
  photo_url: string
  photo_urls?: string | null
  description: string
  submitter_name: string
  submitter_email: string
  media_type?: 'image' | 'video' | 'text'
  relationship?: 'family' | 'friend' | 'colleague' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
