# PDF Findings: Pinnacles & Challenges

## Calculation Logic (Mystique Compass)

### 1. Reduction Rules
- Reduce to single digit (1-9) OR Master Number (11, 22, 33).
- Challenge numbers are ALWAYS reduced to single digits (0-9).
- Formula for reduction: Sum digits until <= 9, but stop at 11, 22, 33 if `allowMaster` is true.

### 2. Base Components
- `m = reduce(month, true)`
- `d = reduce(day, true)`
- `y = reduce(year, true)`

### 3. Pinnacle Calculations (Addition)
- `p1 = reduce(m + d, true)`
- `p2 = reduce(d + y, true)`
- `p3 = reduce(p1 + p2, true)`
- `p4 = reduce(m + y, true)`

### 4. Challenge Calculations (Subtraction)
- `c1 = reduce(Math.abs(m - d), false)`
- `c2 = reduce(Math.abs(d - y), false)`
- `c3 = reduce(Math.abs(c1 - c2), false)`
- `c4 = reduce(Math.abs(m - y), false)`

### 5. Timing (Age Ranges)
- `lp = reduce(lifePath, false)` (Timing uses single digit LP)
- `endFirstPinnacle = 36 - lp`
- **First:** 0 to `endFirstPinnacle`
- **Second:** `endFirstPinnacle + 1` to `endFirstPinnacle + 9`
- **Third:** `endFirstPinnacle + 10` to `endFirstPinnacle + 18`
- **Fourth:** `endFirstPinnacle + 19`+

## Discrepancies with Current Code
- **Reduction:** Current code reduces year digits first, then reduces the sum. PDF reduces the year as a whole (with Master Number support).
- **Challenges:** Current code uses `reduceNum` which might not handle 0 correctly or might preserve Master Numbers for challenges (PDF says challenges are always 0-9).
- **Timing:** Current code uses `firstEnd` for both start and end of ranges (e.g., `firstEnd` to `firstEnd + 9`). PDF uses `+1` for the start of the next range (e.g., `endFirstPinnacle + 1`).

## Meaning Layers
The PDF contains detailed sections for each number:
- **Core Reality**
- **The Defect and The Traps**
- **The Impact of Timing**
- **The Silver Lining**
- **The Ultimate Verdict**
