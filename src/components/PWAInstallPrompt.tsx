'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button/banner after a short delay (better UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 15000); // show after 15 seconds – adjust as you like
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also show on iOS Safari when user adds to home screen manually
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 20000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Optionally hide the UI if the user accepted
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    // Clear the saved prompt
    setDeferredPrompt(null);
  };

  const handleLaterClick = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-[#0f0f1e]/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  Add Mystique to Home Screen
                </h3>
                <p className="text-sm text-purple-200/80">
                  Get instant access, offline mode & app-like experience
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLaterClick}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition"
                >
                  Later
                </button>

                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:brightness-110 transition"
                  >
                    Install
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
