'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    salary: '',
    tags: '',
    description: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        salary: form.salary,
        tags: form.tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        description: form.description,
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      router.push('/business')
    } catch (error) {
      console.error(error)
      alert('Something went wrong while creating the job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Post a new job</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a listing that seekers can discover and apply to.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Job title"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
            <input
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Company name"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Location"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              required
            />
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Contract</option>
            </select>
          </div>

          <input
            value={form.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            placeholder="Salary e.g. R18 000 - R24 000 / month"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            required
          />

          <input
            value={form.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="Tags (comma separated): Welding, Safety, Logistics"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          />

          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Job description"
            rows={5}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white"
          >
            {loading ? 'Posting...' : 'Publish job'}
          </button>
        </form>
      </div>
    </main>
  )
}
