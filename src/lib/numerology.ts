// src/lib/numerology.ts

export const KUA_DIRECTIONS: { [key: number]: any } = {
  1: {
    Success: 'SE',
    Health: 'E',
    Family: 'S',
    'Personal Growth': 'N',
  },
  2: {
    Success: 'NE',
    Health: 'W',
    Family: 'NW',
    'Personal Growth': 'SW',
  },
  3: {
    Success: 'S',
    Health: 'N',
    Family: 'SE',
    'Personal-Growth': 'E', 
  },
  4: {
    Success: 'N',
    Health: 'S',
    Family: 'E',
    'Personal Growth': 'SE', 
  },
  5: { // Kua 5 is special and splits by gender
    male: { // Defaults to Kua 2
      Success: 'NE',
      Health: 'W',
      Family: 'NW',
      'Personal Growth': 'SW',
    },
    female: { // Defaults to Kua 8
      Success: 'SW',
      Health: 'NW',
      Family: 'W',
      'Personal Growth': 'NE',
    },
  },
  6: {
    Success: 'W', 
    Health: 'SW',
    Family: 'NE',
    'Personal Growth': 'NW',
  },
  7: {
    Success: 'NW',
    Health: 'SW',
    Family: 'NE',
    'Personal Growth': 'W',
  },
  8: {
    Success: 'SW',
    Health: 'NW',
    Family: 'W',
    'Personal Growth': 'NE',
  },
  9: {
    Success: 'E',
    Health: 'SE',
    Family: 'N',
    'Personal Growth': 'S',
  },
};

export const KUA_ATTRIBUTES: { [key: number]: any } = {
  1: { element: 'Water', colors: 'Blue, Black, Grey', season: 'Winter' },
  2: { element: 'Earth', colors: 'Red, Pink, Maroon', season: 'Late Summer' },
  3: { element: 'Wood', colors: 'Green, Brown', season: 'Spring' },
  4: { element: 'Wood', colors: 'Green, Brown', season: 'Spring' },
  // Kua 5 defaults to 2 for males and 8 for females, which are handled in the generation function.
  6: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  7: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  8: { element: 'Earth', colors: 'Yellow, Beige, Brown', season: 'Late Summer' },
  9: { element: 'Fire', colors: 'Red, Purple, Orange', season: 'Summer' },
};


export const NUMBER_MEANINGS = {
  1: { title: "Communication", description: "Represents communication, expression, and the flow of ideas. It's the number of origin and individuality." },
  2: { title: "Intuition & Sensitivity", description: "This number governs intuition, sensitivity, and partnerships. It's a number of cooperation and diplomacy." },
  3: { title: "Action & Intellect", description: "Signifies action, creativity, and intellectual pursuits. It's a dynamic number associated with planning and execution." },
  4: { title: "Intellect & Wisdom", description: "Represents intelligence, order, and practicality. People with this number are often seen as builders and organizers." },
  5: { title: "Emotional Balance", description: "This is the central number, representing emotional balance, freedom, and change. It connects the mind, heart, and body." },
  6: { title: "Home & Family", description: "Governs home, family, and responsibility. It's a number of nurturing, creativity, and domestic harmony." },
  7: { title: "Spirituality & Learning", description: "Relates to spirituality, learning, and analysis. It signifies a quest for deeper meaning and truth." },
  8: { title: "Material Success", description: "Associated with material success, power, and finance. It represents ambition, organization, and worldly achievement." },
  9: { title: "Humanitarianism", description: "The number of humanitarianism, idealism, and completion. It represents a love for all mankind and a global consciousness." },
};

export const REPEATED_NUMBER_MEANINGS: { [key: number]: { [key: number]: string } } = {
    1: {
        1: "You face difficulty in communication & expression (verbal). You can communicate by other means, through art, craft, design, sculpturing, cartoons, graffiti, painting, writing, dancing etc. But you are never able to soak yourself into anything; you touch the crust but never reach the core. You find it difficult to understand others' point of view. You have a good financial level, as 6 & 8 are also in this plane.",
        2: "You are good in Expression & Communication. You have an impartial & balanced outlook towards everyone in life. Your way of living life is very neutral. You understand others' point of view as well as your own. You are good in financial matters. This is a perfect placement of this pair in a chart.",
        3: "You are good in Expression, very sensitive & caring. This can indicate a number of extra-marital relations (the concept of 'Pati, Patni & Wo'). Sometimes you are too much talkative and never stop talking, but at other times you can be very quiet & introvert, as you have both extremes in your behavior. You keep on changing your behavior according to time & situations. You will have materialistic growth if other two numbers are supporting. Generally, you are happy and a good entertainer in life. You love going out of the house.",
        4: "You have a blockage at the Vishuddha or Throat chakra, hence it is extremely difficult for you to open your heart out verbally. You are very sensitive & caring by nature but are mostly misunderstood. You are always on your toes, anxious, and overly energetic, taking rest or getting relaxed very rarely; you are always hyperactive. Only materialistic desires will be found & you have more focus on wealth accumulation than anything else in your life.",
        5: "You face too many difficulties in expressing your emotions out verbally. You are a very much misunderstood personality. You direct your energy of expression into other forms, like writing, painting, dancing, art, sculpture, and creativity. You may have a tendency to over-indulge in alcoholism, drugs, food, many relationships, or any other types of addictions.",
    },
    2: {
        1: "You are caring & intelligent by nature and are easily hurt by others. You easily understand & gauge people just by looking at them. You can easily distinguish between sincere & insincere people. If only the number 2 is present in the plane, you have an average mindset, but if the other two numbers are also there, you have high intellect. You do well in the philosophical, judicial & literary fields.",
        2: "You are high in Intelligence, Sensitivity & have a double Intuition Level (as 2 appears 2 times). You have an innate ability to get into someone's Mind & Soul. You can easily scan the Mind & Soul of someone & find out about their feelings, motive & purpose. If you only have two 2s in the plane without 4 & 9, it makes you highly skeptical & very negative. This also makes you deprived of positive energy and enthusiasm; the level of Chi or Life Driving Force in you is very weak, which will eventually affect both your physical & mental health. If 4 & 9 are present along with 2, then you will be good at memorizing things & highly intellectual.",
        3: "Having more 2s in your chart makes you more intuitive & sensitive. But sensitivity & intuitiveness are good up to a limit; after a point, these two properties can make a person maniacal. You become too vulnerable or defenseless & are hence easily hurt & affected by others. As a result, you prefer to be alone & aloof, away from the public, to protect yourself from being hurt. You lock yourself in your own mental world as you don't find the people around you in the physical world capable enough to understand you. You become an introvert regardless of your basic behavior and tendencies.",
        4: "Your patience level is very low. You have a tendency to overreact over issues which are irrelevant & meaningless. Extreme behavioral sensitivity is observed which can lead to self-hurting behavior.",
        5: "This is a rarely found set in a grid. If you have 5, 6, or more 2s with no support from 4 & 9, then the condition will be unfortunate, making your life very difficult to live and adjust to. Too much arrogance in your behavior is seen, along with sarcasm & rudeness. Self-doubt & lack of confidence are also seen. In this century, people can have six 2s in their chart (e.g., 22 Feb 2022).",
    },
    3: {
        1: "You experience STRESS & HURT if there is only one 3. You have a good creative brain with an excellent memory. You are DOWN TO EARTH in your approach towards life and have a POSITIVE MINDSET in achieving any task or goal. You keep inspiring others with your honesty & optimism. You are totally focused on your growth and your goals. You find it DIFFICULT TO DEAL WITH COMPETITIONS.",
        2: "Intelligence, sensitiveness & intuitiveness are the qualities associated with you. You have a balanced mentality & strong personality. You have good compatibility & an adjusting nature, hence you emerge as a good friend. You can easily sense the motive of other people around you. You develop a concept of life & evolve spiritually with faith & devotion when there is support of 5 & 7. You have an active, imaginative & very creative brain. You enjoy breaking rules or contracts & are strange or unconventional in nature. You can emerge as a path breaker or trend maker. Your power of creativity makes you a trendsetter. You know very well how to control your innovative mind and have the power of projecting expression through words, so you excel professionally as a writer, artist, actor, etc.",
        3: "You live in an IMAGINARY BUBBLE OR DAYDREAMING STATE. You often find it hard to relate with others and are not a good listener. You can appear self-engaged & isolated. You have brilliant mental ability, but you spend your life in the world of dreams. You can be quarrelsome & unimportant at times. You have potential for clairvoyance & spiritualism.",
        4: "You can be unrealistic, fearful & over-imaginative (an illusionist). These qualities make it hard for you to function well in everyday life. This combination is rare to find in charts. You are sensitive, imaginative & intuitive in nature, a daydreamer who loves to stick in that world. High intelligence, high intellect, high spirituality & high intuitive abilities are seen if 3 is supported by 5 & 7 in this plane. You can also be intolerant, irresponsible & thoughtless. Other supportive numbers are not of much help in the case of too many 3s."
    },
    4: {
        1: "You are good at physical hard work. You are an intelligent person with a logical & rational mind. You perform well in tasks done by hand (Hands Occupation / Work). You are imaginative & impatient by nature. You are a good organizer of others & have the ability to carry out plans with perfection. You deeply connect with music, melodies, tunes, art, craft & handicrafts. You take your decisions very carefully and think before getting involved in anything. But these qualities are used on the basis of other numbers present in your chart. You earn by your traditional occupations.",
        2: "You have a tendency for OVERINDULGENCE in physical & materialistic actions at the cost of other deeds. You have good organizing skills. You are a good task initiator & fantastic as a completer. You are reliable, precise & organized. You are good in art & craft by hand. You can also be rigid, stubborn, have low tolerance power, and be judgmental & inflexible. You possess a high level of intelligence, pride because of that intelligence, and a superiority complex.",
        3: "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career.",
        4: "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career."
    },
    5: {
        1: "You have well-balanced emotional sensitivity. You are concerned, supportive & kind-hearted. You are motivating & inspiring for others. The company of 3 & 7 makes you wise in decision making.",
        2: "You can be uncontrollable, and governing & dealing with you is challenging. You are passionate, strong-minded, lively, impatient & flexible. You are a risk-taker, adventurous, self-confident, determined & a show-off. You are filled with a high level of determination & eagerness. You can have frequent emotional outbursts which later lead to repentance. You can be a problem creator at work & home. You also show laziness in behavior & are sensual by nature.",
        3: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
        4: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
        5: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly."
    },
    6: {
        1: "You show love, regard & care for your family, relations & loved ones. You enjoy your home duties & have creative or innovative abilities. You are a DECENT PARENT and provide suggestions in family matters when required. You can be insecure, worried & afraid about being left alone in life (e.g., death of a life partner). You are a lucky person but with narrow-mindedness. You will have financial stability, a good lifestyle with fewer discomforts, if 8 & 1 are also in your chart. If 8 & 1 are not there, then only financial security will be there. You are family-oriented & love to work in an enjoyable & friendly environment.",
        2: "You are highly creative, but lack self-confidence & believe less in your work & your abilities. You take unnecessary tension for your family & family members, which makes your energy drained/exhausted & hence you feel tired most of the time. You are too stressed all the time because of your thinking style. You are overprotective by nature, hence you keep interfering in the lives of your family members (especially towards your kids). You can provide an obstruction to your children in becoming self-dependent. Your life is filled with creativity, activeness & beauty. You require constant support & encouragement from your family & friends.",
        3: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
        4: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
        5: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen)."
    },
    7: {
        1: "You learn the lessons of your life through RELATIONAL LOSS or LOSS OF LOVED ONES, LOSS OF BELONGINGS, or on the COST of HEALTH & WELL-BEING. With the lessons you learn throughout your life & losses, you become more inclined towards the spiritual field & spiritual practices. If supported by 3 & 5, you start your quest for the ultimate reality of life & precision or perfection in the journey of life. Your career can be in a spiritual or humanitarian field. If 3 & 5 are there, your behavior is rigid.",
        2: "You gain your knowledge & wisdom at the cost of your loved ones, your health, or your monetary losses. This push will eventually take you to the path of occultism, spirituality & meditation. You have a technical (IT & Computers) & analytical (Mathematical & Reasoning) brain. You are good at minute, odd & baseless criticism. You are spiritual but have a tendency for show-off & bragging by nature. You have the potential to bring finance & prosperity into your life.",
        3: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
        4: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
        5: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life."
    },
    8: {
        1: "You are systematic, reliable & good with finer details. You are a good task initiator but a bad task completer. You have a constantly active mind, hence you have restlessness in your behavior. As a result, you have a constant mystery-resolving & daring attitude. With the support of 1 & 6, you can have good materialistic success.",
        2: "You are good in business & financial matters. You are entertaining, intellectual, clever & shrewd. You are good in analysis, evaluation & taking advantage of any opportunity. You have keen observation & are thorough in your approach. You love to have experiences by yourself and never count upon others' stories. You are very rigid & inflexible in your approach & the decisions you make.",
        3: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
        4: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
        5: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless."
    },
    9: {
        1: "You are ambitious, determined & have a very strong wish for self-improvement. If supported by 4 & 2, then you can be humorous, intellectual, affluent, prosperous, spiritual & divine. If there is no support of 4 & 2, then there will be a tussle in all areas of your life.",
        2: "You have a 'Master Number' impact, but the Master Number activation is required. You are idealistic & brainy in your life. You love to learn about everything around you. You can do too much criticism of others. You have a sympathetic attitude & you love to work in fields in which much use of the brain is required. It is necessary for you to get along with people of all levels of society.",
        3: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle your life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
        4: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
        5: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too."
    }
};

/**
 * Reduces a number to a single digit by summing its digits repeatedly.
 * @param n - The number to reduce.
 * @returns The single-digit number.
 */
const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

/**
 * Calculates the Psyche Number from the day of birth.
 * This function does not preserve master numbers.
 * @param day - The day of birth (1-31).
 */
export const calculatePsyche = (day: number): number => {
  return reduceToSingleDigit(day);
};

/**
 * Calculates the Destiny (Life Path) Number from the full date of birth.
 * This function does not preserve master numbers.
 * @param day
 * @param month
 * @param year
 */
export const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

/**
 * Calculates the Kua Number based on year and gender.
 * @param year - The four-digit year of birth.
 * @param gender - 'male' or 'female'.
 * @returns The Kua Number.
 */
export const calculateKua = (year: number, gender: string): number => {
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const reducedYearSum = reduceToSingleDigit(yearSum);
  
  let kuaResult: number;
  let isCenturyAfter2000 = year >= 2000;

  if (gender.toLowerCase() === 'male') {
      kuaResult = isCenturyAfter2000 ? 9 - reducedYearSum : 11 - reducedYearSum;
  } else { // female
      kuaResult = isCenturyAfter2000 ? reducedYearSum + 6 : reducedYearSum + 4;
  }

  let finalKua = reduceToSingleDigit(kuaResult);
  
  // As per original document, for Kua 5, males default to 2 and females to 8
  if (finalKua === 5) {
      finalKua = gender.toLowerCase() === 'male' ? 2 : 8;
  }
  
  // Kua can be 0, which should be 9
  if (finalKua === 0) {
    finalKua = 9;
  }
  
  return finalKua;
};

export const ARROWS_OF_STRENGTH = [
  {
    name: "Arrow of Planning",
    numbers: [4, 3, 8],
    description: "This is the 1st Vertical Row, indicating the Arrow of Planning & Proper Execution. It gives you shrewdness, cunningness, and intelligence. Your nature can be unethical, like a 'Dirty Player' who doesn't go by the rules. You possess a high degree of intelligence and can be a politician."
  },
  {
    name: "Arrow of Willpower",
    numbers: [9, 5, 1],
    description: "This is the 2nd Vertical Row, indicating the Arrow of Success. You exhibit stubbornness & persistence in your behavior. This behavior leads you towards being victorious in life. You possess a high level of determination and are not hesitant in expressing your opinion about everything."
  },
  {
    name: "Arrow of Action",
    numbers: [2, 7, 6],
    description: "This is the 3rd Vertical Row, also known as the Arrow of Outlook / Action. It signifies a life of activity and practical engagement with the world."
  },
  {
    name: "Arrow of Intellect",
    numbers: [4, 9, 2],
    description: "This is the 1st Horizontal Row, also known as the Brain / Mental plane. You are a thinker with a powerful intellect, an orderly and tidy mind, and excellent memory. You are not easily fooled and are considered a very brainy person."
  },
  {
    name: "Arrow of Spirituality",
    numbers: [3, 5, 7],
    description: "This is the Central Horizontal Row, indicating the Arrow of Emotional Harmony, Emotions, Spiritual Ethics & Values. It leads to contentment, calmness & inner peace after 30-40 years of age. You may come to the field of spirituality after seeing too much trouble in life. It is also known as the Heart / Emotional plane."
  },
  {
    name: "Arrow of Prosperity",
    numbers: [8, 1, 6],
    description: "This is the 3rd Horizontal Row (at the bottom), known as the Action / Practical plane. It indicates a materialistic or commercial success and prosperity with practicality. You are always interested in superficial life & success, and never inclined towards a higher purpose in life. If you have few or no numbers in the upper two rows, you will be cold towards emotions & only focused on self-benefit."
  },
  {
    name: "Arrow of Determination",
    numbers: [2, 5, 8],
    description: "This is a Diagonal Row indicating a strong will and determination. It signifies your resolve and drive to see things through to the end."
  },
  {
    name: "Arrow of Emotional Balance",
    numbers: [4, 5, 6],
    description: "This is the 1st Diagonal Row. You are humanitarian, helping & compassionate by nature, and this often leads you to make your career out of the same. You are psychic, intuitive, sensitive, emotional, caring & understanding. You easily understand the demands of the people around you. You are quite, gentle, generous, shy, and introverted by nature, especially in your young age."
  }
];

export const ARROWS_OF_WEAKNESS = [
  {
    name: "Arrow of Confusion",
    numbers: [4, 9, 2],
    description: "The absence of numbers on the Mental Plane (4, 9, 2) creates the Arrow of Confusion. This may indicate a struggle with mental tasks and a slower thought process. You are likely a person of action rather than a deep thinker and may need to put in extra effort on intellectual pursuits."
  },
  {
    name: "Arrow of Scepticism",
    numbers: [3, 5, 7],
    description: "The absence of numbers on the Emotional Plane (3, 5, 7) creates the Arrow of Scepticism. You tend to be doubtful of things that cannot be proven with logic and fact. You may have a deep-seated disbelief in spiritual or metaphysical matters and can appear insensitive to the emotional needs of others."
  },
  {
    name: "Arrow of Frustration",
    numbers: [8, 1, 6],
    description: "The absence of numbers on the Practical Plane (8, 1, 6) creates the Arrow of Frustration. You may have many great ideas but lack the practical ability or follow-through to bring them to fruition. This can lead to a sense of frustration with your own inability to manifest your goals."
  },
  {
    name: "Arrow of Indecision",
    numbers: [4, 3, 8],
    description: "The absence of numbers in the Thought Plane (4, 3, 8) creates the Arrow of Indecision. You may lack the ability to think things through methodically, leading to a tendency to hesitate and be indecisive when faced with important choices."
  },
  {
    name: "Arrow of Suspicion",
    numbers: [9, 5, 1],
    description: "The absence of numbers in the Will Plane (9, 5, 1) creates the Arrow of Suspicion or the Arrow of Poor Memory. You may lack determination and willpower, and you might also have a tendency to be forgetful or to doubt the intentions of others."
  },
  {
    name: "Arrow of Apathy",
    numbers: [2, 7, 6],
    description: "The absence of numbers in the Action Plane (2, 7, 6) creates the Arrow of Apathy. You may lack the physical drive to put plans into action, preferring to remain passive rather than actively engaging with the world to achieve your goals."
  },
  {
    name: "Arrow of Disappointment",
    numbers: [4, 5, 6],
    description: "The absence of numbers in this Diagonal Row (4, 5, 6) creates the Arrow of Disappointment. You may experience frequent setbacks and feel that life often lets you down. This can foster a pessimistic outlook and a sense of being unsupported in your endeavors."
  },
  {
    name: "Arrow of Doubt",
    numbers: [2, 5, 8],
    description: "The absence of numbers in this Diagonal Row (2, 5, 8) creates the Arrow of Doubt. You may suffer from a lack of self-belief and constantly question your own abilities and decisions, which can hold you back from reaching your full potential."
  }
];

// Defines the shape of the user data object
export interface UserData {
  day: number;
  month: number;
  year: number;
  gender: string;
}

export type NumerologyData = ReturnType<typeof generateLoShuData>;

/**
 * Generates all numerology data including the Lo Shu Grid and arrows.
 * @param userData - An object with day, month, year, gender.
 * @returns An object containing all calculated results.
 */
export const generateLoShuData = ({ day, month, year, gender }: UserData) => {
  // 1. Calculate all core numbers
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  // We need the original Kua calculation before it's adjusted for '5' to handle special cases
  const rawKua = reduceToSingleDigit(
    gender.toLowerCase() === 'male' 
      ? (year >= 2000 ? 9 : 11) - reduceToSingleDigit(String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0))
      : (year >= 2000 ? 6 : 4) + reduceToSingleDigit(String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0))
  );
  const kuaNum = calculateKua(year, gender);

  // 2. Get Kua Directions
  let auspiciousDirections;
  // Use the raw, pre-adjustment Kua for Kua 5 gender split
  if (rawKua === 5) {
      auspiciousDirections = KUA_DIRECTIONS[5][gender.toLowerCase() as 'male' | 'female'];
  } else {
      auspiciousDirections = KUA_DIRECTIONS[kuaNum];
  }
  
  // 3. Get Kua Attributes
  const kuaAttributes = KUA_ATTRIBUTES[kuaNum] || { element: 'N/A', colors: 'N/A', season: 'N/A' };


  // 4. Aggregate ALL digits for the grid
  const birthDigits = (String(day) + String(month) + String(year))
    .split('')
    .filter(d => d !== '0');
    
  const allDigitsForGrid = [
    ...birthDigits,
    ...String(psycheNum).split(''),
    ...String(destinyNum).split(''),
    ...String(kuaNum).split(''),
  ];
  
  const presentDigits = new Set(allDigitsForGrid.map(d => parseInt(d, 10)));

  // 5. Count frequencies and create grid data
  const counts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
    counts[digit] = (counts[digit] || 0) + 1;
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    gridContent[digitStr] = counts[digitStr] ? digitStr.repeat(counts[digitStr]) : '';
  }

  // 6. Arrange data into a 2D array for rendering
  const gridLayout = [
    [gridContent['4'], gridContent['9'], gridContent['2']],
    [gridContent['3'], gridContent['5'], gridContent['7']],
    [gridContent['8'], gridContent['1'], gridContent['6']],
  ];

  // 7. Determine present arrows of strength
  const arrowsOfStrength = ARROWS_OF_STRENGTH.filter(arrow => 
    arrow.numbers.every(num => presentDigits.has(num))
  );

  // 8. Determine present arrows of weakness
  const arrowsOfWeakness = ARROWS_OF_WEAKNESS.filter(arrow =>
    arrow.numbers.every(num => !presentDigits.has(num))
  );
  
  // 9. Return all calculated data
  return {
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid: gridLayout,
    allDigitsForGrid: allDigitsForGrid,
    numberCounts: counts,
    arrowsOfStrength,
    arrowsOfWeakness,
    auspiciousDirections,
    kuaAttributes,
  };
};






