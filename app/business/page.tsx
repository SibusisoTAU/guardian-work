"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Business = {
  id: string
  business_name?: string | null
  name?: string | null
  phone?: string | null
  province?: string | null
  town?: string | null
  business_type?: string | null
  industry?: string | null
  owner_id?: string | null
  auth_user_id?: string | null
  is_active?: boolean | null
}

type Site = {
  id: string
  business_id: string
  name?: string | null
  site_name?: string | null
  address?: string | null
  province?: string | null
  town?: string | null
  description?: string | null
  is_active?: boolean | null
  created_at?: string | null
}

type SiteActivity = {
  id: string
  business_id: string
  site_id: string
  activity_type?: string | null
  title?: string | null
  description?: string | null
  notes?: string | null
  created_at?: string | null
  created_by?: string | null
}

function getBusinessName(business: Business | null) {
  if (!business) return "GUARDIAN WORK BUSINESS"

  return (
    business.business_name ||
    business.name ||
    "GUARDIAN WORK BUSINESS"
  )
}

function getSiteName(site: Site | null) {
  if (!site) return "No site selected"

  return site.name || site.site_name || "Unnamed Site"
}

function formatDate(value?: string | null) {
  if (!value) return "Recently"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Recently"
  }

  return date.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function activityLabel(activity: SiteActivity) {
  if (activity.title) return activity.title

  if (activity.activity_type) {
    return activity.activity_type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  return "Site activity"
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
  const [userName, setUserName] = useState("Business user")

  /*
   * LOAD BUSINESS
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

      const metadata = user.user_metadata || {}

      const displayName =
        metadata.full_name ||
        metadata.name ||
        metadata.first_name ||
        user.email?.split("@")[0] ||
        "Business user"

      setUserName(String(displayName))

      /*
       * Existing GUARDIAN WORK business architecture supports
       * both owner_id and auth_user_id.
       */
      const { data, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .or(`owner_id.eq.${user.id},auth_user_id.eq.${user.id}`)
        .limit(1)

      if (businessError) {
        throw businessError
      }

      const foundBusiness = data?.[0] as Business | undefined

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
          : "Unable to load your Business account."
      )
    } finally {
      setLoadingBusiness(false)
    }
  }, [router])

  /*
   * LOAD BUSINESS SITES
   */
  const loadSites = useCallback(
    async (currentBusinessId: string) => {
      setLoadingSites(true)
      setError(null)

      try {
        const { data, error: sitesError } = await supabase
          .from("business_sites")
          .select("*")
          .eq("business_id", currentBusinessId)
          .order("created_at", { ascending: false })

        if (sitesError) {
          throw sitesError
        }

        const loadedSites = (data || []) as Site[]

        setSites(loadedSites)

        /*
         * Keep the current site if it still exists.
         * Otherwise select the first available site.
         */
        setSelectedSiteId((currentSelectedId) => {
          if (
            currentSelectedId &&
            loadedSites.some((site) => site.id === currentSelectedId)
          ) {
            return currentSelectedId
          }

          return loadedSites[0]?.id || null
        })
      } catch (err) {
        console.error("Business sites loading error:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load business sites."
        )

        setSites([])
        setSelectedSiteId(null)
      } finally {
        setLoadingSites(false)
      }
    },
    []
  )

  /*
   * LOAD SITE ACTIVITY
   */
  const loadSiteActivity = useCallback(
    async (currentBusinessId: string, currentSiteId: string) => {
      setLoadingActivities(true)

      try {
        const { data, error: activityError } = await supabase
          .from("site_activity")
          .select("*")
          .eq("business_id", currentBusinessId)
          .eq("site_id", currentSiteId)
          .order("created_at", { ascending: false })
          .limit(100)

        if (activityError) {
          throw activityError
        }

        setActivities((data || []) as SiteActivity[])
      } catch (err) {
        console.error("Site activity loading error:", err)

        setActivities([])

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load site activity."
        )
      } finally {
        setLoadingActivities(false)
      }
    },
    []
  )

  /*
   * INITIAL BUSINESS LOAD
   */
  useEffect(() => {
    loadBusiness()
  }, [loadBusiness])

  /*
   * LOAD SITES AFTER BUSINESS IS KNOWN
   */
  useEffect(() => {
    if (!businessId) return

    loadSites(businessId)
  }, [businessId, loadSites])

  /*
   * LOAD ACTIVITY AFTER SELECTED SITE CHANGES
   *
   * This deliberately runs separately from the site loader.
   * It prevents the old stale selectedSite bug.
   */
  useEffect(() => {
    if (!businessId || !selectedSiteId) {
      setActivities([])
      return
    }

    loadSiteActivity(businessId, selectedSiteId)
  }, [businessId, selectedSiteId, loadSiteActivity])

  const selectedSite = useMemo(() => {
    if (!selectedSiteId) return null

    return sites.find((site) => site.id === selectedSiteId) || null
  }, [sites, selectedSiteId])

  /*
   * REFRESH
   */
  const refreshWorkspace = async () => {
    if (!businessId) return

    setError(null)

    await loadSites(businessId)

    if (selectedSiteId) {
      await loadSiteActivity(businessId, selectedSiteId)
    }
  }

  /*
   * OPEN MAIN GUARDIAN WORK WORKSPACE
   */
  const openWorkspace = (section: string) => {
    router.push(`/business?workspace=${section}`)
  }

  /*
   * LOADING
   */
  if (loadingBusiness) {
    return (
      <main className="min-h-screen bg-white px-5 py-10 text-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-7 w-56 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-4 h-4 w-80 animate-pulse rounded bg-slate-100" />
            <div className="mt-8 h-32 animate-pulse rounded-3xl bg-slate-100" />
          </div>
        </div>
      </main>
    )
  }

  /*
   * ERROR
   */
  if (error && !business) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-red-200 bg-white p-7 shadow-sm">
            <div className="text-sm font-semibold text-red-600">
              BUSINESS WORKSPACE
            </div>

            <h1 className="mt-2 text-2xl font-bold">
              We could not load your business
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {error}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  loadBusiness()
                }}
                className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
              >
                Try again
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /*
   * NO BUSINESS
   */
  if (!business) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Business setup required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your GUARDIAN WORK business account needs to be completed before
            Business Workspace can be opened.
          </p>

          <button
            type="button"
            onClick={() => router.push("/business/setup")}
            className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white"
          >
            Complete Business Setup
          </button>
        </div>
      </main>
    )
  }

  const businessName = getBusinessName(business)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xl"
              aria-label="Back"
            >
              ←
            </button>

            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                GUARDIAN WORK
              </div>

              <h1 className="truncate text-lg font-bold sm:text-xl">
                Business Workspace
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshWorkspace}
            disabled={loadingSites || loadingActivities}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* BUSINESS HERO */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                BUSINESS OPERATIONS
              </div>

              <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                {businessName}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Run your people, sites, work, forms, evidence and reports
                from one GUARDIAN WORK workspace.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="mt-1 font-bold">{userName}</div>
            </div>
          </div>
        </section>

        {/* ERROR BANNER */}
        {error && (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-amber-800">{error}</p>

            <button
              type="button"
              onClick={() => setError(null)}
              className="self-start rounded-xl bg-white px-3 py-2 text-xs font-bold text-amber-800 shadow-sm sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* WORKSPACE MODULES */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-black">Workspace</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage the operational side of your business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => openWorkspace("dashboard")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">▦</div>
              <div className="mt-3 font-bold">Dashboard</div>
              <div className="mt-1 text-xs text-slate-500">
                Overview
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("people")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">👥</div>
              <div className="mt-3 font-bold">People</div>
              <div className="mt-1 text-xs text-slate-500">
                Team
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("sites")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">⌖</div>
              <div className="mt-3 font-bold">Sites</div>
              <div className="mt-1 text-xs text-slate-500">
                Locations
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("work")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">✓</div>
              <div className="mt-3 font-bold">Work</div>
              <div className="mt-1 text-xs text-slate-500">
                Tasks
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("forms")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">☷</div>
              <div className="mt-3 font-bold">Forms</div>
              <div className="mt-1 text-xs text-slate-500">
                Capture
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("templates")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">▤</div>
              <div className="mt-3 font-bold">Templates</div>
              <div className="mt-1 text-xs text-slate-500">
                Build once
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("reports")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">▥</div>
              <div className="mt-3 font-bold">Reports</div>
              <div className="mt-1 text-xs text-slate-500">
                Insights
              </div>
            </button>

            <button
              type="button"
              onClick={() => openWorkspace("documents")}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl">▱</div>
              <div className="mt-3 font-bold">Documents</div>
              <div className="mt-1 text-xs text-slate-500">
                Files
              </div>
            </button>
          </div>
        </section>

        {/* SITES */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">Your Sites</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a site to view its operational activity.
              </p>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {sites.length} {sites.length === 1 ? "site" : "sites"}
            </span>
          </div>

          {loadingSites ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading sites...
            </div>
          ) : sites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="text-4xl">⌖</div>

              <h3 className="mt-3 font-bold">
                No business sites yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first operational site inside Business
                Workspace to begin recording site activity.
              </p>

              <button
                type="button"
                onClick={() => openWorkspace("sites")}
                className="mt-5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
              >
                Open Sites
              </button>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sites.map((site) => {
                const active = site.id === selectedSiteId

                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => setSelectedSiteId(site.id)}
                    className={`min-w-
