import React, { useEffect, useMemo, useState } from "react";

const CHECKLIST_STORAGE_KEY = "jackpot-party-onboarding-checklist-v1";

const TEAM_PROCESS_OWNER_NAME = "Donald Pang";
const MANAGER_LEVELS = new Set(["lead", "manager", "director", "gm"]);
const roleOptions = ["core", "associate", "senior", "lead", "manager", "director", "gm"];

const rawPeople = [
  { name: "Donald Pang", title: "Director of Production", level: "director", department: "Production", managerName: "Justin McFarlance" },
  { name: "Justin McFarlance", title: "General Manager", level: "gm", department: "Leadership", managerName: "" },
  { name: "Rob Rivera", title: "Lead Producer", level: "lead", department: "Production", managerName: "Donald Pang" },
  { name: "Andrew Heidemann", title: "Live Production Lead", level: "lead", department: "Production", managerName: "Donald Pang" },
  { name: "Shawn Peeples", title: "Manager QA Analyst", level: "manager", department: "Qa", managerName: "Jerry Vanhulle" },
  { name: "Jerry Vanhulle", title: "Director QA Analyst", level: "director", department: "Qa", managerName: "Justin McFarlance" },
  { name: "Jesse Miller", title: "Director Software Engineer", level: "director", department: "Engineering", managerName: "Justin McFarlance" },
  { name: "Greg Hanes", title: "Manager Architect", level: "manager", department: "Engineering", managerName: "Jesse Miller" },
  { name: "Drew Persson", title: "Lead Software Engineer", level: "lead", department: "Engineering", managerName: "Jesse Miller" },
  { name: "Kevin Keucker", title: "Lead Software Engineer", level: "lead", department: "Engineering", managerName: "Jesse Miller" },
  { name: "Michael Speiler", title: "Director Product Manager", level: "director", department: "Product", managerName: "Justin McFarlance" },
  { name: "Josh Wilson", title: "Director Monetization Product Manager", level: "director", department: "Monetization", managerName: "Justin McFarlance" },
  { name: "Amir Arad", title: "Director Gameplay Analyst", level: "director", department: "Analytics", managerName: "Justin McFarlance" },
  { name: "Zion Matrini", title: "Director Economy", level: "director", department: "Economy", managerName: "Justin McFarlance" },
  { name: "Elliot Ling", title: "Director Art", level: "director", department: "Art", managerName: "Justin McFarlance" },
  { name: "Aaron Listen", title: "Lead UI Artist", level: "lead", department: "Art", managerName: "Elliot Ling" },
  { name: "Marcus Emmert", title: "Lead Technical Artist", level: "lead", department: "Art", managerName: "Elliot Ling" },
  { name: "David Weaver", title: "Lead QA Analyst", level: "lead", department: "Qa", managerName: "Jerry Vanhulle" },
  { name: "Apoorva Rastagi", title: "Associate Product Manager", level: "associate", department: "Product", managerName: "Michael Speiler" },
  { name: "David Hanlon", title: "Senior Product Manager", level: "senior", department: "Product", managerName: "Michael Speiler" },
  { name: "Austin Tieskotter", title: "Core Producer", level: "core", department: "Production", managerName: "Rob Rivera" },
  { name: "Madison Schroeder", title: "Core Producer", level: "core", department: "Production", managerName: "Rob Rivera" },
  { name: "Sadie Foertsch-Greenwald", title: "Core Producer", level: "core", department: "Production", managerName: "Andrew Heidemann" },
  { name: "Adrian Rosario", title: "Core Product Designer", level: "core", department: "Product", managerName: "Michael Speiler" },
  { name: "Joshua Macklin", title: "Senior Monetization Product Manager", level: "senior", department: "Monetization", managerName: "Josh Wilson" },
  { name: "Nate Stricker", title: "Senior Game Economist", level: "senior", department: "Economy", managerName: "Zion Matrini" },
  { name: "Pete Hoecker", title: "Lead Gameplay Analyst", level: "lead", department: "Analytics", managerName: "Amir Arad" },
  { name: "Jill Gray", title: "Senior Software Engineer", level: "senior", department: "Engineering", managerName: "Drew Persson" },
  { name: "Chad Reddick", title: "Senior Software Engineer", level: "senior", department: "Engineering", managerName: "Kevin Keucker" },
  { name: "Nicole Mason", title: "Senior UI Artist", level: "senior", department: "Art", managerName: "Aaron Listen" },
  { name: "Paul Feldt", title: "Senior QA Analyst", level: "senior", department: "Qa", managerName: "David Weaver" },
];

const podRules = [
  { managerNames: ["Rob Rivera"], podProducerName: "Austin Tieskotter", podPOName: "David Hanlon" },
  { managerNames: ["Andrew Heidemann"], podProducerName: "Andrew Heidemann", podPOName: "Adrian Rosario" },
  { managerNames: ["Greg Hanes", "Drew Persson", "Kevin Keucker", "Jesse Miller"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
  { managerNames: ["Shawn Peeples", "David Weaver"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
  { managerNames: ["Aaron Listen", "Marcus Emmert"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
];

const departmentCurriculums = {
  Production: ["Complete account and tool setup", "Review release cadence and live services workflow", "Shadow planning and triage rituals", "Meet core pod partners"],
  Qa: ["Complete account and device setup", "Review smoke and regression flow", "Execute a starter test pass", "Understand bug triage expectations"],
  Engineering: ["Complete machine and repo setup", "Build and run the game locally", "Review architecture and branching expectations", "Ship a starter task"],
  Product: ["Review product vision and KPIs", "Understand feature planning cadence", "Review current roadmap", "Shadow a prioritization discussion"],
  Art: ["Complete art pipeline setup", "Review style guides", "Understand implementation workflow", "Deliver a starter task"],
  Analytics: ["Review key dashboards", "Understand experiment cadence", "Shadow a data review", "Meet functional partners"],
  Monetization: ["Review monetization strategy", "Understand offer cadence", "Review KPI guardrails", "Shadow offer planning"],
  Economy: ["Review economy model", "Understand balancing principles", "Review health metrics", "Shadow economy review"],
};

const starterResources = {
  Production: [
    { title: "Production Operating Rhythm", summary: "How the team plans, reviews, and ships work.", url: "", verified: false },
    { title: "Release Cadence Guide", summary: "Key checkpoints and responsibilities for release readiness.", url: "", verified: false },
  ],
  Qa: [
    { title: "QA Smoke Test Guide", summary: "What should be covered before a release candidate is approved.", url: "", verified: false },
    { title: "Bug Triage Workflow", summary: "How issues are logged, prioritized, and communicated.", url: "", verified: false },
  ],
  Engineering: [
    { title: "Engineering Setup Guide", summary: "Machine setup, access, and local build expectations.", url: "", verified: false },
    { title: "Architecture Overview", summary: "High-level game architecture and ownership boundaries.", url: "", verified: false },
  ],
  Product: [
    { title: "Product Vision and KPIs", summary: "Product goals, success metrics, and roadmap context.", url: "", verified: false },
    { title: "Feature Planning Guide", summary: "How work is framed, aligned, and prioritized.", url: "", verified: false },
  ],
  Art: [
    { title: "Art Pipeline Guide", summary: "How art moves from concept to implementation and review.", url: "", verified: false },
    { title: "Style Guide", summary: "Visual expectations for Jackpot Party content.", url: "", verified: false },
  ],
};

const upcomingSeed = [
  { id: "up1", name: "Future QA Hire", role: "QA Analyst", discipline: "Qa", startDate: "2026-05-12", managerId: "shawn.peeples" },
  { id: "up2", name: "Future Engineer Hire", role: "Software Engineer", discipline: "Engineering", startDate: "2026-05-19", managerId: "drew.persson" },
  { id: "up3", name: "Future Producer Hire", role: "Producer", discipline: "Production", startDate: "2026-05-26", managerId: "rob.rivera" },
];

function toUserId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");
}

const peopleSeed = rawPeople.map((p) => ({
  ...p,
  id: toUserId(p.name),
  userId: toUserId(p.name),
  isManager: MANAGER_LEVELS.has(p.level),
}));

const templatesSeed = Object.keys(departmentCurriculums).map((department) => ({
  id: `template-${department.toLowerCase()}`,
  name: `${department} Default Ramp`,
  department,
  curriculum: departmentCurriculums[department].map((title, i) => ({ id: `${department}-task-${i}`, title, done: false, critical: false })),
  resources: (starterResources[department] || []).map((r, i) => ({ id: `${department}-resource-${i}`, ...r })),
  additionalPeopleIds: [],
}));

function cloneCurriculum(curriculum, prefix) {
  return (curriculum || []).map((task, i) => ({
    id: `${prefix}-task-${i}-${Date.now()}`,
    title: task.title,
    done: false,
    critical: !!task.critical,
  }));
}

function cloneResources(resources, prefix) {
  return (resources || []).map((r, i) => ({
    id: `${prefix}-resource-${i}-${Date.now()}`,
    title: r.title,
    summary: r.summary,
    url: r.url,
    verified: !!r.verified,
  }));
}

function getDepartmentHead(people, department) {
  const rank = { gm: 4, director: 3, manager: 2, lead: 1 };
  return [...people.filter((p) => p.department === department && p.isManager)].sort((a, b) => (rank[b.level] || 0) - (rank[a.level] || 0))[0] || null;
}

function getPodContacts(managerName, people) {
  const rule = podRules.find((item) => item.managerNames.includes(managerName));
  if (!rule) return { podProducer: null, podPO: null };
  return {
    podProducer: people.find((p) => p.name === rule.podProducerName) || null,
    podPO: people.find((p) => p.name === rule.podPOName) || null,
  };
}

function buildRecommendedContacts(hire, people) {
  const manager = people.find((p) => p.id === hire.managerId) || null;
  const departmentHead = getDepartmentHead(people, hire.department);
  const processOwner = people.find((p) => p.name === TEAM_PROCESS_OWNER_NAME) || null;
  const { podProducer, podPO } = getPodContacts(manager?.name || "", people);

  const candidates = [
    processOwner && { type: "Team Process Owner", person: processOwner, reason: "Greater team process across all pods" },
    departmentHead && { type: "Department Head", person: departmentHead, reason: `Functional leadership for ${hire.department}` },
    manager && { type: "Immediate Manager", person: manager, reason: "Direct coaching and onboarding accountability" },
    podProducer && { type: "Pod Producer", person: podProducer, reason: "Day-to-day expectations and execution rhythm" },
    podPO && { type: "Pod PO", person: podPO, reason: "Product questions and priority context" },
  ].filter(Boolean);

  const seen = new Set();
  return candidates.filter((item) => {
    if (seen.has(item.person.id)) return false;
    seen.add(item.person.id);
    return true;
  });
}

function scoreHealth(hire, people) {
  const resourceCount = hire.resources.length;
  const verifiedCount = hire.resources.filter((r) => r.verified).length;
  const doneCount = hire.curriculum.filter((t) => t.done).length;
  const contacts = buildRecommendedContacts(hire, people).length;

  let score = 0;
  if (hire.managerId) score += 20;
  if (hire.curriculum.length > 0) score += 25;
  if (resourceCount > 0) score += 20;
  if (verifiedCount === resourceCount && resourceCount > 0) score += 15;
  else if (verifiedCount > 0) score += 8;
  if (contacts >= 4) score += 10;
  if (doneCount > 0) score += 10;

  const level = score >= 80 ? "green" : score >= 45 ? "yellow" : "red";
  const label = level === "green" ? "Healthy" : level === "yellow" ? "Needs Attention" : "At Risk";

  const reasons = [];
  if (!hire.managerId) reasons.push("Assign a manager");
  if (hire.curriculum.length === 0) reasons.push("Add onboarding tasks");
  if (resourceCount === 0) reasons.push("Add key documents");
  if (resourceCount > 0 && verifiedCount === 0) reasons.push("Verify assigned docs");
  else if (verifiedCount > 0 && verifiedCount < resourceCount) reasons.push("Finish verifying docs");
  if (contacts < 4) reasons.push("Add or confirm points of contact");
  if (hire.curriculum.length > 0 && doneCount === 0) reasons.push("Start onboarding tasks");
  if (doneCount > 0 && doneCount < hire.curriculum.length) reasons.push("Continue task completion");

  return { score, level, label, reasons };
}

function AppThemeStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; }
      .shell {
        min-height: 100vh;
        color: white;
        font-family: Inter, Arial, sans-serif;
        background:
          radial-gradient(circle at top, rgba(253,224,71,0.14), transparent 22%),
          radial-gradient(circle at 15% 20%, rgba(244,114,182,0.18), transparent 24%),
          radial-gradient(circle at 85% 10%, rgba(168,85,247,0.22), transparent 28%),
          linear-gradient(180deg, #2a0845 0%, #180229 48%, #10031a 100%);
      }
      .glass {
        background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%);
        border: 1px solid rgba(255,255,255,0.14);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 18px 40px rgba(32,8,54,0.28);
      }
      .glass-soft {
        background: linear-gradient(180deg, rgba(62,18,96,0.82) 0%, rgba(38,10,59,0.76) 100%);
        border: 1px solid rgba(255,255,255,0.12);
        box-shadow: 0 12px 30px rgba(15,23,42,0.18);
      }
      .input, .select, .textarea {
        width: 100%;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.10);
        color: white;
        padding: 10px 12px;
        outline: none;
      }
      .select option { color: black; }
      .button {
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 14px;
        padding: 10px 14px;
        background: linear-gradient(90deg, #fde047, #fcd34d, #f472b6);
        color: #5f004f;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(123,17,92,0.22);
        transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
      }
      .button:hover { transform: translateY(-1px); box-shadow: 0 16px 28px rgba(123,17,92,0.28); }
      .button.secondary { background: rgba(255,255,255,0.08); color: white; }
      .button.danger { background: linear-gradient(90deg, #fca5a5, #fb7185); color: #4a0417; }
      .sidebar-item {
        padding: 12px 14px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.06);
        font-weight: 700;
        color: #ffffff;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        transition: transform .18s ease, border-color .18s ease, background .18s ease;
        cursor: pointer;
      }
      .sidebar-item:hover { transform: translateX(3px); border-color: rgba(253,224,71,0.45); background: rgba(255,255,255,0.1); }
      .sidebar-item.active { background: linear-gradient(90deg,#fde047,#f472b6); color: #5f004f; }
      .metric { border-radius: 18px; padding: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); }
      .metric-label { font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      .metric-value { margin-top: 8px; font-size: 28px; font-weight: 800; color: #fff7d6; }
      .hero-title {
        margin: 6px 0 0;
        font-size: 40px;
        background: linear-gradient(90deg,#fde68a,#fbcfe8,#ddd6fe);
        -webkit-background-clip: text;
        color: transparent;
      }
      .muted { color: rgba(255,255,255,0.72); }
      .badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 700; }
      .clickable-card { transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; cursor: pointer; }
      .clickable-card:hover { transform: translateY(-2px); border-color: rgba(253,224,71,0.48); box-shadow: 0 16px 30px rgba(15,23,42,0.22); }
      .row-hover { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
      .row-hover:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(15,23,42,0.22); border-color: rgba(253,224,71,0.32); }
      .button:focus-visible, .input:focus-visible, .select:focus-visible, .textarea:focus-visible, .sidebar-item:focus-visible {
        outline: 2px solid rgba(253,224,71,0.85);
        outline-offset: 2px;
      }
      .progress-track {
        width: 160px;
        height: 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.12);
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #fde047, #f472b6);
        transition: width .45s ease;
      }
      .success-banner { animation: fadeSlideIn .35s ease; }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .new-hire { animation: newHireFade 420ms ease; }
      @keyframes newHireFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(7,3,17,0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        z-index: 60;
      }
      .modal-card {
        width: min(900px, 100%);
        max-height: 90vh;
        overflow: auto;
        border-radius: 28px;
        padding: 20px;
      }
    `}</style>
  );
}

function CardSection({ title, subtitle, children }) {
  return (
    <section className="glass" style={{ position: "relative", borderRadius: 24, padding: 18, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, rgba(253,224,71,0.95), rgba(244,114,182,0.85))" }} />
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff7d6" }}>{title}</div>
        {subtitle && <div className="muted" style={{ marginTop: 4 }}>{subtitle}</div>}
      </div>
      {children}
    </section>
  );
}

function Modal({ open, children }) {
  if (!open) return null;
  return <div className="modal-backdrop">{children}</div>;
}

function StatusBadge({ label, tone = "default" }) {
  const map = {
    green: { bg: "rgba(34,197,94,0.18)", border: "rgba(74,222,128,0.7)", text: "#d4ffe4" },
    yellow: { bg: "rgba(245,158,11,0.18)", border: "rgba(251,191,36,0.7)", text: "#ffe7a8" },
    red: { bg: "rgba(239,68,68,0.18)", border: "rgba(248,113,113,0.7)", text: "#ffd3d3" },
    default: { bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.28)", text: "#fff7d6" },
  };
  const s = map[tone] || map.default;
  return <span className="badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{label}</span>;
}

function HealthBadge({ health }) {
  const label = health.level === "green" ? "Healthy" : health.level === "red" ? "At Risk" : "Action Needed";
  return <StatusBadge label={label} tone={health.level} />;
}

function FirstWeeksChecklist({ userId, checklistByUser, onToggle }) {
  const checked = checklistByUser[userId] || {};

  const Item = ({ id, label }) => (
    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <input type="checkbox" checked={!!checked[id]} onChange={() => onToggle(userId, id)} />
      <span className="muted">{label}</span>
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="glass-soft" style={{ borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Week 1: Get Set Up & Oriented</div>
        <div style={{ display: "grid", gap: 6 }}>
          <Item id="w1-1" label="Complete account and tool setup" />
          <Item id="w1-2" label="Meet your manager and pod partners" />
          <Item id="w1-3" label="Review key onboarding documents" />
          <Item id="w1-4" label="Observe planning, standups, and triage" />
        </div>
      </div>

      <div className="glass-soft" style={{ borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Weeks 2–3: Learn the System</div>
        <div style={{ display: "grid", gap: 6 }}>
          <Item id="w2-1" label="Understand release cadence and workflows" />
          <Item id="w2-2" label="Deep dive into product area" />
          <Item id="w2-3" label="Start contributing to discussions" />
          <Item id="w2-4" label="Complete onboarding tasks" />
        </div>
      </div>

      <div className="glass-soft" style={{ borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Weeks 4+: Start Contributing</div>
        <div style={{ display: "grid", gap: 6 }}>
          <Item id="w3-1" label="Deliver your first scoped work" />
          <Item id="w3-2" label="Participate in rituals" />
          <Item id="w3-3" label="Build relationships across your pod" />
          <Item id="w3-4" label="Identify improvements" />
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Goals of Your Onboarding</div>
        <div style={{ display: "grid", gap: 6 }}>
          <Item id="g1" label="Understand how the team operates" />
          <Item id="g2" label="Know who to go to for support" />
          <Item id="g3" label="Navigate systems confidently" />
          <Item id="g4" label="Deliver meaningful work" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(() => {
    let persistedChecklist = {};
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        persistedChecklist = raw ? JSON.parse(raw) : {};
      } catch {
        persistedChecklist = {};
      }
    }

    return {
      people: peopleSeed,
      upcoming: upcomingSeed,
      templates: templatesSeed,
      hires: [],
      checklistByUser: persistedChecklist,
      currentUserId: "donald.pang",
      viewAsUserId: "",
    };
  });

  const [currentSection, setCurrentSection] = useState("Jackpot Party HQ");
  const [successMsg, setSuccessMsg] = useState("");
  const [highlightHireId, setHighlightHireId] = useState("");
  const [highlightTemplateId, setHighlightTemplateId] = useState("");
  const [templatePreviewId, setTemplatePreviewId] = useState("");
  const [setupModal, setSetupModal] = useState({ open: false, upcomingId: "" });
  const [settingsTab, setSettingsTab] = useState("roles");
  const [templateDraft, setTemplateDraft] = useState({ name: "", department: "Production" });
  const [draftTasks, setDraftTasks] = useState([]);
  const [draftResources, setDraftResources] = useState([]);
  const [draftPeopleIds, setDraftPeopleIds] = useState([]);
  const [templateApplyUpcomingId, setTemplateApplyUpcomingId] = useState("");
  const [iconError, setIconError] = useState(false);

  const signedInUser = state.people.find((p) => p.id === state.currentUserId);
  const isAdmin = signedInUser?.name === TEAM_PROCESS_OWNER_NAME || signedInUser?.level === "gm";
  const effectiveUser = state.people.find((p) => p.id === (state.viewAsUserId || state.currentUserId));
  const isManagerView = Boolean(effectiveUser?.isManager);
  const isLeadership = effectiveUser?.name === TEAM_PROCESS_OWNER_NAME || effectiveUser?.level === "gm";
  const previewTemplate = state.templates.find((t) => t.id === templatePreviewId) || null;

  const directReports = useMemo(() => {
    if (!effectiveUser) return [];
    return state.people.filter((p) => p.managerName === effectiveUser.name);
  }, [effectiveUser, state.people]);

  const visibleUpcoming = useMemo(() => {
    if (!isManagerView || !effectiveUser) return [];
    return isLeadership ? state.upcoming : state.upcoming.filter((u) => u.managerId === effectiveUser.id);
  }, [effectiveUser, isLeadership, isManagerView, state.upcoming]);

  const visibleHires = useMemo(() => {
    if (!effectiveUser) return [];
    if (isManagerView) return isLeadership ? state.hires : state.hires.filter((h) => h.managerId === effectiveUser.id);
    return state.hires.filter((h) => h.userId === effectiveUser.userId);
  }, [effectiveUser, isLeadership, isManagerView, state.hires]);

  const departments = useMemo(() => [...new Set(state.people.map((p) => p.department))].sort(), [state.people]);
  const verifiedResourceCount = useMemo(() => visibleHires.reduce((sum, hire) => sum + hire.resources.filter((r) => r.verified).length, 0), [visibleHires]);
  const needsReviewCount = useMemo(() => visibleHires.reduce((sum, hire) => sum + hire.resources.filter((r) => !r.verified).length, 0), [visibleHires]);
  const healthyCount = useMemo(() => visibleHires.filter((hire) => scoreHealth(hire, state.people).level === "green").length, [state.people, visibleHires]);
  const averageProgress = useMemo(() => {
    if (!visibleHires.length) return 0;
    const total = visibleHires.reduce((sum, hire) => {
      const pct = Math.round((hire.curriculum.filter((t) => t.done).length / Math.max(hire.curriculum.length, 1)) * 100);
      return sum + pct;
    }, 0);
    return Math.round(total / visibleHires.length);
  }, [visibleHires]);

  function toggleChecklistItem(userId, itemId) {
    if (!userId || !itemId) return;

    if (!userId) return;
    setState((prev) => ({
      ...prev,
      checklistByUser: {
        ...prev.checklistByUser,
        [userId]: {
          ...(prev.checklistByUser[userId] || {}),
          [itemId]: !(prev.checklistByUser[userId] || {})[itemId],
        },
      },
    }));
  }

  const navItems = isManagerView
    ? ["Jackpot Party HQ", "Upcoming Hires", "Live Progress", "Points of Contact", "Verified Resources", "Onboarding Plans", "Users & Roles"]
    : ["Jackpot Party HQ", "Live Progress", "Points of Contact", "Verified Resources"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state.checklistByUser || {}));
    } catch {
      // Ignore storage failures in preview environments.
    }
  }, [state.checklistByUser]);

  useEffect(() => {
    if (!highlightHireId) return;
    const node = document.querySelector(`[data-hire-id="${highlightHireId}"]`);
    if (node && typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const timer = window.setTimeout(() => setHighlightHireId(""), 2200);
    return () => window.clearTimeout(timer);
  }, [highlightHireId]);

  function flashSuccess(message) {
    setSuccessMsg(message);
    window.setTimeout(() => setSuccessMsg(""), 3000);
  }

  function createHireFromTemplate(upcomingId, templateId) {
    const upcoming = state.upcoming.find((u) => u.id === upcomingId);
    const template = state.templates.find((t) => t.id === templateId);
    if (!upcoming || !template) return;

    const hireId = `hire-${Date.now()}`;
    const newUserId = toUserId(upcoming.name);
    const nextHire = {
      id: hireId,
      linkedUpcomingId: upcomingId,
      name: upcoming.name,
      role: upcoming.role,
      department: upcoming.discipline,
      managerId: upcoming.managerId,
      userId: newUserId,
      curriculum: cloneCurriculum(template.curriculum, hireId),
      resources: cloneResources(template.resources, hireId),
      additionalResourceIds: template.additionalPeopleIds || [],
      removedContactIds: [],
    };

    setState((prev) => {
      const manager = prev.people.find((p) => p.id === upcoming.managerId) || null;
      const hasPerson = prev.people.some((p) => p.id === newUserId);
      const newPerson = hasPerson ? null : {
        id: newUserId,
        userId: newUserId,
        name: upcoming.name,
        title: upcoming.role,
        level: "core",
        department: upcoming.discipline,
        managerName: manager?.name || "",
        isManager: false,
      };

      return {
        ...prev,
        people: newPerson ? [...prev.people, newPerson] : prev.people,
        hires: [nextHire, ...prev.hires],
      };
    });
    setSetupModal({ open: false, upcomingId: "" });
    setTemplatePreviewId("");
    setCurrentSection("Live Progress");
    setHighlightHireId(hireId);
    flashSuccess("Onboarding created successfully. Review it in Live Progress.");
  }

  function addUpcoming() {
    if (!effectiveUser) return;
    const discipline = effectiveUser.department === "Leadership" ? "Production" : effectiveUser.department || "Production";
    const role = discipline === "Qa" ? "QA Analyst" : `${discipline} Team Member`;
    const next = { id: `up-${Date.now()}`, name: "Upcoming Hire", role, discipline, startDate: "", managerId: effectiveUser.id };
    setState((prev) => ({ ...prev, upcoming: [next, ...prev.upcoming] }));
    setCurrentSection("Upcoming Hires");
    flashSuccess("Upcoming hire created.");
  }

  function updateUpcoming(upcomingId, changes) {
    setState((prev) => ({ ...prev, upcoming: prev.upcoming.map((u) => (u.id === upcomingId ? { ...u, ...changes } : u)) }));
  }

  function removeUpcoming(upcomingId) {
    setState((prev) => ({ ...prev, upcoming: prev.upcoming.filter((u) => u.id !== upcomingId) }));
  }

  function updateHire(hireId, changes) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => (h.id === hireId ? { ...h, ...changes } : h)) }));
  }

  function toggleTask(hireId, taskId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, curriculum: h.curriculum.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
      )),
    }));
  }

  function updateTaskTitle(hireId, taskId, title) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, curriculum: h.curriculum.map((t) => (t.id === taskId ? { ...t, title } : t)) }
      )),
    }));
  }

  function addTaskToHire(hireId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, curriculum: [...h.curriculum, { id: `task-${Date.now()}`, title: "New Task", done: false, critical: false }] }
      )),
    }));
  }

  function removeTaskFromHire(hireId, taskId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (h.id !== hireId ? h : { ...h, curriculum: h.curriculum.filter((t) => t.id !== taskId) })),
    }));
  }

  function addResourceToHire(hireId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, resources: [...h.resources, { id: `resource-${Date.now()}`, title: "New Confluence Document", summary: "What this document is about", url: "", verified: false }] }
      )),
    }));
  }

  function updateResourceOnHire(hireId, resourceId, changes) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, resources: h.resources.map((r) => (r.id === resourceId ? { ...r, ...changes } : r)) }
      )),
    }));
  }

  function removeResourceFromHire(hireId, resourceId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (h.id !== hireId ? h : { ...h, resources: h.resources.filter((r) => r.id !== resourceId) })),
    }));
  }

  function addExtraContact(hireId, personId) {
    if (!personId) return;
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId
          ? h
          : { ...h, additionalResourceIds: h.additionalResourceIds.includes(personId) ? h.additionalResourceIds : [...h.additionalResourceIds, personId] }
      )),
    }));
  }

  function removeExtraContact(hireId, personId) {
    setState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (
        h.id !== hireId ? h : { ...h, additionalResourceIds: h.additionalResourceIds.filter((id) => id !== personId) }
      )),
    }));
  }

  function updatePerson(personId, changes) {
    setState((prev) => ({
      ...prev,
      people: prev.people.map((person) => {
        if (person.id !== personId) return person;
        const next = { ...person, ...changes };
        if (Object.prototype.hasOwnProperty.call(changes, "level")) next.isManager = MANAGER_LEVELS.has(next.level);
        return next;
      }),
    }));
  }

  function addDraftTask() {
    setDraftTasks((prev) => [...prev, { id: `draft-task-${Date.now()}`, title: "", critical: false }]);
  }

  function updateDraftTask(taskId, changes) {
    setDraftTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...changes } : task)));
  }

  function moveDraftTask(taskId, direction) {
    setDraftTasks((prev) => {
      const index = prev.findIndex((task) => task.id === taskId);
      const swapIndex = index + direction;
      if (index < 0 || swapIndex < 0 || swapIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  }

  function removeDraftTask(taskId) {
    setDraftTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function addDraftResource() {
    setDraftResources((prev) => [...prev, { id: `draft-resource-${Date.now()}`, title: "", summary: "", url: "" }]);
  }

  function updateDraftResource(resourceId, changes) {
    setDraftResources((prev) => prev.map((resource) => (resource.id === resourceId ? { ...resource, ...changes } : resource)));
  }

  function removeDraftResource(resourceId) {
    setDraftResources((prev) => prev.filter((resource) => resource.id !== resourceId));
  }

  function saveTemplateFromBuilder() {
    if (!templateDraft.name.trim()) return;
    const department = templateDraft.department;

    const curriculum = draftTasks.length > 0
      ? draftTasks.map((task, i) => ({ id: `temp-task-${i}-${Date.now()}`, title: task.title || "Untitled Task", done: false, critical: !!task.critical }))
      : (departmentCurriculums[department] || []).map((title, i) => ({ id: `temp-task-${i}-${Date.now()}`, title, done: false, critical: false }));

    const resources = draftResources.length > 0
      ? draftResources.map((resource, i) => ({ id: `temp-resource-${i}-${Date.now()}`, title: resource.title || "Untitled Doc", summary: resource.summary || "", url: resource.url || "", verified: false }))
      : cloneResources(starterResources[department] || [], `builder-${Date.now()}`);

    const template = {
      id: `template-${Date.now()}`,
      name: templateDraft.name.trim(),
      department,
      curriculum,
      resources,
      additionalPeopleIds: draftPeopleIds,
    };

    setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
    setTemplateDraft({ name: "", department });
    setDraftTasks([]);
    setDraftResources([]);
    setDraftPeopleIds([]);
    setTemplatePreviewId(template.id);
    setHighlightTemplateId(template.id);
    setCurrentSection("Onboarding Plans");
    flashSuccess(`Onboarding plan created: ${template.name}`);
  }

  function cloneTemplate(templateId) {
    const source = state.templates.find((t) => t.id === templateId);
    if (!source) return;

    const clone = {
      id: `template-${Date.now()}`,
      name: `${source.name} Copy`,
      department: source.department,
      curriculum: cloneCurriculum(source.curriculum, `clone-${Date.now()}`),
      resources: cloneResources(source.resources, `clone-${Date.now()}`),
      additionalPeopleIds: source.additionalPeopleIds || [],
    };

    setState((prev) => ({ ...prev, templates: [clone, ...prev.templates] }));
    setTemplatePreviewId(clone.id);
    setHighlightTemplateId(clone.id);
    flashSuccess("Onboarding plan duplicated.");
  }

  function removeTemplate(templateId) {
    setState((prev) => ({ ...prev, templates: prev.templates.filter((t) => t.id !== templateId) }));
    if (templatePreviewId === templateId) setTemplatePreviewId("");
  }

  function startOnboardingFromTemplatePreview() {
    if (!previewTemplate || !templateApplyUpcomingId) return;
    createHireFromTemplate(templateApplyUpcomingId, previewTemplate.id);
  }

  function saveTemplateFromHire(hireId) {
    const source = state.hires.find((h) => h.id === hireId);
    if (!source) return;

    const template = {
      id: `template-${Date.now()}`,
      name: `${source.name} Ramp Template`,
      department: source.department,
      curriculum: cloneCurriculum(source.curriculum, `templ-${Date.now()}`),
      resources: cloneResources(source.resources, `templ-${Date.now()}`),
      additionalPeopleIds: source.additionalResourceIds || [],
    };

    setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
    setCurrentSection("Onboarding Plans");
    setTemplatePreviewId(template.id);
    setHighlightTemplateId(template.id);
    setTemplateApplyUpcomingId(visibleUpcoming[0]?.id || "");
    flashSuccess(`Onboarding plan saved. Choose an upcoming hire below to start onboarding with this onboarding plan: ${template.name}.`);
  }

  return (
    <div className="shell">
      <AppThemeStyles />
      <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", minHeight: "100vh" }}>
        <aside style={{ borderRight: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(16px)", padding: 20 }}>
          <div className="glass" style={{ borderRadius: 26, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {!iconError ? (
              <img
                src={"/jackpot-party-icon.png"}
                alt="Jackpot Party"
                onError={() => setIconError(true)}
                style={{
                  width: 52,
                  height: 52,
                  objectFit: "contain",
                  borderRadius: 12
                }}
              />
            ) : (
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: "linear-gradient(135deg,#fde047,#f472b6)",
                display: "grid",
                placeItems: "center",
                color: "#5f004f",
                fontWeight: 900
              }}>
                JPSC
              </div>
            )}              <div>
                <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#fde68a", fontWeight: 700 }}>Jackpot Party</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Onboarding Hub</div>
              </div>
            </div>
            <div className="muted" style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5 }}>
              Executive demo with templates, role-based visibility, onboarding progress, verified resources, and a more powerful template builder.
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
            {navItems.map((item) => (
              <button key={item} type="button" className={`sidebar-item ${currentSection === item ? "active" : ""}`} onClick={() => setCurrentSection(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="glass" style={{ marginTop: 20, borderRadius: 24, padding: 16 }}>
            <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#fde68a", fontWeight: 700, marginBottom: 12 }}>Data Health</div>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="muted">Verified resources</span><strong>{verifiedResourceCount}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="muted">Needs review</span><strong>{needsReviewCount}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="muted">Healthy onboarding</span><strong>{healthyCount}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="muted">Avg. progress</span><strong>{averageProgress}%</strong></div>
            </div>
          </div>
        </aside>

        <main style={{ padding: 20, maxWidth: 1480, width: "100%", margin: "0 auto" }}>
          {successMsg && (
            <div className="glass success-banner" style={{ borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid rgba(74,222,128,0.7)" }}>
              <div style={{ color: "#d4ffe4", fontWeight: 700 }}>{successMsg}</div>
            </div>
          )}

          <div className="glass" style={{ borderRadius: 28, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#fde68a", fontSize: 13, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase" }}>Jackpot Party Social Casino • Cedar Falls • Executive demo quality</div>
                <h1 className="hero-title">Jackpot Party Game Team Onboarding Hub</h1>
                <p className="muted" style={{ maxWidth: 900, lineHeight: 1.6, marginBottom: 0 }}>
                  Built for the Jackpot Party team to guide onboarding, direct new hires to the right Confluence pages, verify resources, reuse proven onboarding setups, and give leadership immediate visibility into readiness.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(150px, 1fr))", gap: 10, minWidth: 640 }}>
                <div className="metric"><div className="metric-label" style={{ color: "#fde68a" }}>Verified Docs</div><div className="metric-value">{verifiedResourceCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#86efac" }}>Healthy Ramps</div><div className="metric-value">{healthyCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#c4b5fd" }}>Onboarding Plans</div><div className="metric-value">{state.templates.length}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#f9a8d4" }}>Avg Progress</div><div className="metric-value">{averageProgress}%</div></div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: 16, marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span className="muted">Signed in as</span>
              <select className="select" value={state.currentUserId} onChange={(e) => setState((prev) => ({ ...prev, currentUserId: e.target.value, viewAsUserId: "" }))}>
                {state.people.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.title}</option>)}
              </select>
            </label>
            {isAdmin && (
              <label style={{ display: "grid", gap: 6 }}>
                <span className="muted">View as</span>
                <select className="select" value={state.viewAsUserId} onChange={(e) => setState((prev) => ({ ...prev, viewAsUserId: e.target.value }))}>
                  <option value="">Myself</option>
                  {state.people.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.title}</option>)}
                </select>
              </label>
            )}
            <div><strong>Signed in user:</strong> {signedInUser?.name} ({signedInUser?.title})</div>
            <div><strong>Current view:</strong> {effectiveUser?.name} ({effectiveUser?.title})</div>
            {state.viewAsUserId && <StatusBadge label="Viewing as another user" tone="yellow" />}
          </div>

          {currentSection === "Jackpot Party HQ" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 24 }}>
              <CardSection title={isManagerView ? "Jackpot Party Manager View" : "Jackpot Party Employee View"} subtitle={isManagerView ? "Managers can create upcoming hires, choose templates, and monitor onboarding health." : "Employees see a focused view of their own journey."}>
                <div style={{ marginBottom: 12 }}>Direct reports: <strong>{isManagerView ? directReports.length : 0}</strong> · Visible hires: <strong>{visibleHires.length}</strong></div>
                {isManagerView ? (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                    <button className="button" onClick={addUpcoming}>+ Add upcoming new hire</button>
                  </div>
                ) : (
                  <div className="muted">You can review assigned documents, contacts, and complete onboarding tasks.</div>
                )}
                {isManagerView && (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Direct Reports</div>
                    {directReports.length === 0 ? <div className="muted">No direct reports for this user.</div> : directReports.map((person) => (
                      <div key={person.id} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "10px 0" }}>
                        <div><strong>{person.name}</strong></div>
                        <div>{person.title}</div>
                        <div className="muted" style={{ fontSize: 14 }}>{person.department} · {person.level}</div>
                      </div>
                    ))}
                  </>
                )}
              </CardSection>

              <CardSection title="Your First Weeks at Jackpot Party" subtitle="Track your progress and get productive quickly.">
                <FirstWeeksChecklist userId={effectiveUser?.userId || state.currentUserId} checklistByUser={state.checklistByUser} onToggle={toggleChecklistItem} />
              </CardSection>
            </div>
          )}

          {isManagerView && currentSection === "Upcoming Hires" && (
            <CardSection title="Jackpot Party Upcoming New Hires" subtitle="Step 1: Add hire. Step 2: Choose Onboarding Plan. Step 3: Pick the template you want. Step 4: Create the onboarding plan. Step 5: Verify docs before day one.">
              {visibleUpcoming.length === 0 ? (
                <div className="glass-soft" style={{ borderRadius: 16, padding: 20, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>No upcoming hires yet</div>
                  <div className="muted" style={{ marginTop: 6 }}>Add an upcoming hire to start a polished onboarding flow.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                  {visibleUpcoming.map((hire) => {
                    const manager = state.people.find((p) => p.id === hire.managerId);
                    const linkedHire = state.hires.find((h) => h.linkedUpcomingId === hire.id);
                    const matchingTemplate = state.templates.find((t) => t.department === hire.discipline) || state.templates[0];
                    return (
                      <div key={hire.id} className="glass-soft" style={{ borderRadius: 24, padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff7d6" }}>{hire.name}</div>
                            <div className="muted" style={{ marginTop: 4 }}>{hire.role}</div>
                          </div>
                          <StatusBadge label={linkedHire ? "Plan created" : "Needs setup"} tone={linkedHire ? "green" : "yellow"} />
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                          <StatusBadge label={hire.discipline} />
                          <StatusBadge label={`Starts ${hire.startDate || "TBD"}`} />
                        </div>
                        <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="muted">Manager</span><span style={{ color: "#fff7d6", fontWeight: 600 }}>{manager?.name || "Unassigned"}</span></div>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="muted">Suggested onboarding plan</span><span style={{ color: "#fff7d6", fontWeight: 600 }}>{matchingTemplate?.name}</span></div>
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                          <input className="input" value={hire.name} onChange={(e) => updateUpcoming(hire.id, { name: e.target.value })} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <select className="select" value={hire.discipline} onChange={(e) => updateUpcoming(hire.id, { discipline: e.target.value })}>
                              {Object.keys(departmentCurriculums).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input className="input" type="date" value={hire.startDate} onChange={(e) => updateUpcoming(hire.id, { startDate: e.target.value })} />
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button className="button" onClick={() => { setSetupModal({ open: true, upcomingId: hire.id }); setTemplatePreviewId(matchingTemplate?.id || ""); }}>Choose Onboarding Plan</button>
                            <button className="button danger" onClick={() => removeUpcoming(hire.id)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardSection>
          )}

          {currentSection === "Live Progress" && (
            <CardSection title="Jackpot Party Live Onboarding Progress" subtitle={isManagerView ? "Leadership sees all relevant hires. Managers see their direct reports. Employees only see themselves." : "Your personal onboarding progress."}>
              {visibleHires.length === 0 ? (
                <div className="glass-soft" style={{ borderRadius: 16, padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>No onboarding created yet</div>
                  <div className="muted" style={{ marginTop: 6 }}>Start by adding an upcoming hire and choosing an onboarding plan.</div>
                </div>
              ) : (
                visibleHires.map((hire) => {
                  const manager = state.people.find((p) => p.id === hire.managerId);
                  const canManage = isManagerView && !!effectiveUser && (isLeadership || hire.managerId === effectiveUser.id);
                  const canAddTask = canManage || (!isManagerView && hire.userId === effectiveUser?.userId);
                  const progress = Math.round((hire.curriculum.filter((t) => t.done).length / Math.max(hire.curriculum.length, 1)) * 100);
                  const health = scoreHealth(hire, state.people);
                  const recommended = buildRecommendedContacts(hire, state.people);
                  const removedIds = hire.removedContactIds || [];
                  const filteredRecommended = recommended.filter((c) => !removedIds.includes(c.person.id));
                  const extraContacts = hire.additionalResourceIds.map((id) => state.people.find((p) => p.id === id)).filter(Boolean);
                  const selectableExtras = state.people.filter((person) => !recommended.find((item) => item.person.id === person.id) && !hire.additionalResourceIds.includes(person.id));

                  return (
                    <div key={hire.id} data-hire-id={hire.id} className={`glass-soft row-hover ${hire.id === highlightHireId ? "new-hire" : ""}`} style={{ borderRadius: 20, padding: 18, marginBottom: 18, outline: hire.id === highlightHireId ? "2px solid rgba(253,224,71,0.8)" : undefined, boxShadow: hire.id === highlightHireId ? "0 0 0 3px rgba(253,224,71,0.25)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{hire.name}</h3>
                          <div className="muted">{hire.role} · {hire.department}</div>
                          <div className="muted">Manager: {manager?.name || "Unassigned"}</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ display: "grid", gap: 6 }}>
                            <HealthBadge health={health} />
                            {health.reasons.length > 0 && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                {health.reasons.slice(0, 2).map((reason) => <StatusBadge key={reason} label={reason} tone={health.level === "green" ? "green" : "yellow"} />)}
                              </div>
                            )}
                          </div>
                          <div style={{ display: "grid", gap: 6 }}>
                            <StatusBadge label={`Progress ${progress}%`} tone={progress >= 70 ? "green" : progress > 0 ? "yellow" : "red"} />
                            <div className="progress-track" aria-label={`Onboarding progress ${progress}%`}>
                              <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {canManage && (
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                          <button className="button secondary" onClick={() => saveTemplateFromHire(hire.id)}>Save as plan</button>
                        </div>
                      )}

                      {health.reasons.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <div className="glass" style={{ borderRadius: 14, padding: 12, marginBottom: 14 }}>
                            <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>What needs attention</div>
                            <div style={{ display: "grid", gap: 6 }}>
                              {health.reasons.map((reason) => <div key={reason} className="muted">• {reason}</div>)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
                        <div className="glass" style={{ borderRadius: 16, padding: 12 }}>
                          <h4 style={{ marginTop: 0 }}>Assigned Documents</h4>
                          <div className="muted" style={{ marginBottom: 10 }}>The hub explains what to read and links out to Confluence. Managers verify accuracy.</div>
                          {hire.resources.length === 0 ? (
                            <div className="muted">No documents assigned yet.</div>
                          ) : (
                            hire.resources.map((resource) => (
                              <div key={resource.id} className="glass-soft" style={{ borderRadius: 12, padding: 12, marginBottom: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{resource.title}</div>
                                    <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{resource.summary}</div>
                                  </div>
                                  <StatusBadge label={resource.verified ? "Verified" : "Needs review"} tone={resource.verified ? "green" : "yellow"} />
                                </div>
                                <div style={{ marginTop: 10 }}>
                                  {resource.url ? <a href={resource.url} target="_blank" rel="noreferrer">Open in Confluence</a> : <span className="muted">Link still needs to be added</span>}
                                </div>
                                {canManage && (
                                  <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                                    <input className="input" value={resource.title} onChange={(e) => updateResourceOnHire(hire.id, resource.id, { title: e.target.value })} />
                                    <textarea className="textarea" value={resource.summary} onChange={(e) => updateResourceOnHire(hire.id, resource.id, { summary: e.target.value })} />
                                    <input className="input" value={resource.url} onChange={(e) => updateResourceOnHire(hire.id, resource.id, { url: e.target.value })} placeholder="Confluence link" />
                                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                      <label><input type="checkbox" checked={resource.verified} onChange={(e) => updateResourceOnHire(hire.id, resource.id, { verified: e.target.checked })} /> Verified</label>
                                      <button className="button danger" onClick={() => removeResourceFromHire(hire.id, resource.id)}>Remove document</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                          {canManage && <button className="button" onClick={() => addResourceToHire(hire.id)}>+ Add Confluence document</button>}
                        </div>

                        <div className="glass" style={{ borderRadius: 16, padding: 12 }}>
                          <h4 style={{ marginTop: 0, marginBottom: 12 }}>People and Journey</h4>
                          <div style={{ display: "grid", gap: 14 }}>
                            <div>
                              <div style={{ fontWeight: 800, marginBottom: 8, color: "#fde68a" }}>Recommended Contacts</div>
                              {filteredRecommended.length === 0 ? (
                                <div className="muted">No recommended contacts currently shown.</div>
                              ) : (
                                <div style={{ display: "grid", gap: 10 }}>
                                  {filteredRecommended.map((contact) => (
                                    <div key={`${hire.id}-${contact.type}-${contact.person.id}`} className="glass-soft" style={{ borderRadius: 12, padding: 12, display: "grid", gridTemplateColumns: canManage ? "140px 1fr auto" : "140px 1fr", gap: 12 }}>
                                      <div style={{ fontWeight: 800, color: "#fde68a" }}>{contact.type}</div>
                                      <div>
                                        <div style={{ fontWeight: 700 }}>{contact.person.name}</div>
                                        <div className="muted" style={{ fontSize: 13 }}>{contact.person.title}</div>
                                        <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>{contact.reason}</div>
                                      </div>
                                      {canManage && (
                                        <button className="button danger" onClick={() => setState((prev) => ({ ...prev, hires: prev.hires.map((h) => (h.id !== hire.id ? h : { ...h, removedContactIds: [...(h.removedContactIds || []), contact.person.id] })) }))}>
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <div style={{ fontWeight: 800, marginBottom: 8, color: "#fde68a" }}>Additional Resources</div>
                              {extraContacts.length === 0 ? (
                                <div className="muted">No additional resources added yet.</div>
                              ) : (
                                <div style={{ display: "grid", gap: 10, marginBottom: 10 }}>
                                  {extraContacts.map((person) => (
                                    <div key={`${hire.id}-${person.id}`} className="glass-soft" style={{ borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                                      <div>
                                        <div style={{ fontWeight: 700 }}>{person.name}</div>
                                        <div className="muted" style={{ fontSize: 13 }}>{person.title}</div>
                                      </div>
                                      {canManage && <button className="button secondary" onClick={() => removeExtraContact(hire.id, person.id)}>Remove</button>}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {canManage && (
                                <select className="select" defaultValue="" onChange={(e) => { addExtraContact(hire.id, e.target.value); e.target.value = ""; }}>
                                  <option value="" disabled>Add person</option>
                                  {selectableExtras.map((person) => <option key={person.id} value={person.id}>{person.name} — {person.title}</option>)}
                                </select>
                              )}
                            </div>

                            <div>
                              <div style={{ fontWeight: 800, marginBottom: 8, color: "#fde68a" }}>Onboarding Tasks</div>
                              <div style={{ display: "grid", gap: 8 }}>
                                {hire.curriculum.map((task) => (
                                  <div key={task.id} className="glass-soft" style={{ borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: canManage ? "auto 1fr auto" : "auto 1fr", gap: 10, alignItems: "center" }}>
                                    <input type="checkbox" checked={task.done} onChange={() => toggleTask(hire.id, task.id)} />
                                    <input className="input" value={task.title} onChange={(e) => updateTaskTitle(hire.id, task.id, e.target.value)} disabled={isManagerView && !canManage} />
                                    {canManage && <button className="button danger" onClick={() => removeTaskFromHire(hire.id, task.id)}>Remove</button>}
                                  </div>
                                ))}
                              </div>
                              {canAddTask && (
                                <div style={{ marginTop: 10 }}>
                                  <button className="button" onClick={() => addTaskToHire(hire.id)}>+ Add Task</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardSection>
          )}

          {currentSection === "Points of Contact" && (
            <CardSection title="Jackpot Party Points of Contact" subtitle={isManagerView ? "See who each new hire should reach out to and why." : "Your support network for onboarding, day-to-day expectations, and product questions."}>
              {visibleHires.length === 0 ? (
                <div className="glass-soft" style={{ borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>No points of contact yet</div>
                  <div className="muted" style={{ marginTop: 6 }}>Create onboarding from an onboarding plan to automatically generate recommended contacts.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {visibleHires.map((hire) => {
                    const recommended = buildRecommendedContacts(hire, state.people);
                    const extraContacts = hire.additionalResourceIds.map((id) => state.people.find((p) => p.id === id)).filter(Boolean);
                    return (
                      <div key={`contacts-${hire.id}`} className="glass-soft clickable-card" style={{ borderRadius: 18, padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff7d6" }}>{hire.name}</div>
                            <div className="muted">{hire.role} · {hire.department}</div>
                          </div>
                          <StatusBadge label={`${recommended.length + extraContacts.length} contacts`} />
                        </div>
                        <div style={{ display: "grid", gap: 10 }}>
                          {recommended.map((contact) => (
                            <div key={`${hire.id}-${contact.type}-${contact.person.id}`} className="glass" style={{ borderRadius: 14, padding: 12 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "190px 1fr", gap: 12 }}>
                                <div style={{ fontWeight: 800, color: "#fde68a" }}>{contact.type}</div>
                                <div>
                                  <div style={{ fontWeight: 700 }}>{contact.person.name}</div>
                                  <div className="muted">{contact.person.title}</div>
                                  <div style={{ marginTop: 4, color: "rgba(255,255,255,0.82)" }}>{contact.reason}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {extraContacts.length > 0 && (
                            <div>
                              <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Additional valuable resources</div>
                              <div style={{ display: "grid", gap: 8 }}>
                                {extraContacts.map((person) => (
                                  <div key={`${hire.id}-extra-card-${person.id}`} className="glass" style={{ borderRadius: 14, padding: 12 }}>
                                    <div style={{ fontWeight: 700 }}>{person.name}</div>
                                    <div className="muted">{person.title}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardSection>
          )}

          {currentSection === "Verified Resources" && (
            <CardSection title="Jackpot Party Verified Resources" subtitle="A clearer view of what is verified, what still needs review, and where managers should act next.">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
                <div className="metric"><div className="metric-label" style={{ color: "#86efac" }}>Verified</div><div className="metric-value">{verifiedResourceCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#fde68a" }}>Needs Review</div><div className="metric-value">{needsReviewCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#c4b5fd" }}>Visible Hires</div><div className="metric-value">{visibleHires.length}</div></div>
              </div>
              {visibleHires.length === 0 ? (
                <div className="glass-soft" style={{ borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>No resources to review yet</div>
                  <div className="muted" style={{ marginTop: 6 }}>Create onboarding from an onboarding plan to start assigning and verifying resources.</div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {visibleHires.map((hire) => {
                    const verified = hire.resources.filter((r) => r.verified).length;
                    const pending = hire.resources.filter((r) => !r.verified).length;
                    return (
                      <div key={hire.id} className="glass-soft clickable-card" style={{ borderRadius: 16, padding: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{hire.name}</div>
                            <div className="muted">{hire.role} · {hire.department}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <StatusBadge label={`${verified} verified`} tone="green" />
                            <StatusBadge label={`${pending} pending`} tone={pending > 0 ? "yellow" : "green"} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardSection>
          )}

          {isManagerView && currentSection === "Onboarding Plans" && (
            <CardSection title="Jackpot Party Onboarding Plans" subtitle="Create reusable onboarding setups, preview them, and launch a new hire journey with confidence.">
              <div className="glass-soft" style={{ borderRadius: 18, padding: 14, marginBottom: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>How to use onboarding plans</div>
                <div className="muted">Use the builder below to create a new onboarding plan from scratch. Then go to <strong>Upcoming Hires</strong>, open a hire card, click <strong>Choose Onboarding Plan</strong>, preview the onboarding plan, and create the onboarding journey.</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "start", marginBottom: 18 }}>
                <div className="glass-soft" style={{ borderRadius: 20, padding: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fde68a", marginBottom: 6 }}>Create New Onboarding Plan</div>
                  <div className="muted" style={{ marginBottom: 12 }}>Build a reusable onboarding plan with ordered tasks, documents, and people.</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 10, marginBottom: 12 }}>
                    <input className="input" value={templateDraft.name} onChange={(e) => setTemplateDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder="Template name" />
                    <select className="select" value={templateDraft.department} onChange={(e) => setTemplateDraft((prev) => ({ ...prev, department: e.target.value }))}>
                      {Object.keys(departmentCurriculums).map((department) => <option key={department} value={department}>{department}</option>)}
                    </select>
                  </div>

                  <div className="glass" style={{ borderRadius: 16, padding: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 800 }}>Build Tasks</div>
                      <button className="button secondary" onClick={addDraftTask}>+ Add Task</button>
                    </div>
                    {draftTasks.length === 0 ? (
                      <div className="muted">No custom tasks yet. If you create the template now, it will use department defaults.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {draftTasks.map((task, index) => (
                          <div key={task.id} className="glass-soft" style={{ borderRadius: 12, padding: 10 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center" }}>
                              <input className="input" value={task.title} onChange={(e) => updateDraftTask(task.id, { title: e.target.value })} placeholder={`Task ${index + 1}`} />
                              <button className="button secondary" onClick={() => moveDraftTask(task.id, -1)}>↑</button>
                              <button className="button secondary" onClick={() => moveDraftTask(task.id, 1)}>↓</button>
                              <button className="button danger" onClick={() => removeDraftTask(task.id)}>Remove</button>
                            </div>
                            <label style={{ marginTop: 8, display: "inline-flex", gap: 8, alignItems: "center" }}>
                              <input type="checkbox" checked={task.critical} onChange={(e) => updateDraftTask(task.id, { critical: e.target.checked })} />
                              Critical task
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass" style={{ borderRadius: 16, padding: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 800 }}>Add Documents</div>
                      <button className="button secondary" onClick={addDraftResource}>+ Add Document</button>
                    </div>
                    {draftResources.length === 0 ? (
                      <div className="muted">No custom documents yet. If you create the template now, it will use department starter documents when available.</div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {draftResources.map((resource) => (
                          <div key={resource.id} className="glass-soft" style={{ borderRadius: 12, padding: 10 }}>
                            <div style={{ display: "grid", gap: 8 }}>
                              <input className="input" value={resource.title} onChange={(e) => updateDraftResource(resource.id, { title: e.target.value })} placeholder="Document title" />
                              <textarea className="textarea" value={resource.summary} onChange={(e) => updateDraftResource(resource.id, { summary: e.target.value })} placeholder="What this document is about" />
                              <input className="input" value={resource.url} onChange={(e) => updateDraftResource(resource.id, { url: e.target.value })} placeholder="Confluence URL (optional)" />
                              <button className="button danger" onClick={() => removeDraftResource(resource.id)}>Remove document</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="glass" style={{ borderRadius: 16, padding: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 800 }}>Plan People</div>
                    </div>
                    {draftPeopleIds.length === 0 ? (
                      <div className="muted">No additional people selected. Auto-generated contacts will still appear from the org structure.</div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                        {draftPeopleIds.map((personId) => {
                          const person = state.people.find((p) => p.id === personId);
                          if (!person) return null;
                          return (
                            <div key={personId} className="glass-soft" style={{ borderRadius: 999, padding: "8px 10px", display: "inline-flex", gap: 8, alignItems: "center" }}>
                              <span>{person.name}</span>
                              <button className="button danger" onClick={() => setDraftPeopleIds((prev) => prev.filter((id) => id !== personId))}>Remove</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <select className="select" defaultValue="" onChange={(e) => {
                      const value = e.target.value;
                      if (value && !draftPeopleIds.includes(value)) setDraftPeopleIds((prev) => [...prev, value]);
                      e.target.value = "";
                    }}>
                      <option value="" disabled>Add person to template</option>
                      {state.people.filter((person) => !draftPeopleIds.includes(person.id)).map((person) => <option key={person.id} value={person.id}>{person.name} — {person.title}</option>)}
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button" onClick={saveTemplateFromBuilder}>+ Create Onboarding Plan</button>
                    <button className="button secondary" onClick={() => { setTemplateDraft({ name: "", department: "Production" }); setDraftTasks([]); setDraftResources([]); setDraftPeopleIds([]); }}>Reset Builder</button>
                  </div>
                </div>

                <div className="glass-soft" style={{ borderRadius: 20, padding: 16, position: "sticky", top: 20 }}>
                  <div style={{ color: "#fde68a", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800 }}>Builder Preview</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: "#fff7d6", marginTop: 6 }}>{templateDraft.name || "Untitled Template"}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{templateDraft.department}</div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Tasks</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(draftTasks.length > 0 ? draftTasks : (departmentCurriculums[templateDraft.department] || []).map((title) => ({ id: title, title, critical: false }))).map((task, index) => (
                        <div key={task.id || index} className="glass" style={{ borderRadius: 12, padding: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div>{task.title || "Untitled Task"}</div>
                          {task.critical && <StatusBadge label="Critical" tone="yellow" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Documents</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(draftResources.length > 0 ? draftResources : (starterResources[templateDraft.department] || [])).map((resource, index) => (
                        <div key={resource.id || index} className="glass" style={{ borderRadius: 12, padding: 10 }}>
                          <div style={{ color: "#fff7d6", fontWeight: 700 }}>{resource.title || "Untitled Document"}</div>
                          <div className="muted" style={{ marginTop: 4, fontSize: 14 }}>{resource.summary || "No summary yet"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Plan People</div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {draftPeopleIds.map((personId) => {
                        const person = state.people.find((p) => p.id === personId);
                        if (!person) return null;
                        return (
                          <div key={personId} className="glass" style={{ borderRadius: 12, padding: 10 }}>
                            <div style={{ color: "#fff7d6", fontWeight: 700 }}>{person.name}</div>
                            <div className="muted" style={{ marginTop: 4, fontSize: 14 }}>{person.title}</div>
                          </div>
                        );
                      })}
                      {draftPeopleIds.length === 0 && <div className="muted">No additional people selected for this template.</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, marginBottom: 8, fontWeight: 800, color: "#fde68a" }}>Existing Onboarding Plans</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, alignItems: "start" }}>
                <div style={{ display: "grid", gap: 10 }}>
                  {state.templates.map((template) => (
                    <div key={template.id} className="glass-soft clickable-card" onClick={() => setTemplatePreviewId(template.id)} style={{ borderRadius: 14, padding: 12, outline: template.id === highlightTemplateId || template.id === templatePreviewId ? "2px solid rgba(253,224,71,0.8)" : undefined, boxShadow: template.id === highlightTemplateId || template.id === templatePreviewId ? "0 0 0 3px rgba(253,224,71,0.25)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{template.name}</div>
                          <div className="muted" style={{ fontSize: 13 }}>{template.department} · {template.curriculum.length} tasks · {template.resources.length} docs</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button className="button secondary" onClick={(e) => { e.stopPropagation(); cloneTemplate(template.id); }}>Clone</button>
                          <button className="button danger" onClick={(e) => { e.stopPropagation(); removeTemplate(template.id); }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-soft" style={{ borderRadius: 18, padding: 16, position: "sticky", top: 20 }}>
                  {previewTemplate ? (
                    <>
                      <div style={{ color: "#fde68a", fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800 }}>Onboarding plan preview</div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: "#fff7d6", marginTop: 6 }}>{previewTemplate.name}</div>
                      <div className="muted" style={{ marginTop: 4 }}>{previewTemplate.department}</div>

                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Curriculum</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {previewTemplate.curriculum.map((task) => (
                            <div key={task.id} className="glass" style={{ borderRadius: 12, padding: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
                              <div>{task.title}</div>
                              {task.critical && <StatusBadge label="Critical" tone="yellow" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Documents</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {previewTemplate.resources.map((resource) => (
                            <div key={resource.id} className="glass" style={{ borderRadius: 12, padding: 10 }}>
                              <div style={{ color: "#fff7d6", fontWeight: 700 }}>{resource.title}</div>
                              <div className="muted" style={{ marginTop: 4, fontSize: 14 }}>{resource.summary}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Plan People</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {(previewTemplate.additionalPeopleIds || []).map((personId) => {
                            const person = state.people.find((p) => p.id === personId);
                            if (!person) return null;
                            return (
                              <div key={personId} className="glass" style={{ borderRadius: 12, padding: 10 }}>
                                <div style={{ color: "#fff7d6", fontWeight: 700 }}>{person.name}</div>
                                <div className="muted" style={{ marginTop: 4, fontSize: 14 }}>{person.title}</div>
                              </div>
                            );
                          })}
                          {(!previewTemplate.additionalPeopleIds || previewTemplate.additionalPeopleIds.length === 0) && <div className="muted">No additional people saved on this onboarding plan.</div>}
                        </div>
                      </div>

                      {isManagerView && (
                        <div className="glass" style={{ marginTop: 16, borderRadius: 14, padding: 12 }}>
                          <div style={{ fontWeight: 800, color: "#fde68a", marginBottom: 8 }}>Start onboarding with this plan</div>
                          {visibleUpcoming.length === 0 ? (
                            <div className="muted">Add an upcoming hire first, then come back here to start onboarding with this template.</div>
                          ) : (
                            <div style={{ display: "grid", gap: 10 }}>
                              <select className="select" value={templateApplyUpcomingId} onChange={(e) => setTemplateApplyUpcomingId(e.target.value)}>
                                <option value="">Select upcoming hire</option>
                                {visibleUpcoming.map((hire) => <option key={hire.id} value={hire.id}>{hire.name} — {hire.role}</option>)}
                              </select>
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button className="button" disabled={!templateApplyUpcomingId} onClick={startOnboardingFromTemplatePreview}>Start onboarding for selected hire</button>
                                <button className="button secondary" onClick={() => setCurrentSection("Upcoming Hires")}>Go to upcoming hires</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: 24 }}>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>Select an onboarding plan</div>
                      <div className="muted" style={{ marginTop: 6 }}>Click any template on the left to inspect its tasks and resources.</div>
                    </div>
                  )}
                </div>
              </div>
            </CardSection>
          )}

          {isManagerView && currentSection === "Users & Roles" && (
            <CardSection title="Jackpot Party Users & Roles" subtitle="Manage team members, roles, and reporting structure. Control who has manager permissions and visibility.">
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <button className={`button ${settingsTab === "roles" ? "secondary" : ""}`} onClick={() => setSettingsTab("roles")}>Roles & Access</button>
                <button className={`button ${settingsTab === "org" ? "secondary" : ""}`} onClick={() => setSettingsTab("org")}>Org Directory</button>
              </div>
              {settingsTab === "roles" ? (
                <div style={{ display: "grid", gap: 8 }}>
                  {state.people.map((person) => (
                    <div key={person.id} className="glass-soft" style={{ borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{person.name}</div>
                        <div className="muted" style={{ fontSize: 13 }}>{person.title}</div>
                      </div>
                      <select className="select" value={person.level} onChange={(e) => updatePerson(person.id, { level: e.target.value })}>
                        {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                      </select>
                      <select className="select" value={person.managerName || ""} onChange={(e) => updatePerson(person.id, { managerName: e.target.value })}>
                        <option value="">No manager</option>
                        {state.people.map((manager) => <option key={manager.id} value={manager.name}>{manager.name}</option>)}
                      </select>
                      <input className="input" value={person.userId} onChange={(e) => updatePerson(person.id, { userId: e.target.value.toLowerCase(), id: e.target.value.toLowerCase() })} />
                      <label><input type="checkbox" checked={person.isManager} onChange={(e) => updatePerson(person.id, { isManager: e.target.checked })} /> Manager</label>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {state.people.map((person) => (
                    <div key={person.id} className="glass-soft" style={{ borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "1.1fr 1.2fr 0.8fr 1fr 1.1fr 1.1fr auto", gap: 8, alignItems: "center" }}>
                      <input className="input" value={person.name} onChange={(e) => updatePerson(person.id, { name: e.target.value })} />
                      <input className="input" value={person.title} onChange={(e) => updatePerson(person.id, { title: e.target.value })} />
                      <input className="input" value={person.level} onChange={(e) => updatePerson(person.id, { level: e.target.value })} />
                      <input className="input" value={person.department} onChange={(e) => updatePerson(person.id, { department: e.target.value })} />
                      <input className="input" value={person.managerName || ""} onChange={(e) => updatePerson(person.id, { managerName: e.target.value })} />
                      <input className="input" value={person.userId} onChange={(e) => updatePerson(person.id, { userId: e.target.value.toLowerCase(), id: e.target.value.toLowerCase() })} />
                      <label><input type="checkbox" checked={person.isManager} onChange={(e) => updatePerson(person.id, { isManager: e.target.checked })} /> Manager</label>
                    </div>
                  ))}
                </div>
              )}
            </CardSection>
          )}
        </main>
      </div>

      <Modal open={setupModal.open}>
        <div className="glass modal-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#fde68a", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 800 }}>Choose onboarding plan</div>
              <h3 style={{ marginTop: 6, marginBottom: 6 }}>Choose an onboarding plan</h3>
              <div className="muted">Pick a proven setup. You can still modify tasks, documents, and contacts after creation.</div>
            </div>
            <button className="button secondary" onClick={() => { setSetupModal({ open: false, upcomingId: "" }); setTemplatePreviewId(""); }}>Close</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {state.templates.map((template) => (
                <button key={template.id} className="glass-soft clickable-card" style={{ borderRadius: 16, padding: 14, textAlign: "left", border: template.id === templatePreviewId ? "2px solid #fde047" : "1px solid rgba(255,255,255,0.12)", boxShadow: template.id === templatePreviewId ? "0 0 0 2px rgba(253,224,71,0.2)" : undefined }} onClick={() => setTemplatePreviewId(template.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "#fff7d6" }}>{template.name}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{template.department} · {template.curriculum.length} tasks · {template.resources.length} docs</div>
                    </div>
                    <StatusBadge label={template.department} />
                  </div>
                </button>
              ))}
            </div>

            <div className="glass-soft" style={{ borderRadius: 18, padding: 16 }}>
              {previewTemplate ? (
                <>
                  <div style={{ fontWeight: 800, fontSize: 20, color: "#fff7d6" }}>{previewTemplate.name}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{previewTemplate.department}</div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Sample curriculum</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {previewTemplate.curriculum.map((task) => <div key={task.id} className="muted">• {task.title}</div>)}
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Assigned resources</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {previewTemplate.resources.map((resource) => <div key={resource.id} className="muted">• {resource.title}</div>)}
                    </div>
                  </div>
                  <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button" onClick={() => createHireFromTemplate(setupModal.upcomingId, previewTemplate.id)}>Start Onboarding</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: 30 }}>
                  <div style={{ fontSize: 14, marginBottom: 10, color: "#fde68a" }}>← Select an onboarding plan on the left</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Preview an onboarding plan</div>
                  <div className="muted" style={{ marginTop: 6 }}>Select an onboarding plan on the left to see tasks, docs, and setup details before applying it.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
