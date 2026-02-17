'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

// Store the prompt event at the module level to handle cases
// where the event fires before the component mounts.
let deferredPrompt: Event | null = null;

const InstallButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      // When the event is caught, show the button.
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if the prompt was already captured when the component mounts.
    if (deferredPrompt) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt || !('prompt' in deferredPrompt)) {
      return;
    }
    
    // Show the browser's installation prompt.
    const prompt = deferredPrompt as any;
    prompt.prompt();
    
    // Wait for the user to respond to the prompt.
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // The prompt can only be used once.
    deferredPrompt = null;
    setIsVisible(false);
  };

  // Only render the button if the app is installable.
  if (!isVisible) {
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
