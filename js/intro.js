/*
  ANYA - homepage opening intro
  Plays the Higgsfield droplet video once per browser tab (sessionStorage),
  then fades into the normal homepage hero.

  Falls back to a still frame when:
    - the visitor prefers reduced motion
    - the video file is missing or fails to load
    - the browser blocks autoplay
    - the video takes too long to start
*/

(function () {
  const intro = document.getElementById("intro");
  if (!intro) return;

  const root = document.documentElement;
  const settings = ANYA_CONFIG.intro;
  const video = intro.querySelector(".intro__video");
  const fallbackImg = intro.querySelector(".intro__fallback");
  const skipButton = intro.querySelector(".intro__skip");

  const FALLBACK_HOLD = 2400;  // how long the still frame stays up (ms)
  const START_TIMEOUT = 4000;  // give up if the video hasn't started by then
  const MAX_LENGTH = 15000;    // safety net if playback stalls part-way

  // the inline script in <head> already added this if the intro was seen
  if (root.classList.contains("intro-done")) {
    intro.remove();
    return;
  }

  let finished = false;
  let fallbackTimer = null;

  function rememberSeen() {
    try {
      sessionStorage.setItem(settings.sessionKey, "1");
    } catch (e) {
      // storage blocked (private mode etc.) - the intro may just play again, that's fine
    }
  }

  // fade the intro out and reveal the homepage underneath
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(fallbackTimer);
    rememberSeen();

    // if keyboard focus was on the skip button, move it to the page
    const hadFocus = intro.contains(document.activeElement);

    intro.classList.add("is-leaving");
    setTimeout(function () {
      video.pause();
      video.removeAttribute("src");
      intro.remove();
      root.classList.add("intro-done");
      if (hadFocus) document.getElementById("main").focus();
    }, 900);

    removeListeners();
  }

  function showFallback() {
    if (finished || intro.classList.contains("is-fallback")) return;
    intro.classList.add("is-fallback");
    skipButton.textContent = "Enter site";
    video.pause();
    fallbackTimer = setTimeout(finish, FALLBACK_HOLD);
  }

  // scrolling, Escape, or tabbing into the page all end the intro,
  // so it never traps the visitor
  function onKey(event) {
    if (event.key === "Escape") finish();
  }
  function onFocusIn(event) {
    if (!intro.contains(event.target)) finish();
  }

  function removeListeners() {
    window.removeEventListener("wheel", finish);
    window.removeEventListener("touchmove", finish);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("focusin", onFocusIn);
  }

  window.addEventListener("wheel", finish, { passive: true });
  window.addEventListener("touchmove", finish, { passive: true });
  document.addEventListener("keydown", onKey);
  document.addEventListener("focusin", onFocusIn);
  skipButton.addEventListener("click", finish);

  fallbackImg.src = settings.fallbackSrc;
  fallbackImg.addEventListener("error", function () {
    // even the still frame is missing - skip straight to the homepage
    if (intro.classList.contains("is-fallback")) finish();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    showFallback();
    return;
  }

  // set up and play the video
  video.muted = true;          // muted + playsinline is required for autoplay on most browsers
  video.playsInline = true;
  video.poster = settings.posterSrc;
  video.src = settings.videoSrc;

  video.addEventListener("playing", rememberSeen);
  video.addEventListener("ended", finish);
  video.addEventListener("error", showFallback);

  const playAttempt = video.play();
  if (playAttempt && playAttempt.catch) {
    playAttempt.catch(function (err) {
      // AbortError just means we removed the video ourselves
      if (err && err.name !== "AbortError") showFallback();
    });
  }

  setTimeout(function () {
    if (!finished && video.currentTime === 0) showFallback();
  }, START_TIMEOUT);

  setTimeout(finish, MAX_LENGTH);
})();
