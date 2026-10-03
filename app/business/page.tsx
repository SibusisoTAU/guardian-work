"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Site = { id: string; name: string; address?: string }

export default function BusinessPage() {
  const [isBusiness, setIsBusiness] = useState(true) // FORCE open for now - bypass gate
  const [sites, setSites] = useState<Site[]>([{ id: 'sandton-001', name: 'Sandton City Site', address: 'Sandton City, Johannesburg' }])
  const [selectedSite, setSelectedSite] = useState<Site>({ id: 'sandton-001', name: 'Sandton City Site' })
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Check if user is business (optional - we force true to show workspace)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("is_business").eq("id", user.id).single()
          if (profile?.is_business!== undefined) setIsBusiness(profile.is_business)
        }

        const { data: siteData } = await supabase.from("sites").select("*").limit(20)
        if (siteData && siteData.length > 0) {
          setSites(siteData)
          setSelectedSite(siteData[0])
        }

        const { data: logData } = await supabase.from("site_logs").select("*").eq("site_id", selectedSite.id).order("created_at", { ascending: false }).limit(100)
        if (logData) setLogs(logData)

      } catch (e) {
        console.log("fallback to sandton")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedSite.id])

  if (loading) return <div className="min-h-screen bg-white p-8 text-black">Loading Guardian Work...</div>

  // IF you want to keep the gate, uncomment this. For now I disabled it to show workspace
  // if (!isBusiness) {
  // return <div className="m-4 p-4 border border-emerald-200 rounded-2xl">Business Workspace is available to business accounts after Business setup.</div>
  // }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Your Header - GW */}
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">GW</div>
          <div>
            <h1 className="font-black text-xl leading-none"><span className="text-slate-900">GUARDIAN</span> <span className="text-orange-500">WORK</span></h1>
            <p className="text-[11px] tracking-[0.2em] text-slate-500 mt-1">MAKE YOUR ABILITY DISCOVERABLE</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          {sites.map(s => (
            <button key={s.id} onClick={() => setSelectedSite(s)} className={`px-4 py-2 rounded-full text-sm font-bold border ${selectedSite.id === s.id? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg">Live Gold Timeline - {selectedSite.name}</h2>
          <p className="text-sm text-gray-500 mb-4">kasi talent • clock-in • GPS • photos • boss messages</p>

          <div className="space-y-3">
            {logs.length === 0? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
                No logs yet. This is where worker clock-ins, photo proofs, and GPS will show live.
              </div>
            ) : logs.map(l => (
              <div key={l.id} className="flex gap-3 border-b pb-3">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-2"></div>
                <div>
                  <p className="text-xs text-orange-500 font-bold uppercase">{l.type}</p>
                  <p className="text-sm">{l.message}</p>
                  <p className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
