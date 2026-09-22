const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));

const chapters=[...document.querySelectorAll(".ref-card")];
let currentIndex=-1,wheelLock=false,touchStartY=0,stackMode=false;
const TOP=68;

function lockChapter(index){
  index=Math.max(0,Math.min(chapters.length-1,index));
  currentIndex=index; stackMode=true;
  chapters.forEach((ch,i)=>{
    ch.classList.toggle("is-open",i===index);
    ch.classList.toggle("active",i===index);
    ch.classList.toggle("is-past",i<index);
    ch.classList.toggle("is-future",i>index);
  });
  const y=chapters[index].getBoundingClientRect().top+scrollY-TOP;
  scrollTo({top:y,behavior:"instant"});
}
function unlockStack(dir){
  stackMode=false;
  if(dir<0){
    currentIndex=-1;
    chapters.forEach(ch=>ch.classList.remove("is-open","active","is-past","is-future"));
  }
}
chapters.forEach((ch,i)=>ch.querySelector(".chapter-head")?.addEventListener("click",()=>lockChapter(i)));

function stackIsReachable(){
  const first=chapters[0].getBoundingClientRect();
  const last=chapters[chapters.length-1].getBoundingClientRect();
  return first.top<innerHeight*.82&&last.bottom>TOP;
}
function step(dir){
  if(!stackMode){
    if(!stackIsReachable())return false;
    if(dir>0){lockChapter(0);return true}
    return false;
  }
  if(dir>0&&currentIndex<chapters.length-1){lockChapter(currentIndex+1);return true}
  if(dir<0&&currentIndex>0){lockChapter(currentIndex-1);return true}
  if(dir<0&&currentIndex===0){unlockStack(-1);return false}
  if(dir>0&&currentIndex===chapters.length-1){stackMode=false;return false}
  return false;
}
addEventListener("wheel",e=>{
  if(innerWidth<=700||wheelLock||Math.abs(e.deltaY)<12)return;
  const dir=Math.sign(e.deltaY);
  if(step(dir)){
    e.preventDefault();
    wheelLock=true;
    setTimeout(()=>wheelLock=false,850);
  }
},{passive:false});
addEventListener("touchstart",e=>{touchStartY=e.touches[0]?.clientY||0},{passive:true});
addEventListener("touchend",e=>{
  if(innerWidth<=700)return;
  const y=e.changedTouches[0]?.clientY||0,d=touchStartY-y;
  if(Math.abs(d)>46)step(Math.sign(d));
},{passive:true});
document.querySelectorAll('nav a[href^="#"],.heroCta a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
 const t=document.querySelector(a.getAttribute("href")),i=chapters.indexOf(t);
 if(i>=0){e.preventDefault();lockChapter(i)}
}));
if(location.hash){const t=document.querySelector(location.hash),i=chapters.indexOf(t);if(i>=0)lockChapter(i)}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{const t=document.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}));

if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from(".hero-copy>*",{y:20,autoAlpha:0,stagger:.065,duration:.5,ease:"power2.out"});
 chapters.forEach((ch,i)=>{
  gsap.from(ch.querySelectorAll(".chapter-no,.chapter-head h2,.chapter-head p,.chapter-head>i"),{y:28,autoAlpha:0,stagger:.035,duration:.35,ease:"power2.out",scrollTrigger:{trigger:ch,start:"top 78%",toggleActions:"play none none reverse"}});
   });
}
