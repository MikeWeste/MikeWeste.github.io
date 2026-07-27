(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Active section highlight
  const links = document.querySelectorAll("[data-nav]");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Project cards tilt
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const maxTilt = 8;

    function setFromPoint(clientX, clientY) {
      const r = card.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      if (reduceMotion) return;
      card.style.setProperty("--ry", `${(px - 0.5) * maxTilt * 2}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * maxTilt * 2}deg`);
      card.style.setProperty("--lift", "-6px");
    }

    function reset() {
      card.classList.remove("is-hover", "is-press");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--lift", "0px");
      card.style.setProperty("--press", "1");
    }

    card.addEventListener("pointerenter", (e) => {
      card.classList.add("is-hover");
      setFromPoint(e.clientX, e.clientY);
    });
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" && !card.classList.contains("is-press")) return;
      setFromPoint(e.clientX, e.clientY);
    });
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    card.addEventListener("pointerdown", (e) => {
      card.classList.add("is-press", "is-hover");
      card.style.setProperty("--press", "0.97");
      setFromPoint(e.clientX, e.clientY);
      try {
        card.setPointerCapture(e.pointerId);
      } catch (_) {}
    });
    card.addEventListener("pointerup", () => {
      card.classList.remove("is-press");
      card.style.setProperty("--press", "1");
      card.style.setProperty("--lift", "-6px");
    });
  });

  // ——— Ёжик SVG: зрачки следят ———
  const ezhik = document.getElementById("ezhik");
  const bubble = document.getElementById("ezhik-bubble");
  if (!ezhik) return;

  const pupilGroups = ezhik.querySelectorAll(".ezhik-pupil-g");
  const maxMove = 4.5; // SVG units inside eye

  function lookAt(clientX, clientY) {
    if (reduceMotion) return;
    pupilGroups.forEach((g) => {
      const eye = g.closest(".ezhik-eye");
      // getBBox is SVG local; use DOM rect of sclera for screen coords
      const sclera = eye.querySelector(".ezhik-sclera");
      const r = sclera.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      // convert roughly to SVG units (eye ~28px wide → 14 viewBox radius)
      const scale = 14 / (r.width / 2 || 1);
      let nx = (dx / dist) * maxMove;
      let ny = (dy / dist) * maxMove;
      // clamp inside eye
      const lim = maxMove;
      nx = Math.max(-lim, Math.min(lim, nx));
      ny = Math.max(-lim, Math.min(lim, ny));
      g.setAttribute("transform", `translate(${nx}, ${ny})`);
    });
  }

  window.addEventListener("pointermove", (e) => lookAt(e.clientX, e.clientY), {
    passive: true,
  });
  window.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      if (t) lookAt(t.clientX, t.clientY);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) lookAt(t.clientX, t.clientY);
    },
    { passive: true }
  );

  function scheduleSquint() {
    if (reduceMotion) return;
    setTimeout(() => {
      const wink = Math.random() < 0.4;
      ezhik.classList.remove("is-squint", "is-wink");
      ezhik.classList.add(wink ? "is-wink" : "is-squint");
      setTimeout(() => {
        ezhik.classList.remove("is-squint", "is-wink");
        scheduleSquint();
      }, wink ? 200 : 160);
    }, 3200 + Math.random() * 5000);
  }
  scheduleSquint();

  const phrases = [
    "Привет! 🦔",
    "Пиши @Ezhik302",
    "Тикет закрыт ✓",
    "Windows? Починим",
    "Ежу понятно!",
  ];
  let phraseIdx = 0;
  let hideTimer;

  ezhik.addEventListener("click", () => {
    ezhik.classList.add("wave", "show-bubble", "is-wink");
    if (bubble) {
      bubble.textContent = phrases[phraseIdx % phrases.length];
      phraseIdx += 1;
    }
    clearTimeout(hideTimer);
    setTimeout(() => ezhik.classList.remove("is-wink"), 240);
    hideTimer = setTimeout(() => {
      ezhik.classList.remove("show-bubble", "wave");
    }, 2200);
  });

  setTimeout(() => {
    ezhik.classList.add("show-bubble", "wave");
    hideTimer = setTimeout(() => ezhik.classList.remove("show-bubble", "wave"), 2500);
  }, 900);
})();
