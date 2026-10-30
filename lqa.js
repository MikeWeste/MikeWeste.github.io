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
const dict = {ru:{navProfile:"Профиль",navContact:"Контакты",navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Скины и игровые ассеты, опубликованные в Steam Workshop.",jellyText:"Головоломка в Google Play: геймплей, UI, тестирование и релиз.",timeText:"Android-приложение в Google Play — от идеи до релиза, тесты на реальных устройствах.",lookText:"Telegram-бот и Mini App с AI-стилями для фото: Python, оплата Stars, Docker/VPS.",supportTitle:"Техническая диагностика",supportText:"1–2 линия: воспроизвести, найти причину, описать, эскалировать — и довести до решения.",s1:"Нахожу, воспроизвожу и понятно описываю ошибки — с вниманием к UI, тексту и геймплею.",supportRole:"Техническая и чат-поддержка",supportExp:"Поддержка в чатах на английском, диагностика Windows и ПО, логи, оформление обращений, эскалация и сопровождение до решения.",projHead:"Что я сделал",pBot:"Бот на Python: команды, пользовательские сценарии, интеграции с API и деплой.",pMini:"Фронтенд Mini App, связанный с Python-бэкендом через REST API.",pMcp:"MCP-серверы и API-коннекторы, связывающие AI-инструменты с внешними сервисами и данными.",pTime:"Android-приложение: UI, сборки, тесты на устройствах, релиз в Google Play.",pJelly:"Игра-головоломка: геймплей, UI, тестирование, релиз в Google Play.",pRust:"Скины в Blender и Substance 3D: UV, PBR, текстурные карты.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме",r1:"UV-развёртки и PBR-материалы",r2:"Ограничения texture maps в Workshop",r3:"Blender → Substance 3D → Photoshop",s1a:"Воспроизведение с точными шагами",s1b:"Проверка UI/UX, текста и вёрстки",s1c:"Повторная проверка исправлений",s1d:"Баг-репорты со скриншотами и логами",s2:"Игровые ассеты: от моделирования и UV до PBR-текстур.",s2a:"Моделирование и UV в Blender",s2b:"PBR-текстуры в Substance 3D Painter",s2c:"Карты BaseColor, Normal, Height, AO, Emissive",s2d:"Подготовка под ограничения Rust Workshop",s3:"Android и Python: приложения, автоматизация и интеграции с API.",s3a:"Android-приложения в Google Play",s3b:"Telegram-боты и Mini Apps на Python",s3c:"Интеграции REST API и MCP",s3d:"Основы Unity, Android Studio, VS Code",s4:"Практическая диагностика ПК, сетей и удалённых пользователей.",s4a:"Установка Windows, драйверы, логи",s4b:"BIOS/UEFI, сборка и апгрейд ПК",s4c:"Локальная сеть, VPN и прокси",s4d:"Удалённая помощь и работа с тикетами"}};
dict.en = Object.fromEntries($$('[data-t]').map(el => [el.dataset.t, el.innerHTML]));
function lang(l, animate) {
  if (animate && l === document.documentElement.lang) return;
  document.documentElement.lang = l;
  $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  store.set('portfolioLang', l);
  const els = $$('[data-t]').filter(el => dict[l]?.[el.dataset.t] !== undefined && el.innerHTML !== dict[l][el.dataset.t]);
  const apply = () => { els.forEach(el => { el.innerHTML = dict[l][el.dataset.t]; }); };
  if (!animate || reduced.matches || !window.gsap || !els.length) { apply(); return scheduleRebuild(); }
  // crossfade: blur text out, swap, blur back in with a light stagger
  const token = lang.token = (lang.token || 0) + 1;
  gsap.to(els, {autoAlpha: 0, y: -6, filter: 'blur(4px)', duration: .18, ease: 'power1.in', overwrite: true, onComplete() {
    if (token !== lang.token) return;
    apply();
    gsap.fromTo(els, {autoAlpha: 0, y: 8, filter: 'blur(4px)'}, {autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .4, ease: 'power2.out', stagger: {amount: .2}, clearProps: 'opacity,visibility,transform,filter', onComplete: scheduleRebuild});
  }});
}
$$('[data-lang]').forEach(b => b.addEventListener('click', () => lang(b.dataset.lang, true)));
const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- filters (FLIP: leaving cards fade out, the rest glide to new spots) ---------- */
let filterToken = 0, refreshT = 0;
$$('[data-filter]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  if (b.classList.contains('active')) return;
  $$('[data-filter]').forEach(x => x.classList.toggle('active', x === b));
  const f = b.dataset.filter, token = ++filterToken;
  const cards = $$('[data-cat]'), visible = () => cards.filter(c => !c.classList.contains('hidden'));
  const keep = c => f === 'all' || c.dataset.cat === f;
  const apply = () => { cards.forEach(c => c.classList.toggle('hidden', !keep(c))); clearTimeout(refreshT); if (!deck) refreshT = setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 900); };
  if (!window.gsap || reduced.matches) return apply();
  const flip = () => {
    const first = new Map(visible().map(c => [c, c.getBoundingClientRect()]));
    apply();
    visible().forEach((c, i) => {
      const a = first.get(c), z = c.getBoundingClientRect();
      if (a) gsap.fromTo(c, {x: a.left - z.left, y: a.top - z.top}, {x: 0, y: 0, autoAlpha: 1, scale: 1, duration: .55, ease: 'power3.out', overwrite: true, clearProps: 'opacity,visibility,transform'});
      else gsap.fromTo(c, {autoAlpha: 0, scale: .94, y: 18}, {autoAlpha: 1, scale: 1, y: 0, duration: .5, delay: .1 + i * .05, ease: 'power3.out', overwrite: true, clearProps: 'opacity,visibility,transform'});
    });
  };
  const leaving = visible().filter(c => !keep(c));
  if (!leaving.length) return flip();
  gsap.to(leaving, {autoAlpha: 0, scale: .94, duration: .2, ease: 'power1.in', overwrite: true, onComplete() {
    gsap.set(leaving, {clearProps: 'opacity,visibility,transform'});
    if (token === filterToken) flip();
  }});
}));

/* ---------- chapter titles: split into letters for a wave reveal ---------- */
function splitTitle(h) {
  const text = h.textContent;
  h.setAttribute('aria-label', text);
  h.innerHTML = [...text].map(ch => '<span class="fx-ch" aria-hidden="true">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>').join('');
  return $$('.fx-ch', h);
}
function waveTitle(card) {
  if (!card._chars || reduced.matches || !window.gsap) return;
  gsap.fromTo(card._chars, {yPercent: 70, autoAlpha: 0, rotate: 8}, {yPercent: 0, autoAlpha: 1, rotate: 0, duration: .7, stagger: .035, ease: 'back.out(1.7)', overwrite: true, clearProps: 'opacity,visibility,transform'});
}

/* ---------- text cards: unfold top-down, then their contents rise in one after another ---------- */
const CARD_SEL = '.project:not(.hidden), .skill-card, .timeline article, .experience-side, .contact-main, .contact-panel';
const PILL_SEL = '.project-meta span, .skill-pills span, .exp-pills span, .contact-status span, .experience-focus span, .heroCta a';
function resetCards(items) {
  if (!window.gsap || !items.length) return;
  gsap.killTweensOf(items); gsap.killTweensOf(items.flatMap(it => [...it.children, ...$$(PILL_SEL, it)]));
  gsap.set(items, {clearProps: 'opacity,visibility,transform,clipPath'});
}
function revealCards(items, delay = 0) {
  if (!window.gsap || reduced.matches || !items.length) return;
  resetCards(items);
  items.forEach((it, n) => {
    const r = getComputedStyle(it).borderTopLeftRadius || '16px', at = delay + n * .08;
    const parts = [...it.children].filter(el => el.tagName !== 'I' && !el.classList.contains('fx-dim'));
    const pills = $$(PILL_SEL, it), arrow = $(':scope > i', it);
    gsap.fromTo(it, {clipPath: `inset(0 0 100% 0 round ${r})`, y: 18, autoAlpha: 0}, {clipPath: `inset(0 0 0% 0 round ${r})`, y: 0, autoAlpha: 1, duration: .75, delay: at, ease: 'expo.out', clearProps: 'opacity,visibility,transform,clipPath'});
    gsap.fromTo(parts, {y: 14, autoAlpha: 0}, {y: 0, autoAlpha: 1, duration: .5, delay: at + .12, stagger: .045, ease: 'power3.out', clearProps: 'opacity,visibility,transform'});
    if (pills.length) gsap.fromTo(pills, {scale: .8, autoAlpha: 0}, {scale: 1, autoAlpha: 1, duration: .45, delay: at + .3, stagger: .03, ease: 'back.out(2)', clearProps: 'opacity,visibility,transform'});
    if (arrow) gsap.fromTo(arrow, {rotate: -90, autoAlpha: 0}, {rotate: 0, autoAlpha: 1, duration: .6, delay: at + .25, ease: 'back.out(1.8)', clearProps: 'opacity,visibility,transform'});
  });
}

/* ---------- deck (desktop only, only if every chapter fits the screen) ---------- */
const chapters = $$('.ref-card');
chapters.forEach(c => { const h = $('.chapter-head h2', c); if (h) c._chars = splitTitle(h); });
const navLinks = $$('.top nav a[href^="#"]');
let ctx = null, deck = null, lenis = null, activeIndex = -1;

function setActiveNav(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + id));
}

function teardown() {
  if (ctx) { ctx.revert(); ctx = null; }
  if (deck) { chapters.forEach(c => { c.inert = false; if (c._body) { c._body.inert = false; gsap.set(c._body, {clearProps: 'all'}); } if (c._dim) c._dim.style.opacity = 0; c.classList.remove('is-open'); gsap.set(c, {clearProps: 'top,height,zIndex'}); deck.stage.before(c); }); deck.stage.remove(); deck = null; }
  document.documentElement.classList.remove('is-deck');
}

const HC = 68, SL = 10;
function deckH() { return deck.pin.clientHeight; }
function geo(state, i, H, n) {
  if (state < 0) return {top: i * H / n, height: H / n, dim: 0, body: 0};
  if (i < state) return {top: i * SL, height: H - i * SL - (n - 1 - state) * HC, dim: .6, body: 0};
  if (i === state) return {top: i * SL, height: H - i * SL - (n - 1 - state) * HC, dim: 0, body: 1};
  return {top: H - (n - i) * HC, height: HC, dim: 0, body: 0};
}
function applyGeo(state) {
  const H = deckH(), n = chapters.length;
  chapters.forEach((c, i) => { const g = geo(state, i, H, n); gsap.set(c, {top: g.top, height: g.height}); gsap.set(c._dim, {opacity: g.dim}); gsap.set(c._body, {autoAlpha: g.body}); });
}
function contentFits() {
  const H = deckH(), n = chapters.length;
  // measure with every project shown, so filtering never flips the layout mode
  const filtered = $$('[data-cat].hidden');
  filtered.forEach(c => c.classList.remove('hidden'));
  const ok = chapters.every((card, i) => {
    const g = geo(i, i, H, n);
    card.style.top = g.top + 'px'; card.style.height = g.height + 'px';
    return !card._body || card._body.scrollHeight <= card._body.clientHeight + 4;
  });
  chapters.forEach(c => { c.style.top = ''; c.style.height = ''; });
  filtered.forEach(c => c.classList.add('hidden'));
  return ok;
}

function build() {
  teardown();
  resetCards($$(CARD_SEL));
  if (!window.gsap || !window.ScrollTrigger || !chapters.length) return;
  gsap.registerPlugin(ScrollTrigger);
  chapters.forEach(c => {
    c._body = $('.chapter-body', c);
    if (!c._dim) { c._dim = document.createElement('div'); c._dim.className = 'fx-dim'; c.append(c._dim); }
  });
  const wantDeck = innerWidth > 700 && innerHeight >= 620 && !reduced.matches;
  if (wantDeck) {
    const stage = document.createElement('div'); stage.className = 'deck-stage';
    const pin = document.createElement('div'); pin.className = 'deck-pin';
    chapters[0].before(stage); stage.append(pin); chapters.forEach(c => pin.append(c));
    deck = {stage, pin};
    document.documentElement.classList.add('is-deck');
    if (!contentFits()) teardown();
  }

  ctx = gsap.context(() => {
    if (deck) {
      const n = chapters.length, trans = 1, hold = .8, cycle = trans + hold, duration = n * cycle;
      chapters.forEach((c, i) => gsap.set(c, {zIndex: i + 1}));
      applyGeo(-1);
      const tl = gsap.timeline({
        defaults: {ease: 'power3.inOut', duration: trans},
        scrollTrigger: {
          trigger: deck.stage,
          start: () => 'top ' + navH(),
          end: () => '+=' + Math.round(innerHeight * duration * .75),
          pin: deck.pin, pinSpacing: true, scrub: lenis ? true : .6, invalidateOnRefresh: true, anticipatePin: 1
        },
        onUpdate() { syncDeck(this.time()); }
      });
      const syncDeck = time => {
        const idx = Math.max(-1, Math.min(n - 1, Math.floor((time - trans * .5) / cycle)));
        if (idx === activeIndex) return;
        activeIndex = idx;
        chapters.forEach((c, i) => { if (c._body) c._body.inert = i !== idx; c.classList.toggle('is-open', i === idx); });
        if (idx >= 0) { setActiveNav(chapters[idx].id); waveTitle(chapters[idx]); if (chapters[idx]._body) revealCards($$(CARD_SEL, chapters[idx]._body), .1); }
      };
      deck.sync = () => { const st = tl.scrollTrigger; tl.progress(st.progress); syncDeck(tl.time()); };
      for (let k = 0; k < n; k++) {
        const at = k * cycle;
        chapters.forEach((c, i) => {
          tl.to(c, {top: () => geo(k, i, deckH(), n).top, height: () => geo(k, i, deckH(), n).height}, at);
          const prev = geo(k - 1, i, 1, n), next = geo(k, i, 1, n);
          if (prev.dim !== next.dim) tl.to(c._dim, {opacity: next.dim}, at);
          if (prev.body !== next.body && c._body) tl.to(c._body, {autoAlpha: next.body, y: 0, duration: next.body ? trans * .6 : trans * .35, ease: 'power2.out'}, next.body ? at + trans * .4 : at);
        });
      }
      tl.to({}, {duration: hold}, n * cycle - hold);
      activeIndex = -2;
      chapters.forEach(c => { if (c._body) c._body.inert = true; });
      deck.tl = tl; deck.cycle = cycle; deck.trans = trans; deck.hold = hold; deck.duration = tl.duration();
    } else {
      chapters.forEach(card => {
        if (reduced.matches) return;
        gsap.from($$('.chapter-head, .filters', card), {y: 26, autoAlpha: 0, duration: .6, stagger: .05, ease: 'power2.out', clearProps: 'opacity,visibility,transform',
          scrollTrigger: {trigger: card, start: 'top 88%', once: true}});
        const cards = $$(CARD_SEL, card);
        gsap.set(cards, {autoAlpha: 0});
        ScrollTrigger.batch(cards, {start: 'top 92%', once: true, onEnter: batch => revealCards(batch)});
        if (card._chars) { gsap.set(card._chars, {autoAlpha: 0}); ScrollTrigger.create({trigger: card, start: 'top 80%', once: true, onEnter: () => waveTitle(card)}); }
        ScrollTrigger.create({trigger: card, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && setActiveNav(card.id)});
        gsap.fromTo(card, {scale: .92}, {scale: 1, ease: 'none', scrollTrigger: {trigger: card, start: 'top bottom', end: 'top 35%', scrub: .4}});
        const next = card.nextElementSibling && card.nextElementSibling.classList.contains('ref-card') ? card.nextElementSibling : null;
        if (next && card._dim) gsap.fromTo(card._dim, {opacity: 0}, {opacity: .55, ease: 'none', scrollTrigger: {trigger: next, start: 'top 90%', end: 'top 20%', scrub: .4}});
      });
    }
    if (!reduced.matches && $('.ref-hero')) {
      gsap.to('.hero-copy', {yPercent: 14, autoAlpha: .35, ease: 'none', scrollTrigger: {trigger: '.ref-hero', start: 'top top', end: 'bottom top', scrub: true}});
    }
  });
  ScrollTrigger.refresh();
  if (deck) deck.sync();
}

let rebuildT;
function scheduleRebuild() { clearTimeout(rebuildT); rebuildT = setTimeout(() => { const y = scrollY; build(); if (lenis) lenis.scrollTo(y, {immediate: true, force: true}); else scrollTo(0, y); if (deck) { ScrollTrigger.update(); deck.sync(); } }, 120); }

/* ---------- navigation ---------- */
function targetY(id) {
  const el = document.getElementById(id);
  if (!el || id === 'home') return 0;
  const idx = chapters.indexOf(el);
  if (deck && idx >= 0) {
    const st = deck.tl.scrollTrigger;
    return st.start + (st.end - st.start) * (idx * deck.cycle + deck.trans + deck.hold / 2) / deck.duration;
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
chapters.forEach(c => { const h = $('.chapter-head', c); if (h) h.addEventListener('click', () => { if (deck && !c.classList.contains('is-open')) { history.replaceState(null, '', '#' + c.id); navigateTo(c.id, !reduced.matches); } }); });
addEventListener('hashchange', () => navigateTo(location.hash.slice(1) || 'home', false));

/* ---------- deck snap: when scrolling stops mid-way, settle on the nearest chapter ---------- */
let snapT = 0;
function snapDeck() {
  if (!deck || !deck.tl || reduced.matches) return;
  const st = deck.tl.scrollTrigger, y = scrollY;
  if (y <= st.start + 2 || y >= st.end - 2) return;
  const at = time => st.start + (st.end - st.start) * time / deck.duration;
  const points = [st.start, ...chapters.map((_, i) => at(i * deck.cycle + deck.trans + deck.hold / 2)), st.end];
  const target = points.reduce((best, p) => Math.abs(p - y) < Math.abs(best - y) ? p : best);
  if (Math.abs(target - y) < 4) return;
  if (lenis) lenis.scrollTo(target, {duration: .8, easing: t => 1 - Math.pow(1 - t, 3)});
  else scrollTo({top: target, behavior: 'smooth'});
}
addEventListener('scroll', () => { clearTimeout(snapT); snapT = setTimeout(snapDeck, 180); }, {passive: true});

/* ---------- progress bar ---------- */
const bar = document.createElement('div'); bar.className = 'fx-progress'; document.body.append(bar);
let raf = 0, maxScroll = 0;
const measureMax = () => { maxScroll = document.documentElement.scrollHeight - innerHeight; };
measureMax(); addEventListener('resize', measureMax); new ResizeObserver(measureMax).observe(document.body);
addEventListener('scroll', () => {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    bar.style.transform = 'scaleX(' + (maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0) + ')';
    header && header.classList.toggle('scrolled', scrollY > 8);
    if (scrollY < 40) setActiveNav('home');
  });
}, {passive: true});

/* ---------- smooth wheel (desktop) ---------- */
function initLenis(cb) {
  let called = false; const done = () => { if (!called) { called = true; cb(); } };
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
  setTimeout(() => { if (!lenis) { s.onload = s.onerror = null; done(); } }, 2500);
  document.head.append(s);
}

/* ---------- springs: damped oscillators driven by one shared rAF loop ---------- */
const springs = new Set();
let springRaf = 0, springLast = 0;
function stepSprings(now) {
  const dt = Math.min(.032, (now - springLast) / 1000); springLast = now;
  springs.forEach(s => {
    let moving = false;
    for (const key in s.tgt) {
      const a = -s.k * (s.cur[key] - s.tgt[key]) - s.d * s.vel[key];
      s.vel[key] += a * dt; s.cur[key] += s.vel[key] * dt;
      if (Math.abs(s.vel[key]) > .01 || Math.abs(s.cur[key] - s.tgt[key]) > .01) moving = true;
      else { s.cur[key] = s.tgt[key]; s.vel[key] = 0; }
    }
    s.apply(s.cur, moving);
    if (!moving) springs.delete(s);
  });
  springRaf = springs.size ? requestAnimationFrame(stepSprings) : 0;
}
function spring(init, apply, k = 170, d = 14) {
  const s = {cur: {...init}, vel: {}, tgt: {...init}, apply, k, d};
  for (const key in init) s.vel[key] = 0;
  s.to = (t, opts) => {
    Object.assign(s.tgt, t);
    if (opts) { s.k = opts.k ?? s.k; s.d = opts.d ?? s.d; }
    springs.add(s);
    if (!springRaf) { springLast = performance.now(); springRaf = requestAnimationFrame(stepSprings); }
  };
  return s;
}

/* ---------- hover interactions: cards tilt and buttons pull with inertia ---------- */
function initHover() {
  if (!finePointer.matches || reduced.matches) return;
  $$('.projects-body .project, .skillgrid .skill-card, .timeline article, .workflow > div').forEach(card => {
    card.classList.add('fx-card');
    const sp = spring({rx: 0, ry: 0, z: 0}, (v, moving) => {
      if (gsap.isTweening(card)) return; // let the reveal finish first
      card.style.transform = moving || v.z ? `perspective(900px) rotateX(${v.rx.toFixed(2)}deg) rotateY(${v.ry.toFixed(2)}deg) translateY(${v.z.toFixed(2)}px)` : '';
    });
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      sp.to({rx: (.5 - y) * 6, ry: (x - .5) * 8, z: -4}, {k: 180, d: 18});
    });
    // softer damping on release, so the card wobbles back into place
    card.addEventListener('pointerleave', () => sp.to({rx: 0, ry: 0, z: 0}, {k: 140, d: 9}));
  });
  $$('.heroCta a').forEach(btn => {
    btn.classList.add('fx-magnet');
    const sp = spring({x: 0, y: 0}, (v, moving) => { btn.style.transform = moving || v.x || v.y ? `translate(${v.x.toFixed(2)}px, ${v.y.toFixed(2)}px)` : ''; });
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      sp.to({x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35}, {k: 220, d: 16});
    });
    btn.addEventListener('pointerleave', () => sp.to({x: 0, y: 0}, {k: 260, d: 8}));
  });
}

/* ---------- hero scene: lamp, UFO, frog ---------- */
function initScene() {
  const hero = $('.ref-hero'); if (!hero) return;
  const IW = 1672, IH = 941, root = document.documentElement;
  const IMG = {open: 'assets/frog-eyes-open.webp', sleep: 'assets/frog-eyes-sleep.webp', closed: 'assets/frog-eyes-closed.webp'};
  Object.values(IMG).forEach(src => { const i = new Image(); i.src = src; });
  const mk = (cls, tag = 'div') => { const e = document.createElement(tag); e.className = cls; return e; };
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const scene = mk('fx-scene');
  const frogSleep = mk('fx-frog'), frogClosed = mk('fx-frog');
  frogSleep.style.backgroundImage = 'url(' + IMG.sleep + ')'; frogClosed.style.backgroundImage = 'url(' + IMG.closed + ')';
  const night = mk('fx-night'), ambient = mk('fx-ambient'), glow = mk('fx-lamp-glow'), dark = mk('fx-lamp-dark');
  const beamWrap = mk('fx-beam-wrap'), beam = mk('fx-beam'), dust = mk('fx-dust'), ring = mk('fx-ufo-ring'), flash = mk('fx-ufo-flash');
  beamWrap.append(beam, dust);
  const zzz = mk('fx-zzz');
  const lampHit = mk('fx-hit fx-hit-lamp', 'button'), ufoHit = mk('fx-hit fx-hit-ufo', 'button'), frogHit = mk('fx-hit fx-hit-frog', 'button');
  [lampHit, ufoHit, frogHit].forEach(x => x.type = 'button');
  lampHit.setAttribute('aria-label', 'Lights'); ufoHit.setAttribute('aria-label', 'UFO beam'); frogHit.setAttribute('aria-label', 'Wake up / sleep frog');
  glow.append(mk('fx-lamp-core'));
  scene.append(frogSleep, frogClosed, night, ambient, glow, dark, ring, beamWrap, flash, zzz, lampHit, ufoHit, frogHit);
  hero.append(scene);

  // page-wide darkness with flashlight
  const lights = mk('fx-lights'), spot = mk('fx-lights-spot'), lightsBtn = mk('fx-lights-btn', 'button');
  lights.append(spot);
  lightsBtn.type = 'button'; lightsBtn.innerHTML = '<i></i><span>LIGHTS ON</span>';
  const beacon = mk('fx-lamp-beacon', 'button'); beacon.type = 'button'; beacon.setAttribute('aria-label', 'Lights on');
  document.body.append(lights, beacon, lightsBtn);
  const placeBeacon = () => { if (!map) return; const r = hero.getBoundingClientRect(); const u0 = .30, v0 = .0, u1 = .52, v1 = .58;
    Object.assign(beacon.style, {left: r.left + scrollX + map.ox + u0 * map.dw + 'px', top: r.top + scrollY + map.oy + v0 * map.dh + 'px', width: (u1 - u0) * map.dw + 'px', height: (v1 - v0) * map.dh + 'px',
      backgroundImage: 'url(' + IMG.open + ')', backgroundSize: map.dw + 'px ' + map.dh + 'px', backgroundPosition: (-u0 * map.dw) + 'px ' + (-v0 * map.dh) + 'px'}); };
  beacon.addEventListener('click', () => setLights(true));
  let fx = 0, fy = 0, lightRaf = 0;
  addEventListener('pointermove', e => {
    if (on) return; fx = e.clientX; fy = e.clientY;
    if (!lightRaf) lightRaf = requestAnimationFrame(() => { lightRaf = 0; spot.style.transform = 'translate3d(' + fx + 'px,' + fy + 'px,0)'; });
  }, {passive: true});

  let map = null;
  const frac = v => {
    if (v === 'left' || v === 'top') return {f: 0}; if (v === 'right' || v === 'bottom') return {f: 1}; if (v === 'center') return {f: .5};
    if (v.endsWith('%')) return {f: parseFloat(v) / 100}; return {px: parseFloat(v) || 0};
  };
  function place() {
    const w = hero.clientWidth, h = hero.clientHeight, cs = getComputedStyle(hero);
    const s = Math.max(w / IW, h / IH), dw = IW * s, dh = IH * s;
    const [px, py = 'center'] = cs.backgroundPosition.split(',')[0].trim().split(/\s+/);
    const X = frac(px), Y = frac(py);
    const ox = X.px != null ? X.px : (w - dw) * X.f, oy = Y.px != null ? Y.px : (h - dh) * Y.f;
    map = {ox, oy, dw, dh};
    const box = (e, u0, v0, u1, v1) => Object.assign(e.style, {left: ox + u0 * dw + 'px', top: oy + v0 * dh + 'px', width: (u1 - u0) * dw + 'px', height: (v1 - v0) * dh + 'px'});
    [frogSleep, frogClosed].forEach(f => {
      Object.assign(f.style, {backgroundSize: dw + 'px ' + dh + 'px', backgroundPosition: ox + 'px ' + oy + 'px'});
      const m = 'radial-gradient(ellipse ' + (.16 * dw) + 'px ' + (.2 * dh) + 'px at ' + (ox + .625 * dw) + 'px ' + (oy + .56 * dh) + 'px,#000 70%,transparent 100%)';
      f.style.webkitMaskImage = f.style.maskImage = m;
    });
    box(glow, .30, .20, .52, .60); box(dark, .355, .25, .465, .50); box(ambient, .10, -.1, .72, .95);
    box(lampHit, .36, .10, .46, .50);
    box(beamWrap, .67, .165, .84, .70); box(ring, .70, .09, .81, .21); box(flash, .62, 0, .89, .3);
    box(ufoHit, .63, .03, .88, .62);
    box(frogHit, .49, .43, .76, .74); box(zzz, .70, .30, .80, .46);
  }
  place();
  new ResizeObserver(() => { place(); placeBeacon(); }).observe(hero);
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; hero.classList.toggle('hero-idle', !visible); }).observe(hero);
  const active = () => visible && !document.hidden;

  /* --- lamp = site lights: page darkness and the lamp glow flicker in sync --- */
  let on = true, busy = false, sleepT = 0;
  // lamp brightness per step; easing sits on each keyframe so values jump (a plain steps() on the whole
  // animation would hold the first value for the entire duration)
  const FLICKER = {
    off: {b: [1, .1, .85, .15, 1, .05, 0], at: [0, .1, .18, .32, .44, .62, 1]},
    on: {b: [0, .75, .1, .9, .3, 1, 1], at: [0, .12, .22, .36, .5, .66, 1]},
  };
  const lampLayers = [[lights, b => 1 - b], [night, b => 1 - b], [dark, b => (1 - b) * .55], [glow, b => b], [ambient, b => b * .8]];
  const flick = ({b, at}) => lampLayers.filter(([el]) => el.animate).map(([el, f]) =>
    el.animate(b.map((v, i) => ({opacity: f(v), offset: at[i], easing: 'steps(1,end)'})), {duration: 560, fill: 'forwards'}));
  const setLights = v => {
    if (busy || v === on) return; busy = true; on = v; clearTimeout(sleepT);
    if (!v) { placeBeacon(); root.classList.add('lights-off'); hero.classList.add('lamp-off'); }
    const anims = reduced.matches ? [] : flick(v ? FLICKER.on : FLICKER.off);
    const end = () => {
      if (v) { root.classList.remove('lights-off'); hero.classList.remove('lamp-off'); frog.wake(true); }
      else sleepT = setTimeout(() => frog.sleep(true), 150);
      anims.forEach(a => a.cancel());
      busy = false;
    };
    if (anims.length) anims[0].onfinish = end; else end();
  };
  lampHit.addEventListener('click', e => { e.stopPropagation(); setLights(!on); });
  lightsBtn.addEventListener('click', () => setLights(true));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !on) setLights(true); });

  /* --- pointer: lamp proximity + beam follows cursor --- */
  let tilt = 0, target = 0, rafS = 0;
  const loop = () => { tilt += (target - tilt) * .08; beamWrap.style.transform = 'rotate(' + tilt.toFixed(2) + 'deg)'; rafS = Math.abs(target - tilt) > .02 ? requestAnimationFrame(loop) : 0; };
  if (finePointer.matches && !reduced.matches) hero.addEventListener('pointermove', e => {
    if (!map) return;
    const r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const d = Math.hypot(x - (map.ox + .41 * map.dw), y - (map.oy + .37 * map.dh)) / (map.dw * .25);
    const lampV = Math.max(0, 1 - d).toFixed(3); glow.style.setProperty('--lamp', lampV); ambient.style.setProperty('--lamp', lampV);
    target = Math.max(-8, Math.min(8, -(x - (map.ox + .755 * map.dw)) / (map.dw * .3) * 8));
    if (!rafS) rafS = requestAnimationFrame(loop);
  });
  hero.addEventListener('pointerleave', () => { glow.style.setProperty('--lamp', 0); ambient.style.setProperty('--lamp', 0); target = 0; if (!rafS) rafS = requestAnimationFrame(loop); });

  /* --- UFO: clicks charge the beam --- */
  const spark = burst => {
    if (reduced.matches || !dust.animate) return;
    const p = mk('fx-spark'), x = 25 + Math.random() * 50;
    p.style.left = x + '%'; p.style.top = (60 + Math.random() * 40) + '%';
    dust.append(p);
    const dist = (burst ? 80 : 45) + Math.random() * 30;
    p.animate([{transform: 'translate(0,0) scale(1)', opacity: 0}, {opacity: 1, offset: .15}, {transform: 'translate(' + ((50 - x) * .8) + '%,-' + dist * 6 + '%) scale(.3)', opacity: 0}], {duration: (burst ? 800 : 1800) + Math.random() * 900, easing: 'cubic-bezier(.3,.6,.4,1)'}).onfinish = () => p.remove();
  };
  let charge = 0, chargeT = 0;
  ufoHit.addEventListener('click', e => {
    e.stopPropagation();
    charge = Math.min(5, charge + 1); clearTimeout(chargeT);
    chargeT = setTimeout(() => { charge = 0; beam.style.setProperty('--beam', .3); ring.style.setProperty('--pull', 0); }, 2500);
    beam.style.setProperty('--beam', (.3 + charge * .12).toFixed(2)); ring.style.setProperty('--pull', (charge / 5).toFixed(2));
    for (let i = 0; i < 12 + charge * 6; i++) setTimeout(() => spark(true), i * 16);
    replay(hero, 'ufo-zap'); replay(flash, 'go');
    if (charge === 5) { frog.startle(); tags.abduct(); } else tags.tug(charge);
  });
  let hoverT = 0;
  ufoHit.addEventListener('pointerenter', () => { hero.classList.add('ufo-hot'); clearInterval(hoverT); hoverT = setInterval(() => spark(false), 90); });
  ufoHit.addEventListener('pointerleave', () => { hero.classList.remove('ufo-hot'); clearInterval(hoverT); });
  if (!reduced.matches) setInterval(() => { if (active()) spark(false); }, 420);

  /* --- frog: blinks, dozes off, wakes on click --- */
  const frog = (() => {
    let state = 'awake', t = 0, zT = 0;
    const show = s => { frogSleep.style.opacity = s === 'sleep' ? 1 : 0; frogClosed.style.opacity = s === 'closed' ? 1 : 0; };
    const clear = () => { clearTimeout(t); clearInterval(zT); };
    const z = () => {
      if (reduced.matches || !zzz.animate || !active()) return;
      const s = mk('fx-z'); s.textContent = Math.random() > .5 ? 'Z' : 'z';
      s.style.fontSize = (14 + Math.random() * 14) + 'px'; zzz.append(s);
      s.animate([{transform: 'translate(0,20px) rotate(-10deg)', opacity: 0}, {opacity: 1, offset: .2}, {transform: 'translate(' + (20 + Math.random() * 30) + 'px,-60px) rotate(12deg)', opacity: 0}], {duration: 2200, easing: 'ease-out'}).onfinish = () => s.remove();
    };
    const schedule = () => {
      clear();
      if (state === 'awake') {
        const blink = () => { if (state !== 'awake') return; if (!active()) { t = setTimeout(blink, 3000); return; } show('closed'); setTimeout(() => state === 'awake' && show('open'), 130); t = setTimeout(blink, 2500 + Math.random() * 3500); };
        t = setTimeout(blink, 1800 + Math.random() * 2000);
        api._doze = setTimeout(() => { if (state === 'awake' && on && active()) api.sleep(); else if (state === 'awake') schedule(); }, 11000 + Math.random() * 7000);
      } else {
        zT = setInterval(z, 700);
        api._wake = setTimeout(() => { if (state === 'asleep' && on) api.wake(); }, 9000 + Math.random() * 5000);
      }
    };
    const api = {
      sleep(fast) {
        if (state === 'asleep') return; clearTimeout(api._doze); clear(); state = 'dozing';
        show('sleep');
        t = setTimeout(() => { show('closed'); state = 'asleep'; hero.classList.add('frog-asleep'); schedule(); }, fast ? 400 : 1400);
      },
      wake(startled) {
        clearTimeout(api._wake); clearTimeout(api._doze); clear();
        hero.classList.remove('frog-asleep'); state = 'awake';
        show('sleep'); setTimeout(() => { show('open'); if (startled) api.startle(); }, 160);
        schedule();
      },
      startle() {
        if (state !== 'awake') return api.wake(true);
        replay(scene, 'jolt');
      },
    };
    show('open'); schedule();
    frogHit.addEventListener('click', e => { e.stopPropagation(); state === 'awake' ? api.sleep() : api.wake(true); });
    return api;
  })();

  /* --- hero tags as physical bodies: UFO tractor beam, gravity, drag & throw --- */
  const tags = (() => {
    const els = $$('.hero-tags span', hero);
    if (!els.length || reduced.matches) return {tug() {}, abduct() {}};
    const G = 2400, MAXV = 3200;
    const bodies = els.map(el => ({el, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, on: false, home: null, drag: null}));
    let raf = 0, last = 0, beamUntil = 0, restAt = 0, freeAt = 0, homing = false;
    const wake = b => {
      if (b.on) return;
      const h = hero.getBoundingClientRect(), r = b.el.getBoundingClientRect();
      b.home = {l: r.left - h.left, t: r.top - h.top, r: r.right - h.left, b: r.bottom - h.top, w: r.width, h: r.height};
      b.on = true; b.el.classList.add('is-phys');
    };
    const render = b => { b.el.style.transform = 'translate(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px) rotate(' + b.a.toFixed(1) + 'deg)'; };
    const reset = () => {
      bodies.forEach(b => { Object.assign(b, {x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, on: false, drag: null}); b.el.style.transform = ''; b.el.classList.remove('is-phys', 'is-drag'); });
      homing = false; beamUntil = 0; freeAt = 0; raf = 0;
    };
    const clampV = b => { const v = Math.hypot(b.vx, b.vy); if (v > MAXV) { b.vx *= MAXV / v; b.vy *= MAXV / v; } };
    const center = b => ({x: (b.home.l + b.home.r) / 2 + b.x, y: (b.home.t + b.home.b) / 2 + b.y});
    const limits = (b, H) => ({minX: 6 - b.home.l, maxX: H.width - 6 - b.home.r, minY: 6 - b.home.t, maxY: H.height - 10 - b.home.b});
    // tag-to-tag collisions (axis-aligned boxes): they jostle in the beam and pile up on the floor
    const collide = () => {
      for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
        const p = bodies[i], q = bodies[j];
        if (!p.on || !q.on) continue;
        const a = center(p), c = center(q), dx = c.x - a.x, dy = c.y - a.y;
        const ox = (p.home.w + q.home.w) / 2 - Math.abs(dx), oy = (p.home.h + q.home.h) / 2 - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        const pm = p.drag ? 0 : 1, qm = q.drag ? 0 : 1, inv = pm + qm;
        if (!inv) continue;
        const [nx, ny, depth] = ox < oy ? [Math.sign(dx) || 1, 0, ox] : [0, Math.sign(dy) || 1, oy];
        p.x -= nx * depth * pm / inv; p.y -= ny * depth * pm / inv;
        q.x += nx * depth * qm / inv; q.y += ny * depth * qm / inv;
        const vn = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
        if (vn < 0) {
          const imp = -1.3 * vn / inv;
          p.vx -= imp * pm * nx; p.vy -= imp * pm * ny; q.vx += imp * qm * nx; q.vy += imp * qm * ny;
          p.va += (Math.random() - .5) * imp * .2 * pm; q.va += (Math.random() - .5) * imp * .2 * qm;
        }
      }
    };
    const step = now => {
      if (!active() || !map) return reset();
      const dt = Math.min(.033, (now - last) / 1000); last = now;
      const H = hero.getBoundingClientRect(), beamOn = now < beamUntil;
      const bx = map.ox + .755 * map.dw;
      let moving = false;
      bodies.forEach((b, i) => {
        if (!b.on || b.drag) { if (b.drag) moving = true; return; }
        const c = center(b);
        if (homing) { // spring back to the original spot
          b.vx += (-120 * b.x - 13 * b.vx) * dt; b.vy += (-120 * b.y - 13 * b.vy) * dt; b.va += (-120 * b.a - 13 * b.va) * dt;
        } else if (beamOn) { // rise in a swaying column inside the beam
          const tx = bx + Math.sin(now / 330 + i * 1.9) * map.dw * .025, ty = map.oy + (.2 + i * .055) * map.dh;
          b.vx += ((tx - c.x) * 16 - b.vx * 5) * dt; b.vy += ((ty - c.y) * 16 - b.vy * 5) * dt;
          b.va += (Math.sin(now / 260 + i) * 220 - b.va) * dt * 2;
        } else {
          b.vy += G * dt; b.va *= .995;
        }
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        if (Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.va) > 6 || (homing && Math.abs(b.x) + Math.abs(b.y) + Math.abs(b.a) > .6)) moving = true;
      });
      if (!homing) {
        collide();
        bodies.forEach(b => {
          if (!b.on) return;
          const L = limits(b, H);
          if (b.x < L.minX) { b.x = L.minX; b.vx = Math.abs(b.vx) * .5; b.va *= -.6; }
          if (b.x > L.maxX) { b.x = L.maxX; b.vx = -Math.abs(b.vx) * .5; b.va *= -.6; }
          if (b.y < L.minY) { b.y = L.minY; b.vy = Math.abs(b.vy) * .4; }
          if (b.y > L.maxY) { // floor: bounce, friction, roll flat
            b.y = L.maxY;
            if (b.vy > 90) { b.vy = -b.vy * .42; b.va += b.vx * .25; } else b.vy = 0;
            b.vx *= .9; b.va *= .82;
          }
          // resting on the floor or on another tag: friction and settle flat
          if (Math.abs(b.vy) < 40 && !beamOn && !b.drag) { b.vx *= .94; b.va *= .85; b.a += (Math.round(b.a / 180) * 180 - b.a) * .12; }
        });
      }
      bodies.forEach(b => b.on && render(b));
      if (homing && !moving) return reset();
      // fly home once things settle, or 5s after the last throw / beam at the latest (piles can jitter forever)
      if (!homing && !beamOn && !bodies.some(b => b.drag)) {
        if (!freeAt) freeAt = now;
        if (moving) restAt = now;
        if (now - restAt > 2200 || now - freeAt > 5000) homing = true;
      } else freeAt = 0;
      raf = requestAnimationFrame(step);
    };
    const start = () => { if (!raf) { last = restAt = performance.now(); raf = requestAnimationFrame(step); } };
    if (finePointer.matches) bodies.forEach(b => {
      b.el.addEventListener('pointerdown', e => {
        e.preventDefault(); wake(b); homing = false;
        try { b.el.setPointerCapture(e.pointerId); } catch (_) {}
        b.drag = {px: e.clientX, py: e.clientY, t: performance.now()}; b.vx = b.vy = 0;
        b.el.classList.add('is-drag'); start();
      });
      b.el.addEventListener('pointermove', e => {
        if (!b.drag) return;
        const t = performance.now(), ms = Math.max(8, t - b.drag.t), dx = e.clientX - b.drag.px, dy = e.clientY - b.drag.py;
        b.x += dx; b.y += dy;
        b.vx = b.vx * .4 + dx / ms * 600; b.vy = b.vy * .4 + dy / ms * 600; b.va = b.vx * .12;
        Object.assign(b.drag, {px: e.clientX, py: e.clientY, t});
      });
      const drop = () => { if (!b.drag) return; b.drag = null; clampV(b); b.el.classList.remove('is-drag'); restAt = performance.now(); freeAt = 0; };
      b.el.addEventListener('pointerup', drop); b.el.addEventListener('pointercancel', drop);
    });
    return {
      tug(power) { // each UFO click: tags hop and spring back
        if (bodies.some(b => b.on && !homing)) return;
        bodies.forEach((b, i) => { wake(b); b.vy -= 260 + power * 110 + Math.random() * 90; b.vx += (Math.random() - .5) * 140 + power * 40; b.va += (Math.random() - .5) * 240; });
        homing = true; start();
      },
      abduct() { // full charge: pulled into the beam, then dropped
        bodies.forEach(b => { wake(b); b.drag = null; b.el.classList.remove('is-drag'); });
        homing = false; beamUntil = performance.now() + 1900; start();
      },
    };
  })();

  /* --- fireflies circle the lamp and dodge the cursor; click one and the frog grabs it --- */
  (() => {
    if (reduced.matches || !scene.animate) return;
    const tongue = mk('fx-tongue'); scene.append(tongue);
    const lamp = () => ({x: map.ox + .41 * map.dw, y: map.oy + .38 * map.dh, r: .11 * map.dw});
    const mouth = () => ({x: map.ox + .625 * map.dw, y: map.oy + .615 * map.dh});
    const spawn = f => { const L = lamp(), t = Math.random() * 6.28; f.x = L.x + Math.cos(t) * L.r; f.y = L.y + Math.sin(t) * L.r; f.vx = f.vy = 0; };
    const flies = Array.from({length: finePointer.matches ? 7 : 4}, (_, i) => {
      const el = mk('fx-fly', 'button'); el.type = 'button'; el.tabIndex = -1; el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('--d', (-i * .37).toFixed(2) + 's');
      scene.append(el);
      const f = {el, x: 0, y: 0, vx: 0, vy: 0, w: Math.random() * 6.28, gone: false}; spawn(f);
      el.addEventListener('click', e => { e.stopPropagation(); grab(f); });
      return f;
    });
    let ptr = null, raf = 0, last = 0, licking = false;
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); ptr = {x: e.clientX - r.left, y: e.clientY - r.top}; }, {passive: true});
    hero.addEventListener('pointerleave', () => { ptr = null; });
    const step = now => {
      if (!active() || !map) { raf = 0; return; }
      const dt = Math.min(.033, (now - last) / 1000); last = now;
      const L = lamp();
      flies.forEach(f => {
        if (f.gone) return;
        f.w += (Math.random() - .5) * 5 * dt;
        let ax = Math.cos(f.w) * 140, ay = Math.sin(f.w) * 140;
        const dx = L.x - f.x, dy = L.y - f.y, d = Math.hypot(dx, dy) || 1;
        if (d > L.r) { ax += dx / d * (d - L.r) * 4; ay += dy / d * (d - L.r) * 4; } // drawn to the light
        if (ptr) { // scatter from the cursor
          const px = f.x - ptr.x, py = f.y - ptr.y, pd = Math.hypot(px, py) || 1;
          if (pd < 130) { const k = (130 - pd) * 30; ax += px / pd * k; ay += py / pd * k; }
        }
        f.vx = (f.vx + ax * dt) * .985; f.vy = (f.vy + ay * dt) * .985;
        const v = Math.hypot(f.vx, f.vy), max = 220; if (v > max) { f.vx *= max / v; f.vy *= max / v; }
        f.x += f.vx * dt; f.y += f.vy * dt;
        f.el.style.transform = 'translate(' + f.x.toFixed(1) + 'px,' + f.y.toFixed(1) + 'px)';
      });
      raf = requestAnimationFrame(step);
    };
    const start = () => { if (!raf && active()) { last = performance.now(); raf = requestAnimationFrame(step); } };
    new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); }).observe(hero);
    document.addEventListener('visibilitychange', start);
    start();

    function grab(f) {
      if (f.gone || licking) return;
      if (hero.classList.contains('frog-asleep')) { frog.wake(true); setTimeout(() => grab(f), 380); return; }
      licking = true; f.gone = true; f.el.classList.add('gone');
      const M = mouth(), dx = f.x - M.x, dy = f.y - M.y, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
      const thick = Math.max(6, map.dw * .007);
      Object.assign(tongue.style, {left: M.x + 'px', top: M.y - thick / 2 + 'px', width: len + 'px', height: thick + 'px', fontSize: thick * .75 + 'px'});
      const rot = 'rotate(' + ang.toFixed(1) + 'deg) ';
      tongue.animate([
        {transform: rot + 'scaleX(0)'},
        {transform: rot + 'scaleX(1.04)', offset: .35, easing: 'cubic-bezier(.2,.7,.3,1)'},
        {transform: rot + 'scaleX(1)', offset: .45, easing: 'cubic-bezier(.6,0,.8,.6)'},
        {transform: rot + 'scaleX(0)'},
      ], {duration: 520});
      // the fly rides the tongue tip back into the mouth
      const ride = f.el.animate([
        {transform: 'translate(' + f.x + 'px,' + f.y + 'px)'},
        {transform: 'translate(' + f.x + 'px,' + f.y + 'px)', offset: .45, easing: 'cubic-bezier(.6,0,.8,.6)'},
        {transform: 'translate(' + M.x + 'px,' + M.y + 'px) scale(.2)', opacity: 0},
      ], {duration: 520, fill: 'forwards'});
      ride.onfinish = () => {
        licking = false; replay(scene, 'jolt');
        setTimeout(() => { ride.cancel(); spawn(f); f.gone = false; f.el.classList.remove('gone'); f.el.animate([{opacity: 0}, {opacity: 1}], {duration: 900}); }, 2500 + Math.random() * 2500);
      };
    }
  })();
}

/* ---------- lazy chapter backgrounds ---------- */
function initLazyBg() {
  if (!('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-lazybg');
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('bg-in'); io.unobserve(e.target); } }), {rootMargin: '900px 0px'});
  chapters.forEach(c => io.observe(c));
}
initLazyBg();

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
    initScene();
    if (location.hash) navigateTo(location.hash.slice(1), false);
    if (document.fonts) document.fonts.ready.then(() => window.ScrollTrigger && ScrollTrigger.refresh());
  });
}
if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
