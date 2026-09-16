'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function BusinessSetup(){
  const router = useRouter()
  const [form,setForm]=useState({business_name:'',town:'',province:'',phone:'',contact_person:'',website:''})
  const [saving,setSaving]=useState(false)

  async function handleSave(){
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if(!user){ alert('Not logged in'); setSaving(false); return }

    // Delete old if exists, then insert (avoids ON CONFLICT error)
    await supabase.from('businesses').delete().eq('auth_user_id', user.id)
    
    const { error } = await supabase.from('businesses').insert({
      auth_user_id: user.id,
      business_name: form.business_name,
      town: form.town,
      province: form.province,
      phone: form.phone,
      contact_person: form.contact_person,
      website: form.website
    })
    
    if(error){ alert(error.message); setSaving(false); return }
    router.push('/business')
  }

  return(
    <div className="min-h-screen p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Tell us about your business to get started</h1>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="Business Name" value={form.business_name} onChange={e=>setForm({...form,business_name:e.target.value})}/>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="Town - e.g. Secunda" value={form.town} onChange={e=>setForm({...form,town:e.target.value})}/>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="Province" value={form.province} onChange={e=>setForm({...form,province:e.target.value})}/>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="Contact Person" value={form.contact_person} onChange={e=>setForm({...form,contact_person:e.target.value})}/>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="+27 82 123 4567" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      <input className="w-full p-3 border rounded-xl mb-3" placeholder="Website (optional)" value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/>
      <button onClick={handleSave} disabled={saving} className="w-full bg-black text-white p-4 rounded-xl">{saving?'Saving...':'Continue →'}</button>
    </div>
  )
}
