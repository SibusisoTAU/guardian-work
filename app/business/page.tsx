'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import SiteLogTimeline from '../components/SiteLogTimeline'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function BusinessDashboard() {
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [sites, setSites] = useState<any[]>([])
  const [activeSite, setActiveSite] = useState<any>(null)

  useEffect(() => {
    async function load(){
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){ router.push('/'); return }
      const { data } = await supabase.from('businesses').select('*').eq('auth_user_id', user.id).single()
      if(!data){ router.push('/business/setup'); return }
      setBusiness(data)
      const { data: sitesData } = await supabase.from('sites').select('*').eq('business_id', data.id).order('created_at', {ascending: false})
      if(sitesData){ setSites(sitesData); if(sitesData.length>0) setActiveSite(sitesData[0]) }
    }
    load()
  }, [])

  if(!business) return <div className="min-h-screen bg-black text-white p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black">{business.business_name}</h1>
        <p className="text-zinc-400 text-sm mb-6">Guardian-Work Dashboard</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <h3 className="font-bold mb-3">Your Sites ({sites.length})</h3>
            {sites.map((s:any)=><button key={s.id} onClick={()=>setActiveSite(s)} className={`w-full text-left p-3 rounded-lg mb-2 border ${activeSite?.id===s.id?'bg-white text-black':'bg-zinc-800'}`}><p className="font-bold text-sm">{s.name}</p></button>)}
            {sites.length===0 && <p className="text-xs text-zinc-500">Insert site in Supabase: sites table, business_id={business.id.slice(0,8)}</p>}
          </div>
          <div className="lg:col-span-2">
            {activeSite? <SiteLogTimeline siteId={activeSite.id} currentUser={{ name: business.business_name, role: 'boss' }} /> : <div className="bg-white text-black p-10 rounded-2xl text-center">Select site</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
