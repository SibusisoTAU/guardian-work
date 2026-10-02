'use client'

import { useEffect, useState } from 'react'
import SiteLogTimeline from '../components/SiteLogTimeline'
import { supabase } from '@/lib/supabase'

export default function BusinessDashboard() {
  const [sites, setSites] = useState<any[]>([{ id: 'sandton-001', name: 'Sandton City Site' }])
  const [selectedSite, setSelectedSite] = useState<any>({ id: 'sandton-001', name: 'Sandton City Site' })

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('sites')
      .select('*')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSites(data)
          setSelectedSite(data[0])
        }
      })
      .catch(() => {
        setSites([{ id: 'sandton-001', name: 'Sandton City Site' }])
        setSelectedSite({ id: 'sandton-001', name: 'Sandton City Site' })
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#F2F5F2] p-3 flex gap-4">
      <div className="w-[280px] bg-white rounded-2xl p-4 shadow hidden md:block">
        <h2 className="font-black text-lg mb-4">Your Sites</h2>
        {sites.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSite(s)}
            className={`w-full text-left p-3 rounded-xl mb-2 ${selectedSite.id === s.id ? 'bg-green-700 text-white' : 'bg-gray-100 text-black'}`}
          >
            <p className="font-bold">{s.name || s.id}</p>
            <p className="text-[11px] opacity-70">{s.id.slice(0, 8)} • LIVE</p>
          </button>
        ))}
      </div>

      <div className="flex-1">
        <SiteLogTimeline
          siteId={selectedSite.id}
          siteName={selectedSite.name}
          currentUser={{ name: 'Boss (Supervisor)', role: 'boss' }}
        />
      </div>
    </div>
  )
}
