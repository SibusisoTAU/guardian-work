"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

// FIX 1: Never throw at build time - use fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Business = {
  id: string
  business_name?: string | null
  name?: string | null
  owner_id?: string | null
  auth_user_id?: string | null
  phone?: string | null
  email?: string | null
  province?: string | null
  town?: string | null
  address?: string | null
  status?: string | null
  is_active?: boolean | null
}

type Site = {
  id: string
  business_id?: string | null
  name?: string | null
  site_name?: string | null
  address?: string | null
  province?: string | null
  town?: string | null
  status?: string | null
  is_active?: boolean | null
  created_at?: string | null
}

type SiteActivity = {
  id: string
  business_id?: string | null
  site_id?: string | null
  activity_type?: string | null
  type?: string | null
  title?: string | null
  description?: string | null
  message?: string | null
  created_at?: string | null
}

function getSiteName(site: Site) {
  return site.name || site.site_name || "Unnamed site"
}

function getBusinessName(business: Business | null) {
  return business?.name || business?.business_name || "Your Business"
}

function formatActivityType(activity: SiteActivity) {
  return (activity.activity_type || activity.type || "ACTIVITY").replace(/_/g, " ").toUpperCase()
}

function formatDate(value?: string | null) {
  if (!value) return "Just now"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Recently"
  return date.toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })
}

function getActivityText(activity: SiteActivity) {
  return activity.message || activity.description || activity.title || "Workspace activity recorded."
}

export default function BusinessPage() {
  const router = useRouter()
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [activities, setActivities] = useState<SiteActivity[]>([])
  const [loadingBusiness, setLoadingBusiness] = useState(true)
  const [loadingSites, setLoadingSites] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")

  const loadBusiness = useCallback(async () => {
    setLoadingBusiness(true)
    setError(null)
    try {
      // FIX 2: Guard if env missing at runtime (not build time)
      if (!supabaseUrl ||!supabaseAnonKey) {
        setError("Supabase not configured. Check Vercel env vars.")
        setLoadingBusiness(false)
        return
      }
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) { router.replace("/"); return }
      setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Business user")

      const { data: businessRows, error: businessError } = await supabase.from("businesses").select("*").or(`owner_id.eq.${user.id},auth_user_id.eq.${user.id}`).limit(1)
      if (businessError) throw businessError
      const foundBusiness = businessRows?.[0] as Business | undefined
      if (!foundBusiness) { router.replace("/business/setup"); return }
      setBusiness(foundBusiness)
      setBusinessId(foundBusiness.id)
    } catch (err) {
      console.error("Business loading error:", err)
      setError(err instanceof Error? err.message : "We could not load your business.")
    } finally {
      setLoadingBusiness(false)
    }
  }, [router])

  const loadSites = useCallback(async (currentBusinessId: string) => {
    setLoadingSites(true)
    setError(null)
    try {
      const { data, error: sitesError } = await supabase.from("business_sites").select("*").eq("business_id", currentBusinessId).order("created_at", { ascending: false })
      if (sitesError) throw sitesError
      const loadedSites = (data || []) as Site[]
      setSites(loadedSites)
      setSelectedSiteId((currentSelectedId) => {
        if (currentSelectedId && loadedSites.some((site) => site.id === currentSelectedId)) return currentSelectedId
        return loadedSites[0]?.id || null
      })
    } catch (err) {
      console.error("Site loading error:", err)
      setSites([])
      setSelectedSiteId(null)
      setError(err instanceof Error? err.message : "We could not load your business sites.")
    } finally {
      setLoadingSites(false)
    }
  }, [])

  const loadSiteActivity = useCallback(async (currentBusinessId: string, currentSiteId: string) => {
    setLoadingActivities(true)
    try {
      const { data, error: activityError } = await supabase.from("site_activity").select("*").eq("business_id", currentBusinessId).eq("site_id", currentSiteId).order("created_at", { ascending: false }).limit(100)
      if (activityError) throw activityError
      setActivities((data || []) as SiteActivity[])
    } catch (err) {
      console.error("Site activity loading error:", err)
      setActivities([])
      setError(err instanceof Error? err.message : "We could not load the site timeline.")
    } finally {
      setLoadingActivities(false)
    }
  }, [])

  useEffect(() => { void loadBusiness() }, [loadBusiness])
  useEffect(() => { if (!businessId) return; void loadSites(businessId) }, [businessId, loadSites])
  useEffect(() => {
    if (!businessId ||!selectedSiteId) { setActivities([]); return }
    void loadSiteActivity(businessId, selectedSiteId)
  }, [businessId, selectedSiteId, loadSiteActivity])

  const selectedSite = useMemo(() => {
    if (!selectedSiteId) return null
    return sites.find((site) => site.id === selectedSiteId) || null
  }, [sites, selectedSiteId])

  const refreshWorkspace = async () => {
    setError(null)
    if (!businessId) { await loadBusiness(); return }
    await loadSites(businessId)
    if (selectedSiteId) await loadSiteActivity(businessId, selectedSiteId)
  }

  if (loadingBusiness) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] grid place-items-center p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <div className="mt-4 text-lg font-black text-slate-900">Loading GUARDIAN WORK</div>
          <div className="mt-1 text-sm text-slate-500">Preparing your Business Workspace...</div>
        </div>
      </div>
    )
  }

  if (!business && error) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] grid place-items-center p-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-red-500">Business Workspace</div>
          <h1 className="mt-2 text-2xl font-black text-slate-900">We couldn't load your business.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => void loadBusiness()} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">Try again</button>
            <button type="button" onClick={() => router.push("/")} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">Back to GUARDIAN WORK</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-100">GW</div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black leading-none sm:text-xl"><span class
