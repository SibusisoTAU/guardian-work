"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Page(){
  const [people,setPeople]=useState<any[]>([])
  const [jobs,setJobs]=useState<any[]>([])
  const [sel,setSel]=useState<any>(null)
  const [name,setName]=useState("")
  const [phone,setPhone]=useState("")
  const [title,setTitle]=useState("")
  const [company,setCompany]=useState("")
  const [rev,setRev]=useState(0)
  const [count,setCount]=useState(0)

  useEffect(()=>{load()},[])
  async function load(){
    const a=await supabase.from('people').select('*')
    if(a.data)setPeople(a.data)
    const b=await supabase.from('jobs').select('*')
    if(b.data)setJobs(b.data)
  }
  async function addP(){
    if(!name)return
    await supabase.from('people').insert([{full_name:name,phone:phone,capability:'Driver',status:'Available'}])
    setName('');setPhone('');load()
  }
  async function addJ(){
    if(!title)return
    await supabase.from('jobs').insert([{title:title,company:company,location:'Soweto',pay:'R250',status:'Open'}])
    setTitle('');setCompany('');load()
  }
  function place(p:any){
    setRev(rev+250)
    setCount(count+1)
    alert('PLACED '+p.full_name+' +R250 REVENUE R'+(rev+250))
    setSel(null)
  }
  function wa(p:any){
    let ph=(p.phone||'').replace(/\D/g,'')
    if(ph.startsWith('0'))ph='27'+ph.slice(1)
    return 'https://wa.me/'+ph
  }

  return(
    <div className="min-h-screen bg-black p-3">
      <div className="bg-green-400 rounded-2xl p-4 mb-3">
        <p className="text-black text-xs">TOTAL REVENUE</p>
        <p className="text-black text-3xl font-black">R{rev}</p>
        <p className="text-black text-xs">PLACEMENTS {count} LIVE</p>
      </div>
      <h1 className="text-white font-black">GUARDIAN WORK V6.3</h1>
      <div className="bg-zinc-900 rounded-xl p-3 mt-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full bg-black text-white p-2 rounded mb-2"/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full bg-black text-white p-2 rounded mb-2"/>
        <button onClick={addP} className="bg-white text-black w-full p-2 rounded font-bold">Save Person</button>
      </div>
      <div className="bg-zinc-900 rounded-xl p-3 mt-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Job Title" className="w-full bg-black text-white p-2 rounded mb-2"/>
        <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="w-full bg-black text-white p-2 rounded mb-2"/>
        <button onClick={addJ} className="bg-green-400 text-black w-full p-2 rounded font-bold">Post Job</button>
      </div>
      <div className="bg-zinc-900 rounded-xl p-3 mt-3">
        <p className="text-white text-xs">People {people.length}</p>
        {people.map((p:any)=><div key={p.id} className="bg-black p-2 mt-2 rounded"><p className="text-white text-xs">{p.full_name} {p.phone}</p></div>)}
      </div>
      <div className="bg-zinc-900 rounded-xl p-3 mt-3">
        <p className="text-white text-xs">Jobs Tap to Match</p>
        {jobs.map((j:any)=><div key={j.id} onClick={()=>setSel(j)} className="bg-black p-2 mt-2 rounded border border-zinc-800"><p className="text-white text-xs">{j.title} @ {j.company}</p></div>)}
      </div>
      {sel&&<div className="bg-green-400 rounded-xl p-3 mt-3">
        <p className="text-black font-bold">MATCH {sel.title}</p>
        {people.map((p:any)=><div key={p.id} className="bg-black p-2 mt-2 rounded flex justify-between"><p className="text-white text-xs">{p.full_name}</p><div className="flex gap-2"><a href={wa(p)} target="_blank" className="bg-zinc-800 text-white px-2 py-1 rounded text-xs">WA</a><button onClick={()=>place(p)} className="bg-green-400 text-black px-2 py-1 rounded text-xs font-bold">PLACED +R250</button></div></div>)}
      </div>}
    </div>
  )
}
