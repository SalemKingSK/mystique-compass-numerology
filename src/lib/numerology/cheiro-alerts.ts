import { cheiroPsychicNumbers, CheiroPsychicData } from './cheiro-psychic-numbers';

export interface CheiroAlert {
  type: 'lucky_day' | 'strong_period' | 'lucky_date' | 'compatible_date';
  message: string;
  severity: 'info' | 'success' | 'warn';
}

/**
 * Parses Cheiro's strong periods into a more machine-readable format.
 * Example: "21st July to 28th August (House of the Sun)"
 */
function isDateInStrongPeriod(date: Date, periodStr: string): boolean {
  const months: Record<string, number> = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  // Regex to match "21st July to 28th August" or "19th February to March 20th-27th"
  const match = periodStr.match(/(\d+)(?:st|nd|rd|th)\s+([A-Za-z]+)\s+to\s+([A-Za-z]+)?\s*(\d+)(?:st|nd|rd|th)?/);
  if (!match) return false;

  const startDay = parseInt(match[1]);
  const startMonth = months[match[2]];
  const endMonthStr = match[3] || match[2]; // If second month is missing, use the first
  const endMonth = months[endMonthStr];
  const endDay = parseInt(match[4]);

  const currentMonth = date.getMonth();
  const currentDay = date.getDate();

  if (startMonth <= endMonth) {
    // Period within the same year
    if (currentMonth < startMonth || currentMonth > endMonth) return false;
    if (currentMonth === startMonth && currentDay < startDay) return false;
    if (currentMonth === endMonth && currentDay > endDay) return false;
    return true;
  } else {
    // Period spans across the year end (e.g., Dec to Jan)
    if (currentMonth > startMonth || currentMonth < endMonth) return true;
    if (currentMonth === startMonth && currentDay >= startDay) return true;
    if (currentMonth === endMonth && currentDay <= endDay) return true;
    return false;
  }
}

export function getCheiroAlerts(psycheNum: number, targetDate: Date = new Date()): CheiroAlert[] {
  const data = cheiroPsychicNumbers[psycheNum];
  if (!data) return [];

  const alerts: CheiroAlert[] = [];
  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = targetDate.getDate();
  const dayOfMonthStr = dayOfMonth + (
    dayOfMonth > 3 && dayOfMonth < 21 ? 'th' :
    ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][dayOfMonth % 10]
  );

  // 1. Check for Lucky Days
  if (data.luckyDays.primary.includes(dayOfWeek)) {
    alerts.push({
      type: 'lucky_day',
      message: `Today is ${dayOfWeek}, one of your most fortunate days according to Cheiro.`,
      severity: 'success'
    });
  }

  // 2. Check for Strong Periods
  for (const period of data.strongPeriods) {
    if (isDateInStrongPeriod(targetDate, period)) {
      alerts.push({
        type: 'strong_period',
        message: `You are currently in a strong period: ${period}. Your natural qualities are heightened.`,
        severity: 'info'
      });
      break; // Only need one strong period alert
    }
  }

  // 3. Check for Own Numbers (Lucky Dates)
  const ownNumbers = data.birthDates.map(d => parseInt(d));
  if (ownNumbers.includes(dayOfMonth)) {
    alerts.push({
      type: 'lucky_date',
      message: `Today is the ${dayOfMonthStr}, which vibrates to your own number ${psycheNum}. An ideal day for important plans.`,
      severity: 'success'
    });
  }

  // 4. Check for Compatible Numbers
  // This is a bit more complex as it involves interchangeable numbers mentioned in fullDescription
  // For now, let's use the compatibleNumbers array
  if (data.compatibleNumbers.some(n => {
    // Check if dayOfMonth reduces to n
    let reduced = dayOfMonth;
    while (reduced > 9) reduced = String(reduced).split('').reduce((a, b) => a + parseInt(b), 0);
    return reduced === n;
  })) {
    alerts.push({
      type: 'compatible_date',
      message: `Today's date (${dayOfMonthStr}) is in harmonious vibration with your number.`,
      severity: 'info'
    });
  }

  return alerts;
}
