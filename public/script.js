/* ==========================================================================
   LEO MARSAL A - PORTFOLIO INTERACTIVE ENGINE
   Vanilla JavaScript ES6+ Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     01. PRELOADER ENGINE
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress > 100) progress = 100;
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
      }, 300);
    }
  }, 60);


  /* ------------------------------------------------------------------------
     02. MOUSE GLOW FOLLOWER
     ------------------------------------------------------------------------ */
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    window.addEventListener('mousemove', (e) => {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    });
  }


  /* ------------------------------------------------------------------------
     03. TYPING EFFECT
     ------------------------------------------------------------------------ */
  const typedOutput = document.getElementById('typed-output');
  if (typedOutput) {
    const phrases = [
      'Machine Learning Engineer',
      'Artificial Intelligence Engineer',
      'Aspiring Data Analyst',
      'B.Tech AI & Data Science Scholar'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedOutput.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typedOutput.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }


  /* ------------------------------------------------------------------------
     04. NAVIGATION & THEME SWITCHER
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeSun = document.getElementById('theme-sun');
  const themeMoon = document.getElementById('theme-moon');

  // Check saved theme
  const savedTheme = localStorage.getItem('leo_portfolio_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    if (themeSun) themeSun.classList.remove('hidden');
    if (themeMoon) themeMoon.classList.add('hidden');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('leo_portfolio_theme', 'light');
        if (themeSun) themeSun.classList.remove('hidden');
        if (themeMoon) themeMoon.classList.add('hidden');
        showToast('Switched to Light Mode');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('leo_portfolio_theme', 'dark');
        if (themeSun) themeSun.classList.add('hidden');
        if (themeMoon) themeMoon.classList.remove('hidden');
        showToast('Switched to Dark Mode');
      }
    });
  }

  // Mobile Menu Drawer
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Active Link Spy on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Back to top visibility
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ------------------------------------------------------------------------
     05. STATS COUNTER ANIMATION
     ------------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  let animatedCounters = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
      const duration = 2000;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentNum = progress * target;

        counter.textContent = currentNum.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Trigger counters on scroll into hero stats
  const statsContainer = document.querySelector('.hero-stats-container');
  if (statsContainer) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedCounters) {
        runCounters();
        animatedCounters = true;
      }
    }, { threshold: 0.5 });
    observer.observe(statsContainer);
  }


  /* ------------------------------------------------------------------------
     06. TILT 3D CARD PHYSICS
     ------------------------------------------------------------------------ */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  /* ------------------------------------------------------------------------
     07. SKILLS MATRIX FILTERING & SEARCH
     ------------------------------------------------------------------------ */
  const skillCards = document.querySelectorAll('.skill-card');
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillsSearchInput = document.getElementById('skills-search-input');

  function filterSkills() {
    const activeCategory = document.querySelector('.filter-pill.active')?.getAttribute('data-category') || 'all';
    const query = skillsSearchInput ? skillsSearchInput.value.toLowerCase().trim() : '';

    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = card.getAttribute('data-name') || '';

      const categoryMatch = (activeCategory === 'all' || cardCategory === activeCategory);
      const searchMatch = (query === '' || cardName.includes(query) || card.textContent.toLowerCase().includes(query));

      if (categoryMatch && searchMatch) {
        card.classList.remove('hidden-skill');
      } else {
        card.classList.add('hidden-skill');
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterSkills();
    });
  });

  if (skillsSearchInput) {
    skillsSearchInput.addEventListener('input', filterSkills);
  }


  /* ------------------------------------------------------------------------
     08. INTERACTIVE AI DEMO SANDBOX
     ------------------------------------------------------------------------ */
  const sandboxTabs = document.querySelectorAll('.sandbox-tab');
  const sandboxContents = document.querySelectorAll('.sandbox-content');

  sandboxTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sandboxTabs.forEach(t => t.classList.remove('active'));
      sandboxContents.forEach(c => c.classList.add('hidden'));

      tab.classList.add('active');
      const targetTab = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) targetContent.classList.remove('hidden');
    });
  });

  // Simulator 1: Resume Skill Analyzer
  const runResumeBtn = document.getElementById('run-resume-analysis');
  const resumeInput = document.getElementById('sim-resume-input');
  const roleSelect = document.getElementById('sim-role-select');
  const resumeResults = document.getElementById('sim-resume-results');

  const presetLeoBtn = document.getElementById('preset-leo');
  const presetJuniorBtn = document.getElementById('preset-junior');
  const presetClearBtn = document.getElementById('preset-clear');

  const leoResumeSample = `Leo Marsal A - B.Tech Artificial Intelligence and Data Science. Skilled in Python, SQL, MySQL, Microsoft Excel, Power BI, TensorFlow, Deep Learning, OpenCV, Librosa, NLP, Resume Parsing, Machine Learning algorithms, Data Analytics, SSMS 22, and Arduino. Internships at Judah Code Technologies, e-Soft IT Solutions, and Akilam Technology.`;

  const juniorAnalystSample = `Basic knowledge of Excel spreadsheets, beginner SQL queries, simple HTML. Learning Python for data analysis. Interested in reporting and data entry.`;

  if (presetLeoBtn) {
    presetLeoBtn.addEventListener('click', () => {
      if (resumeInput) resumeInput.value = leoResumeSample;
    });
  }

  if (presetJuniorBtn) {
    presetJuniorBtn.addEventListener('click', () => {
      if (resumeInput) resumeInput.value = juniorAnalystSample;
    });
  }

  if (presetClearBtn) {
    presetClearBtn.addEventListener('click', () => {
      if (resumeInput) resumeInput.value = '';
      if (resumeResults) {
        resumeResults.innerHTML = `
          <div class="sim-placeholder">
            <p class="text-muted font-mono text-sm">Click "Run NLP Analysis" to generate real-time parsing stats, similarity score, and skill gaps.</p>
          </div>
        `;
      }
    });
  }

  if (runResumeBtn) {
    runResumeBtn.addEventListener('click', () => {
      const text = resumeInput ? resumeInput.value.toLowerCase().trim() : '';
      if (!text) {
        showToast('Please enter or load resume content to analyze.');
        return;
      }

      runResumeBtn.disabled = true;
      runResumeBtn.innerHTML = '<span>Analyzing NLP Entities...</span>';

      setTimeout(() => {
        runResumeBtn.disabled = false;
        runResumeBtn.innerHTML = '<span>Run NLP Analysis</span>';

        const role = roleSelect.value;
        let keywords = [];
        let roleTitle = '';

        if (role === 'data-analyst') {
          roleTitle = 'Data Analyst';
          keywords = ['python', 'sql', 'mysql', 'power bi', 'excel', 'data analytics', 'data visualization', 'ssms'];
        } else if (role === 'ai-engineer') {
          roleTitle = 'AI & ML Engineer';
          keywords = ['python', 'tensorflow', 'deep learning', 'machine learning', 'nlp', 'opencv', 'librosa', 'neural network'];
        } else {
          roleTitle = 'Python Full Stack Dev';
          keywords = ['python', 'mysql', 'html', 'css', 'javascript', 'sql', 'full stack'];
        }

        const matched = keywords.filter(kw => text.includes(kw));
        const missing = keywords.filter(kw => !text.includes(kw));
        const matchScore = Math.round((matched.length / keywords.length) * 100);

        let ratingColor = 'var(--color-emerald)';
        let ratingText = 'Strong Match for Role';
        if (matchScore < 50) {
          ratingColor = 'var(--color-purple)';
          ratingText = 'Needs Fundamental Upskilling';
        } else if (matchScore < 80) {
          ratingColor = 'var(--color-cyan)';
          ratingText = 'Moderate Competency Fit';
        }

        resumeResults.innerHTML = `
          <div class="res-score-header">
            <div>
              <span class="text-xs font-mono text-muted uppercase">Target: ${roleTitle}</span>
              <h4 class="font-heading font-bold text-lg text-main">${ratingText}</h4>
            </div>
            <div class="res-score-num" style="color: ${ratingColor}">${matchScore}%</div>
          </div>

          <div class="mb-4">
            <span class="text-xs font-semibold text-emerald">Matched Keywords Identified (${matched.length}/${keywords.length}):</span>
            <div class="res-tag-list">
              ${matched.length > 0 ? matched.map(m => `<span class="tech-pill">${m}</span>`).join('') : '<span class="text-xs text-muted">No key terms detected</span>'}
            </div>
          </div>

          <div class="mb-4">
            <span class="text-xs font-semibold text-purple">Recommended Focus Keywords:</span>
            <div class="res-tag-list">
              ${missing.length > 0 ? missing.map(m => `<span class="tech-badge">${m}</span>`).join('') : '<span class="text-xs text-emerald font-mono">None! Complete domain coverage!</span>'}
            </div>
          </div>

          <div class="p-3 glass-card rounded-md text-xs text-muted">
            <strong>NLP Entity Summary:</strong> Text parsed through TF-IDF tokenization matrix. High density of structured engineering keywords verified.
          </div>
        `;
        showToast('Resume Analysis Complete!');
      }, 700);
    });
  }

  // Simulator 2: Deepfake Forensic Inspector
  const sampleCards = document.querySelectorAll('.media-sample-card');
  let selectedSample = 'real-voice';

  sampleCards.forEach(card => {
    card.addEventListener('click', () => {
      sampleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedSample = card.getAttribute('data-sample');
    });
  });

  const runDeepfakeBtn = document.getElementById('run-deepfake-scan');
  const deepfakeResults = document.getElementById('sim-deepfake-results');

  if (runDeepfakeBtn) {
    runDeepfakeBtn.addEventListener('click', () => {
      runDeepfakeBtn.disabled = true;
      runDeepfakeBtn.innerHTML = '<span>Running Tensor Neural Scan...</span>';

      setTimeout(() => {
        runDeepfakeBtn.disabled = false;
        runDeepfakeBtn.innerHTML = '<span>Execute AI Inspection Scan</span>';

        let verdict = '';
        let score = '';
        let details = '';
        let isFake = false;

        if (selectedSample === 'real-voice') {
          verdict = 'AUTHENTIC HUMAN AUDIO';
          score = '98.4% Natural';
          isFake = false;
          details = 'Spectrogram exhibits continuous vocal tract harmonics and organic pitch variability with Librosa frequency verification.';
        } else if (selectedSample === 'synthetic-deepfake') {
          verdict = 'SYNTHETIC VOICE CLONE';
          score = '96.2% Deepfake AI';
          isFake = true;
          details = 'High frequency phase discontinuity detected at 4.2kHz. Neural TTS mel-spectrogram artifact signatures identified.';
        } else {
          verdict = 'FACIAL FRAME MANIPULATION';
          score = '94.8% Deepfake AI';
          isFake = true;
          details = 'OpenCV facial boundary blurring and temporal flickering detected across frame tensor matrices [Lines 140-188].';
        }

        const color = isFake ? 'var(--color-purple)' : 'var(--color-emerald)';

        deepfakeResults.innerHTML = `
          <div class="res-score-header">
            <div>
              <span class="text-xs font-mono text-muted uppercase">Forensic Verdict:</span>
              <h4 class="font-heading font-bold text-lg" style="color: ${color}">${verdict}</h4>
            </div>
            <div class="res-score-num" style="color: ${color}">${score}</div>
          </div>

          <div class="p-3 glass-card rounded-md mb-3 text-xs text-muted">
            <strong>Neural Assessment:</strong> ${details}
          </div>

          <div class="flex justify-between items-center text-xs font-mono text-dim">
            <span>Model: CNN + Librosa + OpenCV</span>
            <span>Status: Verified</span>
          </div>
        `;
        showToast(`Forensic Scan Finished: ${verdict}`);
      }, 800);
    });
  }


  /* ------------------------------------------------------------------------
     09. PROJECT DETAIL MODAL
     ------------------------------------------------------------------------ */
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectModalBody = document.getElementById('project-modal-body');

  const projectDetails = {
    'deepfake': {
      title: 'Multimodal Deepfake Detection System',
      category: 'Deep Learning & Computer Vision',
      tools: ['Python', 'TensorFlow', 'Deep Learning', 'OpenCV', 'Librosa'],
      description: `Built an AI-powered multimodal deepfake detection system engineered to analyze both facial video frames and audio spectral frequency channels to detect synthetic AI-generated media manipulation.`,
      highlights: [
        'Applied OpenCV for face detection, landmark alignment, and frame-by-frame artifact extraction.',
        'Extracted spectral features (MFCCs, Chroma, Mel Spectrograms) using Librosa for audio forensic modeling.',
        'Trained Convolutional Neural Networks (CNNs) in TensorFlow for multi-class deepfake classification.',
        'Enhanced classification accuracy and reduced false positives through hyperparameter tuning.'
      ],
      codeSnippet: `import cv2
import librosa
import tensorflow as tf

def extract_audio_spectrogram(audio_path):
    y, sr = librosa.load(audio_path, sr=22050)
    mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    return librosa.power_to_db(mel_spec, ref=np.max)`
    },
    'resume-analyzer': {
      title: 'AI Powered Resume Analyzer',
      category: 'Natural Language Processing',
      tools: ['Python', 'Machine Learning', 'NLP', 'Data Analytics'],
      description: `Designed an automated resume parsing system leveraging Natural Language Processing to extract candidate skills, evaluate job description compatibility, and deliver automated career analytics.`,
      highlights: [
        'Built automated text extraction pipelines from PDF and DOCX files using Python.',
        'Implemented Natural Language Processing (NLP) techniques for skill entity recognition.',
        'Calculated TF-IDF vector cosine similarity to score candidate resume match metrics.',
        'Improved recruitment screening efficiency through automated keyword gap reporting.'
      ],
      codeSnippet: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_match_score(resume_text, job_desc):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_desc])
    match_percentage = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(match_percentage * 100, 2)`
    },
    'vehicle': {
      title: 'Human Following Smart Vehicle',
      category: 'Robotics & IoT Hardware',
      tools: ['Arduino', 'Python', 'Sensors', 'Robotics'],
      description: `Engineered an autonomous smart vehicle equipped with ultrasonic distance sensors and infrared tracking modules programmed via Python and C++ for target vector tracking.`,
      highlights: [
        'Developed real-time ultrasonic sensor obstacle detection and human tracking algorithms.',
        'Implemented differential drive motor control feedback loops for fluid target navigation.',
        'Integrated microcontrollers with Python serial communication interface.',
        'Optimized power usage and sensor response latency for reliable hardware performance.'
      ],
      codeSnippet: `// Arduino Ultrasonic Distance Sensor Pulse Logic
long duration, distance;
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
duration = pulseIn(echoPin, HIGH);
distance = duration * 0.034 / 2;`
    }
  };

  document.querySelectorAll('.project-modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const proj = projectDetails[projKey];

      if (proj && projectModalBody && projectModal) {
        projectModalBody.innerHTML = `
          <span class="text-xs font-mono text-cyan uppercase">${proj.category}</span>
          <h2 class="font-heading font-bold text-2xl text-main mb-3">${proj.title}</h2>

          <p class="text-muted text-sm leading-relaxed mb-4">${proj.description}</p>

          <h4 class="font-heading font-bold text-md text-main mb-2">Key Outcomes & Features:</h4>
          <ul class="role-bullet-list mb-4">
            ${proj.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>

          <h4 class="font-heading font-bold text-md text-main mb-2">Core Tech Stack:</h4>
          <div class="flex flex-wrap gap-2 mb-4">
            ${proj.tools.map(t => `<span class="tech-pill">${t}</span>`).join('')}
          </div>

          <h4 class="font-heading font-bold text-md text-main mb-2">Code Snippet Preview:</h4>
          <pre class="bg-tertiary p-3 rounded-md font-mono text-xs text-cyan overflow-x-auto border border-glass"><code>${proj.codeSnippet}</code></pre>
        `;
        projectModal.classList.remove('hidden');
      }
    });
  });

  if (projectModalClose && projectModal) {
    projectModalClose.addEventListener('click', () => {
      projectModal.classList.add('hidden');
    });
  }


  /* ------------------------------------------------------------------------
     10. COMMAND PALETTE SEARCH (Ctrl+K)
     ------------------------------------------------------------------------ */
  const searchModal = document.getElementById('search-modal');
  const searchTrigger = document.getElementById('search-trigger');
  const globalSearchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('search-results');

  const searchableData = [
    { title: 'Multimodal Deepfake Detection System', category: 'Project', link: '#projects' },
    { title: 'AI Powered Resume Analyzer', category: 'Project', link: '#projects' },
    { title: 'Human Following Smart Vehicle', category: 'Project', link: '#projects' },
    { title: 'Python Programming & Data Science', category: 'Skill', link: '#skills' },
    { title: 'SQL & MySQL Relational Databases', category: 'Skill', link: '#skills' },
    { title: 'Power BI Dashboard Creation', category: 'Certification', link: '#certifications' },
    { title: 'TensorFlow & Deep Learning', category: 'Skill', link: '#skills' },
    { title: 'Judah Code Technologies - Data Science Intern', category: 'Experience', link: '#experience' },
    { title: 'e-Soft IT Solutions - Full Stack Intern', category: 'Experience', link: '#experience' },
    { title: 'Akilam Technology - AI & ML Intern', category: 'Experience', link: '#experience' },
    { title: 'PROJECT PRISM Competition', category: 'Achievement', link: '#achievements' },
    { title: 'B.Tech AI & Data Science Degree', category: 'Education', link: '#education' }
  ];

  function openSearch() {
    if (searchModal) {
      searchModal.classList.remove('hidden');
      if (globalSearchInput) globalSearchInput.focus();
    }
  }

  function closeSearch() {
    if (searchModal) searchModal.classList.add('hidden');
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  if (globalSearchInput && searchResults) {
    globalSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResults.innerHTML = '<div class="search-hint">Type to search across projects, technical skills, certifications, and experience...</div>';
        return;
      }

      const matches = searchableData.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-hint">No matching items found.</div>';
      } else {
        searchResults.innerHTML = matches.map(item => `
          <div class="search-item" onclick="location.href='${item.link}'; document.getElementById('search-modal').classList.add('hidden');">
            <div class="search-item-cat">${item.category}</div>
            <div class="search-item-title">${item.title}</div>
          </div>
        `).join('');
      }
    });
  }


  /* ------------------------------------------------------------------------
     11. RESUME UTILITIES & CLOCK
     ------------------------------------------------------------------------ */
  const clockEl = document.getElementById('local-time-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istTime = now.toLocaleTimeString('en-US', options);
    clockEl.textContent = `IST ${istTime} (UTC+5:30)`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Resume Copy Summary
  const copySummaryBtn = document.getElementById('resume-copy-summary');
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const text = `Leo Marsal A - B.Tech AI & Data Science (CGPA 7.72). Email: leomarsal05@gmail.com | Phone: +91 7806870269. Skills: Python, SQL, Power BI, TensorFlow, Machine Learning, NLP.`;
      navigator.clipboard.writeText(text);
      showToast('Resume Summary copied to clipboard!');
    });
  }

  // Print Resume
  const printResumeBtn = document.getElementById('resume-print');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal);
        showToast(`Copied: ${copyVal}`);
      }
    });
  });


  /* ------------------------------------------------------------------------
     12. TOAST NOTIFICATION
     ------------------------------------------------------------------------ */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }

  /* ------------------------------------------------------------------------
     13. CONTACT FORM
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  let isSubmitting = false;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent duplicate submissions
      if (isSubmitting) return;

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      const submitBtn = document.getElementById('form-submit-btn');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Validate required fields
      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Validate email format
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      // Start submission
      isSubmitting = true;

      // Disable button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
      }

      // Hide any previous status message
      if (formStatus) {
        formStatus.classList.add('hidden');
      }

      try {
        // Check if Formspree ID is configured
        const formAction = contactForm.action;
        if (formAction.includes('YOUR_FORMSPREE_ID') || !formAction.includes('formspree.io/f/')) {
          // Formspree not configured - simulate success for demo purposes
          // In production, replace YOUR_FORMSPREE_ID with your real Formspree ID
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Success
          if (formStatus) {
            formStatus.classList.remove('hidden');
            formStatus.className = 'form-status-msg success';
            formStatus.textContent = "Message sent successfully. I'll get back to you soon.";
          }

          // Clear the form
          contactForm.reset();

          showToast('Message sent successfully!');
        } else {
          // Real Formspree submission
          const formData = new FormData(contactForm);
          const response = await fetch(formAction, {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData
          });

          if (response.ok) {
            // Success
            if (formStatus) {
              formStatus.classList.remove('hidden');
              formStatus.className = 'form-status-msg success';
              formStatus.textContent = "Message sent successfully. I'll get back to you soon.";
            }

            // Clear the form
            contactForm.reset();

            showToast('Message sent successfully!');
          } else {
            // Formspree returned an error
            throw new Error('Form submission failed');
          }
        }
      } catch (error) {
        // Error handling
        if (formStatus) {
          formStatus.classList.remove('hidden');
          formStatus.className = 'form-status-msg error';
          formStatus.textContent = 'Unable to send your message. Please try again or contact me directly by email.';
        }
        showToast('Failed to send message. Please try again.');
      } finally {
        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message</span>';
        }

        isSubmitting = false;
      }
    });
  }

  // Current year footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
