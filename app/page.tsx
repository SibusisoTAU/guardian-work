"use client";
import { useState } from "react";

export default function Page(){
  const [view,setView]=useState("home");
  return(
    <div className="min-h-screen bg-white">
      <div className="flex justify-between p-4 border-b">
        <div className="bg-green-900 text-white font-black text-xs px-2 py-1 rounded">MY GUARDIAN LINK</div>
        <button onClick={()=>setView(view==="home"?"admin":"home")} className="bg-orange-400 text-black font-black text-xs px-4 py-2 rounded-full">{view==="home"?"I'm Hiring":"Home"}</button>
      </div>
      {view==="home"?(
        <div className="bg-green-800 p-6 text-white">
          <p className="text-orange-400 text-xs font-black">MY GUARDIAN LINK PRESENTS</p>
          <h1 className="text-3xl font-black mt-2">Find Work. Find People. Faster.</h1>
          <p className="text-sm mt-3 opacity-80">GUARDIAN WORK connects local people with employers — from welders in Secunda to cashiers in Pretoria West.</p>
          <div className="bg-white/10 rounded-2xl p-4 mt-6">
            <p className="text-orange-400 text-xs font-black">LIVE TALENT POOL</p>
            <p className="text-3xl font-black mt-2">243</p>
            <p className="text-xs">People ready for work in Pretoria West</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white rounded-xl p-3 text-black"><p className="text-xs">Profiles</p><p className="font-black">—</p></div>
            <div className="bg-white rounded-xl p-3 text-black"><p className="text-xs">Local Areas</p><p className="font-black">14</p></div>
          </div>
        </div>
      ):(
        <div className="bg-black min-h-screen p-4 text-white">
          <p className="font-black">ADMIN V9</p>
          <p className="text-xs mt-2 text-zinc-400">We will add your invoice engine here after landing works.</p>
        </div>
      )}
    </div>
  )
}
