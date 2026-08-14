# Chanuka Dilshan — Personal Portfolio Website

A complete, modern, and fully responsive personal portfolio website for **Chanuka Dilshan**, a BICT Undergraduate at the University of Vavuniya, Sri Lanka. Built with semantic HTML5, modern CSS3, and vanilla JavaScript — no frameworks required.

---

## Live Preview

Open `index.html` directly in any browser, or use the **VS Code Live Server** extension for the best development experience.

The site is also ready for deployment to:
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

---

## Project Structure

```
chanuka-portfolio/
├── index.html                  # Main HTML file
├── css/
│   └── style.css               # All styles (design system, components, themes)
├── js/
│   └── script.js               # All interactivity and animations
├── assets/
│   ├── images/
│   │   ├── profile.jpg         # Profile photo (add your own)
│   │   ├── project-01.jpg      # Portfolio website screenshot
│   │   ├── project-02.jpg      # IoT Smart Car photo
│   │   └── project-03.jpg      # Traffic App screenshot
│   └── cv/
│       └── Chanuka-Dilshan-CV.pdf  # Downloadable CV (add your own)
└── README.md                   # This file
```

---

## Features

### Design
- **Dual Theme**: Elegant light and dark themes with smooth transitions
- **Blue/Slate/Navy palette**: Professional technology-inspired colour system
- **Glassmorphism**: Semi-transparent cards and backdrop blur effects
- **Typography**: Fraunces (headings) · Inter (body) · JetBrains Mono (technical labels)
- **Canvas Particle Background**: Interactive, animated particle system

### Sections
| Section | Description |
|---|---|
| **Navigation** | Sticky navbar with active-link highlighting, hamburger menu, theme toggle |
| **Hero** | Typing animation, profile photo, CTA buttons |
| **About** | Bio, personal details, animated statistics |
| **Education** | Animated vertical timeline |
| **Skills** | Animated progress bars + tools badge grid |
| **Projects** | Filterable card grid with full-featured modal |
| **Experience** | Academic & personal project cards |
| **Contact** | Info panel + validated mailto form |
| **Footer** | SVG wave, links, availability status, back-to-top |

### Interactions & Animations
- Typing effect with rotating role titles
- Scroll-reveal (IntersectionObserver) for all major elements
- Animated statistic counters (count-up on first viewport entry)
- Skill progress bars animate on scroll
- Project card filtering (All / Web / Application / IoT)
- Accessible project detail modal (keyboard focus trap, Escape key, backdrop dismiss)
- Floating profile image animation
- Back-to-top button
- `prefers-reduced-motion` respected

### Accessibility
- Semantic HTML5 landmarks
- ARIA labels, roles, and live regions
- Visible keyboard focus styles
- Focus trap in modal
- Sufficient colour contrast (WCAG AA target)
- Form labels (not placeholder-only)
- `alt` text on all images

### Performance & SEO
- Lazy loading for project images
- CSS custom properties for efficient theming
- No heavy frameworks or build steps
- Open Graph meta tags
- Proper `<title>` and `<meta description>`
- Heading hierarchy (`h1` → `h6`)

---

## Getting Started

### 1. Add Your Assets

Before opening the site, place your files in the correct locations:

```
assets/images/profile.jpg        ← Your profile photo (recommend square, min 400×400 px)
assets/images/project-01.jpg    ← Screenshot of your portfolio website
assets/images/project-02.jpg    ← Photo of your IoT Smart Car
assets/images/project-03.jpg    ← Screenshot of your Traffic App
assets/cv/Chanuka-Dilshan-CV.pdf ← Your CV PDF
```

> **Tip:** If images are missing, the site shows a styled placeholder automatically — nothing will break.

### 2. Open in Browser

**Option A — Direct file open:**
Double-click `index.html` to open in your default browser.

**Option B — VS Code Live Server (recommended):**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**

---

## Customisation

### Colours (css/style.css)
All colours are defined as CSS custom properties near the top of `style.css`:

```css
[data-theme="dark"] {
  --bg-main:    #0B132B;
  --bg-surface: #1C2541;
  --accent:     #38BDF8;
  /* ... */
}

[data-theme="light"] {
  --bg-main:    #F0F4F8;
  --bg-surface: #FFFFFF;
  --accent:     #0284C7;
  /* ... */
}
```

### Project Data (js/script.js)
Project modal content is defined in the `PROJECTS` array at the top of `script.js`. Edit descriptions, tech stacks, and features there.

### Contact Form
The form uses a `mailto:` action. When a visitor submits the form, their default email client will open with the fields pre-filled. No server or backend is required.

---

## Deployment

### GitHub Pages
1. Push the project folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the source to the `main` branch, root folder.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Netlify (drag-and-drop)
1. Visit [app.netlify.com](https://app.netlify.com).
2. Drag the `chanuka-portfolio` folder onto the deploy area.
3. Done — instant live URL.

### Vercel
1. Import your GitHub repository at [vercel.com/new](https://vercel.com/new).
2. No build configuration needed — deploy as a static site.

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 90+ | ✅ |
| Edge 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 14+ | ✅ |
| Mobile (iOS/Android) | ✅ |

---

## License

© 2026 Chanuka Dilshan. All rights reserved.  
This project is created for personal use. Please do not redistribute or claim as your own.
