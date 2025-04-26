// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

const questions = [
    // Physical Characteristics
    {
        category: "Physical Characteristics",
        questions: [
            {
                question: "What's your body frame like?",
                options: [
                    "Thin, lean, tall or short, with prominent joints and bones",
                    "Medium, symmetrical build with good muscle development",
                    "Large, well-developed frame with sturdy bones"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "How's your skin typically?",
                options: [
                    "Dry, rough, or thin, gets cold easily",
                    "Warm, reddish, prone to irritation and acne",
                    "Thick, oily, smooth and cool, rarely has problems"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "What best describes your hair?",
                options: [
                    "Dry, thin, brittle, or frizzy",
                    "Fine, straight, early graying",
                    "Thick, wavy, lustrous, strong"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            }
        ]
    },
    // Mental & Emotional Traits
    {
        category: "Mental & Emotional Characteristics",
        questions: [
            {
                question: "How do you typically handle stress?",
                options: [
                    "Become anxious and worried easily",
                    "Become irritable or intense",
                    "Remain calm and steady"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "How would you describe your memory?",
                options: [
                    "Quick to learn but quick to forget",
                    "Sharp and precise memory",
                    "Slow to learn but never forgets"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "What's your typical speech pattern?",
                options: [
                    "Fast, enthusiastic, sometimes jumps topics",
                    "Clear, focused, persuasive",
                    "Slow, methodical, thoughtful"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            }
        ]
    },
    // Lifestyle & Habits
    {
        category: "Lifestyle & Habits",
        questions: [
            {
                question: "What's your typical energy level throughout the day?",
                options: [
                    "Variable energy, get tired easily",
                    "Strong, purposeful energy",
                    "Steady but slow-moving energy"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "How's your appetite and digestion?",
                options: [
                    "Irregular, easily bloated",
                    "Strong appetite, good digestion",
                    "Slow but steady digestion"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            },
            {
                question: "How do you typically sleep?",
                options: [
                    "Light sleeper, tendency to insomnia",
                    "Moderate sleep, wake up easily",
                    "Deep sleeper, hard to wake up"
                ],
                scores: [
                    { vata: 2, pitta: 0, kapha: 0 },
                    { vata: 0, pitta: 2, kapha: 0 },
                    { vata: 0, pitta: 0, kapha: 2 }
                ]
            }
        ]
    }
];

let currentCategory = 0;
let scores = {
    vata: 0,
    pitta: 0,
    kapha: 0
};

function startQuiz() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    document.getElementById('question-screen').classList.add('active');
    showCategoryQuestions();
}

function showCategoryQuestions() {
    const categoryData = questions[currentCategory];
    document.getElementById('category-title').textContent = categoryData.category;
    
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = '';
    
    categoryData.questions.forEach((question, index) => {
        const questionElement = createQuestionElement(question, index);
        questionsContainer.appendChild(questionElement);
    });
    
    updateProgress();
}

function createQuestionElement(questionData, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block';
    
    const questionText = document.createElement('h3');
    questionText.textContent = questionData.question;
    questionDiv.appendChild(questionText);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    
    questionData.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index, optionIndex);
        optionsDiv.appendChild(button);
    });
    
    questionDiv.appendChild(optionsDiv);
    return questionDiv;
}

function updateProgress() {
    const progress = ((currentCategory + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function selectOption(questionIndex, optionIndex) {
    const categoryData = questions[currentCategory];
    const questionData = categoryData.questions[questionIndex];
    
    // Update the selected option's appearance
    const questionBlocks = document.getElementsByClassName('question-block');
    const options = questionBlocks[questionIndex].getElementsByClassName('option');
    
    for (let option of options) {
        option.classList.remove('selected');
    }
    options[optionIndex].classList.add('selected');
    
    // Update scores
    const questionScores = questionData.scores[optionIndex];
    scores.vata += questionScores.vata;
    scores.pitta += questionScores.pitta;
    scores.kapha += questionScores.kapha;
    
    // Check if all questions in the category are answered
    const allAnswered = Array.from(questionBlocks).every(block => 
        Array.from(block.getElementsByClassName('option')).some(opt => 
            opt.classList.contains('selected')
        )
    );
    
    if (allAnswered) {
        document.getElementById('next-button').disabled = false;
    }
}

function nextCategory() {
    currentCategory++;
    if (currentCategory < questions.length) {
        showCategoryQuestions();
        document.getElementById('next-button').disabled = true;
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('question-screen').classList.remove('active');
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('results-screen').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('active');
    
    const total = scores.vata + scores.pitta + scores.kapha;
    const percentages = {
        vata: Math.round((scores.vata / total) * 100),
        pitta: Math.round((scores.pitta / total) * 100),
        kapha: Math.round((scores.kapha / total) * 100)
    };
    
    // Update the bars and percentages
    document.getElementById('vata-bar').style.width = `${percentages.vata}%`;
    document.getElementById('pitta-bar').style.width = `${percentages.pitta}%`;
    document.getElementById('kapha-bar').style.width = `${percentages.kapha}%`;
    
    document.getElementById('vata-percentage').textContent = `${percentages.vata}%`;
    document.getElementById('pitta-percentage').textContent = `${percentages.pitta}%`;
    document.getElementById('kapha-percentage').textContent = `${percentages.kapha}%`;
    
    // Create pie chart
    const ctx = document.getElementById('doshaChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Vata', 'Pitta', 'Kapha'],
            datasets: [{
                data: [percentages.vata, percentages.pitta, percentages.kapha],
                backgroundColor: [
                    'rgba(155, 89, 182, 0.8)',  // Vata
                    'rgba(231, 76, 60, 0.8)',   // Pitta
                    'rgba(46, 204, 113, 0.8)'   // Kapha
                ],
                borderColor: [
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(46, 204, 113, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    // Determine primary and secondary doshas
    const doshaEntries = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
    const primaryDosha = doshaEntries[0][0];
    const secondaryDosha = doshaEntries[1][0];
    
    const descriptions = {
        vata: {
            primary: "Your primary dosha is Vata, the energy of movement. Associated with air and space elements, you naturally possess creative energy, adaptability, and quick thinking. When in balance, you exhibit enthusiasm, flexibility, and mental vitality. To maintain balance, focus on establishing regular routines, staying warm, getting adequate rest, and consuming grounding, nourishing foods. Your natural qualities make you excellent at initiating projects and thinking outside the box.",
            secondary: "With Vata as your secondary influence, you may experience periods of high creativity and mental activity. This gives you an edge in adaptability and quick learning, but remember to practice grounding exercises and maintain regular routines to prevent feeling scattered or anxious."
        },
        pitta: {
            primary: "Your primary dosha is Pitta, the energy of transformation. Combining fire and water elements, you possess strong intelligence, focus, and natural leadership qualities. When balanced, you exhibit sharp intellect, strong metabolism, and excellent decision-making abilities. To maintain harmony, avoid overexertion, stay cool, manage stress, and choose foods that are cooling and moderate in spice. Your natural qualities make you an excellent leader and problem-solver.",
            secondary: "With Pitta as your secondary influence, you benefit from strong metabolic energy and mental clarity. This supports your ability to process information and make decisions, but remember to practice moderation and make time for relaxation to prevent overheating physically or mentally."
        },
        kapha: {
            primary: "Your primary dosha is Kapha, the energy of stability. Representing earth and water elements, you naturally embody strength, endurance, and emotional stability. When in balance, you exhibit excellent immunity, compassion, and steady energy. To maintain optimal health, focus on regular exercise, embrace variety in your routine, and choose light, warming foods. Your natural qualities make you an excellent support system and steady force in any situation.",
            secondary: "With Kapha as your secondary influence, you benefit from natural strength and emotional stability. This provides you with endurance and nurturing qualities, but remember to stay active and embrace change to prevent stagnation or resistance to new experiences."
        }
    };
    
    const description = `${descriptions[primaryDosha].primary}\n\n${descriptions[secondaryDosha].secondary}`;
    document.getElementById('primary-dosha-description').textContent = description;
}

function restartQuiz() {
    currentCategory = 0;
    scores = {
        vata: 0,
        pitta: 0,
        kapha: 0
    };
    document.getElementById('results-screen').classList.remove('active');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
    document.getElementById('welcome-screen').classList.add('active');
} 