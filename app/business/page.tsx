// app/business/page.tsx - GUARDIAN WORK V5 - Business Engine
"use client";

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      {/* Top Bar like V5 */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#0F8A5F] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">GW</div>
          <div>
            <h1 className="font-black leading-none">GUARDIAN WORK</h1>
            <p className="text-[10px] tracking-widest opacity-60">BUSINESS ENGINE V5</p>
          </div>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-3xl font-black mt-4">Business Command Center</h2>
        <p className="opacity-60 mt-1">Manage talent, jobs, and hiring in Secunda & beyond.</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <p className="text-xs opacity-60">Active Jobs</p>
            <p className="text-2xl font-black">12</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <p className="text-xs opacity-60">Matches Today</p>
            <p className="text-2xl font-black">47</p>
          </div>
          <div className="bg-[#0F8A5F] text-white p-5 rounded-2xl shadow-sm">
            <p className="text-xs opacity-80">Live Talent</p>
            <p className="text-2xl font-black">324</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <a href="/business/jobs/new" className="bg-[#FF8C1A] text-white p-6 rounded-[20px] font-bold flex justify-between items-center">
            <span>+ Post New Job (Secunda)</span>
            <span>→</span>
          </a>
          <a href="/business/setup" className="bg-white border-2 border-black p-6 rounded-[20px] font-bold flex justify-between items-center">
            <span>Business Profile Setup</span>
            <span>→</span>
          </a>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-[24px] p-6 border">
          <h3 className="font-bold">Recent Applications</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div><p className="font-bold text-sm">General Worker - Sasol Secunda</p><p className="text-xs opacity-60">5 new applicants</p></div>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Live</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <div><p className="font-bold text-sm">Cleaner - Trichardt Mall</p><p className="text-xs opacity-60">12 new applicants</p></div>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Live</span>
            </div>
            <div className="flex justify-between items-center">
              <div><p className="font-bold text-sm">Driver - eMbalenhle</p><p className="text-xs opacity-60">3 new applicants</p></div>
              <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">Review</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] opacity-30">guardian-work / app / business / page.tsx • ENGINE ON • V5</div>
      </div>
    </div>
  );
}
