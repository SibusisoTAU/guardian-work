"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Person = {
  id: string | number;
  full_name: string;
  phone?: string | null;
  area?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type Job = {
  id: string | number;
  company: string;
  role: string;
  status?: string | null;
  created_at?: string | null;
};

type View =
  | "home"
  | "work"
  | "talent"
  | "jobs"
  | "employer"
  | "admin";

export default function Page() {
  const [view, setView] = useState<View>("home");

  const [people, setPeople] = useState<Person[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [skillText, setSkillText] = useState("");
  const [experience, setExperience] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobArea, setJobArea] = useState("");

  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [peopleResult, jobsResult] = await Promise.all([
        supabase
          .from("people")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (peopleResult.error) {
        throw new Error(peopleResult.error.message);
      }

      if (jobsResult.error) {
        throw new Error(jobsResult.error.message);
      }

      setPeople((peopleResult.data || []) as Person[]);
      setJobs((jobsResult.data || []) as Job[]);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't connect to GUARDIAN WORK right now."
      );
    } finally {
      setLoading(false);
    }
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function createWorker() {
    if (!name.trim() || !phone.trim()) {
      flash("Please add your name and WhatsApp number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("people")
        .insert([
          {
            full_name: name.trim(),
            phone: phone.trim(),
            area: area.trim() || "Not specified",
            status: "available",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setName("");
      setPhone("");
      setArea("");
      setSkillText("");
      setExperience("");

      await loadData();

      flash(
        "Your Work Identity is now in the GUARDIAN WORK talent pool."
      );

      setView("work");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't create your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function createJob() {
    if (!company.trim() || !role.trim()) {
      flash("Please add the company and role.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("jobs")
        .insert([
          {
            company: company.trim(),
            role: role.trim(),
            status: "open",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setCompany("");
      setRole("");
      setJobArea("");

      await loadData();

      flash("Opportunity published to GUARDIAN WORK.");

      setView("jobs");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't publish this opportunity. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const availablePeople = useMemo(() => {
    return people.filter(
      (person) =>
        String(person.status || "available").toLowerCase() !==
        "unavailable"
    );
  }, [people]);

  const filteredPeople = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return availablePeople;

    return availablePeople.filter((person) =>
      [
        person.full_name,
        person.area,
        person.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [availablePeople, search]);

  const openJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        String(job.status || "open").toLowerCase() !== "closed"
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const term = jobSearch.trim().toLowerCase();

    if (!term) return openJobs;

    return openJobs.filter((job) =>
      [job.company, job.role, job.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [openJobs, jobSearch]);

  function go(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyToJob(job: Job) {
    flash(
      `Interest recorded for ${job.role} at ${job.company}. The application system will be connected to the full V5 application engine next.`
    );
  }

  function contactWorker(person: Person) {
    const number = String(person.phone || "").replace(/\D/g, "");

    if (!number) {
      flash("This Work Identity does not have a contact number.");
      return;
    }

    const normalized =
      number.startsWith("0") ? `27${number.slice(1)}` : number;

    window.open(
      `https://wa.me/${normalized}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-[#111714]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => go("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B4D2E] text-lg font-black text-white shadow-lg">
              G
            </div>

            <div className="text-left">
              <p className="text-sm font-black tracking-tight">
                GUARDIAN WORK
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#0B4D2E]">
                Discover • Connect • Work
              </p>
            </div>
          </button>

          <button
            onClick={() => go("admin")}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wide"
          >
            Operations
          </button>
        </div>
      </header>

      {/* NOTICE */}
      {notice && (
        <div className="fixed left-4 right-4 top-20 z-[60] mx-auto max-w-xl rounded-2xl bg-[#111714] px-5 py-4 text-sm font-bold text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="text-[#FF9F1C]">●</span>
            <span>{notice}</span>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-black text-red-800">
              GUARDIAN WORK connection issue
            </p>

            <p className="mt-1 text-xs text-red-700">
              {error}
            </p>

            <button
              onClick={loadData}
              className="mt-3 rounded-full bg-red-700 px-4 py-2 text-xs font-black text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* HOME */}
      {view === "home" && (
        <>
          <section className="overflow-hidden bg-[#0B4D2E] text-white">
            <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-8 md:pb-16 md:pt-20">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF9F1C]" />
                  <span className="text-[10px] font-black uppercase tracking-[2px]">
                    Work access platform
                  </span>
                </div>

                <h1 className="text-5xl font-black leading-[0.95] tracking-[-2px] md:text-7xl">
                  What you can do
                  <br />
                  can open doors.
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
                  GUARDIAN WORK helps people turn their skills,
                  experience and availability into a discoverable
                  Work Identity — then connects that talent to
                  businesses looking for people.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => go("work")}
                    className="rounded-2xl bg-white px-6 py-5 text-left text-black shadow-xl transition hover:-translate-y-1"
                  >
                    <span className="block text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
                      For people
                    </span>
                    <span className="mt-1 block text-lg font-black">
                      Build my Work Identity →
                    </span>
                  </button>

                  <button
                    onClick={() => go("employer")}
                    className="rounded-2xl bg-[#FF9F1C] px-6 py-5 text-left text-black shadow-xl transition hover:-translate-y-1"
                  >
                    <span className="block text-[10px] font-black uppercase tracking-[2px]">
                      For businesses
                    </span>
                    <span className="mt-1 block text-lg font-black">
                      Find people →
                    </span>
                  </button>
                </div>
              </div>

              {/* LIVE STATS */}
              <div className="mt-10 grid grid-cols-3 gap-2 md:max-w-2xl md:gap-3">
                <Stat
                  label="Talent"
                  value={loading ? "—" : String(people.length)}
                />
                <Stat
                  label="Open work"
                  value={loading ? "—" : String(openJobs.length)}
                />
                <Stat
                  label="System"
                  value={loading ? "..." : "LIVE"}
                />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
            <div className="grid gap-4 md:grid-cols-3">
              <Feature
                number="01"
                title="Build"
                text="Create a simple Work Identity around what you can actually do."
              />
              <Feature
                number="02"
                title="Discover"
                text="Businesses can discover available people and open opportunities."
              />
              <Feature
                number="03"
                title="Connect"
                text="Move from profile to real human connection without unnecessary complexity."
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="p-6 md:p-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
                      Live opportunity board
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Recent work
                    </h2>
                  </div>

                  <button
                    onClick={() => go("jobs")}
                    className="rounded-full bg-[#111714] px-5 py-3 text-xs font-black text-white"
                  >
                    View all work
                  </button>
                </div>

                <div className="mt-6">
                  {loading ? (
                    <LoadingRows />
                  ) : openJobs.length === 0 ? (
                    <EmptyState
                      title="No opportunities yet"
                      text="New opportunities will appear here when businesses publish them."
                    />
                  ) : (
                    <div className="space-y-3">
                      {openJobs.slice(0, 4).map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onApply={() => applyToJob(job)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] bg-[#111714] p-6 text-white md:p-8">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                The Guardian principle
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight md:text-4xl">
                A CV tells someone what happened.
                <br />
                A Work Identity shows what you can bring.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
                GUARDIAN WORK is being built around discoverability,
                trust and connection — especially for people who may
                not have a perfect traditional employment history.
              </p>
            </div>
          </section>
        </>
      )}

      {/* WORK IDENTITY */}
      {view === "work" && (
        <section className="mx-auto min-h-screen max-w-3xl px-4 py-7 pb-24">
          <BackButton onClick={() => go("home")} />

          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Work Identity
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Make yourself discoverable.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Start with the essentials. You don't need a perfect CV
              to begin building your work identity.
            </p>
          </div>

          <div className="mt-7 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
            <div className="grid gap-4">
              <Input
                label="Full name"
                placeholder="e.g. Sibusiso Tau"
                value={name}
                onChange={setName}
              />

              <Input
                label="WhatsApp / phone"
                placeholder="e.g. 076 000 0000"
                value={phone}
                onChange={setPhone}
              />

              <Input
                label="Where do you work from?"
                placeholder="e.g. Secunda, Embalenhle"
                value={area}
                onChange={setArea}
              />

              <div>
                <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
                  What can you do?
                </label>

                <textarea
                  value={skillText}
                  onChange={(e) => setSkillText(e.target.value)}
                  placeholder="e.g. Cashier, welding, cleaning, computer skills, construction..."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none transition focus:border-[#0B4D2E]"
                />
              </div>

              <Input
                label="Experience"
                placeholder="e.g. 2 years retail / beginner / experienced"
                value={experience}
                onChange={setExperience}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#F0F6F2] p-4">
              <p className="text-xs font-black text-[#0B4D2E]">
                🔒 Your information
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Only the information currently supported by the
                platform database will be stored in this first V5.1
                release. More Work Identity fields will be connected
                in the next database upgrade.
              </p>
            </div>

            <button
              onClick={createWorker}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#0B4D2E] py-5 text-sm font-black text-white shadow-lg disabled:opacity-50"
            >
              {saving
                ? "Creating your Work Identity..."
                : "Become Discoverable →"}
            </button>
          </div>

          <div className="mt-6 rounded-[28px] bg-[#111714] p-6 text-white">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              Discoverability
            </p>

            <h2 className="mt-2 text-2xl font-black">
              You don't have to be perfect to be discoverable.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/60">
              Start with what you know. As GUARDIAN WORK grows, your
              Work Identity can become richer with verified skills,
              experience, references, documents and work history.
            </p>
          </div>
        </section>
      )}

      {/* JOBS */}
      {view === "jobs" && (
        <section className="mx-auto min-h-screen max-w-5xl px-4 py-7 pb-24 md:px-8">
          <BackButton onClick={() => go("home")} />

          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Opportunities
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Work available now.
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Search the opportunities currently published on
              GUARDIAN WORK.
            </p>
          </div>

          <div className="mt-6">
            <SearchBox
              value={jobSearch}
              onChange={setJobSearch}
              placeholder="Search company or role..."
            />
          </div>

          <div className="mt-5">
            {loading ? (
              <LoadingRows />
            ) : filteredJobs.length === 0 ? (
              <EmptyState
                title="Nothing found"
                text="Try another search or check back when new opportunities are published."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={() => applyToJob(job)}
                    large
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TALENT */}
      {view === "talent" && (
        <section className="mx-auto min-h-screen max-w-5xl px-4 py-7 pb-24 md:px-8">
          <BackButton onClick={() => go("employer")} />

          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              Talent discovery
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Find people.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Discover available people currently visible in the
              GUARDIAN WORK talent pool.
            </p>
          </div>

          <div className="mt-6">
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search name, area or availability..."
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs font-black text-zinc-500">
              {loading
                ? "Loading..."
                : `${filteredPeople.length} discoverable`}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {loading ? (
              <LoadingRows />
            ) : filteredPeople.length === 0 ? (
              <div className="md:col-span-2">
                <EmptyState
                  title="No matching people"
                  text="Try another name or area."
                />
              </div>
            ) : (
              filteredPeople.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onContact={() => contactWorker(person)}
                />
              ))
            )}
          </div>
        </section>
      )}

      {/* EMPLOYER */}
      {view === "employer" && (
        <section className="mx-auto min-h-screen max-w-4xl px-4 py-7 pb-24">
          <BackButton onClick={() => go("home")} />

          <div className="mt-6">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              For businesses
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Find people faster.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Publish an opportunity or explore the current talent
              pool.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => go("talent")}
              className="rounded-[28px] bg-[#111714] p-6 text-left text-white shadow-xl transition hover:-translate-y-1"
            >
              <div className="text-3xl">◎</div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                Talent
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Discover people
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Search available Work Identities by name or area.
              </p>
              <span className="mt-6 inline-block text-xs font-black">
                Explore talent →
              </span>
            </button>

            <button
              onClick={() => {
                window.scrollTo({ top: 0 });
              }}
              className="rounded-[28px] bg-[#FF9F1C] p-6 text-left shadow-xl"
            >
              <div className="text-3xl">＋</div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[2px]">
                Opportunity
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Publish work
              </h2>
              <p className="mt-2 text-sm leading-6">
                Tell people what role you need and where the
                opportunity is.
              </p>
            </button>
          </div>

          <div className="mt-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Publish opportunity
            </p>

            <div className="mt-5 grid gap-4">
              <Input
                label="Business / company"
                placeholder="e.g. Local Retail Store"
                value={company}
                onChange={setCompany}
              />

              <Input
                label="Role"
                placeholder="e.g. Cashier, Cleaner, Packer"
                value={role}
                onChange={setRole}
              />

              <Input
                label="Area"
                placeholder="e.g. Secunda"
                value={jobArea}
                onChange={setJobArea}
              />
            </div>

            <button
              onClick={createJob}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#0B4D2E] py-5 text-sm font-black text-white shadow-lg disabled:opacity-50"
            >
              {saving
                ? "Publishing..."
                : "Publish Opportunity →"}
            </button>
          </div>
        </section>
      )}

      {/* ADMIN */}
      {view === "admin" && (
        <section className="min-h-screen bg-[#111714] px-4 py-7 pb-24 text-white">
          <div className="mx-auto max-w-5xl">
            <button
              onClick={() => go("home")}
              className="text-xs font-black text-white/50"
            >
              ← Back to GUARDIAN WORK
            </button>

            <div className="mt-8">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                Operations
              </p>

              <h1 className="mt-2 text-4xl font-black">
                Platform control.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                V5.1 operations view. This dashboard reflects live
                records available through the current Supabase
                connection.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
              <DarkStat
                label="People"
                value={loading ? "—" : String(people.length)}
              />

              <DarkStat
                label="Available"
                value={loading ? "—" : String(availablePeople.length)}
              />

              <DarkStat
                label="Jobs"
                value={loading ? "—" : String(jobs.length)}
              />

              <DarkStat
                label="Open"
                value={loading ? "—" : String(openJobs.length)}
              />
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">
                      Talent pool
                    </p>
                    <h2 className="mt-1 text-xl font-black">
                      Latest people
                    </h2>
                  </div>

                  <button
                    onClick={loadData}
                    className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-black"
                  >
                    Refresh
                  </button>
                </div>

                <div className="mt-5 space-y-2">
                  {people.length === 0 ? (
                    <p className="text-sm text-white/40">
                      No people in the database yet.
                    </p>
                  ) : (
                    people.slice(0, 8).map((person) => (
                      <div
                        key={person.id}
                        className="rounded-2xl bg-black/20 p-4"
                      >
                        <p className="text-sm font-black">
                          {person.full_name}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {person.area || "Area not supplied"} •{" "}
                          {person.status || "available"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-white/40">
                  Opportunity board
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Latest work
                </h2>

                <div className="mt-5 space-y-2">
                  {jobs.length === 0 ? (
                    <p className="text-sm text-white/40">
                      No opportunities in the database yet.
                    </p>
                  ) : (
                    jobs.slice(0, 8).map((job) => (
                      <div
                        key={job.id}
                        className="rounded-2xl bg-black/20 p-4"
                      >
                        <p className="text-sm font-black">
                          {job.role}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {job.company} •{" "}
                          {job.status || "open"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#FF9F1C]/20 bg-[#FF9F1C]/5 p-6">
              <p className="text-xs font-black text-[#FF9F1C]">
                🔒 V5.1 BUILD NOTE
              </p>

              <p className="mt-2 text-sm leading-6 text-white/60">
                Authentication, employer verification, applications,
                matching, placement records and role-based admin
                permissions should be connected in the next database
                phase rather than simulated inside the browser.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          <NavItem
            active={view === "home"}
            label="Home"
            icon="⌂"
            onClick={() => go("home")}
          />

          <NavItem
            active={view === "work"}
            label="My Work"
            icon="◎"
            onClick={() => go("work")}
          />

          <NavItem
            active={view === "jobs"}
            label="Work"
            icon="▣"
            onClick={() => go("jobs")}
          />

          <NavItem
            active={view === "employer"}
            label="Business"
            icon="◇"
            onClick={() => go("employer")}
          />
        </div>
      </nav>
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-[9px] font-black uppercase tracking-[1.5px] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function DarkStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[9px] font-black uppercase tracking-[1.5px] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <span className="text-xs font-black text-[#FF9F1C]">
        {number}
      </span>

      <h3 className="mt-6 text-xl font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {text}
      </p>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none transition focus:border-[#0B4D2E] focus:bg-white"
      />
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400">
        ⌕
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-[#0B4D2E]"
      />
    </div>
  );
}

function JobCard({
  job,
  onApply,
  large = false,
}: {
  job: Job;
  onApply: () => void;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-[#F8FAF8] p-4 ${
        large ? "p-5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B4D2E] text-sm font-black text-white">
              {String(job.company || "?")
                .charAt(0)
                .toUpperCase()}
            </span>

            <div>
              <p className="text-sm font-black">
                {job.role || "Opportunity"}
              </p>

              <p className="text-xs text-zinc-500">
                {job.company || "Business"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-black text-green-800">
              {job.status || "Open"}
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-zinc-500 ring-1 ring-black/5">
              Opportunity
            </span>
          </div>
        </div>

        <button
          onClick={onApply}
          className="rounded-full bg-[#111714] px-4 py-2 text-[10px] font-black text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function PersonCard({
  person,
  onContact,
}: {
  person: Person;
  onContact: () => void;
}) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2EC] text-lg font-black text-[#0B4D2E]">
            {String(person.full_name || "?")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <p className="font-black">
              {person.full_name || "Worker"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {person.area || "Area not supplied"}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-[9px] font-black uppercase text-green-800">
          Available
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-[#F6F8F6] p-4">
        <p className="text-[9px] font-black uppercase tracking-[1.5px] text-zinc-400">
          Work Identity
        </p>

        <p className="mt-2 text-xs leading-5 text-zinc-600">
          Available for opportunities in this person's listed
          area.
        </p>
      </div>

      <button
        onClick={onContact}
        className="mt-4 w-full rounded-2xl bg-[#0B4D2E] py-4 text-xs font-black text-white"
      >
        Contact via WhatsApp →
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl bg-zinc-100 p-5"
        >
          <div className="h-4 w-1/3 rounded bg-zinc-200" />
          <div className="mt-3 h-3 w-1/2 rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-black/10 bg-zinc-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
        ◎
      </div>

      <h3 className="mt-4 text-lg font-black">{title}</h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {text}
      </p>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white px-4 py-2 text-xs font-black shadow-sm ring-1 ring-black/5"
    >
      ← Back
    </button>
  );
}

function NavItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl py-2 text-center ${
        active ? "bg-[#EAF2EC] text-[#0B4D2E]" : "text-zinc-400"
      }`}
    >
      <span className="block text-lg font-black">{icon}</span>

      <span className="mt-0.5 block text-[9px] font-black">
        {label}
      </span>
    </button>
  );
}
