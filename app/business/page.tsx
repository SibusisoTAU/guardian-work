"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Business = { id: string; business_name?: string | null; name?: string | null }
type BusinessSite = { id: string; business_id: string; name?: string | null; site_name?: string | null; address?: string | null }
type Activity = { id: string; business_id: string; site_id: string; activity_type: string; title: string; description: string; metadata: any; created_at: string }

export default function BusinessPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [sites, setSites] = useState<BusinessSite[]>([])
  const [selectedSite, setSelectedSite] = useState<BusinessSite | null>(null)
  const [logs, setLogs] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabaseUrl ||!supabaseAnonKey) { setLoading(false); return }

        const { data: { user } } = await supabase.auth.getUser()

        // 1. Get business - try businesses table
        let biz: Business | null = null
        if (user) {
          const { data } = await supabase.from("businesses").select("*").eq("owner_id", user.id).limit(1).maybeSingle()
          if (!data) {
            const { data: data2 } = await supabase.from("businesses").select("*").eq("auth_user_id", user.id).limit(1).maybeSingle()
            if (data2) biz = data2
          } else biz = data
        }
        if (!biz) {
          const { data } = await supabase.from("businesses").select("*").limit(1).maybeSingle()
          biz = data as Business
        }
        if (biz) setBusiness(biz)

        // 2. Get sites - REAL TABLE: business_sites
        const { data: siteData } = await supabase.from("business_sites").select("*").limit(20)
        if (siteData && siteData.length > 0) {
          setSites(siteData)
          setSelectedSite(siteData[0])

          // 3. Get activity - REAL TABLE: site_activity with real columns
          const { data: actData } = await supabase.from("site_activity").select("*").eq("site_id", siteData[0].id).order("created_at", { ascending: false }).limit(100)
          if (actData) setLogs(actData as Activity[])
        }
      } catch (e) {
        console.error("load error", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const reloadLogs = async () => {
      if (!selectedSite) return
      const { data } = await supabase.from("site_activity").select("*").eq("site_id", selectedSite.id).order("created_at", { ascending: false }).limit(100)
      if (data) setLogs(data as Activity[])
    }
    reloadLogs()
  }, [selectedSite?.id])

  if (loading) return <div className="min-h-screen bg-white p-8 text-black">Loading Guardian Work...</div>

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="bg-white border-b p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">GW</div>
        <div>
          <h1 className="font-black text-xl"><span className="text-slate-900">GUARDIAN</span> <span className="text-orange-500">WORK</span></h1>
          <p className="text-[11px] tracking-[0.2em] text-slate-500">MAKE YOUR ABILITY DISCOVERABLE</p>
          {business && <p className="text-xs text-emerald-600 mt-1">Business: {business.business_name || business.name || business.id.slice(0,8)}</p>}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sites.map(s => (
            <button key={s.id} onClick={() => setSelectedSite(s)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border ${selectedSite?.id === s.id? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}>
              {s.name || s.site_name || s.id.slice(0,8)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg">Live Gold Timeline - {selectedSite?.name || selectedSite?.site_name || 'No site selected'}</h2>
          <p className="text-sm text-gray-500 mb-4">{logs.length} events from site_activity</p>

          <div className="space-y-3">
            {logs.length === 0? (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                No activity yet for this site.<br/>Your clock-in, boss message, GPS, photo will appear here.
              </div>
            ) : logs.map(l => (
              <div key={l.id} className="flex gap-3 border-b border-gray-100 pb-3">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs text-orange-500 font-bold uppercase">{l.activity_type}</p>
                  <p className="font-semibold text-sm text-slate-900">{l.title}</p>
                  <p className="text-sm text-slate-600">{l.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(l.created_at).toLocaleString()} {l.metadata? `• ${JSON.stringify(l.metadata).slice(0,100)}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}    
