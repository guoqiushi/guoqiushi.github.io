(() => {
  const root = document.documentElement;
  const languageButton = document.querySelector('#language-toggle');
  const papers = [...document.querySelectorAll('.paper')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#publication-count');
  function updateCount() {
    const total = papers.filter(paper => !paper.hidden).length;
    count.textContent = root.lang === 'zh-CN' ? `${total} 篇论文` : `${total} ${total === 1 ? 'paper' : 'papers'}`;
  }
  function setLanguage(language) {
    root.lang = language === 'zh-CN' ? 'zh-CN' : 'en';
    const chinese = root.lang === 'zh-CN';
    languageButton.innerHTML = chinese ? 'EN <span aria-hidden="true">/ 中文</span>' : '中文 <span aria-hidden="true">/ EN</span>';
    languageButton.setAttribute('aria-label', chinese ? 'Switch to English' : '切换到中文');
    document.querySelector('.sidebar nav').setAttribute('aria-label', chinese ? '主导航' : 'Main navigation');
    document.querySelector('.filters').setAttribute('aria-label', chinese ? '论文主题' : 'Publication topics');
    document.title = chinese ? 'Qiushi Guo | 计算机视觉研究者' : 'Qiushi Guo | Computer Vision Researcher';
    updateCount();
    try { localStorage.setItem('academic-language', root.lang); } catch (_) { /* Language still works without storage. */ }
  }
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('academic-language'); } catch (_) { /* Use the English default. */ }
  if (savedLanguage) setLanguage(savedLanguage);
  languageButton.addEventListener('click', () => setLanguage(root.lang === 'en' ? 'zh-CN' : 'en'));
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('selected', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    papers.forEach(paper => { paper.hidden = button.dataset.filter !== 'all' && !paper.dataset.topics.split(' ').includes(button.dataset.filter); });
    updateCount();
  }));
  const links = [...document.querySelectorAll('.sidebar nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '0px 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
})();
