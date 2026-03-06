'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData, PersonalYearData } from './types';
import { ANIMALS, RELATIONS, CAT_META, PERSONAL_YEARS, LIFESTAGES, TAISUI, STEMS, SNAMES } from '@/lib/cosmic-fate/constants';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Info, Sparkles, Zap, Calendar, BookOpen, MapIcon, Star, History, Users, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'ov', name: 'Overview', icon: Sparkles },
  { id: 'wh', name: 'Wheel', icon: Users },
  { id: 'cy', name: 'Cycles', icon: Activity },
  { id: 'mp', name: 'Map', icon: MapIcon },
  { id: 'dr', name: 'Deep Read', icon: BookOpen },
  { id: 'co', name: 'Codex', icon: Search },
  { id: 'rf', name: 'Ref', icon: Info },
];

const EL_CLASS: Record<string, string> = {
  Wood: 'bg-green-500/20 text-green-400 border-green-500/30',
  Fire: 'bg-red-500/20 text-red-400 border-red-500/30',
  Earth: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Metal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Water: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};

const PLANETS = ['', 'Sun', 'Moon', 'Jupiter', 'Rahu', 'Mercury', 'Venus', 'Ketu', 'Saturn', 'Mars'];

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('ov');
  const [selectedCodex, setSelectedCodex] = useState('Rat');
  const [selectedPersonalYear, setSelectedPersonalYear] = useState<PersonalYearData | null>(null);

  const { birthDay: day, birthMonth: month, birthYear: year } = numerology;
  const birthSign = insight.sign;
  const curYear = new Date().getFullYear();

  // --- HELPERS ---
  const red = (n: number): number => {
    let s = n;
    while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
    return s || 9;
  };

  const getPY = (y: number) => red(red(day) + red(month) + red(y));
  
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

  const getStem = (y: number) => STEMS[y % 10];
  const getStemName = (y: number) => SNAMES[y % 10];

  // --- DERIVED DATA ---
  const LP = useMemo(() => red(red(day) + red(month) + red(year)), [day, month, year]);
  const BN = useMemo(() => red(day), [day]);

  const convergences = useMemo(() => {
    const ENEMY = ['clash', 'harm', 'destroy', 'self'];
    const hits = [];
    for (let y = curYear; y < curYear + 30; y++) {
      const p = getPY(y);
      const ys = getSign(y);
      const rt = getRel(ys.n);
      if ((p === 4 || p === 7) && ENEMY.includes(rt)) hits.push({ y, p, ys, rt });
    }
    return hits;
  }, [day, month, curYear, birthSign]);

  const documentedSigns = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'];

  // --- RENDERERS ---
  const renderBookSection = (title: string, content: string, category: string) => {
    const cm = CAT_META[category] || { badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: category };
    return (
      <AccordionItem value={title} key={title} className="bg-black/40 border-white/10 rounded-xl px-4 mb-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2">
            {title} <Badge className={cm.badge}>{cm.label}</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-white/80 leading-relaxed text-sm">
          <div className="whitespace-pre-line space-y-4">
            <AccordionContentWithPlayer text={content} />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-muted-foreground italic">
            Source: The Chinese Zodiac: Six Categories of Years — Verbatim Text
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Tab Navigation */}
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
            <span className="text-[9px] font-bold uppercase tracking-tight">{tab.name}</span>
          </button>
        ))}
      </div>

      <ScrollArea className="h-[600px] pr-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'ov' && (
          <div className="space-y-8 pb-10">
            <section>
              <h3 className="flex items-center gap-2 text-primary font-bold text-lg mb-4"><Star className="h-5 w-5" /> Core Numbers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="p-3 bg-black/40 border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl mb-1">{getSign(year).e}</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-black">Chinese Sign</p>
                  <p className="text-xs font-bold text-yellow-400">{birthSign} · {getSign(year).br}</p>
                </Card>
                <Card className="p-3 bg-black/40 border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl mb-1 text-primary font-black">{BN}</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-black">Psyche No.</p>
                  <p className="text-xs font-bold text-white/70">{PLANETS[BN] || ''}</p>
                </Card>
                <Card className="p-3 bg-black/40 border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl mb-1 text-primary font-black">{LP}</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-black">Life Path</p>
                  <p className="text-xs font-bold text-white/70">{PERSONAL_YEARS.find(p => p.n === LP)?.name}</p>
                </Card>
                <Card className="p-3 bg-black/40 border-white/10 text-center flex flex-col justify-center">
                  <span className="text-2xl mb-1 text-magenta font-black">{getPY(curYear)}</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-black">PY {curYear}</p>
                  <p className="text-xs font-bold text-white/70">{PERSONAL_YEARS.find(p => p.n === getPY(curYear))?.name}</p>
                </Card>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-primary font-bold text-lg"><Zap className="h-5 w-5" /> Critical Convergences</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Years where Personal Year 4 or 7 (the cycle's troughs) coincide with hostile celestial bonds — the most concentrated periods of compound pressure.
              </p>
              {convergences.length > 0 ? (
                convergences.map(h => {
                  const cm = CAT_META[h.rt];
                  const pi = PERSONAL_YEARS.find(x => x.n === h.p);
                  const ts = TAISUI[h.y];
                  const signBook = (BOOK.animals as any)[birthSign];
                  const bookSect = signBook ? signBook[h.rt] : '';
                  const bookPreview = bookSect ? bookSect.substring(0, 600) + '...' : '';

                  return (
                    <Card key={h.y} className={`p-5 bg-black/40 border-l-4 ${['clash', 'self'].includes(h.rt) ? 'border-red-500' : 'border-amber-500'} mb-4`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-3xl font-black text-white">{h.y}</span>
                        <Badge className={cm.badge}>{cm.label}</Badge>
                      </div>
                      <div className="space-y-4 text-sm leading-relaxed">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                          PY {h.p} · {h.ys.e} {h.ys.n} Year · <span className={EL_CLASS[getStem(h.y)]}>{getStemName(h.y)} {getStem(h.y)}</span>
                        </p>
                        <div className="space-y-3">
                          <p><span className="text-amber-400 font-black">☯ Numerological —</span> {pi?.desc}</p>
                          <p><span className="text-primary font-black">⚔ Celestial Bond —</span> Your <strong>{birthSign}</strong> meets the <strong>{h.ys.n}</strong> year in {cm.label} configuration. {ts && `This ${ts.cy} year: ${ts.note}.`}</p>
                          {bookPreview && (
                            <div className="trad-box">
                              <div className="trad-lbl">📖 From the Source Text ({birthSign} Chapter)</div>
                              <div className="text-xs leading-relaxed text-white/80 whitespace-pre-line italic">
                                {bookPreview}
                              </div>
                            </div>
                          )}
                          <p><span className="text-green-400 font-black">⚡ Compound Counsel —</span> {h.p === 4 
                            ? `Personal Year 4 demands disciplined foundation-laying while ${cm.label} energy simultaneously disrupts your environment. Reduce commitments radically. Honour every existing obligation.` 
                            : `Personal Year 7 calls for inward retreat and genuine reflection while ${cm.label} energy invades the inner space required for that retreat. Prioritize mental and spiritual clarity.`
                          }</p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center italic text-muted-foreground py-10">No immediate convergences found in the next 30 years.</p>
              )}
            </section>
          </div>
        )}

        {/* WHEEL TAB */}
        {activeTab === 'wh' && (
          <div className="space-y-6 pb-10">
            <section className="text-center">
              <h3 className="text-primary font-bold text-lg mb-4">Celestial Relationship Wheel</h3>
              <ZodiacWheel birthSign={birthSign} />
            </section>
            <section>
              <h3 className="flex items-center gap-2 text-primary font-bold text-lg mb-4"><Users className="h-5 w-5" /> Relationship Details</h3>
              <Accordion type="multiple" className="space-y-2">
                {Object.entries(RELATIONS[birthSign] || {}).map(([type, name]) => {
                  const names = Array.isArray(name) ? name : [name];
                  return names.map(targetName => {
                    const typeKey = type === 'sanhe' || type === 'liuhe' ? type : type;
                    const bookData = (BOOK.animals as any)[birthSign];
                    const content = bookData ? bookData[typeKey] : BOOK.foundation[typeKey as keyof typeof BOOK.foundation];
                    return renderBookSection(`${ANIMALS.find(a => a.n === targetName)?.e || ''} ${targetName}`, content as string, typeKey);
                  });
                })}
              </Accordion>
            </section>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cy' && (
          <div className="space-y-6 pb-10">
            <PersonalYearChart
              birthDay={day}
              birthMonth={month}
              birthYear={year}
              onYearSelect={setSelectedPersonalYear}
            />
            <AnimatePresence>
              {selectedPersonalYear && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4"
                >
                  <Card className="p-5 bg-black/40 border-white/10 border-l-4 border-primary">
                    <h4 className="font-black text-xl text-primary mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5" /> Personal Year {selectedPersonalYear.pyn} — {selectedPersonalYear.year}
                    </h4>
                    <div className="text-sm leading-relaxed text-white/80 space-y-4">
                      <AccordionContentWithPlayer text={selectedPersonalYear.meaning} />
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* YEAR MAP TAB */}
        {activeTab === 'mp' && (
          <div className="space-y-4 pb-10">
            <h3 className="text-primary font-bold text-lg">Year-by-Year Fate Projection</h3>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/60">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-black">Year</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Animal</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Stem·Elem</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Bond</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">PY</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Theme</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Confluence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-black/40">
                  {Array.from({ length: 20 }, (_, i) => {
                    const y = curYear + i;
                    const p = getPY(y);
                    const ys = getSign(y);
                    const rt = getRel(ys.n);
                    const isT = p === 4 || p === 7;
                    const isE = ['clash', 'harm', 'destroy', 'self'].includes(rt);
                    const isA = ['sanhe', 'liuhe'].includes(rt);
                    const pi = PERSONAL_YEARS.find(x => x.n === p);
                    
                    let confluence = null;
                    if (isT && isE) confluence = <span className="text-red-400 font-bold">⚡ Trough+Enemy</span>;
                    else if (isT && isA) confluence = <span className="text-magenta font-bold">✦ Trough+Ally</span>;
                    else if (isT) confluence = <span className="text-amber-400 font-bold">◎ Trough</span>;
                    
                    return (
                      <TableRow key={y} className="border-white/5 hover:bg-white/5">
                        <TableCell className={`font-black text-sm ${y === curYear ? 'text-magenta' : 'text-white'}`}>{y}</TableCell>
                        <TableCell className="text-xs">{ys.e} {ys.n}</TableCell>
                        <TableCell>
                          <Badge className={`text-[9px] ${EL_CLASS[getStem(y)]}`}>{getStemName(y)}·{getStem(y)[0]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[9px] ${CAT_META[rt]?.badge || ''}`}>{rt === 'sanhe' ? 'San He' : rt === 'liuhe' ? 'Liu He' : CAT_META[rt]?.label || 'Neutral'}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border ${isT ? 'border-magenta bg-magenta/10 text-magenta' : 'border-white/10 text-white/60'}`}>{p}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{pi?.name || ''}</TableCell>
                        <TableCell className="text-[10px]">{confluence || <span className="text-muted-foreground opacity-30">—</span>}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* DEEP READ TAB */}
        {activeTab === 'dr' && (
          <div className="space-y-6 pb-10">
            <h3 className="text-primary font-bold text-lg">Deep Reading — {birthSign}</h3>
            {documentedSigns.includes(birthSign) ? (
              <>
                <div className="info-tag">📚 Source: The Chinese Zodiac: Six Categories of Years · Verbatim text</div>
                <Accordion type="multiple" className="space-y-4">
                  {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                    const content = (BOOK.animals as any)[birthSign]?.[key];
                    if (!content) return null;
                    return renderBookSection(key === 'self' ? `Ben Ming Nian — ${birthSign} Years` : key.replace('_', ' '), content, key);
                  })}
                </Accordion>
              </>
            ) : (
              <div className="space-y-6">
                <Card className="p-4 bg-black/40 border-white/10">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The source text documents six signs in full encyclopaedic detail: <strong>Rat, Ox, Tiger, Rabbit, Dragon,</strong> and <strong>Snake</strong>. 
                    As your sign (<strong>{birthSign}</strong>) is not one of the six, we provide a <strong>Derived Analysis</strong> using the verbatim chapters of your primary celestial partners.
                  </p>
                </Card>
                <h4 className="text-primary font-bold flex items-center gap-2"><Activity className="h-4 w-4" /> Derived Analysis from Partners</h4>
                <Accordion type="multiple" className="space-y-4">
                  {RELATIONS[birthSign]?.clash && documentedSigns.includes(RELATIONS[birthSign].clash) && (
                    renderBookSection(`Through your Clash Partner: ${RELATIONS[birthSign].clash}`, (BOOK.animals as any)[RELATIONS[birthSign].clash].self, 'clash')
                  )}
                  {RELATIONS[birthSign]?.harm && documentedSigns.includes(RELATIONS[birthSign].harm) && (
                    renderBookSection(`Through your Harm Partner: ${RELATIONS[birthSign].harm}`, (BOOK.animals as any)[RELATIONS[birthSign].harm].self, 'harm')
                  )}
                  {(RELATIONS[birthSign]?.sanhe || []).map(partner => documentedSigns.includes(partner) && (
                    renderBookSection(`Through your San He Ally: ${partner}`, (BOOK.animals as any)[partner].self, 'sanhe')
                  ))}
                </Accordion>
              </div>
            )}
            
            <div className="div">✦</div>
            <h3 className="text-primary font-bold text-lg flex items-center gap-2"><History className="h-5 w-5" /> Life-Age Recurrence Map</h3>
            <div className="tl-wrap mt-4">
              {Object.entries(LIFESTAGES).map(([ageStr, stage]) => {
                const age = parseInt(ageStr);
                const targetYear = year + age;
                const ys = getSign(targetYear);
                const rt = getRel(ys.n);
                const cm = CAT_META[rt];
                const stem = getStem(targetYear);
                const isPast = targetYear < curYear;
                const isCur = targetYear === curYear;

                return (
                  <div key={age} className={`tl-node ${rt}`} style={{ opacity: isPast ? 0.5 : 1 }}>
                    <div className="tl-stage">{stage}</div>
                    <div className="tl-age">
                      Age <span>{age}</span> &nbsp;·&nbsp; {targetYear} &nbsp;
                      <span className={`elem-tag ${EL_CLASS[getStem(targetYear)]}`}>{getStemName(targetYear)} {ys.n}</span>
                      {isCur && <span className="text-magenta font-bold ml-2">← now</span>}
                    </div>
                    <div className="tl-sub">
                      <Badge className={cm?.badge || 'b-neutral'}>{rt.toUpperCase()}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CODEX TAB */}
        {activeTab === 'co' && (
          <div className="space-y-6 pb-10">
            <section>
              <h3 className="text-primary font-bold text-lg mb-2">Sign Codex</h3>
              <div className="info-tag text-[10px] mb-4">📚 Source: The Chinese Zodiac: Six Categories of Years — Verbatim</div>
              <div className="codex-grid">
                {ANIMALS.map(a => {
                  const isLocked = !documentedSigns.includes(a.n);
                  return (
                    <button
                      key={a.n}
                      onClick={() => !isLocked && setSelectedCodex(a.n)}
                      className={`codex-card ${selectedCodex === a.n ? 'on' : ''} ${isLocked ? 'locked' : ''}`}
                    >
                      <div className="ce">{a.e}</div>
                      <div className="cn">{a.n}</div>
                      <div className="ct">{a.el} · {a.pl}</div>
                      {isLocked && <div style={{ fontSize: '8px', color: 'var(--muted)', marginTop: '2px' }}>🔒</div>}
                    </button>
                  );
                })}
              </div>
            </section>

            <AnimatePresence mode="wait">
              <motion.div key={selectedCodex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Card className="p-4 bg-primary/10 border-primary/20">
                  <h4 className="text-2xl font-black text-primary flex items-center gap-2">
                    {ANIMALS.find(a => a.n === selectedCodex)?.e} {selectedCodex} Encyclopedia
                  </h4>
                </Card>
                <Accordion type="multiple" className="space-y-4">
                  {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                    const content = (BOOK.animals as any)[selectedCodex]?.[key];
                    if (!content) return null;
                    return renderBookSection(key === 'self' ? 'Ben Ming Nian' : key.replace('_', ' '), content, key);
                  })}
                </Accordion>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* REF TAB */}
        {activeTab === 'rf' && (
          <div className="space-y-8 pb-10">
            <section>
              <h3 className="text-primary font-bold text-lg mb-4">Personal Year Meanings</h3>
              <div className="grid grid-cols-1 gap-4">
                {PERSONAL_YEARS.map(p => (
                  <Card key={p.n} className={`p-4 bg-black/40 border-white/10 ${p.t ? 'border-l-4 border-magenta' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-black text-amber-400">{p.n}</span>
                      <div>
                        <h4 className="font-bold text-white leading-tight">{p.name}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase">{p.season}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed italic mb-3">{p.desc}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-white/5 rounded"><strong>☽ Vedic:</strong> {p.vedic}</div>
                      <div className="p-2 bg-white/5 rounded"><strong>☰ Lo Shu:</strong> {p.loshu}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-primary font-bold text-lg mb-4">Six Categories — Foundation</h3>
              <Accordion type="multiple" className="space-y-4">
                {Object.entries(BOOK.foundation).map(([key, text]) => (
                  <AccordionItem key={key} value={key} className="bg-black/40 border-white/10 rounded-xl px-4">
                    <AccordionTrigger className="capitalize font-bold text-magenta">{key.replace('_', ' ')}</AccordionTrigger>
                    <AccordionContent className="text-xs text-white/70 leading-relaxed whitespace-pre-line">
                      <AccordionContentWithPlayer text={text} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
