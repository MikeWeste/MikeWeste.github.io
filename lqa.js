(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const header = $('.top');
const navH = () => header ? header.offsetHeight : 0;

/* ---------- i18n ---------- */
const dict = {ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
dict.en = Object.fromEntries($$('[data-t]').map(el => [el.dataset.t, el.innerHTML]));
function lang(l) {
  document.documentElement.lang = l;
  $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  $$('[data-t]').forEach(el => { const v = dict[l]?.[el.dataset.t]; if (v !== undefined) el.innerHTML = v; });
  store.set('portfolioLang', l);
  scheduleRebuild();
}
$$('[data-lang]').forEach(b => b.addEventListener('click', () => lang(b.dataset.lang)));
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- filters ---------- */
$$('[data-filter]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  $$('[data-filter]').forEach(x => x.classList.toggle('active', x === b));
  const f = b.dataset.filter;
  const cards = $$('[data-cat]');
  cards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
  if (window.gsap && !reduced.matches) gsap.fromTo(cards.filter(c => !c.classList.contains('hidden')), {y: 14, autoAlpha: 0}, {y: 0, autoAlpha: 1, duration: .35, stagger: .04, ease: 'power2.out', overwrite: true, clearProps: 'opacity,visibility,transform'});
  scheduleRebuild();
}));

/* ---------- deck (desktop only, only if every chapter fits the screen) ---------- */
const chapters = $$('.ref-card');
const navLinks = $$('.top nav a[href^="#"]');
let ctx = null, deck = null, lenis = null, activeIndex = -1;

function setActiveNav(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
}

function teardown() {
  if (ctx) { ctx.revert(); ctx = null; }
  if (deck) { chapters.forEach(c => { c.inert = false; c.classList.remove('is-open'); deck.stage.before(c); }); deck.stage.remove(); deck = null; }
  document.documentElement.classList.remove('is-deck');
}

function contentFits(pin) {
  return chapters.every(card => {
    const body = $('.chapter-body', card);
    return !body || body.scrollHeight <= body.clientHeight + 4;
  });
}

function build() {
  teardown();
  if (!window.gsap || !window.ScrollTrigger || !chapters.length) return;
  gsap.registerPlugin(ScrollTrigger);
  const wantDeck = innerWidth > 700 && innerHeight >= 620 && !reduced.matches;

  if (wantDeck) {
    const stage = document.createElement('div'); stage.className = 'deck-stage';
    const pin = document.createElement('div'); pin.className = 'deck-pin';
    chapters[0].before(stage); stage.append(pin); chapters.forEach(c => pin.append(c));
    deck = {stage, pin};
    if (!contentFits(pin)) { teardown(); }
  }

  ctx = gsap.context(() => {
    if (deck) {
      document.documentElement.classList.add('is-deck');
      const hold = .7, trans = 1, cycle = hold + trans;
      const duration = chapters.length * hold + (chapters.length - 1) * trans;
      gsap.set(chapters, {yPercent: i => i ? 100 : 0, zIndex: i => i + 1});
      const tl = gsap.timeline({
        defaults: {ease: 'power2.inOut'},
        scrollTrigger: {
          trigger: deck.stage,
          start: () => 'top ' + navH(),
          end: () => '+=' + Math.round(innerHeight * duration * .9),
          pin: deck.pin, pinSpacing: true, scrub: lenis ? true : .6, invalidateOnRefresh: true, anticipatePin: 1
        },
        onUpdate() {
          const idx = Math.min(chapters.length - 1, Math.floor((this.time() + .001) / cycle));
          if (idx === activeIndex) return;
          activeIndex = idx;
          chapters.forEach((c, i) => { c.inert = i !== idx; c.classList.toggle('is-open', i === idx); });
          setActiveNav(chapters[idx].id);
        }
      });
      tl.to({}, {duration}, 0);
      chapters.slice(1).forEach((card, i) => {
        const at = i * cycle + hold;
        tl.to(card, {yPercent: 0, duration: trans}, at);
        tl.to(chapters[i], {scale: .94, yPercent: -3, duration: trans}, at);
      });
      activeIndex = -1;
      chapters.forEach((c, i) => { c.inert = i !== 0; });
      deck.tl = tl; deck.cycle = cycle; deck.hold = hold; deck.duration = duration;
    } else {
      chapters.forEach(card => {
        if (reduced.matches) return;
        const items = $$('.chapter-head, .filters, .project:not(.hidden), .skill-card, .timeline article, .experience-side, .contact-main, .contact-panel', card);
        gsap.from(items, {y: 26, autoAlpha: 0, duration: .6, stagger: .05, ease: 'power2.out', clearProps: 'opacity,visibility,transform',
          scrollTrigger: {trigger: card, start: 'top 88%', once: true}});
        ScrollTrigger.create({trigger: card, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && setActiveNav(card.id)});
      });
    }
    // hero parallax
    if (!reduced.matches) {
      const hero = $('.ref-hero');
      if (hero) {
        gsap.to('.hero-copy', {yPercent: 14, autoAlpha: .35, ease: 'none', scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: true}});
        gsap.to(hero, {backgroundPositionY: '30%', ease: 'none', scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: true}});
      }
    }
  });
  ScrollTrigger.refresh();
}

let rebuildT;
function scheduleRebuild() { clearTimeout(rebuildT); rebuildT = setTimeout(() => { const y = scrollY; build(); scrollTo(0, y); }, 120); }

/* ---------- navigation ---------- */
function targetY(id) {
  const el = document.getElementById(id);
  if (!el || id === 'home') return 0;
  const idx = chapters.indexOf(el);
  if (deck && idx >= 0) {
    const st = deck.tl.scrollTrigger;
    return st.start + (st.end - st.start) * (idx * deck.cycle + deck.hold / 2) / deck.duration;
  }
  return el.getBoundingClientRect().top + scrollY - navH() - 12;
}
function navigateTo(id, smooth) {
  const y = targetY(id);
  if (lenis && smooth) lenis.scrollTo(y, {duration: 1.2});
  else scrollTo({top: y, behavior: smooth ? 'smooth' : 'auto'});
}
$$('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
  const id = link.hash.slice(1);
  if (!document.getElementById(id)) return;
  e.preventDefault();
  history.replaceState(null, '', '#' + id);
  navigateTo(id, !reduced.matches);
}));
addEventListener('hashchange', () => navigateTo(location.hash.slice(1) || 'home', false));

/* ---------- progress bar ---------- */
const bar = document.createElement('div'); bar.className = 'fx-progress'; document.body.append(bar);
let raf = 0;
addEventListener('scroll', () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    header && header.classList.toggle('scrolled', scrollY > 8);
    if (scrollY < 40) setActiveNav('home');
  });
}, {passive: true});

/* ---------- smooth wheel (desktop) ---------- */
function initLenis(done) {
  if (reduced.matches || !finePointer.matches) return done();
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
  s.onload = () => {
    if (window.Lenis && window.gsap) {
      lenis = new Lenis({duration: 1.1, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true});
      lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update());
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    done();
  };
  s.onerror = done;
  document.head.append(s);
}

/* ---------- hover interactions ---------- */
function initHover() {
  if (!finePointer.matches || reduced.matches) return;
  $$('.projects-body .project, .skillgrid .skill-card, .timeline article, .workflow > div').forEach(card => {
    card.classList.add('fx-card');
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      card.style.transform = `perspective(900px) rotateX(${(.5 - y) * 4}deg) rotateY(${(x - .5) * 5}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  $$('.heroCta a').forEach(btn => {
    btn.classList.add('fx-magnet');
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* ---------- boot ---------- */
lang(store.get('portfolioLang') || 'en');
clearTimeout(rebuildT);
let lastW = innerWidth, lastH = innerHeight;
addEventListener('resize', () => {
  if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 120) return;
  lastW = innerWidth; lastH = innerHeight; scheduleRebuild();
});
reduced.addEventListener?.('change', scheduleRebuild);
function boot() {
  initLenis(() => {
    build();
    initHover();
    if (location.hash) navigateTo(location.hash.slice(1), false);
    if (document.fonts) document.fonts.ready.then(() => window.ScrollTrigger && ScrollTrigger.refresh());
  });
}
if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
