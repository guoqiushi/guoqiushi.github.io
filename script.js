(() => {
  const root = document.documentElement;
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const languages = {
    en: { navigation: 'Main navigation', topics: 'Publication topics', language: 'Language', home: 'Qiushi Guo, homepage', title: 'Qiushi Guo | Computer Vision Researcher', description: 'Qiushi Guo — computer vision researcher working on robust and data-efficient visual learning, face analysis, synthetic data, and RGB/IR perception.' },
    'zh-CN': { navigation: '主导航', topics: '论文主题', language: '语言', home: 'Qiushi Guo，个人主页', title: 'Qiushi Guo | 计算机视觉研究者', description: 'Qiushi Guo 的个人学术主页：鲁棒且数据高效的视觉学习、人脸分析、合成数据与 RGB/IR 感知。' },
    ja: { navigation: 'メインナビゲーション', topics: '論文の研究分野', language: '表示言語', home: 'Qiushi Guo のホームページ', title: 'Qiushi Guo | コンピュータビジョン研究者', description: 'Qiushi Guo の研究者ホームページ。頑健でデータ効率の高い視覚学習、顔解析、合成データ、RGB/IR センシングを研究。' }
  };
  const papers = [...document.querySelectorAll('.paper')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('#publication-count');
  function updateCount() {
    const total = papers.filter(paper => !paper.hidden).length;
    count.textContent = root.lang === 'ja' ? `${total} 件の論文` : root.lang === 'zh-CN' ? `${total} 篇论文` : `${total} ${total === 1 ? 'paper' : 'papers'}`;
  }
  function setLanguage(language) {
    root.lang = Object.prototype.hasOwnProperty.call(languages, language) ? language : 'en';
    const labels = languages[root.lang];
    languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === root.lang)));
    document.querySelector('.language-switcher').setAttribute('aria-label', labels.language);
    document.querySelector('.sidebar nav').setAttribute('aria-label', labels.navigation);
    document.querySelector('.identity').setAttribute('aria-label', labels.home);
    document.querySelector('.filters').setAttribute('aria-label', labels.topics);
    document.title = labels.title;
    document.querySelector('meta[name="description"]').setAttribute('content', labels.description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', labels.title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', labels.description);
    updateCount();
    try { localStorage.setItem('academic-language', root.lang); } catch (_) { /* Language still works without storage. */ }
  }
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('academic-language'); } catch (_) { /* Use the English default. */ }
  setLanguage(savedLanguage || 'en');
  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('selected', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    papers.forEach(paper => { paper.hidden = button.dataset.filter !== 'all' && !paper.dataset.topics.split(' ').includes(button.dataset.filter); });
    updateCount();
  }));

  const timelineRail = document.querySelector('.visual-timeline');
  document.querySelector('[data-timeline-back]').addEventListener('click', () => timelineRail.scrollBy({left: -308, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
  document.querySelector('[data-timeline-forward]').addEventListener('click', () => timelineRail.scrollBy({left: 308, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
  const milestones = [...document.querySelectorAll('.visual-milestone')];
  document.querySelectorAll('[data-timeline-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-timeline-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    milestones.forEach(item => { item.hidden = button.dataset.timelineFilter !== 'all' && item.dataset.timelineKind !== button.dataset.timelineFilter; });
    timelineRail.scrollLeft = 0;
  }));
  const viewer = document.querySelector('#timeline-viewer');
  const gallery = [...document.querySelectorAll('[data-timeline-image]')];
  let imageIndex = 0;
  function showTimelineImage(index) {
    imageIndex = (index + gallery.length) % gallery.length;
    const source = gallery[imageIndex];
    const title = source.closest('.milestone-card').querySelector(`h3 span[lang="${root.lang}"]`).textContent;
    const image = document.querySelector('#timeline-large-image');
    image.src = source.dataset.timelineImage;
    image.alt = title;
    document.querySelector('#timeline-image-title').textContent = title;
    document.querySelector('#timeline-image-count').textContent = `${imageIndex + 1} / ${gallery.length}`;
  }
  gallery.forEach((button, index) => button.addEventListener('click', () => { showTimelineImage(index); viewer.showModal(); }));
  document.querySelector('[data-viewer-close]').addEventListener('click', () => viewer.close());
  document.querySelector('[data-viewer-prev]').addEventListener('click', () => showTimelineImage(imageIndex - 1));
  document.querySelector('[data-viewer-next]').addEventListener('click', () => showTimelineImage(imageIndex + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showTimelineImage(imageIndex + (event.key === 'ArrowLeft' ? -1 : 1)); }
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) { const rect = viewer.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close(); } });

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
