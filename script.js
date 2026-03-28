// HudaLabs - Premium Islamic Learning Reimagined
// Main JavaScript File

// Smooth appearance on scroll
const observerOptions = { threshold: 0.1 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
    });
}, observerOptions);

// Apply animation to all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
    observer.observe(section);
});

// 3D Carousel Logic
const carouselImages = [
    { id: 1, src: '1.png', alt: 'App Home Screen' },
    { id: 2, src: '2.png', alt: 'Journey Through Prophet Stories' },
    { id: 3, src: '3.png', alt: 'Build a Habit of Daily Salah' },
    { id: 4, src: '4.png', alt: 'Learn Namaz Step-by-Step' },
    { id: 5, src: '5.png', alt: 'Learn Essential Daily Duas' },
    { id: 6, src: '6.png', alt: 'Learn Arabic Letters' },
    { id: 7, src: '7.png', alt: 'Word-by-Word Quran Learning' },
    { id: 8, src: '8.png', alt: 'Test Your Memory' }
];

let carouselActiveIndex = 3;
let carouselTouchStartX = null;

function initCarousel() {
    const container = document.getElementById('carousel-container');
    const indicators = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (!container) return;

    // Generate Cards
    carouselImages.forEach((img, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" draggable="false">
            <div class="carousel-card-border"></div>
        `;
        
        card.addEventListener('click', () => {
            carouselActiveIndex = index;
            updateCarousel();
        });

        container.appendChild(card);

        // Generate Dots
        const dot = document.createElement('div');
        dot.className = 'carousel-dot h-2 w-2 rounded-full bg-white/30 cursor-pointer';
        dot.addEventListener('click', () => {
            carouselActiveIndex = index;
            updateCarousel();
        });
        indicators.appendChild(dot);
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (carouselActiveIndex > 0) {
            carouselActiveIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (carouselActiveIndex < carouselImages.length - 1) {
            carouselActiveIndex++;
            updateCarousel();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && carouselActiveIndex < carouselImages.length - 1) {
            carouselActiveIndex++;
            updateCarousel();
        } else if (e.key === 'ArrowLeft' && carouselActiveIndex > 0) {
            carouselActiveIndex--;
            updateCarousel();
        }
    });

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => {
        carouselTouchStartX = e.touches[0].clientX;
    });

    container.addEventListener('touchend', (e) => {
        if (carouselTouchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = carouselTouchStartX - touchEndX;

        if (diff > 50 && carouselActiveIndex < carouselImages.length - 1) {
            carouselActiveIndex++;
            updateCarousel();
        } else if (diff < -50 && carouselActiveIndex > 0) {
            carouselActiveIndex--;
            updateCarousel();
        }
        carouselTouchStartX = null;
    });

    updateCarousel();
}

function updateCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    cards.forEach((card, index) => {
        const offset = index - carouselActiveIndex;
        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        let translateX = 0;
        let scale = 1;
        let opacity = 1;
        let brightness = 1;
        let rotateY = 0;
        let zIndex = 20 - absOffset;
        let pointerEvents = absOffset > 2 ? 'none' : 'auto';
        let boxShadow = '0 20px 40px rgba(0,0,0,0.8)';

        if (absOffset === 0) {
            translateX = 0; scale = 1.1; opacity = 1; brightness = 1; rotateY = 0;
            boxShadow = '0 30px 60px -15px rgba(0,107,84,0.3)';
            card.classList.add('active');
        } else if (absOffset === 1) {
            translateX = sign * 110; scale = 0.85; opacity = 0.8; brightness = 0.5; rotateY = sign * -10;
            card.classList.remove('active');
        } else if (absOffset === 2) {
            translateX = sign * 180; scale = 0.65; opacity = 0.5; brightness = 0.3; rotateY = sign * -15;
            card.classList.remove('active');
        } else {
            translateX = sign * 240; scale = 0.5; opacity = 0; brightness = 0;
            card.classList.remove('active');
        }

        card.style.transform = `translateX(${translateX}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.filter = `brightness(${brightness})`;
        card.style.pointerEvents = pointerEvents;
        card.style.boxShadow = boxShadow;
    });

    // Update dots
    dots.forEach((dot, index) => {
        if (index === carouselActiveIndex) {
            dot.classList.add('active');
            dot.classList.remove('bg-white/30');
        } else {
            dot.classList.remove('active');
            dot.classList.add('bg-white/30');
        }
    });

    // Update buttons state
    prevBtn.disabled = carouselActiveIndex === 0;
    nextBtn.disabled = carouselActiveIndex === carouselImages.length - 1;
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', initCarousel);

// ============================================
// Custom Cursor
// ============================================
(function() {
    // Only enable on desktop devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallScreen = window.innerWidth < 768;
    
    if (isTouchDevice || isSmallScreen) return;
    
    // Create cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    
    document.body.appendChild(cursorGlow);
    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorDot);
    document.body.classList.add('custom-cursor-enabled');
    
    // Cursor position variables
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let glowX = 0, glowY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        // Create occasional particle trail
        if (Math.random() > 0.92) {
            createParticle(mouseX, mouseY);
        }
    });
    
    // Smooth ring and glow animation
    function animateCursor() {
        // Faster follow for ring
        ringX += (mouseX - ringX) * 0.35;
        ringY += (mouseY - ringY) * 0.35;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        
        // Faster follow for glow
        glowX += (mouseX - glowX) * 0.25;
        glowY += (mouseY - glowY) * 0.25;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Interactive elements hover detection
    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .carousel-card, .glass-card, .download-card, .store-badge';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.add('cursor-hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.remove('cursor-hover');
        }
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
        // Create burst of particles on click
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createParticle(mouseX, mouseY, true), i * 30);
        }
    });
    
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('cursor-click');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        cursorGlow.style.opacity = '0.8';
    });
    
    // Create Islamic star particle
    function createParticle(x, y, isBurst = false) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        // Random size for particles
        const size = isBurst ? Math.random() * 15 + 10 : Math.random() * 10 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Offset for burst effect
        const offsetX = isBurst ? (Math.random() - 0.5) * 40 : 0;
        const offsetY = isBurst ? (Math.random() - 0.5) * 40 : 0;
        particle.style.left = (x + offsetX) + 'px';
        particle.style.top = (y + offsetY) + 'px';
        
        // Islamic 8-point star SVG
        const colors = ['#006b54', '#1FAB89', '#D4AF37'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.innerHTML = `
            <svg viewBox="0 0 100 100" fill="${color}">
                <path d="M50 0 L58 35 L100 50 L58 65 L50 100 L42 65 L0 50 L42 35 Z"/>
            </svg>
        `;
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            document.body.classList.remove('custom-cursor-enabled');
            cursorDot.style.display = 'none';
            cursorRing.style.display = 'none';
            cursorGlow.style.display = 'none';
        } else {
            document.body.classList.add('custom-cursor-enabled');
            cursorDot.style.display = 'block';
            cursorRing.style.display = 'block';
            cursorGlow.style.display = 'block';
        }
    });
})();
