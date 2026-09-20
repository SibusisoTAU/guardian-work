 "use client";

import { Fragment, useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode, CSSProperties } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Person = {
  id: string;
  auth_user_id: string | null;
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
  auth_user_id?: string | null;
  name?: string | null;
  business_name?: string | null;
  email?: string | null;
  phone?: string | null;
  town?: string | null;
  province?: string | null;
  description?: string | null;
  industry?: string | null;
  business_type?: string | null;
  registration_number?: string | null;
  contact_person?: string | null;
  website?: string | null;
  services?: string | null;
  company_size?: string | null;
  hiring_status?: string | null;
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

type GuardianStatus = { id: string; author_type: "person" | "business" | "admin"; author_auth_user_id: string; author_id: string | null; content: string | null; visibility: "public"; duration_type?: "24_hours" | "7_days" | "forever" | "custom" | null; expires_at?: string | null; created_at: string; };
type StatusAttachment = { id: string; status_id: string; file_name: string; file_path: string; file_type: string; file_size: number | null; public_url: string; created_at: string; };
type StatusCommentAttachment = { id: string; status_comment_id: string; file_name: string; file_path: string; file_type: string; file_size: number | null; public_url: string; created_at: string; };
type StatusComment = { id: string; status_id: string; author_auth_user_id: string; author_type: "person" | "business" | "admin"; author_id: string | null; content: string; visibility: "public" | "private"; created_at: string; };
type DirectMessage = { id: string; sender_auth_user_id: string; recipient_auth_user_id: string; content: string | null; delivered_at?: string | null; read_at?: string | null; created_at: string; };
type DirectMessageAttachment = { id: string; message_id: string; file_name: string; file_path: string; file_type: string; file_size: number | null; public_url: string; created_at: string; };
type DirectMessageReaction = { id: string; message_id: string; reactor_auth_user_id: string; reaction: string; created_at: string; };

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

type LiveSession = {
  id: string;
  title: string;
  description: string | null;
  jitsi_room: string;
  status: "scheduled" | "live" | "ended";
  scheduled_at: string | null;
  recording_url: string | null;
  host_auth_user_id: string;
  host_name: string | null;
  created_at: string;
};

type LiveMessage = {
  id: string;
  session_id: string;
  sender_auth_user_id: string;
  sender_name: string | null;
  content: string;
  sender_role: "viewer" | "host" | "admin";
  created_at: string;
};

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
  ["timeline", "Status"],
  ["chats", "Chats"],
  ["live", "LIVE"],
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
    .toUpperCase() || "G";
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

function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/guardian-work-logo.jpg"
      alt="MY GUARDIAN LINK"
      className={`h-auto w-auto object-contain ${className}`}
    />
  );
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
  const [guardianStatuses, setGuardianStatuses] = useState<GuardianStatus[]>([]);
  const [statusAttachments, setStatusAttachments] = useState<StatusAttachment[]>([]);
  const [statusComments, setStatusComments] = useState<Record<string, StatusComment[]>>({});
  const [statusCommentAttachments, setStatusCommentAttachments] = useState<Record<string, StatusCommentAttachment[]>>({});
  const [statusCommentDrafts, setStatusCommentDrafts] = useState<Record<string, string>>({});
  const [statusCommentVisibility, setStatusCommentVisibility] = useState<Record<string, "public" | "private">>({});
  const [statusCommentFiles, setStatusCommentFiles] = useState<Record<string, File[]>>({});
  const [statusCommentBusy, setStatusCommentBusy] = useState<Record<string, boolean>>({});
  const [statusFiles, setStatusFiles] = useState<File[]>([]);
  const [statusBusy, setStatusBusy] = useState(false);
  const [statusNow, setStatusNow] = useState(() => Date.now());
  const [statusDuration, setStatusDuration] = useState<"24_hours" | "7_days" | "forever" | "custom">("24_hours");
  const [statusCustomExpires, setStatusCustomExpires] = useState("");
  const [chatPartnerAuthId, setChatPartnerAuthId] = useState("");
  const [chatPartnerName, setChatPartnerName] = useState("");
  const [chatPartnerPhoto, setChatPartnerPhoto] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFiles, setChatFiles] = useState<File[]>([]);
  const [chatMessageAttachments, setChatMessageAttachments] = useState<Record<string, DirectMessageAttachment[]>>({});
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [chatReactionMap, setChatReactionMap] = useState<Record<string, DirectMessageReaction[]>>({});
  const chatRealtimeRef = useRef<any>(null);
  const chatTypingTimerRef = useRef<any>(null);
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
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [myLiveSession, setMyLiveSession] = useState<LiveSession | null>(null);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [liveSessionCount, setLiveSessionCount] = useState(0);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [liveDraft, setLiveDraft] = useState("");
  const [liveBusy, setLiveBusy] = useState(false);
  const [liveHostBusy, setLiveHostBusy] = useState(false);
  const [liveRefreshBusy, setLiveRefreshBusy] = useState(false);
  const [liveRecordingUrl, setLiveRecordingUrl] = useState("");
  const [liveHostForm, setLiveHostForm] = useState({ title: "", description: "", room: "GuardianWorkAdvice" });
  const [liveScheduleAt, setLiveScheduleAt] = useState("");
  const [liveHostMode, setLiveHostMode] = useState<"now" | "schedule">("now");
  const livePresenceChannelRef = useRef<any>(null);
  const liveRealtimeChannelRef = useRef<any>(null);
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
  const [voucherCode, setVoucherCode] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInstruction, setPaymentInstruction] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
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
  const [businessProfileForm, setBusinessProfileForm] = useState({
    name: "",
    business_type: "",
    industry: "",
    registration_number: "",
    contact_person: "",
    email: "",
    phone: "",
    website: "",
    province: "",
    town: "",
    company_size: "",
    hiring_status: "Hiring / open to talent",
    services: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dataWarnings, setDataWarnings] = useState<string[]>([]);
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
      supportRequestsRes,
      statusesRes,
      statusAttachmentsRes,
      statusCommentsRes,
      statusCommentAttachmentsRes,
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
      supabase.from("sponsored_ads").select("*").eq("status", "active").eq("billing_status", "paid").order("created_at", { ascending: false }),
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
      authUser
        ? supabase.from("guardian_support_requests").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }).limit(50)
        : Promise.resolve({ data: [], error: null }),
      supabase.from("guardian_statuses").select("*").order("created_at", { ascending: false }),
      supabase.from("guardian_status_attachments").select("*").order("created_at", { ascending: true }),
      supabase.from("guardian_status_comments").select("*").order("created_at", { ascending: true }),
      supabase.from("guardian_status_comment_attachments").select("*").order("created_at", { ascending: true }),
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
    if (!supportRequestsRes.error) setSupportRequests((supportRequestsRes.data || []) as SupportRequest[]);
    if (!statusesRes.error) setGuardianStatuses((statusesRes.data || []) as GuardianStatus[]);
    if (!statusAttachmentsRes.error) setStatusAttachments((statusAttachmentsRes.data || []) as StatusAttachment[]);
    if (!statusCommentsRes.error) {
      const grouped: Record<string, StatusComment[]> = {};
      ((statusCommentsRes.data || []) as StatusComment[]).forEach(c => { grouped[c.status_id] = [...(grouped[c.status_id] || []), c]; });
      setStatusComments(grouped);
    }
    if (!statusCommentAttachmentsRes.error) {
      const grouped: Record<string, StatusCommentAttachment[]> = {};
      ((statusCommentAttachmentsRes.data || []) as StatusCommentAttachment[]).forEach(a => { grouped[a.status_comment_id] = [...(grouped[a.status_comment_id] || []), a]; });
      setStatusCommentAttachments(grouped);
    }

    const warnings = [
      ["People", peopleRes.error], ["Businesses", businessesRes.error], ["Opportunities", opportunitiesRes.error],
      ["CVs", cvsRes.error], ["Timeline", postsRes.error], ["Attachments", postAttachmentsRes.error],
      ["Applications", applicationsRes.error], ["Notifications", notificationsRes.error], ["Saved work", savedRes.error],
      ["Shortlists", shortlistRes.error], ["Contacts", contactRequestsRes.error], ["Matches", feedbackRes.error],
      ["Work Circles", circlesRes.error], ["Work ID", workIdRes.error], ["Proof", proofsRes.error],
      ["Support", supportRequestsRes.error], ["Statuses", statusesRes.error], ["Status media", statusAttachmentsRes.error], ["Status comments", statusCommentsRes.error], ["Status comment media", statusCommentAttachmentsRes.error],
    ].filter(([, err]) => !!err).map(([name, err]) => `${name}: ${(err as any).message || "could not load"}`);
    setDataWarnings(warnings);
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

    if (acct.role === "business") {
      let businessData: any = null;
      if (acct.business_id) {
        const { data } = await supabase.from("businesses").select("*").eq("id", acct.business_id).maybeSingle();
        businessData = data || null;
      }
      if (!businessData) {
        const { data } = await supabase.from("businesses").select("*").eq("auth_user_id", user.id).maybeSingle();
        businessData = data || null;
      }
      setCurrentBusiness(businessData as Business | null);
      setCurrentPerson(null);
      return;
    }

    if (acct.role === "job_seeker") {
      let personData: any = null;
      if (acct.job_seeker_id) {
        const { data } = await supabase.from("Job seekers").select("*").eq("id", acct.job_seeker_id).maybeSingle();
        personData = data || null;
      }
      if (!personData) {
        const { data } = await supabase.from("Job seekers").select("*").eq("auth_user_id", user.id).maybeSingle();
        personData = data || null;
      }
      setCurrentPerson(personData as Person | null);
      setCurrentBusiness(null);
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
    if (!authReady || !authUser) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "complete") return;
    const reference = params.get("reference");
    if (!reference) return;

    let cancelled = false;
    const verifyReturnedPayment = async () => {
      try {
        const session = await supabase.auth.getSession();
        const accessToken = session.data.session?.access_token;
        if (!accessToken) return;
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, reference }),
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && body.success) {
          flash("Payment confirmed. Your GUARDIAN WORK record has been updated.");
          await loadAll();
        } else if (res.ok && body.status) {
          flash(`Payment status: ${body.status}. GUARDIAN will only activate paid services after confirmation.`);
          await loadAll();
        } else {
          flash(body.error || "We could not verify the returned payment yet. Your payment record remains pending until the provider confirms it.");
        }
      } catch (error: any) {
        if (!cancelled) flash(error?.message || "Payment verification could not be completed yet.");
      } finally {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    void verifyReturnedPayment();
    return () => { cancelled = true; };
  }, [authReady, authUser?.id]);

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
    if (!currentBusiness) return;
    setBusinessProfileForm({
      name: currentBusiness.name || currentBusiness.business_name || "",
      business_type: currentBusiness.business_type || "",
      industry: currentBusiness.industry || "",
      registration_number: currentBusiness.registration_number || "",
      contact_person: currentBusiness.contact_person || "",
      email: currentBusiness.email || "",
      phone: currentBusiness.phone || "",
      website: currentBusiness.website || "",
      province: currentBusiness.province || "",
      town: currentBusiness.town || "",
      company_size: currentBusiness.company_size || "",
      hiring_status: currentBusiness.hiring_status || "Hiring / open to talent",
      services: currentBusiness.services || "",
      description: currentBusiness.description || "",
    });
  }, [currentBusiness?.id]);

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
    if (!authUser?.id) return;
    const key = currentPerson?.id || currentBusiness?.id || authUser.id;
    const channel = supabase.channel("guardian-work-live", { config: { presence: { key } } });
    presenceChannelRef.current = channel;
    channel.subscribe(async status => {
      if (status === "SUBSCRIBED") await channel.track({ auth_user_id: authUser.id, online_at: new Date().toISOString() });
    });
    return () => { supabase.removeChannel(channel); presenceChannelRef.current = null; };
  }, [authUser?.id, currentPerson?.id, currentBusiness?.id]);

  const loadLiveSessions = async () => {
    const { data, error } = await supabase
      .from("guardian_live_sessions")
      .select("*")
      .in("status", ["live", "scheduled", "ended"])
      .order("scheduled_at", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      setDataWarnings(old => [...old.filter(x => !x.toLowerCase().includes("live")), "LIVE session data could not be loaded."]);
      return [];
    }
    const sessions = (data || []) as LiveSession[];
    setLiveSessions(sessions);
    setLiveSessionCount(sessions.filter(x => x.status === "live").length);
    return sessions;
  };

  const loadLiveSession = async () => {
    const sessions = await loadLiveSessions();
    const activeSession = sessions.find(x => x.status === "live") || null;
    setLiveSession(activeSession);
    setMyLiveSession(authUser?.id ? (sessions.find(x => x.status === "live" && x.host_auth_user_id === authUser.id) || null) : null);
    return activeSession;
  };

  const loadLiveMessages = async (sessionId: string) => {
    const { data, error } = await supabase.from("guardian_live_messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true }).limit(200);
    if (!error) setLiveMessages((data || []) as LiveMessage[]);
  };

  useEffect(() => {
    if (!authUser?.id || active !== "live") return;
    let cancelled = false;
    const start = async () => {
      await loadLiveSession();
      if (cancelled) return;
    };
    void start();
    return () => { cancelled = true; };
  }, [active, authUser?.id]);

  useEffect(() => {
    if (!authUser?.id) return;
    void loadLiveSessions();
    const timer = window.setInterval(() => void loadLiveSessions(), 30000);
    return () => window.clearInterval(timer);
  }, [authUser?.id]);

  useEffect(() => {
    if (active !== "live" || !authUser?.id) return;
    const key = authUser.id;
    const channel = supabase.channel("guardian-live-viewers", { config: { presence: { key } } });
    livePresenceChannelRef.current = channel;
    const sync = () => setLiveUsers(Object.keys(channel.presenceState()).length);
    channel.on("presence", { event: "sync" }, sync).on("presence", { event: "join" }, sync).on("presence", { event: "leave" }, sync);
    channel.subscribe(async status => { if (status === "SUBSCRIBED") { await channel.track({ auth_user_id: authUser.id, role: account?.role || "job_seeker", joined_at: new Date().toISOString() }); sync(); } });
    return () => { supabase.removeChannel(channel); livePresenceChannelRef.current = null; setLiveUsers(0); };
  }, [active, authUser?.id, account?.role]);

  useEffect(() => {
    if (active !== "live" || !liveSession?.id) return;
    void loadLiveMessages(liveSession.id);
    const channel = supabase.channel(`guardian-live-chat-${liveSession.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guardian_live_messages", filter: `session_id=eq.${liveSession.id}` }, payload => {
        const msg = payload.new as LiveMessage;
        setLiveMessages(old => old.some(x => x.id === msg.id) ? old : [...old, msg]);
      });
    liveRealtimeChannelRef.current = channel;
    channel.subscribe();
    return () => { supabase.removeChannel(channel); liveRealtimeChannelRef.current = null; };
  }, [active, liveSession?.id]);

  const liveIsHost = !!authUser?.id && (account?.role === "business" || account?.role === "admin");
  const refreshLive = async () => {
    setLiveRefreshBusy(true);
    await loadLiveSession();
    setLiveRefreshBusy(false);
    flash("LIVE sessions refreshed.");
  };
  const openLiveRoom = (session: LiveSession) => {
    const url = `https://meet.jit.si/${encodeURIComponent(session.jitsi_room)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const copyLiveRoom = async (session: LiveSession) => {
    const url = `https://meet.jit.si/${encodeURIComponent(session.jitsi_room)}`;
    try { await navigator.clipboard.writeText(url); flash("LIVE room link copied."); }
    catch { flash("Copy is not available on this device."); }
  };
  const jumpToLiveVideo = () => document.getElementById("guardian-live-video")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const blockedLivePatterns = [/\d{10,}/, /0\d{9}/, /dm\s*me/i, /call\s*me/i, /whatsapp/i, /https?:\/\//i, /www\./i];
  const sendLiveMessage = async () => {
    if (!liveSession?.id || !authUser?.id) return flash("There is no active LIVE session right now.");
    const text = liveDraft.trim();
    if (!text) return;
    if (blockedLivePatterns.some(p => p.test(text))) return flash("LIVE chat protects job seekers: phone numbers, links, WhatsApp and private-contact requests are blocked.");
    setLiveBusy(true);
    const senderName = currentPerson?.name || currentBusiness?.name || currentBusiness?.business_name || "GUARDIAN member";
    const senderRole = account?.role === "admin" ? "admin" : liveIsHost ? "host" : "viewer";
    const { data, error } = await supabase.from("guardian_live_messages").insert({ session_id: liveSession.id, sender_auth_user_id: authUser.id, sender_name: senderName, content: text, sender_role: senderRole }).select().single();
    setLiveBusy(false);
    if (error) return flash(error.message);
    if (data) setLiveMessages(old => old.some(x => x.id === data.id) ? old : [...old, data as LiveMessage]);
    setLiveDraft("");
  };

  const scheduleLiveSession = async () => {
    if (!authUser?.id) return flash("Sign in to GUARDIAN WORK before scheduling a LIVE session.");
    if (!liveIsHost) return flash("LIVE scheduling is available to authenticated Business and GUARDIAN admin accounts.");
    if (myLiveSession) return flash("End your current LIVE session before scheduling another one.");
    if (!liveHostForm.title.trim()) return flash("Give the scheduled LIVE session a clear title first.");
    if (!liveScheduleAt) return flash("Choose a date and time for the LIVE session.");
    const when = new Date(liveScheduleAt);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) return flash("Choose a future date and time.");
    const room = liveHostForm.room.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
    if (!room) return flash("Enter a valid Jitsi room name.");
    setLiveHostBusy(true);
    const payload = {
      title: liveHostForm.title.trim(),
      description: liveHostForm.description.trim() || null,
      jitsi_room: room,
      status: "scheduled",
      scheduled_at: when.toISOString(),
      host_auth_user_id: authUser.id,
      host_name: currentBusiness?.name || currentBusiness?.business_name || currentPerson?.name || "GUARDIAN host",
    };
    const { data, error } = await supabase.from("guardian_live_sessions").insert(payload).select().single();
    setLiveHostBusy(false);
    if (error) return flash(`Could not schedule LIVE: ${error.message}`);
    const scheduled = data as LiveSession;
    setLiveSessions(old => [scheduled, ...old.filter(x => x.id !== scheduled.id)].sort((a,b) => new Date(a.scheduled_at || a.created_at).getTime() - new Date(b.scheduled_at || b.created_at).getTime()));
    setLiveScheduleAt("");
    setLiveHostForm(old => ({ ...old, title: "", description: "" }));
    setLiveHostMode("now");
    flash("LIVE session scheduled successfully.");
  };

  const startScheduledLiveSession = async (session: LiveSession) => {
    if (!authUser?.id || !liveIsHost) return flash("Only your Business/Admin account can start this LIVE session.");
    if (session.host_auth_user_id !== authUser.id && account?.role !== "admin") return flash("You can only start your own scheduled LIVE session.");
    if (myLiveSession) return flash("End your current LIVE session first.");
    setLiveHostBusy(true);
    const { data, error } = await supabase.from("guardian_live_sessions").update({ status: "live" }).eq("id", session.id).select().single();
    setLiveHostBusy(false);
    if (error) return flash(`Could not start scheduled LIVE: ${error.message}`);
    const started = data as LiveSession;
    setLiveSession(started);
    setMyLiveSession(started);
    setLiveSessions(old => [started, ...old.filter(x => x.id !== started.id)]);
    setLiveSessionCount(count => Math.max(1, count));
    setLiveMessages([]);
    jumpToLiveVideo();
    flash("🔴 Scheduled LIVE is now active.");
  };

  const remindMeForLive = (session: LiveSession) => {
    if (!session.scheduled_at) return flash("This session does not have a scheduled time yet.");
    const start = new Date(session.scheduled_at);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `GUARDIAN WORK LIVE: ${session.title}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `${session.description || "Free GUARDIAN WORK advice session."}\n\nJoin: https://meet.jit.si/${encodeURIComponent(session.jitsi_room)}`,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");
    flash("Reminder opened. Add it to your calendar.");
  };

  const startLiveSession = async () => {
    if (!authUser?.id) return flash("Sign in to GUARDIAN WORK before starting a LIVE session.");
    if (!liveIsHost) return flash("LIVE hosting is available to authenticated Business and GUARDIAN admin accounts.");
    if (myLiveSession) return flash("You already have a LIVE session running. Use End LIVE before starting another one.");
    if (!liveHostForm.title.trim()) return flash("Give the LIVE session a clear title first.");
    const room = liveHostForm.room.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
    if (!room) return flash("Enter a valid Jitsi room name.");
    setLiveHostBusy(true);
    const payload = {
      title: liveHostForm.title.trim(),
      description: liveHostForm.description.trim() || null,
      jitsi_room: room,
      status: "live",
      host_auth_user_id: authUser.id,
      host_name: currentBusiness?.name || currentBusiness?.business_name || currentPerson?.name || "GUARDIAN host",
    };
    const { data, error } = await supabase.from("guardian_live_sessions").insert(payload).select().single();
    setLiveHostBusy(false);
    if (error) return flash(`Could not start LIVE: ${error.message}`);
    const started = data as LiveSession;
    setLiveSession(started);
    setMyLiveSession(started);
    setLiveSessions(old => [started, ...old.filter(x => x.id !== started.id)]);
    setLiveSessionCount(old => old + 1);
    setLiveMessages([]);
    setLiveHostForm(old => ({ ...old, title: "", description: "" }));
    flash("🔴 LIVE is now active. Open the video room and turn on your camera/microphone in Jitsi.");
  };

  const endLiveSession = async () => {
    if (!myLiveSession || !liveIsHost || !authUser?.id) return flash("You do not have an active LIVE session to end.");
    setLiveHostBusy(true);
    const { error } = await supabase
      .from("guardian_live_sessions")
      .update({ status: "ended", recording_url: liveRecordingUrl.trim() || myLiveSession.recording_url || null })
      .eq("id", myLiveSession.id)
      .eq("host_auth_user_id", authUser.id);
    setLiveHostBusy(false);
    if (error) return flash(`Could not end LIVE: ${error.message}`);
    setMyLiveSession(null);
    if (liveSession?.id === myLiveSession.id) setLiveSession(null);
    setLiveMessages([]);
    setLiveRecordingUrl("");
    setLiveSessionCount(count => Math.max(0, count - 1));
    await loadLiveSessions();
    flash("LIVE ended successfully. The session is now in Past Advice.");
  };

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
    if (adPaymentMethod !== "credit_card") return flash("Only credit/debit card checkout is connected right now. Choose Credit or debit card to continue.");
    if (!authUser?.email) return flash("Your business account needs an email address before card payment can start.");

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

    const { data: paymentRequest, error: paymentError } = await supabase.from("guardian_ad_payment_requests").insert({
      business_id: currentBusiness.id,
      ad_id: data.id,
      amount_cents: selectedPackage.price * 100,
      payment_method: "credit_card",
      status: "pending"
    }).select().single();

    if (paymentError || !paymentRequest) {
      setAdCampaignBusy(false);
      return flash(`Campaign saved, but its payment request could not be created: ${paymentError?.message || "unknown error"}`);
    }

    const opened = await startPaystackCheckout({
      requestId: paymentRequest.id,
      amountCents: selectedPackage.price * 100,
      kind: "ad",
    });
    setAdCampaignBusy(false);
    if (!opened) return;

    setAdPaymentOpen(false);
    setAdForm({ title:"", body:"", cta_label:"Learn more", cta_url:"", target_province:"", target_town:"", target_skills:"", daily_frequency_cap:selectedPackage.frequency });
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
      if (ad.status !== "active" || ad.billing_status !== "paid") return false;
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
      match_version: "V6.9.2",
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

  const startPaystackCheckout = async (args: { requestId: string; amountCents: number; supportType?: string; whatsapp?: boolean; kind?: "support" | "whatsapp" | "ad"; paymentChannel?: "card" | "eft" }) => {
    if (!authUser?.email) { flash("Your account needs an email address before payment can start."); return false; }
    setPaymentProcessing(true);
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) { flash("Your secure session has expired. Please sign in again."); return false; }
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const res = await fetch("/api/paystack/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal, body: JSON.stringify({ accessToken, requestId: args.requestId, email: authUser.email, amountCents: args.amountCents, supportType: args.supportType || null, whatsapp: !!args.whatsapp, kind: args.kind || null, paymentChannel: args.paymentChannel || "card" }) });
      window.clearTimeout(timeout);
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.authorization_url) { flash(body.error || `Payment connection failed (HTTP ${res.status}).`); return false; }
      window.location.assign(body.authorization_url);
      return true;
    } catch (e: any) {
      flash(e?.name === "AbortError" ? "Payment connection timed out. Please try again." : (e?.message || "Payment connection failed."));
      return false;
    } finally { setPaymentProcessing(false); }
  };

  const confirmWhatsAppPaymentMethod = async () => {
    if (!currentPerson || !authUser) return;
    if (paymentMethod === "eft") {
      const { data, error } = await supabase.from("guardian_whatsapp_payment_requests").insert({ job_seeker_id: currentPerson.id, amount_cents: 1000, payment_method: "eft", status: "pending" }).select().single();
      if (error) return flash(error.message);
      const opened = await startPaystackCheckout({ requestId: data.id, amountCents: 1000, whatsapp: true, kind: "whatsapp", paymentChannel: "eft" });
      if (opened) setPaymentOpen(false);
      return;
    }
    if (paymentMethod === "voucher") {
      if (!voucherCode.trim()) return flash("Enter your GUARDIAN WORK voucher code first.");
      const session = await supabase.auth.getSession();
      const res = await fetch("/api/payments/redeem-voucher", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken: session.data.session?.access_token, voucherCode: voucherCode.trim(), purpose: "whatsapp", amountCents: 1000 }) });
      const body = await res.json().catch(()=>({}));
      if (!res.ok) return flash(body.error || "Voucher could not be redeemed.");
      setPaymentOpen(false); setVoucherCode(""); flash("Voucher accepted. WhatsApp Alerts are now active."); await loadAll(); return;
    }
    if (paymentMethod === "airtime") {
      const { data, error } = await supabase.from("guardian_airtime_payment_requests").insert({ user_id: authUser.id, purpose: "whatsapp", amount_cents: 1000, phone: currentPerson.phone || null, status: "pending_provider", payment_note: "GUARDIAN WORK WhatsApp Alerts R10/month" }).select().single();
      if (error) return flash(error.message);
      setPaymentOpen(false);
      setPaymentInstruction(`Airtime/SIM billing request ${data.id.slice(0,8).toUpperCase()} is recorded. It will only become paid after a real mobile-network billing provider confirms the charge.`);
      flash("Airtime billing request recorded.");
      return;
    }
    const { data, error } = await supabase.from("guardian_whatsapp_payment_requests").insert({ job_seeker_id: currentPerson.id, amount_cents: 1000, payment_method: "credit_card", status: "pending" }).select().single();
    if (error) return flash(error.message);
    const opened = await startPaystackCheckout({ requestId: data.id, amountCents: 1000, whatsapp: true, kind: "whatsapp", paymentChannel: "card" });
    if (opened) setPaymentOpen(false);
  };

  const createSupportRequest = async () => {
    if (!authUser) return;
    const amount = Number(supportAmount);
    if (!Number.isFinite(amount) || amount <= 0) return flash("Enter a valid support amount.");
    if (paymentMethod !== "credit_card") return flash("Only credit/debit card checkout is connected right now. Other payment methods will stay disabled until their providers are connected.");
    if (!authUser.email?.trim()) return flash("Your account needs an email address before card payment can start.");

    setSupportBusy(true);
    const { data, error } = await supabase.from("guardian_support_requests").insert({
      user_id: authUser.id,
      role: account?.role || "job_seeker",
      support_type: supportType,
      amount_cents: Math.round(amount * 100),
      payment_method: "credit_card",
      purpose: supportPurpose.trim() || null,
      status: "pending"
    }).select().single();
    setSupportBusy(false);
    if (error) return flash(error.message);

    setSupportRequests(old => [data as SupportRequest, ...old]);
    const opened = await startPaystackCheckout({
      requestId: data.id,
      amountCents: Math.round(amount * 100),
      supportType,
      kind: "support",
    });
    if (opened) setSupportModalOpen(false);
  };

  const confirmSupportAlternativePayment = async () => {
    if (!authUser) return;
    const amount = Math.round(Number(supportAmount) * 100);
    if (!Number.isInteger(amount) || amount <= 0) return flash("Enter a valid support amount.");
    if (paymentMethod === "eft") {
      const { data, error } = await supabase.from("guardian_support_requests").insert({ user_id: authUser.id, role: account?.role || "job_seeker", support_type: supportType, amount_cents: amount, payment_method: "eft", purpose: supportPurpose.trim() || null, status: "pending" }).select().single();
      if (error) return flash(error.message);
      const opened = await startPaystackCheckout({ requestId: data.id, amountCents: amount, supportType, kind: "support", paymentChannel: "eft" });
      if (opened) setSupportModalOpen(false);
      return;
    }
    if (paymentMethod === "voucher") {
      if (!voucherCode.trim()) return flash("Enter your GUARDIAN WORK voucher code first.");
      const { data, error } = await supabase.from("guardian_support_requests").insert({ user_id: authUser.id, role: account?.role || "job_seeker", support_type: supportType, amount_cents: amount, payment_method: "voucher", purpose: supportPurpose.trim() || null, status: "pending", voucher_code: voucherCode.trim().toUpperCase() }).select().single();
      if (error) return flash(error.message);
      const session = await supabase.auth.getSession();
      const res = await fetch("/api/payments/redeem-voucher", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken: session.data.session?.access_token, voucherCode: voucherCode.trim(), purpose: "support", amountCents: amount, requestId: data.id }) });
      const body = await res.json().catch(()=>({}));
      if (!res.ok) return flash(body.error || "Voucher could not be redeemed.");
      setSupportModalOpen(false); setVoucherCode(""); flash("Voucher accepted. Your support is recorded as paid."); await loadAll(); return;
    }
    if (paymentMethod === "airtime") {
      const { data, error } = await supabase.from("guardian_airtime_payment_requests").insert({ user_id: authUser.id, purpose: "support", amount_cents: amount, phone: currentPerson?.phone || null, status: "pending_provider", payment_note: supportPurpose.trim() || null }).select().single();
      if (error) return flash(error.message);
      setSupportModalOpen(false); setPaymentInstruction(`Airtime/SIM billing request ${data.id.slice(0,8).toUpperCase()} is recorded. It will only become paid after a real mobile-network billing provider confirms the charge.`);
      flash("Airtime billing request recorded."); return;
    }
    return createSupportRequest();
  };

  const testWhatsAppAlerts = () => {
    if (!currentPerson?.phone) return flash("Add your mobile number to your Work Identity before connecting WhatsApp.");
    const opened = openWhatsApp(currentPerson.phone, "Hi GUARDIAN WORK, Please help me connect my WhatsApp alerts.");
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
    if (error) {
      return flash(error.message);
    }
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

  const saveExistingBusinessProfile = async () => {
    if (account?.role !== "business" || !authUser || !currentBusiness) return flash("Your saved Business Profile could not be found.");
    const name = safeText(businessProfileForm.name).trim();
    if (!name) return flash("Enter the business name.");
    const { data, error } = await supabase
      .from("businesses")
      .update({
        name,
        business_name: name,
        business_type: safeText(businessProfileForm.business_type).trim() || null,
        industry: safeText(businessProfileForm.industry).trim() || null,
        registration_number: safeText(businessProfileForm.registration_number).trim() || null,
        contact_person: safeText(businessProfileForm.contact_person).trim() || null,
        email: safeText(businessProfileForm.email).trim() || authUser.email || null,
        phone: safeText(businessProfileForm.phone).trim() || null,
        website: safeText(businessProfileForm.website).trim() || null,
        province: safeText(businessProfileForm.province).trim() || null,
        town: safeText(businessProfileForm.town).trim() || null,
        company_size: safeText(businessProfileForm.company_size).trim() || null,
        hiring_status: safeText(businessProfileForm.hiring_status).trim() || null,
        services: safeText(businessProfileForm.services).trim() || null,
        description: safeText(businessProfileForm.description).trim() || null,
      })
      .eq("id", currentBusiness.id)
      .eq("auth_user_id", authUser.id)
      .select()
      .single();
    if (error) return flash(error.message);
    setCurrentBusiness(data as Business);
    setBusinesses(old => old.map(b => b.id === data.id ? data as Business : b));
    flash("Business Profile updated.");
  };

  const createOpportunity = async () => {
    if (!currentBusiness) return flash("Your saved Business Profile is required before publishing an opportunity.");
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
    if (!currentBusiness) return flash("Your saved Business Profile is required before this business action.");
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

    if (cvError) {
      await supabase.storage.from("cv-documents").remove([path]);
      return flash(cvError.message);
    }

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
    const path = `${authUser.id}/profile/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) { setProfilePhotoBusy(false); return flash(uploadError.message); }
    const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
    const photoUrl = `${publicData.publicUrl}?v=${Date.now()}`;
    const { data, error } = await supabase.from("Job seekers").update({ profile_photo_url: photoUrl }).eq("id", currentPerson.id).eq("auth_user_id", authUser.id).select().single();
    setProfilePhotoBusy(false);
    if (error) {
      await supabase.storage.from("guardian-media").remove([path]);
      return flash(error.message);
    }
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
      const path = `${authUser.id}/timeline/${postId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { data: attachment, error: attachmentError } = await supabase.from("post_attachments").insert({
        post_id: postId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl
      }).select().single();
      if (attachmentError) {
        await supabase.storage.from("guardian-media").remove([path]);
        return { ok: false, message: attachmentError.message };
      }
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
      setSelectedCircleId(circle.id);
      setFeedFilter("all");
      window.setTimeout(() => document.getElementById("guardian-circle-feed")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      flash(`Joined ${circle.name}. You can now view, comment and participate in its feed.`);
    }
    setCircleBusy(null);
  };

  const uploadStatusAttachments = async (statusId: string, files: File[]) => {
    if (!authUser || !files.length) return { ok: true, attachments: [] as StatusAttachment[] };
    const uploaded: StatusAttachment[] = [];
    for (const file of files) {
      if (!(file.type.startsWith("image/") || file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type.startsWith("video/"))) return { ok: false, message: `Unsupported attachment: ${file.name}`, attachments: uploaded };
      if (file.size > 25 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 25MB.`, attachments: uploaded };
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${authUser.id}/statuses/${statusId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message, attachments: uploaded };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { data: row, error } = await supabase.from("guardian_status_attachments").insert({ status_id: statusId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl }).select().single();
      if (error) { await supabase.storage.from("guardian-media").remove([path]); return { ok: false, message: error.message, attachments: uploaded }; }
      uploaded.push(row as StatusAttachment);
    }
    setStatusAttachments(old => [...old, ...uploaded]);
    return { ok: true, attachments: uploaded };
  };

  const createStatus = async () => {
    if (!authUser || (!postText.trim() && !statusFiles.length)) return;
    const isBusinessAuthor = account?.role === "business" && !!currentBusiness;
    const isAdminAuthor = account?.role === "admin";
    const authorId = isBusinessAuthor ? currentBusiness?.id : isAdminAuthor ? null : currentPerson?.id;
    if (!authorId && !isAdminAuthor) return flash("Complete your GUARDIAN WORK profile first.");

    let expiresAt: string | null = null;
    if (statusDuration === "24_hours") expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    if (statusDuration === "7_days") expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    if (statusDuration === "custom") {
      const customDate = new Date(statusCustomExpires);
      if (!statusCustomExpires || Number.isNaN(customDate.getTime()) || customDate.getTime() <= Date.now()) return flash("Choose a future date and time for your status.");
      expiresAt = customDate.toISOString();
    }

    setStatusBusy(true);
    const { data, error } = await supabase.from("guardian_statuses").insert({
      author_type: isAdminAuthor ? "admin" : isBusinessAuthor ? "business" : "person",
      author_auth_user_id: authUser.id,
      author_id: authorId,
      content: postText.trim() || null,
      visibility: "public",
      duration_type: statusDuration,
      expires_at: expiresAt,
    }).select().single();
    if (error) { setStatusBusy(false); return flash(error.message); }
    const files = [...statusFiles];
    setGuardianStatuses(old => [data as GuardianStatus, ...old]);
    const result = await uploadStatusAttachments(data.id, files);
    setPostText(""); setStatusFiles([]); setStatusCustomExpires(""); setStatusDuration("24_hours"); setStatusBusy(false);
    if (!result.ok) return flash(`Status posted, but an attachment failed: ${result.message}`);
    flash(files.length ? "Status posted with media." : "Status posted.");
  };

  const uploadStatusCommentAttachments = async (commentId: string, files: File[]) => {
    if (!authUser || !files.length) return { ok: true };
    for (const file of files) {
      if (!(file.type.startsWith("image/") || file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type.startsWith("video/"))) return { ok: false, message: `Unsupported attachment: ${file.name}` };
      if (file.size > 25 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 25MB.` };
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${authUser.id}/status-comments/${commentId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { error } = await supabase.from("guardian_status_comment_attachments").insert({ status_comment_id: commentId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl });
      if (error) { await supabase.storage.from("guardian-media").remove([path]); return { ok: false, message: error.message }; }
    }
    return { ok: true };
  };

  const addStatusComment = async (status: GuardianStatus) => {
    if (!authUser) return;
    const content = safeText(statusCommentDrafts[status.id]).trim();
    const files = statusCommentFiles[status.id] || [];
    if (!content && !files.length) return;
    const isBusinessAuthor = account?.role === "business" && !!currentBusiness;
    const isAdminAuthor = account?.role === "admin";
    const authorId = isBusinessAuthor ? currentBusiness?.id : isAdminAuthor ? null : currentPerson?.id;
    if (!authorId && !isAdminAuthor) return flash("Complete your profile first.");
    setStatusCommentBusy(old => ({ ...old, [status.id]: true }));
    const visibility = statusCommentVisibility[status.id] || "public";
    const { data, error } = await supabase.from("guardian_status_comments").insert({ status_id: status.id, author_auth_user_id: authUser.id, author_type: isAdminAuthor ? "admin" : isBusinessAuthor ? "business" : "person", author_id: authorId, content: content || "", visibility }).select().single();
    if (error) { setStatusCommentBusy(old => ({ ...old, [status.id]: false })); return flash(error.message); }
    const result = await uploadStatusCommentAttachments(data.id, files);
    if (result.ok && files.length) {
      const { data: uploadedRows } = await supabase.from("guardian_status_comment_attachments").select("*").eq("status_comment_id", data.id).order("created_at", { ascending: true });
      setStatusCommentAttachments(old => ({ ...old, [data.id]: (uploadedRows || []) as StatusCommentAttachment[] }));
    }
    setStatusComments(old => ({ ...old, [status.id]: [...(old[status.id] || []), data as StatusComment] }));
    setStatusCommentDrafts(old => ({ ...old, [status.id]: "" }));
    setStatusCommentFiles(old => ({ ...old, [status.id]: [] }));
    setStatusCommentBusy(old => ({ ...old, [status.id]: false }));
    if (!result.ok) return flash(`Comment posted, but an attachment failed: ${result.message}`);
    flash(visibility === "private" ? "Private reply sent to the status owner." : "Public comment posted.");
  };

  const loadStatusComments = async (statusId: string) => {
    const { data, error } = await supabase.from("guardian_status_comments").select("*").eq("status_id", statusId).order("created_at", { ascending: true });
    if (error) return flash(error.message);
    setStatusComments(old => ({ ...old, [statusId]: (data || []) as StatusComment[] }));
  };

  const loadChatMessages = async (partnerAuthId: string) => {
    if (!authUser || !partnerAuthId) return;
    const { data, error } = await supabase.from("guardian_direct_messages").select("*").or(`and(sender_auth_user_id.eq.${authUser.id},recipient_auth_user_id.eq.${partnerAuthId}),and(sender_auth_user_id.eq.${partnerAuthId},recipient_auth_user_id.eq.${authUser.id})`).order("created_at", { ascending: true }).limit(200);
    if (error) return flash(error.message);
    const messages = (data || []) as DirectMessage[];
    setChatMessages(messages);
    if (messages.length) {
      const ids = messages.map(m => m.id);
      const { data: attachments } = await supabase.from("guardian_direct_message_attachments").select("*").in("message_id", ids).order("created_at", { ascending: true });
      const grouped: Record<string, DirectMessageAttachment[]> = {};
      for (const a of (attachments || []) as DirectMessageAttachment[]) {
        const { data: signed } = await supabase.storage.from("guardian-chat-media").createSignedUrl(a.file_path, 60 * 60);
        (grouped[a.message_id] ||= []).push({ ...a, public_url: signed?.signedUrl || "" });
      }
      setChatMessageAttachments(grouped);
      const { data: reactions } = await supabase.from("guardian_direct_message_reactions").select("*").in("message_id", ids).order("created_at", { ascending: true });
      const reactionGrouped: Record<string, DirectMessageReaction[]> = {};
      for (const r of (reactions || []) as DirectMessageReaction[]) (reactionGrouped[r.message_id] ||= []).push(r);
      setChatReactionMap(reactionGrouped);
    } else {
      setChatMessageAttachments({});
      setChatReactionMap({});
    }
    const unread = messages.filter(m => m.recipient_auth_user_id === authUser.id && !m.read_at).map(m => m.id);
    if (unread.length) {
      const now = new Date().toISOString();
      await supabase.from("guardian_direct_messages").update({ delivered_at: now, read_at: now }).in("id", unread).eq("recipient_auth_user_id", authUser.id);
      setChatMessages(old => old.map(m => unread.includes(m.id) ? { ...m, delivered_at: m.delivered_at || now, read_at: now } : m));
    }
  };

  const openChatDialog = async (name: string, authId: string, photoUrl?: string | null) => {
    if (!authId || authId === authUser?.id) return;
    setChatPartnerName(name || "GUARDIAN member");
    setChatPartnerPhoto(photoUrl || null);
    setChatPartnerAuthId(authId);
    setChatOpen(true);
    await loadChatMessages(authId);
  };

  const openPrivateChatFromProfile = async (partnerAuthId: string) => {
    const person = people.find(p => p.auth_user_id === partnerAuthId);
    const business = businesses.find(b => b.auth_user_id === partnerAuthId);
    await openChatDialog(person?.name || business?.name || business?.business_name || "GUARDIAN member", partnerAuthId, person?.profile_photo_url || null);
  };

  const uploadDirectMessageAttachments = async (messageId: string, files: File[]) => {
    if (!authUser || !files.length) return { ok: true, message: "" };
    for (const file of files) {
      const allowed = file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "text/plain";
      if (!allowed) return { ok: false, message: `Unsupported file: ${file.name}` };
      if (file.size > 25 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 25MB.` };
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${authUser.id}/chats/${chatPartnerAuthId}/${messageId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-chat-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message };
      const { error } = await supabase.from("guardian_direct_message_attachments").insert({ message_id: messageId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: null });
      if (error) { await supabase.storage.from("guardian-chat-media").remove([path]); return { ok: false, message: error.message }; }
    }
    await loadChatMessages(chatPartnerAuthId);
    return { ok: true, message: "" };
  };

  const sendDirectMessage = async () => {
    if (!authUser || !chatPartnerAuthId || (!chatDraft.trim() && !chatFiles.length)) return;
    setChatBusy(true);
    const files = [...chatFiles];
    const { data, error } = await supabase.from("guardian_direct_messages").insert({ sender_auth_user_id: authUser.id, recipient_auth_user_id: chatPartnerAuthId, content: chatDraft.trim() || "" }).select().single();
    if (error) { setChatBusy(false); return flash(error.message); }
    setChatMessages(old => [...old, data as DirectMessage]);
    setChatDraft(""); setChatFiles([]);
    const result = await uploadDirectMessageAttachments(data.id, files);
    setChatBusy(false);
    if (!result.ok) return flash(`Message sent, but an attachment failed: ${result.message}`);
  };

  const toggleMessageReaction = async (messageId: string, reaction = "❤️") => {
    if (!authUser) return;
    const existing = (chatReactionMap[messageId] || []).find(r => r.reactor_auth_user_id === authUser.id && r.reaction === reaction);
    if (existing) {
      const { error } = await supabase.from("guardian_direct_message_reactions").delete().eq("id", existing.id);
      if (error) return flash(error.message);
      setChatReactionMap(old => ({ ...old, [messageId]: (old[messageId] || []).filter(r => r.id !== existing.id) }));
    } else {
      const { data, error } = await supabase.from("guardian_direct_message_reactions").insert({ message_id: messageId, reactor_auth_user_id: authUser.id, reaction }).select().single();
      if (error) return flash(error.message);
      setChatReactionMap(old => ({ ...old, [messageId]: [...(old[messageId] || []), data as DirectMessageReaction] }));
    }
  };

  const handleChatTyping = () => {
    if (!chatRealtimeRef.current || !authUser) return;
    void chatRealtimeRef.current.send({ type: "broadcast", event: "typing", payload: { user_id: authUser.id, typing: true } });
    if (chatTypingTimerRef.current) window.clearTimeout(chatTypingTimerRef.current);
    chatTypingTimerRef.current = window.setTimeout(() => {
      if (chatRealtimeRef.current) void chatRealtimeRef.current.send({ type: "broadcast", event: "typing", payload: { user_id: authUser.id, typing: false } });
    }, 1400);
  };

  useEffect(() => {
    if (!authUser || !chatOpen || !chatPartnerAuthId) return;
    const channel = supabase.channel(`guardian-dm-${[authUser.id, chatPartnerAuthId].sort().join("-")}`, { config: { broadcast: { self: false } } });
    chatRealtimeRef.current = channel;
    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guardian_direct_messages", filter: `recipient_auth_user_id=eq.${authUser.id}` }, async payload => {
        const m = payload.new as DirectMessage;
        if (m.sender_auth_user_id !== chatPartnerAuthId) return;
        setChatMessages(old => old.some(x => x.id === m.id) ? old : [...old, { ...m, delivered_at: new Date().toISOString() }]);
        await supabase.from("guardian_direct_messages").update({ delivered_at: new Date().toISOString(), read_at: new Date().toISOString() }).eq("id", m.id).eq("recipient_auth_user_id", authUser.id);
        await loadChatMessages(chatPartnerAuthId);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guardian_direct_messages" }, payload => {
        const m = payload.new as DirectMessage;
        if (!((m.sender_auth_user_id === authUser.id && m.recipient_auth_user_id === chatPartnerAuthId) || (m.sender_auth_user_id === chatPartnerAuthId && m.recipient_auth_user_id === authUser.id))) return;
        setChatMessages(old => old.map(x => x.id === m.id ? { ...x, ...m } : x));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guardian_direct_message_attachments" }, payload => {
        const a = payload.new as DirectMessageAttachment;
        if (!chatMessages.some(m => m.id === a.message_id)) return;
        void loadChatMessages(chatPartnerAuthId);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guardian_direct_message_reactions" }, payload => {
        const r = payload.new as DirectMessageReaction;
        setChatReactionMap(old => ({ ...old, [r.message_id]: [...(old[r.message_id] || []).filter(x => x.id !== r.id), r] }));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "guardian_direct_message_reactions" }, payload => {
        const r = payload.old as DirectMessageReaction;
        setChatReactionMap(old => ({ ...old, [r.message_id]: (old[r.message_id] || []).filter(x => x.id !== r.id) }));
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload?.user_id !== chatPartnerAuthId) return;
        setChatTyping(!!payload.typing);
        if (payload.typing) window.setTimeout(() => setChatTyping(false), 1800);
      })
      .subscribe();
    return () => {
      if (chatTypingTimerRef.current) window.clearTimeout(chatTypingTimerRef.current);
      setChatTyping(false);
      chatRealtimeRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [authUser?.id, chatOpen, chatPartnerAuthId]);

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
      const path = `${authUser.id}/comments/${commentId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("guardian-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return { ok: false, message: uploadError.message, attachments: uploaded };
      const { data: publicData } = supabase.storage.from("guardian-media").getPublicUrl(path);
      const { data: attachment, error: attachmentError } = await supabase.from("comment_attachments").insert({
        comment_id: commentId, file_name: file.name, file_path: path, file_type: file.type, file_size: file.size, public_url: publicData.publicUrl
      }).select().single();
      if (attachmentError) {
        await supabase.storage.from("guardian-media").remove([path]);
        return { ok: false, message: attachmentError.message, attachments: uploaded };
      }
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
    const url = `${window.location.origin}/?post=${post.id}`;
    let shared = false;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || "GUARDIAN WORK", text: post.content?.slice(0, 120) || "GUARDIAN WORK post", url });
        shared = true;
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        shared = true;
      } else {
        return flash("Sharing is not available on this device. Copy this page link to share the post.");
      }
    } catch (shareError: any) {
      if (shareError?.name === "AbortError") return flash("Sharing cancelled. No share was recorded.");
      return flash("The share could not be completed. No share was recorded.");
    }

    if (!shared) return;
    const { error } = await supabase.from("post_shares").insert({
      post_id: post.id,
      author_type: account?.role === "business" ? "business" : "person",
      author_id: account?.role === "business" ? currentBusiness?.id || null : currentPerson?.id || null,
    });
    if (error) return flash(`Post shared, but the share count could not be saved: ${error.message}`);
    const { error: countError } = await supabase.rpc("guardian_adjust_post_count", { p_post_id: post.id, p_field: "shares_count", p_delta: 1 });
    if (countError) return flash(`Post shared, but the share count could not be updated: ${countError.message}`);
    setPosts((old) => old.map((p) => (p.id === post.id ? { ...p, shares_count: p.shares_count + 1 } : p)));
    flash(navigator.share ? "Post shared." : "Post link copied and share recorded.");
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
            <BrandLogo className="h-14 w-auto max-w-[13rem] rounded-xl bg-white p-1" />
            <div className="mt-5 text-xs font-black uppercase tracking-widest text-orange-300">GUARDIAN WORK</div>
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
            <BrandLogo className="h-14 w-auto max-w-[13rem] rounded-xl bg-white p-1" />
            <div className="mt-5 text-xs font-black uppercase tracking-widest text-orange-300">GUARDIAN WORK</div>
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
            <div className="mt-5 text-center text-xs text-slate-500">Secure access, clear actions and transparent account activity.</div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center">
        <Card className="w-full p-6 sm:p-8">
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">GUARDIAN WORK</div>
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

  useEffect(() => {
    const timer = window.setInterval(() => setStatusNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeMyStatusCount = guardianStatuses.filter((s) => {
    if (s.author_auth_user_id !== authUser?.id) return false;
    return !s.expires_at || new Date(s.expires_at).getTime() > statusNow;
  }).length;

  const statusRingStyle = (count: number) => {
    if (count <= 0) return undefined;
    if (count === 1) return { background: "#f97316" } as CSSProperties;
    const gap = 3;
    const segment = 100 / count;
    const stops: string[] = [];
    for (let i = 0; i < count; i++) {
      const start = i * segment;
      const orangeEnd = start + Math.max(0, segment - gap);
      stops.push(`#f97316 ${start}% ${orangeEnd}%`, `#ffffff ${orangeEnd}% ${start + segment}%`);
    }
    return { background: `conic-gradient(from -90deg, ${stops.join(", ")})` } as CSSProperties;
  };

  const statusAvatar = (name: string | null, photoUrl: string | null, count: number, size = "h-11 w-11") => (
    <div
      className={`${size} rounded-full p-[3px] shrink-0`}
      style={statusRingStyle(count)}
    >
      <div className="h-full w-full rounded-full bg-orange-100 overflow-hidden ring-2 ring-white">
        {photoUrl ? <img src={photoUrl} alt={name || "Profile"} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xs font-black text-orange-700">{initials(name)}</div>}
      </div>
    </div>
  );

  const openStatusOwnerProfile = async (status: GuardianStatus) => {
    if (status.author_type === "person" && status.author_id) {
      const person = people.find((p) => p.id === status.author_id);
      if (!person?.auth_user_id) return flash("That profile is not available for private chat right now.");
      return openChatDialog(person.name || "GUARDIAN member", person.auth_user_id, person.profile_photo_url || null);
    }
    if (status.author_type === "business" && status.author_id) {
      const business = businesses.find((b) => b.id === status.author_id);
      if (!business?.auth_user_id) return flash("That business is not available for private chat right now.");
      return openChatDialog(business.name || business.business_name || "GUARDIAN business", business.auth_user_id, null);
    }
    return flash("Admin profiles do not support direct chat.");
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button onClick={() => nav("home")} className="flex items-center text-left">
          <BrandLogo className="h-11 w-auto max-w-[12rem] sm:h-12 sm:max-w-[15rem]" />
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
              {id === "live" ? `Live video (${liveSessionCount})` : label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <button onClick={() => nav("live")} className="hidden rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-700 sm:block">LIVE · {liveSessionCount}</button>
          <div className="hidden text-right sm:block">
            <div className="text-xs font-black text-slate-900">{currentPerson?.name || currentBusiness?.name || currentBusiness?.business_name || "GUARDIAN member"}</div>
            <div className="text-[10px] text-slate-500">{currentPerson?.job_title || (account?.role === "business" ? "Business account" : "Work identity")}</div>
          </div>
          <button
            onClick={() => setProfileMenuOpen(v => !v)}
            aria-label="Open GUARDIAN WORK menu"
            aria-expanded={profileMenuOpen}
            className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-emerald-600 bg-white text-2xl font-black leading-none text-emerald-700 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <span aria-hidden="true">☰</span>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-14 z-[90] w-[min(88vw,320px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 bg-emerald-700 p-4 text-white">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-100">GUARDIAN WORK</div>
                <div className="mt-1 text-lg font-black">Main menu</div>
                <div className="mt-1 text-xs text-emerald-100">Everything you need in one place.</div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-2">
                {navItems.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => { setProfileMenuOpen(false); nav(id); }}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${active === id ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <span>{id === "live" ? `Live video (${liveSessionCount})` : label}</span><span className="text-slate-300">›</span>
                  </button>
                ))}
                <button onClick={() => { setProfileMenuOpen(false); signOut(); }} className="mt-1 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black text-slate-700 hover:bg-slate-50">
                  <span>Sign out</span><span className="text-orange-500">↗</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {[
          ["home", "Home"],
          ["work", "Work"],
          ["timeline", "Status"],
          ["chats", "Chats"],
          ["support", "Support"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => nav(id)}
            className={`rounded-xl px-2 py-2.5 text-[10px] font-black ${
              active === id ? "bg-emerald-600 text-white" : id === "support" ? "text-orange-600 hover:bg-orange-50" : "text-slate-600"
            }`}
          >
            {id === "support" ? "🤝 " : ""}{label}
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
          <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">GUARDIAN MATCHES</div><h2 className="mt-1 text-xl font-black text-slate-900">Your Smart Matches</h2><p className="mt-1 text-xs text-slate-500">Ranked by the GUARDIAN Match Engine using transparent skills, location, identity, experience and availability signals.</p></div>
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

  const renderWork = () => {
    if (account?.role === "business") {
      if (!currentBusiness) {
        return (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-orange-500">I'M HIRING</div>
              <h1 className="mt-1 text-3xl font-black text-slate-900">Business profile needs attention.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Your secure business account is recognised, but its Business Identity has not loaded yet. GUARDIAN WORK will never show you the Job Seeker Work Identity by mistake.</p>
            </div>
            <Card className="border-orange-200 p-6">
              <div className="text-sm font-black text-slate-900">Business Identity unavailable</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Refresh your session or open Settings to complete or repair the business profile.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="orange" onClick={() => { if (authUser) void hydrateAccount(authUser); }}>Reload Business Profile</Button>
                <Button variant="light" onClick={() => nav("settings")}>Open Business Settings</Button>
              </div>
            </Card>
          </div>
        );
      }

      {

      const businessName = currentBusiness.business_name || currentBusiness.name || "Your business";
      const location = [currentBusiness.town, currentBusiness.province].filter(Boolean).join(" · ");
      return (
        <div className="space-y-6">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-orange-500">My Business</div>
            <h1 className="mt-1 text-3xl font-black text-slate-900">Business Identity</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Your business has its own identity on GUARDIAN WORK. Represent what your business does, the people it serves, the work it creates and whether you are hiring.</p>
          </div>

          <Card className="overflow-hidden border-emerald-200">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-orange-500 text-2xl font-black">{initials(businessName)}</div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-orange-200">Business Identity</div>
                    <h2 className="mt-1 text-2xl font-black">{businessName}</h2>
                    <div className="mt-1 text-sm text-emerald-100">{currentBusiness.business_type || "Business"}{currentBusiness.industry ? ` · ${currentBusiness.industry}` : ""}</div>
                    {location && <div className="mt-1 text-xs text-emerald-100">{location}</div>}
                  </div>
                </div>
                <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">BUSINESS ACCOUNT</span>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Industry</div><div className="mt-1 font-black text-slate-900">{currentBusiness.industry || "Add your industry"}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Hiring</div><div className="mt-1 font-black text-slate-900">{currentBusiness.hiring_status || "Set hiring status"}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">About the business</div><div className="mt-1 text-sm leading-6 text-slate-700">{currentBusiness.description || "Tell people what your business does and who you serve."}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Services / products</div><div className="mt-1 text-sm leading-6 text-slate-700">{currentBusiness.services || "Add the services, products or areas of work your business provides."}</div></div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 p-6">
              <Button variant="green" onClick={() => nav("settings")}>Edit Business Profile</Button>
              <Button variant="orange" onClick={() => nav("business")}>Business workspace</Button>
              <Button variant="light" onClick={() => nav("jobs")}>View opportunities</Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <button type="button" onClick={() => nav("jobs")} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation"><div className="text-xs font-black uppercase tracking-widest text-orange-500">OPPORTUNITIES</div><div className="mt-1 font-black text-slate-900">Publish work</div><div className="mt-1 text-xs text-slate-500">Create opportunities people can discover.</div></button>
            <button type="button" onClick={() => nav("talent")} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">TALENT</div><div className="mt-1 font-black text-slate-900">Find people</div><div className="mt-1 text-xs text-slate-500">Discover people by ability, location and work identity.</div></button>
            <button type="button" onClick={() => nav("timeline")} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 touch-manipulation"><div className="text-xs font-black uppercase tracking-widest text-orange-500">COMMUNITY</div><div className="mt-1 font-black text-slate-900">Post as your business</div><div className="mt-1 text-xs text-slate-500">Share business updates and statuses with the community.</div></button>
          </div>
        </div>
      );
    }

      }

    return (
      <div className="space-y-6">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-orange-500">My Work</div>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Work Identity</h1>
          <p className="mt-2 text-sm text-slate-500">Build the professional identity businesses can discover.</p>
        </div>

        <Card className="overflow-hidden border-emerald-200">
          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {currentPerson?.profile_photo_url ? <img src={currentPerson.profile_photo_url} alt="Profile" className="h-24 w-24 rounded-3xl object-cover ring-4 ring-emerald-50" /> : <div className="grid h-24 w-24 place-items-center rounded-3xl bg-emerald-100 text-2xl font-black text-emerald-700">{initials(currentPerson?.name || "G")}</div>}
                <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Profile picture</div><h2 className="mt-1 text-xl font-black text-slate-900">Put a face to your Work Identity.</h2><p className="mt-1 text-sm text-slate-500">Use a clear professional photo so businesses can recognise your profile.</p></div>
              </div>
              <label className="cursor-pointer rounded-xl bg-orange-500 px-4 py-2.5 text-center text-sm font-black text-white">{profilePhotoBusy ? "Uploading..." : (currentPerson?.profile_photo_url ? "Change picture" : "Add profile picture")}<input type="file" accept="image/*" className="hidden" disabled={profilePhotoBusy} onChange={e => e.target.files?.[0] && uploadProfilePhoto(e.target.files[0])} /></label>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-emerald-200">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-emerald-100">GUARDIAN WORK ID</div><h2 className="mt-1 text-2xl font-black">Make your ability easy to understand.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Your Work ID brings together your work identity, skills, proof and discoverability in one place.</p></div><div className="rounded-2xl bg-white/10 px-4 py-3 text-center"><div className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Status</div><div className="mt-1 text-lg font-black">{currentPerson?.profile_visibility === "hidden" ? "Hidden" : "Discoverable"}</div></div></div>
          </div>
          <div className="grid gap-5 p-6 lg:grid-cols-[1.2fr_.8fr]"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Public work identity</div><div className="mt-2 text-2xl font-black text-slate-900">{currentPerson?.name || "Your name"}</div><div className="mt-1 text-lg font-bold text-orange-600">{workId?.headline || currentPerson?.headline || currentPerson?.job_title || "Add what you do"}</div><p className="mt-3 text-sm leading-6 text-slate-500">{workId?.summary || "Add a short explanation of the work you do, the problems you solve and the value you bring."}</p><div className="mt-4 flex flex-wrap gap-2">{(safeText(workId?.services || currentPerson?.skills).split(/[,;]+/).map(x => x.trim()).filter(Boolean).slice(0, 8)).map(skill => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">{skill}</span>)}</div></div><div className="rounded-2xl bg-slate-50 p-5"><div className="font-black text-slate-900">Discovery control</div><p className="mt-1 text-xs leading-5 text-slate-500">Choose whether businesses can discover your Work ID.</p><div className="mt-4 flex gap-2"><Button variant={currentPerson?.profile_visibility === "hidden" ? "light" : "green"} onClick={() => toggleWorkDiscovery(true)}>Discoverable</Button><Button variant={currentPerson?.profile_visibility === "hidden" ? "orange" : "light"} onClick={() => toggleWorkDiscovery(false)}>Hide</Button></div><div className="mt-4 text-xs font-bold text-slate-500">{workProofs.length} proof{workProofs.length === 1 ? "" : "s"} · {workRecommendations.length} recommendation{workRecommendations.length === 1 ? "" : "s"}</div></div></div>
          <div className="border-t border-slate-100 p-6"><div className="grid gap-3 md:grid-cols-3"><label className="text-xs font-bold text-slate-600 md:col-span-1">Work ID headline<input value={workId?.headline || workForm.headline || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), headline: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label><label className="text-xs font-bold text-slate-600 md:col-span-1">About my work<textarea rows={3} value={workId?.summary || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), summary: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="What do you do well?" /></label><label className="text-xs font-bold text-slate-600 md:col-span-1">Services / skills<textarea rows={3} value={workId?.services || currentPerson?.skills || ""} onChange={e => setWorkId(old => ({ ...(old || { id: "", job_seeker_id: currentPerson?.id || "", public_slug: "", headline: null, summary: null, services: null, discoverable: true, created_at: "", updated_at: "" }), services: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" placeholder="e.g. computer support, data capture, field work" /></label></div><Button className="mt-4" variant="orange" disabled={workIdSaving} onClick={saveWorkID}>{workIdSaving ? "Saving..." : "Save Work ID"}</Button></div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><Card className="p-6"><div className="grid gap-4 sm:grid-cols-2">{[["name", "Full name"],["job_title", "What do you do?"],["province", "Province"],["town", "Town / Area"],["phone", "Phone"],["email", "Email"],["experience", "Experience"],["availability", "Availability"],["headline", "Professional headline"],["skills", "Skills"]].map(([key, label]) => <label key={key} className="text-xs font-bold text-slate-600">{label}{key === "province" ? <select value={(workForm as any)[key]} onChange={(e) => setWorkForm({ ...workForm, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500"><option value="">Select province</option>{provinces.map((p) => <option key={p}>{p}</option>)}</select> : <input value={(workForm as any)[key]} onChange={(e) => setWorkForm({ ...workForm, [key]: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500" />}</label>)}</div><Button className="mt-5" onClick={updateWorkIdentity}>Save Work Identity</Button></Card><div className="space-y-5"><Card className="overflow-hidden"><div className="bg-emerald-700 p-6 text-white"><div className="text-xs font-bold uppercase tracking-widest text-emerald-100">Discoverability</div><div className="mt-2 text-4xl font-black">{currentPerson?.profile_completion || 0}%</div><p className="mt-2 text-sm text-emerald-50">Complete more of your Work Identity to make your ability easier to understand.</p></div><div className="p-6"><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange-500" style={{ width: `${currentPerson?.profile_completion || 0}%` }} /></div></div></Card></div></div>
      </div>
    );
  };

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

      {account?.role === "business" && currentBusiness && (
        <Card className="overflow-hidden border-emerald-200">
          <div className="bg-emerald-700 p-6 text-white">
            <div className="text-xs font-black uppercase tracking-widest text-orange-300">Business Profile</div>
            <h2 className="mt-1 text-2xl font-black">Edit your business identity.</h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50">This is the business profile, not a job seeker Work Identity. Use it to represent your company, services, hiring needs and business contact details.</p>
          </div>
          <div className="p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-black text-slate-600 sm:col-span-2">Business / trading name<input value={businessProfileForm.name} onChange={e=>setBusinessProfileForm({...businessProfileForm,name:e.target.value})} placeholder="e.g. Tau Logistics" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Business type<select value={businessProfileForm.business_type} onChange={e=>setBusinessProfileForm({...businessProfileForm,business_type:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">Select type</option><option>Company</option><option>Close Corporation</option><option>Partnership</option><option>Sole Proprietor</option><option>Non-profit organisation</option><option>Co-operative</option><option>Informal business</option><option>Other</option></select></label>
              <label className="text-xs font-black text-slate-600">Industry<input value={businessProfileForm.industry} onChange={e=>setBusinessProfileForm({...businessProfileForm,industry:e.target.value})} placeholder="e.g. Construction, Retail, Logistics" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Registration number<input value={businessProfileForm.registration_number} onChange={e=>setBusinessProfileForm({...businessProfileForm,registration_number:e.target.value})} placeholder="Optional" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Contact person<input value={businessProfileForm.contact_person} onChange={e=>setBusinessProfileForm({...businessProfileForm,contact_person:e.target.value})} placeholder="Owner / manager / HR contact" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Business email<input type="email" value={businessProfileForm.email} onChange={e=>setBusinessProfileForm({...businessProfileForm,email:e.target.value})} placeholder="business@example.co.za" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Business phone<input value={businessProfileForm.phone} onChange={e=>setBusinessProfileForm({...businessProfileForm,phone:e.target.value})} placeholder="Business contact number" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Website<input value={businessProfileForm.website} onChange={e=>setBusinessProfileForm({...businessProfileForm,website:e.target.value})} placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Province<select value={businessProfileForm.province} onChange={e=>setBusinessProfileForm({...businessProfileForm,province:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">Province</option>{provinces.map(p=><option key={p}>{p}</option>)}</select></label>
              <label className="text-xs font-black text-slate-600">Town / area<input value={businessProfileForm.town} onChange={e=>setBusinessProfileForm({...businessProfileForm,town:e.target.value})} placeholder="Town / area" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600">Company size<select value={businessProfileForm.company_size} onChange={e=>setBusinessProfileForm({...businessProfileForm,company_size:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="">Select size</option><option>1-5 people</option><option>6-20 people</option><option>21-50 people</option><option>51-200 people</option><option>201-500 people</option><option>500+ people</option></select></label>
              <label className="text-xs font-black text-slate-600">Hiring status<select value={businessProfileForm.hiring_status} onChange={e=>setBusinessProfileForm({...businessProfileForm,hiring_status:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"><option>Hiring / open to talent</option><option>Not currently hiring</option><option>Hiring for specific roles</option><option>Building a talent pool</option></select></label>
              <label className="text-xs font-black text-slate-600 sm:col-span-2">Services / products<textarea rows={3} value={businessProfileForm.services} onChange={e=>setBusinessProfileForm({...businessProfileForm,services:e.target.value})} placeholder="What does the business provide?" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
              <label className="text-xs font-black text-slate-600 sm:col-span-2">About the business<textarea rows={4} value={businessProfileForm.description} onChange={e=>setBusinessProfileForm({...businessProfileForm,description:e.target.value})} placeholder="Tell the GUARDIAN WORK community what your business does, who you serve and what kind of work you create." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" /></label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2"><Button variant="green" onClick={saveExistingBusinessProfile}>Save Business Profile</Button><Button variant="light" onClick={()=>nav("business")}>Back to Business</Button></div>
          </div>
        </Card>
      )}

      {account?.role !== "business" && <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="font-black text-slate-900">Profile visibility</div><div className="text-xs text-slate-500">Control whether your Work Identity can be discovered by businesses.</div></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{currentPerson?.profile_visibility || "discoverable"}</span></div>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="green" onClick={async()=>{if(currentPerson){const {data,error}=await supabase.from("Job seekers").update({profile_visibility:"discoverable"}).eq("id",currentPerson.id).select().single(); if(error)return flash(error.message);setCurrentPerson(data as Person);setPeople(old=>old.map(p=>p.id===currentPerson.id?data as Person:p));flash("Profile is now discoverable.");}}}>Make discoverable</Button><Button variant="light" onClick={async()=>{if(currentPerson){const {data,error}=await supabase.from("Job seekers").update({profile_visibility:"hidden"}).eq("id",currentPerson.id).select().single();if(error)return flash(error.message);setCurrentPerson(data as Person);setPeople(old=>old.map(p=>p.id===currentPerson.id?data as Person:p));flash("Profile hidden from discovery.");}}}>Hide profile</Button></div>
      </Card>}

      <Card className="p-6">
        <h2 className="font-black text-slate-900">Notifications</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button onClick={()=>saveNotificationPreferences({portal_enabled:!(notificationPreference?.portal_enabled!==false)})} className="rounded-2xl border border-slate-200 p-4 text-left"><div className="font-black">Portal alerts</div><div className="mt-1 text-xs text-slate-500">{notificationPreference?.portal_enabled === false ? "Off" : "On"}</div></button><button onClick={()=>nav("alerts")} className="rounded-2xl border border-slate-200 p-4 text-left"><div className="font-black">WhatsApp alerts</div><div className="mt-1 text-xs text-slate-500">Manage R10/month delivery.</div></button></div>
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">Language & accessibility</h2><div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="font-bold">English (EN)</div><div className="mt-1 text-xs text-slate-500">GUARDIAN WORK currently uses English. No automatic locale switching.</div></div>
      </Card>

      <Card className="p-6">
        <h2 className="font-black text-slate-900">App controls</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Button variant="light" onClick={()=>loadAll()}>Refresh platform data</Button><Button variant="light" onClick={()=>{window.localStorage.removeItem("guardian-work-theme");setTheme("light");flash("Local display preferences reset.");}}>Reset display preferences</Button><Button variant="light" onClick={()=>nav("profile")}>View my profile</Button>{account?.role !== "business" && <Button variant="light" onClick={()=>nav("work")}>Edit Work Identity</Button>}</div>
      </Card>

      <Card className="p-6 border-emerald-200">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-600">Security & Data</div><h2 className="mt-1 text-xl font-black text-slate-900">Control your GUARDIAN WORK data.</h2><p className="mt-2 text-sm text-slate-500">Export the information associated with your account or submit a protected deletion request.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Button variant="green" disabled={securityBusy} onClick={exportMyData}>{securityBusy ? "Preparing..." : "Export my data"}</Button><Button variant="danger" disabled={deleteRequestBusy} onClick={requestAccountDeletion}>{deleteRequestBusy ? "Submitting..." : "Request account deletion"}</Button></div>
        <div className="mt-5"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Recent security activity</div>{securityEvents.length ? <div className="mt-2 space-y-2">{securityEvents.slice(0,5).map(e=><div key={e.id} className="flex justify-between gap-3 rounded-xl bg-slate-50 p-3 text-xs"><span className="font-bold text-slate-700">{e.event_type.replace(/_/g," ")}</span><span className="text-slate-400">{formatDate(e.created_at)}</span></div>)}</div> : <div className="mt-2 text-sm text-slate-500">No recent security events.</div>}</div>
      </Card>

      <Card className="p-6">
        <div className="text-xs font-black uppercase tracking-widest text-orange-500">About GUARDIAN WORK</div><h2 className="mt-1 text-xl font-black text-slate-900">Make your ability discoverable.</h2><p className="mt-2 text-sm leading-6 text-slate-600">GUARDIAN WORK is a product of <strong>MY GUARDIAN LINK</strong>, built to connect businesses with people through Work Identity, skills, proof, matching and real opportunities.</p><div className="mt-4 flex flex-wrap gap-2"><a href="mailto:mtausibusiso@gmail.com?subject=GUARDIAN%20WORK%20enquiry" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white">Email Us</a><span className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600">mtausibusiso@gmail.com</span></div></Card>

      <Card className="p-6"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">Privacy</div><h2 className="mt-1 font-black text-slate-900">Your information should work for you.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Control discoverability before sharing your work identity. GUARDIAN WORK uses account controls, authentication and secure payment processing to protect your information and transactions.</p></Card>
      <div className="text-xs text-slate-400">GUARDIAN WORK - Real-time Chat + Status + Payment Methods</div>
    </div>
  );

  const renderLive = () => {
    const room = liveSession?.jitsi_room || "GuardianWorkAdvice";
    const jitsiUrl = `https://meet.jit.si/${encodeURIComponent(room)}`;
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><div className="text-xs font-black uppercase tracking-widest text-orange-500">LIVE VIDEO</div><div className="mt-1 text-sm font-bold text-slate-500">Free GUARDIAN WORK advice sessions.</div></div>
          <div className="flex flex-wrap gap-2"><Button variant="light" disabled={liveRefreshBusy} onClick={() => void refreshLive()}>{liveRefreshBusy ? "Refreshing..." : "↻ Refresh LIVE"}</Button>{liveSession && <Button variant="orange" onClick={jumpToLiveVideo}>Join LIVE</Button>}</div>
        </div>
        <div className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="border-b border-white/10 bg-emerald-700 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">GUARDIAN WORK · LIVE</div><h1 className="mt-1 text-2xl font-black sm:text-3xl">Free LIVE work advice.</h1><p className="mt-1 text-sm text-emerald-50">Real people. Real work advice. Viewers stay in chat while approved hosts and advisors use the video room.</p></div>
              <div className="rounded-full bg-orange-500 px-4 py-2 text-xs font-black">● {liveUsers} watching</div>
            </div>
          </div>
          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            {liveSession?.status === "live" ? (
              <div>
                <div id="guardian-live-video" className="relative overflow-hidden rounded-2xl bg-black shadow-2xl" style={{ aspectRatio: "16 / 9" }}>
                  <div className="absolute left-3 top-3 z-10 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-black text-white">● LIVE · {liveUsers} watching</div>
                  <div className="absolute right-3 top-3 z-10 rounded-lg bg-black/70 px-3 py-1.5 text-[11px] font-black text-white">VIDEO ROOM</div>
                  <iframe title="GUARDIAN WORK LIVE video" src={jitsiUrl} className="h-full w-full border-0" allow="camera; microphone; fullscreen; display-capture; autoplay" />
                </div>
                <h2 className="mt-4 text-xl font-black">{liveSession.title}</h2>
                <p className="mt-1 text-sm text-slate-300">{liveSession.description || "Host approval is controlled by GUARDIAN WORK account access. Viewers can watch and ask advice in moderated chat."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={jitsiUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white">Open video room</a>
                  <button type="button" onClick={() => void copyLiveRoom(liveSession)} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-black text-white">Copy room link</button>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[360px] place-items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <div><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-500 text-2xl">LIVE</div><h2 className="mt-5 text-2xl font-black">No LIVE session right now.</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-300">Come back for the next free advice session. When a session is live, the video room and moderated chat appear here automatically.</p></div>
              </div>
            )}

            <div className="flex min-h-[360px] flex-col rounded-2xl bg-white text-slate-900">
              <div className="border-b border-slate-200 p-4"><div className="font-black">LIVE Chat · Advice Only</div><div className="mt-1 text-[11px] font-bold text-slate-500">No phone numbers, links, WhatsApp or “DM me”.</div></div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                {liveMessages.length === 0 && <div className="rounded-xl bg-orange-50 p-3 text-xs font-bold text-orange-900">Welcome. Ask a useful work question and keep personal contact details out of the chat.</div>}
                {liveMessages.map(m => <div key={m.id} className={`rounded-xl p-3 text-sm ${m.sender_role !== "viewer" ? "border-l-4 border-orange-500 bg-orange-50" : "bg-slate-50"}`}><div className="text-[10px] font-black uppercase tracking-wider text-slate-500">{m.sender_name || "GUARDIAN member"} · {m.sender_role === "viewer" ? "Viewer" : m.sender_role === "admin" ? "GUARDIAN Admin" : "Approved Host"}</div><div className="mt-1 font-medium text-slate-800">{m.content}</div></div>)}
              </div>
              <div className="border-t border-slate-200 p-3">
                <div className="flex items-end gap-2"><textarea value={liveDraft} onChange={e => setLiveDraft(e.target.value)} onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); void sendLiveMessage(); } }} placeholder={liveSession?.status === "live" ? "Ask the advisor..." : "Chat opens when LIVE starts."} disabled={!liveSession || liveBusy} className="min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none" /><Button variant="orange" disabled={!liveSession || liveBusy || !liveDraft.trim()} onClick={() => void sendLiveMessage()}>{liveBusy ? "Sending..." : "Send"}</Button></div>
              </div>
            </div>
          </div>
        </div>

        {liveIsHost && (
          <Card className="p-5 sm:p-6">
            <div className="text-xs font-black uppercase tracking-widest text-orange-500">HOST CONTROLS</div>
            <h2 className="mt-1 text-xl font-black">Run a GUARDIAN WORK LIVE session</h2>
            <p className="mt-2 text-sm text-slate-500">Business and GUARDIAN admin accounts can start the session. Camera/microphone approval remains inside the video room; GUARDIAN does not expose a host PIN in browser code.</p>
            <div className={`mt-3 rounded-xl p-3 text-sm font-black ${myLiveSession ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{myLiveSession ? "🔴 Your LIVE session is active." : "Ready to test: start a LIVE session, open the Jitsi room, then end it."}</div>
            {!myLiveSession ? <div className="mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant={liveHostMode === "now" ? "orange" : "light"} onClick={() => setLiveHostMode("now")}>● Start a session</Button>
                <Button variant={liveHostMode === "schedule" ? "orange" : "light"} onClick={() => setLiveHostMode("schedule")}>Schedule a session</Button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input value={liveHostForm.title} onChange={e=>setLiveHostForm(o=>({...o,title:e.target.value}))} placeholder="LIVE title e.g. What employers look for in a Till Packer" className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold sm:col-span-2" />
                <textarea value={liveHostForm.description} onChange={e=>setLiveHostForm(o=>({...o,description:e.target.value}))} placeholder="What should viewers learn?" className="min-h-24 rounded-xl border border-slate-200 p-3 text-sm sm:col-span-2" />
                <input value={liveHostForm.room} onChange={e=>setLiveHostForm(o=>({...o,room:e.target.value}))} placeholder="Jitsi room name" className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold" />
                {liveHostMode === "schedule" ? <input type="datetime-local" value={liveScheduleAt} onChange={e=>setLiveScheduleAt(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold" /> : null}
                {liveHostMode === "now" ? <Button variant="orange" disabled={liveHostBusy} onClick={() => void startLiveSession()}>{liveHostBusy ? "Starting..." : "● Start LIVE"}</Button> : <Button variant="orange" disabled={liveHostBusy} onClick={() => void scheduleLiveSession()}>{liveHostBusy ? "Scheduling..." : "Schedule LIVE"}</Button>}
              </div>
            </div> : <div className="mt-4 grid gap-3 sm:grid-cols-2"><input value={liveRecordingUrl} onChange={e=>setLiveRecordingUrl(e.target.value)} placeholder="Optional final recording URL" className="rounded-xl border border-slate-200 px-3 py-3 text-sm sm:col-span-2" /><Button variant="danger" disabled={liveHostBusy} onClick={() => void endLiveSession()}>{liveHostBusy ? "Ending..." : "End LIVE session"}</Button><div className="rounded-xl bg-orange-50 p-3 text-xs font-bold text-orange-900">Recording is not faked. Start/stop recording in the video provider, then save its final link here when the session ends.</div></div>}
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          <button type="button" onClick={()=>document.getElementById("guardian-live-upcoming")?.scrollIntoView({behavior:"smooth",block:"start"})} className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation">
            <div className="flex items-center justify-between gap-3"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">FREE SESSIONS</div><span className="text-sm font-black text-emerald-700">View sessions →</span></div>
            <h3 className="mt-2 text-lg font-black">Practical advice, not lectures.</h3><p className="mt-2 text-sm text-slate-500">CVs, interviews, workplace readiness, skills and what businesses actually look for.</p>
          </button>
          <button type="button" onClick={jumpToLiveVideo} className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 touch-manipulation">
            <div className="flex items-center justify-between gap-3"><div className="text-xs font-black uppercase tracking-widest text-orange-500">SAFE CHAT</div><span className="text-sm font-black text-orange-600">Open LIVE →</span></div>
            <h3 className="mt-2 text-lg font-black">Advice stays advice.</h3><p className="mt-2 text-sm text-slate-500">Automated protection blocks common attempts to share phone numbers, links or private-contact requests.</p>
          </button>
          <button type="button" onClick={()=>document.getElementById("guardian-live-past")?.scrollIntoView({behavior:"smooth",block:"start"})} className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation">
            <div className="flex items-center justify-between gap-3"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">PAST RECORDINGS</div><span className="text-sm font-black text-emerald-700">View library →</span></div>
            <h3 className="mt-2 text-lg font-black">Build a work-advice library.</h3><p className="mt-2 text-sm text-slate-500">After a real recording is published, its verified recording link can be attached to an ended session.</p>
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card id="guardian-live-upcoming" className="p-5 sm:p-6 scroll-mt-24"><div className="flex items-center justify-between gap-3"><button type="button" onClick={()=>document.getElementById("guardian-live-upcoming")?.scrollIntoView({behavior:"smooth",block:"start"})} className="min-w-0 flex-1 rounded-2xl text-left transition hover:bg-emerald-50/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation"><div className="text-xs font-black uppercase tracking-widest text-emerald-600">UPCOMING</div><h2 className="mt-1 text-xl font-black">Next sessions</h2><div className="mt-1 text-xs font-bold text-emerald-700">Open upcoming sessions →</div></button><span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">FREE</span></div><div className="mt-4 space-y-3">{liveSessions.filter(x=>x.status==="scheduled").slice(0,5).map(session=><div key={session.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="font-black text-slate-900">{session.title}</div><div className="mt-1 text-xs font-bold text-slate-500">{session.scheduled_at ? formatDate(session.scheduled_at) : "Time to be announced"} · {session.host_name || "GUARDIAN WORK host"}</div>{session.description && <div className="mt-2 text-sm text-slate-600">{session.description}</div>}<div className="mt-3 flex flex-wrap gap-2"><Button variant="light" onClick={()=>void remindMeForLive(session)}>🔔 Remind me</Button><Button variant="light" onClick={()=>void copyLiveRoom(session)}>Copy room</Button><Button variant="orange" onClick={()=>openLiveRoom(session)}>Join / Open room</Button>{liveIsHost && (session.host_auth_user_id === authUser?.id || account?.role === "admin") && <Button variant="green" disabled={liveHostBusy} onClick={()=>void startScheduledLiveSession(session)}>Start LIVE</Button>}</div></div>)}{!liveSessions.some(x=>x.status==="scheduled") && <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No upcoming session has been scheduled yet.</div>}</div></Card>
          <Card id="guardian-live-past" className="p-5 sm:p-6 scroll-mt-24"><button type="button" onClick={()=>document.getElementById("guardian-live-past")?.scrollIntoView({behavior:"smooth",block:"start"})} className="w-full rounded-2xl text-left transition hover:bg-orange-50/60 focus:outline-none focus:ring-2 focus:ring-orange-400 touch-manipulation"><div className="text-xs font-black uppercase tracking-widest text-orange-500">PAST ADVICE</div><h2 className="mt-1 text-xl font-black">Recorded sessions</h2><div className="mt-1 text-xs font-bold text-orange-600">Open past advice →</div></button><div className="mt-4 space-y-3">{liveSessions.filter(x=>x.status==="ended").slice(0,5).map(session=><div key={session.id} className="rounded-2xl border border-slate-200 p-4"><div className="font-black text-slate-900">{session.title}</div><div className="mt-1 text-xs font-bold text-slate-500">Ended · {session.host_name || "GUARDIAN WORK host"}</div>{session.recording_url ? <Button className="mt-3" variant="orange" onClick={()=>window.open(session.recording_url as string,"_blank","noopener,noreferrer")}>▶ Watch recording</Button> : <div className="mt-2 text-xs text-slate-500">Recording link has not been published yet.</div>}</div>)}{!liveSessions.some(x=>x.status==="ended") && <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Past recordings will appear here after a real recording link is published.</div>}</div></Card>
        </div>
      </div>
    );
  };

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
    if (active === "chats") return renderChats();
    if (active === "live") return renderLive();
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

      {paymentInstruction && (
        <div className="mx-auto mt-4 max-w-7xl px-4">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm font-bold text-orange-900">{paymentInstruction}<button className="ml-3 font-black text-orange-600" onClick={()=>setPaymentInstruction("")}>Dismiss</button></div>
        </div>
      )}

      {dataWarnings.length > 0 && (
        <div className="mx-auto mt-4 max-w-7xl px-4">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-xs font-black uppercase tracking-widest text-orange-600">Some platform data needs attention</div><div className="mt-1 text-sm font-bold text-slate-700">A section may be incomplete because one or more records could not be loaded.</div></div>
              <Button variant="orange" onClick={() => { setDataWarnings([]); void loadAll(); }}>Retry data</Button>
            </div>
            <details className="mt-3 text-xs text-slate-600"><summary className="cursor-pointer font-black">Show details</summary><ul className="mt-2 list-disc space-y-1 pl-5">{dataWarnings.map((w, i) => <li key={`${w}-${i}`}>{w}</li>)}</ul></details>
          </div>
        </div>
      )}

      {supportModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-slate-950/70 p-0 sm:grid sm:place-items-center sm:p-4">
          <div className="min-h-full w-full bg-white shadow-2xl sm:min-h-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:overflow-y-auto sm:rounded-3xl">
            <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-emerald-600">GUARDIAN SUPPORT</div><h2 className="mt-1 text-2xl font-black text-slate-900">Set up your support request</h2><p className="mt-2 text-sm text-slate-500">Your request is recorded first. For card payments, GUARDIAN opens secure Paystack checkout. Payment is only marked paid after provider verification.</p></div><button onClick={()=>setSupportModalOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">{[["monthly","Monthly"],["one_off","Once-off"],["company_sponsor","Company sponsor"]].map(([v,l])=><button key={v} onClick={()=>setSupportType(v as any)} className={`rounded-2xl border p-3 text-left ${supportType===v?"border-emerald-500 bg-emerald-50":"border-slate-200"}`}><div className="text-xs font-black text-slate-900">{l}</div></button>)}</div>
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">Amount (ZAR)</label><input value={supportAmount} onChange={e=>setSupportAmount(e.target.value)} inputMode="decimal" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold" />
            <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400">Purpose / skill you want to support</label><textarea value={supportPurpose} onChange={e=>setSupportPurpose(e.target.value)} placeholder="e.g. support skills training, work-readiness or a specific skill programme" className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" />
            <div className="mt-4 grid gap-2">{[["credit_card","Credit or debit card","Secure Paystack checkout"],["eft","EFT / bank transfer","Secure EFT through Paystack/Ozow if enabled"],["voucher","Voucher","Redeem a GUARDIAN WORK voucher"],["airtime","Airtime / SIM billing","Create a billing request; provider confirmation required"]].map(([v,l,d])=><button key={String(v)} onClick={()=>setPaymentMethod(String(v))} className={`rounded-2xl border p-3 text-left ${paymentMethod===v?"border-orange-500 bg-orange-50":"border-slate-200"}`}><div className="text-xs font-black text-slate-900">{l}</div><div className="mt-1 text-[11px] text-slate-500">{d}</div></button>)}</div>
            {paymentMethod === "voucher" && <input value={voucherCode} onChange={e=>setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-black tracking-wider" />}
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setSupportModalOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" disabled={supportBusy || paymentProcessing} onClick={paymentMethod === "credit_card" ? createSupportRequest : confirmSupportAlternativePayment}>{supportBusy||paymentProcessing?"Connecting...":paymentMethod === "credit_card"?"Continue to secure card payment":paymentMethod === "eft"?"Continue to EFT":paymentMethod === "voucher"?"Redeem voucher":"Request airtime billing"}</Button></div>
            </div>
          </div>
        </div>
      )}

      {adPaymentOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-slate-950/70 p-0 sm:grid sm:place-items-center sm:p-4">
          <div className="min-h-full w-full bg-white shadow-2xl sm:min-h-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:overflow-y-auto sm:rounded-3xl sm:p-6 p-5">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">Sponsored Timeline</div><h2 className="mt-1 text-2xl font-black text-slate-900">Choose how to pay for your campaign</h2><p className="mt-2 text-sm text-slate-500">Your campaign is saved as pending. No payment is claimed here until a real payment provider confirms it.</p></div><button onClick={()=>setAdPaymentOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 rounded-2xl bg-orange-50 p-4"><div className="text-xs font-black uppercase text-orange-600">Selected package</div><div className="mt-1 text-xl font-black text-slate-900">{(AD_PACKAGES.find(x=>x.code===adPackage)||AD_PACKAGES[0]).name} · R{(AD_PACKAGES.find(x=>x.code===adPackage)||AD_PACKAGES[0]).price}/day</div><div className="mt-1 text-xs text-slate-600">Target: {adForm.target_town || "All towns"}{adForm.target_province ? ` · ${adForm.target_province}` : ""}{adForm.target_skills ? ` · ${adForm.target_skills}` : ""}</div></div>
            <div className="mt-5 grid gap-2">{[["credit_card","Credit or debit card",true],["eft","EFT / bank transfer",false],["voucher","Voucher",false],["airtime","Airtime / SIM billing",false]].map(([value,label,live])=><button key={String(value)} disabled={!live} onClick={()=>live && setAdPaymentMethod(String(value))} className={`rounded-2xl border p-4 text-left ${!live?"cursor-not-allowed opacity-50 bg-slate-50":adPaymentMethod===value?"border-orange-500 bg-orange-50":"border-slate-200"}`}><div className="font-black text-slate-900">{label}</div><div className="mt-1 text-xs text-slate-500">{live ? "Secure Paystack checkout" : "Not connected yet"}</div></button>)}</div>
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setAdPaymentOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" disabled={adCampaignBusy || paymentProcessing} onClick={createSponsoredAd}>{adCampaignBusy || paymentProcessing ? "Opening secure checkout..." : "Pay & launch campaign"}</Button></div>
          </div>
        </div>
      )}

      {paymentOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-slate-950/70 p-0 sm:grid sm:place-items-center sm:p-4">
          <div className="min-h-full w-full bg-white shadow-2xl sm:min-h-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:overflow-y-auto sm:rounded-3xl sm:p-6 p-5">
            <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-widest text-orange-500">WhatsApp Alerts</div><h2 className="mt-1 text-2xl font-black text-slate-900">Choose how to pay R10/month</h2><p className="mt-2 text-sm text-slate-500">Choose Credit or debit card to open secure checkout. WhatsApp access is activated only after the payment provider confirms the transaction.</p></div><button onClick={()=>setPaymentOpen(false)} className="text-xl font-black text-slate-400">X</button></div>
            <div className="mt-5 grid gap-2">
              {[['credit_card','Credit or debit card','Secure Paystack checkout'],['eft','EFT / bank transfer','Secure EFT through Paystack/Ozow if enabled'],['voucher','Voucher','Redeem a GUARDIAN WORK voucher code'],['airtime','Airtime / SIM billing','Create a SIM billing request; provider confirmation required']].map(([value,label,desc])=><button key={String(value)} onClick={()=>setPaymentMethod(String(value))} className={`rounded-2xl border p-4 text-left ${paymentMethod===value?'border-orange-500 bg-orange-50':'border-slate-200 hover:bg-slate-50'}`}><div className="font-black text-slate-900">{label}</div><div className="mt-1 text-xs text-slate-500">{desc}</div></button>)}
            </div>
            {paymentMethod === "voucher" && <input value={voucherCode} onChange={e=>setVoucherCode(e.target.value.toUpperCase())} placeholder="Enter voucher code" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-black tracking-wider" />}
            {paymentMethod === "eft" && <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800">EFT opens the secure Paystack bank-payment flow. EFT is once-off; the R10 WhatsApp subscription will require renewal rather than a recurring EFT charge.</div>}
            {paymentMethod === "airtime" && <div className="mt-3 rounded-2xl bg-orange-50 p-4 text-xs font-bold text-orange-800">The button creates a billing request. GUARDIAN WORK will not pretend airtime was charged until a real mobile-network provider confirms it.</div>}
            <div className="mt-5 flex gap-2"><Button variant="light" className="flex-1" onClick={()=>setPaymentOpen(false)}>Cancel</Button><Button variant="orange" className="flex-1" disabled={paymentProcessing} onClick={confirmWhatsAppPaymentMethod}>{paymentProcessing ? "Connecting..." : paymentMethod === "credit_card" ? "Pay R10 securely" : paymentMethod === "eft" ? "Continue to EFT" : paymentMethod === "voucher" ? "Redeem voucher" : "Request airtime billing"}</Button></div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:py-8">
        {renderContent()}
      </main>

      {renderMobileNav()}
    </div>
  );
}
