'use client';

/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
 */

export interface PsychomatrixCellMeaning {
  count: number;
  label: string;
  verbatim: string;
  scale: 'absent' | 'very-weak' | 'norm' | 'special' | 'strong' | 'dominant' | 'overload';
}

export interface PsychomatrixCellData {
  digit: number;
  cellName: string;
  intro: string;
  lineContext: string;
  meanings: PsychomatrixCellMeaning[];
}

export interface PsychomatrixResult {
  day: number;
  month: number;
  year: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
  allDigits: number[];
  counts: Record<number, number>;
  grid: Array<Array<string | null>>;
  activeLines: string[];
  complementaryInsights: ComplementaryInsight[];
  cellReadings: CellReading[];
}

export interface CellReading {
  digit: number;
  count: number;
  cellName: string;
  label: string;
  verbatim: string;
  scale: PsychomatrixCellMeaning['scale'];
  modifiers: string[];
}

export interface ComplementaryInsight {
  digits: number[];
  title: string;
  insight: string;
  type: 'amplify' | 'tension' | 'transition' | 'synergy';
}

export const PSYCHOMATRIX_CELL_MEANINGS: Record<number, PsychomatrixCellData> = {
  1: {
    digit: 1,
    cellName: 'Character / Will',
    intro: `One. Character

Character "1"
Character "1," or "one unit," is weak-willed and selfish.
It can be said that this is one of the most complex character traits. It is possessed by people who are contradictory by nature.
The fact is that, having a weak-willed character, they avoid making any decisions, trying to shift them to someone else.
Escaping from making a decision, they desperately feign action and strenuously demonstrate their strong-willed qualities.
This is why they always get into arguments about any issue. Surprisingly, they are completely indifferent to the subject of the dispute, as in the argument itself, they are only interested in winning; they desperately need success, striving to demonstrate their strength of character to everyone.
They often become selfish in their pursuit of victory, ignoring other people with their requests and troubles. Such people never make hasty decisions and give complex answers that can be interpreted in different ways, allowing them to retract their statements or, even better, make no decisions at all.
Don't even think of accusing them of lack of willpower: you'll offend them, and they simply won't believe you, once again displaying their argumentative nature.
However, it's not all bad. They make the most wonderful deputies – deputies who are the "number two" behind the boss.

Recommendations for character type "1"
This is one of the most complex character types, as it contains a contradiction in its definition. Consider whether a person can be both selfish and weak-willed at the same time.
Selfishness implies asserting one's own views, while weak-willedness implies subordination to the opinions of others.
Let's try to understand this.
A person with a weak-willed character, and knowing this for sure, tries to hide their flaw from prying eyes. This is precisely why he dons the mask of a businessman, convincing everyone around him of his exceptional willpower.
Take a closer look at such a person, and everything will immediately become clear. He never dictates his will to anyone, but is a fanatical enforcer of his superior's opinion (order, directive).
For him, the letter of the law is the ultimate truth. If he's given a document defining his authority, don't even think of arguing with him unless you have a document limiting or revoking that authority. Such people are natural performers.
If you're interested in a way to negotiate with him that will allow you to win the argument without depriving such a person of his "victory," remember the following sequence:
1. I agree with you...
2. But I would personally do it differently, namely (short outline)...
3. But I agree with you. Decide everything yourself...
4. Pause until they offer their own solution. Don't be surprised; it will be your proposed solution, as the responsibility will fall on you, but the decision is yours.
5. Bottom line: if everything goes well, they'll take credit for the decision. If it goes badly, they'll blame you.
6. Ignore it.
If the issue at hand is one you'd rather not risk, don't offer the "1" personality a choice of actions. Instead, present your solution as the only one, non-negotiable (even better if it's an order or directive, if they're your employee).
My only request: don't overuse this method, as it's essential to preserve their ability to make independent decisions.
Remember: the egoism of a "1" personality lies in their desire to win any argument, regardless of their area of ​​expertise or competence. Don't be surprised if they repeat the same jokes, parables, and aphorisms to you—this is also their way of gaining self-confidence.
If your child has a similar personality, teach them to make decisions.
Never rush to suppress their desire to lead; they will lose this ability without you.
Remember: it is possible to change their personality through strong lines. For a "1" personality type, these are:
1st row, "1, 4, 7";
1st column, "1, 2, 3";
spiritual diagonal, "1, 5, 9".`,
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 1 (1, 2, 3) — Self-esteem. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      { 
        count: 0, 
        label: 'Character Absent', 
        verbatim: `One. Character

Character "1"
Character "1," or "one unit," is weak-willed and selfish.
It can be said that this is one of the most complex character traits. It is possessed by people who are contradictory by nature.
The fact is that, having a weak-willed character, they avoid making any decisions, trying to shift them to someone else.
Escaping from making a decision, they desperately feign action and strenuously demonstrate their strong-willed qualities.
This is why they always get into arguments about any issue. Surprisingly, they are completely indifferent to the subject of the dispute, as in the argument itself, they are only interested in winning; they desperately need success, striving to demonstrate their strength of character to everyone.
They often become selfish in their pursuit of victory, ignoring other people with their requests and troubles. Such people never make hasty decisions and give complex answers that can be interpreted in different ways, allowing them to retract their statements or, even better, make no decisions at all.
Don't even think of accusing them of lack of willpower: you'll offend them, and they simply won't believe you, once again displaying their argumentative nature.
However, it's not all bad. They make the most wonderful deputies – deputies who are the "number two" behind the boss.

Recommendations for character type "1"
This is one of the most complex character types, as it contains a contradiction in its definition. Consider whether a person can be both selfish and weak-willed at the same time.
Selfishness implies asserting one's own views, while weak-willedness implies subordination to the opinions of others.
Let's try to understand this.
A person with a weak-willed character, and knowing this for sure, tries to hide their flaw from prying eyes. This is precisely why he dons the mask of a businessman, convincing everyone around him of his exceptional willpower.
Take a closer look at such a person, and everything will immediately become clear. He never dictates his will to anyone, but is a fanatical enforcer of his superior's opinion (order, directive).
For him, the letter of the law is the ultimate truth. If he's given a document defining his authority, don't even think of arguing with him unless you have a document limiting or revoking that authority. Such people are natural performers.
If you're interested in a way to negotiate with him that will allow you to win the argument without depriving such a person of his "victory," remember the following sequence:
1. I agree with you...
2. But I would personally do it differently, namely (short outline)...
3. But I agree with you. Decide everything yourself...
4. Pause until they offer their own solution. Don't be surprised; it will be your proposed solution, as the responsibility will fall on you, but the decision is yours.
5. Bottom line: if everything goes well, they'll take credit for the decision. If it goes badly, they'll blame you.
6. Ignore it.
If the issue at hand is one you'd rather not risk, don't offer the "1" personality a choice of actions. Instead, present your solution as the only one, non-negotiable (even better if it's an order or directive, if they're your employee).
My only request: don't overuse this method, as it's essential to preserve their ability to make independent decisions.
Remember: the egoism of a "1" personality lies in their desire to win any argument, regardless of their area of ​​expertise or competence. Don't be surprised if they repeat the same jokes, parables, and aphorisms to you—this is also their way of gaining self-confidence.
If your child has a similar personality, teach them to make decisions.
Never rush to suppress their desire to lead; they will lose this ability without you.
Remember: it is possible to change their personality through strong lines. For a "1" personality type, these are:
1st row, "1, 4, 7";
1st column, "1, 2, 3";
spiritual diagonal, "1, 5, 9".`, 
        scale: 'absent' 
      },
      { 
        count: 1, 
        label: 'Character "1"', 
        verbatim: `One. Character

Character "1"
Character "1," or "one unit," is weak-willed and selfish.
It can be said that this is one of the most complex character traits. It is possessed by people who are contradictory by nature.
The fact is that, having a weak-willed character, they avoid making any decisions, trying to shift them to someone else.
Escaping from making a decision, they desperately feign action and strenuously demonstrate their strong-willed qualities.
This is why they always get into arguments about any issue. Surprisingly, they are completely indifferent to the subject of the dispute, as in the argument itself, they are only interested in winning; they desperately need success, striving to demonstrate their strength of character to everyone.
They often become selfish in their pursuit of victory, ignoring other people with their requests and troubles. Such people never make hasty decisions and give complex answers that can be interpreted in different ways, allowing them to retract their statements or, even better, make no decisions at all.
Don't even think of accusing them of lack of willpower: you'll offend them, and they simply won't believe you, once again displaying their argumentative nature.
However, it's not all bad. They make the most wonderful deputies – deputies who are the "number two" behind the boss.

Recommendations for character type "1"
This is one of the most complex character types, as it contains a contradiction in its definition. Consider whether a person can be both selfish and weak-willed at the same time.
Selfishness implies asserting one's own views, while weak-willedness implies subordination to the opinions of others.
Let's try to understand this.
A person with a weak-willed character, and knowing this for sure, tries to hide their flaw from prying eyes. This is precisely why he dons the mask of a businessman, convincing everyone around him of his exceptional willpower.
Take a closer look at such a person, and everything will immediately become clear. He never dictates his will to anyone, but is a fanatical enforcer of his superior's opinion (order, directive).
For him, the letter of the law is the ultimate truth. If he's given a document defining his authority, don't even think of arguing with him unless you have a document limiting or revoking that authority. Such people are natural performers.
If you're interested in a way to negotiate with him that will allow you to win the argument without depriving such a person of his "victory," remember the following sequence:
1. I agree with you...
2. But I would personally do it differently, namely (short outline)...
3. But I agree with you. Decide everything yourself...
4. Pause until they offer their own solution. Don't be surprised; it will be your proposed solution, as the responsibility will fall on you, but the decision is yours.
5. Bottom line: if everything goes well, they'll take credit for the decision. If it goes badly, they'll blame you.
6. Ignore it.
If the issue at hand is one you'd rather not risk, don't offer the "1" personality a choice of actions. Instead, present your solution as the only one, non-negotiable (even better if it's an order or directive, if they're your employee).
My only request: don't overuse this method, as it's essential to preserve their ability to make independent decisions.
Remember: the egoism of a "1" personality lies in their desire to win any argument, regardless of their area of ​​expertise or competence. Don't be surprised if they repeat the same jokes, parables, and aphorisms to you—this is also their way of gaining self-confidence.
If your child has a similar personality, teach them to make decisions.
Never rush to suppress their desire to lead; they will lose this ability without you.
Remember: it is possible to change their personality through strong lines. For a "1" personality type, these are:
1st row, "1, 4, 7";
1st column, "1, 2, 3";
spiritual diagonal, "1, 5, 9".`, 
        scale: 'very-weak' 
      },
      { 
        count: 2, 
        label: 'Personality type "11"', 
        verbatim: `Personality type "11"
People with two "1"s in their psychomatrix are distinguished by a gentle nature, love praise, and earn it in every way. This is why they help others a lot, fit easily into any company, and are noticeable in it, as they strive to attract attention to themselves in order to later receive gratitude for a pleasant meeting. They know how to listen to others unless they try to pressure them. They very rarely use pressure on others.
They often lack the firmness to defend their views and strive for a profession that is independent, but the desire for praise pushes them toward the medical and teaching professions.
They often lack determination and self-esteem, which lowers their goals. If they are lucky enough to have "22" or "2222 or higher" in their psychomatrix, their initiative is greatly enhanced.

Recommendations for an "11" personality
Remember, the most important thing a person with this personality expects is praise.
If you've assigned a daily chore list to your child with an "11," know that after completing one task, they'll expect praise for it and only then continue the list, receiving praise for each item separately.
It's best to use the following plan.
Tell them they must complete just one task, as they're better at it than others. Then, tell them about the tasks you'll be taking on and list them.
When you get home, you'll be pleasantly surprised by a list of several "yours" tasks that your child completed to earn an extra dose of praise. Don't even think of scolding them if they haven't completed the task assigned to them.
That's why assigning mandatory tasks that can be done tomorrow or not at all in the near future is a good idea. Praise, praise, and praise your child at every opportunity – and you won't have any problems with them.
However, don't overpraise if your child has a score of 88 or 55 – they won't tolerate lies because they are "truth-seekers."`, 
        scale: 'norm' 
      },
      { 
        count: 3, 
        label: '"111" personality type', 
        verbatim: `"111" personality type
This personality type has the rather grandiose name "golden mean," which immediately distinguishes it from other personality types. Such people can find common ground with anyone.
The fact is that they can, if necessary, yield to anyone in an argument (even a "1").
The main thing to know is that you shouldn't pressure such a person, as in self-defense, they will defeat anyone, even a despot.
A person with the "golden mean" personality type makes a natural transition (we will discuss the transitions between numbers separately) into a new personality type: "1 and 8" (we believe there is no such thing as the number 8). It corresponds to a gentle and tolerant character.
 This outward, deceptive gentleness encourages those who like to dominate others to test their power against those with the "111" personality type. This results in an unexpected outburst of emotions, leading to conflict and the suppression of the despot.
To summarize, the "111" personality type manifests itself softly, even weak-willed, in a calm environment, merging with the "1 and 8" personality type. However, should any threat, pressure, or conflict arise, this personality type produces an unexpected outburst of emotions comparable in strength to the "11111" personality type—the despot. In its average meaning, it is the "golden mean."

Recommendations for the "111" personality type
It is important to prevent someone with this personality type from becoming embittered, vindictive, and aggressive.
The cause lies not in the person themselves, but in their environment. If parents suppress a child with this personality type from childhood, it's safe to say that their sense of duty to their own parents has weakened, pushing them to exert power over their own child.
Remember! Life goes in cycles. If one forgets their duty to their parents, they will give birth to a child who will lose their sense of duty to them.
If you have a "golden mean" personality, don't try to convince yourself of false tolerance; believe me: "kneeling" is not your destiny.
Remember the words of Alexander Green: "Never do something you'll regret later." If you give in to someone out of pity, you'll explode later. The pity fades, and disappointment sets in, regretting what you've done.`, 
        scale: 'special' 
      },
      { 
        count: 4, 
        label: '"1111" personality type', 
        verbatim: `"1111" personality type
This is a strong-willed and determined personality.
These people know how to set goals. If they have energy (22 or more), they are ready to engage in debate and strive for victory. However, they always know their limits and do not overstep certain boundaries, as they are not despots. They are always mindful of their interlocutors, not seeking to offend them.
If they have low energy (2-none or 2), they prefer to avoid an argument rather than waste their energy. They are self-confident and do not need to prove their superiority or knowledge.
For men, this personality type is best suited to leadership or military positions. Women choose science, teaching (usually in higher education), law, or the courts, but not business.
Never forget that this is the personality type of a leader who strives to be better than others. This is a serious reason for good, high-quality education.
Don't think that they are always assertive and stubborn—that's not true. In their everyday, relaxed state, they are very reminiscent of those with "11" and "8." They love praise, but don't demand it, as they don't tolerate sycophancy and flirting.
If you have this type of personality, it's advisable to develop your own personality so you don't later blame others for your lag.
Don't try to humiliate someone with "1111"; this will only result in a firm and fearless response.
These people can make decisions immediately and rarely back down from them.
If you have an "1111" personality, you need to learn to stop yourself if necessary. However, it's even more important to learn to back down from a previous decision if necessary.
It's worth noting that this type of personality is a true gift from fate for anyone, as it allows them to set and achieve very high goals in any field of human knowledge.
Most importantly, this type of personality helps to reveal a person's talent.

 Recommendations for the "1111" personality type
If you have the "1111" personality type, never delude yourself into thinking you can easily yield leadership to another person. Such a misconception is quite dangerous: you won't be able to tolerate humiliation for long—it's unacceptable for you.
Remember that every person is unique, and even if you haven't achieved leadership at work, you have a chance to develop your talent, and that's a chance to leave your mark on human history.
Learn to overcome your laziness. You know how to set goals, and if you don't, it's because you don't want to. The day will come when you'll regret your cowardice, but it will be too late, and you'll feel resentment and sighs of regret.
Your personality gives you everything: tolerance, determination, self-esteem, and firmness. It's unlikely anyone can hinder you, but you can become an obstacle to yourself.`, 
        scale: 'strong' 
      },
      { 
        count: 5, 
        label: 'The "11111" personality type', 
        verbatim: `The "11111" personality type
A highly pronounced power and leadership trait. This person advances toward their goals, disregarding those around them, even if their psychomatrix is an 8.
Even tolerance (8) cannot reliably curb their imperious nature.
Such people are rightly called despots. Unlimited power—or no power at all. Rarely can they stop; there is no limit to their aspirations for power.
It is precisely this pursuit of power that creates a hostile environment around them. It is safe to say that the outcome of any despot is known: they themselves beget their successors, who will also "step on" them.
The only way to preserve oneself is to escape power, as it knows no bounds. One despot will beget another, and there will be no end.
Tolerance and the pursuit of one's talent are the only ways to escape power. You can be an unrivaled artist, poet, dancer, actor, etc. These are all ways to realize the "11111" personality type, where there is leadership but no victimization by despotism.
Oddly enough, with the "11111" personality type, a person should step away from power to avoid ruining their own lives and those of their loved ones. It's better to become a great creator than a domineering fool.
Only understanding the characteristics of a despot's personality type will save you from conflict. Don't test your own strength if you have the "11111" personality type, and don't test the patience of another despot.

Recommendations for the "11111" personality type
It's hardest to give advice to those who never follow through, as they don't accept it due to their strength of character and self-righteousness. Life will judge for itself, but advice will be given nonetheless.
✓ Run from power—it's your downfall and your losses.
 ✓ If you live near a person with a despotic personality, you have only two options: either prevent the despot from revealing himself or submit to him.
✓ Seek your potential in science, art, and craftsmanship, and develop your talent.
✓ If you cannot tolerate humiliation and power over you, then don't create such a family.
✓ Remembering that there are people around you is the best advice for a despot.
✓ If your psychomatrix contains many 2s and 4s, it's best to take up sports, which will direct your energy toward victory.
Being a despot is difficult. However, you can't blame someone for being born a despot. There are always reasons for this, rooted in their parents and their family history. If this happens, it's necessary to step away from power, finding yourself in creativity and developing your talent.`, 
        scale: 'dominant' 
      },
      { 
        count: 6, 
        label: 'Characters "111111 and More"', 
        verbatim: `Characters "111111 and More"
As soon as the number of ones exceeds five digits, we can speak of a despot's "overload," which signifies a dramatic change in character. The person begins to fear their hidden desire for power. One could say they fear themselves when they are angry.
Based on their own demands for power, they clearly understand that they will never be able to attain it. The reason is both simple and surprising. God, the king, the president—lesser goals hold little interest for them.
It is precisely this realization of the impossibility of attaining full power that leads them to completely renounce it.
Such people may reveal their hidden plans only when they are highly intoxicated.
They are very tolerant and calm, and emotional outbursts occur only after a long period of accumulated grievances. When such a moment arrives, a single word is enough to release the enormous pent-up energy.
Close people should be aware of this and strive to release the accumulated resentment early, when it is less intense. Such people's sense of purpose is greatly reduced, as is their self-esteem. Their choice of work is determined not by their interest in it, but by the degree of freedom it offers: independence from management and independence from anyone.
And most importantly, such people are fearless; they don't know how to back down. If you have an overloaded personality, you must learn to restrain your urge to "make promises" or argue, putting your life or health on the line. You won't be able to back down, and you only have one life.

If you live with someone with an overloaded personality, help them; don't offend them with words or actions, lest this trigger an "explosion," which could ruin many lives.

Recommendations for the "111111 and More" personality types
What advice can you give to people with an overloaded despot personality type? "Be patient" is the simplest and most unfortunate advice. It's best to understand the obvious idea that follows from the question: "Who ruled the country during the time of A.S. Pushkin?"
The Emperor's name was first, and Alexander Sergeevich wasn't even second. A person's significance for their time and the times that followed isn't determined by their title or social standing, much less by their material wealth.
Talent is the measure that history will determine.
If there's someone in your family with an overburdened personality, help them understand this simple idea, find the strength and desire to unleash their talent, and assist them in self-realization.
It's essential to recognize their talent and carefully protect it from offense. Remember, even a single word or glance is enough to make them drop everything and be forever free of resentment.`, 
        scale: 'overload' 
      }
    ]
  },
  2: {
    digit: 2,
    cellName: 'Energy',
    intro: `The Pythagorean number 2 represents human energy. It is necessary to understand that energy in this case is a person's behavior in the family, at work and in society. The energy of Number 2 is not exactly identical to the known energy of your body, which in acupuncture is called the Chi of the meridians. We call a person 'energetic' if he can visualize a goal, find ways to achieve it and move forward to achieve it according to his own plan.

The energy of Number 2 also characterizes compatibility through energy contact. Questions of vampirism and donorship are always about Number 2 energy. In any conversation, one person takes the position of the donor and the other the vampire. The donor is the one who starts speaking about the interests of the other. The one who is in the center of the conversation (or brings up his own interests) becomes the vampire. A transition from '22' to '4' is also possible: physically perfect and beautiful people always draw attention to themselves — their contact energy (Number 2) comes from their healthy body, and if they are not aggressive and are quiet and kind, they can attract others.`,
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 1 (1, 2, 3) — Self-esteem.',
    meanings: [
      { 
        count: 0, 
        label: '"2-None" Energy', 
        verbatim: `"2-None" Energy
The absence of the number two in a psychomatrix indicates very low energy levels. Such individuals might be described as "vampires"—though one should not be alarmed by this term.
Any person (even an energy "donor") will begin to "vampirize" energy from others when experiencing an acute deficit of their own (due to stress, arguments, illness, fright, or grief).
People with low energy—or those who possess none at all—are characterized by laziness in their work and studies, excessive physical restlessness, fidgetiness, and a fear of conflict. As a rule, they always strive to avoid getting involved in arguments, yet they thoroughly enjoy witnessing them.
They often find it quite difficult to unlock their full potential and abilities due to their own laziness. Consequently, they tend to set their personal goals too low.
They tend to be very fond of dogs but less so of cats, as dogs act as energy "donors," whereas cats act as energy "vampires."

Recommendations for "2-None" Energy
The absence of active external energy in a person does not mean they are doomed to remain in this state forever. Energy can be cultivated. There are numerous methods for achieving this. One can utilize "number transitions" that generate energy (e.g., an "11" transitioning into an "8" with an additional "22"; or a "6" transitioning into a "7" with an additional "22"). Alternatively, one can focus on strengthening one's physical health, which also boosts energy levels (via the number transition: a "4" transitioning into a "22"). If you do not place your trust in these specific number transitions, you may instead turn to ancient systems for strengthening and cultivating energy—such as Qigong, Wushu, Yoga, Tai Chi, and others.
It is important to note the predisposition among people with low energy levels toward alcohol and drugs. Never neglect a child whose psychomatrix lacks the number two (or contains only a single "2"); similarly, one should keep a watchful eye on those with the "222" combination (often associated with psychic abilities).  The craving for alcohol and drugs stems from a search for a potent yet effortless source of energy. Offer the child praise, and through that praise, they will receive the energy they seek.`, 
        scale: 'absent' 
      },
      { 
        count: 1, 
        label: 'Energy "2"', 
        verbatim: `Energy "2"
The presence of a single "2" in a psychomatrix indicates that the individual suffers from an energy deficit. While the simultaneous presence of the number "4" may slightly boost this energy level, the fundamental characteristics inherent to a weakened energy state remain unchanged. Such individuals exhibit all the traits typical of those who possess no "2s" in their psychomatrix: laziness, restlessness, and a tendency toward fussiness. The sole distinction lies in the fact that these traits manifest selectively and in waves: the individual may suddenly become restless, yet be lazy in a selective manner—seemingly designating specific "zones of laziness" where they permit themselves to relax and rest.
These individuals also tend to avoid conflict, as they dislike expending their energy on such matters. Quite frequently, they perform good deeds for others with the specific aim of recouping their expended energy through praise—ideally, with a little extra thrown in. Praise, compliments, leadership roles, and standing out from the crowd—all these elements are characteristic of such individuals.
A potential pitfall for them is a craving for alcohol or drugs; for this very reason, this particular susceptibility must not be left unaddressed.
In conversation with others, they prefer to speak about themselves or on topics that personally interest them, while attempting to gently steer clear of topics that do not concern them.
Physical labor holds little appeal for them, as they simply lack the energy required for it.
 
Recommendations for Energy "2"
All recommendations previously provided for those who possess no "2s" in their psychomatrix remain valid (see "Recommendations for Energy '2-None'" above).
In summary, the following measures are recommended: numerical transfers (specifically, 11 into 8, 4 into 22, and 6 into 7); receiving praise from others; proper nutrition and breathing techniques; and the practice of Qigong, Yoga, or Wushu.  When working to refine your energy, it is essential to keep one simple rule in mind: before attempting to amplify your energy, you must first learn to conserve it and avoid wasting it unnecessarily. You must remember that we lose the greatest amount of energy during conflicts, when we strive to dominate another person, or when we engage in work that holds no interest for us.
Chinese medicine offers a simple maxim: "It is acceptable to feel tired, but one must never push oneself beyond one's limits or force oneself to endure excessive strain." If you feel weary, take a rest; if you find a particular person’s company unpleasant, simply distance yourself from them.
Bringing a dog into your home can yield excellent results in terms of boosting your family's collective energy. Naturally, if the family is suffering from a significant energy deficit, the dog you choose should be of a larger breed. However, you should refrain from keeping a cat in the house, as felines tend to "vampirize" energy—a tendency that would only serve to exacerbate the situation.`, 
        scale: 'very-weak' 
      },
      { 
        count: 2, 
        label: 'Energy "22"', 
        verbatim: `Energy "22"
If your psychomatrix contains two "twos," you can consider yourself fortunate. This represents the standard—the baseline level of energy essential for every human being—signifying that you possess a healthy energy reserve that is highly conducive to interacting with others and performing work.
You are sociable and adept at establishing connections with other people. Individuals endowed with this type of energy make excellent storytellers, lecturers, and public speakers; energetically speaking, they are natural healers.
You can set your sights on ambitious goals, for they are well within your reach—your energy reserves provide the capacity to achieve them. People with such robust energy are generally not prone to laziness; if you observe such an individual acting lazily, look for the root causes elsewhere—not in their energy levels, but rather in factors such as low self-esteem, a lack of drive, or other underlying issues.
If your psychomatrix also contains the number "4," you might consider pursuing a craft or trade that involves manual dexterity and working with your hands. Such individuals possess the stamina to endure monotonous and repetitive labor—whether they have yet to discover their true calling, or are compelled by fate to engage in such work. Furthermore, if your matrix features an abundance of "threes" (two or more) paired with an equal number of "fives," you are a natural-born technical expert, capable of mastering any form of machinery or technology.
The teaching profession is recommended only for those who possess a strong character (indicated by the presence of "111" or "1111" in the matrix); the presence of the number "8" is also considered a favorable indicator. However, one should be careful not to test the patience of a person with this robust energy, for if the situation demands it, they are fully prepared to engage in conflict to defend their own interests.

Recommendations for Energy "22"
These recommendations focus not on the preservation or augmentation of your energy, but rather on its effective utilization.
Remember: an individual endowed with this healthy energy has the capacity to set goals and successfully achieve them. Cultivating a strong sense of purpose—whether in yourself or in your child—and boosting self-esteem are the most critical priorities for anyone possessing this specific energy profile.
You must not allow this valuable energy to be squandered; instead, you must strive to unlock your full potential. For that very purpose—to enable you to realize your capabilities—was this energy bestowed upon you.`, 
        scale: 'norm' 
      },
      { 
        count: 3, 
        label: 'The "222" Energy', 
        verbatim: `The "222" Energy
If you have "222" in your psychomatrix, it signifies that you possess the mark of an "extrasensory person" from birth—or, simply put, you are an extrasensory individual.
Before you embark on "astonishing sessions of healing, hypnosis, or clairvoyance," let us first clarify exactly what an "extrasensory person" is. The answer to this question is actually quite simple: an extrasensory person is someone who possesses special abilities that manifest specifically in response to extraordinary circumstances. Indeed, it is precisely the occurrence of unexpected events that draws a person bearing this sign into the realm of extrasensory perception. Under normal conditions, such an individual differs very little from someone who has only a single "2" in their psychomatrix; in other words, one can draw an equal sign between "2" and "222" in the absence of a specific, extraordinary situation.
All the characteristics associated with the single "2" apply to the extrasensory person: a tendency toward laziness, high mobility, and a certain restlessness. Additionally, new qualities emerge: a reserved nature, a reluctance to share one's personal problems, emotional explosiveness when subjected to external pressure, and the ability to provide aid to others when necessary.
It is for these very reasons that many extrasensory individuals strive to be the center of attention; they intensely absorb energy from others, and only once they are fully "recharged" are they able to channel that energy back to another person—provided they deem it appropriate to do so.
It is best to seek employment that does not involve constant interaction with people, as the inherent instability of this energy can lead to complications in interpersonal relationships. Professions that are free of heavy physical labor (due to the aforementioned tendency toward laziness) yet offer limited contact with the public are the most suitable choices—for instance, working as a driver, or in an archive, warehouse, or museum.
 
Recommendations for the "222" Energy
The most important thing you must grasp is the unique nature of the extrasensory energy. It enables the individual to monitor the state of all their internal organs on a daily basis, thereby warding off illness—and even protecting against malevolent influences such as hexes or the "evil eye." An extrasensory person falls ill only when they consciously desire to take a rest, or when they have been "talked into" becoming ill by external suggestion.  One must not foist a diagnosis upon such people; rather, they must be convinced of their absolute health.
If, however, an extrasensory individual claims that an illness is approaching, they simply need to rest without a specific pretext (a sick leave certificate or medical note constitutes a pretext). One must not entertain any thoughts of illness; otherwise, the illness will be self-induced, as the individual will focus their energy directly upon it.
It is essential to understand how such an individual heals others. Their methods are remarkably simple: attention, kindness, responsiveness, and tenderness—qualities they lavish upon their "patient." Do not expect this state to endure for long—it lasts no more than two days, after which they revert to their customary withdrawn and short-tempered demeanor.`, 
        scale: 'special' 
      },
      { 
        count: 4, 
        label: 'Energy Profile: "2222 and Above"', 
        verbatim: `Energy Profile: "2222 and Above"
If your psychomatrix contains four or more "2s," it signifies that you are a "donor"—a person possessing an excess of energy that you are free to expend as you see fit.
However, a challenge often arises regarding how to properly channel this available energy.
The issue is that such individuals may squander their energy on passive activities—such as watching television programs—without doing anything to foster their own personal development. This behavior could be labeled as laziness, though in this specific context, it stems from an *excess* of energy rather than a lack thereof. Occasionally, this surplus energy may manifest as an excessive calmness that borders on total indifference toward everything around you.
The best approach is to test your abilities in fields such as sports, medicine, teaching, or manual labor; all of these require a significant expenditure of energy and are ideally suited for "donors." If you fail to expend this energy, you may develop an urge to seek out conflict—a confrontation that serves to "discharge" the donor and provide a sense of relief. I would argue, however, that this is hardly the most constructive method for ridding oneself of excess energy.
Cats are particularly effective at absorbing this surplus energy (specifically female cats—*felines*—as male cats tend to absorb a significantly smaller amount).
If your psychomatrix also contains the number "4," you might consider pursuing a career in professional sports.
If you possess a sufficient number of "5s" and "9s" (two or more of each), you could find your calling in the sciences. If your matrix features the "66" signature, try to identify a craft or trade where you can fully realize your potential as a true "Master" (e.g., a cabinetmaker, a fashion cutter/designer, etc.).
A high concentration of "2s" endows individuals with physical strength; consequently, engaging in sports or physical training is highly beneficial for them (for men, this may also extend to careers in the military or law enforcement).
 
Recommendations for the "2222 and Above" Energy Profile
If nature has bestowed upon you such a generous gift—the gift of powerful, abundant energy—make it your priority to utilize it constructively, for the benefit of both yourself and others. The most critical step you must take is to set clear goals for yourself and begin moving forward toward achieving them.  It must not be forgotten that any energy you are unable to expend will yield nothing positive—save, perhaps, for irritability and, at times, obstinacy.
You have been endowed with robust health, which draws its strength from your energy; for this very reason, illness is by no means the norm for a "donor"—rather, it comes as a surprise. Consequently, it is imperative to immediately identify the underlying causes of such an unusual occurrence. As a rule, this is a case of *porcha* (a malevolent hex)—particularly if the illness struck suddenly and without warning—or the ailment may stem from a loss of one's sense of duty toward one's parents, serving as a form of karmic retribution.
The final cause of illness lies in the inability to properly manage and utilize one's own energy.`, 
        scale: 'strong' 
      }
    ]
  },
  3: {
    digit: 3,
    cellName: 'Interest in Studying, Interests',
    intro: 'The number 3 in the square of Pythagoras is responsible for interest in the sciences and, above all, in the exact sciences or technology. Never forget that 3 is contained in several rows when you are going to evaluate this number in the Pythagorean square, namely the column (1, 2, 3), the ascending diagonal (3, 5, 7) and the 3rd row (3, 6, 9). The reason is that number 3 is responsible for persons interests in general. To decide what this interest consists of, it is necessary to determine what line owns the 3s at the moment.',
    lineContext: 'Column (1,2,3) — Self-appraisal. Ascending Diagonal (3,5,7) — Carnal/Financial. Row (3,6,9) — Stability.',
    meanings: [
      {
        count: 0,
        label: 'The "3-Absent" Interest Profile',
        verbatim: `The "3-Absent" Interest Profile
The absence of the number 3 in a psychomatrix signifies a person's natural inclination toward the humanities and the arts.
When discussing a child's interests—particularly those of a boy—a specific problem often arises. Almost all fathers believe that engaging in the humanities, and especially the arts, is entirely incompatible with "masculine" interests. Consequently, such interests are often actively stifled during childhood by "zealous" fathers who strive to instill in their sons a typically male interest in technology and engineering. This approach is not particularly wise, for it is nature itself that shapes a child and determines his true purpose in life.
It is precisely because of the diversity of human interests that humanity continues to exist as a species on this planet; otherwise, we would have long since wiped ourselves out. Who, if not artists and humanists, has demonstrated the very possibility of peaceful coexistence for humanity as a species?
Nature recognizes no such concepts as pity or compassion; within the natural world, only the principle of "survival of the fittest" prevails. However, this principle does not apply to human beings—even though individuals prone to aggression and conflict do appear among us, they are not the ones who drive humanity forward. It is philosophers and writers who offer us the opportunity to understand and pursue a non-aggressive path of progress.
If your child lacks the number 3 in their psychomatrix, allow them to fulfill their unique mission for the benefit of humanity: they were born to create new facets of philosophy, art, and culture. They perceive technology only superficially—judging it primarily by its elegance and aesthetic beauty.
Given that the number 3 is a component of various numerical lines within the matrix, its absence can indicate a certain instability in a person's interests, as well as a tendency to underestimate their own capabilities. This often leads to a delayed realization of their true potential and identity; indeed, many individuals lacking the number 3 never fully "unfold" their talents. By the time they finally grasp their true calling, they have often already established families, raised children, and settled into careers—at which point, any opportunity to cultivate their innate talent (which is governed by the third column of numbers: 7, 8, and 9) has effectively vanished.  It is essential to grasp one very simple concept: we ourselves determine the threshold of our own aging.
If, at the age of 20, a person considers themselves fully "settled"—with habits already set in stone—then do not be offended if, five years later, wrinkles appear and, by the time you turn 30, you look every bit of 35 or 40.
Recall the line from Captain Vrungel’s song: "The name you give your yacht determines how she’ll sail." The same applies to a human being: the sooner you mentally cast yourself as "old," the sooner you will physically age.
Attempting to "unfold" your true self does not mean changing professions or quitting the job that puts food on your table. Rather, it signifies the necessity of unlocking your innate talent—a process that requires you to actually make the attempt.
If you have an inclination toward the arts and the humanities (indicated by the absence of the numbers 3 and 6, and the presence of many numbers in the third column), then start drawing, sculpting, or composing music. Do not be surprised by this suggestion; it is a vital necessity for you.
At the end of their lives, everyone takes stock of their journey; consider, then, what legacy you will leave behind—something that might give others a reason to remember you.
The notion that you will be remembered by your children and grandchildren—but not by your great-grandchildren, who likely won't even recall your name—is a hollow one. Leave behind something tangible—something you have created in the process of striving to unlock your true potential. I believe Kazimir Malevich’s *Black Square* serves as an excellent example of such "simple genius."`,
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Interest "3"',
        verbatim: `Interest "3"
If you have a single "3" in your psychomatrix—is this a good thing or a bad one? It depends entirely on you. If your goal is to develop your abilities, then you are definitely in luck; you are free to pursue any field of study, as you have not yet fully committed to the humanities, nor have you yet aligned yourself exclusively with the exact sciences. You can find an optimal path by engaging in disciplines that bridge these two branches of knowledge: the natural sciences, economics, law, and so on.
Crucially, you must understand that it is essential to choose a specific direction; otherwise, you risk doing yourself a disservice by allowing your interests to become too scattered.
This is precisely the downside of the "3" quality: rather than focusing one's interest, it disperses it. Consequently—even among individuals with strong aptitude for academic work—many fail to pinpoint their true interests; having scattered their knowledge across various fields, they eventually abandon academia or never even attempt to pursue it seriously.
Let me reiterate: you must precisely define the specific focus of your interests. If you fail to do so, it could be said that you lack a genuine interest in *any* particular field of knowledge—a risk that is especially high if you possess a low energy level (indicated by "2-none," "2," or "222").
As you may have noticed, the chapter titled "Interest: '3-None'" offered no specific recommendations regarding marriage or the significance of the number "3" itself in that context. The reason is that the number "3," in and of itself, has almost no bearing on marital matters (aside from the influence it exerts when appearing within specific "lines" of the psychomatrix). Furthermore, regarding the notion of "amplifying" the power of the number "3": this concept is essentially meaningless. Since the number "3" pertains specifically to a person's *interests*, how could one logically claim that an individual's interest in a given subject has been "amplified" solely by the presence of this number? I believe that any such amplification is actually influenced by other numbers within the psychomatrix—or, more accurately, by other fundamental personality traits of the individual in question.  For the sake of illustration, let us assume that a person, having actively immersed themselves in the exact sciences and technology, has begun to amplify the influence of the number 3. Yet, you will observe that this number has effectively "dropped out" of their palm lines; consequently, the individual has suffered a noticeable decline in the strength of the qualities governed by those lines—specifically, stability, sexual vitality, and self-esteem.
Consider this: would it truly benefit the family if an individual were to diminish these vital qualities in favor of pursuing an interest in technology and the exact sciences? More often than not, when events unfold in this manner, the individual fails to fully realize their potential even in their chosen field, as they lack a natural aptitude for those particular sciences.
There is no need to fabricate virtues for yourself or to attempt to cultivate traits that will yield no fruitful results; it is far better to unleash your true talent within those domains of human knowledge where your innate strengths truly lie. Reflect on this: one might succeed in becoming a competent engineer or economist, yet in doing so, effectively vanish from the world as the talented artist, writer, or expert in other fields of human endeavor that one was destined to become.
Do not attempt to convince yourself that you have already contributed enough to your current scientific field; you have yet to discover the full extent of what you are capable of achieving if only you were to unlock your true, natural abilities.

The primary reason for such a misguided path of self-realization lies in the parents' failure to recognize their child's true aptitudes. Following in one's parents' footsteps is a valid choice only when the child possesses a genuine inclination to do so; it is never justified, however, if the cost is the destruction of a unique talent.`,
        scale: 'very-weak'
      },
      {
        count: 2,
        label: '"33"',
        verbatim: `"33"
Your psychomatrix contains two 3s; this indicates that you have an interest in the exact sciences and technology, but it does not necessarily mean that you are equipped to confidently pursue these fields.
It is essential to determine how best to channel this interest—or, if a direct path is not available, to identify which alternative direction your existing 3s should be steered toward.
Let us assume that, in addition to the two 3s, your psychomatrix also contains two 5s (or more), a 22, and a 6. Taken together, these numbers suggest that—given your natural aptitudes—you possess strong logic and good energy levels, and that you are a person of shifting moods who occasionally enjoys working with their hands for personal pleasure. Based on this numerical configuration, one can conclude that you would likely make an excellent engineer or design specialist, as you possess the ability to fully grasp and navigate technological processes.
Conversely, if your psychomatrix contains a 5 (or a missing 5), a 22, and a missing 6 (or a single 6), it can be said that—despite the presence of two 3s—you lack logical reasoning skills. The consequence of this is that while working with technology, you may accumulate experience and, by drawing upon it, eventually come to understand the specific equipment you have mastered; however, this does not qualify you as a truly skilled technical expert. You should refrain from attempting to test your abilities in the field of technical design or engineering, as your lack of logic would likely cause you to become a mere dreamer—someone capable only of fantasizing. Bringing your ideas to life in the real world would often prove simply impossible due to their inherent impracticality and lack of realism. Your best course of action would be to pursue a career in design (specifically, the aesthetic styling or external appearance of technology), thereby leaving the task of assessing the technical feasibility of your proposed aesthetics to those individuals who possess analytical capabilities.
In this specific scenario, the absence of the number 5—or even the presence of a single 9—does not constitute a hindrance; on the contrary, it is precisely the role of the designer to challenge and inspire engineers to push the boundaries of what is technically possible in order to create more aesthetically pleasing technology.  A designer should not limit themselves to the constraints of current capabilities—unless the task involves designing an enclosure for a pre-existing device; even in that specific instance, however, the work should be entrusted to a designer who possesses at least one "5."
Sometimes, a passion for technology can become a domestic disaster, as any attempt to repair household appliances invariably renders them completely unusable. This scenario typically arises when an individual possesses an abundance of energy, a strong-willed nature (or a prominent "1"), yet lacks a "5" and has only a single "9."
If you know that your husband or son possesses such numerical traits, do not give them any reason to believe they are technically gifted. For a child with this profile, the best career choice is one that allows them to be around and work with technology without engaging in its repair—a task that is, for them, impossible due to a lack of the requisite logic and memory. Remember that there are numerous professions involving technology, and the vast majority of them do not entail repair work (e.g., driver, salesperson, operator, etc.).
The presence of two "3s" also has repercussions on other aspects of life, particularly regarding one's intimate life. An individual with this configuration takes a keen interest in the *techniques* of sex—a pursuit that constitutes a genuine need for them—and this is a factor that must be taken into account when establishing a family. Do not overlook such ancient treatises as the *Kama Sutra* and *The Secrets of the Jade Chamber*.`,
        scale: 'norm'
      },
      {
        count: 3,
        label: 'The "333" Interest Profile',
        verbatim: `The "333" Interest Profile
If your psychomatrix contains three "3s," it signifies that your interest in academic pursuits is inherently unstable—a trait that can manifest in various ways. While possessing a strong inclination toward the exact sciences and technology, such an individual often feels drawn to other fields of knowledge, leading to a shift in focus. Ideally, one interest should serve as a natural extension of the previous one; this ensures there is no discontinuity in accumulated knowledge—a gap that, if left unchecked, can often lead to a complete abandonment of one's work or vocation.
The most optimal fields of study are those that draw upon the exact sciences (mathematics, physics, engineering). Consequently, you should seek to apply your knowledge in areas where other disciplines intersect with the exact sciences—such as mathematical linguistics, computer engineering, bionics, and so forth.
Such transitions typically occur in individuals whose psychomatrix—in addition to the three "3s"—also features a "55" (or higher), a "99" (or higher), and/or a "22" (or higher) combination. As you can see, this profile describes individuals who possess strong logical faculties (the "5" factor) or a powerful memory (the "9" factor), coupled with a robust energy reserve (the "2" factor).
Conversely, if the "5," "9," and "2" digits are weakly represented in the psychomatrix, the shift in interest will tend to veer in other directions—specifically, those associated with the particular "lines" or axes within the matrix that contain the number "3."
Consequently, the individual may develop a heightened interest in their intimate life, particularly when a deep-seated need for emotional or physical closeness arises. Alternatively, there may be a sudden and intense resurgence of various personal habits or routines (such as morning jogging, reading before bed, etc.).
A less favorable scenario arises when the individual experiences a sharp increase in self-criticism—sometimes bordering on self-flagellation—though an even worse outcome is the sudden unleashing of unbridled ambition. One should prepare for such crises in advance, as they typically emerge as a result of physical exhaustion, emotional burnout, or interpersonal conflict.
While it is quite difficult to prevent such a crisis entirely, it is certainly possible to mitigate its severity and impact.  One’s loved ones should step in to help—those capable of understanding the individual’s state of mind and assisting them in overcoming their difficulties: a wife’s attentiveness, a friend’s support in new endeavors, and so forth.
The most important thing to remember is that the presence of three "threes" has always been associated with an interest in science; this signifies that the individual is duty-bound to unlock their full potential.
Fascinating results can be achieved by synthesizing one’s various personal interests into a single cohesive theory. We rarely witness a truly compelling synthesis of sciences, as each of the disciplines being combined tends to vie for dominance; consequently, no true synthesis takes place—there is merely a borrowing of methods or techniques. It is a different matter entirely when various sciences converge within the mind of a single individual who has cultivated an equal interest in each of them—for this is precisely what gives birth to entirely new disciplines and bodies of knowledge.
The only things that can hinder a person from realizing their full potential are a lack of self-belief, laziness, and an undue deference to "authorities"—figures who invariably reject anything new, as it poses a threat to the prestige and reputation they have so painstakingly constructed.
Every individual has the right to formulate their own hypothesis; its validity will ultimately be proven or disproven by the passage of time—not by any self-proclaimed "learned scholar."`,
        scale: 'special'
      },
      {
        count: 4,
        label: 'The "3333 or More" Interest',
        verbatim: `The "3333 or More" Interest
In our time, this is a rather rare sign, though it does appear occasionally. It signifies a profound interest in science and technology. One could say that such a person is born to be an inventor or a designer.
If the numbers 5 and 9 are active within the psychomatrix (appearing two or more times each), then it is essential to engage in science in its literal sense—that is, by working in a research institute or a laboratory.
If the numbers 5 and 9 are weakly represented, one should not abandon the attempt to give expression to one's "3s." There is a simple yet reliable method for doing so: write a science fiction novel in which you can incorporate all your ideas and thoughts. Who could possibly fault a writer for the fact that their ideas are not grounded in reality? Science fiction is precisely the literary genre in which an individual is free to express their thoughts without constraint.
I once proposed a concept for a new type of school—one designed to foster children's interests and aptitudes. This model envisioned introducing a mandatory subject for all students: "Imagination." Through this class, every child would be able to unlock their potential and share their thoughts without the fear of receiving a failing grade or being ridiculed.
Is it not obvious that truly groundbreaking innovations are slow to enter our lives? This is because, among the general population, only 5–7% possess a forward-looking mindset; the rest merely refine what already exists—and it is precisely this latter group that hinders the acceptance of new theories. I am convinced that if every individual were free to voice all their ideas without worrying about how they would be perceived, the world would make tremendous strides in understanding the ultimate purpose of existence.
When analyzing any individual's psychomatrix, always carefully evaluate the presence and significance of the number 3, as this factor will largely determine that person's choice of profession and personal interests.

Let me reiterate: to successfully realize one's potential as a skilled technical specialist or a professional in the exact sciences, the psychomatrix must contain two or more instances of the number 5.  If, however, these numbers are absent—or if there is only a single 5—it is inadvisable to engage in the repair or assembly of machinery, as a lack of logical aptitude will inevitably lead to errors. Conversely, if the presence of the number 5 is weak, yet the number 3 appears frequently (three times or more), one should pursue a career in design or begin writing science fiction novels; these avenues provide an excellent opportunity to channel this specific interest.
In women, the energy associated with the number 3 is most often absorbed by other life lines; these lines enable them to express this energy—not within the realms of science or technology—but rather within the domestic sphere: in homemaking, relationships, and personal style. This outcome is far preferable to a situation where a woman sacrifices qualities essential to family life by immersing herself deeply in the study of the exact sciences or technical fields.
It must be noted that after giving birth, any woman will experience a depletion of her energy reserves; this inevitably leads to a shift in her interests and goals, meaning that her passion for complex academic disciplines may wane—regardless of whether or not her husband actively supports her personal development. I believe it is precisely for this purely physiological reason that men generally have a greater opportunity to fully realize their potential than women do. Thus, I offer but one piece of advice to the ladies: do not delay—make haste.`,
        scale: 'strong'
      }
    ]
  },
  4: {
    digit: 4,
    cellName: 'Health',
    intro: 'Digit 4 in the psychomatrix answers for the health of a person. The assessment of fours in the psychomatrix does not allow evaluating the strength of a specific organ or highlighting those diseases to which a person is prone due to the peculiarities of his energy. Digit 4 answers for the human body, but this characteristic is more interesting than the state of health. By the presence of digit 4 in the psychomatrix, one can (without seeing the person and knowing nothing about him) assume how he looks, how attractive he is, how physically strong. Number 4 is included into following lines: 1st row (1, 4, 7) — purposefulness of the person, and 2nd column (4, 5, 6) — material maintenance of the family.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 2 (4, 5, 6) — Material maintenance of the family.',
    meanings: [
      { 
        count: 0, 
        label: 'Health Profile: "4-Absent"', 
        verbatim: `Health Profile: "4-Absent"
If the number 4 is missing from your psychomatrix, it signifies that you were not endowed with innate health at birth; consequently, you must actively work to strengthen and care for it. Cultivating a robust physique is quite challenging, as it demands a significant expenditure of energy. Engaging in professional sports—particularly strength-based disciplines—is not recommended, as the physical wear and tear resulting from such training will far outweigh the energy gains derived from an active lifestyle; under such strenuous loads, the individual is prone to falling ill. Individuals lacking a 4 in their psychomatrix are generally disinclined toward manual labor due to their limited physical reserves. Should such a person nevertheless engage in physical work, they will instinctively seek external sources to replenish their depleted energy—such as alcohol, drugs, or by instigating arguments and conflicts within the family.
It is imperative that you prioritize strengthening your health; the most effective approach is to adopt one of the ancient holistic wellness systems, such as Wushu, Qigong, Yoga, or similar disciplines.
By fortifying your health, you empower yourself to set and pursue loftier goals. You will find it easier to provide for your family, as you will possess the necessary physical stamina to perform your work effectively. Health can also be strengthened through the "conversion" of other numbers within your matrix: specifically, when an "11" converts into an "8" (yielding an additional "4"), or when a "6" converts into a "7" (yielding an additional "4"). To facilitate this conversion, you must cultivate the virtue of tolerance within yourself or actively engage in the arts. However, be careful not to conflate genuine artistic engagement—driven by a child's own intrinsic interest—with activities (such as music lessons) that parents impose upon a child, demanding genius-level proficiency simply because they have paid for the instruction.`, 
        scale: 'absent' 
      },
      { 
        count: 1, 
        label: 'Health Profile: "4"', 
        verbatim: `Health Profile: "4"
If your psychomatrix contains exactly one instance of the number 4, it indicates that you were born with a baseline level of health; however, this constitution is not sufficiently robust to warrant neglecting preventive care or health maintenance.
If, in addition to this single 4, your matrix also contains four or more instances of the number 2, you may successfully pursue a career in sports or engage in physically demanding labor.
Much like those who completely lack the number 4, individuals with a single 4 in their matrix tend to avoid conflict, as engaging in disputes results in a significant depletion of their health and energy reserves.  All recommendations for boosting energy provided in the "Health: The '4-No's'" section remain valid and beneficial in this context.
If you are in poor health (or lack it entirely), do not rush to choose a profession involving authority over others. It is essential to carefully assess the safety of such a step for your well-being.
If you possess strong "22" energy—or "2222 or more"—combined with a strong character profile (specifically, the tolerance combinations of 111 and 8, 1111 and 8, or 11111 and 8), you may attempt to pursue a career as a "person of authority."
However, if you lack a strong character profile (i.e., you have only 11 or 1), it is wiser to spare your health; otherwise, in your pursuit of your dream, you risk losing your health even faster (a process involving the numerical transition of 8 into 11, accompanied by the loss of 4 or 22).

Excessive engagement in household chores or gardening can also lead to a decline in health, as this triggers a numerical transition of 7 into 6, resulting in the loss of 4 or 22. I believe anyone would agree that it is far easier to preserve one's health than to restore it.`, 
        scale: 'very-weak' 
      },
      { 
        count: 2, 
        label: 'Health: "44 or More"', 
        verbatim: `Health: "44 or More"
If your psychomatrix contains two or more fours, it signifies that you have been endowed with robust health from birth—and, along with it, a beautiful, strong physique.
You can confidently engage in sports, even at a professional level. Physical labor is also a viable option; however, you should also take into account other numbers—specifically the number 6, which governs one's inclination toward physical work (particularly if you have two or more sixes).
Alongside your physical vitality, you possess a sufficient degree of determination to set goals and achieve them; however, an intense anxiety regarding your ability to provide for your family could potentially undermine these efforts.
With such powerful numerical indicators, a person should not, in theory, fall ill. Should this occur—specifically in the case of serious ailments—it becomes imperative to identify the root cause of the illness, as discussed earlier.
The primary challenge—one you will inevitably face—stems from the sheer physical strength you were born with, a power that is often wielded as a final "argument" in a dispute. Strive to refrain from resorting to such displays of force. Recall the old adage: "There is no defense against a crowbar—unless you have another crowbar." Do not delude yourself into thinking that luck will be on your side and that this metaphorical "crowbar" will simply pass you by.
Overconfidence in one's physical prowess often propels individuals—particularly those with three fours (444)—into physical altercations. Despite possessing powerful physiques, they frequently compromise their health by overtaxing their bodies, failing to exercise moderation in their work or athletic pursuits.
As for the influence of the number four on one's family life, it primarily manifests in the physical appearance of the spouses. It is no secret that we tend to select our life partners based on physical appearance—far less frequently based on intellect, and even more rarely based on sexual compatibility.
While one's intellect can be assessed with relative ease, determining temperamental compatibility within a marriage remains a complex issue; this is largely due to societal norms regarding female propriety, which often create complications further down the line.  It is commendable that young people strive to remain faithful to tradition; however, there is a way to help them understand one another's temperament without resorting to physical intimacy.
Examine each individual's "physical diagonal," and everything will fall into place; you will be able to assess each person's temperament based on the strength of this specific line (comprising the numbers 3, 5, and 7). Now, imagine that a person possesses a high number of 4s—which endows them with a beautiful physique—yet their physical diagonal is weak. This implies that potential difficulties may arise if one partner's temperament is significantly stronger than the other's.
When seeking a partner, do not place your trust in physical appearance alone, as it is often deceptive; strong arms and broad shoulders do not necessarily equate to sexual vigor or potency. The number 4 bears no relation to a person's intimate life; therefore, consult the physical diagonal before attributing qualities that do not actually exist. This applies particularly to women who possess a strong physical diagonal (3, 5, 7). Ideally, the male partner should be one digit stronger than the female, or possess an equal number of digits within this specific diagonal.`, 
        scale: 'norm' 
      },
      { 
        count: 3, 
        label: 'Health: "44 or More"', 
        verbatim: `Health: "44 or More"
If your psychomatrix contains two or more fours, it signifies that you have been endowed with robust health from birth—and, along with it, a beautiful, strong physique.
You can confidently engage in sports, even at a professional level. Physical labor is also a viable option; however, you should also take into account other numbers—specifically the number 6, which governs one's inclination toward physical work (particularly if you have two or more sixes).
Alongside your physical vitality, you possess a sufficient degree of determination to set goals and achieve them; however, an intense anxiety regarding your ability to provide for your family could potentially undermine these efforts.
With such powerful numerical indicators, a person should not, in theory, fall ill. Should this occur—specifically in the case of serious ailments—it becomes imperative to identify the root cause of the illness, as discussed earlier.
The primary challenge—one you will inevitably face—stems from the sheer physical strength you were born with, a power that is often wielded as a final "argument" in a dispute. Strive to refrain from resorting to such displays of force. Recall the old adage: "There is no defense against a crowbar—unless you have another crowbar." Do not delude yourself into thinking that luck will be on your side and that this metaphorical "crowbar" will simply pass you by.
Overconfidence in one's physical prowess often propels individuals—particularly those with three fours (444)—into physical altercations. Despite possessing powerful physiques, they frequently compromise their health by overtaxing their bodies, failing to exercise moderation in their work or athletic pursuits.
As for the influence of the number four on one's family life, it primarily manifests in the physical appearance of the spouses. It is no secret that we tend to select our life partners based on physical appearance—far less frequently based on intellect, and even more rarely based on sexual compatibility.
While one's intellect can be assessed with relative ease, determining temperamental compatibility within a marriage remains a complex issue; this is largely due to societal norms regarding female propriety, which often create complications further down the line.  It is commendable that young people strive to remain faithful to tradition; however, there is a way to help them understand one another's temperament without resorting to physical intimacy.
Examine each individual's "physical diagonal," and everything will fall into place; you will be able to assess each person's temperament based on the strength of this specific line (comprising the numbers 3, 5, and 7). Now, imagine that a person possesses a high number of 4s—which endows them with a beautiful physique—yet their physical diagonal is weak. This implies that potential difficulties may arise if one partner's temperament is significantly stronger than the other's.
When seeking a partner, do not place your trust in physical appearance alone, as it is often deceptive; strong arms and broad shoulders do not necessarily equate to sexual vigor or potency. The number 4 bears no relation to a person's intimate life; therefore, consult the physical diagonal before attributing qualities that do not actually exist. This applies particularly to women who possess a strong physical diagonal (3, 5, 7). Ideally, the male partner should be one digit stronger than the female, or possess an equal number of digits within this specific diagonal.`, 
        scale: 'special' 
      },
      { 
        count: 4, 
        label: 'Health: "44 or More"', 
        verbatim: `Health: "44 or More"
If your psychomatrix contains two or more fours, it signifies that you have been endowed with robust health from birth—and, along with it, a beautiful, strong physique.
You can confidently engage in sports, even at a professional level. Physical labor is also a viable option; however, you should also take into account other numbers—specifically the number 6, which governs one's inclination toward physical work (particularly if you have two or more sixes).
Alongside your physical vitality, you possess a sufficient degree of determination to set goals and achieve them; however, an intense anxiety regarding your ability to provide for your family could potentially undermine these efforts.
With such powerful numerical indicators, a person should not, in theory, fall ill. Should this occur—specifically in the case of serious ailments—it becomes imperative to identify the root cause of the illness, as discussed earlier.
The primary challenge—one you will inevitably face—stems from the sheer physical strength you were born with, a power that is often wielded as a final "argument" in a dispute. Strive to refrain from resorting to such displays of force. Recall the old adage: "There is no defense against a crowbar—unless you have another crowbar." Do not delude yourself into thinking that luck will be on your side and that this metaphorical "crowbar" will simply pass you by.
Overconfidence in one's physical prowess often propels individuals—particularly those with three fours (444)—into physical altercations. Despite possessing powerful physiques, they frequently compromise their health by overtaxing their bodies, failing to exercise moderation in their work or athletic pursuits.
As for the influence of the number four on one's family life, it primarily manifests in the physical appearance of the spouses. It is no secret that we tend to select our life partners based on physical appearance—far less frequently based on intellect, and even more rarely based on sexual compatibility.
While one's intellect can be assessed with relative ease, determining temperamental compatibility within a marriage remains a complex issue; this is largely due to societal norms regarding female propriety, which often create complications further down the line.  It is commendable that young people strive to remain faithful to tradition; however, there is a way to help them understand one another's temperament without resorting to physical intimacy.
Examine each individual's "physical diagonal," and everything will fall into place; you will be able to assess each person's temperament based on the strength of this specific line (comprising the numbers 3, 5, and 7). Now, imagine that a person possesses a high number of 4s—which endows them with a beautiful physique—yet their physical diagonal is weak. This implies that potential difficulties may arise if one partner's temperament is significantly stronger than the other's.
When seeking a partner, do not place your trust in physical appearance alone, as it is often deceptive; strong arms and broad shoulders do not necessarily equate to sexual vigor or potency. The number 4 bears no relation to a person's intimate life; therefore, consult the physical diagonal before attributing qualities that do not actually exist. This applies particularly to women who possess a strong physical diagonal (3, 5, 7). Ideally, the male partner should be one digit stronger than the female, or possess an equal number of digits within this specific diagonal.`, 
        scale: 'strong' 
      },
      { 
        count: 5, 
        label: 'Health: "44 or More"', 
        verbatim: `Health: "44 or More"
If your psychomatrix contains two or more fours, it signifies that you have been endowed with robust health from birth—and, along with it, a beautiful, strong physique.
You can confidently engage in sports, even at a professional level. Physical labor is also a viable option; however, you should also take into account other numbers—specifically the number 6, which governs one's inclination toward physical work (particularly if you have two or more sixes).
Alongside your physical vitality, you possess a sufficient degree of determination to set goals and achieve them; however, an intense anxiety regarding your ability to provide for your family could potentially undermine these efforts.
With such powerful numerical indicators, a person should not, in theory, fall ill. Should this occur—specifically in the case of serious ailments—it becomes imperative to identify the root cause of the illness, as discussed earlier.
The primary challenge—one you will inevitably face—stems from the sheer physical strength you were born with, a power that is often wielded as a final "argument" in a dispute. Strive to refrain from resorting to such displays of force. Recall the old adage: "There is no defense against a crowbar—unless you have another crowbar." Do not delude yourself into thinking that luck will be on your side and that this metaphorical "crowbar" will simply pass you by.
Overconfidence in one's physical prowess often propels individuals—particularly those with three fours (444)—into physical altercations. Despite possessing powerful physiques, they frequently compromise their health by overtaxing their bodies, failing to exercise moderation in their work or athletic pursuits.
As for the influence of the number four on one's family life, it primarily manifests in the physical appearance of the spouses. It is no secret that we tend to select our life partners based on physical appearance—far less frequently based on intellect, and even more rarely based on sexual compatibility.
While one's intellect can be assessed with relative ease, determining temperamental compatibility within a marriage remains a complex issue; this is largely due to societal norms regarding female propriety, which often create complications further down the line.  It is commendable that young people strive to remain faithful to tradition; however, there is a way to help them understand one another's temperament without resorting to physical intimacy.
Examine each individual's "physical diagonal," and everything will fall into place; you will be able to assess each person's temperament based on the strength of this specific line (comprising the numbers 3, 5, and 7). Now, imagine that a person possesses a high number of 4s—which endows them with a beautiful physique—yet their physical diagonal is weak. This implies that potential difficulties may arise if one partner's temperament is significantly stronger than the other's.
When seeking a partner, do not place your trust in physical appearance alone, as it is often deceptive; strong arms and broad shoulders do not necessarily equate to sexual vigor or potency. The number 4 bears no relation to a person's intimate life; therefore, consult the physical diagonal before attributing qualities that do not actually exist. This applies particularly to women who possess a strong physical diagonal (3, 5, 7). Ideally, the male partner should be one digit stronger than the female, or possess an equal number of digits within this specific diagonal.`, 
        scale: 'dominant' 
      },
      { 
        count: 6, 
        label: 'Health: "44 or More"', 
        verbatim: `Health: "44 or More"
If your psychomatrix contains two or more fours, it signifies that you have been endowed with robust health from birth—and, along with it, a beautiful, strong physique.
You can confidently engage in sports, even at a professional level. Physical labor is also a viable option; however, you should also take into account other numbers—specifically the number 6, which governs one's inclination toward physical work (particularly if you have two or more sixes).
Alongside your physical vitality, you possess a sufficient degree of determination to set goals and achieve them; however, an intense anxiety regarding your ability to provide for your family could potentially undermine these efforts.
With such powerful numerical indicators, a person should not, in theory, fall ill. Should this occur—specifically in the case of serious ailments—it becomes imperative to identify the root cause of the illness, as discussed earlier.
The primary challenge—one you will inevitably face—stems from the sheer physical strength you were born with, a power that is often wielded as a final "argument" in a dispute. Strive to refrain from resorting to such displays of force. Recall the old adage: "There is no defense against a crowbar—unless you have another crowbar." Do not delude yourself into thinking that luck will be on your side and that this metaphorical "crowbar" will simply pass you by.
Overconfidence in one's physical prowess often propels individuals—particularly those with three fours (444)—into physical altercations. Despite possessing powerful physiques, they frequently compromise their health by overtaxing their bodies, failing to exercise moderation in their work or athletic pursuits.
As for the influence of the number four on one's family life, it primarily manifests in the physical appearance of the spouses. It is no secret that we tend to select our life partners based on physical appearance—far less frequently based on intellect, and even more rarely based on sexual compatibility.
While one's intellect can be assessed with relative ease, determining temperamental compatibility within a marriage remains a complex issue; this is largely due to societal norms regarding female propriety, which often create complications further down the line.  It is commendable that young people strive to remain faithful to tradition; however, there is a way to help them understand one another's temperament without resorting to physical intimacy.
Examine each individual's "physical diagonal," and everything will fall into place; you will be able to assess each person's temperament based on the strength of this specific line (comprising the numbers 3, 5, and 7). Now, imagine that a person possesses a high number of 4s—which endows them with a beautiful physique—yet their physical diagonal is weak. This implies that potential difficulties may arise if one partner's temperament is significantly stronger than the other's.
When seeking a partner, do not place your trust in physical appearance alone, as it is often deceptive; strong arms and broad shoulders do not necessarily equate to sexual vigor or potency. The number 4 bears no relation to a person's intimate life; therefore, consult the physical diagonal before attributing qualities that do not actually exist. This applies particularly to women who possess a strong physical diagonal (3, 5, 7). Ideally, the male partner should be one digit stronger than the female, or possess an equal number of digits within this specific diagonal.`, 
        scale: 'overload' 
      }
    ]
  },
  5: {
    digit: 5,
    cellName: 'Logic, Intuition',
    intro: 'Digit 5 in the psychomatrix answers for human logic and intuition, which, in turn, determines a person\'s ability to make plans and analyze situations, understand exact sciences and technique. Intuition (the ability to foresee steps or events) is almost impossible to strengthen, as it is either given from birth or a person does not use it. By logic we accept a person\'s ability to compose logical (sequential) links of reasoning that will lead to a correct decision.',
    lineContext: '2nd column (4,5,6) — maintenance of family; 2nd row (2,5,8) — quality of a family man; carnal diagonal (3,5,7) — carnal interests; spiritual diagonal (1,5,9) — spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'No Logic; Dreamer',
        verbatim: `The "No-5" Logic Profile

The absence of the number 5 in a psychomatrix signifies that the individual does not rely on logic; they can be described as a dreamer who is constantly "floating in the clouds."

For this very reason, such individuals should refrain from making far-reaching plans. One could say that they do not truly plan so much as simply list their dreams in a specific sequence—essentially mistaking wishful thinking for reality. These individuals build their castles in the air and live within them, giving no thought to how realistic those structures actually are.

Do not attempt to reason such a dreamer out of their mindset; leave them to their dreams—their "rainbow bubbles" of hope. When those bubbles inevitably burst, they will simply create new ones for themselves, unperturbed by the demise of the previous ones. However, if you begin offering advice, those castles in the air will come crashing down; you will be perceived as the one who destroyed them, and consequently, you will lose the dreamer's trust.

In the absence of the number 5, one should avoid actively pursuing technical fields or the exact sciences; it is far better to choose a path within the humanities or the arts.

Everyone surrounding such individuals must understand that it is precisely these dreamers who drive our civilization forward, constantly transforming their utopian visions into concrete plans. And no matter how flawed or unpromising the process may appear, it invariably yields a result—sometimes a negative one, to be sure, but a result nonetheless.

A prime example of this was V. I. Lenin, whose psychomatrix contained not a single number 5. This characteristic ultimately led to the "victory of communism" over socialism—a process spanning 70 years—which, in turn, resulted in a return to capitalism.

When explaining something to a person who lacks the number 5 in their psychomatrix, do not get bogged down in the details. Such specifics hold no importance for them. Simply tell them what needs to be done, and they will be satisfied; they have no inclination to provide detailed explanations themselves—though the same certainly cannot be said regarding the emotional tone of their storytelling. Indeed, it is the emotional aspect of a matter that captivates them far more than any logical explanation of its underlying essence.  When contemplating how to provide for their families, such individuals invariably rely on the salary they believe they are owed—the amount necessary to sustain a comfortable standard of living. While working, they remain convinced that their superior performance entitles them to significantly higher pay than those who do not work as diligently as they do. Do not argue with them; you will only offend them without ever managing to change their minds.
It is rare for individuals who lack the number 5 in their chart to genuinely worry about providing for their families; however, they tend to complain about their own personal difficulties more vociferously than anyone else. Ideally, the burden of financial provision would not fall upon their shoulders—a scenario that is generally more acceptable for women than for men.
Is it possible to strengthen their logical faculties? Only through the accumulation of numerous poor decisions; this provides them with practical experience, fostering the hope that they will avoid repeating their past blunders in the future. However, it is impossible—and indeed, unnecessary—to curb their tendency toward daydreaming. Do not spoil their lives with "nagging" or excessive pragmatism, especially given their deep-seated faith in the validity of their own mental constructs and schemes.`,
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Logic',
        verbatim: `The "5" Logic
If a psychomatrix contains a single instance of the number 5, it indicates the presence of logical ability; however, this faculty is quite weak—differing very little, in practical terms, from the "No 5" profile. Such an individual remains, fundamentally, a dreamer. The sole exception applies to those who possess a high concentration of both 3s and 9s in their chart (two or more of each). A persistent interest in technology and the exact sciences compels these individuals to delve into these fields of study; meanwhile, a robust memory allows them to accumulate examples of logical reasoning, thereby yielding significant results in strengthening their logical capabilities. Over time, such an individual may effectively "cultivate" an additional 5 in their chart (a transition facilitated by the presence of "99," which generates an additional 5). Before steering your child toward the exact sciences—solely on the strength of this newly acquired "5"—carefully examine their entire psychomatrix. Ensure that they possess the requisite energy levels (indicated by 22, 2222, or higher), the necessary strength of character to engage in rigorous academic study (indicated by 111 or 1111), and a sufficiently strong memory (indicated by 99, 9999, or higher).  The most important thing you must understand and accept is the uniqueness of every individual. Do not attempt to mold your child to fit your own interests or the passing fads of the times—doing so will only result in the loss of yet another talent and genius embodied in your child. One may become a good economist, but one could become a brilliant writer.`,
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Strong Logic',
        verbatim: `"55" Logic
In the psychomatrix, the presence of two fives signifies that an individual possesses strong logical faculties, enabling them to excel in the exact sciences and technical fields.
Such individuals are adept at planning their future. This does not imply, however, that they are immune to making mistakes. These errors might best be described as the consequences of risks they have chosen to undertake. I am convinced that they foresee almost all of their potential errors; yet, they are not always able to guard against them, as the ultimate outcome often depends not on them, but on those around them.
Given that these two fives intersect with all four lines of the matrix, these individuals often face considerable challenges within their family lives. They frequently shoulder the burden of resolving numerous family issues and providing for the household; yet, in return, they seek to replenish their energy through the affection and intimacy of their spouse—something that is not always possible due to differences in temperament. The most arduous challenge for them is the realization of the inevitability of failure or loss; they are compelled to wait and hope that they might somehow succeed in steering circumstances toward a more favorable outcome.
Could one describe them as dreamers? Certainly, they may occasionally indulge in daydreaming—though typically only verbally—as they invariably construct their actual plans upon the solid foundation of reality.
It is virtually impossible to deceive such individuals, for they uncover the truth by asking a series of probing questions, cross-referencing the answers, and identifying any inherent contradictions. Should they possess a gentle and tolerant nature, they may—even when fully aware that someone is attempting to deceive them—choose to remain silent on the matter; however, a repeated act of dishonesty will, as a rule, irrevocably shatter the bonds of friendship (or family).
If, in addition to the two fives in the psychomatrix, there appear two (or more) nines, the individual is endowed with "clear-knowing" (clariscience—not to be confused with clairvoyance). This means they are able to foresee a great deal about the future through the sheer power of their logical reasoning—predictions that rarely fail to materialize, and in the rare instances they do err, the mistakes are invariably minor.`,
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Very Strong Logic',
        verbatim: `"555 and Beyond" Logic
In the psychomatrix, the presence of three fives significantly attenuates one's logical faculties, rendering the manifestation of logic more of a sporadic occurrence—a surprise—than a consistent, predictable pattern.  In this instance, these numbers are almost entirely overshadowed by the Line of Family Provision (for men) or the Line of Family (for women). At certain moments, the quality of "clear-knowing" may manifest; however, because the scope of their vision is so vast, the individual often struggles to believe in their own insights—a skepticism that renders their predictions seemingly implausible.
These individuals possess a strong aptitude for mathematics and technology, yet, as a rule, they tend to select a highly specialized niche within these fields, which they then master with meticulous care. This trait might be described as "logical inertia"—a specific form of mental lethargy to which they are prone.
Experience has shown that individuals with two (or four or more) fives in their psychomatrix are generally averse to alcohol, as they perceive a distinct loss of logical clarity when intoxicated. Conversely, those with exactly three fives may feel comfortable indulging in alcohol to relax—a tendency also linked to this same logical inertia. To fully activate such an individual's logical faculties, a critical situation is required; under such pressure, their numerical energies "switch on," allowing them to unleash their full potential. The most effective catalyst for this is a strict time constraint imposed upon the task at hand.
If, however, the psychomatrix reveals four (or more) fives, we are dealing with a true "clear-knower"—an individual who may aptly be described as a prophet. Such people make virtually no errors in their predictions. This constitutes a heavy burden—a cross they are compelled to bear. Imagine living your life knowing exactly what awaits you tomorrow, a year from now, or even thirty years down the road. Such individuals possess the ability to foresee destinies. It would be highly beneficial if people of this caliber were placed in charge of economic management, given the exceedingly low probability of them making a mistake.
In the context of marriage, it is essential that they be paired with a partner who possesses at least two fives in their own psychomatrix; this ensures that the couple can achieve a sufficient level of mutual understanding. I would suggest that individuals with more than three fives in their psychomatrix keep a diary to record their thoughts. This practice serves their own primary interest—providing them with a "silent" conversational partner (namely, themselves)—since many of their thoughts and insights remain inaccessible even to those who possess two fives.  Writing books is a necessity—indeed, a duty owed to humanity—for authors have been granted the gift of foreseeing many of the woes and misfortunes that may befall mankind; to turn away from such knowledge is a crime against the people. One might scoff at these lines, yet it would be far better if they were heeded by that select few—those whose psychomatrix contains four or more fives.
It is regrettable that there is but a slim chance that this book will find a place in every household. It is imperative to ensure that no individual becomes lost amidst the vast diversity of humanity. It is a pity that we so often blend anonymously into the crowd rather than distinguishing ourselves through our talent or genius—a misfortune rooted in a dearth of information regarding the human being himself. One can only hope that this book will be read by many and taken to heart—embraced as a genuine guide to action.`,
        scale: 'special'
      },
      {
        count: 4,
        label: 'Prophetic Logic',
        verbatim: `"555 and Beyond" Logic
In the psychomatrix, the presence of three fives significantly attenuates one's logical faculties, rendering the manifestation of logic more of a sporadic occurrence—a surprise—than a consistent, predictable pattern.  In this instance, these numbers are almost entirely overshadowed by the Line of Family Provision (for men) or the Line of Family (for women). At certain moments, the quality of "clear-knowing" may manifest; however, because the scope of their vision is so vast, the individual often struggles to believe in their own insights—a skepticism that renders their predictions seemingly implausible.
These individuals possess a strong aptitude for mathematics and technology, yet, as a rule, they tend to select a highly specialized niche within these fields, which they then master with meticulous care. This trait might be described as "logical inertia"—a specific form of mental lethargy to which they are prone.
Experience has shown that individuals with two (or four or more) fives in their psychomatrix are generally averse to alcohol, as they perceive a distinct loss of logical clarity when intoxicated. Conversely, those with exactly three fives may feel comfortable indulging in alcohol to relax—a tendency also linked to this same logical inertia. To fully activate such an individual's logical faculties, a critical situation is required; under such pressure, their numerical energies "switch on," allowing them to unleash their full potential. The most effective catalyst for this is a strict time constraint imposed upon the task at hand.
If, however, the psychomatrix reveals four (or more) fives, we are dealing with a true "clear-knower"—an individual who may aptly be described as a prophet. Such people make virtually no errors in their predictions. This constitutes a heavy burden—a cross they are compelled to bear. Imagine living your life knowing exactly what awaits you tomorrow, a year from now, or even thirty years down the road. Such individuals possess the ability to foresee destinies. It would be highly beneficial if people of this caliber were placed in charge of economic management, given the exceedingly low probability of them making a mistake.
In the context of marriage, it is essential that they be paired with a partner who possesses at least two fives in their own psychomatrix; this ensures that the couple can achieve a sufficient level of mutual understanding. I would suggest that individuals with more than three fives in their psychomatrix keep a diary to record their thoughts. This practice serves their own primary interest—providing them with a "silent" conversational partner (namely, themselves)—since many of their thoughts and insights remain inaccessible even to those who possess two fives.  Writing books is a necessity—indeed, a duty owed to humanity—for authors have been granted the gift of foreseeing many of the woes and misfortunes that may befall mankind; to turn away from such knowledge is a crime against the people. One might scoff at these lines, yet it would be far better if they were heeded by that select few—those whose psychomatrix contains four or more fives.
It is regrettable that there is but a slim chance that this book will find a place in every household. It is imperative to ensure that no individual becomes lost amidst the vast diversity of humanity. It is a pity that we so often blend anonymously into the crowd rather than distinguishing ourselves through our talent or genius—a misfortune rooted in a dearth of information regarding the human being himself. One can only hope that this book will be read by many and taken to heart—embraced as a genuine guide to action.`,
        scale: 'strong'
      },
      {
        count: 5,
        label: 'The Prophet',
        verbatim: `"555 and Beyond" Logic
In the psychomatrix, the presence of three fives significantly attenuates one's logical faculties, rendering the manifestation of logic more of a sporadic occurrence—a surprise—than a consistent, predictable pattern.  In this instance, these numbers are almost entirely overshadowed by the Line of Family Provision (for men) or the Line of Family (for women). At certain moments, the quality of "clear-knowing" may manifest; however, because the scope of their vision is so vast, the individual often struggles to believe in their own insights—a skepticism that renders their predictions seemingly implausible.
These individuals possess a strong aptitude for mathematics and technology, yet, as a rule, they tend to select a highly specialized niche within these fields, which they then master with meticulous care. This trait might be described as "logical inertia"—a specific form of mental lethargy to which they are prone.
Experience has shown that individuals with two (or four or more) fives in their psychomatrix are generally averse to alcohol, as they perceive a distinct loss of logical clarity when intoxicated. Conversely, those with exactly three fives may feel comfortable indulging in alcohol to relax—a tendency also linked to this same logical inertia. To fully activate such an individual's logical faculties, a critical situation is required; under such pressure, their numerical energies "switch on," allowing them to unleash their full potential. The most effective catalyst for this is a strict time constraint imposed upon the task at hand.
If, however, the psychomatrix reveals four (or more) fives, we are dealing with a true "clear-knower"—an individual who may aptly be described as a prophet. Such people make virtually no errors in their predictions. This constitutes a heavy burden—a cross they are compelled to bear. Imagine living your life knowing exactly what awaits you tomorrow, a year from now, or even thirty years down the road. Such individuals possess the ability to foresee destinies. It would be highly beneficial if people of this caliber were placed in charge of economic management, given the exceedingly low probability of them making a mistake.
In the context of marriage, it is essential that they be paired with a partner who possesses at least two fives in their own psychomatrix; this ensures that the couple can achieve a sufficient level of mutual understanding. I would suggest that individuals with more than three fives in their psychomatrix keep a diary to record their thoughts. This practice serves their own primary interest—providing them with a "silent" conversational partner (namely, themselves)—since many of their thoughts and insights remain inaccessible even to those who possess two fives.  Writing books is a necessity—indeed, a duty owed to humanity—for authors have been granted the gift of foreseeing many of the woes and misfortunes that may befall mankind; to turn away from such knowledge is a crime against the people. One might scoff at these lines, yet it would be far better if they were heeded by that select few—those whose psychomatrix contains four or more fives.
It is regrettable that there is but a slim chance that this book will find a place in every household. It is imperative to ensure that no individual becomes lost amidst the vast diversity of humanity. It is a pity that we so often blend anonymously into the crowd rather than distinguishing ourselves through our talent or genius—a misfortune rooted in a dearth of information regarding the human being himself. One can only hope that this book will be read by many and taken to heart—embraced as a genuine guide to action.`,
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Master Prophet',
        verbatim: `"555 and Beyond" Logic
In the psychomatrix, the presence of three fives significantly attenuates one's logical faculties, rendering the manifestation of logic more of a sporadic occurrence—a surprise—than a consistent, predictable pattern.  In this instance, these numbers are almost entirely overshadowed by the Line of Family Provision (for men) or the Line of Family (for women). At certain moments, the quality of "clear-knowing" may manifest; however, because the scope of their vision is so vast, the individual often struggles to believe in their own insights—a skepticism that renders their predictions seemingly implausible.
These individuals possess a strong aptitude for mathematics and technology, yet, as a rule, they tend to select a highly specialized niche within these fields, which they then master with meticulous care. This trait might be described as "logical inertia"—a specific form of mental lethargy to which they are prone.
Experience has shown that individuals with two (or four or more) fives in their psychomatrix are generally averse to alcohol, as they perceive a distinct loss of logical clarity when intoxicated. Conversely, those with exactly three fives may feel comfortable indulging in alcohol to relax—a tendency also linked to this same logical inertia. To fully activate such an individual's logical faculties, a critical situation is required; under such pressure, their numerical energies "switch on," allowing them to unleash their full potential. The most effective catalyst for this is a strict time constraint imposed upon the task at hand.
If, however, the psychomatrix reveals four (or more) fives, we are dealing with a true "clear-knower"—an individual who may aptly be described as a prophet. Such people make virtually no errors in their predictions. This constitutes a heavy burden—a cross they are compelled to bear. Imagine living your life knowing exactly what awaits you tomorrow, a year from now, or even thirty years down the road. Such individuals possess the ability to foresee destinies. It would be highly beneficial if people of this caliber were placed in charge of economic management, given the exceedingly low probability of them making a mistake.
In the context of marriage, it is essential that they be paired with a partner who possesses at least two fives in their own psychomatrix; this ensures that the couple can achieve a sufficient level of mutual understanding. I would suggest that individuals with more than three fives in their psychomatrix keep a diary to record their thoughts. This practice serves their own primary interest—providing them with a "silent" conversational partner (namely, themselves)—since many of their thoughts and insights remain inaccessible even to those who possess two fives.  Writing books is a necessity—indeed, a duty owed to humanity—for authors have been granted the gift of foreseeing many of the woes and misfortunes that may befall mankind; to turn away from such knowledge is a crime against the people. One might scoff at these lines, yet it would be far better if they were heeded by that select few—those whose psychomatrix contains four or more fives.
It is regrettable that there is but a slim chance that this book will find a place in every household. It is imperative to ensure that no individual becomes lost amidst the vast diversity of humanity. It is a pity that we so often blend anonymously into the crowd rather than distinguishing ourselves through our talent or genius—a misfortune rooted in a dearth of information regarding the human being himself. One can only hope that this book will be read by many and taken to heart—embraced as a genuine guide to action.`,
        scale: 'overload'
      }
    ]
  },
  6: {
    digit: 6,
    cellName: 'Labor, Manual Skills',
    intro: 'Number 6 is one of the most controversial and difficult numbers in this numerology system. If you look closely at the numbers, you can see that the shapes of numbers 6 and 9 are very similar, and this is not an excuse. Number 9 is responsible for a person\'s memory and his mind, which is always aimed at accumulating knowledge that helps a person survive. In this case, number 6 should have kept the main meaning of number 9 (mind, knowledge), but should have \'turned\' its goals, or rather: a person becomes forgetful of his loved ones, his mind works to accumulate knowledge that can help him advance to gaining authority in order to suppress, humiliate and finally destroy another person. The collected knowledge allows him to influence another person, his psyche, health; there are ways to destroy people (up to murder). Such knowledge is called \'black\', and the people who possess it are called \'magicians\'.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 2 (4, 5, 6) — Labor efficiency.',
    meanings: [
      { count: 0, label: 'Not Inclined to Manual Labor', verbatim: 'If in the Pythagorean Square there is no Number 6, this means that the person is not inclined to manual labor, he doesn\'t like it and can be involved in it only by reason of necessity or having it as a duty. These are people of art and science. Don\'t try to accustom them to manual labor; they will never be good workers. Above all they are inclined to art or science as much as their numbers allow. When there is no Number 6 with 2-none, 4 (or more), 9 and 5-none — better try yourself in dancing (ballet), as such people are very mobile and have a strong body.', scale: 'absent' },
      { count: 1, label: 'Very Weak, Mood-Based Labor', verbatim: 'Having one Number 6 means that the person does manual labor based on his mood — when there is a desire. You should never be dropped indifferent to this quality. Performance is not the main thing as a result. One can perform any work, but it is a question of how good results will be and how happy he will be after finishing it. If you try to force one who has only one \'6\' when he doesn\'t feel like working, you\'ll get a lot of problems as a result. You are going to lose a lot of energy forcing him, and if he has agreed, that doesn\'t mean he starts working at once. After such work the person becomes angry, explosive and offended. For this reason it\'s not good when people with this sign are engaged in monotonous work with a strict schedule — this can lead to breakdowns, desire to change activity, alcoholism, illnesses. But if such a person started doing some work, you should never disturb him or give advice. Your offer to help won\'t be good too, because such people don\'t like teamwork.', scale: 'very-weak' },
      { count: 2, label: 'Labor Given in Norm; Master of Any Craft', verbatim: 'The sign \'66\' gives its owner ability to do everything — he is a master of any craft. Very often such people are great architects. The sign \'66\' can be named as sign of grounding. The matter is that people having this sign don\'t really like reading; they better watch telecasts or do anything but not reading. If somehow you managed to control the sign, then reading takes 1st place, and manual labor has the last. Before you decide what to do with your child who has \'66\' (Numbers 7 are absent — and this is very important), it is necessary to find out its opportunities as the future master. For a craftsman it is necessary to have good energy and good health: 22 (or 2222 and more) and 4 or more. In case the child possesses \'7\' (or more), it can become a master only carefully serving a duty to its parents. I would not advise choosing any profession connected with authority as it makes the person strict and indifferent towards others\' lives.', scale: 'norm' },
      { count: 3, label: 'The Number of the Beast; Black Knowledge', verbatim: 'The number of the beast. Satan (number 666) is the image of man and belongs to men. The greater number of \'6\' can be named \'number of the sorcerer or a witch\' as this sign is stronger. You should not be preserved, for that sign doesn\'t mean anything as the presence of such numbers as 8 and 7 constrain \'6\'. For example, a person has a set of numbers: 666, 7, 8. Then we can delete two numbers 6 and, accordingly, numbers 7 and 8, there will be left only one \'6\' — the man of moods (such deletion is able only when both numbers 7 and 8 haven\'t made transition; otherwise we deal with the person who, having started the conflict with the parents, has received a new quality: 666, 7, 8 transforms into 6666 and 11 with the loss of 4 or 22, that leads to irritability and authoritativeness). If there is \'6666\', being attached to similar ones (they are four in this case), they create a stable line, and the person starts to gather similar people around himself, and they show their hidden abilities: authority, cruelty, aggression. To protect yourself: if somebody tries to involve you into a conflict, the only way is to leave with an emotion of emptiness and indifference. The simplest way is laughter, which doesn\'t support any fright and doesn\'t bring any irritability or aggression. This is the Grand Chinese technique of leaving in emptiness which chi kung masters used when they met an opponent.', scale: 'special' }
    ]
  },
  7: {
    digit: 7,
    cellName: 'Luck, Talent',
    intro: 'The number 7 in the square of Pythagoras indicates nature\'s interest in revealing its talents. Let\'s imagine that Newton, the creator of the theory of mechanics, was born two hundred years later or earlier. The result would change the history of the Earth, because all physics, mechanics and other technical disciplines are based on these laws. At any moment in history, there is a need to reveal some natural laws. This need can be so necessary that people whose brains have such important current information are marked by Nature with special signs — the numbers 7 and 0. The number 0 gives a person a chance to succeed in some fields of knowledge, maybe even find new laws. At the same time, the number 7 means the following: a person received in his brain very important information for this historical period in the exact field of human knowledge. Nature protects him in all unexpected situations and accidents, which is interpreted as \'happiness\'. The bigger the \'7\', the bigger the task a person has to complete.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      { count: 0, label: 'No Special Talent or Luck from Nature', verbatim: 'Absence of Number 7 in Pythagoras Square means no special talent or luck from nature. The person must rely entirely on their own effort, energy, and learned skills. There is no special protective force from nature guiding unexpected situations.', scale: 'absent' },
      { count: 1, label: 'Very Weak Luck/Talent', verbatim: 'Very weak luck/talent. The protection of nature is barely perceptible. The person has a small task assigned by nature, and must work diligently to fulfill it. The quality needs development and improvement.', scale: 'very-weak' },
      { count: 2, label: 'Luck/Talent Given in Norm', verbatim: 'Luck and talent given in norm. Nature provides a reasonable degree of protection and the person carries a meaningful task. The talent is developed and actively used in life. A good balance for a fulfilled life purpose.', scale: 'norm' },
      { count: 3, label: 'Strong Luck, Nature Protects', verbatim: 'Strong luck. Nature protects the person in unexpected situations and accidents. The task assigned by nature is significant. The person includes this quality urgently and spontaneously — the \'3 digits\' special sign rule applies, meaning luck appears suddenly and unexpectedly rather than as a constant background.', scale: 'special' },
      { count: 4, label: 'Sign of Alarm; Angels', verbatim: '7777 is a sign of alarm. The angels — the ones with four sevens — descended to earth and die already in infancy. People with this sign should be very careful.\n\nFour or more sevens indicates an extremely high task set by nature — so high that it carries special dangers. The luck is maximally strong, but dominates and may suppress other qualities.', scale: 'strong' }
    ]
  },
  8: {
    digit: 8,
    cellName: 'Duty, Tolerance, Kindness',
    intro: 'The number 8 is one of the most important numbers that defines the entire Pythagorean square of a person, because its persistence or appearance there will determine many necessary qualities. This number is responsible for a sense of duty to relatives (parents, family), tolerance and benevolence — qualities that we should show to parents and loved ones. Why exactly is \'8\' responsible for this quality? The explanation is very simple. Let\'s write a list of a person\'s closest relatives: father, mother, brother (or sister), wife, son, daughter, your wife\'s father, your wife\'s mother. There are eight people on the list, and you owe them all. Your parents are the most important here; we can\'t choose them, but they gave us life and we should be grateful.\n\n"Tolerance... We probably talk about this quality every day. Many characterize it as humility and silence, but you should not replace one word with another. Tolerance is the ability to tolerate a person nearby, his habits, views, desires."',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      { count: 0, label: 'No Sense of Duty to Relatives', verbatim: 'A person who does not have eights should not be relied on if he is entrusted with something — he is in no hurry to give back. There is no innate sense of duty to relatives. Such a person may be unreliable in family commitments. However, this quality can be developed through conscious effort.', scale: 'absent' },
      { count: 1, label: 'Very Weak Sense of Duty', verbatim: 'The presence of one eight in the psychomatrix begins to strongly influence the character of a person, because there is a possibility of transition of 11 to 8 or, vice versa, of 8 to 11, which is more important. For example, if a person has the character 111 and there is one 8, a new chain of transitions emerges: 111 and 8 transitions to 1 and 88 (kind and tolerant), but with pressure this person explodes and his character transitions into 11111, which is the character of a despot, and a new wave of conflict can take on a very extreme form.', scale: 'very-weak' },
      { count: 2, label: 'Duty/Tolerance Given in Norm; Self-Sacrifice', verbatim: 'For those capable of self-sacrifice. Two eights represent duty and tolerance given in normal measure. These people are less likely to break the bonds of marriage, although this is not excluded. The balance between duty to others and personal boundaries is healthy.', scale: 'norm' },
      { count: 3, label: 'Strong Sense of Duty; Truth Finder', verbatim: 'It is necessary to highlight the characteristic of duty for \'888\'. If you remember, three figures always caused instability of the quality. In this case we deal with the person who is kind, tolerant, remembers parents, but thus becomes the truth finder. This aim can be dangerous if it grows to maximum. Truth finders can even kill without any hesitation for what they think is right. So never play with this part of the person. And for those who got this sign — try to lower your unreasonable demands. Active collectivists who owe everything to everyone.', scale: 'special' },
      { count: 4, label: 'Very Rare; Parapsychic Abilities', verbatim: 'A very rare sign. In the current century, this was only possible for those born in 1988. Children born with this sign had developed abilities and a penchant for studying the exact sciences. Such people often have parapsychic or extrasensory abilities. Four eights dominate and may suppress other qualities.', scale: 'strong' }
    ]
  },
  9: {
    digit: 9,
    cellName: 'Memory, Intellect, Clairvoyance',
    intro: `The number 9 in the psychomatrix is ​​responsible for a person's intelligence, memory, and clairvoyance. Why this number? It follows the number 8, and its characteristics should be related to the meaning of this number. Eight represents duty to loved ones, especially parents. After the death of parents, this duty takes on a new dimension—the need to remember them, and therefore the number 9 represents memory. When we speak of a person and their abilities, we typically evaluate their memory and draw conclusions about the strength of their mind: "They know so much (meaning, they remember so much), so they are intelligent." This can be debated, as our great Russian scientist M.V. Lomonosov once said, "Omniscience does not teach intelligence." Let's not get into polemics, but rather assume that accumulated knowledge improves a person's mind. Then we immediately get the answer to the question related to clairvoyance. Anyone who has accumulated a wealth of experience can foresee any situation, allowing them to make proactive predictions based on comparisons with what has already happened in their life, with events acquired through the process of accumulating information. That's why the sign "999 or more" can be considered a sign of clairvoyance, indicating a strong memory. It's a shame that such experience often goes unused. Unfortunately, people don't learn from the mistakes of others; they prefer to accumulate their own. It's important to remember that the number 9 is included in three lines: ▸ 3rd column – talent; ▸ 3rd row – stability; ▸ descending, spiritual diagonal – a person's spirituality. Consequently, this number can be captured and incorporated into one of these lines, causing a loss of memory and mental strength, especially if the nines are captured by the third line—stability—when a person remembers many everyday details and habits that clog their brain and memory. Excessive spirituality often leads to fanaticism (faith, passion, interests), which also robs a person of their intelligence when their brain operates on cyclical information implanted in it through psychological coding while being drawn into a particular area. It is necessary to develop and improve your memory from early childhood, when unique, natural characteristics are present. In early childhood, memory is figurative, "pictorial," based on many receptors for perceiving the surrounding world.`,
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      { count: 0, label: 'No Memory/Intellect from Birth', verbatim: 'There are no nines — weak level of mental ability. For a person who doesn\'t have either a 5 or a 9, doing science becomes a problematic situation, due to the influence on his interests. The person doesn\'t hear others and has no logic. The behavior model was established from childhood — they won\'t believe it until they try it themselves. When bumps are full, they become too careful. Suspicious. Intuition is confused with fear. Naïve, find problems for themselves.', scale: 'absent' },
      { count: 1, label: 'Very Weak Memory', verbatim: 'Very weak memory. The channel of communication with the subtle world, with the cosmos, is essentially closed at birth. Such a person is constantly busy with calculations, experiments, trying to predict further events. These people make a huge number of mistakes. Everything that is given to them, they pierce through by their head — by direct experience rather than foresight.', scale: 'very-weak' },
      { count: 2, label: 'Memory/Intellect Given in Norm', verbatim: 'Having \'99\' in the square of Pythagoras would add another \'5\'. Having accumulated quite a lot of life experience, a person gradually begins to strengthen his logical capabilities at the expense of accumulated situational models, which he can later compare with newly emerged situations. Strengthened this way, the logic cannot, however, provide an intuitive understanding of a problem, and therefore cannot create a fundamentally new idea or solution. A person with two nines improves what already exists. If there are two nines, a person with certain other sets of numbers (55, 777, or 666) may possess the faculty of clairvoyance that will be based on a combination of signs.', scale: 'norm' },
      { count: 3, label: 'Strong Memory, Very Smart', verbatim: 'Strong memory, mind; very smart. Bored if not interested in what they are doing. Have good eloquence. Often see \'prophetic\' dreams; can predict the course of events; are usually quite good physionomists. For some minor detail, in general terms, they can describe past or future events.', scale: 'special' },
      { count: 4, label: 'Erudite but Tough, Merciless', verbatim: 'People are erudite, but tough, merciless. Everything that is happening around is clear to them. They clearly see the causes and consequences of events. They possess what can only be called clairvoyance. This combination is quite rare. Such people can predict destinies. They would be quite good in control of economies, as the possibility of their mistakes is very small.', scale: 'strong' }
    ]
  }
};

export const PSYCHOMATRIX_TRANSITIONS: ComplementaryInsight[] = [
  {
    digits: [1, 8],
    title: 'The 11-to-8 Transformation',
    insight: 'In times of extreme crisis, a person can "sacrifice" two 1s (Ego) to create an 8 (Tolerance/Protection). This is how people survive impossible odds—by letting go of "themselves."',
    type: 'transition'
  },
  {
    digits: [6, 6, 6],
    title: 'The 666 Warning',
    insight: 'Having three 6s is the "Sign of the Master Craftsman," but it carries the risk of "selling the soul to the craft." The person must consciously cultivate 7s (Luck/God) to balance the heavy Earth-vibration of the 6s.',
    type: 'tension'
  },
  {
    digits: [5],
    title: 'The Empty 5 Bridge',
    insight: 'The 5 is the "Heart of the Matrix." If the 5 is empty, the two diagonals (Spirit and Flesh) don\'t communicate. The person lives two lives: one purely intellectual/spiritual and one purely physical, with no bridge between them.',
    type: 'tension'
  },
  {
    digits: [2, 2, 2, 2],
    title: 'The 2222 Mystery',
    insight: 'A person with four 2s is a "Natural Psychic." They don\'t think; they feel the frequency of the room. They must learn to "shield" their energy, or they will take on the physical illnesses of everyone they meet.',
    type: 'synergy'
  }
];

export function calculateWorkingNumbers(day: number, month: number, year: number) {
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const first = allDigits.reduce((a, b) => a + b, 0);
  const second = String(first).split('').map(Number).reduce((a, b) => a + b, 0);
  const firstDigitOfDayActual = Number(String(day)[0]);
  const third = first - 2 * firstDigitOfDayActual;
  const fourth = Math.abs(third) < 10 ? Math.abs(third) : String(Math.abs(third)).split('').map(Number).reduce((a, b) => a + b, 0);
  return { first, second, third, fourth };
}

export function calculatePsychomatrix(day: number, month: number, year: number): PsychomatrixResult {
  const { first, second, third, fourth } = calculateWorkingNumbers(day, month, year);
  const birthDigits = `${day}${month}${year}`.split('').map(Number);
  const workingDigits = [...String(first).split('').map(Number), ...String(second).split('').map(Number), ...String(Math.abs(third)).split('').map(Number), ...String(fourth).split('').map(Number)];
  const allDigits = [...birthDigits, ...workingDigits].filter(d => d !== 0);
  
  const counts: Record<number, number> = {};
  for (const d of allDigits) { if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1; }
  
  const cell = (n: number) => counts[n] ? String(n).repeat(counts[n]) : null;
  const grid: Array<Array<string | null>> = [[cell(1), cell(4), cell(7)], [cell(2), cell(5), cell(8)], [cell(3), cell(6), cell(9)]];
  
  const lineDigitCounts = {
    row_1: (counts[1] || 0) + (counts[4] || 0) + (counts[7] || 0),
    row_2: (counts[2] || 0) + (counts[5] || 0) + (counts[8] || 0),
    row_3: (counts[3] || 0) + (counts[6] || 0) + (counts[9] || 0),
    col_1: (counts[1] || 0) + (counts[2] || 0) + (counts[3] || 0),
    col_2: (counts[4] || 0) + (counts[5] || 0) + (counts[6] || 0),
    col_3: (counts[7] || 0) + (counts[8] || 0) + (counts[9] || 0),
    diag_spirit: (counts[1] || 0) + (counts[5] || 0) + (counts[9] || 0),
    diag_carnal: (counts[3] || 0) + (counts[5] || 0) + (counts[7] || 0),
  };
  
  const activeLines = Object.entries(lineDigitCounts).filter(([_, total]) => total >= 3).map(([id]) => id);
  
  const cellReadings: CellReading[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    const count = counts[digit] || 0;
    const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
    const meaning = getPsychomatrixCellMeaning(digit, count);
    const modifiers: string[] = [];
    cellReadings.push({ digit, count, cellName: cellDef.cellName, label: meaning.label, verbatim: meaning.verbatim, scale: meaning.scale, modifiers });
  }
  
  const complementaryInsights = getComplementaryPairs(counts);
  
  return { day, month, year, first, second, third, fourth, allDigits, counts, grid, activeLines, complementaryInsights, cellReadings };
}

export function getPsychomatrixCellMeaning(digit: number, count: number): PsychomatrixCellMeaning {
  const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
  if (!cellDef) return { count: 0, label: 'Unknown', verbatim: '', scale: 'absent' };
  const cappedCount = Math.min(count, 6);
  return cellDef.meanings.find(m => m.count === cappedCount) || cellDef.meanings[cellDef.meanings.length - 1];
}

export function getComplementaryPairs(counts: Record<number, number>): ComplementaryInsight[] {
  return PSYCHOMATRIX_TRANSITIONS.filter(insight => {
    const needed = [...insight.digits];
    const available = { ...counts };
    for (const d of needed) {
      if (!available[d] || available[d] <= 0) return false;
      available[d]--;
    }
    return true;
  });
}

export const SCALE_LABELS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': 'Absent', 'very-weak': 'Awakening', 'norm': 'Balanced', 'special': 'Special Sign', 'strong': 'Strong', 'dominant': 'Dominant', 'overload': 'Overload'
};

export const SCALE_COLORS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': '#6b7280', 'very-weak': '#9ca3af', 'norm': '#c49a28', 'special': '#a78bfa', 'strong': '#34d399', 'dominant': '#f59e0b', 'overload': '#ef4444'
};
