/*
  ANYA - shared layout
  Builds the header, footer and floating WhatsApp button on every page,
  so the navigation only has to be written once.
  Each page sets <body data-page="..."> so we know which link is active.
*/

const NAV_LINKS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "treatments", label: "Treatments", href: "treatments.html" },
  { page: "philosophy", label: "Our Philosophy", href: "philosophy.html" },
  { page: "contact", label: "Contact", href: "contact.html" }
];

const WHATSAPP_ICON =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.4 21.6l4.7-1.2A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.5Z" fill="currentColor"/>' +
  "</svg>";

function buildHeader(currentPage) {
  const links = NAV_LINKS.map(function (link) {
    const active = link.page === currentPage ? ' aria-current="page"' : "";
    return '<li><a class="nav__link" href="' + link.href + '"' + active + ">" + link.label + "</a></li>";
  }).join("");

  const bookActive = currentPage === "booking" ? ' aria-current="page"' : "";

  return (
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<header class="site-header">' +
    '  <div class="container site-header__inner">' +
    '    <a class="wordmark" href="index.html" aria-label="ANYA home">ANYA</a>' +
    '    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
    '      <span class="nav-toggle__bars" aria-hidden="true"></span>' +
    '      <span class="nav-toggle__label">Menu</span>' +
    "    </button>" +
    '    <nav class="nav" id="site-nav" aria-label="Main">' +
    '      <ul class="nav__list">' + links + "</ul>" +
    '      <a class="btn btn--primary btn--small nav__cta" href="booking.html"' + bookActive + ">Book Appointment</a>" +
    '      <a class="nav__whatsapp" href="#" data-whatsapp="general">' + WHATSAPP_ICON + "<span>Chat on WhatsApp</span></a>" +
    "    </nav>" +
    "  </div>" +
    "</header>"
  );
}

function buildFooter() {
  const c = ANYA_CONFIG.contact;

  const hours = buildHoursList();

  const social = ANYA_CONFIG.social.map(function (s) {
    return '<li><a href="#" data-demo-link="' + s.name + ' is a placeholder link. No social account is connected yet.">' +
      s.name + ' <span class="tag">placeholder</span></a></li>';
  }).join("");

  const nav = NAV_LINKS.concat([{ label: "Book Appointment", href: "booking.html" }]).map(function (link) {
    return '<li><a href="' + link.href + '">' + link.label + "</a></li>";
  }).join("");

  return (
    '<footer class="site-footer">' +
    '  <div class="container site-footer__grid">' +
    '    <div class="site-footer__brand">' +
    '      <a class="wordmark wordmark--large" href="index.html">ANYA</a>' +
    '      <p class="site-footer__tagline">' + ANYA_CONFIG.brand.tagline + "</p>" +
    "    </div>" +
    '    <div><h2 class="site-footer__title">Explore</h2><ul class="site-footer__list">' + nav + "</ul></div>" +
    '    <div><h2 class="site-footer__title">Opening hours <span class="tag">demo</span></h2><ul class="site-footer__list site-footer__hours">' + hours + "</ul></div>" +
    '    <div><h2 class="site-footer__title">Contact <span class="tag">fictional</span></h2>' +
    '      <address class="site-footer__list">' + c.address.join("<br>") + "<br>" + c.phone + "<br>" + c.email + "</address>" +
    '      <ul class="site-footer__list site-footer__social">' + social + "</ul>" +
    "    </div>" +
    "  </div>" +
    '  <div class="container site-footer__bottom">' +
    "    <p>&copy; " + new Date().getFullYear() + " ANYA. A fictional skincare studio created as a website prototype.</p>" +
    "    <p>All names, prices, hours and contact details are placeholders.</p>" +
    "  </div>" +
    "</footer>" +
    '<a class="whatsapp-float" href="#" data-whatsapp="general" aria-label="Chat with ANYA on WhatsApp">' +
    WHATSAPP_ICON + '<span class="whatsapp-float__label">WhatsApp</span></a>' +
    '<div class="toast" role="status" aria-live="polite"></div>'
  );
}

function buildHoursList() {
  return ANYA_CONFIG.hours.map(function (h) {
    const time = h.open === null ? "Closed" : formatHour(h.open) + " – " + formatHour(h.close);
    return "<li><span>" + h.label + "</span><span>" + time + "</span></li>";
  }).join("");
}

function formatHour(hour) {
  const suffix = hour >= 12 ? "pm" : "am";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return h + ":00 " + suffix;
}

/* ---------- toast: a small message used for demo-only actions ---------- */

let toastTimer = null;

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 4200);
}

/* ---------- WhatsApp buttons ---------- */

// Any element with data-whatsapp="general|treatment|booking" becomes a WhatsApp link.
function setupWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    const link = getWhatsAppLink(el.dataset.whatsapp);

    if (link) {
      el.href = link;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      // Number not configured yet - keep the button but explain why it does nothing
      el.classList.add("is-demo");
      el.setAttribute("title", "Demo: WhatsApp number not configured");
      el.addEventListener("click", function (event) {
        event.preventDefault();
        showToast("Demo: WhatsApp isn't connected yet. Add the studio's number in js/config.js to enable this button.");
      });
    }
  });
}

/* ---------- mobile navigation ---------- */

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("nav-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // close the menu with Escape, or when a link is chosen
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  // reset if the screen gets wide again
  window.matchMedia("(min-width: 960px)").addEventListener("change", function (e) {
    if (e.matches) setOpen(false);
  });
}

function setupDemoLinks() {
  document.addEventListener("click", function (event) {
    const link = event.target.closest("[data-demo-link]");
    if (!link) return;
    event.preventDefault();
    showToast(link.dataset.demoLink);
  });
}

/* ---------- start ---------- */

(function initLayout() {
  const page = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin", buildHeader(page));
  document.body.insertAdjacentHTML("beforeend", buildFooter());

  // fill in any [data-contact="phone|email|address"] placeholders on the page
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    const value = ANYA_CONFIG.contact[el.dataset.contact];
    if (Array.isArray(value)) el.innerHTML = value.join("<br>");
    else if (value) el.textContent = value;
  });

  // and any [data-hours] lists
  document.querySelectorAll("[data-hours]").forEach(function (el) {
    el.innerHTML = buildHoursList();
  });

  setupMobileNav();
  setupDemoLinks();
  setupWhatsAppLinks();
})();
