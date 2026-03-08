'use client';

import React, { useEffect, useRef } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { YD } from '@/lib/cosmic-fate/oracle';
import { CONVERGENCE_CARDS } from '@/lib/cosmic-fate/convergence';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { BOOK } from '@/lib/cosmic-fate/book';

/**
 * @fileOverview Refactored Cosmic Fate Map component.
 * Modularized data to prevent truncation and ensure verbatim rendering of Chunks 01-11.
 * Integrated with main app search results while retaining local Year Selector.
 */

interface CosmicFateMapProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

// ─── LOGIC ENGINE ─────────────────────────────────────────────────────────────

function reduce(n: number): number {
  let s = n;
  while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
  return s || 9;
}

function calcLP(m: number, d: number, y: number) { return reduce(reduce(m) + reduce(d) + reduce(y)); }
function calcPY(m: number, d: number, y: number) { return reduce(reduce(m) + reduce(d) + reduce(y)); }
function lpName(n: number) {
  return ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker',
    'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';
}

function getAnimalFromYear(y: number) { 
  const index = ((y - 1900) % 12 + 12) % 12;
  const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  return ZOO[signs[index]];
}

function getCategory(birthAnimalName: string, yearAnimalName: string) {
  const b = ZOO[birthAnimalName]; const y = ZOO[yearAnimalName]; if (!b || !y) return 'neutral';
  if (birthAnimalName === yearAnimalName) return 'ben-ming';
  if (b.clash === yearAnimalName) return 'clash';
  if (b.harm === yearAnimalName) return 'harm';
  if (b.dest === yearAnimalName) return 'destruction';
  if (b.san.includes(yearAnimalName) || b.liu === yearAnimalName) return 'alliance';
  return 'neutral';
}

function catLabel(c: string) { 
  return { 
    'ben-ming': 'Ben Ming Nian ✦', 
    'clash': 'Direct Clash ⚡', 
    'harm': 'Harm Year ⚠', 
    'destruction': 'Destruction Year 💀', 
    'alliance': 'Alliance Year ✅', 
    'neutral': 'Neutral Year ◦' 
  }[c as any] || 'Unknown'; 
}

function catColor(c: string) { 
  return { 
    'ben-ming': 'var(--cf-gold)', 
    'clash': 'var(--cf-rose)', 
    'harm': '#d08028', 
    'destruction': '#9858b8', 
    'alliance': 'var(--cf-jade-bright)', 
    'neutral': 'var(--cf-silver-dim)' 
  }[c as any] || 'var(--cf-text)'; 
}

export function CosmicFateMap({ birthDay, birthMonth, birthYear }: CosmicFateMapProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Attach all handlers to window for verbatim HTML onclick events
    (window as any).calculate = () => {
      const ryInput = document.getElementById('cf-readYear') as HTMLInputElement;
      const ry = parseInt(ryInput.value);
      if (!ry || isNaN(ry)) return;

      const m = birthMonth;
      const d = birthDay;
      const by = birthYear;

      const py = calcPY(m, d, ry);
      const uy = reduce(ry);
      const lp = calcLP(m, d, by);
      const bv = reduce(d);
      const today = new Date();
      const currentMonth = ry === today.getFullYear() ? today.getMonth() + 1 : 1;
      const pm = reduce(py + currentMonth);
      const p1 = reduce(reduce(m) + reduce(d));
      const p2 = reduce(reduce(d) + reduce(by));
      const p3 = reduce(p1 + p2);
      const p4 = reduce(reduce(m) + reduce(by));
      const p1end = 36 - lp;
      const p2end = p1end + 9;
      const p3end = p2end + 9;
      const currentAge = ry - by;
      
      let currentPinnacleNum, currentPinnacle;
      if (currentAge <= p1end) { currentPinnacle = 1; currentPinnacleNum = p1; }
      else if (currentAge <= p2end) { currentPinnacle = 2; currentPinnacleNum = p2; }
      else if (currentAge <= p3end) { currentPinnacle = 3; currentPinnacleNum = p3; }
      else { currentPinnacle = 4; currentPinnacleNum = p4; }

      const c1 = Math.abs(reduce(m) - reduce(d));
      const c2 = Math.abs(reduce(d) - reduce(by));
      const c3 = Math.abs(c1 - c2);
      const c4 = Math.abs(reduce(m) - reduce(by));
      let currentChallenge;
      if (currentAge <= p1end) currentChallenge = c1;
      else if (currentAge <= p2end) currentChallenge = c2;
      else if (currentAge <= p3end) currentChallenge = c3;
      else currentChallenge = c4;

      const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
      const birthAnimalName = signs[((by - 1900) % 12 + 12) % 12];
      const ba = ZOO[birthAnimalName];

      const coreStrip = document.getElementById('core-strip')!;
      coreStrip.innerHTML = `
        <div class="core-chip hl-py"> <div class="core-chip-label">Personal Year ${ry}</div> <div class="core-chip-num">${py}</div> <div class="core-chip-name">${YD[py]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Personal Month</div> <div class="core-chip-num" style="color:#de78a0">${pm}</div> <div class="core-chip-name">Phase ${pm}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Universal Year</div> <div class="core-chip-num" style="color:var(--cf-amethyst)">${uy}</div> <div class="core-chip-name">${YD[uy]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Life Path</div> <div class="core-chip-num" style="color:var(--cf-jade-bright)">${lp}</div> <div class="core-chip-name">${lpName(lp)}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Birth Vibration</div> <div class="core-chip-num" style="color:var(--cf-silver)">${bv}</div> <div class="core-chip-name">${lpName(bv)}</div> </div> 
        ${ba ? `<div class="core-chip"> <div class="core-chip-label">Chinese Sign</div> <div class="core-chip-num" style="color:var(--cf-gold-bright);font-size:2.2rem">${ba.e}</div> <div class="core-chip-name">${birthAnimalName}</div> </div>` : ''} 
        <div class="core-chip"> <div class="core-chip-label">Pinnacle ${currentPinnacle}</div> <div class="core-chip-num" style="color:#68c268">${currentPinnacleNum}</div> <div class="core-chip-name">Active</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Challenge ${currentPinnacle}</div> <div class="core-chip-num" style="color:#c86040">${currentChallenge}</div> <div class="core-chip-name">Active</div> </div>`;

      const ab = document.getElementById('alert-banner')!;
      let alertText = '';
      if (py === uy) alertText = `<strong>⚡ Double Amplification:</strong> Personal Year ${py} aligns with Universal Year ${uy}.`;
      else if (py === bv) alertText = `<strong>✦ Core Identity Activation:</strong> Personal Year ${py} matches your Birth Vibration ${bv}.`;
      else if (py === lp) alertText = `<strong>✦ Life Path Activation:</strong> Personal Year ${py} matches your Life Path ${lp}.`;
      
      if (alertText) { ab.innerHTML = alertText; ab.classList.add('visible'); } else { ab.classList.remove('visible'); }

      renderSynthesis(py, uy, lp, bv, pm, currentPinnacleNum, currentChallenge, birthAnimalName, ry);
      renderYearDive(py);
      renderIntersections(birthAnimalName, m, d, ry);
      renderZodiac(birthAnimalName, by);
      renderPinnacles(p1, p2, p3, p4, c1, c2, c3, c4, p1end, p2end, p3end, currentAge);
      document.getElementById('result-area')!.classList.remove('result-hidden');
    };

    const renderSynthesis = (py: number, uy: number, lp: number, bv: number, pm: number, pinnNum: number, challenge: number, birthAnimalName: string, ry: number) => {
      const yr = YD[py];
      const yearAnimalName = Object.keys(ZOO).find(k => ZOO[k].ben.includes(ry)) || '';
      const cat = getCategory(birthAnimalName, yearAnimalName);
      const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
      const animalLine = `Your ${birthAnimalName} nature meets a ${yearAnimalName} year (${catLabel(cat)}) — ${ 
        cat === 'clash' ? 'an environment of maximum elemental friction calling for proactive adaptation rather than resistance' : 
        cat === 'harm' ? 'a year of concealed pressures requiring extra vigilance in trust and documentation' : 
        cat === 'destruction' ? 'a year when outdated structures may fracture, clearing ground for what genuinely serves you' : 
        cat === 'ben-ming' ? 'your identity year, when all your characteristic patterns amplify to their fullest expression' : 
        ['alliance'].includes(cat) ? 'an environmentally supported year where the collective field actively favours your initiatives' : 
        'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
      }.`;
      const synthText = `In ${ry}, you are in a <strong>Personal Year ${py} — ${yr?.title}</strong>. Your Life Path ${lp} (${lpName(lp)}) interacts with the ${yearAnimalName} year (${catLabel(cat)}). ${animalLine} Your current Personal Month is ${pm} (${pmNames[pm]}). Your active Pinnacle is ${pinnNum} and active Challenge is ${challenge}.`;
      document.getElementById('synthesis-container')!.innerHTML = `
        <div class="section-header">✦ &nbsp; Oracle Synthesis &nbsp; ✦</div>
        <div id="synthesis-text" class="cp">${synthText}</div>
        <button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('synthesis-text').textContent)">🔊 Read Aloud</button>`;
    };

    const renderYearDive = (py: number) => {
      const yr = YD[py]; if (!yr) return;
      const kws = yr.kw.map((k: string) => `<span class="kw">${k}</span>`).join('');
      const prs = yr.pr.map((p: any) => `<div class="pi"><div class="pi-icon">${p.i}</div><div class="pi-name">${p.n}</div><div class="pi-desc">${p.d}</div></div>`).join('');
      const paras = (t: string) => (t || '').split('\n\n').map(p => `<p class="cp">${p.trim()}</p>`).join('');
      
      document.getElementById('year-dive-container')!.innerHTML = `
        <div class="year-deep-dive">
          <div class="year-dive-header">
            <div class="year-num-big" style="color:var(--cf-gold)">${py}</div>
            <div class="year-dive-title">${yr.title}</div>
          </div>
          <div class="kw-strip">${kws}</div>
          <div class="tab-nav grid grid-cols-3 md:grid-cols-6 gap-1 p-2">
            <button class="tab-btn active" onclick="window.swT('ov',this)">Overview</button>
            <button class="tab-btn" onclick="window.swT('py',this)">Pythagorean</button>
            <button class="tab-btn" onclick="window.swT('ve',this)">Vedic</button>
            <button class="tab-btn" onclick="window.swT('ch',this)">Chinese</button>
            <button class="tab-btn" onclick="window.swT('ca',this)">Chaldean</button>
            <button class="tab-btn" onclick="window.swT('pr',this)">Practices</button>
          </div>
          <div class="tab-content">
            <div class="tab-panel active" id="tp-ov">
              <div class="content-section" id="tp-ov-text">${paras(yr.overview)}</div>
              <button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-ov-text').textContent)">🔊 Read Aloud</button>
            </div>
            <div class="tab-panel" id="tp-py"><div id="tp-py-text">${paras(yr.pyth)}</div></div>
            <div class="tab-panel" id="tp-ve"><div id="tp-ve-text">${paras(yr.vedic)}</div></div>
            <div class="tab-panel" id="tp-ch"><div id="tp-ch-text">${paras(yr.chinese)}</div></div>
            <div class="tab-panel" id="tp-ca"><div id="tp-ca-text">${paras(yr.chald)}</div></div>
            <div class="tab-panel" id="tp-pr"><div class="practice-grid">${prs}</div></div>
          </div>
        </div>`;
    };

    const renderIntersections = (birthAnimalName: string, m: number, d: number, ry: number) => {
      const cal = [];
      const ba = ZOO[birthAnimalName];
      for (let y = ry; y <= ry + 18; y++) {
        const py = reduce(m + d + y);
        const ya = getAnimalFromYear(y);
        const cat = getCategory(birthAnimalName, ya.n);
        cal.push({ year: y, py, animalName: ya.n, cat, e: ya.e });
      }
      
      const filtered = cal.filter(c => c.py === 4 || c.py === 7);
      const cards = filtered.map(y => {
        const cat = y.cat;
        let intensity = '◦ Critical Personal Year';
        let color = 'var(--cf-silver-dim)';
        if (cat === 'clash') { intensity = '🔴 MAXIMUM TENSION — Direct Clash'; color = 'var(--cf-rose)'; }
        else if (cat === 'harm') { intensity = '🟠 HIGH TENSION — Harm Year'; color = '#d08028'; }
        else if (cat === 'destruction') { intensity = '🟣 SIGNIFICANT TENSION'; color = '#9858b8'; }
        else if (cat === 'ben-ming') { intensity = '⭐ DOUBLE AMPLIFICATION'; color = 'var(--cf-gold)'; }
        else if (cat === 'alliance') { intensity = '✅ SUPPORTED CRITICAL YEAR'; color = 'var(--cf-jade-bright)'; }

        let narrative = `In ${y.year}, your ${y.animalName} year (${y.e}) intersects with Personal Year ${y.py}. `;
        if (y.py === 4) {
          if (cat === 'clash') narrative += `This is the most challenging configuration: 4's foundation-building meets Direct Clash... ${ba?.clashDesc || ''}`;
          else narrative += `Personal Year 4 focus on structure in a ${catLabel(cat)} environment.`;
        } else {
          if (cat === 'clash') narrative += `The most spiritually dissonant configuration: 7's introspection meets Direct Clash... ${ba?.clashDesc || ''}`;
          else narrative += `Personal Year 7 focus on depth in a ${catLabel(cat)} environment.`;
        }

        return `
          <div class="intersection-card p-4 mb-4 border border-white/10 rounded-xl bg-slate-900/40">
            <div class="flex justify-between items-center mb-2">
              <div class="text-3xl font-serif font-bold text-white">${y.year}</div>
              <div class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black/40" style="color:${color}">${intensity}</div>
            </div>
            <div class="text-sm font-bold text-primary mb-2">Personal Year ${y.py} · ${YD[y.py].title}</div>
            <div class="cp text-xs leading-relaxed" id="int-${y.year}">${narrative}</div>
            <button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('int-${y.year}').textContent)">🔊 Read Aloud</button>
          </div>`;
      }).join('');

      document.getElementById('personal-intersections-container')!.innerHTML = `
        <div class="section-header">🔥 &nbsp; Critical Year Intersections &nbsp; 🔥</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>`;
    };

    const renderZodiac = (birthAnimalName: string, by: number) => {
      const today = new Date();
      const startYear = today.getFullYear();
      const years = [];
      for (let y = startYear; y <= startYear + 11; y++) {
        const ya = getAnimalFromYear(y);
        const cat = getCategory(birthAnimalName, ya.n);
        const py = reduce(birthMonth + birthDay + y);
        years.push({ year: y, cat, animal: ya, py });
      }
      const chips = years.map(y => `
        <div class="zc p-3 border border-white/5 rounded-xl bg-slate-900/60 cursor-pointer hover:border-primary/40 transition-all" 
             onclick="window.openZodiacPop('${y.animal.n}','${birthAnimalName}','${y.year}','${y.year-by}','${y.cat}')">
          <div class="text-2xl mb-1">${y.animal.e}</div>
          <div class="text-[10px] font-bold text-white">${y.year}</div>
          <div class="text-[10px] text-primary">PY ${y.py}</div>
          <div class="text-[8px] uppercase font-black tracking-tighter" style="color:${catColor(y.cat)}">${catLabel(y.cat)}</div>
        </div>`).join('');
      document.getElementById('zodiac-container')!.innerHTML = `
        <div class="section-header">☯ &nbsp; Zodiac Trajectory &nbsp; ☯</div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">${chips}</div>`;
    };

    const renderPinnacles = (p1: number, p2: number, p3: number, p4: number, c1: number, c2: number, c3: number, c4: number, p1end: number, p2end: number, p3end: number, currentAge: number) => {
      const stages = [
        { n: 1, p: p1, c: c1, label: `Birth - Age ${p1end}`, start: 0, end: p1end },
        { n: 2, p: p2, c: c2, label: `Age ${p1end + 1} - ${p2end}`, start: p1end + 1, end: p2end },
        { n: 3, p: p3, c: c3, label: `Age ${p2end + 1} - ${p3end}`, start: p2end + 1, end: p3end },
        { n: 4, p: p4, c: c4, label: `Age ${p3end + 1}+`, start: p3end + 1, end: 99 }
      ];
      
      const cards = stages.map(s => {
        const isActive = currentAge >= s.start && currentAge <= s.end;
        return `
          <div class="p-5 mb-4 border rounded-2xl ${isActive ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/5 bg-slate-900/40'}">
            <div class="flex justify-between items-center mb-4">
              <div class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">${s.label}</div>
              ${isActive ? `<span class="bg-primary text-[8px] px-2 py-0 rounded text-white font-bold">ACTIVE STAGE</span>` : ''}
            </div>
            <div class="flex gap-8 mb-4">
              <div class="text-center">
                <div class="text-4xl font-serif font-bold text-emerald-400">${s.p}</div>
                <div class="text-[8px] uppercase tracking-widest text-muted-foreground">Pinnacle</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-serif font-bold text-rose-400">${s.c}</div>
                <div class="text-[8px] uppercase tracking-widest text-muted-foreground">Challenge</div>
              </div>
            </div>
            <div class="space-y-3">
              <p class="text-xs leading-relaxed text-slate-300">${PINNACLE_DESC[s.p]}</p>
              <p class="text-[11px] leading-relaxed text-rose-300/80 italic font-medium">Challenge ${s.c}: ${CHALLENGE_DESC[s.c]}</p>
            </div>
          </div>`;
      }).join('');
      
      document.getElementById('pinnacles-container')!.innerHTML = `
        <div class="section-header">◈ &nbsp; Pinnacles & Challenges &nbsp; ◈</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</div>`;
    };

    (window as any).ttsPlay = (btnEl: HTMLElement, text: string) => {
      if (!window.speechSynthesis) return;
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onstart = () => btnEl.classList.add('playing');
      utterance.onend = () => btnEl.classList.remove('playing');
      window.speechSynthesis.speak(utterance);
    };

    (window as any).swT = (name: string, btn: HTMLElement) => {
      const parent = btn.closest('.year-deep-dive');
      if (!parent) return;
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelector(`#tp-${name}`)?.classList.add('active');
      btn.classList.add('active');
    };

    (window as any).switchDash = (btn: HTMLElement) => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panelId = 'panel-' + (btn as any).dataset.panel;
      document.getElementById(panelId)?.classList.add('active');
    };

    (window as any).closePop = () => { 
      document.getElementById('overlay')!.classList.remove('visible'); 
      document.body.style.overflow = ''; 
    };

    (window as any).openZodiacPop = (animalName: string, birthAnimalName: string, year: string, age: string, cat: string) => {
      const ba = ZOO[birthAnimalName]; const ya = ZOO[animalName]; if (!ba || !ya) return;
      let specificDesc = '';
      if(cat === 'ben-ming') specificDesc = ba.benDesc; 
      else if(cat === 'clash') specificDesc = ba.clashDesc; 
      else if(cat === 'harm') specificDesc = ba.harmDesc; 
      else if(cat === 'destruction') specificDesc = ba.destDesc; 
      else if(cat === 'alliance') specificDesc = ba.allianceDesc;
      else specificDesc = `This ${year} ${animalName} year is a Neutral period for ${birthAnimalName}. No special Tai Sui relationship creates extraordinary support or challenge. Individual effort determines outcomes.`;
      
      const body = `
        <div class="ibox mb-4"><strong>${year} (${animalName} Year, Age ${age})</strong> — Tai Sui: <span style="color:${catColor(cat)}">${catLabel(cat)}</span></div> 
        <div class="content-h mb-2 uppercase tracking-widest text-xs opacity-60">Your ${birthAnimalName} Synthesis</div> 
        ${specificDesc.split('\n\n').map(p=>`<p class="cp mb-3">${p}</p>`).join('')} 
        <div class="content-h mt-6 mb-2 uppercase tracking-widest text-xs opacity-60">${animalName} Year Qualities</div> 
        <p class="cp">${ya.trait}. Health: ${ya.organ}. Direction: ${ya.dir}.</p>`;
      
      document.getElementById('pg')!.textContent = ya.e;
      document.getElementById('ph')!.textContent = `${year}: ${animalName} Year`;
      document.getElementById('ps')!.textContent = `${birthAnimalName} × ${animalName} — ${catLabel(cat)}`;
      document.getElementById('pb')!.innerHTML = body;
      document.getElementById('overlay')!.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    (window as any).buildConvergenceCards = () => {
      let html = '';
      CONVERGENCE_CARDS.forEach(c => {
        const chips = c.chips.map(ch => `<div class="enemy-chip p-3 bg-black/40 rounded-lg border border-white/5"><div class="enemy-chip-title font-bold text-primary text-[10px] mb-1">${ch.t}</div><p class="text-[11px] leading-relaxed text-slate-300">${ch.p}</p></div>`).join('');
        html += `
          <div class="conv-card mb-6 border border-primary/20 rounded-2xl overflow-hidden bg-slate-900/60"> 
            <div class="conv-header p-4 bg-primary/10 border-b border-primary/20"> 
              <div class="conv-title text-xl font-bold text-primary">${c.title}</div> 
              <div class="conv-sub text-xs italic text-muted-foreground">${c.sub}</div> 
            </div> 
            <div class="conv-body p-4" id="conv-body-${c.year}"> 
              <p class="cp mb-4">${c.intro}</p> 
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">${chips}</div> 
              <div class="wbox p-3 bg-rose-900/20 border-l-2 border-rose-500 rounded-r-lg text-xs italic text-rose-200">${c.warning}</div> 
              <button class="tts-btn mt-4" onclick="window.ttsPlay(this, document.getElementById('conv-body-${c.year}').textContent)">🔊 Read Aloud</button> 
            </div> 
          </div>`;
      });
      document.getElementById('convergence-cards')!.innerHTML = html;
    };

    if (!initialized.current) {
      (window as any).buildConvergenceCards();
      (window as any).calculate();
      initialized.current = true;
    }
  }, [birthDay, birthMonth, birthYear]);

  return (
    <div className="cosmic-fate-root relative min-h-screen rounded-2xl overflow-hidden">
      <div id="stars-cf"></div>
      <div className="cf-page relative z-10 p-2 md:p-4">
        <div className="cf-hero text-center py-8">
          <span className="hero-glyph text-5xl mb-4 block">🌌</span>
          <h1 className="text-3xl font-bold text-primary tracking-widest uppercase mb-2">Cosmic Fate Map</h1>
          <p className="hero-sub text-[10px] tracking-[0.3em] uppercase opacity-60">Trajectory & Enemy Year Oracle</p>
        </div>

        <div className="calc-card bg-slate-900/80 border border-primary/20 p-4 rounded-2xl mb-6">
          <div className="calc-title text-[10px] tracking-widest uppercase text-center opacity-60 mb-4">✦ Forecast Your Destiny ✦</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="input-group">
              <label className="text-[8px] uppercase tracking-widest opacity-60 mb-1">Year to Read</label>
              <input type="number" id="cf-readYear" className="bg-black/40 border border-white/10 rounded px-3 py-2 text-center font-bold" defaultValue={new Date().getFullYear()} min={1900} max={2100} />
            </div>
            <button className="btn-reveal bg-primary px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform" onClick={() => (window as any).calculate()}>✦ Cast Fate Map</button>
          </div>
        </div>

        <div id="result-area" className="result-hidden">
          <div className="core-strip grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6" id="core-strip"></div>
          <div className="alert-banner p-3 bg-primary/10 border border-primary/20 rounded-xl mb-6 text-center text-xs" id="alert-banner"></div>

          <nav className="dash-nav grid grid-cols-3 gap-1 mb-1" id="dash-nav">
            <button className="dash-tab active p-3 text-[10px] font-bold uppercase tracking-widest rounded-t-xl bg-slate-900/80 border-x border-t border-white/10" data-panel="synthesis" onClick={(e) => (window as any).switchDash(e.currentTarget)}>✦ Oracle</button>
            <button className="dash-tab p-3 text-[10px] font-bold uppercase tracking-widest rounded-t-xl bg-slate-900/80 border-x border-t border-white/10" data-panel="yeardive" onClick={(e) => (window as any).switchDash(e.currentTarget)}>☽ Dive</button>
            <button className="dash-tab p-3 text-[10px] font-bold uppercase tracking-widest rounded-t-xl bg-slate-900/80 border-x border-t border-white/10" data-panel="intersections" onClick={(e) => (window as any).switchDash(e.currentTarget)}>🔥 Critical</button>
            <button className="dash-tab p-3 text-[10px] font-bold uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="zodiac" onClick={(e) => (window as any).switchDash(e.currentTarget)}>☯ Zodiac</button>
            <button className="dash-tab p-3 text-[10px] font-bold uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="pinnacles" onClick={(e) => (window as any).switchDash(e.currentTarget)}>◈ Pinnacles</button>
            <button className="dash-tab p-3 text-[10px] font-bold uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="convergence" onClick={(e) => (window as any).switchDash(e.currentTarget)}>⚠ Enemy</button>
          </nav>

          <div className="dash-body bg-slate-900/80 border border-white/10 rounded-b-2xl min-h-[500px] p-4 mb-12">
            <div className="dash-panel active" id="panel-synthesis"><div id="synthesis-container"></div></div>
            <div className="dash-panel" id="panel-yeardive"><div id="year-dive-container"></div></div>
            <div className="dash-panel" id="panel-intersections"><div id="personal-intersections-container"></div></div>
            <div className="dash-panel" id="panel-zodiac"><div id="zodiac-container"></div></div>
            <div className="dash-panel" id="panel-pinnacles"><div id="pinnacles-container"></div></div>
            <div className="dash-panel" id="panel-convergence"><div id="convergence-cards-inner"></div></div>
          </div>
        </div>

        <div className="conv-outer mt-12">
          <div className="section-header">⚠ &nbsp; Enemy Year Dynamics &nbsp; ⚠</div>
          <div id="convergence-cards"></div>
        </div>
      </div>

      <div className="cf-overlay fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity" id="overlay" onClick={(e) => (e.target === e.currentTarget) && (window as any).closePop()}>
        <div className="popover-cf bg-slate-900 border border-primary/40 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 relative">
          <button className="absolute top-4 right-4 text-white/40 hover:text-white" onClick={() => (window as any).closePop()}>✕</button>
          <span className="text-5xl mb-2 block text-center" id="pg"></span>
          <div className="text-2xl font-bold text-primary text-center mb-1" id="ph"></div>
          <div className="text-[10px] uppercase tracking-widest text-center opacity-60 mb-6" id="ps"></div>
          <div id="pb" className="text-sm leading-relaxed"></div>
        </div>
      </div>
    </div>
  );
}
