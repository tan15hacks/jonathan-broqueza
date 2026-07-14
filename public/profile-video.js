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
    video.preload = "metadata";
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

    const showVideo = (restart = false) => {
      if (restart) {
        try {
          video.currentTime = 0;
        } catch {
          // The video may not have metadata yet; play() will start it normally.
        }
      }

      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      container.classList.add("is-video-active");
      container.setAttribute("aria-pressed", locked ? "true" : "false");
      video.play().catch(() => {
        // Browsers may briefly block playback before the user gesture completes.
      });
    };

    const hideVideo = () => {
      if (locked) return;
      container.classList.remove("is-video-active");
      container.setAttribute("aria-pressed", "false");
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // Ignore seek errors before metadata is loaded.
      }
    };

    container.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") showVideo(true);
    });

    container.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") hideVideo();
    });

    container.addEventListener("click", () => {
      locked = !locked;
      container.setAttribute("aria-pressed", String(locked));

      if (locked) {
        showVideo(true);
      } else {
        container.classList.remove("is-video-active");
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          // Ignore seek errors before metadata is loaded.
        }
      }
    });

    container.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      container.click();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else if (container.classList.contains("is-video-active")) video.play().catch(() => {});
    });
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
