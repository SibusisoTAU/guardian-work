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
  const [jobForm,setJobForm]=useState({title:"",company:"",location:"Soweto",pay:"250"})
  const [placements,setPlacements]=useState<any[]>([])
  const [revenue,setRevenue]=useState(0)

  useEffect(()=>{fetchPeople();fetchJobs();fetchPlacements()},[])

  const fetchPeople=async()=>{
    const {data}=await supabase.from('people').select('*').order('created_at',{ascending:false})
    if(data)setPeople(data)
  }
  const fetchJobs=async()=>{
    const {data}=await supabase.from('jobs').select('*').order('created_at',{ascending:false})
    if(data)setJobs(data)
  }
  const fetchPlacements=async()=>{
    const {data}=await supabase.from('placements').select('*')
    if(data){
      setPlacements(data)
      let total=0
      data.forEach((p:any)=>{ total+= parseInt(p.fee||250) })
      setRevenue(total)
    }
  }
  const addPerson=async()=>{
    if(!form.full_name)return
    await supabase.from('people').insert([{...form,status:'Available'}])
    setForm({full_name:"",phone:"",capability:"Driver"})
    fetchPeople()
  }
  const addJob=async()=>{
    if(!jobForm.title||!jobForm.company)return
    await supabase.from('jobs').insert([{...jobForm,pay:`R${jobForm.pay}`,status:'Open'}])
    setJobForm({title:"",company:"",location:"Soweto",pay:"250"})
    fetchJobs()
  }
  const placePerson=async(person:any)=>{
    if(!selectedJob) return
    const fee = selectedJob.pay?.replace('R','')||'250'
    // Add to placements table - create if not exists
    try{
      await supabase.from('placements').insert([{
        person_id: person.id,
        job_id: selectedJob.id,
        person_name: person.full_name,
        job_title: selectedJob.title,
        company: selectedJob.company,
        fee: fee
      }])
    }catch(e){
      // If placements table doesn't exist, use local
      setPlacements([...placements,{person_name:person.full_name,job_title:selectedJob.title,company:selectedJob.company,fee}])
      setRevenue(revenue+parseInt(fee))
    }
    await supabase.from('people').update({status:'Placed'}).eq('id',person.id)
    await supabase.from('jobs').update({status:'Filled'}).eq('id',selectedJob.id)
    fetchPeople(); fetchJobs(); fetchPlacements()
    alert(`🔥 PLACED! ${person.full_name} → ${selectedJob.company} \n💰 +R${fee} Revenue!`)
    setSelectedJob(null)
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
    <div className="min-h-screen bg-black p-3 pb-24">
      {/* MONEY BAR */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-[20px] p-4 mb-3">
        <div className="flex justify-between items-center">
          <div><p className="text-black/60 text-[10px] font-bold tracking-widest">TOTAL REVENUE</p><p className="text-black text-2xl font-black">R{revenue}</p></div>
          <div className="text-right"><p className="text-black/60 text-[10px] font-bold">PLACEMENTS</p><p className="text-black text-2xl font-black">{placements.length}</p></div>
          <div className="bg-black rounded-full px-3 py-1"><p className="text-green-400 text-xs font-black">LIVE
