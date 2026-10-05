"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient(supabaseUrl, supabaseAnonKey)
}

function getBusinessName(business: any) {
  if (!business) return "Your Business"
  return business.business_name || business.name || business.company_name || "Your Business"
}

export default function BusinessPage() {
  const [business, setBusiness] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      if (!supabase) {
        setLoading(false)
        return
      }
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }
        const { data } = await supabase
          .from("business_sites")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()
        
        if (data) setBusiness(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const businessName = getBusinessName(business)

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading business workspace...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold">{businessName}</h1>
            <p className="text-sm text-slate-500">Business Workspace</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Live
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <p className="mt-2 text-slate-600">
            Your business site {business ? `for ${businessName}` : "is being set up"}. 
            {business ? ` Domain: ${business.domain || "Not set"}` : ""}
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-medium">Site Status</h3>
              <p className="text-sm text-slate-500 mt-1">{business ? "Active" : "Draft"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-medium">Owner</h3>
              <p className="text-sm text-slate-500 mt-1">{business?.user_id ? "Verified" : "Checking..."}</p>
            </div>
          </div>

          <div className="mt-6">
            <a href="/site-log" className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Go to Site Log →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
