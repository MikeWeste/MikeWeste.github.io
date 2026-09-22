const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
dict.en = Object.fromEntries([...document.querySelectorAll('[data-t]')].map(el => [el.dataset.t, el.innerHTML]));
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));
const chapters = [...document.querySelectorAll('.ref-card')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let deckNavigation = null;
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
    const stage = document.createElement('div');
    const deck = document.createElement('div');
    stage.className = 'deck-stage';
    deck.className = 'deck-pin';
    chapters[0].before(stage);
    stage.append(deck);
    chapters.forEach(card => deck.append(card));
    gsap.set(chapters, {yPercent: i => i ? 70 : 0, zIndex: i => i + 1});
    const hold = 0.65;
    const transition = 50;
    const cycle = hold + transition;
    const duration = chapters.length * hold + (chapters.length - 1) * transition;
    const clock = {progress: 0};
    const timeline = gsap.timeline({
      scrollTrigger: {trigger: stage,start: () => 'top ' + document.querySelector('.top').offsetHeight,end: () => '+=' + Math.round(innerHeight * duration),pin: deck,pinSpacing: true,scrub: true,invalidateOnRefresh: true},
      onUpdate() {
        const index = Math.min(chapters.length - 1, Math.floor((this.time() + 0.001) / cycle));
        chapters.forEach((card, i) => {card.inert = i !== index;card.classList.toggle('is-open', i === index);});
      }
    });
    timeline.to(clock, {progress: 1, duration, ease: 'none'}, 0);
    chapters.slice(1).forEach((card, i) => {timeline.to(card, {yPercent: 0, duration: transition, ease: 'none'}, i * cycle + hold);});
    chapters.forEach((card, i) => { card.inert = i !== 0; });
    deckNavigation = (index, behavior) => {
      const trigger = timeline.scrollTrigger;
      const time = index * cycle + hold / 2;
      window.scrollTo({top: trigger.start + (trigger.end - trigger.start) * time / duration, behavior});
    };
    return () => {deckNavigation = null;chapters.forEach(card => {card.inert = false;card.classList.remove('is-open');stage.before(card);});stage.remove();};
  });
}
function navigateTo(id, behavior) {
  const target = document.getElementById(id);
  if (!target) return;
  const index = chapters.indexOf(target);
  if (index >= 0 && deckNavigation) deckNavigation(index, behavior);
  else target.scrollIntoView({behavior, block: 'start'});
}
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const id = link.hash.slice(1);
  if (!document.getElementById(id)) return;
  event.preventDefault();
  history.replaceState(null, '', '#' + id);
  navigateTo(id, reducedMotion.matches ? 'instant' : 'smooth');
}));
window.addEventListener('load', () => {if (window.ScrollTrigger) ScrollTrigger.refresh();if (location.hash) navigateTo(location.hash.slice(1), 'instant');});
window.addEventListener('hashchange', () => navigateTo(location.hash.slice(1) || 'home', 'instant'));
