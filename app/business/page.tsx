"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Site = { id: string; name: string }
type Log = { id: string; type: string; message: string; created_at: string; meta: any }

export default function BusinessPage() {
  const [sites, setSites] = useState<Site[]>([{ id: 'sandton-001', name: 'Sandton City Site' }])
  const [selectedSite, setSelectedSite] = useState<Site>({ id: 'sandton-001', name: 'Sandton City Site' })
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
  const loadSites = async () => {
    try {
      const { data, error } = await supabase.from('sites').select('*')

      if (error) throw error

      if (data && data.length > 0) {
        setSites(data)
        setSelectedSite(data[0])
      }
    } catch (error) {
      console.error('Error loading sites', error)
      setSites([{ id: 'sandton-001', name: 'Sandton City Site' }])
      setSelectedSite({ id: 'sandton-001', name: 'Sandton City Site' })
    }
  }

  loadSites()
}, [])

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const { data } = await supabase
         .from("site_logs")
         .select("*")
         .eq("site_id", selectedSite.id)
         .order("created_at", { ascending: false })
        if (data) setLogs(data as Log[])
      } catch {}
    }
    if (selectedSite) loadLogs()
  }, [selectedSite])

  return (
    <div className="p-4 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="font-bold text-xl text-[#FFD700]">{selectedSite?.name}</h1>
      <p className="text-xs text-gray-400 mb-4">Live Logs</p>
      {logs.map(l => (
        <div key={l.id} className="border-b border-gray-800 py-3">
          <span className="text-[#FFD700] text-xs">{l.type.toUpperCase()}</span>
          <p>{l.message}</p>
        </div>
      ))}
      {logs.length === 0 && <p className="text-gray-500 mt-10">No logs yet for {selectedSite.id}</p>}
    </div>
  )
}
