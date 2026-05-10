const navToggle = document.getElementById('nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim() || "";
      const name = document.getElementById("name")?.value.trim() || "";
      const message = document.getElementById("message")?.value.trim() || "";

      const subject = name ? `Website contact from ${name}` : "Website contact";
      const bodyLines = [
        name ? `Name: ${name}` : "",
        email ? `Email: ${email}` : "",
        "",
        message
      ].filter(Boolean);

      const mailtoUrl = `mailto:drejc.pesjak.pesjak@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailtoUrl;
    });
  }

  document.getElementById("current-year").textContent = new Date().getFullYear();

  const figureImages = document.querySelectorAll("article figure img");
  if (!figureImages.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90";
  overlay.innerHTML = `
    <div class="relative flex h-screen w-screen flex-col">
      <div class="absolute right-4 top-4 z-50 flex flex-wrap gap-2">
        <button type="button" class="rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600" data-action="zoom-out" aria-label="Zoom out">-</button>
        <button type="button" class="rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600" data-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" class="rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600" data-action="reset" aria-label="Reset zoom">↺</button>
        <button type="button" class="rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600" data-action="close" aria-label="Close image">&times;</button>
      </div>
      <div class="lightbox-stage flex flex-1 items-center justify-center overflow-hidden">
        <img class="lightbox-image h-auto max-h-screen w-auto max-w-full object-contain" alt="" />
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const overlayImage = overlay.querySelector(".lightbox-image");
  const stage = overlay.querySelector(".lightbox-stage");
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOriginX = 0;
  let dragOriginY = 0;

  const applyScale = () => {
    overlayImage.style.setProperty("--lightbox-x", (translateX / Math.max(window.innerWidth, 1)) * 100);
    overlayImage.style.setProperty("--lightbox-y", (translateY / Math.max(window.innerHeight, 1)) * 100);
    overlayImage.style.setProperty("--lightbox-scale", scale);
  };

  const clampScale = (value) => Math.min(6, Math.max(0.15, value));

  const zoomAtPoint = (nextScale, clientX, clientY) => {
    const stageRect = stage.getBoundingClientRect();
    const baseCenterX = stageRect.left + stageRect.width / 2;
    const baseCenterY = stageRect.top + stageRect.height / 2;

    const localX = (clientX - baseCenterX - translateX) / scale;
    const localY = (clientY - baseCenterY - translateY) / scale;

    scale = clampScale(nextScale);
    translateX = clientX - baseCenterX - scale * localX;
    translateY = clientY - baseCenterY - scale * localY;
    applyScale();
  };

  const resetView = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyScale();
  };

  const closeLightbox = () => {
    overlay.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
    isDragging = false;
    stage.classList.remove("is-dragging");
    resetView();
  };

  figureImages.forEach((img) => {
    img.classList.add("lightbox-trigger");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "Open image in fullscreen view");
    img.setAttribute("draggable", "false");

    const open = () => {
      overlayImage.src = img.currentSrc || img.src;
      overlayImage.alt = img.alt || "";
      overlayImage.setAttribute("draggable", "false");
      resetView();
      overlay.classList.remove("hidden");
      document.body.classList.add("lightbox-open");
    };

    img.addEventListener("click", open);
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  overlayImage.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  overlay.addEventListener("click", (event) => {
    const action = event.target.getAttribute("data-action");
    if (action === "zoom-in") {
      const stageRect = stage.getBoundingClientRect();
      zoomAtPoint(scale + 0.2, stageRect.left + stageRect.width / 2, stageRect.top + stageRect.height / 2);
      return;
    }
    if (action === "zoom-out") {
      const stageRect = stage.getBoundingClientRect();
      zoomAtPoint(scale - 0.2, stageRect.left + stageRect.width / 2, stageRect.top + stageRect.height / 2);
      return;
    }
    if (action === "reset") {
      resetView();
      return;
    }
    if (action === "close" || event.target === overlay) {
      closeLightbox();
    }
  });

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoomAtPoint(scale + (event.deltaY < 0 ? 0.15 : -0.15), event.clientX, event.clientY);
  }, { passive: false });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target !== overlayImage) return;
    event.preventDefault();
    isDragging = true;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragOriginX = translateX;
    dragOriginY = translateY;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });

  stage.addEventListener("pointermove", (event) => {
    if (!isDragging || event.pointerId !== dragPointerId) return;
    event.preventDefault();
    translateX = dragOriginX + (event.clientX - dragStartX);
    translateY = dragOriginY + (event.clientY - dragStartY);
    applyScale();
  });

  const stopDragging = (event) => {
    if (!isDragging || (event && event.pointerId !== dragPointerId)) return;
    isDragging = false;
    if (dragPointerId !== null && stage.hasPointerCapture(dragPointerId)) {
      stage.releasePointerCapture(dragPointerId);
    }
    dragPointerId = null;
    stage.classList.remove("is-dragging");
  };

  stage.addEventListener("pointerup", stopDragging);
  stage.addEventListener("pointercancel", stopDragging);
  stage.addEventListener("lostpointercapture", () => {
    isDragging = false;
    dragPointerId = null;
    stage.classList.remove("is-dragging");
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.classList.contains("hidden")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "+" || event.key === "=") {
      scale = clampScale(scale + 0.2);
      applyScale();
    }
    if (event.key === "-") {
      scale = clampScale(scale - 0.2);
      applyScale();
    }
    if (event.key === "0") {
      resetView();
    }
  });
});
