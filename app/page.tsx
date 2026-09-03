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
  const [history,setHistory]=useState<any[]>([])
  const [showInvoice,setShowInvoice]=useState(true)

  useEffect(()=>{
    const r=localStorage.getItem('gw_rev'); const c=localStorage.getItem('gw_count'); const h=localStorage.getItem('gw_hist')
    if(r) setRev(parseInt(r)); if(c) setCount(parseInt(c)); if(h) setHistory(JSON.parse(h))
    load()
  },[])
  useEffect(()=>{localStorage.setItem('gw_rev',rev.toString()); localStorage.setItem('gw_count',count.toString()); localStorage.setItem('gw_hist',JSON.stringify(history))},[rev,count,history])

  async function load(){
    const a=await supabase.from('people').select('*').order('created_at',{ascending:false})
    if(a.data)setPeople(a.data)
    const b=await supabase.from('jobs').select('*').order('created_at',{ascending:false})
    if(b.data)setJobs(b.data)
  }
  async function addP(){if(!name)return; await supabase.from('people').insert([{full_name:name,phone:phone,capability:'Driver',status:'Available'}]); setName('');setPhone('');load()}
  async function addJ(){if(!title)return; await supabase.from('jobs').insert([{title:title,company:company,location:'Soweto',pay:'R250',status:'Open'}]); setTitle('');setCompany('');load()}
  async function delJob(id:string){await supabase.from('jobs').delete().eq('id',id); load()}
  function place(p:any){
    const newRev=rev+250; const newCount=count+1
    const entry={worker:p.full_name, job:sel.title, company:sel.company, fee:250, date:new Date().toLocaleDateString(), phone:p.phone}
    setRev(newRev); setCount(newCount); setHistory([entry,...history])
    setSel(null)
  }
  function waInvoice(){
    let txt=`*GUARDIAN WORK INVOICE*%0A%0A`
    history.forEach((h,i)=>{ txt+=`${i+1}. ${h.worker} → ${h.company} = R${h.fee}%0A` })
    txt+=`%0A*TOTAL DUE: R${rev}*%0ACapitec 0768353716%0ASibusiso Tau`
    return `https://wa.me/27768353716?text=${txt}`
  }
  function genText(){let t=`GUARDIAN WORK INVOICE\n`; history.forEach((h,i)=>t+=`${i+1}. ${h.worker} -> ${h.company} R${h.fee}\n`); t+=`TOTAL R${rev}\nCapitec 0768353716`; return t}

  return(
    <div className="min-h-screen bg-black p-3 pb-28">
      <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-[24px] p-5 mb-3">
        <div className="flex justify-between"><div><p className="text-black/60 text-[10px] font-black">TOTAL REVENUE</p><p className="text-black text-[36px] font-black leading-none">R{rev}</p><p className="text-black/70 text-[10px] font-bold mt-1">CAPITEC 0768353716</p></div><div className="text-right"><p className="text-black/60 text-[10px] font-black">PLACEMENTS</p><p className="text-black text-[28px] font-black">{count}</p><div className="bg-black text-green-400 text-[9px] px-2 py-1 rounded-full font-black mt-1">V8.0 ● PAY</div></div></div>
        <div className="flex gap-2 mt-3">
          <button onClick={()=>setShowInvoice(!showInvoice)} className="bg-black text-white text-[11px] font-bold px-4 py-2 rounded-full">📄 Invoice</button>
          <a href={waInvoice()} target="_blank" className="bg-white text-black text-[11px] font-bold px-4 py-2 rounded-full">💬 Send via WhatsApp</a>
          <button onClick={()=>{if(confirm('Reset revenue?')){setRev(0);setCount(0);setHistory([])}}} className="bg-black/20 text-black text-[10px] font-bold px-3 py-2 rounded-full">Reset</button>
        </div>
      </div>

      {showInvoice&&<div className="bg-white rounded-[20px] p-4 mb-3 text-black">
        <div className="flex justify-between"><h2 className="font-black text-sm">INVOICE</h2><span className="text-[10px] bg-black text-white px-2 py-1 rounded-full">DUE NOW</span></div>
        <p className="text-[10px] text-zinc-500">{new Date().toLocaleDateString()} • Guardian Work (Pty) Ltd</p>
        <div className="mt-2 border-t pt-2">{history.map((h,i)=><div key={i} className="flex justify-between text-[11px] py-1.5 border-b"><span>{h.worker} → {h.company} ({h.job})</span><span className="font-black">R{h.fee}</span></div>)}
        {history.length===0&&<p className="text-[11px] text-zinc-400 py-2">Place a worker to generate invoice</p>}</div>
        <div className="flex justify-between items-center mt-3"><p className="font-black">TOTAL R{rev}</p><button onClick={()=>{navigator.clipboard.writeText(genText()); alert('Copied!')}} className="text-[10px] bg-zinc-100 px-3 py-1.5 rounded-full font-bold">Copy Text</button></div>
        <p className="text-[9px] text-zinc-500 mt-2">Pay: Capitec • S Tau • 0768353716 • Ref: GW{count}</p>
      </div>}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#151515] border border-zinc-900 rounded-[20px] p-3"><p className="text-white font-bold text-[11px] mb-2">+ Worker</p><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs mb-2"/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="071..." className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs mb-2"/><button onClick={addP} className="w-full bg-white text-black font-black rounded-xl p-3 text-xs">Save Worker →</button></div>
        <div className="bg-[#151515] border border-zinc-900 rounded-[20px] p-3"><p className="text-white font-bold text-[11px] mb-2">+ Client Job</p><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Driver / Cleaner" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs mb-2"/><input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Shoprite / Boxer" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs mb-2"/><button onClick={addJ} className="w-full bg-green-400 text-black font-black rounded-xl p-3 text-xs">Post Job +R250 →</button></div>
      </div>

      <div className="bg-[#151515] border border-zinc-900 rounded-[20px] p-3 mt-3"><p className="text-white font-bold text-[11px]">Client Jobs - Tap to Place & Hold to Delete 👇 ({jobs.length})</p>{jobs.map((j:any)=><div key={j.id} onClick={()=>setSel(j)} onDoubleClick={()=>delJob(j.id)} className={`rounded-xl p-3 mt-2 border cursor-pointer flex justify-between ${sel?.id===j.id?'bg-green-500/20 border-green-400':'bg-black border-zinc-800'}`}><div><p className="text-white text-xs font-bold">{j.title} @ {j.company}</p><p className="text-zinc-500 text-[10px]">R250 fee • {j.location} • Double-tap to delete</p></div><span className="text-[10px] text-zinc-600">→</span></div>)}</div>

      {sel&&<div className="bg-green-400 rounded-[20px] p-3 mt-3 sticky bottom-3 shadow-2xl">
        <p className="text-black font-black text-sm">PLACE TO {sel.company?.toUpperCase()} 💰 FEE R250</p>
        {people.slice(0,5).map((p:any)=><div key={p.id} className="bg-black rounded-xl p-3 mt-2 flex justify-between items-center"><div><p className="text-white text-xs font-bold">{p.full_name}</p><p className="text-zinc-400 text-[10px]">{p.phone}</p></div><button onClick={()=>place(p)} className="bg-white text-black text-[10px] px-5 py-2.5 rounded-full font-black">PLACE +R250</button></div>)}
        <button onClick={()=>setSel(null)} className="w-full mt-2 text-black/60 text-[10px] font-bold">Cancel</button>
      </div>}
    </div>
  )
}
