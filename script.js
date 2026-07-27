(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Cards: tilt + frost cover, wipe frost with mouse
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const maxTilt = 6;
    const canvas = document.createElement("canvas");
    canvas.className = "card-frost";
    canvas.setAttribute("aria-hidden", "true");
    card.appendChild(canvas);
    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    let lastX = null;
    let lastY = null;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;
    let frosted = false;

    function size() {
      const r = card.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** Full frost layer — text still readable underneath */
    function paintFrost() {
      size();
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, cssW, cssH);

      // base icy haze
      const g = ctx.createLinearGradient(0, 0, cssW, cssH);
      g.addColorStop(0, "rgba(200, 230, 255, 0.42)");
      g.addColorStop(0.45, "rgba(170, 210, 245, 0.38)");
      g.addColorStop(1, "rgba(220, 240, 255, 0.48)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cssW, cssH);

      // soft frost grain
      for (let i = 0; i < 900; i++) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        const r = 0.4 + Math.random() * 1.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + Math.random() * 0.14})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // crystal-like short strokes
      ctx.lineCap = "round";
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * cssW;
        const y = Math.random() * cssH;
        const a = Math.random() * Math.PI;
        const len = 4 + Math.random() * 14;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.random() * 0.18})`;
        ctx.lineWidth = 0.5 + Math.random() * 1.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        ctx.stroke();
      }

      // edge frost rim
      ctx.strokeStyle = "rgba(230, 245, 255, 0.35)";
      ctx.lineWidth = 2;
      roundRect(ctx, 1, 1, cssW - 2, cssH - 2, 11);
      ctx.stroke();

      frosted = true;
    }

    function roundRect(c, x, y, w, h, rad) {
      c.beginPath();
      c.moveTo(x + rad, y);
      c.arcTo(x + w, y, x + w, y + h, rad);
      c.arcTo(x + w, y + h, x, y + h, rad);
      c.arcTo(x, y + h, x, y, rad);
      c.arcTo(x, y, x + w, y, rad);
      c.closePath();
    }

    /** Wipe frost along mouse path */
    function wipe(x, y, prevX, prevY) {
      if (!frosted) return;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 28;
      ctx.beginPath();
      if (prevX != null) {
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.1, y);
      }
      ctx.stroke();

      // soft center of brush
      const brush = ctx.createRadialGradient(x, y, 2, x, y, 18);
      brush.addColorStop(0, "rgba(0,0,0,0.95)");
      brush.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = brush;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function setTilt(clientX, clientY) {
      const r = card.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      if (reduceMotion) return;
      card.style.setProperty("--ry", `${(px - 0.5) * maxTilt * 2}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * maxTilt * 2}deg`);
      card.style.setProperty("--lift", "-4px");
    }

    function onEnter(e) {
      card.classList.add("is-hover", "is-frosted");
      size();
      if (!reduceMotion) paintFrost();
      lastX = null;
      lastY = null;
      setTilt(e.clientX, e.clientY);
    }

    function onMove(e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setTilt(e.clientX, e.clientY);
      if (reduceMotion) return;
      wipe(x, y, lastX, lastY);
      lastX = x;
      lastY = y;
    }

    function onLeave() {
      card.classList.remove("is-hover", "is-press", "is-frosted");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--lift", "0px");
      card.style.setProperty("--press", "1");
      lastX = null;
      lastY = null;
      // clear frost when leaving
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      frosted = false;
    }

    window.addEventListener("resize", () => {
      if (card.classList.contains("is-hover") && !reduceMotion) {
        paintFrost();
      } else {
        size();
      }
    });

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointercancel", onLeave);
    card.addEventListener("pointerdown", (e) => {
      card.classList.add("is-press");
      card.style.setProperty("--press", "0.97");
      onMove(e);
      try {
        card.setPointerCapture(e.pointerId);
      } catch (_) {}
    });
    card.addEventListener("pointerup", () => {
      card.classList.remove("is-press");
      card.style.setProperty("--press", "1");
      card.style.setProperty("--lift", "-4px");
    });
  });
})();
