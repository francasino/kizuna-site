import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Building2,
  Plane,
  Clock,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  Mail,
  Send,
  Globe2,
  Compass,
  Instagram,
  Linkedin
} from "lucide-react";

import placeholder1 from "../assets/placeholders/events/placeholder-event-1.png";
import placeholder2 from "../assets/placeholders/events/placeholder-event-2.png";
import placeholder3 from "../assets/placeholders/events/placeholder-event-3.png";
import placeholder4 from "../assets/placeholders/events/placeholder-event-4.png";
import placeholder5 from "../assets/placeholders/events/placeholder-event-5.png";
import placeholder6 from "../assets/placeholders/events/placeholder-event-6.png";
import placeholderLogo from "../assets/placeholders/events/placeholder-logo.png";

export default function EventsPage({ lang, setLang, onBack }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const content = {
    ca: {
      backBtn: "Tornar a l'inici",
      breadcrumbHome: "Inici",
      breadcrumbEvents: "Esdeveniments",
      companyBadge: "Empresa Associada a KIZUNA GLOBAL",
      heroTitle: "KIZUNA GLOBAL EVENTS",
      heroSubtitle: "Organització Integral d'Esdeveniments, Logística i Serveis d'Agència de Viatges",
      heroLead:
        "KIZUNA GLOBAL EVENTS és la companyia associada a KIZUNA GLOBAL que s'encarrega d'organitzar tota la logística i acompanyar la gestió i coordinació integral de tots els elements necessaris per a l'organització d'esdeveniments d'alta complexitat, assumint totes les funcions pròpies d'una agència de viatges. Comptem amb una immensa xarxa de contactes institucionals, operatius i de serveis, i el nostre equip humà acumula més de 30 anys d'experiència consolidada oferint aquests serveis especialitzats.",
      
      pillarsTitle: "Capacitats i Serveis Globals",
      pillars: [
        {
          icon: <Building2 className="w-6 h-6" />,
          title: "Disseny i Logística d'Esdeveniments",
          desc: "T'ajudem en el disseny i la logística integral del teu esdeveniment, acompanyant-te en la planificació i gestió de tots els elements necessaris."
        },
        {
          icon: <Plane className="w-6 h-6" />,
          title: "Serveis d'Agència de Viatges",
          desc: "Gestió completa de reserves hoteleres per a grans grups, bitllets d'avió i tren, trasllats privats de delegacions i atenció personalitzada a ponents i convidats internacionals."
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Més de 30 Anys d'Experiència",
          desc: "Més de tres dècades d'experiència contrastada liderant esdeveniments massius, congressos institucionals i trobades sectorials d'abast nacional i internacional."
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Àmplia Xarxa de Serveis",
          desc: "Accés directe a una xarxa preferent de proveïdors en hostaleria, càtering gourmet, seguretat, acreditacions tecnològiques i disseny d'experiències."
        }
      ],

      eventsSectionBadge: "Portfolio d'Esdeveniments",
      eventsSectionTitle: "Esdeveniments Organitzats",
      eventsSectionLead:
        "Coneix les grans cites gestionades i acompanyades per KIZUNA GLOBAL EVENTS, on la precisió organitzativa i el servei integral han marcat la diferència.",

      // Event: Hasta Que El Venga
      event1Badge: "3a Edició · Fira de Reus (Tarragona)",
      event1Scope: "Congrés Nacional i Europeu",
      event1Title: "Congrés «Hasta Que Él Venga» (HQÉLV)",
      event1Motto: "«APÁNTESIS — El clamor de la medianoche» (Mateu 25:6)",
      event1DescP1:
        "«Hasta Que Él Venga» és una de les grans convocatòries interdenominacionals a escala estatal i europea, que reuneix a milers de pastors, equips de lideratge ministerial, joves i famílies a les instal·lacions firals de Fira de Reus. El congrés s'articula entorn del terme bíblic APÁNTESIS (del grec apántēsis, «sortir a la trobada», basat en Mateu 25:6), constituint una crida apassionada a l'avivament espiritual, la pregària, la unitat del Cos de Crist i la preparació activa i compromesa davant la segona vinguda de Crist.",
      event1DescP2:
        "L'esdeveniment va comptar amb ponents i líders de referència internacional com Marcos Brunet i Fernanda Brunet (Toma Tu Lugar), Mariano Sennewald (Fundador i Director d'Instituto MiSion) o Itiel Arroyo, a més d'un multitudinari Altar d'Adoració, sessions plenàries, espais exclusius per a pastors i activitats formatives per a totes les edats.",
      
      kizunaRoleTitle: "El paper logístic de KIZUNA GLOBAL EVENTS:",
      kizunaRolePoints: [
        "Coordinació tècnica integral i gestió del recinte a la Fira de Reus per acollir milers de congressistes.",
        "Operativa completa d'agència de viatges: bloqueig i gestió d'allotjaments hotelers per a assistents i delegacions de tot Europa.",
        "Coordinació de trasllats, viatges i atenció personalitzada per a ponents VIP, músics i equips tècnics.",
        "Supervisió in situ d'accessos, acreditacions digitals i suport permanent a l'equip promotor."
      ],

      visitOfficialWeb: "Visitar Web Oficial (hastaqueelvenga.es)",
      galleryTitle: "Galeria de l'Esdeveniment",
      photoCount: "Fotos de l'esdeveniment",

      contactTitle: "Necessites organitzar el teu esdeveniment o congrés?",
      contactLead:
        "A KIZUNA GLOBAL EVENTS posem a la teva disposició la nostra experiència de més de 30 anys i tota la nostra xarxa logística i d'agència de viatges per fer del teu projecte un èxit rotund.",
      contactBtn: "Contacta amb KIZUNA GLOBAL EVENTS",
      contactEmail: "ester.creus@kizunaglobal.org"
    },

    es: {
      backBtn: "Volver al inicio",
      breadcrumbHome: "Inicio",
      breadcrumbEvents: "Eventos",
      companyBadge: "Empresa Asociada a KIZUNA GLOBAL",
      heroTitle: "KIZUNA GLOBAL EVENTS",
      heroSubtitle: "Organización Integral de Eventos, Logística y Servicios de Agencia de Viajes",
      heroLead:
        "KIZUNA GLOBAL EVENTS es la compañía asociada a KIZUNA GLOBAL que se encarga de organizar toda la logística y acompañar la gestión y coordinación integral de todos los elementos necesarios para la organización de eventos de máxima envergadura, asumiendo todas las labores típicas de una agencia de viajes especializada. Contamos con una enorme red de contactos institucionales, operativos y de servicios, y nuestro equipo acumula más de 30 años de experiencia contrastada ofreciendo estos servicios.",

      pillarsTitle: "Capacidades y Servicios Globales",
      pillars: [
        {
          icon: <Building2 className="w-6 h-6" />,
          title: "Diseño y Logística de Eventos",
          desc: "Te ayudamos en el diseño y la logística de tu evento, acompañándote en la planificación y gestión de todos los elementos necesarios."
        },
        {
          icon: <Plane className="w-6 h-6" />,
          title: "Servicios de Agencia de Viajes",
          desc: "Gestión hotelera masiva para grandes grupos, emisión de billetes aéreos y ferroviarios, transportes privados para delegaciones y atención VIP a ponentes internacionales."
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Más de 30 Años de Experiencia",
          desc: "Más de tres décadas de trayectoria demostrada liderando eventos multitudinarios, congresos corporativos y cumbres sectoriales nacionales e internacionales."
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Enorme Red de Contactos",
          desc: "Alianzas preferentes con los proveedores más prestigiosos en hostelería, catering, seguridad, plataformas de acreditación digital y producción técnica."
        }
      ],

      eventsSectionBadge: "Portfolio de Eventos",
      eventsSectionTitle: "Eventos Organizados",
      eventsSectionLead:
        "Conoce las grandes convocatorias gestionadas y acompañadas por KIZUNA GLOBAL EVENTS, donde la excelencia logística y el acompañamiento integral garantizan un impacto memorable.",

      // Event: Hasta Que El Venga
      event1Badge: "3ª Edición · Fira de Reus (Tarragona)",
      event1Scope: "Congreso Nacional y Europeo",
      event1Title: "Congreso «Hasta Que Él Venga» (HQÉLV)",
      event1Motto: "«APÁNTESIS — El clamor de la medianoche» (Mateo 25:6)",
      event1DescP1:
        "«Hasta Que Él Venga» es uno de los mayores congresos interdenominacionales a nivel nacional y europeo, reuniendo a miles de pastores, líderes eclesiales, jóvenes y familias en el recinto ferial Fira de Reus. El congreso toma como lema el término bíblico APÁNTESIS (del griego apántēsis, «salir al encuentro», inspirado en Mateo 25:6), constituyendo un llamamiento apasionado al despertar espiritual, la oración, la comunión eclesial y la preparación activa y comprometida ante la perspectiva de la segunda venida de Cristo.",
      event1DescP2:
        "El evento contó con ponentes y líderes de referencia internacional como Marcos Brunet y Fernanda Brunet (Toma Tu Lugar), Mariano Sennewald (Fundador y Director de Instituto MiSion) o Itiel Arroyo, junto a un multitudinario Altar de Adoración en directo, sesiones plenarias, encuentros exclusivos para pastores y actividades infantiles adaptadas.",

      kizunaRoleTitle: "El papel logístico de KIZUNA GLOBAL EVENTS:",
      kizunaRolePoints: [
        "Coordinación técnica integral y gestión del recinto ferial Fira de Reus para acoger a miles de congresistas.",
        "Operativa completa de agencia de viajes: bloqueo y gestión hotelera para asistentes y delegaciones de toda España y Europa.",
        "Coordinación de traslados, transfers y atención VIP a ponentes internacionales, músicos y equipos de producción.",
        "Control de accesos in situ, sistemas de acreditación y asistencia logística permanente durante todas las jornadas."
      ],

      visitOfficialWeb: "Visitar Web Oficial (hastaqueelvenga.es)",
      galleryTitle: "Galería del Evento",
      photoCount: "Fotos del evento",

      contactTitle: "¿Deseas organizar tu congreso o evento corporativo?",
      contactLead:
        "En KIZUNA GLOBAL EVENTS ponemos a tu disposición más de 30 años de experiencia contrastada, una red integral de contactos y servicios plenos de agencia de viajes para que tu evento sea un éxito rotundo.",
      contactBtn: "Contactar con KIZUNA GLOBAL EVENTS",
      contactEmail: "ester.creus@kizunaglobal.org"
    },

    en: {
      backBtn: "Back to Home",
      breadcrumbHome: "Home",
      breadcrumbEvents: "Events",
      companyBadge: "Associated Company of KIZUNA GLOBAL",
      heroTitle: "KIZUNA GLOBAL EVENTS",
      heroSubtitle: "End-to-End Event Management, Logistics & Travel Agency Operations",
      heroLead:
        "KIZUNA GLOBAL EVENTS is the associated company of KIZUNA GLOBAL that organises all logistics and accompanies the management and arrangement of all necessary elements for event organization, including all typical services of a full-service travel agency. We possess a vast network of contacts and service providers, and our team brings more than 30 years of proven experience delivering high-impact, large-scale events.",

      pillarsTitle: "Core Capabilities & Global Services",
      pillars: [
        {
          icon: <Building2 className="w-6 h-6" />,
          title: "Event Design & Logistics",
          desc: "We help you in the design and logistics of your event, accompanying and guiding you through every step of the planning and coordination."
        },
        {
          icon: <Plane className="w-6 h-6" />,
          title: "Travel Agency Operations",
          desc: "Large group hotel booking blocks, commercial flight and high-speed rail ticketing, private delegation transfers, and dedicated concierge care for international VIP speakers."
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Over 30 Years Experience",
          desc: "More than three decades of demonstrated excellence managing high-attendance congresses, corporate gatherings, and international summits."
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Vast Network of Services",
          desc: "Preferred partnerships with premier providers in hospitality, gourmet catering, security, digital registration systems, and immersive event branding."
        }
      ],

      eventsSectionBadge: "Events Portfolio",
      eventsSectionTitle: "Organized Events",
      eventsSectionLead:
        "Explore key large-scale events coordinated and managed by KIZUNA GLOBAL EVENTS, where operational rigor and turnkey logistics make every experience memorable.",

      // Event: Hasta Que El Venga
      event1Badge: "3rd Edition · Fira de Reus (Tarragona, Spain)",
      event1Scope: "National & European Conference",
      event1Title: "«Hasta Que Él Venga» Congress (HQÉLV)",
      event1Motto: "«APÁNTESIS — The Midnight Cry» (Matthew 25:6)",
      event1DescP1:
        "«Hasta Que Él Venga» is one of the premier Christian conferences across Spain and Europe, gathering thousands of pastors, ministry leaders, young people, and families at the Fira de Reus exhibition center. Guided by the biblical theme APÁNTESIS (from Greek apántēsis, «going out to meet», inspired by Matthew 25:6), the summit calls for spiritual awakening, deep prayer, church unity, and purposeful preparation toward the second coming of Christ.",
      event1DescP2:
        "The conference featured world-renowned keynote speakers and worship leaders including Marcos Brunet and Fernanda Brunet (Toma Tu Lugar), Mariano Sennewald (Founder and Director of Instituto MiSion), and Itiel Arroyo, alongside a massive live Altar of Worship, plenary teaching sessions, an exclusive summit for senior pastors, and tailored youth programs.",

      kizunaRoleTitle: "Logistical role of KIZUNA GLOBAL EVENTS:",
      kizunaRolePoints: [
        "End-to-end technical coordination and contracting of the Fira de Reus exhibition center to accommodate thousands of attendees.",
        "Full-scope travel agency management: hotel room blocks and group bookings across Tarragona province for European delegations.",
        "Airport and high-speed train transfers, chauffeur services, and VIP logistics for international guest speakers and artists.",
        "On-site access control, digital badge credentialing, and 24/7 logistical support during the entire event."
      ],

      visitOfficialWeb: "Visit Official Website (hastaqueelvenga.es)",
      galleryTitle: "Event Gallery",
      photoCount: "Event photos",

      contactTitle: "Planning a major event or conference?",
      contactLead:
        "KIZUNA GLOBAL EVENTS provides over 30 years of experience, a vast network of industry partners, and complete travel agency capabilities to ensure your event's absolute success.",
      contactBtn: "Contact KIZUNA GLOBAL EVENTS",
      contactEmail: "ester.creus@kizunaglobal.org"
    }
  };

  const cur = content[lang] || content.es;

  // Placeholder photos created from https://www.hastaqueelvenga.es
  // Available both locally in src/assets/placeholders/events and public/placeholders/events
  const hqelvImages = [
    {
      id: 1,
      src: placeholder1,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D1.png",
      caption: {
        ca: "Fira de Reus · Convocatòria Multitudinària",
        es: "Fira de Reus · Convocatoria Multitudinaria",
        en: "Fira de Reus · Large-Scale Assembly"
      }[lang] || "Fira de Reus · Convocatoria Multitudinaria"
    },
    {
      id: 2,
      src: placeholder2,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D1-7.png",
      caption: {
        ca: "Altar d'Adoració i Escenografia Tècnica",
        es: "Altar de Adoración y Escenografía Técnica",
        en: "Live Worship Altar & Technical Production"
      }[lang] || "Altar de Adoración"
    },
    {
      id: 3,
      src: placeholder3,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D1-9.png",
      caption: {
        ca: "Delegacions Nacionals i Europees",
        es: "Delegaciones Nacionales y Europeas",
        en: "National and European Delegations"
      }[lang] || "Delegaciones de Europa"
    },
    {
      id: 4,
      src: placeholder4,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D1-10.png",
      caption: {
        ca: "Sessions Plenàries i Conferències",
        es: "Sesiones Plenarias y Conferencias",
        en: "Plenary Sessions & Keynotes"
      }[lang] || "Sesiones Plenarias"
    },
    {
      id: 5,
      src: placeholder5,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D2.png",
      caption: {
        ca: "Recinte Fira de Reus · Perspectiva General",
        es: "Recinto Fira de Reus · Perspectiva General",
        en: "Fira de Reus Exhibition Complex"
      }[lang] || "Recinto Fira de Reus"
    },
    {
      id: 6,
      src: placeholder6,
      remoteSource: "https://www.hastaqueelvenga.es/images/misc/Carrusel%20D3.png",
      caption: {
        ca: "Trobada de Lideratge i Ponents Internacionals",
        es: "Encuentro de Liderazgo y Ponentes Internacionales",
        en: "Leadership Summit & Guest Speakers"
      }[lang] || "Encuentro de Pastores y Líderes"
    }
  ];

  const logoHqelvSrc = placeholderLogo;

  // Auto-advance photo carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % hqelvImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, hqelvImages.length]);

  const handlePrevPhoto = () => {
    setIsAutoPlaying(false);
    setPhotoIndex((prev) => (prev - 1 + hqelvImages.length) % hqelvImages.length);
  };

  const handleNextPhoto = () => {
    setIsAutoPlaying(false);
    setPhotoIndex((prev) => (prev + 1) % hqelvImages.length);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-20">
      {/* Sticky Top Navigation Bar with Back Button and Language Switcher */}
      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4 select-none mb-6">
        <nav className="backdrop-blur-md bg-slate-950/85 border border-blue-500/30 rounded-2xl shadow-2xl px-4 sm:px-6 flex items-center justify-between h-16 transition-all">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors group text-sm font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{cur.backBtn}</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="font-serif tracking-widest font-bold text-sm text-blue-200">
              KIZUNA GLOBAL EVENTS
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Social Network Icons inside sticky top banner */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <a
                href="https://www.instagram.com/associacio_kizuna_global/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Kizuna Global"
                title="Instagram · @associacio_kizuna_global"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 text-pink-400 hover:text-pink-300 transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 drop-shadow-[0_1px_6px_rgba(236,72,153,0.4)]" />
                <span className="hidden xl:inline text-xs font-semibold text-white/90 group-hover:text-white">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/company/kizuna-global-iniciatives-socials/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Kizuna Global"
                title="LinkedIn · Kizuna Global Iniciatives Socials"
                className="group flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 shadow-sm"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 drop-shadow-[0_1px_6px_rgba(59,130,246,0.4)]" />
                <span className="hidden xl:inline text-xs font-semibold text-white/90 group-hover:text-white">LinkedIn</span>
              </a>
            </div>

            <div className="hidden sm:block h-5 w-px bg-white/15" />

            {/* Quick Language Switcher Pills */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setLang("ca")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "ca"
                    ? "bg-blue-500 text-white font-bold shadow-md shadow-blue-900/50"
                    : "text-blue-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                Català
              </button>
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "es"
                    ? "bg-blue-500 text-white font-bold shadow-md shadow-blue-900/50"
                    : "text-blue-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                Castellano
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "en"
                    ? "bg-blue-500 text-white font-bold shadow-md shadow-blue-900/50"
                    : "text-blue-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-blue-300/70 flex items-center gap-2 pt-2">
          <button onClick={onBack} className="hover:text-white transition-colors cursor-pointer">
            {cur.breadcrumbHome}
          </button>
          <span>/</span>
          <span className="text-blue-400 font-medium">{cur.breadcrumbEvents}</span>
        </nav>

        {/* Hero Section: Kizuna Global Events Presentation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-blue-500/30 p-8 sm:p-12 shadow-[0_20px_60px_rgba(37,99,235,0.15)] overflow-hidden"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 text-xs uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{cur.companyBadge}</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              {cur.heroTitle}
            </h1>
            <h2 className="mt-2 text-lg sm:text-2xl font-medium text-blue-300/90 tracking-wide">
              {cur.heroSubtitle}
            </h2>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-200/90 font-light">
              {cur.heroLead}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href="#organized-events"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 cursor-pointer"
              >
                <span>{cur.eventsSectionTitle}</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#contact-events"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                <span>{cur.contactBtn}</span>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Pillars / Key Value Propositions */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-bold">
              {cur.companyBadge}
            </h3>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
              {cur.pillarsTitle}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cur.pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, borderColor: "rgba(59,130,246,0.6)" }}
                className="rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/15 p-6 shadow-xl flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="p-3 w-fit rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 mb-4">
                    {pillar.icon}
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2 tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300/80">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section: Organized Events */}
        <section id="organized-events" className="scroll-mt-24 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              {cur.eventsSectionBadge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {cur.eventsSectionTitle}
            </h2>
            <p className="mt-2 text-base text-slate-300/80 max-w-3xl">
              {cur.eventsSectionLead}
            </p>
          </div>

          {/* Event Card: Hasta Que El Venga */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
          >
            {/* Top Event Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold tracking-wide">
                  {cur.event1Badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  {cur.event1Scope}
                </span>
              </div>

              <img
                src={logoHqelvSrc}
                alt="Hasta Que Él Venga"
                className="h-9 sm:h-11 w-auto object-contain filter drop-shadow"
              />
            </div>

            {/* 2-Column Layout: Left Carousel / Right Description */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT COLUMN: 3D Coverflow Photo Carousel (Like the main page) */}
              <div
                className="lg:col-span-5 flex flex-col items-center select-none"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* 3D Coverflow Container */}
                <div className="relative w-full h-[250px] sm:h-[290px] lg:h-[310px] flex items-center justify-center overflow-hidden [perspective:1000px]">
                  {hqelvImages.map((img, i) => {
                    let offset = i - photoIndex;
                    const N = hqelvImages.length;
                    if (offset > N / 2) offset -= N;
                    if (offset < -N / 2) offset += N;

                    const isVisible = Math.abs(offset) <= 2;
                    if (!isVisible) return null;

                    const rotateY = offset * -28;
                    const translateZ = Math.abs(offset) * -110;
                    const scale = 1 - Math.abs(offset) * 0.14;
                    const opacity = 1 - Math.abs(offset) * 0.4;
                    const zIndex = 10 - Math.abs(offset);
                    const translateX = offset * 95;

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
                        className="absolute w-[240px] h-[160px] sm:w-[290px] sm:h-[200px] lg:w-[320px] lg:h-[220px] rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.6)] border-3 border-blue-400/80 bg-slate-950 cursor-pointer"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setPhotoIndex(i);
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover pointer-events-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none flex items-end p-3">
                          {offset === 0 && (
                            <p className="text-xs text-white/95 font-medium drop-shadow truncate">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Nav Arrows */}
                  <button
                    onClick={handlePrevPhoto}
                    aria-label="Previous image"
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white transition ring-1 ring-white/20 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    aria-label="Next image"
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white transition ring-1 ring-white/20 cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="mt-4 flex justify-center gap-1.5">
                  {hqelvImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setPhotoIndex(i);
                      }}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        i === photoIndex ? "w-7 bg-blue-400" : "w-2 bg-blue-900/60 hover:bg-blue-600"
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Thumbnail Strip */}
                <div className="mt-4 grid grid-cols-6 gap-2 w-full">
                  {hqelvImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setPhotoIndex(i);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        i === photoIndex
                          ? "border-blue-400 scale-105 shadow-md shadow-blue-500/30"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Description & Information */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    {cur.event1Title}
                  </h3>
                  <p className="mt-1.5 text-base sm:text-lg font-semibold text-blue-300 italic">
                    {cur.event1Motto}
                  </p>

                  <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-slate-200/90 font-light">
                    <p>{cur.event1DescP1}</p>
                    <p>{cur.event1DescP2}</p>
                  </div>

                  {/* Role of Kizuna Global Events */}
                  <div className="mt-6 p-5 rounded-2xl bg-blue-950/40 border border-blue-500/25">
                    <h4 className="font-bold text-sm sm:text-base text-blue-200 flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>{cur.kizunaRoleTitle}</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300/90">
                      {cur.kizunaRolePoints.map((pt, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions & Links */}
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <a
                    href="https://www.hastaqueelvenga.es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 px-6 py-3 text-sm sm:text-base font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
                  >
                    <span>{cur.visitOfficialWeb}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact CTA Section */}
        <motion.section
          id="contact-events"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60 border border-blue-500/30 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {cur.contactTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {cur.contactLead}
            </p>

            <div className="pt-4 flex flex-col items-center gap-2">
              <a
                href={`mailto:${cur.contactEmail}?subject=Consulta%20Kizuna%20Global%20Events`}
                className="inline-flex items-center gap-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 px-7 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
              >
                <Mail className="w-5 h-5" />
                <span>{cur.contactBtn}</span>
              </a>
              <span className="text-xs text-blue-300/80 mt-1 font-mono">
                {cur.contactEmail}
              </span>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer for Events Subdomain */}
      <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-blue-200/60">
        <p>© {new Date().getFullYear()} KIZUNA GLOBAL EVENTS · Associació Kizuna Global</p>
      </footer>
    </div>
  );
}

