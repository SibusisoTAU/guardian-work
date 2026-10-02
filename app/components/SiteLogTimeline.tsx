'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  siteId: string
  siteName?: string
  currentUser?: any
}

export default function SiteLogTimeline({
  siteId,
  siteName = 'Sandton City Site',
  currentUser,
}: Props) {
  const [logs, setLogs] = useState<any[]>([
    {
      id: 'demo-1',
      type: 'boss',
      message: 'Demo mode is active. Connect Supabase to sync live site logs.',
      created_at: new Date().toISOString(),
      meta: {},
    },
  ])
  const [msg, setMsg] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!supabase) {
      setLogs([
        {
          id: 'demo-1',
          type: 'boss',
          message: 'Demo mode is active. Connect Supabase to sync live site logs.',
          created_at: new Date().toISOString(),
          meta: {},
        },
      ])
      return
    }

    const load = async () => {
      const { data } = await supabase
        .from('site_logs')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: true })

      if (data) setLogs(data)
    }

    load().catch(() => {
      setLogs([
        {
          id: 'demo-1',
          type: 'boss',
          message: 'Supabase connection unavailable. Showing local demo data instead.',
          created_at: new Date().toISOString(),
          meta: {},
        },
      ])
    })

    const ch = supabase
      .channel(`site-${siteId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'site_logs',
        filter: `site_id=eq.${siteId}`,
      }, (payload) => {
        setLogs((p) => [...p, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ch)
    }
  }, [siteId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const sendLog = async (type: string, extra: any = {}) => {
    if (!msg && type === 'note') return

    const message = msg || extra.message

    if (!supabase) {
      setLogs((prev) => [
        ...prev,
        {
          id: `demo-${Date.now()}`,
          type,
          message,
          created_at: new Date().toISOString(),
          meta: extra.meta || {},
        },
      ])
      setMsg('')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('site_logs').insert({
      site_id: siteId,
      business_id: currentUser?.business_id,
      user_id: user?.id,
      type,
      message,
      meta: extra.meta || {},
    })
    setMsg('')
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-[28px] overflow-hidden shadow-xl border">
      <div className="bg-[#1a8a3a] text-white p-4 flex items-center gap-3">
        <button className="text-2xl">←</button>
        <h1 className="font-bold text-[18px] leading-tight">SITE LOG - {siteName}</h1>
        <div className="ml-auto flex gap-2">🔍 •••</div>
      </div>

      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs">
        <span className="flex items-center gap-1 font-bold text-green-700">MY GUARDIAN WORK</span>
        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full">LIVE • Active Site</span>
      </div>

      <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
        {logs.map((log, i) => (
          <div key={log.id || i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
              <div className="w-[2px] h-full bg-dotted bg-gray-300 mt-1" />
            </div>
            <div className="flex-1 pb-2">
              {log.type === 'clock_in' && (
                <div className="bg-green-50 p-3 rounded-xl">
                  <b>Thabo clocked in</b>
                  <p className="text-xs">✓ Clock-in confirmed • 08:00 AM</p>
                  <p className="text-xs text-green-700">📍 GPS: {log.meta?.gps}</p>
                </div>
              )}
              {log.type === 'boss' && (
                <div className="bg-orange-100 p-3 rounded-xl">
                  <b className="text-orange-700">Boss (Supervisor)</b>
                  <p className="text-sm">{log.message}</p>
                </div>
              )}
              {log.type === 'evidence' && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <b>Worker evidence submitted</b>
                  <p className="text-sm">{log.message}</p>
                </div>
              )}
              {log.type === 'incident' && (
                <div className="bg-orange-50 p-3 rounded-xl border-l-4 border-orange-500">
                  <b>Incident reported • Priority</b>
                  <p className="text-sm">{log.message}</p>
                </div>
              )}
              {log.type === 'note' && (
                <div className="bg-white p-3 rounded-xl border">
                  <p className="text-sm">{log.message}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2 items-center bg-white">
        <button className="text-orange-500">📎</button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Add note or evidence..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
        />
        <button onClick={() => sendLog('note')} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm">Send</button>
      </div>
    </div>
  )
}
