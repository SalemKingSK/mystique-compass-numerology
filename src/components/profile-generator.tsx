'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateLoShuData } from '@/lib/numerology';

type NumerologyData = ReturnType<typeof generateLoShuData>;

const repeatedNumberMeanings: { [key: string]: string } = {
    "1_1": "Difficulty in communication & expression (verbal). You can communicate by other means, through art, craft, design, sculpturing, cartoons, graffiti, painting, writing, dancing etc. But you are never able to soak yourself into anything; you touch the crust but never reach the core. You find it difficult to understand others' point of view. You have a good financial level, as 6 & 8 are also in this plane.",
    "1_2": "Good in Expression & Communication. You have an impartial & balanced outlook towards everyone in life. Your way of living life is very neutral. You understand others' point of view as well as your own. You are good in financial matters. This is a perfect placement of this pair in a chart.",
    "1_3": "Good in Expression, very sensitive & caring. This can indicate a number of extra-marital relations (the concept of 'Pati, Patni & Wo'). Sometimes you are too much talkative and never stop talking, but at other times you can be very quiet & introvert, as you have both extremes in your behavior. You keep on changing your behavior according to time & situations. You will have materialistic growth if other two numbers are supporting. Generally, you are happy and a good entertainer in life. You love going out of the house.",
    "1_4": "Blockage at the Vishuddha or Throat chakra, hence it is extremely difficult for you to open your heart out verbally. You are very sensitive & caring by nature but are mostly misunderstood. You are always on your toes, anxious, and overly energetic, taking rest or getting relaxed very rarely; you are always hyperactive. Only materialistic desires will be found & you have more focus on wealth accumulation than anything else in your life.",
    "1_5": "You face too many difficulties in expressing your emotions out verbally. You are a very much misunderstood personality. You direct your energy of expression into other forms, like writing, painting, dancing, art, sculpture, and creativity. You may have a tendency to over-indulge in alcoholism, drugs, food, many relationships, or any other types of addictions.",
    "2_1": "You have a good intuitive power and can judge people well. Your imagination is very good and you are a good planner on paper, but when it comes to execution, you lack that skill. You can guide others, but you do not follow the same rules yourself. You are moody and emotional.",
    "2_2": "You are highly intuitive and have a sharp mind. However, you can be oversensitive and easily hurt by others' words. Your emotional balance is key to your success. You are a deep thinker but may get lost in your own thoughts, leading to inaction.",
    "2_3": "A combination of intuition and creativity. You are highly imaginative and can express your feelings through artistic means. You are a good friend and a compassionate listener, but you may struggle with making practical decisions.",
    "2_4": "Your intuition is often in conflict with your practical mind. This can lead to indecisiveness and anxiety. You are a hard worker but may doubt your own abilities. Trusting your gut feeling is a major life lesson for you.",
    "2_5": "You have a psychic-like intuition but struggle with restlessness. You are prone to daydreaming and may find it hard to focus on one thing. Grounding your energy through physical activities is essential for your well-being.",
    "3_1": "You are very creative and have a great sense of humor. You are the life of the party and can easily make friends. However, you may lack discipline and find it hard to finish what you start. You are a good entertainer and love to be in the spotlight.",
    "3_2": "A highly creative and expressive individual. You are a natural-born artist, writer, or musician. You can be overly dramatic and may seek constant attention. Your emotional sensitivity is both a gift and a curse.",
    "3_3": "You are a powerhouse of creativity and self-expression. You have a magnetic personality and can inspire others with your words. Be mindful of becoming scattered and spreading your energy too thin. Focus is your key to success.",
    "3_4": "You are a practical creator. You can turn your creative ideas into tangible results. You may struggle with self-doubt and need encouragement from others. You are a reliable and responsible person, but you need to learn to have more fun.",
    "4_1": "You are a very hardworking and disciplined person. You are well-organized and a good planner. However, you can be rigid and stubborn in your views. You are a loyal friend but may find it hard to express your feelings.",
    "4_2": "A combination of hard work and intuition. You can achieve great success if you learn to trust your inner voice. You are a responsible family person but may worry too much about the future. Learning to let go is important for you.",
    "4_3": "You are a creative builder. You can bring structure and order to artistic projects. You are a good manager but may be too critical of yourself and others. You need to learn to appreciate the process, not just the result.",
    "4_4": "You are the epitome of stability and security. You are a rock for your family and friends. However, you may resist change and get stuck in a routine. Learning to be more flexible will bring you more opportunities.",
    "5_1": "You are a freedom-lover and an adventurer. You love to travel and experience new things. However, you may be restless and irresponsible. You need to learn to commit to your goals and relationships.",
    "5_2": "You have a strong intuition and a desire for freedom. You are a good communicator and can sell any idea. However, you may be prone to addiction and overindulgence. Finding a balance between freedom and responsibility is your life's challenge.",
    "5_3": "A very charismatic and multi-talented individual. You are a social butterfly and can adapt to any situation. You may have many interests but lack focus. You need to find your true passion and stick to it.",
    "5_4": "You are a disciplined adventurer. You can achieve your goals through careful planning and hard work. You are a good leader but may be too demanding of others. You need to learn to be more compassionate.",
    "6_1": "You are a responsible and caring person. You are a natural-born teacher and a counselor. You may take on too much responsibility and neglect your own needs. Learning to say 'no' is important for you.",
    "6_2": "You have a strong sense of duty and a loving heart. You are a devoted partner and a parent. You may be too idealistic and get hurt easily. You need to learn to protect your emotional boundaries.",
    "6_3": "A very creative and nurturing person. You can create a beautiful and harmonious home. You are a good host but may be a perfectionist. You need to learn to relax and enjoy the moment.",
    "6_4": "You are a pillar of the community. You are a responsible and reliable person. You may sacrifice your own happiness for the sake of others. You need to learn to love and care for yourself first.",
    "7_1": "You are a deep thinker and a spiritual seeker. You have a sharp analytical mind and a love for knowledge. You may be a loner and find it hard to trust others. You need to learn to open your heart to love.",
    "7_2": "You have a strong intuition and a philosophical mind. You are a good researcher and a problem-solver. You may be too secretive and detached from your emotions. You need to learn to connect with your feelings.",
    "7_3": "A creative and intellectual person. You can express complex ideas in a simple and clear way. You are a good writer and a speaker. You may be too critical of yourself and others. You need to learn to be more accepting.",
    "7_4": "You are a spiritual master builder. You can create a lasting legacy through your wisdom and knowledge. You are a good teacher but may be too dogmatic. You need to learn to be more open-minded.",
    "8_1": "You have a strong ambition and a desire for success. You are a natural-born leader and an entrepreneur. You may be too materialistic and power-hungry. You need to learn to use your power for the good of others.",
    "8_2": "You have a strong intuition and a good business sense. You can achieve great wealth and success. You may be too ruthless and manipulative. You need to learn to be more ethical and compassionate.",
    "8_3": "A creative and successful person. You can achieve fame and fortune through your talents. You are a good performer but may be too egoistic. You need to learn to be more humble.",
    "8_4": "You are a master of the material world. You can build a great empire through your hard work and vision. You are a good organizer but may be too controlling. You need to learn to delegate and trust others.",
    "9_1": "You are a humanitarian and a philanthropist. You have a big heart and a desire to serve others. You may be too idealistic and impractical. You need to learn to be more grounded and realistic.",
    "9_2": "You have a strong intuition and a compassionate soul. You are a good healer and a spiritual guide. You may be too emotional and self-sacrificing. You need to learn to set healthy boundaries.",
    "9_3": "A creative and inspiring person. You can make a positive impact on the world through your art and words. You are a good motivator but may be too preachy. You need to learn to lead by example.",
    "9_4": "You are a practical idealist. You can turn your noble visions into reality. You are a good social reformer but may be too impatient. You need to learn to work with others to achieve your goals."
};

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
                             <Card>
                                <CardHeader><CardTitle>Number Repetition Meanings</CardTitle></CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    {Object.entries(numberCounts).map(([num, count]) => {
                                        if (count === 0) return null;
                                        const key = `${num}_${count}`;
                                        const meaning = repeatedNumberMeanings[key];
                                        return (
                                            <div key={key}>
                                                <p className="font-bold text-primary">Number {num} (Repeated {count} time{count > 1 ? 's' : ''})</p>
                                                <p className="text-muted-foreground">{meaning || "No specific meaning found for this repetition count."}</p>
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
