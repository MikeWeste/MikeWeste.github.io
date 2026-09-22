const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));

const chapters=[...document.querySelectorAll(".ref-card")];

if(innerWidth>700 && window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  let stage=document.querySelector(".story-stage");
  if(!stage){
    stage=document.createElement("section");
    stage.className="story-stage";
    chapters[0].parentNode.insertBefore(stage,chapters[0]);
    const viewport=document.createElement("div");
    viewport.className="story-viewport";
    stage.appendChild(viewport);
    chapters.forEach(ch=>viewport.appendChild(ch));
  }

  const viewport=stage.querySelector(".story-viewport");
  const n=chapters.length;
  chapters.forEach((card,i)=>{
    card.style.setProperty("--i",i);
    gsap.set(card,{zIndex:10+i,yPercent:i?104:0});
  });

  function state(idx){
    chapters.forEach((ch,i)=>{
      ch.classList.toggle("is-open",i===idx);
      ch.classList.toggle("is-past",i<idx);
      ch.classList.toggle("is-future",i>idx);
    });
  }
  state(0);

  const tl=gsap.timeline({
    defaults:{ease:"none"},
    scrollTrigger:{
      trigger:stage,
      start:"top top",
      end:()=>"+="+(innerHeight*(n-1)*1.45),
      pin:viewport,
      scrub:.85,
      anticipatePin:1,
      invalidateOnRefresh:true,
      snap:{snapTo:1/(n-1),duration:{min:.25,max:.55},delay:.12,ease:"power1.inOut"},
      onUpdate:self=>state(Math.min(n-1,Math.max(0,Math.round(self.progress*(n-1)))))
    }
  });

  for(let i=1;i<n;i++){
    const at=i-1;
    tl.to(chapters[i],{yPercent:0,duration:1},at);
    tl.to(chapters[i-1],{y:-18,scale:.985,filter:"brightness(.52) saturate(.72)",duration:1},at);
  }

  function go(i){
    const st=tl.scrollTrigger;
    scrollTo({top:st.start+(st.end-st.start)*(i/(n-1)),behavior:"smooth"});
  }
  chapters.forEach((ch,i)=>ch.querySelector(".chapter-head")?.addEventListener("click",()=>go(i)));
  document.querySelectorAll('nav a[href^="#"],.heroCta a[href^="#"]').forEach(a=>a.addEventListener("click",ev=>{
    const t=document.querySelector(a.getAttribute("href")),i=chapters.indexOf(t);
    if(i>=0){ev.preventDefault();go(i)}
  }));
  addEventListener("load",()=>ScrollTrigger.refresh());
}else{
  chapters.forEach(ch=>ch.classList.add("is-open"));
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{const t=document.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}));

if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from(".hero-copy>*",{y:20,autoAlpha:0,stagger:.065,duration:.5,ease:"power2.out"});
 chapters.forEach((ch,i)=>{
  gsap.from(ch.querySelectorAll(".chapter-no,.chapter-head h2,.chapter-head p,.chapter-head>i"),{y:28,autoAlpha:0,stagger:.035,duration:.35,ease:"power2.out",scrollTrigger:{trigger:ch,start:"top 78%",toggleActions:"play none none reverse"}});
   });
}
