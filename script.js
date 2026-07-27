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

  // ——— Cards: tilt + short claw scratches that linger ———
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const maxTilt = 7;
    const canvas = document.createElement("canvas");
    canvas.className = "card-scratch";
    canvas.setAttribute("aria-hidden", "true");
    card.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    /** @type {Array<{x:number,y:number,angle:number,len:number,w:number,life:number,maxLife:number,lines:Array<{oy:number,midY:number,endY:number}>}>} */
    let scratches = [];
    let lastX = null;
    let lastY = null;
    let distAcc = 0;
    let raf = 0;
    let lastTs = 0;

    function resize() {
      const r = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnScratch(x, y, dx, dy) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4;
      const len = 9 + Math.random() * 14; // short — not a long line
      const maxLife = 1100 + Math.random() * 1200; // stays ~1–2.3s
      const jags = 2 + Math.floor(Math.random() * 2);
      const spread = 2 + Math.random() * 1.6;
      const lines = [];
      for (let i = 0; i < jags; i++) {
        const oy = (i - (jags - 1) / 2) * spread;
        lines.push({
          oy,
          midY: oy + (Math.random() - 0.5) * 1.6,
          endY: oy + (Math.random() - 0.5) * 1.4,
        });
      }
      scratches.push({
        x,
        y,
        angle,
        len,
        w: 0.65 + Math.random() * 0.85,
        life: maxLife,
        maxLife,
        lines,
      });
    }

    function paint() {
      const r = card.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);

      for (const s of scratches) {
        const t = Math.max(0, s.life / s.maxLife);
        // hold opacity then fade
        const alpha = t > 0.4 ? 0.5 + 0.15 * t : (0.65 * t) / 0.4;
        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        s.lines.forEach((ln, i) => {
          // light groove
          ctx.beginPath();
          ctx.moveTo(0, ln.oy);
          ctx.lineTo(s.len * 0.45, ln.midY);
          ctx.lineTo(s.len, ln.endY);
          ctx.strokeStyle = `rgba(200, 235, 240, ${alpha * (0.85 - i * 0.1)})`;
          ctx.lineWidth = s.w * (1 - i * 0.1);
          ctx.stroke();

          // dark under-scratch
          ctx.beginPath();
          ctx.moveTo(1, ln.oy + 0.5);
          ctx.lineTo(s.len * 0.85, ln.endY + 0.5);
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
          ctx.lineWidth = Math.max(0.4, s.w * 0.4);
          ctx.stroke();
        });

        ctx.restore();
      }
    }

    function loop(ts) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(40, ts - lastTs);
      lastTs = ts;

      for (const s of scratches) s.life -= dt;
      scratches = scratches.filter((s) => s.life > 0);
      paint();

      if (scratches.length) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        lastTs = 0;
      }
    }

    function kick() {
      if (!raf) {
        lastTs = 0;
        raf = requestAnimationFrame(loop);
      }
    }

    function setFromPoint(clientX, clientY) {
      const r = card.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      if (reduceMotion) return;
      card.style.setProperty("--ry", `${(px - 0.5) * maxTilt * 2}deg`);
      card.style.setProperty("--rx", `${(0.5 - py) * maxTilt * 2}deg`);
      card.style.setProperty("--lift", "-5px");
    }

    function onMove(clientX, clientY) {
      const r = card.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      setFromPoint(clientX, clientY);
      if (reduceMotion) return;

      if (lastX != null) {
        const dx = x - lastX;
        const dy = y - lastY;
        distAcc += Math.hypot(dx, dy);
        // discrete claw marks every ~16–28px of travel
        if (distAcc > 16 + Math.random() * 12) {
          spawnScratch(x, y, dx || 1, dy || 0);
          distAcc = 0;
          kick();
        }
      }
      lastX = x;
      lastY = y;
    }

    function reset() {
      card.classList.remove("is-hover", "is-press");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--lift", "0px");
      card.style.setProperty("--press", "1");
      lastX = null;
      lastY = null;
      distAcc = 0;
    }

    card.addEventListener("pointerenter", (e) => {
      card.classList.add("is-hover");
      resize();
      lastX = null;
      distAcc = 0;
      onMove(e.clientX, e.clientY);
    });
    card.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY));
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset);
    card.addEventListener("pointerdown", (e) => {
      card.classList.add("is-press", "is-hover");
      card.style.setProperty("--press", "0.97");
      onMove(e.clientX, e.clientY);
      try {
        card.setPointerCapture(e.pointerId);
      } catch (_) {}
    });
    card.addEventListener("pointerup", () => {
      card.classList.remove("is-press");
      card.style.setProperty("--press", "1");
      card.style.setProperty("--lift", "-5px");
    });
  });
})();
