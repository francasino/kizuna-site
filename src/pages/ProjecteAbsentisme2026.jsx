import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Target, 
  FileText, 
  Users, 
  BarChart3, 
  Sparkles,
  Lock,
  HeartPulse
} from "lucide-react";

export default function ProjecteAbsentisme2026({ lang, setLang, onBack }) {
  const content = {
    ca: {
      badge: "Projecte de Recerca Social 2026",
      supportedBy: "Amb el suport de:",
      backBtn: "Tornar a l'inici",
      breadcrumbHome: "Inici",
      breadcrumbProjects: "Projectes i Esdeveniments",
      breadcrumbCurrent: "Projecte Prevenció Absentisme 2026",
      
      title: "Estudi de la Salut Psicosocial, el Presentisme i les Baixes Laborals al Camp de Tarragona i Catalunya",
      lead: (
        <>
          Una investigació independent impulsada per <strong>Kizuna Global Iniciatives Socials</strong>, amb el suport de la <strong>Diputació de Tarragona</strong>, orientada a comprendre les causes reals de l'esgotament laboral i dissenyar solucions preventives aplicables al teixit productiu local.
        </>
      ),
      ctaBtn: "Respondre el Qüestionari Anònim (2-3 min)",
      ctaNote: "100% Anònim · Finalitat científica i social · Sense dades personals",
      
      objectivesTitle: "Objectius de la Recerca",
      objectives: [
        {
          num: "1",
          title: "Diagnòstic Territorial i Sectorial",
          desc: "Identificar els patrons de malestar i baixa laboral al Camp de Tarragona segons sectors clau: indústria petroquímica, comerç, logística, turisme, sanitat i administració."
        },
        {
          num: "2",
          title: "Desxifrar l'Iceberg Invisible",
          desc: "Avaluar el fenomen del presentisme (treballar estant malalt per por o pressió), les alertes somàtiques primerenques i l'impacte de les càrregues familiars i de cures."
        },
        {
          num: "3",
          title: "Transferència i Prevenció",
          desc: "Transformar les dades recollides en una Guia Pràctica de Pautes Preventives directa i gratuïta per a pimes, persones treballadores i equips directius."
        }
      ],
      
      diffTitle: "Per què aquest estudi aporta més valor que les estadístiques convencionals?",
      diffIntro: "Les dades oficials sobre absentisme (Mútues col·laboradores, Seguretat Social i patronals) es limiten a comptabilitzar el diagnòstic mèdic un cop la persona ja ha causat baixa. Aquest enfocament deixa sense resposta preguntes essencials que el nostre estudi sí que aborda:",
      diffPoints: [
        {
          bold: "Mesura del presentisme real:",
          text: "Quantifiquem quants dies el personal acudeix al seu lloc de treball amb símptomes d'incapacitat anímica o física abans de col·lapsar."
        },
        {
          bold: "Dades del sistema sanitari vs. privat:",
          text: "Recollim si les persones han hagut d'assumir teràpia psicològica privada davant la saturació de l'atenció pública, dada inexistent als registres oficials."
        },
        {
          bold: "Doble càrrega de cures:",
          text: "Correlacionem per primer cop la sobrecàrrega familiar (fills i dependents) i el treball per torns o guàrdies amb l'esgotament psicològic."
        },
        {
          bold: "El procés de retorn al lloc de feina:",
          text: "Analitzem si existeix adaptació real del lloc de treball en reincorporar-se o si l'empresa afavoreix recaigudes immediates."
        }
      ],
      
      guidelinesTitle: "Pautes i Guies per a la Prevenció",
      guidelinesDesc: "L'estudi no es quedarà en un diagnòstic acadèmic. Amb els patrons identificats, Kizuna Global redactarà un paquet de recomanacions operatives: protocols de desconnexió digital realista, guies de readaptació postbaixa per a comandaments intermedis i eines de detecció primerenca per a la vigilància de la salut laboral.",
      
      anonymityTitle: "Garantia Estricta d'Anonimat (RGPD)",
      anonymityDesc: "El qüestionari té caràcter estrictament anònim i estadístic. No es recullen noms, adreces IP ni dades de contacte vinculades a les respostes. La identificació de l'empresa és totalment opcional. El correu electrònic només es demana si la persona desitja rebre l'informe final i s'arxiva de forma dissociada.",
      
      footerSubsidized: "Projecte subvencionat per la Diputació de Tarragona · Convocatòria de Projectes d'Interès Social 2026",
      footerCopyright: "© Kizuna Global Iniciatives Socials · www.kizunaglobal.org"
    },
    
    es: {
      badge: "Proyecto de Investigación Social 2026",
      supportedBy: "Con el apoyo de:",
      backBtn: "Volver al inicio",
      breadcrumbHome: "Inicio",
      breadcrumbProjects: "Proyectos y Eventos",
      breadcrumbCurrent: "Proyecto Prevención Absentismo 2026",
      
      title: "Estudio sobre Salud Psicosocial, Presentismo y Bajas Laborales en el Camp de Tarragona y Cataluña",
      lead: (
        <>
          Una investigación independiente impulsada por <strong>Kizuna Global Iniciatives Socials</strong>, con la subvención de la <strong>Diputació de Tarragona</strong>, diseñada para identificar los factores determinantes del agotamiento laboral y construir protocolos preventivos aplicables a las organizaciones.
        </>
      ),
      ctaBtn: "Participar en la Encuesta Anónima (2-3 min)",
      ctaNote: "100% Anónimo · Rigor científico · Sin recolección de datos sensibles",
      
      objectivesTitle: "Objetivos del Estudio",
      objectives: [
        {
          num: "1",
          title: "Diagnóstico Sectorial y Territorial",
          desc: "Analizar patrones de baja y malestar en el Camp de Tarragona: desde las peculiaridades de la industria química/energética hasta el sector servicios, hostelería, logística y sanidad."
        },
        {
          num: "2",
          title: "Desvelar el \"Presentismo\"",
          desc: "Evaluar el fenómeno del trabajador que acude enfermo a su puesto por miedo o presión, los síntomas prodrómicos de alerta (insomnio, fatiga) y el impacto de los cuidados familiares."
        },
        {
          num: "3",
          title: "Transferencia y Prevención Práctica",
          desc: "Elaborar y difundir una Guía de Pautas Preventivas gratuita para facilitar a empresas y comités de salud laboral medidas tangibles de mitigación."
        }
      ],
      
      diffTitle: "¿Por qué este estudio aporta más valor que las estadísticas habituales?",
      diffIntro: "Las cifras oficiales emitidas periódicamente por mutuas y administraciones ofrecen una visión agregada y tardía: miden la baja médica cuando el profesional ya ha colapsado. Nuestro estudio profundiza donde las estadísticas macro no llegan:",
      diffPoints: [
        {
          bold: "Foco en el presentismo laboral:",
          text: "Medimos la pérdida de salud previa a la baja médica oficial, algo invisible en los registros del INSS."
        },
        {
          bold: "Impacto del colapso asistencial:",
          text: "Cuantificamos cuántos trabajadores deben financiar de su bolsillo atención psicológica privada debido a las listas de espera en la sanidad pública."
        },
        {
          bold: "Correlación con turnicidad y conciliación:",
          text: "Evaluamos cómo el trabajo a turnos o la falta de desconexión digital interactúan con el cuidado de menores o dependientes."
        },
        {
          bold: "Calidad de la reincorporación:",
          text: "Estudiamos si las empresas adaptan progresivamente las cargas de trabajo tras la vuelta de una baja o si se precipitan recaídas inmediatas."
        }
      ],
      
      guidelinesTitle: "Pautas Prácticas de Prevención",
      guidelinesDesc: "Los resultados servirán para redactar protocolos de actuación realistas: desconexión digital efectiva, planes de acogida y reincorporación tras incapacidad temporal prolongada y pautas organizativas para mandos intermedios.",
      
      anonymityTitle: "Garantía Total de Anonimato",
      anonymityDesc: "El estudio es puramente estadístico. No se rastrean direcciones IP ni se requiere identificación obligatoria de la empresa ni del empleado. Cualquier correo facilitado para recibir el informe se procesa de manera completamente independiente y cifrada.",
      
      footerSubsidized: "Proyecto subvencionado por la Diputació de Tarragona · Convocatoria de Proyectos de Interés Social 2026",
      footerCopyright: "© Kizuna Global Iniciatives Socials · www.kizunaglobal.org"
    },
    
    en: {
      badge: "Social Research Project 2026",
      supportedBy: "Supported by:",
      backBtn: "Back to Home",
      breadcrumbHome: "Home",
      breadcrumbProjects: "Projects & Events",
      breadcrumbCurrent: "Absenteeism Prevention Project 2026",
      
      title: "Occupational Psychosocial Health, Presenteeism, and Sick Leave in Camp de Tarragona & Catalonia",
      lead: (
        <>
          An independent research initiative led by <strong>Kizuna Global Iniciatives Socials</strong> and supported by the <strong>Diputació de Tarragona</strong>, designed to identify the operational root causes of workplace burnout and establish actionable preventive guidelines.
        </>
      ),
      ctaBtn: "Take the Anonymous Survey (2-3 min)",
      ctaNote: "100% Anonymous · Scientific research · No identifiable data collected",
      
      objectivesTitle: "Research Objectives",
      objectives: [
        {
          num: "1",
          title: "Sectoral & Regional Diagnosis",
          desc: "Map out sick leave and distress patterns across key industries in Camp de Tarragona, including petrochemical plants, logistics, tourism/hospitality, healthcare, and education."
        },
        {
          num: "2",
          title: "Uncovering Presenteeism",
          desc: "Quantify working while ill, investigate early warning somatization indicators (chronic insomnia, persistent fatigue), and assess the burden of family caregiving duties."
        },
        {
          num: "3",
          title: "Actionable Prevention Guidelines",
          desc: "Convert empirical survey data into an open-access Preventive Good Practices Guide for local businesses, managers, and employee health committees."
        }
      ],
      
      diffTitle: "Why does this study provide deeper insights than standard statistics?",
      diffIntro: "Mainstream reports compiled by mutual insurers and public agencies only record sick leave after an employee has already reached physical or mental exhaustion. Our research investigates the blind spots of aggregated macrodata:",
      diffPoints: [
        {
          bold: "Measurable presenteeism:",
          text: "We record the days employees continue working while incapacitated before taking a formal medical leave."
        },
        {
          bold: "Healthcare access realities:",
          text: "We document whether employees have had to pay for private psychiatric or psychological care due to long public system waiting lists."
        },
        {
          bold: "Interactions with shifts & family care:",
          text: "We correlate rotating shift work and digital hyper-connectivity with family caregiving workloads."
        },
        {
          bold: "Post-leave reintegration quality:",
          text: "We analyze whether employers adapt workloads upon return or trigger early relapses."
        }
      ],
      
      guidelinesTitle: "Action-Oriented Preventive Guidelines",
      guidelinesDesc: "The findings will serve as the foundation for practical frameworks: healthy digital disconnection, structured return-to-work protocols, and early psychosocial risk management for team leaders.",
      
      anonymityTitle: "Strict Anonymity Guarantee (GDPR)",
      anonymityDesc: "This study is strictly statistical. No IP addresses or identifying details are stored. Company names are optional, and any email address provided to receive the research report is stored separately and securely.",
      
      footerSubsidized: "Project subsidized by Diputació de Tarragona · Call for Projects of Social Interest 2026",
      footerCopyright: "© Kizuna Global Iniciatives Socials · www.kizunaglobal.org"
    }
  };

  const cur = content[lang] || content.es;
  const surveyUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd5sm2uppkc-JUeAo5Rw_7YW3GZlrXinVcMk8LTy8ncW5tgUA/viewform?usp=dialog";
  const diputacioLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logotipo_de_la_Diputaci%C3%B3_de_Tarragona.svg/500px-Logotipo_de_la_Diputaci%C3%B3_de_Tarragona.svg.png";

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-16">
      {/* Top Floating Navigation Bar */}
      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4 select-none mb-6">
        <nav className="backdrop-blur-md bg-emerald-950/85 border border-white/15 rounded-2xl shadow-2xl px-4 sm:px-6 flex items-center justify-between h-16 transition-all">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors group text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{cur.backBtn}</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Quick Language Switcher Pills */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-medium">
              <button
                onClick={() => setLang("ca")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "ca"
                    ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50"
                    : "text-emerald-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                Català
              </button>
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "es"
                    ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50"
                    : "text-emerald-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                Castellano
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === "en"
                    ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50"
                    : "text-emerald-200/80 hover:text-white hover:bg-white/5"
                }`}
              >
                English
              </button>
            </div>

            <a
              href={surveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs text-white font-semibold shadow-md hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>{lang === "ca" ? "Enquesta" : lang === "es" ? "Encuesta" : "Survey"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-emerald-300/70 flex items-center gap-2 pt-2">
          <button onClick={onBack} className="hover:text-white transition-colors">{cur.breadcrumbHome}</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-white transition-colors">{cur.breadcrumbProjects}</button>
          <span>/</span>
          <span className="text-emerald-400 font-medium truncate">{cur.breadcrumbCurrent}</span>
        </nav>

        {/* Institutional Header Card */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/15 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />
          
          <div className="text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {cur.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Kizuna Global Iniciatives Socials
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === "ca" 
                ? "Recerca aplicada i transferència de coneixement a les organitzacions" 
                : lang === "es" 
                ? "Investigación aplicada y transferencia de conocimiento a las organizaciones" 
                : "Applied research and knowledge transfer for organizations"}
            </p>
          </div>

          {/* Institutional Sponsor Logo Card */}
          <div className="relative z-10 flex items-center gap-4 bg-white/95 p-3.5 rounded-2xl border border-white shadow-lg ring-4 ring-emerald-500/10 hover:shadow-xl transition-all">
            <div className="text-left">
              <span className="block text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                {cur.supportedBy}
              </span>
              <span className="block text-xs font-bold text-gray-900 leading-tight">
                Diputació de Tarragona
              </span>
            </div>
            <img 
              src={diputacioLogo} 
              alt="Diputació de Tarragona" 
              className="h-12 w-auto max-w-[130px] sm:max-w-[150px] object-contain"
              loading="lazy"
            />
          </div>
        </motion.header>

        {/* Hero Section & Direct CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl bg-gradient-to-br from-emerald-900/60 via-emerald-950/80 to-[#041c13]/90 backdrop-blur-md p-8 sm:p-12 border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white leading-tight mb-5">
              {cur.title}
            </h2>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-4xl">
              {cur.lead}
            </p>

            {/* CTA Container */}
            <div className="mt-8 pt-6 border-t border-emerald-500/25 flex flex-col sm:flex-row sm:items-center gap-5">
              <a 
                href={surveyUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-base font-bold rounded-2xl shadow-xl text-emerald-950 bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 hover:from-white hover:to-emerald-300 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 ring-4 ring-emerald-400/20"
              >
                <span>{cur.ctaBtn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cur.ctaNote}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Research Objectives */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 border-l-4 border-emerald-400 pl-4">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {cur.objectivesTitle}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {cur.objectives.map((obj, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(16,185,129,0.15)" }}
                transition={{ duration: 0.25 }}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-serif font-bold flex items-center justify-center text-lg mb-4 shadow-sm">
                    {obj.num}
                  </div>
                  <h4 className="font-bold text-base sm:text-lg text-white mb-2 leading-snug">
                    {obj.title}
                  </h4>
                  <p className="text-sm text-emerald-200/85 leading-relaxed">
                    {obj.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why this study is different */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white/5 backdrop-blur-md p-8 sm:p-10 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0 mt-1">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                {cur.diffTitle}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
                {cur.diffIntro}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {cur.diffPoints.map((item, index) => (
              <div 
                key={index}
                className="p-5 rounded-2xl bg-black/25 border border-white/10 hover:border-emerald-500/30 transition-colors space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <p className="text-sm leading-relaxed text-emerald-100">
                    <strong className="text-white font-semibold block mb-0.5">{item.bold}</strong>
                    <span className="text-emerald-200/80">{item.text}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Guidelines and Anonymity */}
        <motion.section 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="p-7 sm:p-8 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div>
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {cur.guidelinesTitle}
                </h4>
              </div>
              <p className="text-sm sm:text-base text-emerald-200/85 leading-relaxed">
                {cur.guidelinesDesc}
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-8 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.25)] flex flex-col justify-between hover:border-emerald-500/30 transition-all">
            <div>
              <div className="flex items-center gap-3 text-emerald-400 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {cur.anonymityTitle}
                </h4>
              </div>
              <p className="text-sm sm:text-base text-emerald-200/85 leading-relaxed">
                {cur.anonymityDesc}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Institutional Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-emerald-300/70 space-y-3">
          <p className="font-medium text-emerald-200/90">{cur.footerSubsidized}</p>
          <p>
            © Kizuna Global Iniciatives Socials ·{" "}
            <a 
              href="https://www.kizunaglobal.org" 
              onClick={onBack}
              className="underline hover:text-white transition-colors"
            >
              www.kizunaglobal.org
            </a>
          </p>
        </footer>

      </main>
    </div>
  );
}
