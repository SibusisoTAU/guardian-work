"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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
        router.push('/business')
      }
    }
    checkIfBusiness()
  }, [router])

  return <div className="p-8">Your work identity, at a glance.</div>
}
