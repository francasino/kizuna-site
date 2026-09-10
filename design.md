
# Kizuna Global - UI/UX Design & Antigravity Implementation Specification

## 1. Design Concept & Art Direction
**Theme:** Minimalist Modern 3D ("Clean & Dynamic")
**Vibe:** Professional, ethical, futuristic yet accessible. The design must reflect resilience, innovation, and social wellbeing without feeling "overloaded."
**Color Palette:** Clean white/off-white backgrounds (`#FAFAFA`), subtle translucent glassmorphism effects, and brand accent colors (derive from existing logo/theme, keeping them muted and elegant). 
**Typography:** Modern sans-serif (e.g., Inter, Plus Jakarta Sans, or Roobert) with large, bold headlines and highly readable body text.

---

## 2. Global Animation & Interaction Rules
**Scroll-Triggered Continuous Animation (Parallax & WebGL):**
*   **The "Red Thread" (Kizuna):** Implement a continuous 3D element (e.g., a smooth, glowing translucent 3D spline or interlocking glass ribbons) that runs down the entire page. As the user scrolls, this 3D object dynamically morphs, rotates, and guides the eye through the sections.
*   **Entrance Animations:** No abrupt pop-ins. Elements should have soft, physics-based 3D entrances (e.g., floating up along the Z-axis, subtle tilts reflecting cursor position).
*   **Clean Face:** Hide heavy text behind interactive triggers (accordions, hover-to-reveal) to maintain a pristine, uncluttered visual interface.

---

## 3. Section-by-Section Antigravity / Stitch Instructions

### A. Hero Section (Introduction)
*   **Current Content:** "We foster a resilient, advanced and open society..."
*   **3D Upgrade:** 
    *   **Background:** A very subtle, slow-rotating 3D abstract mesh (e.g., frosted glass spheres or connected nodes).
    *   **Foreground:** Large, crisp typography. As the user scrolls down, the 3D mesh in the background should smoothly zoom out and transition into the "About" section's layout.
    *   **Copy Update:** "We foster a resilient, advanced, and open society. Education, mental health, equality, and ethical AI in service of well-being and responsible innovation." (Note: Retaining the 'We' perspective in all messaging).

### B. About Us
*   **Current Content:** Mission statement on social, educational, technological development.
*   **3D Upgrade:** 
    *   Replace standard text blocks with a **3D Glassmorphic Card** that tilts on scroll and cursor movement (Mouse tracking parallax). 
    *   The background 3D spline interacts with the card, weaving behind it.

### C. Focus Areas (The Core Pillars)
*   **Current Content:** Social/Educational, Business/Strategy, Health/Wellbeing, Corporate Training.
*   **3D Upgrade:** 
    *   Instead of a static grid, use a **3D Carousel or Floating Isometric Blocks**. 
    *   When scrolling into this section, four sleek 3D icons (representing each pillar) assemble themselves in the center of the screen.
    *   Hovering over a 3D icon gently expands it, blurring the others, and revealing the sub-points (e.g., Inclusive digital literacy, Ethical AI).

### D. Projects, Partnerships & 2030 Agenda (SDGs)
*   **Current Content:** Logos of partners, EU programs, and SDG goals.
*   **3D Upgrade:** 
    *   **Partnerships:** A continuous 3D cylindrical carousel of partner logos (monochrome or frosted glass) that slowly rotates horizontally.
    *   **2030 Agenda:** Floating 3D SDG cubes. As the user scrolls, the cubes cascade into view and align perfectly. Hovering over an SDG (e.g., Goal 3, 4, 5) causes the cube to spin and display Kizuna Global’s specific commitment.

### E. Team (Governance)
*   **Current Content:** Lidia Adelantado Virgili, Francisco José Casino Cembellín, David Domènech Vallvé, Esther Creus.
*   **3D Upgrade:** 
    *   Minimalist floating ID badges or 3D pedestals. As you scroll, the camera pans across the team members. 
    *   Keep it extremely clean: just the name and role in crisp typography floating next to a subtle 3D avatar or clean photo frame.

### F. Contact & Footer (Legal Framework)
*   **Current Content:** Contact form, Legal Notice, GDPR, GEP.
*   **3D Upgrade:** 
    *   **Form:** A neat, floating 3D panel with soft internal shadows (neumorphism/glassmorphism blend) for the inputs. 
    *   **Footer:** The continuous 3D spline from the top of the page elegantly terminates here, morphing into the Kizuna Global logo.

---

## 4. Antigravity Prompting Notes (Copy & Paste for AI generation)
*   *"Build a React/Three.js integrated landing page. Use GSAP ScrollTrigger for scroll-linked animations."*
*   *"Implement a clean, white minimalist aesthetic. Include a continuous 3D glass-like ribbon spanning the Y-axis."*
*   *"Ensure all copy uses the first-person plural ('We', 'Our') to reflect our organizational identity."*
*   *"Avoid cluttered layouts; use spatial depth (Z-index layering and 3D tilts) to organize information into digestible, floating glassmorphic panels."*