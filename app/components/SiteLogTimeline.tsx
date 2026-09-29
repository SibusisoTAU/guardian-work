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
    const channel = supabase.channel(`site-${siteId}`)
     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_logs', filter: `site_id=eq.${siteId}` }, (payload) => {
        setLogs(prev => [...prev, payload.new])
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [siteId])

  const getGPS = () => new Promise<any>((res) => {
    navigator.geolocation.getCurrentPosition(pos => res({ lat: pos.coords.latitude, lng: pos.coords.longitude }), () => res({ lat: null, lng: null }))
  })

  const handleSend = async (type='message', photo_url:any=null) => {
    if(!message &&!photo_url) return
    const gps = await getGPS()
    await supabase.from('site_logs').insert({ site_id: siteId, user_name: currentUser?.name || 'Boss', user_role: currentUser?.role || 'boss', type, message, photo_url, gps_lat: gps.lat, gps_lng: gps.lng })
    setMessage(''); bottomRef.current?.scrollIntoView({behavior:'smooth'})
  }

  const handlePhoto = async (e:any) => {
    setUploading(true)
    const file = e.target.files[0]
    const fileName = `${siteId}/${Date.now()}_${file.name}`
    await supabase.storage.from('guardian-chat-media').upload(fileName, file)
    const { data } = supabase.storage.from('guardian-chat-media').getPublicUrl(fileName)
    await handleSend('evidence', data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white text-black rounded-2xl shadow-xl border overflow-hidden">
      <div className="bg-[#0B7A3E] text-white p-3 flex justify-between text-sm font-bold"><span>SITE LOG • LIVE • {siteId.slice(0,8)}</span><span className="bg-orange-400 text-[10px] px-2 py-1 rounded-full text-black">ACTIVE</span></div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {logs.length===0 && <p className="text-center text-gray-400 text-sm mt-10">No logs yet. Send first message.</p>}
        {logs.map(log=>(
          <div key={log.id} className="flex gap-2"><div className={`w-2 h-2 rounded-full mt-2 ${log.user_role==='boss'?'bg-orange-500':'bg-green-600'}`} />
          <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${log.user_role==='boss'?'bg-orange-100':'bg-white shadow'}`}><b className="text-[10px] text-gray-500">{log.user_name} • {log.type}</b><p>{log.message}</p>{log.photo_url && <img src={log.photo_url} className="mt-2 rounded-lg max-w-[200px]" />}<p className="text-[10px] text-gray-400 mt-1">📍 {log.gps_lat?.toFixed(4)} {log.gps_lng?.toFixed(4)} • {new Date(log.created_at).toLocaleTimeString()}</p></div></div>
        ))}<div ref={bottomRef} />
      </div>
      <div className="p-3 border-t flex gap-2 bg-white"><label className="text-orange-500 font-bold cursor-pointer">📎<input type="file" hidden accept="image/*" onChange={handlePhoto} /></label><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Add note..." className="flex-1 border rounded-full px-4 py-2 text-sm outline-none" /><button onClick={()=>handleSend()} className="bg-[#0B7A3E] text-white px-5 py-2 rounded-full text-sm font-bold">Send</button></div>{uploading && <p className="text-xs text-center text-orange-500">Uploading...</p>}
    </div>
  )
}
