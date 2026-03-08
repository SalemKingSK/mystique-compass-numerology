
'use client';

import React, { useEffect, useRef } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { YD } from '@/lib/cosmic-fate/oracle';
import { CONVERGENCE_CARDS } from '@/lib/cosmic-fate/convergence';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { BOOK } from '@/lib/cosmic-fate/book';

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

const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

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
    (window as any).calculate = () => {
      const ryInput = document.getElementById('cf-readYear') as HTMLInputElement;
      const ry = parseInt(ryInput.value);
      if (!ry || isNaN(ry)) return;

      const m = birthMonth;
      const d = birthDay;
      const by = birthYear;

      const py = reduce(reduce(m) + reduce(d) + reduce(ry));
      const uy = reduce(ry);
      const lp = reduce(reduce(m) + reduce(d) + reduce(by));
      const bv = reduce(d);
      
      const today = new Date();
      const currentMonthIndex = ry === today.getFullYear() ? today.getMonth() + 1 : 1;
      const pm = reduce(py + currentMonthIndex);
      const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];

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
      const yearAnimal = getAnimalFromYear(ry);
      const cat = getCategory(birthAnimalName, yearAnimal.n);

      const coreStrip = document.getElementById('core-strip')!;
      coreStrip.innerHTML = `
        <div class="core-chip hl-py"> <div class="core-chip-label">Personal Year ${ry}</div> <div class="core-chip-num">${py}</div> <div class="core-chip-name">${YD[py]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Life Path</div> <div class="core-chip-num" style="color:var(--cf-jade-bright)">${lp}</div> <div class="core-chip-name">${lpName(lp)}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Universal Year</div> <div class="core-chip-num" style="color:var(--cf-amethyst)">${uy}</div> <div class="core-chip-name">${YD[uy]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Personal Month</div> <div class="core-chip-num" style="color:#de78a0">${pm}</div> <div class="core-chip-name">${pmNames[pm]}</div> </div>`;

      const ab = document.getElementById('alert-banner')!;
      let alertText = '';
      if (py === uy) alertText = `<strong>⚡ Double Amplification:</strong> Personal Year ${py} aligns with Universal Year ${uy}.`;
      else if (py === bv) alertText = `<strong>✦ Core Identity Activation:</strong> Personal Year ${py} matches your Birth Vibration ${bv}.`;
      else if (py === lp) alertText = `<strong>✦ Life Path Activation:</strong> Personal Year ${py} matches your Life Path ${lp}.`;
      if (alertText) { ab.innerHTML = alertText; ab.classList.add('visible'); } else { ab.classList.remove('visible'); }

      renderSynthesis(ry, py, uy, pm, lp, currentPinnacleNum, currentChallenge, birthAnimalName, yearAnimal.n, cat);
      renderYearDive(py);
      renderIntersections(birthAnimalName, m, d, ry, by);
      renderZodiac(birthAnimalName, by);
      renderPinnacles(p1, p2, p3, p4, c1, c2, c3, c4, p1end, p2end, p3end, currentAge);
      document.getElementById('result-area')!.classList.remove('result-hidden');
    };

    const renderSynthesis = (ry: number, py: number, uy: number, pm: number, lp: number, pinn: number, chall: number, birthSign: string, yearSign: string, cat: string) => {
      const yr = YD[py];
      const uyName = YD[uy]?.title;
      const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
      
      const synthText = `In ${ry}, you are in a <strong>Personal Year ${py} — ${yr?.title}</strong>, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${uy} (${uyName}) sets the collective backdrop — the shared frequency every person on earth is navigating alongside their personal arc. Your current Personal Month is ${pm} (${pmNames[pm]}), offering a finer-grained window into this season's immediate texture. Your ${birthSign} nature meets a ${yearSign} year (${catLabel(cat)}) — a ${cat === 'neutral' ? 'neutral year where outcomes reflect pure personal effort rather than exceptional external forces' : catLabel(cat).toLowerCase() + ' where trajectories are specifically influenced by Tai Sui energy'}. Your Life Path ${lp} (${lpName(lp)}) and Personal Year ${py} (${yr?.title}) are in productive dialogue — neither in obvious tension nor exceptional harmony, allowing this year's work to proceed through genuine effort. Your active Pinnacle is ${pinn} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${chall} (${lpName(chall)}) names the specific resistance pattern this life chapter asks you to develop through. Taken together, these layers describe not one story but several simultaneous ones: the year's momentum, the month's focus, the decade's theme, and the lifetime's direction — all converging in ${ry}.`;

      document.getElementById('synthesis-container')!.innerHTML = `
        <div class="section-header">✦ &nbsp; Your ${ry} Reading — Oracle Synthesis &nbsp; ✦</div>
        <div id="synthesis-text" class="cp">${synthText}</div>
        <button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('synthesis-text').textContent)">🔊 Read Aloud</button>`;
    };

    const renderYearDive = (py: number) => {
      const yr = YD[py]; if (!yr) return;
      const paras = (t: string) => (t || '').split('\n\n').map(p => `<p class="cp">${p.trim()}</p>`).join('');
      document.getElementById('year-dive-container')!.innerHTML = `
        <div class="year-deep-dive">
          <div class="year-dive-header">
            <div class="year-num-big" style="color:var(--cf-gold)">${py}</div>
            <div class="year-dive-title">${yr.title}</div>
            <div class="year-dive-sub">${yr.phase}</div>
          </div>
          <div class="tab-nav grid grid-cols-3 md:grid-cols-6 gap-1 p-2">
            <button class="tab-btn active" onclick="window.swT('ov',this)">Overview</button>
            <button class="tab-btn" onclick="window.swT('py',this)">Pythagorean</button>
            <button class="tab-btn" onclick="window.swT('ve',this)">Vedic</button>
            <button class="tab-btn" onclick="window.swT('ch',this)">Chinese</button>
            <button class="tab-btn" onclick="window.swT('ca',this)">Chaldean</button>
            <button class="tab-btn" onclick="window.swT('pr',this)">Practices</button>
          </div>
          <div class="tab-content p-4">
            <div class="tab-panel active" id="tp-ov"><div id="tp-ov-text">${paras(yr.overview)}</div><button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-ov-text').textContent)">🔊 Read Aloud</button></div>
            <div class="tab-panel" id="tp-py"><h4 class="content-h">Challenges, Shadows & Spiritual Curriculum</h4><div id="tp-py-text">${paras(yr.pyth)}</div><button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-py-text').textContent)">🔊 Read Aloud</button></div>
            <div class="tab-panel" id="tp-ve"><div id="tp-ve-text">${paras(yr.vedic)}</div><button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-ve-text').textContent)">🔊 Read Aloud</button></div>
            <div class="tab-panel" id="tp-ch"><div id="tp-ch-text">${paras(yr.chinese)}</div><button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-ch-text').textContent)">🔊 Read Aloud</button></div>
            <div class="tab-panel" id="tp-ca"><div id="tp-ca-text">${paras(yr.chald)}</div><button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('tp-ca-text').textContent)">🔊 Read Aloud</button></div>
            <div class="tab-panel" id="tp-pr"><div class="practice-grid">${yr.pr.map((p: any) => `<div class="pi"><div class="pi-icon">${p.i}</div><div class="pi-name">${p.n}</div><div class="pi-desc">${p.d}</div></div>`).join('')}</div></div>
          </div>
        </div>`;
    };

    const renderIntersections = (birthSign: string, m: number, d: number, ry: number, by: number) => {
      const intersections = [];
      const ba = ZOO[birthSign];
      for (let y = ry; y <= ry + 25; y++) {
        const py = reduce(m + d + y);
        if (py === 4 || py === 7) {
          const ya = getAnimalFromYear(y);
          const cat = getCategory(birthSign, ya.n);
          const uy = reduce(y);
          const uyName = YD[uy]?.title;
          
          let specificDyn = '';
          if (cat === 'harm') specificDyn = ba.harmDesc;
          else if (cat === 'clash') specificDyn = ba.clashDesc;
          else if (cat === 'destruction') specificDyn = ba.destDesc;
          else if (cat === 'ben-ming') specificDyn = ba.benDesc;
          else specificDyn = `Personal Year ${py}'s discipline proceeds in a ${ya.n} Neutral year — neither amplified by alliance support nor undermined by conflict energy. This allows the structural work to proceed primarily through your own effort and discernment.`;

          intersections.push(`
            <div class="intersection-card p-6 bg-slate-900/60 border border-white/10 rounded-2xl mb-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <div class="text-4xl font-serif font-bold text-white">${y}</div>
                  <div class="text-xs uppercase tracking-widest text-primary font-bold">Personal Year ${py} · ${YD[py].title} · ${ya.n} Year ${ya.e}</div>
                </div>
                <div class="text-[10px] font-black uppercase px-3 py-1 rounded bg-black/40" style="color:${catColor(cat)}">${cat === 'neutral' ? 'Neutral Year ◦' : catLabel(cat) + ' + Critical Year'}</div>
              </div>
              <div class="text-xs text-muted-foreground mb-4">Universal Year ${uy} — ${uyName}  |  Chinese: ${catLabel(cat)}</div>
              <div class="cp text-sm leading-relaxed mb-4" id="int-text-${y}">
                ${py === 4 ? "Personal Year 4's systematic foundation-building meets the environment's current frequency: " : "Personal Year 7's introspection and refinement meets the environment's current frequency: "}
                ${cat === 'harm' ? "while Rahu drives you to build, the Harm year's hidden adversary dynamics are quietly undermining what you build. Specific risk: trusted colleagues with hidden agendas at precisely the moment you are most invested in collaboration." : ""}
                ${cat === 'clash' ? "maximum elemental friction calling for proactive adaptation. If you resist the forced changes of this year, you create long-term structural debt." : ""}
                ${cat === 'neutral' ? "neither supported nor obstructed by environmental forces. Success is a pure reflection of your genuine effort and developmental state." : ""}
                <br/><br/>
                <strong>Specific dynamics:</strong> ${specificDyn}
              </div>
              <button class="tts-btn" onclick="window.ttsPlay(this, document.getElementById('int-text-${y}').textContent)">🔊 Read Aloud</button>
            </div>`);
        }
      }
      document.getElementById('personal-intersections-container')!.innerHTML = `
        <div class="section-header">🔥 &nbsp; Your Personal Critical Year Intersections &nbsp; 🔥</div>
        <p class="text-xs text-muted-foreground text-center mb-8 px-4">These are the specific years — calculated from your exact birth date — when Personal Years 4 and 7 intersect with your Chinese zodiac cycle. Each intersection has a unique character determined by the Tai Sui energy of that year.</p>
        <div class="px-2">${intersections.join('')}</div>`;
    };

    const renderZodiac = (birthSign: string, by: number) => {
      const startYear = new Date().getFullYear();
      let html = '<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 px-2">';
      for (let y = startYear; y <= startYear + 11; y++) {
        const ya = getAnimalFromYear(y);
        const cat = getCategory(birthSign, ya.n);
        const py = reduce(birthMonth + birthDay + y);
        html += `<div class="zc p-3 border border-white/5 rounded-xl bg-slate-900/60 cursor-pointer hover:border-primary/40 transition-all text-center" 
             onclick="window.openZodiacPop('${ya.n}','${birthSign}','${y}','${y-by}','${cat}')">
          <div class="text-2xl mb-1">${ya.e}</div>
          <div class="text-[10px] font-bold text-white">${y}</div>
          <div class="text-[9px] text-primary">PY ${py}</div>
          <div class="text-[8px] uppercase font-black" style="color:${catColor(cat)}">${catLabel(cat).split(' ')[0]}</div>
        </div>`;
      }
      document.getElementById('zodiac-container')!.innerHTML = `<div class="section-header">☯ &nbsp; Zodiac Trajectory &nbsp; ☯</div>` + html + '</div>';
    };

    const renderPinnacles = (p1: number, p2: number, p3: number, p4: number, c1: number, c2: number, c3: number, c4: number, p1end: number, p2end: number, p3end: number, currentAge: number) => {
      const stages = [
        { n: 1, p: p1, c: c1, label: `Birth - Age ${p1end}`, active: currentAge <= p1end },
        { n: 2, p: p2, c: c2, label: `Age ${p1end+1} - ${p2end}`, active: currentAge > p1end && currentAge <= p2end },
        { n: 3, p: p3, c: c3, label: `Age ${p2end+1} - ${p3end}`, active: currentAge > p2end && currentAge <= p3end },
        { n: 4, p: p4, c: c4, label: `Age ${p3end+1}+`, active: currentAge > p3end }
      ];
      const cards = stages.map(s => `
        <div class="p-6 mb-4 border rounded-3xl ${s.active ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/5 bg-slate-900/40'}">
          <div class="flex justify-between items-center mb-6">
            <div class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">${s.label}</div>
            ${s.active ? `<span class="bg-primary text-[8px] px-2 py-0.5 rounded text-white font-bold">ACTIVE STAGE</span>` : ''}
          </div>
          <div class="flex gap-10 mb-6 justify-center">
            <div class="text-center">
              <div class="text-5xl font-serif font-bold text-emerald-400">${s.p}</div>
              <div class="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Pinnacle</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-serif font-bold text-rose-400">${s.c}</div>
              <div class="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Challenge</div>
            </div>
          </div>
          <div class="space-y-4">
            <p class="text-sm leading-relaxed text-slate-300">${PINNACLE_DESC[s.p]}</p>
            <p class="text-xs leading-relaxed text-rose-300/90 italic font-medium">Challenge ${s.c}: ${CHALLENGE_DESC[s.c]}</p>
          </div>
        </div>`).join('');
      document.getElementById('pinnacles-container')!.innerHTML = `<div class="section-header">◈ &nbsp; Pinnacles & Challenges &nbsp; ◈</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">${cards}</div>`;
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

    (window as any).openZodiacPop = (animalName: string, birthSign: string, year: string, age: string, cat: string) => {
      const ba = ZOO[birthSign]; const ya = ZOO[animalName]; if (!ba || !ya) return;
      let specificDesc = '';
      if(cat === 'ben-ming') specificDesc = ba.benDesc; 
      else if(cat === 'clash') specificDesc = ba.clashDesc; 
      else if(cat === 'harm') specificDesc = ba.harmDesc; 
      else if(cat === 'destruction') specificDesc = ba.destDesc; 
      else if(cat === 'alliance') specificDesc = ba.allianceDesc;
      else specificDesc = `This ${year} ${animalName} year is a Neutral period for ${birthSign}. No special Tai Sui relationship creates extraordinary support or challenge. Individual effort determines outcomes.`;
      
      document.getElementById('pb')!.innerHTML = `
        <div class="ibox mb-6"><strong>${year} (${animalName} Year, Age ${age})</strong> — Tai Sui: <span style="color:${catColor(cat)}">${catLabel(cat)}</span></div> 
        <div class="content-h mb-3 uppercase tracking-widest text-xs opacity-60">Your ${birthSign} Synthesis</div> 
        ${specificDesc.split('\n\n').map(p=>`<p class="cp mb-4 text-sm leading-relaxed">${p}</p>`).join('')} 
        <div class="content-h mt-8 mb-3 uppercase tracking-widest text-xs opacity-60">${animalName} Year Qualities</div> 
        <p class="cp text-sm">${ya.trait}. Health focus: ${ya.organ}. Direction: ${ya.dir}.</p>`;
      
      document.getElementById('pg')!.textContent = ya.e;
      document.getElementById('ph')!.textContent = `${year}: ${animalName} Year`;
      document.getElementById('ps')!.textContent = `${birthSign} × ${animalName} — ${catLabel(cat)}`;
      document.getElementById('overlay')!.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    (window as any).buildConvergence = () => {
      let html = '';
      CONVERGENCE_CARDS.forEach(c => {
        html += `
          <div class="conv-card mb-8 border border-primary/20 rounded-3xl overflow-hidden bg-slate-900/60"> 
            <div class="conv-header p-6 bg-primary/10 border-b border-primary/20"> 
              <div class="conv-title text-2xl font-bold text-primary">${c.title}</div> 
              <div class="conv-sub text-sm italic text-muted-foreground">${c.sub}</div> 
            </div> 
            <div class="conv-body p-6" id="conv-body-${c.year}"> 
              <p class="cp mb-6 text-sm leading-relaxed">${c.intro}</p> 
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                ${c.chips.map(ch => `<div class="enemy-chip p-4 bg-black/40 rounded-xl border border-white/5"><div class="enemy-chip-title font-bold text-primary text-xs mb-2">${ch.t}</div><p class="text-xs leading-relaxed text-slate-300">${ch.p}</p></div>`).join('')}
              </div> 
              <div class="wbox p-4 bg-rose-900/20 border-l-4 border-rose-500 rounded-r-xl text-sm italic text-rose-200">${c.warning}</div> 
              <button class="tts-btn mt-6" onclick="window.ttsPlay(this, document.getElementById('conv-body-${c.year}').textContent)">🔊 Read Aloud</button> 
            </div> 
          </div>`;
      });
      document.getElementById('convergence-cards')!.innerHTML = html;
    };

    if (!initialized.current) {
      (window as any).buildConvergence();
      (window as any).calculate();
      initialized.current = true;
    }
  }, [birthDay, birthMonth, birthYear]);

  return (
    <div className="cosmic-fate-root relative min-h-screen rounded-3xl overflow-hidden bg-black/40">
      <div id="stars-cf"></div>
      <div className="cf-page relative z-10 p-2 md:p-6 max-w-5xl mx-auto">
        <div className="cf-hero text-center py-12">
          <span className="hero-glyph text-6xl mb-6 block">🌌</span>
          <h1 className="text-4xl font-bold text-primary tracking-widest uppercase mb-3">Cosmic Fate Map</h1>
          <p className="hero-sub text-xs tracking-[0.4em] uppercase opacity-60">Destiny Synthesis & Critical Year Oracle</p>
        </div>

        <div className="calc-card bg-slate-900/80 border border-primary/20 p-6 rounded-3xl mb-8">
          <div className="calc-title text-xs tracking-[0.3em] uppercase text-center opacity-60 mb-6 font-bold">✦ Forecast Your Destiny ✦</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="input-group">
              <label className="text-[10px] uppercase tracking-widest opacity-60 mb-2 font-black">Year to Forecast</label>
              <input type="number" id="cf-readYear" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-center font-bold text-lg" defaultValue={new Date().getFullYear()} min={1900} max={2100} />
            </div>
            <button className="btn-reveal bg-primary px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20" onClick={() => (window as any).calculate()}>✦ Cast Fate Map</button>
          </div>
        </div>

        <div id="result-area" className="result-hidden">
          <div className="core-strip grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" id="core-strip"></div>
          <div className="alert-banner p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-8 text-center text-sm font-medium" id="alert-banner"></div>

          <nav className="dash-nav grid grid-cols-3 gap-1 mb-1" id="dash-nav">
            <button className="dash-tab active p-4 text-[10px] font-black uppercase tracking-widest rounded-t-2xl bg-slate-900/80 border-x border-t border-white/10" data-panel="synthesis" onClick={(e) => (window as any).switchDash(e.currentTarget)}>✦ Oracle</button>
            <button className="dash-tab p-4 text-[10px] font-black uppercase tracking-widest rounded-t-2xl bg-slate-900/80 border-x border-t border-white/10" data-panel="yeardive" onClick={(e) => (window as any).switchDash(e.currentTarget)}>☽ Dive</button>
            <button className="dash-tab p-4 text-[10px] font-black uppercase tracking-widest rounded-t-2xl bg-slate-900/80 border-x border-t border-white/10" data-panel="intersections" onClick={(e) => (window as any).switchDash(e.currentTarget)}>🔥 Critical</button>
            <button className="dash-tab p-4 text-[10px] font-black uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="zodiac" onClick={(e) => (window as any).switchDash(e.currentTarget)}>☯ Zodiac</button>
            <button className="dash-tab p-4 text-[10px] font-black uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="pinnacles" onClick={(e) => (window as any).switchDash(e.currentTarget)}>◈ Pinnacles</button>
            <button className="dash-tab p-4 text-[10px] font-black uppercase tracking-widest bg-slate-900/80 border-x border-t border-white/10" data-panel="convergence" onClick={(e) => (window as any).switchDash(e.currentTarget)}>⚠ Enemy</button>
          </nav>

          <div className="dash-body bg-slate-900/80 border border-white/10 rounded-b-3xl min-h-[600px] p-2 md:p-6 mb-12">
            <div className="dash-panel active" id="panel-synthesis"><div id="synthesis-container" className="px-2"></div></div>
            <div className="dash-panel" id="panel-yeardive"><div id="year-dive-container"></div></div>
            <div className="dash-panel" id="panel-intersections"><div id="personal-intersections-container"></div></div>
            <div className="dash-panel" id="panel-zodiac"><div id="zodiac-container"></div></div>
            <div className="dash-panel" id="panel-pinnacles"><div id="pinnacles-container"></div></div>
            <div className="dash-panel" id="panel-convergence"><div id="convergence-cards-inner"><div id="convergence-cards"></div></div></div>
          </div>
        </div>
      </div>

      <div className="cf-overlay fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity" id="overlay" onClick={(e) => (e.target === e.currentTarget) && (window as any).closePop()}>
        <div className="popover-cf bg-slate-900 border border-primary/40 rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
          <button className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors" onClick={() => (window as any).closePop()}>✕</button>
          <span className="text-6xl mb-4 block text-center" id="pg"></span>
          <div className="text-3xl font-bold text-primary text-center mb-2" id="ph"></div>
          <div className="text-xs uppercase tracking-[0.3em] text-center opacity-60 mb-8" id="ps"></div>
          <div id="pb" className="text-sm leading-relaxed"></div>
        </div>
      </div>
    </div>
  );
}
