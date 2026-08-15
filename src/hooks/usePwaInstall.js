import { useState, useEffect } from "react";

/**
 * usePwaInstall
 *
 * Captures the browser's `beforeinstallprompt` event so we can show our own
 * custom install UI instead of waiting for the browser's default prompt.
 *
 * Returns:
 *   canInstall  — true when the browser is ready to install (prompt captured)
 *   isInstalled — true when already running as a standalone PWA
 *   promptInstall() — shows the native install dialog
 *   dismiss()       — user declined; hides for this session
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Don't show again if user already dismissed this session
    if (sessionStorage.getItem("pwa_dismissed")) return;

    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    }

    function onAppInstalled() {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    if (outcome === "accepted") setIsInstalled(true);
  }

  function dismiss() {
    sessionStorage.setItem("pwa_dismissed", "1");
    setCanInstall(false);
  }

  return { canInstall, isInstalled, promptInstall, dismiss };
}
