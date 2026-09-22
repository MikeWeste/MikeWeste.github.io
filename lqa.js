const dict={ru:{navProfile:"Профиль",navProjects:"Проекты",navSkills:"Навыки",navExperience:"Опыт",resume:"Резюме",heroA:"Я замечаю то, что",heroB:"ломает погружение.",lead:"Кандидат Game LQA / QA: взгляд игрока, практический опыт игровых ассетов, Android-разработки и технической диагностики.",seeWork:"Смотреть работы",openResume:"Открыть резюме ↗",native:"Русский — родной",qaFact:"Системный troubleshooting",profileTitle:"Почему Game LQA",profile1:"Я понимаю игры с нескольких сторон: как игрок, создатель ассетов и разработчик. Работа со скинами Rust Workshop научила замечать визуальные несоответствия, ограничения материалов и требования игрового пайплайна.",profile2:"Техническая поддержка научила воспроизводить проблемы, находить причины, понятно документировать кейсы и эскалировать их с полезным контекстом. Эти навыки я переношу в контроль качества игр и тестирование русской локализации.",noClaim:"Коммерческий опыт локализации не заявляю.",projectsTitle:"Релевантные работы",all:"Все",rustTitle:"Скины и игровой пайплайн",rustText:"Blender, Substance 3D Painter и Photoshop. UV, PBR-материалы и ограничения texture maps для игровых ассетов.",jellyText:"Android-игра-головоломка, опубликованная в Google Play. Практический игровой проект: gameplay, UI, тестирование, сборки и процесс релиза.",timeText:"Разработал и опубликовал Android-приложение: UI, сборки, тестирование на устройстве и релиз.",lookText:"Проект на Python/API с Telegram Mini App и инструментами развёртывания.",supportTitle:"Техническая диагностика",supportText:"Опыт 1–2 линии: воспроизведение, исследование, документирование, эскалация и сопровождение проблем до решения.",skillsTitle:"Инструменты",s1:"Воспроизведение проблем · внимание к UI/UX · повторные проверки · понятное описание",expTitle:"Опыт",bankRole:"Техподдержка пользователей · Альфа-Банк",bankText:"1–2 линия. Диагностика проблем ПО и мобильных приложений, описание кейсов и эскалация в IT/ИБ.",present:"н.в.",leadRole:"Бригадир · Операционная работа",leadText:"Координация команды, приоритизация, контроль качества и работа с инцидентами под нагрузкой.",adminRole:"Администратор · FIX PRICE",adminText:"Работа с клиентами, внутренними системами и операционными вопросами.",target:"ЦЕЛЕВАЯ РОЛЬ",contactTitle:"Game LQA · Game QA<br>Тестирование на русском",contactText:"Открыт к удалённым вакансиям.",resume2:"Смотреть резюме"}};function lang(l){document.documentElement.lang=l;document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));document.querySelectorAll("[data-t]").forEach(el=>{const v=dict[l]?.[el.dataset.t];if(v!==undefined)el.innerHTML=v});localStorage.setItem("portfolioLang",l)}document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>lang(b.dataset.lang));lang(localStorage.getItem("portfolioLang")||"en");document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll("[data-cat]").forEach(c=>c.classList.toggle("hidden",f!=="all"&&c.dataset.cat!==f))});document.getElementById("year").textContent=new Date().getFullYear();;if(matchMedia("(hover:hover) and (pointer:fine)").matches){document.querySelectorAll(".project").forEach(card=>{card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-3px)`;card.style.setProperty("--mx",`${e.clientX-r.left}px`);card.style.setProperty("--my",`${e.clientY-r.top}px`)});card.addEventListener("mouseleave",()=>{card.style.transform="";card.style.removeProperty("--mx");card.style.removeProperty("--my")})})};
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();
mm.add("(min-width: 761px)",()=>{
  gsap.utils.toArray(".stage").forEach((stage,i)=>{
    const panel=stage.querySelector(".panel");
    gsap.set(panel,{y:120,scale:.94,rotateX:4,autoAlpha:.35});
    gsap.timeline({scrollTrigger:{trigger:stage,start:"top 92%",end:"top 16%",scrub:1.05}})
      .to(panel,{y:0,scale:1,rotateX:0,autoAlpha:1,ease:"none"});
    gsap.timeline({scrollTrigger:{trigger:stage,start:"top 16%",end:"bottom 5%",scrub:1.2}})
      .to(panel,{y:-34,scale:.975,autoAlpha:.78,ease:"none"});
  });
  gsap.utils.toArray(".section h2,.copy,.sectionHead,.skillgrid,.timeline,.contact h2,.contact .heroCta").forEach(el=>{
    gsap.from(el,{y:32,autoAlpha:0,duration:.7,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 88%",toggleActions:"play none none reverse"}});
  });
});
};
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 mm.add("(min-width: 761px)",()=>{
   const stages=gsap.utils.toArray(".stage");
   stages.forEach((stage,i)=>{
     const panel=stage.querySelector(".panel");
     if(i===0) gsap.set(panel,{yPercent:10,scale:.97,autoAlpha:.7});
     ScrollTrigger.create({
       trigger:stage,
       start:"top top+=72",
       end:"+=100%",
       pin:panel,
       pinSpacing:true,
       anticipatePin:1
     });
     if(i===0){
       gsap.to(panel,{yPercent:0,scale:1,autoAlpha:1,ease:"none",
         scrollTrigger:{trigger:stage,start:"top 90%",end:"top 35%",scrub:true}});
     }
     if(i<stages.length-1){
       const next=stages[i+1].querySelector(".panel");
       gsap.fromTo(next,{yPercent:100,scale:.965,autoAlpha:.55},{yPercent:0,scale:1,autoAlpha:1,ease:"none",
         scrollTrigger:{trigger:stages[i+1],start:"top bottom",end:"top top+=72",scrub:true}});
       gsap.to(panel,{scale:.94,yPercent:-5,autoAlpha:.45,filter:"blur(3px)",ease:"none",
         scrollTrigger:{trigger:stages[i+1],start:"top bottom",end:"top top+=72",scrub:true}});
     }
   });
   gsap.utils.toArray(".panel h2,.panel .copy,.panel .sectionHead,.panel .skillgrid,.panel .timeline,.panel .heroCta").forEach(el=>{
     gsap.from(el,{y:24,autoAlpha:0,duration:.55,ease:"power2.out",
       scrollTrigger:{trigger:el,start:"top 90%",toggleActions:"play none none reverse"}});
   });
   return()=>ScrollTrigger.getAll().forEach(t=>t.kill());
 });
};
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add("(min-width: 761px)",()=>{
   const panels=gsap.utils.toArray(".stage .panel");
   panels.forEach((panel,i)=>{
     if(i<panels.length-1){
       const next=panels[i+1];
       gsap.to(panel,{scale:.965,filter:"brightness(.62)",borderRadius:"28px",ease:"none",
         scrollTrigger:{trigger:next,start:"top bottom",end:"top top+=72",scrub:true}});
     }
   });
 });
};
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add("(min-width: 761px)",()=>{
   const stages=gsap.utils.toArray(".stage");
   stages.forEach((stage,i)=>{
     const panel=stage.querySelector(".panel");
     gsap.set(panel,{zIndex:10+i});
     if(i>0) gsap.fromTo(panel,{yPercent:100,scale:.985},{yPercent:0,scale:1,ease:"none",
       scrollTrigger:{trigger:stage,start:"top bottom",end:"top top+=72",scrub:.65,invalidateOnRefresh:true}});
     if(i<stages.length-1){
       gsap.to(panel,{scale:.955,filter:"brightness(.52) saturate(.75)",ease:"none",
         scrollTrigger:{trigger:stages[i+1],start:"top bottom",end:"top top+=72",scrub:.65,invalidateOnRefresh:true}});
     }
   });
   const climber=document.querySelector(".scroll-character");
   if(climber){
     gsap.to(climber,{y:()=>-(innerHeight+120),rotation:-8,ease:"none",
       scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:.5}});
   }
   gsap.to(".hero-orbit",{rotation:110,scale:1.18,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
   ScrollTrigger.refresh();
 });
};
const topbar=document.querySelector(".top");
addEventListener("scroll",()=>topbar?.classList.toggle("scrolled",scrollY>20),{passive:true});
if(matchMedia("(hover:hover) and (pointer:fine)").matches){
 addEventListener("pointermove",e=>{document.body.style.setProperty("--cx",e.clientX+"px");document.body.style.setProperty("--cy",e.clientY+"px")},{passive:true});
}
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add("(min-width: 761px)",()=>{
   const stages=gsap.utils.toArray(".stage");
   stages.forEach((stage,i)=>{
     const panel=stage.querySelector(".panel"),art=stage.querySelector(".scene-art");
     gsap.set(panel,{zIndex:10+i});
     if(i>0)gsap.fromTo(panel,{yPercent:100,scale:.985},{yPercent:0,scale:1,ease:"none",scrollTrigger:{trigger:stage,start:"top bottom",end:"top top+=72",scrub:.55,invalidateOnRefresh:true}});
     if(i<stages.length-1)gsap.to(panel,{scale:.955,filter:"brightness(.48) saturate(.72)",ease:"none",scrollTrigger:{trigger:stages[i+1],start:"top bottom",end:"top top+=72",scrub:.55,invalidateOnRefresh:true}});
     if(art){
       gsap.set(art,{autoAlpha:0});
       gsap.timeline({scrollTrigger:{trigger:stage,start:"top 82%",end:"bottom 22%",scrub:.8}})
         .fromTo(art,{autoAlpha:0,y:90,rotation:-12,scale:.75},{autoAlpha:.72,y:0,rotation:8,scale:1,ease:"none"})
         .to(art,{autoAlpha:0,y:-100,rotation:28,scale:1.15,ease:"none"});
     }
   });
   gsap.to(".scroll-character",{y:()=>-(innerHeight+160),rotation:-10,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:.45}});
   gsap.to(".hero-orbit",{rotation:140,scale:1.22,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:.8}});
   gsap.to(".ambient-a",{yPercent:80,xPercent:-20,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:1.5}});
   gsap.to(".ambient-b",{yPercent:-70,xPercent:35,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:1.5}});
   ScrollTrigger.refresh();
 });
};
const topbar=document.querySelector(".top");
addEventListener("scroll",()=>topbar?.classList.toggle("scrolled",scrollY>20),{passive:true});
if(matchMedia("(hover:hover) and (pointer:fine)").matches)addEventListener("pointermove",e=>{document.body.style.setProperty("--cx",e.clientX+"px");document.body.style.setProperty("--cy",e.clientY+"px")},{passive:true});
if(window.gsap&&window.ScrollTrigger&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add("(min-width: 761px)",()=>{
   const stages=gsap.utils.toArray(".stage");
   stages.forEach((stage,i)=>{
     const panel=stage.querySelector(".panel"),art=stage.querySelector(".scene-art"),word=stage.querySelector(".big-word");
     gsap.set(panel,{zIndex:10+i});
     if(i>0)gsap.fromTo(panel,{yPercent:100,scale:.985},{yPercent:0,scale:1,ease:"none",scrollTrigger:{trigger:stage,start:"top bottom",end:"top top+=72",scrub:.5,invalidateOnRefresh:true}});
     if(i<stages.length-1)gsap.to(panel,{scale:.955,filter:"brightness(.48) saturate(.72)",ease:"none",scrollTrigger:{trigger:stages[i+1],start:"top bottom",end:"top top+=72",scrub:.5,invalidateOnRefresh:true}});
     if(art)gsap.timeline({scrollTrigger:{trigger:stage,start:"top 88%",end:"bottom 18%",scrub:.7}}).fromTo(art,{autoAlpha:0,y:110,rotation:-16,scale:.7},{autoAlpha:.72,y:0,rotation:7,scale:1,ease:"none"}).to(art,{autoAlpha:0,y:-110,rotation:26,scale:1.14,ease:"none"});
     if(word)gsap.fromTo(word,{xPercent:14,autoAlpha:.15},{xPercent:-12,autoAlpha:.65,ease:"none",scrollTrigger:{trigger:stage,start:"top bottom",end:"bottom top",scrub:1}});
   });
   const marquee=gsap.utils.toArray(".project-marquee span");
   if(marquee.length)gsap.to(marquee,{xPercent:-55,ease:"none",scrollTrigger:{trigger:".stage-projects",start:"top bottom",end:"bottom top",scrub:1}});
   gsap.to(".scroll-character",{y:()=>-(innerHeight+160),rotation:-10,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:.45}});
   gsap.to(".hero-orbit",{rotation:140,scale:1.22,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:.8}});
   gsap.to(".ambient-a",{yPercent:80,xPercent:-20,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:1.5}});
   gsap.to(".ambient-b",{yPercent:-70,xPercent:35,ease:"none",scrollTrigger:{trigger:"main",start:"top top",end:"bottom bottom",scrub:1.5}});
   ScrollTrigger.refresh();
 });
}