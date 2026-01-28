import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
} from 'chart.js';
import type { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import type { PersonalYearData } from './types';
import { PERSONAL_YEAR_MEANINGS } from '@/lib/numerology/data/personalYearMeanings';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
  annotationPlugin
);

interface PersonalYearChartProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  onYearSelect: (data: PersonalYearData | null) => void;
  selectedPersonalYear: PersonalYearData | null;
}

/** Core numerology peaks preserved */
const BASE_POWER: Record<number, number> = {
  1: 10,
  2: 5,
  3: 4,
  4: 2,
  5: 5,
  6: 8,
  7: 2,
  8: 7,
  9: 10,
};

/** Tiered growth factor per 9-year cycle (12%) */
const CYCLE_GROWTH = 0.12;

const reduce = (num: number): number => {
  let n = num;
  while (n > 9) {
    n = n.toString().split('').reduce((a, b) => a + Number(b), 0);
  }
  return n || 9;
};

export const PersonalYearChart: React.FC<PersonalYearChartProps> = ({
  birthDay,
  birthMonth,
  birthYear,
  onYearSelect,
  selectedPersonalYear,
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [chartData, setChartData] = useState<any>({ datasets: [] });

  const now = new Date(2026, 0, 1);
  const currentYear = now.getFullYear();
  const birthdayThisYear = new Date(currentYear, birthMonth - 1, birthDay);
  const effectiveYear = now >= birthdayThisYear ? currentYear : currentYear - 1;

  const dataArray = useMemo<PersonalYearData[]>(() => {
    const start = effectiveYear - 9;
    const end = effectiveYear + 9;

    return Array.from({ length: end - start + 1 }, (_, i) => {
      const year = start + i;
      const pyn = reduce(birthMonth + birthDay + year);
      const cycleIndex = Math.floor((year - birthYear) / 9);

      const base = BASE_POWER[pyn];
      const power = +(base * (1 + cycleIndex * CYCLE_GROWTH)).toFixed(2);

      return {
        year,
        pyn,
        power,
        meaning: PERSONAL_YEAR_MEANINGS[pyn],
      };
    });
  }, [birthDay, birthMonth, birthYear, effectiveYear]);

  const currentIndex = dataArray.findIndex(d => d.year === effectiveYear);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, 'rgba(128, 0, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0.05)');

    setChartData({
      labels: dataArray.map(d => String(d.year)),
      datasets: [
        {
          data: dataArray.map(d => d.power),
          borderColor: '#ff00ff',
          backgroundColor: gradient,
          fill: true,
          tension: 0.45,
          borderWidth: 7,
          pointRadius: dataArray.map((_, i) =>
            i === currentIndex ? 18 : 12
          ),
          pointBackgroundColor: dataArray.map((_, i) =>
            i === currentIndex ? '#ffffff' : '#ff00ff'
          ),
          pointBorderColor: dataArray.map((_, i) =>
            i === currentIndex ? '#fceabb' : '#ff00ff'
          ),
          pointBorderWidth: dataArray.map((_, i) =>
            i === currentIndex ? 6 : 4
          ),
          pointHoverRadius: dataArray.map((_, i) =>
            i === currentIndex ? 24 : 16
          ),
          pointHitRadius: 40,
        },
      ],
    });
  }, [dataArray, currentIndex]);


  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    onClick: (_: any, elements: any[]) => {
      if (!elements.length) {
        onYearSelect(null);
        return;
      }
      const clicked = dataArray[elements[0].index];
      const next =
        selectedPersonalYear?.year === clicked.year ? null : clicked;

      onYearSelect(next);
    },
    scales: {
      y: {
        display: false,
        min: Math.min(...dataArray.map(d => d.power)) - 1,
        max: Math.max(...dataArray.map(d => d.power)) + 1,
      },
      x: {
        ticks: {
          color: '#fceabb',
          font: { size: 14 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { color: 'rgba(255,255,255,0.08)' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Personal Year Cycle',
        color: '#fceabb',
        font: { size: 22, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#ff00ff',
        borderWidth: 2,
        callbacks: {
          label: (ctx: any) => {
            const d = dataArray[ctx.dataIndex];
            return `Personal Year ${d.pyn} • Power ${d.power}`;
          },
        },
      },
      legend: { display: false },
      annotation: {
        annotations: {
          currentLine: {
            type: 'line',
            xMin: effectiveYear,
            xMax: effectiveYear,
            borderColor: '#fceabb',
            borderDash: [10, 8],
            borderWidth: 4,
          },
          currentLabel: {
            type: 'label',
            xValue: effectiveYear,
            yValue: dataArray.map(d => d.power).reduce((a, b) => Math.max(a, b)) + 2,
            content: `Current Year: ${effectiveYear}`,
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#fceabb',
            font: { size: 14, weight: 'bold' },
            padding: 10,
            borderRadius: 8,
          },
        },
      },
    },
  };

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#0f0f1e]">
      <div style={{ height: 520 }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
      <p className="text-sm text-purple-200/80 text-center mt-4 italic font-medium">
        Click on a point to see more information about a specific year.
      </p>
    </div>
  );
};
