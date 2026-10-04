'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

type Job = {
  id: string
  title: string
  company: string
  location: string
  type: 'Full-Time' | 'Part-Time' | 'Contract'
  salary: string
  tags: string[]
  description: string
}

const jobsSeed: Job[] = [
  {
    id: 'job-1',
    title: 'Skilled Welder',
    company: 'SteelCore Fabrication',
    location: 'Secunda, Mpumalanga',
    type: 'Full-Time',
    salary: 'R18 000 - R24 000 / month',
    tags: ['Welding', 'Fabrication', 'Safety'],
    description: 'Looking for a skilled welder to work on structural and maintenance jobs in heavy fabrication environments.'
  },
  {
    id: 'job-2',
    title: 'General Labourer',
    company: 'Nala Logistics',
    location: 'Witbank, Mpumalanga',
    type: 'Contract',
    salary: 'R12 500 - R15 500 / month',
    tags: ['Labour', 'Warehouse', 'Operations'],
    description: 'Support warehouse operations, loading and offloading, site cleanup and general support duties.'
  },
  {
    id: 'job-3',
    title: 'Site Supervisor',
    company: 'Guardian Build',
    location: 'Johannesburg, Gauteng',
    type: 'Full-Time',
    salary: 'R25 000 - R32 000 / month',
    tags: ['Leadership', 'Construction', 'Site Management'],
    description: 'Lead site operations, coordinate crews, and ensure work quality and safety standards are maintained.'
  },
  {
    id: 'job-4',
    title: 'Warehouse Picker',
    company: 'FreshCart Distribution',
    location: 'Durban, KwaZulu-Natal',
    type: 'Part-Time',
    salary: 'R9 500 - R12 000 / month',
    tags: ['Picking', 'Inventory', 'Logistics'],
    description: 'Support daily order picking, packing, scanning and stock organization in a busy distribution centre.'
  }
]

export default function SeekerPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'jobs' | 'saved' | 'applications' | 'profile'>('jobs')
  const [savedIds, setSavedIds] = useState<string[]>(['job-3'])
  const [appliedIds, setAppliedIds] = useState<string[]>(['job-1'])
  const [userEmail, setUserEmail] = useState('jobseeker@guardian.work')
  const [profile, setProfile] = useState({
    name: 'Thabo Kgomo',
    title: 'Welder / Site Technician',
    town: 'Secunda',
    province: 'Mpumalanga',
    phone: '+27 82 123 4567'
  })

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }

    void loadUser()
  }, [])

  const filteredJobs = useMemo(() => {
    return jobsSeed.filter((job) => {
      const matchesCategory = category === 'All' || job.type === category
      const haystack = `${job.title} ${job.company} ${job.location} ${job.tags.join(' ')}`.toLowerCase()
      const matchesSearch = haystack.includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const savedJobs = jobsSeed.filter((job) => savedIds.includes(job.id))
  const appliedJobs = jobsSeed.filter((job) => appliedIds.includes(job.id))

  const handleSave = (jobId: string) => {
    setSavedIds((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    )
  }

  const handleApply = (jobId: string) => {
    setAppliedIds((current) =>
      current.includes(jobId) ? current : [...current, jobId]
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const renderJobs = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search jobs, skills or company"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-emerald-500 focus:bg-white"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
          >
            <option value="All">All roles</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.map((job) => {
          const isSaved = savedIds.includes(job.id)
          const isApplied = appliedIds.includes(job.id)

          return (
            <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">{job.type}</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                  <p className="mt-2 text-sm text-slate-500">{job.location}</p>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">{job.salary}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSave(job.id)}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold ${
                      isSaved
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    {isApplied ? 'Applied' : 'Apply now'}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderSaved = () => (
    <div className="grid gap-4">
      {savedJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          You have no saved jobs yet.
        </div>
      ) : (
        savedJobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
              </div>
              <button
                type="button"
                onClick={() => handleApply(job.id)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
              >
                {appliedIds.includes(job.id) ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderApplications = () => (
    <div className="grid gap-4">
      {appliedJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          You haven’t applied to any jobs yet.
        </div>
      ) : (
        appliedJobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500">{job.company} • {job.location}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Submitted
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderProfile = () => (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-xl font-black text-white">
          {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">{profile.name}</h3>
          <p className="text-sm text-slate-500">{profile.title}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</p>
          <p className="mt-2 text-base font-semibold text-slate-800">{profile.town}, {profile.province}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Phone</p>
          <p className="mt-2 text-base font-semibold text-slate-800">{profile.phone}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Email</p>
          <p className="mt-2 text-base font-semibold text-slate-800">{userEmail}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white"
        >
          Browse jobs
        </button>
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
        >
          Update profile
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Guardian Work</p>
            <h1 className="text-xl font-black text-slate-900">Job seeker portal</h1>
          </div>

          <div className="flex items-center gap-2">
            {['jobs', 'saved', 'applications', 'profile'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as 'jobs' | 'saved' | 'applications' | 'profile')}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab === 'jobs' && 'Jobs'}
                {tab === 'saved' && 'Saved'}
                {tab === 'applications' && 'Applications'}
                {tab === 'profile' && 'Profile'}
              </button>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-100">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black">{profile.name}</h2>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Jobs matched</p>
              <p className="mt-1 text-2xl font-black">{filteredJobs.length}</p>
            </div>
          </div>
        </section>

        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'saved' && renderSaved()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'profile' && renderProfile()}
      </main>
    </div>
  )
}
