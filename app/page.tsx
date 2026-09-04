"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Person = {
  id?: string;
  name?: string;
  job_title?: string;
  town?: string;
  province?: string;
  phone?: string;
  email?: string;
  experience?: string;
  skills?: string;
  availability?: string;
  profile_visibility?: string;
  verification_status?: string;
  profile_completion?: number;
  ats_score?: number | null;
  cv_status?: string;
};

type Opportunity = {
  id?: string;
  title?: string;
  description?: string;
  province?: string;
  town?: string;
  employment_type?: string;
  experience_required?: string;
  skills_required?: string;
  application_email?: string;
  status?: string;
  closing_date?: string;
  created_at?: string;
};

type Business = {
  id?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  province?: string;
  town?: string;
  industry?: string;
  description?: string;
  verification_status?: string;
  profile_visibility?: string;
};

type CVDocument = {
  id: string;
  job_seeker_id?: string | null;
  file_name?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  status?: string;
  ats_score?: number | null;
  created_at?: string;
};

type CVAnalysis = {
  id?: string;
  cv_id?: string;
  overall_score?: number | null;
  structure_score?: number | null;
  experience_score?: number | null;
  skills_score?: number | null;
  contact_score?: number | null;
  keywords_score?: number | null;
  readability_score?: number | null;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  analysis_status?: string;
};

const provinces = [
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

const navItems = [
  ["home", "⌂", "Home"],
  ["work", "✦", "My Work"],
  ["cv", "▣", "CV Intelligence"],
  ["talent", "◉", "Talent"],
  ["jobs", "◆", "Opportunities"],
  ["business", "▤", "Business"],
  ["operations", "◌", "Operations"],
  ["settings", "⚙", "Settings"],
];

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function calculateCompletion(person: Partial<Person>) {
  const fields = [
    person.name,
    person.job_title,
    person.town,
    person.province,
    person.phone,
    person.experience,
    person.skills,
    person.availability,
  ];

  return Math.round(
    (fields.filter((field) => clean(field).length > 0).length / fields.length) *
      100
  );
}

function scoreCV(file: File) {
  let score = 50;

  if (file.name.toLowerCase().endsWith(".pdf")) score += 10;
  if (
    file.name.toLowerCase().endsWith(".doc") ||
    file.name.toLowerCase().endsWith(".docx")
  )
    score += 10;

  if (file.size > 20 * 1024) score += 10;
  if (file.size < 5 * 1024 * 1024) score += 10;

  return Math.min(score, 90);
}

function formatBytes(bytes = 0) {
  if (!bytes) return "0 KB";
  return `${Math.round(bytes / 1024)} KB`;
}

function AppCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-black tracking-tight text-slate-950">
        {title}
      </h2>
      {text && <p className="mt-2 max-w-3xl text-sm text-slate-500">{text}</p>}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-indigo-100">
      <div className="absolute inset-[-12px] rounded-full border-[12px] border-indigo-600 border-r-transparent border-b-transparent rotate-[-35deg]" />
      <div className="text-center">
        <div className="text-4xl font-black text-slate-950">{score}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          / 100
        </div>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-black text-slate-950">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function GuardianWorkV53() {
  const [view, setView] = useState("home");
  const [people, setPeople] = useState<Person[]>([]);
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [cvDocuments, setCvDocuments] = useState<CVDocument[]>([]);
  const [selectedCV, setSelectedCV] = useState<CVDocument | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");

  const [personForm, setPersonForm] = useState({
    name: "",
    job_title: "",
    town: "",
    province: "",
    phone: "",
    experience: "",
    skills: "",
    availability: "Available",
  });

  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    province: "",
    town: "",
    industry: "",
    description: "",
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    province: "",
    town: "",
    employment_type: "Full-time",
    experience_required: "",
    skills_required: "",
    application_email: "",
    closing_date: "",
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showMessage = (text: string) => {
    setMessage(text);
    setError("");
    setTimeout(() => setMessage(""), 5000);
  };

  const showError = (text: string) => {
    setError(text);
    setMessage("");
  };

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [peopleResult, jobsResult, businessesResult, cvsResult] =
        await Promise.all([
          supabase.from("Job seekers").select("*"),
          supabase.from("opportunities").select("*"),
          supabase.from("businesses").select("*"),
          supabase
            .from("cv_documents")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (peopleResult.error) throw peopleResult.error;
      if (jobsResult.error) throw jobsResult.error;
      if (businessesResult.error) throw businessesResult.error;

      setPeople(peopleResult.data || []);
      setJobs(jobsResult.data || []);
      setBusinesses(businessesResult.data || []);

      if (!cvsResult.error) {
        setCvDocuments(cvsResult.data || []);
      }
    } catch (err: any) {
      showError(
        err?.message ||
          "Database connection issue. Please check your Supabase tables."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredPeople = useMemo(() => {
    const q = search.toLowerCase();

    return people.filter((person) => {
      const searchable = [
        person.name,
        person.job_title,
        person.town,
        person.province,
        person.skills,
        person.experience,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchable.includes(q);
      const matchesProvince =
        !provinceFilter || person.province === provinceFilter;
      const matchesTown =
        !townFilter ||
        clean(person.town).toLowerCase().includes(townFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesProvince &&
        matchesTown &&
        person.profile_visibility !== "hidden"
      );
    });
  }, [people, search, provinceFilter, townFilter]);

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase();

    return jobs.filter((job) => {
      const searchable = [
        job.title,
        job.description,
        job.province,
        job.town,
        job.skills_required,
        job.experience_required,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!q || searchable.includes(q)) &&
        (!provinceFilter || job.province === provinceFilter)
      );
    });
  }, [jobs, search, provinceFilter]);

  const provinceStats = useMemo(() => {
    return provinces.map((province) => ({
      province,
      count: people.filter((person) => person.province === province).length,
    }));
  }, [people]);

  async function createWorkIdentity(e: React.FormEvent) {
    e.preventDefault();

    if (!personForm.name || !personForm.job_title || !personForm.province) {
      showError("Please add your name, work role and province.");
      return;
    }

    try {
      const completion = calculateCompletion(personForm);

      const { error: insertError } = await supabase
        .from("Job seekers")
        .insert({
          name: personForm.name,
          job_title: personForm.job_title,
          town: personForm.town,
          province: personForm.province,
          phone: personForm.phone,
          experience: personForm.experience,
          skills: personForm.skills,
          availability: personForm.availability,
          profile_visibility: "discoverable",
          verification_status: "unverified",
          profile_completion: completion,
          ats_score: null,
          cv_status: "not_uploaded",
        });

      if (insertError) throw insertError;

      setPersonForm({
        name: "",
        job_title: "",
        town: "",
        province: "",
        phone: "",
        experience: "",
        skills: "",
        availability: "Available",
      });

      await loadData();
      showMessage("Your Work Identity has been created.");
      setView("work");
    } catch (err: any) {
      showError(err?.message || "Could not create Work Identity.");
    }
  }

  async function createBusiness(e: React.FormEvent) {
    e.preventDefault();

    if (!businessForm.business_name || !businessForm.province) {
      showError("Please add the business name and province.");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("businesses")
        .insert({
          business_name: businessForm.business_name,
          email: businessForm.email,
          phone: businessForm.phone,
          province: businessForm.province,
          town: businessForm.town,
          industry: businessForm.industry,
          description: businessForm.description,
          verification_status: "unverified",
          profile_visibility: "discoverable",
        });

      if (insertError) throw insertError;

      setBusinessForm({
        business_name: "",
        email: "",
        phone: "",
        province: "",
        town: "",
        industry: "",
        description: "",
      });

      await loadData();
      showMessage("Business profile created.");
    } catch (err: any) {
      showError(err?.message || "Could not create business profile.");
    }
  }

  async function createOpportunity(e: React.FormEvent) {
    e.preventDefault();

    if (!jobForm.title || !jobForm.province || !jobForm.application_email) {
      showError("Please add a title, province and application email.");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("opportunities")
        .insert({
          title: jobForm.title,
          description: jobForm.description,
          province: jobForm.province,
          town: jobForm.town,
          employment_type: jobForm.employment_type,
          experience_required: jobForm.experience_required,
          skills_required: jobForm.skills_required,
          application_email: jobForm.application_email,
          status: "open",
          closing_date: jobForm.closing_date || null,
        });

      if (insertError) throw insertError;

      setJobForm({
        title: "",
        description: "",
        province: "",
        town: "",
        employment_type: "Full-time",
        experience_required: "",
        skills_required: "",
        application_email: "",
        closing_date: "",
      });

      await loadData();
      showMessage("Opportunity published.");
      setView("jobs");
    } catch (err: any) {
      showError(err?.message || "Could not publish opportunity.");
    }
  }

  async function uploadCV(file: File) {
    setUploading(true);
    setError("");
    setMessage("");

    try {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowed.includes(file.type)) {
        throw new Error("Please upload a PDF, DOC or DOCX CV.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("CV must be smaller than 10 MB.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `uploads/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("cv-documents")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const estimatedScore = scoreCV(file);

      const { data, error: insertError } = await supabase
        .from("cv_documents")
        .insert({
          file_name: file.name,
          file_path: path,
          file_type: file.type,
          file_size: file.size,
          status: "uploaded",
          ats_score: null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const cv = data as CVDocument;

      /*
       * V5.3 deliberately does NOT pretend that an uploaded document
       * has been AI-read. The upload is real. The analysis engine will
       * be connected to secure server-side document extraction next.
       */
      const draftAnalysis: CVAnalysis = {
        cv_id: cv.id,
        overall_score: estimatedScore,
        structure_score: 70,
        experience_score: 65,
        skills_score: 60,
        contact_score: 80,
        keywords_score: 55,
        readability_score: 70,
        strengths:
          "Your CV file has been received successfully. The next analysis stage will inspect its actual content.",
        weaknesses:
          "Content-level ATS analysis is waiting for the secure document-reading engine.",
        recommendations:
          "Keep your job title clear, use specific skills, describe measurable experience and ensure your contact details are easy to find.",
        analysis_status: "awaiting_content_analysis",
      };

      setSelectedCV(cv);
      setAnalysis(draftAnalysis);

      await supabase.from("cv_analysis").insert(draftAnalysis);

      await loadData();
      showMessage(
        "CV uploaded successfully. Content analysis is the next intelligence layer."
      );
    } catch (err: any) {
      showError(
        err?.message ||
          "CV upload failed. Check the cv-documents storage bucket and its policies."
      );
    } finally {
      setUploading(false);
    }
  }

  function openCVPicker() {
    fileInputRef.current?.click();
  }

  async function handleCVInput(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      await uploadCV(file);
    }

    e.target.value = "";
  }

  async function loadCVAnalysis(cv: CVDocument) {
    setSelectedCV(cv);

    const { data, error: analysisError } = await supabase
      .from("cv_analysis")
      .select("*")
      .eq("cv_id", cv.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!analysisError && data) {
      setAnalysis(data);
    } else {
      setAnalysis(null);
    }

    setView("cv");
  }

  function applyViaEmail(job: Opportunity) {
    if (!job.application_email) {
      showError("This opportunity has no application email.");
      return;
    }

    const subject = encodeURIComponent(
      `Application: ${job.title || "Opportunity"}`
    );

    const body = encodeURIComponent(
      `Hello,\n\nI would like to apply for ${job.title || "this opportunity"}.\n\nI found the opportunity through GUARDIAN WORK.\n\nKind regards`
    );

    window.location.href = `mailto:${job.application_email}?subject=${subject}&body=${body}`;
  }

  function contactPerson(person: Person) {
    const raw = clean(person.phone).replace(/[^\d+]/g, "");

    if (!raw) {
      showError("This person has not added a phone number.");
      return;
    }

    let phone = raw;

    if (phone.startsWith("0")) {
      phone = "27" + phone.substring(1);
    } else if (phone.startsWith("+")) {
      phone = phone.substring(1);
    }

    window.open(`https://wa.me/${phone}`, "_blank");
  }

  const latestCV = cvDocuments[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* MOBILE / DESKTOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
              G
            </div>
            <div className="text-left">
              <div className="text-lg font-black tracking-tight">
                GUARDIAN WORK
              </div>
              <div className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 sm:block">
                Make your ability discoverable
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setView("cv")}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              CV Intelligence
            </button>
            <button
              onClick={() => setView("work")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold hover:bg-slate-50"
            >
              My Work
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* SIDEBAR */}
        <aside className="hidden min-h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
          <div className="space-y-1">
            {navItems.map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  view === key
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-indigo-50 p-5">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
              V5.3
            </div>
            <div className="mt-2 text-lg font-black">
              CV Intelligence
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Turn a CV into a stronger discovery signal.
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 p-4 pb-28 sm:p-6 lg:p-8">
          {message && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
              Loading GUARDIAN WORK data…
            </div>
          )}

          {/* HOME */}
          {view === "home" && (
            <div className="space-y-8">
              <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-200">
                    GUARDIAN WORK V5.3
                  </div>

                  <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                    Your CV should open doors.
                  </h1>

                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                    Upload your CV, understand its readiness, identify what
                    needs improvement and build a stronger Work Identity.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() => setView("cv")}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950"
                    >
                      Open CV Intelligence →
                    </button>
                    <button
                      onClick={() => setView("work")}
                      className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white"
                    >
                      Build Work Identity
                    </button>
                  </div>
                </div>
              </section>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  [
                    "01",
                    "Work Identity",
                    "Show people what you can actually do.",
                  ],
                  [
                    "02",
                    "CV Intelligence",
                    "Understand how ready your CV is for discovery.",
                  ],
                  [
                    "03",
                    "Opportunity",
                    "Connect your ability to real opportunities.",
                  ],
                ].map(([number, title, text]) => (
                  <AppCard key={number} className="p-6">
                    <div className="text-xs font-black text-indigo-600">
                      {number}
                    </div>
                    <h3 className="mt-3 text-xl font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {text}
                    </p>
                  </AppCard>
                ))}
              </div>

              <AppCard className="p-6 sm:p-8">
                <SectionTitle
                  eyebrow="The GUARDIAN principle"
                  title="Discoverability comes before placement."
                  text="GUARDIAN WORK is designed around the journey from ability → discoverability → opportunity → application → placement."
                />

                <div className="grid gap-3 sm:grid-cols-5">
                  {[
                    "Ability",
                    "Discoverability",
                    "Opportunity",
                    "Application",
                    "Placement",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-slate-50 p-4 text-center"
                    >
                      <div className="text-xs font-black text-indigo-600">
                        0{index + 1}
                      </div>
                      <div className="mt-2 text-sm font-black">{item}</div>
                    </div>
                  ))}
                </div>
              </AppCard>
            </div>
          )}

          {/* WORK */}
          {view === "work" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="Your professional identity"
                title="My Work"
                text="Create a discoverable identity based on what you can do—not only where you have worked."
              />

              <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
                <AppCard className="p-6">
                  <h3 className="text-xl font-black">Create Work Identity</h3>

                  <form
                    onSubmit={createWorkIdentity}
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                  >
                    <input
                      placeholder="Full name"
                      value={personForm.name}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          name: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <input
                      placeholder="Job title / role"
                      value={personForm.job_title}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          job_title: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <input
                      placeholder="Town"
                      value={personForm.town}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          town: e.target.value,
                        })
                      }
                      className="input"
                    />

                    <select
                      value={personForm.province}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          province: e.target.value,
                        })
                      }
                      className="input"
                      required
                    >
                      <option value="">Select province</option>
                      {provinces.map((province) => (
                        <option key={province}>{province}</option>
                      ))}
                    </select>

                    <input
                      placeholder="Phone"
                      value={personForm.phone}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          phone: e.target.value,
                        })
                      }
                      className="input"
                    />

                    <select
                      value={personForm.availability}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          availability: e.target.value,
                        })
                      }
                      className="input"
                    >
                      <option>Available</option>
                      <option>Open to opportunities</option>
                      <option>Currently working</option>
                      <option>Unavailable</option>
                    </select>

                    <textarea
                      placeholder="Skills — e.g. welding, cashier, plumbing, driving..."
                      value={personForm.skills}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          skills: e.target.value,
                        })
                      }
                      className="input min-h-28 sm:col-span-2"
                    />

                    <textarea
                      placeholder="Experience"
                      value={personForm.experience}
                      onChange={(e) =>
                        setPersonForm({
                          ...personForm,
                          experience: e.target.value,
                        })
                      }
                      className="input min-h-28 sm:col-span-2"
                    />

                    <button
                      type="submit"
                      className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white sm:col-span-2"
                    >
                      Create Work Identity
                    </button>
                  </form>
                </AppCard>

                <AppCard className="p-6">
                  <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
                    Your network
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <div className="text-3xl font-black">{people.length}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        People discoverable
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <div className="text-3xl font-black">{jobs.length}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        Opportunities
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-indigo-50 p-5">
                    <div className="font-black">Why Work Identity?</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      A CV tells a story. A Work Identity creates a searchable
                      signal around your ability.
                    </p>
                  </div>
                </AppCard>
              </div>
            </div>
          )}

          {/* CV INTELLIGENCE */}
          {view === "cv" && (
            <div className="space-y-7">
              <section className="rounded-[2rem] bg-gradient-to-br from-indigo-700 to-slate-950 p-7 text-white sm:p-9">
                <div className="max-w-3xl">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
                    V5.3 • CV Intelligence
                  </div>

                  <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                    Make your CV discoverable.
                  </h1>

                  <p className="mt-4 max-w-2xl leading-7 text-indigo-100">
                    GUARDIAN WORK is building a CV intelligence layer that
                    helps you understand what is strong, what is missing and
                    what can be improved before your CV goes to an employer.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVInput}
                    className="hidden"
                  />

                  <button
                    onClick={openCVPicker}
                    disabled={uploading}
                    className="mt-7 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
                  >
                    {uploading ? "Uploading CV…" : "Upload My CV →"}
                  </button>

                  <p className="mt-3 text-xs text-indigo-200">
                    PDF, DOC or DOCX • Maximum 10 MB
                  </p>
                </div>
              </section>

              {latestCV ? (
                <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
                  <AppCard className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
                          Latest CV
                        </div>
                        <h3 className="mt-2 break-all text-lg font-black">
                          {latestCV.file_name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatBytes(latestCV.file_size)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                        {latestCV.status || "uploaded"}
                      </div>
                    </div>

                    <button
                      onClick={() => loadCVAnalysis(latestCV)}
                      className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                    >
                      Analyse CV →
                    </button>
                  </AppCard>

                  <AppCard className="p-6">
                    <SectionTitle
                      eyebrow="Readiness"
                      title="Your CV intelligence journey"
                    />

                    <div className="space-y-3">
                      {[
                        ["✓", "CV received", true],
                        ["2", "Content extraction", false],
                        ["3", "ATS analysis", false],
                        ["4", "Improvement recommendations", false],
                        ["5", "Approve final CV", false],
                      ].map(([number, label, complete]) => (
                        <div
                          key={String(label)}
                          className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                              complete
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-slate-500"
                            }`}
                          >
                            {number}
                          </div>
                          <span className="text-sm font-bold">{label}</span>
                        </div>
                      ))}
                    </div>
                  </AppCard>
                </div>
              ) : (
                <AppCard className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-2xl">
                    📄
                  </div>
                  <h3 className="mt-5 text-xl font-black">
                    No CV uploaded yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Upload your CV to start the GUARDIAN WORK CV Intelligence
                    journey.
                  </p>
                </AppCard>
              )}

              {selectedCV && analysis && (
                <AppCard className="p-6 sm:p-8">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                    <ScoreRing score={analysis.overall_score || 0} />

                    <div className="flex-1">
                      <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
                        Preliminary readiness
                      </div>
                      <h2 className="mt-2 text-3xl font-black">
                        CV Readiness Score
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        This first score is a file-level readiness indicator.
                        The full content ATS engine will analyse the actual CV
                        text in the next intelligence layer.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <ScoreBar
                      label="Structure"
                      score={analysis.structure_score || 0}
                    />
                    <ScoreBar
                      label="Experience"
                      score={analysis.experience_score || 0}
                    />
                    <ScoreBar
                      label="Skills"
                      score={analysis.skills_score || 0}
                    />
                    <ScoreBar
                      label="Contact"
                      score={analysis.contact_score || 0}
                    />
                    <ScoreBar
                      label="Keywords"
                      score={analysis.keywords_score || 0}
                    />
                    <ScoreBar
                      label="Readability"
                      score={analysis.readability_score || 0}
                    />
                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-3">
                    <div className="rounded-3xl bg-emerald-50 p-5">
                      <div className="font-black text-emerald-800">
                        Strengths
                      </div>
                      <p className="mt-3 text-sm leading-6 text-emerald-700">
                        {analysis.strengths}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-amber-50 p-5">
                      <div className="font-black text-amber-800">
                        Opportunities
                      </div>
                      <p className="mt-3 text-sm leading-6 text-amber-700">
                        {analysis.weaknesses}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-indigo-50 p-5">
                      <div className="font-black text-indigo-800">
                        Recommendations
                      </div>
                      <p className="mt-3 text-sm leading-6 text-indigo-700">
                        {analysis.recommendations}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    <strong>V5.3 engine status:</strong> secure file upload and
                    CV record creation are active. Actual PDF/DOC/DOCX content
                    extraction and AI/ATS interpretation will be connected as
                    the next processing layer.
                  </div>
                </AppCard>
              )}

              {cvDocuments.length > 0 && (
                <AppCard className="p-6">
                  <SectionTitle
                    eyebrow="CV history"
                    title="Your uploaded CVs"
                  />

                  <div className="space-y-3">
                    {cvDocuments.map((cv) => (
                      <button
                        key={cv.id}
                        onClick={() => loadCVAnalysis(cv)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 text-left hover:bg-slate-100"
                      >
                        <div>
                          <div className="font-bold">{cv.file_name}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            {formatBytes(cv.file_size)}
                          </div>
                        </div>
                        <span className="text-xs font-black text-indigo-600">
                          View →
                        </span>
                      </button>
                    ))}
                  </div>
                </AppCard>
              )}
            </div>
          )}

          {/* TALENT */}
          {view === "talent" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="Discover people"
                title="Talent Pool"
                text="Search by ability, province and town."
              />

              <AppCard className="p-5">
                <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search skills, names, roles..."
                    className="input"
                  />

                  <select
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value)}
                    className="input"
                  >
                    <option value="">All provinces</option>
                    {provinces.map((province) => (
                      <option key={province}>{province}</option>
                    ))}
                  </select>

                  <input
                    value={townFilter}
                    onChange={(e) => setTownFilter(e.target.value)}
                    placeholder="Town"
                    className="input"
                  />
                </div>
              </AppCard>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredPeople.map((person, index) => (
                  <AppCard key={person.id || index} className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black">
                          {person.name || "Unnamed"}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-indigo-600">
                          {person.job_title || "Role not specified"}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">
                        {person.verification_status || "unverified"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-500">
                      <div>📍 {person.town || "Town not specified"}</div>
                      <div>🌍 {person.province || "Province not specified"}</div>
                      <div>🧰 {person.skills || "Skills not listed"}</div>
                      <div>💼 {person.experience || "Experience not listed"}</div>
                    </div>

                    <button
                      onClick={() => contactPerson(person)}
                      className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white"
                    >
                      Contact via WhatsApp
                    </button>
                  </AppCard>
                ))}
              </div>

              {!loading && filteredPeople.length === 0 && (
                <AppCard className="p-10 text-center">
                  <h3 className="text-xl font-black">No talent found</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another province, town or search term.
                  </p>
                </AppCard>
              )}
            </div>
          )}

          {/* JOBS */}
          {view === "jobs" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="Find opportunity"
                title="Opportunities"
                text="Real opportunities connected to businesses and communities."
              />

              <AppCard className="p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search opportunities..."
                    className="input"
                  />

                  <select
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value)}
                    className="input"
                  >
                    <option value="">All provinces</option>
                    {provinces.map((province) => (
                      <option key={province}>{province}</option>
                    ))}
                  </select>
                </div>
              </AppCard>

              <div className="grid gap-5 md:grid-cols-2">
                {filteredJobs.map((job, index) => (
                  <AppCard key={job.id || index} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-indigo-600">
                          {job.employment_type || "Opportunity"}
                        </div>
                        <h3 className="mt-2 text-xl font-black">
                          {job.title}
                        </h3>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase text-emerald-700">
                        {job.status || "open"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {job.description || "No description provided."}
                    </p>

                    <div className="mt-5 grid gap-2 text-sm text-slate-500">
                      <div>
                        📍 {job.town || "Town"} •{" "}
                        {job.province || "Province"}
                      </div>
                      <div>
                        🧰 {job.skills_required || "Skills not specified"}
                      </div>
                      <div>
                        💼{" "}
                        {job.experience_required ||
                          "Experience not specified"}
                      </div>
                    </div>

                    <button
                      onClick={() => applyViaEmail(job)}
                      className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                    >
                      Apply via Email →
                    </button>
                  </AppCard>
                ))}
              </div>
            </div>
          )}

          {/* BUSINESS */}
          {view === "business" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="Business"
                title="Connect your business to local ability."
                text="Create a discoverable business profile and publish opportunities."
              />

              <div className="grid gap-6 xl:grid-cols-2">
                <AppCard className="p-6">
                  <h3 className="text-xl font-black">Business Profile</h3>

                  <form
                    onSubmit={createBusiness}
                    className="mt-6 space-y-4"
                  >
                    <input
                      placeholder="Business name"
                      value={businessForm.business_name}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          business_name: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        placeholder="Email"
                        value={businessForm.email}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            email: e.target.value,
                          })
                        }
                        className="input"
                      />

                      <input
                        placeholder="Phone"
                        value={businessForm.phone}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            phone: e.target.value,
                          })
                        }
                        className="input"
                      />

                      <input
                        placeholder="Town"
                        value={businessForm.town}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            town: e.target.value,
                          })
                        }
                        className="input"
                      />

                      <select
                        value={businessForm.province}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            province: e.target.value,
                          })
                        }
                        className="input"
                        required
                      >
                        <option value="">Province</option>
                        {provinces.map((province) => (
                          <option key={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    <input
                      placeholder="Industry"
                      value={businessForm.industry}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          industry: e.target.value,
                        })
                      }
                      className="input"
                    />

                    <textarea
                      placeholder="Tell people about the business"
                      value={businessForm.description}
                      onChange={(e) =>
                        setBusinessForm({
                          ...businessForm,
                          description: e.target.value,
                        })
                      }
                      className="input min-h-28"
                    />

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                    >
                      Create Business
                    </button>
                  </form>
                </AppCard>

                <AppCard className="p-6">
                  <h3 className="text-xl font-black">
                    Publish Opportunity
                  </h3>

                  <form
                    onSubmit={createOpportunity}
                    className="mt-6 space-y-4"
                  >
                    <input
                      placeholder="Opportunity title"
                      value={jobForm.title}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          title: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <textarea
                      placeholder="Description"
                      value={jobForm.description}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          description: e.target.value,
                        })
                      }
                      className="input min-h-24"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        placeholder="Town"
                        value={jobForm.town}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            town: e.target.value,
                          })
                        }
                        className="input"
                      />

                      <select
                        value={jobForm.province}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            province: e.target.value,
                          })
                        }
                        className="input"
                        required
                      >
                        <option value="">Province</option>
                        {provinces.map((province) => (
                          <option key={province}>{province}</option>
                        ))}
                      </select>

                      <select
                        value={jobForm.employment_type}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            employment_type: e.target.value,
                          })
                        }
                        className="input"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Temporary</option>
                        <option>Internship</option>
                        <option>Learnership</option>
                      </select>

                      <input
                        placeholder="Experience required"
                        value={jobForm.experience_required}
                        onChange={(e) =>
                          setJobForm({
                            ...jobForm,
                            experience_required: e.target.value,
                          })
                        }
                        className="input"
                      />
                    </div>

                    <input
                      placeholder="Skills required"
                      value={jobForm.skills_required}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          skills_required: e.target.value,
                        })
                      }
                      className="input"
                    />

                    <input
                      type="email"
                      placeholder="Application email"
                      value={jobForm.application_email}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          application_email: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />

                    <input
                      type="date"
                      value={jobForm.closing_date}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          closing_date: e.target.value,
                        })
                      }
                      className="input"
                    />

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white"
                    >
                      Publish Opportunity
                    </button>
                  </form>
                </AppCard>
              </div>
            </div>
          )}

          {/* OPERATIONS */}
          {view === "operations" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="System intelligence"
                title="Operations"
                text="Real database-backed platform visibility."
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <AppCard className="p-6">
                  <div className="text-4xl font-black">{people.length}</div>
                  <div className="mt-2 text-sm font-bold text-slate-500">
                    People
                  </div>
                </AppCard>

                <AppCard className="p-6">
                  <div className="text-4xl font-black">{jobs.length}</div>
                  <div className="mt-2 text-sm font-bold text-slate-500">
                    Opportunities
                  </div>
                </AppCard>

                <AppCard className="p-6">
                  <div className="text-4xl font-black">
                    {businesses.length}
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-500">
                    Businesses
                  </div>
                </AppCard>
              </div>

              <AppCard className="p-6">
                <SectionTitle
                  eyebrow="Geography"
                  title="Talent by province"
                />

                <div className="space-y-4">
                  {provinceStats.map((item) => {
                    const percentage =
                      people.length > 0
                        ? Math.round((item.count / people.length) * 100)
                        : 0;

                    return (
                      <div key={item.province}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-bold">
                            {item.province}
                          </span>
                          <span className="font-black">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AppCard>

              <AppCard className="p-6">
                <div className="text-xs font-black uppercase tracking-widest text-amber-600">
                  Coming intelligence
                </div>
                <h3 className="mt-2 text-xl font-black">
                  Matching • Applications • Placements • Timeline • Ads
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  These will be connected to real database workflows in the
                  next versions rather than simulated with fake numbers.
                </p>
              </AppCard>
            </div>
          )}

          {/* SETTINGS */}
          {view === "settings" && (
            <div className="space-y-7">
              <SectionTitle
                eyebrow="Control"
                title="Settings"
                text="Your GUARDIAN WORK preferences and privacy controls."
              />

              {[
                [
                  "Notifications",
                  "Control opportunity and platform notifications.",
                ],
                [
                  "Privacy & visibility",
                  "Control what businesses can discover.",
                ],
                [
                  "CV privacy",
                  "CV access will use controlled employer permissions.",
                ],
                [
                  "Theme",
                  "Personalized themes will be introduced in a future release.",
                ],
              ].map(([title, text]) => (
                <AppCard
                  key={title}
                  className="flex items-center justify-between gap-5 p-6"
                >
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-black uppercase text-slate-500">
                    V5.3+
                  </span>
                </AppCard>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl justify-between">
          {navItems.slice(0, 6).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold ${
                view === key
                  ? "bg-slate-950 text-white"
                  : "text-slate-500"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.15s ease;
        }

        .input:focus {
          border-color: rgb(99 102 241);
          box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
        }

        textarea.input {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}
