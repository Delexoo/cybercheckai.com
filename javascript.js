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
        const length = Math.floor(Math.random() * 7) + 1; // Random length between 1-7 characters
        column.textContent = randomBinary(length);
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDelay = Math.random() * 2 + 's';
        column.style.animationDuration = (Math.random() * 5 + 8) + 's';
        binaryBg.appendChild(column);

        // Update binary numbers randomly and fast
        const updateInterval = setInterval(() => {
            if (column.parentNode) {
                column.textContent = randomBinary(length);
            } else {
                clearInterval(updateInterval);
            }
        }, 100); // Update every 100ms for fast random changes

        setTimeout(() => {
            clearInterval(updateInterval);
            if (column.parentNode) {
                column.remove();
            }
        }, 15000);
    }

    // Create initial columns immediately and faster - more columns
    for (let i = 0; i < 40; i++) {
        setTimeout(() => createBinaryColumn(), i * 50); // More columns, faster creation
    }

    // Continue creating columns more frequently
    setInterval(createBinaryColumn, 300); // Create new columns every 300ms
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

// Binary trail with throttling to prevent glitching
let binaryTrails = [];
let lastTrailTime = 0;
const TRAIL_THROTTLE = 50; // Create trail every 50ms max
const MAX_BINARY_TRAILS = 30;

document.addEventListener('mousemove', function(e) {
    const now = Date.now();
    
    // Throttle trail creation
    if (now - lastTrailTime < TRAIL_THROTTLE) {
        return;
    }
    lastTrailTime = now;
    
    // Limit number of trails
    if (binaryTrails.length >= MAX_BINARY_TRAILS) {
        const oldTrail = binaryTrails.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.remove();
        }
    }
    
    const trail = document.createElement('div');
    trail.className = 'binary-trail';
    trail.textContent = randomBinary(Math.floor(Math.random() * 7) + 1); // Max 7 characters
    trail.style.left = `${e.clientX + Math.random() * 12 - 6}px`;
    trail.style.top = `${e.clientY + Math.random() * 12 - 6}px`;
    document.body.appendChild(trail);
    binaryTrails.push(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
        const index = binaryTrails.indexOf(trail);
        if (index > -1) {
            binaryTrails.splice(index, 1);
        }
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
    if (!text) return '';
    
    let formatted = text;
    
    // Handle code blocks first (before other formatting)
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle headers
    formatted = formatted.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Handle bold text (must come before italic to avoid conflicts)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Handle italic text (only if not already bold)
    formatted = formatted.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    formatted = formatted.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>');
    
    // Handle unordered lists (bullet points) - process line by line
    const lines = formatted.split('\n');
    let inList = false;
    let listItems = [];
    let processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const bulletMatch = line.match(/^[\*\-\+]\s+(.+)$/);
        const numberMatch = line.match(/^\d+\.\s+(.+)$/);
        
        if (bulletMatch || numberMatch) {
            if (!inList) {
                inList = true;
                listItems = [];
            }
            listItems.push(bulletMatch ? bulletMatch[1] : numberMatch[1]);
        } else {
            if (inList) {
                // Close the list
                processedLines.push('<ul>' + listItems.map(item => '<li>' + item + '</li>').join('') + '</ul>');
                listItems = [];
                inList = false;
            }
            processedLines.push(line);
        }
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
        processedLines.push('<ul>' + listItems.map(item => '<li>' + item + '</li>').join('') + '</ul>');
    }
    
    formatted = processedLines.join('\n');
    
    // Handle line breaks and paragraphs
    // Split by double newlines for paragraphs
    let paragraphs = formatted.split(/\n\n+/);
    formatted = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';
        
        // If it's already a header, list, or code block, don't wrap in <p>
        if (para.match(/^<(h[1-6]|ul|ol|pre|code)/)) {
            return para;
        }
        
        // Convert single newlines to <br> within paragraphs
        para = para.replace(/\n/g, '<br>');
        
        // Wrap in paragraph tag
        return '<p>' + para + '</p>';
    }).filter(p => p).join('\n');
    
    // Clean up empty tags
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');
    formatted = formatted.replace(/<ul>\s*<\/ul>/g, '');
    formatted = formatted.replace(/<li>\s*<\/li>/g, '');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
}

let currentTypingInterval = null;

function typeText(element, htmlText, speed = 15) {
    // Clear any existing typing animation
    if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
        currentTypingInterval = null;
    }
    
    element.innerHTML = '';
    element.style.display = 'block';
    
    let htmlIndex = 0;
    let result = '';
    let inTag = false;
    let tagBuffer = '';
    
    const processNext = () => {
        if (htmlIndex >= htmlText.length) {
            clearInterval(currentTypingInterval);
            currentTypingInterval = null;
            // Ensure final HTML is complete
            element.innerHTML = htmlText;
            return;
        }
        
        const char = htmlText[htmlIndex];
        
        if (char === '<') {
            inTag = true;
            tagBuffer = '<';
            htmlIndex++;
            // Process tag immediately
            while (htmlIndex < htmlText.length && htmlText[htmlIndex] !== '>') {
                tagBuffer += htmlText[htmlIndex];
                htmlIndex++;
            }
            if (htmlIndex < htmlText.length) {
                tagBuffer += '>';
                htmlIndex++;
                result += tagBuffer;
                tagBuffer = '';
                inTag = false;
                element.innerHTML = result;
            }
        } else {
            // Regular text character
            result += char;
            htmlIndex++;
            element.innerHTML = result;
        }
    };
    
    // Start typing
    currentTypingInterval = setInterval(processNext, speed);
    
    return currentTypingInterval;
}

async function fetchAIResponse(question) {
    // Google Gemini API
    const apiKey = 'AIzaSyDhFyw86NwvjF8HTaM0XQvaqHYFSBNjWks';
    
    // Check if API key is valid
    if (!apiKey || apiKey.trim() === '') {
        return 'Please configure your Google Gemini API key. Get one from https://aistudio.google.com/apikey';
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('API Error:', res.status, errorData);
            
            // Provide helpful error messages
            if (res.status === 400 && errorData.error?.message?.includes('API key')) {
                return 'Invalid API key. Please check that you have:\n1. Replaced "YOUR_API_KEY_HERE" with your actual API key\n2. Got your key from https://aistudio.google.com/apikey\n3. Enabled the Gemini API in Google Cloud Console';
            }
            
            return `Error: ${res.status} - ${errorData.error?.message || 'Failed to get response'}`;
        }
        
        const data = await res.json();
        console.log('API Response:', data);
        
        // Check for response in different possible structures
        if (data.candidates && data.candidates[0]) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                const text = candidate.content.parts[0].text;
                if (text) {
                    return formatAIResponse(text);
                }
            }
        }
        
        // If we get here, the response structure is unexpected
        console.error('Unexpected response structure:', data);
        return 'Sorry, I could not find an answer. The response format was unexpected.';
    } catch (err) {
        console.error('Fetch error:', err);
        return `Error connecting to AI service: ${err.message}`;
    }
}

if (searchBtn && aiSearch && aiResponse) {
    const hero = document.querySelector('.hero');
    const searchContainer = document.querySelector('.search-container');
    const escProgress = document.getElementById('esc-progress');
    const progressFill = document.querySelector('.progress-circle-fill');
    let escHoldTimer = null;
    let isEscHeld = false;
    let progressInterval = null;
    const HOLD_DURATION = 1000; // 1 second
    const CIRCUMFERENCE = 283; // 2 * PI * 45 (radius)
    
    // Animation state management
    let searchBarAnimationInProgress = false;
    let searchBarResetTimeout = null;
    let searchBarMoveTimeout = null;
    
    function resetSearchBarPosition() {
        // Prevent multiple simultaneous animations
        if (searchBarAnimationInProgress) {
            return;
        }
        
        // Clear any pending animations
        if (searchBarMoveTimeout) {
            clearTimeout(searchBarMoveTimeout);
            searchBarMoveTimeout = null;
        }
        
        if (searchContainer && hero.classList.contains('search-active')) {
            searchBarAnimationInProgress = true;
            
            // Get the original position (below subtitle)
            const subtitle = document.querySelector('.subtitle');
            if (subtitle) {
                // First, contract the width
                searchContainer.style.transition = 'max-width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                searchContainer.style.maxWidth = '600px';
                searchContainer.style.width = '';
                
                // After width contracts, move back up
                setTimeout(() => {
                    // Get current visual position
                    const currentRect = searchContainer.getBoundingClientRect();
                    const currentTop = currentRect.top;
                    const currentLeft = currentRect.left + (currentRect.width / 2);
                    
                    // Ensure we're fixed at current position (no transition)
                    searchContainer.style.transition = 'none';
                    searchContainer.style.position = 'fixed';
                    searchContainer.style.top = currentTop + 'px';
                    searchContainer.style.left = currentLeft + 'px';
                    searchContainer.style.transform = 'translateX(-50%)';
                    void searchContainer.offsetHeight; // Force reflow
                    
                    // Calculate target position
                    const subtitleRect = subtitle.getBoundingClientRect();
                    const targetViewportTop = subtitleRect.bottom + 48; // 3rem = 48px
                    
                    // Scroll to subtitle area smoothly
                    const scrollY = window.scrollY || window.pageYOffset;
                    const targetScroll = Math.max(0, subtitleRect.top + scrollY - window.innerHeight / 3);
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                    
                    // Animate search bar to target position
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            // Re-enable transition
                            searchContainer.style.transition = 'top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            searchContainer.style.top = targetViewportTop + 'px';
                            
                            // After animation completes, transition to relative without jump
                            searchBarResetTimeout = setTimeout(() => {
                                if (searchContainer && subtitle) {
                                    // Get current visual position while still fixed
                                    const finalRect = searchContainer.getBoundingClientRect();
                                    const finalScrollY = window.scrollY || window.pageYOffset;
                                    const visualTop = finalRect.top;
                                    const visualLeft = finalRect.left;
                                    
                                    // Calculate where subtitle is now
                                    const finalSubtitleRect = subtitle.getBoundingClientRect();
                                    const subtitleBottomInDocument = finalSubtitleRect.bottom + finalScrollY;
                                    
                                    // Calculate the exact position where search bar should be in document flow
                                    const targetDocumentTop = subtitleBottomInDocument + 48;
                                    
                                    // Calculate required scroll to align visual position with document position
                                    // We want the element at visualTop to be at targetDocumentTop in the document
                                    const requiredScroll = targetDocumentTop - visualTop;
                                    
                                    // Temporarily disable all transitions
                                    searchContainer.style.transition = 'none';
                                    
                                    // Scroll to exact position (instant, no animation)
                                    window.scrollTo({
                                        top: requiredScroll,
                                        behavior: 'auto'
                                    });
                                    
                                    // Wait for browser to process scroll
                                    requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                            // Verify positions are aligned
                                            const checkRect = searchContainer.getBoundingClientRect();
                                            const checkSubtitleRect = subtitle.getBoundingClientRect();
                                            const expectedTop = checkSubtitleRect.bottom + 48;
                                            const currentTop = checkRect.top;
                                            
                                            // Fine-tune scroll if needed
                                            if (Math.abs(currentTop - expectedTop) > 2) {
                                                const currentScroll = window.scrollY || window.pageYOffset;
                                                const adjustScroll = currentScroll + (currentTop - expectedTop);
                                                window.scrollTo({
                                                    top: adjustScroll,
                                                    behavior: 'auto'
                                                });
                                            }
                                            
                                            // Wait one more frame for final scroll adjustment
                                            requestAnimationFrame(() => {
                                                // Remove search-active class to prevent CSS conflicts
                                                hero.classList.remove('search-active');
                                                document.body.classList.remove('search-active');
                                                
                                                // Wait for class removal to take effect
                                                requestAnimationFrame(() => {
                                                    // Now switch to relative - positions should be perfectly aligned
                                                    searchContainer.style.position = 'relative';
                                                    searchContainer.style.top = '';
                                                    searchContainer.style.left = '';
                                                    searchContainer.style.transform = '';
                                                    searchContainer.style.margin = '3rem auto 0';
                                                    searchContainer.style.width = '';
                                                    searchContainer.style.maxWidth = '';
                                                    searchContainer.style.transition = '';
                                                    
                                                    // Force reflow to ensure styles are applied
                                                    void searchContainer.offsetHeight;
                                                    
                                                    searchBarAnimationInProgress = false;
                                                    searchBarResetTimeout = null;
                                                });
                                            });
                                        });
                                    });
                                } else {
                                    hero.classList.remove('search-active');
                                    document.body.classList.remove('search-active');
                                    searchBarAnimationInProgress = false;
                                    searchBarResetTimeout = null;
                                }
                            }, 2000);
                        });
                    });
                }, 800);
            } else {
                searchBarAnimationInProgress = false;
            }
        }
    }
    
    function resetToMainScreen() {
        // Clear all intervals and timeouts
        if (currentTypingInterval) {
            clearInterval(currentTypingInterval);
            currentTypingInterval = null;
        }
        if (searchBarResetTimeout) {
            clearTimeout(searchBarResetTimeout);
            searchBarResetTimeout = null;
        }
        if (searchBarMoveTimeout) {
            clearTimeout(searchBarMoveTimeout);
            searchBarMoveTimeout = null;
        }
        
        // Reset animation state
        searchBarAnimationInProgress = false;
        
        aiSearch.value = '';
        aiResponse.innerHTML = '';
        
        // Clear question suggestions state
        if (questionSuggestions) {
            questionSuggestions.classList.remove('has-response');
        }
        if (questionInterval) {
            clearInterval(questionInterval);
            questionInterval = null;
        }
        if (questionTypingInterval) {
            clearInterval(questionTypingInterval);
            questionTypingInterval = null;
        }
        isDeleting = false;
        
        resetSearchBarPosition();
        hero.classList.remove('search-active');
        document.body.classList.remove('search-active');
        hideProgress();
    }
    
    function showProgress() {
        if (escProgress) {
            escProgress.classList.add('show');
        }
    }
    
    function hideProgress() {
        if (escProgress) {
            escProgress.classList.remove('show');
        }
        if (progressFill) {
            progressFill.style.strokeDashoffset = CIRCUMFERENCE;
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    function updateProgress(elapsed) {
        const progress = Math.min(elapsed / HOLD_DURATION, 1);
        const offset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);
        if (progressFill) {
            progressFill.style.strokeDashoffset = offset;
        }
    }
    
    function updateSearchState() {
        // Only add search-active class, never remove it automatically
        // User must hold ESC to go back to original state
        if (!hero.classList.contains('search-active')) {
            const hasContent = aiSearch.value.trim().length > 0 || aiResponse.innerHTML.trim().length > 0;
            if (hasContent) {
                hero.classList.add('search-active');
                document.body.classList.add('search-active');
            }
        }
        // Once search-active is set, it stays until ESC is held
    }
    
    // ESC key hold functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !isEscHeld && document.body.classList.contains('search-active')) {
            isEscHeld = true;
            const startTime = Date.now();
            showProgress();
            
            // Update progress every 10ms
            progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                updateProgress(elapsed);
                
                if (elapsed >= HOLD_DURATION) {
                    clearInterval(progressInterval);
                    progressInterval = null;
                }
            }, 10);
            
            escHoldTimer = setTimeout(() => {
                resetToMainScreen();
                isEscHeld = false;
            }, HOLD_DURATION);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            if (escHoldTimer) {
                clearTimeout(escHoldTimer);
                escHoldTimer = null;
            }
            isEscHeld = false;
            hideProgress();
        }
    });
    
    // Question suggestions functionality
    const questionSuggestions = document.getElementById('question-suggestions');
    const suggestionText = document.querySelector('.suggestion-text');
    const questions = [
        "What is the most common cyber attack?",
        "How do I know if my device is infected?",
        "How can I protect my passwords?",
        "What is phishing and how can I avoid it?",
        "How do I stay safe on public Wi-Fi?",
        "What is two-factor authentication?",
        "How can I detect a phishing email?",
        "What should I do if I'm hacked?",
        "How do I create a strong password?",
        "What is ransomware and how does it work?"
    ];
    
    let questionIndex = 0;
    let questionInterval = null;
    
    function updateQuestionSuggestions() {
        const hasResponse = aiResponse.innerHTML.trim().length > 0;
        const isTyping = aiSearch.value.trim().length > 0;
        
        // Stop all question animations immediately if response exists
        if (hasResponse) {
            if (questionInterval) {
                clearInterval(questionInterval);
                questionInterval = null;
            }
            if (questionTypingInterval) {
                clearInterval(questionTypingInterval);
                questionTypingInterval = null;
            }
            isDeleting = false;
            if (questionSuggestions) {
                questionSuggestions.classList.add('has-response');
                // Clear the text content to stop any visible text
                if (suggestionText) {
                    suggestionText.textContent = '';
                }
            }
            return; // Exit early when response exists
        }
        
        if (isTyping && !hasResponse && questionSuggestions) {
            // Show questions only when typing and no response
            questionSuggestions.classList.remove('has-response');
            if (!questionInterval) {
                // Start showing questions (they will cycle automatically after typing/deleting)
                showNextQuestion();
                // No need for interval since questions cycle automatically after delete
                questionInterval = setInterval(() => {
                    // This is just a fallback, but showNextQuestion handles the cycle
                }, 10000);
            }
        } else {
            // Hide questions when not typing
            if (questionInterval) {
                clearInterval(questionInterval);
                questionInterval = null;
            }
            if (questionTypingInterval) {
                clearInterval(questionTypingInterval);
                questionTypingInterval = null;
            }
            isDeleting = false;
            if (questionSuggestions) {
                questionSuggestions.classList.add('has-response');
                if (suggestionText) {
                    suggestionText.textContent = '';
                }
            }
        }
    }
    
    let questionTypingInterval = null;
    let isDeleting = false;
    
    function typeQuestion(text, element, speed = 30) {
        // Clear any existing typing animation
        if (questionTypingInterval) {
            clearInterval(questionTypingInterval);
            questionTypingInterval = null;
        }
        
        element.textContent = '';
        let charIndex = 0;
        
        const typeChar = () => {
            if (charIndex < text.length) {
                element.textContent += text[charIndex];
                charIndex++;
            } else {
                clearInterval(questionTypingInterval);
                questionTypingInterval = null;
                // After typing is complete, wait a bit then start deleting
                setTimeout(() => {
                    deleteQuestion(element, speed);
                }, 2500); // Wait 2.5 seconds before deleting (1 second longer)
            }
        };
        
        questionTypingInterval = setInterval(typeChar, speed);
        return questionTypingInterval;
    }
    
    function deleteQuestion(element, speed = 20) {
        if (questionTypingInterval) {
            clearInterval(questionTypingInterval);
            questionTypingInterval = null;
        }
        
        isDeleting = true;
        let text = element.textContent;
        
        const deleteChar = () => {
            if (text.length > 0) {
                text = text.slice(0, -1);
                element.textContent = text;
            } else {
                clearInterval(questionTypingInterval);
                questionTypingInterval = null;
                isDeleting = false;
                // After deleting is complete, move to next question
                showNextQuestion();
            }
        };
        
        questionTypingInterval = setInterval(deleteChar, speed);
        return questionTypingInterval;
    }
    
    function showNextQuestion() {
        if (suggestionText && !isDeleting) {
            // Clear any existing typing
            if (questionTypingInterval) {
                clearInterval(questionTypingInterval);
                questionTypingInterval = null;
            }
            
            // Get next question
            const nextQuestion = questions[questionIndex];
            questionIndex = (questionIndex + 1) % questions.length;
            
            // Type out the next question
            typeQuestion(nextQuestion, suggestionText, 30);
        }
    }
    
    // Smoothly transition search bar to bottom
    function moveSearchBarToBottom() {
        // Prevent multiple simultaneous animations
        if (searchBarAnimationInProgress) {
            return;
        }
        
        // Clear any pending reset animations
        if (searchBarResetTimeout) {
            clearTimeout(searchBarResetTimeout);
            searchBarResetTimeout = null;
        }
        
        if (searchContainer && !hero.classList.contains('search-active')) {
            searchBarAnimationInProgress = true;
            
            // Get current position
            const rect = searchContainer.getBoundingClientRect();
            const currentTop = rect.top;
            const currentLeft = rect.left + (rect.width / 2);
            const viewportHeight = window.innerHeight;
            const targetBottom = 32; // 2rem = 32px
            const targetTop = viewportHeight - targetBottom - rect.height;
            
            // Disable transition temporarily
            searchContainer.style.transition = 'none';
            
            // Set to fixed at current visual position
            searchContainer.style.position = 'fixed';
            searchContainer.style.top = currentTop + 'px';
            searchContainer.style.left = currentLeft + 'px';
            searchContainer.style.transform = 'translateX(-50%)';
            searchContainer.style.margin = '0';
            searchContainer.style.width = rect.width + 'px';
            searchContainer.style.bottom = '';
            
            // Force reflow to apply the fixed position
            void searchContainer.offsetHeight;
            
            // Re-enable transition and animate to target position
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (searchContainer && !hero.classList.contains('search-active')) {
                        searchContainer.style.transition = 'top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), max-width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        
                        // Animate to target position
                        searchContainer.style.top = targetTop + 'px';
                        searchContainer.style.width = '';
                        
                        // Add class to trigger CSS for other properties
                        hero.classList.add('search-active');
                        document.body.classList.add('search-active');
                        
                        // Mark animation as complete after transition
                        searchBarMoveTimeout = setTimeout(() => {
                            searchBarAnimationInProgress = false;
                            searchBarMoveTimeout = null;
                        }, 2000);
                    }
                });
            });
        } else {
            hero.classList.add('search-active');
            document.body.classList.add('search-active');
        }
    }
    
    // Add search-active class when user types
    let inputTimeout = null;
    aiSearch.addEventListener('input', () => {
        // Clear any pending input handling
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }
        
        // Debounce to prevent rapid fire calls
        inputTimeout = setTimeout(() => {
            if (aiSearch.value.trim().length > 0) {
                if (!hero.classList.contains('search-active')) {
                    moveSearchBarToBottom();
                }
                updateQuestionSuggestions();
            } else {
                // When input is cleared, keep search active - user must hold ESC to reset
                // Ensure search-active class remains and search bar stays at bottom
                if (!hero.classList.contains('search-active')) {
                    hero.classList.add('search-active');
                    document.body.classList.add('search-active');
                    // If search bar isn't at bottom yet, move it there
                    if (searchContainer) {
                        const rect = searchContainer.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const targetBottom = 32; // 2rem = 32px
                        const targetTop = viewportHeight - targetBottom - rect.height;
                        
                        searchContainer.style.position = 'fixed';
                        searchContainer.style.top = targetTop + 'px';
                        searchContainer.style.left = '50%';
                        searchContainer.style.transform = 'translateX(-50%)';
                    }
                } else {
                    // Ensure search bar stays at bottom with proper centering
                    if (searchContainer) {
                        searchContainer.style.left = '50%';
                        searchContainer.style.transform = 'translateX(-50%)';
                        // Ensure it's fixed at bottom
                        const rect = searchContainer.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const targetBottom = 32;
                        const targetTop = viewportHeight - targetBottom - rect.height;
                        if (searchContainer.style.position !== 'fixed' || Math.abs(parseFloat(searchContainer.style.top) - targetTop) > 10) {
                            searchContainer.style.position = 'fixed';
                            searchContainer.style.top = targetTop + 'px';
                        }
                    }
                }
                // Only update question suggestions, don't reset state
                updateQuestionSuggestions();
            }
            inputTimeout = null;
        }, 50);
    });
    
        searchBtn.addEventListener('click', async () => {
        const question = aiSearch.value.trim();
        if (!question) {
            if (currentTypingInterval) {
                clearInterval(currentTypingInterval);
                currentTypingInterval = null;
            }
            aiResponse.innerHTML = '';
            // Don't call updateSearchState - keep search-active class
            // User must hold ESC to reset
            updateQuestionSuggestions();
            return;
        }
        
        // Activate search mode with smooth transition
        moveSearchBarToBottom();
        
        // Step 1: Stop all question animations immediately
        if (questionInterval) {
            clearInterval(questionInterval);
            questionInterval = null;
        }
        if (questionTypingInterval) {
            clearInterval(questionTypingInterval);
            questionTypingInterval = null;
        }
        isDeleting = false;
        
        // Step 2: Fade out questions first (they will fade out over 0.3s)
        if (questionSuggestions) {
            questionSuggestions.classList.add('has-response');
            if (suggestionText) {
                suggestionText.textContent = '';
            }
        }
        
        // Step 3: Wait for questions to fade out, then show AI response
        setTimeout(async () => {
            // Show loading text after questions have faded
            aiResponse.innerHTML = '<p>Thinking...</p>';
            // Let CSS handle display based on :not(:empty) selector
            updateQuestionSuggestions();
            
            // Fetch and display response
            const answer = await fetchAIResponse(question);
            
            // Use typing animation
            typeText(aiResponse, answer, 15);
            updateQuestionSuggestions();
        }, 350); // Wait 350ms for fade-out transition (0.3s + small buffer)
    });
    
    aiSearch.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}
