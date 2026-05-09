/**
 * MONTHLY SOUL CHRONICLE DATABASE
 * Source: Verbatim historical and zodiacal texts.
 * 
 * February is now fully populated. January is also complete.
 * March-December are safelocked as null.
 */

export interface MonthlyNumberData {
  character: string;
  finance: string;
  health: string;
  importantNumbers: string;
  colors: string;
  jewels: string;
  climactericYears: string;
  magneticAttraction: string;
}

export interface MonthlyProfile {
  generalInfluence: string;
  generalCharacter: string;
  generalHealth: string;
  generalFinance: string;
  generalMarriage: string;
  numbers: Record<number, MonthlyNumberData>;
}

export const MONTHLY_CHRONICLE: Record<string, MonthlyProfile | null> = {
  january: {
    generalInfluence: `The Zodiacal influence for the month of January in general. Its effect on the character, disposition, finance and health of persons born in this period of the year.
The month of January comes under the Zodiacal Sign of Capricorn. The “cusp” of this Sign commences on or about December 21st . The “cusp” lasts for seven days, consequently the full influence of this Sign comes into power about the 28th of December and lasts until the 21st of January, when another seven days “cusp” begins under the influence of the next incoming Sign—Aquarius, Third House of the Triplicity of Air.
Capricorn is the Third House of the Earth Triplicity. Its Planetary Ruler is Saturn (Positive), It is also called the House of Saturn.`,

    generalCharacter: `If you are born in this month the basic principles of your character and disposition are as follows:
A nature ambitious, militant, energetic and persevering. You are capable of enormous efforts towards the attainment of a desired object. The planet Saturn, which owing to this month you symbolize, is the embodiment of all that is cautious and discreet. You will never take any important step without profound deliberation and unless you are absolutely certain of the result. There is no speculative element in Saturn. You are skeptical, analytical, somewhat suspicious, slow to accept new theories, but broad-minded and open to conviction. The mental force is strong, philosophical and scientific in character; you are a deep thinker and a great reasoner. In religion the testimony is inclined to be fanatical in its earnestness, or the mind may swing to the Opposite pole and believe in nothing. Above all things, you worship intellect, and can forgive almost anything of your friends if they are endowed with unusual intelligence or talent.
You are exceedingly quick in your intuitions of people and things, but are inclined to be too easily discouraged in your plans, and fall into a despondent state at the first rebuff or disappointment. Your views on love, duty and social economics will be always unique, and on this account you will often be regarded as odd and eccentric by those around you.
Being high-minded and independent, you must lead in whatever you undertake or you will lose interest in your work. You abhor restraint of any kind and revolt against anything of an obligatory nature, though in strange contradiction you show profound respect for tradition and authority. Life to you is a very serious but involved problem, and you will be inclined to revel in its most pessimistic phases.
Constant work and industry becomes with you a kind of mania, but by plodding and quietly working with a given end in view, you will gain much more than by excitement or hurry. You are likely to rise through your own personal efforts and power of individuality far above the sphere of your birth. Your character is essentially positive, but you need to cultivate cheerfulness, as there is likely to be a strong tendency to hypochondria and melancholia.
As a general rule you will be much misunderstood by others. You will not easily mix with people; you will have a few close friends, but at heart feel very much alone.
You will make many enemies by nearly always espousing the unpopular cause or the “underdog” in any dispute.
You would do best by aiming at some form of public life, such as in municipal affairs or in connection with politics, government life, or positions of responsibility and trust.`,

    generalHealth: `HEALTH:
The Saturnian influence bearing upon this question for you born in January indicates a vigorous constitution and good physical stamina. At the same time, there is a strong tendency to depression and despondency which, if not acted against, will induce bilious attacks, trouble with the gall bladder, ulcers in the stomach, derangements of the digestive organs and stoppages of the intestines. You should cultivate optimism and cheerful society in order to keep in good health. Cold will serioulsy affect you, and unless you are careful you will be likely to suffer from asthma, bronchial catarrh and such like ailments. High dry climates will suit you better than living in low altitudes.
Study well your diet and keep up the circulation by adequate exercise, also avoid draughts, damp and cold winds. Plenty of change is absolutely essential for you, but it should never be a change to solitude. If your outlook should ever become limited or cramped, and conditions show signs of giving way, your innate gloom may turn to hypochondria unless you exert every force in your nature to cultivate the spirit of cheerfulness.
You will greatly desire to make a home for yourself in the country, and if possible, on some height on the side of a mountain or on some hilly place. You should never allow yourself to live in low-lying, wet or damp places, as you will have a very decided tendency to develop rheumatism, gout, pains and swellings in the feet. You are also likely to meet more accidents to the ankles, feet and legs, than is the lot of most people.`,

    generalFinance: `FINANCE: The dominate influence of Saturn ruling your birth-month is not a favourable significator as it causes delays, hidrances and limitations in regard to financial advancement, at least in the early part of the life.
Advancement, gain and success in money is promised by industry, slow plodding perseverance and by carefulness, thrift and economy. In fact, you are more likely to acquire wealth through your own personal efforts than by any dint of good fortune. Advantageous investments for you would be in land or house property, the building up of factories dealing especially in coal, lead or iron products, machinery for transport work or agriculture, the developing of farming enterprises and all things solid and concrete.
You will experience much difficulty in obtaining money that should be yours by right and you should never lend without security, or you would be sure to lose. You should always see that the concerns in which you invest your money are established on solid foundations as these will be more fortunate to you than things of the more purely speculative order.`,

    generalMarriage: `MARRIAGE, UNIONS, PARTNERSHIP, ETC.: 
You will find your most harmonious relationship in persons born in your own sign (Capricorn) Third House of Earth, December 21st to January 21st . In Taurus, April 20th to May 20th , First House of Earth; or Virgo, August 21st to September 20th , Second House of Earth, or Virgo, August 21st to September 20th , Second House of Earth and in the seven days of the “cusp” at the beginning and ending of each of these periods; also persons born in the exact opposite part of the year to your own, in this case from about the 27th of July to September 27th .`,

    numbers: {
      1: {
        character: `PERSONS BORN ON JANUARY 1ST , 10TH , 19TH , 28TH NUMBER 1 PEOPLE IN THIS MONTH
If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Saturn, in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition is described in previous pages for persons born in January, but the Sun and Uranus will give you a marked individuality of your own. You will be very independent in your views, full of originality and creative in your desires, Success, unless brought about by very exceptional circumstances, is likely to be delayed until your latter years, but you have every promise that it will come in the end.
At heart you will be very thoughtful and serious-minded, and extremely thorough-going in everything you undertake.
You will be level-headed and practical and not easily swayed or influence by other persons’ views.
You will have a “set purpose” at the back of all your plans, never giving in or allowing yourself to be discouraged by difficulties.
Although having a very generous nature, you will quickly resent any attempt to be imposed upon and will carry out your own charities in your own way.
You will be decidedly ambitious and will be likely to rise beyond your fellows and other members of your family.
Many obstacles may beset your path, but by your patience and determination you will overcome all difficulties.`,
        finance: `FINANCE:
You will be frugal and cautious in financial matters, investing your money well in business or industries that promise a good return. You will make the most out of any opportunities that present themselves and will endeavour to make the best out of any situation you may find yourself placed in.
You will have a strong magnetic influence over others, especially in any life that may bring you before the public. At the same time you may expect to meet much scandal and calumny at different times in your career.`,
        health: `HEALTH:
If born on any one of these dates, such as the 1st , 10th , 19th or 28th of January, you will have a great amount of vitality, provided you never indulge in drugs or intoxicants of any kind.
You will be inclined at times to suffer from severe chills, rheumatism and arthritis. To avoid this you should live in high, dry climates as much as possible.`,
        importantNumbers: `Your most important Numbers are the “one” (which represents the Sun) and the “four” (which represents Uranus). You should make every effort to cany out everything important for yourself on dates that make these numbers, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st of any month.`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear or at least have in some part of your clothing, the colours of the Sun and Uranus which are :
The Sun: All shades of gold or yellow, or bronze to golden brown.
Uranus: All shades of sapphire blue, greys or pastel colours.`,
        jewels: `Your “luckily” jewels are diamonds, sapphires and amber.`,
        climactericYears: `The most important or climacteric years in your life are the 10th , 19th , 28th , 37th , 46th , 55th , 64th , 73rd and the 4th , 13th , 22nd , 31st , 40th , 49th , 58th , 67th and 76 th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a “one” or “four” in any month of the year, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st .`
      },
      2: {
        character: `PERSONS BORN ON JANUARY 2ND , 11TH , 20TH , 29TH NUMBER 2 PEOPLE IN THIS MONTH
If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the Moon and Neptune in the Zodiacal Sign of Capricorn, House of Saturn [Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition is described in previous pages for persons born in January, but the Moon and Neptune will give you a more gentle, imaginative and intuitional nature that the majority of people born in January, as previously described. You will be inclined to become despondent if things do not go the way you want, and shrink into yourself at the approach of opposition or any rough action by others. You will be over-sensitive and inclined to be too easily hurt and wounded.
You are likely to succeed in gifts of the imagination more that by any hard and fast business methods. You will have “day-dreams” of the high positions your ambitions force you to claim. Your dreams are likely to become realities if you develop self-confidence in all you undertake. Being extremely sensitive, you crave for encouragement to force you to make the best of your faculties. You will be restless and unhappy if tied down by circumstances for you must have liberty to carry out your visions.`,
        finance: `FINANCE: 
You will not be fond of money except as “a means to an end; You will have a curious feeling of being above it, knowing that by your brains you can always gain what you want. You will be considered more rich than you really are. It will hurt your sensitive nature to refuse any demand and for this reason you may at times become impoverished in attempting to keep up your position in the world. In spite of this, your natural tendency is to be cautious in money.`,
        health: `HEALTH: 
You will be inclined by overwork mentally, to “take too much out of yourself’, and so bring on a breakdown of the nervous system, but if so the least “let up” or rest will restore you to good health. You are likely to become a great believer in some special form of diet which will be greatly to your advantage. You should guard yourself against all forms of gout and rheumatism and live in a dry climate if possible. You may at times expect some trouble with your eyes. Also weakness, delicacy or curvature of the spine.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the “two”, which represents the Moon, and the “seven”, which represents neptune.
You should endeavour to carry out everything important for yourself on dates that make these numbers, or any one of their series, such as the 2nd , 7th , 11th 16th , 20th , 25th and 29th in any month.`,
        colors: `To increase your magnetic vibrations and make yourself more fortunate, you should wear constantly, or in some part of your clothing, the colours of the Moon and Neptune, which are : The Moon: All shades of white, cream and pale green. Neptune: All shades of dove-grey from the lightest to the darkest.`,
        jewels: `Your “lucky” jewels are jade, pearls, moonstones or cat’s eyes.`,
        climactericYears: `The most important or climacteric years in your life are the 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th ” 43rd , 47th , 52nd , 56th , 61st , 65th , 70th and 74th .`,
        magneticAttraction: `You will find a magnetic attraction to persons born on dates making a “two or a seven” in any part of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
      },
      3: {
        character: `PERSONS BORN ON JANUARY 3RD , 12TH , 21ST , 30TH NUMBER 3 PEOPLE IN THIS MONTH
If you were born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerlogy, you come under the vibrations of the planet Jupiter in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition is that previously described for persons born in January, but being under a strong aspect of Jupiter you will be somewhat aggressive and forceful in all your plans and desires.
You will have great ambitions underlying all you undertake. You will rise in life by your own efforts and your determination to succeed.
You will meet with considerable jealousy and opposition and will make many enemies in whatever your career may be.
You would do well in all forms of public life, no matter what class it may be. Also in positions of authority where you would have control and responsibility over others.
You will be inclined to “lay down the law” and will hold firmly to whatever your own views or opinions may be.
You are not likely to find much happiness in marriage unless you have the luck to meet some member of your opposite sex who will look up to you as their mental superior.
You will be constructive mentally, capable of making plans on a big scale. You should endeavour to carry out your own ideas and not trust too much to others.
If born on January 21st or 30th , you will more easily rise in life to high positions of responsibility.
You will have a keen desire, if born on these later dates, to help others or lift the “submerged class” to a better position. You will aim to bring good to the masses, more than to the individual; in consequence you will arouse hatred and malice from individual enemies and may at times be in danger of your life from such sources.
You will not spare yourself in whatever work you set yourself to do and consequently at many periods of your life you will run the risk of complete nervous exhaustion.`,
        finance: `FINANCE: 
You will endeavour to make use of large sums of money to carry out your plans or ambitions. You will run considerable risk in working out your schemes, as the least miscalculation will allow enemies to pull you down. You may expect success as a general rule, provided it is not personal gain that may tempt you to take on too much.`,
        health: `HEALTH:
Although endowed with a splendid constitution you are likely to undermine your health by continual mental strain and overwork. Unless you take care and husband your reserve energy, you will be liable to some form of paralysis and heart failure, but it will be largely your own fault if you do not reach the average span of life.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the “three” and its series, representing the planet Jupiter, and the “eight” which represents the planet Saturn.
You should make every effort to cany out your plans on dates that make the number “three”, such as the 3rd , 12th 21st and 30th .
If born on January 30th you come under the Sign of Aquarius, House of Saturn (Negative). Your numbers will remain the same as those born on the 3rd , 12th , and 21st of January, but being under Saturn (Negative) you will have less restrictions and should be able to make more out of your life.`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing the colours of: Jupiter: All shades of violet to violet-purple or mauve.`,
        jewels: `Your “lucky” jewels are the amethyst, or stones with a violet or purple tinge in them, also black pearls and black diamonds.`,
        climactericYears: `The most important or climacteric years in your life are the 3rd . 8th , 12th , 17th , 21st , 26th , 30th , 35th , 39th , 44th , 48th , 53rd , 57th , 62nd , 66th , 71st , 75th and 80th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a “three” in any month of the year, such as the 3rd , 12th , 21st and 30th . You will also attract to you persons born on the “eight” or its series, such as the 8th , 17th and 26th , but such persons will not be so fortunate for you as those representing the series of the “threes.”`
      },
      4: {
        character: `PERSONS BORN ON JANUARY 4TH , 13TH , 22ND , 31ST NUMBER 4 PEOPLE IN THIS MONTH
Born on any of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibration of the planets, the sun and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive)Third House of the Triplicity of Earth.
The foundation of your character and disposition is that previously described for persons born in January, but the influence of Uranus at this date of the month will accentuate all these indications in your case.
You will be original in your views, extremely independent in your character and not inclined to fit in with the plans or ideas of other people, or those with whom you may be forced to live.
Your life will be a difficult one in relation to all home ties or marriage. You will find yourself much misunderstood in your actions and feel isolated in life. You will be unconventional in your views and ideas, and will have to carve out your own road if you want to be successful. Your ambitions will be much thwarted by opposition and you will need the greatest exercises of patience in carrying out your projects.
At heart you will be intensely serious, covering this up at times with the pretence that you are mocking at life’s tips and downs and laughing at Fate. In reality, deep down in your soul you are a “fatalist”, just playing a role on Life’s Stage for good or evil, as the case may be.
The underlying motive of all your actions will be the desire to gain power over others, whether you gain it by the pen, the tongue, or the sword, matters little.
In some ways these dates in January make a good combination for those who follow a public life, but they give a strong leaning for unusual actions, originality of thought and a distinct trend towards eccentricity.`,
        finance: `FINANCE:
Here again you may expect the unusual to happen. Money will be gained by you but to pass out of your hands like water.
Fame, whether it is good or bad, will last longer for you than finance. Your name may be remembered but your grave neglected. If you are not extremely careful to lay aside provision for the future your advanced years may find you in a very serious condition.`,
        health: `HEALTH: 
In matters regarding health you will find yourself living under peculiar conditions with more likelihood of illness caused by accident than by any form of disease. The principal parts of the body more liable to be afflicted are the lower limbs and feet.
You will have, however, extraordinary vitality. It would be difficult to kill you by any means except by violence or accident, and you will be prone to meet with both in the course of your life.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the “four” and its series, representing the planet Uranus, and “one” and its series, representing the sun, and “eight” and its series, representing Saturn.
The numbers “four” and “one” are the most fortunate for you to use and act on. The “eight” and its series will be greatly drawn into your affairs, but I do not advise you to seek or use these numbers of “eight” if you can avoid doing so.
The numbers of the eight are the 8th . 17th , 26th of any month.
You should make every effort to carry out your plans on dates that make the numbers of “four” and “one” such as: 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st .`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing, some touch of yellow, gold or golden brown, also sapphire-blues, greys or pastel colours. The colours of your most important planets are : The Sun: All shades of yellow and gold or bronze to golden brown. Uranus: All shades of Sapphire-blue, greys, pastels or “electric colours”.`,
        jewels: `Your “lucky” jewels are the diamond, topaz, sapphires and black pearls.`,
        climactericYears: `The most important or climacteric years in your life are the 10th , 13th , 19th , 22nd , 28th , 31st , 37th , 40th , 46th , 49th , 55th , 58th , 64th , 67th , 73rd and 76th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a “four” or a “one” in any month of the year, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st .
persons born on dates such as the 8th , 17th and 26th are likely to be much drawn into your life, but will not be so favourable for you from a material standpoint.`
      },
      5: {
        character: `PERSONS BORN ON JANUARY 5TH , 14TH , 23RD NUMBER 5 PEOPLE IN THIS MONTH
If born on any one of the above dates, following the rules of Astrology and my system based on Chaldean Numerology, you come under the vibrations of the planet Mercury and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition is that previously described for persons born in January, but the planet Mercury will lessen or make less important any of the bad indication, in your case.
You will have great versatility and your chief difficulty will be to get into a line of work suitable to your talents and ambitions. You will try many things in life and change your career many times.
You will have great adaptability to both people and studies. You will love movement and will travel and see a great deal of the world.
It will be very difficult for you to find your true vocation in life as there is nothing you cannot adapt yourself to, but you may find it hard to stick to anything for any length of time.
You will get wonderful and unexpected chances and opportunities thrown in your way.
You will have a keen, penetrating critical mind, but some what suspicious of those you come in contact with for the first time. People can only influence you through kindness and sympathy.
You will be tactful and diplomatic; good at winning secrets from others which you will readily apply to some practical purpose.
You will be fond of literature and be an extensive reader. At times you may become interested in science, chemistry and new inventions; occult studies may also claim your attention, but your mind is too practical for any visionary ideas. You will be characterized as “having an old head on young shoulders”. you should cultivate optimism so as to be able to overcome despondency that will seize you in moods.`,
        finance: `FINANCE: 
You will be careful and frugal in dealing with money matters. You will have a horror of getting into debt. You will have sound practical ideas as to investments, but inclined to be over-cautious for your own good and so in money matters miss many opportunities you might otherwise use to your advantage.`,
        health: `HEALTH: 
If you were born on January 5th , 14th or 23rd your chief care should be to relax, and remove strain from your nervous system. You will feel everything keenly and suffer from moods of temperament. At times you will be liable to have fits of despondency which have a depressing effect on the digestive organs, producing in its turn acidity of the blood causing pains in the joints, bones and especially in the knees.
You will have good background of a wiry constitution, which will endow you with great resistance to any form of disease that may attack you.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBER is the “five” and all its series, such as the 5th , 14th , 23rd , but as a rule all numbers will be equally lucky for you, except the numbers of “four” and “eight” in all their series, which are 4, 13, 22, 31 and 8, 17 and 26. You should endeavour to cany out your plans on your own individual number of “five” or any of its series that make the dates of the ‘five”, such as the 5th , 14th , 23rd in any month.`,
        colors: `To increase your magnetic vibrations and so make life more fortunate, you should wear light colours as much as possible.`,
        jewels: `Your “lucky” jewel is the diamond, and all glistening stones.`,
        climactericYears: `The most important climacteric years in your life are the 5th , 14th , 23rd , 32nd , 41st , 50th , 68th , 77th ; also the 8th 17th , 26th , 35th , 44th , 53rd , 62nd and 71st .`,
        magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a “five” in any month of the year, such as the 5th , 14th and 23rd . People born on the 8th , 17th and 26th will be drawn into your life and affairs, but as a general rule will not be so favourable for you.`
      },
      6: {
        character: `PERSONS BORN ON JANUARY 6TH , 15TH , 24TH NUMBER 6 PEOPLE IN THIS MONTH
If You were born on any one of the above dates, following the rules of Astrology and my system of chaldean Numerology, you come under the vibrations of the planets Venus and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition will be that described in preceding pages for persons born in January, but in your case the influence of the planet Venus will make such indications more favourable for you.
Matters of love, marriage and affection will play a very important role in your life and you will be greatly swayed by such things.
The influence of persons of your opposite sex will cause your life and career to be very eventful. You should endeavour to develop your own strong will and individuality in order not to be submerged by such influences, but as a general rule, you will gain considerable by your magnetic personality.
You would succeed best in business or professions dealing with the public, but of an artistic nature, such as music, art, literature, the theatre and inventions on not ordinary lines.
In your earlier years you will be likely to be kept back by home conditions or the demands of relatives, also through illness relating to the internal organs of the body.
The indications are that you will, in the end, surmount all such obstacles and become successful in whatever career you decide to make your own.
If you were born on the 15th or 24th of January you will come under more fortunate conditions than those governing the 6th . You may have equal difficulties to meet with in your early years, but you will more easily surmount them and gain fame and reputation by whatever you set your mind on to accomplish.`,
        finance: `FINANCE: 
Those born on January 6th will not be inclined to hoard up money no matter what their opportunities may be, but those born on the 15th or ‘4th will slowly but steadily build up and strengthen their financial position. They will make good provision for their future and have every likelihood of becoming wealthy.`,
        health: `HEALTH:
If you were born on January 6th , 15th or 24th , you may expect more than the average amount of good health all through your life. You will have danger from fire and such things as motor cars and should keep yourself and your property well insured.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS and dates are the “six” and all its series, such as the 6th , 15th and 24th .
You should endeavour to carry out anything important for yourself on dates malting these series.
You should act very carefully on dates making a “four” or an “eight”, or any of their series, which are the 4th , 8th , 13th , 17th , 22nd , 26th , and 31st .`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear constantly the colours of the planet venus, which are all shades of blue, from the lightest to the darkest.`,
        jewels: `Your “lucky” jewels are the turquoise and all blue stones.`,
        climactericYears: `The most important or climacteric years in your life are the 6th , 15th , 24th , 33rd , 42nd , 51st , 60th and 78th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a “six” in any month of the year such as the 6th , 15th and 24th . People born on “fours” and “eight” will be drawn into your life and affairs, but as a rule their burdens and troubles will come on your shoulders.`
      },
      7: {
        character: `PERSONS BORN ON JANUARY 7TH , 16TH , 25TH NUMBER 7 PEOPLE IN THIS MONTH
If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Neptune, the Moon and Saturn, in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition will be that described for persons born in January, but in your case the influence of the above combination will increase or augment such indications.
You will be intensely devotional, no matter what career you may follow, and at heart innately religious, but your religious bent will be towards some unusual or unconventional form.
You will be romantic, idealistic, highly imaginative and live in a mental world of your own.
You will have a keen desire for travel, especially on the ocean. The practical or business world will more or less jar on your idealism. If you are in the position to do it, you will move about a great deal and have many changes of residence during the run of your life. You would succeed well in settling in some part of the world far from the place of your birth, dealing with people of a different nationality to your own.
If You were born on any of the above dates, circumstances or destiny will lift you into positions of authority or responsibility over others. At the same time, life will not be altogether “a bed or roses”, especially in connection with domestic matters or sorrows and disappointments caused by your relations.`,
        finance: `FINANCE: 
The positions you will occupy will bring you fame and much popularity, but the money that will pass through your hands will not bring you much happiness. From a worldly standpoint you will be likely to many, well, but to have severe trials to pass through.`,
        health: `HEALTH: 
Your constitution in your early years will be inclined to be delicate. You will be prone to have peculiar illnesses difficult to diagnose by ordinary means. You should pay particular attention to your throat, lungs and heart.`,
        importantNumbers: `THE MOST IMPORTANT NUMBERS are those of the “seven” and the “two” and all their series. You should make every effort to carry out any important thing for yourself on dates making these numbers, which are the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .
You should look out as much as possible for difficulties or unhappy conditions brought from persons born on dates making a “four” or an “eight” such as on the 4th . 8th , 13th , 17th , 22nd , 26th and 31st .`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate you should use shades of greys and greens in your wearing apparel, such as All shades of dove-grey, pastels or “electric colours”. All shades of green, creams and white.`,
        jewels: `Your “lucky” jewels are green jade, moonstones and pearls.`,
        climactericYears: `The most important, climacteric years in your life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
        magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a “seven” or a “two” in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
      },
      8: {
        character: `PERSONS BORN ON JANUARY 8TH , 17TH , 26TH NUMBER 8 PEOPLE IN THIS MONTH
If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The foundation of your character and disposition will be that described for persons born in January, but in your case the influence of the planet Saturn will be so powerful that such indications will be augmented or increased. Persons born on these dates come under what is called “a double Saturn.” They generally have some heavy “cross to bear” or great responsibility forced on their shoulders.
If you were born on January 8th , 17th or 26th , you will have great difficulties and oppositions to contend against. You will get little, if any, help from others and will have to depend on yourself for any success that may come into your life. You will, however, have great patience, perseverance and determination in all you undertake. You will have strong ambition and no amount of opposition will daunt you in any purpose or plan you will set your mind on to achieve.
At times you will undergo severe spells of depression and gloomy forebodings, or moments of extreme melancholia that will be difficult to shake off. You will encounter many trials and sorrows caused by family ties or by the loss of those you love, and the later marriage should occur the better it would be for you.
You will not be lucky in any form of gambling, speculations or “get rich quick” schemes.
You will accumulate money by slow, laborious means, by the hard work of your brain, or in some cases by the developing or opening up of lands, mines or minerals, such things as coal, lead, concrete works or large building operations would be favourable for you, together with positions of heavy responsibility.
You will have a naturally serious disposition. You will be a deep thinker, good in reasoning out plans for others and excellent in debate, if the argument presented should sufficiently rouse, you to either attack your opponent or defend yourself.
You will be very decidedly ambitious, not from vain glory or the love of power, but from sterling conscientious motives, especially if you can see your way to be of help to others.
You will be likely to make strange attachments to those inferior to you mentally, and morally, which will leave you open to criticism and underhand opposition.
Although never blinded to the faults of others you will be ready to find an excuse for their actions or take the responsibility on your own shoulders. You will be “a personality” in whatever your place in the world may be. At times you will be the victim of acute moods of despondency, especially if you should reach a point in your career where you could no longer do good work.
You will never “wear your heart on your sleeve” or let others know your heartaches. Your eyes will appear bathed in the light of the Sun, while your feet may walk in darkness.`,
        finance: `FINANCE:
In spite of meeting great opportunities, you are not likely to make much provision for your failing years. Although capable of giving splendid advice to owners you will not follow it for your own personal advantage. To the surprise of your friends, towards the end of your days you are likely to become comparatively poor by giving your money away to others or making peculiar provisions in your will.`,
        health: `HEALTH: 
In health, sudden and unexpected illnesses are likely to happen, Stoppages and strictures of the internal organs and operations may be expected, but against that there will be long periods of good health.
You should study all questions of diet more than the average person and not allow yourself to live for any length or time in damp low-lying districts.
You are liable to have injuries to the lower limbs, weakness or turning of the ankles, injuries to the spinal column caused by falls or by accidents.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the “four” and “eight” and all their series, and dates making these numbers will play an important role in your life.`,
        colors: `To increase your magnetic vibrations you should wear the following colours: Dark violet-purple, black or blue-black. Ultramarine blue, sapphire colours and all shades of grey.`,
        jewels: `Your “lucky” jewels are black pearls, black diamonds and sapphires.`,
        climactericYears: `The most important of climacteric years in your life are the 4th , 8th , 13th , 17th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 62nd , 71st and 80th .`,
        magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making an “eight” or a “four” in any month of the year, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st , but as a general rule persons born on these dates will lay their burdens on your shoulders.`
      },
      9: {
        character: `PERSONS BORN ON JANUARY 9TH , 18TH , 27TH NUMBER 9 PEOPLE IN THIS MONTH
If you were, born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars and Saturn in the Zodiacal Sign of Capricorn, House of Saturn (Positive) Third House of the Triplicity of Earth.
The Foundation of Your character and disposition will be that described for persons born in January, but in your case the influence of the planets Mars will make you have a very eventful, stirring and rather fatalistic life. Circumstances over which you have little or no control will play a great part in all your affairs.
You will force your way forward in whatever you undertake, but you will be liable to have unusual “ups and downs” of fortune. At times everything will appear to go your own way and again there will be periods when everything will be the reverse. Unless you are born in wealthy circumstances made by your forebears, you are likely to have a very hard and difficult beginning.
Up to about your thirty-third to thiry-fifth year the indications are that you will be forced to undertake a great deal of irksome work at variance to your nature and desire.
You will be extremely ambitious and will never be satisfied until you attain some position of prominence beyond or above your fellows.
You will be endowed with a considerable amount of courage and selfassurance which will sustain you well in the battle of life.
You will possess executive and organizing ability beyond the average person, but to do justice to yourself, you should get into some wide scope of action.
Rulership or government work of any kind would be in keeping with your nature of any high position of responsibility in connection with industry or enterprise.
You will have a love of adventure and excitement, which will cause you to encounter danger in many forms.
You are likely to meet with numerous accidents and risk your life under unusual circumstances.
Industrious and acquisitive, you will build up any business with which you may be associated, but as there is a strong speculative under-current running through your disposition you will often take on risks that will at times overwhelm you.
You unconsciously will make enemies and at times you will suffer severely from conspiracies formed against you and treachery from unexpected quarters.
You are likely to gain socially through marriage, but to have some peculiar experience in connection with it in the latter years of your life.
You will be quick and irritable in temper. You will be dogmatic and headstrong. You will make many powerful enemies and will be liable to suffer discredit in your advanced years through treachery and false friends.`,
        finance: `FINANCE: 
If born on the 18th or 27th of January, after the age of about thirty-five and up to your sixtieth year you will be likely to control or have large sums of money passing through your hands. Thereafter out to the end you will need to exercise great prudence and care if you are to keep your position and wealth.`,
        health: `HEALTH:
From the standpoint of health you will get a good start in life and be endowed with a splendid constitution. This is likely to continue up to advanced years when an overstrained heart will begin to put in an appearance. If you can lie off and rest you may be able to forestall the evil day for some time, but the indications are of sudden death without warning.`,
        importantNumbers: `YOUR MOST IMPORTANT NUMBERS are the “nine” in all the series. You should endeavour to carry out your plans or anything important on dates making these numbers, which are the 9th , 18th and 27th .
The number “eight” and the “four” and all their series, and persons born on the 4th , 8th , 13th , 17th , 22nd , 26th of any month will play important roles in your life and career, but there will be something more fatalistic than favourable in connection with these numbers and their series, or persons these numbers represent.
Personally you should avoid employing the number “four” and the “eight” and all their series as much as possible.`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should use the following colours: Mars: All shades of rose, crimson or reds.`,
        jewels: `Your “lucky” jewels are the ruby, garnet and bloodstone.`,
        climactericYears: `The most important or climacteric year in your life are the 9th , 18th , 27th , 36th , 45th , 54th , 63rd , 72nd and 81st .`,
        magneticAttraction: `You will find a strong magnetic attraction for persons born on dates making a three, six or nine in any month of the year such as the 3rd , 6th , 9th , 12th , 15th , 18th , 21st , 24th , 27th and 30th .`
      }
    }
  },

  february: {
    generalInfluence: `The zodiacal influence for the month of February in general. Its effect on the character, disposition, finance and health of persons born in this period of the year.
The Zodiacal Sign of Aquarius, also called the House of Saturn (Negative) commences on or about January 21st , but for seven days being overlapped by the “cusp” of the preceding sign, it does not come into its full power until January 28th of February 1st . From this date on, it is in full strength until February 19th . From then out it is gradually losing force on account of becoming overlapped by the incoming Sign-Pisces.
Note: Those born in the “cusps” take from the qualities of both Signs of the Zodiac.`,

    generalCharacter: `If you were born in February you will be inclined to be over-sensitive and easily hurt and wounded by others. You will feel lonely in life though you are likely to make contacts with large numbers of people.
You will not be demonstrative in your affections or able to express your love nature; you will, however, be intensely loyal to those you love and will fight to the bitter end for a friend or for any cause you espouse.
You will have strong intuitions about those you come in contact with and will be generally right in your judgment. You will “read” people instinctively, but being so sensitive and so disinclined to hurt others, you will be prone to conceal your opinions or keep them to yourself.
You will be extremely highly strung from the very fact that you cannot “let go” and express yourself, and your nerves at times are likely to become much over-wrought.
If you do lose control, and say what is in your mind, you will suffer from fits of conscience and bitterly regret what you have said and go to the other extreme in trying to repair the breach.
You will have a great desire to be active or employed for the public good and will be more than usually generous in helping to relieve the distress of others. You will be inclined to aid public charities more than the average individual on account of an innate dread of being imposed upon or “taken in” by a personal “hard luck” story.
You will have a very logical type of mind and like to have subjects quietly reasoned out with you.
You will have remarkably good ideas in business and will be found giving excellent advice to others, but as a general rule you will find yourself filling positions of trust and responsibility and wore successful for others than for yourself.
You will require some call of duty or circumstances to demonstrate the sterling qualities that you possess, but if “the call” does come, you will rise to the occasion and surprise everyone by the hidden powers and abilities you possess.
If you can overcome your sensitiveness and develop self confidence, there is no position in life you could not attain. You would succeed best in some large sphere of action for the good of others. Those who become “awakened”, if born in this Sign, usually leave a great name behind in the cause of humanity, or by some great name invention that has brought unusual benefit to the world at large.
You will be inclined to take a deep interest in public movements that attract large masses of people. You will be found attending important ceremonies of national interest in whatever country that you may call your own.
Although living much in yourself, you will exhibit the strange contradiction of liking crowds and going where people congregate, such as mass meetings, theatres, places of amusement and such like. You will also exhibit the strange complexity that, although your own nerves are nearly always in an over-wrought condition, yet you will have great power over excitable people or those who are hysterical or insane and you will often find yourself thrown among such types in your journey through life.
If you are born into wealthy surroundings the likelihood will be that you will never develop your best qualities, but just drift down the stream of life, until too late to make any change.
You should study the companions you choose more than perhaps any other class, for the reason that being lacking in self-confidence, you could easily become influenced by those you come into close contact with.`,

    generalHealth: `Health: In health you will be likely to suffer through nerves and the upper part of the stomach, liver and gall-bladder, in a way that it is difficult for doctors to understand or relieve. You will be inclined to buy any quack medicine that is well advertised and have always some new pill or tonic to offer to your friends.
You will suffer, as a rule, with poor circulation of the blood, anaemia, chilblains, pains in the head and back, palpitation and weakness of the heart, disorder of the bladder and kidneys, dropsy; also peculiar accidents to the feet and “turning” or twisting of the ankles or breaking of the bones in advanced years.`,

    generalFinance: `Finance: The influence of Saturn and Uranus governing this part of the Zodiac gives the likelihood of great and sudden changes in your fortunes, you will always be liable to experience remarkable and unexpected reversals and should be very careful in matters of an uncertain or hazardous nature. It is a favourable position, however, for your receiving an income from trusts, insurance companies, banking concerns, also from railways companies, electrical installations aviation and the floating of the inventions.
Your income; however, unless you are extremely prudent, will always be more or less uncertain, and it will generally be your portion to experience extremes. At some period of your life you are likely to come into a great deal of money from a totally unlooked for source, and in a very peculiar or “out of the way” fashion.`,

    generalMarriage: `Marriage, Unions, Partnerships, etc: You will find your most harmonious relationship with persons born January 21st to February 19th , in your won sign (Aquarius), Third House of Air; or in Gemini, First House of Air, May 21st to June 20th ; or in Libra, Second House of Air, September 21st to October 20th ; and in the seven days of the “cusp” at the beginning or ending of each of these periods.
You will be much attracted to persons born in the part of the year opposite your own, in this case from about the end of July to the end of August.`,

    numbers: {
      1: {
        character: `Persons Born on February 1st , 10th , 19th , 28th Number 1 People in This Month
If you were born on any one of the above dates up to February 19th , following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the Sun, Uranus and Saturn in the Zodiacal Sign of Aquarius House of Saturn (negative) Third House of Triplicity of Air.
You will be under less fatalistic influences than persons born on the same dates in January who are under the rule of Saturn (Positive).
The foundation of your character and disposition will be that described for persons born in February, but if born on the 1st , 10th , 19th or 28th of the month, you will be more free to carry out your plans and ambitions.
The early years of your life will be full and active. Unexpected changes will happen to your family, plans made by them for you are not likely to be carried out and the chances are that you will start out into the world at an early age to make your own way.
You will be versatile and full of original ideas. You will have great ambition, strong will and determination, and inclined to try many roads in your climb towards success.
You will excite treachery and underhand dealings by those jealous of you and will have many changes in whatever career you may try during the first part of your life.
You will not be what is called "lucky" with other people and should be most careful in all dealings with partners or associates. You would do better alone in working out what ever your plans may be, as you are liable to be defrauded or easily robbed by others.
You should always aim for big things and try to come in contact with those in higher positions than yourself.`,
        finance: `Finance: You should avoid gambles and speculations when other people's interests are concerned. At times you may be inclined to over-reach yourself in your efforts to make money quickly.
For those who lead professional careers such as doctors, lawyers, actors, artists, etc., the month of February in not so favourable in their efforts to hoard up or keep money. On the contrary it is a good combination for those engaged in solid businesses, such as bankers, financiers, or heads of large industries, perhaps because persons born in this Sign are better in dealing for other people than for themselves.
If you were born on February 28th , you will be in the commencement of the incoming sign of Pisces, beyond the zone of Aquarius, the House Saturn (Negative). You should therefore have less restrictions and should expect considerable success in carrying out whatever your career may be.`,
        health: `Health: If you were born on the 1st , 10th , or 19th of February, you will have a superabundance of mental energy, but will not be as strong physically as persons born on February 28th . The digestive apparatus will be inclined to get easily out of order, you should eat lightly but often, and get more sleep than the average person. You will, however, have a very wiry constitution and throw of illnesses quickly.
If you were born on the 19th or 28th of February, you then belong to the "cusp" of the incoming Sign of Pisces, whose ruler in Jupiter. This is more beneficial than if you were born on the 1st or 10th of February.
If born on February 19th or 28th , you will have wonderful vitality, although inclined to exhaust yourself by overwork or over-exertion. You will awake each morning like the Sun, with renewed energy, to begin another day. You will be likely to have, however, a tendency for diseases of the liver, impurity of the blood, to catch colds easily and may often be threatened with pleurisy and a delicacy of the lungs.`,
        importantNumbers: `Your most important numbers are "one", which represents the Sun, and the "four" which represents Uranus. You should concentrate your efforts to do everything important for yourself on dates that make these numbers, such as the 1st , 4th , 10th , 13th , 19th , 22nd and 31st .`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate you should, in your clothing, wear the colours of the Sun and Uranus, which are The Sun: All shades of gold or yellow to golden brown. Uranus: All shades of sapphire, dark blues and greys.`,
        jewels: `Your "lucky" jewels are diamonds, sapphires, amber and topaz.`,
        climactericYears: `The most important or climacteric years in your life are the 10th , 13th , 19th , 22nd , 28th , 31st , 37th , 40th , 46th , 49th , 55th , 64th , 67th and 73rd .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one", "four" or "three" in any month of the year, such as the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd , 28th , 30th and 31st .`
      },
      2: {
        character: `Persons Born on February 2nd , 11th , 20th , 29th Number 2 People in This Month
If you were born on any of the above dates in February, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Moon and Neptune but being born in February, Saturn is in its Negative house. Consequently Saturn, not having the same degree of afflicting, constructing, or fatalistic conditions, you will be under more favourable influences and more able to carry out your plans and ambitions.
The foundation of your character and disposition is described in previous pages for persons born in February.
You will be romantic and idealistic and will have many love affairs of a more or less unusual kind. You will have considerable ambition and will get many chances of bettering your position.
You are likely to find your early home life and surrounding not very congenial and the likelihood if you will go out in the world "on your own". You will, however, have to conquer your "over-sensitiveness" and develop the "selfconfidence" that is so necessary to persons born under these numbers, especially in the commencement of the year.
You will have many changes in your life and career, and a great desire to travel and see other countries far from your land of birth.
You will, have many talents, but will be inclined to develop gifts of the imaginative faculties and would do well in new inventions, especially those of wide service to humanity at large.
You will have a keen desire to express yourself in art, literature, music or the drama, and would succeed in such things.`,
        finance: `Finance: You are likely to become rich in your later years by your own abilities, but may also inherit money or property. You will be likely to have many important gifts and honours bestowed on you.
If you were born on February 2nd , 11th or 20th , you will have many difficulties and restrictions in finance in your early years, unless you happen to be born in good circumstances. But in the end you will be bound to succeed by your own mental talents, especially those in the domain of inventions, or in relation to the artistic world. If born on February 29th , in a "leap year", coming into the Sign of Pisces, you will have less restrictions and be more fortunate in early life.`,
        health: `Health: In matters of health You will have little to complain about. You will have a good constitution for your background and will be likely to form a set of rules on "the simple life" order, that will give you a promise of living to an advanced age.`,
        importantNumbers: `For those born on February 20th and 29th , being born on the "cusp" of Pisces, the House of Jupiter (Negative) their most important numbers will be the two, seven and three and all their series, such as the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , and the 3rd , 12th , 21st and 30th .`,
        colors: `To increase your magnetic vibrations and make yourself more fortunate, you should wear constantly, or in some part of your clothing, the colours of the Moon and Neptune, which are : The Moon: All shades of white, cream and pale green. Neptune: All shades of dove-grey from the lightest to the darkest.`,
        jewels: `Your "lucky" jewels are jade, pearls, moonstones or cat’s eyes.`,
        climactericYears: `The most important or climacteric years in your life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a two and seven in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`
      },
      3: {
        character: `Persons Born on February, 3rd , 12th , 21st Number 3 People in This Month
If you were born on any one of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Jupiter and Saturn in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
If you were born on February 3rd or 12th , you will have the same qualities as described for persons born on similar birthdates in January, but as you now come under the rulership of Saturn (Negative) you will have much more favourable conditions under which to carry out the Jupiter qualities of your Birth Number. These qualities are, in brief: Strong will, determination of purpose, a very decided talent for organization particularly in public matters, government departments of politics. The quieting, sobering influence of Saturn, when negative or mental, is one of the finest influences to a Jupiter person born under the Sign of Aquarius. No better example of this could be found than in the character of Abraham Lincoln, born on the 12th of February.
If you were born on the Feb. 21st , being already in the "cusp" of the incoming Sign of Pisces, whose ruler is Jupiter (Negative), you will feel the good influences of this favourable planet and will be under better material auspices than if born earlier in this month.
As the 21st of February is a Jupiter number (3), and you are born at the commencement of the "cusp" of Jupiter, you should allow your ambitions to have full rein with every promise of being successful. All work leading to responsibility and authority over others is decidedly favourable to you, no matter what that work may be.
There is no career in which you cannot succeed, provided your ambition is aroused. As Jupiter is termed Negative in this position, your ambition will be more mental than physical. This means that although fitted for positions of authority over others, you may shrink from what might be called the "physical contact." In that case, you will be likely to organize large undertakings and yet not receive the public approval that may fall to others. In any case, no matter what the viewpoint mentally is that you may take, persons born on February 21st have every reason to expect success.`,
        finance: `Finance: If you were born on February 3rd , 12th or 21st you may expect to gain more than usual success and position from whatever line of work you may take up, but more especially so if born on the 12th or 21st . As this is very much one of the mental Signs of the Zodiac, it will all depend on what you set your mind to accomplish.
You will meet at times, however, with heavy losses in money in spite of whatever prudence you may use.`,
        health: `Health: In matters of health you will run a danger of nervous exhaustion from overwork, a liability for neuritis and sciatica, inflammation of the liver, hardening of the blood vessels and arteries, and high blood pressure.
You should reduce nervous tension as much as possible, live on a simple diet and get plenty of sleep.`,
        importantNumbers: `Your most important numbers are the "three" and "eight" and all their series, such as the 3, 8, 12, 17, 21, 26 and 30.
As you were born in the Zodiacal Sign of Aquarius ruled by Saturn (Negative) owing to the declining influence of this planet you will be more fortunate than if born on the same dates in January.
You will, however, still attract the influences of the numbers "four" and "eight", and all their series, also persons born on these dates; such as on the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .`,
        colors: `The jewels and colours are the same as for other number "three people", namely, all shades of violet, mauve and violet-purple.`,
        jewels: `The "lucky" jewel is the amethyst, and all purple coloured stones.`,
        climactericYears: `Your most important or climacteric years of life are the 3rd , 12th , 30th , 39th , 48th , 57th , 66th and 75th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three" in any month of the year, such as the 3rd , 12th , 21st and 30th and such persons should have a favourable in influence in your life and career.`
      },
      4: {
        character: `Persons Born on February 4th , 13th , 22nd Number 4 People in This Month
If you were born on any of the above dates in February, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Uranus, the Sun with Saturn (Negative) in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
The basic foundation of your character and disposition is described in previous pages for persons born in February.
As the Sun (1) is always linked in this study with Uranus (4) and written as one hyphen four (1-4), so when Uranus is the principal, as in this case, it is written as four hyphen one (4-1).
As Saturn, Although now in its negative House, is still the Ruler of this part of the Zodiac, until February 19th , if you were born on the above dates you will remain under its influence. Your important numbers are, therefore, four, one and eight and all their series, such as 1,4, 8, 10, 13, 17, 19, 22, 26, 28 and 31.
The qualities and characteristics of persons born on February 4th , 13th and 22nd , are so similar to those given to these numbers in January that I need not repeat them again, except to emphasize that, as you are now under Saturn Negative and not Saturn positive you are less under the restricting influences of this planet, and consequently should be able to make more out of your life.
At the same time I must warn you to continue to avoid, as much as possible, using the numbers "four" and "eight" and not make plans or engagements that come under these numbers or any of their series, such as 4th , 8th , 13th , 17th , 22nd , 26th and 31st .
The best numbers and dates for you are the Sun Numbers 1st , 10th , 19th and 28th , with the interchangeable Moon Numbers-2nd , 11th , 20th .
If you were born on February 4th , 13th or 22nd you will be very original in your views and unconventional in your actions. You will lean mentally towards "new thought" in all its phases. New philosophies or new religions will appeal very strongly to you, also new methods and independence of thought and action. You are likely to be classed by your fellow mortals, as odd, peculiar and "individual." For this reason, you will not, as it were, easily "fit in" with the ideas of those you meet with in ordinary life.
This is accentuated by your being under the influence of Saturn (Negative), which, although negative, must now be considered as more affecting the mental side of your nature. Consequently, although to a great measure escaping what may be described as the more fatalistic influence of the Saturn vibrations, will be inclined to be tinged with its melancholy, philosophic quality, which together with your own Uranian peculiarities, tends to increase your sensitiveness and will often make you shrink from personal contact with others.
Children born on these dates, and in fact, all born on days that make the numbers "four" and "eight" especially in both January and up to February 22nd , should be treated with great consideration and sympathy, any rough treatment or harshness being absolutely wrong for their mental development. Such minds are so sensitive that they feel everything acutely. Being peculiarly secretive, and undemonstrative, they are unable to express themselves and are easily misunderstood. So much is this the case that I have often found persons born under the "fours" and "eights" of any month, but more especially those in January and up to February 22nd , accused of things they have never committed. I have known many persons born under these numbers or dates falsely accused at the bar of justice and seen even ordinary rights denied them.`,
        finance: `Finance: If born on any one of these dates in February, financial matters will not appeal to you as much as they do the average person. You will be inclined to gain money in unusual ways and also to lose it in equally unusual ways. By employing extra prudence and caution, you may be able to protect yourself to a certain degree, but you will always have to be on your guard against swindlers and "get-rich-quick" schemes.`,
        health: `Health: In your case health will always be a question of "mind over matter." As long as you are in a happy frame of thought and interested in whatever work you are doing, you will keep well and disease will not attack you. If however, you allow yourself to feed on gloomy thoughts, you will never feel fit or well and would be liable to bring on a form of nervous disorders of the digestive tract very difficult to cure.`,
        importantNumbers: `Your important numbers are, therefore, four, one and eight and all their series, such as 1,4, 8, 10, 13, 17, 19, 22, 26, 28 and 31.`,
        colors: `The best numbers and dates for you are the Sun Numbers 1st , 10th , 19th and 28th , with the interchangeable Moon Numbers-2nd , 11th , 20th . Wear gold or yellow to bronze.`,
        jewels: `Your "lucky" jewels are the diamond, topaz, sapphires and black pearls.`,
        climactericYears: `The most important or climacteric years of your life are the 1st , 4th , 10th , 13th , 19th , 22nd , 28th , 31st , 37th , 40th , 46th , 49th , 55th , 58th , 64th , 67th , 73rd and 76th .`,
        magneticAttraction: `If you were born on any one of these dates in February, you will find a strong magnetic attraction for persons born on days making a one, four, or eight in any month of the year, such as the 1st , 4th , 8th , 10th , 13th , 17th , 19th , 22nd , 26th , 28th and 31st .`
      },
      5: {
        character: `Persons Born on February 5th , 14th , 23rd Number 5 People in This Month
If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Mercury, with Saturn (Negative), in the Zodiacal Sign of Aquarius, Third House of the Triplicity of Air.
The basic foundation of your character and disposition is described in previous pages for persons born in February.
The combination of Mercury and Saturn in this period, is good to be born under, as the qualities of Mercury are influenced by the conscientious painstaking nature of Saturn and is excellent for mental development.
If born on February 23rd being in the "cusp" of the incoming Sign of Pisces, ruled by Jupiter, you will be very dominant and independent in your character, and care little whether the world appreciates your work or not.
All these dates in February produce a keenly critical frame of mind. They give a penetrating knowledge of human nature, with a curiously strong influence over others. Such persons have a remarkable power of "the eye" easily to subduing excitable people and compelling them to listen to reason and logic. As doctors they have an almost uncanny power of diagnosis. They are great readers, rapidly absorbing what they read or hear, with retentive memories which they draw upon when the occasion required for the benefit of others. They love science and all proved facts. They are sceptical of theories and yet at heart are metaphysically inclined. They are not seekers for wealth or position, but at the same time are extremely ambitious that their work should become recognized.
Although very self-contained, they deeply appreciate encouragement and will do almost anything for a few words of praise or kindness.
If disappointed in their ambitions they easily become morbid and melancholy.`,
        finance: `Finance: As regards money matters, persons born on these dates in February are excellent in giving advice to others on financial questions, but rarely can follow it for themselves. They often make money and become wealthy by the work of their brains, but they seldom can hold on to it or make provision for their old age. If you were born on any one of these dates, I would strongly advise you not to go in for any speculative business, but to only risk investments in such things that would be under your own control.
People will always be ready to take from you, but to give you as little as possible in return.`,
        health: `Health: As a general rule you will be healthy and full of energy, but in periods liable to complaints of the liver, spleen, kidneys and bladder. There is one set of people born on these dates in February who, if born with money, ruin their constitutions by their craving for strong drink drugs and extravagant living.
These persons are easily recognized by their lack of purpose, restlessness and extreme irritability.`,
        importantNumbers: `If you were born on February 5th , 14th or 23rd , your best numbers are the series of "fives" and dates such as the 5th , 14th and 23rd in any month of the year, but more especially so during February, June and September.`,
        colors: `For favourable colours you should wear all light shades, especially white or glistening materials.`,
        jewels: `Your "lucky" jewels are diamonds and white glittering stones of all kinds.`,
        climactericYears: `The most important or climacteric years in your life are the 5th , 14th , 23rd , 32nd , 41st , 50th , 59th , 68th and 77th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" in any month of the year.`
      },
      6: {
        character: `Persons Born on February 6th , 15th , 24th Number 6 People in This Month
If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Venus, with Saturn (Negative) in the Sign of Aquarius, Third House of the Triplicity of Air.
The basic foundation of your character a nd disposition is described in previous pages for persons in February.
Persons Born on February 6th or 15th come under the vibrations of Venus, with Saturn (Negative), while those born on February 24th , being in the "cusp" of the incoming Sign of Pisces, respond to the influences of Venus and Jupiter. For February 6th and 15th , the Venus quality being more or less dominated by Saturn, we get natures where love and affection mean everything to them, and are yet inclined to be "unlucky" in such matters, chiefly on account of the intensity and "single track" quality of their minds.
Either out of blind trust, or extreme devotion to those they love, they are inclined to give everything they possess to those they care for, whether they are proved to be worthless or otherwise. If, by chance, they do find someone who can appreciate their noble devotion, there is still generally some heavy cross for them to bear. In any case they seldom get the satisfaction in love that they demand. Very often they either many beneath their social status, or someone that mentally is their inferior.
If you were born on the 6th , 15th or 24th of February, you will be much attracted to social life of all kinds.
You have the faculty of making friends easily wherever you go and forming acquaintances with strangers.
You will be adored by inferiors and those who take orders and at the same time you will attract to you persons of high rank, position and wealth.
You will be fond of romantic unusual episodes, will have much influence over your opposite sex yet have the curious contradiction of being ready to throw aside pleasure for the "call of duty" or for some cause that enlists your support.
You will be a kind of "hero to yourself', always following an idealistic dream or some star that leads you onward through the early nights of hardships and disappointments.`,
        finance: `Finance: Once your early years over you will begin to feel the tide of luck running in your favour. You will be likely to do many foolish things in finance and go into many "wild-cat" schemes and yet fall on your feet. You will be likely to gain by public enterprises or to be backed up by the public. You would do well as a company promoter and create a large following for schemes born in your brain. There will, however, always be the danger of over-reaching yourself and meeting at times with heavy financial loss.`,
        health: `Health: You will be endowed with a healthy physical body, have little anxiety about illness, inclined to run risks of exposure to changing climatic conditions and bring danger to yourself by not thinking enough about your own health. The weakest part of your system will be a likelihood of pneumonia, trouble with the bronchial tubes and lungs and overwrought nervous tension.`,
        importantNumbers: `Your "lucky" number is the "six" and any of its series, and dates such as the 6th , 15th or 24th would be the best for you to choose for any important matter.`,
        colors: `Your most favourable colours are: All shades of blue, from the lightest to the darkest. If born on February 24th , you may also use all shades of violet, mauve or violet purple.`,
        jewels: `Your "lucky" jewels are the turquoise and all blue stones.`,
        climactericYears: `The most important or climacteric years in your life are the 6th , 15th , 24th , 33rd , 42nd , 51st , 60th , 78th , 87th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "six" in any month of the year, such as the 6th , 15th or 24th . People born on "fours" and "eight" will be drawn into your life and affairs, but as a rule their burdens and troubles will come on your shoulders.`
      },
      7: {
        character: `Persons Born on February 7th , 16th , 25th Number 7 People in This Month
If you were born on the 7th , 16th or 25th of February, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the numbers "seven" and "two", and "four" and "eight", represented in Astrology by the planets Neptune (7), Moon (2), Uranus (4) and Saturn (8) in the Zodiacal Sign of Aquarius Third House of the Triplicity of Air.
The basic foundation of your character and disposition is described in previous pages for persons born in February.
If born on the 7th or 16th you will be very different in nature from persons born on February 25th for the reason that those on the late date, being born past the "cusp" of February 19th , come under the influence of the incoming Sign of Pisces, ruled by Jupiter (Negative) and consequently have less of the restrictive influence of Saturn in their lives.
If you were born on the 7th or 16th of February you will have a peculiarly sensitive highly strung nature. You will find it extremely difficult to find your true bent or career, and may pass your entire life searching for it. If however, you do find some purpose to occupy your attention, you will cling to it with great obstinacy and determination.
Being extremely sensitive to your surroundings and the vibrations of others, you should be most careful where you live, or with whom you come in contact.
You are likely to be gifted with some unusual quality of imagination, ideality and romance.
If born on the 25th of February although also coming under the influence of the numbers "seven" and "eight" and "two", you will be very different from persons born on the dates previously described. The 25th of February, being half way through the "cusp" of Pisces, comes under the influence of the Jupiter vibration, and as a rule, persons born under it make much out of their lives. They are intensely Conscientious over any work they are engaged in quite irrespective of financial gain.`,
        finance: `Finance: Persons born on these dates in February are not sufficiently worldly to care much about material gain. They are seldom lucky in finance and generally meet with loss in any form of speculation. Money passes through their hands easily on account of their generous nature and, their desire to be of help to others. IF you were born on February 7th , 16th or 25th . I can only advise you to be satisfied with small returns on such things as Government Bonds, etc., to avoid speculative schemes and all forms of gambling.`,
        health: `Health: Persons born on these dates in February have often very peculiar experiences as regards health. They generally pass through a good deal of delicacy in their early life and are usually much experimented on by doctors to whom they are always more or less a puzzle. They are themselves ready to try various kinds of "cure-all" remedies and waste money on such things. They often have some mysterious form of "stomach trouble" and are peculiar in their diet and choice of food.
Persons Born on February 7th , 16th and 25th , should avoid drugs and medicines as much as possible.
Plenty of fresh water, sleep and a simple diet will set them on their feet more quickly than all the "specialists" in the world.`,
        importantNumbers: `Your important numbers are the seven hyphen two (7-2) and all their series. You should endeavour to carry out your plans, or do anything important for yourself on dates making these numbers, such as the 2nd , 7th , 11th , 16th , 20th , 25th and 29th .`,
        colors: `Your favourable colours are all shades of green, creams whites and dovegreys.`,
        jewels: `Your "lucky" jewels are green jade, moonstones and pearls.`,
        climactericYears: `The most important or climacteric years in your life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "seven" or "two" in any month of the year such as the 2nd , 7th , 11th , 16th , 20th , 25th , 29th . Also persons born on "ones" and "fours" such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st of any month.`
      },
      8: {
        character: `Persons Born on February 8th , 17th , 26th Number 8 people in This Month
If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn (Negative) and Uranus in the Sign of Aquarius, Third House of the Triplicity of Air.
The basic foundation of your character and disposition is described in previous pages for persons born in February.
If born on February 26th , being so far advanced in the "cusp" of the incoming Sign of Pisces ruled by Jupiter, you will come under the influence of the latter planet as well as that of Saturn (Negative) and Uranus.
If you were born on February 8th , 17th or 26th you will have a very decidedly marked personality of your own, together with a life that will stand out among your fellows.
You will be a deep thinker no matter what your career may be, but one with a philosophical turn of mind.
Very peculiar circumstances and opportunities will come into your life without your seeking them, also a strangely fatalistic current of affairs will sweep you into positions of responsibility, even without your seeking.
If you were born on any of these dates such as the 8th , 17th or 26th of February, your name is likely to go down to posterity for something unusual in your life or career.
It may not be given to you to be extremely happy in your home life or immediate surroundings, but you will stand out as "a personality" wherever you may live.`,
        finance: `Finance: Persons born on February 8th , 17th and 26th , can always make money, provided they apply themselves to that one purpose. This especially is the case for those born on February 26th . They will, however, be liable to lose money by actions caused by their opposite sex, or by litigation and by blackmail.
You may make money by whatever work you may go in for, but the chances are, it will be taken from you by people or circumstances, and you should be advised to make provision for your o. d age.
You should not engage in speculation of any kind, not because of bad judgment on your part, but simply for the reason, that conditions or circumstances over which you have little or no control are likely to crop up and rob you of financial certainty.`,
        health: `Health: Persons born on these dates in February give the appearance of being more healthy than they really are. They get little or no warning about illness, they often suddenly collapse from heart failure or a clot of blood on the brain.
You should study all questions of diet more than the average person and not allow yourself to live for any length or time in damp low-lying districts.`,
        importantNumbers: `Your most important numbers are "fours" and "eights" and all their series, such as the 4, 8, 13, 17, 22, 26 and 31.
If born on February 26th the "three" and its series will play an important role and would be more fortunate for you to use than the "fours" and "eights."`,
        colors: `The most favourable colours for you are the odd shades of blue of the sapphire order and all dark colours, except reds.`,
        jewels: `Your "lucky" jewels are the sapphire, black pearl and black diamond.`,
        climactericYears: `The most important or climacteric years of your life are the 4th , 8th , 13th , 17th , 22nd , 26th , 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 62nd , 67th , 71st , 76th and 80th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four" or "eight" in any month of the year, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .`
      },
      9: {
        character: `Persons Born on February 9th , 18th , 27th Number 9 People in This Month
If you were born on any of the above dates in February, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars with Saturn (Negative) but if born on the 27th as you are already in the commencement of the Sign of Pisces, you come under the influence of Mars with Jupiter (Negative).
The basic foundation of your character and disposition is described in previous pages for persons born in February.
If you were born on February 9th , 18th or 27th , you will exhibit marked independence in thought and action, also strong will for any cause you may espouse or for any person may consider badly treated.
You will stamp everything you do with your own distinct personality. You will have good reasoning powers, very convincing and forcible in debate, ability to see both sides of an argument and quick to seize on any weak point left open by your opponent.
at heart you will be a humanitarian, always ready to devote yourself for the benefit of others, or to play a role in social reform. Your nature will make for you many enemies and cause considerable opposition to crop up against you.`,
        finance: `Finance: Under certain conditions you would be fortunate in financial matters, but a surprise to other in the way you would make use of your health. It is quite likely you may in some unconventional way get rid of it before the end comes, or tie it up in some trust fund for some cause or unusual charity.`,
        health: `Health: In matters of health you have not much to fear. You will think of it as little as possible and perhaps for that very reason escape the usual ills that all are heir to. You should, however, pay attention to the lungs and the heart.`,
        importantNumbers: `Your most important numbers will belong to the "nine" and all its series, and your best dates for any decided effort of your own will be the 9th , 18th and 27th of any month of the year.`,
        colors: `Your most favourable colours will be those of your planet Mars, all shades of crimson, red and rose.`,
        jewels: `Your "lucky" jewels are the ruby, garnet and all red stones.`,
        climactericYears: `The most important or climacteric year in your life are the 9th , 18th , 27th , 36th , 45th , 54, 63rd , 72nd and 81st .`,
        magneticAttraction: `If you were born on either the 9th or 18th of February you will be attracted or influenced by persons born on the series of "eight" and "nine": if born on February 27th , you will be attracted by persons born on the series of "three" and "nine" in any month of the year.`
      }
    }
  },

  march: {
    generalInfluence: `The zodiacal influence for the month of march in general. Its effect on the character, disposition, finance and health of persons born in this period of the year.
The Zodiacal Sign of Pisces commences on February 19th , but for seven days, being overlapped by the "cusp" of the previous Sign, it does not come into full power until about February 26th . From this date onwards it is in full strength up to March 21st , when it meets the commencement of the "cusp" of the incoming Sign of Aries.`,

    generalCharacter: `People born in this part of the year, namely from February 19th to March 21st and in the "cusp" to March 28th , possess an innate "natural understanding" and intuition. They absorb knowledge easily, especially of the history of countries and people, and as well as matters relating to travel, exploration of lands research exploration and such like things.
They are more mentally ambitious than they appear to be in the ordinary way, but they feel they must know their subject thoroughly before they speak or write about it.
They have great loyalty to friends or to any cause they take up, provided they feel they are trusted or looked up to. They are generally successful in all position of responsibility, but at the same time are not inclined to push themselves forward and usually "wait to be asked" before giving their opinions.
They are great respecters of "law and order" and uphold the conventions of whatever special order in which they may be found.
The strongest and weakest characters are found in this Sign.
Some are inclined to gratify their innate sense of luxury and self-indulgence, and if this side of the nature is the one that controls, they are likely to be too easy going, to be too receptive to their surroundings, to become influenced by false friends, to give way to fraudulent schemes and in some cases are inclined to become addicted to drugs or drink.
If, however, persons born in this part of the year find some purpose worth living for, they rise to the emergency as few others can, These are the people that one meets sometimes in life who surprise their friends by their sudden change in character.
They can, in a moment, throw off any form of weakness of self indulgence and rise to any height of self-denial. All persons born in this part of the year have a dual element as the mainspring of their nature. It simply depends on which of the two roads they have decided to follow.
Persons born in this Sign are highly emotional. If they belong to the weak side of it, they are easily influenced by the people with whom they are thrown in contact, but if they belong to the stronger side, their emotional nature can lift them up to any position.
They are generally fond of travel, of the ocean and large expanses of water. If circumstances do not permit them to travel, they will if they possibly can, make their homes where they can see the ocean or live on the side of some lake or river.
In business they are good in dealing with transportation trade with foreign countries, imports and exports or seaborne commerce of any description. Almost all have a curiously mystical side to their nature, as well as the practical. They are often classed as superstitious: the occult in all its forms appealing to them in one way or another.
They love to search out or investigate the unknown, the philosophical or the mysterious. Although by nature generous they have at heart a curious dread of poverty and for that reasons do not allow their generous instinct to get the better of them unless they are under the influence of someone they love. In such a case they become easily influenced and are likely to give away all they possess.
Money has no value in their eyes. It is something to be used, or as a means to an end and nothing more.`,

    generalHealth: `Health: In health their greatest danger is more mental than physical; worry break down persons in this Sign more easily than those born in other parts of the year. Through being over-anxious they often bring on despondency and melancholy whit impairs the digestive organs, inclining them to nervous disorders and in many cases to paralysis. The lungs are also likely to be delicate; they are more inclined to get attacks of consumption than any other class. The skin of the body exudes perspiration easily, especially the hands and feet. Growths and tumours in the intestines are also typical diseases of this Sign.`,

    generalFinance: `Finance: From February 19th to March 1st the Sun is entering to the Sign of Pisces whose ruler is Jupiter (Negative). From February 19th the influence of Saturn is dying out and every day to March 21st the influence of Jupiter is increasing and becoming more beneficial.
Persons born between February 19th to March 21st appear to be able to make a great deal out of their lives provided their ambition is awakened.
We must, however, bear in mind that as the influence of Jupiter in this part of the year is in its negative House in the Zodiac it is more the mental side of the ambitions that are called into being.
Persons born in this period will consequently be more ambitious mentally than physically. They will dream great dreams of what they want or expect themselves to be and often lack the continuity of purpose or physical effort to achieve their results.
It is, in consequence, what might be called an uncertain Sign for finance and many "ups and downs" of fortune will threaten persons born in this period unless they have schooled themselves to follow out their ambitions to a climax.
If persons born in this period of the year have mastered their natural inclination towards lack of continuity of purpose there is no position in life they may not attain for great opportunities will be given them from time to time.
They will, however, be more or less careless in money matters and not inclined to save up for a "rainy day". They are often found to '"waste their substance" and face poverty and loss of position in their advancing years.
If they have been lucky enough to have been born on what may be described as "a strong date" in this period of the year, then all is well and they will be likely to cany out their dreams whether they relate to position or finance.`,

    generalMarriage: `Marriage, Unions, Partnerships, etc.: If you were born between February 19th to March 20th you will find your most harmonious relationship with persons born in your own Sign of Pisces, Third House of Water, February 19th to March 20th , June 21st to July 20th , Cancer, First House of Water, or October 21st to November 20th , Scorpio Second House of Water, and in the seven days of the "cusp" at the beginning or ending of each of these periods.
You are also likely to be attracted to persons born in the part of the year opposite to your own.`,

    numbers: {
      1: {
        character: `Persons Born on March 1st , 10th , 19th , 28th Number 1 people in This Month
If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the Sun and Uranus in the Zodiacal Sign of Pisces 5, House of Jupiter (Negative) Third House of the Triplicity of Water.
The basic foundation of your character and disposition is described in previous pages for persons born in March, but the Sun and Uranus will make your life an eventful one and bring you much publicity.
Your nature under this influence of Uranus and the Sun will make you psychic and intuitive. It would consequently be well for you to follow your intuitions in regard to the changes and opportunities likely to occur during this period. It may, however, bring you much anxiety over money matters at the commencement, but the chances will be in your favour that things will turn out well.
If born on the 1st , 10th , 19th or 28th of March, your career will be one of great possibilities, You will be enterprising and original in whatever you will engage in but inclined to be rather impetuous and headstrong in your actions. You should, as much as possible, develop patience and give yourself more time to think out your plans.
You will incline to be over-optimistic, too hopeful, and rebel against delays or the difficulties that you will have to meet. You will slowly and surely develop a sense of power and self-confidence, which may have been missing in the early years of your life, and it will be well for you to develop this feeling.
Although you have a strong love of home and home-ties, you will often find yourself at variance with members of your family, and you will be liable to losses, owing to their actions.
Taking things all round, you can look forward to having a very eventful life, but one that will bring you success and prominence in the world wherever you live or in whatever your career may be.
The 28th of March, being the first "Number One" in the next Sign of Aries, House of Mars (Positive) gives a still more favourable promise of success than the 1st , 10th or 19th of March. The Sun is in its "exaltation" in this part of year.`,
        finance: `Finance: If you were born on any series of the "number one" in March such as the 1st , 10th , 19th or 28th , you will, as a rule, be fortunate in money matters. You will get unusual opportunities for success, especially in such things as being put into responsible positions in business and as the head of large enterprises. You will have considerable foresight and vision and should follow your own intuition in such matters.
Your greatest difficulty will be in trying to "play second fiddle" to anyone above you. As long as you can be the chief, all will be well, but your nature will be such a dominant one that it will be hard for you to get along in "double harness."`,
        health: `Health: You will be endowed with a strong constitution and great vitality which your natural tendency will be to abuse and take "too much out of yourself." As your Sun is in the mental House of Jupiter, you will be inclined to mentally overwork yourself in endeavouring to carry out whatever your ambition may be. You belong, however, to the "hopeful class of individuals" and can never be kept "under" for long. You will exhaust your nervous energy at times and "run down" like a dynamo that has been overworked.`,
        importantNumbers: `Your most important numbers are the one hyphen four (1-4) and the "three". You should concentrate your efforts to carry out your plans on dates making these numbers or any one of their series, such as the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd , 28th , 30th and 31st .`,
        colors: `To increase your magnetic vibrations and so make yourself more fortunate, you should wear in some part of your clothing the colours of your planets, which are.
The Sun: All shades of gold; yellow, bronze to golden brown. Uranus: All shades of sapphire, dark blues and greys. Jupiter: All shades of violet, mauve or violet-purple.`,
        jewels: `Your "lucky" jewels are diamonds, topaz, amber and sapphire and all stones of gold or yellow colour, as well as those of sapphire blue shade.`,
        climactericYears: `The most important climacteric years in your life are the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd . 28th , 30th , 31st , 37th , 39th , 40th , 48th , 49th , 50th , 57th , 58th , 64th , 66th , 67th , 73rd , 75th and 76th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or "four" in any month of the year, such as the 1st , 4th , 10th , 13th , 19th , 22nd , 28th and 31st , also persons born in the series of the "three".`
      },
      2: {
        character: `Persons Born on March 2nd , 11th , 20th , 29th Number 2 People in This Month
If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology you come under the vibration of the Moon and Neptune in the Zodiacal Sign of Pisces, House of Jupiter (Negative) Third house of the Triplicity of Water.
The foundation of your character and disposition is described in previous pages for persons born in March, but the Moon and Neptune will be inclined to increase the imaginative and artistic tendencies indicated. To make the best out of your talents you should develop your will power and determination and stick to some one set purpose and abandon everything else for it.
Your nature being a peculiarly sensitive one to your surroundings, you should make every possible effort to get into harmonious conditions and you would find it better to have a small home of your own than to live in a palace with persons that jar on your nerves or discourage you.
You will deeply appreciate beauty of scenery, effects of colour and harmony of sound. You will be redress mentally, particularly of the romantic poetic kind, and you should do extremely well in all artistic work, such as painting, music, the cinema or theatre, writing, or any form of art.
You will be very respective to psychic conditions and have decided gifts of inspiration, accompanied by dream of an unusual order.`,
        finance: `Finance: Financial matters will be more or less uncertain. You will be inclined to make money in fits and starts, but you will seldom be able to keep a hold on it, unless you have deliberately developed caution and prudence. Your ideas will be inclined to be too large for your powers of execution and investments you make will not be liable to give you security or peace of mind.`,
        health: `Health: In matters of health you will be a puzzle to all who know you. With you everything relating to illness is mental. If you are happy and contented you will be well. If in unhappy surroundings you will be ill and not all the medicine in the world will effect a cure.
Your principal tendency is towards malnutrition poorness of blood, bad, circulation and a general weakness of the spine, lumbar region and kidneys, all depending on whether you are in a depressed mental condition or not.`,
        importantNumbers: `Your most important numbers are the "two", representing the Moon; the "seven" representing Neptune; and the "three", representing Jupiter. You should make every effort to carry out your plans or engagements on dates that make these numbers or any of their series, such as the 2nd , 3rd , 7th , 11th , 12th , 16th , 20th , 21st , 25th , 29th , and 30th .`,
        colors: `To increase you magnetic vibrations and so make yourself more fortunate, you should wear or have in some part of your clothing, the colours of the Moon, Neptune and Jupiter, which are: The Moon: All shades of creams and pale greens.
Neptune: All shades of dove-greys from the lightest to the darkest. Jupiter: All shades of violet, mauves and purple-violet.`,
        jewels: `Your "lucky" jewels are green jade, pearls, moonstones and opals; also the amethyst.`,
        climactericYears: `The most important or climacteric years in your life are the 2nd , 11th , 20th , 29th , 38th , 47th , 56th , 65th , 74th ; 7th , 16th , 25th , 34th , 43rd , 52nd , 61st , 70th ; 3rd , 12th , 21st , 30th , 39th , 48th , 57th and 66th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons making a "two" or "seven" in any month of the year, such as the 2nd , 7th , 11th , 16th ,20th , 25th and 29 th .
Also those born on the one and four series, such as the 1st , 4th , 10th , 13th . 19th , 22nd , 28th and 31st .`
      },
      3: {
        character: `Persons Born on March 3rd , 12th , 21st , 30th Number 3 People in This Month
If you were born on any one of the above dates, following the rule of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Jupiter in the Zodiacal Sign of Pisces, House of Jupiter (negative) Third House of the Triplicity of Air.
The foundation of your character and disposition is that previously described for persons born in March, but coming so directly under the influence of Jupiter, the general indication will be favourable and promising.
If born on one of the above dates you are under what is called a "double Jupiter" which, in this case, is a very powerful combination. It will give you never rest until you have achieved your purpose.
You will succeed in life to have control over others and have all the elements to make a distinct success in whatever career you may follow.
You will be lucky with partners and associates, provided you are absolute head of the concern.
You will be almost equally practical and idealistic at the same time, with great ideas of philanthropy and humanity to man.
You will become interested in large institutions, such as schools, colleges, hospitals, and should you become wealthy, you will leave large sums to charities of all kinds.
You will be always ready to help the sick, independent of creeds, and you may look for forward to gaining honors in whatever community you may belong to.
You will be fortunate in associations with large concerns, especially those engaged in industry, mining, the opening up and development of land, transportation and possibly shipping.`,
        finance: `Finance: You will be ambitious to make money, but very careful of your name and reputation. You will gain by solid enterprises and have every likelihood of becoming wealthy. You will show an enterprising spirit in all you undertake and will rise to prominence and position in whatever your career may be.`,
        health: `Health: This question largely depends on your own outlook on life. As long as you can continue in active work you will keep well and in a healthy condition. If forced for any reason into inactivity, you will become pleasure-loving and indolent, inclined to put on flesh and let the reins of life easily drop from your hands.
You may not be so successful in home or married life, largely due to your being too dominant in character and not understanding the "other person's" point of view.`,
        importantNumbers: `Your most important number is the "three" and all its series. You should try to cany out your plans and engagements on dates which make this number, such as the 3rd , 12th , 21st and 30th .`,
        colors: `To increase your magnetic vibration and make yourself still more fortunate, you should wear in some part of your clothing, the colours of your planet, which are: All shades of violet, mauve to violet-purple.`,
        jewels: `Your "lucky" jewels are the amethyst, or stones with a violet or purple tinge.`,
        climactericYears: `The most important or climacteric years in your life are the 3rd . 12th , 21st , 30th , 39th , 48th , 57th , 66th and 75th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "three" in any month of the year, such as the 3rd , 12th , 21st and 30th , also those born under the "sixes" and "nines," such as the 6th , 9th , 15th , 24th or 27th in any month.`
      },
      4: {
        character: `Persons Born on March 4th , 13th , 22nd , 31st Number 4 people in This Month
If you were born on any of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of Uranus, Jupiter and the Sun in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
The foundation of your character and disposition is described in previous pages for persons born in March, but the influence of Uranus in this part of the year will be inclined to increase your unconventional or eccentric qualities.
You are likely to meet a considerable amount of sorrows and afflictions in the earlier part of your life, difficulties with your relations, home life and relatives by marriage.
People will be likely to take from your instead of giving to you, and you will have to rely on yourself in carrying out your plans.
You will be original in your ideas and more or less unconventional in your views. You will be very independent in action and inclined to attract criticism in all you do.
You will be strangely drawn to all mystical occult studies and psychical research, and should encounter unusual experiences in such things, but this side of your nature you will be inclined to keep to yourself.
You should try to express your "soul nature" in art, literature and music, or in making purchases of antiques, paintings, etc.
You will have visions, dreams, presentiments and keep intuition about people and things.`,
        finance: `Finance: Your extreme prudence and distrust of others will be your protection in financial matters. You will be more likely to inherit money or property than make it yourself, and if so you will endeavour to guard it carefully, rather than attempt to increase it.
You could, however, be very successful in developing some gift in the form or art, literature, music or invention, or scientific research.`,
        health: `Health: In matters relating to health you will become your own doctor. You will develop peculiar views regarding diet and the right way of living. You will run the risk of being considered "a crack" in such things and will cause friction and annoyance, especially in your home circles, as you will be inclined to force your views on other persons.`,
        importantNumbers: `Your most important numbers are the four hyphen one series (4-1) combined with the "threes", and you should endeavour to carry out everything important to you on dates making these numbers, such as the 1st , 3rd , 4th , 10th , 12th , 13th , 19th , 21st , 22nd , 28th , 30th , and 31st .`,
        colors: `To increase your magnetic vibrations and make yourself more fortunate, you should wear in some part of your clothing, the colours of your most important planets, such as: Uranus: All shades of sapphire-blue and greys.
The Sun: Gold, yellow, bronze to golden-brown. Jupiter: Violet, mauve and violet-purple.`,
        jewels: `Your "lucky" jewels are the sapphire, all dark blue stones, diamonds, the topaz, amber and the amethyst.`,
        climactericYears: `The most important or climacteric years in your life are the 1st , 4th , 19th , 13th , 19th , 22nd , 28th , 31st , 40th , 46th , 49th , 55th , 58th , 64th , 67th , 73rd .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "one" or "four" in any month of the year, such as the 1st , 4th , 10th , 13th . 19th , 22nd , 28th and 31st .`
      },
      5: {
        character: `Persons Born on March 5th , 14th , 23rd Number 5 People in This Month
If you were born on any one of the above dates, following the rules of Zodiacal Astrology and my system of Chaldean Numerology, you come under the vibrations of the planet Mercury in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Water Triplicity.
The foundation of your character and disposition will be that described for persons born in March, but the influence of Mercury in this part of the year with the beneficent vibrations of Jupiter, will lessen any of the bad tendencies given in that description.
You will be either a great success or a great failure, depending completely on whether you develop the strong side of your character or allow the weaker to dominate.
If you develop the strong side, you will have uncommon intellectual gifts, great adaptability to any class of work that interests you, a versatile understanding of things in general, very ingenious and inventive, with a ready wit and a quiet way of turning difficulties to your own account.
If the weaker side of the character is allowed to rule, you will stick at nothing long: you will be a "jack of all trades," but master of none. You will gamble with opportunities, money and position, and lose all in doing so. You will be inclined to self-indulgence of all kinds and ruin the good intellect you started with.
If you develop the better side of your nature you will have a keen intuitive perception of people and things and a method of acquiring a vast store of knowledge.
Persons born on the 5th , 14th or 23rd of March as a rule change their residence frequently. They hate being ties down or to have to live in one home for any length of time. They are always ready to move or to travel and generally find some excuse for doing so.`,
        finance: `Finance: In spite of the brilliant talent, persons born on these dates are endowed with, they seldom die rich. Money seems to melt in their hands and they rarely, if ever, make provision for their advanced years.
In money matters you will have good ideas in speculation, you will dearly like a gamble and will always be ready to take a risk. Money, however, will not remain in your hands, and you will have many financial "ups and downs".`,
        health: `Health: You will be inclined to suffer from "nerves", and to become irritable in the face of opposition. This you should endeavour to control, as it will be a detriment to any mental pursuit you may wish to develop. All this will have a bad effect on your health and may threaten a nervous mental breakdown if you do not make an effort to keep your nerves under absolute control.`,
        importantNumbers: `If you were born on March 5th , 14th , or 23rd , your most important numbers are the "five" and the "three", and all their series, and you should try and carry out your plans on dates making these numbers, such as the 3rd , 5th , 12th , 14th , 21st , 23rd , and 30th .`,
        colors: `You will be adaptable to all colours, but light shades with a touch of violet or mauve will be the most suitable for you.`,
        jewels: `Your "lucky" jewels are diamonds and all glistening or brilliant stones.`,
        climactericYears: `The most important or climacteric years in your life are the 5th , 14th , 23rd , 32nd , 41st , 50th , 68th and 77th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "five" in any month of the year, such as the 5th , 14th , 23rd , also the 3rd , 12th , 21st and 30th .`
      },
      6: {
        character: `Persons Born on March 6th , 15th , 24th Number 6 People in This Month
If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of the Planet Venus, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
The foundation of your character and disposition is that previously described for persons born in March, but because of the favourable influences of the combination of Venus and Jupiter in this period of the year, you are likely to escape any of the bad indications that may have been given.
You will be attracted to the beautiful in all things. You will be a lover of music, painting, poetry, literature, sculpture, the fine arts and the theatre, and you could make a name in any one of these things.
You will be emotional, extremely sympathetic to the call of suffering and if well off, you will give generously for the relief of others.
You will make many friends and have great devotion shown to you. You will be fond of society and entertaining; a lover of ease, comfort and beautiful surroundings.
You are likely to have many romances and love affairs, and you will be more or less changeable in matters of affection.
There will be every likelihood of more than one marriage and unusual experience in married life.`,
        finance: `Finance: As a general rule you will be lucky in money matters. Money will come to you in unexpected ways, also presents and costly jewels. Owing to your naturally improvident disposition, you will run the danger of passing your advanced years in an impoverished condition unless you make up your mind to put money aside for "a rainy day."
As well as creative art, you would make money in any work or business dealing with what are called the "luxury trades", such as catering, entertaining, organizing banquets, high class restaurants, hotels or shops selling antiques or works of art of any kind.`,
        health: `Health: You will have a splendid healthy constitution during your early years, but you run the risk of ruining your health by luxurious living unless you keep yourself well under control.
In your advanced years, you will be likely to suffer from some form of heart disease and high blood pressure.`,
        importantNumbers: `Your most important numbers are "sixes" and "threes" and all their series, and you should endeavour to carry out your plans on dates making these numbers, such as the 3rd , 6th , 12th , 15th , 24th and 30th .`,
        colors: `To increase your magnetic vibrations, and so make yourself more fortunate, you should wear in some part of your dress or clothing, the colours of Venus of Jupiter, which are Venus: All shades of blue, from the lightest to the darkest. Jupiter: Violet, mauve or purple-violet.`,
        jewels: `Your "lucky" jewels are the turquoise and all blue stones.`,
        climactericYears: `The most important or climacteric years in your life are the 6th , 15th , 24th , 33rd , 42nd , 51st , 60th and 78th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "six" or a "three" in any month of the year, such as the 6th , 15th , 24th , 3rd , 12th , 21st and 30th .`
      },
      7: {
        character: `Persons Born on March 7th , 6th , 25th Number 7 People in This Month
If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, You come under the vibrations of Neptune, the Moon and Jupiter, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicty of Water.
The foundation of your character and disposition will be that described for persons born in March, but the influences of Neptune and the Moon will increase the qualities described and bring the most unexpected episodes and events into your life.
You will have high ideals and great ambitions, but rather inclined to live an independent unconventional life.
You will be broad minded, but will have curious ideas about religion and must have your own way about looking at such matters.
You will have a distinct bent towards investigation of the mysterious in nature, and will be likely to have vivid dreams and unusual inspiration in whatever your work may be.
Your nature will be one full of contradictions. You will be both strong and weak at the same moment, Other person could easily lead you if they can touch your idealism, but you cannot be driven, for on such an occasion you would show the most obstinate determination even against your own interests.
You will be philanthropic and charitable, very desirous of helping institutions who are occupied in humanitarian work.`,
        finance: `Finance: Financial matters as the result of your own mental efforts will be favourable to you. You will create money in whatever your line of work may be. You will be inclined at times to be over-generous or allow others to make financial success from your ideas.
You could succeed in shipping products from one country to another, in gaining money in lands far from your place of birth, but especially in developing the inspirational side of your nature and by following your intuitions.`,
        health: `Health: You will not be as strong physically as you will appear. You will live under high mental tension and have at intervals, spells of fatigue and exhaustion difficult to shake off. You will desire change, love the sea and wide expanses of water. An ocean voyage would always set you up when run down or feeling ill.`,
        importantNumbers: `Your most important numbers are the "seven" "two" and "three" and all their series. You should do everything important for you on dates making these number, which are the 2nd , 3rd , 7th , 11th , 12th , 16th , 20th , 21st , 25th , 29th and 30th .`,
        colors: `To increase your magnetic vibrations you should wear the colours associated with your planets or at least have them in some part of your clothing. These colours are: Neptune: All shades of dove-grey, especially those known as "electric greys". The Moon: All shades of greens and creams. Jupiter: All shades of violet, mauve and purple-violet.`,
        jewels: `Your "lucky" jewels are green jade, moonstones, pearls, amethysts and purple stones.`,
        climactericYears: `The most important or climacteric years in your life are the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , 34th , 38th , 43rd , 47th , 52nd , 56th , 61st , 65th and 70th .`,
        magneticAttraction: `You will find a strong magnetic attraction of persons born on dates making a "seven" or "two" in any month of the year, such as the 2nd , 7th , 11th , 16th , 20th , 25th , 29th , also persons born on the series of "one" and "four".`
      },
      8: {
        character: `Persons Born on March 8th , 17th , 26th Number 8 People in This Month
If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Saturn and Jupiter, in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
The foundation of your character and disposition is that previously described for persons born in March, but the influence of Saturn in this part of the year will rather tend to increase the more serious side of your nature.
The natural tendencies of the planetary combinations governing a birth on March 8th , 17th or 26th would be to make life very hard and difficult through the early years, but from about the 33rd or 35th year, there would be every likelihood of considerable improvement.
If you were born on any one of the above dates you should brace yourself to meet many secret sorrows and disappointments which will be continually cropping up, but by the development of strength of will, determination and never letting go of your ambition, you run the chances in the end of surmounting all difficulties.
You may expect to have heavy responsibilities placed on your shoulders, and you will have difficulty in holding situations or positions, not because of lack of ability on your part, but on account of circumstances likely to crop up to rob you of merit and reward.
Marriage is not likely to be a very happy experience unless you accept it from a philosophical standpoint.
Persons born on any one of these dates have an unusually strong sense of duty, also a deep love of home and family. They have high ideals, especially for the masses, and are often found associated with large plans for the uplift of humanity.`,
        finance: `Finance: As a rule persons born in the above combinations, rarely if ever regard wealth from a personal standpoint. They desire money for whatever the cause is they have at heart-and they generally gain it.
If you were born on the 8th , 17th or 26th of March you should avoid rashness in your own personal expenditures and avoid speculative risks.
You will be likely to meet with sudden reverses of fortune at all times in your life and should endeavour to keep a "nest egg" in reserve for the eventualities that may happen.`,
        health: `Health: Mental conditions will largely influence you in all matters of health. Any worry or anxiety will easily break down your resistance to disease, and cause you to have spells of melancholy and depression.
You will be prone to falling a victim to long protracted colds, chills and weak circulation of the blood.
You should live in dry climates and have as much outdoor life, travel and change as possible, or you will be liable to suffer with arthritis and rheumatism, especially in the region of the feet, ankles and knees.`,
        importantNumbers: `Your most important numbers are "fours", "eights" and "threes" and all their series, such as the 3rd , 4th , 8th , 12th , 13th , 17th , 21st , 22nd , 26th , 30th , and 31st .
The number I would advise you to use, for your own personal advantage, is the "three" and all its series and such dates as the 3rd , 12th , 21st and 30th .`,
        colors: `You will very likely find yourself having a decided leaning toward wearing dark colours, but if you do I would strongly advise you to always have some touch of violet, mauve or violet-purple in your wearing apparel.`,
        jewels: `Your fortunate jewels are black pearls and black diamonds, but I would advise you to use the amethyst or sapphire with the other combinations.`,
        climactericYears: `Important or climacteric years in your life are the 4th , 8th , 13th , 17th , 22nd , 26th ," 31st , 35th , 40th , 44th , 49th , 53rd , 58th , 67th , 71st , 76th , and 80th .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "four", "eight" or "three" in any month of the year, such as the 4th , 13th , 22nd , 31st ;8th , 17th , 26th and the 3rd , 12th , 21st and 30th .`
      },
      9: {
        character: `Persons Born on March 9th , 18th , 27th Number 9 People in This Month
If you were born on any of the above dates, following the rules of Astrology and my system of Chaldean Numerology, you come under the vibrations of Mars and Jupiter in the Zodiacal Sign of Pisces, House of Jupiter (Negative), Third House of the Triplicity of Water.
The foundation of your character and disposition is described in previous pages for persons born in March, but the influence of Mars in this part of the year will give you power to combat and overcome any of the bad indications given. It also will increase the robustness of your condition and help you to resist threatened illnesses.
The influence of Mars in this part of the year" will, however, make you at times rash and impulsive in thought and action. You will be restless, making changes in occupation or career. You will be inclined to rush into new schemes without due thought.
You should learn to control your temper, especially over little things and try to be tolerant with those around you and with those with whom you work.
You will be very ambitious, with an intense desire to make yourself independent, and for this reason you will strain every effort to accumulate riches and run risks in doing so.
You will have great courage in trials and misfortunes up to a certain point, but if your courage should at any time fail you, you will be inclined to become gloomy, morose and irritable and take some course of action that you would afterwards regret.
If you should engage in business or industry, you will rise to a position of authority, but may not be able to keep it on account of your tendency to make enemies.
You will have a very magnetic personality; you would meet with success in any form of public career such as a writer, speaker, preacher or as a leader in any big movement. The 18th and 27th of March are as a rule especially favourable dates to be born on.`,
        finance: `Finance: Unless you were born into a strong position regarding wealth you may expect to meet with many fluctuations of money in ordinary life. You would not be lucky in speculation or investments, but could always do better for others than for yourself. If possible you should buy an annuity for your advanced years for the simple reason that you will not have much desire to save money or put it aside for yourself.`,
        health: `Health: If you were born on March 9th , 18th or 27th , in your early years you will escape all serious illnesses, but in the run of the forties considerable changes are likely to take place in your constitution. If you study yourself carefully during this period, especially in matters of diet, you may be able to build yourself up for another period. If not, you will liable to experience many serious ailments, such as trouble with the liver and kidneys, stoppages in the intestines, weakness of the heart and much experience of the surgeon's knife.`,
        importantNumbers: `Your most important numbers and dates are "nines" and "threes" and you should endeavour to carry out your plans on dates making these numbers, such as the 3rd , 9th , 12th , 18th , 21st , 27th and 30th .
Unfavourable dates for you are "fours" and "eights" and all their series, such as the 4th , 8th , 13th , 17th , 22nd , 26th and 31st .`,
        colors: `The colours most suitable for you are : Mars: All shades of crimson, reds or rose. Jupiter: All shades of violet, mauve or violet-purple.`,
        jewels: `Your "lucky" jewels are rubies, garnets, bloodstones and amethysts.`,
        climactericYears: `The most important or climacteric years in your life are the 9th , 18th , 27th , 36th , 45th , 54th , 63rd , 72nd and 81st .`,
        magneticAttraction: `You will find a strong magnetic attraction to persons born on dates making a "nine" in any month of the year, such as the 9th , 18th , 27th and in a secondary degree with those born on the series of "threes" and "sixes", such as the 3rd , 6th , 12th , 15h, 21st , 24th and 33th , also with those born on the 1st , 10th , 19th or 28th .`
      }
    }
  },

  april: null, may: null, june: null, july: null, august: null,
  september: null, october: null, november: null, december: null
};

export function resolveMonthData(monthIndex: number, psychicNumber: number = 1) {
  const keys = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const key = keys[monthIndex - 1] || 'january';
  const raw = MONTHLY_CHRONICLE[key];

  if (!raw) {
    const monthName = new Date(2026, monthIndex - 1).toLocaleString('default', { month: 'long' });
    return {
      ready: false,
      monthName,
      generalInfluence: 'The Monthly Chronicle for this month is being inscribed by the Chronicler. Check back after the next celestial update.',
      monthlyCharacter: 'Character analysis for this month is currently in transit.',
      financialOutlook: 'Financial outlook data is being calculated.',
      healthCautions: 'Health caution data is being compiled.',
      luckyNumbers: '', colors: '', jewels: '', climactericYears: '', magneticAttraction: ''
    };
  }

  const num = raw.numbers?.[psychicNumber] || null;
  const monthName = new Date(2026, monthIndex - 1).toLocaleString('default', { month: 'long' });

  // Segmenting according to requested categories
  return {
    ready: true,
    monthName,
    generalInfluence: raw.generalInfluence,
    monthlyCharacter: [raw.generalCharacter, raw.generalMarriage, num?.character].filter(Boolean).join('\n\n'),
    financialOutlook: [raw.generalFinance, num?.finance].filter(Boolean).join('\n\n'),
    healthCautions: [raw.generalHealth, num?.health].filter(Boolean).join('\n\n'),
    // Layer 4 fields
    luckyNumbers: num?.importantNumbers || '',
    colors: num?.colors || '',
    jewels: num?.jewels || '',
    climactericYears: num?.climactericYears || '',
    magneticAttraction: num?.magneticAttraction || ''
  };
}
