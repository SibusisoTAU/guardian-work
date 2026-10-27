import { NextResponse } from 'next/server'
import { filterJobs, jobsSeed } from '../../../lib/guardian-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'All'

  const jobs = filterJobs({
    jobs: jobsSeed,
    search: q,
    category,
  })

  return NextResponse.json({
    jobs,
    total: jobs.length,
    q,
    category,
  })
}
