const textDisplay = document.getElementById('text-display');
const wpmDisplay = document.getElementById('wpm');
const errorsDisplay = document.getElementById('errors');

const wordList = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also"
];

let currentText = "";
let characters = [];
let currentIndex = 0;
let errors = 0;
let startTime = null;
let timerInterval = null;
let isStarted = false;

function generateText(wordCount = 20) {
    let words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        words.push(wordList[randomIndex]);
    }
    return words.join(" ");
}

function initGame() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isStarted = false;
    startTime = null;
    errors = 0;

    currentText = generateText();
    textDisplay.innerHTML = "";
    characters = [];
    currentIndex = 0;
    wpmDisplay.innerText = "0";
    errorsDisplay.innerText = "0";

    currentText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.classList.add('char');
        if (index === 0) {
            span.classList.add('active');
        }
        textDisplay.appendChild(span);
        characters.push(span);
    });
}

function updateStats() {
    if (!startTime) return;

    const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
    // WPM calculation: (total typed characters / 5) / time in minutes
    // We calculate based on correct characters typed so far
    const charactersTyped = currentIndex;
    let wpm = 0;

    // Prevent massively inflated WPM during the first few milliseconds
    if (timeElapsed > 0) {
        wpm = Math.round((charactersTyped / 5) / timeElapsed);
    }

    wpmDisplay.innerText = wpm > 0 && wpm !== Infinity ? wpm : 0;
    errorsDisplay.innerText = errors;
}

function handleKeyDown(e) {
    // Ignore meta keys, shift, caps lock, etc.
    if (e.key.length > 1) return;

    // Prevent spacebar from scrolling the page
    if (e.key === ' ') {
        e.preventDefault();
    }

    if (!isStarted) {
        isStarted = true;
        startTime = new Date();
        timerInterval = setInterval(updateStats, 1000);
    }

    const expectedChar = currentText[currentIndex];
    const typedChar = e.key;

    if (typedChar === expectedChar) {
        // Correct key
        characters[currentIndex].classList.remove('active', 'incorrect');
        characters[currentIndex].classList.add('correct');

        currentIndex++;

        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('active');
        } else {
            // Reached end of text, load next
            initGame();
        }
    } else {
        // Incorrect key
        characters[currentIndex].classList.add('incorrect');
        errors++;
        errorsDisplay.innerText = errors; // Update errors immediately without inflating WPM
    }
}

document.addEventListener('keydown', handleKeyDown);

// Initial setup
initGame();
