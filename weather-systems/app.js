// --- 1. Bilingual Dictionary ---
const translations = {
    en: {
        title: "High & Low Pressure Simulator",
        toggleBtn: "Cambiar a Español",
        instruction: "Drag the systems onto the map!",
        resetBtn: "Reset Map",
        playBtn: "▶ Forecast",
        day: "Day",
        hLabel: "H",
        lLabel: "L",
        mainIdeasTitle: "Main Ideas (SEEd 6.3.2)",
        mainIdeasList: [
            "Air always moves from areas of High pressure to Low pressure.",
            "Low pressure (L) air rises, cools, and forms clouds and storms.",
            "High pressure (H) air sinks, bringing clear, calm skies."
        ],
        vocabTitle: "Vocabulary",
        vWords: ["High Pressure", "Low Pressure", "Cold Front", "Wind"],
        vDefs: [
            "Heavy, sinking air. Usually means fair weather.",
            "Light, rising air. Usually means cloudy or rainy weather.",
            "The leading edge of a cooler air mass (blue line con spikes).",
            "The movement of air from high to low pressure."
        ]
    },
    es: {
        title: "Simulador de Alta y Baja Presión",
        toggleBtn: "Switch to English",
        instruction: "¡Arrastra los sistemas al mapa!",
        resetBtn: "Reiniciar",
        playBtn: "▶ Pronóstico",
        day: "Día",
        hLabel: "A", 
        lLabel: "B", 
        mainIdeasTitle: "Ideas Principales (SEEd 6.3.2)",
        mainIdeasList: [
            "El aire siempre se mueve de áreas de Alta presión a Baja presión.",
            "El aire de baja presión (B) sube, se enfría y forma nubes y tormentas.",
            "El aire de alta presión (A) baja, trayendo cielos despejados y en calma."
        ],
        vocabTitle: "Vocabulario",
        vWords: ["Alta Presión", "Baja Presión", "Frente Frío", "Viento"],
        vDefs: [
            "Aire pesado que desciende. Usualmente significa buen clima.",
            "Aire ligero que asciende. Usualmente significa clima nublado o lluvioso.",
            "El borde de ataque de una masa de aire más fría (línea azul con picos).",
            "El movimiento del aire de alta a baja presión."
        ]
    }
};

let currentLang = 'en';
const hTokens = [document.getElementById('tokenH1'), document.getElementById('tokenH2'), document.getElementById('tokenH3')];
const lTokens = [document.getElementById('tokenL1'), document.getElementById('tokenL2'), document.getElementById('tokenL3')];
const playBtn = document.getElementById('playBtn');

function updateLanguage() {
    const t = translations[currentLang];
    
    document.getElementById('titleText').innerText = t.title;
    document.getElementById('langToggle').innerText = t.toggleBtn;
    document.getElementById('instructionText').innerText = t.instruction;
    document.getElementById('resetBtn').innerText = t.resetBtn;
    if (!isPlaying) playBtn.innerText = t.playBtn;
    
    hTokens.forEach(token => token.innerText = t.hLabel);
    lTokens.forEach(token => token.innerText = t.lLabel);
    
    document.getElementById('mainIdeasTitle').innerText = t.mainIdeasTitle;
    const listItems = document.getElementById('mainIdeasList').getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].innerText = t.mainIdeasList[i];
    }
    
    document.getElementById('vocabTitle').innerText = t.vocabTitle;
    for (let i = 0; i < 4; i++) {
        document.getElementById(`v${i+1}Word`).innerText = t.vWords[i];
        document.getElementById(`v${i+1}Def`).innerText = t.vDefs[i];
    }
}

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateLanguage();
});

// --- 2. Drag, Drop & Time-lapse Logic ---
const tokens = document.querySelectorAll('.draggable');
let activeToken = null;
let offsetX = 0;
let offsetY = 0;
let isPlaying = false;
let forecastAnimation = null;

function resetPositions() {
    if (forecastAnimation) cancelAnimationFrame(forecastAnimation);
    isPlaying = false;
    playBtn.disabled = false;
    document.getElementById('dayCounter').style.display = 'none';
    updateLanguage(); // Resets play button text

    const mapRectInit = document.getElementById('mapContainer').getBoundingClientRect();
    
    hTokens.forEach((token, index) => {
        token.style.left = `${mapRectInit.left + 50 + (index * 70)}px`;
        token.style.top = `${mapRectInit.bottom + 70}px`; 
    });

    lTokens.forEach((token, index) => {
        token.style.left = `${mapRectInit.left + 400 + (index * 70)}px`;
        token.style.top = `${mapRectInit.bottom + 70}px`;
    });
}

resetPositions();
document.getElementById('resetBtn').addEventListener('click', resetPositions);

// Time-Lapse Logic
playBtn.addEventListener('click', () => {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.disabled = true;
    playBtn.innerText = "⏳...";

    const dayCounter = document.getElementById('dayCounter');
    dayCounter.style.display = 'block';
    
    let startTime = performance.now();
    const duration = 6000; // 6 seconds total (2s per day)

    function animateForecast(currentTime) {
        let elapsed = currentTime - startTime;
        
        if (elapsed > duration) {
            isPlaying = false;
            playBtn.disabled = false;
            updateLanguage();
            dayCounter.style.display = 'none';
            return; // End animation
        }

        // Update Day Counter
        let currentDay = Math.floor((elapsed / (duration / 3))) + 1;
        if (currentDay > 3) currentDay = 3;
        dayCounter.innerText = translations[currentLang].day + " " + currentDay;

        // Move tokens Eastward (Simulating Westerlies)
        const mapRect = document.getElementById('mapContainer').getBoundingClientRect();
        
        [...hTokens, ...lTokens].forEach(token => {
            const rect = token.getBoundingClientRect();
            // Only move tokens that are on the map
            if (rect.top > mapRect.top && rect.bottom < mapRect.bottom) {
                // Prevent them from drifting completely off the right edge
                if (rect.left < mapRect.right - 80) {
                    let currentLeft = parseFloat(token.style.left);
                    token.style.left = (currentLeft + 0.6) + 'px'; // Move right
                }
            }
        });

        forecastAnimation = requestAnimationFrame(animateForecast);
    }
    
    forecastAnimation = requestAnimationFrame(animateForecast);
});

// Drag listeners
tokens.forEach(token => {
    token.addEventListener('mousedown', (e) => {
        if (isPlaying) return; // Disable dragging during forecast
        activeToken = token;
        const rect = token.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        token.style.zIndex = 100;
    });
});

window.addEventListener('mousemove', (e) => {
    if (!activeToken || isPlaying) return;
    activeToken.style.left = `${e.clientX - offsetX}px`;
    activeToken.style.top = `${e.clientY - offsetY}px`;
});

window.addEventListener('mouseup', () => {
    if (activeToken) activeToken.style.zIndex = 10;
    activeToken = null;
});

// --- 3. Graphics Animation Logic ---
const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');
const mapContainer = document.getElementById('mapContainer');
let animationTime = 0;

function drawAnimations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationTime += 0.5;

    const mapRect = mapContainer.getBoundingClientRect();
    const activeHs = [];
    const activeLs = [];

    // Check Highs
    hTokens.forEach(token => {
        const rect = token.getBoundingClientRect();
        if (rect.top > mapRect.top && rect.bottom < mapRect.bottom) {
            const x = rect.left - mapRect.left + 30;
            const y = rect.top - mapRect.top + 30;
            activeHs.push({x, y});

            // Sun Rays
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
            ctx.lineWidth = 4;
            for(let i = 0; i < 8; i++) {
                const angle = (i * Math.PI / 4) + (animationTime / 50);
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(angle)*40, y + Math.sin(angle)*40);
                ctx.lineTo(x + Math.cos(angle)*90, y + Math.sin(angle)*90);
                ctx.stroke();
            }
        }
    });

    // Check Lows
    lTokens.forEach(token => {
        const rect = token.getBoundingClientRect();
        if (rect.top > mapRect.top && rect.bottom < mapRect.bottom) {
            const x = rect.left - mapRect.left + 30;
            const y = rect.top - mapRect.top + 30;
            activeLs.push({x, y});

            // Cold Front
            ctx.strokeStyle = '#1d4ed8'; 
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + 40);
            ctx.quadraticCurveTo(x - 50, y + 150, x - 100, y + 200);
            ctx.stroke();

            // Cold Front Spikes
            ctx.fillStyle = '#1d4ed8';
            for (let i = 1; i <= 3; i++) {
                let t = i * 0.25; 
                let spikeX = x * Math.pow(1-t, 2) + (x-50) * 2*(1-t)*t + (x-100) * Math.pow(t, 2);
                let spikeY = (y+40) * Math.pow(1-t, 2) + (y+150) * 2*(1-t)*t + (y+200) * Math.pow(t, 2);
                
                ctx.beginPath();
                ctx.moveTo(spikeX, spikeY);
                ctx.lineTo(spikeX + 15, spikeY - 5);
                ctx.lineTo(spikeX + 5, spikeY + 15);
                ctx.fill();
            }

            // Storm Clouds
            ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 70 + Math.sin(animationTime/10)*5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#0ea5e9';
            ctx.font = '24px Arial';
            ctx.fillText('🌧️', x - 30, y + 50 + (animationTime % 15));
            ctx.fillText('🌧️', x + 10, y + 40 + ((animationTime+8) % 15));
        }
    });

    // Wind Lines
    activeHs.forEach(h => {
        activeLs.forEach(l => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 5;
            ctx.setLineDash([10, 15]);
            ctx.lineDashOffset = -animationTime * 2;
            
            ctx.beginPath();
            ctx.moveTo(h.x, h.y);
            ctx.quadraticCurveTo(h.x, l.y, l.x, l.y); 
            ctx.stroke();
            
            ctx.setLineDash([]);
        });
    });

    requestAnimationFrame(drawAnimations);
}

drawAnimations();