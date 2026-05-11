import re

path = '/home/ubuntu/project_analysis/src/components/profile-generator/numerology-display.tsx'
with open(path, 'r') as f:
    content = f.read()

# Update reduceNum to handle Master Numbers correctly and 0
new_reduce_num = """function reduceNum(n: number, allowMaster: boolean = true): number {
  if (n === 0) return 0;
  let val = Math.abs(n);
  while (val > 9) {
    if (allowMaster && (val === 11 || val === 22 || val === 33)) return val;
    val = String(val).split('').reduce((a, d) => a + +d, 0);
  }
  return val || 9;
}"""

content = re.sub(r'function reduceNum\(n: number\): number \{.*?\}', new_reduce_num, content, flags=re.DOTALL)

# Update calcPinnacles to use the new logic
new_calc_pinnacles = """function calcPinnacles(lp: number, d: number, m: number, y: number) {
  // Step 1: Reduce the three components of the birth date
  const redM = reduceNum(m, true);
  const redD = reduceNum(d, true);
  const redY = reduceNum(y, true);

  // PINNACLE CALCULATIONS
  const p1 = reduceNum(redM + redD, true);
  const p2 = reduceNum(redD + redY, true);
  const p3 = reduceNum(p1 + p2, true);
  const p4 = reduceNum(redM + redY, true);

  // CHALLENGE CALCULATIONS
  const c1 = reduceNum(Math.abs(redM - redD), false);
  const c2 = reduceNum(Math.abs(redD - redY), false);
  const c3 = reduceNum(Math.abs(c1 - c2), false);
  const c4 = reduceNum(Math.abs(redM - redY), false);

  // TIMING
  const reducedLP = reduceNum(lp, false);
  const firstEnd = 36 - reducedLP;
  const age = new Date().getFullYear() - y;

  return [
    { stage: 1, label: 'First Pinnacle',  ages: `0 – ${firstEnd}`,              p: p1, c: c1, active: age <= firstEnd },
    { stage: 2, label: 'Second Pinnacle', ages: `${firstEnd + 1} – ${firstEnd + 9}`,   p: p2, c: c2, active: age > firstEnd && age <= firstEnd + 9 },
    { stage: 3, label: 'Third Pinnacle',  ages: `${firstEnd + 10} – ${firstEnd + 18}`, p: p3, c: c3, active: age > firstEnd + 9 && age <= firstEnd + 18 },
    { stage: 4, label: 'Fourth Pinnacle', ages: `${firstEnd + 19}+`,               p: p4, c: c4, active: age > firstEnd + 18 },
  ];
}"""

content = re.sub(r'function calcPinnacles\(lp: number, d: number, m: number, y: number\) \{.*?\}', new_calc_pinnacles, content, flags=re.DOTALL)

# Also update personalYearNow to use the new reduceNum signature
content = content.replace('reduceNum(reduceNum(d) + reduceNum(m) + reduceNum(String(yr).split(\'\').reduce((a,c)=>a+ +c,0)))', 
                          'reduceNum(reduceNum(d, true) + reduceNum(m, true) + reduceNum(String(yr).split(\'\').reduce((a,c)=>a+ +c,0), true), true)')

with open(path, 'w') as f:
    f.write(content)
