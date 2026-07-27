(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Active section highlight in rail nav
  const links = document.querySelectorAll("[data-nav]");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

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
})();
