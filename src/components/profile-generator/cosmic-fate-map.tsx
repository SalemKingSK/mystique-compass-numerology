/**
 * @fileOverview Complete restoration of Cosmic Fate Map with high-depth narratives and verbatim synthesis logic.
 * Synchronized Zodiac Trajectory with the selected search year and 2-column visual mirror layout.
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { YD } from '@/lib/cosmic-fate/oracle';
import { CONVERGENCE_CARDS } from '@/lib/cosmic-fate/convergence';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { INTERSECTION_SYNTHESIS } from '@/lib/cosmic-fate/intersections';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

const reduce = (n: number): number => {
  let s = Math.abs(n);
  while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
  return s || 9;
};

const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

const getAnimalFromYear = (y: number) => { 
  const index = ((y - 1900) % 12 + 12) % 12;
  const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  return ZOO[signs[index]];
};

const getCategory = (birthSign: string, yearSign: string) => {
  if (birthSign === yearSign) return 'ben';
  
  const clashes: Record<string, string> = { Rat: 'Horse', Horse: 'Rat', Ox: 'Goat', Goat: 'Ox', Tiger: 'Monkey', Monkey: 'Tiger', Rabbit: 'Rooster', Rooster: 'Rabbit', Dragon: 'Dog', Dog: 'Dragon', Snake: 'Pig', Pig: 'Snake' };
  if (clashes[birthSign] === yearSign) return 'clash';

  const harms: Record<string, string> = { Rat: 'Goat', Goat: 'Rat', Ox: 'Horse', Horse: 'Ox', Tiger: 'Snake', Snake: 'Tiger', Rabbit: 'Dragon', Dragon: 'Rabbit', Monkey: 'Pig', Pig: 'Monkey', Rooster: 'Dog', Dog: 'Rooster' };
  if (harms[birthSign] === yearSign) return 'harm';

  const dests: Record<string, string[]> = { 
    Rat: ['Rabbit'], Rabbit: ['Rat'],
    Ox: ['Dragon'], Dragon: ['Ox'],
    Tiger: ['Pig'], Pig: ['Tiger'],
    Snake: ['Monkey'], Monkey: ['Snake'],
    Horse: ['Rooster'], Rooster: ['Horse'],
    Goat: ['Dog'], Dog: ['Goat']
  };
  if (dests[birthSign]?.includes(yearSign)) return 'destruction';

  const liuHe: Record<string, string> = { Rat: 'Ox', Ox: 'Rat', Tiger: 'Pig', Pig: 'Tiger', Rabbit: 'Dog', Dog: 'Rabbit', Dragon: 'Rooster', Rooster: 'Dragon', Snake: 'Monkey', Monkey: 'Snake', Horse: 'Goat', Goat: 'Horse' };
  if (liuHe[birthSign] === yearSign) return 'alliance';

  const sanHe = [['Rat', 'Dragon', 'Monkey'], ['Snake', 'Rooster', 'Ox'], ['Tiger', 'Horse', 'Dog'], ['Rabbit', 'Goat', 'Pig']];
  if (sanHe.some(triad => triad.includes(birthSign) && triad.includes(yearSign))) return 'alliance';

  return 'neutral';
};

const catLabel = (c: string) => ({ 
  'ben': 'BEN MING NIAN', 'clash': 'DIRECT CLASH', 'harm': 'HARM YEAR', 
  'destruction': 'DESTRUCTION YEAR', 'alliance': 'ALLIANCE', 'neutral': 'NEUTRAL' 
}[c] || 'NEUTRAL');

const getStatusLabelShort = (c: string) => ({ 
  'ben': 'BEN', 'clash': 'DIRECT', 'harm': 'HARM', 
  'destruction': 'DESTRUCTION', 'alliance': 'ALLIANCE', 'neutral': 'NEUTRAL' 
}[c] || 'NEUTRAL');

export function CosmicFateMap({ birthDay, birthMonth, birthYear }: Props) {
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
      const pmNames = ['', 'Initiation', 'Partnership', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Retreat', 'Power', 'Completion'];

      const p1 = reduce(reduce(m) + reduce(d));
      const p2 = reduce(reduce(d) + reduce(by));
      const p3 = reduce(p1 + p2);
      const p4 = reduce(reduce(m) + reduce(by));
      const p1end = 36 - lp;
      const p2end = p1end + 9;
      const p3end = p2end + 9;
      const age = ry - by;
      
      let pNum, pStage;
      if (age <= p1end) { pStage = 1; pNum = p1; }
      else if (age <= p2end) { pStage = 2; pNum = p2; }
      else if (age <= p3end) { pStage = 3; pNum = p3; }
      else { pStage = 4; pNum = p4; }

      const c1 = Math.abs(reduce(m) - reduce(d));
      const c2 = Math.abs(reduce(d) - reduce(by));
      const c3 = Math.abs(c1 - c2);
      const c4 = Math.abs(reduce(m) - reduce(by));
      let cNum;
      if (age <= p1end) cNum = c1;
      else if (age <= p2end) cNum = c2;
      else if (age <= p3end) cNum = c3;
      else cNum = c4;

      const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
      const birthSign = signs[((by - 1900) % 12 + 12) % 12];
      const ya = getAnimalFromYear(ry);
      const cat = getCategory(birthSign, ya.n);

      // Core Chips
      document.getElementById('core-strip')!.innerHTML = `
        <div class="core-chip hl-py"> <div class="core-chip-label">Personal Year ${ry}</div> <div class="core-chip-num">${py}</div> <div class="core-chip-name">${YD[py]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Life Path</div> <div class="core-chip-num" style="color:var(--cf-jade-bright)">${lp}</div> <div class="core-chip-name">${lpName(lp)}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Universal Year</div> <div class="core-chip-num" style="color:var(--cf-amethyst)">${uy}</div> <div class="core-chip-name">${YD[uy]?.title}</div> </div> 
        <div class="core-chip"> <div class="core-chip-label">Birth Vibration</div> <div class="core-chip-num" style="color:#de78a0">${bv}</div> <div class="core-chip-name">${lpName(bv)}</div> </div>`;

      // Alert Banner
      const ab = document.getElementById('alert-banner')!;
      let alertText = '';
      if (py === uy) alertText = `<strong>⚡ Double Amplification:</strong> Personal Year ${py} aligns with Universal Year ${uy}. This creates a high-voltage energetic resonance where your personal mission and the collective momentum of the planet are vibrating on the same frequency. Decisions made now have double the impact, as you are swimming with the current of the world's current evolutionary requirements.`;
      else if (py === bv) alertText = `<strong>✦ Core Identity Activation:</strong> Personal Year ${py} matches your Birth Vibration ${bv} — your deepest nature and current developmental phase in perfect alignment. Unusual clarity about who you are and where you're heading. It is as if the universe is reflecting your core essence back to you, allowing for an effortless expression of your authentic self.`;
      else if (py === lp) alertText = `<strong>✦ Life Path Activation:</strong> Personal Year ${py} matches your Life Path ${lp} — a year of destiny alignment. The immediate tasks of this year are in direct service to your overall life mission. The resistance you usually encounter when trying to merge your daily reality with your soul's purpose dissolves, creating a streamlined path toward meaningful achievement and legacy building.`;
      
      if (alertText) { 
        ab.innerHTML = `<button class="tts-btn mb-2" onclick="window.ttsPlay(this, 'alert-text')">🔊 Read Aloud</button><div id="alert-text">${alertText}</div>`; 
        ab.classList.add('visible'); 
      } else { 
        ab.classList.remove('visible'); 
      }

      // Verbatim Synthesis Construction
      const yr = YD[py];
      const lpRelationText = (py === lp) ? "exceptional harmony" : (Math.abs(py - lp) === 4 || Math.abs(py - lp) === 5) ? "notable friction" : "productive dialogue — neither in obvious tension nor exceptional harmony";
      const lpInteractionText = (py === lp) ? "match" : (Math.abs(py - lp) === 4 || Math.abs(py - lp) === 5) ? "creates notable friction with" : "and";
      
      const synthText = `In ${ry}, you are in a <strong>Personal Year ${py} — ${yr?.title}</strong>, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${uy} (${YD[uy]?.title}) sets the collective backdrop — the shared frequency every person on earth is navigating alongside their personal arc. Your current Personal Month is ${pm} (${pmNames[pm]}), offering a finer-grained window into this season's immediate texture. Your ${birthSign} nature meets a ${ya.n} year (${catLabel(cat)}) — a ${cat === 'neutral' ? 'neutral year where outcomes reflect pure personal effort rather than exceptional external forces' : catLabel(cat).toLowerCase() + ' where trajectories are specifically influenced by Tai Sui energy'}. Your Life Path ${lp} (${lpName(lp)}) ${lpInteractionText} Personal Year ${py} (${yr?.title}) are in ${lpRelationText} — allowing this year's work to proceed through genuine effort. Your active Pinnacle is ${pNum} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${cNum} (${lpName(cNum)}) names the specific resistance pattern this life chapter asks you to develop through. Taken together, these layers describe not one story but several simultaneous ones: the year's momentum, the month's focus, the decade's theme, and the lifetime's direction — all converging in ${ry}.`;
      
      document.getElementById('synthesis-container')!.innerHTML = `
        <div class="section-header">✦ &nbsp; Your ${ry} Reading — Oracle Synthesis &nbsp; ✦</div>
        <button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'synthesis-text')">🔊 Read Aloud</button>
        <div id="synthesis-text" class="cp">${synthText}</div>`;

      // Year Dive
      const paras = (t: string) => (t || '').split('\n\n').map(p => `<p class="cp">${p.trim()}</p>`).join('');
      document.getElementById('year-dive-container')!.innerHTML = `
        <div class="year-deep-dive">
          <div class="year-dive-header">
            <div class="year-num-big" style="color:var(--cf-gold)">${py}</div>
            <div class="year-dive-title">${yr.title}</div>
            <div class="year-dive-sub">${yr.phase}</div>
          </div>
          <div class="tab-nav grid grid-cols-3 gap-1 p-2">
            <button class="tab-btn active" onclick="window.swT('ov',this)">Overview</button>
            <button class="tab-btn" onclick="window.swT('py',this)">Pythagorean</button>
            <button class="tab-btn" onclick="window.swT('ve',this)">Vedic</button>
            <button class="tab-btn" onclick="window.swT('ch',this)">Chinese</button>
            <button class="tab-btn" onclick="window.swT('ca',this)">Chaldean</button>
            <button class="tab-btn" onclick="window.swT('pr',this)">Practices</button>
          </div>
          <div class="tab-content p-2">
            <div class="tab-panel active" id="tp-ov"><button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'tp-ov-text')">🔊 Read Aloud</button><div id="tp-ov-text">${paras(yr.overview)}</div></div>
            <div class="tab-panel" id="tp-py"><button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'tp-py-text')">🔊 Read Aloud</button><h4 class="content-h">Challenges, Shadows & Spiritual Curriculum</h4><div id="tp-py-text">${paras(yr.pyth)}</div></div>
            <div class="tab-panel" id="tp-ve"><button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'tp-ve-text')">🔊 Read Aloud</button><div id="tp-ve-text">${paras(yr.vedic)}</div></div>
            <div class="tab-panel" id="tp-ch"><button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'tp-ch-text')">🔊 Read Aloud</button><div id="tp-ch-text">${paras(yr.chinese)}</div></div>
            <div class="tab-panel" id="tp-ca"><button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'tp-ca-text')">🔊 Read Aloud</button><div id="tp-ca-text">${paras(yr.chald)}</div></div>
            <div class="tab-panel" id="tp-pr"><div class="practice-grid">${yr.pr.map((p: any) => `<div class="pi"><div class="pi-icon">${p.i}</div><div class="pi-name">${p.n}</div><div class="pi-desc">${p.d}</div></div>`).join('')}</div></div>
          </div>
        </div>`;

      // Intersections
      const intersections = [];
      for (let y = ry; y <= ry + 30; y++) {
        const pyn = reduce(reduce(m) + reduce(d) + reduce(y));
        if (pyn === 4 || pyn === 7) {
          const ani = getAnimalFromYear(y);
          const iCat = getCategory(birthSign, ani.n);
          const uyn = reduce(y);
          const isNegative = iCat === 'clash' || iCat === 'harm' || iCat === 'destruction' || iCat === 'ben';
          
          let statusLabel = `◦ Critical Personal Year ${pyn} in ${ani.n} Year`;
          let statusColor = 'var(--cf-silver-dim)';
          if (isNegative) {
            statusLabel = `🟠 HIGH TENSION — ${catLabel(iCat).split(' ')[0]} Year + Critical Personal Year`;
            statusColor = 'var(--cf-amber)';
          }

          const synKey = `${pyn}_${iCat}`;
          const synth = INTERSECTION_SYNTHESIS[synKey] || INTERSECTION_SYNTHESIS[`${pyn}_neutral`].replace('Neutral', ani.n + ' Neutral');
          const dyn = ZOO[birthSign][`${iCat}Desc`] || ZOO[birthSign][`${iCat === 'destruction' ? 'destruction' : iCat}Desc`] || `Personal Year ${pyn}'s discipline proceeds in a ${ani.n} Neutral year — neither amplified by alliance support nor undermined by conflict energy.`;

          intersections.push(`
            <div class="intersection-card p-4">
              <div class="intersection-header">
                <div class="intersection-year">${y}</div>
                <div class="intersection-title">Personal Year ${pyn} · Year of ${pyn === 4 ? 'Foundation' : 'the Mystic'} · ${ani.n} Year ${ani.e}</div>
                <div class="text-[10px] font-black uppercase mt-1" style="color:${statusColor}">${statusLabel}</div>
              </div>
              <div class="intersection-body">
                <button class="tts-btn mb-4" onclick="window.ttsPlay(this, 'int-text-${y}')">🔊 Read Aloud</button>
                <div class="text-xs text-muted-foreground mb-3">Universal Year ${uyn} — ${YD[uyn].title}  |  Chinese: ${catLabel(iCat)}</div>
                <div class="cp text-sm leading-relaxed mb-4" id="int-text-${y}">${synth}<br/><br/><strong>Specific dynamics:</strong> ${dyn}</div>
              </div>
            </div>`);
        }
      }
      document.getElementById('personal-intersections-container')!.innerHTML = `
        <div class="section-header">🔥 &nbsp; Your Personal Critical Year Intersections &nbsp; 🔥</div>
        <p class="text-xs text-muted-foreground text-center mb-8 px-4">These are the specific years — calculated from your exact birth date — when Personal Years 4 and 7 intersect with your Chinese zodiac cycle.</p>
        <div class="px-2">${intersections.join('')}</div>`;

      // Zodiac Trajectory - 2 Column Mirror Grid
      let zHtml = '<div class="zodiac-grid grid grid-cols-2 gap-3 px-2">';
      for (let y = ry; y <= ry + 11; y++) {
        const ani = getAnimalFromYear(y);
        const zCat = getCategory(birthSign, ani.n);
        const pyn = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(y));
        
        let labelColor = 'var(--cf-text-dim)';
        if (pyn === 7 && zCat === 'clash') labelColor = '#b91c1c'; // Deep Red
        else if ((pyn === 1 || pyn === 9) && zCat === 'alliance') labelColor = '#065f46'; // Deep Green
        else if (zCat === 'alliance') labelColor = '#34d399'; // Emerald
        else if (zCat === 'harm') labelColor = '#fbbf24'; // Amber
        else if (zCat === 'ben') labelColor = '#c8a84b'; // Gold
        else if (zCat === 'destruction') labelColor = '#a78bfa'; // Purple
        else if (zCat === 'clash') labelColor = '#f87171'; // Red

        zHtml += `<div class="zc flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-center" onclick="window.openZodiacPop('${ani.n}','${birthSign}','${y}','${y-by}','${zCat}')">
          <div class="text-4xl mb-3">${ani.e}</div>
          <div class="text-[13px] font-bold text-white mb-1">${y}</div>
          <div class="text-[11px] text-primary mb-1">PY ${pyn}</div>
          <div class="text-[10px] font-black uppercase tracking-tighter" style="color:${labelColor}">${getStatusLabelShort(zCat)}</div>
        </div>`;
      }
      document.getElementById('zodiac-container')!.innerHTML = `
        <div class="section-header">☯ &nbsp; ZODIAC TRAJECTORY &nbsp; ☯</div>` + zHtml + '</div>';

      // Pinnacles
      const pStages = [
        { n: 1, p: p1, c: c1, label: `Birth - Age ${p1end}`, active: age <= p1end },
        { n: 2, p: p2, c: c2, label: `Age ${p1end+1} - ${p2end}`, active: age > p1end && age <= p2end },
        { n: 3, p: p3, c: c3, label: `Age ${p2end+1} - ${p3end}`, active: age > p2end && age <= p3end },
        { n: 4, p: p4, c: c4, label: `Age ${p3end+1}+`, active: age > p3end }
      ];
      const pCards = pStages.map(s => `
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
      document.getElementById('pinnacles-container')!.innerHTML = `
        <div class="section-header">◈ &nbsp; Pinnacles & Challenges &nbsp; ◈</div>
        <button class="tts-btn mb-4 w-full" onclick="window.ttsPlay(this, 'pinnacles-list')">🔊 Read Aloud Stages</button>
        <div id="pinnacles-list" class="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">${pCards}</div>`;

      // Convergence
      let cHtml = '';
      CONVERGENCE_CARDS.forEach(c => {
        cHtml += `
          <div class="conv-card mb-8"> 
            <div class="conv-header p-6 bg-primary/10 border-b border-primary/20"> 
              <div class="conv-title text-2xl font-bold text-primary">${c.title}</div> 
              <div class="conv-sub text-sm italic text-muted-foreground">${c.sub}</div> 
            </div> 
            <div class="conv-body p-6"> 
              <button class="tts-btn mb-6" onclick="window.ttsPlay(this, 'conv-text-${c.year}')">🔊 Read Aloud</button> 
              <div id="conv-text-${c.year}">
                <p class="cp mb-6 text-sm leading-relaxed">${c.intro}</p> 
                <div class="enemy-grid">
                  ${c.chips.map(ch => `<div class="enemy-chip"><div class="enemy-chip-title font-bold text-primary text-xs mb-2">${ch.t}</div><p class="text-xs leading-relaxed text-slate-300">${ch.p}</p></div>`).join('')}
                </div> 
                <div class="wbox p-4 rounded-r-xl text-sm italic">${c.warning}</div> 
              </div>
            </div> 
          </div>`;
      });
      document.getElementById('convergence-cards')!.innerHTML = cHtml;

      document.getElementById('result-area')!.classList.remove('result-hidden');
    };

    (window as any).ttsPlay = (btnEl: HTMLElement, containerId: string) => {
      if (!window.speechSynthesis) return;
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      
      const container = document.getElementById(containerId);
      if (!container) return;

      if (!container.querySelector('.tts-s')) {
        const text = container.innerHTML;
        const sentences = text.match(/[^.!?\n]+[.!?\n]*/g);
        if (sentences) {
          container.innerHTML = sentences.map((s, i) => `<span class="tts-s" data-idx="${i}">${s}</span>`).join('');
        } else {
          container.innerHTML = `<span class="tts-s" data-idx="0">${text}</span>`;
        }
      }

      const spans = container.querySelectorAll('.tts-s');
      let currentIdx = 0;

      const speak = () => {
        if (currentIdx >= spans.length) {
          btnEl.classList.remove('playing');
          spans.forEach(s => s.classList.remove('reading'));
          return;
        }

        spans.forEach(s => s.classList.remove('reading'));
        const span = spans[currentIdx] as HTMLElement;
        span.classList.add('reading');
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const utterance = new SpeechSynthesisUtterance(span.textContent || '');
        utterance.rate = 0.9;
        utterance.onstart = () => btnEl.classList.add('playing');
        utterance.onend = () => {
          currentIdx++;
          speak();
        };
        utterance.onerror = () => {
          btnEl.classList.remove('playing');
          spans.forEach(s => s.classList.remove('reading'));
        };
        window.speechSynthesis.speak(utterance);
      };

      speak();
    };

    (window as any).closePop = () => {
      document.getElementById('overlay')!.classList.remove('visible');
      document.body.style.overflow = '';
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    };

    (window as any).swT = (name: string, btn: HTMLElement) => {
      const parent = btn.closest('.year-deep-dive');
      if (!parent) return;
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelector(`#tp-${name}`)?.classList.add('active');
      btn.classList.add('active');
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    };

    (window as any).switchDash = (btn: HTMLElement) => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panelId = 'panel-' + (btn as any).dataset.panel;
      document.getElementById(panelId)?.classList.add('active');
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    };

    (window as any).openZodiacPop = (aniName: string, birthSign: string, year: string, age: string, cat: string) => {
      const ba = ZOO[birthSign]; const ya = ZOO[aniName]; if (!ba || !ya) return;
      const dyn = ba[`${cat}Desc`] || ba[`${cat === 'destruction' ? 'destruction' : cat}Desc`] || `This ${year} ${aniName} year is a Neutral period for ${birthSign}. No special Tai Sui relationship creates extraordinary support or challenge. Individual effort and existing momentum determine outcomes. This is an excellent year for foundation-building, skill development, and relationship refinement that will serve as a stable platform for the years that follow.`;
      
      const labelColor = (cat === 'clash') ? '#f87171' : (cat === 'alliance') ? '#34d399' : (cat === 'harm') ? '#fbbf24' : (cat === 'ben') ? '#c8a84b' : (cat === 'destruction') ? '#a78bfa' : 'var(--cf-silver-dim)';

      document.getElementById('pb')!.innerHTML = `
        <button class="tts-btn mb-6 w-full" onclick="window.ttsPlay(this, 'pb-content')">🔊 Read Aloud</button> 
        <div id="pb-content">
          <div class="ibox mb-6"><strong>${year} (${aniName} Year, Age ${age})</strong> — Tai Sui: <span style="color:${labelColor}">${catLabel(cat)}</span></div> 
          <div class="content-h mb-3 uppercase tracking-widest text-xs opacity-60">YOUR ${birthSign.toUpperCase()} IN ${aniName.toUpperCase()} YEAR</div> 
          ${dyn.split('\n\n').map(p=>`<p class="cp mb-4 text-sm leading-relaxed">${p}</p>`).join('')} 
          <div class="content-h mt-8 mb-3 uppercase tracking-widest text-xs opacity-60">${aniName.toUpperCase()} YEAR QUALITIES</div> 
          <p class="cp text-sm">${ya.trait}. Health focus: ${ya.organ}. Direction: ${ya.dir}.</p>
        </div>`;
      
      document.getElementById('pg')!.textContent = ya.e;
      document.getElementById('ph')!.textContent = `${year}: ${aniName} Year`;
      document.getElementById('ps')!.textContent = `${birthSign} × ${aniName} — ${catLabel(cat)}`;
      document.getElementById('overlay')!.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    if (!initialized.current) {
      (window as any).calculate();
      initialized.current = true;
    }
  }, [birthDay, birthMonth, birthYear]);

  return (
    <div className="cosmic-fate-root relative min-h-screen rounded-3xl overflow-hidden bg-black/40">
      <div id="stars-cf"></div>
      <div className="cf-page p-4">
        <div className="cf-hero">
          <span className="hero-glyph">🌌</span>
          <h1>Cosmic Fate Map</h1>
          <p className="hero-sub">Destiny Synthesis & Critical Year Oracle</p>
        </div>

        <div className="calc-card p-6">
          <div className="calc-title">✦ Forecast Your Destiny ✦</div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="input-group text-center">
              <label className="mb-2 block">Year to Read</label>
              <input type="number" id="cf-readYear" className="bg-black/40 border border-white/10 rounded-lg px-6 py-3 text-center font-bold text-2xl w-full max-w-[200px]" defaultValue={new Date().getFullYear()} min={1900} max={2100} onChange={() => (window as any).calculate()} />
            </div>
            <button className="btn-reveal w-full py-4 text-lg font-bold" onClick={() => (window as any).calculate()}>✦ Cast Fate Map</button>
          </div>
        </div>

        <div id="result-area" className="result-hidden">
          <div className="core-strip" id="core-strip"></div>
          <div className="alert-banner" id="alert-banner"></div>

          <nav className="dash-nav grid grid-cols-3 gap-1 mb-4" id="dash-nav">
            <button class="dash-tab active" data-panel="synthesis" onclick="window.switchDash(this)">✦ Oracle</button>
            <button class="dash-tab" data-panel="yeardive" onclick="window.switchDash(this)">☽ Dive</button>
            <button class="dash-tab" data-panel="intersections" onclick="window.switchDash(this)">🔥 Critical</button>
            <button class="dash-tab" data-panel="zodiac" onclick="window.switchDash(this)">☯ Zodiac</button>
            <button class="dash-tab" data-panel="pinnacles" onclick="window.switchDash(this)">◈ Pinnacles</button>
            <button class="dash-tab" data-panel="convergence" onclick="window.switchDash(this)">⚠ Enemy</button>
          </nav>

          <div className="dash-body p-4">
            <div className="dash-panel active" id="panel-synthesis"><div id="synthesis-container"></div></div>
            <div className="dash-panel" id="panel-yeardive"><div id="year-dive-container"></div></div>
            <div className="dash-panel" id="panel-intersections"><div id="personal-intersections-container"></div></div>
            <div className="dash-panel" id="panel-zodiac"><div id="zodiac-container"></div></div>
            <div className="dash-panel" id="panel-pinnacles"><div id="pinnacles-container"></div></div>
            <div className="dash-panel" id="panel-convergence"><div id="convergence-cards"></div></div>
          </div>
        </div>
      </div>

      <div className="cf-overlay" id="overlay" onClick={(e) => (e.target === e.currentTarget) && (window as any).closePop()}>
        <div className="popover-cf">
          <button className="absolute top-6 right-6 text-white/40 hover:text-white" onClick={() => (window as any).closePop()}>✕</button>
          <span className="text-6xl mb-4 block text-center" id="pg"></span>
          <div className="text-3xl font-bold text-primary text-center mb-2" id="ph"></div>
          <div className="text-xs uppercase tracking-[0.3em] text-center opacity-60 mb-8" id="ps"></div>
          <div id="pb" className="text-sm leading-relaxed"></div>
        </div>
      </div>
    </div>
  );
}
