"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Page(){
  const [people,setPeople]=useState<any[]>([])
  const [jobs,setJobs]=useState<any[]>([])
  const [selectedJob,setSelectedJob]=useState<any>(null)
  const [form,setForm]=useState({full_name:"",phone:"",capability:"Driver"})
  const [jobForm,setJobForm]=useState({title:"",company:"",location:"Soweto",pay:""})

  useEffect(()=>{fetchPeople();fetchJobs()},[])

  const fetchPeople=async()=>{
    const {data}=await supabase.from('people').select('*').order('created_at',{ascending:false})
    if(data)setPeople(data)
  }
  const fetchJobs=async()=>{
    const {data}=await supabase.from('jobs').select('*').order('created_at',{ascending:false})
    if(data)setJobs(data)
  }
  const addPerson=async()=>{
    if(!form.full_name)return
    await supabase.from('people').insert([{...form,status:'Available'}])
    setForm({full_name:"",phone:"",capability:"Driver"})
    fetchPeople()
  }
  const addJob=async()=>{
    if(!jobForm.title||!jobForm.company)return
    await supabase.from('jobs').insert([{...jobForm,status:'Open'}])
    setJobForm({title:"",company:"",location:"Soweto",pay:""})
    fetchJobs()
  }
  const delP=async(id:string)=>{await supabase.from('people').delete().eq('id',id); fetchPeople()}
  const delJ=async(id:string)=>{await supabase.from('jobs').delete().eq('id',id); fetchJobs(); setSelectedJob(null)}

  const getWaLink=(p:any)=>{
    if(!selectedJob) return "#"
    let ph = (p.phone||"").replace(/\D/g,'')
    if(ph.startsWith('0')) ph = '27'+ph.slice(1)
    if(ph.length===9) ph = '27'+ph
    if(!ph.startsWith('27')) ph = '27'+ph
    const txt = `Hi ${p.full_name} 👋 Guardian Work:\n*${selectedJob.title}* at *${selectedJob.company}*\n${selectedJob.location} • ${selectedJob.pay}\n\nAvailable? Reply YES`
    return `https://api.whatsapp.com/send?phone=${ph}&text=${encodeURIComponent(txt)}`
  }

  return(
    <div className="min-h-screen bg-black p-4 pb-24">
      <h1 className="text-white text-xl font-black">GUARDIAN WORK V5.7</h1>
      <p className="text-green-400 text-xs mb-4">● WHATSAPP API FIX</p>
      <div className="bg-[#1a1a1a] rounded-[20px] p-4">
        <h2 className="text-white font-bold mb-2">+ Add Person</h2>
        <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Full Name" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Friend's number e.g. 0712345678" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <select value={form.capability} onChange={e=>setForm({...form,capability:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"><option>Driver</option><option>General Worker</option><option>Cleaner</option><option>Retail</option></select>
        <button onClick={addPerson} className="w-full bg-white text-black font-bold rounded-xl p-3">Save →</button>
      </div>
      <div className="bg-[#1a1a1a] rounded-[20px] p-4 mt-4"><h2 className="text-white font-bold">People ({people.length})</h2>{people.map((p:any)=><div key={p.id} className="bg-black border border-zinc-800 rounded-xl p-3 mt-2 flex justify-between"><div><p className="text-white text-sm font-bold">{p.full_name}</p><p className="text-zinc-500 text-xs">{p.capability} • {p.phone}</p></div><button onClick={()=>delP(p.id)} className="text-zinc-600">X</button></div>)}</div>
      <div className="bg-[#1a1a1a] rounded-[20px] p-4 mt-4 border border-green-900/30">
        <h2 className="text-white font-bold mb-2">+ Add Job</h2>
        <input value={jobForm.title} onChange={e=>setJobForm({...jobForm,title:e.target.value})} placeholder="Title e.g. Driver" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <input value={jobForm.company} onChange={e=>setJobForm({...jobForm,company:e.target.value})} placeholder="Company" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <input value={jobForm.location} onChange={e=>setJobForm({...jobForm,location:e.target.value})} placeholder="Soweto" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <input value={jobForm.pay} onChange={e=>setJobForm({...jobForm,pay:e.target.value})} placeholder="R250" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
        <button onClick={addJob} className="w-full bg-green-400 text-black font-bold rounded-xl p-3">Save Job →</button>
      </div>
      <div className="bg-[#1a1a1a] rounded-[20px] p-4 mt-4"><h2 className="text-white font-bold">Jobs ({jobs.length}) - Tap to Match 👇</h2>{jobs.map((j:any)=><div key={j.id} onClick={()=>setSelectedJob(j)} className={`border rounded-xl p-3 mt-2 ${selectedJob?.id===j.id?'bg-green-900/30 border-green-400':'bg-black border-zinc-800'}`}><div className="flex justify-between"><div><p className="text-white text-sm font-bold">{j.title} • {j.company}</p><p className="text-zinc-500 text-xs">{j.location} • {j.pay}</p></div><button onClick={(e)=>{e.stopPropagation(); delJ(j.id)}} className="text-zinc-600">X</button></div></div>)}</div>
      {selectedJob&&<div className="bg-green-400 rounded-[20px] p-4 mt-4"><h2 className="text-black font-black">MATCH: {selectedJob.title} @ {selectedJob.company}</h2><p className="text-black/70 text-xs mb-2">Test with a FRIEND'S number, not your own!</p>{people.map((p:any)=>{const link=getWaLink(p); return(<div key={p.id} className="bg-black rounded-xl p-3 mt-2 flex justify-between items-center"><div><p className="text-white text-sm font-bold">{p.full_name}</p><p className="text-zinc-500 text-xs">{p.phone}</p><p className="text-green-400 text-[10px]">→ {link.includes('277')?'277... READY':'Fix number'}</p></div><a href={link} target="_blank" rel="noopener noreferrer" className="bg-green-400 text-black font-black text-xs px-5 py-3 rounded-full">WhatsApp →</a></div>)})}</div>}
    </div>
  )
}
