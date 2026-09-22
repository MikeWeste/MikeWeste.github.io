const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));

const chapters=[...document.querySelectorAll(".ref-card")];
let currentIndex=-1, wheelLock=false, touchStartY=0;

function setChapter(index, scroll=true){
  index=Math.max(-1,Math.min(chapters.length-1,index));
  chapters.forEach((ch,i)=>{
    ch.classList.toggle("is-open",i===index);
    ch.classList.toggle("active",i===index);
    ch.classList.toggle("is-past",index>=0&&i<index);
    ch.classList.toggle("is-future",index>=0&&i>index);
  });
  currentIndex=index;
  if(index>=0&&scroll&&innerWidth>700){
    chapters[index].scrollIntoView({behavior:"smooth",block:"start"});
  }
}

chapters.forEach((ch,i)=>ch.querySelector(".chapter-head")?.addEventListener("click",()=>setChapter(i,true)));

function enterStackIfNeeded(dir){
  const first=chapters[0].getBoundingClientRect();
  const last=chapters[chapters.length-1].getBoundingClientRect();
  const inStack=first.top<innerHeight*.86 && last.bottom>80;
  if(!inStack)return false;
  if(dir>0){
    if(currentIndex<0){setChapter(0,true);return true}
    if(currentIndex<chapters.length-1){setChapter(currentIndex+1,true);return true}
  }else{
    if(currentIndex>0){setChapter(currentIndex-1,true);return true}
    if(currentIndex===0){setChapter(-1,false);return false}
  }
  return false;
}

addEventListener("wheel",e=>{
  if(innerWidth<=700||wheelLock||Math.abs(e.deltaY)<18)return;
  const dir=Math.sign(e.deltaY);
  if(enterStackIfNeeded(dir)){
    e.preventDefault();
    wheelLock=true;
    setTimeout(()=>wheelLock=false,720);
  }
},{passive:false});

addEventListener("touchstart",e=>{touchStartY=e.touches[0]?.clientY||0},{passive:true});
addEventListener("touchend",e=>{
  if(innerWidth<=700)return;
  const y=e.changedTouches[0]?.clientY||0, delta=touchStartY-y;
  if(Math.abs(delta)>42)enterStackIfNeeded(Math.sign(delta));
},{passive:true});

document.querySelectorAll('nav a[href^="#"],.heroCta a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const t=document.querySelector(a.getAttribute("href"));
  const i=chapters.indexOf(t);
  if(i>=0){e.preventDefault();setChapter(i,true)}
}));

if(location.hash){
  const target=document.querySelector(location.hash);
  const i=chapters.indexOf(target);
  if(i>=0)setChapter(i,false);
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{const t=document.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}));

if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from(".hero-copy>*",{y:20,autoAlpha:0,stagger:.065,duration:.5,ease:"power2.out"});
 chapters.forEach((ch,i)=>{
  gsap.from(ch.querySelectorAll(".chapter-no,.chapter-head h2,.chapter-head p,.chapter-head>i"),{y:28,autoAlpha:0,stagger:.035,duration:.35,ease:"power2.out",scrollTrigger:{trigger:ch,start:"top 78%",toggleActions:"play none none reverse"}});
   });
}
