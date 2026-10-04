'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function AppHome() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    async function resolvePortal() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/seeker')
          return
        }

        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('auth_user_id', user.id)
          .maybeSingle()

        if (!active) return

        if (business) {
          router.replace('/business')
        } else {
          router.replace('/seeker')
        }
      } catch (error) {
        console.error('Portal route check failed:', error)
        if (active) router.replace('/seeker')
      } finally {
        if (active) setChecking(false)
      }
    }

    resolvePortal()
    return () => {
      active = false
    }
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
            Loading portal...
          </p>
        </div>
      </div>
    )
  }

  return null
}
