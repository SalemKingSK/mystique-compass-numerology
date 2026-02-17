'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

const InstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    // Register service worker if not already done
    if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt && 'prompt' in installPrompt) {
      (installPrompt as any).prompt();
      (installPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPrompt(null);
      });
    }
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={handleInstallClick}
      className="text-white/80 hover:text-white bg-black/20"
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
};

export default InstallButton;
