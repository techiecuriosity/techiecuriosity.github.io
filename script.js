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

// Quiz data
const quizData = {
    physical: [
        {
            question: "Which of these best describes your physical frame?",
            options: ["Small", "Medium", "Large"],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "Which best describes your skin?",
            options: ["Dry", "Oily and soft with freckles or pimples", "Thick, oily, cool skin"],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "Which best describes your hair?",
            options: ["Dry and curly", "Straight and fine", "Thick and lustrous"],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "Which best describes your eyes?",
            options: ["Small and dry", "Medium-sized; intense gaze", "Large, pretty"],
            vata: 1,
            pitta: 2,
            kapha: 3
        }
    ],
    emotional: [
        {
            question: "Which best describes how you talk?",
            options: ["Fast and/or a lot!", "My words are sharp and concise.", "My speech is slow and calm."],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "How is your memory?",
            options: ["I learn quickly, but I also forget quickly.", "I have a great memory!", "It takes me a while to commit something to memory, but once I do I don't forget it."],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "Which best describes your personality?",
            options: ["Creative, joyful, and introspective", "Competitive, perceptive, and efficient", "Responsible, nurturing, and sensitive"],
            vata: 1,
            pitta: 2,
            kapha: 3
        }
    ],
    mental: [
        {
            question: "Which of these traits do you most identify with?",
            options: ["I'm often indecisive.", "I get jealous easily.", "I can be pretty stubborn."],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "How about these traits? Which sounds the most like you?",
            options: ["I'm very intuitive.", "I'm quite brave.", "I'm a loyal, faithful friend."],
            vata: 1,
            pitta: 2,
            kapha: 3
        },
        {
            question: "When you're under stress do you tend to...",
            options: ["Feel anxious or fearful?", "Easily lose your temper?", "Feel complacent?"],
            vata: 1,
            pitta: 2,
            kapha: 3
        }
    ]
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const resultsScreen = document.getElementById('results-screen');
const startQuizBtn = document.getElementById('start-quiz');
const nextSectionBtn = document.getElementById('next-section');
const takeQuizAgainBtn = document.getElementById('take-quiz-again');
const printResultsBtn = document.getElementById('print-results');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress');
const progressLabels = document.querySelectorAll('.progress-label');
const categoryTitle = document.querySelector('.category-title');

// Quiz state
let currentCategory = 'physical';
let currentQuestionIndex = 0;
let scores = { vata: 0, pitta: 0, kapha: 0 };
let selectedOption = null;

// Initialize the quiz
function initQuiz() {
    startQuizBtn.addEventListener('click', startQuiz);
    nextSectionBtn.addEventListener('click', nextCategory);
    takeQuizAgainBtn.addEventListener('click', restartQuiz);
    printResultsBtn.addEventListener('click', printResults);
}

// Start the quiz
function startQuiz() {
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questionScreen.classList.add('active');
    showQuestion();
}

// Show current question
function showQuestion() {
    const questions = quizData[currentCategory];
    const question = questions[currentQuestionIndex];
    
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    updateProgress();
}

// Select an option
function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedOption = index;
    nextSectionBtn.disabled = false;
}

// Update progress bar and labels
function updateProgress() {
    const questions = quizData[currentCategory];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    progressLabels.forEach((label, index) => {
        if (index === Object.keys(quizData).indexOf(currentCategory)) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });
}

// Move to next category
function nextCategory() {
    if (!selectedOption) return;
    
    const questions = quizData[currentCategory];
    const question = questions[currentQuestionIndex];
    
    // Add scores
    scores.vata += question.vata === 1 ? 1 : 0;
    scores.pitta += question.pitta === 2 ? 1 : 0;
    scores.kapha += question.kapha === 3 ? 1 : 0;
    
    // Move to next question or category
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        selectedOption = null;
        nextSectionBtn.disabled = true;
        showQuestion();
    } else {
        const categories = Object.keys(quizData);
        const currentIndex = categories.indexOf(currentCategory);
        
        if (currentIndex < categories.length - 1) {
            currentCategory = categories[currentIndex + 1];
            currentQuestionIndex = 0;
            selectedOption = null;
            nextSectionBtn.disabled = true;
            categoryTitle.textContent = `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Characteristics`;
            showQuestion();
        } else {
            showResults();
        }
    }
}

// Show results
function showResults() {
    questionScreen.classList.remove('active');
    questionScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    resultsScreen.classList.add('active');
    
    // Calculate percentages
    const totalQuestions = Object.values(quizData).reduce((acc, category) => acc + category.length, 0);
    const vataPercentage = (scores.vata / totalQuestions) * 100;
    const pittaPercentage = (scores.pitta / totalQuestions) * 100;
    const kaphaPercentage = (scores.kapha / totalQuestions) * 100;
    
    // Create chart
    const ctx = document.getElementById('dosha-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Vata', 'Pitta', 'Kapha'],
            datasets: [{
                data: [vataPercentage, pittaPercentage, kaphaPercentage],
                backgroundColor: [
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(46, 204, 113, 0.8)'
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
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Restart quiz
function restartQuiz() {
    currentCategory = 'physical';
    currentQuestionIndex = 0;
    scores = { vata: 0, pitta: 0, kapha: 0 };
    selectedOption = null;
    
    resultsScreen.classList.remove('active');
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.add('active');
}

// Print results
function printResults() {
    window.print();
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);

// Initialize AdSense ads
function initializeAds() {
    // Push all ad units
    (adsbygoogle = window.adsbygoogle || []).push({});
    
    // Refresh ads on page transitions
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Refresh ads when page becomes visible
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeAds();
}); 