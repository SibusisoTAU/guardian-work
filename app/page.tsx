"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  status: string;
  created_at: string;
};

export default function GuardianWorkV5() {
  const [people, setPeople] = useState<Person[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ full_name: "", id_number: "", phone: "", capability: "General Worker", work_identity: "Candidate" })
  const [jobForm, setJobForm] = useState({ title: "", company: "", location: "Soweto", pay: "" })
  const [saving, setSaving] = useState(false)

  const capabilities = ["General Worker","Driver","Cleaner","Retail","Security","Construction"]
  const identities = ["Candidate","Verified","Guardian"]

  useEffect(() => { fetchPeople(); fetchJobs(); }, [])

  const fetchPeople = async () => {
    const { data } = await supabase.from('people').select('*').order('created_at', {ascending: false})
    if(data) setPeople(data)
    setLoading(false)
  }
  const fetchJobs = async () => {
    const { data } = await supabase.from('jobs').select('*').order('created_at', {ascending: false})
    if(data) setJobs(data)
  }

  const addPerson = async () => {
    if(!form.full_name) return alert('Add name')
    setSaving(true)
    const { error } = await supabase.from('people').insert([{...form, status: 'Available' }])
    if(error) alert(error.message)
    else { setForm({ full_name: "", id_number: "", phone: "", capability: "General Worker", work_identity: "Candidate" }); fetchPeople() }
    setSaving(false)
  }

  const addJob = async () => {
    if(!jobForm.title ||!jobForm.company) return alert('Title + Company needed')
    setSaving(true)
    const { error } = await supabase.from('jobs').insert([{...jobForm, status: 'Open' }])
    if(error) alert(error.message)
    else { setJobForm({ title: "", company: "", location: "Soweto", pay: "" }); fetchJobs() }
    setSaving(false)
  }

  const deletePerson = async (id:string) => {
    await supabase.from('people').delete().eq('id', id)
    fetchPeople()
  }
  const deleteJob = async (id:string) => {
    await supabase.from('jobs').delete().eq('id', id)
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-20">
      <h1 className="text-white text-2xl font-black mb-1">GUARDIAN WORK V5</h1>
      <p className="text-green-400 text-sm mb-4">● ENGINE ONLINE - Phase 3: People + Jobs</p>

      {/* ADD PERSON */}
      <div className="bg-[#1a1a1a] rounded-[20px] p-5">
        <h2 className="text-white font-bold mb-3">+ Add Person</h2>
        <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="Full Name" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={form.id_number} onChange={e=>setForm({...form, id_number:e.target.value})} placeholder="ID Number" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone e.g. 07..." className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <select value={form.capability} onChange={e=>setForm({...form, capability:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2">
          {capabilities.map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={addPerson} disabled={saving} className="w-full bg-white text-black font-bold rounded-xl p-3 mt-2">{saving?"Saving...":"Save to Supabase →"}</button>
      </div>

      {/* PEOPLE LIST */}
      <div className="bg-[#1a1a1a] rounded-[20px] p-5 mt-4">
        <div className="flex justify-between mb-2"><h2 className="text-white font-bold">People ({people.length})</h2><button onClick={fetchPeople} className="text-zinc-400 text-sm">↻</button></div>
        {loading?<p className="text-zinc-500">Loading...</p>:people.map(p=>(
          <div key={p.id} className="bg-black border border-zinc-800 rounded-xl p-3 mt-2 flex justify-between">
            <div><p className="text-white font-bold text-sm">{p.full_name}</p><p className="text-zinc-400 text-xs">{p.capability} • {p.phone}</p></div>
            <button onClick={()=>deletePerson(p.id)} className="text-zinc-600">X</button>
          </div>
        ))}
      </div>

      {/* ADD JOB - PHASE 3 */}
      <div className="bg-[#1a1a1a] rounded-[20px] p-5 mt-4 border border-green-900/30">
        <h2 className="text-white font-bold mb-3">+ Add Job 🔥 PHASE 3</h2>
        <input value={jobForm.title} onChange={e=>setJobForm({...jobForm, title:e.target.value})} placeholder="Job Title e.g. Driver" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={jobForm.company} onChange={e=>setJobForm({...jobForm, company:e.target.value})} placeholder="Company e.g. Shoprite" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={jobForm.location} onChange={e=>setJobForm({...jobForm, location:e.target.value})} placeholder="Location" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={jobForm.pay} onChange={e=>setJobForm({...jobForm, pay:e.target.value})} placeholder="Pay e.g. R200/day" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <button onClick={addJob} disabled={saving} className="w-full bg-green-400 text-black font-bold rounded-xl p-3 mt-2">Save Job to Supabase →</button>
      </div>

      {/* JOBS LIST */}
      <div className="bg-[#1a1a1a] rounded-[20px] p-5 mt-4">
        <div className="flex justify-between mb-2"><h2 className="text-white font-bold">Jobs ({jobs.length})</h2><button onClick={fetchJobs} className="text-zinc-400 text-sm">↻</button></div>
        {jobs.map(j=>(
          <div key={j.id} className="bg-black border border-zinc-800 rounded-xl p-3 mt-2 flex justify-between">
            <div><p className="text-white font-bold text-sm">{j.title} • {j.company}</p><p className="text-zinc-400 text-xs">{j.location} • {j.pay} • {j.status}</p></div>
            <button onClick={()=>deleteJob(j.id)} className="text-zinc-600">X</button>
          </div>
        ))}
      </div>
    </div>
  )
}
