'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export default function SiteLogTimeline({ siteId, currentUser }: any) {
  const [logs, setLogs] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('site_logs').select('*').eq('site_id', siteId).order('created_at', { ascending: true })
      if (data) setLogs(data)
    }
    fetchLogs()
    const channel = supabase.channel(`site-${siteId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_logs', filter: `site_id=eq.${siteId}` }, (p:any) => setLogs(s=>[...s, p.new])).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [siteId])
  const getGPS = () => new Promise<any>(res => navigator.geolocation.getCurrentPosition(pos => res({ lat: pos.coords.latitude, lng: pos.coords.longitude }), () => res({ lat: null, lng: null })))
  const send = async (type='message', photo:any=null) => {
    if(!message &&!photo) return
    const gps = await getGPS()
    await supabase.from('site_logs').insert({ site_id: siteId, user_name: currentUser?.name||'Boss', user_role: currentUser?.role||'boss', type, message, photo_url: photo, gps_lat: gps.lat, gps_lng: gps.lng })
    setMessage('')
  }
  const photo = async (e:any) => {
    setUploading(true)
    const file = e.target.files[0]
    const name = `${siteId}/${Date.now()}_${file.name}`
    await supabase.storage.from('guardian-chat-media').upload(name, file)
    const { data } = supabase.storage.from('guardian-chat-media').getPublicUrl(name)
    await send('evidence', data.publicUrl)
    setUploading(false)
  }
  return (
    <div className="flex flex-col h-[70vh] bg-white text-black rounded-2xl border overflow-hidden">
      <div className="bg-green-700 text-white p-3 text-sm font-bold">SITE LOG LIVE {siteId.slice(0,8)}</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {logs.map((l:any)=><div key={l.id} className="bg-white p-3 rounded-xl shadow text-sm"><b className="text-[10px]">{l.user_name}</b><p>{l.message}</p>{l.photo_url && <img src={l.photo_url} className="mt-2 rounded max-w-[200px]"/>}</div>)}
        <div ref={bottomRef}/>
      </div>
      <div className="p-3 border-t flex gap-2 bg-white">
        <label className="cursor-pointer">📎<input type="file" hidden onChange={photo}/></label>
        <input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Add note..." className="flex-1 border rounded-full px-4 py-2 text-sm"/>
        <button onClick={()=>send()} className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-bold">Send</button>
      </div>
    </div>
  )
}
