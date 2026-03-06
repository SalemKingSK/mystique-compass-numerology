
'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData, PersonalYearData } from './types';
import { ANIMALS, RELATIONS, CAT_META, PERSONAL_YEARS, LIFESTAGES, TAISUI } from '@/lib/cosmic-fate/constants';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Info, Sparkles, Zap, Calendar, BookOpen, MapIcon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'ov', name: 'Overview', icon: Sparkles },
  { id: 'wh', name: 'Wheel', icon: Zap },
  { id: 'cy', name: 'Cycles', icon: Calendar },
  { id: 'mp', name: 'Map', icon: MapIcon },
  { id: 'dr', name: 'Deep Read', icon: BookOpen },
  { id: 'co', name: 'Codex', icon: Info },
  { id: 'rf', name: 'Ref', icon: BookOpen },
];

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('ov');
  const [selectedCodex, setSelectedCodex] = useState('Rat');
  const [selectedPersonalYear, setSelectedPersonalYear] = useState<PersonalYearData | null>(null);

  const { birthDay: day, birthMonth: month, birthYear: year } = numerology;
  const birthSign = insight.sign;
  const curYear = new Date().getFullYear();

  const getSign = (y: number) => {
    const index = ((y - 1900) % 12 + 12) % 12;
    return ANIMALS[index] || ANIMALS[0];
  };
  
  const getRel = (ysName: string) => {
    const r = RELATIONS[birthSign];
    if (!r) return 'neutral';
    if (ysName === r.clash) return 'clash';
    if (ysName === r.harm) return 'harm';
    if (ysName === r.destroy) return 'destroy';
    if (ysName === r.self) return 'self';
    if (r.sanhe.includes(ysName)) return 'sanhe';
    if (ysName === r.liuhe) return 'liuhe';
    return 'neutral';
  };

  const getPY = (y: number) => {
    const reduce = (n: number): number => {
      let s = n;
      while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
      return s || 9;
    };
    const worldYear = reduce(y);
    const birthSum = reduce(day) + reduce(month);
    return reduce(worldYear + birthSum);
  };

  const convergences = useMemo(() => {
    const hits = [];
    const ENEMY = ['clash', 'harm', 'destroy', 'self'];
    for (let y = curYear; y < curYear + 20; y++) {
      const p = getPY(y);
      const ys = getSign(y);
      const rt = getRel(ys.n);
      if ((p === 4 || p === 7) && ENEMY.includes(rt)) hits.push({ y, p, ys, rt });
    }
    return hits;
  }, [day, month, year, birthSign]);

  const timeline = useMemo(() => {
    const events: any[] = [];
    ['self', 'clash', 'harm', 'destroy', 'sanhe', 'liuhe'].forEach(k => {
      const ages = CAT_META[k]?.ages || [];
      ages.forEach(age => events.push({ age, k, yr: year + age }));
    });
    return events.sort((a, b) => a.age - b.age);
  }, [year, birthSign]);

  const renderSignBook = (aname: string) => {
    const bookData = (BOOK.animals as any)[aname];
    if (!bookData) return <p className="italic text-muted-foreground text-center py-10">No detailed chapter available for this sign in the current source text.</p>;

    return (
      <Accordion type="multiple" className="space-y-4">
        {Object.entries(bookData).map(([key, text]) => (
          <Card key={key} className="bg-black/40 border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5 font-bold uppercase tracking-widest text-[10px] text-primary">
              {key.replace('_', ' ')}
            </div>
            <div className="p-4 text-sm leading-relaxed text-white/80">
              <AccordionContentWithPlayer text={text as string} />
            </div>
          </Card>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-black/40 text-muted-foreground border-white/5 hover:border-white/20'
            }`}
          >
            <tab.icon className="h-4 w-4 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{tab.name}</span>
          </button>
        ))}
      </div>

      <ScrollArea className="h-[600px] pr-4">
        {activeTab === 'ov' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-black/40 border-white/10 text-center">
                <span className="text-3xl mb-1 block">{getSign(year)?.e || '✨'}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Birth Sign</p>
                <p className="text-xl font-bold text-yellow-400">{birthSign}</p>
              </Card>
              <Card className="p-4 bg-black/40 border-white/10 text-center">
                <span className="text-3xl mb-1 block">{numerology.psycheNum}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Personal Year</p>
                <p className="text-xl font-bold text-primary">{getPY(curYear)}</p>
              </Card>
            </div>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-primary font-bold text-lg"><Zap className="h-5 w-5" /> Critical Convergences</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Years where Personal Year 4 or 7 (the cycle's troughs) coincide with hostile celestial bonds — the most concentrated periods of compound pressure.
              </p>
              {convergences.length > 0 ? (
                convergences.map(h => {
                  const meta = CAT_META[h.rt];
                  return (
                    <Card key={h.y} className={`p-4 bg-black/40 border-l-4 ${h.rt === 'clash' ? 'border-red-500' : 'border-amber-500'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl font-black">{h.y}</span>
                        <Badge className={meta.badge}>{meta.label}</Badge>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p><span className="text-primary font-bold">◎ Convergence Insight:</span> {h.p === 4 
                          ? "Personal Year 4 demands disciplined foundation-laying while hostile energy disrupts your environment. Reduce commitments radically."
                          : "Personal Year 7 calls for inward retreat while external energy invades your space. Prioritize mental clarity."}</p>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center italic text-muted-foreground py-10">No immediate convergences found in the next 20 years.</p>
              )}
            </section>
          </div>
        )}

        {activeTab === 'wh' && (
          <div className="space-y-6">
            <ZodiacWheel birthSign={birthSign} />
            <section className="space-y-2">
              <h3 className="text-primary font-bold text-lg px-2">Bond Definitions</h3>
              <Accordion type="multiple" className="space-y-2">
                {Object.entries(BOOK.foundation).map(([key, text]) => (
                  <AccordionItem value={key} key={key} className="bg-black/40 border-white/10 rounded-xl px-4">
                    <AccordionTrigger className="hover:no-underline capitalize">
                      {key.replace('_', ' ')}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      <AccordionContentWithPlayer text={text} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        )}

        {activeTab === 'cy' && (
          <div className="space-y-6">
            <PersonalYearChart
              birthDay={day}
              birthMonth={month}
              birthYear={year}
              onYearSelect={setSelectedPersonalYear}
            />

            <AnimatePresence>
              {selectedPersonalYear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <Card className="p-4 bg-black/40 border-white/10">
                    <h4 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5" /> Personal Year {selectedPersonalYear.pyn} - {selectedPersonalYear.year}
                    </h4>
                    <AccordionContentWithPlayer text={selectedPersonalYear.meaning} />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <section className="space-y-4">
              <h3 className="text-primary font-bold text-lg px-2">Lifecycle Timeline</h3>
              <div className="pl-6 border-l-2 border-white/5 space-y-6">
                {timeline.map((ev, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-1 w-2 h-2 rounded-full bg-primary ring-4 ring-black" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/40 uppercase">Age {ev.age}</span>
                        <span className="text-sm font-bold text-primary">{ev.yr}</span>
                        <Badge className={CAT_META[ev.k].badge}>{CAT_META[ev.k].label}</Badge>
                      </div>
                      <p className="text-[13px] text-white/70">{LIFESTAGES[ev.age as keyof typeof LIFESTAGES] || 'Celestial Shift'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'mp' && (
          <div className="space-y-4">
            <h3 className="text-primary font-bold text-lg px-2">Fate Map Projection</h3>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/60">
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Bond</TableHead>
                    <TableHead>Theme (2026 Focus)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-black/40 text-xs">
                  {Array.from({ length: 20 }, (_, i) => {
                    const y = curYear + i;
                    const p = getPY(y);
                    const ys = getSign(y);
                    const rt = getRel(ys.n);
                    const signBook = (BOOK.animals as any)[birthSign];
                    const themeText = y === 2026 ? signBook?.overview_2026 : '';
                    
                    return (
                      <TableRow key={y} className="border-white/5">
                        <TableCell className="font-bold text-white">{y}</TableCell>
                        <TableCell>{ys.e} {ys.n}</TableCell>
                        <TableCell><Badge className={CAT_META[rt].badge}>{CAT_META[rt].label}</Badge></TableCell>
                        <TableCell className="max-w-[200px] truncate opacity-70">
                          {themeText || `PY ${p}`}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'dr' && (
          <div className="space-y-6 p-2">
            <h3 className="text-primary font-bold text-lg">Detailed Reading — {birthSign}</h3>
            {renderSignBook(birthSign)}
          </div>
        )}

        {activeTab === 'co' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {ANIMALS.map(a => (
                <button
                  key={a.n}
                  onClick={() => setSelectedCodex(a.n)}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    selectedCodex === a.n ? 'bg-primary border-primary' : 'bg-black/40 border-white/5 opacity-60'
                  }`}
                >
                  <span className="text-xl block mb-1">{a.e}</span>
                  <span className="text-[10px] font-bold uppercase">{a.n}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-black text-primary mb-4">{selectedCodex} Encyclopedia</h4>
              {renderSignBook(selectedCodex)}
            </div>
          </div>
        )}

        {activeTab === 'rf' && (
          <div className="space-y-6">
            <h3 className="text-primary font-bold text-lg px-2">Cycle Reference</h3>
            <Accordion type="multiple" className="space-y-2">
              {PERSONAL_YEARS.map(p => (
                <AccordionItem value={`ref-${p.n}`} key={p.n} className="bg-black/40 border-white/10 rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline">
                    PY {p.n} - {p.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <AccordionContentWithPlayer text={p.desc} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
