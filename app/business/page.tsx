"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Site = { id: string; name: string }
type Log = { id: string; type: string; message: string; created_at: string; meta: any }

export default function BusinessPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const loadSites = async () => {
      try {
        const { data, error } = await supabase
         .from("sites")
         .select("*")
         .limit(20)

        if (error ||!data || data.length === 0) {
          const fallback = { id: 'sandton-001', name: 'Sandton City Site' }
          setSites([fallback])
          setSelectedSite(fallback)
          return
        }
        setSites(data as Site[])
        setSelectedSite(data[0] as Site)
      } catch (e) {
        const fallback = { id: 'sandton-001', name: 'Sandton City Site' }
        setSites([fallback])
        setSelectedSite(fallback)
      }
    }
    loadSites()
  }, [])

  useEffect(() => {
    if (!selectedSite) return
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
    loadLogs()
  }, [selectedSite])

  return (
    <div className="p-4">
      <h1 className="font-bold">{selectedSite?.name}</h1>
      {logs.map(l => (
        <div key={l.id} className="border-b py-2">
          <b>{l.type}</b>: {l.message}
        </div>
      ))}
    </div>
  )
}
