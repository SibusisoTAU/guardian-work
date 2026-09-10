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
  circle_id?: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
};

type PostAttachment = {
  id: string;
  post_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  public_url: string;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
};

type CommentAttachment = {
  id: string;
  comment_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  public_url: string;
  created_at: string;
};

type PostReaction = { id: string; post_id: string; reactor_auth_user_id: string; reaction_type: string; created_at: string };
type PostSave = { id: string; post_id: string; saver_auth_user_id: string; created_at: string };
type PostFollow = { id: string; follower_auth_user_id: string; target_type: string; target_id: string; created_at: string };

type WorkCircle = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  province: string | null;
  town: string | null;
  category: string | null;
  created_by: string | null;
  member_count: number;
  created_at: string;
};

type WorkCircleMember = {
  id: string;
  circle_id: string;
  user_id: string;
  created_at: string;
};

type WorkID = {
  id: string;
  job_seeker_id: string;
  public_slug: string;
  headline: string | null;
  summary: string | null;
  services: string | null;
  discoverable: boolean;
  created_at: string;
  updated_at: string;
};

type WorkProof = {
  id: string;
  job_seeker_id: string;
  proof_type: string;
  title: string;
  description: string | null;
  evidence_url: string | null;
  evidence_date: string | null;
  status: string;
  created_at: string;
};

type WorkRecommendation = {
  id: string;
  job_seeker_id: string;
  recommender_user_id: string;
  relationship: string | null;
  message: string;
  status: string;
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
  whatsapp_payment_method?: string | null;
  whatsapp_payment_status?: string | null;
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

type ContactRequest = {
  id: string;
  business_id: string;
  job_seeker_id: string;
  message: string;
  opportunity_id: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
};

type SecurityEvent = {
  id: string;
  user_id: string;
  event_type: string;
  metadata: any;
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
  package_code?: string | null;
  daily_budget_cents?: number | null;
  billing_status?: string | null;
  placement?: string | null;
  campaign_goal?: string | null;
  created_at: string;
};

type AdImpression = {
  id: string;
  ad_id: string;
  job_seeker_id: string | null;
  event_type: "impression" | "click";
  created_at: string;
};

type AdPaymentRequest = {
  id: string;
  business_id: string;
  ad_id: string;
  amount_cents: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type WhatsAppPaymentRequest = {
  id: string;
  job_seeker_id: string;
  amount_cents: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type SupportRequest = {
  id: string;
  user_id: string;
  role: string;
  support_type: "monthly" | "one_off" | "company_sponsor";
  amount_cents: number;
  payment_method: string;
  purpose: string | null;
  status: string;
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
  ["support", "Support"],
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

function normalizeWhatsAppNumber(value: string | null | undefined) {
  let digits = safeText(value).replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "27" + digits.slice(1);
  if (!digits.startsWith("27") && digits.length === 9) digits = "27" + digits;
  return digits;
}

function openWhatsApp(value: string | null | undefined, message = "Hi, I found you on GUARDIAN WORK.") {
  const number = normalizeWhatsAppNumber(value);
  if (!number || number.length < 11) return false;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) window.location.assign(url);
  return true;
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
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
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

const AD_PACKAGES = [
  { code: "starter", name: "Starter", price: 50, description: "Local timeline reach", frequency: 2 },
  { code: "local", name: "Local Boost", price: 150, description: "Stronger local visibility", frequency: 4 },
  { code: "growth", name: "Growth", price: 300, description: "High-frequency discovery", frequency: 6 },
] as const;

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
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [cvs, setCVs] = useState<CVDocument[]>([]);
  const [analyses, setAnalyses] = useState<CVAnalysis[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postAttachments, setPostAttachments] = useState<PostAttachment[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentAttachments, setCommentAttachments] = useState<Record<string, CommentAttachment[]>>({});
  const [commentFiles, setCommentFiles] = useState<Record<string, File[]>>({});
  const [commentUploadBusy, setCommentUploadBusy] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postReactions, setPostReactions] = useState<Record<string, string>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});
  const [feedFilter, setFeedFilter] = useState("all");
  const [workCircles, setWorkCircles] = useState<WorkCircle[]>([]);
  const [circleMembers, setCircleMembers] = useState<WorkCircleMember[]>([]);
  const [selectedCircleId, setSelectedCircleId] = useState("");
  const [circleBusy, setCircleBusy] = useState<string | null>(null);
  const [workId, setWorkId] = useState<WorkID | null>(null);
  const [workProofs, setWorkProofs] = useState<WorkProof[]>([]);
  const [workRecommendations, setWorkRecommendations] = useState<WorkRecommendation[]>([]);
  const [proofForm, setProofForm] = useState({ proof_type: "portfolio", title: "", description: "", evidence_url: "", evidence_date: "" });
  const [workIdSaving, setWorkIdSaving] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<GuardianNotification[]>([]);
  const [notificationPreference, setNotificationPreference] = useState<NotificationPreference | null>(null);
  const [matchRefreshing, setMatchRefreshing] = useState(false);
  const [matchDismissed, setMatchDismissed] = useState<string[]>([]);
  const [sponsoredAds, setSponsoredAds] = useState<SponsoredAd[]>([]);
  const [adImpressions, setAdImpressions] = useState<AdImpression[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);
  const [businessShortlists, setBusinessShortlists] = useState<BusinessShortlist[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<Person | null>(null);
  const [selectedTalentWorkId, setSelectedTalentWorkId] = useState<WorkID | null>(null);
  const [selectedTalentProofs, setSelectedTalentProofs] = useState<WorkProof[]>([]);
  const [selectedTalentRecommendations, setSelectedTalentRecommendations] = useState<WorkRecommendation[]>([]);
  const [talentProfileBusy, setTalentProfileBusy] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityBusy, setSecurityBusy] = useState(false);
  const [deleteRequestBusy, setDeleteRequestBusy] = useState(false);
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
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [supportType, setSupportType] = useState<"monthly" | "one_off" | "company_sponsor">("monthly");
  const [supportAmount, setSupportAmount] = useState("50");
  const [supportPurpose, setSupportPurpose] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportBusy, setSupportBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [adPaymentOpen, setAdPaymentOpen] = useState(false);
  const [adPaymentMethod, setAdPaymentMethod] = useState("credit_card");
  const [adCampaignBusy, setAdCampaignBusy] = useState(false);
  const [adPackage, setAdPackage] = useState("starter");
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
  const [postTitle, setPostTitle] = useState("");
  const [postType, setPostType] = useState("general");
  const [postFiles, setPostFiles] = useState<File[]>([]);
  const [postUploadBusy, setPostUploadBusy] = useState(false);
  const [profilePhotoBusy, setProfilePhotoBusy] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

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

  const requestPasswordReset = async () => {
    const email = authEmail.trim();
    if (!email) return setAuthMessage("Enter your email address first.");
    setAuthBusy(true);
    setAuthMessage("");
    const redirectTo = `${window.location.origin}/?recovery=1`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setAuthBusy(false);
    if (error) return setAuthMessage(error.message);
    setAuthMessage("If an account exists for that email, a password reset link has been sent. Check your inbox and spam folder.");
  };

  const updateRecoveredPassword = async () => {
    if (recoveryPassword.length < 6) return setRecoveryMessage("Password must be at least 6 characters.");
    if (recoveryPassword !== recoveryConfirmPassword) return setRecoveryMessage("The passwords do not match.");
    setRecoveryBusy(true);
    setRecoveryMessage("");
    const { error } = await supabase.auth.updateUser({ password: recoveryPassword });
    setRecoveryBusy(false);
    if (error) return setRecoveryMessage(error.message);
    setRecoveryPassword("");
    setRecoveryConfirmPassword("");
    setRecoveryMessage("Password updated successfully. Your GUARDIAN WORK account is secure again.");
    setTimeout(() => setRecoveryMode(false), 900);
  };

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
    const currentUserId = authUser?.id || null;
    const [
      peopleRes,
      businessesRes,
      opportunitiesRes,
      cvsRes,
      analysesRes,
      postsRes,
      postAttachmentsRes,
      applicationsRes,
      notificationsRes,
      preferenceRes,
      adsRes,
      impressionsRes,
      savedRes,
      shortlistRes,
      contactRequestsRes,
      feedbackRes,
      reactionsRes,
      postSavesRes,
      followsRes,
      circlesRes,
      circleMembersRes,
      workIdRes,
      proofsRes,
      recommendationsRes,
    ] = await Promise.all([
      supabase.from("Job seekers").select("*").order("name"),
      supabase.from("businesses").select("*").order("created_at", { ascending: false }),
      supabase.from("opportunities").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("cv_analysis").select("*").order("created_at", { ascending: false }),
      supabase.from("posts").select("*").eq("status", "published").order("created_at", { ascending: false }),
      supabase.from("post_attachments").select("*").order("created_at", { ascending: true }),
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
      currentPerson || currentBusiness
        ? (() => {
            let q = supabase.from("guardian_contact_requests").select("*").order("created_at", { ascending: false }).limit(100);
            if (currentPerson) q = q.eq("job_seeker_id", currentPerson.id) as any;
            else if (currentBusiness) q = q.eq("business_id", currentBusiness.id) as any;
            return q;
          })()
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("match_feedback").select("*").eq("job_seeker_id", currentPerson.id).order("created_at", { ascending: false }).limit(100)
        : Promise.resolve({ data: [], error: null }),
      supabase.from("post_reactions").select("*").order("created_at", { ascending: false }),
      currentUserId
        ? supabase.from("post_saves").select("*").eq("saver_auth_user_id", currentUserId).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      supabase.from("post_follows").select("*").order("created_at", { ascending: false }),
      supabase.from("guardian_work_circles").select("*").order("member_count", { ascending: false }).order("created_at", { ascending: false }),
      currentUserId
        ? supabase.from("guardian_work_circle_members").select("*").eq("user_id", currentUserId)
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("guardian_work_ids").select("*").eq("job_seeker_id", currentPerson.id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      currentPerson
        ? supabase.from("guardian_work_proofs").select("*").eq("job_seeker_id", currentPerson.id).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      currentPerson
        ? supabase.from("guardian_work_recommendations").select("*").eq("job_seeker_id", currentPerson.id).eq("status", "visible").order("created_at", { ascending: false })
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
    if (!postAttachmentsRes.error) setPostAttachments((postAttachmentsRes.data || []) as PostAttachment[]);
    if (!applicationsRes.error) setApplications((applicationsRes.data || []) as Application[]);
    if (!notificationsRes.error) setNotifications((notificationsRes.data || []) as GuardianNotification[]);
    if (!preferenceRes.error) setNotificationPreference((preferenceRes.data || null) as NotificationPreference | null);
    if (!adsRes.error) setSponsoredAds((adsRes.data || []) as SponsoredAd[]);
    if (!impressionsRes.error) setAdImpressions((impressionsRes.data || []) as AdImpression[]);
    if (!savedRes.error) setSavedOpportunities((savedRes.data || []) as SavedOpportunity[]);
    if (!shortlistRes.error) setBusinessShortlists((shortlistRes.data || []) as BusinessShortlist[]);
    if (!contactRequestsRes.error) setContactRequests((contactRequestsRes.data || []) as ContactRequest[]);
    if (!feedbackRes.error) setMatchFeedback((feedbackRes.data || []) as MatchFeedback[]);
    if (!reactionsRes.error) {
      const map: Record<string, string> = {};
      ((reactionsRes.data || []) as PostReaction[]).filter(r => r.reactor_auth_user_id === currentUserId).forEach(r => { map[r.post_id] = r.reaction_type; });
      setPostReactions(map);
      const counts: Record<string, number> = {};
      ((reactionsRes.data || []) as PostReaction[]).forEach(r => { counts[r.post_id] = (counts[r.post_id] || 0) + 1; });
      setPosts(old => old.map(p => ({ ...p, likes_count: Math.max(p.likes_count || 0, counts[p.id] || 0) })));
    }
    if (!postSavesRes.error) {
      const map: Record<string, boolean> = {};
      ((postSavesRes.data || []) as PostSave[]).forEach(r => { map[r.post_id] = true; });
      setSavedPosts(map);
    }
    if (!followsRes.error) {
      const map: Record<string, boolean> = {};
      ((followsRes.data || []) as PostFollow[]).filter(f => f.follower_auth_user_id === currentUserId).forEach(f => { map[`${f.target_type}:${f.target_id}`] = true; });
      setFollowedAuthors(map);
    }
    if (!circlesRes.error) setWorkCircles((circlesRes.data || []) as WorkCircle[]);
    if (!circleMembersRes.error) setCircleMembers((circleMembersRes.data || []) as WorkCircleMember[]);
    if (!workIdRes.error) setWorkId((workIdRes.data || null) as WorkID | null);
    if (!proofsRes.error) setWorkProofs((proofsRes.data || []) as WorkProof[]);
    if (!recommendationsRes.error) setWorkRecommendations((recommendationsRes.data || []) as WorkRecommendation[]);

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

    // Important: do not await Supabase database queries inside
    // onAuthStateChange. Supabase auth holds an internal lock while
    // firing this callback, and awaiting another Supabase request here
    // can leave the app stuck on "Connecting securely...".
    const finishAuth = (user: any) => {
      if (!mounted) return;
      setAuthUser(user || null);
      setAuthReady(true);
      window.setTimeout(() => {
        if (mounted) void hydrateAccount(user || null);
      }, 0);
    };

    supabase.auth.getSession()
      .then(({ data }) => finishAuth(data.session?.user || null))
      .catch((error) => {
        if (!mounted) return;
        setAuthUser(null);
        setAuthReady(true);
        setAuthMessage(error?.message || "Could not connect to secure sign-in.");
      });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setRecoveryMessage("");
        setRecoveryPassword("");
        setRecoveryConfirmPassword("");
      }
      finishAuth(session?.user || null);
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
  }, [currentPerson?.id, sponsoredAds.map(a => a.id).join(","), adImpressions.length]);

  const createSponsoredAd = async () => {
    if (account?.role !== "business" || !currentBusiness) return flash("Only an authenticated business account can create ads.");
    if (!adForm.title.trim() || !adForm.cta_url.trim()) return flash("Ad title and destination URL are required.");
    const selectedPackage = AD_PACKAGES.find(x => x.code === adPackage) || AD_PACKAGES[0];
    setAdCampaignBusy(true);
    const { data, error } = await supabase.from("sponsored_ads").insert({
      ...adForm,
      business_id: currentBusiness.id,
      status: "draft",
      package_code: selectedPackage.code,
      daily_budget_cents: selectedPackage.price * 100,
      billing_status: "pending",
      placement: "timeline",
      campaign_goal: "timeline_discovery"
    }).select().single();
    if (error) { setAdCampaignBusy(false); return flash(error.message); }
    setSponsoredAds(old => [data as SponsoredAd, ...old]);
    const { error: paymentError } = await supabase.from("guardian_ad_payment_requests").insert({
      business_id: currentBusiness.id,
      ad_id: data.id,
      amount_cents: selectedPackage.price * 100,
      payment_method: adPaymentMethod,
      status: "pending"
    });
    setAdCampaignBusy(false);
    if (paymentError) return flash(`Campaign saved, but payment request could not be created: ${paymentError.message}`);
    setAdPaymentOpen(false);
    setAdForm({ title:"", body:"", cta_label:"Learn more", cta_url:"", target_province:"", target_town:"", target_skills:"", daily_frequency_cap:selectedPackage.frequency });
    flash(`Ad campaign created. R${selectedPackage.price}/day payment is pending; it will go live after a real payment confirmation.`);
  };

  const startAdCampaign = () => {
    if (account?.role !== "business" || !currentBusiness) return flash("Business account required to advertise.");
    if (!adForm.title.trim() || !adForm.cta_url.trim()) return flash("Add an ad title and destination first.");
    setAdPaymentOpen(true);
  };

  const openAd = (ad: SponsoredAd) => {
    if (!ad.cta_url) return flash("This sponsored ad has no destination yet.");
    recordAdEvent(ad.id, "click");
    window.open(ad.cta_url, "_blank", "noopener,noreferrer");
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
      match_version: "V6.6.1",
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
      job_seeker_id: currentPerson.id, portal_enabled: next.portal_enabled, whatsapp_enabled: next.whatsapp_enabled, whatsapp_opt_in: next.whatsapp_opt_in, whatsapp_subscription_status: next.whatsapp_subscription_status, whatsapp_subscription_expires_at: next.whatsapp_subscription_expires_at, whatsapp_payment_method: (next as any).whatsapp_payment_method || null, whatsapp_payment_status: (next as any).whatsapp_payment_status || "pending"
    }, { onConflict: "job_seeker_id" }).select().single();
    if (error) return flash(error.message);
    setNotificationPreference(data as NotificationPreference);
    flash("Notification preferences saved.");
  };

  const markNotificationRead = async (n: GuardianNotification) => {
    if (n.read_at) return;
    const readAt = new Date().toISOString();
    const { error } = await supabase.from("guardian_notifications").update({ read_at: readAt }).eq("id", n.id);
    if (error) return flash(error.message);
    setNotifications(old => old.map(x => x.id === n.id ? { ...x, read_at: readAt } : x));
  };

  const refreshMatches = async () => {
    setMatchRefreshing(true);
    try {
      await persistSmartMatches();
    } finally {
      setMatchRefreshing(false);
    }
  };

  const activateWhatsAppPlan = async () => {
    if (!currentPerson) return;
    setPaymentOpen(true);
  };

  const confirmWhatsAppPaymentMethod = async () => {
    if (!currentPerson) return;
    const { error } = await supabase.from("guardian_whatsapp_payment_requests").insert({
      job_seeker_id: currentPerson.id,
      amount_cents: 1000,
      payment_method: paymentMethod,
      status: "pending"
    });
    if (error) return flash(error.message);
    await saveNotificationPreferences({ whatsapp_enabled: true, whatsapp_opt_in: true, whatsapp_subscription_status: "pending", whatsapp_payment_method: paymentMethod, whatsapp_payment_status: "pending" } as any);
    setPaymentOpen(false);
    flash(`WhatsApp activation request created via ${paymentMethod.replace("_", " ")}. It remains pending until a real payment provider confirms R10.`);
  };

  const testWhatsAppAlerts = () => {
    if (!currentPerson?.phone) return flash("Add your mobile number to your Work Identity before testing WhatsApp.");
    const opened = openWhatsApp(currentPerson.phone, "Hi GUARDIAN WORK, I am testing my WhatsApp connection.");
    if (!opened) flash("That phone number could not be converted into a WhatsApp number. Please check the number format.");
  };

  const flash = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  };

  const saveWorkID = async () => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    setWorkIdSaving(true);
    const payload = {
      job_seeker_id: currentPerson.id,
      public_slug: `${(currentPerson.name || "worker").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "worker"}-${currentPerson.id.slice(0, 8)}`,
      headline: workForm.headline || currentPerson.headline || currentPerson.job_title || "Work seeker",
      summary: workId?.summary || "",
      services: workId?.services || currentPerson.skills || "",
      discoverable: currentPerson.profile_visibility !== "hidden",
    };
    const { data, error } = await supabase.from("guardian_work_ids").upsert(payload, { onConflict: "job_seeker_id" }).select().single();
    setWorkIdSaving(false);
    if (error) return flash(error.message);
    setWorkId(data as WorkID);
    flash("GUARDIAN WORK ID updated.");
  };

  const addWorkProof = async () => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    if (!proofForm.title.trim()) return flash("Give your proof a title.");
    const { data, error } = await supabase.from("guardian_work_proofs").insert({
      job_seeker_id: currentPerson.id,
      proof_type: proofForm.proof_type,
      title: proofForm.title.trim(),
      description: proofForm.description.trim() || null,
      evidence_url: proofForm.evidence_url.trim() || null,
      evidence_date: proofForm.evidence_date || null,
      status: "self_added",
    }).select().single();
    if (error) return flash(error.message);
    setWorkProofs(old => [data as WorkProof, ...old]);
    setProofForm({ proof_type: "portfolio", title: "", description: "", evidence_url: "", evidence_date: "" });
    flash("Proof added to your Work ID. It is marked self-added until a real verification process exists.");
  };

  const deleteWorkProof = async (proof: WorkProof) => {
    const { error } = await supabase.from("guardian_work_proofs").delete().eq("id", proof.id);
    if (error) return flash(error.message);
    setWorkProofs(old => old.filter(x => x.id !== proof.id));
    flash("Proof removed.");
  };

  const toggleWorkDiscovery = async (discoverable: boolean) => {
    if (!currentPerson) return;
    const { data, error } = await supabase.from("Job seekers").update({ profile_visibility: discoverable ? "discoverable" : "hidden" }).eq("id", currentPerson.id).select().single();
    if (error) return flash(error.message);
    setCurrentPerson(data as Person);
    setPeople(old => old.map(p => p.id === currentPerson.id ? data as Person : p));
    if (workId) {
      const { data: updated, error: idError } = await supabase.from("guardian_work_ids").update({ discoverable }).eq("id", workId.id).select().single();
      if (!idError && updated) setWorkId(updated as WorkID);
    }
    flash(discoverable ? "Your Work ID is discoverable." : "Your Work ID is hidden from discovery.");
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

  const shortlistPerson = async (person: Person, note = "Interview consideration") => {
    if (!currentBusiness) return flash("Create or select a business first.");
    const existing = businessShortlists.find(x => x.job_seeker_id === person.id && x.business_id === currentBusiness.id);
    if (existing) return flash(`${person.name || "Candidate"} is already shortlisted.`);
    const { data, error } = await supabase.from("business_shortlists").insert({ business_id: currentBusiness.id, job_seeker_id: person.id, status: "saved", note }).select().single();
    if (error) return flash(error.message);
    setBusinessShortlists(old => [data as BusinessShortlist, ...old]);
    flash(`${person.name || "Candidate"} shortlisted for interview consideration.`);
  };

  const removeShortlistPerson = async (id: string) => {
    const { error } = await supabase.from("business_shortlists").delete().eq("id", id);
    if (error) return flash(error.message);
    setBusinessShortlists(old => old.filter(x => x.id !== id));
    flash("Candidate removed from shortlist.");
  };

  const recordSecurityEvent = async (eventType: string, metadata: any = {}) => {
    if (!authUser) return;
    const { data, error } = await supabase.from("guardian_security_events").insert({ user_id: authUser.id, event_type: eventType, metadata }).select().single();
    if (!error && data) setSecurityEvents(old => [data as SecurityEvent, ...old].slice(0, 20));
  };

  const loadSecurityEvents = async () => {
    if (!authUser) return;
    const { data } = await supabase.from("guardian_security_events").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }).limit(20);
    setSecurityEvents((data || []) as SecurityEvent[]);
  };

  const exportMyData = async () => {
    if (!authUser || !currentPerson) return flash("A signed-in job seeker account is required for data export.");
    setSecurityBusy(true);
    try {
      const [person, acct, wid, proofs, apps, saved, prefs, requests] = await Promise.all([
        supabase.from("Job seekers").select("*").eq("id", currentPerson.id).maybeSingle(),
        supabase.from("guardian_accounts").select("*").eq("user_id", authUser.id).maybeSingle(),
        supabase.from("guardian_work_ids").select("*").eq("job_seeker_id", currentPerson.id).maybeSingle(),
        supabase.from("guardian_work_proofs").select("*").eq("job_seeker_id", currentPerson.id),
        supabase.from("applications").select("*").eq("job_seeker_id", currentPerson.id),
        supabase.from("saved_opportunities").select("*").eq("job_seeker_id", currentPerson.id),
        supabase.from("notification_preferences").select("*").eq("job_seeker_id", currentPerson.id).maybeSingle(),
        supabase.from("guardian_contact_requests").select("*").eq("job_seeker_id", currentPerson.id),
      ]);
      const payload = { exported_at: new Date().toISOString(), account: acct.data, job_seeker: person.data, work_id: wid.data, proofs: proofs.data || [], applications: apps.data || [], saved_opportunities: saved.data || [], notification_preferences: prefs.data, contact_requests: requests.data || [] };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `guardian-work-data-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
      await recordSecurityEvent("data_exported", { record_groups: Object.keys(payload) });
      flash("Your GUARDIAN WORK data export was created.");
    } finally { setSecurityBusy(false); }
  };

  const requestAccountDeletion = async () => {
    if (!authUser || !account) return flash("You must be signed in.");
    if (!window.confirm("Request deletion of your GUARDIAN WORK account? Your account will not be deleted immediately. The request will be reviewed securely.")) return;
    setDeleteRequestBusy(true);
    const { error } = await supabase.from("guardian_account_deletion_requests").insert({ user_id: authUser.id, account_id: account.id, status: "pending", reason: "User requested account deletion" });
    if (error) { setDeleteRequestBusy(false); return flash(error.message); }
    await recordSecurityEvent("account_deletion_requested");
    setDeleteRequestBusy(false);
    flash("Account deletion request submitted securely.");
  };

  const openTalentProfile = async (person: Person) => {
    setSelectedTalent(person); setTalentProfileBusy(true);
    const [wid, proofs, recs] = await Promise.all([
      supabase.from("guardian_work_ids").select("*").eq("job_seeker_id", person.id).maybeSingle(),
      supabase.from("guardian_work_proofs").select("*").eq("job_seeker_id", person.id).order("created_at", { ascending: false }),
      supabase.from("guardian_work_recommendations").select("*").eq("job_seeker_id", person.id).eq("status", "visible").order("created_at", { ascending: false }),
    ]);
    setSelectedTalentWorkId((wid.data || null) as WorkID | null);
    setSelectedTalentProofs((proofs.data || []) as WorkProof[]);
    setSelectedTalentRecommendations((recs.data || []) as WorkRecommendation[]);
    setTalentProfileBusy(false);
  };

  const sendContactRequest = async (person: Person) => {
    if (!currentBusiness) return flash("Business mode is required to contact talent.");
    setContactBusy(true);
    const existing = contactRequests.find(r => r.business_id === currentBusiness.id && r.job_seeker_id === person.id && r.status === "pending");
    if (existing) { setContactBusy(false); return flash("A contact request is already pending for this person."); }
    const { data, error } = await supabase.from("guardian_contact_requests").insert({ business_id: currentBusiness.id, job_seeker_id: person.id, message: `Hello ${person.name || "there"}, we found your Work Identity on GUARDIAN WORK and would like to discuss a work opportunity.`, status: "pending" }).select().single();
    if (error) { setContactBusy(false); return flash(error.message); }
    setContactRequests(old => [data as ContactRequest, ...old]);
    setContactBusy(false);
    setSelectedTalent(null);
    flash("Contact request sent. The job seeker can accept or decline it inside GUARDIAN WORK.");
  };

  const respondToContactRequest = async (request: ContactRequest, status: "accepted" | "declined") => {
    const { data, error } = await supabase.from("guardian_contact_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", request.id).select().single();
    if (error) return flash(error.message);
    setContactRequests(old => old.map(r => r.id === request.id ? data as ContactRequest : r));
    flash(status === "accepted" ? "Contact request accepted." : "Contact request declined.");
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

  const uploadProfilePhoto = async (file: File) => {
    if (!currentPerson || !authUser) return;
    if (!file.type.startsWith("image/")) return flash("Profile photo must be an image.");
    if (file.size > 5 * 1024 * 1024) return flash("Profile photo must be 5MB or smaller.");
    setProfilePhotoBusy(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `profile/${authUser.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { setProfilePhotoBusy(false); return flash(uploadError.message); }
    const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
    const photoUrl = publicData.publicUrl;
    const { data, error } = await supabase.from("Job seekers").update({ profile_photo_url: photoUrl }).eq("id", currentPerson.id).select().single();
    setProfilePhotoBusy(false);
    if (error) return flash(error.message);
    setCurrentPerson(data as Person);
    setPeople(old => old.map(p => p.id === currentPerson.id ? data as Person : p));
    flash("Profile picture updated.");
  };

  const uploadPostAttachments = async (postId: string, files: File[]) => {
    if (!authUser || !files.length) return { ok: true };
    const uploaded: PostAttachment[] = [];
    for (const file of files) {
      if (!(file.type.startsWith("image/") || file.type === "application/pdf" || file.type.startsWith("video/"))) {
        return { ok: false, message: `Unsupported attachment: ${file.name}` };
      }
      if (file.size > 25 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 25MB.` };
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `timeline/${authUser.id}/${postId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { data: attachment, error: attachmentError } = await supabase.from("post_attachments").insert({
        post_id: postId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl
      }).select().single();
      if (attachmentError) return { ok: false, message: attachmentError.message };
      uploaded.push(attachment as PostAttachment);
    }
    setPostAttachments(old => [...old, ...uploaded]);
    return { ok: true };
  };

  const createPost = async () => {
    if ((!postText.trim() && !postFiles.length) || !authUser) return;
    const isBusinessAuthor = account?.role === "business" && !!currentBusiness;
    const authorType = isBusinessAuthor ? "business" : "person";
    const authorId = isBusinessAuthor ? currentBusiness!.id : currentPerson?.id;
    if (!authorId) return flash("Complete your GUARDIAN WORK profile first.");
    setPostUploadBusy(true);
    const payload: any = {
      author_type: authorType,
      author_id: authorId,
      post_type: postType,
      content: postText.trim() || null,
      title: postTitle.trim() || (postType === "availability" ? "Available for work" : null),
      location: [isBusinessAuthor ? currentBusiness?.town : currentPerson?.town, isBusinessAuthor ? currentBusiness?.province : currentPerson?.province].filter(Boolean).join(", "),
      visibility: "public",
      status: "published",
      job_seeker_id: isBusinessAuthor ? null : currentPerson?.id,
      business_id: isBusinessAuthor ? currentBusiness?.id : null,
      circle_id: selectedCircleId || null,
    };
    const { data, error } = await supabase.from("posts").insert(payload).select().single();
    if (error) { setPostUploadBusy(false); return flash(error.message); }
    setPosts(old => [data as Post, ...old]);
    const attachmentResult = await uploadPostAttachments(data.id, postFiles);
    setPostUploadBusy(false);
    setPostText("");
    setPostTitle("");
    setPostFiles([]);
    if (!attachmentResult.ok) return flash(`Post published, but an attachment could not be uploaded: ${attachmentResult.message}`);
    flash(postFiles.length ? "Published with attachments to the GUARDIAN Work Timeline." : "Published to the GUARDIAN Work Timeline.");
  };

  const reactToPost = async (post: Post, reaction: "like" | "support" | "celebrate") => {
    if (!authUser) return;
    const current = postReactions[post.id];
    if (current === reaction) {
      const { error } = await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("reactor_auth_user_id", authUser.id);
      if (error) return flash(error.message);
      setPostReactions(old => { const n = { ...old }; delete n[post.id]; return n; });
      setPosts(old => old.map(p => p.id === post.id ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p));
      return;
    }
    const { error } = await supabase.from("post_reactions").upsert({ post_id: post.id, reactor_auth_user_id: authUser.id, reaction_type: reaction }, { onConflict: "post_id,reactor_auth_user_id" });
    if (error) return flash(error.message);
    setPostReactions(old => ({ ...old, [post.id]: reaction }));
    if (!current) setPosts(old => old.map(p => p.id === post.id ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
  };

  const toggleSavePost = async (post: Post) => {
    if (!authUser) return;
    if (savedPosts[post.id]) {
      const { error } = await supabase.from("post_saves").delete().eq("post_id", post.id).eq("saver_auth_user_id", authUser.id);
      if (error) return flash(error.message);
      setSavedPosts(old => ({ ...old, [post.id]: false }));
      flash("Removed from saved posts.");
    } else {
      const { error } = await supabase.from("post_saves").insert({ post_id: post.id, saver_auth_user_id: authUser.id });
      if (error) return flash(error.message);
      setSavedPosts(old => ({ ...old, [post.id]: true }));
      flash("Saved to your Work collection.");
    }
  };

  const toggleFollowAuthor = async (post: Post) => {
    if (!authUser) return;
    const targetType = post.author_type === "business" ? "business" : "person";
    const targetId = (targetType === "business" ? post.business_id : (post.job_seeker_id || post.author_id));
    if (!targetId) return;
    const key = `${targetType}:${targetId}`;
    if (followedAuthors[key]) {
      const { error } = await supabase.from("post_follows").delete().eq("follower_auth_user_id", authUser.id).eq("target_type", targetType).eq("target_id", targetId);
      if (error) return flash(error.message);
      setFollowedAuthors(old => ({ ...old, [key]: false }));
    } else {
      const { error } = await supabase.from("post_follows").insert({ follower_auth_user_id: authUser.id, target_type: targetType, target_id: targetId });
      if (error) return flash(error.message);
      setFollowedAuthors(old => ({ ...old, [key]: true }));
    }
  };

  const toggleCircleMembership = async (circle: WorkCircle) => {
    if (!authUser) return;
    setCircleBusy(circle.id);
    const joined = circleMembers.some(m => m.circle_id === circle.id && m.user_id === authUser.id);
    if (joined) {
      const { error } = await supabase.from("guardian_work_circle_members").delete().eq("circle_id", circle.id).eq("user_id", authUser.id);
      if (error) { setCircleBusy(null); return flash(error.message); }
      setCircleMembers(old => old.filter(m => !(m.circle_id === circle.id && m.user_id === authUser.id)));
      setWorkCircles(old => old.map(c => c.id === circle.id ? { ...c, member_count: Math.max(0, c.member_count - 1) } : c));
      if (selectedCircleId === circle.id) setSelectedCircleId("");
      flash(`Left ${circle.name}.`);
    } else {
      const { data, error } = await supabase.from("guardian_work_circle_members").insert({ circle_id: circle.id, user_id: authUser.id }).select().single();
      if (error) { setCircleBusy(null); return flash(error.message); }
      setCircleMembers(old => [...old, data as WorkCircleMember]);
      setWorkCircles(old => old.map(c => c.id === circle.id ? { ...c, member_count: c.member_count + 1 } : c));
      flash(`Joined ${circle.name}.`);
    }
    setCircleBusy(null);
  };

  const toggleLike = async (post: Post) => {
    if (!currentPerson) return flash("Create a Work Identity first.");
    const authorId = currentPerson.id;
    const { data: existing, error: lookupError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("author_type", "person")
      .eq("author_id", authorId)
      .maybeSingle();
    if (lookupError) return flash(lookupError.message);

    if (existing) {
      const { error } = await supabase.from("post_likes").delete().eq("id", existing.id);
      if (error) return flash(error.message);
      const { error: countError } = await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "likes_count", p_delta: -1 });
      if (countError) return flash(countError.message);
      setLikedPosts((old) => ({ ...old, [post.id]: false }));
      setPosts((old) => old.map((p) => (p.id === post.id ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p)));
    } else {
      const { error } = await supabase.from("post_likes").insert({ post_id: post.id, author_type: "person", author_id: authorId });
      if (error) return flash(error.message);
      const { error: countError } = await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "likes_count", p_delta: 1 });
      if (countError) return flash(countError.message);
      setLikedPosts((old) => ({ ...old, [post.id]: true }));
      setPosts((old) => old.map((p) => (p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p)));
    }
  };

  const uploadCommentAttachments = async (commentId: string, files: File[]) => {
    if (!authUser || !files.length) return { ok: true, attachments: [] as CommentAttachment[] };
    const uploaded: CommentAttachment[] = [];
    for (const file of files) {
      if (!(file.type.startsWith("image/") || file.type === "application/pdf" || file.type.startsWith("video/"))) {
        return { ok: false, message: `Unsupported attachment: ${file.name}`, attachments: uploaded };
      }
      if (file.size > 25 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 25MB.`, attachments: uploaded };
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `comments/${authUser.id}/${commentId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message, attachments: uploaded };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { data: attachment, error: attachmentError } = await supabase.from("comment_attachments").insert({
        comment_id: commentId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl
      }).select().single();
      if (attachmentError) return { ok: false, message: attachmentError.message, attachments: uploaded };
      uploaded.push(attachment as CommentAttachment);
    }
    return { ok: true, attachments: uploaded };
  };

  const addComment = async (post: Post) => {
    const content = (commentDrafts[post.id] || "").trim();
    const files = commentFiles[post.id] || [];
    if ((!content && !files.length) || !currentPerson) return;
    setCommentUploadBusy(old => ({ ...old, [post.id]: true }));

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_id: post.id,
        author_type: "person",
        author_id: currentPerson.id,
        content: content || "",
      })
      .select()
      .single();

    if (error) { setCommentUploadBusy(old => ({ ...old, [post.id]: false })); return flash(error.message); }

    const attachmentResult = await uploadCommentAttachments(data.id, files);
    await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "comments_count", p_delta: 1 });

    setComments((old) => ({
      ...old,
      [post.id]: [...(old[post.id] || []), data as Comment],
    }));
    setCommentAttachments((old) => ({ ...old, [data.id]: attachmentResult.attachments }));
    setCommentDrafts((old) => ({ ...old, [post.id]: "" }));
    setCommentFiles((old) => ({ ...old, [post.id]: [] }));
    setCommentUploadBusy(old => ({ ...old, [post.id]: false }));
    setPosts((old) =>
      old.map((p) => (p.id === post.id ? { ...p, comments_count: p.comments_count + 1 } : p))
    );
    if (!attachmentResult.ok) return flash(`Comment posted, but an attachment could not be uploaded: ${attachmentResult.message}`);
  };

  const sharePost = async (post: Post) => {
    const { error } = await supabase.from("post_shares").insert({
      post_id: post.id,
      author_type: "person",
      author_id: currentPerson?.id || null,
    });
    if (error) return flash(error.message);
    const { error: countError } = await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "shares_count", p_delta: 1 });
    if (countError) return flash(countError.message);
    setPosts((old) =>
      old.map((p) => (p.id === post.id ? { ...p, shares_count: p.shares_count + 1 } : p))
    );
    const url = `${window.location.origin}/?post=${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || "GUARDIAN WORK", text: post.content.slice(0, 120), url });
        flash("Post shared.");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        flash("Post link copied.");
      } else {
        flash("Post shared. Copy this page link to send it to someone.");
      }
    } catch (shareError: any) {
      if (shareError?.name !== "AbortError") flash("Post recorded. Sharing was cancelled or unavailable.");
    }
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    const loadedComments = (data || []) as Comment[];
    setComments((old) => ({ ...old, [postId]: loadedComments }));
    if (loadedComments.length) {
      const { data: attachmentData } = await supabase
        .from("comment_attachments")
        .select("*")
        .in("comment_id", loadedComments.map(c => c.id))
        .order("created_at", { ascending: true });
      const grouped: Record<string, CommentAttachment[]> = {};
      ((attachmentData || []) as CommentAttachment[]).forEach(a => { grouped[a.comment_id] = [...(grouped[a.comment_id] || []), a]; });
      setCommentAttachments(old => ({ ...old, ...grouped }));
    }
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
    const valid = new Set([...navItems.map(([key]) => key), "profile"]);
    if (!valid.has(id)) return flash("That GUARDIAN WORK section is not available yet.");
    setProfileMenuOpen(false);
    setActive(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderRecoveryScreen = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <Card className="w-full overflow-hidden">
          <div className="bg-emerald-700 p-7 text-white">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-xl font-black">GW</div>
            <div className="mt-5 text-xs font-black uppercase tracking-widest text-orange-300">GUARDIAN WORK V6.7</div>
            <h1 className="mt-2 text-3xl font-black">Reset your password.</h1>
            <p className="mt-2 text-sm leading-6 text-emerald-50">Choose a new password for your secure GUARDIAN WORK account.</p>
          </div>
          <div className="p-6">
            <label className="text-xs font-black text-slate-600">New password</label>
            <input value={recoveryPassword} onChange={e=>setRecoveryPassword(e.target.value)} type="password" placeholder="At least 6 characters" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <label className="mt-4 block text-xs font-black text-slate-600">Confirm new password</label>
            <input value={recoveryConfirmPassword} onChange={e=>setRecoveryConfirmPassword(e.target.value)} type="password" placeholder="Enter the password again" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            {recoveryMessage && <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-800">{recoveryMessage}</div>}
            <Button className="mt-5 w-full" variant="green" disabled={recoveryBusy} onClick={updateRecoveredPassword}>{recoveryBusy ? "Updating securely..." : "Set new password"}</Button>
            <button onClick={()=>{setRecoveryMode(false);setRecoveryMessage("");setRecoveryPassword("");setRecoveryConfirmPassword("");}} className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">Back to GUARDIAN WORK</button>
            <div className="mt-5 text-center text-xs leading-5 text-slate-500">Never share your password or recovery link with anyone.</div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAuthScreen = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-md items-center">
        <Card className="w-full overflow-hidden">
          <div className="bg-emerald-700 p-7 text-white">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 text-xl font-black">GW</div>
            <div className="mt-5 text-xs font-black uppercase tracking-widest text-orange-300">GUARDIAN WORK V6.7</div>
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
            {authMode === "signin" && (
              <button onClick={requestPasswordReset} disabled={authBusy} className="mt-3 text-sm font-black text-emerald-700 hover:text-emerald-800 disabled:opacity-50">Forgot password?</button>
            )}
            {authMessage && <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-800">{authMessage}</div>}
            <Button className="mt-5 w-full" variant={authMode === "signup" ? "orange" : "green"} disabled={authBusy} onClick={authMode === "signup" ? signUp : signIn}>{authBusy ? "Please wait..." : authMode === "signup" ? "Create secure account" : "Sign in securely"}</Button>
            <div className="mt-5 text-center text-xs text-slate-500">V6.6.1 keeps Work ID, proof of ability and stronger discovery active.</div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center">
        <Card className="w-full p-6 sm:p-8">
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.6.1 setup</div>
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
              V6.6.1 - ACTIVE WORK ID + SOCIAL TIMELINE + MATCH ENGINE
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
          <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.7 Match Engine</div><h2 className="mt-1 text-xl font-black text-slate-900">Your Smart Matches</h2><p className="mt-1 text-xs text-slate-500">Ranked by the GUARDIAN Match Engine using transparent skills, location, identity, experience and availability signals.</p></div>
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
                <div>No opportunities yet.</div>
                <Button className="mt-3" variant="orange" onClick={() => nav("jobs")}>Open Jobs</Button>
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

      <Card className="overflow-hidden border-emerald-200">
        <div className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {currentPerson?.profile_photo_url ? <img src={currentPerson.profile_photo_url} alt="Profile" className="h-24 w-24 rounded-3xl object-cover ring-4 ring-emerald-50" /> : <div className="grid h-24 w-24 place-items-center rounded-3xl bg-emerald-100 text-2xl font-black text-emerald-700">{initials(currentPerson?.name || "GW")}</div>}
              <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Profile picture</div><h2 className="mt-1 text-xl font-black text-slate-900">Put a face to your Work Identity.</h2><p className="mt-1 text-sm text-slate-500">Use a clear professional photo so businesses can recognise your profile.</p></div>
            </div>
            <label className="cursor-pointer rounded-xl bg-orange-500 px-4 py-2.5 text-center text-sm font-black text-white">
              {profilePhotoBusy ? "Uploading..." : (currentPerson?.profile_photo_url ? "Change picture" : "Add profile picture")}
              <input type="file" accept="image/*" className="hidden" disabled={profilePhotoBusy} onChange={e => e.target.files?.[0] && uploadProfilePhoto(e.target.files[0])} />
            </label>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-emerald-200">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-emerald-100">GUARDIAN WORK ID · V6.7</div>
              <h2 className="mt-1 text-2xl font-black">Make your ability easy to understand.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Your Work ID brings together your work identity, skills, proof and discoverability in one place. It is designed to help businesses understand what you can do.</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Status</div>
              <div className="mt-1 text-lg font-black">{currentPerson?.profile_visibility === "hidden" ? "Hidden" : "Discoverable"}</div>
            </div>
          </div>
        </div>
        <div className="grid gap-5 p-6 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-orange-500">Public work identity</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{currentPerson?.name || "Your name"}</div>
            <div className="mt-1 text-lg font-bold text-orange-600">{workId?.headline || currentPerson?.headline || currentPerson?.job_title || "Add what you do"}</div>
            <p className="mt-3 text-sm leading-6 text-slate-500">{workId?.summary || "Add a short explanation of the work you do, the problems you solve and the value you bring."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(safeText(workId?.services || currentPerson?.skills).split(/[,;]+/).map(x => x.trim()).filter(Boolean).slice(0, 8)).map(skill => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">{skill}</span>)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="font-black text-slate-900">Discovery control</div>
            <p className="mt-1 text-xs leading-5 text-slate-500">Choose whether businesses can discover your Work ID.</p>
            <div className="mt-4 flex gap-2">
              <Button variant={currentPerson?.profile_visibility === "hidden" ? "light" : "green"} onClick={() => toggleWorkDiscovery(true)}>Discoverable</Button>
              <Button variant={currentPerson?.profile_visibility === "hidden" ? "orange" : "light"} onClick={() => toggleWorkDiscovery(false)}>Hide</Button>
            </div>
            <div className="mt-4 text-xs font-bold text-slate-500">
              {workProofs.length} proof{workProofs.length === 1 ? "" : "s"} · {workRecommendations.length} recommendation{workRecommendations.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-xs font-bold text-slate-600 md:col-span-1">Work ID headline<input value={workId?.headline || workForm.headline || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), headline: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
            <label className="text-xs font-bold text-slate-600 md:col-span-1">About my work<textarea rows={3} value={workId?.summary || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), summary: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="What do you do well?" /></label>
            <label className="text-xs font-bold text-slate-600 md:col-span-1">Services / skills<textarea rows={3} value={workId?.services || currentPerson?.skills || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), services: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="e.g. computer support, data capture, field work" /></label>
          </div>
          <Button className="mt-4" variant="orange" disabled={workIdSaving} onClick={saveWorkID}>{workIdSaving ? "Saving..." : "Save Work ID"}</Button>
        </div>
      </Card>

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

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Proof of ability</div><h2 className="mt-1 text-xl font-black text-slate-900">Show what you can do.</h2><p className="mt-1 text-xs text-slate-500">Add CVs, certificates, portfolio items, achievements or experience evidence.</p></div>
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700">Self-added proof</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <select value={proofForm.proof_type} onChange={e => setProofForm({...proofForm, proof_type:e.target.value})} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="portfolio">Portfolio / Work</option><option value="certificate">Certificate</option><option value="achievement">Achievement</option><option value="experience">Experience</option><option value="cv">CV</option></select>
            <input value={proofForm.title} onChange={e=>setProofForm({...proofForm,title:e.target.value})} placeholder="Proof title" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <textarea value={proofForm.description} onChange={e=>setProofForm({...proofForm,description:e.target.value})} placeholder="Short description" rows={3} className="rounded-xl border border-slate-200 px-3 py-3 text-sm sm:col-span-2" />
            <input value={proofForm.evidence_url} onChange={e=>setProofForm({...proofForm,evidence_url:e.target.value})} placeholder="Evidence link (optional)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input type="date" value={proofForm.evidence_date} onChange={e=>setProofForm({...proofForm,evidence_date:e.target.value})} className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          </div>
          <Button className="mt-3" onClick={addWorkProof}>Add proof</Button>
          <div className="mt-5 space-y-3">
            {workProofs.map(proof => <div key={proof.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-black text-slate-900">{proof.title}</div><div className="mt-1 text-xs font-bold uppercase tracking-wide text-orange-600">{proof.proof_type.replace("_", " ")}</div></div><button onClick={()=>deleteWorkProof(proof)} className="text-xs font-black text-rose-600">Remove</button></div><p className="mt-2 text-sm leading-6 text-slate-500">{proof.description || "No description added."}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{proof.status === "self_added" ? "SELF-ADDED" : proof.status.toUpperCase()}</span>{proof.evidence_date && <span className="text-slate-400">{formatDate(proof.evidence_date)}</span>}{proof.evidence_url && <a href={proof.evidence_url} target="_blank" rel="noreferrer" className="text-emerald-700">Open evidence</a>}</div></div>)}
            {!workProofs.length && <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Your Work ID has no proof items yet. Add something that helps a business understand your ability.</div>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-600">Recommendations</div>
          <h2 className="mt-1 text-xl font-black text-slate-900">Let your work speak through people.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Recommendations can add context to your Work ID. GUARDIAN does not treat a recommendation as formal verification.</p>
          <div className="mt-5 space-y-3">
            {workRecommendations.map(rec => <div key={rec.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-900">Recommendation</div><p className="mt-2 text-sm leading-6 text-slate-600">“{rec.message}”</p>{rec.relationship && <div className="mt-2 text-xs font-bold text-slate-400">{rec.relationship}</div>}</div>)}
            {!workRecommendations.length && <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No recommendations yet. As GUARDIAN's network grows, people can recommend the work they have actually experienced.</div>}
          </div>
        </Card>
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
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.7 Match Engine</div>
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
          {!smartMatches.length && <Card className="border-orange-200 bg-orange-50/50 p-6"><div className="text-xs font-black uppercase tracking-widest text-orange-600">No strong matches yet</div><h3 className="mt-1 font-black text-slate-900">Give GUARDIAN more to work with.</h3><p className="mt-2 text-sm text-slate-600">Complete your Work Identity, add skills, location and availability, then recalculate your matches.</p><Button className="mt-4" variant="orange" onClick={() => nav("work")}>Complete Work Identity</Button></Card>}
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
          <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm text-slate-600"><span className="font-black text-slate-900">Found someone you like?</span> View their Work Profile first, then <span className="font-black text-orange-600">Contact</span> them or <span className="font-black text-emerald-700">Shortlist for interview</span>. No need to wait for an application.</div>
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

  const renderTimeline = () => {
    const visiblePosts = posts.filter(post => {
      if (selectedCircleId && (post as any).circle_id !== selectedCircleId) return false;
      if (feedFilter === "all") return true;
      if (feedFilter === "following") {
        const targetType = post.author_type === "business" ? "business" : "person";
        const targetId = targetType === "business" ? post.business_id : (post.job_seeker_id || post.author_id);
        return !!targetId && !!followedAuthors[`${targetType}:${targetId}`];
      }
      return post.post_type === feedFilter;
    });
    const joinedCircleIds = new Set(circleMembers.filter(m => m.user_id === authUser?.id).map(m => m.circle_id));

    return (
      <div className="mx-auto max-w-3xl space-y-5 pb-8">
        <div className="rounded-3xl bg-emerald-700 p-6 text-white shadow-xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">GUARDIAN WORK SOCIAL</div>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Your work. Your people. Your opportunities.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Show what you can do, discover local talent and businesses, and let useful conversations lead to real opportunity.</p>
            </div>
            <div className="hidden h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl sm:grid">GW</div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["all", "For you"], ["following", "Following"], ["availability", "Available"], ["work_showcase", "Showcase"], ["opportunity", "Opportunities"], ["achievement", "Achievements"]
            ].map(([id, label]) => (
              <button key={id} onClick={() => setFeedFilter(id)} className={`rounded-full px-3 py-2 text-xs font-black ${feedFilter === id ? "bg-white text-emerald-700" : "bg-emerald-600 text-emerald-50 hover:bg-emerald-500"}`}>{label}</button>
            ))}
          </div>
        </div>

        {workCircles.length > 0 && (
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-orange-500">WORK CIRCLES</div>
                  <h2 className="mt-1 text-xl font-black text-slate-900">Find your people.</h2>
                  <p className="mt-1 text-xs text-slate-500">Join local and skill-based circles where work conversations can become opportunities.</p>
                </div>
                {selectedCircleId && <button onClick={() => setSelectedCircleId("")} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-600">Show all posts</button>}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto p-4">
              {workCircles.map(circle => {
                const joined = joinedCircleIds.has(circle.id);
                const selected = selectedCircleId === circle.id;
                return (
                  <div key={circle.id} className={`min-w-[220px] rounded-2xl border p-4 ${selected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                    <button onClick={() => { setSelectedCircleId(circle.id); setFeedFilter("all"); }} className="w-full text-left">
                      <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-lg">◉</span><div className="min-w-0"><div className="truncate text-sm font-black text-slate-900">{circle.name}</div><div className="text-[10px] font-bold text-slate-500">{circle.member_count || 0} members</div></div></div>
                      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{circle.description || "A GUARDIAN WORK community."}</p>
                      <div className="mt-2 text-[10px] font-bold text-emerald-700">{[circle.town, circle.province].filter(Boolean).join(" · ") || circle.category || "Work community"}</div>
                    </button>
                    <button disabled={circleBusy === circle.id} onClick={() => toggleCircleMembership(circle)} className={`mt-3 w-full rounded-xl px-3 py-2 text-xs font-black ${joined ? "bg-slate-100 text-slate-700" : "bg-emerald-600 text-white"}`}>{circleBusy === circle.id ? "Working..." : joined ? "Joined ✓" : "Join circle"}</button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card id="guardian-timeline-composer" className="overflow-hidden border-emerald-100">
          <div className="bg-emerald-700 p-5 text-white sm:p-6"><div className="text-xs font-black uppercase tracking-widest text-orange-300">Create on the Work Timeline</div><h2 className="mt-1 text-xl font-black">Share what you can do.</h2><p className="mt-1 text-sm text-emerald-100">Write your caption and attach the proof, photo, PDF or video that goes with the same post.</p></div>
          <div className="p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={postType} onChange={e=>setPostType(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold"><option value="general">General work update</option><option value="availability">Available for work</option><option value="work_showcase">Work showcase</option><option value="experience">Experience</option><option value="opportunity">Opportunity</option><option value="achievement">Achievement</option><option value="training">Training</option><option value="success">Work success</option></select>
              <input value={postTitle} onChange={e=>setPostTitle(e.target.value)} placeholder="Optional post title" className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none" />
            </div>
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">Caption</label>
            <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="Tell people what you can do, what you have achieved, what you are available for, or what opportunity you want to share..." className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none focus:border-emerald-500" />
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-black text-slate-900">Add to this post</div><div className="mt-1 text-xs text-slate-500">Attachments belong to the caption you are publishing — just like comment attachments.</div></div><div className="flex flex-wrap gap-2">
                <label className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-black text-emerald-700">🖼️ Photo<input type="file" accept="image/*" multiple className="hidden" disabled={postUploadBusy} onChange={e=>{const incoming=Array.from(e.target.files||[]);const existing=postFiles||[];if(existing.length+incoming.length>4)return flash("You can attach up to 4 files per post.");if(incoming.some(f=>f.size>25*1024*1024))return flash("Each attachment must be 25MB or smaller.");setPostFiles(old=>[...old,...incoming]);e.currentTarget.value="";}} /></label>
                <label className="cursor-pointer rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-black text-orange-700">📄 PDF<input type="file" accept="application/pdf" multiple className="hidden" disabled={postUploadBusy} onChange={e=>{const incoming=Array.from(e.target.files||[]);const existing=postFiles||[];if(existing.length+incoming.length>4)return flash("You can attach up to 4 files per post.");if(incoming.some(f=>f.size>25*1024*1024))return flash("Each attachment must be 25MB or smaller.");setPostFiles(old=>[...old,...incoming]);e.currentTarget.value="";}} /></label>
                <label className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-black text-slate-700">🎥 Video<input type="file" accept="video/*" multiple className="hidden" disabled={postUploadBusy} onChange={e=>{const incoming=Array.from(e.target.files||[]);const existing=postFiles||[];if(existing.length+incoming.length>4)return flash("You can attach up to 4 files per post.");if(incoming.some(f=>f.size>25*1024*1024))return flash("Each attachment must be 25MB or smaller.");setPostFiles(old=>[...old,...incoming]);e.currentTarget.value="";}} /></label>
              </div></div>
              {postFiles.length>0 && <div className="mt-3 flex flex-wrap gap-2">{postFiles.map((file,i)=><div key={`${file.name}-${i}`} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm"><span>{file.type.startsWith("video/")?"🎥":file.type==="application/pdf"?"📄":"🖼️"}</span><span className="max-w-[180px] truncate">{file.name}</span><button type="button" onClick={()=>setPostFiles(old=>old.filter((_,idx)=>idx!==i))} className="font-black text-red-500">×</button></div>)}</div>}
              <div className="mt-2 text-[10px] font-bold text-slate-400">Write your caption + attach media to the same post · up to 4 files · 25MB each</div>
            </div>
            <Button className="mt-4 w-full sm:w-auto" variant="orange" disabled={postUploadBusy || (!postText.trim() && !postFiles.length)} onClick={createPost}>{postUploadBusy ? "Publishing..." : postFiles.length ? `Publish caption + ${postFiles.length} attachment${postFiles.length===1?"":"s"}` : "Publish to Timeline"}</Button>
          </div>
        </Card>

        {visiblePosts.map((post, index) => {
          const person = appPerson(post.job_seeker_id || (post.author_type === "person" ? post.author_id : null));
          const business = businesses.find(b => b.id === post.business_id) || (post.author_type === "business" && currentBusiness?.id === post.business_id ? currentBusiness : null);
          const authorName = post.author_type === "business" ? (business?.name || "GUARDIAN business") : (person?.name || "GUARDIAN WORK member");
          const authorSubtitle = post.author_type === "business" ? "Business" : (person?.job_title || "Work identity");
          const targetType = post.author_type === "business" ? "business" : "person";
          const targetId = targetType === "business" ? post.business_id : (post.job_seeker_id || post.author_id);
          const followed = !!targetId && !!followedAuthors[`${targetType}:${targetId}`];
          const reaction = postReactions[post.id];
          return (
            <Fragment key={post.id}>
              <Card className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-black ${post.author_type === "business" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>{initials(authorName)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div><div className="font-black text-slate-900">{authorName}</div><div className="text-xs text-slate-500">{authorSubtitle} · {formatDate(post.created_at)} · {post.location || "South Africa"}</div></div>
                        {targetId && !(targetType === "person" && targetId === currentPerson?.id) && !(targetType === "business" && targetId === currentBusiness?.id) && <button onClick={() => toggleFollowAuthor(post)} className={`rounded-full px-3 py-1.5 text-[10px] font-black ${followed ? "bg-emerald-100 text-emerald-700" : "border border-emerald-200 text-emerald-700"}`}>{followed ? "Following" : "+ Follow"}</button>}
                      </div>
                    </div>
                  </div>

                  {post.title && <div className="mt-4 text-lg font-black text-slate-900">{post.title}</div>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">{post.post_type.replaceAll("_", " ")}</div>
                    {(post as any).circle_id && workCircles.find(c => c.id === (post as any).circle_id) && <button onClick={() => { setSelectedCircleId((post as any).circle_id); setFeedFilter("all"); }} className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">◉ {workCircles.find(c => c.id === (post as any).circle_id)?.name}</button>}
                  </div>
                  {post.content && <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.content}</p>}
                  {postAttachments.filter(a => a.post_id === post.id).length > 0 && <div className="mt-4 grid gap-3">{postAttachments.filter(a => a.post_id === post.id).map(a => a.file_type.startsWith("image/") ? <a key={a.id} href={a.public_url} target="_blank" rel="noreferrer"><img src={a.public_url} alt={a.file_name} className="max-h-[420px] w-full rounded-2xl object-cover" /></a> : a.file_type.startsWith("video/") ? <video key={a.id} controls preload="metadata" className="max-h-[420px] w-full rounded-2xl bg-black" src={a.public_url} /> : <a key={a.id} href={a.public_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4"><span className="text-2xl">📄</span><div><div className="font-black text-slate-900">{a.file_name}</div><div className="text-xs font-bold text-orange-700">Open PDF attachment</div></div></a>)}</div>}

                  {post.opportunity_id && appOpportunity(post.opportunity_id) && (
                    <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4"><div className="text-xs font-black uppercase tracking-wider text-orange-600">Opportunity</div><div className="mt-1 font-black text-slate-900">{appOpportunity(post.opportunity_id)?.title}</div><Button className="mt-3" variant="orange" onClick={() => applyToOpportunity(appOpportunity(post.opportunity_id)!)}>View / Apply</Button></div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400"><span>{post.likes_count || 0} reactions</span><span>{post.comments_count || 0} comments · {post.shares_count || 0} shares</span></div>
                  <div className="mt-2 grid grid-cols-4 gap-1 border-y border-slate-100 py-2">
                    <button onClick={() => reactToPost(post, "like")} className={`rounded-xl px-2 py-2 text-xs font-black ${reaction === "like" ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>👍 Like</button>
                    <button onClick={() => reactToPost(post, "support")} className={`rounded-xl px-2 py-2 text-xs font-black ${reaction === "support" ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}>🤝 Support</button>
                    <button onClick={() => reactToPost(post, "celebrate")} className={`rounded-xl px-2 py-2 text-xs font-black ${reaction === "celebrate" ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>🎉 Celebrate</button>
                    <button onClick={() => toggleSavePost(post)} className={`rounded-xl px-2 py-2 text-xs font-black ${savedPosts[post.id] ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}>{savedPosts[post.id] ? "🔖 Saved" : "🔖 Save"}</button>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input value={commentDrafts[post.id] || ""} onChange={e => setCommentDrafts(old => ({ ...old, [post.id]: e.target.value }))} placeholder="Write a useful work-related comment..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none" />
                      <div className="flex shrink-0 gap-2">
                        <label className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-black text-emerald-700 hover:bg-emerald-100">📎 Attach
                          <input type="file" accept="image/*,application/pdf,video/*" multiple className="hidden" disabled={commentUploadBusy[post.id]} onChange={e => { const incoming = Array.from(e.target.files || []); const existing = commentFiles[post.id] || []; if (existing.length + incoming.length > 4) return flash("You can attach up to 4 files to a comment."); if (incoming.some(f => f.size > 25 * 1024 * 1024)) return flash("Each attachment must be 25MB or smaller."); setCommentFiles(old => ({ ...old, [post.id]: [...existing, ...incoming] })); e.currentTarget.value = ""; }} />
                        </label>
                        <Button variant="light" onClick={async () => { const opening = !expandedComments[post.id]; setExpandedComments(old => ({ ...old, [post.id]: opening })); if (opening) await loadComments(post.id); }}>{expandedComments[post.id] ? "Hide comments" : `Comments (${post.comments_count || 0})`}</Button>
                        <Button variant="orange" disabled={commentUploadBusy[post.id] || (!commentDrafts[post.id]?.trim() && !(commentFiles[post.id] || []).length)} onClick={() => addComment(post)}>{commentUploadBusy[post.id] ? "Posting..." : "Comment"}</Button>
                      </div>
                    </div>
                    {(commentFiles[post.id] || []).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{(commentFiles[post.id] || []).map((file, i) => <div key={`${file.name}-${i}`} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm"><span>{file.type.startsWith("video/") ? "🎥" : file.type === "application/pdf" ? "📄" : "🖼️"}</span><span className="max-w-[160px] truncate">{file.name}</span><button type="button" onClick={() => setCommentFiles(old => ({ ...old, [post.id]: (old[post.id] || []).filter((_, idx) => idx !== i) }))} className="font-black text-red-500">×</button></div>)}</div>}
                    <div className="mt-2 text-[10px] font-bold text-slate-400">Write your comment and attach photos, PDFs or videos to the same comment · up to 4 files</div>
                  </div>
                  {expandedComments[post.id] && <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">{(comments[post.id] || []).length ? (comments[post.id] || []).slice(-10).map(c => <div key={c.id} className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><b className="text-slate-800">{appPerson(c.author_id)?.name || "Member"}</b>{c.content ? <> · {c.content}</> : null}{(commentAttachments[c.id] || []).length > 0 && <div className="mt-3 grid gap-2">{(commentAttachments[c.id] || []).map(a => a.file_type.startsWith("image/") ? <a key={a.id} href={a.public_url} target="_blank" rel="noreferrer"><img src={a.public_url} alt={a.file_name} className="max-h-72 w-full rounded-xl object-cover" /></a> : a.file_type.startsWith("video/") ? <video key={a.id} controls preload="metadata" className="max-h-72 w-full rounded-xl bg-black" src={a.public_url} /> : <a key={a.id} href={a.public_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3"><span>📄</span><span className="font-black text-slate-800">{a.file_name}</span></a>)}</div>}</div>) : <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">No comments yet. Start the conversation.</div>}</div>}
                </div>
              </Card>
              {(index === 0 || index % 3 === 2) && targetedAds.length > 0 && <div className="space-y-3">{targetedAds.slice(0, 1).map(ad => <Card key={`${post.id}-${ad.id}`} className="overflow-hidden border-orange-200 bg-orange-50/40"><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black uppercase text-white">Sponsored</span><span className="text-[10px] font-bold text-slate-400">Paid timeline placement</span></div><h3 className="mt-3 text-lg font-black text-slate-900">{ad.title}</h3>{ad.body && <p className="mt-1 text-sm leading-6 text-slate-600">{ad.body}</p>}<button onClick={()=>openAd(ad)} className="mt-4 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white">{ad.cta_label}</button></div></Card>)}</div>}
            </Fragment>
          );
        })}

        {!visiblePosts.length && <><Card className="p-10 text-center"><div className="text-4xl">🌱</div><h2 className="mt-3 font-black text-slate-900">Your timeline is ready.</h2><p className="mt-1 text-sm text-slate-500">Be the first to share something useful about your work.</p><Button className="mt-4" variant="orange" onClick={() => document.getElementById("guardian-timeline-composer")?.scrollIntoView({ behavior: "smooth", block: "center" })}>Create a Timeline post</Button></Card><Card className="border-orange-200 bg-orange-50/50 p-6"><div className="text-xs font-black uppercase tracking-widest text-orange-600">Advertising space</div><h2 className="mt-1 text-xl font-black text-slate-900">Put your business in front of the right people.</h2><p className="mt-2 text-sm text-slate-600">GUARDIAN WORK sponsored posts can target province, town and skill. Advertisers are always clearly labelled.</p>{account?.role === "business" ? <Button className="mt-4" variant="orange" onClick={()=>nav("business")}>Create a sponsored campaign</Button> : <Button className="mt-4" variant="light" onClick={()=>nav("business")}>Explore business advertising</Button>}</Card></>}
      </div>
    );
  };

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
              {p.profile_photo_url ? <img src={p.profile_photo_url} alt={p.name || "Profile"} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-emerald-50" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">{initials(p.name)}</div>}
              <div className="min-w-0">
                <div className="font-black text-slate-900">{p.name}</div>
                <div className="text-sm font-bold text-orange-600">{p.job_title || "Work seeker"}</div>
                <div className="text-xs text-slate-500">{[p.town, p.province].filter(Boolean).join(" - ")}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{p.headline || p.experience || "Building a discoverable work identity."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="green" onClick={() => openTalentProfile(p)}>View profile</Button>
              <Button variant="light" onClick={() => shortlistPerson(p)}>Save talent</Button>
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

  const renderTalentProfileModal = () => {
    if (!selectedTalent) return null;
    const p = selectedTalent;
    return (
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/60 p-4" onClick={() => setSelectedTalent(null)}>
        <div className="mx-auto mt-8 max-w-2xl" onClick={e => e.stopPropagation()}>
          <Card className="overflow-hidden">
            <div className="bg-emerald-700 p-6 text-white"><div className="flex items-start justify-between gap-4"><div className="flex gap-4">{p.profile_photo_url ? <img src={p.profile_photo_url} alt={p.name || "Profile"} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/30" /> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-orange-100 text-xl font-black text-orange-700">{initials(p.name)}</div>}<div><div className="text-2xl font-black">{p.name || "GUARDIAN WORK member"}</div><div className="font-bold text-orange-300">{p.job_title || "Work seeker"}</div><div className="mt-1 text-xs text-emerald-100">{[p.town,p.province].filter(Boolean).join(" - ")}</div></div></div><button onClick={()=>setSelectedTalent(null)} className="rounded-xl bg-white/10 px-3 py-2 font-black text-white">Close</button></div></div>
            <div className="space-y-5 p-6">
              {talentProfileBusy ? <div className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Loading Work Profile...</div> : <>
                <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Work Identity</div><h2 className="mt-1 text-xl font-black text-slate-900">{selectedTalentWorkId?.headline || p.headline || p.job_title || "Work seeker"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{selectedTalentWorkId?.summary || p.experience || "This person is building a discoverable work identity."}</p></div>
                <div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Skills & ability</div><div className="mt-2 flex flex-wrap gap-2">{safeText(p.skills || selectedTalentWorkId?.services).split(",").filter(Boolean).map(s=><span key={s} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">{s.trim()}</span>)}</div></div>
                <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-500">Experience</div><div className="mt-1 font-black text-slate-900">{p.experience || "Not specified"}</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-500">Availability</div><div className="mt-1 font-black text-slate-900">{p.availability || "Not specified"}</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold text-slate-500">Profile</div><div className="mt-1 font-black text-emerald-700">Discoverable</div></div></div>
                <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Proof of ability</div>{selectedTalentProofs.length ? <div className="mt-2 space-y-2">{selectedTalentProofs.slice(0,6).map(x=><div key={x.id} className="rounded-xl border border-slate-200 p-3"><div className="font-black text-slate-900">{x.title}</div><div className="text-xs text-slate-500">{x.proof_type} · {x.status}</div></div>)}</div> : <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No proof has been added yet.</div>}</div>
                <div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Recommendations</div>{selectedTalentRecommendations.length ? <div className="mt-2 space-y-2">{selectedTalentRecommendations.slice(0,4).map(x=><div key={x.id} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">“{x.message}”</div>)}</div> : <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No recommendations yet.</div>}</div>
                {account?.role === "business" && currentBusiness && <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-5"><Button variant="orange" disabled={contactBusy} onClick={()=>sendContactRequest(p)}>{contactBusy ? "Sending..." : "Contact this person"}</Button><Button variant="light" onClick={()=>shortlistPerson(p)}>Shortlist for interview</Button></div>}
              </>}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderBusiness = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">Business</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Connect business to kasi talent.</h1>
        <p className="mt-2 text-sm text-slate-500">Find people, publish opportunities and put your business in front of the GUARDIAN WORK community.</p>
        {account?.role === "business" && currentBusiness && <Button className="mt-4" variant="orange" onClick={() => document.getElementById("guardian-advertising")?.scrollIntoView({ behavior: "smooth", block: "start" })}>📣 Advertise on Timeline</Button>}
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
          {businessFilteredPeople.slice(0,12).map(p=><Card key={p.id} className="p-4"><div className="flex gap-3">{p.profile_photo_url ? <img src={p.profile_photo_url} alt={p.name || "Profile"} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-emerald-50" /> : <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 font-black text-emerald-700">{initials(p.name)}</div>}<div className="min-w-0"><div className="font-black text-slate-900">{p.name || "Job seeker"}</div><div className="text-sm font-bold text-orange-600">{p.job_title || "Work seeker"}</div><div className="text-xs text-slate-500">{[p.town,p.province].filter(Boolean).join(" - ")}</div></div></div>{p.skills&&<div className="mt-3 line-clamp-2 text-xs text-slate-600">{p.skills}</div>}<div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Discoverable</span><Button className="!px-3 !py-2 text-xs" variant="green" onClick={()=>openTalentProfile(p)}>View profile</Button><Button className="!px-3 !py-2 text-xs" variant="orange" disabled={contactBusy} onClick={()=>sendContactRequest(p)}>{contactBusy ? "Sending..." : "Contact"}</Button><Button className="!px-3 !py-2 text-xs" variant="light" onClick={()=>shortlistPerson(p)}>{businessShortlists.some(x=>x.job_seeker_id===p.id) ? "Shortlisted" : "Shortlist for interview"}</Button></div></Card>)}
          {!businessFilteredPeople.length&&<div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500 md:col-span-2 xl:col-span-3">No discoverable people match those requirements.</div>}
        </div>
      </Card>

      <Card id="guardian-advertising" className="overflow-hidden border-orange-200">
        <div className="bg-orange-500 p-6 text-white">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-100">GUARDIAN WORK ADVERTISING</div>
          <h2 className="mt-1 text-2xl font-black">Put your business in front of the right people.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-50">Create a sponsored Timeline campaign targeted by province, town and skill. Your campaign is saved first, then payment stays pending until a real payment provider confirms it.</p>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-3">{AD_PACKAGES.map(pkg => <button key={pkg.code} onClick={() => { setAdPackage(pkg.code); setAdForm(old => ({ ...old, daily_frequency_cap: pkg.frequency })); }} className={`rounded-2xl border p-4 text-left ${adPackage === pkg.code ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100" : "border-slate-200 bg-white"}`}><div className="flex items-center justify-between gap-2"><span className="font-black text-slate-900">{pkg.name}</span><span className="text-lg font-black text-orange-600">R{pkg.price}/day</span></div><div className="mt-1 text-xs text-slate-500">{pkg.description}</div><div className="mt-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Up to {pkg.frequency} impressions/day per person</div></button>)}</div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input value={adForm.title} onChange={e=>setAdForm({...adForm,title:e.target.value})} placeholder="Ad title" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input value={adForm.cta_url} onChange={e=>setAdForm({...adForm,cta_url:e.target.value})} placeholder="Destination URL (https://...)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <textarea value={adForm.body} onChange={e=>setAdForm({...adForm,body:e.target.value})} placeholder="Tell people about your business, service or opportunity" rows={3} className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input value={adForm.cta_label} onChange={e=>setAdForm({...adForm,cta_label:e.target.value})} placeholder="CTA label e.g. Learn more" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <select value={adForm.target_province} onChange={e=>setAdForm({...adForm,target_province:e.target.value})} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">All provinces</option>{provinces.map(p=><option key={p}>{p}</option>)}</select>
            <input value={adForm.target_town} onChange={e=>setAdForm({...adForm,target_town:e.target.value})} placeholder="Target town / area (optional)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input value={adForm.target_skills} onChange={e=>setAdForm({...adForm,target_skills:e.target.value})} placeholder="Target skill (optional)" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
            <input type="number" min="1" max="20" value={adForm.daily_frequency_cap} onChange={e=>setAdForm({...adForm,daily_frequency_cap:Number(e.target.value)})} placeholder="Daily frequency cap" className="rounded-xl border border-slate-200 px-3 py-3 text-sm" />
          </div>
          {account?.role === "business" && currentBusiness ? <Button className="mt-5" variant="orange" disabled={adCampaignBusy} onClick={startAdCampaign}>{adCampaignBusy ? "Preparing..." : `Continue with ${AD_PACKAGES.find(x=>x.code===adPackage)?.name || "Starter"} · R${AD_PACKAGES.find(x=>x.code===adPackage)?.price || 50}/day`}</Button> : <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Switch to a Business account to create a sponsored campaign.</div>}
          {adPerformance.length > 0 && <div className="mt-6"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Your campaigns</div><div className="mt-2 space-y-2">{adPerformance.map(x=><div key={x.ad.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs"><span className="font-black text-slate-800">{x.ad.title}</span><span className="text-slate-500">{x.ad.status} · {x.impressions} impressions · {x.clicks} clicks</span></div>)}</div></div>}
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

  const createSupportRequest = async () => {
    if (!authUser) return;
    const amount = Number(supportAmount);
    if (!Number.isFinite(amount) || amount <= 0) return flash("Enter a valid support amount.");
    setSupportBusy(true);
    const { data, error } = await supabase.from("guardian_support_requests").insert({
      user_id: authUser.id,
      role: account?.role || "job_seeker",
      support_type: supportType,
      amount_cents: Math.round(amount * 100),
      payment_method: paymentMethod,
      purpose: supportPurpose.trim() || null,
      status: "pending",
    }).select().single();
    setSupportBusy(false);
    if (error) return flash(error.message);
    setSupportRequests(old => [data as SupportRequest, ...old]);
    setSupportModalOpen(false);
    flash(`Support request created via ${paymentMethod.replace("_", " ")}. It remains pending until a real payment provider confirms payment.`);
  };

  const renderSupport = () => (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">GUARDIAN SUPPORT · V6.7</div>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Help turn skill into opportunity.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">GUARDIAN SUPPORT is the support layer of GUARDIAN WORK — helping fund skills, training and the journey from ability to discoverability and work. Payments are never marked successful until a real provider confirms them.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["R25", "Start monthly", "Small, consistent support toward skills and work-readiness."],
          ["R50", "Build monthly", "Help strengthen the pipeline from skill need to proof of ability."],
          ["Custom", "Fund a skill", "Choose an amount and tell GUARDIAN what your support is intended to help."],
        ].map(([amount, title, body]) => <Card key={title} className="p-6 border-emerald-100"><div className="text-2xl font-black text-emerald-700">{amount}</div><div className="mt-2 font-black text-slate-900">{title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{body}</p><Button className="mt-4 w-full" variant="green" onClick={() => { setSupportType("monthly"); setSupportAmount(amount === "Custom" ? "100" : amount.replace("R", "")); setSupportModalOpen(true); }}>Support</Button></Card>)}
      </div>

      <Card className="overflow-hidden border-orange-200">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-white sm:p-8">
          <div className="text-xs font-black uppercase tracking-widest text-orange-300">For businesses</div>
          <h2 className="mt-1 text-2xl font-black">Sponsor a skill. Measure the journey.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Businesses can submit a skills-support request and build toward a future GUARDIAN IMPACT record covering supported programmes, geography, skills and outcomes. Tax or Section 18A treatment is not claimed by this interface; that depends on the legal entity, approval and applicable rules.</p>
          <Button className="mt-5" variant="orange" onClick={() => { setSupportType("company_sponsor"); setSupportAmount("500"); setSupportModalOpen(true); }}>Sponsor a skill</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">My support activity</div><h2 className="mt-1 text-xl font-black text-slate-900">Your requests and commitments.</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{supportRequests.length} request{supportRequests.length === 1 ? "" : "s"}</span></div>
        <div className="mt-5 space-y-2">{supportRequests.length ? supportRequests.slice(0,8).map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4"><div><div className="font-black text-slate-900">{r.support_type === "company_sponsor" ? "Company skills sponsor" : r.support_type === "monthly" ? "Monthly support" : "One-off support"} · R{(r.amount_cents / 100).toFixed(2)}</div><div className="mt-1 text-xs text-slate-500">{r.purpose || "GUARDIAN skills and work support"} · {r.payment_method.replace("_", " ")}</div></div><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{r.status}</span></div>) : <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No support requests yet. Start with a monthly commitment or sponsor a skill.</div>}</div>
      </Card>

      <Card className="p-6 border-emerald-100"><div className="text-xs font-black uppercase tracking-widest text-orange-500">The GUARDIAN pathway</div><div className="mt-4 grid gap-2 sm:grid-cols-6">{["Support", "Skill need", "Training", "Proof", "Discoverability", "Work"].map((x,i)=><div key={x} className="rounded-2xl bg-slate-50 p-3 text-center"><div className="text-lg font-black text-emerald-700">{i+1}</div><div className="mt-1 text-xs font-black text-slate-700">{x}</div></div>)}</div></Card>
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

  const renderAlerts = () => {
    const pref = notificationPreference;
    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">V6.7 - GUARDIAN ALERTS</div>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Never miss an opportunity.</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Choose where GUARDIAN WORK reaches you. Portal alerts are included. WhatsApp Alerts are an external delivery channel at R10/month.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className={`p-5 ${pref?.portal_enabled !== false ? "ring-2 ring-emerald-100" : ""}`}>
            <div className="text-2xl">Status</div><h2 className="mt-3 font-black">GUARDIAN Portal</h2>
            <p className="mt-1 text-sm text-slate-500">Included. Receive alerts inside GUARDIAN WORK.</p>
            <button onClick={() => saveNotificationPreferences({ portal_enabled: !(pref?.portal_enabled !== false) })} className="mt-4 text-xs font-black text-emerald-700">{pref?.portal_enabled === false ? "Enable Portal" : "Portal Enabled"}</button>
          </Card>
          {currentPerson && <Card className="p-5 border-emerald-200"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Employer contact requests</div><h2 className="mt-1 font-black text-slate-900">Businesses can reach you without a WhatsApp subscription.</h2>{contactRequests.filter(r=>r.job_seeker_id===currentPerson.id).length ? <div className="mt-4 space-y-2">{contactRequests.filter(r=>r.job_seeker_id===currentPerson.id).map(r=><div key={r.id} className="rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-900">A business wants to contact you</div><div className="mt-1 text-sm text-slate-600">{r.message}</div><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{r.status}</span>{r.status==="pending"&&<><Button variant="green" onClick={()=>respondToContactRequest(r,"accepted")}>Accept</Button><Button variant="light" onClick={()=>respondToContactRequest(r,"declined")}>Decline</Button></>}</div></div>)}</div> : <div className="mt-3 text-sm text-slate-500">No employer contact requests yet.</div>}</Card>}

          <Card className={`p-5 ${pref?.whatsapp_enabled ? "ring-2 ring-orange-200" : ""}`}>
            <div className="text-2xl">WhatsApp</div><h2 className="mt-3 font-black">WhatsApp Alerts</h2>
            <p className="mt-1 text-sm text-slate-500">External delivery channel - <b>R10/month</b> per job seeker.</p>
            <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs font-bold text-orange-800">Status: {pref?.whatsapp_subscription_status || "inactive"}</div>
            <Button className="mt-4 w-full" variant="orange" onClick={activateWhatsAppPlan}>{pref?.whatsapp_subscription_status === "pending" ? "Update WhatsApp payment" : "Choose WhatsApp - R10/month"}</Button>{currentPerson?.phone && <Button className="mt-2 w-full" variant="light" onClick={testWhatsAppAlerts}>Test WhatsApp connection</Button>}
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

  useEffect(() => {
    if (authUser) void loadSecurityEvents();
  }, [authUser?.id]);

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

      <Card className="p-6 border-emerald-200">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-600">Security & Data</div><h2 className="mt-1 text-xl font-black text-slate-900">Control your GUARDIAN WORK data.</h2><p className="mt-2 text-sm text-slate-500">Export the information associated with your account or submit a protected deletion request.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="green" disabled={securityBusy} onClick={exportMyData}>{securityBusy ? "Preparing..." : "Export my data"}</Button><Button variant="danger" disabled={deleteRequestBusy} onClick={requestAccountDeletion}>{deleteRequestBusy ? "Submitting..." : "Request account deletion"}</Button></div>
        <div className="mt-5"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Recent security activity</div>{securityEvents.length ? <div className="mt-2 space-y-2">{securityEvents.slice(0,5).map(e=><div key={e.id} className="flex justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs"><span className="font-bold text-slate-700">{e.event_type.replace(/_/g," ")}</span><span className="text-slate-400">{formatDate(e.created_at)}</span></div>)}</div> : <div className="mt-2 text-sm text-slate-500">No recent security events.</div>}</div>
      </Card>

      <Card className="p-6">
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">About GUARDIAN WORK</div><h2 className="mt-1 text-xl font-black text-slate-900">Make your ability discoverable.</h2><p className="mt-2 text-sm leading-6 text-slate-600">GUARDIAN WORK is a product of <strong>MY GUARDIAN LINK</strong>, built to connect businesses with people through Work Identity, skills, proof, matching and real opportunities.</p><div className="mt-4 flex flex-wrap gap-2"><a href="mailto:mtausibusiso@gmail.com?subject=GUARDIAN%20WORK%20enquiry" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white">Email Us</a><span className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600">mtausibusiso@gmail.com</span></div></Card>

      <Card className="p-6"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Privacy</div><h2 className="mt-1 font-black text-slate-900">Your information should work for you.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Control discoverability before sharing your work identity. Production access controls, authentication and server-side payment handling should be enabled before broad public launch.</p></Card>
      <div className="text-xs text-slate-400">GUARDIAN WORK V6.7 - Media Profiles + Timeline Attachments + Advertising</div>
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
    if (active === "support") return renderSupport();
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

  if (recoveryMode) return renderRecoveryScreen();
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

      {renderTalentProfileModal()}

      {message && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-xl">
          <span className="mr-2 text-orange-500">-</span>{message}
        </div>
      )}

      {supportModalOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">GUARDIAN SUPPORT</div><h2 className="mt-1 text-2xl font-black text-slate-900">Set up your support request</h2><p className="mt-2 text-sm text-slate-500">This creates a pending payment request. It does not claim that payment has been made.</p></div><button onClick={()=>setSupportModalOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">{[["monthly","Monthly"],["one_off","One-off"],["company_sponsor","Company sponsor"]].map(([v,l])=><button key={v} onClick={()=>setSupportType(v as any)} className={`rounded-2xl border p-3 text-left ${supportType===v?"border-emerald-500 bg-emerald-50":"border-slate-200"}`}><div className="text-xs font-black text-slate-900">{l}</div></button>)}</div>
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">Amount (ZAR)</label><input value={supportAmount} onChange={e=>setSupportAmount(e.target.value)} inputMode="decimal" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold" />
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">Purpose / skill you want to support</label><textarea value={supportPurpose} onChange={e=>setSupportPurpose(e.target.value)} placeholder="e.g. support skills training, work-readiness or a specific skill programme" className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" />
            <div className="mt-4 grid gap-2">{[["credit_card","Credit or debit card"],["eft","EFT / bank transfer"],["voucher","Voucher"],["airtime","Airtime / SIM billing"]].map(([v,l])=><button key={v} onClick={()=>setPaymentMethod(v)} className={`rounded-2xl border p-3 text-left ${paymentMethod===v?"border-orange-500 bg-orange-50":"border-slate-200"}`}><div className="text-xs font-black text-slate-900">{l}</div></button>)}</div>
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setSupportModalOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" disabled={supportBusy} onClick={createSupportRequest}>{supportBusy?"Creating...":"Create support request"}</Button></div>
          </div>
        </div>
      )}

      {adPaymentOpen && (
        <div className="fixed inset-0 z-[75] grid place-items-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Sponsored Timeline</div><h2 className="mt-1 text-2xl font-black text-slate-900">Choose how to pay for your campaign</h2><p className="mt-2 text-sm text-slate-500">Your campaign is saved as pending. No payment is claimed here until a real payment provider confirms it.</p></div><button onClick={()=>setAdPaymentOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 rounded-2xl bg-orange-50 p-4"><div className="text-xs font-black uppercase text-orange-600">Selected package</div><div className="mt-1 text-xl font-black text-slate-900">{(AD_PACKAGES.find(x=>x.code===adPackage)||AD_PACKAGES[0]).name} · R{(AD_PACKAGES.find(x=>x.code===adPackage)||AD_PACKAGES[0]).price}/day</div><div className="mt-1 text-xs text-slate-600">Target: {adForm.target_town || "All towns"}{adForm.target_province ? ` · ${adForm.target_province}` : ""}{adForm.target_skills ? ` · ${adForm.target_skills}` : ""}</div></div>
            <div className="mt-5 grid gap-2">{[["credit_card","Credit or debit card"],["eft","EFT / bank transfer"],["voucher","Voucher"],["airtime","Airtime / SIM billing"]].map(([value,label])=><button key={value} onClick={()=>setAdPaymentMethod(value)} className={`rounded-2xl border p-4 text-left ${adPaymentMethod===value?"border-orange-500 bg-orange-50":"border-slate-200"}`}><div className="font-black text-slate-900">{label}</div><div className="mt-1 text-xs text-slate-500">Payment request · external provider</div></button>)}</div>
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setAdPaymentOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" onClick={createSponsoredAd}>Create payment request</Button></div>
          </div>
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
          <div>V6.7 - Support + Unified Media Posts · Active Actions</div>
        </div>
      </footer>

      {renderMobileNav()}
    </div>
  );
}
