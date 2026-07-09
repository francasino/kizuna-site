/**
 * Course Controller and Navigation Logic (SPA Architecture)
 * Integrates with ScormWrapper for progress persistence in Evolmind
 */

const CourseController = {
  currentSlideIndex: 0,
  completedSlides: new Set(),
  highestVisitedIndex: 0,
  currentTimer: null,
  studentName: "",
  consented: false,
  secondsRemaining: 0,
  userAnswers: {},
  oceanAnswers: {},
  isQuizActive: false,
  shuffledQuizQuestions: [],
  totalAccumulatedSeconds: 0,
  sessionStartTime: null,
  timerBypassed: false,
  isResetting: false,

  // OCEAN questions mapping for the interactive autoevaluación in Module 2
  oceanQuestions: [
    { id: 'A1', block: 'A', text: '¿Te resulta muy incómodo decir "no" o ignorar a un compañero o cliente que te pide ayuda urgente por correo?' },
    { id: 'A2', block: 'A', text: 'Si recibes un correo con el logo de un proveedor conocido, ¿asumes que es legítimo sin verificar la dirección exacta del remitente?' },
    { id: 'A3', block: 'A', text: '¿Te sentirías descortés si llamas por teléfono a un superior para confirmar si realmente te ha enviado un archivo adjunto?' },
    { id: 'B1', block: 'B', text: '¿Trabajas habitualmente en modo "multitarea" (ej. leyendo correos mientras estás en una reunión o llamada)?' },
    { id: 'B2', block: 'B', text: '¿Sueles hacer clic rápidamente en "Aceptar" o "Recordar más tarde" en las ventanas emergentes (alertas, actualizaciones) para que no te molesten?' },
    { id: 'B3', block: 'B', text: 'Cuando tienes prisa, ¿utilizas la misma contraseña del trabajo para registrarte en webs o servicios personales?' },
    { id: 'C1', block: 'C', text: 'Si recibes un email de la alta dirección (CEO) o de una institución (Hacienda) exigiendo una acción inmediata, ¿sientes un pico de ansiedad que te impulsa a resolverlo en el acto?' },
    { id: 'C2', block: 'C', text: '¿Te preocupa tanto cometer un error que, si sospechas que has hecho clic en un virus, intentarías solucionarlo por tu cuenta antes de avisar a IT por miedo a una bronca?' },
    { id: 'C3', block: 'C', text: '¿Te sientes fácilmente abrumado y bloqueado cuando recibes demasiadas alertas de seguridad o correos en un mismo día?' },
    { id: 'D1', block: 'D', text: '¿Sueles utilizar aplicaciones gratuitas de internet (IA, conversores de PDF) para hacer tu trabajo más rápido, aunque la empresa no las haya autorizadas (Shadow IT)?' },
    { id: 'D2', block: 'D', text: 'Si ves un enlace llamativo o un código QR en la oficina, ¿sientes la curiosidad de escanearlo o abrirlo para ver de qué trata?' },
    { id: 'D3', block: 'D', text: '¿Crees que, al tener conocimientos informáticos medios-altos, es casi imposible que un hacker logre engañarte a ti?' },
    { id: 'E1', block: 'E', text: '¿Sueles compartir fotos de tu puesto de trabajo, proyectos o viajes de empresa de forma pública en tus redes sociales?' },
    { id: 'E2', block: 'E', text: '¿Aceptas solicitudes de conexión en LinkedIn de personas de tu sector que no conoces, asumiendo que es bueno para el networking?' },
    { id: 'E3', block: 'E', text: '¿Hablas cómodamente sobre temas sensibles de la empresa o clientes mientras estás en lugares públicos (trenes, cafeterías) o teletrabajando en un coworking?' }
  ],

  init() {
    this.sessionStartTime = Date.now();
    this.cacheDOM();
    this.bindEvents();

    // Initialize SCORM Connection
    ScormWrapper.initialize();

    // Load progress from LMS
    this.loadLMSData();

    // Render Sidebar modules
    this.renderModulesSidebar();

    // Check if Onboarding is completed
    if (this.consented && this.studentName) {
      this.onboardingOverlay.style.display = "none";
      // Show current slide
      this.showSlide(this.currentSlideIndex);
    } else {
      this.onboardingOverlay.style.display = "flex";
      // Pre-fill name input with LMS name if available
      const lmsName = ScormWrapper.getValue("cmi.core.student_name") || "";
      if (lmsName && lmsName !== "Francisco Pérez García") {
        this.inputStudentName.value = lmsName;
        this.btnOnboardingStart.disabled = (lmsName.trim().length < 2);
      }
    }
  },

  cacheDOM() {
    this.btnPrev = document.getElementById("btn-prev");
    this.btnNext = document.getElementById("btn-next");
    this.btnBypassTimer = document.getElementById("btn-bypass-timer");
    this.btnResetProgress = document.getElementById("btn-reset-progress");
    this.slideViewport = document.getElementById("slide-viewport");
    this.contentContainer = document.getElementById("content-container");
    this.slideScreenCard = document.getElementById("slide-screen-card");
    this.slideExtendedCard = document.getElementById("slide-extended-card");

    this.headerModuleTitle = document.getElementById("header-module-title");
    this.headerSlideTitle = document.getElementById("header-slide-title");
    this.slideCounter = document.getElementById("slide-counter");

    this.visualTitle = document.getElementById("visual-title");
    this.screenTextContent = document.getElementById("screen-text-content");
    this.extendedTextContent = document.getElementById("extended-text-content");

    this.timerIndicator = document.getElementById("timer-indicator");
    this.timerText = document.getElementById("timer-text");
    this.timerProgressLine = document.getElementById("timer-progress-line");

    this.sidebar = document.getElementById("sidebar");
    this.menuToggle = document.getElementById("menu-toggle");
    this.sidebarBackdrop = document.getElementById("sidebar-backdrop");

    this.progressPercentText = document.getElementById("progress-percent");
    this.progressBar = document.getElementById("progress-bar");
    this.modulesList = document.getElementById("modules-list");

    // Onboarding elements
    this.onboardingOverlay = document.getElementById("onboarding-overlay");
    this.onboardingScreen1 = document.getElementById("onboarding-screen-1");
    this.onboardingScreen2 = document.getElementById("onboarding-screen-2");

    this.chkTerms = document.getElementById("chk-terms");
    this.chkPrivacy = document.getElementById("chk-privacy");
    this.chkEula = document.getElementById("chk-eula");

    this.btnOnboardingNext1 = document.getElementById("btn-onboarding-next-1");
    this.btnOnboardingBack = document.getElementById("btn-onboarding-back");
    this.btnOnboardingStart = document.getElementById("btn-onboarding-start");

    this.inputStudentName = document.getElementById("input-student-name");

    this.linkTerms = document.getElementById("link-terms");
    this.linkPrivacy = document.getElementById("link-privacy");
    this.linkEula = document.getElementById("link-eula");

    this.legalModal = document.getElementById("legal-modal");
    this.legalModalTitle = document.getElementById("legal-modal-title");
    this.legalModalBody = document.getElementById("legal-modal-body");
    this.btnCloseLegalModal = document.getElementById("btn-close-legal-modal");
  },

  bindEvents() {
    this.btnPrev.addEventListener("click", () => this.goToPrevSlide());
    this.btnNext.addEventListener("click", () => this.goToNextSlide());
    this.btnBypassTimer.addEventListener("click", () => this.toggleTimerBypass());
    this.btnResetProgress.addEventListener("click", () => this.resetProgress());

    // Mobile menu events
    this.menuToggle.addEventListener("click", () => this.toggleSidebar(true));
    this.sidebarBackdrop.addEventListener("click", () => this.toggleSidebar(false));

    // Onboarding events
    const checkScreen1Consents = () => {
      this.btnOnboardingNext1.disabled = !(this.chkTerms.checked && this.chkPrivacy.checked && this.chkEula.checked);
    };

    this.chkTerms.addEventListener("change", checkScreen1Consents);
    this.chkPrivacy.addEventListener("change", checkScreen1Consents);
    this.chkEula.addEventListener("change", checkScreen1Consents);

    this.btnOnboardingNext1.addEventListener("click", () => {
      this.onboardingScreen1.style.display = "none";
      this.onboardingScreen2.style.display = "flex";
      this.inputStudentName.focus();
    });

    this.btnOnboardingBack.addEventListener("click", () => {
      this.onboardingScreen2.style.display = "none";
      this.onboardingScreen1.style.display = "flex";
    });

    const checkNameInput = () => {
      const nameVal = this.inputStudentName.value.trim();
      this.btnOnboardingStart.disabled = (nameVal.length < 2);
    };

    this.inputStudentName.addEventListener("input", checkNameInput);
    this.inputStudentName.addEventListener("keyup", (e) => {
      if (e.key === "Enter" && !this.btnOnboardingStart.disabled) {
        this.startCourseAfterOnboarding();
      }
    });

    this.btnOnboardingStart.addEventListener("click", () => this.startCourseAfterOnboarding());

    // Legal link clicks
    this.linkTerms.addEventListener("click", (e) => {
      e.preventDefault();
      this.showLegalModal("terms");
    });
    this.linkPrivacy.addEventListener("click", (e) => {
      e.preventDefault();
      this.showLegalModal("privacy");
    });
    this.linkEula.addEventListener("click", (e) => {
      e.preventDefault();
      this.showLegalModal("eula");
    });

    this.btnCloseLegalModal.addEventListener("click", () => {
      this.legalModal.style.display = "none";
    });

    this.legalModal.addEventListener("click", (e) => {
      if (e.target === this.legalModal) {
        this.legalModal.style.display = "none";
      }
    });
  },

  startCourseAfterOnboarding() {
    this.studentName = this.inputStudentName.value.trim();
    this.consented = true;

    // Hide onboarding overlay
    this.onboardingOverlay.style.display = "none";

    // Save to LMS / SCORM
    this.saveLMSData();

    // Refresh modules and show slide 1 (index 0)
    this.renderModulesSidebar();
    this.currentSlideIndex = 0;
    this.showSlide(0);
  },

  showLegalModal(type) {
    let title = "";
    let html = "";

    if (type === "terms") {
      title = "Términos y Condiciones (T&C)";
      html = `
        <h4>1. Aceptación de los Términos</h4>
        <p>Al acceder y utilizar este curso de capacitación en Prevención de Riesgos Digitales (PRD), usted acepta quedar vinculado por los presentes Términos y Condiciones, así como por todas las leyes y regulaciones aplicables en España.</p>
        
        <h4>2. Propiedad Intelectual y Restricción de Uso</h4>
        <p>El acceso a este curso otorga una licencia personal, intransferible y no exclusiva. Queda estrictamente prohibida la reproducción, distribución, comunicación pública, transformación o grabación (incluyendo capturas de pantalla o software de grabación de pantalla) total o parcial del contenido sin autorización previa, expresa y por escrito de los titulares de los derechos.</p>
        
        <h4>3. Exención de Responsabilidad (Disclaimer Legal)</h4>
        <p>El contenido de este curso, incluidas las referencias a normativas y marcos legales, se proporciona con fines estrictamente informativos y educativos. En ningún caso constituye asesoramiento legal, técnico, jurídico o profesional. Los autores y la entidad organizadora no se hacen responsables de las decisiones tomadas o de los daños y perjuicios derivados de la aplicación de los conocimientos adquiridos en este curso.</p>
        
        <h4>4. Cancelación de Acceso</h4>
        <p>La organización se reserva el derecho de suspender o cancelar inmediatamente el acceso al curso a cualquier usuario que sea detectado compartiendo sus credenciales de acceso o distribuyendo el material protegido, sin derecho a reembolso y reservándose el derecho a iniciar acciones legales.</p>
      `;
    } else if (type === "privacy") {
      title = "Política de Privacidad (Cumplimiento RGPD)";
      html = `
        <h4>1. Responsable del Tratamiento de Datos</h4>
        <p>El responsable del tratamiento de los datos recabados en este curso de formación es <b>Kizuna Global Initiatives Socials</b>.</p>
        
        <h4>2. Datos Obtenidos y Finalidad</h4>
        <p>Procesamos tu nombre completo, dirección de correo electrónico, respuestas a cuestionarios y tu progreso del curso. La única finalidad es la correcta realización de la acción formativa y la generación automática de tu diploma de superación.</p>
        
        <h4>3. Legitimación del Tratamiento</h4>
        <p>La base jurídica para el tratamiento es el consentimiento del alumno que se presta de forma explícita antes de iniciar el curso formativo al marcar la casilla correspondiente.</p>
        
        <h4>4. Conservación y Seguridad</h4>
        <p>Los datos se guardarán de forma totalmente confidencial y segura mientras el curso de formación esté disponible en la plataforma y sean necesarios para justificar su superación ante auditorías externas.</p>
        
        <h4>5. Tus Derechos</h4>
        <p>Tienes derecho a acceder, rectificar, limitar y suprimir tus datos de carácter personal en cualquier momento poniéndose en contacto con el administrador del LMS o enviando un correo al canal oficial de Kizuna Global.</p>
      `;
    } else if (type === "eula") {
      title = "Acuerdo de Licencia de Usuario Final (EULA)";
      html = `
        <h4>1. Licencia de Uso Limitada</h4>
        <p>Se te otorga una licencia limitada, revocable, no exclusiva e intransferible para ver el material interactivo didáctico únicamente con propósitos educativos de carácter interno.</p>
        
        <h4>2. Prohibición de Ingeniería Inversa y Extracción</h4>
        <p>Queda estrictamente prohibido realizar cualquier tipo de copia, descompilación, extracción de base de datos de slides, o distribución comercial del código fuente o activos multimedia de esta aplicación interactiva.</p>
        
        <h4>3. Exclusión de Garantía</h4>
        <p>Esta aplicación interactiva del curso se proporciona "TAL CUAL" sin garantías de rendimiento, idoneidad comercial o ausencia de errores. El estudiante asume la responsabilidad exclusiva de aplicar los conceptos presentados.</p>
      `;
    }

    this.legalModalTitle.textContent = title;
    this.legalModalBody.innerHTML = html;
    this.legalModal.style.display = "flex";
  },

  resetProgress() {
    if (true || confirm("¿Estás seguro de que deseas reiniciar todo tu progreso del curso? Esto borrará el historial de diapositivas leídas, respuestas de los cuestionarios y datos de registro, devolviéndote a la pantalla de bienvenida.")) {
      this.isResetting = true;

      // Clear SCORM variables
      ScormWrapper.setValue("cmi.core.suspend_data", "");
      ScormWrapper.setValue("cmi.core.lesson_location", "0");
      ScormWrapper.setValue("cmi.core.lesson_status", "incomplete");
      ScormWrapper.commit();

      // Clear local storage for Mock SCORM testing
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("mock_scorm_")) {
          localStorage.removeItem(key);
        }
      }

      // Reload page to start fresh onboarding
      window.location.reload();
    }
  },

  toggleTimerBypass() {
    this.timerBypassed = !this.timerBypassed;

    if (this.timerBypassed) {
      this.btnBypassTimer.classList.add("active");
      this.btnBypassTimer.innerHTML = `<span>⏱️ Tiempo Bypass</span>`;

      // Cancel active timer immediately
      if (this.currentTimer) {
        clearInterval(this.currentTimer);
        this.currentTimer = null;
      }
      this.secondsRemaining = 0;
      this.timerIndicator.style.display = "none";
      this.btnNext.disabled = false;
      this.timerProgressLine.style.width = "100%";

      if (typeof this.onTimerFinished === 'function') {
        this.onTimerFinished();
      }
    } else {
      this.btnBypassTimer.classList.remove("active");
      this.btnBypassTimer.innerHTML = `<span>⏱️ Desactivar Tiempo</span>`;

      // Reload current slide to restore timer restrictions if not completed
      const isCompleted = this.completedSlides.has(this.currentSlideIndex);
      if (!isCompleted) {
        this.showSlide(this.currentSlideIndex);
      }
    }
  },

  toggleSidebar(open) {
    if (open) {
      this.sidebar.classList.add("open");
      this.sidebarBackdrop.classList.add("active");
    } else {
      this.sidebar.classList.remove("open");
      this.sidebarBackdrop.classList.remove("active");
    }
  },

  loadLMSData() {
    // 1. Get slide bookmark
    const location = ScormWrapper.getValue("cmi.core.lesson_location");
    if (location && !isNaN(parseInt(location))) {
      this.currentSlideIndex = parseInt(location);
      if (this.currentSlideIndex < 0 || this.currentSlideIndex >= COURSE_DATA.slides.length) {
        this.currentSlideIndex = 0;
      }
    } else {
      this.currentSlideIndex = 0;
    }

    this.highestVisitedIndex = this.currentSlideIndex;

    // 2. Get suspend data (completed slides, quiz scores, answers, onboarding)
    const suspendDataStr = ScormWrapper.getValue("cmi.core.suspend_data");
    if (suspendDataStr) {
      try {
        const suspendData = JSON.parse(suspendDataStr);
        if (suspendData.completed) {
          this.completedSlides = new Set(suspendData.completed);
        }
        if (suspendData.highestVisitedIndex) {
          this.highestVisitedIndex = Math.max(this.highestVisitedIndex, suspendData.highestVisitedIndex);
        }
        if (suspendData.userAnswers) {
          this.userAnswers = suspendData.userAnswers;
        }
        if (suspendData.oceanAnswers) {
          this.oceanAnswers = suspendData.oceanAnswers;
        }
        if (suspendData.totalTime) {
          this.totalAccumulatedSeconds = suspendData.totalTime;
        }
        if (suspendData.studentName) {
          this.studentName = suspendData.studentName;
        }
        if (suspendData.consented) {
          this.consented = suspendData.consented;
        }
      } catch (e) {
        console.error("Error parsing SCORM suspend_data:", e);
      }
    }

    // Ensure slide 0 is always completed once viewed
    this.completedSlides.add(0);
  },

  saveLMSData() {
    if (this.isResetting) return;

    const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const accumulated = this.totalAccumulatedSeconds + elapsed;

    const suspendData = {
      completed: Array.from(this.completedSlides),
      highestVisitedIndex: this.highestVisitedIndex,
      userAnswers: this.userAnswers,
      oceanAnswers: this.oceanAnswers,
      totalTime: accumulated,
      studentName: this.studentName,
      consented: this.consented
    };

    ScormWrapper.setValue("cmi.core.suspend_data", JSON.stringify(suspendData));
    ScormWrapper.setValue("cmi.core.lesson_location", this.currentSlideIndex);

    // Set SCORM session time
    ScormWrapper.setValue("cmi.core.session_time", this.formatScormTime(elapsed));

    // Check if course is fully completed
    this.checkCourseCompletion();

    ScormWrapper.commit();
  },

  checkCourseCompletion() {
    // A course is complete if the user reached the final slide AND passed all quizzes
    const finalSlideReached = this.completedSlides.has(COURSE_DATA.slides.length - 1);

    // Check if all quizzes are passed
    let allQuizzesPassed = true;
    for (let m = 1; m <= 7; m++) {
      const scoreKey = `mock_scorm_cmi.core.score.raw`; // standard local check
      const statusKey = `mock_scorm_cmi.core.lesson_status`;
      // Actually we check our internal score or LMS status
      // In this SPA, we track completion state of feedback slides
      const feedbackSlide = COURSE_DATA.slides.find(s => s.module_id === m && s.type === 'quiz_feedback');
      if (feedbackSlide && !this.completedSlides.has(feedbackSlide.id)) {
        allQuizzesPassed = false;
        break;
      }
    }

    if (finalSlideReached && allQuizzesPassed) {
      ScormWrapper.setValue("cmi.core.lesson_status", "passed");
    } else {
      ScormWrapper.setValue("cmi.core.lesson_status", "incomplete");
    }
  },

  renderModulesSidebar() {
    this.modulesList.innerHTML = "";

    // Determine the active module
    const currentSlide = COURSE_DATA.slides[this.currentSlideIndex];
    const activeModuleId = currentSlide ? currentSlide.module_id : 0;

    COURSE_DATA.modules.forEach(mod => {
      // A module is locked if it is not the active module AND some preceding module is not fully completed
      let isLocked = false;
      if (mod.id !== activeModuleId) {
        const precedingModules = COURSE_DATA.modules.filter(m => m.id < mod.id);
        const hasUncompletedPreceding = precedingModules.some(pm => {
          const pmSlides = COURSE_DATA.slides.filter(s => s.module_id === pm.id);
          return !pmSlides.every(s => this.completedSlides.has(s.id));
        });
        isLocked = hasUncompletedPreceding;
      }
      const isActive = mod.id === activeModuleId;

      // Check if module is completed (all content slides in this module are completed, and if it has a quiz, the feedback slide is completed)
      const moduleSlides = COURSE_DATA.slides.filter(s => s.module_id === mod.id);
      const isCompleted = moduleSlides.every(s => this.completedSlides.has(s.id));

      const item = document.createElement("div");
      item.className = `module-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;

      let icon = "🔒";
      if (!isLocked) {
        icon = isCompleted ? "✓" : "○";
      }
      if (isActive) {
        icon = "▶";
      }

      item.innerHTML = `
        <div class="module-icon-container">
          <span class="module-icon">${icon}</span>
        </div>
        <div class="module-info">
          <div class="module-num">Módulo ${mod.id}</div>
          <div class="module-title-text">${mod.title}</div>
        </div>
      `;

      if (!isLocked) {
        item.addEventListener("click", () => {
          this.toggleSidebar(false);
          // Navigate to the first slide of this module
          const firstSlideOfModule = COURSE_DATA.slides.find(s => s.module_id === mod.id);
          if (firstSlideOfModule) {
            this.showSlide(firstSlideOfModule.id);
          }
        });
      }

      this.modulesList.appendChild(item);
    });

    // Update general progress bar
    // Let's count slides that are of content type to calculate percent, or just total completed
    const percent = Math.round((this.completedSlides.size / COURSE_DATA.slides.length) * 100);
    this.progressPercentText.textContent = `${percent}%`;
    this.progressBar.style.width = `${percent}%`;
  },

  showSlide(index) {
    if (index < 0 || index >= COURSE_DATA.slides.length) return;

    // Clear any active timer
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
      this.currentTimer = null;
    }

    // Clear custom mindfulness hooks
    this.onTimerTick = null;
    this.onTimerFinished = null;

    // Clear any active quiz typewriter animations
    this.clearQuizAnimations();

    this.currentSlideIndex = index;
    this.highestVisitedIndex = Math.max(this.highestVisitedIndex, index);

    const slide = COURSE_DATA.slides[index];
    const isCompleted = this.completedSlides.has(index);

    // Dynamic module theme class
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.className = appContainer.className.replace(/\bmodule-theme-\d+\b/g, "").trim();
      appContainer.classList.add(`module-theme-${slide.module_id}`);
    }

    // Toggle display of main content container and quiz container
    const isQuiz = (slide.type === 'quiz_question' || slide.type === 'quiz_feedback');
    this.contentContainer.style.display = isQuiz ? "none" : "flex";
    let quizContainer = document.getElementById("quiz-container");
    if (quizContainer) {
      quizContainer.style.display = isQuiz ? "block" : "none";
    }

    // Update Header
    this.headerModuleTitle.textContent = `MÓDULO ${slide.module_id}: ${slide.module_title}`;
    this.headerSlideTitle.textContent = slide.title || "Contenido";
    this.slideCounter.textContent = `${index + 1} / ${COURSE_DATA.slides.length}`;

    // Update active class in sidebar
    this.renderModulesSidebar();

    // Render content depending on Slide type
    this.isQuizActive = (slide.type === 'quiz_question');

    if (slide.type === 'quiz_question') {
      this.renderQuizQuestion(slide);
    } else if (slide.type === 'quiz_feedback') {
      this.renderQuizFeedback(slide);
    } else if (slide.type === 'final') {
      this.renderFinalSlide(slide);
    } else if (slide.type === 'image') {
      this.renderImageSlide(slide);
    } else {
      this.renderContentSlide(slide);
    }

    // Reset timer line
    this.timerProgressLine.style.width = "0%";

    // Handle Navigation buttons state and Timer
    if (this.isQuizActive) {
      // Sidebar is hidden when quiz is active to prevent navigating away
      this.sidebar.style.pointerEvents = "none";
      this.sidebar.style.opacity = "0.3";
      this.btnPrev.style.display = "none";
      this.menuToggle.style.display = "none";
    } else {
      this.sidebar.style.pointerEvents = "all";
      this.sidebar.style.opacity = "1";
      this.btnPrev.style.display = "flex";
      this.menuToggle.style.display = "";

      // First slide cannot go back
      this.btnPrev.disabled = (index === 0);
    }

    // Enforce slide timer
    if (isCompleted || this.timerBypassed) {
      this.secondsRemaining = 0;
      this.timerIndicator.style.display = "none";
      this.btnNext.disabled = false;
      this.timerProgressLine.style.width = "100%";

      if (slide.type === 'quiz_question') {
        // In a question that is already completed (passed quiz), we allow advancing immediately
        const nextBtnText = this.isLastQuestionOfQuiz(slide) ? "Enviar Respuestas" : "Siguiente Pregunta";
        this.btnNext.innerHTML = `<span>${nextBtnText}</span> ▶`;
      } else {
        this.btnNext.innerHTML = `<span>Siguiente</span> ▶`;
      }
    } else {
      this.secondsRemaining = slide.time;

      if (this.secondsRemaining > 0) {
        this.btnNext.disabled = true;
        this.timerIndicator.style.display = "flex";
        this.timerText.textContent = `${this.secondsRemaining}s`;

        // Show next button text as active type
        const nextBtnText = (slide.type === 'quiz_question') ?
          (this.isLastQuestionOfQuiz(slide) ? "Enviar Respuestas" : "Siguiente Pregunta") : "Siguiente";
        this.btnNext.innerHTML = `<span>${nextBtnText}</span> ▶`;

        const totalDuration = this.secondsRemaining;
        this.currentTimer = setInterval(() => {
          if (this.timerBypassed) {
            clearInterval(this.currentTimer);
            this.currentTimer = null;
            this.secondsRemaining = 0;
            this.timerIndicator.style.display = "none";
            this.btnNext.disabled = false;
            this.timerProgressLine.style.width = "100%";

            if (typeof this.onTimerFinished === 'function') {
              this.onTimerFinished();
            }
            return;
          }
          this.secondsRemaining--;
          if (this.secondsRemaining <= 0) {
            clearInterval(this.currentTimer);
            this.currentTimer = null;
            this.timerIndicator.style.display = "none";
            this.btnNext.disabled = false;

            if (typeof this.onTimerFinished === 'function') {
              this.onTimerFinished();
            }

            this.timerProgressLine.style.width = "100%";
            this.completedSlides.add(index);
            this.saveLMSData();
          } else {
            this.timerText.textContent = `${this.secondsRemaining}s`;
            const pct = ((totalDuration - this.secondsRemaining) / totalDuration) * 100;
            this.timerProgressLine.style.width = `${pct}%`;

            if (typeof this.onTimerTick === 'function') {
              this.onTimerTick(this.secondsRemaining, totalDuration);
            }
          }
        }, 1000);
      } else {
        this.timerIndicator.style.display = "none";
        this.btnNext.disabled = false;
        this.timerProgressLine.style.width = "100%";
        this.completedSlides.add(index);
        this.saveLMSData();

        const nextBtnText = (slide.type === 'quiz_question') ?
          (this.isLastQuestionOfQuiz(slide) ? "Enviar Respuestas" : "Siguiente Pregunta") : "Siguiente";
        this.btnNext.innerHTML = `<span>${nextBtnText}</span> ▶`;
      }
    }
  },

  renderContentSlide(slide) {
    if (slide.layout === 'mindfulness') {
      this.renderMindfulness(slide);
      return;
    }
    if (slide.layout === 'ransomware_sort') {
      this.renderRansomware(slide);
      return;
    }
    if (slide.layout === 'phishing_sort') {
      this.renderPhishing(slide);
      return;
    }

    // Show cards
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "block";

    // Set titles
    this.visualTitle.textContent = slide.visual_title || slide.title || "Prevención de Riesgos Digitales";

    // Custom interactive layouts (Tabs, Accordions, Flipcards)
    if (slide.layout && ['tabs', 'accordions', 'flipcards'].includes(slide.layout)) {
      let introHtml = "";
      let items = [];

      slide.text_on_screen.forEach(line => {
        let trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          let cleanLine = trimmed.replace(/^[•-]\s*/, "");
          let parts = cleanLine.split(":");
          if (parts.length >= 2 && parts[0].length < 60) {
            items.push({
              title: parts[0].trim(),
              text: parts.slice(1).join(":").trim()
            });
          } else {
            introHtml += `<p class="slide-plain-text">${cleanLine}</p>`;
          }
        } else {
          let parts = trimmed.split(":");
          if (parts.length >= 2 && parts[0].length < 60) {
            items.push({
              title: parts[0].trim(),
              text: parts.slice(1).join(":").trim()
            });
          } else {
            if (trimmed.endsWith(':') && trimmed.length < 60) {
              introHtml += `<p class="slide-context-header">${trimmed}</p>`;
            } else {
              introHtml += `<p class="slide-plain-text">${trimmed}</p>`;
            }
          }
        }
      });

      let interactiveHtml = "";
      if (slide.layout === 'tabs') {
        interactiveHtml = this.buildTabsMarkup(items, slide.id);
      } else if (slide.layout === 'accordions') {
        interactiveHtml = this.buildAccordionsMarkup(items, slide.id);
      } else if (slide.layout === 'flipcards') {
        interactiveHtml = this.buildFlipCardsMarkup(items, slide.id);
      }

      let finalHtml = introHtml + interactiveHtml;

      if (slide.image_desc) {
        const cleanImgDesc = slide.image_desc.replace(/\[REVELAR\]/gi, "").trim();
        const imgSrc = slide.image_file ? `images/${slide.image_file}` : `images/slide_${slide.id}.jpg`;
        finalHtml += `
          <div class="image-placeholder">
            <div class="image-placeholder-icon">📷</div>
            <div class="image-placeholder-path">${imgSrc}</div>
            <div class="image-placeholder-desc"><b>Ilustración sugerida:</b> ${cleanImgDesc}</div>
            <img src="${imgSrc}" alt="${slide.title}" style="display:none; width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" 
                 onerror="this.style.display='none';" 
                 onload="this.style.display='block'; this.previousElementSibling.style.display='none'; this.previousElementSibling.previousElementSibling.style.display='none'; this.previousElementSibling.previousElementSibling.previousElementSibling.style.display='none';">
          </div>
        `;
      }

      this.screenTextContent.innerHTML = finalHtml;

      if (slide.layout === 'tabs') {
        this.bindTabsEvents(slide.id);
      } else if (slide.layout === 'accordions') {
        this.bindAccordionsEvents(slide.id);
      } else if (slide.layout === 'flipcards') {
        this.bindFlipCardsEvents(slide.id);
      }

      this.renderExtendedText(slide.extended_text);
      return;
    }

    // Check if it's the Resumen Ejecutivo slide (Matriz Legal) in Module 0
    if (slide.title.includes("Resumen Ejecutivo") || slide.title.includes("Matriz Legal")) {
      this.renderLegalMatrix(slide);
      this.renderExtendedText(slide.extended_text);
      return;
    }

    // Check if it's the Autoevaluación slides in Module 2
    if (slide.slide_num_str.includes("Diapositiva 20B")) {
      this.renderOceanDiagnosis(slide);
      return;
    }
    if (slide.slide_num_str.includes("Diapositiva 18") || slide.slide_num_str.includes("Diapositiva 19") || slide.slide_num_str.includes("Diapositiva 20")) {
      this.renderOceanAutoevaluacion(slide);
      this.renderExtendedText(slide.extended_text);
      return;
    }

    // Default formatting: scan text for specialized layout markers
    let html = "";

    // 1. Definition detection
    const isDefinition = slide.title.toLowerCase().includes("definición") ||
      slide.title.toLowerCase().includes("glosario") ||
      slide.text_on_screen.some(line => line.includes("Definición:") || line.includes("Definición legal:"));

    if (isDefinition) {
      html += `<div class="slide-definition-layout">`;

      let defText = "";

      slide.text_on_screen.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const cleanLine = trimmed.replace(/^[•-]\s*/, "");
          const parts = cleanLine.split(":");
          if (parts.length >= 2 && parts[0].length < 60) {
            const cleanTitle = parts[0].trim();
            const cleanText = parts.slice(1).join(":").trim();
            html += `
              <div class="definition-box">
                <div class="definition-title">${cleanTitle}</div>
                <div class="definition-text">${cleanText}</div>
              </div>
            `;
          } else {
            defText += cleanLine + " ";
          }
        } else {
          defText += trimmed + " ";
        }
      });

      if (defText.trim()) {
        html += `
          <div class="definition-box">
            <div class="definition-text">${defText.trim()}</div>
          </div>
        `;
      }

      html += `</div>`;
    } else {
      // 2. Concept Cards Grid or warning box detection
      let inCardGrid = false;

      // Pre-check if there is any bullet that should be rendered as a card
      const useCardsForBullets = slide.text_on_screen.some(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const cleanLine = trimmed.replace(/^[•-]\s*/, "");
          const parts = cleanLine.split(":");
          return parts.length >= 2 && parts[0].length < 60;
        }
        return false;
      });

      slide.text_on_screen.forEach(line => {
        if (!line.strip) line = String(line);
        const trimmed = line.trim();
        if (!trimmed) return;

        // Detect Warning or Danger Box
        if (trimmed.toLowerCase().includes("advertencia:") || trimmed.toLowerCase().includes("riesgo:") || trimmed.toLowerCase().includes("peligro:")) {
          if (inCardGrid) {
            html += `</div>`;
            inCardGrid = false;
          }
          const title = trimmed.split(":")[0];
          const text = trimmed.split(":").slice(1).join(":");
          html += `
            <div class="warning-box">
              <span class="warning-icon">⚠️</span>
              <div class="warning-content">
                <div class="warning-title">${title}</div>
                <div class="warning-text">${text}</div>
              </div>
            </div>
          `;
          return;
        }

        if (trimmed.toLowerCase().includes("obligatorio:") || trimmed.toLowerCase().includes("prohibido:")) {
          if (inCardGrid) {
            html += `</div>`;
            inCardGrid = false;
          }
          const title = trimmed.split(":")[0];
          const text = trimmed.split(":").slice(1).join(":");
          html += `
            <div class="danger-box">
              <span class="danger-icon">❌</span>
              <div class="danger-content">
                <div class="danger-title">${title}</div>
                <div class="danger-text">${text}</div>
              </div>
            </div>
          `;
          return;
        }

        // Card detection (bullet line with title: description format)
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const cleanLine = trimmed.replace(/^[•-]\s*/, "");

          if (useCardsForBullets) {
            if (!inCardGrid) {
              if (html) html += `<div class="cards-grid">`;
              else html = `<div class="cards-grid">`;
              inCardGrid = true;
            }

            const parts = cleanLine.split(":");
            if (parts.length >= 2 && parts[0].length < 60) {
              const cleanTitle = parts[0].trim();
              const cleanText = parts.slice(1).join(":").trim();
              html += `
                <div class="concept-card">
                  <div class="concept-card-title">
                    <div class="concept-card-title-dot"></div>
                    <span>${cleanTitle}</span>
                  </div>
                  <div class="concept-card-text">${cleanText}</div>
                </div>
              `;
            } else {
              // Bullet in a grid with no title or title too long: render as card with only text and a dot
              html += `
                <div class="concept-card">
                  <div class="concept-card-title" style="margin-bottom: 0;">
                    <div class="concept-card-title-dot"></div>
                  </div>
                  <div class="concept-card-text" style="margin-top: 8px;">${cleanLine}</div>
                </div>
              `;
            }
          } else {
            // Standard bullet list item — no cards on this slide
            if (inCardGrid) {
              html += `</div>`;
              inCardGrid = false;
            }
            html += `<p class="slide-bullet-item">• ${cleanLine}</p>`;
          }
        } else {
          if (inCardGrid) {
            html += `</div>`;
            inCardGrid = false;
          }
          // Non-bullet lines: detect contextual sub-headers vs regular paragraphs
          if (trimmed.endsWith(':') && trimmed.length < 60) {
            html += `<p class="slide-context-header">${trimmed}</p>`;
          } else {
            html += `<p class="slide-plain-text">${trimmed}</p>`;
          }
        }
      });

      if (inCardGrid) {
        html += `</div>`;
      }
    }

    // Add Image placeholder if there's any description
    if (slide.image_desc) {
      const cleanImgDesc = slide.image_desc ? slide.image_desc.replace(/\[REVELAR\]/gi, "").trim() : "";
      const imgSrc = slide.image_file ? `images/${slide.image_file}` : `images/slide_${slide.id}.jpg`;
      html += `
        <div class="image-placeholder">
          <div class="image-placeholder-icon">📷</div>
          <div class="image-placeholder-path">${imgSrc}</div>
          <div class="image-placeholder-desc"><b>Ilustración sugerida:</b> ${cleanImgDesc}</div>
          <img src="${imgSrc}" alt="${slide.title}" style="display:none; width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" 
               onerror="this.style.display='none';" 
               onload="this.style.display='block'; this.previousElementSibling.style.display='none'; this.previousElementSibling.previousElementSibling.style.display='none'; this.previousElementSibling.previousElementSibling.previousElementSibling.style.display='none';">
        </div>
      `;
    }

    this.screenTextContent.innerHTML = html;

    // Render Extended text
    this.renderExtendedText(slide.extended_text);
  },

  renderImageSlide(slide) {
    // Show cards
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "block";

    // Set titles
    this.visualTitle.textContent = slide.visual_title || slide.title || "Ilustración de Ciberseguridad";

    const imgPath = `images/${slide.image_file}`;
    const cleanImgDesc = slide.image_desc ? slide.image_desc.replace(/\[REVELAR\]/gi, "").trim() : "";

    let html = `
      <div class="slide-image-layout">
        <div class="image-slide-frame">
          <img src="${imgPath}" alt="${slide.title}" class="image-slide-img"
               onload="this.style.display='block'; document.getElementById('image-fallback-${slide.id}').style.display='none';"
               onerror="this.style.display='none'; document.getElementById('image-fallback-${slide.id}').style.display='flex';">
          <div id="image-fallback-${slide.id}" class="image-slide-fallback">
            <div class="image-fallback-icon">🖼️</div>
            <div class="image-fallback-path">${imgPath}</div>
            <div class="image-fallback-desc">
              <span class="image-fallback-label">Ilustración Normativa Requerida:</span>
              ${cleanImgDesc}
            </div>
          </div>
        </div>
      </div>
    `;

    this.screenTextContent.innerHTML = html;

    // Render Extended text
    this.renderExtendedText(slide.extended_text);
  },

  renderExtendedText(extendedLines) {
    if (extendedLines && extendedLines.length > 0) {
      this.slideExtendedCard.style.display = "block";

      let textHtml = "";
      extendedLines.forEach(line => {
        let cleanLine = line.trim();
        // Strip leading or surrounding quotes
        if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
          cleanLine = cleanLine.substring(1, cleanLine.length - 1);
        } else if (cleanLine.startsWith('"')) {
          cleanLine = cleanLine.substring(1);
        }
        if (cleanLine) {
          textHtml += `<p class="extended-paragraph">${cleanLine}</p>`;
        }
      });
      this.extendedTextContent.innerHTML = textHtml;
    } else {
      this.slideExtendedCard.style.display = "none";
    }
  },

  renderMindfulness(slide) {
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "block";
    this.visualTitle.textContent = slide.visual_title || slide.title || "Mindfulness";

    const isCompleted = this.completedSlides.has(this.currentSlideIndex);
    const slideDuration = slide.time || 20;

    let html = `
      <div class="mindfulness-layout">
        <div class="mindfulness-timer-col">
          <div class="breathing-circle-wrapper">
            <div class="breathing-ring pulse-breathing"></div>
            <div class="breathing-circle">
              <span id="mindfulness-counter">${slideDuration}</span>
            </div>
          </div>
          <div id="breathing-status" class="breathing-status">Sincroniza tu respiración...</div>
        </div>
        <div class="mindfulness-input-col">
          <div class="mindfulness-input-card">
            <h4>Tus Vulnerabilidades Físicas</h4>
            <p class="mindfulness-desc">Escribe al menos 2 vulnerabilidades físicas o malas prácticas que cometas en tu día a día (mínimo 15 caracteres):</p>
            <textarea id="mindfulness-textarea" placeholder="Escribe aquí tus reflexiones... (Ej. Dejo post-its con contraseñas bajo el teclado y a veces me levanto sin bloquear la sesión con Win+L)"></textarea>
            <div id="mindfulness-validation-msg" class="validation-msg">Debes escribir al menos 15 caracteres.</div>
          </div>
        </div>
      </div>
    `;

    this.screenTextContent.innerHTML = html;
    this.renderExtendedText(slide.extended_text);

    const textarea = document.getElementById("mindfulness-textarea");
    const validationMsg = document.getElementById("mindfulness-validation-msg");
    const counterDisplay = document.getElementById("mindfulness-counter");
    const breathingRing = document.querySelector(".breathing-ring");
    const statusText = document.getElementById("breathing-status");

    if (this.userAnswers[slide.id]) {
      textarea.value = this.userAnswers[slide.id];
      validationMsg.style.display = "none";
    }

    this.onTimerTick = (remaining, total) => {
      counterDisplay.textContent = remaining;
      const cycle = (total - remaining) % 16;
      if (cycle < 4) {
        statusText.textContent = "Inhala profundamente...";
        breathingRing.style.transform = "scale(1.25)";
        breathingRing.style.background = "rgba(40, 167, 69, 0.4)";
      } else if (cycle < 8) {
        statusText.textContent = "Retén el aire...";
        breathingRing.style.transform = "scale(1.25)";
        breathingRing.style.background = "rgba(0, 123, 255, 0.4)";
      } else if (cycle < 12) {
        statusText.textContent = "Exhala lentamente...";
        breathingRing.style.transform = "scale(1.0)";
        breathingRing.style.background = "rgba(40, 167, 69, 0.4)";
      } else {
        statusText.textContent = "Espera antes de inhalar...";
        breathingRing.style.transform = "scale(1.0)";
        breathingRing.style.background = "rgba(0, 123, 255, 0.4)";
      }
    };

    this.onTimerFinished = () => {
      counterDisplay.textContent = "0";
      statusText.textContent = "¡Tiempo completado! Puedes continuar.";
      breathingRing.classList.remove("pulse-breathing");
      breathingRing.style.transform = "scale(1.0)";
      breathingRing.style.background = "rgba(40, 167, 69, 0.2)";
      this.checkMindfulnessValidity();
    };

    textarea.addEventListener("input", () => {
      const text = textarea.value.trim();
      this.userAnswers[slide.id] = text;
      this.saveLMSData();

      if (text.length >= 15) {
        validationMsg.style.color = "#28a745";
        validationMsg.textContent = "¡Vulnerabilidades registrada correctamente!";
        validationMsg.style.display = "block";
      } else {
        validationMsg.style.color = "var(--primary-hover)";
        validationMsg.textContent = "Debes escribir al menos 15 caracteres.";
        validationMsg.style.display = "block";
      }
      this.checkMindfulnessValidity();
    });

    this.checkMindfulnessValidity();
  },

  checkMindfulnessValidity() {
    const slide = COURSE_DATA.slides[this.currentSlideIndex];
    if (slide && slide.layout === 'mindfulness') {
      const textarea = document.getElementById("mindfulness-textarea");
      const hasText = textarea && textarea.value.trim().length >= 15;
      const isTimerDone = this.secondsRemaining <= 0 || this.completedSlides.has(this.currentSlideIndex);
      this.btnNext.disabled = !(hasText && isTimerDone);
    }
  },

  renderRansomware(slide) {
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "block";
    this.visualTitle.textContent = slide.visual_title || slide.title || "Simulacro de Ransomware";

    const isCompleted = this.completedSlides.has(this.currentSlideIndex);

    let html = `
      <div class="ransomware-layout">
        <div class="terminal-frame">
          <div class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">ALERTA DE SEGURIDAD - SISTEMA BAJO ATAQUE</span>
          </div>
          <div id="ransomware-terminal-body" class="terminal-body">
            <p class="blink-red">[ALERTA RANSOMWARE] ARCHIVOS CIFRADOS DETECTADOS</p>
            <p>Se ha iniciado un secuestro masivo de datos en segundo plano...</p>
            <p>Extensión: .locked</p>
            <p class="warning-text">¡PELIGRO! La infección se propagará por la red local si no actúas inmediatamente.</p>
            <div id="terminal-instructions">
              <p class="highlight-yellow">DESAFÍO: Ordena el protocolo de reacción de 4 pasos para mitigar el ataque.</p>
              <p>Haz clic en las tarjetas de abajo en el orden correcto (del 1 al 4) para desactivar la alarma.</p>
            </div>
          </div>
        </div>
        
        <div class="ransomware-cards-grid">
    `;

    const cardsData = [
      {
        step: 2,
        text: "Desconectar redes (primero RJ45, si es solo wifi intentar hacerlo con botones hardware)",
        desc: "Aísla el ordenador físicamente para evitar que el ransomware se propague al resto de equipos de la empresa."
      },
      {
        step: 3,
        text: "Evitar apagar el PC y no tocar nada ni interactuar",
        desc: "Apagar el PC borra la memoria RAM, destruyendo las evidencias y las claves criptográficas."
      },
      {
        step: 1,
        text: "Calma y reflexión",
        desc: "El pánico nos lleva a cometer errores, como intentar solucionarlo solos o usar IAs públicas que exponen datos."
      },
      {
        step: 4,
        text: "Activar protocolos y comunicar",
        desc: "Informa de inmediato a soporte de IT usando un canal alternativo y seguro, nunca el equipo infectado."
      }
    ];

    cardsData.forEach(c => {
      html += `
        <div class="flip-card ransomware-card" data-step="${c.step}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="flip-title" style="font-size: 0.95rem; text-align: center; color: var(--text-primary); font-weight: normal; margin-bottom: 0;">
                ${c.text}
              </div>
              <div class="flip-hint" style="margin-top: 12px;">❓ Hacer Clic</div>
            </div>
            <div class="flip-card-back" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: #28a745; margin-bottom: 8px;">Paso ${c.step}</div>
              <div class="flip-desc" style="font-size: 0.85rem;">${c.desc}</div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.screenTextContent.innerHTML = html;
    this.renderExtendedText(slide.extended_text);

    // Disable Next button initially unless completed
    if (!isCompleted) {
      this.btnNext.disabled = true;
    }

    this.onTimerFinished = () => {
      if (nextStepToClick <= 4) {
        this.btnNext.disabled = true;
      } else {
        this.btnNext.disabled = false;
      }
    };

    let nextStepToClick = 1;

    const cards = document.querySelectorAll(".ransomware-card");
    const terminalBody = document.getElementById("ransomware-terminal-body");

    if (isCompleted) {
      nextStepToClick = 5;
      cards.forEach(card => card.classList.add("flipped"));
      terminalBody.classList.add("success-state");
      terminalBody.innerHTML = `
        <p class="success-title">[PROTOCOLO COMPLETADO CON ÉXITO - AMENAZA CONTENIDA]</p>
        <p>Has desactivado el ransomware y aislado la máquina local de la red a tiempo.</p>
        <p>Procedimiento auditado y validado de forma satisfactoria.</p>
      `;
    }

    cards.forEach(card => {
      card.addEventListener("click", () => {
        if (nextStepToClick > 4) return; // already completed

        const step = parseInt(card.getAttribute("data-step"));

        if (card.classList.contains("flipped")) return;

        if (step === nextStepToClick) {
          card.classList.add("flipped");
          nextStepToClick++;

          if (nextStepToClick > 4) {
            // Success!
            terminalBody.classList.add("success-state");
            terminalBody.innerHTML = `
              <p class="success-title">[PROTOCOLO COMPLETADO CON ÉXITO - AMENAZA CONTENIDA]</p>
              <p>Has desactivado el ransomware y aislado la máquina local de la red a tiempo.</p>
              <p>Procedimiento auditado y validado de forma satisfactoria.</p>
            `;
            this.btnNext.disabled = false;
            this.completedSlides.add(this.currentSlideIndex);
            this.saveLMSData();
          }
        } else {
          // Wiggle animation on error
          card.classList.add("wiggle-error");
          setTimeout(() => {
            card.classList.remove("wiggle-error");
          }, 500);
        }
      });
    });
  },

  renderPhishing(slide) {
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "block";
    this.visualTitle.textContent = slide.visual_title || slide.title || "Simulacro de Phishing";

    const isCompleted = this.completedSlides.has(this.currentSlideIndex);

    let html = `
      <div class="phishing-layout">
        <div class="email-frame">
          <div class="email-header">
            <div class="email-meta-row">
              <span class="meta-label">De:</span>
              <span class="meta-value email-sender-warning">soporte@admin.miempresa.com <span class="warning-badge">⚠️ Externo</span></span>
            </div>
            <div class="email-meta-row">
              <span class="meta-label">Para:</span>
              <span class="meta-value">empleado@miempresa.com</span>
            </div>
            <div class="email-meta-row">
              <span class="meta-label">Asunto:</span>
              <span class="meta-value email-subject-urgent">¡URGENTE! Cambio de política de contraseñas de seguridad</span>
            </div>
          </div>
          <div id="phishing-email-body" class="email-body">
            <p>Estimado empleado,</p>
            <p>Se ha detectado un acceso no autorizado a tu cuenta corporativa. De acuerdo con nuestra política de seguridad, es <strong>obligatorio</strong> que verifiques tus credenciales en las próximas 24 horas.</p>
            <p class="highlight-urgency">De lo contrario, tu cuenta será suspendida de forma permanente de acuerdo con las normativas corporativas.</p>
            <div class="email-cta-container">
              <span class="email-cta-btn">Actualizar Credenciales</span>
              <span class="tooltip-url">Enlace real: http://miempresa.seguridad-verificar.com/login</span>
            </div>
            <p>Atentamente,<br>Departamento de Soporte IT y Seguridad</p>
          </div>
        </div>
        
        <div class="phishing-cards-grid">
    `;

    const cardsData = [
      {
        step: 1,
        text: "Leer atentamente y mantener la calma",
        desc: "El remitente sospechoso (@admin.miempresa.com) y la urgencia son tácticas típicas de ingeniería social."
      },
      {
        step: 3,
        text: "Revisar con el ratón links sospechosos o url escondidas tras el texto",
        desc: "Posar el ratón revela que el enlace apunta a un dominio externo no oficial (seguridad-verificar.com)."
      },
      {
        step: 4,
        text: "Comunicar correo sospechoso y contactar con la persona o personas afectadas si hay posible suplantacion",
        desc: "Envía el correo al departamento de seguridad y avisa a los compañeros para evitar que caigan en la trampa."
      },
      {
        step: 2,
        text: "Revisar si el correo tiene rasgos de phishing como urgencia, represalias, o adjuntos etc.",
        desc: "La amenaza de suspender la cuenta y la urgencia de 24 horas son señales de alarma evidentes."
      }
    ];

    cardsData.forEach(c => {
      html += `
        <div class="flip-card phishing-card" data-step="${c.step}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="flip-title" style="font-size: 0.95rem; text-align: center; color: var(--text-primary); font-weight: normal; margin-bottom: 0;">
                ${c.text}
              </div>
              <div class="flip-hint" style="margin-top: 12px;">❓ Hacer Clic</div>
            </div>
            <div class="flip-card-back" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;">
              <div style="font-size: 1.2rem; font-weight: 700; color: #28a745; margin-bottom: 8px;">Paso ${c.step}</div>
              <div class="flip-desc" style="font-size: 0.85rem;">${c.desc}</div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.screenTextContent.innerHTML = html;
    this.renderExtendedText(slide.extended_text);

    // Disable Next button initially unless completed
    if (!isCompleted) {
      this.btnNext.disabled = true;
    }

    this.onTimerFinished = () => {
      if (nextStepToClick <= 4) {
        this.btnNext.disabled = true;
      } else {
        this.btnNext.disabled = false;
      }
    };

    let nextStepToClick = 1;

    const cards = document.querySelectorAll(".phishing-card");
    const emailBody = document.getElementById("phishing-email-body");

    if (isCompleted) {
      nextStepToClick = 5;
      cards.forEach(card => card.classList.add("flipped"));
      emailBody.classList.add("success-state");
      emailBody.innerHTML = `
        <p class="success-title">[SIMULACRO COMPLETADO - AMENAZA CONTENIDA]</p>
        <p>Has detectado correctamente el correo phishing y notificado al departamento de seguridad.</p>
        <p>¡Excelente trabajo! Has protegido tu identidad y los accesos de la organización.</p>
      `;
    }

    cards.forEach(card => {
      card.addEventListener("click", () => {
        if (nextStepToClick > 4) return; // already completed

        const step = parseInt(card.getAttribute("data-step"));

        if (card.classList.contains("flipped")) return;

        if (step === nextStepToClick) {
          card.classList.add("flipped");
          nextStepToClick++;

          if (nextStepToClick > 4) {
            // Success!
            emailBody.classList.add("success-state");
            emailBody.innerHTML = `
              <p class="success-title">[SIMULACRO COMPLETADO - AMENAZA CONTENIDA]</p>
              <p>Has detectado correctamente el correo phishing y notificado al departamento de seguridad.</p>
              <p>¡Excelente trabajo! Has protegido tu identidad y los accesos de la organización.</p>
            `;
            this.btnNext.disabled = false;
            this.completedSlides.add(this.currentSlideIndex);
            this.saveLMSData();
          }
        } else {
          // Wiggle animation on error
          card.classList.add("wiggle-error");
          setTimeout(() => {
            card.classList.remove("wiggle-error");
          }, 500);
        }
      });
    });
  },

  renderLegalMatrix(slide) {
    // The visual table data
    const rows = [
      { ambito: "Identidad y Firma", normativa: "eIDAS 2.0, RD-ley 6/2023, Código Penal" },
      { ambito: "Seguridad e IA", normativa: "NIS2, AI Act, ISO 27001, CRA" },
      { ambito: "Privacidad y Datos", normativa: "RGPD, LOPDGDD, ENS" },
      { ambito: "Entorno Laboral", normativa: "Ley 10/2021, Ley 31/1995 (PRL), Ley 2/2023" },
      { ambito: "Salud Mental y Ética", normativa: "LOPDGDD, AI Act, PRL" },
      { ambito: "Gestión de Crisis y Brechas", normativa: "RGPD, NIS2, ENS" }
    ];

    let html = `
      <p style="margin-bottom: 16px;">Consolidado de obligaciones legales y normativas aplicables a la Prevención de Riesgos Digitales:</p>
      <div class="table-container">
        <table class="responsive-table">
          <thead>
            <tr>
              <th>Ámbito de Aplicación</th>
              <th>Normativa Principal y Estándares</th>
            </tr>
          </thead>
          <tbody>
    `;

    rows.forEach(r => {
      html += `
        <tr>
          <td><b>${r.ambito}</b></td>
          <td>${r.normativa}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    this.screenTextContent.innerHTML = html;
  },

  renderOceanAutoevaluacion(slide) {
    let blockChar = '';
    const numStr = slide.slide_num_str || '';
    if (numStr.includes("18A")) {
      blockChar = 'A';
    } else if (numStr.includes("18B")) {
      blockChar = 'B';
    } else if (numStr.includes("19A")) {
      blockChar = 'C';
    } else if (numStr.includes("19B")) {
      blockChar = 'D';
    } else if (numStr.includes("20")) {
      blockChar = 'E';
    }

    let html = `<div class="ocean-interactive-container">`;

    const blockLabels = {
      'A': 'BLOQUE A: Amabilidad / Empatía (El Confiado)',
      'B': 'BLOQUE B: Baja Responsabilidad / Impulsividad (El Despistado)',
      'C': 'BLOQUE C: Neuroticismo / Sensibilidad al Estrés (El Reactivo)',
      'D': 'BLOQUE D: Apertura a la Experiencia / Curiosidad (El Curioso)',
      'E': 'BLOQUE E: Extraversión / Sociabilidad (El Sociable)'
    };

    if (blockChar) {
      html += `
        <h3 style="font-family: 'Outfit', sans-serif; color: var(--primary-hover); margin: 20px 0 10px 0; font-size: 1.15rem; font-weight: 700;">
          ${blockLabels[blockChar]}
        </h3>
      `;

      const qList = this.oceanQuestions.filter(q => q.block === blockChar);
      qList.forEach(q => {
        const currentAnswer = this.oceanAnswers[q.id];
        html += `
          <div class="ocean-question-card">
            <div class="ocean-question-text">${q.text}</div>
            <div class="ocean-btn-group">
              <button class="ocean-btn ${currentAnswer === 'SI' ? 'selected-si' : ''}" onclick="CourseController.answerOcean('${q.id}', 'SI')">SÍ</button>
              <button class="ocean-btn ${currentAnswer === 'NO' ? 'selected-no' : ''}" onclick="CourseController.answerOcean('${q.id}', 'NO')">NO</button>
            </div>
          </div>
        `;
      });
    }

    // If it is the last slide of autoevaluación, NO results here (moved to slide 20B)
    // (Results now rendered by renderOceanDiagnosis on slide 20B)

    html += `</div>`;
    this.screenTextContent.innerHTML = html;
  },

  answerOcean(qId, val) {
    this.oceanAnswers[qId] = val;
    this.saveLMSData();
    // Re-render
    const slide = COURSE_DATA.slides[this.currentSlideIndex];
    this.renderOceanAutoevaluacion(slide);
    this.renderExtendedText(slide.extended_text);
  },

  renderOceanDiagnosis(slide) {
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "none";
    this.clearQuizAnimations();

    this.visualTitle.textContent = slide.visual_title || 'Tu Diagnóstico de Vulnerabilidad Digital';

    // Calculate scores from stored answers
    const score = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    this.oceanQuestions.forEach(q => {
      if (this.oceanAnswers[q.id] === 'SI') {
        score[q.block]++;
      }
    });

    const profileData = [
      { block: 'A', emoji: '🤝', color: '#60A5FA', name: 'Perfil A — Complaciente', risk: 'Spear Phishing y suplantación de identidad', rule: 'La Desconfianza Educada: verificar siempre por un canal alternativo.' },
      { block: 'B', emoji: '⚡', color: '#FBBF24', name: 'Perfil B — Impulsivo', risk: 'Clic irreflexivo y facturas falsas', rule: 'La Pausa de los 10 Segundos: analiza antes de hacer clic.' },
      { block: 'C', emoji: '😨', color: '#F87171', name: 'Perfil C — Ansioso', risk: 'Fraude del CEO e intimidación psicológica', rule: 'El Protocolo vence a la Jerarquía: el procedimiento está por encima del miedo.' },
      { block: 'D', emoji: '🔭', color: '#A78BFA', name: 'Perfil D — Temerario', risk: 'Shadow IT y arrogancia cognitiva', rule: 'Zero Trust: nadie es inmune al engaño, ni siquiera los expertos.' },
      { block: 'E', emoji: '📱', color: '#34D399', name: 'Perfil E — Expuesto', risk: 'Reconocimiento OSINT y oversharing', rule: 'Escudo de Privacidad: filtra todo lo que publicas sobre tu vida laboral.' },
    ];

    const answeredCount = Object.keys(this.oceanAnswers).length;
    const totalQ = this.oceanQuestions.length;

    if (answeredCount < totalQ) {
      // Incomplete — show warning
      this.screenTextContent.innerHTML = `
        <div style="text-align:center; padding: 40px 20px;">
          <div style="font-size:3rem; margin-bottom:16px">⚠️</div>
          <h3 style="color: var(--primary-hover); font-family:'Outfit',sans-serif; font-size:1.3rem;">Autoevaluación incompleta</h3>
          <p style="color: var(--text-secondary); margin-top: 12px;">Has respondido ${answeredCount} de ${totalQ} preguntas.<br>Vuelve atrás y completa todos los bloques (A, B, C, D, E) para ver tu diagnóstico personalizado.</p>
        </div>
      `;
      return;
    }

    // Build the result cards HTML (hidden initially for typewriter reveal)
    const susceptible = profileData.filter(p => score[p.block] >= 2);
    const allGood = susceptible.length === 0;

    let headerLine, subLine;
    if (allGood) {
      headerLine = '🎉 ¡Hábitos Digitales Prudentes!';
      subLine = 'No muestras una alta susceptibilidad en ningún bloque. Aun así, lee cada perfil para reforzar tus hábitos.';
    } else {
      const names = susceptible.map(p => p.block).join(', ');
      headerLine = `📊 Tu Código de Vulnerabilidad: Perfil${susceptible.length > 1 ? 's' : ''} ${names}`;
      subLine = `Has respondido SÍ a 2 o más preguntas en los bloques marcados. Esto indica vulnerabilidades específicas que debes trabajar:`;
    }

    // Render container but cards start invisible
    const cardsHtml = profileData.map((p, i) => {
      const isRisk = score[p.block] >= 2;
      const borderColor = isRisk ? '#EF4444' : p.color;
      const bgColor = isRisk ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)';
      const badge = isRisk ? `<span style="background:#EF4444;color:#fff;font-size:0.7rem;padding:2px 8px;border-radius:20px;margin-left:8px;">RIESGO DETECTADO</span>` : `<span style="background:rgba(52,211,153,0.15);color:#34D399;font-size:0.7rem;padding:2px 8px;border-radius:20px;margin-left:8px;">OK</span>`;
      return `
        <div id="ocean-diag-card-${i}" style="opacity:0;transform:translateY(12px);transition:opacity 0.4s ease,transform 0.4s ease;border:1px solid ${borderColor};background:${bgColor};border-radius:12px;padding:14px 18px;display:flex;align-items:flex-start;gap:14px;">
          <span style="font-size:1.6rem;line-height:1;">${p.emoji}</span>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
              <strong style="color:#fff;font-size:0.95rem;font-family:'Outfit',sans-serif;">${p.name}</strong>${badge}
            </div>
            <div id="ocean-diag-risk-${i}" style="font-size:0.82rem;color:var(--text-secondary);"></div>
            <div id="ocean-diag-rule-${i}" style="font-size:0.82rem;color:${p.color};margin-top:4px;font-style:italic;"></div>
          </div>
          <div style="text-align:right;min-width:52px;">
            <div style="font-size:1.5rem;font-weight:800;color:${isRisk ? '#EF4444' : '#34D399'};font-family:'Outfit',sans-serif;">${score[p.block]}/3</div>
            <div style="font-size:0.7rem;color:var(--text-secondary);">SÍ</div>
          </div>
        </div>
      `;
    }).join('');

    this.screenTextContent.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;" onclick="CourseController.skipDiagnosisAnimation()">
        <div style="text-align:center;padding:12px 0 8px 0;">
          <div id="ocean-diag-header" style="font-size:1.2rem;font-weight:700;color:#fff;font-family:'Outfit',sans-serif;min-height:1.5em;"></div>
          <div id="ocean-diag-sub" style="font-size:0.9rem;color:var(--text-secondary);margin-top:6px;min-height:1.2em;"></div>
        </div>
        <div id="ocean-diag-cards" style="display:flex;flex-direction:column;gap:10px;">${cardsHtml}</div>
      </div>
    `;

    // Start animation
    this._diagData = { profileData, score, headerLine, subLine, step: 0, timeoutId: null, done: false };
    this._animateDiagnosis();
  },

  _animateDiagnosis() {
    if (!this._diagData || this._diagData.done) return;
    const d = this._diagData;

    const typeText = (elId, text, speed, onDone) => {
      const el = document.getElementById(elId);
      if (!el) { onDone && onDone(); return; }
      let i = 0;
      const tick = () => {
        if (!this._diagData || this._diagData.done) return;
        if (i < text.length) {
          el.textContent += text[i++];
          d.timeoutId = setTimeout(tick, speed);
        } else {
          onDone && onDone();
        }
      };
      tick();
    };

    const revealCards = (idx) => {
      if (!this._diagData || this._diagData.done) return;
      if (idx >= d.profileData.length) return;
      const card = document.getElementById(`ocean-diag-card-${idx}`);
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
      // Type risk and rule text
      typeText(`ocean-diag-risk-${idx}`, `⚠️ Riesgo: ${d.profileData[idx].risk}`, 12, () => {
        typeText(`ocean-diag-rule-${idx}`, `💡 Regla: ${d.profileData[idx].rule}`, 10, () => {
          d.timeoutId = setTimeout(() => revealCards(idx + 1), 150);
        });
      });
    };

    typeText('ocean-diag-header', d.headerLine, 18, () => {
      typeText('ocean-diag-sub', d.subLine, 10, () => {
        d.timeoutId = setTimeout(() => revealCards(0), 200);
      });
    });
  },

  skipDiagnosisAnimation() {
    if (!this._diagData || this._diagData.done) return;
    if (this._diagData.timeoutId) clearTimeout(this._diagData.timeoutId);
    this._diagData.done = true;
    const d = this._diagData;

    const hEl = document.getElementById('ocean-diag-header');
    const sEl = document.getElementById('ocean-diag-sub');
    if (hEl) hEl.textContent = d.headerLine;
    if (sEl) sEl.textContent = d.subLine;

    d.profileData.forEach((p, i) => {
      const card = document.getElementById(`ocean-diag-card-${i}`);
      if (card) { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }
      const rEl = document.getElementById(`ocean-diag-risk-${i}`);
      const ruleEl = document.getElementById(`ocean-diag-rule-${i}`);
      if (rEl) rEl.textContent = `⚠️ Riesgo: ${p.risk}`;
      if (ruleEl) ruleEl.textContent = `💡 Regla: ${p.rule}`;
    });
  },

  isLastQuestionOfQuiz(slide) {
    const modQuestions = COURSE_DATA.slides.filter(s => s.module_id === slide.module_id && s.type === 'quiz_question');
    const lastQuestion = modQuestions[modQuestions.length - 1];
    return lastQuestion && lastQuestion.id === slide.id;
  },

  renderQuizQuestion(slide) {
    this.slideScreenCard.style.display = "none";
    this.slideExtendedCard.style.display = "none";

    // Clear any previous animations
    this.clearQuizAnimations();

    // Search or create quiz container
    let quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) {
      quizContainer = document.createElement("div");
      quizContainer.id = "quiz-container";
      this.slideViewport.appendChild(quizContainer);
    }
    quizContainer.style.display = "block";

    // Find current question position in the module quiz
    const modQuestions = COURSE_DATA.slides.filter(s => s.module_id === slide.module_id && s.type === 'quiz_question');
    const questionIndex = modQuestions.findIndex(q => q.id === slide.id);

    const selectedAnswer = this.userAnswers[slide.id];

    // If they have already answered, render fully without typing animation
    if (selectedAnswer) {
      let optionsHtml = "";
      slide.options.forEach(opt => {
        optionsHtml += `
          <div class="quiz-option-item ${selectedAnswer === opt.id ? 'selected' : ''}" onclick="CourseController.selectAnswer(${slide.id}, '${opt.id}')">
            <div class="quiz-option-radio">
              <div class="quiz-option-radio-inner"></div>
            </div>
            <span class="quiz-option-letter">[${opt.id}]</span>
            <span class="quiz-option-text">${opt.text}</span>
          </div>
        `;
      });

      quizContainer.innerHTML = `
        <div class="quiz-viewport-container">
          <div class="quiz-question-card">
            <div class="quiz-question-num">Pregunta ${questionIndex + 1} de ${modQuestions.length}</div>
            <h3 class="quiz-question-title">${slide.question_text}</h3>
            <div class="quiz-options-list">
              ${optionsHtml}
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Prepare for animation
    quizContainer.innerHTML = `
      <div class="quiz-viewport-container" onclick="CourseController.skipQuizAnimation()">
        <div class="quiz-question-card" style="cursor: pointer;">
          <div class="quiz-question-num">Pregunta ${questionIndex + 1} de ${modQuestions.length}</div>
          <h3 class="quiz-question-title" id="quiz-q-title"></h3>
          <div class="quiz-options-list" id="quiz-opts-list" style="opacity: 0;">
            ${slide.options.map(opt => `
              <div class="quiz-option-item" id="quiz-opt-${opt.id}" onclick="CourseController.selectAnswer(${slide.id}, '${opt.id}'); event.stopPropagation();" style="visibility: hidden;">
                <div class="quiz-option-radio">
                  <div class="quiz-option-radio-inner"></div>
                </div>
                <span class="quiz-option-letter">[${opt.id}]</span>
                <span class="quiz-option-text" id="quiz-opt-text-${opt.id}"></span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.animateQuizElements(slide);
  },

  animateQuizElements(slide) {
    const qTitle = document.getElementById("quiz-q-title");
    const optsList = document.getElementById("quiz-opts-list");

    if (!qTitle || !optsList) return;

    this.quizAnimRunning = true;
    this.quizAnimData = {
      slide: slide,
      qText: slide.question_text,
      options: slide.options,
      optIdx: 0,
      charIdx: 0,
      timeoutId: null
    };

    const typeQuestion = () => {
      if (!this.quizAnimRunning || !this.quizAnimData) return;
      const text = this.quizAnimData.qText;
      if (this.quizAnimData.charIdx < text.length) {
        qTitle.textContent += text[this.quizAnimData.charIdx];
        this.quizAnimData.charIdx++;
        this.quizAnimData.timeoutId = setTimeout(typeQuestion, 15);
      } else {
        // Question finished, show options container
        optsList.style.opacity = "1";
        optsList.style.transition = "opacity 0.3s ease";
        this.quizAnimData.charIdx = 0;
        this.quizAnimData.optIdx = 0;
        this.quizAnimData.timeoutId = setTimeout(typeOption, 100);
      }
    };

    const typeOption = () => {
      if (!this.quizAnimRunning || !this.quizAnimData) return;
      const options = this.quizAnimData.options;
      const idx = this.quizAnimData.optIdx;

      if (idx < options.length) {
        const opt = options[idx];
        const optItem = document.getElementById(`quiz-opt-${opt.id}`);
        const optText = document.getElementById(`quiz-opt-text-${opt.id}`);

        if (optItem && optText) {
          if (optItem.style.visibility === "hidden") {
            optItem.style.visibility = "visible";
            optItem.style.opacity = "0";
            optItem.style.transition = "opacity 0.2s ease";
            void optItem.offsetWidth;
            optItem.style.opacity = "1";
          }

          const text = opt.text;
          if (this.quizAnimData.charIdx < text.length) {
            optText.textContent += text[this.quizAnimData.charIdx];
            this.quizAnimData.charIdx++;
            this.quizAnimData.timeoutId = setTimeout(typeOption, 10);
          } else {
            // Option finished, move to next option after a short delay
            this.quizAnimData.optIdx++;
            this.quizAnimData.charIdx = 0;
            this.quizAnimData.timeoutId = setTimeout(typeOption, 120);
          }
        } else {
          this.quizAnimRunning = false;
        }
      } else {
        this.quizAnimRunning = false;
      }
    };

    typeQuestion();
  },

  clearQuizAnimations() {
    if (this.quizAnimData && this.quizAnimData.timeoutId) {
      clearTimeout(this.quizAnimData.timeoutId);
    }
    this.quizAnimRunning = false;
    this.quizAnimData = null;
    // Also clean up diagnosis animation if active
    if (this._diagData && this._diagData.timeoutId) {
      clearTimeout(this._diagData.timeoutId);
    }
    this._diagData = null;
  },

  skipQuizAnimation() {
    if (!this.quizAnimRunning || !this.quizAnimData) return;
    this.clearQuizAnimations();

    const slide = COURSE_DATA.slides[this.currentSlideIndex];
    if (!slide) return;

    const qTitle = document.getElementById("quiz-q-title");
    const optsList = document.getElementById("quiz-opts-list");

    if (qTitle) {
      qTitle.textContent = slide.question_text;
    }
    if (optsList) {
      optsList.style.opacity = "1";
    }

    slide.options.forEach(opt => {
      const optItem = document.getElementById(`quiz-opt-${opt.id}`);
      const optText = document.getElementById(`quiz-opt-text-${opt.id}`);
      if (optItem) {
        optItem.style.visibility = "visible";
        optItem.style.opacity = "1";
      }
      if (optText) {
        optText.textContent = opt.text;
      }
    });
  },

  selectAnswer(slideId, optionId) {
    // If the slide is already completed (quiz passed), don't allow modifying answers
    if (this.completedSlides.has(this.currentSlideIndex)) return;

    this.userAnswers[slideId] = optionId;
    this.saveLMSData();

    // Re-render question
    const slide = COURSE_DATA.slides[this.currentSlideIndex];
    this.renderQuizQuestion(slide);

    // Check if slide timer has run out
    if (this.secondsRemaining <= 0) {
      this.btnNext.disabled = false;
    }
  },

  renderQuizFeedback(slide) {
    // Show results card inside a custom container
    this.slideScreenCard.style.display = "none";
    this.slideExtendedCard.style.display = "none";

    let quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) {
      quizContainer = document.createElement("div");
      quizContainer.id = "quiz-container";
      this.slideViewport.appendChild(quizContainer);
    }
    quizContainer.style.display = "block";

    // Determine score for this module
    const modQuestions = COURSE_DATA.slides.filter(s => s.module_id === slide.module_id && s.type === 'quiz_question');
    let correctCount = 0;

    modQuestions.forEach(q => {
      if (this.userAnswers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / modQuestions.length) * 100);
    const passed = pct >= 80;

    let feedbackContent = "";

    if (passed) {
      feedbackContent += `
        <div class="quiz-results-card">
          <div class="results-icon pass">✓</div>
          <div class="results-status-title" style="color: var(--success);">¡Evaluación Superada!</div>
          <div class="results-score-badge pass">${pct}%</div>
          <p class="results-desc">
            Enhorabuena. Has alcanzado el criterio mínimo del 80% requerido para este bloque. Hemos reportado tu progreso al sistema.
          </p>
        </div>
        
        <h3 style="font-family: 'Outfit', sans-serif; margin: 24px 0 16px 0; color: #fff;">Corrección y Justificación de Respuestas:</h3>
      `;

      modQuestions.forEach((q, idx) => {
        const userAnswer = this.userAnswers[q.id];
        const isCorrect = userAnswer === q.correct_answer;

        feedbackContent += `
          <div class="concept-card" style="margin-bottom: 12px; border-left: 4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'};">
            <div class="concept-card-title">
              <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'};">${isCorrect ? '✓' : '✗'} Pregunta ${idx + 1}: ${isCorrect ? 'Correcta' : 'Incorrecta'}</span>
            </div>
            <p style="font-size: 0.95rem; margin-bottom: 8px;"><b>Pregunta:</b> ${q.question_text}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px;">
              <b>Tu respuesta:</b> [${userAnswer}] - ${q.options.find(o => o.id === userAnswer)?.text || 'No respondida'}
            </p>
            <p style="font-size: 0.9rem; color: var(--primary-hover);">
              <b>Resplicación legal:</b> ${q.feedback || 'Sin explicación disponible.'}
            </p>
          </div>
        `;
      });

      // Make sure the feedback slide itself is completed
      this.completedSlides.add(slide.id);
      this.saveLMSData();
    } else {
      feedbackContent += `
        <div class="quiz-results-card">
          <div class="results-icon fail">✗</div>
          <div class="results-status-title" style="color: var(--danger);">Evaluación No Superada</div>
          <div class="results-score-badge fail">${pct}%</div>
          <p class="results-desc">
            Lo sentimos. Has obtenido un ${pct}%, inferior al mínimo exigido del 80%. Para continuar con el curso, debes reintentar la evaluación y superar las preguntas.
          </p>
          <button class="btn-nav btn-primary-action" style="margin-top: 12px;" onclick="CourseController.retryQuiz(${slide.module_id})">
            Reintentar Test
          </button>
        </div>
      `;

      // Lock navigation so they cannot advance
      this.btnNext.disabled = true;
    }

    quizContainer.innerHTML = `<div class="quiz-viewport-container">${feedbackContent}</div>`;
  },

  retryQuiz(moduleId) {
    // Clear user answers for this module
    const modQuestions = COURSE_DATA.slides.filter(s => s.module_id === moduleId && s.type === 'quiz_question');
    modQuestions.forEach(q => {
      delete this.userAnswers[q.id];
      // Reset completed status for question slides so they enforce 30s timer again on retry
      this.completedSlides.delete(q.id);
    });

    this.saveLMSData();

    // Go to first question of the quiz
    const firstQ = modQuestions[0];
    if (firstQ) {
      this.showSlide(firstQ.id);
    }
  },

  goToNextSlide() {
    const slide = COURSE_DATA.slides[this.currentSlideIndex];

    if (slide.type === 'quiz_question') {
      const nextBtnText = this.isLastQuestionOfQuiz(slide) ? "Enviar Respuestas" : "Siguiente Pregunta";
      if (nextBtnText === "Enviar Respuestas") {
        // Evaluate quiz and go to feedback slide
        const feedbackSlide = COURSE_DATA.slides.find(s => s.module_id === slide.module_id && s.type === 'quiz_feedback');

        // Calculate score to report to SCORM immediately
        const modQuestions = COURSE_DATA.slides.filter(s => s.module_id === slide.module_id && s.type === 'quiz_question');
        let correct = 0;
        modQuestions.forEach(q => {
          if (this.userAnswers[q.id] === q.correct_answer) {
            correct++;
          }
        });
        const score = Math.round((correct / modQuestions.length) * 100);
        ScormWrapper.setValue("cmi.core.score.raw", score);

        // Mark all quiz question slides as completed
        modQuestions.forEach(q => {
          this.completedSlides.add(q.id);
        });

        if (score >= 80) {
          // Send passed status
          ScormWrapper.setValue("cmi.core.lesson_status", "completed");
        }

        this.saveLMSData();

        if (feedbackSlide) {
          this.showSlide(feedbackSlide.id);
        }
      } else {
        // Go to next question slide
        this.showSlide(this.currentSlideIndex + 1);
      }
    } else {
      // Content / feedback / start -> normal progression
      if (this.currentSlideIndex < COURSE_DATA.slides.length - 1) {
        // Make sure quiz container is hidden
        const quizContainer = document.getElementById("quiz-container");
        if (quizContainer) quizContainer.style.display = "none";

        this.showSlide(this.currentSlideIndex + 1);
      }
    }
  },

  goToPrevSlide() {
    // Normal back navigation
    if (this.currentSlideIndex > 0) {
      const quizContainer = document.getElementById("quiz-container");
      if (quizContainer) quizContainer.style.display = "none";

      this.showSlide(this.currentSlideIndex - 1);
    }
  },

  renderFinalSlide(slide) {
    this.slideScreenCard.style.display = "flex";
    this.slideExtendedCard.style.display = "none";

    this.visualTitle.textContent = slide.title || "Curso Completado";

    // Calculate total correct questions and score
    const quizQuestions = COURSE_DATA.slides.filter(s => s.type === 'quiz_question');
    let correct = 0;
    quizQuestions.forEach(q => {
      if (this.userAnswers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    const avgScore = quizQuestions.length > 0 ? Math.round((correct / quizQuestions.length) * 100) : 100;

    // Calculate accumulated active time
    const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const totalSecs = this.totalAccumulatedSeconds + elapsed;

    // Get student name
    const studentName = this.studentName || ScormWrapper.getValue("cmi.core.student_name") || "Francisco Pérez García";

    // Update Print area content
    document.getElementById("cert-student-name").textContent = studentName;
    document.getElementById("cert-score").textContent = `${avgScore}%`;
    document.getElementById("cert-time").textContent = this.formatScormTime(totalSecs);
    document.getElementById("cert-date").textContent = new Date().toLocaleDateString('es-ES');
    document.getElementById("cert-scorm-id").textContent = `PRD-SCORM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let html = `
      <div style="text-align: center; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="font-size: 4rem; color: var(--success); text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);">🎓</div>
        <p style="font-size: 1.15rem; color: var(--text-primary); max-width: 600px; line-height: 1.6;">
          ¡Enhorabuena, <b>${studentName}</b>! Has finalizado satisfactoriamente todas las lecciones y evaluaciones del <b>Plan de Resiliencia Digital (PRD)</b>.
        </p>
        
        <div style="display: flex; gap: 20px; margin: 10px 0; flex-wrap: wrap; justify-content: center;">
          <div class="concept-card" style="padding: 16px 24px; text-align: center; min-width: 150px;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Aciertos Totales</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary-hover); margin-top: 4px;">${correct} / ${quizQuestions.length}</div>
          </div>
          <div class="concept-card" style="padding: 16px 24px; text-align: center; min-width: 150px;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Nota Media</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--success); margin-top: 4px;">${avgScore}%</div>
          </div>
          <div class="concept-card" style="padding: 16px 24px; text-align: center; min-width: 150px;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Tiempo Invertido</div>
            <div style="font-size: 1.75rem; font-weight: 700; color: var(--primary-hover); margin-top: 4px;">${this.formatScormTime(totalSecs)}</div>
          </div>
        </div>
        
        <div class="concept-card" style="max-width: 650px; text-align: left; padding: 24px; border: 1px solid rgba(124, 58, 237, 0.2); background-color: rgba(124, 58, 237, 0.03);">
          <div style="font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
            <span>📜</span> Diploma de Certificación
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
            Puedes descargar tu diploma de superación firmado digitalmente en formato PDF para justificar el cumplimiento del plan normativo ante auditorías internas o externas.
          </p>
          <button class="btn-nav btn-primary-action" style="margin: 0 auto;" onclick="window.print()">
            🖨️ Descargar Certificado / Imprimir PDF
          </button>
        </div>
        
        <div style="font-size: 0.8rem; color: var(--text-secondary); opacity: 0.6; margin-top: 15px;">
          © 2026 Francisco Jose Casino Cembellín de Kizuna Global Initiatives Socials
        </div>
      </div>
    `;

    this.screenTextContent.innerHTML = html;
  },

  formatScormTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  },

  formatDurationString(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    let parts = [];
    if (hrs > 0) parts.push(`${hrs} hora${hrs > 1 ? 's' : ''}`);
    if (mins > 0) parts.push(`${mins} minuto${mins > 1 ? 's' : ''}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} segundo${secs > 1 ? 's' : ''}`);

    return parts.join(', ');
  },

  buildTabsMarkup(items, slideId) {
    if (items.length === 0) return "";
    let tabsHeader = `<div class="tabs-header">`;
    let tabsContent = `<div class="tabs-content">`;
    items.forEach((item, idx) => {
      const activeClass = idx === 0 ? "active" : "";
      tabsHeader += `
        <button class="tab-btn ${activeClass}" data-tab-idx="${idx}" data-slide-id="${slideId}">
          ${item.title}
        </button>
      `;
      tabsContent += `
        <div class="tab-pane ${activeClass}" id="tab-pane-${slideId}-${idx}">
          <p class="tab-pane-text">${item.text}</p>
        </div>
      `;
    });
    tabsHeader += `</div>`;
    tabsContent += `</div>`;
    return `<div class="dynamic-tabs-container" id="tabs-container-${slideId}">${tabsHeader}${tabsContent}</div>`;
  },

  bindTabsEvents(slideId) {
    const container = document.getElementById(`tabs-container-${slideId}`);
    if (!container) return;
    const buttons = container.querySelectorAll(".tab-btn");
    const panes = container.querySelectorAll(".tab-pane");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetIdx = btn.getAttribute("data-tab-idx");
        buttons.forEach(b => b.classList.remove("active"));
        panes.forEach(p => {
          p.classList.remove("active");
          p.style.display = "none";
        });
        btn.classList.add("active");
        const targetPane = document.getElementById(`tab-pane-${slideId}-${targetIdx}`);
        if (targetPane) {
          targetPane.style.display = "block";
          void targetPane.offsetWidth;
          targetPane.classList.add("active");
        }
      });
    });
    panes.forEach((p, idx) => {
      p.style.display = idx === 0 ? "block" : "none";
    });
  },

  buildAccordionsMarkup(items, slideId) {
    if (items.length === 0) return "";
    let html = `<div class="dynamic-accordion-container" id="accordion-container-${slideId}">`;
    items.forEach((item, idx) => {
      html += `
        <div class="accordion-item" id="accordion-item-${slideId}-${idx}">
          <button class="accordion-header" data-acc-idx="${idx}" data-slide-id="${slideId}">
            <span>${item.title}</span>
            <span class="accordion-icon">▼</span>
          </button>
          <div class="accordion-content">
            <p>${item.text}</p>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  bindAccordionsEvents(slideId) {
    const container = document.getElementById(`accordion-container-${slideId}`);
    if (!container) return;
    const items = container.querySelectorAll(".accordion-item");
    items.forEach(item => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        items.forEach(i => {
          i.classList.remove("active");
          const content = i.querySelector(".accordion-content");
          content.style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add("active");
          const content = item.querySelector(".accordion-content");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    });
  },

  buildFlipCardsMarkup(items, slideId) {
    if (items.length === 0) return "";
    let html = `<div class="flip-cards-grid">`;
    items.forEach((item, idx) => {
      html += `
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <div class="flip-title">${item.title}</div>
              <div class="flip-hint">
                <span>🔄</span>
                <span>Ver definición</span>
              </div>
            </div>
            <div class="flip-card-back">
              <div class="flip-desc">${item.text}</div>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    return html;
  },

  bindFlipCardsEvents(slideId) {
    // handled inline via onclick
  }
};

window.addEventListener("beforeunload", () => {
  CourseController.saveLMSData();
});

// Initialize Course on page load
window.addEventListener("DOMContentLoaded", () => {
  CourseController.init();
});
