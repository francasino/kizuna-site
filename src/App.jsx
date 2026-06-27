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
  Download,
  CalendarCheck
} from "lucide-react";

import logo from "./assets/kizuna-logo.png";
import bg from "./assets/bg.png";
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

const Section = ({ id, eyebrow, title, children, className = "bg-white/70" }) => (
  <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`} aria-labelledby={`${id}-title`}>
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
  const [images, setImages] = useState(fallbackImages);
  const [index, setIndex] = useState(0);
  const [logos, setLogos] = useState([]);
  
  // Estado para el banner de cookies
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const cacheKey = "drive_logos_cache_v1";
    const cacheTtlMs = 60 * 60 * 1000;

    const loadLogos = async () => {
      if (!DRIVE_API_KEY || !DRIVE_LOGOS_FOLDER_ID) return;
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
          `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=name&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${DRIVE_API_KEY}`;

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
        setLogos([]); 
      }
    };

    loadLogos();
  }, []);

  useEffect(() => {
    const cacheKey = "drive_images_cache_v1";
    const cacheTtlMs = 10 * 60 * 1000;

    const load = async () => {
      if (!DRIVE_API_KEY || !DRIVE_FOLDER_ID) return;
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cached?.ts && Array.isArray(cached.images) && Date.now() - cached.ts < cacheTtlMs) {
          if (cached.images.length) {
            setImages(cached.images);
            setIndex(0);
          }
          return;
        }
      } catch {}

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
          if (f.thumbnailLink) {
            return f.thumbnailLink.replace(/=s\d+$/, "=s2000");
          }
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
        console.warn("Drive load failed:", e);
        setImages(fallbackImages);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    const n = (navigator.language || "es").slice(0, 2);
    if (n === "en") setLang("en");
    else if (n === "ca") setLang("ca");
    else setLang("es");

    const cookiesAccepted = localStorage.getItem("kizuna_cookies_accepted");
    if (!cookiesAccepted) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("kizuna_cookies_accepted", "true");
    setShowCookieBanner(false);
  };

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
          aboutP3:
            "Estamos firmemente comprometidos con la diseminación de proyectos sociales que ayuden a concienciar sobre los problemas actuales y la aportación de diversos colectivos al bienestar de la sociedad. Por ello, contamos con una marcada voluntad formadora de personas y organizadora de eventos, con el propósito de alcanzar al máximo número posible de ciudadanos.",
          areas1: "Social, Educativa y Tecnológica",
          areas2: "Empresarial y Estratégica",
          areas3: "Salud y Bienestar Integral",
          areas4: "Formación Corporativa, Eventos y Logística",
          partnersTitle: "Colaboraciones y Red Internacional",
          newsTitle: "Síguenos en redes",
          partnersLogosTitle: "Instituciones colaboradoras y alianzas",
          partnersLogosLead:
            "Las personas e instituciones que forman Kizuna Global colaboran o han colaborado con múltiples entidades del ámbito social, educativo, tecnológico y estratégico.",
          
          // Textos legales estructurados
          legalEyebrow: "Marco normativo",
          legalTitle: "Políticas y Transparencia",
          legalNotice: "Aviso Legal",
          legalNoticeIntro: "En cumplimiento de la normativa vigente, se exponen los datos identificativos de la entidad titular de este sitio web:",
          legalOwner: "Titular de la entidad",
          legalNIF: "NIF",
          legalRegistry: "Inscripción registral",
          legalAddress: "Domicilio social",
          legalContact: "Correo de contacto",
          privacyPolicy: "Política de Privacidad (RGPD)",
          privacyText: "KIZUNA GLOBAL INICIATIVES SOCIALS es la entidad responsable de custodiar y tratar los datos personales recogidos a través de nuestros formularios o medios de contacto. Estos datos se utilizan exclusivamente para gestionar la relación con empresas, alumnado y colaboradores. Puede solicitar en cualquier momento la modificación o el borrado de sus datos escribiendo a nuestro correo de contacto.",
          equality: "Compromiso con la Igualdad y GEP",
          equalityText: "KIZUNA GLOBAL aplica de forma rigurosa criterios de no discriminación, equidad y fomento de la igualdad de oportunidades en todas sus actividades, selecciones de personal e iniciativas formativas. En alineación con las directrices de la Comisión Europea, la entidad dispone de un Plan de Igualdad de Género (Gender Equality Plan - GEP) aprobado institucionalmente.",
          equalityLink: "Descargar Gender Equality Plan (GEP) (PDF)",
          transparency: "Transparencia",
          transparencyText: "Estamos fuertemente comprometidos con la transparencia corporativa e institucional, poniendo a disposición de la administración pública y de la ciudadanía la información relativa a nuestra gestión y gobernanza.",
          transparencyLink: "Descargar Memoria de Transparencia 2026 (PDF)",
          cookiePolicy: "Política de Cookies",
          cookiePolicyText: "Esta página web utiliza cookies técnicas para permitir su correcto funcionamiento, y cookies analíticas para mejorar la experiencia de navegación. El usuario puede revocar su consentimiento o configurar su navegador para bloquearlas.",
          cookieBannerText: "Utilizamos cookies propias y de terceros para el correcto funcionamiento de la web y mejorar tu experiencia. Al pulsar 'Aceptar', consientes su uso.",
          cookieAccept: "Aceptar cookies"
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
            "KIZUNA GLOBAL neix a l'Estat com a associació sense ànim de lucre amb vocació nacional i internacional. Treballem pel desenvolupament social, educatiu, tecnològic i empresarial amb una perspectiva ètica, humana i inclusiva, aliniada amb l'Agenda 2030.",
          aboutP2:
            "Davant l'augment d'amenaces digitals, impulsem la resiliència, la preparació digital i l'equilibri emocional de la ciutadania, integrant salut mental, igualtat i tecnologia ètica.",
          aboutP3:
            "Estem fermament compromesos amb la disseminació de projectes socials que ajudin a conscienciar sobre els problemes actuals i l'aportació de diversos col·lectius al benestar de la societat. Per això, comptem amb una marcada voluntat formadora de persones i organitzadora d'esdeveniments, amb el propòsit d'arribar al màxim nombre possible de ciutadans.",
          areas1: "Social, Educativa i Tecnològica",
          areas2: "Empresarial i Estratègica",
          areas3: "Salut i Benestar Integral",
          areas4: "Formación Corporativa, Eventos y Logística",
          partnersTitle: "Col·laboracions i Xarxa Internacional",
          newsTitle: "Segueix-nos a les xarxes",
          partnersLogosTitle: "Institucions col·laboradores i aliances",
          partnersLogosLead:
            "Les persones i institucions que formen Kizuna Global col·laboren o han col·laborat amb múltiples entitats de l’àmbit social, educatiu, tecnològic i estratègic.",
          
          legalEyebrow: "Marc normatiu",
          legalTitle: "Polítiques i Transparència",
          legalNotice: "Avís Legal",
          legalNoticeIntro: "En compliment de la normativa vigent, s'exposen les dades identificatives de l'entitat titular d'aquest lloc web:",
          legalOwner: "Titular de l'entitat",
          legalNIF: "NIF",
          legalRegistry: "Inscripció registral",
          legalAddress: "Domicili social",
          legalContact: "Correu de contacte",
          privacyPolicy: "Política de Privacitat (RGPD)",
          privacyText: "KIZUNA GLOBAL INICIATIVES SOCIALS és l'entitat responsable de custodiar i tractar les dades personals recollides a través dels nostres formularis. Aquestes dades s'utilitzen exclusivament per gestionar la relació amb empreses, alumnat i col·laboradors. Pot sol·licitar la modificació o esborrament de les seves dades escrivint al nostre correu de contacte.",
          equality: "Compromís amb la Igualtat i GEP",
          equalityText: "KIZUNA GLOBAL aplica de forma rigorosa criteris de no-discriminació, equitat i foment de la igualtat d'oportunitats en totes les seves activitats, seleccions de personal i iniciatives formatives. En alineació amb les directrius de la Comissió Europea, l'entitat disposa d'un Pla d'Igualtat de Gènere (Gender Equality Plan - GEP) aprovat institucionalment.",
          equalityLink: "Descarregar Gender Equality Plan (GEP) (PDF)",
          transparency: "Transparència",
          transparencyText: "Estem fortament compromesos amb la transparència corporativa i institucional, posant a disposició de l'administració i la ciutadania la informació relativa a la nostra gestió.",
          transparencyLink: "Descarregar Memòria de Transparència 2026 (PDF)",
          cookiePolicy: "Política de Galetes",
          cookiePolicyText: "Aquesta pàgina web utilitza galetes tècniques per permetre el seu correcte funcionament. L'usuari pot configurar el seu navegador per bloquejar-les.",
          cookieBannerText: "Utilitzem galetes per garantir el funcionament de la web i millorar la teva experiència. En prémer 'Acceptar', consents el seu ús.",
          cookieAccept: "Acceptar galetes"
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
          aboutP3:
            "We are firmly committed to the dissemination of social projects that help raise awareness of current challenges and the contribution of diverse groups to the well-being of society. Consequently, we possess a strong drive toward training people and organizing events, aiming to reach as many individuals as possible.",
          areas1: "Social, Educational & Technological",
          areas2: "Business & Strategy",
          areas3: "Health & Integral Wellbeing",
          areas4: "Corporate Training, Events & Logistics",
          partnersTitle: "Collaborations & International Network",
          newsTitle: "Follow us on social",
          partnersLogosTitle: "Collaborating institutions & partners",
          partnersLogosLead:
            "Members of Kizuna Global, both personally and institutionally, collaborate or have collaborated with multiple organisations across social, educational, technological and strategic fields.",
          
          legalEyebrow: "Legal Framework",
          legalTitle: "Policies & Transparency",
          legalNotice: "Legal Notice",
          legalNoticeIntro: "In compliance with current regulations, the identifying data of the entity that owns this website are set out below:",
          legalOwner: "Entity Owner",
          legalNIF: "Tax ID (NIF)",
          legalRegistry: "Official Registration",
          legalAddress: "Registered Office",
          legalContact: "Contact Email",
          privacyPolicy: "Privacy Policy (GDPR)",
          privacyText: "KIZUNA GLOBAL INICIATIVES SOCIALS is responsible for guarding and processing the personal data collected through our forms. This data is used exclusively to manage the relationship with companies, students, and collaborators. You may request the modification or deletion of your data at any time by writing to our contact email.",
          equality: "Commitment to Equality & GEP",
          equalityText: "KIZUNA GLOBAL strictly applies non-discrimination criteria, fairness, and promotes equality of opportunities in all its activities, staff selection, and training initiatives. In alignment with the European Commission guidelines, the entity has an institutionally approved Gender Equality Plan (GEP).",
          equalityLink: "Download Gender Equality Plan (GEP) (PDF)",
          transparency: "Transparency",
          transparencyText: "We are strongly committed to corporate and institutional transparency, making information regarding our management and governance available to the public and administration.",
          transparencyLink: "Download 2026 Transparency Report (PDF)",
          cookiePolicy: "Cookie Policy",
          cookiePolicyText: "This website uses technical cookies to ensure its its proper functioning. Users can configure their browser to block them.",
          cookieBannerText: "We use cookies to ensure the website functions properly and to improve your experience. By clicking 'Accept', you consent to their use.",
          cookieAccept: "Accept cookies"
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
    { href: "#join", label: t.join }
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
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: t.areas4,
      points: [
        { es: "Organización integral de eventos, congresos y su logística asociada", ca: "Organització integral d'esdeveniments, congressos i la seva logística associada", en: "End-to-end management of events, congresses, and related logistics" }[lang],
        { es: "Formación a empresas en múltiples ámbitos, preparación de eventos y diseminación", ca: "Formació a empreses en múltiples àmbits, preparació d'esdeveniments i disseminació", en: "Corporate training in multiple fields, event preparation, and dissemination" }[lang],
        { es: "Capacitaciones en nuevas tecnologías, ciberseguridad y salud mental adaptadas a todo tipo de colectivos", ca: "Capacitacions en noves tecnologies, ciberseguretat i salut mental adaptades a tot tipus de col·lectius", en: "Training on new technologies, cybersecurity, and mental health considering all target groups" }[lang],
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
    { n: 10, t: { es: "Reducción de desigualdades", ca: "Reducció de desafiaments", en: "Reduced inequalities" }[lang] },
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

      {/* Hero */}
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
        <p className="mt-4">{t.aboutP3}</p>
      </Section>

      {/* Areas */}
      <Section id="areas" eyebrow={{ es: "Qué hacemos", ca: "Què fem", en: "What we do" }[lang]} title={t.areas}>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
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
        browser={{ es: "Colaboraciones", ca: "Col·laboracions", en: "Collaborations" }[lang]}
        title={t.partnersLogosTitle}
      >
        <p className="text-emerald-900/80 max-w-3xl">
          {t.partnersLogosLead}
        </p>
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

      {/* Legal & Transparency Texts */}
      <Section 
        id="legal-section" 
        eyebrow={t.legalEyebrow} 
        title={t.legalTitle}
        className="bg-emerald-900/10 border-t border-emerald-900/10 backdrop-blur-sm"
      >
        <div className="grid gap-8 sm:grid-cols-2 mt-4 text-emerald-900/85">
          <div id="transparencia" className="rounded-2xl bg-white/80 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t.transparency}</h3>
            <p className="text-sm leading-relaxed">{t.transparencyText}</p>
            <a href="#" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium mt-3 hover:underline">
              <Download className="w-4 h-4" /> {t.transparencyLink}
            </a>
          </div>
          
          <div id="aviso-legal" className="rounded-2xl bg-white/80 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t.legalNotice}</h3>
            <p className="text-sm leading-relaxed mb-3 opacity-90">{t.legalNoticeIntro}</p>
            <ul className="text-sm space-y-1.5 font-medium">
              <li><span className="text-emerald-900/60 font-normal">{t.legalOwner}:</span> KIZUNA GLOBAL INICIATIVES SOCIALS</li>
              <li><span className="text-emerald-900/60 font-normal">{t.legalNIF}:</span> G24875486</li>
              <li><span className="text-emerald-900/60 font-normal">{t.legalRegistry}:</span> Registre d'Entitats de la Generalitat de Catalunya (№ 79454)</li>
              <li><span className="text-emerald-900/60 font-normal">{t.legalAddress}:</span> AVGDA LLUIS COMPANYS 14, LOCAL B1, 43005, TARRAGONA</li>
              <li><span className="text-emerald-900/60 font-normal">{t.legalContact}:</span> fran.casino@gmail.com</li>
            </ul>
          </div>

          <div id="privacidad" className="rounded-2xl bg-white/80 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t.privacyPolicy}</h3>
            <p className="text-sm leading-relaxed">{t.privacyText}</p>
          </div>

          <div id="igualdad" className="rounded-2xl bg-white/80 p-6 ring-1 ring-emerald-900/10 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">{t.equality}</h3>
              <p className="text-sm leading-relaxed">{t.equalityText}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-emerald-900/5">
              <a 
                href="https://drive.google.com/file/d/1-6Hiij5fECy21HnnU0P6fXu93lXu3KK_/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
              >
                <Download className="w-4 h-4" /> {t.equalityLink}
              </a>
            </div>
          </div>

          <div id="cookies" className="sm:col-span-2 rounded-2xl bg-white/80 p-6 ring-1 ring-emerald-900/10 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t.cookiePolicy}</h3>
            <p className="text-sm leading-relaxed">{t.cookiePolicyText}</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-emerald-900/10 backdrop-blur-sm pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-emerald-900">
            <img src={logo} alt="Kizuna" className="h-10 w-auto" />
            <span className="font-serif tracking-[0.2em]">KIZUNA GLOBAL</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-emerald-900/80 font-medium">
            <a href="#transparencia" className="hover:text-emerald-900 hover:underline">{t.transparency}</a>
            <a href="#aviso-legal" className="hover:text-emerald-900 hover:underline">{t.legalNotice}</a>
            <a href="#privacidad" className="hover:text-emerald-900 hover:underline">{t.privacyPolicy}</a>
            <a href="#cookies" className="hover:text-emerald-900 hover:underline">{t.cookiePolicy}</a>
          </div>

          <div className="text-sm text-emerald-900/70 text-center md:text-right">
            © {new Date().getFullYear()} Kizuna Global — Asociación sin ánimo de lucro.
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-emerald-950 text-white p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-90 max-w-3xl">
            {t.cookieBannerText}
          </p>
          <button 
            onClick={handleAcceptCookies}
            className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-emerald-950 font-medium hover:bg-emerald-50 transition"
          >
            {t.cookieAccept}
          </button>
        </div>
      )}

      <style>{`html{scroll-behavior:smooth}`}</style>
    </div>
  );
}
