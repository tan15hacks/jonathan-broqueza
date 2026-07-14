"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TARGET_SELECTORS = [".hero-portrait-wrap", ".about-photo"];

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
};

function waitForRenderedFrame(video: HTMLVideoElement) {
  const frameVideo = video as FrameVideo;

  if (frameVideo.requestVideoFrameCallback) {
    return new Promise<void>((resolve) => {
      frameVideo.requestVideoFrameCallback?.(() => resolve());
    });
  }

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }

  return new Promise<void>((resolve, reject) => {
    const onLoaded = () => {
      cleanup();
      requestAnimationFrame(() => resolve());
    };
    const onError = () => {
      cleanup();
      reject(new Error("Video frame failed to load"));
    };
    const cleanup = () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function PortraitOverlay({ host }: { host: HTMLElement }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockedRef = useRef(false);
  const requestRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const syncHost = (nextPlaying: boolean, nextLoading: boolean) => {
    host.classList.toggle("is-video-playing", nextPlaying);
    host.classList.toggle("is-video-loading", nextLoading);
    host.setAttribute("aria-pressed", String(lockedRef.current));
  };

  const stopPlayback = (force = false) => {
    if (lockedRef.current && !force) return;

    requestRef.current += 1;
    const video = videoRef.current;

    setPlaying(false);
    setLoading(false);
    syncHost(false, false);

    if (!video) return;

    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // Seeking can fail before metadata has loaded.
    }
  };

  const startPlayback = async (restart = true) => {
    const video = videoRef.current;
    if (!video) return;

    const requestId = ++requestRef.current;

    setLoading(true);
    syncHost(false, true);

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    if (restart) {
      try {
        video.currentTime = 0;
      } catch {
        // Playback can still start normally before metadata is available.
      }
    }

    try {
      await video.play();
      await waitForRenderedFrame(video);

      if (requestId !== requestRef.current) return;

      setLoading(false);
      setPlaying(true);
      syncHost(true, false);
    } catch {
      if (requestId !== requestRef.current) return;
      lockedRef.current = false;
      stopPlayback(true);
    }
  };

  useEffect(() => {
    host.classList.add("portrait-video-trigger");
    host.tabIndex = 0;
    host.setAttribute("role", "button");
    host.setAttribute("aria-label", "Play Jonathan's animated portrait");
    host.setAttribute("aria-pressed", "false");

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") void startPlayback(true);
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") stopPlayback(false);
    };

    const onClick = () => {
      lockedRef.current = !lockedRef.current;

      if (lockedRef.current) {
        void startPlayback(true);
      } else {
        stopPlayback(true);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onClick();
    };

    host.addEventListener("pointerenter", onPointerEnter);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("click", onClick);
    host.addEventListener("keydown", onKeyDown);

    return () => {
      requestRef.current += 1;
      videoRef.current?.pause();
      host.removeEventListener("pointerenter", onPointerEnter);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("click", onClick);
      host.removeEventListener("keydown", onKeyDown);
      host.classList.remove("portrait-video-trigger", "is-video-playing", "is-video-loading");
      host.removeAttribute("role");
      host.removeAttribute("aria-label");
      host.removeAttribute("aria-pressed");
      host.removeAttribute("tabindex");
    };
  }, [host]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else if (playing) {
        void video.play();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [playing]);

  return (
    <>
      <video
        ref={videoRef}
        className="portrait-hover-video"
        src="/profile-effect.mp4"
        poster="/profile-photo.png"
        preload="auto"
        loop
        muted
        playsInline
        disablePictureInPicture
        aria-hidden="true"
      />
      <span className="portrait-video-shade" aria-hidden="true" />
      <span className="portrait-video-hint" aria-hidden="true">
        <i />
        <span>{loading ? "loading" : playing ? "tap to close" : "hover / tap"}</span>
      </span>
    </>
  );
}

export default function PortraitVideoEnhancer() {
  const [targets, setTargets] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const findTargets = () => {
      const nextTargets = TARGET_SELECTORS.flatMap((selector) =>
        Array.from(document.querySelectorAll<HTMLElement>(selector)),
      );

      setTargets((currentTargets) => {
        if (
          currentTargets.length === nextTargets.length &&
          currentTargets.every((target, index) => target === nextTargets[index])
        ) {
          return currentTargets;
        }

        return nextTargets;
      });
    };

    findTargets();

    const observer = new MutationObserver(findTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {targets.map((target, index) =>
        createPortal(<PortraitOverlay host={target} />, target, `portrait-video-${index}`),
      )}
    </>
  );
}
