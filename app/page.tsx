"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Person = {
  id: string;
  full_name: string;
  id_number: string;
  phone: string;
  capability: string;
  work_identity: string;
  status: string;
  created_at: string;
};

export default function GuardianWorkV5() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", id_number: "", phone: "", capability: "General Worker", work_identity: "Candidate" });
  const [saving, setSaving] = useState(false);

  const capabilities = ["General Worker","Painter","Tiler","Plumber","Electrician","Cleaner","Gardener","Security"];
  const identities = ["Candidate","Verified Worker","Site Supervisor","Foreman"];

  useEffect(() => { fetchPeople(); }, []);
  async function fetchPeople() {
    setLoading(true);
    const { data } = await supabase.from("people").select("*").order("created_at", { ascending: false });
    if (data) setPeople(data);
    setLoading(false);
  }
  async function addPerson(e:any){
    e.preventDefault();
    if(!form.full_name||!form.id_number) return alert("Name & ID required");
    setSaving(true);
    const { error } = await supabase.from("people").insert([{ ...form, status: "Active" }]);
    if(error) alert(error.message);
    else { setForm({ full_name:"", id_number:"", phone:"", capability:"General Worker", work_identity:"Candidate"}); fetchPeople(); }
    setSaving(false);
  }
  async function deletePerson(id:string){
    if(!confirm("Delete?")) return;
    await supabase.from("people").delete().eq("id", id);
    fetchPeople();
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black">GUARDIAN WORK V5</h1>
            <p className="text-green-400 font-mono text-sm">● ENGINE ONLINE - Phase 2: People Management</p>
          </div>
          <div className="bg-green-900/30 border border-green-500 px-3 py-1 rounded-full text-xs font-mono">LIVE</div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="font-bold mb-4">+ Add Person</h2>
            <form onSubmit={addPerson} className="space-y-3">
              <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="Full Name" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm" />
              <input value={form.id_number} onChange={e=>setForm({...form, id_number:e.target.value})} placeholder="ID Number" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm" />
              <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm" />
              <select value={form.capability} onChange={e=>setForm({...form, capability:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm">
                {capabilities.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={form.work_identity} onChange={e=>setForm({...form, work_identity:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm">
                {identities.map(c=><option key={c}>{c}</option>)}
              </select>
              <button disabled={saving} className="w-full bg-white text-black font-bold rounded-lg p-3">{saving?"Saving...":"Save to Supabase →"}</button>
            </form>
          </div>

          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex justify-between mb-4"><h2 className="font-bold">People ({people.length})</h2><button onClick={fetchPeople} className="text-xs bg-zinc-800 px-3 py-1 rounded-full">↻ Refresh</button></div>
            {loading ? <p className="text-zinc-500 text-sm">Loading...</p> : people.map(p=>(
              <div key={p.id} className="bg-black border border-zinc-800 rounded-xl p-3 flex justify-between mb-2">
                <div><div className="font-bold text-sm">{p.full_name} <span className="text-zinc-500 text-xs">• {p.id_number}</span></div><div className="text-xs text-zinc-400">{p.phone} • {p.capability} → {p.work_identity}</div></div>
                <button onClick={()=>deletePerson(p.id)} className="text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
