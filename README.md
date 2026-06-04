# Artifact Engine v2.0.45: Technical Specification

A high-performance, **[[Zero-Trust Security]]** landing page architecture engineered for the low-latency delivery of cinematic digital artifacts. This project serves as a production-grade demonstration of **[[Asset Sovereignty]]**, **[[AppSec]]** hardening, and **[[Web Performance]]** optimization.

<div align="left">
  <img src="https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Netlify-Edge-00AD9F?style=for-the-badge&logo=netlify&logoColor=white" />
</div>

---

## 🏗️ 1. Core System Architecture

The engine is architected as a **[[Single Page Application]] (SPA)** built on **[[React]] 19** and bundled via **[[Vite]]**. The architecture prioritizes a minimal main-thread footprint and aggressive asset optimization.

### **Building & Tooling**
*   **[[Vite]] (v8.0.12):** Utilized as the build engine for its native [[ESM]]-based Hot Module Replacement (HMR) and multi-stage Rollup-based bundling.
*   **[[TypeScript]] (v6.0.2):** Enforces strict type-safety across all components, specifically for the Terminal's command-routing logic and animation variants.
*   **[[ESLint]] (v10.3.0):** Integrated with `typescript-eslint` to enforce code quality and prevent memory leaks in custom hooks.

---

## 🎨 2. Creative Engineering & Motion

The visual layer fuses high-end cinematography with hardware-accelerated UI interactions.

### **Animation Layer: [[Framer Motion]] (v12.40.0)**
*   **Declarative Motion:** Implements `AnimatePresence` for lifecycle-managed transitions in the Terminal modal.
*   **Scroll-Linked Typo:** The `AnimatedTextReveal` component uses `useScroll` and `useTransform` to map scroll progress directly to character opacity, creating a cinematic reading experience.
*   **Performance:** All animations are offloaded to the GPU using CSS `transform` and `opacity` properties to prevent layout shifts.

### **Styling Layer: [[Tailwind CSS]] (v3.4.19)**
*   **Custom Design System:** Configured via `tailwind.config.js` to implement a zero-saturation palette (`#E1E0CC`, `#212121`).
*   **Atmospheric Overlays:** Implements a custom **Noise Grain Overlay** using a low-opacity fixed-position background and a `mix-blend-overlay` filter to unify video and UI elements.

---

## 🛡️ 3. Security & AppSec Hardening

Adhering to a **[[Zero-Trust Security]]** model, the project implements multi-layered protection against common web vulnerabilities.

### **Pillar 4: Input Sanitization & XSS Prevention**
The `Terminal.tsx` component handles user input through an aggressive, whitelist-only regex filter:
```typescript
const sanitizedInput = input.trim().slice(0, 100).replace(/[^\w\s\.\-]/gi, '');
```
This sanitization occurs before state updates, neutralizing **Reflected XSS** and injection attempts.

### **Pillar 5: PII Obfuscation & Anti-Scraping**
*   **[[Base64]] Encoding:** Sensitive contact identifiers are stored as encoded strings in `.env` variables.
*   **Secure Decoding:** The `utils/security.ts` module decodes identifiers only upon user interaction (e.g., `sudo connect`), preventing automated bots from harvesting emails from the DOM.

### **Pillar 6: Production Security Headers**
Configured via `[[netlify.toml]]`, the edge network enforces:
*   **[[CSP]] (Content Security Policy):** Restricts `script-src` and `object-src` to `'self'`, mitigating data exfiltration.
*   **[[HSTS]]:** Mandatory HTTPS for one year.
*   **X-Frame-Options:** Set to `DENY` to prevent UI Redressing (Clickjacking).
*   **X-Content-Type-Options:** `nosniff` prevents MIME-type sniffing.

---

## ⚡ 4. [[Cinematic Performance Optimization]]

To deliver a high-end visual experience without the typical 40MB+ payload of video-heavy sites, a custom optimization pipeline was established.

### **[[Asset Sovereignty]] & Media Pipeline**
*   **[[FFmpeg]] Optimization:** All MP4 artifacts undergo a multi-pass compression:
    *   **Codec:** `libx264` with **CRF 24-28**.
    - **Audio Striping:** `-an` flag removes audio tracks to reduce byte size for background loops.
*   **LCP Buffer Strategy:** Each video element utilizes a high-resolution `poster` frame (WebP/JPG) and the `playsinline` attribute to ensure the Largest Contentful Paint (LCP) triggers sub-1.2s.
*   **Localized Hosting:** Assets are served from the same [[Netlify]] Edge nodes as the code, eliminating third-party DNS lookups and TLS handshakes.

---

## 🚀 5. Deployment & CI/CD

*   **Platform:** [[Netlify]] Edge Network.
*   **Workflow:** Git-driven Continuous Integration.
*   **Build Script:** `npm run build` (executes `tsc -b && vite build`).
*   **Redirection:** Implements a single-page redirect rule (`/* /index.html 200`) to handle client-side routing on the edge.

---

## 💻 6. Local Development

### **Environmental Setup**
The engine requires the following environment variables (defined in `.env`):
```text
VITE_HERO_VIDEO_URL=/hero-video.mp4
VITE_FEATURE_1_ICON=/feature-1.webp
VITE_FEATURE_2_ICON=/feature-2.webp
VITE_FEATURE_3_ICON=/feature-3.webp
VITE_CONTACT_EMAIL_B64=base64_encoded_string
```

### **Execution Commands**
```bash
npm install        # Dependency Ingestion
npm run dev        # Hot Module Replacement Environment
npm run build      # Production Chunk Generation
```

---
*Status: [[STATUS]] | Evolution: [[PROGRESS]] | Design: [[DECISIONS]]*

