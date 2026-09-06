 "use client";

import { Fragment, useEffect, useMemo, useState, useRef } from "react";
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

type NotificationPreference = {
  id: string;
  job_seeker_id: string;
  portal_enabled: boolean;
  whatsapp_enabled: boolean;
  whatsapp_opt_in: boolean;
  whatsapp_subscription_status: "inactive" | "pending" | "active" | "expired";
  whatsapp_subscription_expires_at: string | null;
};

type GuardianNotification = {
  id: string;
  job_seeker_id: string | null;
  notification_type: string;
  title: string;
  message: string;
  opportunity_id: string | null;
  application_id: string | null;
  channel: "portal" | "whatsapp" | "both" | "system";
  read_at: string | null;
  created_at: string;
};

type SmartMatch = {
  opportunity: Opportunity;
  score: number;
  reasons: string[];
  skillScore: number;
  locationScore: number;
  identityScore: number;
  experienceScore: number;
  availabilityScore: number;
};

type MatchFeedback = {
  id: string;
  job_seeker_id: string;
  opportunity_id: string;
  action: "interested" | "not_for_me" | "applied";
  created_at: string;
};

type SavedOpportunity = {
  id: string;
  job_seeker_id: string;
  opportunity_id: string;
  created_at: string;
};

type BusinessShortlist = {
  id: string;
  business_id: string;
  job_seeker_id: string;
  note: string | null;
  status: "saved" | "contacted" | "reviewed";
  created_at: string;
};

type SponsoredAd = {
  id: string;
  business_id: string | null;
  title: string;
  body: string | null;
  image_url: string | null;
  cta_label: string;
  cta_url: string;
  target_province: string | null;
  target_town: string | null;
  target_skills: string | null;
  status: "draft" | "active" | "paused" | "expired";
  starts_at: string | null;
  ends_at: string | null;
  daily_frequency_cap: number;
  created_at: string;
};

type AdImpression = {
  id: string;
  ad_id: string;
  job_seeker_id: string | null;
  event_type: "impression" | "click";
  created_at: string;
};

type AuthAccount = {
  id: string;
  user_id: string;
  role: "job_seeker" | "business" | "admin";
  job_seeker_id: string | null;
  business_id: string | null;
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
  ["matches", "Matches"],
  ["saved", "Saved"],
  ["applications", "Applications"],
  ["alerts", "Alerts"],
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
  if (!value) return "-";
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
  const [authUser, setAuthUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authRole, setAuthRole] = useState<"job_seeker" | "business">("job_seeker");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [cvs, setCVs] = useState<CVDocument[]>([]);
  const [analyses, setAnalyses] = useState<CVAnalysis[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<GuardianNotification[]>([]);
  const [notificationPreference, setNotificationPreference] = useState<NotificationPreference | null>(null);
  const [matchRefreshing, setMatchRefreshing] = useState(false);
  const [matchDismissed, setMatchDismissed] = useState<string[]>([]);
  const [sponsoredAds, setSponsoredAds] = useState<SponsoredAd[]>([]);
  const [adImpressions, setAdImpressions] = useState<AdImpression[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [businessShortlists, setBusinessShortlists] = useState<BusinessShortlist[]>([]);
  const [matchFeedback, setMatchFeedback] = useState<MatchFeedback[]>([]);
  const [matchCenterOpportunity, setMatchCenterOpportunity] = useState("");
  const [liveUsers, setLiveUsers] = useState(0);
  const presenceChannelRef = useRef<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [businessTalentSearch, setBusinessTalentSearch] = useState("");
  const [businessTalentProvince, setBusinessTalentProvince] = useState("");
  const [businessTalentTown, setBusinessTalentTown] = useState("");
  const [businessTalentSkills, setBusinessTalentSkills] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [adForm, setAdForm] = useState({ title: "", body: "", cta_label: "Learn more", cta_url: "", target_province: "", target_town: "", target_skills: "", daily_frequency_cap: 2 });

  const [onboardingTown, setOnboardingTown] = useState("");
  const [onboardingProvince, setOnboardingProvince] = useState("");
  const [onboardingJobTitle, setOnboardingJobTitle] = useState("");
  const [onboardingPhone, setOnboardingPhone] = useState("");
  const [onboardingDescription, setOnboardingDescription] = useState("");
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

  const signIn = async () => {
    setAuthBusy(true);
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
    setAuthBusy(false);
    if (error) return setAuthMessage(error.message);
    setAuthMessage("Signed in successfully.");
  };

  const signUp = async () => {
    if (!authEmail.trim() || !authPassword || !authName.trim()) {
      return setAuthMessage("Name, email and password are required.");
    }
    if (authPassword.length < 6) return setAuthMessage("Password must be at least 6 characters.");
    setAuthBusy(true);
    setAuthMessage("");
    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
      options: { data: { role: authRole, display_name: authName.trim() } },
    });
    if (error) {
      setAuthBusy(false);
      return setAuthMessage(error.message);
    }
    setAuthBusy(false);
    if (!data.session) {
      setAuthMessage("Account created. Check your email to confirm your account, then sign in.");
    } else {
      setAuthMessage("Account created. Complete your GUARDIAN WORK profile.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccount(null);
    setCurrentPerson(null);
    setCurrentBusiness(null);
    setActive("home");
  };

  const completeOnboarding = async () => {
    if (!authUser) return;
    if (!authName.trim()) return setAuthMessage("Enter your name or business name.");
    if (!onboardingProvince || !onboardingTown.trim()) return setAuthMessage("Province and town/area are required.");
    setAuthBusy(true);

    if (authRole === "job_seeker") {
      const { data: person, error } = await supabase.from("Job seekers").insert({
        auth_user_id: authUser.id,
        name: authName.trim(),
        email: authUser.email || authEmail.trim(),
        job_title: onboardingJobTitle.trim() || "Work seeker",
        province: onboardingProvince,
        town: onboardingTown.trim(),
        phone: onboardingPhone.trim() || null,
        profile_visibility: "discoverable",
        availability: "Available",
        profile_completion: 35,
      }).select().single();
      if (error) { setAuthBusy(false); return setAuthMessage(error.message); }
      const { data: acct, error: acctError } = await supabase.from("guardian_accounts").insert({
        user_id: authUser.id, role: "job_seeker", job_seeker_id: person.id, business_id: null
      }).select().single();
      if (acctError) { setAuthBusy(false); return setAuthMessage(acctError.message); }
      setCurrentPerson(person as Person);
      setAccount(acct as AuthAccount);
    } else {
      const { data: business, error } = await supabase.from("businesses").insert({
        auth_user_id: authUser.id,
        name: authName.trim(),
        business_name: authName.trim(),
        email: authUser.email || authEmail.trim(),
        province: onboardingProvince,
        town: onboardingTown.trim(),
        description: onboardingDescription.trim() || null,
      }).select().single();
      if (error) { setAuthBusy(false); return setAuthMessage(error.message); }
      const { data: acct, error: acctError } = await supabase.from("guardian_accounts").insert({
        user_id: authUser.id, role: "business", job_seeker_id: null, business_id: business.id
      }).select().single();
      if (acctError) { setAuthBusy(false); return setAuthMessage(acctError.message); }
      setCurrentBusiness(business as Business);
      setBusinesses(old => [business as Business, ...old]);
      setAccount(acct as AuthAccount);
    }

    setAuthBusy(false);
    setAuthMessage("");
    setActive("home");
    await loadAll();
  };

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
      notificationsRes,
      preferenceRes,
      adsRes,
      impressionsRes,
      savedRes,
      shortlistRes,
      feedbackRes,
    ] = await Promise.all([
      supabase.from("Job seekers").select("*").order("name"),
      supabase.from("businesses").select("*").order("created_at", { ascending: false }),
      supabase.from("opportunities").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_analysis").select("*").order("created_at", { ascending: false }),
      supabase.from("posts").select("*").eq("status", "published").order("created_at", { ascending: false }),
      supabase.from("applications").select("*").order("applied_at", { ascending: false }),
      currentPerson
        ? supabase.from("guardian_notifications").select("*").eq("job_seeker_id", currentPerson.id).order("created_at", { ascending: false }).limit(30)
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("notification_preferences").select("*").eq("job_seeker_id", currentPerson.id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase.from("sponsored_ads").select("*").eq("status", "active").order("created_at", { ascending: false }),
      currentPerson
        ? supabase.from("ad_impressions").select("*").eq("job_seeker_id", currentPerson.id).gte("created_at", new Date(new Date().setHours(0,0,0,0)).toISOString())
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("saved_opportunities").select("*").eq("job_seeker_id", currentPerson.id).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      currentBusiness
        ? supabase.from("business_shortlists").select("*").eq("business_id", currentBusiness.id).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("match_feedback").select("*").eq("job_seeker_id", currentPerson.id).order("created_at", { ascending: false }).limit(100)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (peopleRes.error) {
      setMessage(`People: ${peopleRes.error.message}`);
    } else {
      const rows = (peopleRes.data || []) as Person[];
      setPeople(rows);
    }

    if (!businessesRes.error) {
      const rows = (businessesRes.data || []) as Business[];
      setBusinesses(rows);
    }

    if (!opportunitiesRes.error) setOpportunities((opportunitiesRes.data || []) as Opportunity[]);
    if (!cvsRes.error) setCVs((cvsRes.data || []) as CVDocument[]);
    if (!analysesRes.error) setAnalyses((analysesRes.data || []) as CVAnalysis[]);
    if (!postsRes.error) setPosts((postsRes.data || []) as Post[]);
    if (!applicationsRes.error) setApplications((applicationsRes.data || []) as Application[]);
    if (!notificationsRes.error) setNotifications((notificationsRes.data || []) as GuardianNotification[]);
    if (!preferenceRes.error) setNotificationPreference((preferenceRes.data || null) as NotificationPreference | null);
    if (!adsRes.error) setSponsoredAds((adsRes.data || []) as SponsoredAd[]);
    if (!impressionsRes.error) setAdImpressions((impressionsRes.data || []) as AdImpression[]);
    if (!savedRes.error) setSavedOpportunities((savedRes.data || []) as SavedOpportunity[]);
    if (!shortlistRes.error) setBusinessShortlists((shortlistRes.data || []) as BusinessShortlist[]);
    if (!feedbackRes.error) setMatchFeedback((feedbackRes.data || []) as MatchFeedback[]);

    setLoading(false);
  };

  const hydrateAccount = async (user: any) => {
    if (!user) {
      setAccount(null);
      setCurrentPerson(null);
      setCurrentBusiness(null);
      return;
    }

    const { data: acct, error: acctError } = await supabase
      .from("guardian_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (acctError) {
      setAuthMessage(acctError.message);
      return;
    }

    if (!acct) {
      setAccount(null);
      setCurrentPerson(null);
      setCurrentBusiness(null);
      return;
    }

    setAccount(acct as AuthAccount);
    setAuthRole(acct.role === "business" ? "business" : "job_seeker");

    if (acct.job_seeker_id) {
      const { data } = await supabase.from("Job seekers").select("*").eq("id", acct.job_seeker_id).maybeSingle();
      setCurrentPerson((data || null) as Person | null);
      setCurrentBusiness(null);
    } else if (acct.business_id) {
      const { data } = await supabase.from("businesses").select("*").eq("id", acct.business_id).maybeSingle();
      setCurrentBusiness((data || null) as Business | null);
      setCurrentPerson(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setAuthUser(data.session?.user || null);
      await hydrateAccount(data.session?.user || null);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setAuthUser(session?.user || null);
      await hydrateAccount(session?.user || null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser || !account) return;
    loadAll();
  }, [authUser?.id, account?.id]);

  useEffect(() => {
    if (!currentPerson) return;
    loadAll();
  }, [currentPerson?.id]);

  useEffect(() => {
    if (!currentBusiness) return;
    supabase.from("business_shortlists").select("*").eq("business_id", currentBusiness.id).order("created_at", { ascending: false })
      .then(({ data }) => setBusinessShortlists((data || []) as BusinessShortlist[]));
  }, [currentBusiness?.id]);

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

  useEffect(() => {
    const saved = window.localStorage.getItem("guardian-work-theme");
    const next = saved === "dark" ? "dark" : "light";
    setTheme(next);
    document.documentElement.lang = "en";
  }, []);

  useEffect(() => {
    document.documentElement.lang = "en";
    window.localStorage.setItem("guardian-work-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!currentPerson) return;
    const channel = supabase.channel("guardian-work-live", { config: { presence: { key: currentPerson.id } } });
    presenceChannelRef.current = channel;
    const sync = () => { const state = channel.presenceState(); const count = Object.keys(state).length; setLiveUsers(count); };
    channel.on("presence", { event: "sync" }, sync).on("presence", { event: "join" }, sync).on("presence", { event: "leave" }, sync).subscribe(async status => { if(status === "SUBSCRIBED") await channel.track({ person_id: currentPerson.id, online_at: new Date().toISOString() }); });
    return () => { supabase.removeChannel(channel); presenceChannelRef.current = null; };
  }, [currentPerson?.id]);

  const recordAdEvent = async (adId: string, eventType: "impression" | "click") => {
    const payload = { ad_id: adId, job_seeker_id: currentPerson?.id || null, event_type: eventType };
    const { data, error } = await supabase.from("ad_impressions").insert(payload).select().single();
    if (!error && data) setAdImpressions(old => [...old, data as AdImpression]);
  };

  useEffect(() => {
    if (!currentPerson || !targetedAds.length) return;
    const today = new Date(); today.setHours(0,0,0,0);
    targetedAds.forEach(ad => {
      const alreadyRecorded = adImpressions.some(x => x.ad_id === ad.id && x.event_type === "impression" && new Date(x.created_at).getTime() >= today.getTime());
      if (!alreadyRecorded) recordAdEvent(ad.id, "impression");
    });
  }, [currentPerson?.id,]);

  const createSponsoredAd = async () => {
    if (account?.role !== "business" || !currentBusiness) return flash("Only an authenticated business account can create ads.");
    if (!adForm.title.trim() || !adForm.cta_url.trim()) return flash("Ad title and destination URL are required.");
    const { data, error } = await supabase.from("sponsored_ads").insert({ ...adForm, business_id: currentBusiness?.id || null, status: "active" }).select().single();
    if (error) return flash(error.message);
    setSponsoredAds(old => [data as SponsoredAd, ...old]);
    setAdForm({ title:"", body:"", cta_label:"Learn more", cta_url:"", target_province:"", target_town:"", target_skills:"", daily_frequency_cap:2 });
    flash("Sponsored ad created and activated.");
  };

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

  const businessFilteredPeople = useMemo(() => {
    const q = businessTalentSearch.toLowerCase().trim();
    const skillQ = businessTalentSkills.toLowerCase().trim();
    return people.filter((p) => {
      if (p.profile_visibility === "hidden") return false;
      const haystack = [p.name, p.job_title, p.skills, p.experience, p.town, p.province].map(safeText).join(" ").toLowerCase();
      const skills = safeText(p.skills).toLowerCase();
      return (!q || haystack.includes(q)) && (!businessTalentProvince || p.province === businessTalentProvince) && (!businessTalentTown || safeText(p.town).toLowerCase().includes(businessTalentTown.toLowerCase())) && (!skillQ || skills.includes(skillQ));
    });
  }, [people, businessTalentSearch, businessTalentProvince, businessTalentTown, businessTalentSkills]);

  const targetedAds = useMemo(() => {
    const now = Date.now();
    const today = new Date(); today.setHours(0,0,0,0);
    return sponsoredAds.filter(ad => {
      if (ad.status !== "active") return false;
      if (ad.starts_at && new Date(ad.starts_at).getTime() > now) return false;
      if (ad.ends_at && new Date(ad.ends_at).getTime() < now) return false;
      if (ad.target_province && ad.target_province !== safeText(currentPerson?.province)) return false;
      if (ad.target_town && !safeText(currentPerson?.town).toLowerCase().includes(ad.target_town.toLowerCase())) return false;
      if (ad.target_skills && !safeText(currentPerson?.skills).toLowerCase().includes(ad.target_skills.toLowerCase())) return false;
      const shownToday = adImpressions.filter(x => x.ad_id === ad.id && x.event_type === "impression" && new Date(x.created_at).getTime() >= today.getTime()).length;
      return shownToday < (ad.daily_frequency_cap || 2);
    }).slice(0, 2);
  }, [sponsoredAds, adImpressions, currentPerson]);

  const adminProvinceStats = useMemo(() => provinces.map(p => [p, people.filter(x => x.province === p).length] as [string, number]).filter(([,n]) => n > 0), [people]);
  const adminJobStats = useMemo(() => { const m = new Map<string, number>(); people.forEach(p => { const k=safeText(p.job_title).trim(); if(k) m.set(k,(m.get(k)||0)+1); }); return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]).slice(0,8); }, [people]);
  const adPerformance = useMemo(() => sponsoredAds.map(ad => ({ ad, impressions: adImpressions.filter(x=>x.ad_id===ad.id && x.event_type==="impression").length, clicks: adImpressions.filter(x=>x.ad_id===ad.id && x.event_type==="click").length })), [sponsoredAds, adImpressions]);

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

  const smartMatches = useMemo<SmartMatch[]>(() => {
    if (!currentPerson) return [];

    const tokens = (value: string | null | undefined) =>
      safeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9+.#/ -]/g, " ")
        .split(/[\s,;|/]+/)
        .map(x => x.trim())
        .filter(x => x.length >= 2);

    const personSkills = tokens(currentPerson.skills);
    const personTitle = tokens(currentPerson.job_title);
    const personTown = safeText(currentPerson.town).toLowerCase().trim();
    const personProvince = safeText(currentPerson.province).toLowerCase().trim();
    const personExperience = tokens(currentPerson.experience);
    const availability = safeText(currentPerson.availability).toLowerCase();

    const overlap = (a: string[], b: string[]) => {
      if (!a.length || !b.length) return 0;
      const hits = a.filter(x => b.some(y => x === y || x.includes(y) || y.includes(x)));
      return Math.min(100, Math.round((new Set(hits).size / Math.max(1, a.length)) * 100));
    };

    return opportunities.map((o) => {
      const requiredSkills = tokens(o.skills_required);
      const titleTokens = tokens(o.title);
      const experienceTokens = tokens(o.experience_required);

      const skillScore = requiredSkills.length
        ? overlap(requiredSkills, personSkills)
        : 55;

      const identityScore = titleTokens.length
        ? overlap(titleTokens, personTitle)
        : 45;

      const locationScore =
        personTown && safeText(o.town).toLowerCase().trim() === personTown
          ? 100
          : personProvince && safeText(o.province).toLowerCase().trim() === personProvince
          ? 75
          : 20;

      const experienceScore = experienceTokens.length
        ? (personExperience.length ? Math.max(45, overlap(experienceTokens, personExperience)) : 25)
        : 70;

      const availabilityScore = availability.includes("available") ? 100 : 60;

      // V6.0 transparent Match Engine weights.
      const score = Math.max(0, Math.min(100, Math.round(
        skillScore * 0.40 +
        locationScore * 0.25 +
        identityScore * 0.15 +
        experienceScore * 0.10 +
        availabilityScore * 0.10
      )));

      const reasons: string[] = [];
      if (skillScore >= 70) reasons.push("strong skill match");
      else if (skillScore >= 40) reasons.push("some required skills match");
      if (locationScore >= 100) reasons.push("same town / area");
      else if (locationScore >= 75) reasons.push("same province");
      if (identityScore >= 70) reasons.push("Work Identity match");
      if (experienceScore >= 70) reasons.push("experience aligns");
      if (availabilityScore >= 90) reasons.push("available now");

      return {
        opportunity: o,
        score,
        reasons: reasons.length ? reasons : ["potential match"],
        skillScore,
        locationScore,
        identityScore,
        experienceScore,
        availabilityScore,
      };
    })
      .filter(x => x.score >= 35)
      .sort((a,b) => b.score - a.score)
      .slice(0, 20);
  }, [currentPerson, opportunities]);

  const businessMatchResults = useMemo(() => {
    if (!currentBusiness) return [];
    const opportunity = opportunities.find(o => o.id === matchCenterOpportunity) || opportunities.find(o => o.business_id === currentBusiness.id);
    if (!opportunity) return [];

    const tokens = (value: string | null | undefined) =>
      safeText(value).toLowerCase().replace(/[^a-z0-9+.#/ -]/g, " ").split(/[\s,;|/]+/).filter(x => x.length >= 2);
    const overlap = (a: string[], b: string[]) => {
      if (!a.length || !b.length) return 0;
      return Math.min(100, Math.round((new Set(a.filter(x => b.some(y => x === y || x.includes(y) || y.includes(x)))).size / Math.max(1, a.length)) * 100));
    };
    const requiredSkills = tokens(opportunity.skills_required);
    const titleTokens = tokens(opportunity.title);

    return people
      .filter(p => p.profile_visibility !== "hidden")
      .map(person => {
        const skillScore = requiredSkills.length ? overlap(requiredSkills, tokens(person.skills)) : 55;
        const identityScore = titleTokens.length ? overlap(titleTokens, tokens(person.job_title)) : 45;
        const town = safeText(person.town).toLowerCase().trim();
        const province = safeText(person.province).toLowerCase().trim();
        const locationScore = town && town === safeText(opportunity.town).toLowerCase().trim() ? 100 : province && province === safeText(opportunity.province).toLowerCase().trim() ? 75 : 20;
        const experienceScore = opportunity.experience_required ? (person.experience ? 70 : 30) : 70;
        const availabilityScore = safeText(person.availability).toLowerCase().includes("available") ? 100 : 60;
        const score = Math.max(0, Math.min(100, Math.round(skillScore*.40 + locationScore*.25 + identityScore*.15 + experienceScore*.10 + availabilityScore*.10)));
        return { person, score, skillScore, locationScore, identityScore, experienceScore, availabilityScore };
      })
      .filter(x => x.score >= 35)
      .sort((a,b) => b.score - a.score)
      .slice(0, 30);
  }, [currentBusiness, matchCenterOpportunity, opportunities, people]);

  const recordMatchFeedback = async (opportunity: Opportunity, action: "interested" | "not_for_me" | "applied") => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    const { data, error } = await supabase.from("match_feedback").upsert({ job_seeker_id: currentPerson.id, opportunity_id: opportunity.id, action }, { onConflict: "job_seeker_id,opportunity_id" }).select().single();
    if (error) return flash(error.message);
    setMatchFeedback(old => [data as MatchFeedback, ...old.filter(x => !(x.opportunity_id === opportunity.id && x.job_seeker_id === currentPerson.id))]);
    if (action === "interested") flash("Saved as interested. GUARDIAN will prioritise this signal in future matching.");
    if (action === "not_for_me") flash("Match hidden. Your feedback helps improve your future recommendations.");
  };

  const persistSmartMatches = async () => {
    if (!currentPerson || !smartMatches.length) return;
    const rows = smartMatches.map(m => ({
      job_seeker_id: currentPerson.id,
      opportunity_id: m.opportunity.id,
      match_score: m.score,
      reasons: m.reasons,
      skill_score: m.skillScore,
      location_score: m.locationScore,
      identity_score: m.identityScore,
      experience_score: m.experienceScore,
      availability_score: m.availabilityScore,
      match_version: "V6.0",
      calculated_at: new Date().toISOString(),
      status: "active",
    }));
    const { error } = await supabase.from("smart_matches").upsert(rows, { onConflict: "job_seeker_id,opportunity_id" });
    if (error) return flash(error.message);
    flash("Match Engine recalculated your recommendations.");
  };

  const unreadNotifications = notifications.filter(n => !n.read_at).length;

  const ensureNotificationPreference = async () => {
    if (!currentPerson) return null;
    if (notificationPreference) return notificationPreference;
    const { data, error } = await supabase.from("notification_preferences").upsert({
      job_seeker_id: currentPerson.id, portal_enabled: true, whatsapp_enabled: false, whatsapp_opt_in: false, whatsapp_subscription_status: "inactive"
    }, { onConflict: "job_seeker_id" }).select().single();
    if (error) { flash(error.message); return null; }
    setNotificationPreference(data as NotificationPreference);
    return data as NotificationPreference;
  };

  const saveNotificationPreferences = async (patch: Partial<NotificationPreference>) => {
    if (!currentPerson) return;
    const base = notificationPreference || await ensureNotificationPreference();
    if (!base) return;
    const next = { ...base, ...patch };
    const { data, error } = await supabase.from("notification_preferences").upsert({
      job_seeker_id: currentPerson.id, portal_enabled: next.portal_enabled, whatsapp_enabled: next.whatsapp_enabled, whatsapp_opt_in: next.whatsapp_opt_in, whatsapp_subscription_status: next.whatsapp_subscription_status, whatsapp_subscription_expires_at: next.whatsapp_subscription_expires_at
    }, { onConflict: "job_seeker_id" }).select().single();
    if (error) return flash(error.message);
    setNotificationPreference(data as NotificationPreference);
    flash("Notification preferences saved.");
  };

  const markNotificationRead = async (n: GuardianNotification) => {
    if (n.read_at) return;
    await supabase.from("guardian_notifications").update({ read_at: new Date().toISOString() }).eq("id", n.id);
    setNotifications(old => old.map(x => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x));
  };

  const refreshMatches = async () => {
    setMatchRefreshing(true);
    await persistSmartMatches();
    setMatchRefreshing(false);
  };

  const activateWhatsAppPlan = async () => {
    if (!currentPerson) return;
    setPaymentOpen(true);
  };

  const confirmWhatsAppPaymentMethod = async () => {
    if (!currentPerson) return;
    await saveNotificationPreferences({ whatsapp_enabled: true, whatsapp_opt_in: true, whatsapp_subscription_status: "pending", whatsapp_payment_method: paymentMethod, whatsapp_payment_status: "pending" } as any);
    setPaymentOpen(false);
    flash(`Payment option selected: ${paymentMethod.replace("_", " ")}. Subscription remains pending until payment is confirmed.`);
  };

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
    if (account?.role !== "business" || !authUser) return flash("Business mode is required to create a business profile.");
    if (!businessForm.name.trim()) return flash("Enter the business name.");
    const { data, error } = await supabase
      .from("businesses")
      .insert({ ...businessForm, auth_user_id: authUser.id, business_name: businessForm.name })
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

  const toggleSavedOpportunity = async (opportunity: Opportunity) => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    const existing = savedOpportunities.find(x => x.opportunity_id === opportunity.id && x.job_seeker_id === currentPerson.id);
    if (existing) {
      const { error } = await supabase.from("saved_opportunities").delete().eq("id", existing.id);
      if (error) return flash(error.message);
      setSavedOpportunities(old => old.filter(x => x.id !== existing.id));
      flash("Opportunity removed from Saved Work.");
      return;
    }
    const { data, error } = await supabase.from("saved_opportunities").insert({ job_seeker_id: currentPerson.id, opportunity_id: opportunity.id }).select().single();
    if (error) {
      if (error.code === "23505") return flash("Already saved.");
      return flash(error.message);
    }
    setSavedOpportunities(old => [data as SavedOpportunity, ...old]);
    flash("Opportunity saved.");
  };

  const shortlistPerson = async (person: Person) => {
    if (!currentBusiness) return flash("Create or select a business first.");
    const existing = businessShortlists.find(x => x.job_seeker_id === person.id && x.business_id === currentBusiness.id);
    if (existing) return flash("This person is already in your shortlist.");
    const { data, error } = await supabase.from("business_shortlists").insert({ business_id: currentBusiness.id, job_seeker_id: person.id, status: "saved", note: null }).select().single();
    if (error) return flash(error.message);
    setBusinessShortlists(old => [data as BusinessShortlist, ...old]);
    flash(`${person.name || "Candidate"} added to your business shortlist.`);
  };

  const removeShortlistPerson = async (id: string) => {
    const { error } = await supabase.from("business_shortlists").delete().eq("id", id);
    if (error) return flash(error.message);
    setBusinessShortlists(old => old.filter(x => x.id !== id));
    flash("Candidate removed from shortlist.");
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
      return flash(`You already applied - status: ${statusLabel[already.status]}.`);
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
    const path = `${currentPerson.id}/${crypto.randomUUID()}-${safeName}`;

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
      await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "likes_count", p_delta: -1 });
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
      await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "likes_count", p_delta: 1 });
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

    await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "comments_count", p_delta: 1 });

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
    await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "shares_count", p_delta: 1 });
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

  const renderAuthScreen = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <Card className="w-full overflow-hidden">
          <div className="bg-emerald-700 p-7 text-white">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-xl font-black">GW</div>
            <div className="mt-5 text-xs font-black uppercase tracking-widest text-orange-300">GUARDIAN WORK V5.9</div>
            <h1 className="mt-2 text-3xl font-black">Real people. Real work.</h1>
            <p className="mt-2 text-sm leading-6 text-emerald-50">Create your own secure GUARDIAN WORK account and make your ability discoverable.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={()=>setAuthMode("signin")} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signin" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>Sign in</button>
              <button onClick={()=>setAuthMode("signup")} className={`rounded-xl px-3 py-3 text-sm font-black ${authMode === "signup" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}>Create account</button>
            </div>
            {authMode === "signup" && (
              <>
                <label className="mt-5 block text-xs font-black text-slate-600">Account type</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button onClick={()=>setAuthRole("job_seeker")} className={`rounded-xl border p-3 text-left ${authRole === "job_seeker" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}><div className="font-black text-slate-900">Job seeker</div><div className="mt-1 text-[11px] text-slate-500">Be discovered and find work.</div></button>
                  <button onClick={()=>setAuthRole("business")} className={`rounded-xl border p-3 text-left ${authRole === "business" ? "border-orange-500 bg-orange-50" : "border-slate-200"}`}><div className="font-black text-slate-900">Business</div><div className="mt-1 text-[11px] text-slate-500">Find talent and hire.</div></button>
                </div>
                <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder={authRole === "business" ? "Business name" : "Full name"} className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              </>
            )}
            <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} type="email" placeholder="Email address" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input value={authPassword} onChange={e=>setAuthPassword(e.target.value)} type="password" placeholder="Password" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            {authMessage && <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-800">{authMessage}</div>}
            <Button className="mt-5 w-full" variant={authMode === "signup" ? "orange" : "green"} disabled={authBusy} onClick={authMode === "signup" ? signUp : signIn}>{authBusy ? "Please wait..." : authMode === "signup" ? "Create secure account" : "Sign in securely"}</Button>
            <div className="mt-5 text-center text-xs text-slate-500">V6.0 introduces the GUARDIAN Match Engine with transparent matching signals.</div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center">
        <Card className="w-full p-6 sm:p-8">
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">V5.9 setup</div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Finish your GUARDIAN WORK account.</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Your account is created. Add the minimum information needed to enter your secure workspace.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder={authRole === "business" ? "Business name" : "Full name"} className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <select value={onboardingProvince} onChange={e=>setOnboardingProvince(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">Province</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
            <input value={onboardingTown} onChange={e=>setOnboardingTown(e.target.value)} placeholder="Town / area" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            {authRole === "job_seeker" ? (
              <>
                <input value={onboardingJobTitle} onChange={e=>setOnboardingJobTitle(e.target.value)} placeholder="What do you do?" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
                <input value={onboardingPhone} onChange={e=>setOnboardingPhone(e.target.value)} placeholder="Phone" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              </>
            ) : (
              <textarea value={onboardingDescription} onChange={e=>setOnboardingDescription(e.target.value)} placeholder="Tell people about the business" className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm sm:col-span-2" />
            )}
          </div>
          {authMessage && <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-800">{authMessage}</div>}
          <div className="mt-5 flex flex-wrap gap-2"><Button variant="green" disabled={authBusy} onClick={completeOnboarding}>{authBusy ? "Setting up..." : "Enter GUARDIAN WORK"}</Button><Button variant="light" onClick={signOut}>Sign out</Button></div>
        </Card>
      </div>
    </div>
  );

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
          <div className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 sm:block">LIVE {liveUsers}</div>
          <button onClick={signOut} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 hover:bg-slate-50 sm:block">Sign out</button>
          {currentPerson && (
            <button onClick={() => { setProfileMenuOpen(false); nav("profile"); }} className="hidden text-right sm:block" aria-label="Open profile">
              <div className="text-xs font-black text-slate-900">{currentPerson.name}</div>
              <div className="text-[10px] text-slate-500">{currentPerson.job_title || "Work identity"}</div>
            </button>
          )}
          <button onClick={() => { setProfileMenuOpen(false); nav("profile"); }} aria-label="Open profile" className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 font-black text-orange-700 ring-2 ring-transparent hover:ring-orange-300">
            {initials(currentPerson?.name || "GW")}
          </button>
        </div>
      </div>
    </header>
  );

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1">
        {[
          ["home", "Home"],
          ["work", "Work"],
          ["timeline", "Feed"],
          ["jobs", "Jobs"],
          ["matches", "Match"],
          ["saved", "Saved"],
          ["business", "Business"],
          ["alerts", "Alerts"],
          ["settings", "Settings"],
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
              V6.0 - MATCH ENGINE + TRUSTED DISCOVERY
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
              Your ability can open doors.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
              GUARDIAN WORK connects people, skills and businesses - from being discoverable to
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

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.0 Match Engine</div><h2 className="mt-1 text-xl font-black text-slate-900">Your Smart Matches</h2><p className="mt-1 text-xs text-slate-500">Ranked by the GUARDIAN Match Engine using transparent skills, location, identity, experience and availability signals.</p></div>
          <Button variant="light" disabled={matchRefreshing} onClick={refreshMatches}>{matchRefreshing ? "Refreshing..." : "Refresh matches"}</Button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {smartMatches.filter(m => !matchDismissed.includes(m.opportunity.id)).slice(0,4).map(m => (
            <div key={m.opportunity.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{m.opportunity.title || "Opportunity"}</div><div className="mt-1 text-xs text-slate-500">{[m.opportunity.town, m.opportunity.province].filter(Boolean).join(" - ") || "Location flexible"}</div></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">{m.score}% Match</span></div>
              <div className="mt-3 flex flex-wrap gap-1.5">{m.reasons.map(r => <span key={r} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-600">- {r}</span>)}</div>
              <div className="mt-4 flex gap-2"><Button className="flex-1" onClick={() => applyToOpportunity(m.opportunity)}>Apply</Button><Button variant="light" onClick={() => setMatchDismissed(old => [...old, m.opportunity.id])}>Hide</Button></div>
            </div>
          ))}
          {!smartMatches.length && <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500 lg:col-span-2">Complete your Work Identity and add skills to unlock stronger matches.</div>}
        </div>
      </Card>

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
                      {[o.town, o.province].filter(Boolean).join(" - ")}
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
                  Private storage - preliminary readiness assessment
                </p>
              </div>
              <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-black text-orange-700">
                {currentCV?.ats_score ?? currentPerson?.ats_score ?? "-"}
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
                    <div className="mt-1 text-lg font-black text-slate-900">{y ?? "-"}</div>
                  </div>
                ))}
              </div>
            )}

            <label className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-5 text-center">
              <div className="font-black text-emerald-800">Upload / replace CV</div>
              <div className="mt-1 text-xs text-emerald-700">PDF, DOC or DOCX - max 10MB</div>
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

  const savedOpportunityRows = useMemo(() => {
    const ids = new Set(savedOpportunities.map(x => x.opportunity_id));
    return opportunities.filter(o => ids.has(o.id));
  }, [savedOpportunities, opportunities]);

  const renderMatches = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.0 Match Engine</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Stop searching. Start matching.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">GUARDIAN compares skills, location, Work Identity, experience and availability to rank opportunities. The score is transparent and rule-based - not a mystery number.</p>
      </div>

      {currentPerson ? (
        <>
          <Card className="border-emerald-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Your Match Engine</div><h2 className="mt-1 text-xl font-black text-slate-900">Best opportunities for your Work Identity</h2><p className="mt-1 text-xs text-slate-500">40% skills - 25% location - 15% identity - 10% experience - 10% availability.</p></div>
              <Button variant="orange" disabled={matchRefreshing} onClick={refreshMatches}>{matchRefreshing ? "Calculating..." : "Recalculate matches"}</Button>
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {smartMatches.filter(m => matchFeedback.find(f => f.opportunity_id === m.opportunity.id)?.action !== "not_for_me").map(m => (
              <Card key={m.opportunity.id} className="overflow-hidden">
                <div className="border-b border-slate-100 p-5">
                  <div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{m.opportunity.title || "Opportunity"}</div><div className="mt-1 text-xs text-slate-500">{[m.opportunity.town,m.opportunity.province].filter(Boolean).join(" - ") || "Location flexible"}</div></div><div className="rounded-2xl bg-emerald-600 px-3 py-2 text-center text-white"><div className="text-xl font-black">{m.score}%</div><div className="text-[9px] font-black uppercase">match</div></div></div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{m.reasons.map(r=><span key={r} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">{r}</span>)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-5">
                  {[["Skills",m.skillScore],["Location",m.locationScore],["Identity",m.identityScore],["Experience",m.experienceScore],["Available",m.availabilityScore]].map(([label,value])=><div key={String(label)} className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-[9px] font-black uppercase text-slate-400">{label}</div><div className="mt-1 font-black text-slate-800">{value}%</div></div>)}
                </div>
                <div className="flex flex-wrap gap-2 px-5 pb-5">
                  <Button className="flex-1" onClick={()=>{recordMatchFeedback(m.opportunity,"applied");applyToOpportunity(m.opportunity)}}>Apply</Button>
                  <Button variant="light" onClick={()=>recordMatchFeedback(m.opportunity,"interested")}>Interested</Button>
                  <Button variant="light" onClick={()=>recordMatchFeedback(m.opportunity,"not_for_me")}>Not for me</Button>
                </div>
              </Card>
            ))}
          </div>
          {!smartMatches.length && <Card className="p-6 text-sm text-slate-500">Complete your Work Identity and add skills, location and availability to unlock stronger matches.</Card>}
        </>
      ) : currentBusiness ? (
        <Card className="border-orange-200 p-6">
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">Business Match Engine</div>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Find the people who fit the work.</h2>
          <p className="mt-2 text-sm text-slate-500">Select one of your opportunities and GUARDIAN will rank discoverable candidates against its requirements.</p>
          <select value={matchCenterOpportunity} onChange={e=>setMatchCenterOpportunity(e.target.value)} className="mt-5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm">
            <option value="">Select an opportunity</option>
            {opportunities.filter(o=>o.business_id===currentBusiness.id).map(o=><option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {businessMatchResults.map(x=><Card key={x.person.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{x.person.name || "Job seeker"}</div><div className="text-sm font-bold text-orange-600">{x.person.job_title || "Work seeker"}</div><div className="text-xs text-slate-500">{[x.person.town,x.person.province].filter(Boolean).join(" - ")}</div></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">{x.score}%</span></div><div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] font-bold text-slate-600"><span className="rounded-lg bg-slate-50 p-2">Skills {x.skillScore}%</span><span className="rounded-lg bg-slate-50 p-2">Location {x.locationScore}%</span><span className="rounded-lg bg-slate-50 p-2">Identity {x.identityScore}%</span><span className="rounded-lg bg-slate-50 p-2">Availability {x.availabilityScore}%</span></div><div className="mt-3 flex gap-2">{x.person.phone&&<a href={`tel:${x.person.phone}`} className="flex-1 rounded-xl bg-orange-500 px-3 py-2 text-center text-xs font-black text-white">Call</a>}<Button variant="light" onClick={()=>shortlistPerson(x.person)}>Shortlist</Button></div></Card>)}
            {!businessMatchResults.length&&<div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 md:col-span-2 xl:col-span-3">Choose an opportunity to activate Business Match Engine.</div>}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderSaved = () => (
    <div className="space-y-6">
      <div className="rounded-3xl bg-emerald-700 p-6 text-white">
        <div className="text-xs font-black uppercase tracking-widest text-orange-300">Saved Work</div>
        <h1 className="mt-2 text-3xl font-black">Keep the opportunities that matter.</h1>
        <p className="mt-2 text-sm text-emerald-50">Save opportunities now and come back when you are ready to apply.</p>
      </div>
      {!savedOpportunityRows.length ? (
        <Card className="p-8 text-center"><div className="text-4xl">Saved</div><h2 className="mt-3 text-xl font-black">Nothing saved yet.</h2><p className="mt-2 text-sm text-slate-500">Go to Jobs and tap Save on an opportunity you want to keep.</p><Button className="mt-5" onClick={() => nav("jobs")}>Browse opportunities</Button></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {savedOpportunityRows.map(o => (
            <Card key={o.id} className="p-6">
              <div className="flex items-start justify-between gap-3"><div><div className="text-xl font-black text-slate-900">{o.title}</div><div className="mt-1 text-xs font-bold text-orange-600">{[o.town,o.province].filter(Boolean).join(" - ")}</div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Saved</span></div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{o.description || "No description provided."}</p>
              <div className="mt-5 flex flex-wrap gap-2"><Button variant="orange" onClick={() => applyToOpportunity(o)}>Apply now</Button><Button variant="light" onClick={() => toggleSavedOpportunity(o)}>Remove saved</Button></div>
            </Card>
          ))}
        </div>
      )}
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
                    {[o.town, o.province].filter(Boolean).join(" - ")}
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
                <Button variant="light" onClick={() => toggleSavedOpportunity(o)}>
                  {savedOpportunities.some(x => x.opportunity_id === o.id) ? "Saved" : "Save"}
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
                    Applied {formatDate(a.applied_at)} - {[o?.town, o?.province].filter(Boolean).join(" - ")}
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
                <b>CV attached:</b> {a.cv_id ? "Yes" : "No"} - Last updated {formatDate(a.updated_at)}
              </div>
            </Card>
          );
        })}

        {!visibleApplications.length && (
          <Card className="p-10 text-center">
            <div className="text-4xl">Status</div>
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
        {posts.map((post, index) => (
          <Fragment key={post.id}>
          <Card className="p-5">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-100 font-black text-orange-700">
                {initials(appPerson(post.job_seeker_id || post.author_id)?.name || "GW")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-slate-900">
                  {appPerson(post.job_seeker_id || post.author_id)?.name || "GUARDIAN WORK member"}
                </div>
                <div className="text-xs text-slate-500">{formatDate(post.created_at)} - {post.location || "South Africa"}</div>
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
                    Likes {post.likes_count}
                  </button>
                  <button
                    onClick={() => loadComments(post.id)}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-600"
                  >
                    Comments {post.comments_count}
                  </button>
                  <button
                    onClick={() => sharePost(post)}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-600"
                  >
                    Shares {post.shares_count}
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
          {index % 3 === 2 && targetedAds.length > 0 && (
            <div className="mt-4 space-y-3">
              {targetedAds.map(ad => (
                <Card key={`${post.id}-${ad.id}`} className="overflow-hidden border-orange-200 bg-orange-50/40">
                  {ad.image_url && <img src={ad.image_url} alt="Sponsored" className="h-40 w-full object-cover" />}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black uppercase text-white">Sponsored</span><span className="text-[10px] font-bold text-slate-400">Smart discovery</span></div>
                    <h3 className="mt-3 font-black text-slate-900">{ad.title}</h3>
                    {ad.body && <p className="mt-1 text-sm leading-6 text-slate-600">{ad.body}</p>}
                    <a href={ad.cta_url} target="_blank" rel="noreferrer" onClick={() => recordAdEvent(ad.id, "click")} className="mt-4 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white hover:bg-orange-600">{ad.cta_label}</a>
                  </div>
                </Card>
              ))}
            </div>
          )}
          </Fragment>
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
                <div className="text-xs text-slate-500">{[p.town, p.province].filter(Boolean).join(" - ")}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{p.headline || p.experience || "Building a discoverable work identity."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="light" onClick={() => shortlistPerson(p)}>Add to shortlist</Button>
              {p.phone && <a href={`tel:${p.phone}`} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Call</a>}
            </div>
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

      <Card className="p-6 border-emerald-200">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Business Talent Discovery</div><h2 className="mt-1 text-xl font-black">Find job seekers where the work is.</h2><p className="mt-1 text-sm text-slate-500">Search discoverable people by required province, town and skills.</p></div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{businessFilteredPeople.length} matches</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <input value={businessTalentSearch} onChange={e=>setBusinessTalentSearch(e.target.value)} placeholder="Name or job title" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <select value={businessTalentProvince} onChange={e=>setBusinessTalentProvince(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">Required province</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
          <input value={businessTalentTown} onChange={e=>setBusinessTalentTown(e.target.value)} placeholder="Required town / area" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <input value={businessTalentSkills} onChange={e=>setBusinessTalentSkills(e.target.value)} placeholder="Required skill" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="light" onClick={()=>{setBusinessTalentSearch("");setBusinessTalentProvince("");setBusinessTalentTown("");setBusinessTalentSkills("");}}>Clear search</Button><Button variant="green" onClick={()=>{setBusinessTalentProvince(currentBusiness?.province || "");setBusinessTalentTown(currentBusiness?.town || "");}}>Use business location</Button></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {businessFilteredPeople.slice(0,12).map(p=><Card key={p.id} className="p-4"><div className="flex gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">{initials(p.name)}</div><div className="min-w-0"><div className="font-black text-slate-900">{p.name || "Job seeker"}</div><div className="text-sm font-bold text-orange-600">{p.job_title || "Work seeker"}</div><div className="text-xs text-slate-500">{[p.town,p.province].filter(Boolean).join(" - ")}</div></div></div>{p.skills&&<div className="mt-3 text-xs text-slate-600">{p.skills}</div>}<div className="mt-3 flex items-center justify-between gap-2"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Discoverable</span>{p.phone&&<a href={`https://wa.me/${p.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-white">Contact</a>}</div></Card>)}
          {!businessFilteredPeople.length&&<div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No discoverable people match those requirements.</div>}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-black">Applicants</h2>
        <p className="mt-1 text-xs text-slate-500">
          Business applicant pipeline - real records only.
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
                      {opp?.title || "Opportunity"} - {[person?.town, person?.province].filter(Boolean).join(" - ")}
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

      <Card className="p-6 border-emerald-200">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Business Shortlist</div><h2 className="mt-1 text-xl font-black">Your saved talent.</h2><p className="mt-1 text-sm text-slate-500">Keep promising people together while you review your hiring needs.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{businessShortlists.length} saved</span></div>
        <div className="mt-5 space-y-2">
          {businessShortlists.length ? businessShortlists.map(s => { const person = people.find(p => p.id === s.job_seeker_id); return <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><div className="font-black text-slate-900">{person?.name || "Job seeker"}</div><div className="text-xs text-slate-500">{person?.job_title || "Work identity"} - {[person?.town,person?.province].filter(Boolean).join(" - ")}</div></div><Button variant="light" onClick={() => removeShortlistPerson(s.id)}>Remove</Button></div>; }) : <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Your shortlist is empty. Add promising people from Business Talent Discovery.</div>}
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

      <Card className="p-6 border-orange-200">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Sponsored Discovery</div><h2 className="mt-1 text-xl font-black">Create a smart timeline ad</h2><p className="mt-1 text-xs text-slate-500">Target by province, town or skill. Ads are clearly labelled Sponsored.</p></div></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <input value={adForm.title} onChange={e=>setAdForm({...adForm,title:e.target.value})} placeholder="Ad title" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <input value={adForm.cta_url} onChange={e=>setAdForm({...adForm,cta_url:e.target.value})} placeholder="Destination URL" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <textarea value={adForm.body} onChange={e=>setAdForm({...adForm,body:e.target.value})} placeholder="Ad message" className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <input value={adForm.cta_label} onChange={e=>setAdForm({...adForm,cta_label:e.target.value})} placeholder="CTA label" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <select value={adForm.target_province} onChange={e=>setAdForm({...adForm,target_province:e.target.value})} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">All provinces</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
          <input value={adForm.target_town} onChange={e=>setAdForm({...adForm,target_town:e.target.value})} placeholder="Target town (optional)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <input value={adForm.target_skills} onChange={e=>setAdForm({...adForm,target_skills:e.target.value})} placeholder="Target skill (optional)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          <input type="number" min="1" max="20" value={adForm.daily_frequency_cap} onChange={e=>setAdForm({...adForm,daily_frequency_cap:Number(e.target.value)})} placeholder="Daily frequency cap" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
        </div>{account?.role === "business" && currentBusiness ? <Button className="mt-4" variant="orange" onClick={createSponsoredAd}>Create & activate ad</Button> : <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">Business account required to create sponsored ads.</div>}
        <div className="mt-6 space-y-2">{adPerformance.map(x=><div key={x.ad.id} className="rounded-xl bg-slate-50 p-3 text-xs"><b>{x.ad.title}</b> - {x.ad.status} - {x.impressions} impressions - {x.clicks} clicks</div>)}</div>
      </Card>

  };

  const renderAlerts = () => {
    const pref = notificationPreference;
    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">V5.9 - GUARDIAN ALERTS</div>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Never miss an opportunity.</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Choose where GUARDIAN WORK reaches you. Portal alerts are included. WhatsApp Alerts are an external delivery channel at R10/month.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className={`p-5 ${pref?.portal_enabled !== false ? "ring-2 ring-emerald-100" : ""}`}>
            <div className="text-2xl">Status</div><h2 className="mt-3 font-black">GUARDIAN Portal</h2>
            <p className="mt-1 text-sm text-slate-500">Included. Receive alerts inside GUARDIAN WORK.</p>
            <button onClick={() => saveNotificationPreferences({ portal_enabled: !(pref?.portal_enabled !== false) })} className="mt-4 text-xs font-black text-emerald-700">{pref?.portal_enabled === false ? "Enable Portal" : "Portal Enabled"}</button>
          </Card>
          <Card className={`p-5 ${pref?.whatsapp_enabled ? "ring-2 ring-orange-200" : ""}`}>
            <div className="text-2xl">WhatsApp</div><h2 className="mt-3 font-black">WhatsApp Alerts</h2>
            <p className="mt-1 text-sm text-slate-500">External delivery channel - <b>R10/month</b> per job seeker.</p>
            <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs font-bold text-orange-800">Status: {pref?.whatsapp_subscription_status || "inactive"}</div>
            <Button className="mt-4 w-full" variant="orange" onClick={activateWhatsAppPlan}>Choose WhatsApp - R10/month</Button>
          </Card>
          <Card className="p-5">
            <div className="text-2xl">Both</div><h2 className="mt-3 font-black">Both</h2>
            <p className="mt-1 text-sm text-slate-500">Portal + WhatsApp Alerts for R10/month.</p>
            <Button className="mt-4 w-full" variant="green" onClick={() => saveNotificationPreferences({ portal_enabled: true, whatsapp_enabled: true, whatsapp_opt_in: true, whatsapp_subscription_status: "pending" })}>Use Both</Button>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black">Your notification inbox</h2><p className="text-xs text-slate-500">{unreadNotifications} unread notification{unreadNotifications === 1 ? "" : "s"}.</p></div><Button variant="light" onClick={async () => { if (currentPerson) await supabase.from("guardian_notifications").update({ read_at: new Date().toISOString() }).eq("job_seeker_id", currentPerson.id).is("read_at", null); setNotifications(old => old.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))); }}>Mark all read</Button></div>
          <div className="mt-5 space-y-3">
            {notifications.map(n => (
              <button key={n.id} onClick={() => markNotificationRead(n)} className={`w-full rounded-2xl border p-4 text-left ${n.read_at ? "border-slate-100 bg-white" : "border-emerald-100 bg-emerald-50/50"}`}>
                <div className="flex items-start justify-between gap-4"><div><div className="font-black text-slate-900">{n.title}</div><div className="mt-1 text-sm text-slate-600">{n.message}</div></div><span className="shrink-0 text-[10px] font-black uppercase text-slate-400">{formatDate(n.created_at)}</span></div>
              </button>
            ))}
            {!notifications.length && <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No notifications yet. Smart matches and application updates will appear here.</div>}
          </div>
        </Card>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">My Profile</div><h1 className="mt-1 text-3xl font-black text-slate-900">Your work identity, at a glance.</h1></div>
      <Card className="overflow-hidden">
        <div className="bg-emerald-700 p-6 text-white sm:p-8"><div className="flex flex-wrap items-center gap-5"><div className="grid h-20 w-20 place-items-center rounded-full bg-orange-100 text-2xl font-black text-orange-700">{initials(currentPerson?.name || "GW")}</div><div><div className="text-2xl font-black">{currentPerson?.name || "GUARDIAN WORK member"}</div><div className="text-emerald-100">{account?.role === "business" ? "Business workspace" : currentPerson?.job_title || "Work identity"}</div><div className="mt-2 text-xs text-emerald-100">{[currentPerson?.town,currentPerson?.province].filter(Boolean).join(" - ")}</div></div></div></div>
        <div className="grid gap-4 p-6 sm:grid-cols-2"><div><div className="text-xs font-black uppercase text-slate-400">Headline</div><div className="mt-1 font-bold text-slate-800">{currentPerson?.headline || "Add a headline in My Work."}</div></div><div><div className="text-xs font-black uppercase text-slate-400">Availability</div><div className="mt-1 font-bold text-slate-800">{currentPerson?.availability || "Not specified"}</div></div><div className="sm:col-span-2"><div className="text-xs font-black uppercase text-slate-400">Skills</div><div className="mt-2 flex flex-wrap gap-2">{safeText(currentPerson?.skills).split(",").filter(Boolean).map(s=><span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{s.trim()}</span>)}</div></div></div>
      </Card>
      <div className="flex flex-wrap gap-2"><Button variant="green" onClick={()=>nav("work")}>Edit Work Identity</Button><Button variant="orange" onClick={()=>nav("jobs")}>Discover opportunities</Button><Button variant="light" onClick={()=>nav("settings")}>Profile settings</Button></div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Settings</div><h1 className="mt-1 text-3xl font-black text-slate-900">Your GUARDIAN WORK controls.</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Personalise your experience, control discoverability and manage how GUARDIAN reaches you.</p></div>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">Appearance</h2><p className="mt-1 text-xs text-slate-500">Choose your preferred GUARDIAN WORK display.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button onClick={()=>setTheme("light")} className={`rounded-2xl border p-4 text-left ${theme === "light" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}><div className="font-black">White mode</div><div className="mt-1 text-xs text-slate-500">Clean light workspace.</div></button>
          <button onClick={()=>setTheme("dark")} className={`rounded-2xl border p-4 text-left ${theme === "dark" ? "border-orange-500 bg-slate-900 text-white" : "border-slate-200 bg-white"}`}><div className="font-black">Dark mode</div><div className="mt-1 text-xs opacity-70">Lower-light workspace.</div></button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="font-black text-slate-900">Profile visibility</div><div className="text-xs text-slate-500">Control whether your Work Identity can be discovered by businesses.</div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{currentPerson?.profile_visibility || "discoverable"}</span></div>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="green" onClick={async()=>{if(currentPerson){const {data,error}=await supabase.from("Job seekers").update({profile_visibility:"discoverable"}).eq("id",currentPerson.id).select().single(); if(error)return flash(error.message);setCurrentPerson(data as Person);setPeople(old=>old.map(p=>p.id===currentPerson.id?data as Person:p));flash("Profile is now discoverable.");}}}>Make discoverable</Button><Button variant="light" onClick={async()=>{if(currentPerson){const {data,error}=await supabase.from("Job seekers").update({profile_visibility:"hidden"}).eq("id",currentPerson.id).select().single();if(error)return flash(error.message);setCurrentPerson(data as Person);setPeople(old=>old.map(p=>p.id===currentPerson.id?data as Person:p));flash("Profile hidden from discovery.");}}}>Hide profile</Button></div>
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">Notifications</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button onClick={()=>saveNotificationPreferences({portal_enabled:!(notificationPreference?.portal_enabled!==false)})} className="rounded-2xl border border-slate-200 p-4 text-left"><div className="font-black">Portal alerts</div><div className="mt-1 text-xs text-slate-500">{notificationPreference?.portal_enabled === false ? "Off" : "On"}</div></button><button onClick={()=>nav("alerts")} className="rounded-2xl border border-slate-200 p-4 text-left"><div className="font-black">WhatsApp alerts</div><div className="mt-1 text-xs text-slate-500">Manage R10/month delivery.</div></button></div>
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">Language & accessibility</h2><div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="font-bold">English (EN)</div><div className="mt-1 text-xs text-slate-500">GUARDIAN WORK currently uses English. No automatic locale switching.</div></div>
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">App controls</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Button variant="light" onClick={()=>loadAll()}>Refresh platform data</Button><Button variant="light" onClick={()=>{window.localStorage.removeItem("guardian-work-theme");setTheme("light");flash("Local display preferences reset.");}}>Reset display preferences</Button><Button variant="light" onClick={()=>nav("profile")}>View my profile</Button><Button variant="light" onClick={()=>nav("work")}>Edit Work Identity</Button></div>
      </Card>

      <Card className="p-6"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Privacy</div><h2 className="mt-1 font-black text-slate-900">Your information should work for you.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Control discoverability before sharing your work identity. Production access controls, authentication and server-side payment handling should be enabled before broad public launch.</p></Card>
      <div className="text-xs text-slate-400">GUARDIAN WORK V6.0 - Match Engine - Secure Accounts - Smart Discovery - Saved Work</div>
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
    if (active === "matches") return renderMatches();
    if (active === "saved") return renderSaved();
    if (active === "applications") return renderApplications();
    if (active === "alerts") return renderAlerts();
    if (active === "business") return renderBusiness();
    if (active === "operations") return renderOperations();
    if (active === "profile") return renderProfile();
    return renderSettings();
  };

  if (!authReady) {
    return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" /><div className="mt-4 font-black text-slate-700">Connecting securely...</div></div></div>;
  }

  if (!authUser) return renderAuthScreen();
  if (!account) return renderOnboarding();

  return (
    <div className={`guardian-work ${theme === "dark" ? "guardian-dark" : ""} min-h-screen bg-slate-50 text-slate-900`}>
      <style jsx global>{`
        .guardian-dark { background:#0b1220 !important; color:#e5e7eb !important; }
        .guardian-dark .bg-white { background:#111827 !important; }
        .guardian-dark .bg-slate-50 { background:#0b1220 !important; }
        .guardian-dark .bg-slate-100 { background:#172033 !important; }
        .guardian-dark .bg-slate-200 { background:#1f2937 !important; }
        .guardian-dark .text-slate-900 { color:#f8fafc !important; }
        .guardian-dark .text-slate-800 { color:#f1f5f9 !important; }
        .guardian-dark .text-slate-700 { color:#e2e8f0 !important; }
        .guardian-dark .text-slate-600 { color:#cbd5e1 !important; }
        .guardian-dark .text-slate-500 { color:#94a3b8 !important; }
        .guardian-dark .text-slate-400 { color:#94a3b8 !important; }
        .guardian-dark .border-slate-100, .guardian-dark .border-slate-200 { border-color:#263244 !important; }
        .guardian-dark input, .guardian-dark textarea, .guardian-dark select { background:#111827 !important; color:#f8fafc !important; border-color:#334155 !important; }
      `}</style>
      {renderHeader()}

      {message && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-xl">
          <span className="mr-2 text-orange-500">-</span>{message}
        </div>
      )}

      {paymentOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">WhatsApp Alerts</div><h2 className="mt-1 text-2xl font-black text-slate-900">Choose how to pay R10/month</h2><p className="mt-2 text-sm text-slate-500">Select a payment option. The subscription will remain pending until a real payment provider confirms payment.</p></div><button onClick={()=>setPaymentOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 grid gap-2">
              {[['airtime','Pay via airtime / SIM billing'],['voucher','Pay with voucher'],['credit_card','Credit or debit card'],['eft','EFT / bank transfer']].map(([value,label])=><button key={value} onClick={()=>setPaymentMethod(value)} className={`rounded-2xl border p-4 text-left ${paymentMethod===value?'border-orange-500 bg-orange-50':'border-slate-200'}`}><div className="font-black text-slate-900">{label}</div><div className="mt-1 text-xs text-slate-500">External payment method</div></button>)}
            </div>
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setPaymentOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" onClick={confirmWhatsAppPaymentMethod}>Continue</Button></div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:py-8">
        {renderContent()}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <b className="text-emerald-700">GUARDIAN</b>{" "}
            <b className="text-orange-500">WORK</b> - Make your ability discoverable.
          </div>
          <div>V5.9 - Secure Accounts, Smart Discovery & Real Workspaces</div>
        </div>
      </footer>

      {renderMobileNav()}
    </div>
  );
}
