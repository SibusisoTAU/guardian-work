"use client";
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function GuardianWorkV5() {
  const [people, setPeople] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [form, setForm] = useState({ full_name: "", id_number: "", phone: "", capability: "General Worker", work_identity: "Candidate" })
  const [jobForm, setJobForm] = useState({ title: "", company: "", location: "Soweto", pay: "" })

  useEffect(() => { fetchPeople(); fetchJobs(); }, [])
  const fetchPeople = async () => { const { data } = await supabase.from('people').select('*').order('created_at', {ascending: false}); if(data) setPeople(data) }
  const fetchJobs = async () => { const { data } = await supabase.from('jobs').select('*').order('created_at', {ascending: false}); if(data) setJobs(data) }
  const addPerson = async () => { if(!form.full_name) return; await supabase.from('people').insert([{...form, status: 'Available'}]); setForm({ full_name: "", id_number: "", phone: "", capability: "General Worker", work_identity: "Candidate" }); fetchPeople() }
  const addJob = async () => { if(!jobForm.title ||!jobForm.company) return; await supabase.from('jobs').insert([{...jobForm, status: 'Open'}]); setJobForm({ title: "", company: "", location: "Soweto", pay: "" }); fetchJobs() }
  const deletePerson = async (id:string) => { await supabase.from('people').delete().eq('id', id); fetchPeople() }
  const deleteJob = async (id:string) => { await supabase.from('jobs').delete().eq('id', id); fetchJobs(); setSelectedJob(null) }

  const matchingPeople = selectedJob? people.filter(p=> p.capability.toLowerCase().includes(selectedJob.title.toLowerCase()) || selectedJob.title.toLowerCase().includes(p.capability.toLowerCase()) || true) : []

  const whatsapp = (person:any) => {
    const msg = `Hi ${person.full_name} 👋 Guardian Work has a job for you:%0A*${selectedJob.title}* at *${selectedJob.company}*%0ALocation: ${selectedJob.location}%0APay: ${selectedJob.pay}%0A%0AAre you available? Reply YES`
    const phone = person.phone.replace(/\D/g,'')
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <h1 className="text-white text-2xl font-black">GUARDIAN WORK V5</h1>
      <p className="text-green-400 text-sm mb-4">● ENGINE ONLINE - Phase 3.5 Match</p>

      <div className="bg-[#1a1a1a] rounded-[20px] p-5">
        <h2 className="text-white font-bold mb-3">+ Add Person</h2>
        <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} placeholder="Full Name" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone 07..." className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2" />
        <select value={form.capability} onChange={e=>setForm({...form, capability:e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2">
          {["General Worker","Driver","Cleaner","Retail","Security","Construction"].map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={addPerson} className="w-full bg-white text-black font-bold rounded-xl p-3">Save to Supabase →</button>
      </div>

      <div className="bg-[#1a1a1a] rounded-[20px] p-5 mt-4">
        <h2 className="text-white font-bold">People ({people.length})</h2>
        {people.map(p=>(
