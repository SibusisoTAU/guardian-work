"use client"
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MyWorkPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkIfBusiness() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()
      
      if (business) {
        // This is a BUSINESS - don't show job seeker profile!
        router.push('/business')
      }
    }
    checkIfBusiness()
  }, [])
}
