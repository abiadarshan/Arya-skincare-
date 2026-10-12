/*
  ANYA - demonstration booking flow
  ---------------------------------
  Five steps: treatment -> date -> time -> details -> review.
  All booking data lives in the `booking` object below (memory only).
  Nothing is saved to localStorage or sent anywhere, so it disappears
  when the page is refreshed or closed.
*/

const booking = {
  serviceId: "",
  date: "",     // "YYYY-MM-DD"
  time: "",     // "14:00"
  name: "",
  email: "",
  phone: "",
  notes: ""
};

const MAX_DAYS_AHEAD = 60;
const TOTAL_STEPS = 5;
let currentStep = 1;

const form = document.getElementById("booking-form");
const steps = form.querySelectorAll(".booking__step");
const stepLabels = document.querySelectorAll(".steps__item");
const confirmation = document.getElementById("confirmation");

/* ---------- date + time helpers ---------- */

function toISODate(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// parse "YYYY-MM-DD" as a local date (new Date("2026-10-12") would be UTC)
function parseISODate(value) {
  const parts = value.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function todayISO() {
  return toISODate(new Date());
}

function maxDateISO() {
  const d = new Date();
  d.setDate(d.getDate() + MAX_DAYS_AHEAD);
  return toISODate(d);
}

function formatLongDate(value) {
  return parseISODate(value).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function formatTime(value) {
  const hour = Number(value.split(":")[0]);
  const minutes = value.split(":")[1];
  const suffix = hour >= 12 ? "pm" : "am";
  return (hour % 12 === 0 ? 12 : hour % 12) + ":" + minutes + " " + suffix;
}

function getHoursForDay(dayNumber) {
  return ANYA_CONFIG.hours.find(function (h) { return h.days.includes(dayNumber); });
}

/* ---------- sample availability ---------- */

// A simple, repeatable "random" number from a string, so the same date
// always shows the same booked slots. This is demo data only.
function pseudoRandom(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 1000003;
  }
  return hash;
}

function getSlots(dateValue, durationMinutes) {
  const hours = getHoursForDay(parseISODate(dateValue).getDay());
  if (!hours || hours.open === null) return [];

  const slots = [];
  const now = new Date();
  const isToday = dateValue === todayISO();

  // one slot every hour, as long as the treatment finishes before closing
  for (let hour = hours.open; hour * 60 + durationMinutes <= hours.close * 60; hour++) {
    if (hour === 13) continue; // studio lunch break in the sample schedule

    const time = String(hour).padStart(2, "0") + ":00";
    const alreadyPassed = isToday && hour <= now.getHours() + 1;
    const booked = pseudoRandom(dateValue + time) % 4 === 0;

    if (!alreadyPassed) {
      slots.push({ time: time, hour: hour, available: !booked });
    }
  }
  return slots;
}

/* ---------- step 1: service options ---------- */

function renderServiceOptions() {
  const container = document.getElementById("service-options");

  container.innerHTML = ANYA_CONFIG.services.map(function (s) {
    return (
      '<label class="service-option">' +
      '  <input type="radio" name="service" value="' + s.id + '">' +
      '  <span class="service-option__body">' +
      '    <span class="service-option__name">' + s.name + "</span>" +
      '    <span class="service-option__meta">' + formatDuration(s.duration) + " &middot; " + formatPrice(s.price) + "</span>" +
      '    <span class="service-option__desc">' + s.description + "</span>" +
      "  </span>" +
      "</label>"
    );
  }).join("");

  container.addEventListener("change", function (event) {
    booking.serviceId = event.target.value;
    setError("service", "");
    // a longer treatment might not fit the time picked earlier
    if (booking.date && booking.time) {
      const stillValid = getSlots(booking.date, getService(booking.serviceId).duration)
        .some(function (slot) { return slot.time === booking.time && slot.available; });
      if (!stillValid) booking.time = "";
    }
  });
}

// arriving from a treatment card: booking.html?service=hydration
function preselectFromURL() {
  const id = new URLSearchParams(window.location.search).get("service");
  if (!id || !getService(id)) return;

  booking.serviceId = id;
  const radio = form.querySelector('input[name="service"][value="' + id + '"]');
  if (radio) radio.checked = true;
}

/* ---------- step 3: time slots ---------- */

function renderSlots() {
  const container = document.getElementById("slot-groups");
  const service = getService(booking.serviceId);
  const slots = getSlots(booking.date, service.duration);

  document.getElementById("slot-date-label").textContent =
    formatLongDate(booking.date) + " · " + service.name + " (" + formatDuration(service.duration) + ")";

  if (slots.filter(function (s) { return s.available; }).length === 0) {
    container.innerHTML = '<p class="empty-state">There are no demo slots left on this day. Please go back and choose another date.</p>';
    return;
  }

  const groups = [
    { label: "Morning", test: function (h) { return h < 12; } },
    { label: "Afternoon", test: function (h) { return h >= 12 && h < 17; } },
    { label: "Evening", test: function (h) { return h >= 17; } }
  ];

  container.innerHTML = groups.map(function (group) {
    const inGroup = slots.filter(function (s) { return group.test(s.hour); });
    if (inGroup.length === 0) return "";

    const buttons = inGroup.map(function (slot) {
      const checked = slot.time === booking.time ? " checked" : "";
      const disabled = slot.available ? "" : " disabled";
      const note = slot.available ? "" : '<span class="slot__note">Booked</span>';
      return (
        '<label class="slot' + (slot.available ? "" : " slot--taken") + '">' +
        '<input type="radio" name="time" value="' + slot.time + '"' + checked + disabled + ">" +
        "<span>" + formatTime(slot.time) + note + "</span>" +
        "</label>"
      );
    }).join("");

    return '<div class="slot-group"><p class="field-label">' + group.label + '</p><div class="slots">' + buttons + "</div></div>";
  }).join("");
}

document.getElementById("slot-groups").addEventListener("change", function (event) {
  booking.time = event.target.value;
  setError("time", "");
});

/* ---------- validation ---------- */

function setError(field, message) {
  const errorEl = document.getElementById(field + "-error");
  if (errorEl) errorEl.textContent = message;

  const input = document.getElementById(field);
  if (input) {
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }
}

function validateService() {
  if (!getService(booking.serviceId)) {
    setError("service", "Please choose a treatment to continue.");
    return false;
  }
  setError("service", "");
  return true;
}

function validateDate() {
  const value = booking.date;
  let message = "";

  if (!value) {
    message = "Please choose a date for your appointment.";
  } else if (value < todayISO()) {
    message = "That date has already passed. Please choose today or a later date.";
  } else if (value > maxDateISO()) {
    message = "Please choose a date within the next " + MAX_DAYS_AHEAD + " days.";
  } else {
    const hours = getHoursForDay(parseISODate(value).getDay());
    if (!hours || hours.open === null) {
      message = "The studio is closed on " + hours.label + "s in our sample hours. Please choose another day.";
    }
  }

  setError("date", message);
  return message === "";
}

function validateTime() {
  const service = getService(booking.serviceId);
  const valid = service && booking.date && getSlots(booking.date, service.duration)
    .some(function (slot) { return slot.time === booking.time && slot.available; });

  setError("time", valid ? "" : "Please choose an available time.");
  return Boolean(valid);
}

const detailRules = {
  name: function (v) {
    if (!v) return "Please enter your full name.";
    if (v.length < 2) return "Your name looks a little short. Please check it.";
    return "";
  },
  email: function (v) {
    if (!v) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address, like name@example.com.";
    return "";
  },
  phone: function (v) {
    if (!v) return "Please enter a phone number.";
    const digits = v.replace(/\D/g, "");
    if (!/^[+\d\s()-]+$/.test(v) || digits.length < 7 || digits.length > 15) {
      return "Please enter a valid phone number (7–15 digits).";
    }
    return "";
  }
};

function validateField(field) {
  const message = detailRules[field](booking[field]);
  setError(field, message);
  return message === "";
}

function validateDetails() {
  // run every check (not just until the first failure) so all messages show
  const results = ["name", "email", "phone"].map(validateField);
  const firstBad = ["name", "email", "phone"][results.indexOf(false)];
  if (firstBad) document.getElementById(firstBad).focus();
  return results.every(Boolean);
}

const stepValidators = {
  1: validateService,
  2: validateDate,
  3: validateTime,
  4: validateDetails,
  5: function () { return true; }
};

/* ---------- moving between steps ---------- */

// `quiet` skips the focus + scroll, used on first page load
function goToStep(step, quiet) {
  currentStep = step;

  steps.forEach(function (fieldset) {
    fieldset.hidden = Number(fieldset.dataset.step) !== step;
  });

  stepLabels.forEach(function (item, index) {
    const n = index + 1;
    item.classList.toggle("is-done", n < step);
    if (n === step) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });

  if (step === 3) renderSlots();
  if (step === 5) renderReview();

  if (quiet) return;

  // move focus to the new step's heading for keyboard and screen reader users
  const legend = form.querySelector('[data-step="' + step + '"] legend');
  legend.setAttribute("tabindex", "-1");
  legend.focus({ preventScroll: true });
  form.scrollIntoView({ block: "start", behavior: "smooth" });
}

form.addEventListener("click", function (event) {
  if (event.target.closest("[data-next]")) {
    if (stepValidators[currentStep]()) goToStep(currentStep + 1);
  } else if (event.target.closest("[data-back]")) {
    goToStep(currentStep - 1);
  } else if (event.target.closest("[data-edit-step]")) {
    goToStep(Number(event.target.closest("[data-edit-step]").dataset.editStep));
  }
});

/* ---------- inputs ---------- */

const dateInput = document.getElementById("date");
dateInput.min = todayISO();
dateInput.max = maxDateISO();

dateInput.addEventListener("change", function () {
  booking.date = dateInput.value;
  booking.time = ""; // a new date means the old time slot may not exist
  validateDate();
});

["name", "email", "phone", "notes"].forEach(function (field) {
  const input = document.getElementById(field);

  input.addEventListener("input", function () {
    booking[field] = input.value.trim();
    // clear the message as soon as the visitor fixes the problem
    if (field !== "notes" && input.getAttribute("aria-invalid") === "true") validateField(field);
  });

  if (field !== "notes") {
    input.addEventListener("blur", function () {
      if (input.value.trim() !== "") validateField(field);
    });
  }
});

// pressing Enter in a text field should go to the next step, not submit early
form.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.tagName === "INPUT" && currentStep < TOTAL_STEPS) {
    event.preventDefault();
    form.querySelector('[data-step="' + currentStep + '"] [data-next]').click();
  }
});

/* ---------- review + confirmation ---------- */

// builds <dt>/<dd> rows with textContent, so typed input is never treated as HTML
function fillSummary(list, rows, withEditButtons) {
  list.innerHTML = "";
  rows.forEach(function (row) {
    const wrap = document.createElement("div");
    wrap.className = "summary__row";

    const dt = document.createElement("dt");
    dt.textContent = row.label;
    const dd = document.createElement("dd");
    dd.textContent = row.value;
    wrap.append(dt, dd);

    if (withEditButtons && row.step) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "summary__edit";
      edit.dataset.editStep = row.step;
      edit.innerHTML = 'Edit<span class="visually-hidden"> ' + row.label.toLowerCase() + "</span>";
      wrap.append(edit);
    }
    list.append(wrap);
  });
}

function summaryRows() {
  const service = getService(booking.serviceId);
  const rows = [
    { label: "Treatment", value: service.name, step: 1 },
    { label: "Duration", value: formatDuration(service.duration) },
    { label: "Price", value: formatPrice(service.price) + " (demo price)" },
    { label: "Date", value: formatLongDate(booking.date), step: 2 },
    { label: "Time", value: formatTime(booking.time), step: 3 },
    { label: "Name", value: booking.name, step: 4 },
    { label: "Email", value: booking.email, step: 4 },
    { label: "Phone", value: booking.phone, step: 4 }
  ];
  if (booking.notes) rows.push({ label: "Notes", value: booking.notes, step: 4 });
  return rows;
}

function renderReview() {
  fillSummary(document.getElementById("review"), summaryRows(), true);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // check every step again; jump back to the first one with a problem
  for (let step = 1; step <= 4; step++) {
    if (!stepValidators[step]()) {
      goToStep(step);
      stepValidators[step](); // show the message again on the visible step
      return;
    }
  }

  showConfirmation();
});

function showConfirmation() {
  document.getElementById("confirm-name").textContent = booking.name.split(" ")[0];
  fillSummary(document.getElementById("confirm-details"), summaryRows(), false);

  form.hidden = true;
  document.querySelector(".steps").hidden = true;
  document.querySelector(".booking-disclaimer").hidden = true;
  confirmation.hidden = false;
  confirmation.focus({ preventScroll: true });
  confirmation.scrollIntoView({ block: "start", behavior: "smooth" });
}

document.getElementById("book-another").addEventListener("click", function () {
  Object.keys(booking).forEach(function (key) { booking[key] = ""; });
  form.reset();

  confirmation.hidden = true;
  form.hidden = false;
  document.querySelector(".steps").hidden = false;
  document.querySelector(".booking-disclaimer").hidden = false;
  goToStep(1);
});

/* ---------- start ---------- */

renderServiceOptions();
preselectFromURL();
goToStep(1, true);
