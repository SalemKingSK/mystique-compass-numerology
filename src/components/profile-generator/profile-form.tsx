'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Loader2, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FamousPerson } from '@/lib/famous-birthdays';
import { famousBirthdays } from '@/lib/famous-birthdays';
import InstallButton from '../InstallButton';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  formData: { name: string; day: number; month: number; year: number; gender: string };
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onHistoryOpen: () => void;
  onSelectChange: (value: string) => void;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFamousPersonSelect: (person: FamousPerson) => void;
}

function ParticleRing({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:20 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 6, height: 6, borderRadius: '50%',
          background: 'radial-gradient(circle, #d4af37, #c084fc)',
          animation: 'pf-burst 0.7s ease-out forwards',
          animationDelay: `${i * 0.03}s`,
          ['--angle' as any]: `${(360 / 12) * i}deg`,
        }} />
      ))}
    </div>
  );
}

function ConstellationSVG() {
  return (
    <svg viewBox="0 0 320 80" style={{ width:'100%', opacity:0.45, pointerEvents:'none' }}>
      <defs>
        <filter id="pf-star-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {[[20,60,60,30],[60,30,120,50],[120,50,160,20],[160,20,220,45],[220,45,270,25],[270,25,300,55]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4af3722" strokeWidth="0.8"/>
      ))}
      {[[20,60,1.2],[60,30,2],[120,50,1.4],[160,20,2.5],[220,45,1.6],[270,25,2],[300,55,1.3]].map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#d4af37" filter="url(#pf-star-glow)" opacity="0.8">
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

export function ProfileForm({
  formData, isPending, onSubmit, onHistoryOpen,
  onSelectChange, onFieldChange, onFamousPersonSelect,
}: ProfileFormProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<FamousPerson[]>([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isWikiLoading, setIsWikiLoading] = React.useState(false);
  const [burst, setBurst] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      setSearchResults(famousBirthdays.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      ).slice(0, 20));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  const handleSelectPerson = (person: FamousPerson) => {
    onFamousPersonSelect(person);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleWikiSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsWikiLoading(true);
    try {
      const res = await fetch(`/api/biography?name=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.found && data.birthYear && data.birthMonth && data.birthDay) {
        handleSelectPerson({
          name: data.title, day: data.birthDay, month: data.birthMonth,
          year: data.birthYear, gender: data.gender || 'male',
          tags: ['Wikipedia', data.description].filter(Boolean) as string[],
        });
      } else {
        toast({ title: 'Not Found', description: 'Could not find precise birth data on Wikipedia.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Search Error', description: 'Failed to fetch from Wikipedia.' });
    } finally {
      setIsWikiLoading(false);
      setIsSearchOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
    onSubmit(e);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, duration: 0.45, ease: [0.23,1,0.32,1] as any },
    }),
  };

  return (
    <>
      <style>{`
        @keyframes pf-burst {
          0%  { transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(1); opacity:1; }
          100%{ transform: translate(-50%,-50%) rotate(var(--angle)) translateX(60px) scale(0); opacity:0; }
        }
        @keyframes pf-shimmer { 100% { transform: translateX(100%); } }
        @property --pf-card-angle { syntax:'<angle>'; inherits:false; initial-value:0deg; }
        @keyframes pf-card-spin { to { --pf-card-angle: 360deg; } }
        .pf-card-wrap {
          position: relative; border-radius: 1.25rem; padding: 1.5px;
          background: conic-gradient(from var(--pf-card-angle,0deg),
            #7c3aed, #d4af37, #c084fc, #d4af37, #7c3aed);
          animation: pf-card-spin 6s linear infinite;
        }
        .pf-card {
          background: rgba(15,5,35,0.92); backdrop-filter: blur(20px);
          border-radius: 1.2rem; padding: 1.5rem;
        }
        @media(min-width:768px){ .pf-card { padding: 2rem; } }
        .pf-label {
          font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(212,175,55,0.6);
          display: block; margin-bottom: 0.4rem;
        }
        .pf-divider { display:flex; align-items:center; gap:0.75rem; margin:0.25rem 0; }
        .pf-divider::before,.pf-divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent); }
        .pf-divider span { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.25em; color:rgba(212,175,55,0.5); white-space:nowrap; }
        .pf-btn {
          position:relative; width:100%;
          background:linear-gradient(135deg,#5b21b6 0%,#d4af37 50%,#7c3aed 100%);
          background-size:200% 100%; border:none; border-radius:0.9rem;
          padding:0.9rem 1.5rem; font-family:'Cinzel',serif; font-size:0.75rem;
          font-weight:700; letter-spacing:0.22em; text-transform:uppercase;
          color:#1a0a2e; cursor:pointer; overflow:hidden;
          transition:background-position 0.5s,transform 0.2s,box-shadow 0.3s;
          box-shadow:0 4px 32px rgba(212,175,55,0.28);
        }
        .pf-btn:hover:not(:disabled){ background-position:100% 0; transform:translateY(-2px); box-shadow:0 8px 48px rgba(212,175,55,0.48); }
        .pf-btn:disabled{ opacity:0.7; cursor:not-allowed; }
        .pf-shimmer { position:absolute; inset:0; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%); transform:translateX(-100%); animation:pf-shimmer 2s infinite; }
        .pf-search-result { padding:0.75rem 1rem; cursor:pointer; font-size:0.85rem; color:#e2d9f3; transition:background 0.2s; }
        .pf-search-result:hover { background:rgba(124,58,237,0.18); }
        .pf-wiki-row { padding:0.75rem 1rem; cursor:pointer; font-size:0.8rem; color:#c084fc; font-weight:600; display:flex; align-items:center; gap:0.5rem; font-family:'Cinzel',serif; letter-spacing:0.05em; transition:background 0.2s; }
        .pf-wiki-row:hover { background:rgba(192,132,252,0.12); }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', minHeight:'calc(100vh - 4rem)' }}>
        {/* Header */}
        <header style={{ textAlign:'center', paddingTop:'2rem', paddingBottom:'0.5rem' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'1rem' }}>
            <InstallButton />
          </div>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'1rem 0' }}>
            <svg viewBox="0 0 400 160" style={{ width:'100%', maxWidth:'22rem', height:'auto' }}>
              <defs>
                <linearGradient id="pf-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#FDF1B8"/>
                  <stop offset="50%"  stopColor="#E8C56D"/>
                  <stop offset="100%" stopColor="#B8860B"/>
                </linearGradient>
                <filter id="pf-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <radialGradient id="pf-haze" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <ellipse cx="200" cy="75" rx="180" ry="70" fill="url(#pf-haze)"/>
              <g transform="translate(200,48) scale(0.85)" filter="url(#pf-glow)">
                <path d="M 0 -44 L 11 0 L -11 0 Z" fill="#FDF1B8"/>
                <path d="M 0 44 L 11 0 L -11 0 Z" fill="#E8C56D"/>
                <path d="M 44 0 L 0 11 L 0 -11 Z" fill="#FDF1B8"/>
                <path d="M -44 0 L 0 11 L 0 -11 Z" fill="#E8C56D"/>
                <path d="M 31 -31 L 6 -6 L -6 6 Z" fill="#E8C56D"/>
                <path d="M 31 31 L 6 6 L -6 -6 Z" fill="#FDF1B8"/>
                <path d="M -31 31 L -6 6 L 6 -6 Z" fill="#E8C56D"/>
                <path d="M -31 -31 L -6 -6 L 6 6 Z" fill="#FDF1B8"/>
                <circle cx="0" cy="0" r="7" fill="#1a0a2e" stroke="#d4af37" strokeWidth="1.5"/>
                <circle cx="0" cy="0" r="3" fill="#d4af37">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/>
                </circle>
              </g>
              <text x="50%" y="105" dominantBaseline="middle" textAnchor="middle"
                fontFamily="'Cinzel Decorative', serif" fontSize="48" fontWeight="700"
                fill="url(#pf-gold)" letterSpacing="2" filter="url(#pf-glow)">
                Mystique
              </text>
              <text x="50%" y="138" dominantBaseline="middle" textAnchor="middle"
                fontFamily="'Cinzel', serif" fontSize="22" fontWeight="400"
                fill="url(#pf-gold)" letterSpacing="6" filter="url(#pf-glow)">
                COMPASS
              </text>
            </svg>
          </div>
          <p style={{ color:'rgba(192,132,252,0.6)', fontStyle:'italic', fontSize:'0.72rem', marginTop:'-0.5rem' }}>
            Giving your life a Meaning.
          </p>
        </header>

        {/* Form card */}
        <div style={{ flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem 1rem' }}>
          <div className="pf-card-wrap" style={{ width:'100%' }}>
            <div className="pf-card">
              {/* Card header */}
              <motion.div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}
                initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel Decorative','Cinzel',serif", fontSize:'1.35rem', fontWeight:700, background:'linear-gradient(135deg,#fdf1b8,#e8c56d,#d4af37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    Generate Profile
                  </div>
                  <p style={{ fontFamily:"'Cinzel',serif", fontSize:'0.58rem', letterSpacing:'0.22em', color:'rgba(212,175,55,0.45)', textTransform:'uppercase', marginTop:'0.2rem' }}>
                    ✦ Cosmic Profile Generator ✦
                  </p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={onHistoryOpen}
                  className="text-amber-300/50 hover:text-amber-300 rounded-full border border-amber-300/10 hover:border-amber-300/30">
                  <History className="h-5 w-5"/>
                </Button>
              </motion.div>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                {/* Search */}
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                  <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <PopoverTrigger asChild>
                      <div>
                        <label className="pf-label">Search Database or Wikipedia</label>
                        <div style={{ position:'relative' }}>
                          <Search style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'rgba(192,132,252,0.5)' }}/>
                          <Input placeholder="e.g., Albert Einstein, Tesla, Napoleon…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                            onFocus={() => { if (searchQuery.length > 1) setIsSearchOpen(true); }}
                            style={{ paddingLeft:'2.5rem' }} autoComplete="off"/>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0"
                      style={{ background:'#0f0523', border:'1px solid rgba(124,58,237,0.2)' }}
                      onOpenAutoFocus={e => e.preventDefault()}>
                      <div style={{ maxHeight:'20rem', overflowY:'auto' }}>
                        {searchResults.length > 0 && (
                          <div style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:'0.25rem' }}>
                            <div style={{ padding:'0.5rem 0.75rem', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(212,175,55,0.4)', fontFamily:"'Cinzel',serif" }}>
                              Local Database
                            </div>
                            {searchResults.map((p, i) => (
                              <div key={`${p.name}-${i}`} className="pf-search-result"
                                onMouseDown={e => { e.preventDefault(); handleSelectPerson(p); }}>
                                {p.name} <span style={{ fontSize:'0.7rem', color:'rgba(192,132,252,0.45)' }}>({p.tags.join(', ')})</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="pf-wiki-row"
                          onMouseDown={e => { e.preventDefault(); handleWikiSearch(); }}>
                          {isWikiLoading ? <Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }}/> : <Globe style={{ width:16, height:16 }}/>}
                          {isWikiLoading ? 'Searching Wikipedia…' : `Search Wikipedia for "${searchQuery || '…'}"`}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </motion.div>

                {/* Divider */}
                <div className="pf-divider"><span>OR ENTER MANUALLY</span></div>

                {/* Name */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                  <label htmlFor="name" className="pf-label">Full Name</label>
                  <Input id="name" name="name" placeholder="e.g., Jane Doe"
                    value={formData.name} onChange={onFieldChange} required/>
                </motion.div>

                {/* Date */}
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem' }}>
                    {[
                      { id:'day',   label:'Day',   ph:'DD',   min:1,  max:31 },
                      { id:'month', label:'Month', ph:'MM',   min:1,  max:12 },
                      { id:'year',  label:'Year',  ph:'YYYY', min:1,  max:new Date().getFullYear() },
                    ].map(f => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="pf-label">{f.label}</label>
                        <Input id={f.id} name={f.id} type="number" placeholder={f.ph}
                          value={(formData as any)[f.id] || ''}
                          onChange={onFieldChange} required min={f.min} max={f.max}/>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Gender */}
                <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                  <label className="pf-label">Gender</label>
                  <Select onValueChange={onSelectChange} value={formData.gender}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender"/>
                    </SelectTrigger>
                    <SelectContent style={{ background:'#0f0523', border:'1px solid rgba(124,58,237,0.2)' }}>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Submit */}
                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible"
                  style={{ position:'relative', paddingTop:'0.5rem' }}>
                  <ParticleRing active={burst}/>
                  <button type="submit" className="pf-btn" disabled={isPending}>
                    <div className="pf-shimmer"/>
                    <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      {isPending
                        ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }}/> Reading the cosmos…</>
                        : <><Sparkles style={{ width:16, height:16 }}/> Reveal My Cosmic Profile</>
                      }
                    </span>
                  </button>
                </motion.div>
              </form>

              <div style={{ marginTop:'1rem', height:'2rem' }}>
                <ConstellationSVG/>
              </div>
            </div>
          </div>
        </div>

        <footer style={{ textAlign:'center', padding:'1rem', color:'rgba(192,132,252,0.35)', fontSize:'0.62rem', fontStyle:'italic', lineHeight:1.7, whiteSpace:'pre-line' }}>
          {"He who knows others is learned;\nHe who knows himself is wise.\n— Lao Tzu, Dao De Jing"}
        </footer>
      </div>
    </>
  );
}