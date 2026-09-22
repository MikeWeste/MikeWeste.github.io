const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Делаю игровой опыт лучше: QA-мышление, игровые ассеты, Android-разработка и техническая диагностика.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение проблемы, поиск вероятной причины, фиксация симптомов и шагов, эскалация с контекстом и сопровождение до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",supportRole:"Техническая поддержка пользователей",supportExp:"Воспроизведение проблем, диагностика Windows и ПО, анализ логов, документирование обращений, эскалация и сопровождение до решения.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям Game LQA / QA. Русский — родной · английский — Intermediate.",resume2:"Смотреть резюме"}};
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));

const chapters=[...document.querySelectorAll(".ref-card")];
let currentIndex=-1;

function activateChapter(index){
  index=Math.max(0,Math.min(chapters.length-1,index));
  if(index===currentIndex)return;
  currentIndex=index;
  chapters.forEach((ch,i)=>{
    ch.classList.toggle("is-open",i===index);
    ch.classList.toggle("active",i===index);
    ch.classList.toggle("is-past",i<index);
    ch.classList.toggle("is-future",i>index);
  });
}

if(innerWidth>700 && window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);

  const lenis=window.Lenis ? new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.82,touchMultiplier:1.1}) : null;
  if(lenis){
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }

  chapters.forEach((ch,i)=>{
    ScrollTrigger.create({
      trigger:ch,
      start:"top 72px",
      end:()=>"+="+Math.max(innerHeight*.92,720),
      pin:true,
      pinSpacing:true,
      anticipatePin:1,
      invalidateOnRefresh:true,
      onEnter:()=>activateChapter(i),
      onEnterBack:()=>activateChapter(i)
    });
    if(i<chapters.length-1){
      gsap.to(ch,{
        scale:.982,
        filter:"brightness(.58) saturate(.78)",
        ease:"none",
        scrollTrigger:{
          trigger:chapters[i+1],
          start:"top bottom",
          end:"top 72px",
          scrub:.7,
          invalidateOnRefresh:true
        }
      });
    }
  });

  chapters.forEach((ch,i)=>ch.querySelector(".chapter-head")?.addEventListener("click",()=>{
    activateChapter(i);
    const y=ch.getBoundingClientRect().top+scrollY-72;
    lenis ? lenis.scrollTo(y,{duration:1}) : scrollTo({top:y,behavior:"smooth"});
  }));

  document.querySelectorAll('nav a[href^="#"],.heroCta a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    const t=document.querySelector(a.getAttribute("href")),i=chapters.indexOf(t);
    if(i>=0){
      e.preventDefault();activateChapter(i);
      const y=t.getBoundingClientRect().top+scrollY-72;
      lenis ? lenis.scrollTo(y,{duration:1}) : scrollTo({top:y,behavior:"smooth"});
    }
  }));
  addEventListener("load",()=>ScrollTrigger.refresh());
}else{
  chapters.forEach(ch=>ch.querySelector(".chapter-head")?.addEventListener("click",()=>ch.classList.toggle("is-open")));
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{const t=document.querySelector(a.getAttribute("href"));if(t)t.scrollIntoView({behavior:"smooth",block:"start"})}));

if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from(".hero-copy>*",{y:20,autoAlpha:0,stagger:.065,duration:.5,ease:"power2.out"});
 chapters.forEach((ch,i)=>{
  gsap.from(ch.querySelectorAll(".chapter-no,.chapter-head h2,.chapter-head p,.chapter-head>i"),{y:28,autoAlpha:0,stagger:.035,duration:.35,ease:"power2.out",scrollTrigger:{trigger:ch,start:"top 78%",toggleActions:"play none none reverse"}});
   });
}
