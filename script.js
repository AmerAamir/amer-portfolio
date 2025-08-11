// script.js

document.addEventListener('DOMContentLoaded', () => {
  /* Utility functions */
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
  const projectCards = qsa('.project-card');
  const projectGrid = qs('#project-grid');
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

  // Fetch GitHub repositories and append
  const fetchRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/AmerAamir/repos?sort=updated&per_page=6');
      if (!response.ok) throw new Error('GitHub API request failed');
      const repos = await response.json();
      repos.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'project-card';
        // categorize based on language
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
          default:
            category = 'web';
        }
        card.dataset.category = category;
        card.dataset.keywords = `${repo.name} ${repo.description || ''}`;
        card.tabIndex = 0;
        card.innerHTML = `
          <img src="images/placeholder_light_gray_block.png" alt="${repo.name}" loading="lazy">
          <div class="project-info">
            <h3>${repo.name}</h3>
            <p>${repo.description ? repo.description : 'No description provided.'}</p>
            <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener">View on GitHub</a>
          </div>
        `;
        projectGrid.appendChild(card);
      });
      // update list of projectCards for filtering and navigation
      projectCards.splice(0, projectCards.length, ...qsa('.project-card'));
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

  // Testimonials slider
  const testimonials = qsa('.testimonial');
  let testimonialIndex = 0;
  const cycleTestimonials = () => {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === testimonialIndex);
    });
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  };
  cycleTestimonials();
  setInterval(cycleTestimonials, 5000);

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
        alert('Oops! There was a problem sending your message.');
      }
    }).catch(() => alert('Oops! There was a problem sending your message.'));
  });
});