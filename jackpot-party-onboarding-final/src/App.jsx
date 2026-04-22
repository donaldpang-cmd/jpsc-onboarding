import React, { useMemo, useState } from "react";

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
  { pod: "For Features Sake", managerNames: ["Rob Rivera"], podProducerName: "Austin Tieskotter", podPOName: "David Hanlon" },
  { pod: "Nexus", managerNames: ["Andrew Heidemann"], podProducerName: "Andrew Heidemann", podPOName: "Adrian Rosario" },
  { pod: "Architects", managerNames: ["Greg Hanes"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
  { pod: "Artificers", managerNames: ["Drew Persson", "Kevin Keucker", "Jesse Miller"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
  { pod: "QA", managerNames: ["Shawn Peeples", "David Weaver"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
  { pod: "Art", managerNames: ["Aaron Listen", "Marcus Emmert"], podProducerName: "Donald Pang", podPOName: "Adrian Rosario" },
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
  Analytics: [
    { title: "Analytics Dashboard Guide", summary: "How to read core reports and weekly readouts.", url: "", verified: false },
    { title: "Experiment Review Process", summary: "How tests are proposed, analyzed, and learned from.", url: "", verified: false },
  ],
  Monetization: [
    { title: "Monetization Strategy Overview", summary: "How the team approaches player value, offers, and timing.", url: "", verified: false },
    { title: "Offer Review Checklist", summary: "Checks to complete before launch.", url: "", verified: false },
  ],
  Economy: [
    { title: "Economy Model Overview", summary: "How progression, balance, and rewards are structured.", url: "", verified: false },
    { title: "Balancing Principles", summary: "Core principles used to tune game systems.", url: "", verified: false },
  ],
};

const templatesSeed = Object.keys(departmentCurriculums).map((department) => ({
  id: `template-${department.toLowerCase()}`,
  name: `${department} Default Ramp`,
  department,
  curriculum: departmentCurriculums[department].map((title, i) => ({ id: `${department}-task-${i}`, title, done: false })),
  resources: (starterResources[department] || []).map((r, i) => ({ id: `${department}-resource-${i}`, ...r })),
}));

const upcomingSeed = [
  { id: "up1", name: "Future QA Hire", role: "QA Analyst", discipline: "Qa", startDate: "2026-05-12", managerId: "shawn.peeples" },
  { id: "up2", name: "Future Engineer Hire", role: "Software Engineer", discipline: "Engineering", startDate: "2026-05-19", managerId: "drew.persson" },
  { id: "up3", name: "Future Producer Hire", role: "Producer", discipline: "Production", startDate: "2026-05-26", managerId: "rob.rivera" },
];

function toUserId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");
}

const peopleSeed = rawPeople.map((p) => ({ ...p, id: toUserId(p.name), userId: toUserId(p.name), isManager: MANAGER_LEVELS.has(p.level) }));

function cloneCurriculum(curriculum, prefix) {
  return curriculum.map((task, i) => ({ id: `${prefix}-task-${i}-${Date.now()}`, title: task.title, done: false }));
}
function cloneResources(resources, prefix) {
  return resources.map((r, i) => ({ id: `${prefix}-resource-${i}-${Date.now()}`, title: r.title, summary: r.summary, url: r.url, verified: r.verified }));
}
function formatDate(dateString) {
  if (!dateString) return "No start date";
  const d = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(d.getTime()) ? dateString : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function getDepartmentHead(people, department) {
  const rank = { gm: 4, director: 3, manager: 2, lead: 1 };
  return [...people.filter((p) => p.department === department && p.isManager)].sort((a, b) => (rank[b.level] || 0) - (rank[a.level] || 0))[0] || null;
}
function getPodAssignment(managerName) {
  return podRules.find((rule) => rule.managerNames.includes(managerName)) || null;
}
function buildRecommendedContacts(hire, people) {
  const manager = people.find((p) => p.id === hire.managerId) || null;
  const departmentHead = getDepartmentHead(people, hire.department);
  const teamProcessOwner = people.find((p) => p.name === TEAM_PROCESS_OWNER_NAME) || null;
  const pod = manager ? getPodAssignment(manager.name) : null;
  const podProducer = pod ? people.find((p) => p.name === pod.podProducerName) : null;
  const podPO = pod ? people.find((p) => p.name === pod.podPOName) : null;
  const contacts = [
    teamProcessOwner && { type: "Team Process Owner", person: teamProcessOwner, reason: "Greater team process across all pods" },
    departmentHead && { type: "Department Head", person: departmentHead, reason: `Functional leadership for ${hire.department}` },
    manager && { type: "Immediate Manager", person: manager, reason: "Direct coaching and onboarding accountability" },
    podProducer && { type: "Pod Producer", person: podProducer, reason: "Day-to-day expectations and execution rhythm" },
    podPO && { type: "Pod PO", person: podPO, reason: "Product questions and priority context" },
  ].filter(Boolean);
  const seen = new Set();
  return contacts.filter((c) => !seen.has(c.person.id) && seen.add(c.person.id));
}
function scoreHealth(hire, people) {
  const resourceCount = (hire.resources || []).length;
  const verifiedCount = (hire.resources || []).filter((r) => r.verified).length;
  const taskCount = (hire.curriculum || []).length;
  const doneCount = (hire.curriculum || []).filter((t) => t.done).length;
  const contacts = buildRecommendedContacts(hire, people).length;
  let score = 0;
  if (hire.managerId) score += 20;
  if (taskCount > 0) score += 25;
  if (resourceCount > 0) score += 20;
  if (verifiedCount === resourceCount && resourceCount > 0) score += 15;
  else if (verifiedCount > 0) score += 8;
  if (contacts >= 4) score += 10;
  if (doneCount > 0) score += 10;
  return score >= 80 ? { score, level: "green", label: "Healthy" } : score >= 45 ? { score, level: "yellow", label: "Needs Attention" } : { score, level: "red", label: "At Risk" };
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
        width: 100%; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.10); color: white; padding: 10px 12px; outline: none;
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
      .badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 700; }
      .sidebar-item { padding: 12px 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); font-weight: 700; }
      .sidebar-item.active { background: linear-gradient(90deg,#fde047,#f472b6); color: #5f004f; }
      .section-head { font-size: 20px; font-weight: 800; color: #fff7d6; }
      .muted { color: rgba(255,255,255,0.72); }
      .metric { border-radius: 18px; padding: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); }
      .metric-label { font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      .metric-value { margin-top: 8px; font-size: 28px; font-weight: 800; color: #fff7d6; }
      .hero-title {
        margin: 6px 0 0; font-size: 40px; background: linear-gradient(90deg,#fde68a,#fbcfe8,#ddd6fe); -webkit-background-clip: text; color: transparent;
      }
      .modal-backdrop {
        position: fixed; inset: 0; background: rgba(7,3,17,0.72); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 60;
      }
      .modal-card { width: min(760px, 100%); border-radius: 28px; padding: 20px; }
      .template-choice:hover { border-color: rgba(253,224,71,0.55); transform: translateY(-1px); }
    `}</style>
  );
}

function CardSection({ title, subtitle, children }) {
  return (
    <section className="glass" style={{ position: "relative", borderRadius: 24, padding: 18, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, rgba(253,224,71,0.95), rgba(244,114,182,0.85))" }} />
      <div style={{ marginBottom: 12 }}>
        <div className="section-head">{title}</div>
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

function HealthBadge({ health }) {
  const style = health.level === "green" ? { bg: "rgba(34,197,94,0.18)", border: "rgba(74,222,128,0.7)", text: "#d4ffe4" } : health.level === "yellow" ? { bg: "rgba(245,158,11,0.18)", border: "rgba(251,191,36,0.7)", text: "#ffe7a8" } : { bg: "rgba(239,68,68,0.18)", border: "rgba(248,113,113,0.7)", text: "#ffd3d3" };
  return <span className="badge" style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}>{health.label} · {health.score}</span>;
}

function StatusBadge({ label, tone }) {
  const styles = tone === "green" ? { bg: "rgba(34,197,94,0.18)", border: "rgba(74,222,128,0.7)", text: "#d4ffe4" } : tone === "yellow" ? { bg: "rgba(245,158,11,0.18)", border: "rgba(251,191,36,0.7)", text: "#ffe7a8" } : tone === "red" ? { bg: "rgba(239,68,68,0.18)", border: "rgba(248,113,113,0.7)", text: "#ffd3d3" } : { bg: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.28)", text: "#fff7d6" };
  return <span className="badge" style={{ background: styles.bg, border: `1px solid ${styles.border}`, color: styles.text }}>{label}</span>;
}

export default function App() {
  const [state, setState] = useState({
    people: peopleSeed,
    templates: templatesSeed,
    upcoming: upcomingSeed,
    hires: [],
    currentUserId: "donald.pang",
    viewAsUserId: "",
  });
  const [login, setLogin] = useState({ isAuthenticated: true, userIdInput: "donald.pang" });
  const [settingsTab, setSettingsTab] = useState("roles");
  const [templateDraft, setTemplateDraft] = useState({ name: "", department: "Production" });
  const [setupModal, setSetupModal] = useState({ open: false, upcomingId: "" });
  const [templatePreviewId, setTemplatePreviewId] = useState("");

  const signedInUser = state.people.find((p) => p.id === state.currentUserId);
  const isAdmin = signedInUser?.name === TEAM_PROCESS_OWNER_NAME || signedInUser?.level === "gm";
  const effectiveUser = state.people.find((p) => p.id === (state.viewAsUserId || state.currentUserId));
  const isManagerView = Boolean(effectiveUser?.isManager);
  const isLeadership = effectiveUser?.name === TEAM_PROCESS_OWNER_NAME || effectiveUser?.level === "gm";

  const visibleHires = isManagerView ? (isLeadership ? state.hires : state.hires.filter((hire) => hire.managerId === effectiveUser.id)) : state.hires.filter((hire) => hire.userId === effectiveUser?.userId);
  const visibleUpcoming = isManagerView ? (isLeadership ? state.upcoming : state.upcoming.filter((u) => u.managerId === effectiveUser.id)) : [];
  const directReports = effectiveUser ? state.people.filter((p) => p.managerName === effectiveUser.name) : [];
  const departments = [...new Set(state.people.map((p) => p.department))].sort();
  const verifiedResourceCount = visibleHires.reduce((sum, hire) => sum + (hire.resources || []).filter((r) => r.verified).length, 0);
  const needsReviewCount = visibleHires.reduce((sum, hire) => sum + (hire.resources || []).filter((r) => !r.verified).length, 0);
  const averageProgress = visibleHires.length ? Math.round(visibleHires.reduce((sum, hire) => sum + Math.round(((hire.curriculum.filter((t) => t.done).length || 0) / Math.max(hire.curriculum.length, 1)) * 100), 0) / visibleHires.length) : 0;
  const healthyCount = visibleHires.filter((hire) => scoreHealth(hire, state.people).level === "green").length;
  const previewTemplate = state.templates.find((t) => t.id === templatePreviewId) || null;

  const navItems = isManagerView ? ["Jackpot Party HQ", "Upcoming Hires", "Live Progress", "Verified Resources", "Templates", "Settings"] : ["Jackpot Party HQ", "Live Progress", "Verified Resources"];

  function createHireFromTemplate(upcomingId, templateId) {
    const upcoming = state.upcoming.find((u) => u.id === upcomingId);
    const template = state.templates.find((t) => t.id === templateId);
    if (!upcoming || !template) return;
    const hireId = `hire-${Date.now()}`;
    const nextHire = {
      id: hireId,
      linkedUpcomingId: upcomingId,
      name: upcoming.name,
      role: upcoming.role,
      department: upcoming.discipline,
      managerId: upcoming.managerId,
      userId: toUserId(upcoming.name),
      curriculum: cloneCurriculum(template.curriculum, hireId),
      resources: cloneResources(template.resources, hireId),
      additionalResourceIds: [],
    };
    setState((prev) => ({ ...prev, hires: [nextHire, ...prev.hires] }));
    setSetupModal({ open: false, upcomingId: "" });
    setTemplatePreviewId("");
  }

  function cloneHireRamp(hireId) {
    const source = state.hires.find((h) => h.id === hireId);
    if (!source) return;
    const cloneId = `hire-${Date.now()}`;
    const next = {
      ...source,
      id: cloneId,
      name: `${source.name} Copy`,
      userId: `${source.userId}.copy`,
      curriculum: cloneCurriculum(source.curriculum, cloneId),
      resources: cloneResources(source.resources, cloneId),
      additionalResourceIds: [],
    };
    setState((prev) => ({ ...prev, hires: [next, ...prev.hires] }));
  }

  function saveTemplateFromDepartment() {
    if (!templateDraft.name.trim()) return;
    const department = templateDraft.department;
    const template = {
      id: `template-${Date.now()}`,
      name: templateDraft.name.trim(),
      department,
      curriculum: (departmentCurriculums[department] || []).map((title, i) => ({ id: `temp-task-${i}-${Date.now()}`, title, done: false })),
      resources: (starterResources[department] || []).map((r, i) => ({ id: `temp-resource-${i}-${Date.now()}`, ...r })),
    };
    setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
    setTemplateDraft((prev) => ({ ...prev, name: "" }));
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
    };
    setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
  }

  function cloneTemplate(templateId) {
    const source = state.templates.find((t) => t.id === templateId);
    if (!source) return;
    const template = {
      id: `template-${Date.now()}`,
      name: `${source.name} Copy`,
      department: source.department,
      curriculum: cloneCurriculum(source.curriculum, `copy-${Date.now()}`),
      resources: cloneResources(source.resources, `copy-${Date.now()}`),
    };
    setState((prev) => ({ ...prev, templates: [template, ...prev.templates] }));
  }

  function removeTemplate(templateId) {
    setState((prev) => ({ ...prev, templates: prev.templates.filter((t) => t.id !== templateId) }));
  }
  function removeHire(hireId) {
    setState((prev) => ({ ...prev, hires: prev.hires.filter((h) => h.id !== hireId) }));
  }
  function removeUpcoming(upcomingId) {
    setState((prev) => ({ ...prev, upcoming: prev.upcoming.filter((u) => u.id !== upcomingId) }));
  }
  function addUpcoming() {
    const discipline = effectiveUser?.department === "Leadership" ? "Production" : effectiveUser?.department || "Production";
    const role = discipline === "Qa" ? "QA Analyst" : `${discipline} Team Member`;
    const next = { id: `up-${Date.now()}`, name: "Upcoming Hire", role, discipline, startDate: "", managerId: effectiveUser.id };
    setState((prev) => ({ ...prev, upcoming: [next, ...prev.upcoming] }));
  }
  function updateUpcoming(upcomingId, changes) {
    setState((prev) => ({ ...prev, upcoming: prev.upcoming.map((u) => u.id === upcomingId ? { ...u, ...changes } : u) }));
  }
  function updateHire(hireId, changes) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id === hireId ? { ...h, ...changes } : h) }));
  }
  function toggleTask(hireId, taskId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, curriculum: h.curriculum.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) }) }));
  }
  function updateTaskTitle(hireId, taskId, title) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, curriculum: h.curriculum.map((t) => t.id === taskId ? { ...t, title } : t) }) }));
  }
  function addTask(hireId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, curriculum: [...h.curriculum, { id: `task-${Date.now()}`, title: "New Task", done: false }] }) }));
  }
  function removeTask(hireId, taskId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, curriculum: h.curriculum.filter((t) => t.id !== taskId) }) }));
  }
  function addResource(hireId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, resources: [...h.resources, { id: `resource-${Date.now()}`, title: "New Confluence Document", summary: "What this document is about", url: "", verified: false }] }) }));
  }
  function updateResource(hireId, resourceId, changes) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, resources: h.resources.map((r) => r.id === resourceId ? { ...r, ...changes } : r) }) }));
  }
  function removeResource(hireId, resourceId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, resources: h.resources.filter((r) => r.id !== resourceId) }) }));
  }
  function addExtraContact(hireId, personId) {
    if (!personId) return;
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, additionalResourceIds: h.additionalResourceIds.includes(personId) ? h.additionalResourceIds : [...h.additionalResourceIds, personId] }) }));
  }
  function removeExtraContact(hireId, personId) {
    setState((prev) => ({ ...prev, hires: prev.hires.map((h) => h.id !== hireId ? h : { ...h, additionalResourceIds: h.additionalResourceIds.filter((id) => id !== personId) }) }));
  }

  function updatePerson(personId, changes) {
    setState((prev) => ({
      ...prev,
      people: prev.people.map((person) => {
        if (person.id !== personId) return person;
        const next = { ...person, ...changes };
        if (Object.prototype.hasOwnProperty.call(changes, "level")) {
          next.isManager = MANAGER_LEVELS.has(next.level);
        }
        return next;
      }),
    }));
  }

  return (
    <div className="shell">
      <AppThemeStyles />
      <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", minHeight: "100vh" }}>
        <aside style={{ borderRight: "1px solid rgba(255,255,255,0.10)", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(16px)", padding: 20 }}>
          <div className="glass" style={{ borderRadius: 26, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: "linear-gradient(135deg,#fde047,#f472b6)", display: "grid", placeItems: "center", color: "#5f004f", fontWeight: 900 }}>JP</div>
              <div>
                <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#fde68a", fontWeight: 700 }}>Jackpot Party</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Onboarding Hub</div>
              </div>
            </div>
            <div className="muted" style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5 }}>Executive demo with templates, automation, health scoring, verified resources, and role-based visibility.</div>
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
            {navItems.map((item, index) => <div key={item} className={`sidebar-item ${index === 0 ? "active" : ""}`}>{item}</div>)}
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
          <div className="glass" style={{ borderRadius: 28, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#fde68a", fontSize: 13, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase" }}>Jackpot Party Social Casino • Cedar Falls • Executive demo quality</div>
                <h1 className="hero-title">Jackpot Party Game Team Onboarding Hub</h1>
                <p className="muted" style={{ maxWidth: 900, lineHeight: 1.6, marginBottom: 0 }}>Built for the Jackpot Party team to guide onboarding, direct new hires to the right Confluence pages, verify resources, reuse proven onboarding setups, and give leadership immediate visibility into readiness.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(170px, 1fr))", gap: 10, minWidth: 360 }}>
                <div className="metric"><div className="metric-label" style={{ color: "#fde68a" }}>Verified Docs</div><div className="metric-value">{verifiedResourceCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#86efac" }}>Healthy Ramps</div><div className="metric-value">{healthyCount}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#c4b5fd" }}>Templates</div><div className="metric-value">{state.templates.length}</div></div>
                <div className="metric"><div className="metric-label" style={{ color: "#f9a8d4" }}>Avg Progress</div><div className="metric-value">{averageProgress}%</div></div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: 16, marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "grid", gap: 6 }}><span className="muted">Signed in as</span><select className="select" value={state.currentUserId} onChange={(e) => setState((prev) => ({ ...prev, currentUserId: e.target.value, viewAsUserId: "" }))}>{state.people.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.title}</option>)}</select></label>
            {isAdmin && <label style={{ display: "grid", gap: 6 }}><span className="muted">View as</span><select className="select" value={state.viewAsUserId} onChange={(e) => setState((prev) => ({ ...prev, viewAsUserId: e.target.value }))}><option value="">Myself</option>{state.people.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.title}</option>)}</select></label>}
            <div><strong>Signed in user:</strong> {signedInUser?.name} ({signedInUser?.title})</div>
            <div><strong>Current view:</strong> {effectiveUser?.name} ({effectiveUser?.title})</div>
            {state.viewAsUserId && <StatusBadge label="Viewing as another user" tone="yellow" />}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 24 }}>
            <CardSection title={isManagerView ? "Jackpot Party Manager View" : "Jackpot Party Employee View"} subtitle={isManagerView ? "Managers can build, clone, score, and monitor onboarding." : "Employees see a focused view of their own journey."}>
              <div style={{ marginBottom: 12 }}>Direct reports: <strong>{isManagerView ? directReports.length : 0}</strong> · Visible hires: <strong>{visibleHires.length}</strong></div>
              {isManagerView ? <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}><button className="button" onClick={addUpcoming}>+ Add upcoming new hire</button><button className="button secondary" onClick={() => setSetupModal({ open: true, upcomingId: visibleUpcoming[0]?.id || "" })}>Set up onboarding</button></div> : <div className="muted">You can review assigned documents, contacts, and complete onboarding tasks.</div>}
              {isManagerView && <><div style={{ fontWeight: 700, marginBottom: 8 }}>Direct Reports</div>{directReports.length === 0 ? <div className="muted">No direct reports for this user.</div> : directReports.map((person) => <div key={person.id} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "10px 0" }}><div><strong>{person.name}</strong></div><div>{person.title}</div><div className="muted" style={{ fontSize: 14 }}>{person.department} · {person.level}</div></div>)}</>}
            </CardSection>

            {isManagerView ? (
              <CardSection title="Jackpot Party Templates" subtitle="Build reusable onboarding setups and clone proven ramps with zero guesswork.">
                <div className="glass-soft" style={{ borderRadius: 18, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>How templates work</div>
                  <div className="muted">1. Create a department template or save one from a successful ramp. 2. In an upcoming hire card, click <strong>Set Up Onboarding</strong>. 3. Choose a template. 4. Review and tweak tasks and documents.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 170px auto", gap: 10, marginBottom: 14 }}>
                  <input className="input" value={templateDraft.name} onChange={(e) => setTemplateDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder="Template name" />
                  <select className="select" value={templateDraft.department} onChange={(e) => setTemplateDraft((prev) => ({ ...prev, department: e.target.value }))}>{departments.map((department) => <option key={department} value={department}>{department}</option>)}</select>
                  <button className="button" onClick={saveTemplateFromDepartment}>Save template</button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {state.templates.map((template) => (
                    <div key={template.id} className="glass-soft" style={{ borderRadius: 14, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{template.name}</div>
                          <div className="muted" style={{ fontSize: 13 }}>{template.department} · {template.curriculum.length} tasks · {template.resources.length} docs</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button className="button secondary" onClick={() => setTemplatePreviewId(template.id)}>Preview</button>
                          <button className="button secondary" onClick={() => cloneTemplate(template.id)}>Clone</button>
                          <button className="button danger" onClick={() => removeTemplate(template.id)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardSection>
            ) : (
              <CardSection title="Jackpot Party Department Summary" subtitle="Executive-ready view with consistent theming across all roles.">
                {departments.map((department) => {
                  const peopleInDepartment = state.people.filter((p) => p.department === department);
                  const managerCount = peopleInDepartment.filter((p) => p.isManager).length;
                  return <div key={department} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "10px 0" }}><strong>{department}</strong><div className="muted">{peopleInDepartment.length} people · {managerCount} manager / lead roles</div></div>;
                })}
              </CardSection>
            )}
          </div>

          {isManagerView && (
            <CardSection title="Jackpot Party Upcoming New Hires" subtitle="Step 1: Add hire. Step 2: Set up onboarding. Step 3: Choose a template. Step 4: Verify docs before day one.">
              {visibleUpcoming.length === 0 ? <div className="glass-soft" style={{ borderRadius: 16, padding: 20, textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800 }}>No upcoming hires yet</div><div className="muted" style={{ marginTop: 6 }}>Add an upcoming hire to start a polished onboarding flow.</div></div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>{visibleUpcoming.map((hire) => {
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
                      <StatusBadge label={hire.discipline} tone="default" />
                      <StatusBadge label={`Starts ${formatDate(hire.startDate)}`} tone="default" />
                    </div>
                    <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="muted">Manager</span><span style={{ color: "#fff7d6", fontWeight: 600 }}>{manager?.name || "Unassigned"}</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><span className="muted">Suggested template</span><span style={{ color: "#fff7d6", fontWeight: 600 }}>{matchingTemplate?.name}</span></div>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      <input className="input" value={hire.name} onChange={(e) => updateUpcoming(hire.id, { name: e.target.value })} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <select className="select" value={hire.discipline} onChange={(e) => updateUpcoming(hire.id, { discipline: e.target.value })}>{departments.filter((d) => departmentCurriculums[d]).map((d) => <option key={d} value={d}>{d}</option>)}</select>
                        <input className="input" type="date" value={hire.startDate} onChange={(e) => updateUpcoming(hire.id, { startDate: e.target.value })} />
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button className="button" onClick={() => { setSetupModal({ open: true, upcomingId: hire.id }); setTemplatePreviewId(matchingTemplate?.id || ""); }}>Set Up Onboarding</button>
                        {linkedHire && <button className="button secondary" onClick={() => cloneHireRamp(linkedHire.id)}>Clone ramp</button>}
                        <button className="button danger" onClick={() => removeUpcoming(hire.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}</div>}
            </CardSection>
          )}

          {isManagerView && (
            <CardSection title="Jackpot Party Department Summary" subtitle="Useful for role setup, access review, and org-level confidence before launch.">
              {departments.map((department) => {
                const peopleInDepartment = state.people.filter((p) => p.department === department);
                const managerCount = peopleInDepartment.filter((p) => p.isManager).length;
                return <div key={department} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "10px 0" }}><strong>{department}</strong><div className="muted">{peopleInDepartment.length} people · {managerCount} manager / lead roles</div></div>;
              })}
            </CardSection>
          )}

          {isManagerView && (
            <CardSection title="Jackpot Party Settings" subtitle="Modify role levels, manager relationships, and permission behavior as the org changes.">
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <button className={`button ${settingsTab === "roles" ? "secondary" : ""}`} onClick={() => setSettingsTab("roles")}>Roles & Access</button>
                <button className={`button ${settingsTab === "org" ? "secondary" : ""}`} onClick={() => setSettingsTab("org")}>Org Directory</button>
              </div>
              {settingsTab === "roles" ? <div style={{ display: "grid", gap: 8 }}>{state.people.map((person) => <div key={person.id} className="glass-soft" style={{ borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}><div><div style={{ fontWeight: 700 }}>{person.name}</div><div className="muted" style={{ fontSize: 13 }}>{person.title}</div></div><select className="select" value={person.level} onChange={(e) => updatePerson(person.id, { level: e.target.value, isManager: MANAGER_LEVELS.has(e.target.value) })}>{roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}</select><select className="select" value={person.managerName || ""} onChange={(e) => updatePerson(person.id, { managerName: e.target.value })}><option value="">No manager</option>{state.people.map((manager) => <option key={manager.id} value={manager.name}>{manager.name}</option>)}</select><input className="input" value={person.userId} onChange={(e) => updatePerson(person.id, { userId: e.target.value.toLowerCase(), id: e.target.value.toLowerCase() })} /><label><input type="checkbox" checked={person.isManager} onChange={(e) => updatePerson(person.id, { isManager: e.target.checked })} /> Manager</label></div>)}</div> : <div style={{ display: "grid", gap: 8 }}>{state.people.map((person) => <div key={person.id} className="glass-soft" style={{ borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "1.1fr 1.2fr 0.8fr 1fr 1.1fr 1.1fr auto", gap: 8, alignItems: "center" }}><input className="input" value={person.name} onChange={(e) => updatePerson(person.id, { name: e.target.value })} /><input className="input" value={person.title} onChange={(e) => updatePerson(person.id, { title: e.target.value })} /><input className="input" value={person.level} onChange={(e) => updatePerson(person.id, { level: e.target.value })} /><input className="input" value={person.department} onChange={(e) => updatePerson(person.id, { department: e.target.value })} /><input className="input" value={person.managerName || ""} onChange={(e) => updatePerson(person.id, { managerName: e.target.value })} /><input className="input" value={person.userId} onChange={(e) => updatePerson(person.id, { userId: e.target.value.toLowerCase(), id: e.target.value.toLowerCase() })} /><label><input type="checkbox" checked={person.isManager} onChange={(e) => updatePerson(person.id, { isManager: e.target.checked })} /> Manager</label></div>)}</div>}
            </CardSection>
          )}

          <CardSection title="Jackpot Party Live Onboarding Progress" subtitle={isManagerView ? "Leadership sees all relevant hires. Managers see their direct reports. Employees only see themselves." : "Your personal onboarding progress."}>
            {visibleHires.length === 0 ? <div className="glass-soft" style={{ borderRadius: 16, padding: 28, textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800 }}>No onboarding created yet</div><div className="muted" style={{ marginTop: 6 }}>Start by adding an upcoming hire and using a proven template.</div></div> : visibleHires.map((hire) => {
              const manager = state.people.find((p) => p.id === hire.managerId);
              const canManageThisHire = isManagerView && (isLeadership || hire.managerId === effectiveUser.id);
              const recommended = buildRecommendedContacts(hire, state.people);
              const additionalContacts = hire.additionalResourceIds.map((id) => state.people.find((p) => p.id === id)).filter(Boolean);
              const selectableExtras = state.people.filter((person) => !recommended.find((c) => c.person.id === person.id) && !hire.additionalResourceIds.includes(person.id));
              const health = scoreHealth(hire, state.people);
              const progress = Math.round(((hire.curriculum.filter((t) => t.done).length || 0) / Math.max(hire.curriculum.length, 1)) * 100);
              return (
                <div key={hire.id} className="glass-soft" style={{ borderRadius: 20, padding: 18, marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{hire.name}</h3>
                      <div className="muted">{hire.role} · {hire.department}</div>
                      <div className="muted">Manager: {manager?.name || "Unassigned"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <HealthBadge health={health} />
                      <StatusBadge label={`Progress ${progress}%`} tone={progress >= 70 ? "green" : progress > 0 ? "yellow" : "red"} />
                    </div>
                  </div>

                  {canManageThisHire && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}><button className="button secondary" onClick={() => cloneHireRamp(hire.id)}>Clone ramp</button><button className="button secondary" onClick={() => saveTemplateFromHire(hire.id)}>Save as template</button><button className="button danger" onClick={() => removeHire(hire.id)}>Remove hire</button></div>}

                  {canManageThisHire && <div style={{ display: "grid", gap: 10, marginTop: 16 }}><label>Hire name<input className="input" value={hire.name} onChange={(e) => updateHire(hire.id, { name: e.target.value })} /></label><label>Role<input className="input" value={hire.role} onChange={(e) => updateHire(hire.id, { role: e.target.value })} /></label><label>User ID<input className="input" value={hire.userId} onChange={(e) => updateHire(hire.id, { userId: e.target.value.toLowerCase() })} /></label></div>}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
                    <div className="glass" style={{ borderRadius: 16, padding: 12 }}>
                      <h4 style={{ marginTop: 0 }}>Assigned Documents</h4>
                      <div className="muted" style={{ marginBottom: 10 }}>The hub explains what to read and links out to Confluence. Managers verify accuracy.</div>
                      {(hire.resources || []).length === 0 ? <div className="muted">No documents assigned yet.</div> : hire.resources.map((resource) => <div key={resource.id} className="glass-soft" style={{ borderRadius: 12, padding: 12, marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}><div><div style={{ fontWeight: 700 }}>{resource.title}</div><div className="muted" style={{ fontSize: 14, marginTop: 4 }}>{resource.summary}</div></div><StatusBadge label={resource.verified ? "Verified" : "Needs review"} tone={resource.verified ? "green" : "yellow"} /></div><div style={{ marginTop: 10 }}>{resource.url ? <a href={resource.url} target="_blank" rel="noreferrer">Open in Confluence</a> : <span className="muted">Link still needs to be added</span>}</div>{canManageThisHire && <div style={{ display: "grid", gap: 8, marginTop: 12 }}><input className="input" value={resource.title} onChange={(e) => updateResource(hire.id, resource.id, { title: e.target.value })} /><textarea className="textarea" value={resource.summary} onChange={(e) => updateResource(hire.id, resource.id, { summary: e.target.value })} /><input className="input" value={resource.url} onChange={(e) => updateResource(hire.id, resource.id, { url: e.target.value })} placeholder="Confluence link" /><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><label><input type="checkbox" checked={resource.verified} onChange={(e) => updateResource(hire.id, resource.id, { verified: e.target.checked })} /> Verified</label><button className="button danger" onClick={() => removeResource(hire.id, resource.id)}>Remove document</button></div></div>}</div>)}
                      {canManageThisHire && <button className="button" onClick={() => addResource(hire.id)}>+ Add Confluence document</button>}
                    </div>

                    <div className="glass" style={{ borderRadius: 16, padding: 12 }}>
                      <h4 style={{ marginTop: 0 }}>People and Journey</h4>
                      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                        {recommended.map((contact) => <div key={`${hire.id}-${contact.type}-${contact.person.id}`} style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 10 }}><strong>{contact.type}</strong><div><div>{contact.person.name} — {contact.person.title}</div><div className="muted" style={{ fontSize: 14 }}>{contact.reason}</div></div></div>)}
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Additional Valuable Resources</div>
                        {additionalContacts.length === 0 ? <div className="muted">No additional resources added yet.</div> : additionalContacts.map((person) => <div key={`${hire.id}-${person.id}`} className="glass-soft" style={{ borderRadius: 10, padding: 8, marginBottom: 8, display: "flex", justifyContent: "space-between", gap: 12 }}><div>{person.name} — {person.title}</div>{canManageThisHire && <button className="button secondary" onClick={() => removeExtraContact(hire.id, person.id)}>Remove</button>}</div>)}
                        {canManageThisHire && <select className="select" defaultValue="" onChange={(e) => { addExtraContact(hire.id, e.target.value); e.target.value = ""; }}><option value="" disabled>Add a person as a helpful resource</option>{selectableExtras.map((person) => <option key={person.id} value={person.id}>{person.name} — {person.title}</option>)}</select>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Onboarding Journey</div>
                        {hire.curriculum.map((task) => <div key={task.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}><input type="checkbox" checked={task.done} onChange={() => toggleTask(hire.id, task.id)} /><input className="input" value={task.title} onChange={(e) => updateTaskTitle(hire.id, task.id, e.target.value)} style={{ flex: 1 }} disabled={!canManageThisHire && isManagerView} />{canManageThisHire && <button className="button danger" onClick={() => removeTask(hire.id, task.id)}>Remove</button>}</div>)}
                        {canManageThisHire && <button className="button" onClick={() => addTask(hire.id)}>+ Add Task</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardSection>
        </main>
      </div>

      <Modal open={setupModal.open}>
        <div className="glass modal-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#fde68a", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 800 }}>Set up onboarding</div>
              <h3 style={{ marginTop: 6, marginBottom: 6 }}>Choose a template</h3>
              <div className="muted">Pick a proven setup. You can still modify tasks, documents, and contacts after creation.</div>
            </div>
            <button className="button secondary" onClick={() => { setSetupModal({ open: false, upcomingId: "" }); setTemplatePreviewId(""); }}>Close</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {state.templates.map((template) => (
                <button key={template.id} className="glass-soft template-choice" style={{ borderRadius: 16, padding: 14, textAlign: "left", transition: "transform .18s ease, border-color .18s ease" }} onClick={() => setTemplatePreviewId(template.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "#fff7d6" }}>{template.name}</div>
                      <div className="muted" style={{ fontSize: 13 }}>{template.department} · {template.curriculum.length} tasks · {template.resources.length} docs</div>
                    </div>
                    <StatusBadge label={template.department} tone="default" />
                  </div>
                </button>
              ))}
            </div>

            <div className="glass-soft" style={{ borderRadius: 18, padding: 16 }}>
              {previewTemplate ? (
                <>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#fff7d6" }}>{previewTemplate.name}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{previewTemplate.department}</div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Sample curriculum</div>
                    <div style={{ display: "grid", gap: 6 }}>{previewTemplate.curriculum.slice(0, 4).map((task) => <div key={task.id} className="muted">• {task.title}</div>)}</div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Assigned resources</div>
                    <div style={{ display: "grid", gap: 6 }}>{previewTemplate.resources.slice(0, 4).map((resource) => <div key={resource.id} className="muted">• {resource.title}</div>)}</div>
                  </div>
                  <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="button" onClick={() => createHireFromTemplate(setupModal.upcomingId, previewTemplate.id)}>Create from template</button>
                    <button className="button secondary" onClick={() => cloneTemplate(previewTemplate.id)}>Clone template</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: 30 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Preview a template</div>
                  <div className="muted" style={{ marginTop: 6 }}>Select a template on the left to see tasks, docs, and setup details before applying it.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
