const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
});

// simple toggle for other tools
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("other-tools-toggle");
  const panel = document.getElementById("other-tools");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const isHidden = panel.classList.contains("hidden");
    panel.classList.toggle("hidden");
    btn.textContent = isHidden ? "Hide other tools" : "Show other tools";
  });
});