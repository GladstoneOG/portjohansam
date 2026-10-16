/* ──────────────────────────────────────────────────────────────
   JS//SYS — CONTENT LAYER
   Every piece of copy on the site lives here. Edit freely.
   ────────────────────────────────────────────────────────────── */

export const profile = {
  first: "JOHAN",
  last: "SAMSUDIN",
  callsign: "OPERATOR // JS-01",
  email: "johansans999@gmail.com",
  location: "JAKARTA, ID",
  coords: "06°12′S 106°50′E",
  timezone: "Asia/Jakarta",
  status: "AVAILABLE FOR DEPLOYMENT",
  roles: [
    "PROMPT ENGINEER",
    "AI-AUGMENTED ABAP ARCHITECT",
    "AGENTIC SAP DEVELOPER",
    "LLM ORCHESTRATION LEAD",
    "CONTEXT ENGINEER",
    "SAP IS-H SPECIALIST",
  ],
  spec: [
    { k: "CLASS", v: "AI-Augmented ABAP Architect" },
    { k: "DOMAIN", v: "SAP IS-H · Healthcare ERP" },
    { k: "STACK", v: "ABAP · LLM · MCP · PHP · JS" },
    { k: "BASE", v: "Jakarta, Indonesia" },
  ],
  summary:
    "SAP ABAP IS-H developer on ECC 6.0 who pairs deep RICEFW craft with AI-native engineering. I design prompts, engineer context and direct LLM agents across the SAP stack, then review and validate every line before it ships to a hospital that runs 24/7.",
};

export const manifesto = {
  text: "I don't just write ABAP. I orchestrate intelligence to write it with me — engineering the context, architecting the prompts, directing autonomous agents through the SAP stack, then verifying every line as if it were going to production. Because it is.",
  highlights: ["orchestrate", "intelligence", "production."],
};

export type TermLine = {
  t: "cmd" | "ok" | "info" | "warn" | "code" | "sys" | "blank";
  s: string;
};

export const protocol: {
  id: string;
  code: string;
  title: string;
  alias: string;
  desc: string;
  term: TermLine[];
}[] = [
  {
    id: "01",
    code: "CTX",
    title: "Context Engineering",
    alias: "Semantic Grounding Layer",
    desc: "Before a single token is generated, I curate the model's world: DDIC structures, IS-H table relationships, naming conventions and Clean ABAP rules — injected as structured context so the AI reasons like a senior SAP consultant, not a chatbot.",
    term: [
      { t: "cmd", s: 'agent.context.load({ tables: ["NPAT","NFAL","NBEW"] })' },
      { t: "ok", s: "3 DDIC structures indexed · 1,284 tokens" },
      { t: "cmd", s: 'agent.context.attach("clean-abap.ruleset")' },
      { t: "ok", s: "42 coding standards bound to session" },
      { t: "info", s: "grounding: IS-H · ECC 6.0 · NW 7.40" },
    ],
  },
  {
    id: "02",
    code: "PRM",
    title: "Prompt Architecture",
    alias: "Intent Specification Protocol",
    desc: "Requirements become deterministic, layered prompt specs — role, task, constraints, acceptance criteria. Vague tickets go in; unambiguous machine-readable intent comes out.",
    term: [
      { t: "sys", s: "SYSTEM  You are a senior SAP IS-H architect." },
      { t: "sys", s: "TASK    ALV of open inpatient cases per ward." },
      { t: "sys", s: "RULES   no SELECT * · guard FOR ALL ENTRIES" },
      { t: "sys", s: "ACCEPT  < 1s on 10k rows · ATC clean" },
      { t: "ok", s: "prompt spec compiled · v3 · 0 ambiguities" },
    ],
  },
  {
    id: "03",
    code: "GEN",
    title: "Agentic Synthesis",
    alias: "Generative RICEFW Delivery",
    desc: "LLM agents draft reports, BAPIs, BADI implementations and SmartForm logic at machine speed, while I steer architecture. Vibe coding — with an enterprise-grade flight plan.",
    term: [
      { t: "code", s: "SELECT falnr, patnr, orgpf" },
      { t: "code", s: "  FROM nfal" },
      { t: "code", s: "  INTO TABLE @DATA(lt_cases)" },
      { t: "code", s: "  WHERE einri = @p_einri" },
      { t: "code", s: "    AND storn = @abap_false." },
      { t: "ok", s: "ZISH_WARD_CASES · 184 lines synthesized" },
    ],
  },
  {
    id: "04",
    code: "HIL",
    title: "Human-in-the-Loop Review",
    alias: "Cognitive Code Governance",
    desc: "Nothing merges on vibes alone. Every generated object passes my review for performance, authorization checks and IS-H edge cases — the model proposes, the engineer disposes.",
    term: [
      { t: "warn", s: "REVIEW  L42 FOR ALL ENTRIES on unguarded table" },
      { t: "code", s: "IF lt_cases IS NOT INITIAL." },
      { t: "code", s: "  SELECT ... FOR ALL ENTRIES IN lt_cases" },
      { t: "code", s: "ENDIF." },
      { t: "ok", s: "patch approved by operator · JS-01" },
    ],
  },
  {
    id: "05",
    code: "VAL",
    title: "Autonomous Validation",
    alias: "MCP Feedback Loop",
    desc: "Through a Model Context Protocol bridge, agents run syntax checks, read results and self-correct inside SAP — a closed loop from prompt to activated program.",
    term: [
      { t: "cmd", s: 'mcp> sap_check_syntax("ZISH_WARD_CASES")' },
      { t: "ok", s: "status: ok · 0 errors · 0 warnings" },
      { t: "cmd", s: "mcp> sap_save_program --activate" },
      { t: "ok", s: "program activated · SE38" },
    ],
  },
  {
    id: "06",
    code: "TRN",
    title: "Prompt-to-Transport",
    alias: "Continuous Deployment",
    desc: "Validated objects ride the transport pipeline through QAS into production, with UAT evidence and documentation generated alongside the code.",
    term: [
      { t: "cmd", s: "stms.release(DEVK9A0123) → QAS" },
      { t: "ok", s: "UAT passed · 12/12 scenarios" },
      { t: "ok", s: "docs + user guide auto-generated" },
      { t: "info", s: "PRD import scheduled · 02:00 WIB" },
    ],
  },
];

export const stats = [
  { value: 5, pad: 2, suffix: "+", label: "Years in SAP ABAP IS-H", note: "SINCE 2021" },
  { value: 8, pad: 2, suffix: "", label: "Systems engineered", note: "HEALTHCARE · AI" },
  { value: 5, pad: 2, suffix: "", label: "SAP certifications", note: "FI · HCM · CORE" },
  { value: 24, pad: 2, suffix: "/7", label: "ERP continuity engineered", note: "ZERO DOWNTIME" },
];

export const experience = [
  {
    period: "2021 — NOW",
    start: "2021",
    role: "SAP ABAP IS-H Developer",
    tag: "AI-Augmented Engineering",
    company: "Pantai Indah Kapuk Hospital",
    description:
      "Design, build and test RICEFW objects — reports, BAPIs, BADIs, SmartForms, ALV and BDC — for a live hospital SAP IS-H landscape, increasingly through an AI-native, prompt-driven workflow.",
    bullets: [
      "Pioneered an agentic ABAP workflow: context-engineered LLMs + human review",
      "Debugging & performance optimisation of high-volume IS-H programs",
      "Integration interface design between SAP and web platforms",
      "System monitoring, backups and authorisation management",
    ],
  },
  {
    period: "2020 — 2021",
    start: "2020",
    role: "Business Analyst",
    tag: "Requirements Engineering",
    company: "Mandiri Utama Finance",
    description:
      "Translated functional requirements into testable specifications, ran UAT cycles and authored system documentation and user guides for successful rollouts.",
    bullets: [
      "End-to-end UAT execution and defect triage",
      "System documentation and end-user guides",
      "Functional → technical specification translation",
    ],
  },
];

export type Project = {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  metrics: { k: string; v: string }[];
  variant:
    | "mesh"
    | "appoint"
    | "prudent"
    | "member"
    | "bridge"
    | "queue"
    | "fallback"
    | "kpi";
  flag?: string;
};

export const projects: Project[] = [
  {
    code: "MOD-00",
    title: "SAP-DEV MCP Server",
    subtitle: "Agentic ABAP toolchain",
    description:
      "A Model Context Protocol server that gives LLM agents hands inside SAP — reading programs, running syntax checks, saving and activating code, creating DDIC tables and opening transactions. Prompt-to-production as a closed feedback loop.",
    tags: ["MCP", "LLM Agents", "SAP GUI", "ABAP"],
    metrics: [
      { k: "TOOLS", v: "07" },
      { k: "LOOP", v: "AUTONOMOUS" },
    ],
    variant: "mesh",
    flag: "NEW // AI",
  },
  {
    code: "MOD-01",
    title: "Web-to-SAP Appointment & Down-Payment Bridge",
    subtitle: "Real-time booking & FI Special G/L RFCs",
    description:
      "Suite of RFC-enabled function modules (Z_NEW_APPOINTMENT, Z_CHANGE_APPOINTMENT, Z_CANCEL_APPOINTMENT) connecting the hospital's web booking portal directly to SAP IS-H outpatient scheduling (NR14 / NTMN / NAPP) while automatically posting customer down-payment FI documents via BAPI_ACC_DOCUMENT_POST (Special G/L 'A') across QRIS, E-Wallet, Visa, and MasterCard channels.",
    tags: [
      "RFC",
      "BAPI_ACC_DOCUMENT_POST",
      "SAP IS-H",
      "FI Special G/L",
      "NR14 BDC",
    ],
    metrics: [
      { k: "RFC SUITE", v: "03 MODULES" },
      { k: "FI POSTING", v: "AUTO SP-G/L" },
    ],
    variant: "appoint",
    flag: "HIGHLIGHT // RFC",
  },
  {
    code: "MOD-02",
    title: "Prudential Guarantee & Split-Billing Suite",
    subtitle: "Inpatient insurance workflow & OO-ALV",
    description:
      "End-to-end 7-program SAP IS-H & FI suite (ZRPA0218–ZRPA0225 / ZA119–ZA125) governing Prudential insurance operations: discount & clinical pathway master uploads (ZT997L/M/N), an interactive OO-ALV workbench tracking chronological inpatient top-up approvals and LMA/LML audit trails (ZT997O/P), automated split-invoice billing, and real-time guarantee analytics.",
    tags: ["OO-ALV", "SAP IS-H", "Split Invoice", "ZA119–ZA125", "ZT997L–P"],
    metrics: [
      { k: "SUITE", v: "07 PROGRAMS" },
      { k: "CUSTOM DDIC", v: "05 TABLES" },
    ],
    variant: "prudent",
    flag: "HIGHLIGHT // INSURANCE",
  },
  {
    code: "MOD-03",
    title: "Mom & Baby Loyalty & FI Coupon Ecosystem",
    subtitle: "Maternity CRM, voucher claims & F-04 clearing",
    description:
      "Full-lifecycle 6-program, 9-TCode (ZA126–ZA134), 7-table (ZT997R–ZT997X) SAP IS-H & FI platform managing maternity memberships from delivery room to financial clearing. Enrolls mothers and newborns from birth records (NGEB), dispatches digital voucher cards via HTTP REST JSON payloads (CL_HTTP_CLIENT), enforces Cashier vs. Supervisor claim/void controls, and auto-posts VBRP discount clearings via F-04.",
    tags: [
      "CL_HTTP_CLIENT",
      "FI BDC F-04",
      "SAP IS-H",
      "ZA126–ZA134",
      "ZT997R–X",
    ],
    metrics: [
      { k: "WORKFLOW", v: "09 TCODES" },
      { k: "SCHEMA", v: "07 Z-TABLES" },
    ],
    variant: "member",
    flag: "HIGHLIGHT // CRM-FI",
  },
  {
    code: "MOD-04",
    title: "SAP-EMR Integration Bridge",
    subtitle: "Full-stack data synchronisation",
    description:
      "A PHP / JavaScript / ABAP bridge synchronising patient data, case data and financial transactions between SAP IS-H and the hospital EMR.",
    tags: ["ABAP", "PHP", "JavaScript", "SAP IS-H"],
    metrics: [
      { k: "SYNC", v: "BI-DIR" },
      { k: "DOMAINS", v: "03" },
    ],
    variant: "bridge",
  },
  {
    code: "MOD-05",
    title: "Hospital Queueing System",
    subtitle: "Real-time patient flow",
    description:
      "Queue management with room displays, booking integration, wait-time estimation, WhatsApp notifications and custom SAP reporting menus.",
    tags: ["ABAP", "JavaScript", "PHP", "SQL Server"],
    metrics: [
      { k: "MODE", v: "REAL-TIME" },
      { k: "NOTIFY", v: "WHATSAPP" },
    ],
    variant: "queue",
  },
  {
    code: "MOD-06",
    title: "ERP Fallback System",
    subtitle: "High-availability operations",
    description:
      "A browser-based ERP fallback that preserves continuity and data integrity while SAP is down for maintenance windows.",
    tags: ["PHP", "JavaScript", "SQL Server"],
    metrics: [
      { k: "UPTIME", v: "24/7" },
      { k: "ROLE", v: "FAILOVER" },
    ],
    variant: "fallback",
  },
  {
    code: "MOD-07",
    title: "Compliance KPI Program",
    subtitle: "Performance tracking platform",
    description:
      "A KPI recording and tracking application that simplifies regulatory compliance reporting for hospital staff.",
    tags: ["PHP", "JavaScript", "ABAP"],
    metrics: [
      { k: "SCOPE", v: "HOSPITAL" },
      { k: "TYPE", v: "REGULATORY" },
    ],
    variant: "kpi",
  },
];

export const arsenal = [
  {
    code: "L1",
    title: "Neural Layer",
    caption: "AI-native engineering",
    items: [
      "Prompt Engineering",
      "Context Engineering",
      "Agentic Workflows",
      "LLM Orchestration",
      "MCP Tool Integration",
      "Retrieval-Augmented ABAP",
      "Human-in-the-Loop QA",
    ],
  },
  {
    code: "L2",
    title: "SAP Core",
    caption: "ERP ECC 6.0 · IS-H",
    items: [
      "SAP ABAP",
      "SAP IS-H",
      "RICEFW",
      "BAPIs & BADIs",
      "SmartForms",
      "ALV Grids",
      "BDC",
    ],
  },
  {
    code: "L3",
    title: "Integration Stack",
    caption: "Web ↔ ERP",
    items: [
      "PHP",
      "JavaScript",
      "SQL Server",
      "Interface Design",
      "ERP Systems",
      "Performance Tuning",
    ],
  },
];

export const marqueeTerms = [
  "Prompt Engineering",
  "Context Engineering",
  "Agentic Workflows",
  "RICEFW",
  "SAP IS-H",
  "LLM Orchestration",
  "Model Context Protocol",
  "Clean ABAP",
];

export const education = [
  {
    institution: "Bina Nusantara University",
    degree: "B.Sc. Computer Science / Information Systems",
    year: "2021",
  },
];

export const certifications = [
  { code: "SAP01", name: "SAP Overview", id: "550100830", issued: "JUL 2019" },
  { code: "AC010", name: "Business Processes in Financial Accounting", id: "550106654", issued: "JAN 2020" },
  { code: "THR10_1", name: "Management & Administration I in HR", id: "550106874", issued: "JAN 2020" },
  { code: "HR050", name: "Business Processes in Human Capital Mgmt", id: "550106726", issued: "JAN 2020" },
  { code: "TFIN50_1", name: "Financial Accounting I — Part 1", id: "550106801", issued: "JAN 2020" },
];

export const languages = [
  { name: "Bahasa Indonesia", level: "Native", pct: 100 },
  { name: "English", level: "Professional", pct: 85 },
];

export const socialLinks = [
  { label: "Email", href: "mailto:johansans999@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/johan-samsudin-25440620a/" },
  { label: "GitHub", href: "https://github.com/GladstoneOG" },
];

export const sections = [
  { id: "hero", label: "INIT" },
  { id: "manifesto", label: "MANIFESTO" },
  { id: "protocol", label: "PROTOCOL" },
  { id: "telemetry", label: "TELEMETRY" },
  { id: "dossier", label: "DOSSIER" },
  { id: "modules", label: "MODULES" },
  { id: "arsenal", label: "ARSENAL" },
  { id: "credentials", label: "CREDENTIALS" },
  { id: "contact", label: "CONTACT" },
];
