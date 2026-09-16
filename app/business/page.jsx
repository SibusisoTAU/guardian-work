'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function BusinessDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState(null)

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      // GUARD - if incomplete, force to setup
      if (!biz || !biz.contact_person || !biz.phone) {
        router.push('/business/setup')
        return
      }

      setBusiness(biz)
      setLoading(false)
    }
    checkProfile()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading business...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow">
        <h1 className="text-3xl font-bold">Welcome, {business.business_name} 🛡️</h1>
        <p className="text-gray-500 mt-2">Province: {business.province} | Town: {business.town}</p>
        <p className="text-gray-500">Contact: {business.contact_person} - {business.phone}</p>
        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          ✅ Your Business Profile is complete!
        </div>
      </div>
    </div>
  )
}
