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
  const delP=async(id:string)=>{
    await supabase.from('people').delete().eq('id',id)
    fetchPeople()
  }
  const delJ=async(id:string)=>{
    await supabase.from('jobs').delete().eq('id',id)
    fetchJobs()
    setSelectedJob(null)
  }

  const whatsapp=(p:any)=>{
    let ph = p.phone.replace(/\D/g,'')
    if(ph.startsWith('0')) ph = '27' + ph.slice(1)
    if(!ph.startsWith('27')) ph = '27' + ph
    const text = `Hi ${p.full_name} 👋 Guardian Work has a job for you:\n*${selectedJob.title}* at *${selectedJob.company}*\nLocation: ${selectedJob.location}\nPay: ${selectedJob.pay}\n\nAvailable? Reply YES`
    const url = `https://wa.me/${ph}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return(
    <div className="min-h-screen bg-black p-4 pb-24">
      <h1 className="text-white text-xl font-black">GUARDIAN WORK V5</h1>
      <p className="text-green-400 text-xs mb-4">● ENGINE ONLINE - Phase 3.5 Match FIXED</p>

      <div className="bg-[#1a1a1a] rounded-[20px] p-4">
        <h2 className="text-white font-bold mb-2">+ Add Person</h2>
        <input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} placeholder="Full Name" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white mb-2"/>
