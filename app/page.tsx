"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Page(){
  const [people,setPeople]=useState<any[]>([])
  const [jobs,setJobs]=useState<any[]>([])
  const [view,setView]=useState('home')
  const [rev,setRev]=useState(0)
  const [count,setCount]=useState(0)

  useEffect(()=>{
    const r=localStorage.getItem('gw_rev')
    const c=localStorage.getItem('gw_count')
    if(r) setRev(parseInt(r))
    if(c) setCount(parseInt(c))
    load()
  },[])

  async function load(){
    const a=await supabase.from('people').select('*').order('created_at',{ascending:false})
    if(a.data) setPeople(a.data)
    const b=await supabase.from('jobs').select('*').order('created_at',{ascending:false})
    if(b.data) setJobs(b.data)
  }

  return(
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-50 border-b">
        <div className="flex items-center gap-1">
          <div className="bg-[#0B4D2E] text-white font-black px-2 py-1 rounded text-[10px]">MY GUARDIAN LINK</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setView(view==='home'?'admin':'home')} className="bg-[#FF9F1C] text-black font-black text-[13px] px-5 py-2.5 rounded-full">{view==='home'?"I'm Hiring":"Back Home"}</button>
          <span className="text-xl">🔔</span>
        </div>
      </div>

      {view==='home'?(
        <div>
          <div className="bg-[#0E5A32] px-5 pt-8 pb-10 text-white">
            <p className="text-[#FF9F1C] text-[11px] font-black tracking-[3px]">MY GUARDIAN LINK PRESENTS</p>
            <h1 className="text-[36px] font-black leading-[38px] mt-3">Find Work. Find People. Faster.</h1>
            <p className="text-white/80 text-[14px] mt-4">GUARDIAN WORK connects local people looking for work with employers looking for people like them — from welders in Secunda to cashiers in Pretoria West.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setView('admin')} className="bg-white text-black font-black text-[13px] px-6 py-3 rounded-full">I Need Work</button>
              <button onClick={()=>setView('admin')} className="bg-[#FF9F1C] text-black font-black text-[13px] px-6 py-3 rounded-full">I'm Hiring</button>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-[24px] p-5 mt-8">
              <p className="text-[#FF9F1C] font-black text-[11px]">LIVE TALENT POOL</p>
              <p className="text-[28px] font-black mt-3">{people.length>0?people.length:243}</p>
              <p className="text-white/80 text-[13px]">People ready for work in Pretoria West</p>
              <div className="bg-white/10 rounded-xl p-3 mt-4">
                <p className="text-[12px]">New local profiles are joining every day.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F5F5]">
            <div className="bg-white rounded-[18px] p-4 border"><p className="text-[11px] text-zinc-500">Profiles Available</p><p className="text-[#0B4D2E] font-black text-xl mt-6">—</p></div>
            <div className="bg-white rounded-[18px] p-4 border"><p className="text-[11px] text-zinc-500">Local Areas</p><p className="text-[#0B4D2E] font-black text-xl mt-1">14</p></div>
            <div className="bg-white rounded-[18px] p-4 border"><p className="text-[11px] text-zinc-500">Job Categories</p><p className="text
