import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Building2,
  Users,
  Globe2,
  Handshake,
  Star,
  Newspaper,
  PiggyBank,
} from "lucide-react";

import logo from "./assets/kizuna-logo.png";
import bg from "./assets/bg.png"; // background & carousel placeholder

// Small reusable pieces
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

const Section = ({ id, eyebrow, title, children }) => (
  <section id={id} className="scroll-mt-24 py-16 sm:py-24 bg-white/70" aria-labelledby={`${id}-title`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-widest text-emerald-700/80">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-3xl sm:text-4xl font-semibold text-emerald-950">
          {title}
        </h2>
      </motion.div>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

const NavLink = ({ href, children }) => (
  <a href={href} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-50/95 hover:text-white hover:bg-emerald-900/20 transition-colors">
    <LogoMark className="w-4 h-4" />
    <span className="text-sm font-medium">{children}</span>
  </a>
);

// Main app
export default function App() {
  const [index, setIndex] = useState(0);
  const images = [bg, logo]; // carousel placeholders

  // auto-loop carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  // Language stub (you can expand later)
  const t = {
    about: "Quiénes somos",
    areas: "Áreas de acción",
    eu: "Cooperación EU",
    ods: "Agenda 2030",
    team: "Equipo",
    join: "Súmate",
    news: "Noticias",
    partners: "Proyectos y Alianzas",
    participate: "Participa",
    explore: "Explorar áreas",
    collaborate: "Colabora",
    send: "Enviar",
  };

  const menu = [
    { href: "#about", label: t.about },
    { href: "#areas", label: t.areas },
    { href: "#eu", label: t.eu },
    { href: "#partners", label: t.partners },
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
    <div className="relative min-h-screen text-emerald-950">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 bg-emerald-50/80" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-emerald-900/85 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-3 text-white">
            <img src={logo} alt="Kizuna Global" className="h-10 sm:h-12 w-auto" />
            <span className="font-serif tracking-[0.25em] hidden sm:block">KIZUNA GLOBAL</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {menu.map((m) => (
              <NavLink key={m.href} href={m.href}>
                {m.label}
              </NavLink>
            ))}
          </div>
          <a href="#join" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition">
            {t.participate} <ChevronRight className="w-4 h-4" />
          </a>
        </nav>
      </header>

      {/* Hero Carousel */}
      <section id="home" className="relative overflow-hidden h-[70vh] flex items-center justify-center text-center">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt="carousel"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        <div className="absolute inset-0 bg-emerald-900/50" />
        <div className="relative z-10 text-white px-4">
          <img src={logo} alt="Kizuna Global" className="mx-auto h-28 w-auto mb-6 drop-shadow-lg" />
          <h1 className="font-serif text-4xl sm:text-5xl max-w-3xl mx-auto leading-tight">
            Impulsamos una sociedad resiliente, avanzada y abierta
          </h1>
        </div>
      </section>

      {/* About */}
      <Section id="about" eyebrow="Introducción" title="Quiénes somos">
        <p>
          KIZUNA GLOBAL nace en España como asociación sin ánimo de lucro con vocación nacional e internacional. Trabajamos por el desarrollo social, educativo, tecnológico y empresarial desde una perspectiva ética, humana e inclusiva, alineada con la Agenda 2030.
        </p>
      </Section>

      {/* Areas */}
      <Section id="areas" eyebrow="Qué hacemos" title="Áreas de acción">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <GraduationCap className="w-6 h-6 text-emerald-700 mb-2" />
            <h3 className="font-semibold mb-2">Social, Educativa y Tecnológica</h3>
            <ul className="text-emerald-900/80 text-sm space-y-1">
              <li>Alfabetización digital e inclusión</li>
              <li>Bienestar emocional y salud mental</li>
              <li>IA ética y formación en ciberseguridad</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <Building2 className="w-6 h-6 text-emerald-700 mb-2" />
            <h3 className="font-semibold mb-2">Empresarial y Estratégica</h3>
            <ul className="text-emerald-900/80 text-sm space-y-1">
              <li>Innovación sostenible</li>
              <li>Reducción del absentismo laboral</li>
              <li>Emprendimiento femenino</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <HeartHandshake className="w-6 h-6 text-emerald-700 mb-2" />
            <h3 className="font-semibold mb-2">Salud y Bienestar Integral</h3>
            <ul className="text-emerald-900/80 text-sm space-y-1">
              <li>Centros de bienestar homologados</li>
              <li>Resiliencia y autocuidado</li>
              <li>IA para apoyo emocional</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Partners & Projects */}
      <Section id="partners" eyebrow="Proyectos y Alianzas" title="Colaboraciones y Red Internacional">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Erasmus+", icon: <Star className="w-6 h-6" /> },
            { name: "Horizon Europe", icon: <Globe2 className="w-6 h-6" /> },
            { name: "Next Generation EU", icon: <Handshake className="w-6 h-6" /> },
            { name: "Ministerio de Derechos Sociales", icon: <Users className="w-6 h-6" /> },
            { name: "Fundación La Caixa", icon: <HeartHandshake className="w-6 h-6" /> },
            { name: "CERV Programme", icon: <Building2 className="w-6 h-6" /> },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm flex items-center gap-3">
              {p.icon}
              <div className="font-semibold text-emerald-900">{p.name}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Social Media */}
      <Section id="news" eyebrow="Actualidad" title="Síguenos en redes">
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-900/15 hover:bg-emerald-50 transition">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
            LinkedIn
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-900/15 hover:bg-emerald-50 transition">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
            Instagram
          </a>
        </div>
      </Section>

      {/* Team */}
      <Section id="team" eyebrow="Gobernanza" title="Junta Directiva">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div key={i} className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-emerald-900/70">{m.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Donate + Footer */}
      <Section id="donate" eyebrow="Apoya nuestra misión" title="Donaciones">
        <div className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 ring-1 ring-emerald-900/10 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-800">
            <PiggyBank className="w-6 h-6" />
            <p>Tu contribución impulsa programas de educación, salud mental e IA ética.</p>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 items-center">
            <label className="text-sm text-emerald-900/80">IBAN (placeholder)</label>
            <code className="rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-900/10 text-emerald-900 font-semibold tracking-wider">
              ES00 0000 0000 00 0000000000
            </code>
          </div>
        </div>
      </Section>

      <footer className="mt-10 border-t border-emerald-900/10 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-900">
            <img src={logo} alt="Kizuna" className="h-10 w-auto" />
            <span className="font-serif tracking-[0.2em]">KIZUNA GLOBAL</span>
          </div>
          <div className="text-sm text-emerald-900/70">© {new Date().getFullYear()} Kizuna Global — Asociación sin ánimo de lucro.</div>
        </div>
      </footer>

      <style>{`html{scroll-behavior:smooth}`}</style>
    </div>
  );
}
