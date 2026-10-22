// Text-only rendering: content is never interpreted as HTML.
(() => {
  const content = window.PROFILE_CONTENT;
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  setText('profile-name', content.name);
  setText('profile-title', content.title);
  setText('profile-summary', content.summary);
  setText('headline', content.headline);
  setText('subtitle', content.subtitle);
  const navigation = document.querySelector('.tab-navigation');
  const sections = document.getElementById('sections');
  const buttons = [];
  const panels = [];
  const activate = (index, focus = false) => {
    buttons.forEach((button, position) => {
      const active = position === index;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
      panels[position].classList.toggle('active', active);
    });
    if (focus) buttons[index].focus();
  };
  content.sections.forEach((section, index) => {
    const button = document.createElement('button');
    button.className = 'tab-btn';
    button.id = `tab-${section.id}`;
    button.type = 'button';
    button.textContent = section.title;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', section.id);
    const panel = document.createElement('section');
    panel.className = 'tab-pane';
    panel.id = section.id;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
    const heading = document.createElement('h2');
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
    button.addEventListener('click', () => activate(index));
    button.addEventListener('keydown', event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      activate(next, true);
    });
    buttons.push(button);
    panels.push(panel);
    navigation.append(button);
    sections.append(panel);
  });
  if (buttons.length) activate(0);
})();
