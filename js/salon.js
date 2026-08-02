/* =====================================================================
   Salon Vojin — interactions (vanilla JS, no dependencies)
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Sticky header condense on scroll ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileClose = document.querySelector(".mobile-close");
  function closeMenu() {
    if (mobileNav) mobileNav.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  }
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Smooth scroll for in-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---- Before / After sliders ---- */
  document.querySelectorAll(".ba-slider").forEach(function (slider) {
    var after = slider.querySelector(".ba-after");
    var handle = slider.querySelector(".ba-handle");
    var dragging = false;

    function setPos(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      if (after) after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      if (handle) handle.style.left = pct + "%";
    }
    function start(e) {
      dragging = true;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function move(e) {
      if (!dragging) return;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function end() { dragging = false; }

    slider.addEventListener("mousedown", start);
    slider.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
  });

  /* ---- Testimonial rotator ---- */
  var testi = document.querySelector(".testimonial");
  if (testi) {
    var items = testi.querySelectorAll(".testi-item");
    var dotsWrap = testi.querySelector(".testi-dots");
    var idx = 0;
    var timer;

    if (dotsWrap) {
      items.forEach(function (_, i) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Utisak " + (i + 1));
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", function () { show(i); resetTimer(); });
        dotsWrap.appendChild(b);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll("button") : [];

    function show(n) {
      items[idx].classList.remove("active");
      if (dots[idx]) dots[idx].classList.remove("active");
      idx = (n + items.length) % items.length;
      items[idx].classList.add("active");
      if (dots[idx]) dots[idx].classList.add("active");
    }
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 6000);
    }
    if (items.length > 1) resetTimer();
  }

  /* ---- Mark current-page nav link ---- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav > li > a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.parentElement.classList.add("current");
  });
})();
