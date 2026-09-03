"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Page(){
  const [people,setPeople]=useState<any[]>([])
  const [jobs,setJobs]=useState<any[]>([])
  const [selectedJob,setSelectedJob]=useState<any>(null)
  const [form,setForm]=useState({full_name:"",phone:"",capability:"Driver"})
  const [jobForm,setJobForm]=useState({title:"",company:"",location:"Soweto",pay:"250"})
  const [revenue,setRevenue]=useState(0)
  const [placements,setPlacements]=useState(0)

  useEffect(()=>{load()},[])
  const load=async()=>{
    const p=await supabase.from('people').select('*').order('created_at',{ascending:false})
    if(p.data)setPeople(p.data)
    const j=await supabase.from('jobs').select('*').order('created_at',{ascending:false})
    if(j.data)setJobs(j.data)
  }
  const addPerson=async()=>{
    if(!form.full_name)return
    await supabase.from('people').insert([{...form,status:'Available'}])
    setForm({full_name:"",phone:"",capability:"Driver"})
    load()
  }
  const addJob=async()=>{
    if(!jobForm.title||!jobForm.company)return
    await supabase.from('jobs').insert([{title:jobForm.title,company:jobForm.company,location:jobForm.location,pay:'R'+jobForm.pay,status:'Open'}])
    setJobForm({title:"",company:"",location:"Soweto",pay:"250"})
    load()
  }
  const delP=async(id:any)=>{await supabase.from('people').delete().eq('id',id);load()}
  const delJ=async(id:any)=>{await supabase.from('jobs').delete().eq('id',id);setSelectedJob(null);load()}

  const getLink=(p:any)=>{
    if(!selectedJob) return "#"
    let ph=(p.phone||"").replace(/\D/g,'')
    if(ph.startsWith('0')) ph='27'+ph.slice(1)
    if(!ph.startsWith('27')) ph='27'+ph
    const msg="Hi "+p.full_name+" Guardian Work: "+selectedJob.title+" at "+selectedJob.company+" "+selectedJob.location+" "+selectedJob.pay+" Available? Reply YES"
    return "https://api.whatsapp.com/send?phone="+ph+"&text="+encodeURIComponent(msg)
  }

  const doPlace=async(person:any)=>{
    const fee=parseInt((selectedJob.pay||'250').replace('R',''))
    setRevenue(revenue+fee)
    setPlacements(placements+1)
    await supabase.from('people').update({status:'Placed'}).eq('id',person.id)
    await supabase.from('jobs').update({status:'Filled'}).eq('id',selectedJob.id)
    alert('PLACED! '+person.full_name+' -> '+selectedJob.company+' +R'+fee)
    setSelectedJob(null)
    load()
  }

  return(
    <div className="min-h-screen bg-black p-3 pb-24">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-[20px] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div><p className="text-black/60 text-[10px] font-bold">TOTAL REVENUE</p><p className="text-black text-2xl font-black">R{revenue}</p></div>
          <div className="text-right"><p className="text-black/60 text-[10px] font-bold">PLACEMENTS</p><p className="text-black text-2xl font-black">{placements}</p></div>
          <div className="bg-black rounded-full px-3 py-1"><p className="text-green-400 text-xs font-black">LIVE</p></div>
        </div>
      </div>
      <h1 className="text-white font-black">GUARDIAN WORK V6.2 💰</h1>
      <p className="text-green-400 text-[10px] mb-3">MONEY ENGINE FIXED</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded-[20px] p-3">
          <p className="text-white font-bold text-xs mb-2">+ Person</p>
          <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Name" className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white text-xs mb-1.5"/>
          <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="071..." className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white text-xs mb-1.5"/>
          <select value={form
