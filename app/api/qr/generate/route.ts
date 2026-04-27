import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { relicId, qrType } = await request.json()

  if (!relicId || !qrType) {
    return NextResponse.json({ error: 'Missing relicId or qrType' }, { status: 400 })
  }

  // Verify user owns this relic
  const { data: relic } = await supabase
    .from('relics')
    .select('id')
    .eq('id', relicId)
    .eq('user_id', user.id)
    .single()

  if (!relic) {
    return NextResponse.json({ error: 'Relic not found or unauthorized' }, { status: 404 })
  }

  // Generate unique code
  const code = nanoid(10)

  // Determine URL based on type
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://relic-curator.vercel.app'
  let targetUrl: string

  switch (qrType) {
    case 'view':
      targetUrl = `${baseUrl}/relic/${relicId}`
      break
    case 'ar':
      targetUrl = `${baseUrl}/ar/${code}`
      break
    case 'contribute':
      targetUrl = `${baseUrl}/quick/${code}`
      break
    default:
      return NextResponse.json({ error: 'Invalid qrType' }, { status: 400 })
  }

  // Save to database
  const { data: qrRecord, error: dbError } = await supabase
    .from('relic_qr_codes')
    .insert({
      relic_id: relicId,
      code,
      qr_type: qrType
    })
    .select()
    .single()

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  // Generate QR code image
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 512,
    margin: 2,
    color: {
      dark: '#ffffff',
      light: '#0a0a0a'
    }
  })

  return NextResponse.json({
    id: qrRecord.id,
    code,
    qrType,
    targetUrl,
    qrDataUrl
  })
}
