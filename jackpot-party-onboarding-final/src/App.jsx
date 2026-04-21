
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, CheckCircle2, Circle, Users, BookOpen, Filter, Clock, AlertCircle,
  Home, LayoutDashboard, Settings, Bell, ShieldCheck, Link as LinkIcon,
  ClipboardList, ExternalLink, BarChart3, FileText, CalendarClock,
  Trophy, Gem, PartyPopper
} from "lucide-react";

const STORAGE_KEY = "jackpot-party-onboarding-hub-v2";
const roles = ["Producer", "QA", "Engineer", "Analyst", "Artist"];
const roleClasses = {
  Producer: "role-producer",
  QA: "role-qa",
  Engineer: "role-engineer",
  Analyst: "role-analyst",
  Artist: "role-artist",
};

const initialNewHires = [
  { id: "nh-1", name: "Alex Carter", role: "Producer", manager: "Donald Pang", startDate: "2026-04-08", onboardingOwner: "Donald Pang", buddy: "QA Lead", status: "On Track" },
  { id: "nh-2", name: "Maya Patel", role: "Engineer", manager: "Tech Lead", startDate: "2026-04-15", onboardingOwner: "Tech Lead", buddy: "Senior Engineer", status: "Needs Support" },
  { id: "nh-3", name: "Jordan Lee", role: "QA", manager: "QA Lead", startDate: "2026-04-22", onboardingOwner: "QA Lead", buddy: "Test Lead", status: "Planned" },
];

const initialContacts = [
  { id: "c1", name: "Donald Pang", role: "Production Lead", team: "Production", slack: "@donald.pang", area: "Onboarding, delivery, team process" },
  { id: "c2", name: "QA Lead", role: "Quality Assurance", team: "QA", slack: "@qa-lead", area: "Test strategy, release signoff" },
  { id: "c3", name: "Tech Lead", role: "Engineering", team: "Engineering", slack: "@tech-lead", area: "Architecture, local setup, codebase" },
  { id: "c4", name: "Product Lead", role: "Product", team: "Product", slack: "@product-lead", area: "Roadmap, player experience, feature goals" },
];

const initialResources = [
  { id: "r1", title: "Jackpot Party Game Overview", category: "Game Knowledge", audience: ["Producer","QA","Engineer","Analyst","Artist"], type: "Guide", owner: "Product Lead", verifiedAt: "2026-04-01", status: "Verified", summary: "Core loops, social casino economy pillars, feature highlights, and current team priorities.", tags: ["jackpot party", "core loop", "economy"], url: "#" },
  { id: "r2", title: "Release & Event Flow", category: "Process", audience: ["Producer","QA","Engineer"], type: "Workflow", owner: "Production Lead", verifiedAt: "2026-04-05", status: "Verified", summary: "How live events and features move from planning through implementation, QA, release readiness, and launch.", tags: ["release", "events", "qa"], url: "#" },
  { id: "r3", title: "How We Use Jira", category: "Tools", audience: ["Producer","QA","Engineer","Analyst"], type: "Tooling", owner: "Production Ops", verifiedAt: "2026-04-06", status: "Verified", summary: "Project structure, board conventions, initiative tracking, ticket hygiene, and status expectations.", tags: ["jira", "workflow", "planning"], url: "#" },
  { id: "r4", title: "Team Map & Ownership", category: "People", audience: ["Producer","QA","Engineer","Analyst","Artist"], type: "Directory", owner: "Game Leadership", verifiedAt: "2026-04-04", status: "Verified", summary: "Who owns what, where to ask questions, and how decisions get made across the team.", tags: ["contacts", "ownership", "org"], url: "#" },
  { id: "r5", title: "QA Smoke Checklist", category: "QA", audience: ["QA","Producer"], type: "Checklist", owner: "QA Lead", verifiedAt: "2026-03-29", status: "Needs Review", summary: "The minimum validation path used before a build is considered ready for wider review.", tags: ["qa", "checklist", "builds"], url: "#" },
  { id: "r6", title: "Engineering Environment Setup", category: "Engineering", audience: ["Engineer"], type: "Setup", owner: "Tech Lead", verifiedAt: "2026-04-07", status: "Verified", summary: "Machine prep, repo access, dependencies, common setup issues, and who to contact when blocked.", tags: ["setup", "engineering", "repo"], url: "#" },
];

const initialTasksByRole = {
  Producer: [
    { id: "p1", title: "Complete account and tool setup", week: "Week 1", required: true, owner: "Production Ops", linkId: "r3" },
    { id: "p2", title: "Play the current Jackpot Party build and capture first impressions", week: "Week 1", required: true, owner: "Product Lead", linkId: "r1" },
    { id: "p3", title: "Review initiative tracker, sprint rituals, and release cadence", week: "Week 1", required: true, owner: "Donald Pang", linkId: "r2" },
    { id: "p4", title: "Shadow backlog grooming and standup", week: "Week 2", required: true, owner: "Production Lead", linkId: "r3" },
    { id: "p5", title: "Own a small planning or coordination task", week: "Week 3", required: true, owner: "Manager", linkId: "r2" },
    { id: "p6", title: "Present a ramp-up summary with gaps and questions", week: "Week 4", required: false, owner: "Manager", linkId: "r4" },
  ],
  QA: [
    { id: "q1", title: "Complete account and device setup", week: "Week 1", required: true, owner: "QA Lead", linkId: "r5" },
    { id: "q2", title: "Play the game and understand critical player paths", week: "Week 1", required: true, owner: "Product Lead", linkId: "r1" },
    { id: "q3", title: "Review smoke, regression, and release validation flow", week: "Week 1", required: true, owner: "QA Lead", linkId: "r5" },
    { id: "q4", title: "Shadow test execution on a real feature", week: "Week 2", required: true, owner: "QA Lead", linkId: "r2" },
    { id: "q5", title: "Execute and log a contained test pass", week: "Week 3", required: true, owner: "Manager", linkId: "r5" },
    { id: "q6", title: "Share top onboarding friction points", week: "Week 4", required: false, owner: "Manager", linkId: "r4" },
  ],
  Engineer: [
    { id: "e1", title: "Complete machine and repo setup", week: "Week 1", required: true, owner: "Tech Lead", linkId: "r6" },
    { id: "e2", title: "Build and run the game locally", week: "Week 1", required: true, owner: "Tech Lead", linkId: "r6" },
    { id: "e3", title: "Review architecture, branching, and release expectations", week: "Week 1", required: true, owner: "Tech Lead", linkId: "r2" },
    { id: "e4", title: "Shadow code review and planning rituals", week: "Week 2", required: true, owner: "Senior Engineer", linkId: "r3" },
    { id: "e5", title: "Pick up a starter task and ship it", week: "Week 3", required: true, owner: "Manager", linkId: "r3" },
    { id: "e6", title: "Document one setup improvement", week: "Week 4", required: false, owner: "Manager", linkId: "r6" },
  ],
  Analyst: [
    { id: "a1", title: "Complete system access setup", week: "Week 1", required: true, owner: "Analytics Lead", linkId: "r3" },
    { id: "a2", title: "Review key KPIs and game economy metrics", week: "Week 1", required: true, owner: "Product Lead", linkId: "r1" },
    { id: "a3", title: "Understand experiment and reporting cadence", week: "Week 1", required: true, owner: "Analytics Lead", linkId: "r2" },
    { id: "a4", title: "Shadow a data review meeting", week: "Week 2", required: true, owner: "Analytics Lead", linkId: "r4" },
    { id: "a5", title: "Build one starter report or dashboard", week: "Week 3", required: true, owner: "Manager", linkId: "r1" },
    { id: "a6", title: "Recommend one instrumentation gap", week: "Week 4", required: false, owner: "Manager", linkId: "r4" },
  ],
  Artist: [
    { id: "ar1", title: "Complete tool and file access setup", week: "Week 1", required: true, owner: "Art Lead", linkId: "r4" },
    { id: "ar2", title: "Review visual style guides and current feature priorities", week: "Week 1", required: true, owner: "Art Lead", linkId: "r1" },
    { id: "ar3", title: "Understand review and implementation workflow", week: "Week 1", required: true, owner: "Art Lead", linkId: "r2" },
    { id: "ar4", title: "Shadow asset review or feedback loop", week: "Week 2", required: true, owner: "Art Lead", linkId: "r4" },
    { id: "ar5", title: "Deliver one starter asset or polish task", week: "Week 3", required: true, owner: "Manager", linkId: "r1" },
    { id: "ar6", title: "Suggest one improvement to art handoff", week: "Week 4", required: false, owner: "Manager", linkId: "r4" },
  ],
};

const defaultManagerChecklist = [
  "Review role journey with the new hire on day one",
  "Confirm access to tools and key channels by end of first day",
  "Assign a buddy for tactical questions",
  "Schedule first-week check-in and week-two checkpoint",
  "Give one contained starter task by week three",
  "Capture onboarding friction and feed it back into the hub",
];

const weekPriorityCopy = [
  "Understand the game and what success looks like for your role.",
  "Get access to the tools, channels, and systems you will use every day.",
  "Know the people, rituals, and handoffs that matter most.",
];

const faqs = [
  { id: "f1", question: "Where do I start on day one?", answer: "Begin with your role journey, complete tool setup, and play the current game build with fresh eyes before diving into process details." },
  { id: "f2", question: "What should I read versus ignore?", answer: "This hub only surfaces curated resources. Anything not linked here is secondary until an owner reviews and adds it." },
  { id: "f3", question: "What if a doc is outdated?", answer: "Every resource shows an owner and verification status so people know who to contact and leaders know what needs maintenance." },
];

function getRelativeDateLabel(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Verified today";
  if (diffDays === 1) return "Verified 1 day ago";
  return `Verified ${diffDays} days ago`;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, className = "" }) {
  return <span className={classNames("badge", className)}>{children}</span>;
}

function Button({ children, className = "", variant = "primary", ...props }) {
  return (
    <button className={classNames("btn", variant === "outline" ? "btn-outline" : "btn-primary", className)} {...props}>
      {children}
    </button>
  );
}

function GlassCard({ className = "", children }) {
  return <section className={classNames("glass-card", className)}>{children}</section>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("journey");
  const [selectedRole, setSelectedRole] = useState("Producer");
  const [selectedHireId, setSelectedHireId] = useState(initialNewHires[0].id);
  const [query, setQuery] = useState("");
  const [resourceCategory, setResourceCategory] = useState("All");
  const [showNeedsReviewOnly, setShowNeedsReviewOnly] = useState(false);
  const [appState, setAppState] = useState(() => {
    if (typeof window === "undefined") return { resources: initialResources, contacts: initialContacts, tasksByRole: initialTasksByRole, newHires: initialNewHires, taskCompletion: {}, notes: {} };
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { resources: initialResources, contacts: initialContacts, tasksByRole: initialTasksByRole, newHires: initialNewHires, taskCompletion: {}, notes: {} };
    try { return JSON.parse(stored); } catch { return { resources: initialResources, contacts: initialContacts, tasksByRole: initialTasksByRole, newHires: initialNewHires, taskCompletion: {}, notes: {} }; }
  });

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(appState.resources.map((resource) => resource.category)))], [appState.resources]);

  const selectedHire = appState.newHires.find((hire) => hire.id === selectedHireId) || appState.newHires[0] || initialNewHires[0];

  useEffect(() => {
    if (selectedHire && selectedRole !== selectedHire.role) setSelectedRole(selectedHire.role);
  }, [selectedHire, selectedRole]);

  const tasks = appState.tasksByRole[selectedRole] || [];
  const taskKey = (hireId, taskId) => `${hireId}:${taskId}`;

  const completion = useMemo(() => {
    if (!selectedHire || !tasks.length) return 0;
    const done = tasks.filter((task) => appState.taskCompletion[taskKey(selectedHire.id, task.id)]).length;
    return Math.round((done / tasks.length) * 100);
  }, [appState.taskCompletion, selectedHire, tasks]);

  const filteredResources = useMemo(() => {
    return appState.resources.filter((resource) => {
      const matchesRole = resource.audience.includes(selectedRole);
      const matchesCategory = resourceCategory === "All" || resource.category === resourceCategory;
      const matchesReview = !showNeedsReviewOnly || resource.status === "Needs Review";
      const haystack = [resource.title, resource.summary, resource.category, resource.owner, ...resource.tags].join(" ").toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesRole && matchesCategory && matchesReview && matchesQuery;
    });
  }, [appState.resources, query, resourceCategory, selectedRole, showNeedsReviewOnly]);

  const stats = useMemo(() => {
    const verified = appState.resources.filter((resource) => resource.status === "Verified").length;
    const needsReview = appState.resources.filter((resource) => resource.status === "Needs Review").length;
    const onTrack = appState.newHires.filter((hire) => hire.status === "On Track").length;
    const needsSupport = appState.newHires.filter((hire) => hire.status === "Needs Support").length;
    return { totalResources: appState.resources.length, verified, needsReview, totalHires: appState.newHires.length, onTrack, needsSupport };
  }, [appState.resources, appState.newHires]);

  const roleSummary = useMemo(() => {
    return roles.map((role) => {
      const hiresInRole = appState.newHires.filter((hire) => hire.role === role);
      const roleTasks = appState.tasksByRole[role] || [];
      if (!hiresInRole.length || !roleTasks.length) return { role, completion: 0, hires: hiresInRole.length };
      const totalChecks = hiresInRole.length * roleTasks.length;
      let completedChecks = 0;
      hiresInRole.forEach((hire) => {
        roleTasks.forEach((task) => {
          if (appState.taskCompletion[taskKey(hire.id, task.id)]) completedChecks += 1;
        });
      });
      return { role, hires: hiresInRole.length, completion: Math.round((completedChecks / totalChecks) * 100) };
    });
  }, [appState.newHires, appState.taskCompletion, appState.tasksByRole]);

  const linkedResource = (resourceId) => appState.resources.find((resource) => resource.id === resourceId);

  const toggleTask = (taskId) => {
    if (!selectedHire) return;
    const key = taskKey(selectedHire.id, taskId);
    setAppState((prev) => ({ ...prev, taskCompletion: { ...prev.taskCompletion, [key]: !prev.taskCompletion[key] } }));
  };

  const updateResource = (resourceId, changes) => {
    setAppState((prev) => ({ ...prev, resources: prev.resources.map((resource) => resource.id === resourceId ? { ...resource, ...changes } : resource) }));
  };

  const addResource = () => {
    const nextId = `r${Date.now()}`;
    setAppState((prev) => ({
      ...prev,
      resources: [{
        id: nextId, title: "New Resource", category: "Tools", audience: [selectedRole], type: "Guide",
        owner: "Unassigned", verifiedAt: new Date().toISOString().slice(0, 10), status: "Needs Review",
        summary: "Add a short summary so new hires know why this matters.", tags: ["new"], url: "#"
      }, ...prev.resources]
    }));
  };

  const addNewHire = () => {
    const newHire = {
      id: `nh-${Date.now()}`, name: "New Hire", role: selectedRole, manager: "Manager",
      startDate: new Date().toISOString().slice(0, 10), onboardingOwner: "Manager", buddy: "TBD", status: "Planned"
    };
    setAppState((prev) => ({ ...prev, newHires: [newHire, ...prev.newHires] }));
    setSelectedHireId(newHire.id);
  };

  const updateSelectedHire = (changes) => {
    if (!selectedHire) return;
    setAppState((prev) => ({ ...prev, newHires: prev.newHires.map((hire) => hire.id === selectedHire.id ? { ...hire, ...changes } : hire) }));
  };

  const selectedHireNotes = selectedHire ? appState.notes[selectedHire.id] || "" : "";
  const setSelectedHireNotes = (value) => {
    if (!selectedHire) return;
    setAppState((prev) => ({ ...prev, notes: { ...prev.notes, [selectedHire.id]: value } }));
  };

  const navItems = [
    { label: "Home", icon: Home },
    { label: "Journey", icon: ClipboardList },
    { label: "Resources", icon: BookOpen },
    { label: "People", icon: Users },
    { label: "Insights", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="app-bg">
      <div className="ambient ambient-1"></div>
      <div className="ambient ambient-2"></div>
      <div className="ambient ambient-3"></div>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand glass-card compact">
            <div className="brand-row">
              <div className="brand-icon"><Trophy size={20} /></div>
              <div>
                <p className="eyebrow">Jackpot Party</p>
                <p className="brand-title">Onboarding Hub</p>
              </div>
            </div>
            <div className="subnote">Glamour, clarity, and ramp-up progress in one place.</div>
          </div>

          <nav className="nav-stack">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="nav-item">
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="glass-card compact">
            <div className="health-title"><Gem size={14} /> Data Health</div>
            <div className="health-list">
              <div><span>Verified docs</span><strong>{stats.verified}</strong></div>
              <div><span>Need review</span><strong>{stats.needsReview}</strong></div>
              <div><span>New hires</span><strong>{stats.totalHires}</strong></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <p className="top-kicker">Jackpot Party Social Casino onboarding experience</p>
              <h1 className="gradient-title">Game Team Onboarding Hub</h1>
            </div>
            <div className="top-actions">
              <Button variant="outline"><Bell size={16} /> Review Queue</Button>
              <Button>Publish Changes</Button>
            </div>
          </div>

          <div className="page">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hero-grid">
              <GlassCard className="hero-card">
                <div className="hero-glow hero-glow-right"></div>
                <div className="hero-glow hero-glow-left"></div>
                <div className="badge-row">
                  <Badge className="gold-badge">Standalone Tool</Badge>
                  <Badge>Preview Ready</Badge>
                  <Badge>Editable MVP</Badge>
                </div>
                <h2 className="hero-title">Bring the sparkle of Jackpot Party to the onboarding experience.</h2>
                <p className="hero-copy">
                  A vibrant onboarding product for your game team with polished casino-inspired visuals, guided role journeys,
                  real hire tracking, resource curation, and leadership visibility.
                </p>
                <div className="party-note"><PartyPopper size={16} /> Styled to feel more celebratory and closer to a social casino product experience.</div>
                <div className="stats-grid">
                  {[
                    { label: "Verified resources", value: stats.verified, icon: ShieldCheck, note: `${stats.needsReview} need review` },
                    { label: "Active new hires", value: stats.totalHires, icon: Users, note: `${stats.onTrack} on track` },
                    { label: "Support needed", value: stats.needsSupport, icon: AlertCircle, note: "Manager attention" },
                    { label: "Selected progress", value: `${completion}%`, icon: BarChart3, note: selectedHire ? selectedHire.name : "No hire selected" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="stat-card">
                        <div className="stat-head">
                          <p>{stat.label}</p>
                          <Icon size={16} />
                        </div>
                        <p className="stat-value">{stat.value}</p>
                        <p className="stat-note">{stat.note}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard>
                <div className="card-header">
                  <h3 className="card-title"><LayoutDashboard size={18} className="icon-highlight" /> New Hire Control Center</h3>
                  <p className="card-subtitle">Select a person and manage a real onboarding path.</p>
                </div>

                <div className="field-stack">
                  <label className="field">
                    <span>Selected new hire</span>
                    <select value={selectedHireId} onChange={(e) => setSelectedHireId(e.target.value)}>
                      {appState.newHires.map((hire) => <option key={hire.id} value={hire.id}>{hire.name} · {hire.role}</option>)}
                    </select>
                  </label>

                  <div className="field-grid">
                    <label className="field"><span>Name</span><input value={selectedHire?.name || ""} onChange={(e) => updateSelectedHire({ name: e.target.value })} /></label>
                    <label className="field"><span>Status</span>
                      <select value={selectedHire?.status || "Planned"} onChange={(e) => updateSelectedHire({ status: e.target.value })}>
                        <option>Planned</option><option>On Track</option><option>Needs Support</option><option>Completed</option>
                      </select>
                    </label>
                    <label className="field"><span>Role</span>
                      <select value={selectedHire?.role || selectedRole} onChange={(e) => updateSelectedHire({ role: e.target.value })}>
                        {roles.map((role) => <option key={role}>{role}</option>)}
                      </select>
                    </label>
                    <label className="field"><span>Start date</span><input type="date" value={selectedHire?.startDate || ""} onChange={(e) => updateSelectedHire({ startDate: e.target.value })} /></label>
                  </div>

                  <div className="field-grid">
                    <label className="field"><span>Manager</span><input value={selectedHire?.manager || ""} onChange={(e) => updateSelectedHire({ manager: e.target.value })} /></label>
                    <label className="field"><span>Buddy</span><input value={selectedHire?.buddy || ""} onChange={(e) => updateSelectedHire({ buddy: e.target.value })} /></label>
                  </div>

                  <Button variant="outline" className="full-width" onClick={addNewHire}>Add New Hire</Button>
                </div>
              </GlassCard>
            </motion.div>

            <div className="tabs-bar">
              {["journey","resources","people","insights","admin"].map((tab) => (
                <button key={tab} className={classNames("tab-btn", activeTab === tab && "tab-active")} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "journey" && (
              <div className="content-grid">
                <GlassCard>
                  <div className="card-header spread">
                    <div>
                      <h3 className="card-title">
                        {selectedRole} 30-Day Journey
                        <Badge className={classNames("role-badge", roleClasses[selectedRole])}>{selectedRole}</Badge>
                      </h3>
                      <p className="card-subtitle">Role-based onboarding tasks for {selectedHire?.name || "the selected hire"}.</p>
                    </div>
                    <div className="progress-wrap">
                      <div className="progress-head"><span>Completion</span><span>{completion}%</span></div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${completion}%` }}></div></div>
                    </div>
                  </div>

                  <div className="stack">
                    {tasks.map((task, index) => {
                      const isDone = !!appState.taskCompletion[taskKey(selectedHire?.id, task.id)];
                      const resource = linkedResource(task.linkId);
                      return (
                        <motion.button key={task.id} whileHover={{ y: -1 }} onClick={() => toggleTask(task.id)} className="task-card">
                          <div className="task-icon">{isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                          <div className="task-body">
                            <div className="task-row">
                              <p className="task-title">{index + 1}. {task.title}</p>
                              <div className="chip-row">
                                <Badge className={task.required ? "gold-badge" : ""}>{task.required ? "Required" : "Recommended"}</Badge>
                                <Badge>{task.week}</Badge>
                              </div>
                            </div>
                            <div className="chip-row muted-row">
                              <Badge>Owner: {task.owner}</Badge>
                              {resource ? <Badge>Linked: {resource.title}</Badge> : null}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </GlassCard>

                <div className="side-stack">
                  <GlassCard>
                    <div className="card-header"><h3 className="card-title">First Week Priorities</h3></div>
                    <div className="stack">
                      {weekPriorityCopy.map((item) => <div key={item} className="soft-tile">{item}</div>)}
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <div className="card-header">
                      <h3 className="card-title">Manager Notes</h3>
                      <p className="card-subtitle">Persistent notes for this specific new hire.</p>
                    </div>
                    <textarea className="notes" value={selectedHireNotes} onChange={(e) => setSelectedHireNotes(e.target.value)} placeholder="Capture blockers, feedback, or observations here..." />
                  </GlassCard>

                  <GlassCard>
                    <div className="card-header"><h3 className="card-title">Common Ramp Risks</h3></div>
                    <div className="stack">
                      {["Too many docs without clear order","No single owner for onboarding content","Unclear expectations for first 30 days"].map((risk) => (
                        <div key={risk} className="warning-tile"><AlertCircle size={16} /> <span>{risk}</span></div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <GlassCard>
                <div className="card-header spread">
                  <div>
                    <h3 className="card-title">Curated Resource Hub</h3>
                    <p className="card-subtitle">Editable, role-aware, and maintainable by your team over time.</p>
                  </div>
                  <Button onClick={addResource}>Add Resource</Button>
                </div>

                <div className="filters-grid">
                  <label className="field search-field">
                    <Search size={16} className="search-icon" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guides, workflows, tools, owners..." />
                  </label>
                  <label className="field">
                    <span>Category</span>
                    <select value={resourceCategory} onChange={(e) => setResourceCategory(e.target.value)}>
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </label>
                  <label className="toggle-field">
                    <div><ShieldCheck size={16} /> Needs Review Only</div>
                    <input type="checkbox" checked={showNeedsReviewOnly} onChange={(e) => setShowNeedsReviewOnly(e.target.checked)} />
                  </label>
                </div>

                <div className="resource-grid">
                  {filteredResources.map((resource) => (
                    <GlassCard key={resource.id} className="resource-card">
                      <div className="chip-row">
                        <Badge>{resource.category}</Badge>
                        <Badge>{resource.type}</Badge>
                        <Badge className={resource.status === "Verified" ? "gold-badge" : ""}>{resource.status}</Badge>
                      </div>

                      <div className="field-stack">
                        <label className="field"><span>Title</span><input value={resource.title} onChange={(e) => updateResource(resource.id, { title: e.target.value })} /></label>
                        <label className="field"><span>Summary</span><textarea value={resource.summary} onChange={(e) => updateResource(resource.id, { summary: e.target.value })}></textarea></label>
                      </div>

                      <div className="field-grid">
                        <label className="field"><span>Owner</span><input value={resource.owner} onChange={(e) => updateResource(resource.id, { owner: e.target.value })} /></label>
                        <label className="field"><span>Verification date</span><input type="date" value={resource.verifiedAt} onChange={(e) => updateResource(resource.id, { verifiedAt: e.target.value })} /></label>
                        <label className="field"><span>Link</span><input value={resource.url} onChange={(e) => updateResource(resource.id, { url: e.target.value })} /></label>
                        <label className="field"><span>Status</span>
                          <select value={resource.status} onChange={(e) => updateResource(resource.id, { status: e.target.value })}>
                            <option>Verified</option><option>Needs Review</option><option>Draft</option>
                          </select>
                        </label>
                      </div>

                      <div className="chip-row muted-row">
                        <Badge><Clock size={14} /> {getRelativeDateLabel(resource.verifiedAt)}</Badge>
                        <Badge><LinkIcon size={14} /> {resource.url || "No link yet"}</Badge>
                      </div>
                      <div className="chip-row">
                        {resource.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
                      </div>
                      <div className="btn-row">
                        <Button variant="outline" className="flex-1">Open Resource <ExternalLink size={16} /></Button>
                        <Button onClick={() => updateResource(resource.id, { verifiedAt: new Date().toISOString().slice(0, 10), status: "Verified" })}>Mark Verified</Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </GlassCard>
            )}

            {activeTab === "people" && (
              <div className="content-grid people-grid">
                <GlassCard>
                  <div className="card-header">
                    <h3 className="card-title">Who owns what</h3>
                    <p className="card-subtitle">Reduce confusion by making ownership discoverable.</p>
                  </div>
                  <div className="stack">
                    {appState.contacts.map((person) => (
                      <div key={person.id} className="person-card">
                        <div className="person-row">
                          <div>
                            <p className="person-name">{person.name}</p>
                            <p className="card-subtitle">{person.role} · {person.team}</p>
                          </div>
                          <Badge>{person.slack}</Badge>
                        </div>
                        <p className="person-note">Best contact for: {person.area}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <div className="side-stack">
                  <GlassCard>
                    <div className="card-header">
                      <h3 className="card-title">Manager Checklist</h3>
                      <p className="card-subtitle">Operational expectations for onboarding owners.</p>
                    </div>
                    <div className="stack">
                      {defaultManagerChecklist.map((item) => <div key={item} className="soft-tile">{item}</div>)}
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <div className="card-header">
                      <h3 className="card-title">FAQ</h3>
                      <p className="card-subtitle">Answers for repeated new-hire questions.</p>
                    </div>
                    <div className="stack">
                      {faqs.map((faq) => (
                        <details key={faq.id} className="faq-item">
                          <summary>{faq.question}</summary>
                          <p>{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeTab === "insights" && (
              <div className="content-grid insights-grid">
                <GlassCard>
                  <div className="card-header">
                    <h3 className="card-title">Onboarding Health by Role</h3>
                    <p className="card-subtitle">A simple role-level view of ramp progress.</p>
                  </div>
                  <div className="stack">
                    {roleSummary.map((item) => (
                      <div key={item.role} className="health-card">
                        <div className="health-row">
                          <div className="chip-row">
                            <Badge className={classNames("role-badge", roleClasses[item.role])}>{item.role}</Badge>
                            <span className="health-note">{item.hires} hires</span>
                          </div>
                          <span>{item.completion}%</span>
                        </div>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${item.completion}%` }}></div></div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="card-header">
                    <h3 className="card-title">Operational Signals</h3>
                    <p className="card-subtitle">What leadership can monitor without opening ten documents.</p>
                  </div>
                  <div className="stack">
                    {[`Resources tracked: ${stats.totalResources}`,`Resources needing review: ${stats.needsReview}`,`New hires needing support: ${stats.needsSupport}`,`Selected new hire start date: ${selectedHire?.startDate || "TBD"}`,`Selected onboarding owner: ${selectedHire?.onboardingOwner || "Unassigned"}`].map((item) => (
                      <div key={item} className="soft-tile">{item}</div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="content-grid admin-grid-wrap">
                <GlassCard>
                  <div className="card-header">
                    <h3 className="card-title">Admin Notes for Productionization</h3>
                    <p className="card-subtitle">This build is ready to keep iterating in preview and can later be wired to real systems.</p>
                  </div>
                  <div className="admin-grid">
                    {[
                      { title: "Persistence", body: "The app currently saves locally in browser storage so feedback sessions and edits persist between refreshes.", icon: FileText },
                      { title: "Real Backends", body: "Next step is replacing local storage with Supabase, Firebase, or your internal API for shared team data.", icon: Search },
                      { title: "Auth & Permissions", body: "Add SSO and role-based edit permissions so managers edit onboarding while new hires consume and complete it.", icon: ShieldCheck },
                      { title: "Workflow Integrations", body: "Connect Jira, Slack, HRIS, and document systems to auto-create checklists, owners, and reminders.", icon: CalendarClock },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="admin-tile">
                          <div className="admin-title"><Icon size={16} /> {item.title}</div>
                          <p>{item.body}</p>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="card-header">
                    <h3 className="card-title">Implementation Queue</h3>
                    <p className="card-subtitle">Logical next enhancements once you collect stakeholder feedback.</p>
                  </div>
                  <div className="stack">
                    {["Multi-user shared database","Admin-only editing mode","Invite links for new hires","Automated resource freshness alerts","Embedded walkthrough videos","Search analytics and dead-end reports"].map((item) => (
                      <div key={item} className="soft-tile">{item}</div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
