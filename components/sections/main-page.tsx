"use client";

import Preloader from "@/components/system/preloader";
import Cursor from "@/components/system/cursor";
import HudChrome from "@/components/system/hud-chrome";
import CommandTerminal from "@/components/system/command-terminal";
import HeroSection from "@/components/sections/hero-section";
import ManifestoSection from "@/components/sections/manifesto-section";
import ProtocolSection from "@/components/sections/protocol-section";
import TelemetrySection from "@/components/sections/telemetry-section";
import DossierSection from "@/components/sections/dossier-section";
import ModulesSection from "@/components/sections/modules-section";
import ArsenalSection from "@/components/sections/arsenal-section";
import CredentialsSection from "@/components/sections/credentials-section";
import ContactSection from "@/components/sections/contact-section";

export default function MainPage() {
  return (
    <>
      <Preloader />
      <Cursor />
      <HudChrome />
      <CommandTerminal />
      <main className="relative overflow-x-clip">
        <HeroSection />
        <ManifestoSection />
        <ProtocolSection />
        <TelemetrySection />
        <DossierSection />
        <ModulesSection />
        <ArsenalSection />
        <CredentialsSection />
        <ContactSection />
      </main>
    </>
  );
}
