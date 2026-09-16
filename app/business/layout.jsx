'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BusinessLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function protect() {
      // Don't protect the setup page itself!
      if (pathname === '/business/setup') {
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

      // FORCE PROFILE: If no business OR missing fields → kick to setup
      if (!biz ||!biz.contact_person ||!biz.phone) {
        router.push('/business/setup')
        return
      }

      setChecking(false)
    }
    protect()
  }, [pathname])

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Verifying business profile...</div>

  return <>{children}</>
}
