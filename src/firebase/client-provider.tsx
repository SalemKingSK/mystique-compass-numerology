'use client';

import React, { useMemo, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

// Dynamic imports for heavy client-side components to resolve ChunkLoadErrors
// Loaded here inside a Client Component to avoid Server Component dynamic restrictions
const DynamicServiceWorker = dynamic(() => import('@/components/ServiceWorkerRegister'), { ssr: false });
const DynamicCosmicNebula = dynamic(() => import('@/components/cosmic-nebula'), { ssr: false });

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <DynamicServiceWorker />
      <DynamicCosmicNebula />
      {children}
    </FirebaseProvider>
  );
}
