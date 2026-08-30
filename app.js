// UniHup site — minimal progressive enhancement.
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var themeToggle = document.getElementById("themeToggle");
  var progress = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");
  var campusVisual = document.querySelector(".campus-visual");
  var heroCard = document.querySelector(".hero-card");
  var imageSections = document.querySelectorAll("#how, #contact");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var savedTheme = localStorage.getItem("unihup-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    root.dataset.theme = savedTheme;
  }

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  if (themeToggle) {
    updateThemeLabel();
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("unihup-theme", next);
      updateThemeLabel();
    });
  }

  // Current year in the footer.
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile nav toggle.
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu after tapping a link.
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // Reading progress and a slightly more defined header once the page moves.
  var scrollTicking = false;
  function updateScrollUI() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progress) progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    body.classList.toggle("has-scrolled", window.scrollY > 12);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > window.innerHeight * 0.8);
    if (campusVisual && !reducedMotion) {
      var campusRect = campusVisual.getBoundingClientRect();
      var campusProgress = (window.innerHeight - campusRect.top) / (window.innerHeight + campusRect.height);
      campusVisual.style.setProperty("--parallax", Math.max(-1, Math.min(1, campusProgress - 0.5)).toFixed(3));
    }
    if (!reducedMotion) {
      imageSections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var position = (window.innerHeight - rect.top) / (window.innerHeight + rect.height) - 0.5;
        section.style.setProperty("--section-shift", Math.max(-0.5, Math.min(0.5, position)).toFixed(3));
      });
    }
    scrollTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollUI();

  // A restrained pointer tilt makes the product preview feel tangible.
  if (heroCard && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    heroCard.addEventListener("pointermove", function (e) {
      var rect = heroCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.setProperty("--tilt-x", (-y * 4).toFixed(2) + "deg");
      heroCard.style.setProperty("--tilt-y", (x * 5).toFixed(2) + "deg");
    });
    heroCard.addEventListener("pointerleave", function () {
      heroCard.style.removeProperty("--tilt-x");
      heroCard.style.removeProperty("--tilt-y");
    });
  }

  // Let the visual finder preview respond like a small product demo.
  if (heroCard) {
    heroCard.querySelectorAll(".mock-tabs span").forEach(function (tab) {
      tab.addEventListener("click", function () {
        heroCard.querySelectorAll(".mock-tabs span").forEach(function (item) {
          item.classList.toggle("active", item === tab);
        });
      });
    });

    heroCard.querySelectorAll(".mock-save").forEach(function (save) {
      save.addEventListener("click", function (e) {
        e.stopPropagation();
        var isSaved = save.classList.toggle("saved");
        save.textContent = isSaved ? "♥" : "♡";
      });
    });

    heroCard.querySelectorAll(".mock-result").forEach(function (result) {
      result.addEventListener("click", function () {
        heroCard.querySelectorAll(".mock-result").forEach(function (item) {
          item.classList.toggle("selected", item === result);
        });
      });
    });

    var mockSearch = heroCard.querySelector(".mock-search");
    if (mockSearch) {
      mockSearch.addEventListener("click", function () {
        mockSearch.classList.toggle("active");
      });
    }
  }

  // Count up the small proof points when they first enter the viewport.
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reducedMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var item = entry.target;
        var target = Number(item.dataset.count);
        var start = performance.now();
        function frame(now) {
          var elapsed = Math.min(1, (now - start) / 850);
          var eased = 1 - Math.pow(1 - elapsed, 3);
          item.textContent = String(Math.round(target * eased));
          if (elapsed < 1) window.requestAnimationFrame(frame);
        }
        item.textContent = "0";
        window.requestAnimationFrame(frame);
        countObserver.unobserve(item);
      });
    }, { threshold: 0.7 });
    counters.forEach(function (item) { countObserver.observe(item); });
  }

  // Show which part of the page is currently being viewed.
  if (nav && "IntersectionObserver" in window) {
    var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var sections = navLinks.map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -62% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  // Keep the FAQ calm: opening one answer closes the previous one.
  document.querySelectorAll(".faq details").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      document.querySelectorAll(".faq details[open]").forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  // Gentle reveal for visual rhythm; content remains visible without JS.
  if ("IntersectionObserver" in window && !reducedMotion) {
    var items = document.querySelectorAll(".card, .guide, .steps li, .contact-card, .band, .faq details, .journey-card");
    items.forEach(function (item) { item.classList.add("will-reveal"); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  }
})();
