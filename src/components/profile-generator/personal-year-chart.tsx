import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import type { PersonalYearData } from './types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export const PERSONAL_YEAR_MEANINGS: { [key: number]: string } = {
  1: `PERSONAL YEAR 1 – AN ACTIVE YEAR OF ADJUSTMENT This is an extremely powerful doing year for personal growth and expression as we adjust to the changes wrought during the now-concluded PY9. The power of this year encourages us to dare to be different as we improve in self-confidence and extricate ourselves from the limitations religion-dominated society feels justified in inflicting upon its faithful. This is an excellent year for the breaking of old habits. Indeed, adaptation to a new lifestyle invariably demands such severance. It is especially powerful year for improving ourselves financially and for buying and selling on a wide scale, such as with real estate, business interests and investments. However, the most significant and permanent success will only be achieved when people’s motives are genuinely for the common good, free of personal greed and recklessness. Ruling 1 people will find adaptation so effortless this year that they can be easily lulled into an attitude of frivolity. They must be careful to avoid recklessness, especially in financial matters, and take heed not to succumb to egocentricity. With appropriate self-discipline, they will find it a year of significant material growth and personal popularity.`,
  2: `PERSONAL YEAR 2 – A SPIRITUAL GROWTH YEAR OF SHARING Though not with the power of a peak number, this is a year in which its own powerful nature can be significant enough to cause many a turbulent personality to embrace calmness. Spiritual development is the primary feature of this year with an enhanced awareness of life’s more subtle qualities. Rather than being a year of major change, it is one in which the development of emotional control, spiritual awareness and accentuated intuition can be expected. Central to the growth under this year’s vibration is the need to actively develop the power of meditation. By this means, more than any other, the body’s cellular alignment is restored to achieve the inner power we all want as our limitless energy reserve and our magnetic essence. By this means, we learn to be in command of our emotions, to act rather than react, to replace uncertainty and doubt with confidence and security, and to wisely discriminate between the more important and the less important aspects of our daily life. Following the two previous years of progress, some people develop a tendency to rest on their laurels or lapse into complacency. It is then that negativity takes the opportunity to develop those reactive emotions of fear, nervousness, argumentativeness and insecurity that can sometimes manifest in the most unexpected ways to make an otherwise likeable person seem quite obnoxious or unbearably power-crazed. Realise it as a year for cooperation, for working together in one or more partnerships (home, work, sports, and so on). To satisfactorily achieve this, we need to be more loving and more accepting – further growth aspects of this year. Ruling 2 and Ruling 11 people will be especially susceptible to the increased sensitivity accompanying this year’s vibrations. It should not be surprising for them if their psychic awareness takes on a significantly elevated level of expression, almost projecting their consciousness into another dimension. Their cooperation with this development by allowing adequate time for meditation and spiritual studies will be powerfully beneficial for their own understanding of its power, as well as for their role in guiding others.`,
  3: `PERSONAL YEAR 3 – A MIND-EXPANSIVE YEAR Between the peak PYNs and the trough of the PY4 comes this year of surprisingly intensified mental power that provides the appropriate rounded development for this portion of the Personal Year cycle. Under this vibration, our thinking and observing faculties are attuned to an acute peak of alertness. It is a year when the intellect thirsts for knowledge and expression. For some, it could involve study of an academic nature. Others might prefer to investigate life and its philosophies, while some might seek enlightenment through personal growth. The usual means of mental expansion this year are either through an educational course or extensive travel. Whatever the choice, it is important to realise that this year is one in which the further development of memory is vital, for the 3 vibration is the gateway to the mind through memory. We should always realise that memory is the foundation of self-esteem and self-confidence, as well as the bridge between our conscious and unconscious minds. The continual alertness and growing capacity of our memory is invariably distinguishable between the ageing and the ageless people. On the lighter side of the PY3, we should recognise the need for balance by ensuring that time is allowed in our lives for humour, happy occasions, bright company and the appreciation of a good joke. Ruling 3 people will be especially attuned to this year’s vibrations, but they must learn to control their high level of rationality to ensure that it does not swamp their feelings. For them, the enhanced mental alertness they will experience this year needs to be channelled into avenues of constructive and expansive awareness for their personal satisfaction and for the peace of mind of those with whom they associate (who may otherwise grow tired of an overbalanced mentality and become the subject of frequent destructive criticism).`,
  4: `PERSONAL YEAR 4 — A YEAR OF CONSOLIDATION Physical and material factors dominate this trough year. Rest and stability are vital to regenerate and consolidate the previous five years’ development. It is a year of squaring (as symbolised geometrically by the four-sided figure), when everything is brought to a reckoning and the unwanted aspects are eliminated, as a vine is pruned in winter to make way for the coming new growth the following spring. This is an ideal year for integrating Basic Self (body and emotions) Conscious Self (thoughts and ideas) with High Self (the eternal soul). Those who do not follow the need for time out to relax and adjust could find themselves in a state of disharmony, leading to frustration, confusion and fear. Any attempt at major changes in affairs or lifestyles during this year are rarely successful, leading instead to material loss in either finances, health or both. People who are usually regarded as being highly strung, whose nerves are ever tense and whose sensitivities are acute, should be especially careful to avoid any disharmony in their dealings with others this year. For them, a relaxed vacation will be most beneficial. Ruling 4 people cannot be blamed for feeling quite frustrated under this year’s vibrations. Invariably, they will fail to recognise it as a year of consolidation, trying instead to maintain the impetus of the progress achieved during the previous four years. As a result, their nerves take a severe battering. For them, increased rest and reduced emotional disturbances (such as avoiding TV, movie “thrillers,” and domestic or work arguments) will help reduce the toll on their health. The inclusion in their diet of adequate B-complex vitamins will be of enormous help in restoring nerve energy, as will appropriate homoeopathic nerve tonics; but addictive drugs should be avoided, for they only incite secondary problems. Ruling 22/4 people should accept the same advice, with the additional suggestion that they recognise their more spiritual essence and organise their daily routines to permit periods for meditation and relaxation. Additional spiritual nourishment for them includes time to read appropriate spiritual books, listen to harmonious music or, more ideally, become involved in creating music or writing books aided by their powerful intuition.`,
  5: `PERSONAL YEAR 5 – A YEAR OF FREEDOM Spiritual and emotional factors prevail this year. Its vibrations span the gap between last year’s trough and next year’s creative mini-peak, igniting the power of freedom, generated by heightened psychic awareness and personal expression. This leads to the development of our talents to find release from material and social confinement, replacing them with a new focus on artistic expression, whether for a hobby or professionally. Some have launched the basis for a new career under this vibration. Others have discovered their freedom in a change of home, moving to the country and away from city confinement. Ruling 5 people will find this a year in which their desires for freedom become almost obsessive. However, they must realise that it is not always physical freedom they need, though it is sometimes easier to believe so, thereby rationalising and masking an emptiness in personal understanding. Their primary need is for freedom of expression, a quality that is comparatively new to human life but, thankfully, becoming more and more universal. This expression can best be achieved through the arts, for it is soon realised that to express ourselves freely demands far more than just words. Music, painting, pottery or any similar form of artistic expression provide the vent for our sensitivity and much needed nourishment for the nerves, helping us to develop that all-important personal calmness.`,
  6: `PERSONAL YEAR 6 – A YEAR OF CREATIVITY This is the year of the mini-peak, its focus on accumulation of power that seeks vent through one’s investment in creative time. New creative projects undertaken this year will have the most favourable aspects for success, especially if their underlying principle is directed toward the upliftment of humankind. It is a year in which the formation of any worthwhile business undertaking will considerably benefit. It is also a year of focus on the home and on personal relationships. Creative activities related to the home will receive a significant boost under this vibration. In the area of relationships, many are either secured or released as underlying integrity casts free any falseness or negativity. Persisting with such undesirable traits will ensure that this is a most difficult year, inciting intense anxiety, arguments and hatred. Clearly, the lesson of this year is to come to terms with facts as they are. It’s also important to recognise what it is to have personal honesty and integrity, and a positive attitude. Then it will be a most rewarding year, crowned by happiness, creative achievement and sound financial success. Ruling 6 people are the most tested under this vibration, for the intensification of their creativity and personal integrity combine to make it a powerful, yet cleansing period. Those engaged in the positive aspects of the 6 will find their creativity boosted as they attain a new high in happiness. They would have it no other way. Though there are many Ruling 6s that have not yet seen the light, preferring to dwell in the mud-hole of negativity, adopting worry and anxiety as their trademarks. They are already sick and will only become sicker as their bodies become more enervated and their attitude to life leads to further loneliness. Adopting the positive, creative approach is their only answer.`,
  7: `PERSONAL YEAR 7 – A TROUGH YEAR OF FOCUS Similar to the PY4, this is a trough year of consolidation when no major change should be undertaken. However, it is a highly significant year in which we learn to intensely focus on previous years’ growth with a view to better understand our life. As such, it is a vital year for learning through personal experience. For many, this implies sacrifice brought about by a failure to recognise and apply guidance from the higher powers and their own natural wisdom. When we live in thoughtless reaction, we expose ourselves to the need for firm corrective measures – prompt karma we might call it. Such sacrifices invariably result in the loss of money, health and or love. They always have a purpose, for they are designed to awaken and return us to the Path. It is wise to avoid any major changes in financial or domestic affairs during this year, for it is a period of stabilisation, as opposed to expansion, of pruning dead wood to make way for the new growth of the ensuring years. It is also a powerful teaching/sharing year in which frequent opportunities present themselves for guiding others toward our level of understanding. Ruling 7 people will often suffer seemingly severe hardships under this vibration but their experience will invariably appear far worse to the outsider. These people are not unfamiliar with sacrifice, for this is their established pattern of learning. And it will continue to be that way until they attain a sufficient degree of personal awareness and wisdom. Once this is achieved, they become excellent teachers, practical philosophers and helpers to humankind, thereby fulfilling the purpose intended by their Ruling Number.`,
  8: `PERSONAL YEAR 8 – A YEAR OF INDEPENDENCE AND WISDOM This is a year of rapid change as we emerge from a consolidating trough onto the steep rise toward our next peak and the start of a new cycle of growth and prosperity. Many new opportunities manifest under this vibration as we assert our independence with growing wisdom. For some, it will be in the form of a significant improvement in their financial affairs. For the majority, there will emerge a heightened spiritual independence in which they recognise how much emotional control and understanding they have achieved and how much more emphasis they now place on living (acting), rather than existing (reacting). Ruling 8 people have already acquired an appreciable measure of independence and wisdom to the extent that their living has been positive. Otherwise, they will have built around themselves an isolating wall, confusing aloofness with independence and experiencing difficulties in communicating with their close associates, whom they so often take for granted.`,
  9: `PERSONAL YEAR 9 — THE PEAK YEAR OF CHANGE We commence by analysing this year first, because it is both the end of the old cycle and the commencement of the new. At the forefront of the major peak in the nine-year Personal Year cycle, it is the year in which change is set into motion. However, many aspects of the changes will not always be realised until later in the year or during the following year. These changes will vary considerably over the lifetime of each person, becoming especially pronounced during the twenty-seven-year duration of developing maturity through the Pyramids. General aspects of the Personal Year (PY) 9 include travel, change of home and or job, and the making of new and exciting friendships, often accompanied by the termination of some older relationships we have since outgrown. It is also an excellent year for squaring old debts and extending the hand of peace to anyone with whom we might be at variance. A strong sense of humanitarian responsibility, tolerance and improved understanding will noticeably prevail during this year. Ruling 9 people will be in no doubt as to the importance of this year, for they will feel its vibrant power in every action. It should be their year of notable success. As the crest of their cycle, it brings them to an increased level of personal responsibility and idealism in whatever humanitarian field they express themselves. Should they be already overly ambitious, this year will strengthen their enthusiasm for egocentric success and could incite them to a degree of recklessness that might lead to extremely painful lessons. Fanaticism, superiority and excessive seriousness can detract the individual from enjoying the excitement of this dramatic year.`
};

interface PersonalYearChartProps {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  onYearSelect: (data: PersonalYearData | null) => void;
  selectedPersonalYear: PersonalYearData | null;
}

export const PersonalYearChart: React.FC<PersonalYearChartProps> = ({ birthDay, birthMonth, birthYear, onYearSelect, selectedPersonalYear }) => {
  const currentYear = 2026;
  const currentDate = new Date(currentYear, 0, 1); // Use a fixed date for deterministic calculation
  const birthdayThisYear = new Date(currentYear, birthMonth - 1, birthDay);
  const effectiveCurrentYear = currentDate >= birthdayThisYear ? currentYear : currentYear - 1;

  const startYear = effectiveCurrentYear - 9;
  const endYear = effectiveCurrentYear + 9;

  const powerMap: { [key: number]: number } = { 1: 10, 2: 5, 3: 4, 4: 2, 5: 5, 6: 8, 7: 2, 8: 7, 9: 10 };
  const offsetPerCycle = 3;

  const reduce = (num: number): number => {
    let n = num;
    while (n > 9) {
      n = String(n).split('').reduce((a, b) => a + Number(b), 0);
    }
    return n || 9;
  };

  const chartDataArray: PersonalYearData[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const pyn = reduce(birthMonth + birthDay + year);
    const cycleIndex = Math.floor((year - birthYear) / 9);
    const basePower = powerMap[pyn];
    const power = basePower + cycleIndex * offsetPerCycle;
    chartDataArray.push({ year, pyn, power, meaning: PERSONAL_YEAR_MEANINGS[pyn] });
  }

  const currentIndex = chartDataArray.findIndex(d => d.year === effectiveCurrentYear);

  const maxPower = Math.max(...chartDataArray.map(d => d.power)) + 8;
  
  const verticalLinePlugin = {
      id: 'verticalLineAndLabel',
      afterDraw: (chart: any) => {
          const ctx = chart.ctx;
          const xAxis = chart.scales.x;
          const yAxis = chart.scales.y;
          
          const index = chart.data.labels.indexOf(effectiveCurrentYear);
          if (index === -1) return;

          const x = xAxis.getPixelForValue(index);

          // Dashed line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#fceabb';
          ctx.setLineDash([8, 6]);
          ctx.stroke();
          ctx.restore();
          
          // Label Box
          const text = `Current Year: ${effectiveCurrentYear}`;
          ctx.font = 'bold 12px Poppins';
          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          const boxHeight = 24;
          const boxWidth = textWidth + 20;
          const borderRadius = 8;
          
          const boxY = yAxis.bottom - 60;
          const boxX = x - (boxWidth / 2);

          // Draw rounded rectangle
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.beginPath();
          ctx.moveTo(boxX + borderRadius, boxY);
          ctx.lineTo(boxX + boxWidth - borderRadius, boxY);
          ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + borderRadius);
          ctx.lineTo(boxX + boxWidth, boxY + boxHeight - borderRadius);
          ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - borderRadius, boxY + boxHeight);
          ctx.lineTo(boxX + borderRadius, boxY + boxHeight);
          ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - borderRadius);
          ctx.lineTo(boxX, boxY + borderRadius);
          ctx.quadraticCurveTo(boxX, boxY, boxX + borderRadius, boxY);
          ctx.closePath();
          ctx.fill();

          // Draw Text
          ctx.fillStyle = '#fceabb';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, x, boxY + boxHeight / 2);

      }
  }


  const chartData = {
    labels: chartDataArray.map(d => String(d.year)),
    datasets: [
      {
        label: 'Power Level',
        data: chartDataArray.map(d => d.power),
        borderColor: '#ff00ff',
        backgroundColor: 'rgba(128, 0, 255, 0.6)',
        fill: true,
        tension: 0.4,
        borderWidth: 7,
        pointRadius: chartDataArray.map((_, i) => i === currentIndex ? 16 : 11),
        pointBackgroundColor: chartDataArray.map((_, i) => i === currentIndex ? '#ffffff' : '#ff00ff'),
        pointBorderColor: '#ff00ff',
        pointBorderWidth: 4,
        pointHoverRadius: chartDataArray.map((_, i) => i === currentIndex ? 20 : 15),
        pointHitRadius: 30
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
      axis: 'x' as const
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clicked = chartDataArray[index];
        onYearSelect(selectedPersonalYear?.year === clicked.year ? null : clicked);
      }
    },
    scales: {
      y: { display: false, min: 0, max: maxPower },
      x: {
        ticks: {
          color: '#fceabb',
          font: { size: 14, family: 'Poppins' },
          maxRotation: 45,
          minRotation: 45
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Personal Year Cycle',
        color: '#fceabb',
        font: { size: 22, weight: 'bold', family: 'Poppins' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#ff00ff',
        bodyColor: '#fceabb',
        titleFont: { family: 'Poppins', size: 14, weight: 'bold'},
        bodyFont: { family: 'Poppins', size: 12 },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            if (context.datasetIndex === 0) {
              const d = chartDataArray[context.dataIndex];
              return `Personal Year ${d.pyn} - Power ${d.power}`;
            }
            return '';
          }
        }
      },
      legend: { display: false },
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl bg-[#0f0f1e]">
      <div style={{ height: '520px' }}>
        <Line data={chartData} options={chartOptions} plugins={[verticalLinePlugin]}/>
      </div>
      <p className="text-sm text-purple-200/80 text-center mt-4 italic font-medium">
        Click on a bar to see more information about a specific year.
      </p>
    </div>
  );
};
