async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function applyTokens(tokens) {
  const root = document.documentElement;
  const vars = tokens?.aliases_cssVars?.vars || {};
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
}

function createHero(sections) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const hashtags = sections.hero_hashtags || [];
  const aboutPreview = sections.about_preview || [];

  hero.innerHTML = `
    <div class="hero__hashtags">${hashtags.map(hash => `<span>${hash}</span>`).join('')}</div>
    <div class="hero__body">${aboutPreview.map(p => `<p>${p}</p>`).join('')}</div>
    <div class="hero__cta">
      <a class="btn-primary" href="/contact">Let’s collaborate</a>
      <a class="btn-ghost" href="/work">View portfolio</a>
    </div>
  `;
}

function createSkillsStrip(skills) {
  const strip = document.getElementById('skills-strip');
  if (!strip) return;
  strip.innerHTML = skills.map(skill => `<span class="skills__tag">${skill}</span>`).join('');
}

function createAbout(sectionHome, sectionAbout) {
  const container = document.getElementById('about-content');
  if (!container) return;
  const intro = sectionHome.about_preview || [];
  const metrics = sectionAbout.metrics || [];
  const experience = sectionAbout.experience || [];
  const education = sectionAbout.education_and_trainings || [];

  const introCard = `
    <article class="card">
      <h3>Bio</h3>
      ${intro.map(p => `<p>${p}</p>`).join('')}
    </article>
  `;

  const metricCard = `
    <article class="card">
      <h3>Impact</h3>
      <div class="metrics">
        ${metrics.map(metric => `<div class="metric"><strong>${metric.value}</strong><span>${metric.label}</span></div>`).join('')}
      </div>
    </article>
  `;

  const experienceCard = `
    <article class="card">
      <h3>Experience</h3>
      <div class="timeline">
        ${experience.map(item => `
          <div class="timeline__item">
            <h4>${item.role}</h4>
            <div class="org">${item.org} · ${item.period}</div>
            <div class="chips">${(item.highlights || []).map(text => `<span>${text}</span>`).join('')}</div>
          </div>
        `).join('')}
      </div>
    </article>
  `;

  const eduCard = `
    <article class="card">
      <h3>Education & trainings</h3>
      <div class="timeline">
        ${education.map(item => `
          <div class="timeline__item">
            <h4>${item.title}</h4>
            <div class="org">${item.org}</div>
          </div>
        `).join('')}
      </div>
    </article>
  `;

  container.innerHTML = introCard + metricCard + experienceCard + eduCard;
}

function createWorkCards(workSections) {
  const grid = document.getElementById('work-cards');
  if (!grid) return;
  const cards = workSections.projects || workSections.work_cards || [];
  grid.innerHTML = cards.map(card => `
    <article class="work__card">
      <div class="work__visual" aria-hidden="true"></div>
      <div class="work__body">
        <p>${card.category}</p>
        <h3>${card.title}</h3>
      </div>
    </article>
  `).join('');
}

function createCTA(contactSections, fallbackCTA) {
  const cta = document.getElementById('cta');
  if (!cta) return;
  const heading = contactSections.heading || fallbackCTA.heading || 'let’s talk';
  const text = (contactSections.text && contactSections.text[0]) || fallbackCTA.text || '';
  const email = contactSections.email;
  const links = fallbackCTA.links || [];

  const emailLink = email ? `<a class="btn-primary" href="mailto:${email}">Email me</a>` : '';
  const linkButtons = links.map(link => `<a class="btn-ghost" href="#">${link}</a>`).join('');

  cta.innerHTML = `
    <h3>${heading}</h3>
    <p>${text}</p>
    <div class="links">${emailLink}${linkButtons}</div>
  `;

  const footerLinks = document.getElementById('footer-links');
  const footerItems = [
    email ? `<a href="mailto:${email}">Email</a>` : null,
    ...links.map(link => `<a href="#">${link}</a>`)
  ].filter(Boolean).join('');
  footerLinks.innerHTML = footerItems;
}

function setActiveNav(slug) {
  const links = document.querySelectorAll('.menu a');
  links.forEach(link => {
    const isMatch = link.getAttribute('href') === `/${slug === 'home' ? '' : slug}`;
    if (isMatch || (slug === 'home' && link.getAttribute('href') === '/')) {
      link.classList.add('is-active');
    }
  });
}

function renderPage(slug, pages) {
  const home = pages.home || {};
  const about = pages.about || {};
  const work = pages.work || {};
  const contact = pages.contact || {};

  switch (slug) {
    case 'about':
      createAbout(home, about);
      createCTA(contact, about.cta || home.cta || {});
      break;
    case 'work':
      createWorkCards(work);
      createCTA(contact, work.cta || home.cta || {});
      break;
    case 'contact':
      createCTA(contact, home.cta || {});
      break;
    default:
      createHero(home);
      createSkillsStrip(home.skills_strip || []);
      createAbout(home, about);
      createWorkCards(work);
      createCTA(contact, home.cta || { heading: "let's talk", text: 'Drop me a line', links: ['Email'] });
  }
}

async function init() {
  try {
    const [tokens, content] = await Promise.all([
      loadJSON('maxim_styles.json'),
      loadJSON('maximshevchenko_site_content.json')
    ]);

    applyTokens(tokens);

    const pages = Object.fromEntries((content.pages || []).map(page => [page.slug, page.sections]));
    const slug = document.querySelector('main')?.dataset.page || 'home';

    setActiveNav(slug);
    renderPage(slug, pages);

    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', init);
