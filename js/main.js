// Text-only rendering: content is never interpreted as HTML.
(() => {
  const content = window.PROFILE_CONTENT;
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  setText('profile-name', content.name);
  setText('profile-title', content.title);
  ['email', 'location', 'phone'].forEach(field => {
    setText(`contact-${field}`, content.contact?.[field] || '');
  });
  setText('profile-summary', content.summary || '');
  document.getElementById('profile-summary').closest('.console-section').hidden = !content.summary?.trim();
  ['facebook', 'github', 'linkedin'].forEach(network => {
    const link = document.getElementById(`link-${network}`);
    const url = content.links?.[network];
    if (url && /^https?:\/\//i.test(url)) {
      link.href = url;
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.title = `${link.getAttribute('aria-label')}: chưa cập nhật liên kết`;
    }
  });
  setText('headline', content.headline);
  setText('subtitle', content.subtitle);
  const sections = document.getElementById('sections');
  const pageId = document.body.dataset.page || 'about';
  const section = content.sections.find(item => item.id === pageId);
  document.querySelectorAll('.tab-navigation a').forEach(link => {
    const active = link.dataset.page === pageId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (!section) return;
  document.title = `${section.title} | ${content.name} - ${content.title}`;
  const panel = document.createElement('section');
  panel.id = section.id;
  panel.setAttribute('aria-labelledby', `${section.id}-heading`);
  const heading = document.createElement('h2');
  heading.id = `${section.id}-heading`;
  heading.className = 'section-title';
  heading.textContent = section.title;
  const introduction = document.createElement('p');
  introduction.className = 'about-text';
  introduction.textContent = section.introduction;
  const grid = document.createElement('div');
  grid.className = 'services-grid';
  section.cards.forEach(card => {
    const article = document.createElement('article');
    article.className = 'service-card';
    const title = document.createElement('h3');
    title.textContent = card.title;
    const description = document.createElement('p');
    description.textContent = card.description;
    article.append(title, description);
    grid.append(article);
  });
  panel.append(heading, introduction, grid);
  sections.append(panel);
})();