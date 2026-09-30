(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.focus();
      }
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Retreat Center collage lightbox */
  var collage = document.getElementById("retreatCollage");
  var lightbox = document.getElementById("retreatLightbox");
  if (collage && lightbox) {
    var items = Array.prototype.slice.call(collage.querySelectorAll("[data-lightbox-index]"));
    var imageEl = document.getElementById("lightboxImage");
    var captionEl = document.getElementById("lightboxCaption");
    var current = 0;
    var lastFocus = null;

    function openAt(index) {
      current = (index + items.length) % items.length;
      var btn = items[current];
      var img = btn.querySelector("img");
      if (!img || !imageEl) return;
      imageEl.src = img.getAttribute("src");
      imageEl.alt = img.getAttribute("alt") || "";
      if (captionEl) captionEl.textContent = img.getAttribute("alt") || "";
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lastFocus = document.activeElement;
      var closeBtn = lightbox.querySelector(".lightbox-close");
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      if (imageEl) imageEl.removeAttribute("src");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openAt(Number(btn.getAttribute("data-lightbox-index")) || 0);
      });
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    var prev = lightbox.querySelector("[data-lightbox-prev]");
    var next = lightbox.querySelector("[data-lightbox-next]");
    if (prev) prev.addEventListener("click", function () { openAt(current - 1); });
    if (next) next.addEventListener("click", function () { openAt(current + 1); });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openAt(current - 1);
      if (e.key === "ArrowRight") openAt(current + 1);
    });
  }


  /* Back to top — lightweight IntersectionObserver */
  (function () {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.id = "backToTopSentinel";
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:500px;pointer-events:none;opacity:0;";
    document.body.prepend(sentinel);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    document.body.appendChild(btn);

    function setVisible(visible) {
      btn.classList.toggle("is-visible", !!visible);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        setVisible(entry && !entry.isIntersecting);
      }, { root: null, threshold: 0 });
      io.observe(sentinel);
    } else {
      var onScroll = function () {
        setVisible(window.scrollY > 480);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    btn.addEventListener("click", function () {
      var preferReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if ("scrollTo" in window) {
        window.scrollTo({ top: 0, behavior: preferReduce ? "auto" : "smooth" });
      } else {
        window.scrollTo(0, 0);
      }
      var topTarget = document.getElementById("top") || document.body;
      if (topTarget && typeof topTarget.focus === "function") {
        var prev = topTarget.getAttribute("tabindex");
        topTarget.setAttribute("tabindex", "-1");
        topTarget.focus({ preventScroll: true });
        if (prev === null) topTarget.removeAttribute("tabindex");
        else topTarget.setAttribute("tabindex", prev);
      }
    });
  })();

})();
