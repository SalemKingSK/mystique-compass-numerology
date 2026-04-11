
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getAstroInsightAction } from '@/app/actions';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

import type { AstroInsightInput, AstroInsightOutput, NumerologyData } from './types';
import { ProfileForm } from './profile-form';
import { ResultsDisplay } from './results-display';
import { FamousPerson } from '@/lib/famous-birthdays';

const HISTORY_KEY = 'mystiqueCompassHistory';
const IDB_NAME = 'MystiqueArchivum';
const IDB_VERSION = 1;
const STORE_NAME = 'souls';

/**
 * Robust IndexedDB Initialization
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function ProfileGenerator() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState<AstroInsightInput>({ name: '', day: 0, month: 0, year: 0, gender: '' });
  const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
  const [numerology, setNumerology] = React.useState<NumerologyData | null>(null);
  const [history, setHistory] = React.useState<AstroInsightInput[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  // Ensure user is signed in anonymously for backup
  React.useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, auth]);

  /**
   * Safe batch migration and initialization
   */
  React.useEffect(() => {
    const initHistory = async () => {
      try {
        const db = await openDB();
        
        // 1. Load legacy data for migration
        const legacyRaw = localStorage.getItem(HISTORY_KEY);
        let legacyItems: any[] = [];
        if (legacyRaw) {
          try {
            legacyItems = JSON.parse(legacyRaw);
          } catch (e) {
            console.error("JSON parse error for legacy history", e);
          }
        }

        // 2. Perform everything in ONE transaction to avoid timeouts/race conditions
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        // Put legacy items into IDB
        if (legacyItems.length > 0) {
          legacyItems.forEach(item => {
            const name = item.name || item.fullName || item.title;
            const d = item.day || item.birthDay;
            const m = item.month || item.birthMonth;
            const y = item.year || item.birthYear;
            
            if (name && d && m && y) {
              const soulId = `${String(name).trim().replace(/\s+/g, '_')}-${d}-${m}-${y}`;
              store.put({
                ...item,
                id: soulId,
                name: String(name).trim(),
                day: Number(d),
                month: Number(m),
                year: Number(y),
                gender: item.gender || 'male',
                timestamp: item.timestamp || Date.now()
              });
            }
          });
        }

        tx.oncomplete = () => {
          if (legacyItems.length > 0) {
            localStorage.removeItem(HISTORY_KEY);
          }
          // Now fetch the final list
          const finalTx = db.transaction(STORE_NAME, 'readonly');
          const finalStore = finalTx.objectStore(STORE_NAME);
          const finalRequest = finalStore.getAll();
          finalRequest.onsuccess = () => {
            const sorted = finalRequest.result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setHistory(sorted);
          };
        };

        tx.onerror = (event) => {
          console.error("IDB Transaction Error", event);
          // Fallback: just fetch what's there
          const fallbackTx = db.transaction(STORE_NAME, 'readonly');
          const fallbackStore = fallbackTx.objectStore(STORE_NAME);
          const request = fallbackStore.getAll();
          request.onsuccess = () => {
            setHistory(request.result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
          };
        };
      } catch (e) {
        console.error("Could not initialize IndexedDB:", e);
      }
    };

    initHistory();
  }, []);

  const addHistoryRecord = async (item: AstroInsightInput) => {
    const sanitizedName = item.name.trim();
    const soulId = `${sanitizedName.replace(/\s+/g, '_')}-${item.day}-${item.month}-${item.year}`;
    const timestamp = Date.now();
    const record = { 
      ...item, 
      name: sanitizedName, 
      id: soulId, 
      timestamp,
      day: Number(item.day),
      month: Number(item.month),
      year: Number(item.year)
    };

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      store.put(record);

      tx.oncomplete = () => {
        setHistory(prev => {
          const filtered = prev.filter(h => (h as any).id !== soulId);
          return [record, ...filtered];
        });

        // CLOUD BACKUP
        if (user && firestore) {
          const backupRef = doc(firestore, 'users', user.uid, 'history', soulId);
          setDocumentNonBlocking(backupRef, {
            name: record.name,
            day: record.day,
            month: record.month,
            year: record.year,
            gender: record.gender,
            timestamp
          }, { merge: true });
        }
      };
    } catch (e) {
      console.error("Failed to add record to IndexedDB", e);
    }
  };
  
  const handleReset = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
    }
    setInsight(null);
    setNumerology(null);
    setFormData({ name: '', day: 0, month: 0, year: 0, gender: '' });
  };
  
  const processRequest = React.useCallback((data: AstroInsightInput) => {
    if (!data.name || !data.day || !data.month || !data.year || !data.gender) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all the fields.',
      });
      return;
    }
    
    startTransition(async () => {
        const result = await getAstroInsightAction(data);
        
        if (result.success && result.insight && result.numerology) {
            setInsight(result.insight);
            setNumerology(result.numerology);
            addHistoryRecord(data);
        } else {
            setInsight(null);
            setNumerology(null);
            toast({
              variant: 'destructive',
              title: 'Error Generating Profile',
              description: result.error || 'An unexpected error occurred while fetching insights. Please try again.',
            });
        }
    });
  }, [toast, user, firestore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        name: formData.name,
        day: parseInt(String(formData.day)),
        month: parseInt(String(formData.month)),
        year: parseInt(String(formData.year)),
        gender: formData.gender,
    };
    processRequest(data);
  };
  
  const handleFamousPersonSelect = (person: FamousPerson) => {
    const personData: AstroInsightInput = {
        name: person.name,
        day: person.day,
        month: person.month,
        year: person.year,
        gender: person.gender,
    }
    setFormData(personData);
    processRequest(personData);
  }

  const handleHistoryClick = (item: AstroInsightInput) => {
    setIsHistoryOpen(false);
    setFormData(item);
    processRequest(item);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <AnimatePresence mode="wait">
        {insight && numerology ? (
            <motion.div key="results">
                 <ResultsDisplay
                    insight={insight}
                    numerology={numerology}
                    onReset={handleReset}
                    onHistoryOpen={() => setIsHistoryOpen(true)}
                 />
            </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileForm 
              formData={formData}
              isPending={isPending}
              onSubmit={handleSubmit}
              onHistoryOpen={() => setIsHistoryOpen(true)}
              onSelectChange={handleSelectChange}
              onFieldChange={handleChange}
              onFamousPersonSelect={handleFamousPersonSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <SheetContent className="w-[90%] sm:max-w-md" style={{ background: 'rgba(9,16,35,0.98)', borderLeft: '1px solid rgba(200,168,75,0.22)' }}>
          <SheetHeader className="pb-6 border-b border-white/10">
              <SheetTitle className="font-decorative text-xl text-primary">Archivum of Souls</SheetTitle>
              <p className="text-[10px] font-cinzel uppercase tracking-widest text-slate-500">indefinite records • local & cloud backup</p>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
              <div className="space-y-3 py-4 pr-4">
                  {history.length > 0 ? (
                      history.map((item, index) => (
                          <button 
                            key={`${(item as any).id || index}`} 
                            className="w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden"
                            style={{ 
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)' 
                            }}
                            onClick={() => handleHistoryClick(item)}
                          >
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" 
                                   style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                              
                              <div className="flex flex-col gap-1 relative z-10">
                                  <span className="font-body text-base font-bold text-slate-100 group-hover:text-primary transition-colors">
                                    {item.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] font-cinzel uppercase tracking-wider text-slate-500">
                                      <span>Born {item.day}/{item.month}/{item.year}</span>
                                      <span className="opacity-30">•</span>
                                      <span className={item.gender === 'male' ? 'text-blue-400/70' : 'text-pink-400/70'}>{item.gender}</span>
                                  </div>
                              </div>
                          </button>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center space-y-4">
                          <History className="h-12 w-12 stroke-[1]" />
                          <p className="font-cinzel text-xs uppercase tracking-widest">The Archivum is empty</p>
                      </div>
                  )}
              </div>
          </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
