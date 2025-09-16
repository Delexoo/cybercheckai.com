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

// Mouse Trail Functionality
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.querySelector('.music-icon');
let mouseTrailEnabled = false;
let mouseTrails = [];

function createMouseTrail(e) {
    if (!mouseTrailEnabled) return;
    
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.position = 'fixed';
    trail.style.width = '8px';
    trail.style.height = '8px';
    trail.style.background = 'linear-gradient(45deg, #00ff88, #28a745)';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transition = 'all 0.5s ease-out';
    trail.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.7)';
    
    document.body.appendChild(trail);
    mouseTrails.push(trail);
    
    // Animate trail
    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
    }, 50);
    
    // Remove trail after animation
    setTimeout(() => {
        if (trail.parentNode) {
            document.body.removeChild(trail);
        }
        const index = mouseTrails.indexOf(trail);
        if (index > -1) {
            mouseTrails.splice(index, 1);
        }
    }, 600);
    
    // Limit number of trails
    if (mouseTrails.length > 20) {
        const oldTrail = mouseTrails.shift();
        if (oldTrail.parentNode) {
            document.body.removeChild(oldTrail);
        }
    }
}

function toggleMouseTrail() {
    mouseTrailEnabled = !mouseTrailEnabled;
    
    if (mouseTrailEnabled) {
        musicIcon.textContent = '✨';
        musicToggle.classList.add('playing');
        musicToggle.title = 'Disable Mouse Trail';
        document.addEventListener('mousemove', createMouseTrail);
        localStorage.setItem('mouseTrail', 'enabled');
    } else {
        musicIcon.textContent = '🌟';
        musicToggle.classList.remove('playing');
        musicToggle.title = 'Enable Mouse Trail';
        document.removeEventListener('mousemove', createMouseTrail);
        localStorage.setItem('mouseTrail', 'disabled');
        
        // Clear existing trails
        mouseTrails.forEach(trail => {
            if (trail.parentNode) {
                document.body.removeChild(trail);
            }
        });
        mouseTrails = [];
    }
}

// Load saved mouse trail preference
const savedMouseTrail = localStorage.getItem('mouseTrail');
if (savedMouseTrail === 'enabled') {
    mouseTrailEnabled = true;
    if (musicIcon) musicIcon.textContent = '✨';
    if (musicToggle) {
        musicToggle.classList.add('playing');
        musicToggle.title = 'Disable Mouse Trail';
    }
    document.addEventListener('mousemove', createMouseTrail);
} else {
    if (musicIcon) musicIcon.textContent = '�';
    if (musicToggle) musicToggle.title = 'Enable Mouse Trail';
}

if (musicToggle) {
    musicToggle.addEventListener('click', toggleMouseTrail);
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
