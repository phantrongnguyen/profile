// Text-only rendering: content is never interpreted as HTML.
(() => {
  const content = {
    name: "Phan Trong Nguyen",
    title: "Data Engineer",
    links: {
      facebook: "https://www.facebook.com/nguyen.phan.892024/",
      github: "https://github.com/phantrongnguyen",
      linkedin: "https://www.linkedin.com/in/phan-tr%E1%BB%8Dng-nguy%C3%AAn-a966ab327/"
    },
    contact: {
      email: "pn629503@gmail.com",
      location: "Ho Chi Minh City, Vietnam",
      phone: "0373649633"
    },
    summary: "",
    headline: "Your next chapter starts here.",
    subtitle: "Describe your focus, interests, and what you want to create.",
    sections: [
      { id: "about", title: "About Me", headline: "Building my career\nin Data Engineering.", subtitle: "", introduction: "I am an aspiring Data Engineer with a strong interest in designing and developing scalable, reliable, and efficient data systems. I am particularly interested in building data pipelines, integrating data from multiple sources, and optimizing data processing workflows.\n\nMy career goal is to become a professional Data Engineer, continuously enhance my technical expertise, and contribute to building robust data infrastructure that supports data-driven decision-making.", cards: [
        { title: "Data Pipelines", description: "Hands-on internship experience building data pipelines to support the movement and processing of data.", symbol: "01" },
        { title: "Data Integration", description: "Practical experience integrating data from multiple sources into data processing workflows.", symbol: "02" },
        { title: "Data Processing", description: "Experience developing workflows that prepare and process data for downstream use.", symbol: "03" }
      ] },
      { id: "experience", title: "Experience", headline: "Experience", subtitle: "Work experience, internships, and building real-world data systems." },
      { id: "blogs", title: "Blogs", headline: "Blogs", subtitle: "Technical notes on data engineering, technology, and lessons from real-world projects." },
      { id: "projects", title: "Projects", headline: "Projects", subtitle: "Featured data engineering projects and technical solutions.", cards: [
        { title: "Project title", description: "Describe the problem, your contribution, and the outcome." }
      ] },
      { id: "skills", title: "Skills", headline: "Technical Stack &\nData Tooling.", subtitle: "Technologies, frameworks, and database engines I leverage to build end-to-end data systems." },
      { id: "education", title: "Education", headline: "Education", subtitle: "" }
    ]
  };

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
      link.title = `${link.getAttribute('aria-label')}: link not updated`;
    }
  });
  setText('headline', content.headline);
  setText('subtitle', content.subtitle);
  const pageId = document.body.dataset.page || 'about';
  const section = content.sections.find(item => item.id === pageId);
  if (section) {
    setText('headline', section.headline ?? content.headline);
    setText('subtitle', section.subtitle ?? content.subtitle);
    document.getElementById('subtitle').hidden = !document.getElementById('subtitle').textContent.trim();
  }
  document.querySelectorAll('.tab-navigation a').forEach(link => {
    const active = link.dataset.page === pageId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (!section) return;
  const commands = {
    about: 'whoami',
    experience: 'cat experience',
    skills: 'ls skills',
    education: 'cat education',
    blogs: 'ls blogs',
    projects: 'ls projects'
  };
  const termPrompt = document.querySelector('.hero .term-prompt');
  const termCmd = document.querySelector('.hero .term-cmd');
  if (termPrompt) termPrompt.textContent = 'nguyen:~$';
  if (termCmd && commands[pageId]) termCmd.textContent = commands[pageId];
  document.title = `${section.title} | ${content.name} - ${content.title}`;
  const sections = document.getElementById('sections');
  if (!sections) return;
  const panel = document.createElement('section');
  panel.id = section.id;
  panel.setAttribute('aria-labelledby', `${section.id}-heading`);
  const heading = document.createElement('h2');
  heading.id = `${section.id}-heading`;
  heading.className = 'section-title';
  heading.textContent = section.title;
  if (pageId === 'about') {
    const sectionHead = document.createElement('div');
    sectionHead.className = 'section-head';
    const index = document.createElement('span');
    index.className = 'section-index';
    index.textContent = '01';
    index.setAttribute('aria-hidden', 'true');
    const rule = document.createElement('span');
    rule.className = 'section-rule';
    rule.setAttribute('aria-hidden', 'true');
    sectionHead.append(index, heading, rule);
    panel.append(sectionHead);
  } else panel.append(heading);
  const introduction = document.createElement('p');
  introduction.className = 'about-text';
  introduction.textContent = section.introduction;
  introduction.hidden = !section.introduction?.trim();
  const grid = document.createElement('div');
  grid.className = 'services-grid';
  section.cards.forEach(card => {
    const article = document.createElement('article');
    article.className = 'service-card';
    const title = document.createElement('h3');
    title.textContent = card.title;
    const description = document.createElement('p');
    description.textContent = card.description;
    description.hidden = !card.description?.trim();
    article.append(title, description);
    if (pageId === 'about' && card.symbol) {
      const symbol = document.createElement('span');
      symbol.className = 'about-card-symbol';
      symbol.textContent = card.symbol;
      symbol.setAttribute('aria-hidden', 'true');
      article.prepend(symbol);
    }
    grid.append(article);
  });
  panel.append(introduction);
  if (pageId === 'about') {
    const label = document.createElement('h3');
    label.className = 'about-services-label';
    label.textContent = '// what I do';
    panel.append(label);
  }
  panel.append(grid);
  sections.append(panel);
})();
