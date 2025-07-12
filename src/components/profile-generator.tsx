'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import { personalizeReadingAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateLoShuData } from '@/lib/numerology';
import { Skeleton } from './ui/skeleton';

type NumerologyData = ReturnType<typeof generateLoShuData>;

const repeatedNumberMeanings: { [key: string]: string } = {
    "1_1": "You face difficulty in communication & expression (verbal). You can communicate by other means, through art, craft, design, sculpturing, cartoons, graffiti, painting, writing, dancing etc. But you are never able to soak yourself into anything; you touch the crust but never reach the core. You find it difficult to understand others' point of view. You have a good financial level, as 6 & 8 are also in this plane.",
    "1_2": "You are good in Expression & Communication. You have an impartial & balanced outlook towards everyone in life. Your way of living life is very neutral. You understand others' point of view as well as your own. You are good in financial matters. This is a perfect placement of this pair in a chart.",
    "1_3": "You are good in Expression, very sensitive & caring. This can indicate a number of extra-marital relations (the concept of 'Pati, Patni & Wo'). Sometimes you are too much talkative and never stop talking, but at other times you can be very quiet & introvert, as you have both extremes in your behavior. You keep on changing your behavior according to time & situations. You will have materialistic growth if other two numbers are supporting. Generally, you are happy and a good entertainer in life. You love going out of the house.",
    "1_4": "You have a blockage at the Vishuddha or Throat chakra, hence it is extremely difficult for you to open your heart out verbally. You are very sensitive & caring by nature but are mostly misunderstood. You are always on your toes, anxious, and overly energetic, taking rest or getting relaxed very rarely; you are always hyperactive. Only materialistic desires will be found & you have more focus on wealth accumulation than anything else in your life.",
    "1_5": "You face too many difficulties in expressing your emotions out verbally. You are a very much misunderstood personality. You direct your energy of expression into other forms, like writing, painting, dancing, art, sculpture, and creativity. You may have a tendency to over-indulge in alcoholism, drugs, food, many relationships, or any other types of addictions.",
    "2_1": "You are caring & intelligent by nature and are easily hurt by others. You easily understand & gauge people just by looking at them. You can easily distinguish between sincere & insincere people. If only the number 2 is present in the plane, you have an average mindset, but if the other two numbers are also there, you have high intellect. You do well in the philosophical, judicial & literary fields.",
    "2_2": "You are high in Intelligence, Sensitivity & have a double Intuition Level (as 2 appears 2 times). You have an innate ability to get into someone's Mind & Soul. You can easily scan the Mind & Soul of someone & find out about their feelings, motive & purpose. If you only have two 2s in the plane without 4 & 9, it makes you highly skeptical & very negative. This also makes you deprived of positive energy and enthusiasm; the level of Chi or Life Driving Force in you is very weak, which will eventually affect both your physical & mental health. If 4 & 9 are present along with 2, then you will be good at memorizing things & highly intellectual.",
    "2_3": "Having more 2s in your chart makes you more intuitive & sensitive. But sensitivity & intuitiveness are good up to a limit; after a point, these two properties can make a person maniacal. You become too vulnerable or defenseless & are hence easily hurt & affected by others. As a result, you prefer to be alone & aloof, away from the public, to protect yourself from being hurt. You lock yourself in your own mental world as you don't find the people around you in the physical world capable enough to understand you. You become an introvert regardless of your basic behavior and tendencies.",
    "2_4": "Your patience level is very low. You have a tendency to overreact over issues which are irrelevant & meaningless. Extreme behavioral sensitivity is observed which can lead to self-hurting behavior.",
    "2_5": "This is a rarely found set in a grid. If you have 5, 6, or more 2s with no support from 4 & 9, then the condition will be unfortunate, making your life very difficult to live and adjust to. Too much arrogance in your behavior is seen, along with sarcasm & rudeness. Self-doubt & lack of confidence are also seen. In this century, people can have six 2s in their chart (e.g., 22 Feb 2022).",
    "3_1": "You experience STRESS & HURT if there is only one 3. You have a good creative brain with an excellent memory. You are DOWN TO EARTH in your approach towards life and have a POSITIVE MINDSET in achieving any task or goal. You keep inspiring others with your honesty & optimism. You are totally focused on your growth and your goals. You find it DIFFICULT TO DEAL WITH COMPETITIONS.",
    "3_2": "Intelligence, sensitiveness & intuitiveness are the qualities associated with you. You have a balanced mentality & strong personality. You have good compatibility & an adjusting nature, hence you emerge as a good friend. You can easily sense the motive of other people around you. You develop a concept of life & evolve spiritually with faith & devotion when there is support of 5 & 7. You have an active, imaginative & very creative brain. You enjoy breaking rules or contracts & are strange or unconventional in nature. You can emerge as a path breaker or trend maker. Your power of creativity makes you a trendsetter. You know very well how to control your innovative mind and have the power of projecting expression through words, so you excel professionally as a writer, artist, actor, etc.",
    "3_3": "You live in an IMAGINARY BUBBLE OR DAYDREAMING STATE. You often find it hard to relate with others and are not a good listener. You can appear self-engaged & isolated. You have brilliant mental ability, but you spend your life in the world of dreams. You can be quarrelsome & unimportant at times. You have potential for clairvoyance & spiritualism.",
    "3_4": "You can be unrealistic, fearful & over-imaginative (an illusionist). These qualities make it hard for you to function well in everyday life. This combination is rare to find in charts. You are sensitive, imaginative & intuitive in nature, a daydreamer who loves to stick in that world. High intelligence, high intellect, high spirituality & high intuitive abilities are seen if 3 is supported by 5 & 7 in this plane. You can also be intolerant, irresponsible & thoughtless. Other supportive numbers are not of much help in the case of too many 3s.",
    "4_1": "You are good at physical hard work. You are an intelligent person with a logical & rational mind. You perform well in tasks done by hand (Hands Occupation / Work). You are imaginative & impatient by nature. You are a good organizer of others & have the ability to carry out plans with perfection. You deeply connect with music, melodies, tunes, art, craft & handicrafts. You take your decisions very carefully and think before getting involved in anything. But these qualities are used on the basis of other numbers present in your chart. You earn by your traditional occupations.",
    "4_2": "You have a tendency for OVERINDULGENCE in physical & materialistic actions at the cost of other deeds. You have good organizing skills. You are a good task initiator & fantastic as a completer. You are reliable, precise & organized. You are good in art & craft by hand. You can also be rigid, stubborn, have low tolerance power, and be judgmental & inflexible. You possess a high level of intelligence, pride because of that intelligence, and a superiority complex.",
    "4_3": "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career.",
    "4_4": "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career.",
    "5_1": "You have well-balanced emotional sensitivity. You are concerned, supportive & kind-hearted. You are motivating & inspiring for others. The company of 3 & 7 makes you wise in decision making.",
    "5_2": "You can be uncontrollable, and governing & dealing with you is challenging. You are passionate, strong-minded, lively, impatient & flexible. You are a risk-taker, adventurous, self-confident, determined & a show-off. You are filled with a high level of determination & eagerness. You can have frequent emotional outbursts which later lead to repentance. You can be a problem creator at work & home. You also show laziness in behavior & are sensual by nature.",
    "5_3": "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
    "5_4": "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
    "5_5": "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
    "6_1": "You show love, regard & care for your family, relations & loved ones. You enjoy your home duties & have creative or innovative abilities. You are a DECENT PARENT and provide suggestions in family matters when required. You can be insecure, worried & afraid about being left alone in life (e.g., death of a life partner). You are a lucky person but with narrow-mindedness. You will have financial stability, a good lifestyle with fewer discomforts, if 8 & 1 are also in your chart. If 8 & 1 are not there, then only financial security will be there. You are family-oriented & love to work in an enjoyable & friendly environment.",
    "6_2": "You are highly creative, but lack self-confidence & believe less in your work & their abilities. You take unnecessary tension for your family & family members, which makes your energy drained/exhausted & hence you feel tired most of the time. You are too stressed all the time because of your thinking style. You are overprotective by nature, hence you keep interfering in the lives of your family members (especially towards your kids). You can provide an obstruction to your children in becoming self-dependent. Your life is filled with creativity, activeness & beauty. You require constant support & encouragement from your family & friends.",
    "6_3": "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
    "6_4": "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in their behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
    "6_5": "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in their behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
    "7_1": "You learn the lessons of your life through RELATIONAL LOSS or LOSS OF LOVED ONES, LOSS OF BELONGINGS, or on the COST of HEALTH & WELL-BEING. With the lessons you learn throughout your life & losses, you become more inclined towards the spiritual field & spiritual practices. If supported by 3 & 5, you start your quest for the ultimate reality of life & precision or perfection in the journey of life. Your career can be in a spiritual or humanitarian field. If 3 & 5 are there, your behavior is rigid.",
    "7_2": "You gain your knowledge & wisdom at the cost of your loved ones, your health, or your monetary losses. This push will eventually take you to the path of occultism, spirituality & meditation. You have a technical (IT & Computers) & analytical (Mathematical & Reasoning) brain. You are good at minute, odd & baseless criticism. You are spiritual but have a tendency for show-off & bragging by nature. You have the potential to bring finance & prosperity into your life.",
    "7_3": "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
    "7_4": "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
    "7_5": "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
    "8_1": "You are systematic, reliable & good with finer details. You are a good task initiator but a bad task completer. You have a constantly active mind, hence you have restlessness in your behavior. As a result, you have a constant mystery-resolving & daring attitude. With the support of 1 & 6, you can have good materialistic success.",
    "8_2": "You are good in business & financial matters. You are entertaining, intellectual, clever & shrewd. You are good in analysis, evaluation & taking advantage of any opportunity. You have keen observation & are thorough in your approach. You love to have experiences by yourself and never count upon others' stories. You are very rigid & inflexible in your approach & the decisions you make.",
    "8_3": "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
    "8_4": "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
    "8_5": "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
    "9_1": "You are ambitious, determined & have a very strong wish for self-improvement. If supported by 4 & 2, then you can be humorous, intellectual, affluent, prosperous, spiritual & divine. If there is no support of 4 & 2, then there will be a tussle in all areas of your life.",
    "9_2": "You have a 'Master Number' impact, but the Master Number activation is required. You are idealistic & brainy in your life. You love to learn about everything around you. You can do too much criticism of others. You have a sympathetic attitude & you love to work in fields in which much use of the brain is required. It is necessary for you to get along with people of all levels of society.",
    "9_3": "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle your life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
    "9_4": "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
    "9_5": "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too."
};

function PersonalizedMeaning({ text, allDigits }: { text: string, allDigits: string[] }) {
    const [personalizedText, setPersonalizedText] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    
    React.useEffect(() => {
        const getPersonalizedText = async () => {
            setIsLoading(true);
            setError(null);
            const result = await personalizeReadingAction({
                reading: text,
                numbers: allDigits.map(d => parseInt(d, 10))
            });

            if(result.success) {
                setPersonalizedText(result.personalizedReading!);
            } else {
                setError(result.error || 'Failed to personalize reading.');
                setPersonalizedText(text); // Fallback to original text on error
            }
            setIsLoading(false);
        };
        
        getPersonalizedText();
    }, [text, allDigits]);

    if(isLoading) {
        return (
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
             </div>
        )
    }

    if(error) {
        return <p className="text-muted-foreground">{text}</p>
    }

    return <p className="text-muted-foreground">{personalizedText}</p>
}


function ResultsDisplay({ insight, numerology, onReset }: { insight: AstroInsightOutput, numerology: NumerologyData, onReset: () => void }) {
    const numberCounts = React.useMemo(() => {
        const counts: { [key: number]: number } = {};
        for (let i = 1; i <= 9; i++) {
            counts[i] = 0;
        }
        numerology.allDigitsForGrid.forEach(digit => {
            const num = parseInt(digit, 10);
            if (num > 0) { // Exclude 0
                counts[num]++;
            }
        });
        return counts;
    }, [numerology.allDigitsForGrid]);
    
    const uniqueDigits = React.useMemo(() => {
        return [...new Set(numerology.allDigitsForGrid)].map(d => parseInt(d, 10));
    }, [numerology.allDigitsForGrid]);

    return (
        <div className="p-6 bg-background rounded-lg">
            <div className="text-center mb-6 pb-4 border-b">
                <h1 className="text-3xl font-bold text-primary">{insight.name}</h1>
                <h2 className="text-xl text-accent font-semibold">{insight.new_astrology_sign}</h2>
                <p className="text-muted-foreground">(A {insight.western_sign} born in the year of the {insight.element} {insight.sign})</p>
            </div>

            <Tabs defaultValue="numerology" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="numerology">Numerology</TabsTrigger>
                    <TabsTrigger value="chinese_zodiac">Chinese Zodiac</TabsTrigger>
                    <TabsTrigger value="new_astrology">New Astrology</TabsTrigger>
                </TabsList>

                <TabsContent value="numerology">
                    <div className="grid md:grid-cols-3 gap-6">
                        <aside className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Core Numbers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 text-center gap-4">
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{numerology.psycheNum}</div>
                                            <div className="text-xs text-muted-foreground">Psyche</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{numerology.destinyNum}</div>
                                            <div className="text-xs text-muted-foreground">Destiny</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{numerology.kuaNum}</div>
                                            <div className="text-xs text-muted-foreground">Kua</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Lo Shu Grid</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            {numerology.loShuGrid.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="border text-center h-16 w-16 text-2xl font-bold text-primary">
                                                            {cell || ''}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </aside>
                        <main className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader><CardTitle>AI Reading</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{insight.reading}</p>
                                    <div className="flex justify-around mt-4">
                                        <div>Lucky Number: <span className="font-bold text-accent">{insight.luckyNumber}</span></div>
                                        <div>Lucky Color: <span className="font-bold text-accent">{insight.luckyColor}</span></div>
                                    </div>
                                </CardContent>
                            </Card>
                             {numerology.arrowsOfStrength.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="text-accent" />
                                            Arrows of Strength
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        {numerology.arrowsOfStrength.map(arrow => (
                                            <div key={arrow.name}>
                                                <p className="font-bold text-primary">{arrow.name}</p>
                                                <p className="text-muted-foreground">{arrow.description}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                            <Card>
                                <CardHeader><CardTitle>Personalized Number Meanings</CardTitle></CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    {Object.entries(numberCounts).map(([num, count]) => {
                                        if (count === 0) return null;
                                        const key = `${num}_${Math.min(count, 5)}`; // Cap count at 5 for lookup
                                        const meaning = repeatedNumberMeanings[key];
                                        if (!meaning) return null;
                                        
                                        return (
                                            <div key={key}>
                                                <p className="font-bold text-primary">Number {num} (Repeated {count} time{count > 1 ? 's' : ''})</p>
                                                <PersonalizedMeaning text={meaning} allDigits={numerology.allDigitsForGrid} />
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </main>
                    </div>
                </TabsContent>
                
                <TabsContent value="chinese_zodiac" className="space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Your Animal Sign: The {insight.sign}</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.general_desc}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>The Influence of the {insight.element} Element</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.elemental_desc}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Compatibilities</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.compatibilities}</p></CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="new_astrology">
                     <Card>
                        <CardHeader><CardTitle>Your Combined Sign: {insight.new_astrology_sign}</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.new_astrology_desc}</p></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="text-center mt-8">
                 <Button onClick={onReset} variant="outline">← Create a New Profile</Button>
            </div>
        </div>
    );
}


export function ProfileGenerator() {
    const { toast } = useToast();
    const [isPending, startTransition] = React.useTransition();
    const [formData, setFormData] = React.useState({
        name: '',
        day: '',
        month: '',
        year: '',
        gender: ''
    });
    const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
    const [numerology, setNumerology] = React.useState<NumerologyData | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender: value }));
    };
    
    const handleReset = () => {
        setInsight(null);
        setNumerology(null);
        setError(null);
        setFormData({ name: '', day: '', month: '', year: '', gender: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { name, day, month, year, gender } = formData;
        if (!name || !day || !month || !year || !gender) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all the fields.',
            });
            return;
        }

        startTransition(async () => {
            const insightPromise = getAstroInsightAction({
                name,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                gender,
            });
            
            const numerologyData = generateLoShuData({
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                gender,
            });

            const insightResult = await insightPromise;
            
            if (insightResult.success && insightResult.insight && numerologyData) {
                setInsight(insightResult.insight);
                setNumerology(numerologyData);
            } else {
                setInsight(null);
                setNumerology(null);
                setError(insightResult.error || 'An unexpected error occurred.');
                toast({
                  variant: 'destructive',
                  title: 'Error Generating Profile',
                  description: insightResult.error || 'An unexpected error occurred while fetching insights. Please try again.',
                });
            }
        });
    };

    return (
        <div>
            <AnimatePresence mode="wait">
                {insight && numerology ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ResultsDisplay insight={insight} numerology={numerology} onReset={handleReset} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit}>
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl font-bold tracking-tight">Generate Your Profile</CardTitle>
                                <CardDescription>Enter your details for a personalized reading.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="form-group">
                                    <Label htmlFor="name">Your Full Name</Label>
                                    <Input id="name" name="name" placeholder="e.g., Jane Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                                </div>
                                 <div className="form-group">
                                    <Label>Date of Birth</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day} onChange={handleChange} disabled={isPending} />
                                        <Input type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month} onChange={handleChange} disabled={isPending} />
                                        <Input type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year} onChange={handleChange} disabled={isPending} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" required onValueChange={handleSelectChange} value={formData.gender} disabled={isPending}>
                                        <SelectTrigger id="gender">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-stretch p-6 bg-secondary/30">
                                <Button type="submit" disabled={isPending} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6 group">
                                    {isPending ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-5 w-5" />
                                    )}
                                    Generate My Reading
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
