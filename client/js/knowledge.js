/**
 * GrowTrack — Knowledge Hub (Premium Edition)
 * Ported from NeuralX MindSpace Library
 * Features: Articles with full content, curated book library, search, category filters, article reader
 */

// ─── ARTICLE DATA ───
const KNOWLEDGE_ARTICLES = [
  // 1. FOUNDATION
  {
    id: 'foundation-meaning', title: 'What is Mental Wellness?', category: 'Foundation',
    summary: 'Understanding that mental health is more than just the absence of illness.',
    readTime: '3 min', icon: 'sprout',
    content: `Mental wellness is a positive state of mental health. It's more than just the absence of mental illness; it's the presence of mental, emotional, and social well-being.

### Key Pillars:
1. **Emotional Balance**: Being aware of your emotions and being able to manage them effectively.
2. **Psychological Resilience**: The ability to bounce back from life's challenges and adapt to change.
3. **Social Connection**: Feeling a sense of belonging and support from others.

### Why it Matters:
When you are mentally well, you can realize your full potential, cope with the stresses of life, work productively, and make meaningful contributions to your community.`
  },
  {
    id: 'foundation-myths', title: 'Mental Health: Myths vs. Facts', category: 'Foundation',
    summary: 'Debunking common misconceptions about mental health and well-being.',
    readTime: '4 min', icon: 'scale',
    content: `Misconceptions about mental health can prevent people from seeking help. Let's look at the facts.

### Myth #1: Mental health problems are rare.
**Fact**: 1 in 4 people will experience a mental health problem in any given year.

### Myth #2: Mental health problems are a sign of weakness.
**Fact**: Mental health conditions are biological and psychological realities, similar to physical health conditions like diabetes. They have nothing to do with being "weak" or "lazy."

### Myth #3: You can't do anything for someone with a mental health problem.
**Fact**: Support from friends and family is one of the most important factors in recovery. Simply being there and listening makes a massive difference.`
  },
  {
    id: 'foundation-gut-brain', title: 'The Gut-Brain Connection', category: 'Foundation',
    summary: 'How your stomach acts as a "second brain" to regulate mood.',
    readTime: '4 min', icon: 'activity',
    content: `Did you know 95% of your serotonin is produced in your gut, not your brain?

### The Vagus Nerve Highway:
Your gut and brain are connected by the Vagus Nerve. Stress signals travel down, and gut health signals travel up.

### Feeding Your Mood:
- **Probiotics**: Fermented foods (yogurt, kimchi) support healthy bacteria.
- **Prebiotics**: Fiber-rich foods (garlic, onions, bananas) feed that bacteria.
- **Sugar**: High sugar intake promotes "bad" bacteria that can increase inflammation and anxiety.`
  },
  {
    id: 'foundation-neuroplasticity', title: 'Neuroplasticity 101', category: 'Foundation',
    summary: 'The hopeful science of how your brain rewires itself.',
    readTime: '3 min', icon: 'brain-circuit',
    content: `"Neurons that fire together, wire together."

### What it Means:
Your brain is not fixed. Every time you think a thought or practice a behavior, you strengthen that neural pathway.

### The Path in the Grass:
Imagine walking through tall grass. The first time is hard. The 100th time, there is a clear path.
- **Anxiety** is a well-worn path.
- **Calm** is a new path you are building. It takes effort at first, but eventually, it becomes the default.`
  },

  // 2. DAILY PRACTICES
  {
    id: 'self-care-basics', title: 'The Self-Care Foundation', category: 'Daily Practices',
    subcategory: 'Self-Care Education',
    summary: 'Practical strategies to stabilize your daily routine and prevent burnout.',
    readTime: '5 min', icon: 'sun',
    content: `Self-care isn't just about bubble baths; it's about the consistent habits that keep your baseline high.

### The "Big Three":
1. **Sleep Hygiene**: Going to bed and waking up at the same time every day. Your brain cleans itself of toxins only during deep sleep.
2. **Physical Connection**: Movement releases endorphins and reduces cortisol. Even a 10-minute walk counts.
3. **Nutrition**: What you eat affects your gut microbiome, which is directly linked to your mood through the "Gut-Brain Axis."

### Burnout Prevention:
Set "Hard Boundaries" between work/study and rest. Learn to say "No" without explanation.`
  },
  {
    id: 'mindfulness-breathing', title: 'Controlled Breathing Techniques', category: 'Daily Practices',
    subcategory: 'Mindfulness',
    summary: 'Structural learning for calming your nervous system in seconds.',
    readTime: '3 min', icon: 'wind',
    content: `Breathing is the only part of your autonomic nervous system that you can consciously control. By changing your breath, you signal to your brain that you are safe.

### Box Breathing (The Navy SEAL method):
- Inhale for 4 seconds.
- Hold for 4 seconds.
- Exhale for 4 seconds.
- Hold for 4 seconds.
Repeat 4 times.

### 4-7-8 Breathing (The Natural Tranquilizer):
- Inhale through your nose for 4.
- Hold your breath for 7.
- Exhale forcefully through your mouth for 8.`
  },
  {
    id: 'habit-boundaries', title: 'Setting Healthy Boundaries', category: 'Daily Practices',
    subcategory: 'Self-Care',
    summary: 'Learning to protect your energy through physical and emotional boundaries.',
    readTime: '4 min', icon: 'shield',
    content: `Boundaries are the "rules of engagement" for how people can treat you. Without them, we often feel resentful and drained.

### Types of Boundaries:
1. **Physical**: Your personal space and physical touch.
2. **Emotional**: Separating your feelings from others'. You are not responsible for "fixing" everyone's bad mood.
3. **Time**: Protecting your resting hours from work or demanding friends.

### Essential Phrases:
- "I'm not in a place to hold space for that right now. Can we talk about it tomorrow?"
- "I'd love to help, but I've reached my limit for today."
- "I prefer not to discuss that topic."`
  },
  {
    id: 'habit-sleep-hygiene', title: 'Digital Detox & Sleep Hygiene', category: 'Daily Practices',
    subcategory: 'Self-Care',
    summary: 'Optimizing your recovery cycles for better mental health.',
    readTime: '5 min', icon: 'moon',
    content: `Your brain does its most important "maintenance work" while you sleep. Poor sleep is a leading contributor to anxiety and depression.

### The Sleep Stack:
- **Blue Light**: The "blue light" from phones tricks your brain into thinking it's daytime, suppressing melatonin. Stop scrolling 1 hour before bed.
- **Temperature**: A cool room (around 18°C) is optimal for deep sleep.
- **Consistency**: Your "Circadian Rhythm" loves a schedule. Wake up at the same time even on weekends.

### The 10-3-2-1 Rule:
- **10 hours** before bed: No more caffeine.
- **3 hours** before bed: No more food or alcohol.
- **2 hours** before bed: No more work.
- **1 hour** before bed: No more screens.`
  },
  {
    id: 'practice-journaling-types', title: 'Journaling for Clarity', category: 'Daily Practices',
    subcategory: 'Reflection',
    summary: 'Different writing styles for different emotional needs.',
    readTime: '4 min', icon: 'pen-tool',
    content: `Writing isn't just recording the day; it's a tool for processing.

### 1. Braindump (for Overwhelm):
Write fast. No grammar, no punctuation. Just get the chaos out of your head onto the paper. Burn it afterwards if you want.

### 2. Gratitude (for Negativity):
List 3 specific things. "Coffee" is vague. "The warmth of the mug in my cold hands" is specific. Specificity drives the emotion.

### 3. Bullet Journaling (for Order):
Use symbols to track mood, habits, and tasks. Great for seeing patterns over time.`
  },
  {
    id: 'practice-doing-nothing', title: 'The Art of Doing Nothing', category: 'Daily Practices',
    subcategory: 'Rest',
    summary: 'Why "productive boredom" is essential for mental health.',
    readTime: '3 min', icon: 'coffee',
    content: `In a world of constant stimulation, doing nothing feels like a sin. But it's a biological necessity.

### The Default Mode Network (DMN):
When you stop focusing on tasks, your brain switches to the DMN. This is where creativity, empathy, and self-reflection happen.

### How to Practice:
Sit for 5 minutes without your phone. Look out a window. Let your mind wander. Ideally, do this *without* guilt. You aren't wasting time; you are recharging your cognitive battery.`
  },
  {
    id: 'practice-flow-state', title: 'Triggering Flow State', category: 'Daily Practices',
    subcategory: 'Productivity',
    summary: 'How to engineer deep focus and lose track of time.',
    readTime: '5 min', icon: 'zap',
    content: `Flow is that magical state where work feels effortless. You can't force it, but you can invite it.

### The Flow Triggers:
1. **High Consequence**: Your brain pays attention when it thinks it matters. Set a scary deadline.
2. **Rich Environment**: Novelty drives dopamine. Change your workspace.
3. **Challenge/Skills Ratio**: The task must be hard enough to stretch you, but not so hard it breaks you. (The "Goldilocks Zone").`
  },
  {
    id: 'practice-perfectionism', title: 'Perfectionism Paralysis', category: 'Daily Practices',
    subcategory: 'Mindset',
    summary: 'Moving from "Perfect or Nothing" to "Good Enough."',
    readTime: '4 min', icon: 'eraser',
    content: `Perfectionism isn't about high standards; it's about fear. Fear of judgment, fear of failure, fear of shame.

### The "B-" Standard:
Aim for B- work. Ironically, when you lower the bar, you reduce the anxiety, which usually results in A+ work anyway.

### "Ship It":
An imperfect essay submitted is worth more than a perfect essay that exists only in your head.`
  },

  // 3. STRESS & EMOTION REGULATION
  {
    id: 'stress-biology', title: 'Understanding Stress Biology', category: 'Regulation',
    subcategory: 'Stress Awareness',
    summary: 'What happens in your body when you feel stressed?',
    readTime: '4 min', icon: 'thermometer',
    content: `Stress is a biological response to a perceived threat. In moderate amounts, it can be helpful (eustress). In high amounts, it becomes distress.

### The Stress Types:
1. **Acute Stress**: Short-term, usually related to an upcoming event (like an exam).
2. **Chronic Stress**: Long-term stress that feels never-ending (like financial issues or relationship strain).

### Stress vs. Anxiety:
Stress is usually a response to an **external** trigger. Anxiety is an **internal** response that persists even after the trigger is gone.`
  },
  {
    id: 'emotion-vocabulary', title: 'The Power of Naming', category: 'Regulation',
    subcategory: 'Emotion Understanding',
    summary: 'Expanding your emotional vocabulary to better manage mood swings.',
    readTime: '3 min', icon: 'book-type',
    content: `There is a saying in psychology: "Name it to tame it." When you can accurately label an emotion, you engage your prefrontal cortex, which helps calm the emotional amygdala.

### Beyond "Good" or "Bad":
Instead of saying "I'm stressed," try to be more precise:
- Is it **Overwhelm**? (Too much to do)
- Is it **Anxiety**? (Fear of something future)
- Is it **Frustration**? (Blocked from a goal)
- Is it **Exhaustion**? (Out of physical/mental energy)

Each of these requires a different solution.`
  },
  {
    id: 'reg-54321', title: 'The 5-4-3-2-1 Technique', category: 'Regulation',
    subcategory: 'Grounding',
    summary: 'A classic sensory grounding tool for high anxiety.',
    readTime: '2 min', icon: 'hand',
    content: `Use your senses to anchor yourself in the present moment.

- **5** things you can **see**. (Look for small details).
- **4** things you can **feel**. (Fabric of your chair, air on skin).
- **3** things you can **hear**. (Traffic, computer fan).
- **2** things you can **smell**. (Coffee, soap).
- **1** thing you can **taste**. (Gum, or just focus on your mouth).`
  },
  {
    id: 'reg-cold-water', title: 'Cold Water Therapy', category: 'Regulation',
    subcategory: 'Physiology',
    summary: 'Using temperature to reset your nervous system.',
    readTime: '3 min', icon: 'snowflake',
    content: `Cold exposure stimulates the Vagus Nerve, forcing your body to shift from "Fight or Flight" to "Rest and Digest."

### The Dive Reflex:
Fill a bowl with ice water. Hold your breath and dip your face in for 30 seconds. This triggers an ancient mammalian reflex that instantly slows your heart rate.

### The Cold Shower:
End your shower with 30 seconds of cold water. Focus on controlling your breath—don't gasp. This builds resilience to stress signals.`
  },
  {
    id: 'reg-tipp', title: 'T.I.P.P. Skills (Crisis)', category: 'Regulation',
    subcategory: 'DBT Distress Tolerance',
    summary: 'A biological hack for when emotions are at a 10/10.',
    readTime: '4 min', icon: 'flame',
    content: `When emotional intensity hits a "breaking point," you can't think your way out. You have to use your body.

### T - Temperature:
Splash ice-cold water on your face. This triggers the Dive Reflex, slowing your heart rate immediately.

### I - Intense Exercise:
Do jumping jacks or run in place for 60 seconds. Burn off the cortisol.

### P - Paced Breathing:
Slow your exhale to be longer than your inhale (4 in, 6 out).

### P - Paired Muscle Relaxation:
Tense every muscle in your body hard, then release.`
  },
  {
    id: 'reg-opposite-action', title: 'Opposite Action', category: 'Regulation',
    subcategory: 'CBT Behavior',
    summary: 'Changing your emotion by changing your action.',
    readTime: '3 min', icon: 'arrow-left-right',
    content: `Every emotion has an "urge." Anger wants to attack. Sadness wants to withdraw. Fear wants to avoid.

### The Hack:
Do the EXACT opposite of the urge, and the emotion will change.

- **Sadness**: Urge = stay in bed. Action = go for a walk.
- **Fear**: Urge = avoid the email. Action = open it immediately.
- **Anger**: Urge = yell. Action = speak gently.`
  },
  {
    id: 'reg-cbt-reframing', title: 'Advanced Cognitive Reframing', category: 'Regulation',
    subcategory: 'CBT',
    summary: 'Moving beyond "positive thinking" to realistic thinking.',
    readTime: '5 min', icon: 'brain',
    content: `**Source**: Dr. David Burns (Feeling Good) & Beck Institute

Reframing isn't about lying to yourself ("Everything is great!"). It's about correcting the distortions that make reality look worse than it is.

### 1. Socratic Questioning:
Put your negative thought on trial.
- **Thought**: "I'm going to fail this exam."
- **Evidence For**: "I missed two lectures."
- **Evidence Against**: "I have studied for 3 days. I passed all previous quizzes. The material is familiar."
- **Verdict**: "I am unprepared for 10% of the material, but prepared for 90%." (This is more accurate and less paralyzed).

### 2. The "Best / Worst / Likely" Technique:
When spiraling about a future event:
- **What is the WORST outcome?** (I fail. I retake the class. It costs money.) -> *Is it survivable? Yes.*
- **What is the BEST outcome?** (I get an A+.)
- **What is the MOST LIKELY outcome?** (I get a B or C.)

Usually, the "Most Likely" scenario is boringly manageable.`
  },
  {
    id: 'reg-physiological-sigh', title: 'The Physiological Sigh', category: 'Regulation',
    subcategory: 'Breathwork',
    summary: 'The fastest way to reduce stress in real-time.',
    readTime: '3 min', icon: 'wind',
    content: `**Source**: Dr. Andrew Huberman (Huberman Lab) & Jack Feldman

When you are stressed, the air sacs (alveoli) in your lungs collapse, raising carbon dioxide levels. This signals "THREAT" to the brain.

### The Protocol:
You do this naturally when you cry or are about to sleep. You can do it voluntarily to hijack your nervous system.

1. **Double Inhale**: Inhale deeply through the nose. Then, strictly at the top, take a second, shorter inhale to fully inflate the lungs.
2. **Long Exhale**: Exhale fully through the mouth (making a "sigh" sound) for twice as long as the inhale.

### Why it Works:
The double inhale pops open the collapsed alveoli. The long exhale offloads maximum carbon dioxide. Do this 2-3 times, and your heart rate *must* slow down. It is mechanical, not psychological.`
  },

  // 4. MENTAL DISTRESS RECOGNITION
  {
    id: 'distress-signals', title: 'Early Warning Signals', category: 'Recognition',
    summary: 'How to recognize when you or a friend might be entering a period of distress.',
    readTime: '4 min', icon: 'siren',
    content: `Distress often shows up in small changes before it becomes a crisis.

### Behavioral Signs:
- Withdrawing from friends and family.
- Changes in eating or sleeping habits.
- Loss of interest in hobbies you usually love.

### Cognitive Changes:
- Memory issues or difficulty concentrating.
- Constant "racing thoughts" or rumination.
- Increased irritability or mood swings.`
  },
  {
    id: 'distress-checkin', title: 'The Emotional Check-In', category: 'Recognition',
    summary: 'A simple non-clinical screening to assess your current overwhelm levels.',
    readTime: '2 min', icon: 'clipboard-check',
    content: `Self-awareness is the first step to regulation. Ask yourself these gentle questions:

1. **Physical**: Is my jaw clenched? Are my shoulders up to my ears?
2. **Emotional**: Have I felt unusually irritable or "brittle" today?
3. **Cognitive**: Can I focus on a single task for 10 minutes, or is my mind jumping?
4. **Interest**: Do I actually want to do the things I usually enjoy?

If you answer "Yes" to most of these, it's a sign to shift from "Performance Mode" to "Recovery Mode."`
  },
  {
    id: 'rec-distortions', title: 'Cognitive Distortions', category: 'Recognition',
    subcategory: 'CBT',
    summary: 'Common lies our brains tell us.',
    readTime: '5 min', icon: 'glasses',
    content: `Cognitive distortions are biased ways of thinking that reinforce negative emotions.

### 1. All-or-Nothing Thinking:
"If I get a B, I'm a total failure." Life is rarely black and white; it's mostly grey.

### 2. Catastrophizing:
"He didn't text back; he must hate me." Jumping to the worst possible conclusion without evidence.

### 3. Emotional Reasoning:
"I feel stupid, so I must be stupid." Feelings are real, but they are not facts.`
  },
  {
    id: 'rec-anger-iceberg', title: 'The Anger Iceberg', category: 'Recognition',
    subcategory: 'Emotional Intelligence',
    summary: 'What lies beneath the surface of anger?',
    readTime: '3 min', icon: 'mountain',
    content: `Anger is often a "secondary emotion." It's the tip of the iceberg that we show the world because it feels safer than what's underneath.

### Beneath the Surface:
- **Fear**: "I'm angry you're late" might really be "I was scared you got hurt."
- **Shame**: "I'm angry at this criticism" might be "I feel ashamed I made a mistake."
- **Hurt**: "I'm angry you forgot" might be "I feel unimportant."

Next time you're angry, ask: "What am I protecting?"`
  },
  {
    id: 'rec-inner-critic', title: 'The Inner Critic', category: 'Recognition',
    subcategory: 'Self-Talk',
    summary: 'Distinguishing between "feedback" and "shame."',
    readTime: '4 min', icon: 'megaphone',
    content: `We all have a voice in our head. Is yours a coach or a bully?

### The Difference:
- **Constructive Feedback**: "You messed up that questions. Let's study that topic more." (Specific, Actionable, Future-focused).
- **The Bully**: "You're so stupid. You always mess up." (Vague, Permanent, Identity-focused).

### The Technique:
Give your critic a name (e.g., "Gertrude"). When she starts yelling, say: "Thanks for the input, Gertrude, but I've got this."`
  },
  {
    id: 'rec-imposter-cycle', title: 'The Imposter Cycle', category: 'Recognition',
    subcategory: 'Identity',
    summary: 'Breaking the loop of "Success -> Luck -> Anxiety."',
    readTime: '5 min', icon: 'venetian-mask',
    content: `Imposter Syndrome isn't just a feeling; it's a cycle.

### The Loop:
1. **Task Assigned**: Anxiety spikes. "I can't do this."
2. **Over-Preparation**: You work 3x harder than necessary.
3. **Success**: You ace it.
4. **Discounting**: "I only did well because I over-worked. I'm still a fraud."

### Breaking It:
Acknowledge your role in your wins. "I did well because I am capable," not just because you suffered.`
  },

  // 5. CONDITION KNOWLEDGE BASE
  {
    id: 'condition-anxiety', title: 'Understanding Anxiety', category: 'Condition Base',
    summary: 'Common symptoms, myths, and basic coping strategies for anxiety.',
    readTime: '6 min', icon: 'cloud-lightning', isCrisisAdjacent: true,
    content: `Anxiety is more than just "worrying too much." It is a physiological state of high alertness.

### Common Symptoms:
- Physical: Racing heart, shortness of breath, "butterflies" in the stomach.
- Mental: Excessive worry about future events, difficulty sleeping.

### Misconception:
"People with anxiety just need to calm down."
**Fact**: Anxiety is a biological state; you can't just "switch it off." It requires tools and sometimes professional support to manage.

### Basic Coping:
Focus on grounding (5-4-3-2-1) and limiting caffeine, which can mimic anxiety symptoms.`
  },
  {
    id: 'condition-depression', title: 'Understanding Depression', category: 'Condition Base',
    summary: 'Recognizing the signs of low mood and loss of interest.',
    readTime: '6 min', icon: 'cloud-rain', isCrisisAdjacent: true,
    content: `Depression is not just "feeling sad." It is often described as a "lack of vitality" or an emotional numbness.

### Core Indicators:
1. **Anhedonia**: Loss of interest or pleasure in almost all activities.
2. **Low Energy**: Even small tasks (like brushing teeth) feel like climbing a mountain.
3. **Negative Filter**: Only seeing past mistakes and future failures.

### Small Steps:
When in a depressive episode, the goal is not "recovery" in one day. The goal is "Non-Zero Days" – doing one tiny thing (like drinking a glass of water) to maintain a sense of agency.`
  },
  {
    id: 'condition-social-anxiety', title: 'Understanding Social Anxiety', category: 'Condition Base',
    summary: 'Recognizing the fear of judgment and social evaluation.',
    readTime: '5 min', icon: 'eye',
    content: `Social anxiety is not just "shyness." It is an intense fear of being judged, evaluated, or embarrassed in public.

### The "Spotlight Effect":
People with social anxiety often believe everyone is watching and judging them. In reality, most people are too busy thinking about themselves to notice your minor slips.

### Exposure Strategy:
Don't avoid social situations entirely – this confirms to your brain that they are "dangerous." Instead, try **Micro-Exposure**:
- Ask a stranger for the time.
- Say hi to one new person.
- Make eye contact while walking.

As you do these, your brain slowly learns that the "danger" isn't real.`
  },
  {
    id: 'condition-exhaustion', title: 'Emotional Exhaustion & Burnout', category: 'Condition Base',
    summary: 'Recognizing when you have run out of "emotional gas."',
    readTime: '5 min', icon: 'battery-warning',
    content: `Emotional exhaustion happens when the demands placed on you exceed your internal resources for a prolonged period.

### Key Signs:
- **Flattened Emotions**: Feeling "meh" about things that used to excite you.
- **Irritability**: Small things feel like personal attacks.
- **Physical Fatigue**: Sleeping doesn't make you feel rested.

### The Cure: Passive vs Active Rest
- **Passive Rest**: Sleeping, watching TV (good for physical energy).
- **Active Rest**: Doing a hobby, walking in nature, engaging in art (essential for emotional energy).`
  },
  {
    id: 'cond-adhd-focus', title: 'ADHD & The Dopamine Hunt', category: 'Condition Base',
    subcategory: 'Neurodivergence',
    summary: 'Managing attention when your brain is hungry for stimulation.',
    readTime: '5 min', icon: 'crosshair',
    content: `ADHD isn't a deficit of attention; it's a difficulty in *regulating* attention.

### Chase the Dopamine (Constructively):
- **Gamification**: Turn chores into a game with rewards.
- **Body Doubling**: Work alongside someone else (even virtually). The social pressure helps you stay on task.

### The "Now / Not Now" Time Blindness:
To an ADHD brain, there are only two times: Now and Not Now. Use visible timers (like analog clocks) to make time "real."`
  },
  {
    id: 'cond-insomnia', title: 'Insomnia & Biological Clocks', category: 'Condition Base',
    subcategory: 'Sleep',
    summary: 'Why "trying" to sleep keeps you awake.',
    readTime: '5 min', icon: 'moon-star',
    content: `Sleep is a shy cat. If you chase it, it runs. You have to sit quietly and let it come to you.

### Paradoxical Intention:
If you can't sleep, try to stay awake. Keep your eyes open in the dark. Removing the *pressure* to sleep often relaxes the brain enough to drift off.

### The 20-Minute Rule:
If you haven't slept in 20 minutes, get out of bed. Do something boring in low light. Only return to bed when sleepy. This teaches your brain that Bed = Sleep, not Bed = Worry.`
  },
  {
    id: 'student-failure', title: 'Reframing Failure', category: 'Condition Base',
    subcategory: 'Resilience',
    summary: 'First Attempt In Learning (FAIL).',
    readTime: '4 min', icon: 'trending-up',
    content: `School teaches us that 'F' is bad. Life teaches us that 'F' is data.

### The Scientist Mindset:
A scientist doesn't cry when an experiment fails. They say, "Interesting. That didn't work. What variables can I change?"
Treat your grades as feedback on your *methods*, not a judgment of your *soul*.`
  },
  {
    id: 'found-zone2-cardio', title: 'Zone 2 Training: The Mental Engine', category: 'Condition Base',
    subcategory: 'Physical Health',
    summary: 'The link between mitochondrial health and mood stability.',
    readTime: '6 min', icon: 'activity',
    content: `**Source**: Dr. Peter Attia (Outlive)

We often separate "mental health" from "physical health." This is a mistake. Your brain is a physical organ that demands massive energy.

### What is Zone 2?
It is steady-state cardio where you can maintain a conversation, but you cannot sing.
- **Heart Rate**: Roughly 180 minus your age.
- **Mechanism**: This trains your mitochondria to burn fat for fuel instead of glucose.

### The Antidepressant Effect:
Zone 2 exercise releases **BDNF** (Brain-Derived Neurotrophic Factor), which acts like "Miracle-Gro" for new neurons. It specifically targets the hippocampus (memory/mood), which shrinks during depression.
**Prescription**: 3-4 sessions of 45 minutes per week.`
  },

  // 6. LIFE PROBLEMS
  {
    id: 'academic-stress', title: 'Managing Academic Pressure', category: 'Life Problems',
    subcategory: 'Student Life',
    summary: 'Handling exam anxiety, fear of failure, and concentration issues.',
    readTime: '5 min', icon: 'graduation-cap',
    content: `For many students, academic performance is the primary source of stress.

### The Fear of Failure:
Often, the fear isn't about the grade itself, but what the grade "means" about your worth. Remind yourself: **Your GPA is not your worth.**

### Tactics:
- **The 25/5 Rule**: Work for 25 minutes, rest for 5.
- **Process vs. Outcome**: Focus on the action you are taking *now* (reading one page) rather than the final exam.`
  },
  {
    id: 'academic-procrastination', title: 'Beating Procrastination', category: 'Life Problems',
    subcategory: 'Student Life',
    summary: 'Why we delay and how to break the cycle.',
    readTime: '4 min', icon: 'hourglass',
    content: `Procrastination is usually not a time-management problem; it's an **emotion-management** problem. We avoid tasks because they make us feel anxious, bored, or incompetent.

### The "5-Minute Rule":
Tell yourself you will only do the task for 5 minutes. Usually, the hardest part is starting. Once you start, the "Zeigarnik Effect" (the brain's desire to finish a started task) kicks in.

### Break it Down:
"Write Essay" is too big. "Open Word Document" is a task. "Type the Title" is a task. Make it so small that it's impossible to fail.`
  },
  {
    id: 'social-breakups', title: 'Handling Relationship Stress', category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Coping with breakups, friend conflicts, and social pressure.',
    readTime: '6 min', icon: 'heart-crack',
    content: `Relationships are our biggest source of joy and our biggest source of stress.

### Breakups & Loss:
Grief is not linear. It's perfectly normal to feel "okay" one day and devastated the next. Treat yourself with the same compassion you would show a houseplant – give yourself time, space, and basic care.

### Conflict Resolution:
Use "I" statements instead of "You" statements.
- **Instead of**: "You never listen to me!"
- **Try**: "I feel unheard when I'm sharing my day and you're on your phone."

This reduces defensiveness and keeps the focus on the connection.`
  },
  {
    id: 'identity-worth', title: 'Identity & Self-Doubt', category: 'Life Problems',
    subcategory: 'Identity',
    summary: 'Overcoming "Imposter Syndrome" and building self-worth.',
    readTime: '5 min', icon: 'fingerprint',
    content: `Especially in university, we often compare our "insides" to everyone else's "outsides."

### Imposter Syndrome:
The feeling that you've "fooled" everyone into thinking you're competent. Remind yourself: **Competence is a skill you build, not a trait you're born with.**

### Self-Compassion vs. Self-Criticism:
Research shows that being kind to yourself after a mistake actually makes you **more** likely to improve than being harsh. Criticism triggers "threat mode," which shuts down the learning centers of your brain.`
  },
  {
    id: 'social-loneliness', title: 'Navigating Social Loneliness', category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Understanding the difference between being alone and being lonely.',
    readTime: '4 min', icon: 'puzzle',
    content: `Loneliness is the gap between the social connection you have and the connection you want.

### Fact:
You can be in a room full of people and still feel lonely. Connection is about being **seen** and **known**, not just being present.

### Strategies:
- **Digital Detox**: Social media often increases loneliness by showing "highlight reels" of others.
- **Micro-Connections**: A 30-second chat with a barista or a neighbor can actually boost mood more than you think.`
  },
  {
    id: 'workplace-burnout-pro', title: 'Workplace Stress & Burnout', category: 'Life Problems',
    subcategory: 'Professional Life',
    summary: 'Managing pressure, performance anxiety, and professional boundaries.',
    readTime: '6 min', icon: 'briefcase',
    content: `Professional stress is a leading cause of mental health decline. Burnout isn't just "being tired"; it's a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.

### The Burnout Signs:
1. **Exhaustion**: Feeling drained and unable to cope.
2. **Cynicism**: Feeling alienated from activities and irritable with coworkers.
3. **Reduced Performance**: Difficulty concentrating and lack of creativity.

### Recovery Steps:
- **Audit Your Time**: Identify "energy vampires" in your schedule.
- **Set Hard Stops**: When you leave work, actually leave. No checking emails or Slack.
- **Active Recovery**: Engaging in hobbies that have nothing to do with your career.`
  },
  {
    id: 'life-digital-overwhelm', title: 'Taming Digital Overwhelm', category: 'Life Problems',
    subcategory: 'Modern Life',
    summary: 'Reclaiming your attention from the attention economy.',
    readTime: '4 min', icon: 'smartphone',
    content: `Your phone is a slot machine designed to keep you pulling the lever.

### Notification Audit:
Turn off *all* non-human notifications. If it's not a text from a real person, check it on *your* terms, not the app's terms.

### Greyscale Mode:
Turn your phone screen to black and white. Without the colorful candy-crush colors, Instagram becomes boring very quickly.`
  },
  {
    id: 'life-financial-anxiety', title: 'Coping with Financial Anxiety', category: 'Life Problems',
    subcategory: 'Stress',
    summary: 'Separating your self-worth from your net worth.',
    readTime: '6 min', icon: 'wallet',
    content: `Money stress triggers primal survival fears. It tells the brain "we might not survive."

### Exposure Therapy for Money:
AVOIDANCE fuels anxiety. Check your bank account every morning, even if it's scary. The monster in the closet is less scary when you turn the lights on.

### The "Enough" Point:
Define what is "enough" for today. Food? Shelter? Safety? Ground yourself in the immediate reality of your safety, rather than the catastrophic "what ifs" of the future.`
  },
  {
    id: 'life-attachment-styles', title: 'Attachment Styles 101', category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Why you love (and fight) the way you do.',
    readTime: '6 min', icon: 'link',
    content: `Your attachment style is your blueprint for connection, formed in childhood.

### The Styles:
- **Anxious**: "I'm scared you'll leave." Craves closeness, needs reassurance.
- **Avoidant**: "I'm scared you'll smother me." Craves independence, pulls away when things get deep.
- **Secure**: "I'm okay, you're okay." Comfortable with intimacy and space.

### The Dance:
Anxious and Avoidant people often attract each other, creating a "Push-Pull" dynamic. Awareness is the first step to breaking the cycle.`
  },
  {
    id: 'life-nvc', title: 'Non-Violent Communication', category: 'Life Problems',
    subcategory: 'Conflict',
    summary: 'A 4-step framework for difficult conversations.',
    readTime: '5 min', icon: 'message-circle-heart',
    content: `Conflict often comes from unmet needs expressed as judgments.

### The Framework (OFNR):
1. **Observation**: "When you didn't call..." (Fact, not judgment).
2. **Feeling**: "...I felt worried and unimportant..." (Emotion, not blame).
3. **Need**: "...because I need reassurance and reliability." (Core human need).
4. **Request**: "Would you be willing to text me if you're going to be late?" (Specific, actionable).`
  },
  {
    id: 'life-four-horsemen', title: 'The Four Horsemen of Conflict', category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'The 4 behaviors that predict relationship collapse.',
    readTime: '7 min', icon: 'shield-alert',
    content: `**Source**: Dr. John Gottman (The Gottman Institute)

Dr. Gottman can predict divorce with 93% accuracy by watching a couple argue for 5 minutes. He looks for these "Four Horsemen":

### 1. Criticism (vs. Complaint):
- **Criticism**: "You never think about anyone but yourself." (Attack on character).
- **Complaint**: "I was scared when you were late and didn't call." (Statement of feeling/fact).

### 2. Contempt (The Killer):
Eye-rolling, sarcasm, mocking. This is the single biggest predictor of divorce. It signals disgust.
- **Antidote**: Build a culture of appreciation.

### 3. Defensiveness:
"I wouldn't have shouted if you hadn't done X!"
- **Antidote**: Take responsibility for *part* of the problem. "You're right, I was late."

### 4. Stonewalling:
Shutting down, looking away, leaving the room. Physiological flooding.
- **Antidote**: Physiological self-soothing (take a 20-min break, then return).`
  },
  {
    id: 'life-vulnerability-loop', title: 'The Vulnerability Loop', category: 'Life Problems',
    subcategory: 'Connection',
    summary: 'Why "staying strong" destroys trust.',
    readTime: '5 min', icon: 'heart-handshake',
    content: `**Source**: Dr. Brené Brown (Daring Greatly)

We think vulnerability is weakness in ourselves, but we see it as courage in others.

### The Myth of Self-Reliance:
We try to "go it alone" to avoid being a burden. But this denies others the chance to support us, creating distance.

### The Loop:
1. **Signal**: Person A admits a mistake or a fear. ("I'm actually really struggling with this.")
2. **Response**: Person B does NOT judge, but matches the vulnerability. ("Me too. I feel lost sometimes.")
3. **Result**: Trust increases.

### The Marble Jar:
Trust is built in small moments—like marbles in a jar. Remembering a name, asking about a sick parent, admitting a small error. You cannot build trust with one grand gesture; it requires a thousand small moments of vulnerability.`
  },

  // 7. CRISIS SUPPORT
  {
    id: 'crisis-overwhelmed', title: 'If You Feel Overwhelmed Right Now', category: 'Crisis Support',
    summary: 'Immediate stabilization steps for when you hit a breaking point.',
    readTime: '2 min', icon: 'shield-alert', isCrisis: true,
    content: `If you are feeling completely overwhelmed, stop everything.

### Immediate Protocol:
1. **Breathe**: Take 3 very slow, deep breaths.
2. **Senses**: Splash cold water on your face. This triggers the "Mammalian Dive Reflex," which instantly slows your heart rate.
3. **Delay**: Promise yourself you won't make any big decisions or take any impulsive actions for the next 1 hour. Just exist.

### Help Pathways:
If you feel you cannot keep yourself safe, please reach out now. You don't have to carry this alone.`
  },
  {
    id: 'crisis-panic', title: 'Panic Attack Stabilization', category: 'Crisis Support',
    summary: 'How to ride out the wave of an intense panic attack.',
    readTime: '3 min', icon: 'circle-stop', isCrisis: true,
    content: `A panic attack is like a "false alarm" in your brain's fire-detection system. It is terrifying, but it is not dangerous.

### The "Wave" Method:
- **Acknowledge**: "I am having a panic attack. It feels terrible, but I am safe."
- **Don't Fight**: Trying to stop a panic attack often makes it worse. Imagine riding it like a wave.
- **Grounding**: Focus on the feeling of your feet on the floor. Describe 3 objects in the room in extreme detail (color, texture, shape).

The peak usually lasts less than 10 minutes. It *will* pass.`
  },

  // 8. MICRO-LEARNING
  {
    id: 'capsule-overthinking', title: 'Why Overthinking Happens', category: 'Micro-Learning',
    summary: 'A 30-second read on the "analytical loop."',
    readTime: '30s', icon: 'brain',
    content: `Overthinking is your brain's attempt to "solve" a problem that usually doesn't have an immediate logical solution. It's like a car engine revving in neutral – lots of energy, but no movement. The cure to overthinking isn't more thinking; it's **action** or **distraction**.`
  },
  {
    id: 'capsule-stress-brain', title: 'Stress & Your Hippocampus', category: 'Micro-Learning',
    summary: 'How chronic stress impacts your memory center.',
    readTime: '30s', icon: 'microscope',
    content: `Chronic stress releases cortisol, which can actually shrink the hippocampus – the part of your brain responsible for learning and memory. The good news? Regular exercise and meditation can reverse this effect by boosting BDNF, a "Miracle-Gro" for your brain cells.`
  },
  {
    id: 'capsule-triggers', title: 'Understanding Triggers', category: 'Micro-Learning',
    summary: 'Why small things sometimes cause big reactions.',
    readTime: '30s', icon: 'radio',
    content: `An emotional trigger is a bridge between the present and a past memory. When someone's tone of voice or a specific smell makes you "irrationally" angry or scared, your brain thinks it's protecting you from a past threat. Identifying the trigger doesn't stop the feeling, but it gives you back your power to choose your response.`
  },
  {
    id: 'capsule-spotlight', title: 'The Spotlight Effect', category: 'Micro-Learning',
    subcategory: 'Social Psychology',
    summary: 'Why you think everyone is watching you (they aren\'t).',
    readTime: '30s', icon: 'flashlight',
    content: `We walk through life feeling like the main character in a movie with a spotlight on us. But everyone else is the main character in *their* movie. They aren't thinking about your awkward wave; they are thinking about their own awkward wave.`
  },
  {
    id: 'capsule-decision-fatigue', title: 'Decision Fatigue', category: 'Micro-Learning',
    subcategory: 'Productivity',
    summary: 'Why choosing dinner is hard at 8 PM.',
    readTime: '30s', icon: 'split',
    content: `Willpower is a finite battery. Every choice you make drains it. By 8 PM, the battery is dead. Automate small choices (what to wear, what to eat for breakfast) to save your battery for the big stuff.`
  },

  // 9. PERFORMANCE & MASTERY
  {
    id: 'performance-burnout-prevention', title: 'Executive Burnout Prevention', category: 'Performance',
    subcategory: 'Executive Wellness',
    summary: 'High-stakes stress management for corporate leaders.',
    readTime: '6 min', icon: 'briefcase',
    content: `In high-pressure corporate environments, stress is often worn like a badge of honor. But chronic stress is the enemy of high performance.

### The High-Performance Recovery:
Elite athletes don't train 24/7; they train hard and recover harder. Corporate athletes must do the same.
- **Oscillation**: Work in 90-minute blocks followed by 10 minutes of complete disconnection.
- **Strategic Boringness**: Reduce decision fatigue by automating low-stakes choices.

### Emotional Regulation for Leaders:
"The mood of the leader is the mood of the team." If you are caffeinated and anxious, your team will be too. Practice calm as a skill.`
  },
  {
    id: 'performance-stoicism', title: 'Modern Stoicism', category: 'Performance',
    subcategory: 'Modern Stoicism',
    summary: 'Building an unshakeable mind in a chaotic world.',
    readTime: '7 min', icon: 'target',
    content: `Stoicism isn't about suppressing emotion; it's about the "Dichotomy of Control."

### The Dichotomy of Control:
- **Internal**: Your thoughts, your actions, your intentions. (Focus 100% here).
- **External**: The economy, other people's opinions, the weather. (Accept these as they are).

### The Pre-Mortem:
Visualizing everything that could go wrong before it happens. This isn't pessimism; it's preparation. When you've already visualized the failure, the actual event loses its power to panic you.`
  },
  {
    id: 'performance-discipline-habit', title: 'The Discipline Architecture', category: 'Performance',
    subcategory: 'High Performance',
    summary: 'Moving beyond motivation to reliable systems.',
    readTime: '5 min', icon: 'anchor',
    content: `Motivation is a feeling. Discipline is a structure. Feelings are unreliable; structures are not.

### The Consistency Chain:
Don't aim for 100% intensity once a week. Aim for 80% intensity every single day.
- **Identity-Based Habits**: Don't say "I'm trying to work out." Say "I am an athlete." Your brain works hard to align your actions with your identity.
- **The 2-Minute Rule**: If a habit is too hard to start, make the first 2 minutes incredibly easy.`
  },
  {
    id: 'performance-deep-work', title: 'Deep Work Mastery', category: 'Performance',
    subcategory: 'Productivity',
    summary: 'Reclaiming cognitive power in a distracted age.',
    readTime: '6 min', icon: 'brain-circuit',
    content: `Deep work is the ability to focus without distraction on a cognitively demanding task. It's a superpower in the 21st century.

### The Deep Work Protocol:
1. **Physical Environment**: No phone in the room. No open social media tabs.
2. **Pre-defined Duration**: Know EXACTLY when you will end before you start.
3. **Shutdown Ritual**: At the end of the day, explicitly say "Work is done." This stops the "Zeigarnik Effect" from causing evening anxiety.`
  },
  {
    id: 'perf-dopamine-detox', title: 'The Dopamine Detox', category: 'Performance',
    subcategory: 'Neuroscience',
    summary: 'A 24-hour protocol to reset your brain\'s reward pathways.',
    readTime: '7 min', icon: 'zap',
    content: `**Source**: Dr. Andrew Huberman (Huberman Lab) & Dr. Anna Lembke (Dopamine Nation)

In a world of constant cheap dopamine (scrolling, sugar, notifications), our baseline for pleasure rises. This means "normal" activities—like reading, walking, or working—feel painfully boring.

### The 24-Hour Reset Protocol:
For one full day, you will remove all "high-dopamine" inputs to resensitize your receptors.

**The "NO" List:**
- No social media or scrolling.
- No video games.
- No processed sugar / junk food.
- No music with lyrics (instrumental is okay).

**The "YES" List:**
- Walking.
- Reading physical books.
- Journaling.
- Meditating.
- Sitting with boredom.

### Why Boredom is the Goal:
Boredom is not a bug; it's a feature. When you allow yourself to be bored, your dopamine baseline resets. By the end of 24 hours, "boring" things will start to feel interesting again.`
  },
  {
    id: 'performance-masculine-growth', title: 'The Path of Mastery', category: 'Performance',
    subcategory: 'Personal Growth',
    summary: 'Building value, purpose, and character.',
    readTime: '7 min', icon: 'mountain',
    content: `Growth is painful. Comfort is the enemy of character.

### The Three Pillars of Value:
1. **Competence**: Becoming undeniable at what you do.
2. **Accountability**: Taking 100% responsibility for your successes and failures.
3. **Purpose**: Aligning your work with a cause larger than your own comfort.

True value is built in the "dark intervals" where no one is watching.`
  },

  // 10. ADDITIONAL DAILY PRACTICES
  {
    id: 'daily-atomic-habits', title: 'Atomic Habits & Identity', category: 'Daily Practices',
    subcategory: 'Habit Formation',
    summary: 'Building habits by changing who you are, not just what you do.',
    readTime: '6 min', icon: 'trending-up',
    content: `**Source**: James Clear (Atomic Habits)

Most people try to change habits by focusing on the *outcome* ("I want to lose 10kg"). The superior way is to focus on *identity*.

### The Identity Shift:
- **Outcome**: "I'm trying to quit smoking." (Implies you are a smoker trying to do something hard).
- **Identity**: "I'm not a smoker." (Implies smoking contradicts who you are).

### The 1% Rule:
Improving by 1% every day for a year makes you 37x better.
- **Habit Stacking**: "After [CURRENT HABIT], I will [NEW HABIT]."
- Example: "After I pour my coffee, I will meditate for 1 minute."

### Environment Design:
Motivation is overrated; environment is design. If you want to play guitar, buy a stand and put it in the middle of the living room.`
  },
  {
    id: 'care-gratitude-science', title: 'The Science of Gratitude', category: 'Daily Practices',
    subcategory: 'Positive Psychology',
    summary: 'Rewiring the brain for positivity.',
    readTime: '3 min', icon: 'smile',
    content: `Gratitude isn't just "being nice." It's a cognitive training program.

### The "Three Good Things" Exercise:
Every night, write down 3 things that went well and *why*.
After 21 days, your brain starts scanning the world for positives instead of threats. It's biological reprogramming.`
  },
  {
    id: 'daily-sleep-architecture', title: 'Sleep Architecture Deep Dive', category: 'Daily Practices',
    subcategory: 'Sleep Science',
    summary: 'Understanding cyclical recovery for maximum energy.',
    readTime: '6 min', icon: 'moon',
    content: `**Source**: Dr. Matthew Walker (Why We Sleep)

Sleep is not a uniform block of "off" time. It is a complex architectural structure of 90-minute cycles.

### The Two States:
1. **NREM (Deep Sleep)**: Physical restoration. Your brain cleans out toxins. This happens mostly in the *first half* of the night.
2. **REM (Dream Sleep)**: Emotional and memory processing. This happens mostly in the *second half* of the night.

### Why 6 Hours Isn't Enough:
If you sleep 6 hours instead of 8, you don't lose "25% of your sleep." You lose **60-90% of your REM sleep**, because REM is back-loaded. This leads to irritability and anxiety the next day.

### The Caffeine Half-Life:
Caffeine has a half-life of ~6 hours. If you have a coffee at 4 PM, 50% of it is still in your brain at 10 PM.
**Rule**: No caffeine after 12 PM.`
  },
];

// ─── BOOK LIBRARY DATA ───
const MASTER_LIBRARY = [
  // Modern
  { id: 'book-atomic-habits', title: 'Atomic Habits', author: 'James Clear', category: 'Modern', summary: 'The comprehensive guide on how tiny changes lead to remarkable results.', targetAudience: 'Anyone struggling to stick to a routine or break a bad habit.', keyInsight: 'You do not rise to the level of your goals. You fall to the level of your systems.', color: 'linear-gradient(135deg, #f59e0b, #ea580c)', readUrl: 'https://jamesclear.com/atomic-habits' },
  { id: 'book-why-we-sleep', title: 'Why We Sleep', author: 'Matthew Walker, PhD', category: 'Modern', summary: 'A deep dive into the vital importance of sleep for memory, health, and longevity.', targetAudience: 'High performers who think they can "get by" on 6 hours.', keyInsight: 'Sleep is the single most effective performance enhancing legal drug.', color: 'linear-gradient(135deg, #2563eb, #312e81)' },
  { id: 'book-dopamine-nation', title: 'Dopamine Nation', author: 'Dr. Anna Lembke', category: 'Modern', summary: 'Understanding the neuroscience of addiction and the "pain-pleasure" balance.', targetAudience: 'People who feel addicted to their phone, sugar, or distractions.', keyInsight: 'The pursuit of pleasure for its own sake leads to anhedonia.', color: 'linear-gradient(135deg, #ec4899, #e11d48)' },
  // Philosophy
  { id: 'pd-meditations', title: 'Meditations', author: 'Marcus Aurelius', category: 'Philosophy', summary: 'The personal reflections of the Roman Emperor on duty, mortality, and the Stoic path.', targetAudience: 'Leaders and anyone seeking emotional stability.', keyInsight: 'The happiness of your life depends upon the quality of your thoughts.', color: 'linear-gradient(135deg, #52525b, #18181b)', readUrl: 'https://www.gutenberg.org/ebooks/2680' },
  { id: 'pd-discourses', title: 'Discourses', author: 'Epictetus', category: 'Philosophy', summary: 'Practical Stoic teachings on what we can and cannot control.', targetAudience: 'People feeling overwhelmed by external circumstances.', keyInsight: 'It is not what happens to you, but how you react to it that matters.', color: 'linear-gradient(135deg, #475569, #1e293b)', readUrl: 'https://www.gutenberg.org/ebooks/10661' },
  { id: 'pd-enchiridion', title: 'The Enchiridion', author: 'Epictetus', category: 'Philosophy', summary: 'A short manual of Stoic ethical advice.', targetAudience: 'Those seeking a quick reference for Stoic living.', keyInsight: 'Control your perception, and you control your world.', color: 'linear-gradient(135deg, #64748b, #334155)', readUrl: 'https://www.gutenberg.org/ebooks/45109' },
  { id: 'pd-letters-seneca', title: 'Moral Letters to Lucilius', author: 'Seneca', category: 'Philosophy', summary: 'Letters covering friendship, death, wealth, and the use of time.', targetAudience: 'Anyone pondering the deeper meaning of life.', keyInsight: 'We suffer more often in imagination than in reality.', color: 'linear-gradient(135deg, #78716c, #292524)', readUrl: 'https://www.gutenberg.org/ebooks/37099' },
  { id: 'pd-republic', title: 'The Republic', author: 'Plato', category: 'Philosophy', summary: 'A dialogue concerning justice, the soul, and the ideal state.', targetAudience: 'Students of ethics and political philosophy.', keyInsight: 'The heaviest penalty for declining to rule is to be ruled by someone inferior.', color: 'linear-gradient(135deg, #1e3a8a, #1e1b4b)', readUrl: 'https://www.gutenberg.org/ebooks/1497' },
  { id: 'pd-art-of-war', title: 'The Art of War', author: 'Sun Tzu', category: 'Philosophy', summary: 'Strategic principles for conflict, leadership, and mental preparation.', targetAudience: 'Anyone facing competition or conflict.', keyInsight: 'All warfare is based on deception.', color: 'linear-gradient(135deg, #065f46, #09090b)', readUrl: 'https://www.gutenberg.org/ebooks/132' },
  { id: 'pd-beyond-good-evil', title: 'Beyond Good and Evil', author: 'Friedrich Nietzsche', category: 'Philosophy', summary: 'A critique of traditional morality and an invitation to self-creation.', targetAudience: 'Independent thinkers looking to challenge their biases.', keyInsight: 'He who fights with monsters might take care lest he thereby become a monster.', color: 'linear-gradient(135deg, #450a0a, #000000)', readUrl: 'https://www.gutenberg.org/ebooks/4363' },
  // Psychology
  { id: 'pd-principles-psych', title: 'Principles of Psychology', author: 'William James', category: 'Psychology', summary: 'The classic text that shaped modern psychology.', targetAudience: 'Students of the mind and habit.', keyInsight: 'Act as if what you do makes a difference. It does.', color: 'linear-gradient(135deg, #1d4ed8, #1e1b4b)', readUrl: 'https://www.gutenberg.org/ebooks/38194' },
  { id: 'pd-jung-symbols', title: 'Psychology of the Unconscious', author: 'Carl Jung', category: 'Psychology', summary: 'Jung\'s breakout work on myths and archetypes.', targetAudience: 'Those interested in the deep unconscious.', keyInsight: 'Who looks outside, dreams; who looks inside, awakes.', color: 'linear-gradient(135deg, #312e81, #581c87)', readUrl: 'https://www.gutenberg.org/ebooks/62254' },
  { id: 'pd-freud-dreams', title: 'Interpretation of Dreams', author: 'Sigmund Freud', category: 'Psychology', summary: 'The introduction of the unconscious through dream analysis.', targetAudience: 'Curious minds about the hidden self.', keyInsight: 'Dreams are the royal road to the unconscious.', color: 'linear-gradient(135deg, #581c87, #09090b)', readUrl: 'https://www.gutenberg.org/ebooks/66048' },
  // Self-Mastery
  { id: 'pd-as-man-thinketh', title: 'As a Man Thinketh', author: 'James Allen', category: 'Self-Mastery', summary: 'The power of mind to shape character and circumstance.', targetAudience: 'Those seeking focus and personal accountability.', keyInsight: 'Circumstances do not make the man; they reveal him to himself.', color: 'linear-gradient(135deg, #0891b2, #1e40af)', readUrl: 'https://www.gutenberg.org/ebooks/4507' },
  { id: 'pd-self-reliance-emerson', title: 'Self-Reliance', author: 'Ralph Waldo Emerson', category: 'Self-Mastery', summary: 'The definitive essay on non-conformity and intuition.', targetAudience: 'Trailblazers and soul-searchers.', keyInsight: 'Trust thyself: every heart vibrates to that iron string.', color: 'linear-gradient(135deg, #15803d, #065f46)', readUrl: 'https://www.gutenberg.org/ebooks/16643' },
  { id: 'pd-walden', title: 'Walden', author: 'Henry David Thoreau', category: 'Self-Mastery', summary: 'Reflections on simple living and solitude.', targetAudience: 'Those feeling overwhelmed by modern noise.', keyInsight: 'I went to the woods because I wished to live deliberately.', color: 'linear-gradient(135deg, #166534, #052e16)', readUrl: 'https://www.gutenberg.org/ebooks/205' },
  // Spirit
  { id: 'pd-prophet', title: 'The Prophet', author: 'Kahlil Gibran', category: 'Spirit', summary: 'Poetic wisdom on love, work, and the human condition.', targetAudience: 'Seeking meaningful perspective on daily life.', keyInsight: 'Your pain is the breaking of the shell that encloses your understanding.', color: 'linear-gradient(135deg, #d97706, #c2410c)', readUrl: 'https://www.gutenberg.org/ebooks/58585' },
  { id: 'pd-siddhartha', title: 'Siddhartha', author: 'Hermann Hesse', category: 'Spirit', summary: 'The journey of a man seeking enlightenment.', targetAudience: 'Seekers of balance and wisdom.', keyInsight: 'Wisdom is not communicable.', color: 'linear-gradient(135deg, #a16207, #92400e)', readUrl: 'https://www.gutenberg.org/ebooks/2500' },
  { id: 'pd-dhammapada', title: 'The Dhammapada', author: 'Buddha (Trans.)', category: 'Spirit', summary: 'A collection of the Buddha\'s direct teachings.', targetAudience: 'Practitioners of mindfulness and peace.', keyInsight: 'Mind is the forerunner of all states.', color: 'linear-gradient(135deg, #c2410c, #92400e)', readUrl: 'https://www.gutenberg.org/ebooks/2017' },
  { id: 'pd-tao-te', title: 'Tao Te Ching', author: 'Laozi', category: 'Spirit', summary: 'The classic text on living in harmony with the flow of nature.', targetAudience: 'High-stress individuals seeking "Wu Wei."', keyInsight: 'Nature does not hurry, yet everything is accomplished.', color: 'linear-gradient(135deg, #10b981, #0f766e)', readUrl: 'https://www.gutenberg.org/ebooks/216' },
  { id: 'pd-upanishads', title: 'The Upanishads', author: 'Various', category: 'Spirit', summary: 'Classic Sanskrit texts exploring the nature of reality and self.', targetAudience: 'Seekers of metaphysical depth.', keyInsight: 'You are what your deep, driving desire is.', color: 'linear-gradient(135deg, #f97316, #92400e)', readUrl: 'https://www.gutenberg.org/ebooks/6288' },
  // Science
  { id: 'pd-origin-species', title: 'On the Origin of Species', author: 'Charles Darwin', category: 'Science', summary: 'The foundation of evolutionary biology.', targetAudience: 'Those curious about the biological roots of behavior.', keyInsight: 'It is not the strongest that survives, but the most adaptable.', color: 'linear-gradient(135deg, #166534, #052e16)', readUrl: 'https://www.gutenberg.org/ebooks/1228' },
];

// ─── CATEGORY CONFIG ───
const ARTICLE_CATEGORIES = [
  'Foundation', 'Daily Practices', 'Regulation', 'Recognition',
  'Condition Base', 'Life Problems', 'Performance'
];

const BOOK_CATEGORIES = ['Modern', 'Philosophy', 'Psychology', 'Self-Mastery', 'Spirit', 'Science'];

const CATEGORY_ICONS = {
  'Foundation': 'sprout', 'Daily Practices': 'sun', 'Regulation': 'shield',
  'Recognition': 'eye', 'Condition Base': 'brain', 'Life Problems': 'heart',
  'Performance': 'target', 'Crisis Support': 'alert-triangle', 'Micro-Learning': 'zap',
};

// ─── RENDER ENGINE ───
let kh_activeTab = 'articles';
let kh_searchQuery = '';
let kh_selectedCategory = null;
let kh_selectedArticle = null;
let kh_bookFilter = null;

function renderKnowledge() {
  const container = document.getElementById('page-content');

  // Inject CSS dynamically to bypass service worker cache of index.html
  if (!document.getElementById('kh-stylesheet')) {
    const link = document.createElement('link');
    link.id = 'kh-stylesheet';
    link.rel = 'stylesheet';
    link.href = '/css/knowledge.css?v=' + new Date().getTime(); // cache buster
    document.head.appendChild(link);
  }

  if (kh_selectedArticle) {
    renderArticleReader(container);
    return;
  }

  const crisisArticles = KNOWLEDGE_ARTICLES.filter(a => a.isCrisis);
  const capsules = KNOWLEDGE_ARTICLES.filter(a => a.category === 'Micro-Learning');

  const filteredArticles = KNOWLEDGE_ARTICLES.filter(a => {
    if (a.isCrisis || a.category === 'Micro-Learning') return false;
    const q = kh_searchQuery.toLowerCase();
    const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || (a.subcategory || '').toLowerCase().includes(q);
    const matchesCat = !kh_selectedCategory || a.category === kh_selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredBooks = MASTER_LIBRARY.filter(b => {
    const q = kh_searchQuery.toLowerCase();
    const matchesSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.keyInsight.toLowerCase().includes(q);
    const matchesCat = !kh_bookFilter || b.category === kh_bookFilter;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = `
    <div class="kh-root animate-in">
      <!-- Header -->
      <div class="kh-header">
        <div class="kh-header-left">
          <div class="kh-header-label"><i data-lucide="compass" style="width:16px;height:16px;"></i> WELLNESS NAVIGATOR</div>
          <h2 class="kh-title">Knowledge Hub</h2>
          <p class="kh-subtitle">A scientifically-backed knowledge system for mental resilience, growth, and high-performance mastery.</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="kh-tabs">
        <button class="kh-tab ${kh_activeTab === 'articles' ? 'active' : ''}" onclick="kh_switchTab('articles')">
          <i data-lucide="book-open" style="width:16px;height:16px;"></i> Articles <span class="kh-tab-count">${KNOWLEDGE_ARTICLES.filter(a => !a.isCrisis && a.category !== 'Micro-Learning').length}</span>
        </button>
        <button class="kh-tab ${kh_activeTab === 'library' ? 'active' : ''}" onclick="kh_switchTab('library')">
          <i data-lucide="library" style="width:16px;height:16px;"></i> Book Library <span class="kh-tab-count">${MASTER_LIBRARY.length}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="kh-search-wrap">
        <i data-lucide="search" style="width:18px;height:18px;" class="kh-search-icon"></i>
        <input type="text" class="kh-search" placeholder="${kh_activeTab === 'articles' ? 'Search articles, tools, or topics...' : 'Search books, authors, or insights...'}" value="${kh_searchQuery}" oninput="kh_onSearch(this.value)" id="kh-search-input">
      </div>

      ${kh_activeTab === 'articles' ? `
        <!-- Category Filters -->
        <div class="kh-filters">
          <button class="kh-filter-btn ${!kh_selectedCategory ? 'active' : ''}" onclick="kh_filterCat(null)">All</button>
          ${ARTICLE_CATEGORIES.map(cat => `
            <button class="kh-filter-btn ${kh_selectedCategory === cat ? 'active' : ''}" onclick="kh_filterCat('${cat}')">${cat}</button>
          `).join('')}
        </div>

        <!-- Crisis Section -->
        ${!kh_selectedCategory && !kh_searchQuery ? `
          <div class="kh-section kh-crisis-section">
            <div class="kh-section-header">
              <div class="kh-section-icon kh-crisis-icon-bg"><i data-lucide="alert-triangle" style="width:16px;height:16px;"></i></div>
              <h3>Immediate Support</h3>
            </div>
            <div class="kh-crisis-grid">
              ${crisisArticles.map(a => `
                <div class="kh-crisis-card" onclick="kh_openArticle('${a.id}')">
                  <div class="kh-crisis-card-icon"><i data-lucide="${a.icon}" style="width:24px;height:24px;"></i></div>
                  <div class="kh-crisis-card-info">
                    <h4>${a.title}</h4>
                    <p>${a.summary}</p>
                  </div>
                  <i data-lucide="chevron-right" style="width:20px;height:20px;" class="kh-crisis-arrow"></i>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Article Grid -->
        <div class="kh-article-grid">
          ${filteredArticles.length > 0 ? filteredArticles.map((a, i) => `
            <div class="kh-article-card animate-in animate-in-delay-${(i % 6) + 1}" onclick="kh_openArticle('${a.id}')">
              <div class="kh-article-card-bg"><i data-lucide="${a.icon}" style="width:48px;height:48px;"></i></div>
              <div class="kh-article-meta">
                <span class="kh-article-cat">${a.category}</span>
                <span class="kh-article-time"><i data-lucide="clock" style="width:12px;height:12px;"></i> ${a.readTime}</span>
              </div>
              <h3 class="kh-article-title">${a.title}</h3>
              <p class="kh-article-summary">${a.summary}</p>
              <div class="kh-article-footer">
                <span class="kh-article-explore">Explore <i data-lucide="chevron-right" style="width:14px;height:14px;"></i></span>
                ${a.subcategory ? `<span class="kh-article-sub">${a.subcategory}</span>` : ''}
              </div>
            </div>
          `).join('') : `
            <div class="kh-empty">
              <div class="kh-empty-icon"><i data-lucide="filter" style="width:32px;height:32px;"></i></div>
              <h3>No articles found</h3>
              <p>Try different keywords or browse a category.</p>
              <button class="btn btn-ghost btn-sm" onclick="kh_resetSearch()">Reset Search</button>
            </div>
          `}
        </div>

        <!-- Micro-Learning Capsules -->
        ${!kh_selectedCategory && !kh_searchQuery ? `
          <div class="kh-section">
            <div class="kh-section-header">
              <div class="kh-section-icon kh-micro-icon-bg"><i data-lucide="zap" style="width:16px;height:16px;"></i></div>
              <div>
                <h3>Micro-Learning</h3>
                <span class="kh-section-label">30-second quick takes</span>
              </div>
            </div>
            <div class="kh-capsule-rail">
              ${capsules.map(c => `
                <div class="kh-capsule-card" onclick="kh_openArticle('${c.id}')">
                  <div class="kh-capsule-icon"><i data-lucide="${c.icon}" style="width:24px;height:24px;"></i></div>
                  <h4>${c.title}</h4>
                  <p>"${c.summary}"</p>
                  <span class="kh-capsule-link">Read Take <i data-lucide="chevron-right" style="width:12px;height:12px;"></i></span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : `
        <!-- BOOK LIBRARY TAB -->
        <div class="kh-filters">
          <button class="kh-filter-btn ${!kh_bookFilter ? 'active' : ''}" onclick="kh_filterBook(null)">All</button>
          ${BOOK_CATEGORIES.map(cat => `
            <button class="kh-filter-btn ${kh_bookFilter === cat ? 'active' : ''}" onclick="kh_filterBook('${cat}')">${cat}</button>
          `).join('')}
        </div>

        <div class="kh-book-grid">
          ${filteredBooks.length > 0 ? filteredBooks.map((b, i) => `
            <div class="kh-book-card animate-in animate-in-delay-${(i % 6) + 1}">
              <div class="kh-book-spine"></div>
              <div class="kh-book-front" style="background:${b.color};">
                <div class="kh-book-front-overlay"></div>
                <div class="kh-book-content">
                  <span class="kh-book-category">${b.category}</span>
                  <div class="kh-book-title-wrap">
                    <h4>${b.title}</h4>
                    <p class="kh-book-author">${b.author}</p>
                  </div>
                  <div class="kh-book-divider"></div>
                  <p class="kh-book-insight">"${b.keyInsight}"</p>
                </div>
                <div class="kh-book-bottom">
                  <p class="kh-book-bottom-label">Primary Insight</p>
                  <p class="kh-book-bottom-text">${b.summary}</p>
                </div>
              </div>
              <div class="kh-book-overlay">
                <div class="kh-book-overlay-content">
                  <h5>Who Should Read This</h5>
                  <p>${b.targetAudience}</p>
                </div>
                <div class="kh-book-overlay-actions">
                  ${b.readUrl ? `<a href="${b.readUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm kh-book-read-btn"><i data-lucide="external-link" style="width:14px;height:14px;"></i> Read Online</a>` : ''}
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="kh-empty">
              <div class="kh-empty-icon"><i data-lucide="filter" style="width:32px;height:32px;"></i></div>
              <h3>No books found</h3>
              <p>Try different keywords or browse a category.</p>
              <button class="btn btn-ghost btn-sm" onclick="kh_resetSearch()">Reset Search</button>
            </div>
          `}
        </div>
      `}

      <!-- Footer Info -->
      <div class="kh-footer-grid">
        <div class="kh-footer-card">
          <div class="kh-footer-accent" style="background:var(--color-info);"></div>
          <i data-lucide="info" style="width:20px;height:20px;color:var(--color-info);"></i>
          <h5>Scientific Foundation</h5>
          <p>All content is derived from peer-reviewed psychological research, including CBT, MBSR, and Neurobiology.</p>
        </div>
        <div class="kh-footer-card">
          <div class="kh-footer-accent" style="background:var(--color-primary);"></div>
          <i data-lucide="brain" style="width:20px;height:20px;color:var(--color-primary);"></i>
          <h5>Curated for Growth</h5>
          <p>Every article and book is handpicked to complement your GrowTrack journey of habits, goals, and self-improvement.</p>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// ─── ARTICLE READER ───
function renderArticleReader(container) {
  const article = kh_selectedArticle;
  const isCrisis = article.isCrisis;

  // Parse content into structured HTML
  const contentHTML = parseArticleContent(article.content);

  container.innerHTML = `
    <div class="kh-reader animate-in">
      <div class="kh-reader-header ${isCrisis ? 'kh-reader-crisis' : ''}">
        <button class="kh-reader-back" onclick="kh_closeArticle()">
          <i data-lucide="arrow-left" style="width:16px;height:16px;"></i> Back to Library
        </button>
        <div class="kh-reader-meta">
          <span class="kh-reader-cat ${isCrisis ? 'kh-crisis-badge' : ''}">${article.category}</span>
          <span class="kh-reader-time"><i data-lucide="clock" style="width:12px;height:12px;"></i> ${article.readTime} read</span>
        </div>
        <h1 class="kh-reader-title">${article.title}</h1>
      </div>

      <div class="kh-reader-body">
        <div class="kh-reader-content">
          ${contentHTML}
        </div>

        <div class="kh-reader-footer">
          <button class="btn btn-ghost" onclick="kh_closeArticle()">
            <i data-lucide="check" style="width:16px;height:16px;"></i> Finished Reading
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function parseArticleContent(content) {
  const paragraphs = content.split('\n\n');
  let html = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('###')) {
      html += `<h3 class="kh-content-heading">${trimmed.replace(/###\s*/g, '')}</h3>`;
    } else if (trimmed.startsWith('**Source**:') || trimmed.startsWith('**Fact**:') || trimmed.startsWith('**Breathe**:')) {
      html += `<div class="kh-content-callout"><p>${formatInline(trimmed)}</p></div>`;
    } else {
      const lines = trimmed.split('\n');
      let listItems = [];
      let textLines = [];

      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('- ') || t.startsWith('* ') || /^\d+\.\s/.test(t)) {
          if (textLines.length) {
            html += `<p>${formatInline(textLines.join(' '))}</p>`;
            textLines = [];
          }
          listItems.push(t.replace(/^[-*]\s+|\d+\.\s+/, ''));
        } else {
          if (listItems.length) {
            html += `<ul class="kh-content-list">${listItems.map(li => `<li>${formatInline(li)}</li>`).join('')}</ul>`;
            listItems = [];
          }
          textLines.push(t);
        }
      }

      if (textLines.length) html += `<p>${formatInline(textLines.join(' '))}</p>`;
      if (listItems.length) html += `<ul class="kh-content-list">${listItems.map(li => `<li>${formatInline(li)}</li>`).join('')}</ul>`;
    }
  }

  return html;
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// ─── EVENT HANDLERS ───
function kh_switchTab(tab) {
  kh_activeTab = tab;
  kh_searchQuery = '';
  kh_selectedCategory = null;
  kh_bookFilter = null;
  renderKnowledge();
}

function kh_onSearch(val) {
  kh_searchQuery = val;
  // Debounced re-render
  clearTimeout(window._khSearchTimer);
  window._khSearchTimer = setTimeout(() => renderKnowledge(), 200);
}

function kh_filterCat(cat) {
  kh_selectedCategory = kh_selectedCategory === cat ? null : cat;
  renderKnowledge();
}

function kh_filterBook(cat) {
  kh_bookFilter = kh_bookFilter === cat ? null : cat;
  renderKnowledge();
}

function kh_openArticle(id) {
  kh_selectedArticle = KNOWLEDGE_ARTICLES.find(a => a.id === id);
  renderKnowledge();
}

function kh_closeArticle() {
  kh_selectedArticle = null;
  renderKnowledge();
}

function kh_resetSearch() {
  kh_searchQuery = '';
  kh_selectedCategory = null;
  kh_bookFilter = null;
  renderKnowledge();
}
