'use client'
import { useEffect as E } from 'react'
import { useState as S } from 'react'
import { useRef as R } from 'react'
import { createClient as C } from '@supabase/supabase-js'

const supa = C(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SiteLogTimeline(p:any){
 const [logs,setLogs]=S<any[]>([])
 const [msg,setMsg]=S('')
 const [up,setUp]=S(false)
 const bot=R<HTMLDivElement>(null)
 E(()=>{
  const get=async()=>{
   const {data}=await supa.from('site_logs').select('*').eq('site_id',p.siteId).order('created_at',{ascending:true})
   if(data)setLogs(data)
  }
  get()
  const ch=supa.channel('s-'+p.siteId).on('postgres_changes',{event:'INSERT',schema:'public',table:'site_logs',filter:`site_id=eq.${p.siteId}`},(pl:any)=>setLogs(s=>[...s,pl.new])).subscribe()
  return()=>{supa.removeChannel(ch)}
 },[p.siteId])
 const send=async(t='message',photo=null)=>{
  if(!msg&&!photo)return
  let lat=null,lng=null
  try{
   const pos:any=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej))
   lat=pos.coords.latitude
   lng=pos.coords.longitude
  }catch{}
  await supa.from('site_logs').insert({site_id:p.siteId,user_name:p.currentUser?.name||'Boss',user_role:p.currentUser?.role||'boss',type:t,message:msg,photo_url:photo,gps_lat:lat,gps_lng:lng})
  setMsg('')
 }
 const onPhoto=async(e:any)=>{
  setUp(true)
  const f=e.target.files[0]
  const n=`${p.siteId}/${Date.now()}_${f.name}`
  await supa.storage.from('guardian-chat-media').upload(n,f)
  const {data}=supa.storage.from('guardian-chat-media').getPublicUrl(n)
  await send('evidence',data.publicUrl)
  setUp(false)
 }
 return(
  <div className="flex flex-col h-[70vh] bg-white text-black rounded-2xl border">
   <div className="bg-green-700 text-white p-3 text-sm font-bold">SITE LOG LIVE</div>
   <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
    {logs.map((l:any)=><div key={l.id} className="bg-white p-3 rounded-xl shadow text-sm"><b className="text-[10px]">{l.user_name}</b><p>{l.message}</p>{l.photo_url&&<img src={l.photo_url} className="mt-2 rounded max-w-[200px]"/>}</div>)}
    <div ref={bot}/>
   </div>
   <div className="p-3 border-t flex gap-2">
    <label>📎<input type="file" hidden onChange={onPhoto}/></label>
    <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Note..." className="flex-1 border rounded-full px-4 py-2 text-sm"/>
    <button onClick={()=>send()} className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">Send</button>
   </div>
  </div>
 )
}
