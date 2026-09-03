"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Page(){
  const [view,setView]=useState("home");
  const [people,setPeople]=useState<any[]>([]);
  const [jobs,setJobs]=useState<any[]>([]);
  const [rev,setRev]=useState(0);
  const [cnt,setCnt]=useState(0);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [company,setCompany]=useState("");
  const [role,setRole]=useState("");

  useEffect(()=>{
    const r=localStorage.getItem("gw_rev");
    const c=localStorage.getItem("gw_cnt");
    if(r) setRev(parseInt(r));
    if(c) setCnt(parseInt(c));
    load();
  },[]);

  async function load(){
    const p=await supabase.from("people").select("*").order("created_at",{ascending:false}).limit(20);
    if(p.data) setPeople(p.data);
    const j=await supabase.from("jobs").select("*").order("created_at",{ascending:false}).limit(20);
    if(j.data) setJobs(j.data);
  }

  async function addWorker(){
    if(!name) return;
    await supabase.from("people").insert([{full_name:name, phone, status:"available"}]);
    setName(""); setPhone(""); load();
  }

  async function addJob(){
    if(!company) return;
    await supabase.from("jobs").insert([{company, role:role||"General Worker", status:"open"}]);
    setCompany(""); setRole(""); load();
  }

  function place(job:any){
    const newRev=rev+250;
    const newCnt=cnt+1;
    setRev(newRev); setCnt(newCnt);
    localStorage.setItem("gw_rev",String(newRev));
    localStorage.setItem("gw_cnt",String(newCnt));
  }

  function invoice(){
    let msg="*GUARDIAN WORK INVOICE*%0A%0A";
    jobs.slice(0,5).forEach((j:any,i:number)=>{msg+=`${i+1}. ${j.role} @ ${j.company} = R250%0A`});
    msg+=`%0A*TOTAL: R${rev || jobs.length*250}*%0ACapitec 0768353716%0ARef: GW${cnt}`;
    window.open(`https://wa.me/?text=${msg}`,"_blank");
  }

  return(
    <div className="min-h-screen bg-white">
      <div className="flex justify-between p-4 border-b bg-white sticky top-0 z-10">
        <div className="bg-[#0B4D2E] text-white font-black text-[10px] px-2 py-1 rounded">MY GUARDIAN LINK</div>
        <button onClick={()=>setView(view==="home"?"admin":"home")} className="bg-[#FF9F1C] text-black font-black text-xs px-5 py-2 rounded-full">{view==="home"?"I'm Hiring":"Home"}</button>
      </div>

      {view==="home"?(
        <div>
          <div className="bg-[#0E5A32] p-6 text-white">
            <p className="text-[#FF9F1C] text-[11px] font-black tracking-widest">MY GUARDIAN LINK PRESENTS</p>
            <h1 className="text-[34px] font-black leading-9 mt-3">Find Work. Find People. Faster.</h1>
            <p className="text-sm mt-3 opacity-80">GUARDIAN WORK connects local people with employers — from welders in Secunda to cashiers in Pretoria West.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setView("admin")} className="bg-white text-black font-black text-xs px-5 py-3 rounded-full">I Need Work</button>
              <button onClick={()=>setView("admin")} className="bg-[#FF9F1C] text-black font-black text-xs px-5 py-3 rounded-full">I'm Hiring</button>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 mt-7">
              <p className="text-[#FF9F1C] text-[11px] font-black">LIVE TALENT POOL</p>
              <p className="text-3xl font-black mt-2">{people.length||243}</p>
              <p className="text-xs opacity-90">People ready for work in Pretoria West</p>
              <div className="bg-black text-white rounded-xl p-3 mt-3 flex justify-between"><span className="text-xs">YOUR REVENUE</span><span className="font-black text-green-400">R{rev}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F5F5] pb-20">
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px]">Profiles Available</p><p className="font-black mt-4">{people.length||"—"}</p></div>
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px]">Local Areas</p><p className="font-black mt-1">14</p></div>
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px]">Jobs Open</p><p className="font-black mt-1">{jobs.length}</p></div>
            <div className="bg-white rounded-xl p-4 border"><p className="text-[11px]">Verified Employers</p><p className="font-black mt-1">{cnt}</p></div>
          </div>
        </div>
      ):(
        <div className="bg-black min-h-screen p-4 pb-20">
          <div className="bg-[#151515] rounded-2xl p-4 border border-zinc-800">
            <p className="text-white font-black">ADMIN V9.1 - R{rev} ({cnt} placements)</p>
            <div className="flex gap-2 mt-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Worker name" className="flex-1 bg-zinc-900 text-white p-2 rounded text-xs"/>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-24 bg-zinc-900 text-white p-2 rounded text-xs"/>
              <button onClick={addWorker} className="bg-white text-black font-black px-3 rounded text-xs">+Add</button>
            </div>
            <div className="flex gap-2 mt-2">
              <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company Boxer" className="flex-1 bg-zinc-900 text-white p-2 rounded text-xs"/>
              <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role Driver" className="w-24 bg-zinc-900 text-white p-2 rounded text-xs"/>
              <button onClick={addJob} className="bg-orange-400 text-black font-black px-3 rounded text-xs">+Job</button>
            </div>
            <button onClick={invoice} className="w-full bg-green-500 text-black font-black py-3 rounded-full mt-4 text-xs">💬 Send Invoice via WhatsApp - R{rev}</button>
          </div>

          <p className="text-white font-black mt-5 text-xs">TAP TO PLACE +R250 (Double-tap to delete later)</p>
          <div className="mt-2 space-y-2">
            {jobs.map((j:any)=>(
              <div key={j.id} onClick={()=>place(j)} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex justify-between">
                <div><p className="text-white text-xs font-bold">{j.role} @ {j.company}</p><p className="text-zinc-500 text-[10px]">{j.status}</p></div>
                <div className="bg-green-500 text-black font-black text-[10px] px-3 py-1 rounded-full h-fit">PLACE +R250</div>
              </div>
            ))}
          </div>

          <p className="text-white font-black mt-5 text-xs">WORKERS ({people.length})</p>
          <div className="mt-2 space-y-2">
            {people.map((p:any)=>(
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl"><p className="text-white text-xs">{p.full_name} - {p.phone}</p></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
