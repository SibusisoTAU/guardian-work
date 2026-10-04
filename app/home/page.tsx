'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        // No user logged in → show public portal
        if (!user) {
          router.replace('/')
          return
        }

        // Check if user has a business account
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (business) {
          // User is a business → go to business portal
          router.replace('/business')
        } else {
          // User is a job seeker → go to job seeker portal
          router.replace('/seeker')
        }
      } catch (error) {
        console.error('Error checking user type:', error)
        // Default to job seeker portal on error
        router.replace('/seeker')
      } finally {
        setLoading(false)
      }
    }

    checkUserType()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-slate-50 p-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="mt-4 text-slate-600">Directing you to your portal...</p>
      </div>
    </div>
  )
}
