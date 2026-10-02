"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Build-safe client - no @/ alias
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Site = { id: string; name: string }

export default function BusinessPage() {
  const [sites, setSites] = useState<Site[]>([
    { id: 'sandton-001', name: 'Sandton City Site' }
  ])
  const [selectedSite, setSelectedSite] = useState<Site>({
    id: 'sandton-001', name: 'Sandton City Site'
  })
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("sites").select("*").limit(20)
        if (!error && data && data.length > 0) {
          setSites(data)
          setSelectedSite(data[0])
        }
        // load logs for sandton by default
        const { data: logData } = await supabase
         .from("site_logs")
         .select("*")
         .eq("site_id", "sandton-001")
         .order("created_at", { ascending: false })
         .limit(50)
        if (logData) setLogs(logData)
      } catch (err) {
        // fallback already set - keep Sandton site
        console.log("Using fallback site")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) return <div className="p-8 bg-black text-white min-h-screen">Loading Sandton...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#FFD700]">{selectedSite.name}</h1>
        <p className="text-gray-400 text-sm mb-6">ID: {selectedSite.id} • Live Timeline</p>

        <div className="space-y-3">
          {logs.length === 0? (
            <div className="border border-dashed border-gray-700 p-8 rounded text-center text-gray-500">
              No logs yet. Your GOLD timeline (clock-in, boss messages, GPS, photos) will appear here.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-[#FFD700]/20">
                <div className="flex justify-between">
                  <span className="text-
