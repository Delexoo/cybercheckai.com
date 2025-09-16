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
            return data.candidates[0].content.parts[0].text;
        } else {
            return 'Sorry, I could not find an answer.';
        }
    } catch (err) {
        return 'Error connecting to AI service.';
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
    }
}

if (searchBtn && aiSearch && aiResponse) {
    searchBtn.addEventListener('click', async () => {
        const question = aiSearch.value.trim();
        if (!question) return;
        
        // Show response bubble and add loading text
        aiResponse.textContent = 'Thinking...';
        aiResponse.classList.add('show');
        
        const answer = await fetchAIResponse(question);
        aiResponse.textContent = answer;
        speak(answer);
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
