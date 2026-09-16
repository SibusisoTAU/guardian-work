'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function BusinessSetup() {
  const [form, setForm] = useState({
    business_name: '',
    registration_number: '',
    contact_person: '',
    phone: '',
    province: '',
    town: '',
    website: '',
    services: '',
    company_size: '',
    hiring_status: 'hiring'
  })

  async function saveProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('businesses').upsert({
      auth_user_id: user.id,
      business_name: form.business_name,
      registration_number: form.registration_number,
      contact_person: form.contact_person,
      phone: form.phone,
      province: form.province,
      town: form.town,
      province_id: null, // you can link to your provinces table later
      town_id: null,
      website: form.website,
      services: form.services,
      company_size: form.company_size,
      hiring_status: form.hiring_status,
      is_active: true
    }, { onConflict: 'auth_user_id' })

    if (!error) {
      alert('Profile saved!')
      window.location.href = '/business/dashboard'
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Your Business Profile</h1>
      <p className="mb-6 text-gray-600">Fill this once after registration</p>
      
      <input placeholder="Business Name" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, business_name:e.target.value})} />
      <input placeholder="Registration Number" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, registration_number:e.target.value})} />
      <input placeholder="Contact Person" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, contact_person:e.target.value})} />
      <input placeholder="Phone" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, phone:e.target.value})} />
      <input placeholder="Province (e.g. Gauteng)" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, province:e.target.value})} />
      <input placeholder="Town / City (e.g. Pretoria)" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, town:e.target.value})} />
      <input placeholder="Website" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, website:e.target.value})} />
      <input placeholder="Services (e.g. Security, Cleaning)" className="w-full p-3 border mb-3" onChange={e=>setForm({...form, services:e.target.value})} />
      <select className="w-full p-3 border mb-3" onChange={e=>setForm({...form, company_size:e.target.value})}>
        <option>Company Size</option>
        <option>1-10</option>
        <option>11-50</option>
        <option>51-200</option>
        <option>200+</option>
      </select>

      <button onClick={saveProfile} className="w-full bg-black text-white p-3 rounded">Save Business Profile</button>
    </div>
  )
      }
