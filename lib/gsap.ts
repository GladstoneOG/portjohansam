"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, useGSAP);
  // Signature eases — sharp industrial "snap" and a long Apple-style glide.
  CustomEase.create("snap", "M0,0 C0.7,0 0.1,1 1,1");
  CustomEase.create("glide", "M0,0 C0.16,1 0.3,1 1,1");
  gsap.defaults({ ease: "glide", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#";

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP };
