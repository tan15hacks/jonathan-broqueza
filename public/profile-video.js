(() => {
  const SELECTORS = [".hero-portrait-wrap", ".about-photo"];

  function enhancePortrait(container) {
    if (!(container instanceof HTMLElement) || container.dataset.videoReady === "true") return;

    container.dataset.videoReady = "true";
    container.classList.add("portrait-video-trigger");
    container.tabIndex = 0;
    container.setAttribute("role", "button");
    container.setAttribute("aria-label", "Play Jonathan's animated portrait");
    container.setAttribute("aria-pressed", "false");

    const video = document.createElement("video");
    video.className = "portrait-hover-video";
    video.src = "/profile-effect.mp4";
    video.poster = "/profile-photo.png";
    video.preload = "auto";
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");

    const shade = document.createElement("span");
    shade.className = "portrait-video-shade";
    shade.setAttribute("aria-hidden", "true");

    const hint = document.createElement("span");
    hint.className = "portrait-video-hint";
    hint.innerHTML = '<i></i><span>hover / tap</span>';
    hint.setAttribute("aria-hidden", "true");

    container.append(video, shade, hint);

    let locked = false;
    let requestId = 0;

    const resetPlayback = () => {
      requestId += 1;
      container.classList.remove("is-video-loading", "is-video-playing");
      container.setAttribute("aria-pressed", "false");
      video.pause();

      try {
        video.currentTime = 0;
      } catch {
        // Ignore seek errors while metadata is unavailable.
      }
    };

    const revealWhenPlaying = async (restart = false) => {
      const currentRequest = ++requestId;

      if (restart) {
        try {
          video.currentTime = 0;
        } catch {
          // Playback will begin normally when the file is ready.
        }
      }

      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      container.classList.add("is-video-loading");

      try {
        await video.play();

        if (currentRequest !== requestId) return;

        container.classList.remove("is-video-loading");
        container.classList.add("is-video-playing");
        container.setAttribute("aria-pressed", locked ? "true" : "false");
      } catch {
        if (currentRequest !== requestId) return;
        container.classList.remove("is-video-loading", "is-video-playing");
      }
    };

    const hideVideo = () => {
      if (locked) return;
      resetPlayback();
    };

    video.addEventListener("error", () => {
      locked = false;
      resetPlayback();
    });

    container.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") revealWhenPlaying(true);
    });

    container.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") hideVideo();
    });

    container.addEventListener("click", () => {
      locked = !locked;

      if (locked) {
        container.setAttribute("aria-pressed", "true");
        revealWhenPlaying(true);
      } else {
        resetPlayback();
      }
    });

    container.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      container.click();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        video.pause();
        return;
      }

      if (container.classList.contains("is-video-playing")) {
        video.play().catch(() => resetPlayback());
      }
    });

    video.load();
  }

  function initialize() {
    SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach(enhancePortrait);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();