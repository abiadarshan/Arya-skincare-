/*
  ANYA - contact form (demo)
  Validates the fields and shows a success message.
  The message is not sent anywhere.
*/

const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");

const contactRules = {
  "c-name": function (v) {
    return v.length < 2 ? "Please enter your name." : "";
  },
  "c-email": function (v) {
    if (!v) return "Please enter your email address.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter a valid email address, like name@example.com.";
  },
  "c-subject": function (v) {
    return v ? "" : "Please choose a subject.";
  },
  "c-message": function (v) {
    return v.length < 10 ? "Please write a short message (at least 10 characters)." : "";
  }
};

function checkContactField(id) {
  const input = document.getElementById(id);
  const message = contactRules[id](input.value.trim());

  document.getElementById(id + "-error").textContent = message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");

  return message === "";
}

Object.keys(contactRules).forEach(function (id) {
  const input = document.getElementById(id);
  input.addEventListener("blur", function () {
    if (input.value.trim() !== "") checkContactField(id);
  });
  input.addEventListener("input", function () {
    if (input.getAttribute("aria-invalid") === "true") checkContactField(id);
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const ids = Object.keys(contactRules);
  const results = ids.map(checkContactField);
  const firstBad = ids[results.indexOf(false)];

  if (firstBad) {
    document.getElementById(firstBad).focus();
    return;
  }

  document.getElementById("contact-success-name").textContent =
    document.getElementById("c-name").value.trim().split(" ")[0];
  contactForm.hidden = true;
  contactSuccess.hidden = false;
  contactSuccess.focus();
});

document.getElementById("contact-reset").addEventListener("click", function () {
  contactForm.reset();
  contactSuccess.hidden = true;
  contactForm.hidden = false;
  document.getElementById("c-name").focus();
});
