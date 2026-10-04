'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    async function protect() {
      if (!active) return

      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/')
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
          return
        }

        setChecking(false)
      } catch (error) {
        console.error('Seeker protection check failed:', error)
        if (active) router.replace('/')
      }
    }

    protect()

    return () => {
      active = false
    }
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Verifying seeker access
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
