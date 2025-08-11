# Amer Hamza Aamir – Portfolio

This repository contains the source code for **Amer Hamza Aamir's** personal portfolio website. It is a modern, responsive, and accessible static site built with **HTML5**, **CSS3**, and **vanilla JavaScript**. The site showcases Amer's background, projects, skills, achievements, blog posts, certifications, testimonials, résumé, and contact information.

## Features

- **Responsive design** – mobile‑first layout that adapts to any screen size.
- **Dark/Light mode** with a color picker that persists your preferences using `localStorage`.
- **Typewriter hero headline** cycling through multiple descriptors.
- **Scroll progress indicator** and animated statistics counters.
- **Experience & education cards** with concise bullet points.
- **Project grid** with category filters, instant search box, keyboard navigation, lazy‑loaded images, and auto‑fetch of recent public GitHub repositories.
- **Skills section** with animated proficiency bars and tooltips explaining real‑world use.
- **Achievements**, **blog/articles**, **certifications carousel**, **testimonials slider**, **embedded résumé viewer**, and **contact form** (using Formspree with mailto fallback).
- **Accessibility** – semantic HTML, skip link, focus styles, ARIA labels, keyboard navigation support.
- **SEO ready** – descriptive metadata and Open Graph tags.

## Getting Started

Clone the repository and open `index.html` in your favourite browser. To run a local web server you can use Python:

```bash
git clone https://github.com/AmerAamir/amer-portfolio.git
cd amer-portfolio
python3 -m http.server 8000
```

Then browse to `http://localhost:8000`.

### Replace résumé and images

The file `Amer_Hamza_Aamir_Resume.pdf` is a placeholder. Replace it with your own PDF résumé while keeping the same filename. The **images** used in the hero background and certification carousel live in the `images/` folder. Replace `hero-background.png`, `ai-logo.png`, `cloud-logo.png` and `degree-logo.png` with your own assets. Keep file names consistent or update the references in `index.html` accordingly.

### Updating blog posts

Blog entries are defined in the **Blog/Articles** section of `index.html` as individual `<article>` elements. You can edit the titles, descriptions, and links to point to your actual LinkedIn or external articles.

### Project filters and categories

Projects are categorised using the `data-category` attribute on each `.project-card`. Available filters are: `ml`, `web`, `systems`, and `low-code`. To add a new project manually:

1. Create a new `<article class="project-card" data-category="CATEGORY" data-keywords="keyword list" tabindex="0">` element inside the **Projects** grid in `index.html`.
2. Add an `<img>` with a lazy‑loaded thumbnail, a heading, description, and link.
3. Categories determine which filter button will show the card. Keywords are used by the search box.

### GitHub auto‑fetch

The page automatically pulls the latest six public repositories from GitHub’s REST API using:

```js
fetch('https://api.github.com/users/AmerAamir/repos?sort=updated&per_page=6');
```

The `sort` and `per_page` query parameters control the order and number of repositories returned. According to GitHub’s documentation, `sort` can be one of `created`, `updated`, `pushed` or `full_name`, while `per_page` specifies how many results to return per page【550054341274887†L562-L579】.  Each fetched repository is categorised by its primary language: Python and Jupyter notebook repos are tagged as **ML**, C/C++ repos as **Systems**, and everything else defaults to **Web**.  If you wish to change how many repos are displayed or adjust categorisation, modify the `fetchRepos()` function in `script.js`.

## Deployment

1. Create a public repository named **`amer-portfolio`** on your GitHub account.
2. Push all files (`index.html`, `style.css`, `script.js`, `images/`, `Amer_Hamza_Aamir_Resume.pdf`, `README.md`, `LICENSE`) to the repository.
3. Go to the repository **Settings → Pages** and choose the `main` branch with `/ (root)` as the source. Save to enable GitHub Pages.
4. After a few minutes your site will be live at `https://<username>.github.io/amer-portfolio/`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
