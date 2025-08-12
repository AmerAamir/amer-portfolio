// script.js

document.addEventListener('DOMContentLoaded', () => {
  /* Utility functions */

  // Always start at the top of the page on load. Without this,
  // some browsers will restore the previous scroll position (e.g. when
  // navigating back or after a hard refresh) which can make the page
  // appear to load halfway down. Explicitly reset scroll restoration
  // and scroll to the top to ensure the hero section is visible when
  // the site loads.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Set current year in footer
  qs('#year').textContent = new Date().getFullYear();

  // Theme management
  const body = document.body;
  const themeToggle = qs('#theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') body.classList.add('dark-theme');
  // Set accent color from storage
  const colorPicker = qs('#color-picker');
  const savedAccent = localStorage.getItem('accentColor');
  if (savedAccent) {
    document.documentElement.style.setProperty('--accent-color', savedAccent);
    colorPicker.value = savedAccent;
  }
  // Toggle dark/light mode
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
  // Accent color picker
  colorPicker.addEventListener('input', e => {
    const color = e.target.value;
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
  });

  // Mobile nav toggle
  const navToggle = qs('#nav-toggle');
  const nav = qs('nav');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  // Close nav on link click (small screens)
  qsa('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) nav.classList.remove('open');
    });
  });

  // Scroll progress bar
  const progressBar = qs('#scroll-progress');
  const updateProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percentage = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${percentage}%`;
  };
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // Active nav highlighting on scroll
  const sections = qsa('main > section');
  const navLinks = qsa('nav a');
  const observerOptions = {
    threshold: 0.6
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = qs(`nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(sec => sectionObserver.observe(sec));

  // Typewriter effect
  const phrases = [
    'a Machine Learning Developer',
    'a Full‑Stack Engineer',
    'a Data Problem‑Solver',
    'an Innovator'
  ];
  let typeIndex = 0;
  let letterIndex = 0;
  const typewriterElem = qs('#typewriter');
  const typeSpeed = 90;
  const eraseSpeed = 50;
  const delayBetween = 1500;
  const type = () => {
    const current = phrases[typeIndex];
    if (letterIndex < current.length) {
      typewriterElem.textContent += current.charAt(letterIndex);
      letterIndex++;
      setTimeout(type, typeSpeed);
    } else {
      // hold, then erase
      setTimeout(erase, delayBetween);
    }
  };
  const erase = () => {
    const current = phrases[typeIndex];
    if (letterIndex > 0) {
      typewriterElem.textContent = current.substring(0, letterIndex - 1);
      letterIndex--;
      setTimeout(erase, eraseSpeed);
    } else {
      // move to next phrase
      typeIndex = (typeIndex + 1) % phrases.length;
      setTimeout(type, 200);
    }
  };
  // start after slight delay to allow page load
  setTimeout(type, 500);

  // Copy email
  const copyBtn = qs('#copy-email');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('butt24@uwindsor.ca');
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  });

  // Project filtering and search
  const filterBtns = qsa('.filter-btn');
  // projectCards will be populated after dynamic projects are rendered
  const projectGrid = qs('#project-grid');
  let projectCards = [];
  const filterProjects = (filter) => {
    const searchTerm = qs('#project-search').value.toLowerCase().trim();
    projectCards.forEach(card => {
      const matchCategory = filter === 'all' || card.dataset.category === filter;
      const keywords = card.dataset.keywords || '';
      const matchSearch = keywords.toLowerCase().includes(searchTerm) || card.textContent.toLowerCase().includes(searchTerm);
      if (matchCategory && matchSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  };
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterProjects(filter);
    });
  });
  qs('#project-search').addEventListener('input', () => {
    const activeFilterBtn = qs('.filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
    filterProjects(filter);
  });

  // Keyboard navigation for project cards
  projectGrid.addEventListener('keydown', (e) => {
    const visibleCards = qsa('.project-card', projectGrid).filter(card => card.style.display !== 'none');
    if (!visibleCards.length) return;
    const currentIndex = visibleCards.indexOf(document.activeElement);
    let nextIndex;
    const columns = Math.floor(projectGrid.clientWidth / visibleCards[0].clientWidth);
    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % visibleCards.length;
        visibleCards[nextIndex].focus();
        e.preventDefault();
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
        visibleCards[nextIndex].focus();
        e.preventDefault();
        break;
      case 'ArrowDown':
        nextIndex = (currentIndex + columns) % visibleCards.length;
        visibleCards[nextIndex].focus();
        e.preventDefault();
        break;
      case 'ArrowUp':
        nextIndex = (currentIndex - columns + visibleCards.length) % visibleCards.length;
        visibleCards[nextIndex].focus();
        e.preventDefault();
        break;
    }
  });

  // Utility to fetch the README for a repository and return its Markdown text
  async function getReadmeText(owner, repo) {
    const branch = repo.default_branch || 'main';
    const urls = [
      `https://raw.githubusercontent.com/${owner}/${repo.name}/${branch}/README.md`,
      `https://raw.githubusercontent.com/${owner}/${repo.name}/master/README.md`
    ];
    for (const u of urls) {
      try {
        const res = await fetch(u);
        if (res.ok) return await res.text();
      } catch (err) {
        // ignore network errors and try next url
      }
    }
    return '';
  }

  // Convert Markdown into a single descriptive sentence. Removes images, headings,
  // HTML tags, comments, tables and condenses whitespace. Returns the first
  // sentence longer than 20 characters, trimmed to ~140 chars.
  function toOneLiner(md) {
    const cleaned = md
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
      .replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1') // links → text
      .replace(/^#.*$/gm, '') // headings
      .replace(/<[^>]+>/g, '') // html tags
      .replace(/<!--.*?-->/gs, '') // comments
      .replace(/\|.*\|/g, '') // tables
      .replace(/\s+/g, ' ') // whitespace
      .trim();
    const sentence = cleaned.split(/[.!?]\s/).find(s => s && s.length > 20);
    if (!sentence) return null;
    const s = sentence.trim();
    return s.length > 140 ? s.slice(0, 137) + '…' : (/[.!?]$/.test(s) ? s : s + '.');
  }

  // Attempt to patch a repository description at the source using the GH_TOKEN
  async function patchDescription(owner, repo, description) {
    if (!description) return;
    const token = (typeof GH_TOKEN !== 'undefined' ? GH_TOKEN : undefined);
    // If no token available, skip patching; still provide description in UI
    if (!token) return;
    try {
      await fetch(`https://api.github.com/repos/${owner}/${repo.name}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        },
        body: JSON.stringify({ description })
      });
      // Gentle rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      // Silently ignore patch errors
    }
  }

  // Fetch og:image or twitter:image for an external URL. Fallback to a screenshot
  // via Microlink if meta tags are not present.
  async function getPreviewImage(url) {
    try {
      // use jina.ai to fetch remote HTML via text extraction (proxy to bypass CORS)
      const res = await fetch('https://r.jina.ai/http://' + url.replace(/^https?:\/\//, ''));
      if (res.ok) {
        const html = await res.text();
        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
        const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
        const image = (ogMatch && ogMatch[1]) || (twitterMatch && twitterMatch[1]);
        if (image) return image;
      }
    } catch (err) {
      // ignore network errors; fallback below
    }
    return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
  }

  // Fetch GitHub repositories, derive descriptions and render cards alongside two manual externals
  const fetchRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/AmerAamir/repos?per_page=100');
      if (!response.ok) throw new Error('GitHub API request failed');
      let repos = await response.json();
      // filter out forks and archived repositories
      repos = repos.filter(r => !r.fork && !r.archived);
      // Determine total displayed count (GitHub repos + 2 manual externals)
      const totalDisplayed = repos.length + 2;
      // Update the projects completed counter target
      const projectCounter = qs('.stat-number[data-target]');
      if (projectCounter) {
        projectCounter.dataset.target = totalDisplayed;
        // If counters already started we also update the text immediately
        if (countersStarted) {
          projectCounter.textContent = totalDisplayed;
        }
      }
      // Render GitHub repos sequentially to allow for awaiting description fetches
      for (const repo of repos) {
        let desc = repo.description;
        if (!desc || !desc.trim()) {
          const md = await getReadmeText('AmerAamir', repo);
          desc = toOneLiner(md) || 'No description provided.';
          // Attempt to patch the description at the source if a token is available
          patchDescription('AmerAamir', repo, desc);
        }
        const card = document.createElement('article');
        card.className = 'project-card';
        // Category based on language
        let category;
        switch (repo.language) {
          case 'Python':
          case 'Jupyter Notebook':
            category = 'ml';
            break;
          case 'C':
          case 'C++':
            category = 'systems';
            break;
          case 'JavaScript':
          case 'TypeScript':
          case 'HTML':
          case 'CSS':
          case 'Java':
          case 'Kotlin':
            category = 'web';
            break;
          default:
            category = 'web';
        }
        card.dataset.category = category;
        card.dataset.keywords = `${repo.name} ${desc}`;
        card.tabIndex = 0;
        // generate preview image
        const randomHash = Math.random().toString(36).substring(2, 15);
        const imageSrc = `https://opengraph.githubassets.com/${randomHash}/${repo.full_name}`;
        card.innerHTML = `
          <img src="${imageSrc}" alt="${repo.name}" loading="lazy">
          <div class="project-info">
            <h3>${repo.name.replace(/-/g, ' ')}</h3>
            <p>${desc}</p>
            <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">View on GitHub</a>
          </div>
        `;
        projectGrid.appendChild(card);
      }
      // Append manual external projects. Use locally stored images for each project to
      // ensure that thumbnails render correctly without relying on cross‑domain
      // metadata. Should the `img` property be absent, fall back to the preview
      // service.
      // Define the two manual external projects.  Use the optimized JPEG
      // versions of the thumbnails rather than the large PNG originals.
      // These smaller images load more reliably on GitHub Pages and help
      // avoid 403 errors when files exceed certain thresholds.
      const externals = [
        {
          title: 'Remire.co',
          desc: 'Global hiring platform—contributed to core feature development and integrations.',
          url: 'https://remire.co/',
          linkText: 'Learn More',
          img: 'images/remire.jpg'
        },
        {
          title: 'Proximus+ (Belgium Telco)',
          desc: 'Wallet modules, NBA/NBO cards, personalization; worked within SAFe.',
          url: 'https://play.google.com/store/apps/details?id=be.belgacom.hello',
          linkText: 'Learn More',
          img: 'images/proximus.jpg'
        }
      ];
      for (const ext of externals) {
        let imgSrc = ext.img;
        if (!imgSrc) {
          try {
            imgSrc = await getPreviewImage(ext.url);
          } catch {
            imgSrc = '';
          }
        }
        const card = document.createElement('article');
        card.className = 'project-card';
        // Treat externals as web projects for filtering
        card.dataset.category = 'web';
        card.dataset.keywords = `${ext.title} ${ext.desc}`;
        card.tabIndex = 0;
        card.innerHTML = `
          <img src="${imgSrc}" alt="${ext.title}" loading="lazy">
          <div class="project-info">
            <h3>${ext.title}</h3>
            <p>${ext.desc}</p>
            <a href="${ext.url}" class="project-link" target="_blank" rel="noopener">${ext.linkText}</a>
          </div>
        `;
        projectGrid.appendChild(card);
      }
      // Update the list of project cards for filtering and keyboard navigation
      projectCards = qsa('.project-card', projectGrid);
    } catch (err) {
      console.error('Error fetching repos:', err);
    }
  };
  fetchRepos();

  // Animate skill bars when visible
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = qs('.fill', entry.target);
        const level = entry.target.dataset.level;
        fill.style.width = `${level}%`;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  qsa('.skill').forEach(skill => skillObserver.observe(skill));

  // Testimonials slider: automatically cycles through testimonial items every 8 seconds.
  const testimonialTrackElem = document.querySelector('.testimonial-track');
  if (testimonialTrackElem) {
    // Ensure the track is wide enough to contain all slides. Each slide will
    // occupy 100% of the slider's visible width, so set the track width to
    // number_of_items × 100%. Without this, some slides may be clipped because
    // flex containers shrink by default.
    const slideCount = testimonialTrackElem.children.length;
    testimonialTrackElem.style.width = `${slideCount * 100}%`;

    let testimonialIndex = 0;
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % slideCount;
      testimonialTrackElem.style.transform = `translateX(-${testimonialIndex * (100 / slideCount)}%)`;
    }, 8000);
  }

  // Animated counters in hero
  const counters = qsa('.stat-number');
  let countersStarted = false;
  const countersObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const updateCount = () => {
            const target = +counter.dataset.target;
            const current = +counter.textContent;
            const increment = Math.ceil(target / 40);
            if (current < target) {
              counter.textContent = Math.min(current + increment, target);
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.6 });
  countersObserver.observe(qs('#hero'));

  // Certifications carousel duplication
  const carouselTrack = qs('.carousel-track');
  if (carouselTrack) {
    carouselTrack.innerHTML += carouselTrack.innerHTML; // duplicate to enable infinite scroll
  }

  // Testimonials are presented as static cards in the new design; no slider is required.

  // Formspree submission handling
  const contactForm = qs('#contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        alert('Thank you! Your message has been sent.');
        contactForm.reset();
      } else {
        // If the Formspree request fails (e.g. endpoint not configured or
        // network error), fall back to a mailto link so the visitor can
        // send the message directly via their default mail client. This
        // improves reliability without exposing the email address in a
        // clickable link on the page.
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const message = formData.get('message') || '';
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
        window.location.href = `mailto:butt24@uwindsor.ca?subject=${subject}&body=${body}`;
      }
    }).catch(() => {
      // Same fallback in case of network error
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:butt24@uwindsor.ca?subject=${subject}&body=${body}`;
    });
  });
});