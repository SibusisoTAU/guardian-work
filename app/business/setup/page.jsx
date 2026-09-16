'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function BusinessSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    business_name: '', registration_number: '', contact_person: '',
    phone: '', province: 'Gauteng', town: '', website: '',
    services: 'Cleaning, Security', company_size: '11-50 employees', hiring_status: true
  })

  const save = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('businesses').upsert({
      auth_user_id: user?.id,
      business_name: form.business_name,
      registration_number: form.registration_number,
      contact_person: form.contact_person,
      phone: form.phone,
      province: form.province,
      town: form.town,
      website: form.website,
      services: form.services,
      company_size: form.company_size,
      hiring_status: form.hiring_status? 'actively_hiring' : 'not_hiring',
      is_active: true
    }, { onConflict: 'auth_user_id' })
    setLoading(false)
    if (!error) router.push('/business')
    else alert(error.message)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition"
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-[24px] shadow-xl p-8">
        <h2 className="text-3xl font-bold">Business Profile Setup</h2>
        <p className="text-gray-500 mb-8">Tell us about your business to get started</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className="text-sm font-semibold">Business Name</label><input className={inputClass} placeholder="Cape Facilities (Pty) Ltd" onChange={e=>setForm({...form,business_name:e.target.value})} /></div>
          <div><label className="text-sm font-semibold">Town</label><input className={inputClass} placeholder="Pretoria" onChange={e=>setForm({...form,town:e.target.value})} /></div>
          <div><label className="text-sm font-semibold">Contact Person</label><input className={inputClass} onChange={e=>setForm({...form,contact_person:e.target.value})} /></div>
          <div><label className="text-sm font-semibold">Phone</label><input className={inputClass} placeholder="+27 82 123 4567" onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div><label className="text-sm font-semibold">Province</label><select className={inputClass} value={form.province} onChange={e=>setForm({...form,province:e.target.value})}><option>Gauteng</option><option>Western Cape</option><option>KZN</option><option>Eastern Cape</option><option>Limpopo</option><option>Mpumalanga</option><option>North West</option><option>Free State</option><option>Northern Cape</option></select></div>
          <div><label className="text-sm font-semibold">Website</label><input className={inputClass} onChange={e=>setForm({...form,website:e.target.value})} /></div>
        </div>
        <button onClick={save} className="w-full mt-8 py-3 rounded-xl bg-black text-white font-semibold">{loading?'Saving...':'Continue →'}</button>
      </div>
    </div>
  )
}
