const dict={ru:{navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",lead:"Кандидат Game LQA / QA: взгляд игрока, практический опыт игровых ассетов, Android-разработки и технической диагностики.",seeWork:"Смотреть работы →",openResume:"Открыть резюме ↗",all:"Все",filterGame:"Игры / Арт",filterDev:"Разработка",filterSupport:"QA / Поддержка",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Практический игровой проект: gameplay, UI, тестирование, сборки и релиз.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение, исследование, документирование, эскалация и сопровождение проблем до решения.",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",bankRole:"Техподдержка пользователей · Альфа-Банк",bankText:"1–2 линия. Диагностика проблем ПО и мобильных приложений, описание кейсов и эскалация в IT/ИБ.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям.",resume2:"Смотреть резюме"}};
function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>lang(b.dataset.lang)));lang(localStorage.getItem("portfolioLang")||"en");
document.getElementById("year").textContent=new Date().getFullYear();

document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))}));

const chapters=[...document.querySelectorAll(".chapter")];
chapters.forEach(ch=>{const head=ch.querySelector(".chapter-head");head.removeAttribute("role");head.removeAttribute("tabindex");head.removeAttribute("aria-expanded");});

const topbar=document.querySelector(".top");addEventListener("scroll",()=>topbar?.classList.toggle("scrolled",scrollY>20),{passive:true});

if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from(".hero-copy>*",{y:22,autoAlpha:0,stagger:.07,duration:.55,ease:"power2.out"});
 gsap.from(".lamp-art",{y:-80,autoAlpha:0,duration:.8,ease:"power3.out"});
 gsap.from(".frog-art",{x:140,y:70,rotation:8,autoAlpha:0,duration:.9,ease:"power3.out",delay:.12});
 gsap.from(".ufo-art",{x:90,y:-30,autoAlpha:0,duration:.75,ease:"power2.out",delay:.18});
 gsap.to(".lamp-art",{y:-55,ease:"none",scrollTrigger:{trigger:".poster-hero",start:"top top",end:"bottom top",scrub:.5}});
 gsap.to(".frog-art",{y:-35,x:-20,rotation:-5,ease:"none",scrollTrigger:{trigger:".poster-hero",start:"top top",end:"bottom top",scrub:.55}});
 gsap.to(".ufo-art",{y:-85,x:25,rotation:3,ease:"none",scrollTrigger:{trigger:".poster-hero",start:"top top",end:"bottom top",scrub:.55}});
 gsap.utils.toArray(".chapter").forEach((ch,i)=>{const art=ch;gsap.fromTo(art,{filter:"brightness(.72)",scale:.985},{filter:"brightness(1)",scale:1,ease:"none",scrollTrigger:{trigger:ch,start:"top bottom",end:"top 28%",scrub:.3}});if(i<3)gsap.to(ch,{scale:.975,filter:"brightness(.55) saturate(.8)",transformOrigin:"center top",ease:"none",scrollTrigger:{trigger:chapters[i+1],start:"top bottom",end:"top top+=62",scrub:.3}})});
}
