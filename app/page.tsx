const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="11" cy="11" r="5.5" />
    <path d="M16 16l5 5" />
  </svg>
);

const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 3l7 3v6c0 4.2-2.8 8.1-7 10-4.2-1.9-7-5.8-7-10V6l7-3z" />
    <path d="M9.5 12.5l1.7 1.7 3.3-4.2" />
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 21s6-4.8 6-11a6 6 0 10-12 0c0 6.2 6 11 6 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M5 12.5l4 4L19 2.5" />
  </svg>
);

const IconAttach = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M9.5 13.5l6.5-6.5a3 3 0 114.2 4.2l-7.4 7.4a5 5 0 11-7.1-7.1l8.2-8.2" />
  </svg>
);

const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0014 0M12 18v3M8 21h8" />
  </svg>
);

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M8 6.5v11l9-5.5-9-5.5z" />
  </svg>
);

const IconSignal = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 opacity-80">
    <rect x="2" y="12" width="3" height="7" rx="1" />
    <rect x="7" y="9" width="3" height="10" rx="1" />
    <rect x="12" y="6" width="3" height="13" rx="1" />
    <rect x="17" y="3" width="3" height="16" rx="1" />
  </svg>
);

const IconBattery = () => (
  <div className="relative flex h-5 w-8 items-center justify-end rounded-[3px] border border-[#1f1f1f] bg-white/20 px-[2px]">
    <div className="h-3.5 w-[18px] rounded-[2px] bg-[#1d1d1d]" />
    <div className="absolute -right-1 top-1.5 h-2.5 w-1 rounded-[1px] bg-[#1d1d1d]" />
  </div>
);

const avatarPhoto =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80";

const evidencePhoto1 =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80";

const evidencePhoto2 =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e5e5e1] p-4 sm:p-6">
      <div className="relative h-[850px] w-[420px] overflow-hidden rounded-[42px] border border-[#1a1a1a]/10 bg-[#f5f5f1] shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
        <div className="absolute left-1/2 top-2 h-2 w-28 -translate-x-1/2 rounded-full bg-[#121212]" />

        <div className="px-4 pb-4 pt-7">
          <div className="flex items-center justify-between px-3 pt-2 text-[11px] font-bold text-[#1b1b1b]">
            <span>09:41</span>
            <div className="flex items-center gap-2">
              <IconSignal />
              <div className="text-[10px] font-black">82%</div>
              <IconBattery />
            </div>
          </div>

          <div className="mt-4 rounded-[30px] bg-[#0a9b5a] px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-white">
                <span className="flex h-9 w-9 items-center justify-center text-white/90">
                  <IconArrowLeft />
                </span>
                <div className="leading-[0.9] text-[#f7fff8]">
                  <div className="text-[18px] font-black tracking-[-0.06em]">SITE LOG - Sandton</div>
                  <div className="text-[18px] font-black tracking-[-0.06em]">City Site</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/95">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/0">
                  <IconSearch />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/0">
                  <IconMore />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#dfe4de] bg-[#f3f5f1] px-3 py-2.5 shadow-[0_2px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#1a7b55] bg-[#dcefe5] text-[#1a7b55]">
                  <IconShield />
                </div>
                <div className="text-[13px] font-black uppercase tracking-[-0.06em] text-[#173b2d]">
                  MY GUARDIAN WORK
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#1c8d60] bg-[#edf8f3] px-3 py-1.5 text-[11px] font-black uppercase tracking-[-0.04em] text-[#167d58]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#18a769] shadow-[0_0_0_2px_rgba(24,167,105,0.18)]" />
                LIVE • Active Site
              </div>
            </div>
          </div>

          <div className="relative mt-5 pl-1 pr-2">
            <div className="absolute left-[35px] top-0 bottom-0 w-[2px] bg-[#c4c7c1] opacity-90" />

            <div className="flex">
              <div className="w-[53px] pt-1 text-[12px] font-black text-[#7d7d7d]">08:00</div>
              <div className="ml-2 flex-1">
                <div className="mb-3 flex items-start gap-3">
                  <div className="relative mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-full border-[2px] border-[#d6d6d2] bg-[#efefed]">
                    <img src={avatarPhoto} alt="Thabo" className="h-full w-full object-cover" />
                  </div>

                  <div className="flex-1 rounded-[18px] border border-[#dfe4de] bg-[#f0f0ef] p-2.5 shadow-[0_2px_0_rgba(0,0,0,0.02)]">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="text-[16px] font-black tracking-[-0.04em] text-[#1e1e1e]">Thabo</div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#767676]">Security</div>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dff7e9] text-[#1a8a64]">
                        <IconCheck />
                      </div>
                    </div>

                    <div className="text-[16px] font-black tracking-[-0.04em] text-[#1d1d1d]">Thabo clocked in</div>
                    <div className="mt-3 flex items-center gap-2 rounded-[14px] border border-[#cde9d5] bg-[#dff4e6] px-3 py-2 text-[12px] font-black text-[#0f7b54]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1d9d66] text-white">
                        <IconCheck />
                      </span>
                      Clock-in confirmed • 08:00 AM
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2 rounded-[16px] border border-[#dfe5d7] bg-[#dff3e7] px-3 py-2 text-[12px] font-black text-[#0f7b54]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a9c66] text-white">
                    <IconPin />
                  </span>
                  GPS: Sandton City, Gate A • Verified location
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="w-[53px] pt-1 text-[12px] font-black text-[#7d7d7d]">08:05</div>
              <div className="ml-2 flex-1">
                <div className="rounded-[18px] border border-[#e7d2b8] bg-[#f0c9a7] p-3.5 shadow-[0_2px_0_rgba(0,0,0,0.02)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="pr-2 text-[18px] font-black tracking-[-0.06em] text-[#1d1d1d]">
                      Boss (Supervisor)
                    </div>
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8883e]/15 text-[#d26d1f]">
                      <span className="text-[10px] font-black">!</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[17px] font-black leading-[1.1] tracking-[-0.05em] text-[#1d1d1d]">
                    Please confirm perimeter check completed before 09:00.
                    <span className="block mt-1">Respond when done.</span>
                  </div>

                  <div className="mt-3 flex items-center justify-end text-[12px] font-black text-[#8f5a2d]">08:05 AM • Seen</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex">
              <div className="w-[53px] pt-1 text-[12px] font-black text-[#7d7d7d]">08:12</div>
              <div className="ml-2 flex-1">
                <div className="rounded-[18px] border border-[#dfe3dc] bg-[#f5f5f1] p-3.5 shadow-[0_2px_0_rgba(0,0,0,0.02)]">
                  <div className="text-[18px] font-black tracking-[-0.06em] text-[#171717]">Worker evidence submitted</div>
                  <div className="mt-2 text-[17px] font-medium tracking-[-0.04em] text-[#1d1d1d]">
                    Photo evidence — Gate locked secured
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <img src={evidencePhoto1} alt="Evidence 1" className="h-20 w-full rounded-[12px] object-cover" />
                    <div className="flex items-center justify-center rounded-[12px] bg-[#dfe6dc] text-[12px] font-black text-[#465d4b]">
                      +1 photo
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2 text-[12px] font-black text-[#6a6a6a]">
                    <span>08:12 AM • 1 photo</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-[16px] border border-[#dfe5d7] bg-[#dff3e7] px-3 py-2 text-[12px] font-black text-[#0f7b54]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a9c66] text-white">
                    <IconPin />
                  </span>
                  GPS: Sandton City, East Gate • -26.1076, 28.0567
                </div>
              </div>
            </div>

            <div className="mt-4 flex">
              <div className="w-[53px] pt-1 text-[12px] font-black text-[#7d7d7d]">10:30</div>
              <div className="ml-2 flex-1">
                <div className="rounded-[18px] border border-[#e7d2b8] bg-[#f0c9a7] p-3.5 shadow-[0_2px_0_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 text-[18px] font-black tracking-[-0.06em] text-[#1d1d1d]">
                    Incident reported
                    <span className="text-[#d86426]">• Priority</span>
                  </div>

                  <div className="mt-2 text-[18px] font-black text-[#1d1d1d]">Incident —</div>
                  <div className="text-[17px] font-black tracking-[-0.04em] text-[#1d1d1d]">
                    Unusual activity at loading bay
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-[#e6c39c] bg-[#f3d1a4] p-2.5">
                    <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f8ba5d] text-[#1d1d1d] shadow-[0_3px_10px_rgba(248,186,93,0.35)]">
                      <IconPlay />
                    </button>

                    <div className="flex-1">
                      <div className="mt-1 flex h-8 items-center gap-1 overflow-hidden rounded-full bg-[#f5c985] px-2">
                        {[...Array(28)].map((_, idx) => (
                          <span
                            key={idx}
                            className="w-[3px] rounded-full bg-[#9a5f25]"
                            style={{ height: `${8 + ((idx * 7) % 18)}px`, opacity: idx % 3 === 0 ? 1 : 0.75 }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-black text-[#7d5130]">
                        <span>Voice note • 10:30 AM</span>
                        <span>00:14</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[12px] border border-[#e8d3bc] bg-[#f3d2ab] p-2">
                    <img src={evidencePhoto2} alt="Load bay evidence" className="h-16 w-full rounded-[8px] object-cover" />
                  </div>

                  <div className="mt-3 text-[12px] font-black text-[#6a5046]">1 photo • 10:30 AM</div>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-[16px] border border-[#dfe5d7] bg-[#dff3e7] px-3 py-2 text-[12px] font-black text-[#0f7b54]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a9c66] text-white">
                    <IconPin />
                  </span>
                  GPS: Sandton City, Loading Bay • 10:30 AM
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-[#d0d4d0] bg-[#f6f4f2] px-3 py-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1a1a] bg-transparent text-[#1a1a1a]">
              <IconAttach />
            </button>

            <div className="flex-1 rounded-full border border-[#d8d8d1] bg-[#eef0ee] px-4 py-2.5 text-[14px] font-medium text-[#7c7c7c]">
              Add note or evidence...
            </div>

            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f9c60] text-white shadow-[0_8px_16px_rgba(15,156,96,0.35)]">
              <IconMic />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
