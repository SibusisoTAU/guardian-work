'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BusinessDashboard() {
  const router = useRouter()
  const [business, setBusiness] = useState(null)

  useEffect(() => {
    async function load(){
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){ router.push('/'); return }
      const { data } = await supabase.from('businesses').select('*').eq('auth_user_id', user.id).single()
      if(!data){ router.push('/business/setup'); return }
      setBusiness(data)
    }
    load()
  }, [])

  if(!business) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl">🛡️</div>
          <div>
            <h1 className="text-2xl font-black">{business.business_name}</h1>
            <p className="text-zinc-400 text-sm">{business.province} | {business.town}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-4">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Status</p>
          <p className="text-green-400 font-bold text-lg">✅ Profile Complete</p>
          <p className="text-white mt-1">{business.contact_person} • {business.phone}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white text-black rounded-2xl p-4">
            <p className="text-3xl font-black">0</p>
            <p className="text-sm font-bold">Active Jobs</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-3xl font-black">0</p>
            <p className="text-sm text-zinc-400">Applicants</p>
          </div>
        </div>

        <button className="w-full bg-white text-black font-black py-4 rounded-2xl">+ Post New Job</button>
        <button onClick={async()=>{await supabase.auth.signOut(); router.push('/')}} className="w-full mt-3 text-zinc-500 py-3">Log out</button>
      </div>
    </div>
  )
}
