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

// Quiz Data Structure
const quizData = {
    physical: [
        {
            question: "What is your body type?",
            options: [
                { text: "Thin and light", vata: 2, pitta: 0, kapha: 0 },
                { text: "Medium build", vata: 0, pitta: 2, kapha: 0 },
                { text: "Large and sturdy", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "How is your skin?",
            options: [
                { text: "Dry and rough", vata: 2, pitta: 0, kapha: 0 },
                { text: "Oily and warm", vata: 0, pitta: 2, kapha: 0 },
                { text: "Smooth and cool", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "How is your hair?",
            options: [
                { text: "Dry and brittle", vata: 2, pitta: 0, kapha: 0 },
                { text: "Fine and straight", vata: 0, pitta: 2, kapha: 0 },
                { text: "Thick and oily", vata: 0, pitta: 0, kapha: 2 }
            ]
        }
    ],
    emotional: [
        {
            question: "How do you handle stress?",
            options: [
                { text: "Get anxious and worried", vata: 2, pitta: 0, kapha: 0 },
                { text: "Get angry and frustrated", vata: 0, pitta: 2, kapha: 0 },
                { text: "Stay calm and composed", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "What's your typical mood?",
            options: [
                { text: "Changeable and enthusiastic", vata: 2, pitta: 0, kapha: 0 },
                { text: "Intense and focused", vata: 0, pitta: 2, kapha: 0 },
                { text: "Steady and peaceful", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "How do you make decisions?",
            options: [
                { text: "Quickly and intuitively", vata: 2, pitta: 0, kapha: 0 },
                { text: "Logically and decisively", vata: 0, pitta: 2, kapha: 0 },
                { text: "Slowly and carefully", vata: 0, pitta: 0, kapha: 2 }
            ]
        }
    ],
    mental: [
        {
            question: "How is your memory?",
            options: [
                { text: "Quick to learn, quick to forget", vata: 2, pitta: 0, kapha: 0 },
                { text: "Sharp and focused", vata: 0, pitta: 2, kapha: 0 },
                { text: "Slow to learn, never forgets", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "What's your sleep pattern?",
            options: [
                { text: "Light and interrupted", vata: 2, pitta: 0, kapha: 0 },
                { text: "Moderate and regular", vata: 0, pitta: 2, kapha: 0 },
                { text: "Deep and long", vata: 0, pitta: 0, kapha: 2 }
            ]
        },
        {
            question: "How is your concentration?",
            options: [
                { text: "Easily distracted", vata: 2, pitta: 0, kapha: 0 },
                { text: "Focused and intense", vata: 0, pitta: 2, kapha: 0 },
                { text: "Steady and consistent", vata: 0, pitta: 0, kapha: 2 }
            ]
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
const doshaChart = document.getElementById('dosha-chart');
const categoryTitle = document.querySelector('.category-title');

// Quiz State
let currentCategory = 'physical';
let currentQuestion = 0;
let scores = { vata: 0, pitta: 0, kapha: 0 };
let selectedOptions = { physical: [], emotional: [], mental: [] };

// Initialize Quiz
function initQuiz() {
    try {
        // Add event listeners
        startQuizBtn?.addEventListener('click', startQuiz);
        nextSectionBtn?.addEventListener('click', nextCategory);
        takeQuizAgainBtn?.addEventListener('click', restartQuiz);
        printResultsBtn?.addEventListener('click', printResults);
        
        // Initialize chart
        if (doshaChart) {
            initChart();
        }
        
        // Add hover effects to elements
        addHoverEffects();
    } catch (error) {
        console.error('Error initializing quiz:', error);
    }
}

// Start Quiz
function startQuiz() {
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questionScreen.classList.add('active');
    
    showQuestion();
    updateProgress();
}

// Show Current Question
function showQuestion() {
    try {
        const questions = quizData[currentCategory];
        if (!questions || !questions[currentQuestion]) {
            throw new Error('Invalid question data');
        }
        
        const question = questions[currentQuestion];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        
        // Update category title based on current category
        if (categoryTitle) {
            const categoryTitles = {
                physical: "Physical Characteristics",
                emotional: "Emotional Characteristics",
                mental: "Mental Characteristics"
            };
            categoryTitle.textContent = categoryTitles[currentCategory];
        }
        
        // Update button text for last question
        if (nextSectionBtn) {
            const isLastQuestion = currentQuestion === questions.length - 1;
            const isLastCategory = currentCategory === Object.keys(quizData)[Object.keys(quizData).length - 1];
            
            if (isLastQuestion && isLastCategory) {
                nextSectionBtn.textContent = 'Done';
                nextSectionBtn.innerHTML = 'Done <i class="fas fa-check" aria-hidden="true"></i>';
            } else {
                nextSectionBtn.textContent = 'Next Section';
                nextSectionBtn.innerHTML = 'Next Section <i class="fas fa-arrow-right" aria-hidden="true"></i>';
            }
        }
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <span class="option-text">${option.text}</span>
                <span class="option-icon"></span>
            `;
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
    } catch (error) {
        console.error('Error showing question:', error);
    }
}

// Select Option
function selectOption(index) {
    try {
        const options = document.querySelectorAll('.option');
        const questions = quizData[currentCategory];
        if (!questions || !questions[currentQuestion]) {
            throw new Error('Invalid question data');
        }
        
        const question = questions[currentQuestion];
        const option = question.options[index];
        
        // Remove selected class from all options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        options[index].classList.add('selected');
        
        // Enable next section button
        if (nextSectionBtn) {
            nextSectionBtn.disabled = false;
        }
        
        // Store selected option
        if (!selectedOptions[currentCategory]) {
            selectedOptions[currentCategory] = [];
        }
        selectedOptions[currentCategory][currentQuestion] = index;
    } catch (error) {
        console.error('Error selecting option:', error);
    }
}

// Update Progress
function updateProgress() {
    try {
        const totalCategories = Object.keys(quizData).length;
        const currentCategoryIndex = Object.keys(quizData).indexOf(currentCategory);
        const questionsInCategory = quizData[currentCategory].length;
        
        // Calculate progress based on completed categories and current question
        const categoryProgress = currentCategoryIndex / totalCategories;
        const questionProgress = (currentQuestion + 1) / questionsInCategory / totalCategories;
        const progress = (categoryProgress + questionProgress) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        // Update progress labels
        if (progressLabels) {
            progressLabels.forEach((label, index) => {
                if (index === currentCategoryIndex) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Next Category
function nextCategory() {
    const questions = quizData[currentCategory];
    
    // Calculate scores for current category
    selectedOptions[currentCategory].forEach((optionIndex, questionIndex) => {
        if (optionIndex !== undefined) {
            const option = questions[questionIndex].options[optionIndex];
            scores.vata += option.vata;
            scores.pitta += option.pitta;
            scores.kapha += option.kapha;
        }
    });
    
    // Move to next question or category
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
        nextSectionBtn.disabled = true;
    } else {
        const categories = Object.keys(quizData);
        const currentIndex = categories.indexOf(currentCategory);
        
        if (currentIndex < categories.length - 1) {
            currentCategory = categories[currentIndex + 1];
            currentQuestion = 0;
            showQuestion();
            nextSectionBtn.disabled = true;
        } else {
            showResults();
        }
    }
    
    updateProgress();
}

// Show Results
function showResults() {
    try {
        // Hide question screen and show results screen
        questionScreen.classList.remove('active');
        questionScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        resultsScreen.classList.add('active');
        
        // Calculate percentages
        const total = scores.vata + scores.pitta + scores.kapha;
        if (total === 0) {
            throw new Error('No scores calculated');
        }
        
        const percentages = {
            vata: Math.round((scores.vata / total) * 100),
            pitta: Math.round((scores.pitta / total) * 100),
            kapha: Math.round((scores.kapha / total) * 100)
        };
        
        // Update chart
        updateChart(percentages);
        
        // Create detailed summary
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'results-summary';
        summaryContainer.innerHTML = `
            <h3>Your Ayurvedic Constitution Analysis</h3>
            <div class="summary-content">
                <p>Based on your responses, your dosha constitution is:</p>
                <ul class="dosha-percentages">
                    <li>Vata: ${percentages.vata}%</li>
                    <li>Pitta: ${percentages.pitta}%</li>
                    <li>Kapha: ${percentages.kapha}%</li>
                </ul>
                <div class="primary-dosha">
                    <h4>Primary Dosha: ${getPrimaryDosha(percentages)}</h4>
                    <p>${getDoshaDescription(percentages)}</p>
                </div>
                <div class="recommendations">
                    <h4>Recommendations for Balance:</h4>
                    <ul>
                        ${getRecommendations(percentages)}
                    </ul>
                </div>
            </div>
        `;
        
        // Insert summary before the chart
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.parentNode.insertBefore(summaryContainer, chartContainer);
        }
        
        // Set focus to the results title first
        const resultsTitle = document.getElementById('results-title');
        if (resultsTitle) {
            resultsTitle.setAttribute('tabindex', '-1');
            resultsTitle.focus();
        }
        
        // Then set focus to the chart after a short delay
        setTimeout(() => {
            const chartElement = document.getElementById('dosha-chart');
            if (chartElement) {
                chartElement.setAttribute('tabindex', '0');
                chartElement.focus();
            }
        }, 500);
        
        resultsScreen.classList.add('fade-in');
    } catch (error) {
        console.error('Error showing results:', error);
    }
}

// Helper function to get primary dosha
function getPrimaryDosha(percentages) {
    const maxPercentage = Math.max(percentages.vata, percentages.pitta, percentages.kapha);
    if (maxPercentage === percentages.vata) return 'Vata';
    if (maxPercentage === percentages.pitta) return 'Pitta';
    return 'Kapha';
}

// Helper function to get dosha description
function getDoshaDescription(percentages) {
    const primary = getPrimaryDosha(percentages);
    const descriptions = {
        Vata: 'You have a predominantly Vata constitution, characterized by creativity, enthusiasm, and a quick mind. You may need to focus on grounding and routine to maintain balance.',
        Pitta: 'You have a predominantly Pitta constitution, characterized by intelligence, focus, and a strong drive. You may need to focus on cooling and relaxation to maintain balance.',
        Kapha: 'You have a predominantly Kapha constitution, characterized by stability, strength, and a calm nature. You may need to focus on stimulation and movement to maintain balance.'
    };
    return descriptions[primary];
}

// Helper function to get recommendations
function getRecommendations(percentages) {
    const recommendations = [];
    
    // Vata recommendations
    if (percentages.vata > 40) {
        recommendations.push(`
            <li>Establish a regular daily routine</li>
            <li>Practice grounding activities like yoga or meditation</li>
            <li>Keep warm and maintain a stable environment</li>
            <li>Focus on warm, nourishing foods</li>
        `);
    }
    
    // Pitta recommendations
    if (percentages.pitta > 40) {
        recommendations.push(`
            <li>Engage in cooling activities and environments</li>
            <li>Practice moderation in all activities</li>
            <li>Include cooling foods in your diet</li>
            <li>Take time for relaxation and leisure</li>
        `);
    }
    
    // Kapha recommendations
    if (percentages.kapha > 40) {
        recommendations.push(`
            <li>Stay active and maintain regular exercise</li>
            <li>Try new activities and experiences</li>
            <li>Include stimulating foods in your diet</li>
            <li>Keep your environment warm and dry</li>
        `);
    }
    
    return recommendations.join('');
}

// Initialize Chart
function initChart() {
    try {
        const ctx = doshaChart.getContext('2d');
        window.doshaChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Vata', 'Pitta', 'Kapha'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(74, 111, 165, 0.8)',
                        'rgba(255, 107, 107, 0.8)',
                        'rgba(81, 207, 102, 0.8)'
                    ],
                    borderColor: [
                        'rgba(74, 111, 165, 1)',
                        'rgba(255, 107, 107, 1)',
                        'rgba(81, 207, 102, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
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
                    },
                    datalabels: {
                        formatter: (value) => {
                            return value + '%';
                        },
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

// Update Chart
function updateChart(percentages) {
    try {
        if (window.doshaChart) {
            window.doshaChart.data.datasets[0].data = [
                percentages.vata,
                percentages.pitta,
                percentages.kapha
            ];
            window.doshaChart.update();
        }
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// Restart Quiz
function restartQuiz() {
    try {
        // Reset all quiz state
        currentCategory = 'physical';
        currentQuestion = 0;
        scores = { vata: 0, pitta: 0, kapha: 0 };
        selectedOptions = { physical: [], emotional: [], mental: [] };
        
        // Hide results screen and show welcome screen
        resultsScreen.classList.remove('active');
        resultsScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.classList.add('active');
        questionScreen.classList.remove('active');
        questionScreen.classList.add('hidden');
        
        // Reset chart
        if (window.doshaChart) {
            window.doshaChart.data.datasets[0].data = [0, 0, 0];
            window.doshaChart.update();
        }
        
        // Reset progress bar
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Reset progress labels
        if (progressLabels) {
            progressLabels.forEach((label, index) => {
                if (index === 0) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
        
        // Reset next section button
        if (nextSectionBtn) {
            nextSectionBtn.disabled = true;
            nextSectionBtn.textContent = 'Next Section';
            nextSectionBtn.innerHTML = 'Next Section <i class="fas fa-arrow-right" aria-hidden="true"></i>';
        }
        
        // Focus on start quiz button
        startQuizBtn.focus();
    } catch (error) {
        console.error('Error restarting quiz:', error);
    }
}

// Print Results
function printResults() {
    try {
        window.print();
    } catch (error) {
        console.error('Error printing results:', error);
    }
}

// Add Hover Effects
function addHoverEffects() {
    try {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.classList.add('hover');
            });
            option.addEventListener('mouseleave', () => {
                option.classList.remove('hover');
            });
        });
    } catch (error) {
        console.error('Error adding hover effects:', error);
    }
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    alert('An error occurred. Please try again later.');
});

// Initialize
document.addEventListener('DOMContentLoaded', initQuiz);

// Initialize AdSense
function initializeAds() {
    // Only initialize ads if they haven't been initialized before
    if (!window.adsInitialized) {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'complete') {
            (adsbygoogle = window.adsbygoogle || []).push({});
            window.adsInitialized = true;
        } else {
            window.addEventListener('load', function() {
                (adsbygoogle = window.adsbygoogle || []).push({});
                window.adsInitialized = true;
            });
        }
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAds();
}); 