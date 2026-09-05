 "use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Person = {
  id: string;
  name: string | null;
  job_title: string | null;
  town: string | null;
  province: string | null;
  phone: string | null;
  experience: string | null;
  email: string | null;
  skills: string | null;
  availability: string | null;
  profile_visibility: string | null;
  verification_status: string | null;
  profile_completion: number | null;
  ats_score: number | null;
  cv_status: string | null;
  timeline_enabled: boolean | null;
  headline: string | null;
  profile_photo_url: string | null;
};

type Business = {
  id: string;
  name?: string | null;
  business_name?: string | null;
  email?: string | null;
  phone?: string | null;
  town?: string | null;
  province?: string | null;
  description?: string | null;
};

type Opportunity = {
  id: string;
  title: string | null;
  description: string | null;
  province: string | null;
  town: string | null;
  employment_type: string | null;
  experience_required: string | null;
  skills_required: string | null;
  application_email: string | null;
  closing_date: string | null;
  business_id?: string | null;
  created_at?: string | null;
};

type CVDocument = {
  id: string;
  job_seeker_id: string | null;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  status: string | null;
  ats_score: number | null;
  created_at: string | null;
};

type CVAnalysis = {
  id: string;
  cv_id: string | null;
  overall_score: number | null;
  structure_score: number | null;
  experience_score: number | null;
  skills_score: number | null;
  contact_score: number | null;
  keywords_score: number | null;
  readability_score: number | null;
  strengths: string | null;
  weaknesses: string | null;
  recommendations: string | null;
  analysis_status: string | null;
};

type Post = {
  id: string;
  author_type: string;
  author_id: string | null;
  post_type: string;
  content: string | null;
  title: string | null;
  location: string | null;
  opportunity_id: string | null;
  job_seeker_id: string | null;
  business_id: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
};

type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "selected"
  | "not_selected"
  | "withdrawn";

type Application = {
  id: string;
  opportunity_id: string;
  job_seeker_id: string;
  business_id: string | null;
  status: ApplicationStatus;
  cover_message: string | null;
  cv_id: string | null;
  applicant_name: string | null;
  applicant_job_title: string | null;
  applicant_town: string | null;
  applicant_province: string | null;
  employer_note: string | null;
  applied_at: string;
  updated_at: string;
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
  ["home", "Home"],
  ["work", "My Work"],
  ["timeline", "Timeline"],
  ["talent", "Talent"],
  ["jobs", "Jobs"],
  ["applications", "Applications"],
  ["business", "Business"],
  ["operations", "Operations"],
  ["settings", "Settings"],
] as const;

const statusLabel: Record<ApplicationStatus, string> = {
  applied: "Applied",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  selected: "Selected",
  not_selected: "Not selected",
  withdrawn: "Withdrawn",
};

function safeText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function initials(name: string | null) {
  return safeText(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase() || "GW";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "鈥�";
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClasses(status: ApplicationStatus) {
  if (status === "selected") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (status === "shortlisted" || status === "interview")
    return "bg-orange-100 text-orange-800 border-orange-200";
  if (status === "not_selected" || status === "withdrawn")
    return "bg-slate-100 text-slate-600 border-slate-200";
  if (status === "reviewing") return "bg-green-100 text-green-800 border-green-200";
  return "bg-orange-50 text-orange-700 border-orange-200";
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "green",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "green" | "orange" | "light" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const styles = {
    green: "bg-emerald-600 text-white hover:bg-emerald-700",
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    light: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default function Page() {
  const [active, setActive] = useState("home");
  const [people, setPeople] = useState<Person[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [cvs, setCVs] = useState<CVDocument[]>([]);
  const [analyses, setAnalyses] = useState<CVAnalysis[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [applications, setApplications] = useState<Application[]>([]);

  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState<"all" | ApplicationStatus>("all");

  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState("general");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const [workForm, setWorkForm] = useState({
    name: "",
    job_title: "",
    province: "",
    town: "",
    phone: "",
    experience: "",
    email: "",
    skills: "",
    availability: "Available",
    headline: "",
  });

  const [businessForm, setBusinessForm] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    town: "",
    description: "",
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: "",
    description: "",
    province: "",
    town: "",
    employment_type: "Permanent",
    experience_required: "",
    skills_required: "",
    application_email: "",
    closing_date: "",
  });

  const loadAll = async () => {
    setLoading(true);
    const [
      peopleRes,
      businessesRes,
      opportunitiesRes,
      cvsRes,
      analysesRes,
      postsRes,
      applicationsRes,
    ] = await Promise.all([
      supabase.from("Job seekers").select("*").order("name"),
      supabase.from("businesses").select("*").order("created_at", { ascending: false }),
      supabase.from("opportunities").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_analysis").select("*").order("created_at", { ascending: false }),
      supabase.from("posts").select("*").eq("status", "published").order("created_at", { ascending: false }),
      supabase.from("applications").select("*").order("applied_at", { ascending: false }),
    ]);

    if (peopleRes.error) {
      setMessage(`People: ${peopleRes.error.message}`);
    } else {
      const rows = (peopleRes.data || []) as Person[];
      setPeople(rows);
      setCurrentPerson((old) => old || rows[0] || null);
    }

    if (!businessesRes.error) {
      const rows = (businessesRes.data || []) as Business[];
      setBusinesses(rows);
      setCurrentBusiness((old) => old || rows[0] || null);
    }

    if (!opportunitiesRes.error) setOpportunities((opportunitiesRes.data || []) as Opportunity[]);
    if (!cvsRes.error) setCVs((cvsRes.data || []) as CVDocument[]);
    if (!analysesRes.error) setAnalyses((analysesRes.data || []) as CVAnalysis[]);
    if (!postsRes.error) setPosts((postsRes.data || []) as Post[]);
    if (!applicationsRes.error) setApplications((applicationsRes.data || []) as Application[]);

    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!currentPerson) return;
    setWorkForm({
      name: currentPerson.name || "",
      job_title: currentPerson.job_title || "",
      province: currentPerson.province || "",
      town: currentPerson.town || "",
      phone: currentPerson.phone || "",
      experience: currentPerson.experience || "",
      email: currentPerson.email || "",
      skills: currentPerson.skills || "",
      availability: currentPerson.availability || "Available",
      headline: currentPerson.headline || "",
    });
  }, [currentPerson?.id]);

  const myApplications = useMemo(
    () =>
      currentPerson
        ? applications.filter((a) => a.job_seeker_id === currentPerson.id)
        : [],
    [applications, currentPerson]
  );

  const businessApplications = useMemo(() => {
    if (!currentBusiness) return [];
    return applications.filter((a) => a.business_id === currentBusiness.id);
  }, [applications, currentBusiness]);

  const visibleApplications = useMemo(() => {
    if (applicationFilter === "all") return myApplications;
    return myApplications.filter((a) => a.status === applicationFilter);
  }, [myApplications, applicationFilter]);

  const filteredPeople = useMemo(() => {
    const q = search.toLowerCase().trim();
    return people.filter((p) => {
      const haystack = [
        p.name,
        p.job_title,
        p.town,
        p.province,
        p.skills,
        p.experience,
      ]
        .map(safeText)
        .join(" ")
        .toLowerCase();

      return (
        (!q || haystack.includes(q)) &&
        (!provinceFilter || p.province === provinceFilter) &&
        (!townFilter || safeText(p.town).toLowerCase().includes(townFilter.toLowerCase()))
      );
    });
  }, [people, search, provinceFilter, townFilter]);

  const filteredOpportunities = useMemo(() => {
    const q = search.toLowerCase().trim();
    return opportunities.filter((o) => {
      const haystack = [
        o.title,
        o.description,
        o.town,
        o.province,
        o.skills_required,
        o.employment_type,
      ]
        .map(safeText)
        .join(" ")
        .toLowerCase();

      return (
        (!q || haystack.includes(q)) &&
        (!provinceFilter || o.province === provinceFilter)
      );
    });
  }, [opportunities, search, provinceFilter]);

  const appOpportunity = (id: string) =>
    opportunities.find((o) => o.id === id);

  const appPerson = (id: string) =>
    people.find((p) => p.id === id);

  const currentCV = useMemo(
    () =>
      currentPerson
        ? cvs.find((c) => c.job_seeker_id === currentPerson.id)
        : undefined,
    [cvs, currentPerson]
  );

  const currentAnalysis = useMemo(
    () => (currentCV ? analyses.find((a) => a.cv_id === currentCV.id) : undefined),
    [analyses, currentCV]
  );

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  };

  const updateWorkIdentity = async () => {
    if (!currentPerson) return;
    const { data, error } = await supabase
      .from("Job seekers")
      .update({
        ...workForm,
        profile_completion: Math.min(
          100,
          [
            workForm.name,
            workForm.job_title,
            workForm.province,
            workForm.town,
            workForm.phone,
            workForm.experience,
            workForm.skills,
            workForm.availability,
          ].filter(Boolean).length * 12
        ),
      })
      .eq("id", currentPerson.id)
      .select()
      .single();

    if (error) return flash(error.message);
    setCurrentPerson(data as Person);
    setPeople((old) => old.map((p) => (p.id === data.id ? (data as Person) : p)));
    flash("Work Identity updated.");
  };

  const createBusiness = async () => {
    if (!businessForm.name.trim()) return flash("Enter the business name.");
    const { data, error } = await supabase
      .from("businesses")
      .insert(businessForm)
      .select()
      .single();

    if (error) return flash(error.message);
    setBusinesses((old) => [data as Business, ...old]);
    setCurrentBusiness(data as Business);
    flash("Business profile created.");
  };

  const createOpportunity = async () => {
    if (!currentBusiness) return flash("Create or select a business first.");
    if (!opportunityForm.title.trim()) return flash("Enter an opportunity title.");

    const { data, error } = await supabase
      .from("opportunities")
      .insert({
        ...opportunityForm,
        business_id: currentBusiness.id,
      })
      .select()
      .single();

    if (error) return flash(error.message);

    setOpportunities((old) => [data as Opportunity, ...old]);
    setOpportunityForm({
      title: "",
      description: "",
      province: currentBusiness.province || "",
      town: currentBusiness.town || "",
      employment_type: "Permanent",
      experience_required: "",
      skills_required: "",
      application_email: currentBusiness.email || "",
      closing_date: "",
    });
    flash("Opportunity published.");
  };

  const applyToOpportunity = async (opportunity: Opportunity) => {
    if (!currentPerson) return flash("Create a Work Identity first.");

    const already = applications.find(
      (a) =>
        a.opportunity_id === opportunity.id &&
        a.job_seeker_id === currentPerson.id
    );
    if (already) {
      setActive("applications");
      return flash(`You already applied 鈥� status: ${statusLabel[already.status]}.`);
    }

    const payload = {
      opportunity_id: opportunity.id,
      job_seeker_id: currentPerson.id,
      business_id: opportunity.business_id || null,
      status: "applied",
      cover_message: `Application submitted through GUARDIAN WORK for ${opportunity.title || "this opportunity"}.`,
      cv_id: currentCV?.id || null,
      applicant_name: currentPerson.name,
      applicant_job_title: currentPerson.job_title,
      applicant_town: currentPerson.town,
      applicant_province: currentPerson.province,
    };

    const { data, error } = await supabase
      .from("applications")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23505")
        return flash("You have already applied to this opportunity.");
      return flash(error.message);
    }

    setApplications((old) => [data as Application, ...old]);
    setActive("applications");
    flash("Application submitted successfully.");
  };

  const updateApplicationStatus = async (
    application: Application,
    status: ApplicationStatus
  ) => {
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", application.id)
      .select()
      .single();

    if (error) return flash(error.message);

    setApplications((old) =>
      old.map((a) => (a.id === application.id ? (data as Application) : a))
    );
    flash(`Application moved to ${statusLabel[status]}.`);
  };

  const uploadCV = async (file: File) => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    if (file.size > 10 * 1024 * 1024) return flash("CV must be 10MB or smaller.");

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type))
      return flash("Please upload PDF, DOC or DOCX.");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `uploads/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("cv-documents")
      .upload(path, file, { upsert: false });

    if (uploadError) return flash(uploadError.message);

    const { data: cv, error: cvError } = await supabase
      .from("cv_documents")
      .insert({
        job_seeker_id: currentPerson.id,
        file_name: file.name,
        file_path: path,
        file_type: file.type,
        file_size: file.size,
        status: "uploaded",
      })
      .select()
      .single();

    if (cvError) return flash(cvError.message);

    const preliminaryScore = Math.min(
      100,
      50 + (file.type === "application/pdf" ? 15 : 10) + (file.size > 10000 ? 10 : 5)
    );

    await supabase.from("cv_analysis").insert({
      cv_id: cv.id,
      overall_score: preliminaryScore,
      structure_score: preliminaryScore,
      experience_score: 50,
      skills_score: 50,
      contact_score: 50,
      keywords_score: 45,
      readability_score: 60,
      strengths: "CV uploaded successfully.",
      weaknesses: "This is a preliminary file-level assessment, not full content ATS analysis.",
      recommendations: "Complete Work Identity details and add relevant skills and experience.",
      analysis_status: "preliminary",
    });

    await supabase
      .from("Job seekers")
      .update({ cv_status: "uploaded", ats_score: preliminaryScore })
      .eq("id", currentPerson.id);

    flash("CV uploaded. Preliminary readiness score created.");
    await loadAll();
  };

  const createPost = async () => {
    if (!currentPerson || !postText.trim()) return;
    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_type: "person",
        author_id: currentPerson.id,
        job_seeker_id: currentPerson.id,
        post_type: postType,
        content: postText.trim(),
        title: postType === "availability" ? "Available for work" : null,
        location: [currentPerson.town, currentPerson.province].filter(Boolean).join(", "),
        visibility: "public",
        status: "published",
      })
      .select()
      .single();

    if (error) return flash(error.message);
    setPosts((old) => [data as Post, ...old]);
    setPostText("");
    flash("Posted to the Work Timeline.");
  };

  const toggleLike = async (post: Post) => {
    const authorId = currentPerson?.id || null;
    const existing = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("author_type", "person")
      .eq("author_id", authorId)
      .maybeSingle();

    if (existing.data) {
      await supabase.from("post_likes").delete().eq("id", existing.data.id);
      await supabase
        .from("posts")
        .update({ likes_count: Math.max(0, post.likes_count - 1) })
        .eq("id", post.id);
      setLikedPosts((old) => ({ ...old, [post.id]: false }));
      setPosts((old) =>
        old.map((p) => (p.id === post.id ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p))
      );
    } else {
      await supabase.from("post_likes").insert({
        post_id: post.id,
        author_type: "person",
        author_id: authorId,
      });
      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", post.id);
      setLikedPosts((old) => ({ ...old, [post.id]: true }));
      setPosts((old) =>
        old.map((p) => (p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p))
      );
    }
  };

  const addComment = async (post: Post) => {
    const content = (commentDrafts[post.id] || "").trim();
    if (!content || !currentPerson) return;

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: post.id,
        author_type: "person",
        author_id: currentPerson.id,
        content,
      })
      .select()
      .single();

    if (error) return flash(error.message);

    await supabase
      .from("posts")
      .update({ comments_count: post.comments_count + 1 })
      .eq("id", post.id);

    setComments((old) => ({
      ...old,
      [post.id]: [...(old[post.id] || []), data as Comment],
    }));
    setCommentDrafts((old) => ({ ...old, [post.id]: "" }));
    setPosts((old) =>
      old.map((p) => (p.id === post.id ? { ...p, comments_count: p.comments_count + 1 } : p))
    );
  };

  const sharePost = async (post: Post) => {
    await supabase.from("post_shares").insert({
      post_id: post.id,
      author_type: "person",
      author_id: currentPerson?.id || null,
    });
    await supabase
      .from("posts")
      .update({ shares_count: post.shares_count + 1 })
      .eq("id", post.id);
    setPosts((old) =>
      old.map((p) => (p.id === post.id ? { ...p, shares_count: p.shares_count + 1 } : p))
    );
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${window.location.origin}/?post=${post.id}`);
      flash("Post link copied.");
    } else flash("Post shared.");
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((old) => ({ ...old, [postId]: (data || []) as Comment[] }));
  };

  const viewPrivateCV = async (cv: CVDocument | null) => {
    if (!cv?.file_path) return flash("No CV file is attached.");
    const { data, error } = await supabase.storage
      .from("cv-documents")
      .createSignedUrl(cv.file_path, 300);

    if (error || !data?.signedUrl) return flash(error?.message || "Could not create secure CV link.");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const nav = (id: string) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button onClick={() => nav("home")} className="flex items-center gap-3 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 font-black text-white shadow-lg shadow-emerald-200">
            GW
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900">
              GUARDIAN <span className="text-orange-500">WORK</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Make your ability discoverable
            </div>
          </div>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => nav(id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                active === id
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentPerson && (
            <div className="hidden text-right sm:block">
              <div className="text-xs font-black text-slate-900">{currentPerson.name}</div>
              <div className="text-[10px] text-slate-500">{currentPerson.job_title || "Work identity"}</div>
            </div>
          )}
          <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 font-black text-orange-700">
            {initials(currentPerson?.name || "GW")}
          </div>
        </div>
      </div>
    </header>
  );

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {[
          ["home", "Home"],
          ["work", "Work"],
          ["timeline", "Feed"],
          ["applications", "Apply"],
          ["business", "Business"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => nav(id)}
            className={`rounded-xl px-2 py-2 text-[10px] font-black ${
              active === id ? "bg-emerald-600 text-white" : "text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-emerald-700 p-6 text-white shadow-xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-slate-950">
              V5.5 鈥� REAL APPLICATION ENGINE
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Your ability can open doors.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
              GUARDIAN WORK connects people, skills and businesses 鈥� from being discoverable to
              actually applying, being reviewed and reaching placement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="orange" onClick={() => nav("jobs")}>
                Discover opportunities
              </Button>
              <Button variant="light" onClick={() => nav("work")}>
                Build Work Identity
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-100">
              Your journey
            </div>
            <div className="mt-4 space-y-3 text-sm font-bold">
              {["Discoverable", "Opportunity", "Application", "Shortlisted", "Placement"].map(
                (x, i) => (
                  <div key={x} className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-orange-400 text-xs font-black text-slate-950">
                      {i + 1}
                    </div>
                    <span>{x}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Discoverable people", people.filter((p) => p.profile_visibility !== "hidden").length],
          ["Opportunities", opportunities.length],
          ["Applications", applications.length],
          ["Placements", applications.filter((a) => a.status === "selected").length],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">Latest opportunities</h2>
              <p className="text-xs text-slate-500">Real opportunities from the database</p>
            </div>
            <Button variant="light" onClick={() => nav("jobs")}>View all</Button>
          </div>
          <div className="mt-5 space-y-3">
            {opportunities.slice(0, 4).map((o) => (
              <div key={o.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-900">{o.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {[o.town, o.province].filter(Boolean).join(" 鈥� ")}
                    </div>
                  </div>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-700">
                    {o.employment_type || "Opportunity"}
                  </span>
                </div>
                <Button className="mt-3" variant="green" onClick={() => applyToOpportunity(o)}>
                  Apply
                </Button>
              </div>
            ))}
            {!opportunities.length && (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                No opportunities yet.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">Your application journey</h2>
              <p className="text-xs text-slate-500">Keep track of what happens after Apply</p>
            </div>
            <Button variant="light" onClick={() => nav("applications")}>Open</Button>
          </div>
          <div className="mt-5">
            {myApplications.slice(0, 3).map((a) => {
              const o = appOpportunity(a.opportunity_id);
              return (
                <div key={a.id} className="mb-3 rounded-2xl border border-slate-200 p-4">
                  <div className="font-black text-slate-900">{o?.title || "Opportunity"}</div>
                  <div className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses(a.status)}`}>
                    {statusLabel[a.status]}
                  </div>
                </div>
              );
            })}
            {!myApplications.length && (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                You have not applied to an opportunity yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderWork = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">My Work</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Work Identity</h1>
        <p className="mt-2 text-sm text-slate-500">
          Build the professional identity businesses can discover.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Full name"],
              ["job_title", "What do you do?"],
              ["province", "Province"],
              ["town", "Town / Area"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["experience", "Experience"],
              ["availability", "Availability"],
              ["headline", "Professional headline"],
              ["skills", "Skills"],
            ].map(([key, label]) => (
              <label key={key} className="text-xs font-bold text-slate-600">
                {label}
                {key === "province" ? (
                  <select
                    value={(workForm as any)[key]}
                    onChange={(e) => setWorkForm({ ...workForm, [key]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => <option key={p}>{p}</option>)}
                  </select>
                ) : (
                  <input
                    value={(workForm as any)[key]}
                    onChange={(e) => setWorkForm({ ...workForm, [key]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                )}
              </label>
            ))}
          </div>
          <Button className="mt-5" onClick={updateWorkIdentity}>Save Work Identity</Button>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="bg-emerald-700 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                Discoverability
              </div>
              <div className="mt-2 text-4xl font-black">
                {currentPerson?.profile_completion || 0}%
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                Complete more of your Work Identity to make your ability easier to understand.
              </p>
            </div>
            <div className="p-6">
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${currentPerson?.profile_completion || 0}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-slate-900">CV Intelligence</h2>
                <p className="text-xs text-slate-500">
                  Private storage 鈥� preliminary readiness assessment
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-black text-orange-700">
                {currentCV?.ats_score ?? currentPerson?.ats_score ?? "鈥�"}
              </div>
            </div>

            {currentCV && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="font-bold text-slate-800">{currentCV.file_name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Uploaded {formatDate(currentCV.created_at)}
                </div>
                <Button className="mt-3" variant="light" onClick={() => viewPrivateCV(currentCV)}>
                  Open securely
                </Button>
              </div>
            )}

            {currentAnalysis && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Structure", currentAnalysis.structure_score],
                  ["Experience", currentAnalysis.experience_score],
                  ["Skills", currentAnalysis.skills_score],
                  ["Keywords", currentAnalysis.keywords_score],
                ].map(([x, y]) => (
                  <div key={String(x)} className="rounded-xl border border-slate-200 p-3">
                    <div className="text-slate-500">{x}</div>
                    <div className="mt-1 text-lg font-black text-slate-900">{y ?? "鈥�"}</div>
                  </div>
                ))}
              </div>
            )}

            <label className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-5 text-center">
              <div className="font-black text-emerald-800">Upload / replace CV</div>
              <div className="mt-1 text-xs text-emerald-700">PDF, DOC or DOCX 鈥� max 10MB</div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCV(e.target.files[0])}
              />
            </label>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <div className="text-xs font-black uppercase tracking-widest text-orange-400">Opportunities</div>
        <h1 className="mt-2 text-3xl font-black">Find where your ability can fit.</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search work, skills, town..."
            className="rounded-xl bg-white px-4 py-3 text-sm text-slate-900 outline-none"
          />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-xl bg-white px-4 py-3 text-sm text-slate-900 outline-none"
          >
            <option value="">All provinces</option>
            {provinces.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredOpportunities.map((o) => {
          const applied = currentPerson
            ? applications.some(
                (a) => a.opportunity_id === o.id && a.job_seeker_id === currentPerson.id
              )
            : false;

          return (
            <Card key={o.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-black text-slate-900">{o.title}</div>
                  <div className="mt-1 text-xs font-bold text-orange-600">
                    {[o.town, o.province].filter(Boolean).join(" 鈥� ")}
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {o.employment_type || "Work"}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {o.description || "No description provided."}
              </p>

              <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <b>Experience:</b> {o.experience_required || "Not specified"}
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <b>Skills:</b> {o.skills_required || "Not specified"}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  variant={applied ? "light" : "orange"}
                  disabled={applied}
                  onClick={() => applyToOpportunity(o)}
                >
                  {applied ? "Already applied" : "Apply now"}
                </Button>
                {o.application_email && (
                  <a
                    href={`mailto:${o.application_email}?subject=${encodeURIComponent(
                      `Application: ${o.title || "Opportunity"}`
                    )}`}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Email option
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="rounded-3xl bg-emerald-700 p-6 text-white">
        <div className="text-xs font-black uppercase tracking-widest text-orange-300">My Applications</div>
        <h1 className="mt-2 text-3xl font-black">Know what happens after Apply.</h1>
        <p className="mt-2 max-w-2xl text-sm text-emerald-50">
          Your application has a real status and history instead of disappearing into a black hole.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "applied", "reviewing", "shortlisted", "interview", "selected", "not_selected"] as const).map(
          (x) => (
            <button
              key={x}
              onClick={() => setApplicationFilter(x)}
              className={`rounded-full border px-3 py-2 text-xs font-black ${
                applicationFilter === x
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {x === "all" ? "All" : statusLabel[x]}
            </button>
          )
        )}
      </div>

      <div className="space-y-4">
        {visibleApplications.map((a) => {
          const o = appOpportunity(a.opportunity_id);
          return (
            <Card key={a.id} className="p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="text-xl font-black text-slate-900">
                    {o?.title || "Opportunity"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Applied {formatDate(a.applied_at)} 鈥� {[o?.town, o?.province].filter(Boolean).join(" 鈥� ")}
                  </div>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${statusClasses(a.status)}`}>
                  {statusLabel[a.status]}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5">
                {(["applied", "reviewing", "shortlisted", "interview", "selected"] as ApplicationStatus[]).map(
                  (stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div
                        className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                          ["applied", "reviewing", "shortlisted", "interview", "selected"].indexOf(a.status) >= i
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{statusLabel[stage]}</span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <b>CV attached:</b> {a.cv_id ? "Yes" : "No"} 鈥� Last updated {formatDate(a.updated_at)}
              </div>
            </Card>
          );
        })}

        {!visibleApplications.length && (
          <Card className="p-10 text-center">
            <div className="text-4xl">馃煝</div>
            <h2 className="mt-3 font-black text-slate-900">No applications here yet.</h2>
            <p className="mt-1 text-sm text-slate-500">Discover an opportunity and make your next move.</p>
            <Button className="mt-5" variant="orange" onClick={() => nav("jobs")}>Find opportunities</Button>
          </Card>
        )}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">Work Timeline</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Show the work behind the person.</h1>
      </div>

      <Card className="p-5">
        <div className="flex gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">
            {initials(currentPerson?.name || "GW")}
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share work, availability, experience or an achievement..."
              className="min-h-24 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              >
                <option value="general">General</option>
                <option value="availability">Available for work</option>
                <option value="work_showcase">Work showcase</option>
                <option value="experience">Experience</option>
                <option value="opportunity">Opportunity</option>
              </select>
              <Button variant="orange" onClick={createPost}>Publish</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-5">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-100 font-black text-orange-700">
                {initials(appPerson(post.job_seeker_id || post.author_id)?.name || "GW")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-slate-900">
                  {appPerson(post.job_seeker_id || post.author_id)?.name || "GUARDIAN WORK member"}
                </div>
                <div className="text-xs text-slate-500">{formatDate(post.created_at)} 鈥� {post.location || "South Africa"}</div>
                {post.title && <div className="mt-3 font-black text-slate-900">{post.title}</div>}
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{post.content}</p>

                {post.opportunity_id && appOpportunity(post.opportunity_id) && (
                  <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <div className="text-xs font-black uppercase tracking-wider text-orange-600">Opportunity</div>
                    <div className="mt-1 font-black text-slate-900">{appOpportunity(post.opportunity_id)?.title}</div>
                    <Button className="mt-3" variant="orange" onClick={() => applyToOpportunity(appOpportunity(post.opportunity_id)!)}>
                      Apply
                    </Button>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleLike(post)}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${
                      likedPosts[post.id] ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    鈾� {post.likes_count}
                  </button>
                  <button
                    onClick={() => loadComments(post.id)}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-600"
                  >
                    馃挰 {post.comments_count}
                  </button>
                  <button
                    onClick={() => sharePost(post)}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-600"
                  >
                    鈫� {post.shares_count}
                  </button>
                </div>

                {(comments[post.id] || []).length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {(comments[post.id] || []).map((c) => (
                      <div key={c.id} className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                        <b className="text-slate-800">{appPerson(c.author_id)?.name || "Member"}:</b> {c.content}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <input
                    value={commentDrafts[post.id] || ""}
                    onChange={(e) => setCommentDrafts((old) => ({ ...old, [post.id]: e.target.value }))}
                    placeholder="Add a work-related comment..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
                  />
                  <Button variant="light" onClick={() => addComment(post)}>Comment</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTalent = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">Talent Discovery</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Find people by ability.</h1>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, skill, job..."
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
          />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
          >
            <option value="">All provinces</option>
            {provinces.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input
            value={townFilter}
            onChange={(e) => setTownFilter(e.target.value)}
            placeholder="Town / area"
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPeople.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">
                {initials(p.name)}
              </div>
              <div className="min-w-0">
                <div className="font-black text-slate-900">{p.name}</div>
                <div className="text-sm font-bold text-orange-600">{p.job_title || "Work seeker"}</div>
                <div className="text-xs text-slate-500">{[p.town, p.province].filter(Boolean).join(" 鈥� ")}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{p.headline || p.experience || "Building a discoverable work identity."}</p>
            {p.skills && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.split(",").slice(0, 8).map((s) => (
                  <span key={s} className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">Business</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Connect business to kasi talent.</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-black">Business profile</h2>
          <p className="mt-1 text-xs text-slate-500">Create or select the business posting opportunities.</p>

          {businesses.length > 0 && (
            <select
              value={currentBusiness?.id || ""}
              onChange={(e) => setCurrentBusiness(businesses.find((b) => b.id === e.target.value) || null)}
              className="mt-5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.business_name || b.name || "Business"}
                </option>
              ))}
            </select>
          )}

          <div className="mt-5 space-y-3">
            {[
              ["name", "Business name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["province", "Province"],
              ["town", "Town"],
              ["description", "Description"],
            ].map(([key, label]) => (
              <input
                key={key}
                value={(businessForm as any)[key]}
                onChange={(e) => setBusinessForm({ ...businessForm, [key]: e.target.value })}
                placeholder={label}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
              />
            ))}
          </div>
          <Button className="mt-4" onClick={createBusiness}>Create business</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black">Publish opportunity</h2>
          <p className="mt-1 text-xs text-slate-500">
            Opportunities become discoverable on Jobs and can receive real applications.
          </p>

          <div className="mt-5 space-y-3">
            {[
              ["title", "Opportunity title"],
              ["description", "Description"],
              ["town", "Town"],
              ["experience_required", "Experience required"],
              ["skills_required", "Skills required"],
              ["application_email", "Application email"],
              ["closing_date", "Closing date"],
            ].map(([key, label]) => (
              <input
                key={key}
                type={key === "closing_date" ? "date" : "text"}
                value={(opportunityForm as any)[key]}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, [key]: e.target.value })}
                placeholder={label}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
              />
            ))}
            <select
              value={opportunityForm.province}
              onChange={(e) => setOpportunityForm({ ...opportunityForm, province: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
            >
              <option value="">Province</option>
              {provinces.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Button className="mt-4" variant="orange" onClick={createOpportunity}>Publish opportunity</Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-black">Applicants</h2>
        <p className="mt-1 text-xs text-slate-500">
          Business applicant pipeline 鈥� real records only.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(["applied", "reviewing", "shortlisted", "interview", "selected"] as ApplicationStatus[]).map((s) => (
            <div key={s} className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-bold text-slate-500">{statusLabel[s]}</div>
              <div className="mt-1 text-3xl font-black text-slate-900">
                {businessApplications.filter((a) => a.status === s).length}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {businessApplications.map((a) => {
            const person = appPerson(a.job_seeker_id);
            const opp = appOpportunity(a.opportunity_id);
            const cv = cvs.find((c) => c.id === a.cv_id);
            return (
              <div key={a.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-black text-slate-900">{person?.name || a.applicant_name || "Applicant"}</div>
                    <div className="text-xs font-bold text-orange-600">
                      {person?.job_title || a.applicant_job_title || "Work identity"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {opp?.title || "Opportunity"} 鈥� {[person?.town, person?.province].filter(Boolean).join(" 鈥� ")}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClasses(a.status)}`}>
                      {statusLabel[a.status]}
                    </span>

                    <select
                      value={a.status}
                      onChange={(e) => updateApplicationStatus(a, e.target.value as ApplicationStatus)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                    >
                      {(["applied", "reviewing", "shortlisted", "interview", "selected", "not_selected"] as ApplicationStatus[]).map(
                        (s) => <option key={s} value={s}>{statusLabel[s]}</option>
                      )}
                    </select>

                    <Button variant="light" onClick={() => viewPrivateCV(cv || null)}>
                      View CV securely
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {!businessApplications.length && (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
              No applications received yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderOperations = () => {
    const selected = applications.filter((a) => a.status === "selected").length;
    const shortlist = applications.filter((a) => a.status === "shortlisted").length;
    const interviews = applications.filter((a) => a.status === "interview").length;
    const reviewing = applications.filter((a) => a.status === "reviewing").length;

    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">Operations</div>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Placement intelligence.</h1>
          <p className="mt-2 text-sm text-slate-500">Database-backed platform signals. No invented numbers.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["People", people.length],
            ["Opportunities", opportunities.length],
            ["Applications", applications.length],
            ["Shortlisted", shortlist],
            ["Selected", selected],
          ].map(([x, y]) => (
            <Card key={String(x)} className="p-5">
              <div className="text-xs font-bold text-slate-500">{x}</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{y}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="font-black text-slate-900">Application pipeline</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Applied", applications.filter((a) => a.status === "applied").length],
              ["Reviewing", reviewing],
              ["Shortlisted", shortlist],
              ["Interview", interviews],
              ["Selected", selected],
              ["Not selected", applications.filter((a) => a.status === "not_selected").length],
            ].map(([x, y]) => (
              <div key={String(x)}>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{x}</span><span>{y}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${applications.length ? (Number(y) / applications.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">Settings</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Your GUARDIAN WORK controls.</h1>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="font-black text-slate-900">Profile visibility</div>
            <div className="text-xs text-slate-500">Control whether your Work Identity can be discovered.</div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {currentPerson?.profile_visibility || "discoverable"}
          </span>
        </div>
        <div className="pt-5 text-sm text-slate-600">
          Authentication, detailed role permissions and consent controls should be completed before
          broad production access to private applicant information.
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid min-h-[60vh] place-items-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
            <div className="mt-4 font-black text-slate-700">Loading GUARDIAN WORK...</div>
          </div>
        </div>
      );
    }

    if (active === "home") return renderHome();
    if (active === "work") return renderWork();
    if (active === "timeline") return renderTimeline();
    if (active === "talent") return renderTalent();
    if (active === "jobs") return renderJobs();
    if (active === "applications") return renderApplications();
    if (active === "business") return renderBusiness();
    if (active === "operations") return renderOperations();
    return renderSettings();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {renderHeader()}

      {message && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-xl">
          <span className="mr-2 text-orange-500">鈼�</span>{message}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:py-8">
        {renderContent()}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <b className="text-emerald-700">GUARDIAN</b>{" "}
            <b className="text-orange-500">WORK</b> 鈥� Make your ability discoverable.
          </div>
          <div>V5.5 鈥� Applications & Placement Engine</div>
        </div>
      </footer>

      {renderMobileNav()}
    </div>
  );
}
