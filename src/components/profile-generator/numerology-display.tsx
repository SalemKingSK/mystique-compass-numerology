'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, PersonalYearData } from './types';
import {
  Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass,
  Activity, ChevronRight, CalendarDays, Zap, Star,
  AlertTriangle, TrendingUp,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { PersonalYearChart } from './personal-year-chart';
import { ZodiacSection } from './zodiac-section';
import LoshuArrowDetailPanel from '@/components/LoshuArrowDetailPanel';
import { FateChambers } from './fate-chambers';
import { CoreVibrations } from './core-vibrations';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';

// ── helpers ──────────────────────────────────────────────────────────────────
function reduceNum(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a, d) => a + +d, 0);
  return val || 9;
}
function personalYearNow(d: number, m: number) {
  const yr = new Date().getFullYear();
  return reduceNum(reduceNum(d) + reduceNum(m) + reduceNum(String(yr).split('').reduce((a,c)=>a+ +c,0)));
}
function calcPinnacles(lp: number, d: number, m: number, y: number) {
  const firstEnd = 36 - lp;
  const yd = (yr: number) => reduceNum(String(yr).split('').reduce((a,c)=>a+ +c,0));
  const p1 = reduceNum(reduceNum(d)+reduceNum(m));
  const p2 = reduceNum(reduceNum(d)+yd(y));
  const p3 = reduceNum(p1+p2);
  const p4 = reduceNum(reduceNum(m)+yd(y));
  const c1 = reduceNum(Math.abs(reduceNum(d)-reduceNum(m)));
  const c2 = reduceNum(Math.abs(reduceNum(d)-yd(y)));
  const c3 = reduceNum(Math.abs(c1-c2));
  const c4 = reduceNum(Math.abs(reduceNum(m)-yd(y)));
  const age = new Date().getFullYear() - y;
  return [
    { stage:1, label:'First Pinnacle',  ages:`0 – ${firstEnd}`,              p:p1, c:c1, active:age<firstEnd },
    { stage:2, label:'Second Pinnacle', ages:`${firstEnd} – ${firstEnd+9}`,   p:p2, c:c2, active:age>=firstEnd&&age<firstEnd+9 },
    { stage:3, label:'Third Pinnacle',  ages:`${firstEnd+9} – ${firstEnd+18}`,p:p3, c:c3, active:age>=firstEnd+9&&age<firstEnd+18 },
    { stage:4, label:'Fourth Pinnacle', ages:`${firstEnd+18}+`,               p:p4, c:c4, active:age>=firstEnd+18 },
  ];
}

const YEAR_COLOUR: Record<number,string> = {1:'#ef4444',2:'#c084fc',3:'#fbbf24',4:'#34d399',5:'#60a5fa',6:'#f472b6',7:'#818cf8',8:'#f59e0b',9:'#a78bfa'};
const YEAR_THEME: Record<number,{title:string;keyword:string;warning?:true}> = {
  1:{title:'New Beginnings',keyword:'Independence & Initiative'},
  2:{title:'Cooperation',keyword:'Partnership & Patience'},
  3:{title:'Creative Bloom',keyword:'Expression & Joy'},
  4:{title:'Foundation',keyword:'Hard Work & Structure',warning:true},
  5:{title:'Freedom',keyword:'Change & Expansion'},
  6:{title:'Responsibility',keyword:'Home & Heart'},
  7:{title:'Reflection',keyword:'Inner Wisdom & Solitude',warning:true},
  8:{title:'Power',keyword:'Abundance & Authority'},
  9:{title:'Completion',keyword:'Release & Transformation',warning:true},
};
const MISSING_ANALYSIS: Record<number,{title:string;layers:[string,string,string]}> = {
  1:{title:'Self-Reliance',layers:['Over-dependency on external approval — you seek validation before acting.','Leadership is a skill, not a trait you were born lacking. This life teaches you to author yourself.','Daily practice: Make one significant decision entirely without seeking consensus.']},
  2:{title:'Emotional Depth',layers:['Emotional detachment or hypersensitivity used as armour against being truly known.','Partnership is your greatest classroom — vulnerability is not weakness here, it\'s currency.','Daily practice: Sit with one uncomfortable feeling for 60 seconds before reacting.']},
  3:{title:'Creative Voice',layers:['Creative self-expression was suppressed early — possibly by perfectionism or criticism.','Joy and play feel indulgent, yet they are the exact frequency your soul was encoded with.','Daily practice: Create something daily — writing, doodle, hum — purely for yourself, unseen.']},
  4:{title:'Discipline',layers:['Structures feel like traps. Routine triggers existential dread or resistance.','You are not lazy — you are ancestrally wired against constraint that felt like oppression.','Daily practice: Honour one micro-routine for 21 days without negotiating exceptions.']},
  5:{title:'Freedom',layers:['You either cling to rigid routine or blow up your life seeking stimulation. No middle ground exists yet.','The freedom you seek is internal — a state of radical adaptability, not external chaos.','Daily practice: Deliberately change one comfortable habit each week.']},
  6:{title:'Nurturing',layers:['Giving and receiving care triggers a complex tangle of obligation and resentment.','You are learning the difference between sacred service and self-erasure.','Daily practice: Cook or prepare something for someone — the ritual matters more than the gesture.']},
  7:{title:'Inner Wisdom',layers:['Over-rationalisation blocks intuition. You dismiss the non-logical before it can inform you.','Your spiritual bandwidth is vast but sealed — trauma or conditioning closed the channel.','Daily practice: 5 minutes of unstructured silence every morning before any screen.']},
  8:{title:'Abundance',layers:['Money and power carry unexamined ancestral fear — either chased desperately or sabotaged.','Financial karma is highly active. Your relationship with resources mirrors your self-worth.','Daily practice: Track every transaction this week without judgement. Awareness precedes shift.']},
  9:{title:'Completion',layers:['You struggle to close chapters — people, roles, identities are clung to past their expiry.','Old wounds orbit without resolution because forgiveness has been confused with condoning.','Daily practice: Write a completion letter to one unresolved chapter. Sending is optional.']},
};
const KUA_COMPASS: Record<number,{name:string;best:string[];avoid:string[];element:string;colour:string}> = {
  1:{name:'Water',  best:['SE','E','S','N'],    avoid:['W','NW','NE','SW'], element:'Water', colour:'#60a5fa'},
  2:{name:'Earth',  best:['NE','W','NW','SW'],  avoid:['E','SE','S','N'],   element:'Earth', colour:'#fbbf24'},
  3:{name:'Thunder',best:['S','N','SE','E'],    avoid:['SW','NE','W','NW'], element:'Wood',  colour:'#34d399'},
  4:{name:'Wind',   best:['N','S','E','SE'],    avoid:['NE','NW','SW','W'], element:'Wood',  colour:'#6ee7b7'},
  5:{name:'Earth',  best:['NE','W','NW','SW'],  avoid:['E','SE','S','N'],   element:'Earth', colour:'#f59e0b'},
  6:{name:'Heaven', best:['W','NE','SW','NW'],  avoid:['E','SE','S','N'],   element:'Metal', colour:'#c0c0c0'},
  7:{name:'Lake',   best:['NW','SW','NE','W'],  avoid:['N','SE','S','E'],   element:'Metal', colour:'#a78bfa'},
  8:{name:'Mountain',best:['SW','NW','W','NE'], avoid:['SE','S','N','E'],   element:'Earth', colour:'#fb923c'},
  9:{name:'Fire',   best:['E','SE','N','S'],    avoid:['W','NW','SW','NE'], element:'Fire',  colour:'#ef4444'},
};

// ── Section Header ────────────────────────────────────────────────────────────
function SH({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"/>
      <h3 className="font-cinzel font-semibold text-[0.7rem] text-primary flex items-center gap-2 uppercase tracking-[0.28em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"/>
    </div>
  );
}

// ── This Year Banner ──────────────────────────────────────────────────────────
function ThisYearBanner({ birthDay, birthMonth }: { birthDay: number; birthMonth: number }) {
  const today = new Date();
  const py  = personalYearNow(birthDay, birthMonth);
  const pm  = reduceNum(py + today.getMonth() + 1);
  const pd  = reduceNum(py + today.getDate() + today.getMonth() + 1);
  const col = YEAR_COLOUR[py] || '#d4af37';
  const theme = YEAR_THEME[py];
  const dateStr = today.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <motion.div initial={{ opacity:0, y:-16, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.6, ease:[0.23,1,0.32,1] }}
      style={{
        position:'relative', overflow:'hidden', borderRadius:'1.1rem',
        border:`1px solid ${col}66`,
        background:`linear-gradient(145deg, rgba(20,5,50,0.95), rgba(10,2,30,0.97))`,
        padding:'1rem 1.25rem', marginBottom:'1.25rem',
        boxShadow:`0 0 0 1px ${col}26, 0 8px 40px ${col}2e, inset 0 1px 0 ${col}33`,
      }}>
      {/* top gold line */}
      <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:'1.5px', background:`linear-gradient(90deg,transparent,${col},transparent)`, borderRadius:99 }}/>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.55rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(212,175,55,0.5)', marginBottom:'0.6rem' }}>{dateStr}</div>
      <div style={{ display:'flex', marginBottom:'0.75rem' }}>
        {[['Personal Year', py],['Personal Month', pm],['Personal Day', pd]].map(([label, val], i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem', padding:'0.5rem 0.25rem', borderLeft: i>0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:'0.5rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(200,180,240,0.45)' }}>{label}</span>
            <span style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'2.2rem', fontWeight:700, lineHeight:1, color:col, textShadow:`0 0 28px ${col}99` }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
        <span style={{ background:`${col}2e`, border:`1px solid ${col}59`, borderRadius:99, padding:'0.25rem 0.7rem', fontFamily:"'Cinzel',serif", fontSize:'0.58rem', fontWeight:700, color:col, letterSpacing:'0.1em' }}>
          Year {py} · {theme?.title}
        </span>
        <span style={{ fontSize:'0.7rem', color:'rgba(210,195,240,0.65)', fontStyle:'italic' }}>{theme?.keyword}</span>
      </div>
      {theme?.warning && (
        <div style={{ marginTop:'0.6rem', display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'0.5rem', padding:'0.4rem 0.75rem', fontSize:'0.7rem', color:'#fca5a5' }}>
          <AlertTriangle style={{ width:14, height:14, color:'#ef4444', flexShrink:0 }}/>
          Challenging season ahead — heightened awareness recommended this cycle.
        </div>
      )}
    </motion.div>
  );
}

// ── Missing Numbers ───────────────────────────────────────────────────────────
function MissingNumbers({ numberCounts }: { numberCounts: { [k: string]: number } }) {
  const missing = [1,2,3,4,5,6,7,8,9].filter(n => !numberCounts[String(n)]);
  const [expanded, setExpanded] = React.useState<number|null>(null);
  const [tab, setTab] = React.useState(0);
  if (missing.length === 0) return (
    <div style={{ textAlign:'center', padding:'1.5rem', color:'rgba(212,175,55,0.5)', fontFamily:"'Cinzel',serif", fontSize:'0.72rem', letterSpacing:'0.15em' }}>
      ✦ Complete grid — no missing numbers detected
    </div>
  );
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
      {missing.map(n => {
        const info = MISSING_ANALYSIS[n];
        const isOpen = expanded === n;
        return (
          <motion.div key={n} layout
            onClick={() => { setExpanded(isOpen ? null : n); setTab(0); }}
            style={{
              cursor:'pointer', borderRadius:'1rem',
              border: isOpen ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(124,58,237,0.2)',
              background: isOpen ? 'rgba(20,5,50,0.9)' : 'rgba(15,5,40,0.6)',
              overflow:'hidden', gridColumn: isOpen ? '1/-1' : undefined,
              transition:'border-color 0.3s, background 0.3s',
            }}>
            <div style={{ padding:'0.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' }}>
              <div style={{ position:'relative', width:52, height:52 }}>
                <svg viewBox="0 0 52 52" style={{ position:'absolute', inset:0 }}>
                  <defs>
                    <linearGradient id={`mg${n}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#d4af37" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="24" fill="rgba(15,5,40,0.8)" stroke={`url(#mg${n})`} strokeWidth="1.5" strokeDasharray="4 3"/>
                  {isOpen && <circle cx="26" cy="26" r="24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.6">
                    <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>}
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cinzel Decorative',serif", fontSize:'1.3rem', fontWeight:700, color:'#d4af37' }}>{n}</div>
              </div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.55rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(200,180,240,0.55)', textAlign:'center' }}>{info?.title}</div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.35, ease:[0.23,1,0.32,1] }}
                  style={{ padding:'0 1rem 1rem' }}>
                  <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.75rem' }}>
                    {['Shadow','Soul Lesson','Practice'].map((l,i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); setTab(i); }}
                        style={{ flex:1, padding:'0.3rem 0', borderRadius:'0.4rem', border: tab===i ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent', background: tab===i ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)', fontFamily:"'Cinzel',serif", fontSize:'0.52rem', letterSpacing:'0.12em', textTransform:'uppercase', color: tab===i ? '#d4af37' : 'rgba(200,180,240,0.4)', cursor:'pointer', transition:'all 0.2s' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize:'0.8rem', lineHeight:1.65, color:'rgba(210,195,240,0.75)', borderLeft:'2px solid rgba(212,175,55,0.3)', paddingLeft:'0.75rem', paddingTop:'0.25rem', paddingBottom:'0.25rem' }}>
                    {info?.layers[tab]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Pinnacles & Challenges ────────────────────────────────────────────────────
function PinnaclesAccordion({ destinyNum, birthDay, birthMonth, birthYear }: { destinyNum:number; birthDay:number; birthMonth:number; birthYear:number }) {
  const stages = calcPinnacles(destinyNum, birthDay, birthMonth, birthYear);
  const [open, setOpen] = React.useState<number|null>(stages.findIndex(s=>s.active)+1 || null);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
      {stages.map(s => (
        <div key={s.stage} style={{ borderRadius:'0.9rem', border: s.active ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(124,58,237,0.18)', background: s.active ? 'rgba(20,5,50,0.85)' : 'rgba(12,4,32,0.7)', overflow:'hidden', transition:'border-color 0.3s' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1rem', cursor:'pointer', userSelect:'none', gap:'0.5rem' }}
            onClick={() => setOpen(open===s.stage ? null : s.stage)}>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', flex:1 }}>
              {s.active && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', fontFamily:"'Cinzel',serif", fontSize:'0.45rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#34d399', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:99, padding:'0.15rem 0.5rem', width:'fit-content', marginBottom:'0.1rem' }}>
                  <TrendingUp style={{ width:8, height:8 }}/> You Are Here
                </span>
              )}
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:'0.7rem', fontWeight:600, color:'rgba(210,195,240,0.85)', letterSpacing:'0.05em' }}>{s.label}</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:'0.5rem', letterSpacing:'0.12em', color:'rgba(212,175,55,0.45)' }}>Ages {s.ages}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
              {[{v:s.p,gold:true},{v:s.c,gold:false}].map(({v,gold},i)=>(
                <div key={i} style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cinzel Decorative',serif", fontSize:'0.85rem', fontWeight:700, background: gold ? 'rgba(212,175,55,0.15)' : 'rgba(239,68,68,0.1)', border: gold ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(239,68,68,0.3)', color: gold ? '#d4af37' : '#ef4444' }}>{v}</div>
              ))}
              <span style={{ color:'rgba(212,175,55,0.4)', fontSize:'0.7rem', transition:'transform 0.25s', transform: open===s.stage ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>
          </div>
          <AnimatePresence>
            {open===s.stage && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.35, ease:[0.23,1,0.32,1] }}
                style={{ padding:'0 1rem 1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  {[
                    { label:`✦ Pinnacle ${s.p} — Opportunity`, text:PINNACLE_DESC[s.p]||'', gold:true },
                    { label:`⚡ Challenge ${s.c} — Lesson`,     text:CHALLENGE_DESC[s.c]||'', gold:false },
                  ].map(({ label, text, gold },i) => (
                    <div key={i} style={{ borderRadius:'0.6rem', padding:'0.75rem', fontSize:'0.75rem', lineHeight:1.65, color:'rgba(210,195,240,0.7)', background: gold ? 'rgba(212,175,55,0.06)' : 'rgba(239,68,68,0.06)', borderLeft: gold ? '2px solid rgba(212,175,55,0.4)' : '2px solid rgba(239,68,68,0.35)' }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:'0.55rem', letterSpacing:'0.18em', textTransform:'uppercase', color: gold ? 'rgba(212,175,55,0.7)' : 'rgba(239,68,68,0.7)', marginBottom:'0.4rem' }}>{label}</div>
                      {text.slice(0,220)}…
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Lucky Compass SVG ─────────────────────────────────────────────────────────
function LuckyCompassSVG({ kuaNum, kuaAttributes }: { kuaNum:number; kuaAttributes:NumerologyData['kuaAttributes'] }) {
  const kua = KUA_COMPASS[kuaNum] || KUA_COMPASS[1];
  const dirs8 = ['N','NE','E','SE','S','SW','W','NW'];
  const CX=130, CY=130, R=110, RN=82;
  function pos(dir: string, r: number){ const a=(dirs8.indexOf(dir)*45-90)*Math.PI/180; return {x:CX+r*Math.cos(a),y:CY+r*Math.sin(a)}; }
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
      <svg viewBox="0 0 260 260" style={{ width:'100%', maxWidth:280 }}>
        <defs>
          <radialGradient id="lc-bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a0a3a"/><stop offset="100%" stopColor="#080318"/></radialGradient>
          <filter id="lc-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="lc-ng"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={CX} cy={CY} r={R+8} fill="url(#lc-bg)" stroke="rgba(124,58,237,0.18)" strokeWidth="1"/>
        {Array.from({length:72},(_,i)=>{const a=(i*5-90)*Math.PI/180,big=i%9===0,r1=R-(big?12:5);return(<line key={i} x1={CX+r1*Math.cos(a)} y1={CY+r1*Math.sin(a)} x2={CX+R*Math.cos(a)} y2={CY+R*Math.sin(a)} stroke={big?'rgba(212,175,55,0.35)':'rgba(124,58,237,0.2)'} strokeWidth={big?1.2:0.6}/>);})}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(212,175,55,0.22)" strokeWidth="1"/>
        <circle cx={CX} cy={CY} r={60} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="0.8" strokeDasharray="3 4"/>
        <circle cx={CX} cy={CY} r={35} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="0.8"/>
        {[0,45,90,135].map(deg=>{const a=deg*Math.PI/180;return(<line key={deg} x1={CX-R*Math.cos(a)} y1={CY-R*Math.sin(a)} x2={CX+R*Math.cos(a)} y2={CY+R*Math.sin(a)} stroke="rgba(124,58,237,0.1)" strokeWidth="0.6"/>);})}
        {dirs8.map(dir=>{const p=pos(dir,RN),best=kua.best.includes(dir),avoid=kua.avoid.includes(dir),nr=best?12:avoid?9:7,nc=best?kua.colour:avoid?'#ef4444':'rgba(255,255,255,0.2)';return(
          <g key={dir} filter={best?'url(#lc-ng)':undefined}>
            <circle cx={p.x} cy={p.y} r={nr} fill={`${nc}22`} stroke={nc} strokeWidth={best?2:1}/>
            {best&&<circle cx={p.x} cy={p.y} r={nr*1.6} fill="none" stroke={nc} strokeWidth="0.8" strokeOpacity="0.3"><animate attributeName="r" values={`${nr};${nr*2.2};${nr}`} dur="2.5s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite"/></circle>}
            <text x={p.x} y={p.y+1} textAnchor="middle" dominantBaseline="middle" fontSize={best?7:6} fill={best?nc:avoid?'#ef4444':'rgba(200,180,240,0.4)'} fontFamily="'Cinzel',serif" fontWeight={best?'bold':'normal'}>{dir}</text>
          </g>
        );})}
        <g filter="url(#lc-glow)">
          <polygon points={`${CX},${CY-32} ${CX-7},${CY} ${CX},${CY-10} ${CX+7},${CY}`} fill="#d4af37" fillOpacity="0.9"/>
          <polygon points={`${CX},${CY+32} ${CX-7},${CY} ${CX},${CY+10} ${CX+7},${CY}`} fill="#7c3aed" fillOpacity="0.7"/>
        </g>
        <circle cx={CX} cy={CY} r={7} fill="#1a0a3a" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5"/>
        <circle cx={CX} cy={CY} r={3} fill="#d4af37"/>
        <text x={CX} y={CY+48} textAnchor="middle" fontFamily="'Cinzel Decorative',serif" fontSize="18" fontWeight="700" fill="#d4af37" fillOpacity="0.8" filter="url(#lc-glow)">{kuaNum}</text>
        <text x={CX} y={CY+60} textAnchor="middle" fontFamily="'Cinzel',serif" fontSize="5.5" letterSpacing="3" fill="rgba(212,175,55,0.4)">KUA NUMBER</text>
      </svg>
      {/* Legend */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem 1rem', width:'100%' }}>
        {[...kua.best.slice(0,4).map(d=>({d,t:'Auspicious',c:kua.colour})), ...kua.avoid.slice(0,4).map(d=>({d,t:'Avoid',c:'#ef4444'}))].map(({d,t,c},i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.68rem', color:'rgba(210,195,240,0.65)' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:c, boxShadow:t==='Auspicious'?`0 0 6px ${c}`:'none', flexShrink:0 }}/>
            <span style={{ fontWeight:700 }}>{d}</span>
            <span style={{ fontSize:'0.55rem', fontFamily:"'Cinzel',serif", letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(212,175,55,0.45)', marginLeft:'auto' }}>{t}</span>
          </div>
        ))}
      </div>
      {/* Meta */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:'0.5rem', padding:'0.6rem 1rem', borderRadius:'0.75rem', background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.15)', width:'100%' }}>
        {[['Trigram',kua.name],['Element',kua.element]].map(([l,v],i)=>(
          <span key={i} style={{ fontFamily:"'Cinzel',serif", fontSize:'0.55rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(212,175,55,0.65)' }}>
            {i>0&&<span style={{ color:'rgba(212,175,55,0.3)', marginRight:'0.5rem' }}>·</span>}
            {l}: <strong style={{ color:'#d4af37' }}>{v}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── InfoCard ─────────────────────────────────────────────────────────────────
const InfoCard = ({ title, value, icon, onClick }: { title:string; value:string|number; icon:React.ReactNode; onClick?:()=>void }) => (
  <div className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square ${onClick?'transition-all duration-300 hover:bg-purple-500/20 cursor-pointer':''}`} onClick={onClick}>
    <div className="flex items-center gap-2 text-purple-200/80">{icon}<p className="text-[0.6rem] font-cinzel uppercase tracking-widest">{title}</p></div>
    <p className="text-5xl font-bold text-yellow-300 mt-2 font-decorative drop-shadow-lg">{value||''}</p>
  </div>
);

// ── ArrowsDisplay ─────────────────────────────────────────────────────────────
const ArrowsDisplay = React.forwardRef<HTMLDivElement,{arrowsOfStrength:any[];arrowsOfWeakness:any[];openItems:string[];onToggle:(v:string[])=>void;birthDate:string;numberCounts:Record<number,number>}>(
  ({arrowsOfStrength,arrowsOfWeakness,openItems,onToggle,birthDate,numberCounts},ref)=>{
    const cats=Array.from(new Set([...arrowsOfStrength.map(a=>a.category),...arrowsOfWeakness.map(a=>a.category)])).filter(Boolean);
    return(
      <div className="glass-card p-4 space-y-6" ref={ref}>
        <SH icon={<Activity className="h-4 w-4"/>} title="Arrows of Power"/>
        {cats.map(cat=>(
          <div key={cat} className="space-y-2">
            <h4 className="font-cinzel text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2 border-l border-primary/30">{cat}</h4>
            <Accordion type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
              {[...arrowsOfStrength,...arrowsOfWeakness].filter(a=>(a.category||(a.type==='shadow'?'Deficiency':'Primary Plane'))===cat).map(arrow=>{
                const isShadow=arrow.type==='shadow'||arrow.type==='weakness';
                return(
                  <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4 mb-1 border-l-[3px] border-l-[#c8a84b]/40">
                    <AccordionTrigger>
                      <span className={`text-left font-cinzel text-[0.7rem] uppercase tracking-wider flex items-center gap-2 ${isShadow?'text-rose-400':'text-emerald-400'}`}>
                        {isShadow?<ChevronRight className="h-3 w-3 rotate-90"/>:<ChevronRight className="h-3 w-3"/>}
                        {arrow.name} ({arrow.numbers.join('-')})
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-base leading-relaxed">
                      <LoshuArrowDetailPanel arrowId={arrow.id} existingMeaning={arrow.description} birthDate={birthDate} externalCounts={numberCounts as any}/>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>
    );
  }
);
ArrowsDisplay.displayName='ArrowsDisplay';

// ── Main Export ───────────────────────────────────────────────────────────────
export function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
  const {
    birthDay,birthMonth,birthYear,psycheNum,destinyNum,kuaNum,
    loShuGrid,arrowsOfStrength,arrowsOfWeakness,kuaAttributes,
    compoundNum,compoundMeaning,reducedCompoundNum,reducedCompoundMeaning,
    karmicFateNum,karmicFateMeaning,numberCounts,repeatedNumberMeanings,
    psychicMeaning,specialTraitMeaning,destinyMeaning,
  } = numerology;

  const [openSections,setOpenSections]=React.useState<string[]>([]);
  const [selectedPersonalYear,setSelectedPersonalYear]=React.useState<PersonalYearData|null>(null);
  const [personalYearAccordionValue,setPersonalYearAccordionValue]=React.useState('');
  const [activeCoreLayer,setActiveCoreLayer]=React.useState<string|null>(null);
  const [activeFateLayer,setActiveFateLayer]=React.useState<number|null>(null);

  const coreVibrationsRef=React.useRef<HTMLDivElement>(null);
  const fateChambersRef=React.useRef<HTMLDivElement>(null);
  const arrowsRef=React.useRef<HTMLDivElement>(null);
  const kuaRef=React.useRef<HTMLDivElement>(null);
  const pyDetailRef=React.useRef<HTMLDivElement>(null);
  const birthDate=`${birthDay}/${birthMonth}/${birthYear}`;

  const handleYearSelect=(data:PersonalYearData|null)=>{
    if(data?.year!==selectedPersonalYear?.year){
      setSelectedPersonalYear(data);
      if(data){setPersonalYearAccordionValue('personal-year-detail');setTimeout(()=>pyDetailRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),150);}
      else setPersonalYearAccordionValue('');
    }
  };

  return (
    <div className="space-y-6">
      <ThisYearBanner birthDay={birthDay} birthMonth={birthMonth}/>

      <div className="glass-card p-4">
        <SH icon={<Star className="h-4 w-4"/>} title="Core Vibrations"/>
        <div className="grid grid-cols-3 gap-3">
          <InfoCard title="Psyche" value={psycheNum} icon={<BrainCircuit className="h-3.5 w-3.5"/>} onClick={()=>{setActiveCoreLayer('psyche');setTimeout(()=>coreVibrationsRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),150);}}/>
          <InfoCard title="Destiny" value={destinyNum} icon={<Sparkles className="h-3.5 w-3.5"/>} onClick={()=>{setActiveCoreLayer('destiny');setTimeout(()=>coreVibrationsRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),150);}}/>
          <InfoCard title="Kua" value={kuaNum} icon={<Compass className="h-3.5 w-3.5"/>} onClick={()=>kuaRef.current?.scrollIntoView({behavior:'smooth',block:'center'})}/>
        </div>
      </div>

      <CoreVibrations ref={coreVibrationsRef} psycheNum={psycheNum} psychicMeaning={psychicMeaning} destinyNum={destinyNum} destinyMeaning={destinyMeaning} birthDay={birthDay} specialTraitMeaning={specialTraitMeaning} activeLayer={activeCoreLayer} onLayerChange={setActiveCoreLayer}/>

      <div className="glass-card p-4">
        <SH icon={<Grid className="h-4 w-4"/>} title="Lo Shu Grid"/>
        <LoShuGrid grid={loShuGrid} numberCounts={numberCounts} birthDate={birthDate}/>
      </div>

      <div className="glass-card p-4">
        <SH icon={<Zap className="h-4 w-4"/>} title="Missing Numbers"/>
        <MissingNumbers numberCounts={numberCounts}/>
      </div>

      <div className="glass-card p-4">
        <SH icon={<Layers className="h-4 w-4"/>} title="Pinnacles & Challenges"/>
        <PinnaclesAccordion destinyNum={destinyNum} birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear}/>
      </div>

      <FateChambers ref={fateChambersRef} compoundNum={compoundNum} compoundMeaning={compoundMeaning} reducedCompoundNum={reducedCompoundNum} reducedCompoundMeaning={reducedCompoundMeaning} karmicFateNum={karmicFateNum} karmicFateMeaning={karmicFateMeaning} activeLayer={activeFateLayer} onLayerChange={setActiveFateLayer}/>

      <div className="glass-card p-4">
        <SH icon={<CalendarDays className="h-4 w-4"/>} title="Personal Year Wave"/>
        <PersonalYearChart birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear} onYearSelect={handleYearSelect}/>
      </div>

      {selectedPersonalYear && (
        <Accordion type="single" collapsible value={personalYearAccordionValue} onValueChange={setPersonalYearAccordionValue} ref={pyDetailRef}>
          <AccordionItem value="personal-year-detail" className="border-none">
            <div className="glass-card p-4">
              <AccordionTrigger className="font-cinzel text-sm text-primary uppercase tracking-wider">
                Year {selectedPersonalYear.year} · Personal Year {selectedPersonalYear.pyn}
              </AccordionTrigger>
              <AccordionContent><AccordionContentWithPlayer text={selectedPersonalYear.meaning}/></AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      )}

      <ZodiacSection birthDay={birthDay} birthMonth={birthMonth} birthYear={birthYear}/>

      <ArrowsDisplay ref={arrowsRef} arrowsOfStrength={arrowsOfStrength} arrowsOfWeakness={arrowsOfWeakness} openItems={openSections} onToggle={setOpenSections} birthDate={birthDate} numberCounts={numberCounts as Record<number,number>}/>

      <div className="glass-card p-4" ref={kuaRef}>
        <SH icon={<Compass className="h-4 w-4"/>} title="Lucky Compass"/>
        <LuckyCompassSVG kuaNum={kuaNum} kuaAttributes={kuaAttributes}/>
      </div>
    </div>
  );
}
