// Binary glitch trail effect
const binaryChars = ['0', '1'];
function randomBinary(length = 8) {
    let str = '';
    for (let i = 0; i < length; i++) {
        str += binaryChars[Math.floor(Math.random() * binaryChars.length)];
    }
    return str;
}

// Binary Background Animation
function createBinaryBackground() {
    const binaryBg = document.createElement('div');
    binaryBg.className = 'binary-bg';
    document.body.appendChild(binaryBg);

    function createBinaryColumn() {
        const column = document.createElement('div');
        column.className = 'binary-code';
        column.textContent = randomBinary(Math.floor(Math.random() * 50) + 30);
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDelay = Math.random() * 10 + 's';
        column.style.animationDuration = (Math.random() * 5 + 8) + 's';
        binaryBg.appendChild(column);

        setTimeout(() => {
            if (column.parentNode) {
                column.remove();
            }
        }, 15000);
    }

    // Create initial columns
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBinaryColumn(), i * 500);
    }

    // Continue creating columns
    setInterval(createBinaryColumn, 1000);
}

// Initialize background animation when page loads
window.addEventListener('DOMContentLoaded', createBinaryBackground);

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    themeIcon.textContent = isLightMode ? '☀️' : '🌙';
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Ambient Music Functionality
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.querySelector('.music-icon');
let ambientAudio = null;
let isPlaying = false;

function createAmbientAudio() {
    // Create a simple ambient tone using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillators for ambient sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    
    // Create gain nodes for volume control
    const gainNode1 = audioContext.createGain();
    const gainNode2 = audioContext.createGain();
    const gainNode3 = audioContext.createGain();
    const masterGain = audioContext.createGain();
    
    // Set frequencies for a cyberpunk ambient sound
    oscillator1.frequency.setValueAtTime(55, audioContext.currentTime); // Low bass
    oscillator2.frequency.setValueAtTime(110, audioContext.currentTime); // Sub bass
    oscillator3.frequency.setValueAtTime(220, audioContext.currentTime); // Mid tone
    
    // Set oscillator types
    oscillator1.type = 'sine';
    oscillator2.type = 'triangle';
    oscillator3.type = 'sawtooth';
    
    // Set volumes (very low for ambient effect)
    gainNode1.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode2.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode3.gain.setValueAtTime(0.02, audioContext.currentTime);
    masterGain.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    // Connect nodes
    oscillator1.connect(gainNode1);
    oscillator2.connect(gainNode2);
    oscillator3.connect(gainNode3);
    
    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    gainNode3.connect(masterGain);
    
    masterGain.connect(audioContext.destination);
    
    // Add subtle frequency modulation for more interesting sound
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    
    lfo.frequency.setValueAtTime(0.1, audioContext.currentTime);
    lfo.type = 'sine';
    lfoGain.gain.setValueAtTime(5, audioContext.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator3.frequency);
    
    return {
        start: () => {
            oscillator1.start();
            oscillator2.start();
            oscillator3.start();
            lfo.start();
        },
        stop: () => {
            oscillator1.stop();
            oscillator2.stop();
            oscillator3.stop();
            lfo.stop();
        },
        context: audioContext
    };
}

function toggleMusic() {
    if (!isPlaying) {
        try {
            ambientAudio = createAmbientAudio();
            ambientAudio.start();
            isPlaying = true;
            musicIcon.textContent = '🔇';
            musicToggle.classList.add('playing');
            musicToggle.title = 'Stop Ambient Music';
        } catch (error) {
            console.log('Could not start ambient audio:', error);
        }
    } else {
        if (ambientAudio) {
            ambientAudio.stop();
            ambientAudio.context.close();
            ambientAudio = null;
        }
        isPlaying = false;
        musicIcon.textContent = '🎵';
        musicToggle.classList.remove('playing');
        musicToggle.title = 'Play Ambient Music';
    }
}

if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}

document.addEventListener('mousemove', function(e) {
    const trail = document.createElement('div');
    trail.className = 'binary-trail';
    trail.textContent = randomBinary(Math.floor(Math.random() * 6) + 4);
    trail.style.left = `${e.clientX + Math.random() * 12 - 6}px`;
    trail.style.top = `${e.clientY + Math.random() * 12 - 6}px`;
    document.body.appendChild(trail);
    setTimeout(() => {
        trail.remove();
    }, 1200);
});

// Fix text glitches by removing unwanted filters and ensuring font consistency
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cyber-title, .stat-value, .featured-articles h2, .common-questions h2').forEach(el => {
        el.style.filter = 'none';
        el.style.fontFamily = "'Share Tech Mono', 'Segoe UI', monospace";
    });
});

// AI Search and Voice Response
const searchBtn = document.getElementById('search-btn');
const aiSearch = document.getElementById('ai-search');
const aiResponse = document.getElementById('ai-response');

function formatAIResponse(text) {
    // Clean up markdown-style formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
        .replace(/\n\n/g, '</p><p>') // Paragraphs
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/^/, '<p>') // Start with paragraph
        .replace(/$/, '</p>') // End with paragraph
        .replace(/<p><\/p>/g, '') // Remove empty paragraphs
        .replace(/\`(.*?)\`/g, '<code>$1</code>'); // Inline code
}

async function fetchAIResponse(question) {
    // Google Gemini API
    const apiKey = 'AIzaSyAKs_ZNxFN9RULaf7QnWiD05-7BHxf-vUQ';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const body = {
        contents: [
            {
                parts: [
                    {
                        text: question
                    }
                ]
            }
        ]
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return formatAIResponse(data.candidates[0].content.parts[0].text);
        } else {
            return 'Sorry, I could not find an answer.';
        }
    } catch (err) {
        return 'Error connecting to AI service.';
    }
}

if (searchBtn && aiSearch && aiResponse) {
    searchBtn.addEventListener('click', async () => {
        const question = aiSearch.value.trim();
        if (!question) return;
        
        // Show response bubble and add loading text
        aiResponse.innerHTML = '<p>Thinking...</p>';
        aiResponse.classList.add('show');
        
        const answer = await fetchAIResponse(question);
        aiResponse.innerHTML = answer;
    });
    
    aiSearch.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Hide response when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            aiResponse.classList.remove('show');
        }
    });
}
