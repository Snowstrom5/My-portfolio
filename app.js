(function () {
    // Enhanced Custom Cursor System
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create cursor trail elements
    const trailElements = [];
    const trailCount = 8;
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (trailCount - i) / trailCount * 0.6;
        trail.style.transform = `scale(${0.3 + (i / trailCount) * 0.7})`;
        document.body.appendChild(trail);
        trailElements.push(trail);
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailPositions = Array(trailCount).fill({ x: 0, y: 0 });
    let isMoving = false;
    let moveTimeout;

    // Enhanced mouse move handler with throttling
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            cursor.style.opacity = '1';
        }
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
            cursor.style.opacity = '0.7';
        }, 100);
    });

    // Ultra-smooth cursor animation with improved easing
    function animateCursor() {
        // Use different easing for different speeds
        const distance = Math.sqrt((mouseX - cursorX) ** 2 + (mouseY - cursorY) ** 2);
        const speed = Math.min(distance / 100, 1);
        const easing = speed > 0.5 ? 0.15 : 0.08; // Faster for quick movements
        
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // Update main cursor
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Update trail positions
        trailPositions.unshift({ x: cursorX, y: cursorY });
        trailPositions.pop();
        
        trailElements.forEach((trail, index) => {
            if (trailPositions[index]) {
                trail.style.left = trailPositions[index].x + 'px';
                trail.style.top = trailPositions[index].y + 'px';
            }
        });
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enhanced hover effects with better visual feedback
    const hoverElements = document.querySelectorAll('a, button, .control, .theme-btn, .show-more-btn, .main-btn, .portfolio-item, .orbit-card, input, textarea');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            // Add ripple effect
            createRippleEffect(cursorX, cursorY);
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Enhanced click effects with visual feedback
    document.addEventListener('mousedown', (e) => {
        cursor.classList.add('click');
        createClickWave(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });

    // Improved window enter/leave handling
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trailElements.forEach(trail => trail.style.opacity = '0');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        trailElements.forEach((trail, index) => {
            trail.style.opacity = (trailCount - index) / trailCount * 0.6;
        });
    });

    // Ripple effect function
    function createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Click wave effect
    function createClickWave(x, y) {
        const wave = document.createElement('div');
        wave.className = 'cursor-wave';
        wave.style.left = x + 'px';
        wave.style.top = y + 'px';
        document.body.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 800);
    }

    // Accessibility and performance optimizations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersReducedData = navigator.connection && navigator.connection.saveData;
    
    if (prefersReducedMotion || prefersReducedData) {
        // Disable trail effects for users who prefer reduced motion or have data saving enabled
        trailElements.forEach(trail => trail.style.display = 'none');
        cursor.style.transition = 'all 0.1s ease';
    }

    // Performance optimization: reduce animation frequency on slower devices
    let animationFrameId;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function optimizedAnimateCursor(currentTime) {
        if (currentTime - lastTime >= frameInterval) {
            // Use different easing for different speeds
            const distance = Math.sqrt((mouseX - cursorX) ** 2 + (mouseY - cursorY) ** 2);
            const speed = Math.min(distance / 100, 1);
            const easing = speed > 0.5 ? 0.15 : 0.08;
            
            cursorX += (mouseX - cursorX) * easing;
            cursorY += (mouseY - cursorY) * easing;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            if (!prefersReducedMotion && !prefersReducedData) {
                trailPositions.unshift({ x: cursorX, y: cursorY });
                trailPositions.pop();
                
                trailElements.forEach((trail, index) => {
                    if (trailPositions[index]) {
                        trail.style.left = trailPositions[index].x + 'px';
                        trail.style.top = trailPositions[index].y + 'px';
                    }
                });
            }
            
            lastTime = currentTime;
        }
        animationFrameId = requestAnimationFrame(optimizedAnimateCursor);
    }
    
    // Replace the original animateCursor with optimized version
    cancelAnimationFrame(animationFrameId);
    optimizedAnimateCursor(0);

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            cursor.style.opacity = '0.5';
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            cursor.style.opacity = '1';
        }
    });

    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });

    const THEME_KEY = "preferred-theme";

    const applyThemeFromPreference = () => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === "light") {
            document.body.classList.add("light-mode");
            return;
        }
        if (stored === "dark") {
            document.body.classList.remove("light-mode");
            return;
        }
        // No stored preference: respect OS
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
    };

    applyThemeFromPreference();

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyThemeFromPreference);
    }

    document.querySelector(".theme-btn").addEventListener("click", () => {
        const willBeLight = !document.body.classList.contains("light-mode");
        document.body.classList.toggle("light-mode");
        localStorage.setItem(THEME_KEY, willBeLight ? "light" : "dark");
    })

    // Animate skill bars when visible
    const animateSkills = () => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const span = bar.querySelector('.progress span');
            const target = Number(bar.getAttribute('data-percent') || 0);
            if (!bar._animated && span) {
                const rect = bar.getBoundingClientRect();
                const viewH = window.innerHeight || document.documentElement.clientHeight;
                if (rect.top < viewH - 80) {
                    bar._animated = true;
                    span.style.width = target + '%';
                    
                    // Create and animate percentage badge
                    const valueBadge = document.createElement('div');
                    valueBadge.className = 'value';
                    valueBadge.textContent = '0%';
                    span.appendChild(valueBadge);
                    
                    // counter for badge
                    let current = 0;
                    const step = Math.max(1, Math.round(target / 30));
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) { 
                            current = target; 
                            clearInterval(timer); 
                        }
                        valueBadge.textContent = current + '%';
                        valueBadge.style.right = (100 - current) + '%';
                    }, 20);
                    
                    // counter for text
                    const text = bar.querySelector('.prog-text');
                    if (text) {
                        let currentText = 0;
                        const stepText = Math.max(1, Math.round(target / 30));
                        const timerText = setInterval(() => {
                            currentText += stepText;
                            if (currentText >= target) { 
                                currentText = target; 
                                clearInterval(timerText); 
                            }
                            text.textContent = currentText + '%';
                        }, 20);
                    }
                }
            }
        });
    };
    document.addEventListener('scroll', animateSkills, { passive: true });
    window.addEventListener('load', animateSkills);

    // Render star ratings (4.5 - 5.0 randomly if not specified)
    const renderRatings = () => {
        document.querySelectorAll('.t-rating').forEach(el => {
            let rating = parseFloat(el.getAttribute('data-rating'));
            if (isNaN(rating)) {
                rating = 4.5 + Math.random() * 0.5; // 4.5 to 5.0
            }
            rating = Math.min(5, Math.max(4.5, Math.round(rating * 10) / 10));
            const full = Math.floor(rating);
            const half = rating - full >= 0.5 ? 1 : 0;
            const empty = 5 - full - half;
            el.innerHTML = `${'<i class=\"fas fa-star\"></i>'.repeat(full)}${half?'<i class=\"fas fa-star-half-alt\"></i>':''}${'<i class=\"far fa-star\"></i>'.repeat(empty)}<span style="margin-left:6px;font-size:.9rem;color:var(--color-grey-2)">${rating.toFixed(1)}</span>`;
        });
    };
    window.addEventListener('load', renderRatings);

    // Portfolio Show More functionality - Unlimited implementation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.show-more-btn')) {
            e.preventDefault();
            const hiddenItems = document.querySelectorAll('.portfolio-item.hidden');
            const showMoreBtn = e.target.closest('.show-more-btn');
            
            // Show up to 3 items at a time for better UX
            const itemsToShow = Math.min(3, hiddenItems.length);
            
            for (let i = 0; i < itemsToShow; i++) {
                setTimeout(() => {
                    if (hiddenItems[i]) {
                        hiddenItems[i].classList.remove('hidden');
                        hiddenItems[i].style.opacity = '0';
                        hiddenItems[i].style.transform = 'translateY(30px)';
                        hiddenItems[i].style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            hiddenItems[i].style.opacity = '1';
                            hiddenItems[i].style.transform = 'translateY(0)';
                        }, 50);
                    }
                }, i * 100);
            }
            
            // Hide the button only if no more items to show
            setTimeout(() => {
                const remainingHidden = document.querySelectorAll('.portfolio-item.hidden');
                if (remainingHidden.length === 0) {
                    showMoreBtn.style.display = 'none';
                }
            }, itemsToShow * 100 + 200);
        }
    });
})();
