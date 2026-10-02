'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function BusinessLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function protect() {
      if (pathname === '/business/setup') {
        setChecking(false)
        return
      }

      if (!supabase) {
        setChecking(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      const { data: biz } = await supabase
        .from('businesses')
        .select('contact_person, phone')
        .eq('auth_user_id', user.id)
        .single()

      if (!biz || !biz.contact_person || !biz.phone) {
        router.push('/business/setup')
        return
      }

      setChecking(false)
    }

    protect()
  }, [pathname, router])

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Verifying business profile...</div>

  return <>{children}</>
}
