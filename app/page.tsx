"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type View =
  | "home"
  | "identity"
  | "jobs"
  | "talent"
  | "business"
  | "operations"
  | "settings";

type JobSeeker = {
  id: string;
  name: string | null;
  job_title: string | null;
  town: string | null;
  province: string | null;
  phone: string | null;
  experience: string | null;
  email?: string | null;
  skills?: string | null;
  availability?: string | null;
  profile_visibility?: string | null;
  verification_status?: string | null;
  profile_completion?: number | null;
  ats_score?: number | null;
  cv_status?: string | null;
  created_at?: string | null;
};

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  province: string | null;
  town: string | null;
  employment_type: string | null;
  experience_required: string | null;
  skills_required: string | null;
  application_email: string | null;
  status: string | null;
  closing_date: string | null;
  created_at?: string | null;
};

type Business = {
  id: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  province: string | null;
  town: string | null;
  industry: string | null;
  description: string | null;
  verification_status: string | null;
};

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export default function Page() {
  const [view, setView] = useState<View>("home");

  const [people, setPeople] = useState<JobSeeker[]>([]);
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [provinceFilter, setProvinceFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [talentSearch, setTalentSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [town, setTown] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("available");

  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessProvince, setBusinessProvince] = useState("");
  const [businessTown, setBusinessTown] = useState("");
  const [industry, setIndustry] = useState("");

  const [jobTitleForm, setJobTitleForm] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobProvince, setJobProvince] = useState("");
  const [jobTown, setJobTown] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [applicationEmail, setApplicationEmail] = useState("");
  const [closingDate, setClosingDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const peopleResult = await supabase
  .from("Job seekers")
  .select("*");

      if (peopleResult.error) {
        throw new Error(peopleResult.error.message);
      }

      const jobsResult = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsResult.error) {
        throw new Error(jobsResult.error.message);
      }

      const businessesResult = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (businessesResult.error) {
        throw new Error(businessesResult.error.message);
      }

      setPeople((peopleResult.data || []) as JobSeeker[]);
      setJobs((jobsResult.data || []) as Opportunity[]);
      setBusinesses((businessesResult.data || []) as Business[]);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "GUARDIAN WORK could not connect to the database."
      );
    } finally {
      setLoading(false);
    }
  }

  function flash(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 3500);
  }

  function go(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function createWorkIdentity() {
    if (!name.trim() || !phone.trim() || !province || !town.trim()) {
      flash(
        "Please complete your name, phone, province and town."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("Job seekers")
        .insert([
          {
            name: name.trim(),
            job_title: jobTitle.trim() || "Open to opportunities",
            town: town.trim(),
            province,
            phone: phone.trim(),
            experience: experience.trim(),
            email: null,
            skills: skills.trim(),
            availability,
            profile_visibility: "discoverable",
            verification_status: "unverified",
            profile_completion: calculateCompletion(),
            ats_score: null,
            cv_status: "not_uploaded",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      clearIdentityForm();

      await loadData();

      flash(
        "🔥 Your Work Identity has been added to GUARDIAN WORK."
      );

      go("talent");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't create your Work Identity."
      );
    } finally {
      setSaving(false);
    }
  }

  function calculateCompletion() {
    const fields = [
      name,
      jobTitle,
      town,
      province,
      phone,
      experience,
      skills,
    ];

    const completed = fields.filter(
      (field) => field.trim().length > 0
    ).length;

    return Math.round((completed / fields.length) * 100);
  }

  function clearIdentityForm() {
    setName("");
    setJobTitle("");
    setTown("");
    setProvince("");
    setPhone("");
    setExperience("");
    setSkills("");
    setAvailability("available");
  }

  async function createBusiness() {
    if (
      !businessName.trim() ||
      !businessProvince ||
      !businessTown.trim()
    ) {
      flash(
        "Please complete business name, province and town."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("businesses")
        .insert([
          {
            business_name: businessName.trim(),
            email: businessEmail.trim() || null,
            phone: businessPhone.trim() || null,
            province: businessProvince,
            town: businessTown.trim(),
            industry: industry.trim() || null,
            verification_status: "unverified",
            profile_visibility: "discoverable",
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setBusinessName("");
      setBusinessEmail("");
      setBusinessPhone("");
      setBusinessProvince("");
      setBusinessTown("");
      setIndustry("");

      await loadData();

      flash("🏢 Business profile created.");

      go("business");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't create the business profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function createOpportunity() {
    if (
      !jobTitleForm.trim() ||
      !jobProvince ||
      !jobTown.trim()
    ) {
      flash(
        "Please complete the role, province and town."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("opportunities")
        .insert([
          {
            title: jobTitleForm.trim(),
            description: jobDescription.trim() || null,
            province: jobProvince,
            town: jobTown.trim(),
            employment_type: jobType.trim() || null,
            experience_required:
              jobExperience.trim() || null,
            skills_required:
              jobSkills.trim() || null,
            application_email:
              applicationEmail.trim() || null,
            status: "open",
            closing_date: closingDate || null,
          },
        ]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setJobTitleForm("");
      setJobDescription("");
      setJobProvince("");
      setJobTown("");
      setJobType("");
      setJobExperience("");
      setJobSkills("");
      setApplicationEmail("");
      setClosingDate("");

      await loadData();

      flash("💼 Opportunity published.");

      go("jobs");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "We couldn't publish the opportunity."
      );
    } finally {
      setSaving(false);
    }
  }

  const availablePeople = useMemo(() => {
    return people.filter((person) => {
      const availabilityValue = String(
        person.availability || "available"
      ).toLowerCase();

      const visibility = String(
        person.profile_visibility || "discoverable"
      ).toLowerCase();

      return (
        availabilityValue !== "unavailable" &&
        visibility !== "hidden"
      );
    });
  }, [people]);

  const filteredPeople = useMemo(() => {
    const searchTerm = talentSearch
      .trim()
      .toLowerCase();

    return availablePeople.filter((person) => {
      const matchesProvince =
        !provinceFilter ||
        String(person.province || "").toLowerCase() ===
          provinceFilter.toLowerCase();

      const matchesTown =
        !townFilter ||
        String(person.town || "")
          .toLowerCase()
          .includes(townFilter.toLowerCase());

      const matchesSearch =
        !searchTerm ||
        [
          person.name,
          person.job_title,
          person.town,
          person.province,
          person.skills,
          person.experience,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);

      return (
        matchesProvince &&
        matchesTown &&
        matchesSearch
      );
    });
  }, [
    availablePeople,
    provinceFilter,
    townFilter,
    talentSearch,
  ]);

  const openJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        String(job.status || "open").toLowerCase() !==
        "closed"
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const term = jobSearch.trim().toLowerCase();

    if (!term) return openJobs;

    return openJobs.filter((job) =>
      [
        job.title,
        job.description,
        job.province,
        job.town,
        job.skills_required,
        job.experience_required,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [openJobs, jobSearch]);

  const provinceStats = useMemo(() => {
    return PROVINCES.map((provinceName) => ({
      province: provinceName,
      count: people.filter(
        (person) =>
          String(person.province || "").toLowerCase() ===
          provinceName.toLowerCase()
      ).length,
    }));
  }, [people]);

  function applyViaEmail(job: Opportunity) {
    if (!job.application_email) {
      flash(
        "This opportunity does not have an application email yet."
      );
      return;
    }

    const subject = encodeURIComponent(
      `Application: ${job.title}`
    );

    const body = encodeURIComponent(
      `Hello,\n\nI would like to apply for the ${job.title} opportunity advertised on GUARDIAN WORK.\n\nName:\nPhone:\nProvince:\nTown:\n\nThank you.`
    );

    window.location.href =
      `mailto:${job.application_email}?subject=${subject}&body=${body}`;
  }

  function contactPerson(person: JobSeeker) {
    if (!person.phone) {
      flash("This Work Identity has no phone number.");
      return;
    }

    const digits = person.phone.replace(/\D/g, "");

    const normalized = digits.startsWith("0")
      ? `27${digits.slice(1)}`
      : digits;

    window.open(
      `https://wa.me/${normalized}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F4] text-[#111714]">

      {/* HEADER */}
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
              <p className="text-sm font-black">
                GUARDIAN WORK
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#0B4D2E]">
                Discover • Connect • Work
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => flash("🔔 Notifications coming in V5.7.")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg"
            >
              ♧
            </button>

            <button
              onClick={() => go("settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-lg"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {/* NOTICE */}
      {notice && (
        <div className="fixed left-4 right-4 top-20 z-[80] mx-auto max-w-xl rounded-2xl bg-[#111714] px-5 py-4 text-sm font-bold text-white shadow-2xl">
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
              Database connection issue
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
            <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:px-8 md:pb-20 md:pt-20">

              <div className="max-w-4xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF9F1C]" />

                  <span className="text-[10px] font-black uppercase tracking-[2px]">
                    V5.2 • Work Access Platform
                  </span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[0.92] tracking-[-2px] md:text-7xl">
                  Make your ability
                  <br />
                  discoverable.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                  GUARDIAN WORK connects people's skills,
                  experience and location with businesses
                  looking for people.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">

                  <button
                    onClick={() => go("identity")}
                    className="rounded-2xl bg-white px-5 py-5 text-left text-black shadow-xl transition hover:-translate-y-1"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
                      01
                    </span>

                    <span className="mt-2 block text-lg font-black">
                      Build Identity
                    </span>

                    <span className="mt-1 block text-xs text-zinc-500">
                      Tell us what you can do.
                    </span>
                  </button>

                  <button
                    onClick={() => go("jobs")}
                    className="rounded-2xl bg-[#FF9F1C] px-5 py-5 text-left text-black shadow-xl transition hover:-translate-y-1"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[2px]">
                      02
                    </span>

                    <span className="mt-2 block text-lg font-black">
                      Find Work
                    </span>

                    <span className="mt-1 block text-xs">
                      Explore opportunities.
                    </span>
                  </button>

                  <button
                    onClick={() => go("talent")}
                    className="rounded-2xl border border-white/15 bg-white/10 px-5 py-5 text-left text-white transition hover:bg-white/15"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                      03
                    </span>

                    <span className="mt-2 block text-lg font-black">
                      Discover Talent
                    </span>

                    <span className="mt-1 block text-xs text-white/50">
                      For businesses.
                    </span>
                  </button>

                </div>

              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">

                <HeroStat
                  label="People"
                  value={
                    loading
                      ? "—"
                      : String(people.length)
                  }
                />

                <HeroStat
                  label="Open Work"
                  value={
                    loading
                      ? "—"
                      : String(openJobs.length)
                  }
                />

                <HeroStat
                  label="Businesses"
                  value={
                    loading
                      ? "—"
                      : String(businesses.length)
                  }
                />

                <HeroStat
                  label="Provinces"
                  value="9"
                />

              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-8 pb-28 md:px-8 md:py-14">

            <div className="grid gap-4 md:grid-cols-3">

              <FeatureCard
                number="01"
                title="Build"
                text="Create a Work Identity around your actual skills, experience and location."
              />

              <FeatureCard
                number="02"
                title="Discover"
                text="Businesses can discover talent by province, town, role and work information."
              />

              <FeatureCard
                number="03"
                title="Connect"
                text="Move from being unknown to being discoverable and connected to opportunity."
              />

            </div>

            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">

              <div className="flex items-end justify-between gap-4">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
                    Latest opportunities
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Work is moving.
                  </h2>
                </div>

                <button
                  onClick={() => go("jobs")}
                  className="rounded-full bg-[#111714] px-4 py-3 text-[10px] font-black text-white"
                >
                  View all
                </button>

              </div>

              <div className="mt-6">

                {loading ? (
                  <Loading />
                ) : openJobs.length === 0 ? (
                  <Empty
                    title="No opportunities yet"
                    text="When businesses publish opportunities, they will appear here."
                  />
                ) : (
                  <div className="space-y-3">
                    {openJobs.slice(0, 4).map((job) => (
                      <OpportunityCard
                        key={job.id}
                        job={job}
                        onApply={() =>
                          applyViaEmail(job)
                        }
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

            <div className="mt-8 rounded-[28px] bg-[#111714] p-7 text-white">

              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                Guardian principle
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight">
                Your starting point does not have to define your
                destination.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                GUARDIAN WORK is designed to help people become
                visible for what they can contribute — not simply
                whether they have a perfect traditional CV.
              </p>

            </div>

          </section>
        </>
      )}

      {/* WORK IDENTITY */}
      {view === "identity" && (
        <section className="mx-auto max-w-3xl px-4 py-7 pb-28">

          <Back onClick={() => go("home")} />

          <div className="mt-7">
            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Work Identity
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Become discoverable.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Start with the information businesses need to
              understand what you can do.
            </p>
          </div>

          <div className="mt-7 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">

            <div className="grid gap-4">

              <Field
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="e.g. Sibusiso Tau"
              />

              <Field
                label="What work can you do?"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="e.g. Welder, Cashier, IT Technician"
              />

              <div className="grid gap-4 sm:grid-cols-2">

                <Select
                  label="Province"
                  value={province}
                  onChange={setProvince}
                  options={PROVINCES}
                  placeholder="Select province"
                />

                <Field
                  label="Town / City"
                  value={town}
                  onChange={setTown}
                  placeholder="e.g. Secunda"
                />

              </div>

              <Field
                label="WhatsApp / phone"
                value={phone}
                onChange={setPhone}
                placeholder="e.g. 076 000 0000"
              />

              <Field
                label="Experience"
                value={experience}
                onChange={setExperience}
                placeholder="e.g. 2 years retail experience"
              />

              <div>

                <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
                  Skills
                </label>

                <textarea
                  value={skills}
                  onChange={(e) =>
                    setSkills(e.target.value)
                  }
                  rows={4}
                  placeholder="List the things you can do..."
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none focus:border-[#0B4D2E]"
                />

              </div>

              <Select
                label="Availability"
                value={availability}
                onChange={setAvailability}
                options={[
                  "available",
                  "available immediately",
                  "part-time",
                  "not available",
                ]}
                placeholder="Select availability"
              />

            </div>

            <div className="mt-5 rounded-2xl bg-[#F0F6F2] p-4">

              <p className="text-xs font-black text-[#0B4D2E]">
                🔒 Discoverability
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Your Work Identity can be discoverable by
                businesses. Sensitive information should be
                protected through the platform's permission
                system as we continue the V5 security layer.
              </p>

            </div>

            <button
              onClick={createWorkIdentity}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#0B4D2E] py-5 text-sm font-black text-white shadow-lg disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create My Work Identity →"}
            </button>

          </div>

          <div className="mt-6 rounded-[28px] bg-[#111714] p-6 text-white">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              Next layer
            </p>

            <h2 className="mt-2 text-2xl font-black">
              CV + ATS Intelligence
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              V5.3 will introduce CV upload, CV analysis,
              ATS-readiness scoring and recommendations before
              the final CV is saved.
            </p>

          </div>

        </section>
      )}

      {/* JOBS */}
      {view === "jobs" && (
        <section className="mx-auto max-w-5xl px-4 py-7 pb-28 md:px-8">

          <Back onClick={() => go("home")} />

          <div className="mt-7">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Opportunities
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Find your next opportunity.
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Search opportunities across GUARDIAN WORK.
            </p>

          </div>

          <div className="mt-6">
            <Search
              value={jobSearch}
              onChange={setJobSearch}
              placeholder="Search roles, skills, towns..."
            />
          </div>

          <div className="mt-6">

            {loading ? (
              <Loading />
            ) : filteredJobs.length === 0 ? (
              <Empty
                title="No opportunities found"
                text="Try another search or check back later."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">

                {filteredJobs.map((job) => (
                  <OpportunityCard
                    key={job.id}
                    job={job}
                    large
                    onApply={() =>
                      applyViaEmail(job)
                    }
                  />
                ))}

              </div>
            )}

          </div>

        </section>
      )}

      {/* TALENT */}
      {view === "talent" && (
        <section className="mx-auto max-w-6xl px-4 py-7 pb-28 md:px-8">

          <Back onClick={() => go("home")} />

          <div className="mt-7">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              Talent Discovery
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Find people by location and ability.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Search the discoverable Work Identity pool using
              province, town, skills, job title and experience.
            </p>

          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <Select
              label="Province"
              value={provinceFilter}
              onChange={setProvinceFilter}
              options={PROVINCES}
              placeholder="All provinces"
              allowEmpty
            />

            <Field
              label="Town / City"
              value={townFilter}
              onChange={setTownFilter}
              placeholder="e.g. Secunda"
            />

            <div className="md:pt-5">
              <Search
                value={talentSearch}
                onChange={setTalentSearch}
                placeholder="Name, skill or job..."
              />
            </div>

          </div>

          <div className="mt-6 flex items-center justify-between">

            <p className="text-xs font-black text-zinc-500">
              {loading
                ? "Loading talent..."
                : `${filteredPeople.length} discoverable people`}
            </p>

            <button
              onClick={() => {
                setProvinceFilter("");
                setTownFilter("");
                setTalentSearch("");
              }}
              className="text-[10px] font-black uppercase tracking-wide text-[#0B4D2E]"
            >
              Clear filters
            </button>

          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            {loading ? (
              <Loading />
            ) : filteredPeople.length === 0 ? (
              <div className="md:col-span-2">
                <Empty
                  title="No matching talent"
                  text="Try a different province, town, name or skill."
                />
              </div>
            ) : (
              filteredPeople.map((person) => (
                <TalentCard
                  key={person.id}
                  person={person}
                  onContact={() =>
                    contactPerson(person)
                  }
                />
              ))
            )}

          </div>

        </section>
      )}

      {/* BUSINESS */}
      {view === "business" && (
        <section className="mx-auto max-w-5xl px-4 py-7 pb-28 md:px-8">

          <Back onClick={() => go("home")} />

          <div className="mt-7">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              Business Workspace
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Find people. Publish work.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Businesses can build their presence and publish
              opportunities to the GUARDIAN WORK ecosystem.
            </p>

          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            <div className="rounded-[28px] bg-[#111714] p-6 text-white">

              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                Talent
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Discover people
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Search the talent pool by province, town,
                skills and experience.
              </p>

              <button
                onClick={() => go("talent")}
                className="mt-6 rounded-full bg-white px-5 py-3 text-xs font-black text-black"
              >
                Explore Talent →
              </button>

            </div>

            <div className="rounded-[28px] bg-[#FF9F1C] p-6">

              <p className="text-[10px] font-black uppercase tracking-[2px]">
                Opportunity
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Publish work
              </h2>

              <p className="mt-3 text-sm leading-6">
                Publish an opportunity with its location,
                requirements and application email.
              </p>

            </div>

          </div>

          {/* BUSINESS PROFILE */}
          <div className="mt-5 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Business Profile
            </p>

            <div className="mt-5 grid gap-4">

              <Field
                label="Business name"
                value={businessName}
                onChange={setBusinessName}
                placeholder="e.g. Local Retail Business"
              />

              <div className="grid gap-4 sm:grid-cols-2">

                <Field
                  label="Business email"
                  value={businessEmail}
                  onChange={setBusinessEmail}
                  placeholder="business@example.com"
                />

                <Field
                  label="Business phone"
                  value={businessPhone}
                  onChange={setBusinessPhone}
                  placeholder="Phone number"
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Select
                  label="Province"
                  value={businessProvince}
                  onChange={setBusinessProvince}
                  options={PROVINCES}
                  placeholder="Select province"
                />

                <Field
                  label="Town / City"
                  value={businessTown}
                  onChange={setBusinessTown}
                  placeholder="e.g. Secunda"
                />

              </div>

              <Field
                label="Industry"
                value={industry}
                onChange={setIndustry}
                placeholder="e.g. Retail, Construction, Hospitality"
              />

            </div>

            <button
              onClick={createBusiness}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#0B4D2E] py-5 text-sm font-black text-white disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Business Profile →"}
            </button>

          </div>

          {/* OPPORTUNITY */}
          <div className="mt-5 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Publish Opportunity
            </p>

            <div className="mt-5 grid gap-4">

              <Field
                label="Role / opportunity title"
                value={jobTitleForm}
                onChange={setJobTitleForm}
                placeholder="e.g. Cashier"
              />

              <div>

                <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
                  Description
                </label>

                <textarea
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value)
                  }
                  rows={4}
                  placeholder="Describe the opportunity..."
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none focus:border-[#0B4D2E]"
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Select
                  label="Province"
                  value={jobProvince}
                  onChange={setJobProvince}
                  options={PROVINCES}
                  placeholder="Select province"
                />

                <Field
                  label="Town / City"
                  value={jobTown}
                  onChange={setJobTown}
                  placeholder="e.g. Secunda"
                />

              </div>

              <Field
                label="Employment type"
                value={jobType}
                onChange={setJobType}
                placeholder="e.g. Full-time, Part-time, Contract"
              />

              <Field
                label="Experience required"
                value={jobExperience}
                onChange={setJobExperience}
                placeholder="e.g. 2 years"
              />

              <Field
                label="Skills required"
                value={jobSkills}
                onChange={setJobSkills}
                placeholder="e.g. Customer service, POS, communication"
              />

              <Field
                label="Application email"
                value={applicationEmail}
                onChange={setApplicationEmail}
                placeholder="applications@company.co.za"
              />

              <div>

                <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
                  Closing date
                </label>

                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) =>
                    setClosingDate(e.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none focus:border-[#0B4D2E]"
                />

              </div>

            </div>

            <button
              onClick={createOpportunity}
              disabled={saving}
              className="mt-5 w-full rounded-2xl bg-[#FF9F1C] py-5 text-sm font-black text-black disabled:opacity-50"
            >
              {saving
                ? "Publishing..."
                : "Publish Opportunity →"}
            </button>

          </div>

        </section>
      )}

      {/* OPERATIONS */}
      {view === "operations" && (
        <section className="min-h-screen bg-[#111714] px-4 py-7 pb-28 text-white">

          <div className="mx-auto max-w-6xl">

            <button
              onClick={() => go("home")}
              className="text-xs font-black text-white/50"
            >
              ← Back
            </button>

            <div className="mt-7">

              <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
                GUARDIAN WORK Operations
              </p>

              <h1 className="mt-2 text-4xl font-black">
                System intelligence.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
                Live aggregate information from the current
                GUARDIAN WORK database.
              </p>

            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">

              <DarkStat
                label="People"
                value={String(people.length)}
              />

              <DarkStat
                label="Available"
                value={String(availablePeople.length)}
              />

              <DarkStat
                label="Businesses"
                value={String(businesses.length)}
              />

              <DarkStat
                label="Open Work"
                value={String(openJobs.length)}
              />

            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[2px] text-white/35">
                    Geographic intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Talent by province
                  </h2>
                </div>

                <span className="rounded-full bg-white/5 px-3 py-2 text-[10px] font-black text-white/40">
                  9 provinces
                </span>

              </div>

              <div className="mt-5 space-y-3">

                {provinceStats.map((item) => {

                  const percentage =
                    people.length > 0
                      ? Math.round(
                          (item.count /
                            people.length) *
                            100
                        )
                      : 0;

                  return (
                    <div key={item.province}>

                      <div className="flex justify-between text-xs">

                        <span className="font-bold">
                          {item.province}
                        </span>

                        <span className="text-white/40">
                          {item.count}
                        </span>

                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">

                        <div
                          className="h-full rounded-full bg-[#FF9F1C]"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <OperationsList
                title="Latest people"
                items={people.slice(0, 8).map((person) => ({
                  title:
                    person.name ||
                    "Unnamed Work Identity",
                  subtitle:
                    `${person.job_title || "Open to work"} • ${
                      person.town || "Town not supplied"
                    }`,
                }))}
              />

              <OperationsList
                title="Latest opportunities"
                items={jobs.slice(0, 8).map((job) => ({
                  title: job.title,
                  subtitle:
                    `${job.town || "Town not supplied"} • ${
                      job.province || "Province not supplied"
                    }`,
                }))}
              />

            </div>

            <div className="mt-5 rounded-[28px] border border-[#FF9F1C]/20 bg-[#FF9F1C]/5 p-6">

              <p className="text-xs font-black text-[#FF9F1C]">
                🔒 V5.2 SECURITY ROADMAP
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                Authentication, role-based permissions, protected
                CV access, verification workflows and full POPIA
                privacy controls must be connected before sensitive
                employer/candidate information is exposed at scale.
              </p>

            </div>

          </div>

        </section>
      )}

      {/* SETTINGS */}
      {view === "settings" && (
        <section className="mx-auto max-w-3xl px-4 py-7 pb-28">

          <Back onClick={() => go("home")} />

          <div className="mt-7">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#0B4D2E]">
              Settings
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Make GUARDIAN WORK yours.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Account, privacy, notifications and themes will
              become fully connected in the upcoming platform
              layers.
            </p>

          </div>

          <div className="mt-7 space-y-3">

            <SettingCard
              icon="🔔"
              title="Notifications"
              text="Application, opportunity and platform notifications."
              onClick={() =>
                flash(
                  "Notifications engine is scheduled for V5.7."
                )
              }
            />

            <SettingCard
              icon="🔒"
              title="Privacy & Security"
              text="Control discoverability and access to your information."
              onClick={() =>
                flash(
                  "Privacy controls are being connected to the authentication layer."
                )
              }
            />

            <SettingCard
              icon="🎨"
              title="Theme"
              text="Light, dark and system appearance."
              onClick={() =>
                flash(
                  "Theme engine is scheduled for V5.8."
                )
              }
            />

            <SettingCard
              icon="🪪"
              title="Profile Visibility"
              text="Manage whether your Work Identity can be discovered."
              onClick={() =>
                flash(
                  "Profile visibility controls are part of the V5 security layer."
                )
              }
            />

          </div>

          <div className="mt-6 rounded-[28px] bg-[#111714] p-6 text-white">

            <p className="text-[10px] font-black uppercase tracking-[2px] text-[#FF9F1C]">
              GUARDIAN WORK
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Built around people, not paperwork.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Your Work Identity is the beginning. CV intelligence,
              applications, timeline, matching, notifications,
              advertising and placement will build on this foundation.
            </p>

          </div>

        </section>
      )}

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 px-2 py-2 backdrop-blur md:hidden">

        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">

          <Nav
            active={view === "home"}
            icon="⌂"
            label="Home"
            onClick={() => go("home")}
          />

          <Nav
            active={view === "identity"}
            icon="◎"
            label="My Work"
            onClick={() => go("identity")}
          />

          <Nav
            active={view === "jobs"}
            icon="▣"
            label="Work"
            onClick={() => go("jobs")}
          />

          <Nav
            active={view === "talent"}
            icon="◇"
            label="Talent"
            onClick={() => go("talent")}
          />

          <Nav
            active={view === "settings"}
            icon="⚙"
            label="Settings"
            onClick={() => go("settings")}
          />

        </div>

      </nav>

    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">

      <p className="text-[9px] font-black uppercase tracking-[1.5px] text-white/40">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>

    </div>
  );
}

function FeatureCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-black/5">

      <span className="text-xs font-black text-[#FF9F1C]">
        {number}
      </span>

      <h3 className="mt-6 text-xl font-black">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {text}
      </p>

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>

      <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none transition focus:border-[#0B4D2E] focus:bg-white"
      />

    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  allowEmpty = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  allowEmpty?: boolean;
}) {
  return (
    <div>

      <label className="text-[10px] font-black uppercase tracking-[1.5px] text-zinc-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#F7F8F7] p-4 text-sm outline-none focus:border-[#0B4D2E]"
      >

        {allowEmpty && (
          <option value="">
            {placeholder}
          </option>
        )}

        {!allowEmpty && !value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function Search({
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
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white py-4 pl-11 pr-4 text-sm outline-none focus:border-[#0B4D2E]"
      />

    </div>
  );
}

function OpportunityCard({
  job,
  onApply,
  large = false,
}: {
  job: Opportunity;
  onApply: () => void;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border border-black/5 bg-[#F8FAF8] p-5 ${
        large ? "min-h-[250px]" : ""
      }`}
    >

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B4D2E] text-sm font-black text-white">
            {String(job.title || "?")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="font-black">
              {job.title}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {job.town || "Town not supplied"} •{" "}
              {job.province || "Province not supplied"}
            </p>

          </div>

        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-[9px] font-black uppercase text-green-800">
          {job.status || "Open"}
        </span>

      </div>

      {job.description && (
        <p className="mt-5 text-sm leading-6 text-zinc-600">
          {job.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">

        {job.employment_type && (
          <Tag text={job.employment_type} />
        )}

        {job.experience_required && (
          <Tag text={job.experience_required} />
        )}

        {job.skills_required && (
          <Tag text={job.skills_required} />
        )}

      </div>

      {job.closing_date && (
        <p className="mt-4 text-[10px] font-bold text-zinc-400">
          Closing: {job.closing_date}
        </p>
      )}

      <button
        onClick={onApply}
        className="mt-5 w-full rounded-2xl bg-[#111714] py-4 text-xs font-black text-white"
      >
        {job.application_email
          ? "Apply via Email →"
          : "Opportunity Details"}
      </button>

    </div>
  );
}

function TalentCard({
  person,
  onContact,
}: {
  person: JobSeeker;
  onContact: () => void;
}) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2EC] text-lg font-black text-[#0B4D2E]">
            {String(person.name || "?")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="font-black">
              {person.name || "Work Identity"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {person.job_title ||
                "Open to opportunities"}
            </p>

          </div>

        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-[9px] font-black uppercase text-green-800">
          {person.availability || "Available"}
        </span>

      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">

        <MiniInfo
          label="Province"
          value={
            person.province || "Not supplied"
          }
        />

        <MiniInfo
          label="Town"
          value={person.town || "Not supplied"}
        />

      </div>

      {person.experience && (
        <div className="mt-2 rounded-2xl bg-[#F7F8F7] p-4">

          <p className="text-[9px] font-black uppercase tracking-[1.5px] text-zinc-400">
            Experience
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {person.experience}
          </p>

        </div>
      )}

      {person.skills && (
        <div className="mt-2 rounded-2xl bg-[#F7F8F7] p-4">

          <p className="text-[9px] font-black uppercase tracking-[1.5px] text-zinc-400">
            Skills
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-600">
            {person.skills}
          </p>

        </div>
      )}

      <button
        onClick={onContact}
        className="mt-4 w-full rounded-2xl bg-[#0B4D2E] py-4 text-xs font-black text-white"
      >
        Contact via WhatsApp →
      </button>

    </div>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F7F8F7] p-3">

      <p className="text-[8px] font-black uppercase tracking-[1px] text-zinc-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold">
        {value}
      </p>

    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold text-zinc-500 ring-1 ring-black/5">
      {text}
    </span>
  );
}

function Loading() {
  return (
    <div className="space-y-3">

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl bg-zinc-100 p-5"
        >

          <div className="h-4 w-1/3 rounded bg-zinc-200" />

          <div className="mt-3 h-3 w-1/2 rounded bg-zinc-200" />

          <div className="mt-3 h-3 w-2/3 rounded bg-zinc-200" />

        </div>
      ))}

    </div>
  );
}

function Empty({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-dashed border-black/10 bg-zinc-50 p-8 text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
        ◎
      </div>

      <h3 className="mt-4 text-lg font-black">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {text}
      </p>

    </div>
  );
}

function Back({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white px-4 py-2 text-xs font-black shadow-sm ring-1 ring-black/5"
    >
      ← Back
    </button>
  );
}

function Nav({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl py-2 ${
        active
          ? "bg-[#EAF2EC] text-[#0B4D2E]"
          : "text-zinc-400"
      }`}
    >

      <span className="block text-lg font-black">
        {icon}
      </span>

      <span className="mt-0.5 block text-[8px] font-black">
        {label}
      </span>

    </button>
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

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>

    </div>
  );
}

function OperationsList({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    subtitle: string;
  }[];
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">

      <p className="text-[10px] font-black uppercase tracking-[2px] text-white/35">
        {title}
      </p>

      <div className="mt-4 space-y-2">

        {items.length === 0 ? (
          <p className="text-sm text-white/30">
            Nothing yet.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="rounded-2xl bg-black/20 p-4"
            >

              <p className="text-sm font-black">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-white/40">
                {item.subtitle}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

function SettingCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-[24px] bg-white p-5 text-left shadow-sm ring-1 ring-black/5"
    >

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F6F2] text-xl">
        {icon}
      </div>

      <div className="flex-1">

        <p className="font-black">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {text}
        </p>

      </div>

      <span className="text-zinc-400">
        →
      </span>

    </button>
  );
}
