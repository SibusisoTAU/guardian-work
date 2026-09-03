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
  const [area,setArea]=useState("");
  const [company,setCompany]=useState("");
  const [role,setRole]=useState("");

  useEffect(()=>{
    const r=localStorage.getItem("gw_rev"); const c=localStorage.getItem("gw_cnt");
    if(r) setRev(parseInt(r)); if(c) setCnt(parseInt(c));
    load();
  },[]);
  async function load(){
    const p=await supabase.from("people").select("*").order("created_at",{ascending:false});
    if(p.data) setPeople(p.data);
    const j=await supabase.from("jobs").select("*").order("created_at",{ascending:false});
    if(j.data) setJobs(j.data);
  }
  async function addWorker(){
    if(!name ||!phone) {alert("Add name + phone"); return;}
    await supabase.from("people").insert([{full_name:name, phone, area:area||"Pretoria West", status:"available"}]);
    alert("Profile created! Employers will see you.");
    setName(""); setPhone(""); setArea(""); setView("home"); load();
  }
  async function addJob(){
    if(!company) {alert("Add company"); return;}
    await supabase.from("jobs").insert([{company, role:role||"General Worker", status:"open"}]);
    alert("Job posted! Workers will see it.");
    setCompany(""); setRole(""); setView("home"); load();
  }
  function place(){
    const nR=rev+250, nC=cnt+1; setRev(nR); setCnt(nC);
    localStorage.setItem("gw_rev",String(nR)); localStorage.setItem("gw_cnt",String(nC));
  }
  function invoice(){
    let msg=`*GUARDIAN WORK INVOICE*%0A%0A`; jobs.slice(0,3).forEach((j:any,i:number)=>{msg+=`${i+1}. ${j.role} @ ${j.company} = R250%0A`});
    msg+=`%0A*TOTAL: R${rev||250}*%0ACapitec 0768353716%0ARef: GW${cnt||1}`; window.open(`https://wa.me/?text=${msg}`,"_blank");
  }

  return(
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="flex justify-between items-center p-3 bg-white sticky top-0 z-20 border-b">
        <div onClick={()=>setView("home")} className="bg-[#0B4D2E] text-white font-black text-[10px] px-3 py-2 rounded cursor-pointer">MY GUARDIAN LINK</div>
        <div className="flex gap-2">
          <button onClick={()=>setView("home")} className={`text-xs font-bold px-4 py-2 rounded-full ${view==="home"?"bg-[#0B4D2E] text-white":"bg-zinc-100"}`}>Home</button>
          <button onClick={()=>setView("admin")} className="bg-black text-white text-[10px] px-3 py-2 rounded-full">ADMIN R{rev}</button>
        </div>
      </div>

      {view==="home" && (
        <div>
          <div className="bg-[#0E5A32] p-6 text-white">
            <p className="text-[#FF9F1C] text-[11px] font-black tracking-[3px]">MY GUARDIAN LINK PRESENTS</p>
            <h1 className="text-[34px] font-black leading-9 mt-3">Find Work.<br/>Find People.<br/>Faster.</h1>
            <p className="text-sm mt-3 opacity-80">From welders in Secunda to cashiers in Pretoria West — we connect you in 24hrs.</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={()=>setView("seekers")} className="bg-white text-black font-black text-[13px] py-4 rounded-full">I Need Work</button>
              <button onClick={()=>setView("employers")} className="bg-[#FF9F1C] text-black font-black text-[13px] py-4 rounded-full">I'm Hiring</button>
            </div>
            <div className="bg-white/10 rounded-[24px] p-5 mt-7 border border-white/10">
              <p className="text-[#FF9F1C] text-[11px] font-black">🔴 LIVE TALENT POOL</p>
              <p className="text-4xl font-black mt-2">{people.length||1} People</p>
              <p className="text-xs opacity-90">{jobs.length} Jobs Open • {cnt} Placed</p>
              <div className="bg-white/10 rounded-xl p-3 mt-3"><p className="text-[11px]">⚡ New profiles joining every day in Pretoria West</p></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="bg-white rounded-2xl p-4 border"><p className="text-[11px] text-zinc-500">Profiles</p><p className="text-2xl font-black text-[#0B4D2E] mt-4">{people.length}</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-[11px] text-zinc-500">Jobs</p><p className="text-2xl font-black text-[#0B4D2E] mt-4">{jobs.length}</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-[11px] text-zinc-500">Areas</p><p className="text-2xl font-black text-[#0B4D2E] mt-4">14</p></div>
            <div className="bg-white rounded-2xl p-4 border"><p className="text-[11px] text-zinc-500">Revenue</p><p className="text-2xl font-black text-green-600 mt-4">R{rev}</p></div>
          </div>
          <div className="p-4 pb-20">
            <p className="font-black text-sm">Recent Jobs</p>
            <div className="mt-2 space-y-2">
              {jobs.slice(0,3).map((j:any)=>(<div key={j.id} className="bg-white p-3 rounded-xl border flex justify-between"><div><p className="font-bold text-sm">{j.role}</p><p className="text-xs text-zinc-500">@ {j.company}</p></div><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full h-fit">Open</span></div>))}
            </div>
          </div>
        </div>
      )}

      {view==="seekers" && (
        <div className="bg-white min-h-screen p-5">
          <p className="text-[#0B4D2E] font-black text-[11px] tracking-widest">FOR JOB SEEKERS</p>
          <h1 className="text-2xl font-black mt-2">Find Work Near You</h1>
          <p className="text-sm text-zinc-500 mt-1">Get hired in 24hrs. No CV needed.</p>
          <div className="bg-[#F5F5F5] rounded-2xl p-4 mt-5">
            <p className="font-bold text-sm">Create Your Profile</p>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name - e.g. Sibusiso Tau" className="w-full mt-3 p-3 rounded-xl border text-sm"/>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="WhatsApp - e.g. 076 835 3716" className="w-full mt-2 p-3 rounded-xl border text-sm"/>
            <input value={area} onChange={e=>setArea(e.target.value)} placeholder="Area - e.g. Pretoria West" className="w-full mt-2 p-3 rounded-xl border text-sm"/>
            <button onClick={addWorker} className="w-full bg-[#0B4D2E] text-white font-black py-4 rounded-full mt-4 text-sm">Create Profile - It's FREE</button>
            <p className="text-[10px] text-zinc-500 text-center mt-2">Employers will contact you via WhatsApp</p>
          </div>
          <div className="mt-6">
            <p className="font-black text-sm">Jobs You Can Apply For</p>
            <div className="mt-3 space-y-2">
              {jobs.map((j:any)=>(<div key={j.id} className="border p-4 rounded-2xl flex justify-between items-center"><div><p className="font-bold text-sm">{j.role} @ {j.company}</p><p className="text-xs text-zinc-500">Pretoria West • R250 placement</p></div><button onClick={()=>alert("Applied! We will WhatsApp you: "+phone)} className="bg-black text-white text-xs px-4 py-2 rounded-full">Apply</button></div>))}
            </div>
          </div>
        </div>
      )}

      {view==="employers" && (
        <div className="bg-white min-h-screen p-5">
          <p className="text-[#FF9F1C] font-black text-[11px] tracking-widest">FOR EMPLOYERS</p>
          <h1 className="text-2xl font-black mt-2">Find People Faster</h1>
          <p className="text-sm text-zinc-500 mt-1">Verified workers in 24hrs. Only R250 per placement.</p>
          <div className="bg-black text-white rounded-2xl p-5 mt-5">
            <p className="font-black">How it works:</p>
            <p className="text-xs mt-2 opacity-80">1. Post job (Boxer, Shoprite, etc)<br/>2. We send you 3 verified workers on WhatsApp<br/>3. You choose 1. Pay R250 after they start.</p>
            <div className="bg-white/10 rounded-xl p-3 mt-4"><p className="text-xs">💰 You only pay when worker starts. No upfront fees.</p></div>
          </div>
          <div className="bg-[#FFF7ED] border border-orange-200 rounded-2xl p-4 mt-5">
            <p className="font-bold text-sm">Post a Job</p>
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company - e.g. Boxer Superstore" className="w-full mt-3 p-3 rounded-xl border text-sm"/>
            <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role - e.g. Cashier, Driver, Packer" className="w-full mt-2 p-3 rounded-xl border text-sm"/>
            <button onClick={addJob} className="w-full bg-[#FF9F1C] text-black font-black py-4 rounded-full mt-4 text-sm">Post Job - R250 on Success</button>
          </div>
          <div className="mt-6">
            <p className="font-black text-sm">Available Workers ({people.length})</p>
            <div className="mt-3 space-y-2">
              {people.map((p:any)=>(<div key={p.id} className="border p-4 rounded-2xl flex justify-between"><div><p className="font-bold text-sm">{p.full_name}</p><p className="text-xs text-zinc-500">{p.area||"Pretoria West"} • Available</p></div><button onClick={()=>place()} className="bg-[#22C55E] text-black font-black text-xs px-4 py-2 rounded-full">Hire R250</button></div>))}
            </div>
          </div>
        </div>
      )}

      {view==="admin" && (
        <div className="bg-black min-h-screen p-4 pb-20">
          <div className="bg-[#151515] rounded-2xl p-4 border border-zinc-800">
            <div className="flex justify-between"><p className="text-white font-black">ADMIN V11 - R{rev} ({cnt})</p><button onClick={()=>setView("home")} className="text-xs text-zinc-400">← Home</button></div>
            <div className="flex gap-2 mt-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Worker" className="flex-1 bg-zinc-900 text-white p-3 rounded-xl text-xs"/>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-24 bg-zinc-900 text-white p-3 rounded-xl text-xs"/>
              <button onClick={async()=>{if(!name) return; await supabase.from("people").insert([{full_name:name, phone}]); setName(""); setPhone(""); load();}} className="bg-white text-black font-black px-4 rounded-xl text-xs">+Add</button>
            </div>
            <div className="flex gap-2 mt-2">
              <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" className="flex-1 bg-zinc-900 text-white p-3 rounded-xl text-xs"/>
              <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Role" className="w-24 bg-zinc-900 text-white p-3 rounded-xl text-xs"/>
              <button onClick={async()=>{if(!company) return; await supabase.from("jobs").insert([{company, role:role||"Worker"}]); setCompany(""); setRole(""); load();}} className="bg-[#FF9F1C] text-black font-black px-4 rounded-xl text-xs">+Job</button>
            </div>
            <button onClick={invoice} className="w-full bg-[#22C55E] text-black font-black py-4 rounded-full mt-4 text-sm">💬 Invoice R{rev}</button>
          </div>
          <p className="text-white font-black mt-6 text-xs">TAP TO PLACE +R250</p>
          <div className="mt-3 space-y-2">
            {jobs.map((j:any)=>(<div key={j.id} onClick={()=>place()} className="bg-[#1A1A1A] p-4 rounded-2xl flex justify-between"><div><p className="text-white text-sm font-bold">{j.role} @ {j.company}</p><p className="text-zinc-500 text-xs">Open</p></div><div className="bg-green-500 text-black font-black text-xs px-4 py-2 rounded-full">+R250</div></div>))}
          </div>
        </div>
      )}
    </div>
  )
}
