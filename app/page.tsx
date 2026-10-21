'use client'

import { useState } from 'react'

const tabs = ['Social', 'Business', 'Jobs'] as const

type FeedTab = (typeof tabs)[number]

const socialPosts = [
  {
    id: 1,
    author: 'Aphiwe Mokoena',
    handle: '@aphiwe',
    time: '18m ago',
    title: 'New safety training completed',
    text:
      'Our team wrapped up the latest site safety review and is now ready for the next batch of warehouse and construction work. Excited to keep building skills in the community.',
    tags: ['Safety', 'Training', 'Community'],
    metrics: { likes: '1.8k', comments: '230', shares: '96' },
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    id: 2,
    author: 'Guardian Work',
    handle: '@guardianwork',
    time: '54m ago',
    title: 'People-first hiring is growing',
    text:
      'We’re seeing more businesses connect with local talent in KwaZulu-Natal and Mpumalanga. A stronger local network means more jobs and better opportunities for every skill level.',
    tags: ['Hiring', 'Local talent', 'Growth'],
    metrics: { likes: '2.4k', comments: '410', shares: '142' },
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 3,
    author: 'Nandi Khumalo',
    handle: '@nandi',
    time: '2h ago',
    title: 'A recent win for our crew',
    text:
      'We completed two project sign-offs this week and the whole team is feeling the momentum. Consistency and trust are still the biggest drivers of growth.',
    tags: ['Wins', 'Crew', 'Momentum'],
    metrics: { likes: '890', comments: '116', shares: '34' },
    accent: 'from-sky-500 to-cyan-500',
  },
]

const businessPosts = [
  {
    id: 1,
    name: 'BuildGrid SA',
    type: 'Construction',
    location: 'Johannesburg',
    status: 'Hiring now',
    description:
      'Looking for skilled site supervisors, welders, and general labourers for medium-sized commercial jobs across Gauteng.',
    cta: 'View roles',
  },
  {
    id: 2,
    name: 'FreshCart Distribution',
    type: 'Logistics',
    location: 'Durban',
    status: 'Open roles',
    description:
      'Need inventory pickers, dispatch staff, and warehouse coordinators for a fast-moving retail network.',
    cta: 'Review needs',
  },
  {
    id: 3,
    name: 'Urban Care Services',
    type: 'Facility Support',
    location: 'Cape Town',
    status: 'New campaign',
    description:
      'Launching a recruitment push for cleaners, maintenance assistants, and client service workers this month.',
    cta: 'Explore',
  },
]

const insightCards = [
  { label: 'Open roles', value: '128' },
  { label: 'Talent matched', value: '3.4k' },
  { label: 'Active businesses', value: '49' },
]

const trendingTopics = ['Construction hiring', 'Warehouse jobs', 'Skilled labour', 'Safety training']

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>('Social')

  return (
    <div className="min-h-screen bg-[#f4f1ed] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-lg font-black text-white shadow-lg shadow-emerald-200">
                G
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-emerald-700">Guardian Work</p>
                <h1 className="text-xl font-black text-slate-900">Community feed</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                Messages
              </button>
              <button type="button" className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-200">
                Post update
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="space-y-5">
            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Profile</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white">
                  TM
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Thabo M.</h2>
                  <p className="text-sm text-slate-500">Welder / Site Tech</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                <button type="button" className="rounded-2xl bg-slate-100 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                  My profile
                </button>
                <button type="button" className="rounded-2xl bg-slate-100 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                  Saved posts
                </button>
                <button type="button" className="rounded-2xl bg-slate-100 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                  Opportunities
                </button>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Trending</p>
              <div className="mt-4 space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-700">#{index + 1} {topic}</span>
                    <span className="text-xs text-slate-400">New</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-5">
            {activeTab === 'Social' && (
              <>
                <section className="rounded-[28px] border border-slate-200 bg-gradient-to-r from-emerald-700 to-emerald-500 p-5 text-white shadow-[0_18px_40px_rgba(16,185,129,0.25)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-100">For you</p>
                      <h2 className="mt-2 text-3xl font-black">Build your network.</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-100">Community</p>
                      <p className="mt-1 text-2xl font-black">24.8k</p>
                    </div>
                  </div>
                </section>

                <div className="space-y-5">
                  {socialPosts.map((post) => (
                    <article key={post.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-slate-900 to-slate-600 text-sm font-black text-white">
                            {post.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-base font-black text-slate-900">{post.author}</h3>
                            <p className="text-sm text-slate-500">{post.handle} · {post.time}</p>
                          </div>
                        </div>
                        <button type="button" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                          Follow
                        </button>
                      </div>

                      <div className="mt-4 rounded-[24px] bg-gradient-to-br p-4 text-white shadow-lg ${post.accent}">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Update</p>
                        <h4 className="mt-2 text-2xl font-black">{post.title}</h4>
                      </div>

                      <p className="mt-4 text-[15px] leading-7 text-slate-600">{post.text}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
                        <div className="flex items-center gap-6">
                          <span>♥ {post.metrics.likes}</span>
                          <span>💬 {post.metrics.comments}</span>
                          <span>↗ {post.metrics.shares}</span>
                        </div>
                        <button type="button" className="font-bold text-emerald-700">Share</button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'Business' && (
              <div className="space-y-5">
                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">Business feed</p>
                      <h2 className="mt-2 text-2xl font-black text-slate-900">Opportunities for businesses</h2>
                    </div>
                    <button type="button" className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
                      Add listing
                    </button>
                  </div>
                </section>

                {businessPosts.map((item) => (
                  <article key={item.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">{item.type}</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{item.location}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-4 text-[15px] leading-7 text-slate-600">{item.description}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                      <div className="text-sm text-slate-500">32 applicants this week</div>
                      <button type="button" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">
                        {item.cta}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'Jobs' && (
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-700">Jobs</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">Latest opportunities</h2>
                  </div>
                  <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                    Filter
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    ['Skilled Welder', 'SteelCore Fabrication', 'R18k - R24k'],
                    ['General Labourer', 'Nala Logistics', 'R12.5k - R15.5k'],
                    ['Site Supervisor', 'Guardian Build', 'R25k - R32k'],
                    ['Warehouse Picker', 'FreshCart Distribution', 'R9.5k - R12k'],
                  ].map(([title, company, salary]) => (
                    <div key={title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full-time</p>
                      <h3 className="mt-2 text-xl font-black text-slate-900">{title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{company}</p>
                      <p className="mt-4 text-sm font-bold text-emerald-700">{salary}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-5">
            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Summary</p>
              <div className="mt-4 space-y-3">
                {insightCards.map((card) => (
                  <div key={card.label} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Suggested for you</p>
              <div className="mt-4 space-y-4">
                {['Site supervisors', 'Warehouse roles', 'Safety and training', 'Business growth tips'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                    <span className="text-xs text-slate-400">View</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
