/*
  ANYA - treatment cards
  Fills any element with data-services="featured" or data-services="all"
  using the treatment list in config.js. Each card's button links to the
  booking page with ?service=<id> so that treatment is preselected.
*/

function buildServiceCard(service, buttonLabel) {
  return (
    '<article class="card">' +
    '  <div class="card__media">' +
    '    <img src="' + service.image + '" alt="' + service.alt + '" loading="lazy" width="900" height="675">' +
    "  </div>" +
    '  <div class="card__body">' +
    '    <div class="card__meta">' +
    "      <span>" + formatDuration(service.duration) + "</span>" +
    '      <span class="card__price">' + formatPrice(service.price) + "</span>" +
    "    </div>" +
    "    <h3>" + service.name + "</h3>" +
    "    <p>" + service.description + "</p>" +
    '    <div class="card__actions">' +
    '      <a class="btn" href="booking.html?service=' + service.id + '">' + buttonLabel +
    '<span class="visually-hidden">: ' + service.name + "</span></a>" +
    "    </div>" +
    "  </div>" +
    "</article>"
  );
}

document.querySelectorAll("[data-services]").forEach(function (container) {
  const showAll = container.dataset.services === "all";
  const list = ANYA_CONFIG.services.filter(function (s) { return showAll || s.featured; });
  const label = showAll ? "Book This Treatment" : "Book Now";

  container.innerHTML = list.map(function (s) { return buildServiceCard(s, label); }).join("");
});
