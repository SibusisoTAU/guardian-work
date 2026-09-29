'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import SiteLogTimeline from '../components/SiteLogTimeline'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BusinessDashboard() {
  const router = useRouter()
  const [business, setBusiness] = useState<any>(null)
  const [sites, setSites] = useState<any[]>([])
  const [activeSite, setActiveSite] = useState<any>(null)

  useEffect(() => {
    async function load(){
      const { data: { user } } = await supabase.auth.getUser()
      if(!user){ router.push('/'); return }

      const { data, error } = await supabase
       .from('businesses')
       .select('*')
       .eq('auth_user_id', user.id)
       .single()

      if(!data || error){
        console.log('No business for this user, redirecting')
        router.push('/business/setup');
        return
      }

      setBusiness(data)

      // LOAD SITES FOR THIS BUSINESS
      const { data: sitesData } = await supabase
       .from('sites')
       .select('*')
       .eq('business_id', data.id)
       .order('created_at', {ascending: false});

      if (sitesData) {
        setSites(sitesData);
        if (sitesData.length > 0) setActiveSite(sitesData[0]);
      }
    }
    load()
  }, [])

  if(!business) return <div className="min-h-screen bg-black text-white p-10">Loading your guardian business...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-black">G</div>
          <div>
            <h1 className="text-2xl font-black">{business.business_name}</h1>
            <p className="text-zinc-400 text-sm">Guardian-Work • Business Dashboard</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Business ID</p>
          <p className="text-green-400 font-mono text-xs">{business.id}</p>
          <p className="text-white mt-1">{business.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white text-black p-5 rounded-xl">
            <p className="text-3xl font-black">{sites.length}</p>
            <p className="text-sm font-bold">Active Sites</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <p className="text-3xl font-black text-green-400">LIVE</p>
            <p className="text-sm text-zinc-400">Site Log System</p>
          </div>
        </div>

        {/* NEW SITE LOG SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl h-fit">
            <h3 className="font-bold mb-3 flex justify-between">Your Sites <span className="text-xs bg-green-500 text-black px-2 py-1 rounded-full">{sites.length}</span></h3>
            {sites.map((s: any) => (
              <button key={s.id} onClick={()=>setActiveSite(s)} className={`w-full text-left p-3 rounded-lg mb-2 border transition ${activeSite?.id===s.id?'bg-white text-black border-white':'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'}`}>
                <p className="font-bold text-sm">{s.name}</p>
                <p className="text-[11px] opacity-60">{s.address || s.id.slice(0,8)}</p>
              </button>
            ))}
            {sites.length===0 && (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-400">No sites yet</p>
                <p className="text-xs text-zinc-500 mt-2">Go to Supabase → sites table → Insert → business_id: {business.id.slice(0,8)}... name: Sandton Site</p>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            {activeSite? (
              <SiteLogTimeline siteId={activeSite.id} currentUser={{ name: business.business_name, role: 'boss' }} />
            ) : (
              <div className="bg-white text-black rounded-2xl p-10 text-center border">Select a site to view LIVE logs with photo evidence</div>
            )}
          </div>
        </div>

        <button className="w-full bg-white text-black mt-6 py-3 rounded-xl font-black">Invite Guards</button>
        <button onClick={async()=>{await supabase.auth.signOut(); router.push('/')}} className="w-full bg-zinc-900 border border-zinc-800 mt-3 py-3 rounded-xl">Logout</button>
      </div>
    </div>
  )
}
