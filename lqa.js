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
const dict = {ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая и чат-поддержка",supportExp:"Поддержка в чатах на английском, диагностика Windows и ПО, логи, оформление обращений, эскалация и сопровождение до решения.",projHead:"Что я сделал",pBot:"Бот на Python: команды, пользовательские сценарии, интеграции с API и деплой.",pMini:"Фронтенд Mini App, связанный с Python-бэкендом через REST API.",pMcp:"MCP-серверы и API-коннекторы, связывающие AI-инструменты с внешними сервисами и данными.",pTime:"Android-приложение: UI, сборки, тесты на устройствах, релиз в Google Play.",pJelly:"Игра-головоломка: геймплей, UI, тестирование, релиз в Google Play.",pRust:"Скины в Blender и Substance 3D: UV, PBR, текстурные карты.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
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
  const ok = chapters.every((card, i) => {
    const g = geo(i, i, H, n);
    card.style.top = g.top + 'px'; card.style.height = g.height + 'px';
    return !card._body || card._body.scrollHeight <= card._body.clientHeight + 4;
  });
  chapters.forEach(c => { c.style.top = ''; c.style.height = ''; });
  return ok;
}

function build() {
  teardown();
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
        onUpdate() {
          const idx = Math.max(-1, Math.min(n - 1, Math.floor((this.time() - trans * .5) / cycle)));
          if (idx === activeIndex) return;
          activeIndex = idx;
          chapters.forEach((c, i) => { if (c._body) c._body.inert = i !== idx; c.classList.toggle('is-open', i === idx); });
          if (idx >= 0) setActiveNav(chapters[idx].id);
        }
      });
      for (let k = 0; k < n; k++) {
        const at = k * cycle;
        chapters.forEach((c, i) => {
          tl.to(c, {top: () => geo(k, i, deckH(), n).top, height: () => geo(k, i, deckH(), n).height}, at);
          const prev = geo(k - 1, i, 1, n), next = geo(k, i, 1, n);
          if (prev.dim !== next.dim) tl.to(c._dim, {opacity: next.dim}, at);
          if (prev.body !== next.body && c._body) tl.to(c._body, {autoAlpha: next.body, y: 0, duration: next.body ? trans * .6 : trans * .35, ease: 'power2.out'}, next.body ? at + trans * .4 : at);
        });
        if (chapters[k]._body) tl.fromTo($$('.project:not(.hidden), .skill-card, .timeline article, .experience-side, .contact-main, .contact-panel', chapters[k]._body), {y: 24}, {y: 0, stagger: .05, duration: trans * .6, ease: 'power2.out', immediateRender: false}, at + trans * .4);
      }
      tl.to({}, {duration: hold}, n * cycle - hold);
      activeIndex = -2;
      chapters.forEach(c => { if (c._body) c._body.inert = true; });
      deck.tl = tl; deck.cycle = cycle; deck.trans = trans; deck.hold = hold; deck.duration = tl.duration();
    } else {
      chapters.forEach(card => {
        if (reduced.matches) return;
        const items = $$('.chapter-head, .filters, .project:not(.hidden), .skill-card, .timeline article, .experience-side, .contact-main, .contact-panel', card);
        gsap.from(items, {y: 26, autoAlpha: 0, duration: .6, stagger: .05, ease: 'power2.out', clearProps: 'opacity,visibility,transform',
          scrollTrigger: {trigger: card, start: 'top 88%', once: true}});
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
  const lights = mk('fx-lights'), lightsBtn = mk('fx-lights-btn', 'button');
  lightsBtn.type = 'button'; lightsBtn.innerHTML = '<i></i><span>LIGHTS ON</span>';
  const beacon = mk('fx-lamp-beacon', 'button'); beacon.type = 'button'; beacon.setAttribute('aria-label', 'Lights on');
  document.body.append(lights, beacon, lightsBtn);
  const placeBeacon = () => { if (!map) return; const r = hero.getBoundingClientRect(); const u0 = .30, v0 = .0, u1 = .52, v1 = .58;
    Object.assign(beacon.style, {left: r.left + map.ox + u0 * map.dw + 'px', top: r.top + map.oy + v0 * map.dh + 'px', width: (u1 - u0) * map.dw + 'px', height: (v1 - v0) * map.dh + 'px',
      backgroundImage: 'url(' + IMG.open + ')', backgroundSize: map.dw + 'px ' + map.dh + 'px', backgroundPosition: (-u0 * map.dw) + 'px ' + (-v0 * map.dh) + 'px'}); };
  let beaconRaf = 0;
  addEventListener('scroll', () => { if (on || beaconRaf) return; beaconRaf = requestAnimationFrame(() => { beaconRaf = 0; placeBeacon(); }); }, {passive: true});
  beacon.addEventListener('click', () => setLights(true));
  let fx = 0, fy = 0, lightRaf = 0;
  addEventListener('pointermove', e => {
    if (on) return; fx = e.clientX; fy = e.clientY;
    if (!lightRaf) lightRaf = requestAnimationFrame(() => { lightRaf = 0; lights.style.setProperty('--fx', fx + 'px'); lights.style.setProperty('--fy', fy + 'px'); });
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

  /* --- lamp = site lights --- */
  let on = true, busy = false;
  const flicker = (el, seq) => el.animate ? el.animate(seq.map(o => ({opacity: o})), {duration: 650, easing: 'steps(1,end)'}) : null;
  const setLights = v => {
    if (busy || v === on) return; busy = true; on = v;
    if (!v) {
      placeBeacon(); root.classList.add('lights-off'); hero.classList.add('lamp-off');
      flicker(lights, [0, .9, .2, 1, .6, 1]);
      setTimeout(() => frog.sleep(true), 700);
    } else {
      flicker(lights, [1, .2, .9, .1, .5, 0]);
      setTimeout(() => { root.classList.remove('lights-off'); hero.classList.remove('lamp-off'); if (glow.animate) glow.animate([{opacity: 0}, {opacity: 1, offset: .2}, {opacity: .2, offset: .35}, {opacity: 1}], {duration: 500}); frog.wake(true); }, 120);
    }
    setTimeout(() => busy = false, 700);
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
    hero.style.setProperty('--lamp', Math.max(0, 1 - d).toFixed(3));
    target = Math.max(-8, Math.min(8, -(x - (map.ox + .755 * map.dw)) / (map.dw * .3) * 8));
    if (!rafS) rafS = requestAnimationFrame(loop);
  });
  hero.addEventListener('pointerleave', () => { hero.style.setProperty('--lamp', 0); target = 0; if (!rafS) rafS = requestAnimationFrame(loop); });

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
    chargeT = setTimeout(() => { charge = 0; beam.style.setProperty('--beam', .3); hero.style.setProperty('--pull', 0); }, 2500);
    beam.style.setProperty('--beam', (.3 + charge * .12).toFixed(2)); hero.style.setProperty('--pull', (charge / 5).toFixed(2));
    for (let i = 0; i < 12 + charge * 6; i++) setTimeout(() => spark(true), i * 16);
    replay(hero, 'ufo-zap'); replay(flash, 'go');
    if (charge === 5) frog.startle();
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
