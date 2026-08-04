import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronLeft,
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

const Section = ({ id, eyebrow, title, children, className = "bg-white/[0.03] backdrop-blur-md border-b border-white/10" }) => (
  <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`} aria-labelledby={`${id}-title`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          {title}
        </h2>
      </motion.div>
      <div className="mt-10">{children}</div>
    </div>
  </section>
);

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="px-3.5 py-2 rounded-xl text-emerald-100/80 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold"
  >
    {children}
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

const ProjectCard = ({ title, description, link, linkText, icon: Icon, lang }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-48 h-48 sm:w-56 sm:h-56 cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-lg ring-4 ring-emerald-500/20 text-center select-none"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-emerald-300" />
          <h4 className="font-semibold text-sm sm:text-base leading-tight px-1">{title}</h4>
          <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-emerald-200/70 font-medium">
            {lang === "es" ? "Saber más" : lang === "ca" ? "Saber més" : "Learn more"}
          </span>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white to-emerald-50 text-emerald-950 shadow-lg ring-4 ring-emerald-500/20 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-xs sm:text-sm leading-snug text-emerald-900 line-clamp-4 px-2">{description}</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition"
          >
            {linkText} <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

// ───────── Main component ─────────
export default function App() {
  const [lang, setLang] = useState("es");
  const [images, setImages] = useState(fallbackImages);
  const [index, setIndex] = useState(0);
  const [logos, setLogos] = useState([]);
  
  // Estado para el banner de cookies
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const subject = formData.get("subject") || "Contacto Kizuna Global";
    const message = formData.get("message") || "";
    
    const body = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
    window.location.href = `mailto:fran.casino@kizunaglobal.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();
  const rotatePlanet = useTransform(scrollY, [0, 4000], [0, 360]);
  const rotatePlanetInverse = useTransform(scrollY, [0, 4000], [360, 0]);

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
          cookieAccept: "Aceptar cookies",
          projectsEventsMenu: "Proyectos y Eventos",
          projectsEventsTitle: "Proyectos y Eventos Actuales",
          projectsEventsLead: "Explora nuestras iniciativas en marcha y los próximos eventos. Haz clic en las tarjetas para descubrir más detalles.",
          project1Title: "Hasta Que Él Venga",
          project1Desc: "Organizamos la tercera edición de este congreso interdenominacional a nivel Nacional y Europeo",
          project1LinkText: "Visitar Web",
          project2Title: "Talleres de Salud Mental",
          project2Desc: "Sesiones psicoeducativas sobre bienestar emocional y prevención del estrés digital.",
          project2LinkText: "Más Información",
          project3Title: "Ciberresiliencia 2026",
          project3Desc: "Capacitación en uso ético de la IA y ciberseguridad para ciudadanos y empresas.",
          project3LinkText: "Ver Detalles",
          statutesTitle: "Estatutos y Misión",
          statutesText: "Consulte los estatutos de fundación de Kizuna Global y las bases reguladoras de nuestra misión institucional.",
          statutesLink: "Descargar Estatutos y Misión (PDF)"
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
          cookieAccept: "Acceptar galetes",
          projectsEventsMenu: "Projectes i Esdeveniments",
          projectsEventsTitle: "Projectes i Esdeveniments Actuals",
          projectsEventsLead: "Explora les nostres iniciatives en marxa i els propers esdeveniments. Fes clic a les targetes per descobrir més detalls.",
          project1Title: "Hasta Que Él Venga",
          project1Desc: "Organitzem la tercera edició d'aquest congrés interdenominacional a nivell Nacional i Europeu",
          project1LinkText: "Visitar Web",
          project2Title: "Tallers de Salut Mental",
          project2Desc: "Sessions psicoeducatives sobre benestar emocional i prevenció de l'estrès digital.",
          project2LinkText: "Més Informació",
          project3Title: "Ciberresiliència 2026",
          project3Desc: "Capacitació en ús ètic de la IA i ciberseguretat per a ciutadans i empreses.",
          project3LinkText: "Veure Detalls",
          statutesTitle: "Estatuts i Missió",
          statutesText: "Consulteu els estatuts de fundació de Kizuna Global i les bases reguladores de la nostra missió institucional.",
          statutesLink: "Descarregar Estatuts i Missió (PDF)"
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
          cookieAccept: "Accept cookies",
          projectsEventsMenu: "Projects & Events",
          projectsEventsTitle: "Current Projects & Events",
          projectsEventsLead: "Explore our ongoing initiatives and upcoming events. Click on the cards to discover more details.",
          project1Title: "Hasta Que Él Venga",
          project1Desc: "We organize the third edition of this interdenominational congress at National and European level",
          project1LinkText: "Visit Website",
          project2Title: "Mental Health Workshops",
          project2Desc: "Psychoeducational sessions on emotional well-being and digital stress prevention.",
          project2LinkText: "More Information",
          project3Title: "Cyber-resilience 2026",
          project3Desc: "Training in ethical AI use and cybersecurity for citizens and businesses.",
          project3LinkText: "View Details",
          statutesTitle: "Statutes & Mission",
          statutesText: "View Kizuna Global's foundational statutes and the regulatory framework of our institutional mission.",
          statutesLink: "Download Statutes & Mission (PDF)"
        },
      })[lang],
    [lang]
  );

  const menu = [
    { href: "#projects-events", label: t.projectsEventsMenu },
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
    <div className="relative min-h-screen text-white/95 selection:bg-emerald-500 selection:text-white">
      {/* Redesigned Cosmic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Near black/zinc slate theme */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-neutral-900 to-zinc-950" />
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url(${bg})` }} />
        {/* Subtle glow overlays */}
        <div className="absolute top-[25%] right-[-10%] w-[700px] h-[700px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-teal-600/5 blur-[150px] pointer-events-none" />
      </div>

      {/* Scroll-animated background planet/network nodes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          style={{ rotate: rotatePlanet }}
          className="absolute right-[-15%] top-[15%] w-[450px] h-[450px] md:w-[750px] md:h-[750px] opacity-[0.25]"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-300">
            <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="100" cy="100" rx="90" ry="25" fill="none" stroke="currentColor" strokeWidth="0.8" transform="rotate(-30 100 100)" />
            <ellipse cx="100" cy="100" rx="80" ry="15" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(15 100 100)" strokeDasharray="5 5" />
            <ellipse cx="100" cy="100" rx="65" ry="35" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(60 100 100)" />
            <g stroke="currentColor" strokeWidth="0.3">
              <line x1="100" y1="100" x2="35" y2="65" />
              <line x1="100" y1="100" x2="165" y2="100" />
              <line x1="100" y1="100" x2="80" y2="155" />
              <line x1="100" y1="100" x2="135" y2="55" />
            </g>
            <circle cx="35" cy="65" r="3" fill="currentColor" />
            <circle cx="165" cy="100" r="2" fill="currentColor" />
            <circle cx="80" cy="155" r="4" fill="currentColor" />
            <circle cx="135" cy="55" r="2.5" fill="currentColor" />
            <circle cx="65" cy="115" r="1.5" fill="currentColor" />
            <circle cx="120" cy="140" r="3.5" fill="currentColor" />
          </svg>
        </motion.div>

        <motion.div
          style={{ rotate: rotatePlanetInverse }}
          className="absolute left-[-20%] bottom-[10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] opacity-[0.18]"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-teal-300">
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <ellipse cx="100" cy="100" rx="75" ry="20" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 100 100)" />
            <ellipse cx="100" cy="100" rx="90" ry="12" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(-15 100 100)" strokeDasharray="3 3" />
            <g stroke="currentColor" strokeWidth="0.3">
              <line x1="100" y1="100" x2="50" y2="50" />
              <line x1="100" y1="100" x2="150" y2="150" />
              <line x1="100" y1="100" x2="45" y2="135" />
            </g>
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <circle cx="150" cy="150" r="3" fill="currentColor" />
            <circle cx="45" cy="135" r="2" fill="currentColor" />
          </svg>
        </motion.div>
      </div>

      {/* Floating Glass Navbar */}
      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4 select-none">
        <nav className="backdrop-blur-md bg-emerald-950/75 border border-white/10 rounded-2xl shadow-xl px-4 sm:px-6 flex items-center justify-between h-16 transition-all">
          <a href="#home" className="flex items-center gap-2 text-white">
            <span className="font-serif tracking-widest font-bold text-sm sm:text-base text-emerald-100 hover:text-white transition">KIZUNA GLOBAL</span>
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {menu.map((m) => (
              <NavLink key={m.href} href={m.href}>
                {m.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Català"
              onClick={() => setLang("ca")}
              className={`rounded-lg px-2 py-1 text-white/90 hover:bg-white/10 transition-colors ${lang === "ca" ? "bg-white/10" : ""}`}
              title="Català"
            >
              <CatalanFlag />
            </button>
            <button
              aria-label="Español"
              onClick={() => setLang("es")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 transition-colors ${lang === "es" ? "bg-white/10" : ""}`}
              title="Español"
            >
              🇪🇸
            </button>
            <button
              aria-label="English"
              onClick={() => setLang("en")}
              className={`rounded-lg px-2 py-1 hover:bg-white/10 transition-colors ${lang === "en" ? "bg-white/10" : ""}`}
              title="English"
            >
              🇬🇧
            </button>
            <a href="#join" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm text-white font-semibold shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300">
              {t.participate} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-24 sm:py-32 text-center relative select-none">
        <div className="mx-auto max-w-3xl px-4">
          <img 
            src={logo} 
            alt="Kizuna Global Logo" 
            className="mx-auto h-40 sm:h-48 w-auto mb-8 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none pointer-events-none"
          />
          <motion.h1 
            className="font-serif text-4xl sm:text-6xl font-bold leading-tight text-white tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg sm:text-xl text-emerald-200/85 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {t.heroLead}
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a href="#about" className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 shadow-md">
              {t.explore}
            </a>
            <a href="#projects-events" className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 shadow-md">
              {t.projectsEventsMenu} <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="carousel" className="relative overflow-hidden py-16 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white text-center">
        {/* Gallery Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center h-full">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-white">{t.carouselTitle}</h2>
            <p className="mt-2 text-sm sm:text-base text-emerald-200/85 max-w-2xl mx-auto">{t.carouselLead}</p>
          </div>

          {/* 3D Coverflow Container */}
          <div className="relative mt-12 w-full max-w-5xl h-[280px] sm:h-[360px] flex items-center justify-center overflow-hidden [perspective:1200px] select-none">
            {images.map((img, i) => {
              let offset = i - index;
              const N = images.length;
              if (offset > N / 2) offset -= N;
              if (offset < -N / 2) offset += N;

              const isVisible = Math.abs(offset) <= 2;
              if (!isVisible) return null;

              const rotateY = offset * -35;
              const translateZ = Math.abs(offset) * -180;
              const scale = 1 - Math.abs(offset) * 0.15;
              const opacity = 1 - Math.abs(offset) * 0.45;
              const zIndex = 10 - Math.abs(offset);
              const translateX = offset * (isMobile ? 110 : 250);

              return (
                <motion.div
                  key={i}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                  }}
                  style={{
                    zIndex: zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="absolute w-[240px] h-[160px] sm:w-[450px] sm:h-[280px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/90 bg-emerald-950 cursor-pointer"
                  onClick={() => setIndex(i)}
                >
                  <img
                    src={img}
                    alt={`kizuna-${i}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                </motion.div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition ring-1 ring-white/10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition ring-1 ring-white/10"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center gap-2 max-w-full overflow-x-auto py-2 px-4 scrollbar-none">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 transition-all duration-300 rounded-full ${
                  i === index ? "w-8 bg-emerald-400" : "w-2.5 bg-emerald-700/60 hover:bg-emerald-600"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects & Events Section */}
      <Section
        id="projects-events"
        eyebrow={{ es: "Iniciativas", ca: "Iniciatives", en: "Initiatives" }[lang]}
        title={t.projectsEventsTitle}
      >
        <p className="text-center text-emerald-200/90 max-w-2xl mx-auto -mt-2 mb-12">
          {t.projectsEventsLead}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          <ProjectCard
            title={t.project1Title}
            description={t.project1Desc}
            link="https://www.hastaqueelvenga.es/"
            linkText={t.project1LinkText}
            icon={Globe2}
            lang={lang}
          />
          <ProjectCard
            title={t.project2Title}
            description={t.project2Desc}
            link="#"
            linkText={t.project2LinkText}
            icon={HeartHandshake}
            lang={lang}
          />
          <ProjectCard
            title={t.project3Title}
            description={t.project3Desc}
            link="#"
            linkText={t.project3LinkText}
            icon={CalendarCheck}
            lang={lang}
          />
        </div>
      </Section>

      {/* About */}
      <Section id="about" eyebrow={{ es: "Introducción", ca: "Introducció", en: "Introduction" }[lang]} title={t.about}>
        <div className="rounded-3xl bg-white/5 backdrop-blur-md p-8 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-4xl mx-auto hover:border-emerald-500/20 transition-all duration-300">
          <p className="text-base sm:text-lg leading-relaxed text-emerald-100/90">{t.aboutP1}</p>
          <p className="mt-6 text-base leading-relaxed text-emerald-200/80">{t.aboutP2}</p>
          <p className="mt-6 text-base leading-relaxed text-emerald-200/80">{t.aboutP3}</p>
        </div>
      </Section>

      {/* Areas */}
      <Section id="areas" eyebrow={{ es: "Qué hacemos", ca: "Què fem", en: "What we do" }[lang]} title={t.areas}>
        <div className="grid md:grid-cols-2 gap-6">
          {areas.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, rotateX: 1.5, rotateY: -1.5, boxShadow: "0 20px 40px rgba(16,185,129,0.15)" }}
              style={{ transformStyle: "preserve-3d" }}
              className="rounded-3xl bg-white/5 backdrop-blur-md p-6 sm:p-8 border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:border-emerald-500/60 transition-all duration-300"
            >
              <div className="flex items-center gap-4 text-emerald-400">
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                  {a.icon}
                </div>
                <h3 className="font-bold text-lg text-white tracking-tight">{a.title}</h3>
              </div>
              <ul className="mt-6 space-y-3.5 text-emerald-200/85">
                {a.points.map((b, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <LogoMark className="w-4 h-4 mt-0.5 text-emerald-400/80 shrink-0" /> 
                    <span className="leading-relaxed">{b}</span>
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
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.03, border: "1px solid rgba(16,185,129,0.5)" }}
              className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.25)] flex items-center gap-4 transition-all duration-300"
            >
              <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 shrink-0">
                {p.icon}
              </div>
              <div className="font-bold text-white text-sm sm:text-base tracking-wide">{p.name}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Collaborating institutions & partners (logos) */}
      <Section
        id="collaborators"
        eyebrow={{ es: "Colaboraciones", ca: "Col·laboracions", en: "Collaborations" }[lang]}
        title={t.partnersLogosTitle}
      >
        <p className="text-emerald-200/85 max-w-3xl">
          {t.partnersLogosLead}
        </p>
        <div className="mt-8">
          {(!DRIVE_LOGOS_FOLDER_ID || !DRIVE_API_KEY) && (
            <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-4 text-sm text-amber-200">
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
              <motion.div
                key={`${l.name}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 120, damping: 15, delay: (i % 6) * 0.05 }}
                whileHover={{ scale: 1.05, border: "1px solid rgba(16,185,129,0.5)" }}
                className="group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/25 shadow-md
                           flex items-center justify-center p-5 h-24 sm:h-28 transition-all duration-300"
                title={l.name}
              >
                <img
                  src={l.url}
                  alt={l.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain
                             opacity-90 group-hover:opacity-100 transition
                             grayscale group-hover:grayscale-0 brightness-110 filter"
                />
              </motion.div>
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
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: o.n * 0.03 }}
              whileHover={{ y: -6, border: "1px solid rgba(16,185,129,0.6)" }}
              className="rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.25)] transition-all duration-300"
            >
              <div className="text-5xl font-black text-emerald-400 tracking-tight">{o.n}</div>
              <div className="mt-3 flex items-center gap-2 text-emerald-200/90 text-sm font-medium">
                <LogoMark className="w-5 h-5 text-emerald-400 shrink-0" /> {o.t}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section id="team" eyebrow={{ es: "Gobernanza", ca: "Governança", en: "Governance" }[lang]} title={t.team}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.03, border: "1px solid rgba(16,185,129,0.5)" }}
              className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex items-center gap-4 transition-all duration-300"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-base tracking-wide">{m.name}</div>
                <div className="text-emerald-300/80 text-xs sm:text-sm font-medium mt-0.5">{m.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Join / Contact */}
      <Section id="join" eyebrow={{ es: "Participa", ca: "Participa", en: "Get involved" }[lang]} title={t.join}>
        <motion.form
          onSubmit={handleContactSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl p-6 sm:p-8 max-w-xl mx-auto hover:border-emerald-500/30 transition-colors duration-300"
        >
          <h3 className="font-bold text-lg text-white mb-4 tracking-tight">
            {{ es: "Contáctanos", ca: "Contacta'ns", en: "Contact us" }[lang]}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="name"
              className="rounded-xl border border-white/20 bg-white/5 text-white placeholder-emerald-300/30 px-4 py-3 w-full outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition"
              placeholder={{ es: "Nombre", ca: "Nom", en: "Name" }[lang]}
              required
            />
            <input
              name="email"
              className="rounded-xl border border-white/20 bg-white/5 text-white placeholder-emerald-300/30 px-4 py-3 w-full outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition"
              placeholder="Email"
              type="email"
              required
            />
          </div>
          <input
            name="subject"
            className="mt-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-emerald-300/30 px-4 py-3 w-full outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition"
            placeholder={{ es: "Asunto", ca: "Assumpte", en: "Subject" }[lang]}
            required
          />
          <textarea
            name="message"
            className="mt-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder-emerald-300/30 px-4 py-3 w-full h-28 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition"
            placeholder={{ es: "Mensaje", ca: "Missatge", en: "Message" }[lang]}
            required
          />
          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300">
            {t.send} <ChevronRight className="w-4 h-4" />
          </button>
        </motion.form>
      </Section>

      {/* Legal & Transparency Texts */}
      <Section 
        id="legal-section" 
        eyebrow={t.legalEyebrow} 
        title={t.legalTitle}
        className="bg-black/20 border-t border-white/5 backdrop-blur-md"
      >
        <div className="grid gap-6 sm:grid-cols-2 mt-4 text-emerald-200/85">
          <motion.div 
            id="transparencia" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <h3 className="font-bold text-lg text-white mb-2">{t.transparency}</h3>
              <p className="text-sm leading-relaxed">{t.transparencyText}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10">
              <a href="#" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:underline">
                <Download className="w-4 h-4" /> {t.transparencyLink}
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            id="aviso-legal" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-colors duration-300"
          >
            <h3 className="font-bold text-lg text-white mb-2">{t.legalNotice}</h3>
            <p className="text-sm leading-relaxed mb-3 opacity-90">{t.legalNoticeIntro}</p>
            <ul className="text-sm space-y-1.5 font-medium">
              <li><span className="text-white/60 font-normal">{t.legalOwner}:</span> KIZUNA GLOBAL INICIATIVES SOCIALS</li>
              <li><span className="text-white/60 font-normal">{t.legalNIF}:</span> G24875486</li>
              <li><span className="text-white/60 font-normal">{t.legalRegistry}:</span> Registre d'Entitats de la Generalitat de Catalunya (№ 79454)</li>
              <li><span className="text-white/60 font-normal">{t.legalAddress}:</span> AVGDA LLUIS COMPANYS 14, LOCAL B1, 43005, TARRAGONA</li>
              <li><span className="text-white/60 font-normal">{t.legalContact}:</span> fran.casino@kizunaglobal.org</li>
            </ul>
          </motion.div>

          <motion.div 
            id="privacidad" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-colors duration-300"
          >
            <h3 className="font-bold text-lg text-white mb-2">{t.privacyPolicy}</h3>
            <p className="text-sm leading-relaxed">{t.privacyText}</p>
          </motion.div>

          <motion.div 
            id="igualdad" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <h3 className="font-bold text-lg text-white mb-2">{t.equality}</h3>
              <p className="text-sm leading-relaxed">{t.equalityText}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10">
              <a 
                href="https://drive.google.com/file/d/1-6Hiij5fECy21HnnU0P6fXu93lXu3KK_/view?usp=drive_link" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                <Download className="w-4 h-4" /> {t.equalityLink}
              </a>
            </div>
          </motion.div>

          <motion.div 
            id="estatutos-mision" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between transition-colors duration-300"
          >
            <div>
              <h3 className="font-bold text-lg text-white mb-2">{t.statutesTitle}</h3>
              <p className="text-sm leading-relaxed">{t.statutesText}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10">
              <a 
                href="https://drive.google.com/file/d/1wrj49alPG7UIiulT9knSuaLTRBqw12t-/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                <Download className="w-4 h-4" /> {t.statutesLink}
              </a>
            </div>
          </motion.div>

          <motion.div 
            id="cookies" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ border: "1px solid rgba(16,185,129,0.4)" }}
            className="rounded-2xl bg-white/5 backdrop-blur-md p-6 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-colors duration-300"
          >
            <h3 className="font-bold text-lg text-white mb-2">{t.cookiePolicy}</h3>
            <p className="text-sm leading-relaxed">{t.cookiePolicyText}</p>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/5 backdrop-blur-md pb-10 pt-8 text-emerald-300/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-white">
            <span className="font-serif tracking-[0.2em] font-semibold">KIZUNA GLOBAL</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <a href="#transparencia" className="hover:text-white hover:underline">{t.transparency}</a>
            <a href="#aviso-legal" className="hover:text-white hover:underline">{t.legalNotice}</a>
            <a href="#privacidad" className="hover:text-white hover:underline">{t.privacyPolicy}</a>
            <a href="#cookies" className="hover:text-white hover:underline">{t.cookiePolicy}</a>
          </div>

          <div className="text-sm text-center md:text-right">
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
