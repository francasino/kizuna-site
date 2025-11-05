import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  BrainCircuit,
  Building2,
  Users,
  Handshake,
  Globe2,
  Star,
  Newspaper,
  PiggyBank,
} from "lucide-react";

// --- If you want to use your uploaded logo file instead of inline base64 ---
// import logo from "./assets/kizuna-logo.png";

// For this standalone version, a base64 placeholder is fine; replace with import above if desired.
const LOGO_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArwAAAK8CAIAAACC2PsUAAEAAElEQVR42oydW5YkOQ5jCd//mg31YRIJkLTImjnT012VGeFuD0..."; // truncated for brevity

// --- Reusable mini logo mark ---
const LogoMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
    <path
      d="M50 20c10 10 15 20 15 30s-5 20-15 30c-10-10-15-20-15-30s5-20 15-30zm0 0c8 6 17 10 30 10-6 10-12 14-20 18m-20-28c-8 6-17 10-30 10 6 10 12 14 20 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Simple section wrapper ---
const Section = ({ id, eyebrow, title, children }) => (
  <section
    id={id}
    className="scroll-mt-24 py-16 sm:py-24 bg-white/60"
    aria-labelledby={`${id}-title`}
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-widest text-emerald-700/80">{eyebrow}</p>
        <h2
          id={`${id}-title`}
          className="mt-2 text-3xl sm:text-4xl font-semibold text-emerald-950"
        >
          {title}
        </h2>
      </motion.div>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-white px-3 py-1 text-sm text-emerald-900 shadow-sm">
    <LogoMark className="w-4 h-4" /> {children}
  </span>
);

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-50/95 hover:text-white hover:bg-emerald-900/20 transition-colors"
  >
    <LogoMark className="w-4 h-4" />
    <span className="text-sm font-medium">{children}</span>
  </a>
);

const CatalanFlag = () => (
  <span
    aria-label="Catalan"
    title="Català"
    className="inline-block w-5 h-3 rounded-sm shadow ring-1 ring-black/10"
    style={{
      background:
        "repeating-linear-gradient(to right, #f6c400 0 6px, #d7263d 6px 12px)",
    }}
  />
);

export default function App() {
  const [lang, setLang] = useState("es");

  // Detect browser language once
  useEffect(() => {
    const n = (navigator.language || "es").slice(0, 2);
    if (n === "en") setLang("en");
    else if (n === "ca") setLang("ca");
    else setLang("es");
  }, []);

  // --- Translation dictionary (simplified to key sections) ---
  const t = useMemo(
    () => ({
      es: {
        about: "Quiénes somos",
        areas: "Áreas de acción",
        eu: "Cooperación EU",
        ods: "Agenda 2030",
        team: "Equipo",
        join: "Súmate",
        news: "Noticias",
        participate: "Participa",
        explore: "Explorar áreas",
        collaborate: "Colabora",
        send: "Enviar",
      },
      ca: {
        about: "Qui som",
        areas: "Àrees d'acció",
        eu: "Cooperació UE",
        ods: "Agenda 2030",
        team: "Equip",
        join: "Uneix-t'hi",
        news: "Notícies",
        participate: "Participa",
        explore: "Explora àrees",
        collaborate: "Col·labora",
        send: "Envia",
      },
      en: {
        about: "About",
        areas: "Areas",
        eu: "EU Cooperation",
        ods: "2030 Agenda",
        team: "Team",
        join: "Join",
        news: "News",
        participate: "Participate",
        explore: "Explore areas",
        collaborate: "Collaborate",
        send: "Send",
      },
    })[lang],
    [lang]
  );

  const menu = [
    { href: "#about", label: t.about },
    { href: "#areas", label: t.areas },
    { href: "#eu", label: t.eu },
    { href: "#ods", label: t.ods },
    { href: "#team", label: t.team },
    { href: "#join", label: t.join },
    { href: "#news", label: t.news },
  ];

  const team = [
    { role: "Presidenta", name: "Lidia Adelantado Virgili" },
    { role: "Vicepresidente", name: "Francisco José Casino Cembellín" },
    { role: "Tesorero", name: "David Domènech Vallvé" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-emerald-950 relative">
      {/* ---- Fixed background image ---- */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />

      {/* ---- Navbar ---- */}
      <header className="sticky top-0 z-50 backdrop-blur bg-emerald-900/80 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-3 text-white">
            <img src={LOGO_SRC} alt="Kizuna Global" className="h-7 w-auto" />
            <span className="font-serif tracking-[0.25em] hidden sm:block">
              KIZUNA GLOBAL
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {menu.map((m) => (
              <NavLink key={m.href} href={m.href}>
                {m.label}
              </NavLink>
            ))}
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-2 ml-3">
            <button
              aria-label="Català"
              onClick={() => setLang("ca")}
              className={`rounded-lg px-2 py-1 text-white/90 hover:bg-white/10 ${
                lang === "ca" ? "bg-white/15" : ""
              }`}
            >
              <CatalanFlag />
            </button>
            <button
              aria-label="Español"
              onClick={() => setLang("es")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 ${
                lang === "es" ? "bg-white/15" : ""
              }`}
            >
              🇪🇸
            </button>
            <button
              aria-label="English"
              onClick={() => setLang("en")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 ${
                lang === "en" ? "bg-white/15" : ""
              }`}
            >
              🇬🇧
            </button>
            <a
              href="#join"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition"
            >
              {t.participate} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* ---- Hero ---- */}
      <section id="home" className="py-24 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl px-4"
        >
          <img
            src={LOGO_SRC}
            alt="Kizuna Global Logo"
            className="mx-auto h-24 w-auto mb-8"
          />
          <h1 className="font-serif text-4xl sm:text-5xl text-emerald-950 leading-tight">
            Impulsamos una sociedad resiliente, avanzada y abierta
          </h1>
          <p className="mt-4 text-lg text-emerald-900/80">
            Educación, salud mental, igualdad e inteligencia artificial ética al
            servicio del bienestar integral y la innovación responsable.
          </p>
          <div className="mt-6 flex justify-center flex-wrap gap-3">
            <a
              href="#areas"
              className="rounded-2xl bg-emerald-900 text-white px-5 py-3 shadow hover:shadow-md transition"
            >
              {t.explore}
            </a>
            <a
              href="#join"
              className="rounded-2xl bg-white text-emerald-900 ring-1 ring-emerald-900/15 px-5 py-3 hover:bg-emerald-50 transition"
            >
              {t.collaborate}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ---- Example sections (trimmed for brevity) ---- */}
      <Section id="about" eyebrow="Introducción" title="Quiénes somos">
        <p>
          KIZUNA GLOBAL nace en España como asociación sin ánimo de lucro con
          vocación nacional e internacional. Trabajamos para el desarrollo
          social, educativo, tecnológico y empresarial desde una perspectiva
          ética, humana e inclusiva.
        </p>
      </Section>

      <Section id="team" eyebrow="Gobernanza" title="Junta Directiva">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 ring-1 ring-emerald-900/10 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-emerald-900/70">{m.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="news" eyebrow="Actualidad" title="Noticias y redes">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-emerald-900/10 shadow-sm">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Newspaper className="w-5 h-5" /> Síguenos
          </h3>
          <div className="flex gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl ring-1 ring-emerald-900/15 px-4 py-3 hover:bg-emerald-50 transition"
            >
              <img
                alt="LinkedIn"
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                className="w-5 h-5"
              />
              LinkedIn
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl ring-1 ring-emerald-900/15 px-4 py-3 hover:bg-emerald-50 transition"
            >
              <img
                alt="Instagram"
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                className="w-5 h-5"
              />
              Instagram
            </a>
          </div>
        </div>
      </Section>

      <Section id="donate" eyebrow="Apoya nuestra misión" title="Donaciones">
        <div className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 ring-1 ring-emerald-900/10 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-800">
            <PiggyBank className="w-6 h-6" />
            <p>
              Tu contribución impulsa programas de educación, salud mental e IA
              ética.
            </p>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 items-center">
            <label className="text-sm text-emerald-900/80">IBAN (placeholder)</label>
            <code className="rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-900/10 text-emerald-900 font-semibold tracking-wider">
              ES00 0000 0000 00 0000000000
            </code>
          </div>
        </div>
      </Section>

      <Section id="join" eyebrow="Participa" title="Súmate">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 ring-1 ring-emerald-900/10 shadow-sm max-w-xl mx-auto"
        >
          <h3 className="font-semibold mb-3">Contáctanos</h3>
          <input
            className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Nombre"
          />
          <input
            className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Email"
            type="email"
          />
          <textarea
            className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full mb-3 h-28 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Mensaje"
          />
          <button className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 text-white hover:shadow-md transition">
            {t.send} <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </Section>

      {/* ---- Footer ---- */}
      <footer className="mt-10 border-t border-emerald-900/10 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-900">
            <img src={LOGO_SRC} alt="Kizuna" className="h-6 w-auto" />
            <span className="font-serif tracking-[0.2em]">KIZUNA GLOBAL</span>
          </div>
          <div className="text-sm text-emerald-900/70">
            © {new Date().getFullYear()} Kizuna Global — Asociación sin ánimo de lucro.
          </div>
        </div>
      </footer>

      <style>{`html{scroll-behavior:smooth}`}</style>
    </div>
  );
}
