(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Optional: set your GitHub username in localStorage or edit below
  const GITHUB_USER = localStorage.getItem("github_user") || "MikeWeste";
  const gh = document.getElementById("github-link");
  if (gh && GITHUB_USER) {
    gh.href = `https://github.com/${GITHUB_USER}`;
    gh.textContent = `github.com/${GITHUB_USER}`;
  }
})();
