'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { CosmicFateMap } from './cosmic-fate-map';
import { ArrowLeft, History, BookUser, Heart, Home, Users, Briefcase } from "lucide-react";
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import InstallButton from '../InstallButton';
import { ZOO } from '@/lib/cosmic-fate/zoo';


// --- SUB-COMPONENTS ---

function AnimatedTab({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div className="animated-border">
      <button
          onClick={onClick}
          className={`w-full h-full rounded-lg py-2 px-4 text-[0.65rem] font-cinzel tracking-widest font-medium cursor-pointer transition-colors duration-300 relative uppercase ${
            isActive ? 'text-yellow-300' : 'text-white/70'
          }`}
      >
          {children}
      </button>
    </div>
  )
}

interface NewAstroLayerProps {
  layerNum: number;
  title: string;
  icon: React.ReactNode;
  content: string | undefined;
  badgeColor: string;
  isOpen: boolean;
  onToggle: () => void;
}

function NewAstroLayer({ layerNum, title, icon, content, badgeColor, isOpen, onToggle }: NewAstroLayerProps) {
  if (!content) return null;
  return (
    <div className="newastro-accordion">
      <button
        className="newastro-acc-header"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="newastro-acc-left">
          <span 
            className="newastro-layer-badge" 
            style={{ background: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55` }}
          >
            Layer {layerNum}
          </span>
          <span className="newastro-acc-title">{title}</span>
        </div>
        <span className="newastro-acc-arrow" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>

      {isOpen && (
        <div className="newastro-acc-body">
          <div className="newastro-meaning-card" style={{ borderLeftColor: badgeColor }}>
            <div className="flex items-center gap-2 mb-3">
              {icon}
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: badgeColor }}>
                {title} Analysis
              </span>
            </div>
            <AccordionContentWithPlayer text={content} />
          </div>
        </div>
      )}
      <style jsx>{`
        .newastro-accordion { border-top: 1px solid #2a2340; }
        .newastro-accordion:first-of-type { border-top: none; }
        .newastro-acc-header {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 10px;
        }
        .newastro-acc-left { display: flex; align-items: center; gap: 10px; }
        .newastro-acc-title { 
          font-size: 13.5px; 
          font-weight: 600; 
          letter-spacing: 0.03em; 
          color: #c4b8e8; 
          text-align: left; 
          font-family: 'Cinzel', serif;
        }
        .newastro-acc-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
        .newastro-acc-body { padding: 4px 0 18px; animation: naFadeIn 0.2s ease; }
        @keyframes naFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .newastro-layer-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 20px; border: 1px solid; white-space: nowrap; font-family: 'Cinzel', serif; }
        .newastro-meaning-card { background: rgba(255,255,255,0.02); border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 16px; }
      `}</style>
    </div>
  );
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: AstroInsightOutput['signData'] }) {
    const [openLayer, setOpenLayer] = React.useState<number | null>(1);
    const animalName = sign.split('/')[1]?.trim();
    const animalEmoji = ZOO[animalName]?.e || '';

    const toggle = (num: number) => setOpenLayer(openLayer === num ? null : num);

    return (
        <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <h2 className="font-decorative text-xl text-primary flex items-center justify-center gap-3">
                    <span>{animalEmoji}</span>
                    {sign}
                    <span>{animalEmoji}</span>
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="flex flex-col">
                <NewAstroLayer 
                  layerNum={1} 
                  title="Psychological Profile" 
                  icon={<BookUser className="h-4 w-4" />} 
                  content={signData.description} 
                  badgeColor="#9b8ec4" 
                  isOpen={openLayer === 1}
                  onToggle={() => toggle(1)}
                />
                <NewAstroLayer 
                  layerNum={2} 
                  title="Romantic Blueprint" 
                  icon={<Heart className="h-4 w-4" />} 
                  content={signData.love} 
                  badgeColor="#3a8ee0" 
                  isOpen={openLayer === 2}
                  onToggle={() => toggle(2)}
                />
                <NewAstroLayer 
                  layerNum={3} 
                  title="Domestic Sphere" 
                  icon={<Home className="h-4 w-4" />} 
                  content={signData.homeAndFamily} 
                  badgeColor="#4caf7d" 
                  isOpen={openLayer === 3}
                  onToggle={() => toggle(3)}
                />
                <NewAstroLayer 
                  layerNum={4} 
                  title="Social Resonance" 
                  icon={<Users className="h-4 w-4" />} 
                  content={signData.compatibilities} 
                  badgeColor="#e0a83a" 
                  isOpen={openLayer === 4}
                  onToggle={() => toggle(4)}
                />
                <NewAstroLayer 
                  layerNum={5} 
                  title="Professional Path" 
                  icon={<Briefcase className="h-4 w-4" />} 
                  content={signData.profession} 
                  badgeColor="#de78a0" 
                  isOpen={openLayer === 5}
                  onToggle={() => toggle(5)}
                />
            </div>
        </div>
    );
}

function ResultsHeader({
  name,
  newAstroSign,
  birthDate,
  onTabClick,
  activeTab
}: {
  name: string,
  newAstroSign: string,
  birthDate: string,
  onTabClick: (tab: string) => void,
  activeTab: string
}) {
  const animalName = newAstroSign.split('/')[1]?.trim();
  const animalEmoji = ZOO[animalName]?.e || '';

  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center font-decorative mb-2">
            {name}
        </h1>
        <p className="text-[0.7rem] text-white/50 mt-1 font-cinzel uppercase tracking-[0.2em]">{birthDate}</p>
        <div className='relative grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto mt-6 px-4'>
             <AnimatedTab isActive={activeTab === 'new-astro'} onClick={() => onTabClick('new-astro')}>
                {animalEmoji} {newAstroSign} {animalEmoji}
             </AnimatedTab>
             <AnimatedTab isActive={activeTab === 'astro'} onClick={() => onTabClick('astro')}>
                Astrology
             </AnimatedTab>
             <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => onTabClick('numerology')}>
                Numerology
             </AnimatedTab>
             <AnimatedTab isActive={activeTab === 'cosmic-fate'} onClick={() => onTabClick('cosmic-fate')}>
                🌌 Cosmic Fate Map
             </AnimatedTab>
        </div>
    </div>
  );
}

function ResultsFooter() {
    return (
        <div className="flex flex-col items-center justify-center mt-8 pb-24 w-full max-w-4xl mx-auto px-4">
             <footer className="text-center p-4 text-white/50 text-[0.65rem] whitespace-pre-line font-body italic leading-relaxed">
                {"He who knows others is learned;\nHe who knows himself is wise.\nLao Tzu, Dao De Jing"}
            </footer>
        </div>
    );
}

function FloatingNavigation({ onReset, onHistoryOpen }: { onReset: () => void; onHistoryOpen: () => void; }) {
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onReset} 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <InstallButton minimal />
      </div>

      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHistoryOpen} 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
            <History className="h-5 w-5" />
            <span className="sr-only">History</span>
        </Button>
      </div>
    </>
  );
}


export function ResultsDisplay({ insight, numerology, onReset, onHistoryOpen }: { insight: AstroInsightOutput; numerology: NumerologyData, onReset: () => void; onHistoryOpen: () => void; }) {
  const [activeTab, setActiveTab] = React.useState('astro');

  // Stop any speaking when the component unmounts or the tab changes
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab]);

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const formatDate = () => {
    const { birthDay } = numerology;
    const { month, year } = insight;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      
    const dayWithSuffix = `${birthDay}${getOrdinalSuffix(birthDay)}`;
    return `Born ${dayWithSuffix} ${monthNames[month - 1]} ${year}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="results-background w-full min-h-screen flex flex-col p-4"
      >
        <div className="w-full max-w-4xl mx-auto flex-grow">
          <ResultsHeader
              name={insight.name}
              newAstroSign={insight.new_astrology_sign}
              birthDate={formatDate()}
              onTabClick={setActiveTab}
              activeTab={activeTab}
          />

          <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'astro' && <AstroDisplay insight={insight} />}
                {activeTab === 'numerology' && <NumerologyDisplay numerology={numerology} />}
                {activeTab === 'new-astro' && <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />}
                {activeTab === 'cosmic-fate' && <CosmicFateMap birthDay={numerology.birthDay} birthMonth={numerology.birthMonth} birthYear={numerology.birthYear} />}
              </motion.div>
          </AnimatePresence>

        </div>
         <ResultsFooter />
      </motion.div>
      <FloatingNavigation onReset={onReset} onHistoryOpen={onHistoryOpen} />
    </>
  );
}