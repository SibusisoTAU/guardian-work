'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  siteId: string
  siteName?: string
  currentUser?: any
}

export default function SiteLogTimeline({ siteId, siteName="Sandton City Site", currentUser }: Props) {
  const [logs, setLogs] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load + realtime
  useEffect(()=>{
    if(!siteId) return
    const load = async () => {
      const { data } = await supabase.from('site_logs').select('*').eq('site_id', siteId).order('created_at',{ascending:true})
      if(data && data.length>0) setLogs(data)
    }
    load()
    const ch = supabase.channel(`site-${siteId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'site_logs',filter:`site_id=eq.${siteId}`},(p)=>setLogs(s=>[...s,p.new])).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[siteId])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[logs])

  const sendMessage = async (type='message', photoUrl:any=null) => {
    if(!msg &&!photoUrl) return
    let lat=null, lng=null
    try {
      const pos:any = await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true}))
      lat = pos.coords.latitude
      lng = pos.coords.longitude
    } catch {}
    await supabase.from('site_logs').insert({
      site_id: siteId,
      user_name: currentUser?.name || 'Boss (Supervisor)',
      user_role: currentUser?.role || 'boss',
      type,
      message: msg || (type==='evidence'? 'Photo evidence — Gate locked secured' : ''),
      photo_url: photoUrl,
      gps_lat: lat,
      gps_lng: lng,
      gps_label: lat? `GPS: ${siteName} • ${lat.toFixed(4)}, ${lng.toFixed(4)}` : `GPS: ${siteName}, Gate A • Verified location`
    })
    setMsg('')
  }

  const onPhoto = async (e:any) => {
    const file = e.target.files[0]
    if(!file) return
    setUploading(true)
    const fileName = `${siteId}/${Date.now()}_${file.name}`
    await supabase.storage.from('guardian-chat-media').upload(fileName, file)
    const { data } = supabase.storage.from('guardian-chat-media').getPublicUrl(fileName)
    await sendMessage('evidence', data.publicUrl)
    setUploading(false)
  }

  const fmtTime = (iso:string) => new Date(iso).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

  return (
    <div className="max-w-[440px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-2xl border-[7px] border-black flex flex-col h-[84vh]">
      {/* Green Header */}
      <div className="bg-[#1A8C38] text-white px-5 py-5 flex items-center gap-3">
        <span className="text-2xl">←</span>
        <h1 className="font-black text-[20px] leading-tight flex-1">SITE LOG - {siteName}</h1>
        <span>🔍</span><span>⋯</span>
      </div>
      {/* Sub header */}
      <div className="px-5 py-3 flex justify-between items-center bg-[#F7FAF7] border-b">
        <div className="flex items-center gap-1 font-black text-[13px]">
          <span className="w-6 h-6 bg-white border border-green-700 rounded-full grid place-items-center">🛡️</span>
          <span className="text-[#1A8C38]">MY GUARDIAN</span><span className="text-orange-500"> WORK</span>
        </div>
        <span className="bg-orange-100 text-orange-600 text-[11px] px-3 py-1 rounded-full font-bold">LIVE • Active Site</span>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        <div className="absolute left-[56px] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300" />
        <div className="relative">
          {logs.length===0 && <p className="text-center text-gray-400 text-sm mt-20">No logs yet. First log will appear here like your screenshot.</p>}
          {logs.map((log:any)=>{
            const time = log.created_at? new Date(log.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : log.time || '08:00'
            const isBoss = log.user_role==='boss'
            const isClock = log.type==='clock_in'
            const dot = isBoss? 'bg-orange-400' : 'bg-[#1A8C38]'

            if(isBoss) return (
              <div key={log.id} className="flex gap-3 px-3 py-3">
                <div className="w-[50px] text-[11px] text-gray-500 pt-2">{time}</div>
                <div className={`w-3 h-3 rounded-full ${dot} mt-2 border-2 border-white shadow z-10`} />
                <div className="flex-1 bg-[#FFE9C5] rounded-[16px] rounded-tl-[6px] p-3">
                  <p className="text-[#D86E00] font-bold text-[13px]">{log.user_name}</p>
                  <p className="text-[14px] whitespace-pre-wrap text-black">{log.message}</p>
                  <p className="text-[10px] text-right text-gray-600 mt-2">{fmtTime(log.created_at)} • Seen</p>
                </div>
              </div>
            )
            return (
              <div key={log.id} className="flex gap-3 px-3 py-4">
                <div className="w-[50px] text-[11px] text-gray-500 pt-1">{time}</div>
                <div className={`w-3 h-3 rounded-full ${dot} mt-2 border-2 border-white shadow z-10`} />
                <div className="flex-1 bg-[#F5F5F5] rounded-[16px] rounded-tl-[6px] p-3 shadow-sm">
                  <p className="font-bold text-[15px] text-black flex items-center gap-2">
                    {log.type==='incident'? 'Incident reported • ' : ''}{log.user_name || log.message}
                    {log.type==='incident' && <span className="text-orange-500">Priority</span>}
                  </p>
                  {log.type==='clock_in' && <p className="text-[11px] text-green-700">✓ Clock-in confirmed • {fmtTime(log.created_at)}</p>}
                  {log.type!=='clock_in' && log.type!=='incident' && <p className="text-[14px] mt-1 text-black">{log.message}</p>}
                  {log.photo_url && (
                    <div className="mt-2 flex gap-2 items-center">
                      <img src={log.photo_url} className="w-20 h-20 rounded-lg object-cover border" />
                      <span className="text-[12px] text-gray-600">{fmtTime(log.created_at)} • 1 photo</span>
                    </div>
                  )}
                  {log.gps_label && <div className="bg-[#DFF5DF] text-[#1A8C38] text-[11px] px-2 py-1 rounded-full mt-2 inline-block">📍 {log.gps_label}</div>}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <label className="cursor-pointer text-orange-500 text-[12px] font-bold flex items-center gap-1">📎 Attach evidence<input type="file" hidden accept="image/*" onChange={onPhoto}/></label>
        <div className="flex-1 bg-gray-100 rounded-full px-3 py-1 flex items-center">
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Add note or evidence..." className="flex-1 bg-transparent outline-none text-[13px] text-black" />
          <span className="ml-2">📷</span><span className="ml-2">🎤</span>
        </div>
        <button onClick={()=>sendMessage()} className="bg-[#1A8C38] text-white px-4 py-2 rounded-full text-sm font-bold">Send</button>
      </div>
      {uploading && <p className="text-center text-[11px] text-orange-500 pb-2">Uploading evidence...</p>}
    </div>
  )
                 }
