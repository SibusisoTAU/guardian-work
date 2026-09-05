"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type View =
  | "home"
  | "work"
  | "talent"
  | "jobs"
  | "timeline"
  | "business"
  | "operations"
  | "settings";

type Person = {
  id?: string;
  name: string;
  job_title?: string | null;
  town?: string | null;
  province?: string | null;
  phone?: string | null;
  email?: string | null;
  experience?: string | null;
  skills?: string | null;
  availability?: string | null;
  headline?: string | null;
  profile_photo_url?: string | null;
  timeline_enabled?: boolean | null;
  profile_completion?: number | null;
  verification_status?: string | null;
  ats_score?: number | null;
  cv_status?: string | null;
};

type Business = {
  id?: string;
  name?: string;
  company_name?: string;
  town?: string;
  province?: string;
  description?: string;
  phone?: string;
  email?: string;
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
  closing_date?: string;
  business_id?: string;
  created_at?: string;
};

type CVDocument = {
  id: string;
  job_seeker_id?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  status?: string | null;
  ats_score?: number | null;
  created_at?: string | null;
};

type CVAnalysis = {
  id: string;
  cv_id?: string | null;
  overall_score?: number | null;
  structure_score?: number | null;
  experience_score?: number | null;
  skills_score?: number | null;
  contact_score?: number | null;
  keywords_score?: number | null;
  readability_score?: number | null;
  strengths?: string | null;
  weaknesses?: string | null;
  recommendations?: string | null;
  analysis_status?: string | null;
};

type Post = {
  id: string;
  author_type: string;
  author_id?: string | null;
  post_type: string;
  content?: string | null;
  title?: string | null;
  location?: string | null;
  opportunity_id?: string | null;
  job_seeker_id?: string | null;
  business_id?: string | null;
  visibility?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  shares_count?: number | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type Comment = {
  id: string;
  post_id: string;
  author_type: string;
  author_id?: string | null;
  content: string;
  created_at?: string | null;
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

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Temporary",
  "Contract",
  "Casual",
  "Internship",
  "Learnership",
];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(value?: string | null) {
  if (!value) return "";

  const date = new Date(value).getTime();
  const now = Date.now();
  const seconds = Math.max(1, Math.floor((now - date) / 1000));

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return formatDate(value);
}

function normalizeSkills(value?: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function scoreBar(score?: number | null) {
  const safe = Math.max(0, Math.min(100, Number(score || 0)));
  return `${safe}%`;
}

export default function Home() {
  const [view, setView] = useState<View>("home");

  const [people, setPeople] = useState<Person[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [cvDocuments, setCvDocuments] = useState<CVDocument[]>([]);
  const [cvAnalyses, setCvAnalyses] = useState<CVAnalysis[]>([]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchPeople, setSearchPeople] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const [searchJobs, setSearchJobs] = useState("");
  const [jobProvinceFilter, setJobProvinceFilter] = useState("");

  const [newPost, setNewPost] = useState("");
  const [newPostType, setNewPostType] = useState("general");
  const [newPostLocation, setNewPostLocation] = useState("");

  const [showPostComposer, setShowPostComposer] = useState(false);

  const [workForm, setWorkForm] = useState({
    name: "",
    job_title: "",
    province: "",
    town: "",
    phone: "",
    email: "",
    experience: "",
    skills: "",
    availability: "Available for work",
    headline: "",
  });

  const [businessForm, setBusinessForm] = useState({
    name: "",
    province: "",
    town: "",
    description: "",
    phone: "",
    email: "",
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: "",
    description: "",
    province: "",
    town: "",
    employment_type: "Full-time",
    experience_required: "",
    skills_required: "",
    application_email: "",
    closing_date: "",
    business_id: "",
  });

  const [uploadingCV, setUploadingCV] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CVDocument | null>(null);

  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  useEffect(() => {
    loadEverything();
  }, []);

  async function loadEverything() {
    setLoading(true);

    await Promise.all([
      loadPeople(),
      loadBusinesses(),
      loadOpportunities(),
      loadCVs(),
      loadTimeline(),
    ]);

    setLoading(false);
  }

  async function loadPeople() {
    const { data, error } = await supabase
      .from("Job seekers")
      .select("*");

    if (!error && data) {
      setPeople(data as Person[]);
      setCurrentPerson((data[0] as Person) || null);
    }
  }

  async function loadBusinesses() {
    const { data } = await supabase
      .from("businesses")
      .select("*");

    if (data) setBusinesses(data as Business[]);
  }

  async function loadOpportunities() {
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setOpportunities(data as Opportunity[]);
  }

  async function loadCVs() {
    const { data } = await supabase
      .from("cv_documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data) return;

    const cvs = data as CVDocument[];
    setCvDocuments(cvs);

    if (cvs.length > 0) {
      setSelectedCV(cvs[0]);

      const ids = cvs.map((cv) => cv.id);

      const { data: analyses } = await supabase
        .from("cv_analysis")
        .select("*")
        .in("cv_id", ids)
        .order("created_at", { ascending: false });

      if (analyses) {
        setCvAnalyses(analyses as CVAnalysis[]);
      }
    }
  }

  async function loadTimeline() {
    setTimelineLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      const loadedPosts = data as Post[];
      setPosts(loadedPosts);

      if (loadedPosts.length) {
        const postIds = loadedPosts.map((post) => post.id);

        const { data: existingLikes } = await supabase
          .from("post_likes")
          .select("post_id")
          .in("post_id", postIds);

        if (existingLikes) {
          const likeMap: Record<string, boolean> = {};

          existingLikes.forEach((like: { post_id: string }) => {
            likeMap[like.post_id] = true;
          });

          setLikedPosts(likeMap);
        }

        const { data: existingComments } = await supabase
          .from("post_comments")
          .select("*")
          .in("post_id", postIds)
          .order("created_at", { ascending: true });

        if (existingComments) {
          const grouped: Record<string, Comment[]> = {};

          (existingComments as Comment[]).forEach((comment) => {
            if (!grouped[comment.post_id]) {
              grouped[comment.post_id] = [];
            }

            grouped[comment.post_id].push(comment);
          });

          setComments(grouped);
        }
      }
    }

    setTimelineLoading(false);
  }

  function goTo(nextView: View) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function createWorkIdentity() {
    setMessage("");

    if (!clean(workForm.name) || !clean(workForm.job_title)) {
      setMessage("Name and job title are required.");
      return;
    }

    const completionFields = [
      workForm.name,
      workForm.job_title,
      workForm.province,
      workForm.town,
      workForm.phone,
      workForm.email,
      workForm.experience,
      workForm.skills,
      workForm.availability,
      workForm.headline,
    ];

    const completed = completionFields.filter((field) =>
      clean(field)
    ).length;

    const profileCompletion = Math.round(
      (completed / completionFields.length) * 100
    );

    const { data, error } = await supabase
      .from("Job seekers")
      .insert({
        name: clean(workForm.name),
        job_title: clean(workForm.job_title),
        province: clean(workForm.province),
        town: clean(workForm.town),
        phone: clean(workForm.phone),
        email: clean(workForm.email),
        experience: clean(workForm.experience),
        skills: clean(workForm.skills),
        availability: clean(workForm.availability),
        headline: clean(workForm.headline),
        profile_completion: profileCompletion,
        profile_visibility: "discoverable",
        verification_status: "unverified",
        cv_status: "not_uploaded",
        timeline_enabled: true,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setCurrentPerson(data as Person);
    }

    setMessage(
      "Work Identity created. Your ability can now become discoverable."
    );

    await loadPeople();
  }

  async function createBusiness() {
    setMessage("");

    if (!clean(businessForm.name)) {
      setMessage("Business name is required.");
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      name: clean(businessForm.name),
      company_name: clean(businessForm.name),
      province: clean(businessForm.province),
      town: clean(businessForm.town),
      description: clean(businessForm.description),
      phone: clean(businessForm.phone),
      email: clean(businessForm.email),
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setBusinessForm({
      name: "",
      province: "",
      town: "",
      description: "",
      phone: "",
      email: "",
    });

    setMessage("Business profile created.");
    await loadBusinesses();
  }

  async function createOpportunity() {
    setMessage("");

    if (!clean(opportunityForm.title)) {
      setMessage("Opportunity title is required.");
      return;
    }

    const { error } = await supabase.from("opportunities").insert({
      title: clean(opportunityForm.title),
      description: clean(opportunityForm.description),
      province: clean(opportunityForm.province),
      town: clean(opportunityForm.town),
      employment_type: clean(opportunityForm.employment_type),
      experience_required: clean(opportunityForm.experience_required),
      skills_required: clean(opportunityForm.skills_required),
      application_email: clean(opportunityForm.application_email),
      closing_date: opportunityForm.closing_date || null,
      business_id: opportunityForm.business_id || null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setOpportunityForm({
      title: "",
      description: "",
      province: "",
      town: "",
      employment_type: "Full-time",
      experience_required: "",
      skills_required: "",
      application_email: "",
      closing_date: "",
      business_id: "",
    });

    setMessage("Opportunity published.");
    await loadOpportunities();
  }

  async function createPost() {
    setMessage("");

    if (!clean(newPost)) {
      setMessage("Write something first.");
      return;
    }

    const authorId = currentPerson?.id || people[0]?.id || null;

    const { error } = await supabase.from("posts").insert({
      author_type: "person",
      author_id: authorId,
      job_seeker_id: authorId,
      post_type: newPostType,
      content: clean(newPost),
      location: clean(newPostLocation),
      visibility: "public",
      status: "published",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewPost("");
    setNewPostLocation("");
    setNewPostType("general");
    setShowPostComposer(false);

    setMessage("Posted to the Work Discovery Timeline.");
    await loadTimeline();
  }

  async function createOpportunityPost(opportunity: Opportunity) {
    const authorId = currentPerson?.id || people[0]?.id || null;

    const location = [opportunity.town, opportunity.province]
      .filter(Boolean)
      .join(", ");

    const { error } = await supabase.from("posts").insert({
      author_type: "person",
      author_id: authorId,
      job_seeker_id: authorId,
      opportunity_id: opportunity.id || null,
      post_type: "opportunity",
      title: opportunity.title,
      content:
        opportunity.description ||
        "A new work opportunity is available.",
      location,
      visibility: "public",
      status: "published",
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Opportunity shared to the Timeline.");
    await loadTimeline();
  }

  async function toggleLike(post: Post) {
    const authorId = currentPerson?.id || people[0]?.id || null;

    const currentlyLiked = !!likedPosts[post.id];

    if (currentlyLiked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("author_type", "person")
        .eq("author_id", authorId);

      if (error) {
        setMessage(error.message);
        return;
      }

      await supabase
        .from("posts")
        .update({
          likes_count: Math.max(0, Number(post.likes_count || 0) - 1),
        })
        .eq("id", post.id);

      setLikedPosts((prev) => ({
        ...prev,
        [post.id]: false,
      }));
    } else {
      const { error } = await supabase.from("post_likes").insert({
        post_id: post.id,
        author_type: "person",
        author_id: authorId,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      await supabase
        .from("posts")
        .update({
          likes_count: Number(post.likes_count || 0) + 1,
        })
        .eq("id", post.id);

      setLikedPosts((prev) => ({
        ...prev,
        [post.id]: true,
      }));
    }

    await loadTimeline();
  }

  async function addComment(post: Post) {
    const content = clean(commentInputs[post.id]);

    if (!content) return;

    const authorId = currentPerson?.id || people[0]?.id || null;

    const { error } = await supabase.from("post_comments").insert({
      post_id: post.id,
      author_type: "person",
      author_id: authorId,
      content,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase
      .from("posts")
      .update({
        comments_count: Number(post.comments_count || 0) + 1,
      })
      .eq("id", post.id);

    setCommentInputs((prev) => ({
      ...prev,
      [post.id]: "",
    }));

    await loadTimeline();
  }

  async function sharePost(post: Post) {
    const authorId = currentPerson?.id || people[0]?.id || null;

    const { error } = await supabase.from("post_shares").insert({
      post_id: post.id,
      author_type: "person",
      author_id: authorId,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase
      .from("posts")
      .update({
        shares_count: Number(post.shares_count || 0) + 1,
      })
      .eq("id", post.id);

    const shareText = post.title
      ? `${post.title}\n${post.content || ""}`
      : post.content || "Check this out on GUARDIAN WORK.";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "GUARDIAN WORK",
          text: shareText,
        });
      } catch {
        // User cancelled native share.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setMessage("Post copied to clipboard.");
    }

    await loadTimeline();
  }

  async function uploadCV(file: File) {
    setMessage("");

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      setMessage("Please upload a PDF, DOC or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Maximum CV size is 10MB.");
      return;
    }

    setUploadingCV(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `uploads/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("cv-documents")
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploadingCV(false);
      return;
    }

    const { data: cv, error: dbError } = await supabase
      .from("cv_documents")
      .insert({
        job_seeker_id: currentPerson?.id || people[0]?.id || null,
        file_name: file.name,
        file_path: path,
        file_type: file.type,
        file_size: file.size,
        status: "uploaded",
        ats_score: null,
      })
      .select()
      .single();

    if (dbError) {
      setMessage(dbError.message);
      setUploadingCV(false);
      return;
    }

    if (cv) {
      const preliminary = Math.min(
        95,
        Math.max(
          45,
          Math.round(
            55 +
              (file.type === "application/pdf" ? 15 : 8) +
              Math.min(20, Math.round(file.size / 250000))
          )
        )
      );

      await supabase.from("cv_analysis").insert({
        cv_id: cv.id,
        overall_score: preliminary,
        structure_score: preliminary,
        experience_score: null,
        skills_score: null,
        contact_score: null,
        keywords_score: null,
        readability_score: null,
        strengths:
          "CV successfully uploaded and securely stored. Content analysis is the next intelligence layer.",
        weaknesses:
          "Detailed content-level analysis has not yet been completed.",
        recommendations:
          "Complete your Work Identity and connect your skills and experience.",
        analysis_status: "awaiting_content_analysis",
      });

      await supabase
        .from("Job seekers")
        .update({
          cv_status: "uploaded",
          ats_score: preliminary,
        })
        .eq("id", currentPerson?.id || people[0]?.id || "");

      setMessage(
        "CV uploaded successfully. Preliminary readiness created."
      );
    }

    setUploadingCV(false);
    await loadCVs();
    await loadPeople();
  }

  const filteredPeople = useMemo(() => {
    const search = searchPeople.toLowerCase();

    return people.filter((person) => {
      const haystack = [
        person.name,
        person.job_title,
        person.town,
        person.province,
        person.skills,
        person.experience,
        person.headline,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || haystack.includes(search);

      const matchesProvince =
        !provinceFilter || person.province === provinceFilter;

      const matchesTown =
        !townFilter ||
        clean(person.town)
          .toLowerCase()
          .includes(townFilter.toLowerCase());

      const matchesSkill =
        !skillFilter ||
        clean(person.skills)
          .toLowerCase()
          .includes(skillFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesProvince &&
        matchesTown &&
        matchesSkill
      );
    });
  }, [
    people,
    searchPeople,
    provinceFilter,
    townFilter,
    skillFilter,
  ]);

  const filteredJobs = useMemo(() => {
    const search = searchJobs.toLowerCase();

    return opportunities.filter((job) => {
      const haystack = [
        job.title,
        job.description,
        job.town,
        job.province,
        job.skills_required,
        job.employment_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!search || haystack.includes(search)) &&
        (!jobProvinceFilter || job.province === jobProvinceFilter)
      );
    });
  }, [opportunities, searchJobs, jobProvinceFilter]);

  const latestAnalysis = selectedCV
    ? cvAnalyses.find((analysis) => analysis.cv_id === selectedCV.id)
    : null;

  const latestScore = latestAnalysis?.overall_score ?? selectedCV?.ats_score ?? 0;

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "work", label: "My Work", icon: "◉" },
    { id: "timeline", label: "Timeline", icon: "✦" },
    { id: "talent", label: "Talent", icon: "◎" },
    { id: "jobs", label: "Jobs", icon: "▣" },
    { id: "business", label: "Business", icon: "▤" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
        <div className="text-center px-6">
          <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <h1 className="text-xl font-bold">GUARDIAN WORK</h1>
          <p className="text-white/50 mt-2 text-sm">
            Building your work discovery network...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#07111f]/95 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => goTo("home")}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                🛡️
              </div>

              <div className="text-left">
                <div className="font-black tracking-tight">
                  GUARDIAN <span className="text-sky-300">WORK</span>
                </div>
                <div className="text-[10px] text-white/40 tracking-[0.2em] uppercase">
                  Make ability discoverable
                </div>
              </div>
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`px-3 py-2 rounded-xl text-sm transition ${
                    view === item.id
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo("settings")}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
            >
              ⚙
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGE */}
      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] max-w-[92vw]">
          <div className="rounded-2xl bg-[#07111f] text-white px-5 py-3 shadow-2xl border border-white/10 text-sm">
            {message}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        {/* HOME */}
        {view === "home" && (
          <div className="space-y-8">
            <section className="rounded-[2rem] bg-[#07111f] text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,.18),transparent_35%),radial-gradient(circle_at_20%_90%,rgba(168,85,247,.14),transparent_35%)]" />

              <div className="relative px-6 sm:px-10 py-12 sm:py-16 max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-sky-200 mb-6">
                  <span>●</span>
                  V5.4 — Work Discovery Timeline
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
                  Make your
                  <span className="block text-sky-300">
                    ability discoverable.
                  </span>
                </h1>

                <p className="mt-6 text-white/65 text-base sm:text-lg max-w-2xl leading-7">
                  GUARDIAN WORK connects businesses to kasi people by
                  turning skills, experience and real work activity into
                  discoverable opportunities.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => goTo("work")}
                    className="px-5 py-3 rounded-xl bg-white text-[#07111f] font-bold hover:scale-[1.02] transition"
                  >
                    Build My Work Identity
                  </button>

                  <button
                    onClick={() => goTo("timeline")}
                    className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 font-semibold hover:bg-white/15 transition"
                  >
                    Explore Timeline
                  </button>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-4">
              <MetricCard
                number={people.length}
                label="Discoverable people"
                icon="◎"
              />
              <MetricCard
                number={opportunities.length}
                label="Opportunities"
                icon="▣"
              />
              <MetricCard
                number={posts.length}
                label="Work conversations"
                icon="✦"
              />
            </section>

            <section className="grid lg:grid-cols-3 gap-5">
              <FeatureCard
                icon="◎"
                title="Work Identity"
                text="Show businesses what you can actually do."
                onClick={() => goTo("work")}
              />

              <FeatureCard
                icon="✦"
                title="Work Discovery Timeline"
                text="Turn your work story into discoverable signals."
                onClick={() => goTo("timeline")}
              />

              <FeatureCard
                icon="▣"
                title="Opportunities"
                text="Discover work that matches your ability."
                onClick={() => goTo("jobs")}
              />
            </section>
          </div>
        )}

        {/* WORK */}
        {view === "work" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="WORK IDENTITY"
              title="Show the world what you can do."
              text="Your Work Identity is more than a CV. It is your discoverability layer."
            />

            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-6">
              <Card>
                <SectionTitle
                  title="Create Work Identity"
                  subtitle="Complete the fields that help businesses understand your ability."
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full name"
                    value={workForm.name}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, name: value })
                    }
                  />

                  <Input
                    label="What do you do?"
                    placeholder="e.g. IT Technician"
                    value={workForm.job_title}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, job_title: value })
                    }
                  />

                  <Select
                    label="Province"
                    value={workForm.province}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, province: value })
                    }
                    options={provinces}
                  />

                  <Input
                    label="Town / Area"
                    value={workForm.town}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, town: value })
                    }
                  />

                  <Input
                    label="Phone"
                    value={workForm.phone}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, phone: value })
                    }
                  />

                  <Input
                    label="Email"
                    value={workForm.email}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, email: value })
                    }
                  />

                  <Input
                    label="Experience"
                    placeholder="e.g. 3 years retail"
                    value={workForm.experience}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, experience: value })
                    }
                  />

                  <Input
                    label="Skills"
                    placeholder="Separate skills with commas"
                    value={workForm.skills}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, skills: value })
                    }
                  />

                  <Select
                    label="Availability"
                    value={workForm.availability}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, availability: value })
                    }
                    options={[
                      "Available for work",
                      "Available immediately",
                      "Open to opportunities",
                      "Currently working",
                      "Looking for part-time work",
                    ]}
                  />

                  <Input
                    label="Headline"
                    placeholder="A short statement about your ability"
                    value={workForm.headline}
                    onChange={(value) =>
                      setWorkForm({ ...workForm, headline: value })
                    }
                  />
                </div>

                <button
                  onClick={createWorkIdentity}
                  className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#07111f] text-white font-bold"
                >
                  Create Work Identity
                </button>
              </Card>

              <div className="space-y-5">
                <Card>
                  <SectionTitle
                    title="Your current identity"
                    subtitle="What businesses can discover."
                  />

                  {currentPerson ? (
                    <div>
                      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                        ◎
                      </div>

                      <h3 className="mt-4 text-xl font-black">
                        {currentPerson.name}
                      </h3>

                      <p className="text-sky-700 font-semibold mt-1">
                        {currentPerson.job_title}
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        {[currentPerson.town, currentPerson.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      {currentPerson.headline && (
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {currentPerson.headline}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {normalizeSkills(currentPerson.skills).map(
                          (skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      title="No Work Identity yet"
                      text="Create one to begin building discoverability."
                    />
                  )}
                </Card>

                <Card>
                  <SectionTitle
                    title="CV Intelligence"
                    subtitle="Upload your CV to begin building readiness signals."
                  />

                  <label className="block rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center cursor-pointer hover:border-sky-300 hover:bg-sky-50/40 transition">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadCV(file);
                      }}
                    />

                    <div className="text-3xl">📄</div>
                    <div className="font-bold mt-2">
                      {uploadingCV
                        ? "Uploading CV..."
                        : "Upload your CV"}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      PDF, DOC or DOCX • Max 10MB
                    </div>
                  </label>

                  {selectedCV && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm">
                            {selectedCV.file_name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Uploaded {formatDate(selectedCV.created_at)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-black">
                            {latestScore || "—"}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400">
                            readiness
                          </div>
                        </div>
                      </div>

                      {latestAnalysis && (
                        <div className="mt-4 space-y-3">
                          <ScoreRow
                            label="Structure"
                            score={latestAnalysis.structure_score}
                          />
                          <ScoreRow
                            label="Experience"
                            score={latestAnalysis.experience_score}
                          />
                          <ScoreRow
                            label="Skills"
                            score={latestAnalysis.skills_score}
                          />
                          <ScoreRow
                            label="Contact"
                            score={latestAnalysis.contact_score}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {view === "timeline" && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="space-y-5">
              <PageHeading
                eyebrow="WORK DISCOVERY"
                title="The Timeline."
                text="A feed built around work, ability, opportunity and local discovery."
              />

              <Card>
                <div className="flex gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
                    ◎
                  </div>

                  <button
                    onClick={() => setShowPostComposer(true)}
                    className="flex-1 text-left rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-400 hover:bg-slate-100"
                  >
                    Share something about your work...
                  </button>
                </div>
              </Card>

              {showPostComposer && (
                <Card>
                  <div className="flex items-center justify-between">
                    <SectionTitle
                      title="Create a work post"
                      subtitle="Give people a reason to discover what you can do."
                    />

                    <button
                      onClick={() => setShowPostComposer(false)}
                      className="text-slate-400 hover:text-slate-900"
                    >
                      ✕
                    </button>
                  </div>

                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Tell the work community what you're doing, what you can do, or what opportunity you're looking for..."
                    className="w-full min-h-32 rounded-2xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-sky-200 resize-none"
                  />

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <Select
                      label="Post type"
                      value={newPostType}
                      onChange={setNewPostType}
                      options={[
                        "general",
                        "availability",
                        "work_showcase",
                        "experience",
                        "opportunity",
                      ]}
                    />

                    <Input
                      label="Location"
                      placeholder="e.g. Secunda, Mpumalanga"
                      value={newPostLocation}
                      onChange={setNewPostLocation}
                    />
                  </div>

                  <button
                    onClick={createPost}
                    className="mt-5 px-6 py-3 rounded-xl bg-[#07111f] text-white font-bold"
                  >
                    Publish to Timeline
                  </button>
                </Card>
              )}

              {timelineLoading ? (
                <Card>
                  <div className="text-sm text-slate-500">
                    Loading the work community...
                  </div>
                </Card>
              ) : posts.length === 0 ? (
                <Card>
                  <EmptyState
                    title="The Timeline is ready."
                    text="Be one of the first people to make their ability discoverable."
                  />

                  <button
                    onClick={() => setShowPostComposer(true)}
                    className="mt-5 px-5 py-3 rounded-xl bg-[#07111f] text-white font-bold"
                  >
                    Create the first post
                  </button>
                </Card>
              ) : (
                posts.map((post) => (
                  <TimelinePost
                    key={post.id}
                    post={post}
                    people={people}
                    businesses={businesses}
                    opportunities={opportunities}
                    comments={comments[post.id] || []}
                    liked={!!likedPosts[post.id]}
                    commentValue={commentInputs[post.id] || ""}
                    setCommentValue={(value) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: value,
                      }))
                    }
                    onLike={() => toggleLike(post)}
                    onComment={() => addComment(post)}
                    onShare={() => sharePost(post)}
                    onApply={() => {
                      const opportunity = opportunities.find(
                        (item) => item.id === post.opportunity_id
                      );

                      if (opportunity?.application_email) {
                        window.location.href = `mailto:${opportunity.application_email}?subject=${encodeURIComponent(
                          opportunity.title || "Job Application"
                        )}`;
                      } else {
                        goTo("jobs");
                      }
                    }}
                  />
                ))
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <Card>
                <SectionTitle
                  title="Your discoverability"
                  subtitle="Build signals that help businesses find you."
                />

                <div className="mt-5">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-slate-500">
                      Profile completion
                    </span>
                    <strong>
                      {currentPerson?.profile_completion || 0}%
                    </strong>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-sky-500"
                      style={{
                        width: `${currentPerson?.profile_completion || 0}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => goTo("work")}
                  className="mt-5 w-full px-4 py-3 rounded-xl bg-[#07111f] text-white font-bold text-sm"
                >
                  Improve Work Identity
                </button>
              </Card>

              <Card>
                <SectionTitle
                  title="Live opportunities"
                  subtitle="Work appearing across the network."
                />

                <div className="mt-4 space-y-3">
                  {opportunities.slice(0, 4).map((job) => (
                    <button
                      key={job.id}
                      onClick={() => goTo("jobs")}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div className="font-bold text-sm">
                        {job.title}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        {[job.town, job.province]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </button>
                  ))}

                  {opportunities.length === 0 && (
                    <div className="text-sm text-slate-400">
                      No opportunities yet.
                    </div>
                  )}
                </div>
              </Card>
            </aside>
          </div>
        )}

        {/* TALENT */}
        {view === "talent" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="TALENT DISCOVERY"
              title="Find ability. Not just CVs."
              text="Search people by work identity, skills and location."
            />

            <Card>
              <div className="grid md:grid-cols-4 gap-3">
                <Input
                  label="Search"
                  placeholder="Name, role, skill..."
                  value={searchPeople}
                  onChange={setSearchPeople}
                />

                <Select
                  label="Province"
                  value={provinceFilter}
                  onChange={setProvinceFilter}
                  options={provinces}
                />

                <Input
                  label="Town"
                  placeholder="e.g. Secunda"
                  value={townFilter}
                  onChange={setTownFilter}
                />

                <Input
                  label="Skill"
                  placeholder="e.g. IT"
                  value={skillFilter}
                  onChange={setSkillFilter}
                />
              </div>
            </Card>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPeople.map((person, index) => (
                <Card key={person.id || index}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                      ◎
                    </div>

                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 font-bold">
                      Discoverable
                    </span>
                  </div>

                  <h3 className="mt-5 font-black text-lg">
                    {person.name}
                  </h3>

                  <p className="text-sky-700 font-semibold text-sm mt-1">
                    {person.job_title || "Work Identity"}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    {[person.town, person.province]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {person.headline && (
                    <p className="text-sm text-slate-600 mt-4 leading-6">
                      {person.headline}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {normalizeSkills(person.skills)
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  <div className="flex gap-2 mt-5">
                    {person.phone && (
                      <a
                        href={`https://wa.me/${person.phone.replace(
                          /\D/g,
                          ""
                        )}`}
                        className="flex-1 text-center px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold"
                      >
                        WhatsApp
                      </a>
                    )}

                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="flex-1 text-center px-3 py-2.5 rounded-xl bg-[#07111f] text-white text-sm font-bold"
                      >
                        Email
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {filteredPeople.length === 0 && (
              <Card>
                <EmptyState
                  title="No matching people"
                  text="Try a different location, skill or search."
                />
              </Card>
            )}
          </div>
        )}

        {/* JOBS */}
        {view === "jobs" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="OPPORTUNITIES"
              title="Find your next opening."
              text="Opportunities are connected to real businesses and local work."
            />

            <Card>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Search opportunities"
                  placeholder="Role, skill, town..."
                  value={searchJobs}
                  onChange={setSearchJobs}
                />

                <Select
                  label="Province"
                  value={jobProvinceFilter}
                  onChange={setJobProvinceFilter}
                  options={provinces}
                />
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-sky-700 font-black">
                        Opportunity
                      </span>

                      <h3 className="text-xl font-black mt-1">
                        {job.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {[job.town, job.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold">
                      {job.employment_type || "Work"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-6 mt-5">
                    {job.description}
                  </p>

                  {job.skills_required && (
                    <div className="mt-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Skills
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {normalizeSkills(job.skills_required).map(
                          (skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-full bg-slate-100 text-xs"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-6">
                    {job.application_email && (
                      <a
                        href={`mailto:${job.application_email}?subject=${encodeURIComponent(
                          job.title || "Job Application"
                        )}`}
                        className="px-5 py-3 rounded-xl bg-[#07111f] text-white font-bold text-sm"
                      >
                        Apply
                      </a>
                    )}

                    <button
                      onClick={() => createOpportunityPost(job)}
                      className="px-5 py-3 rounded-xl bg-slate-100 font-bold text-sm"
                    >
                      Share to Timeline
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card>
                <EmptyState
                  title="No opportunities found"
                  text="Businesses can publish opportunities here as the network grows."
                />
              </Card>
            )}
          </div>
        )}

        {/* BUSINESS */}
        {view === "business" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="BUSINESS"
              title="Find people who can actually help."
              text="Build your business presence and publish local opportunities."
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <SectionTitle
                  title="Business profile"
                  subtitle="Create a discoverable business identity."
                />

                <div className="space-y-4">
                  <Input
                    label="Business name"
                    value={businessForm.name}
                    onChange={(value) =>
                      setBusinessForm({
                        ...businessForm,
                        name: value,
                      })
                    }
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Select
                      label="Province"
                      value={businessForm.province}
                      onChange={(value) =>
                        setBusinessForm({
                          ...businessForm,
                          province: value,
                        })
                      }
                      options={provinces}
                    />

                    <Input
                      label="Town"
                      value={businessForm.town}
                      onChange={(value) =>
                        setBusinessForm({
                          ...businessForm,
                          town: value,
                        })
                      }
                    />
                  </div>

                  <Textarea
                    label="Description"
                    value={businessForm.description}
                    onChange={(value) =>
                      setBusinessForm({
                        ...businessForm,
                        description: value,
                      })
                    }
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      label="Phone"
                      value={businessForm.phone}
                      onChange={(value) =>
                        setBusinessForm({
                          ...businessForm,
                          phone: value,
                        })
                      }
                    />

                    <Input
                      label="Email"
                      value={businessForm.email}
                      onChange={(value) =>
                        setBusinessForm({
                          ...businessForm,
                          email: value,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={createBusiness}
                    className="px-6 py-3 rounded-xl bg-[#07111f] text-white font-bold"
                  >
                    Create Business
                  </button>
                </div>
              </Card>

              <Card>
                <SectionTitle
                  title="Publish an opportunity"
                  subtitle="Put real work into the discovery network."
                />

                <div className="space-y-4">
                  <Input
                    label="Opportunity title"
                    value={opportunityForm.title}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        title: value,
                      })
                    }
                  />

                  <Textarea
                    label="Description"
                    value={opportunityForm.description}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        description: value,
                      })
                    }
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Select
                      label="Province"
                      value={opportunityForm.province}
                      onChange={(value) =>
                        setOpportunityForm({
                          ...opportunityForm,
                          province: value,
                        })
                      }
                      options={provinces}
                    />

                    <Input
                      label="Town"
                      value={opportunityForm.town}
                      onChange={(value) =>
                        setOpportunityForm({
                          ...opportunityForm,
                          town: value,
                        })
                      }
                    />
                  </div>

                  <Select
                    label="Employment type"
                    value={opportunityForm.employment_type}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        employment_type: value,
                      })
                    }
                    options={employmentTypes}
                  />

                  <Input
                    label="Experience required"
                    value={opportunityForm.experience_required}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        experience_required: value,
                      })
                    }
                  />

                  <Input
                    label="Skills required"
                    placeholder="Separate skills with commas"
                    value={opportunityForm.skills_required}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        skills_required: value,
                      })
                    }
                  />

                  <Input
                    label="Application email"
                    value={opportunityForm.application_email}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        application_email: value,
                      })
                    }
                  />

                  <Input
                    label="Closing date"
                    type="date"
                    value={opportunityForm.closing_date}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        closing_date: value,
                      })
                    }
                  />

                  <Select
                    label="Business"
                    value={opportunityForm.business_id}
                    onChange={(value) =>
                      setOpportunityForm({
                        ...opportunityForm,
                        business_id: value,
                      })
                    }
                    options={businesses.map(
                      (business) =>
                        business.id || business.name || "Business"
                    )}
                  />

                  <button
                    onClick={createOpportunity}
                    className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold"
                  >
                    Publish Opportunity
                  </button>
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle
                title="Businesses on GUARDIAN WORK"
                subtitle={`${businesses.length} business profile(s) currently available.`}
              />

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
                {businesses.map((business, index) => (
                  <div
                    key={business.id || index}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center">
                      ▤
                    </div>

                    <h3 className="font-black mt-4">
                      {business.name ||
                        business.company_name ||
                        "Business"}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {[business.town, business.province]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <p className="text-sm text-slate-600 mt-3 leading-6">
                      {business.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* OPERATIONS */}
        {view === "operations" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="OPERATIONS"
              title="GUARDIAN WORK intelligence."
              text="Real database signals from the platform."
            />

            <div className="grid md:grid-cols-4 gap-4">
              <MetricCard
                number={people.length}
                label="People"
                icon="◎"
              />

              <MetricCard
                number={businesses.length}
                label="Businesses"
                icon="▤"
              />

              <MetricCard
                number={opportunities.length}
                label="Opportunities"
                icon="▣"
              />

              <MetricCard
                number={cvDocuments.length}
                label="CVs uploaded"
                icon="📄"
              />
            </div>

            <Card>
              <SectionTitle
                title="Platform direction"
                subtitle="The next layers should increase real-world discoverability."
              />

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
                <Roadmap
                  number="V5.4"
                  title="Work Discovery Timeline"
                  status="LIVE"
                />
                <Roadmap
                  number="V5.5"
                  title="Real Applications"
                  status="NEXT"
                />
                <Roadmap
                  number="V5.6"
                  title="Smart Matching"
                  status="PLANNED"
                />
                <Roadmap
                  number="V5.7"
                  title="Platform Intelligence"
                  status="PLANNED"
                />
                <Roadmap
                  number="V5.8"
                  title="Personalisation"
                  status="PLANNED"
                />
              </div>
            </Card>
          </div>
        )}

        {/* SETTINGS */}
        {view === "settings" && (
          <div className="space-y-6">
            <PageHeading
              eyebrow="SETTINGS"
              title="Your GUARDIAN WORK."
              text="Privacy, visibility and experience controls."
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Card>
                <SectionTitle
                  title="Profile visibility"
                  subtitle="Control how discoverable your Work Identity is."
                />

                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <div className="font-bold text-emerald-800">
                    Discoverable
                  </div>
                  <div className="text-sm text-emerald-700 mt-1">
                    Your profile can appear in talent discovery.
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle
                  title="Privacy & security"
                  subtitle="Sensitive CV and contact information should be protected as the platform scales."
                />

                <div className="space-y-3 mt-5 text-sm text-slate-600">
                  <div>🔒 Private CV storage</div>
                  <div>🛡️ Role-based access planned</div>
                  <div>👁️ Visibility controls planned</div>
                  <div>📋 POPIA-aligned privacy controls</div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#07111f]/97 backdrop-blur-xl border-t border-white/10 text-white">
        <div className="grid grid-cols-6 max-w-xl mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`py-3 text-[10px] ${
                view === item.id
                  ? "text-sky-300"
                  : "text-white/45"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <div className="mt-0.5">{item.label}</div>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm p-5 sm:p-6">
      {children}
    </section>
  );
}

function PageHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="text-xs font-black tracking-[0.2em] text-sky-700">
        {eyebrow}
      </div>

      <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
        {title}
      </h2>

      <p className="text-slate-500 mt-3 max-w-2xl leading-6">
        {text}
      </p>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h3 className="font-black text-lg">{title}</h3>

      {subtitle && (
        <p className="text-sm text-slate-500 mt-1 leading-5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-500 mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-500 mb-2">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-28 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 resize-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-500 mb-2">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
      >
        <option value="">Select...</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricCard({
  number,
  label,
  icon,
}: {
  number: number;
  label: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
        {icon}
      </div>

      <div className="text-3xl font-black mt-5">
        {number}
      </div>

      <div className="text-sm text-slate-500 mt-1">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
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
      className="text-left bg-white rounded-2xl border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition"
    >
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
        {icon}
      </div>

      <h3 className="font-black text-lg mt-5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-6 mt-2">
        {text}
      </p>

      <div className="mt-5 text-sm font-bold text-sky-700">
        Explore →
      </div>
    </button>
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
    <div className="text-center py-8">
      <div className="text-3xl">✦</div>
      <h3 className="font-black mt-3">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-6">
        {text}
      </p>
    </div>
  );
}

function ScoreRow({
  label,
  score,
}: {
  label: string;
  score?: number | null;
}) {
  const value = Number(score || 0);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-500">
          {label}
        </span>
        <span className="font-bold">{value || "—"}</span>
      </div>

      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-500"
          style={{ width: scoreBar(value) }}
        />
      </div>
    </div>
  );
}

function Roadmap({
  number,
  title,
  status,
}: {
  number: string;
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-sky-700">
          {number}
        </span>

        <span className="text-[10px] font-black tracking-wider rounded-full bg-white border border-slate-200 px-2 py-1">
          {status}
        </span>
      </div>

      <div className="font-black mt-5">{title}</div>
    </div>
  );
}

function TimelinePost({
  post,
  people,
  businesses,
  opportunities,
  comments,
  liked,
  commentValue,
  setCommentValue,
  onLike,
  onComment,
  onShare,
  onApply,
}: {
  post: Post;
  people: Person[];
  businesses: Business[];
  opportunities: Opportunity[];
  comments: Comment[];
  liked: boolean;
  commentValue: string;
  setCommentValue: (value: string) => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onApply: () => void;
}) {
  const author =
    people.find((person) => person.id === post.author_id) ||
    people.find((person) => person.id === post.job_seeker_id);

  const business = businesses.find(
    (item) => item.id === post.business_id
  );

  const opportunity = opportunities.find(
    (item) => item.id === post.opportunity_id
  );

  const authorName =
    author?.name ||
    business?.name ||
    business?.company_name ||
    (post.author_type === "admin"
      ? "GUARDIAN WORK"
      : "Work Community Member");

  const authorRole =
    author?.job_title ||
    (business ? "Business" : post.author_type === "admin" ? "Platform" : "Work Identity");

  const typeLabel =
    post.post_type === "availability"
      ? "AVAILABLE FOR WORK"
      : post.post_type === "work_showcase"
      ? "WORK SHOWCASE"
      : post.post_type === "experience"
      ? "WORK EXPERIENCE"
      : post.post_type === "opportunity"
      ? "OPPORTUNITY"
      : "WORK UPDATE";

  return (
    <article className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
            {business ? "▤" : "◎"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-sm">
                  {authorName}
                </div>

                <div className="text-xs text-slate-500 mt-0.5">
                  {authorRole}
                  {post.location ? ` • ${post.location}` : ""}
                  {post.created_at ? ` • ${timeAgo(post.created_at)}` : ""}
                </div>
              </div>

              <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] font-black text-sky-700 bg-sky-50 rounded-full px-2 py-1">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        {post.title && (
          <h3 className="text-xl font-black mt-5">
            {post.title}
          </h3>
        )}

        {post.content && (
          <p className="text-sm sm:text-base text-slate-700 leading-7 mt-4 whitespace-pre-wrap">
            {post.content}
          </p>
        )}

        {author?.skills && (
          <div className="flex flex-wrap gap-2 mt-4">
            {normalizeSkills(author.skills)
              .slice(0, 5)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
          </div>
        )}

        {opportunity && (
          <div className="mt-5 rounded-2xl bg-[#07111f] text-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-sky-300 font-black">
              Opportunity
            </div>

            <div className="text-lg font-black mt-1">
              {opportunity.title}
            </div>

            <div className="text-xs text-white/50 mt-1">
              {[opportunity.town, opportunity.province]
                .filter(Boolean)
                .join(", ")}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {opportunity.employment_type && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  {opportunity.employment_type}
                </span>
              )}

              {opportunity.experience_required && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  {opportunity.experience_required}
                </span>
              )}
            </div>

            <button
              onClick={onApply}
              className="mt-5 px-4 py-2.5 rounded-xl bg-white text-[#07111f] text-sm font-black"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 mt-5 pt-4 text-xs text-slate-500">
          <span>
            {post.likes_count || 0} likes
          </span>

          <span>
            {post.comments_count || 0} comments •{" "}
            {post.shares_count || 0} shares
          </span>
        </div>

        <div className="grid grid-cols-3 border-t border-slate-100 mt-3 pt-2">
          <button
            onClick={onLike}
            className={`py-2.5 rounded-xl text-sm font-bold ${
              liked
                ? "text-sky-700 bg-sky-50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {liked ? "♥ Liked" : "♡ Like"}
          </button>

          <button
            onClick={() => {
              const element = document.getElementById(
                `comment-${post.id}`
              );

              element?.focus();
            }}
            className="py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            💬 Comment
          </button>

          <button
            onClick={onShare}
            className="py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50"
          >
            ↗ Share
          </button>
        </div>

        {comments.length > 0 && (
          <div className="mt-4 space-y-3">
            {comments.map((comment) => {
              const commenter = people.find(
                (person) => person.id === comment.author_id
              );

              return (
                <div
                  key={comment.id}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <div className="font-bold text-xs">
                    {commenter?.name || "Work Community Member"}
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    {comment.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <input
            id={`comment-${post.id}`}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onComment();
              }
            }}
            placeholder="Add a work-related comment..."
            className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          />

          <button
            onClick={onComment}
            className="px-4 rounded-xl bg-[#07111f] text-white text-sm font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </article>
  );
}
