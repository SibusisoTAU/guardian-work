"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.")
}

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
  return (
    business?.name ||
    business?.business_name ||
    "Your Business"
  )
}

function formatActivityType(activity: SiteActivity) {
  return (
    activity.activity_type ||
    activity.type ||
    "ACTIVITY"
  )
    .replace(/_/g, " ")
    .toUpperCase()
}

function formatDate(value?: string | null) {
  if (!value) return "Just now"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Recently"
  }

  return date.toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function getActivityText(activity: SiteActivity) {
  return (
    activity.message ||
    activity.description ||
    activity.title ||
    "Workspace activity recorded."
  )
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

  /*
   * ------------------------------------------------------------
   * AUTH + BUSINESS
   * ------------------------------------------------------------
   */

  const loadBusiness = useCallback(async () => {
    setLoadingBusiness(true)
    setError(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!user) {
        router.replace("/")
        return
      }

      setUserName(
        user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Business user"
      )

      /*
       * Current GUARDIAN WORK Business architecture supports
       * both owner_id and auth_user_id.
       */
      const { data: businessRows, error: businessError } =
        await supabase
          .from("businesses")
          .select("*")
          .or(
            `owner_id.eq.${user.id},auth_user_id.eq.${user.id}`
          )
          .limit(1)

      if (businessError) {
        throw businessError
      }

      const foundBusiness = businessRows?.[0] as Business | undefined

      if (!foundBusiness) {
        router.replace("/business/setup")
        return
      }

      setBusiness(foundBusiness)
      setBusinessId(foundBusiness.id)
    } catch (err) {
      console.error("Business loading error:", err)

      setError(
        err instanceof Error
          ? err.message
          : "We could not load your business."
      )
    } finally {
      setLoadingBusiness(false)
    }
  }, [router])

  /*
   * ------------------------------------------------------------
   * BUSINESS SITES
   * ------------------------------------------------------------
   */

  const loadSites = useCallback(async (currentBusinessId: string) => {
    setLoadingSites(true)
    setError(null)

    try {
      const { data, error: sitesError } = await supabase
        .from("business_sites")
        .select("*")
        .eq("business_id", currentBusinessId)
        .order("created_at", {
          ascending: false,
        })

      if (sitesError) {
        throw sitesError
      }

      const loadedSites = (data || []) as Site[]

      setSites(loadedSites)

      /*
       * Select the first site only when there isn't already
       * a valid selected site.
       */
      setSelectedSiteId((currentSelectedId) => {
        if (
          currentSelectedId &&
          loadedSites.some(
            (site) => site.id === currentSelectedId
          )
        ) {
          return currentSelectedId
        }

        return loadedSites[0]?.id || null
      })
    } catch (err) {
      console.error("Site loading error:", err)

      setSites([])
      setSelectedSiteId(null)

      setError(
        err instanceof Error
          ? err.message
          : "We could not load your business sites."
      )
    } finally {
      setLoadingSites(false)
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * SITE ACTIVITY / TIMELINE
   * ------------------------------------------------------------
   */

  const loadSiteActivity = useCallback(
    async (
      currentBusinessId: string,
      currentSiteId: string
    ) => {
      setLoadingActivities(true)

      try {
        const { data, error: activityError } =
          await supabase
            .from("site_activity")
            .select("*")
            .eq("business_id", currentBusinessId)
            .eq("site_id", currentSiteId)
            .order("created_at", {
              ascending: false,
            })
            .limit(100)

        if (activityError) {
          throw activityError
        }

        setActivities(
          (data || []) as SiteActivity[]
        )
      } catch (err) {
        console.error(
          "Site activity loading error:",
          err
        )

        setActivities([])

        setError(
          err instanceof Error
            ? err.message
            : "We could not load the site timeline."
        )
      } finally {
        setLoadingActivities(false)
      }
    },
    []
  )

  /*
   * ------------------------------------------------------------
   * INITIAL LOAD
   * ------------------------------------------------------------
   */

  useEffect(() => {
    void loadBusiness()
  }, [loadBusiness])

  /*
   * ------------------------------------------------------------
   * LOAD SITES WHEN BUSINESS IS KNOWN
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!businessId) return

    void loadSites(businessId)
  }, [businessId, loadSites])

  /*
   * ------------------------------------------------------------
   * LOAD TIMELINE WHEN SELECTED SITE CHANGES
   *
   * This is the important fix:
   *
   * We do NOT reload authentication/business information
   * every time somebody changes the site.
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!businessId || !selectedSiteId) {
      setActivities([])
      return
    }

    void loadSiteActivity(
      businessId,
      selectedSiteId
    )
  }, [
    businessId,
    selectedSiteId,
    loadSiteActivity,
  ])

  /*
   * ------------------------------------------------------------
   * SELECTED SITE
   * ------------------------------------------------------------
   */

  const selectedSite = useMemo(() => {
    if (!selectedSiteId) return null

    return (
      sites.find(
        (site) => site.id === selectedSiteId
      ) || null
    )
  }, [sites, selectedSiteId])

  /*
   * ------------------------------------------------------------
   * REFRESH
   * ------------------------------------------------------------
   */

  const refreshWorkspace = async () => {
    setError(null)

    if (!businessId) {
      await loadBusiness()
      return
    }

    await loadSites(businessId)

    if (selectedSiteId) {
      await loadSiteActivity(
        businessId,
        selectedSiteId
      )
    }
  }

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (loadingBusiness) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] grid place-items-center p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <div className="mt-4 text-lg font-black text-slate-900">
            Loading GUARDIAN WORK
          </div>

          <div className="mt-1 text-sm text-slate-500">
            Preparing your Business Workspace...
          </div>
        </div>
      </div>
    )
  }

  /*
   * ------------------------------------------------------------
   * ERROR
   * ------------------------------------------------------------
   */

  if (!business && error) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] grid place-items-center p-6">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
          <div className="text-xs font-black uppercase tracking-widest text-red-500">
            Business Workspace
          </div>

          <h1 className="mt-2 text-2xl font-black text-slate-900">
            We couldn't load your business.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void loadBusiness()}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
            >
              Back to GUARDIAN WORK
            </button>
          </div>
        </div>
      </div>
    )
  }

  /*
   * ------------------------------------------------------------
   * MAIN BUSINESS WORKSPACE
   * ------------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-100">
              GW
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black leading-none sm:text-xl">
                <span className="text-slate-900">
                  GUARDIAN
                </span>{" "}
                <span className="text-orange-500">
                  WORK
                </span>
              </h1>

              <p className="mt-1 hidden text-[9px] font-bold tracking-[0.18em] text-slate-400 sm:block">
                MAKE YOUR ABILITY DISCOVERABLE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refreshWorkspace()}
              disabled={
                loadingSites ||
                loadingActivities
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
            >
              {loadingSites ||
              loadingActivities
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-slate-800"
            >
              GUARDIAN WORK
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        {/* BUSINESS HERO */}
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400">
                  BUSINESS WORKSPACE
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {getBusinessName(business)}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Welcome back, {userName}.
                  Manage your work sites and keep
                  the operational timeline connected
                  to the work happening on the ground.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-300">
                  WORKSPACE
                </div>

                <div className="mt-1 text-sm font-black">
                  {business?.is_active === false
                    ? "Inactive"
                    : "Active"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR BANNER */}
        {error && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <div>
              <div className="text-xs font-black text-orange-800">
                Workspace notice
              </div>

              <div className="mt-1 text-xs leading-5 text-orange-700">
                {error}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setError(null)}
              className="rounded-lg px-3 py-2 text-xs font-black text-orange-800 hover:bg-orange-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SITES */}
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                WORK SITES
              </div>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Where the work happens.
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a site to view its operational
                timeline.
              </p>
            </div>

            <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
              {sites.length}{" "}
              {sites.length === 1
                ? "site"
                : "sites"}
            </div>
          </div>

          {loadingSites ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">
              Loading your sites...
            </div>
          ) : sites.length === 0 ? (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="text-lg font-black text-slate-800">
                No sites yet
              </div>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first Business Workspace
                site to start recording operational
                activity.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/business?workspace=sites"
                  )
                }
                className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
              >
                Open Business Workspace
              </button>
            </div>
          ) : (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {sites.map((site) => {
                const active =
                  site.id === selectedSiteId

                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() =>
                      setSelectedSiteId(site.id)
                    }
                    className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="text-sm font-black">
                      {getSiteName(site)}
                    </div>

                    {(site.town ||
                      site.province) && (
                      <div
                        className={`mt-1 text-[10px] font-bold ${
                          active
                            ? "text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        {[
                          site.town,
                          site.province,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* SITE DETAILS */}
        {selectedSite && (
          <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.6fr]">
            {/* SITE CARD */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                SELECTED SITE
              </div>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {getSiteName(selectedSite)}
              </h2>

              {selectedSite.address && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
    
