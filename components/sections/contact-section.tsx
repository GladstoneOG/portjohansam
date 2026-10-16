"use client";

import { useState } from "react";
import { useSite } from "@/components/providers/site-provider";
import { profile, socialLinks } from "@/lib/data";
import {
  Barcode,
  Magnetic,
  Scramble,
  SectionLabel,
} from "@/components/ui/primitives";

export default function ContactSection() {
  const { scrollTo, setTerminalOpen } = useSite();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t-4 border-signal bg-ink pt-24 pb-28 text-paper gutter"
    >
      {/* Background decorative grid watermark */}
      <div
        className="pointer-events-none select-none absolute -bottom-10 right-4 font-cond font-display text-[24vw] font-black leading-none text-paper/[0.03]"
        aria-hidden
      >
        JS//01
      </div>

      <SectionLabel
        index="09"
        label="INITIATE TRANSMISSION"
        meta="DIRECT UPLINK // OPEN FOR DEPLOYMENT"
      />

      <div className="relative z-10 mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="hud mb-4 inline-flex items-center gap-2 border border-signal/40 bg-signal/10 px-3 py-1.5 text-signal">
            <span className="h-2 w-2 bg-signal blink" />
            <span>STATUS: {profile.status}</span>
          </div>

          <h2 className="font-cond font-display text-[13vw] font-black uppercase leading-[0.83] tracking-tightest sm:text-[9.5vw] lg:text-[7.5vw]">
            DEPLOY AN <span className="text-signal">AI-NATIVE</span> <br />
            ABAP ARCHITECT.
          </h2>
        </div>

        <div className="space-y-4 border border-paper/15 bg-ink-2 p-6 lg:col-span-4 brackets">
          <div className="hud text-signal">TRANSMISSION BRIEF</div>
          <p className="text-xs leading-relaxed text-paper/75 md:text-sm">
            Available for SAP IS-H healthcare engineering, RICEFW &amp; BAPI
            architecture, ERP-to-Web bridges, and AI/MCP-augmented ABAP
            workflows.
          </p>
          <div className="hud flex items-center justify-between border-t border-paper/10 pt-3 text-paper/50">
            <span>BASE: {profile.location}</span>
            <span>{profile.coords}</span>
          </div>
        </div>
      </div>

      {/* Primary Action Strip: Direct Mailto + One-Click Clipboard + Interactive Shell */}
      <div className="relative z-10 mt-12 flex flex-wrap items-center gap-4">
        <Magnetic strength={0.2}>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="EMAIL"
            className="inline-flex items-center gap-4 bg-signal px-7 py-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform hover:scale-[1.02] md:text-sm chamfer-sm"
          >
            <span>{profile.email}</span>
            <span>↗</span>
          </a>
        </Magnetic>

        <Magnetic strength={0.2}>
          <button
            type="button"
            onClick={copyEmail}
            data-cursor="COPY"
            className="hud border border-paper/25 bg-ink-2 px-6 py-5 text-xs text-paper transition-colors hover:border-signal hover:text-signal"
          >
            {copied ? "✓ COPIED TO CLIPBOARD" : "COPY ADDRESS [CLIPBOARD]"}
          </button>
        </Magnetic>

        <Magnetic strength={0.2}>
          <button
            type="button"
            onClick={() => setTerminalOpen(true)}
            data-cursor="CLI"
            className="hud border border-signal/40 bg-signal/10 px-6 py-5 text-xs text-signal transition-colors hover:bg-signal hover:text-ink"
          >
            OPEN OPERATOR SHELL [~]
          </button>
        </Magnetic>
      </div>

      {/* Social Links & Back-to-Top Footer */}
      <div className="relative z-10 mt-20 flex flex-col items-start justify-between gap-8 border-t border-paper/15 pt-8 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-6">
          {socialLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              data-cursor={link.label.toUpperCase()}
              className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-paper/75 transition-colors hover:text-signal"
            >
              <span className="text-[10px] text-paper/35">0{idx + 1}</span>
              <Scramble text={link.label} />
              <span className="text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ))}
        </div>

        <div className="flex w-full items-center justify-between gap-6 md:w-auto">
          <div className="flex items-center gap-4">
            <Barcode
              value="JOHAN-SAMSUDIN-2026"
              className="h-5 w-28 text-paper/40"
            />
            <span className="hud text-paper/45">
              © {new Date().getFullYear()} {profile.first} {profile.last}
            </span>
          </div>

          <button
            type="button"
            onClick={() => scrollTo(0)}
            data-cursor="TOP"
            className="hud border border-paper/20 bg-ink-2 px-4 py-2.5 text-paper transition-colors hover:border-signal hover:bg-signal hover:text-ink"
          >
            RETURN TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
