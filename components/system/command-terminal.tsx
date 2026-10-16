"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useSite } from "@/components/providers/site-provider";
import {
  arsenal,
  certifications,
  profile,
  projects,
  protocol,
  sections,
  socialLinks,
} from "@/lib/data";

type Entry = {
  id: number;
  kind: "cmd" | "out" | "accent" | "warn";
  lines: string[];
};

const QUICK_COMMANDS = [
  "help",
  "whoami",
  "vibe",
  "protocol",
  "mcp",
  "modules",
  "arsenal",
  "certs",
  "contact",
  "clear",
];

const INITIAL_HISTORY: Entry[] = [
  {
    id: 1,
    kind: "accent",
    lines: [
      "JS-01 // ABAP-VIBE-SHELL v2026.10 — CONNECTED TO SAP IS-H CONTEXT LAYER",
      "Type 'help' or click a command chip below to inspect operator telemetry.",
    ],
  },
];

export default function CommandTerminal() {
  const { terminalOpen, setTerminalOpen, scrollTo } = useSite();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Entry[]>(INITIAL_HISTORY);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(10);

  useEffect(() => {
    if (terminalOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [terminalOpen]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history, terminalOpen]);

  if (!terminalOpen) return null;

  const push = (kind: Entry["kind"], lines: string[]) => {
    idCounter.current += 1;
    setHistory((prev) => [...prev, { id: idCounter.current, kind, lines }]);
  };

  const execute = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    push("cmd", [`operator@js-01:~$ ${trimmed}`]);
    const [cmd, ...rest] = trimmed.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd) {
      case "help":
        push("out", [
          "AVAILABLE TELEMETRY COMMANDS:",
          "  whoami        Operator dossier, roles & summary",
          "  vibe          AI-Augmented ABAP / Vibe Coding architecture",
          "  protocol      6-stage Prompt-to-Transport SAP pipeline",
          "  mcp           Simulate live SAP-DEV MCP syntax & activation loop",
          "  modules       List engineered healthcare & MCP systems (MOD-00..07)",
          "  arsenal       Inspect Neural, SAP Core, and Integration stacks",
          "  certs         Verified SAP certifications & credentials",
          "  contact       Direct transmission endpoints",
          "  goto <sec>    Jump to section (hero, protocol, modules, contact...)",
          "  clear         Clear terminal scrollback",
          "  exit          Close shell [ESC]",
        ]);
        break;

      case "whoami":
        push("out", [
          `${profile.first} ${profile.last} (${profile.callsign})`,
          `STATUS   : ${profile.status}`,
          `LOCATION : ${profile.location} · ${profile.coords}`,
          `ROLES    : ${profile.roles.join(" // ")}`,
          "",
          profile.summary,
        ]);
        break;

      case "vibe":
        push("accent", [
          "PARADIGM // ENTERPRISE VIBE CODING IN SAP ABAP",
          "──────────────────────────────────────────────────────────",
          "1. CONTEXT ENGINEERING  : Ground LLMs in DDIC tables (NPAT, NFAL, NBEW) & Clean ABAP rules.",
          "2. PROMPT ARCHITECTURE  : Convert hospital tickets into deterministic intent specs.",
          "3. AGENTIC SYNTHESIS    : Orchestrate LLMs to draft RICEFW reports, BAPIs, BADIs & ALVs.",
          "4. COGNITIVE GOVERNANCE : Human-in-the-loop audit for performance, auth & IS-H edge cases.",
          "5. MCP VALIDATION LOOP  : Autonomous SE38 syntax check & program activation via MCP bridge.",
        ]);
        break;

      case "protocol":
        push(
          "out",
          protocol.map(
            (p) => `[${p.id} // ${p.code}] ${p.title} (${p.alias}) — ${p.desc}`
          )
        );
        break;

      case "mcp":
        push("accent", [
          'mcp> sap_read_program("ZISH_WARD_CASES")  ... 184 lines loaded',
          'mcp> sap_check_syntax("ZISH_WARD_CASES")  ... status: ok · 0 errors · 0 warnings',
          'mcp> sap_save_program --activate          ... ZISH_WARD_CASES activated in SE38',
          "mcp> stms.transport(DEVK9A0123)           ... READY FOR QAS IMPORT",
        ]);
        break;

      case "modules":
      case "projects":
        push(
          "out",
          projects.map(
            (m) =>
              `${m.code} · ${m.title} [${m.tags.join(", ")}] — ${m.subtitle}`
          )
        );
        break;

      case "arsenal":
      case "skills":
        push(
          "out",
          arsenal.map(
            (l) => `${l.code} // ${l.title.toUpperCase()}: ${l.items.join(" · ")}`
          )
        );
        break;

      case "certs":
        push(
          "out",
          certifications.map(
            (c) => `[${c.code}] ${c.name} — ID ${c.id} (${c.issued})`
          )
        );
        break;

      case "contact":
        push("out", [
          `EMAIL    : ${profile.email}`,
          ...socialLinks.map((s) => `${s.label.padEnd(8, " ")} : ${s.href}`),
        ]);
        break;

      case "goto": {
        const target = sections.find(
          (s) => s.id === arg || s.label.toLowerCase() === arg
        );
        if (target) {
          push("accent", [`Jumping to sector #${target.id}...`]);
          setTerminalOpen(false);
          scrollTo(`#${target.id}`);
        } else {
          push("warn", [
            `Unknown sector '${arg}'. Valid sectors: ${sections
              .map((s) => s.id)
              .join(", ")}`,
          ]);
        }
        break;
      }

      case "clear":
        setHistory([]);
        break;

      case "exit":
      case "quit":
        setTerminalOpen(false);
        break;

      default:
        push("warn", [
          `Command not recognized: '${cmd}'. Type 'help' for available commands.`,
        ]);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    execute(input);
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md"
      onClick={() => setTerminalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Operator Command Terminal"
    >
      <div
        className="w-full max-w-3xl border border-signal/50 bg-ink-2 text-paper shadow-2xl chamfer"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-paper/15 bg-ink px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 bg-signal" />
            <span className="hud text-signal">
              JS-01 // ABAP-VIBE-SHELL — INTERACTIVE CLI
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTerminalOpen(false)}
            className="hud border border-paper/20 px-2.5 py-1 text-paper/70 hover:border-signal hover:text-signal"
          >
            ESC // CLOSE
          </button>
        </div>

        {/* Quick Command Chips */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-paper/10 bg-ink/60 px-5 py-2.5">
          <span className="hud mr-2 text-paper/45">EXEC:</span>
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => execute(cmd)}
              className="hud border border-paper/15 bg-ink-2 px-2 py-1 text-[10px] text-paper/80 transition-colors hover:border-signal hover:bg-signal hover:text-ink"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Log */}
        <div
          ref={logRef}
          className="h-[340px] overflow-y-auto p-5 font-mono text-xs leading-relaxed space-y-3"
        >
          {history.map((entry) => (
            <div
              key={entry.id}
              className={clsx(
                "space-y-1",
                entry.kind === "cmd" && "text-paper font-bold",
                entry.kind === "out" && "text-paper/80",
                entry.kind === "accent" && "text-signal",
                entry.kind === "warn" && "text-alert"
              )}
            >
              {entry.lines.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap break-words">
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Command Input Prompt */}
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-3 border-t border-paper/15 bg-ink px-5 py-3.5 font-mono text-xs"
        >
          <span className="text-signal font-bold">operator@js-01:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command (e.g. vibe, protocol, mcp, modules, help)..."
            className="flex-1 bg-transparent text-paper placeholder:text-paper/35 focus:outline-none"
          />
          <button
            type="submit"
            className="hud bg-signal px-3 py-1.5 font-bold text-ink"
          >
            RUN ↵
          </button>
        </form>
      </div>
    </div>
  );
}
