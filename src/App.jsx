import { useEffect, useMemo, useState } from "react";
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
import bg from "./assets/bg.png";
// Import your images at the top of App.jsx (right after other imports)
import img1 from "./assets/ela1.jpeg";
import img2 from "./assets/ela2.jpeg";
import img3 from "./assets/ela3.jpeg";
import img4 from "./assets/mont1.jpeg";
import img5 from "./assets/consell1.jpg";
import img6 from "./assets/consell2.jpg";

const DRIVE_API_KEY = import.meta.env.VITE_GDRIVE_API_KEY;
const DRIVE_FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID;
const DRIVE_LOGOS_FOLDER_ID = import.meta.env.VITE_GDRIVE_LOGOS_FOLDER_ID;

const fallbackImages = [bg, logo, img1, img2, img3, img4, img5, img6]; 


// const [images, setImages] = useState(fallbackImages);
// const [index, setIndex] = useState(0);

// // Fetch Drive images once (and cache briefly to avoid hammering the API)
// useEffect(() => {
//   const cacheKey = "drive_images_cache_v1";
//   const cacheTtlMs = 10 * 60 * 1000; // 10 minutes

//   const load = async () => {
//     // If not configured, keep fallback
//     if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID) return;

//     // Try cache
//     try {
//       const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
//       if (cached?.ts && Array.isArray(cached.images) && Date.now() - cached.ts < cacheTtlMs) {
//         if (cached.images.length) {
//           setImages(cached.images);
//           setIndex(0);
//         }
//         return;
//       }
//     } catch {
//       // ignore cache errors
//     }

//     try {
//       // Drive search query: files in folder, images only, not trashed
//       const q = encodeURIComponent(
//         `'${DRIVE_FOLDER_ID}' in parents and (mimeType contains 'image/') and trashed = false`
//       );

//       // Ask only for what we need
//       const fields = encodeURIComponent("files(id,name,createdTime,mimeType)");

//       const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=createdTime desc&pageSize=100&key=${DRIVE_API_KEY}`;

//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`Drive API error ${res.status}`);
//       const data = await res.json();

//       const driveUrls = (data.files || []).map(
//         (f) => `https://drive.google.com/uc?export=view&id=${f.id}`
//       );

//       if (driveUrls.length > 0) {
//         setImages(driveUrls);
//         setIndex(0);
//         localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), images: driveUrls }));
//       } else {
//         setImages(fallbackImages);
//       }
//     } catch (e) {
//       console.warn("Drive load failed, using fallback images:", e);
//       setImages(fallbackImages);
//     }
//   };

//   load();
// }, [DRIVE_API_KEY, DRIVE_FOLDER_ID, fallbackImages]);

// // Auto-loop carousel (same behavior as before)
// useEffect(() => {
//   if (!images.length) return;
//   const interval = setInterval(() => {
//     setIndex((i) => (i + 1) % images.length);
//   }, 3500);
//   return () => clearInterval(interval);
// }, [images]);

const isVertical = (w, h) => h > w;

// ───────── Helpers ─────────
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
      background: "repeating-linear-gradient(to right, #f6c400 0 6px, #d7263d 6px 12px)",
    }}
  />
);

// ───────── Main component ─────────
export default function App() {
  const [lang, setLang] = useState("es");
  //const [index, setIndex] = useState(0);
  // const images = [bg, logo, img1, img2, img3, img4, img5, img6]
  // //const images = [bg, img1, img2, img3, img4, img5, img6]

  // // Auto-loop carousel
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((i) => (i + 1) % images.length);
  //   }, 3500);
  //   return () => clearInterval(interval);
  // }, [images.length]);

  const [images, setImages] = useState(fallbackImages);
  const [index, setIndex] = useState(0);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const cacheKey = "drive_logos_cache_v1";
    const cacheTtlMs = 60 * 60 * 1000; // 1 hour (logos change less often)

    const loadLogos = async () => {
      if (!DRIVE_API_KEY || !DRIVE_LOGOS_FOLDER_ID) return;

      // Cache
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cached?.ts && Array.isArray(cached.logos) && Date.now() - cached.ts < cacheTtlMs) {
          setLogos(cached.logos);
          return;
        }
      } catch {}

      try {
        const q = encodeURIComponent(
          `'${DRIVE_LOGOS_FOLDER_ID}' in parents and (mimeType contains 'image/') and trashed = false`
        );

        const fields = encodeURIComponent("files(id,name,createdTime,mimeType,thumbnailLink)");
        const url =
          `https://www.googleapis.com/drive/v3/files` +
          `?q=${q}` +
          `&fields=${fields}` +
          `&orderBy=name` +
          `&pageSize=200` +
          `&supportsAllDrives=true` +
          `&includeItemsFromAllDrives=true` +
          `&key=${DRIVE_API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Drive API error ${res.status}`);
        const data = await res.json();

        const items = (data.files || []).map((f) => ({
          name: f.name || "Partner logo",
          url: f.thumbnailLink
            ? f.thumbnailLink.replace(/=s\d+$/, "=s1000")
            : `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`,
        }));

        setLogos(items);
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), logos: items }));
      } catch (e) {
        console.warn("Logo load failed:", e);
        setLogos([]); // keep section, but empty grid
      }
    };

    loadLogos();
  }, []);

  // Fetch Drive images once (and cache briefly to avoid hammering the API)
  useEffect(() => {
    const cacheKey = "drive_images_cache_v1";
    const cacheTtlMs = 10 * 60 * 1000; // 10 minutes

    const load = async () => {
      // If not configured, keep fallback
      if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID) return;

      // Try cache
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cached?.ts && Array.isArray(cached.images) && Date.now() - cached.ts < cacheTtlMs) {
          if (cached.images.length) {
            setImages(cached.images);
            setIndex(0);
          }
          return;
        }
      } catch {
        // ignore cache errors
      }

      try {
        const q = encodeURIComponent(
          `'${DRIVE_FOLDER_ID}' in parents and (mimeType contains 'image/') and trashed = false`
        );

        const fields = encodeURIComponent("files(id,name,createdTime,mimeType,thumbnailLink)");
        const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=createdTime desc&pageSize=100&key=${DRIVE_API_KEY}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Drive API error ${res.status}`);
        const data = await res.json();

        const driveUrls = (data.files || []).map((f) => {
          // Prefer the API-provided thumbnailLink (usually most reliable for embedding)
          if (f.thumbnailLink) {
            // thumbnailLink often ends with something like "=s220"
            // Increase size for better quality:
            return f.thumbnailLink.replace(/=s\d+$/, "=s2000");
          }
        
          // Fallback: also works well for embedding
          return `https://drive.google.com/thumbnail?id=${f.id}&sz=w2000`;
        });

        if (driveUrls.length > 0) {
          setImages(driveUrls);
          setIndex(0);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), images: driveUrls }));
        } else {
          setImages(fallbackImages);
        }
      } catch (e) {
        console.warn("Drive load failed, using fallback images:", e);
        setImages(fallbackImages);
      }
    };

    load();
  }, []);

  // Auto-loop carousel (same behavior as before)
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);


  // Language detection
  useEffect(() => {
    const n = (navigator.language || "es").slice(0, 2);
    if (n === "en") setLang("en");
    else if (n === "ca") setLang("ca");
    else setLang("es");
  }, []);

  // ───────── Translations ─────────
  const t = useMemo(
    () =>
      ({
        es: {
          about: "Quiénes somos",
          areas: "Áreas de acción",
          eu: "Cooperación EU",
          partners: "Proyectos y Alianzas",
          ods: "Agenda 2030",
          team: "Equipo",
          join: "Súmate",
          news: "Noticias",
          participate: "Participa",
          explore: "Explorar áreas",
          collaborate: "Colabora",
          send: "Enviar",
          heroTitle: "Impulsamos una sociedad resiliente, avanzada y abierta",
          heroLead:
            "Educación, salud mental, igualdad e inteligencia artificial ética al servicio del bienestar integral y la innovación responsable.",
          carouselTitle: "Nuestra labor en imágenes",
          carouselLead: "Una muestra visual de nuestros proyectos y alianzas internacionales",
          aboutP1:
            "KIZUNA GLOBAL nace en España como asociación sin ánimo de lucro con vocación nacional e internacional. Trabajamos para el desarrollo social, educativo, tecnológico y empresarial desde una perspectiva ética, humana e inclusiva, alineada con la Agenda 2030.",
          aboutP2:
            "En un contexto de ciberamenazas crecientes, impulsamos la resiliencia, la preparación digital y el equilibrio emocional de la ciudadanía, integrando salud mental, igualdad y tecnología ética.",
          areas1: "Social, Educativa y Tecnológica",
          areas2: "Empresarial y Estratégica",
          areas3: "Salud y Bienestar Integral",
          partnersTitle: "Colaboraciones y Red Internacional",
          newsTitle: "Síguenos en redes",
          donateEyebrow: "Apoya nuestra misión",
          donateTitle: "Donaciones",
          donateText: "Tu contribución impulsa programas de educación, salud mental e IA ética.",
          ibanLabel: "IBAN (placeholder)",
          partnersLogosTitle: "Instituciones colaboradoras y alianzas",
          partnersLogosLead:
            "Las personas e instituciones que forman Kizuna Global colaboran o han colaborado con múltiples entidades del ámbito social, educativo, tecnológico y estratégico.",
        },
        ca: {
          about: "Qui som",
          areas: "Àrees d'acció",
          eu: "Cooperació UE",
          partners: "Projectes i Aliances",
          ods: "Agenda 2030",
          team: "Equip",
          join: "Uneix-t'hi",
          news: "Notícies",
          participate: "Participa",
          explore: "Explora àrees",
          collaborate: "Col·labora",
          send: "Envia",
          heroTitle: "Impulsem una societat resilient, avançada i oberta",
          heroLead:
            "Educació, salut mental, igualtat i intel·ligència artificial ètica al servei del benestar integral i la innovació responsable.",
          carouselTitle: "La nostra tasca en imatges",
          carouselLead: "Mostra visual dels nostres projectes i aliances internacionals",
          aboutP1:
            "KIZUNA GLOBAL neix a l'Estat com a associació sense ànim de lucre amb vocació nacional i internacional. Treballem pel desenvolupament social, educatiu, tecnològic i empresarial amb una perspectiva ètica, humana i inclusiva, alineada amb l'Agenda 2030.",
          aboutP2:
            "Davant l'augment d'amenaces digitals, impulsem la resiliència, la preparació digital i l'equilibri emocional de la ciutadania, integrant salut mental, igualtat i tecnologia ètica.",
          areas1: "Social, Educativa i Tecnològica",
          areas2: "Empresarial i Estratègica",
          areas3: "Salut i Benestar Integral",
          partnersTitle: "Col·laboracions i Xarxa Internacional",
          newsTitle: "Segueix-nos a les xarxes",
          donateEyebrow: "Dóna suport a la missió",
          donateTitle: "Donacions",
          donateText: "La teva aportació impulsa programes d'educació, salut mental i IA ètica.",
          ibanLabel: "IBAN (exemple)",
          partnersLogosTitle: "Institucions col·laboradores i aliances",
          partnersLogosLead:
            "Les persones i institucions que formen Kizuna Global col·laboren o han col·laborat amb múltiples entitats de l’àmbit social, educatiu, tecnològic i estratègic.",
        },
        en: {
          about: "About",
          areas: "Focus Areas",
          eu: "EU Cooperation",
          partners: "Projects & Partnerships",
          ods: "2030 Agenda",
          team: "Team",
          join: "Join",
          news: "News",
          participate: "Participate",
          explore: "Explore areas",
          collaborate: "Collaborate",
          send: "Send",
          heroTitle: "We foster a resilient, advanced and open society",
          heroLead:
            "Education, mental health, equality and ethical AI in service of well-being and responsible innovation.",
          carouselTitle: "Our work in pictures",
          carouselLead: "A visual glimpse of our projects and international partnerships",
          aboutP1:
            "KIZUNA GLOBAL is a non-profit founded in Spain with national and international scope. We drive social, educational, technological and business development with an ethical, human and inclusive approach aligned with the 2030 Agenda.",
          aboutP2:
            "Amid growing cyber-threats, we strengthen resilience, digital readiness and emotional balance, integrating mental health, equality and ethical technology.",
          areas1: "Social, Educational & Technological",
          areas2: "Business & Strategy",
          areas3: "Health & Integral Wellbeing",
          partnersTitle: "Collaborations & International Network",
          newsTitle: "Follow us on social",
          donateEyebrow: "Support our mission",
          donateTitle: "Donations",
          donateText: "Your contribution powers education, mental health and ethical-AI programmes.",
          ibanLabel: "IBAN (placeholder)",
          partnersLogosTitle: "Collaborating institutions & partners",
          partnersLogosLead:
            "Members of Kizuna Global, both personally and institutionally, collaborate or have collaborated with multiple organisations across social, educational, technological and strategic fields.",
        },
      })[lang],
    [lang]
  );

  const menu = [
    { href: "#about", label: t.about },
    { href: "#areas", label: t.areas },
    { href: "#partners", label: t.partners },
    { href: "#ods", label: t.ods },
    { href: "#team", label: t.team },
    { href: "#join", label: t.join },
    { href: "#news", label: t.news },
  ];

  const areas = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: t.areas1,
      points: [
        { es: "Alfabetización digital inclusiva e intergeneracional", ca: "Alfabetització digital inclusiva i intergeneracional", en: "Inclusive, intergenerational digital literacy" }[lang],
        { es: "Bienestar emocional y salud mental (programas psicoeducativos)", ca: "Benestar emocional i salut mental (programes psicoeducatius)", en: "Emotional wellbeing & mental health (psycho-education)" }[lang],
        { es: "IA ética y protección de datos: capacitación segura", ca: "IA ètica i protecció de dades: capacitació segura", en: "Ethical AI & data protection training" }[lang],
      ],
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: t.areas2,
      points: [
        { es: "Sinergias entre empresas, instituciones y emprendedores", ca: "Sinergies entre empreses, institucions i emprenedors", en: "Synergies among companies, institutions & entrepreneurs" }[lang],
        { es: "Reducción del absentismo laboral con estrategias integrales", ca: "Reducció de l'absentisme laboral amb estratègies integrals", en: "Reducing absenteeism with integral strategies" }[lang],
        { es: "Innovación sostenible y gestión ética de datos", ca: "Innovació sostenible i gestió ètica de dades", en: "Sustainable innovation & ethical data management" }[lang],
      ],
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: t.areas3,
      points: [
        { es: "Agencia inclusiva de viajes y eventos homologada", ca: "Agència inclusiva de viatges i esdeveniments homologada", en: "Inclusive, certified travel and events agency" }[lang],
        { es: "Resiliencia, autocuidado y prevención del estrés digital", ca: "Resiliència, autocura i prevenció de l'estrès digital", en: "Resilience, self-care & digital-stress prevention" }[lang],
        { es: "IA para apoyo emocional y detección temprana", ca: "IA per a suport emocional i detecció precoç", en: "AI for emotional support & early detection" }[lang],
      ],
    },
  ];

  const partners = [
    { name: "Erasmus+", icon: <Star className="w-6 h-6" /> },
    { name: "Horizon Europe", icon: <Globe2 className="w-6 h-6" /> },
    { name: "Next Generation EU", icon: <Handshake className="w-6 h-6" /> },
    { name: { es: "Ministerio de Derechos Sociales", ca: "Ministeri de Drets Socials", en: "Ministry of Social Rights" }[lang], icon: <Users className="w-6 h-6" /> },
    { name: "Fundación La Caixa", icon: <HeartHandshake className="w-6 h-6" /> },
    { name: "CERV Programme", icon: <Building2 className="w-6 h-6" /> },
  ];

  

  const ods = [
    { n: 3, t: { es: "Salud y bienestar", ca: "Salut i benestar", en: "Good health & wellbeing" }[lang] },
    { n: 4, t: { es: "Educación de calidad", ca: "Educació de qualitat", en: "Quality education" }[lang] },
    { n: 5, t: { es: "Igualdad de género", ca: "Igualtat de gènere", en: "Gender equality" }[lang] },
    { n: 8, t: { es: "Trabajo decente y crecimiento", ca: "Feina digna i creixement", en: "Decent work & growth" }[lang] },
    { n: 9, t: { es: "Innovación e infraestructura", ca: "Innovació i infraestructura", en: "Industry, innovation & infrastructure" }[lang] },
    { n: 10, t: { es: "Reducción de desigualdades", ca: "Reducció de desigualtats", en: "Reduced inequalities" }[lang] },
    { n: 17, t: { es: "Alianzas para los objetivos", ca: "Aliances per als objectius", en: "Partnerships for the goals" }[lang] },
  ];

  const team = [
    { role: { es: "Presidenta", ca: "Presidenta", en: "President" }[lang], name: "Lidia Adelantado Virgili" },
    { role: { es: "Vicepresidente", ca: "Vicepresident", en: "Vice President" }[lang], name: "Francisco José Casino Cembellín" },
    { role: { es: "Tesorero", ca: "Tresorer", en: "Treasurer" }[lang], name: "David Domènech Vallvé" },
    { role: { es: "Voluntaria", ca: "Voluntària", en: "Volunteer" }[lang], name: "Esther Creus" },
  ];

  // ───────── Layout ─────────
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
          <div className="flex items-center gap-2 ml-3">
            <button
              aria-label="Català"
              onClick={() => setLang("ca")}
              className={`rounded-lg px-2 py-1 text-white/90 hover:bg-white/10 ${lang === "ca" ? "bg-white/15" : ""}`}
              title="Català"
            >
              <CatalanFlag />
            </button>
            <button
              aria-label="Español"
              onClick={() => setLang("es")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 ${lang === "es" ? "bg-white/15" : ""}`}
              title="Español"
            >
              🇪🇸
            </button>
            <button
              aria-label="English"
              onClick={() => setLang("en")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 ${lang === "en" ? "bg-white/15" : ""}`}
              title="English"
            >
              🇬🇧
            </button>
            <a href="#join" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition">
              {t.participate} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero (headline only) */}
      <section id="home" className="py-24 sm:py-32 text-center relative">
        <div className="mx-auto max-w-3xl px-4 text-emerald-950">
          <img src={logo} alt="Kizuna Global" className="mx-auto h-28 w-auto mb-8" />
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight">{t.heroTitle}</h1>
          <p className="mt-4 text-lg text-emerald-900/80">{t.heroLead}</p>
        </div>
      </section>

      <section id="carousel" className="relative overflow-hidden h-[50vh] flex items-center justify-center text-center">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt="carousel"
            className="absolute inset-0 w-full h-full object-contain bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1 }}
          />
        ))}
        <div className="absolute inset-0 bg-emerald-900/40" />
        <div className="relative z-10 text-white px-4">
          <h2 className="font-serif text-3xl sm:text-4xl">{t.carouselTitle}</h2>
          <p className="mt-2 text-sm sm:text-base text-white/90">{t.carouselLead}</p>
        </div>
      </section>



      {/* About */}
      <Section id="about" eyebrow={{ es: "Introducción", ca: "Introducció", en: "Introduction" }[lang]} title={t.about}>
        <p>{t.aboutP1}</p>
        <p className="mt-4">{t.aboutP2}</p>
      </Section>

      {/* Areas */}
      <Section id="areas" eyebrow={{ es: "Qué hacemos", ca: "Què fem", en: "What we do" }[lang]} title={t.areas}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 text-emerald-800">
                {a.icon}
                <h3 className="font-semibold text-lg">{a.title}</h3>
              </div>
              <ul className="mt-4 space-y-2 text-emerald-900/85">
                {a.points.map((b, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <LogoMark className="w-4 h-4 mt-1" /> <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Partners & Projects */}
      <Section id="partners" eyebrow={t.partners} title={{ es: "Colaboraciones y Red Internacional", ca: "Col·laboracions i Xarxa Internacional", en: "Collaborations & International Network" }[lang]}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p, i) => (
            <div key={i} className="rounded-2xl bg-white/95 p-6 ring-1 ring-emerald-900/10 shadow-sm flex items-center gap-3">
              {p.icon}
              <div className="font-semibold text-emerald-900">{p.name}</div>
            </div>
          ))}
        </div>
      </Section>

            {/* Collaborating institutions & partners (logos) */}
      <Section
        id="collaborators"
        eyebrow={{ es: "Colaboraciones", ca: "Col·laboracions", en: "Collaborations" }[lang]}
        title={t.partnersLogosTitle}
      >
        <p className="text-emerald-900/80 max-w-3xl">
          {t.partnersLogosLead}
        </p>

        {/* Logo grid */}
        <div className="mt-8">
          {(!DRIVE_LOGOS_FOLDER_ID || !DRIVE_API_KEY) && (
            <div className="rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4 text-sm text-amber-900">
              { { es:"Configura VITE_GDRIVE_LOGOS_FOLDER_ID para cargar los logos desde Drive.",
                  ca:"Configura VITE_GDRIVE_LOGOS_FOLDER_ID per carregar els logos des de Drive.",
                  en:"Set VITE_GDRIVE_LOGOS_FOLDER_ID to load logos from Drive." }[lang] }
            </div>
          )}

          <div
            className="
              mt-4 grid gap-4
              [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]
              sm:[grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]
            "
          >
            {logos.map((l, i) => (
              <div
                key={`${l.name}-${i}`}
                className="group rounded-2xl bg-white/95 ring-1 ring-emerald-900/10 shadow-sm
                           flex items-center justify-center p-5 h-24 sm:h-28"
                title={l.name}
              >
                <img
                  src={l.url}
                  alt={l.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain
                             opacity-90 group-hover:opacity-100 transition
                             grayscale group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>

          {logos.length === 0 && DRIVE_LOGOS_FOLDER_ID && DRIVE_API_KEY && (
            <p className="mt-4 text-sm text-emerald-900/70">
              { { es:"No se han encontrado logos en la carpeta de Drive.",
                  ca:"No s’han trobat logos a la carpeta de Drive.",
                  en:"No logos found in the Drive folder." }[lang] }
            </p>
          )}
        </div>
      </Section>

      {/* ODS */}
      <Section id="ods" eyebrow={{ es: "Agenda 2030", ca: "Agenda 2030", en: "2030 Agenda" }[lang]} title={{ es: "Objetivos de Desarrollo Sostenible", ca: "Objectius de Desenvolupament Sostenible", en: "Sustainable Development Goals" }[lang]}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ods.map((o) => (
            <motion.div
              key={o.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/95 p-5 ring-1 ring-emerald-900/10 shadow-sm"
            >
              <div className="text-5xl font-black text-emerald-900/90">{o.n}</div>
              <div className="mt-2 flex items-center gap-2 text-emerald-900/85">
                <LogoMark className="w-5 h-5" /> {o.t}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* News / Social */}
      <Section id="news" eyebrow={{ es: "Actualidad", ca: "Actualitat", en: "Updates" }[lang]} title={t.newsTitle || { es: "Síguenos en redes", ca: "Segueix-nos a les xarxes", en: "Follow us on social" }[lang]}>
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
        <p className="mt-2 text-sm text-emerald-900/70">
          { {es:"Sustituye los enlaces por tus perfiles oficiales.", ca:"Substitueix els enllaços pels teus perfils oficials.", en:"Replace the links with your official profiles."}[lang] }
        </p>
      </Section>

      {/* Team */}
      <Section id="team" eyebrow={{ es: "Gobernanza", ca: "Governança", en: "Governance" }[lang]} title={t.team}>
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

      {/* Donations */}
      <Section id="donate" eyebrow={t.donateEyebrow} title={t.donateTitle}>
        <div className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 ring-1 ring-emerald-900/10 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-800">
            <PiggyBank className="w-6 h-6" />
            <p>{t.donateText}</p>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 items-center">
            <label className="text-sm text-emerald-900/80">{t.ibanLabel}</label>
            <code className="rounded-xl bg-white px-4 py-3 ring-1 ring-emerald-900/10 text-emerald-900 font-semibold tracking-wider">
              ES00 0000 0000 00 0000000000
            </code>
          </div>
        </div>
      </Section>

      {/* Join / Contact */}
      <Section id="join" eyebrow={{ es: "Participa", ca: "Participa", en: "Get involved" }[lang]} title={t.join}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl bg-gradient-to-br from-white to-emerald-50 p-6 ring-1 ring-emerald-900/10 shadow-sm max-w-xl mx-auto"
        >
          <h3 className="font-semibold mb-3">
            {{ es: "Contáctanos", ca: "Contacta'ns", en: "Contact us" }[lang]}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={{ es: "Nombre", ca: "Nom", en: "Name" }[lang]}
            />
            <input
              className="rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Email"
              type="email"
            />
          </div>
          <input
            className="mt-3 rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={{ es: "Asunto", ca: "Assumpte", en: "Subject" }[lang]}
          />
          <textarea
            className="mt-3 rounded-xl border border-emerald-900/20 bg-white px-4 py-3 w-full h-28 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={{ es: "Mensaje", ca: "Missatge", en: "Message" }[lang]}
          />
          <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-900 px-5 py-3 text-white hover:shadow-md transition">
            {t.send} <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </Section>

      {/* Footer */}
      <footer className="mt-10 border-t border-emerald-900/10 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-900">
            <img src={logo} alt="Kizuna" className="h-10 w-auto" />
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
