document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initMobileMenu();
    initPlantPartsSwiper();
    initMythFactCards();
    initHeaderScroll();
    initAccessibility();
    initResponsiveTableToggle();
});

// Plant Parts Swiper Initialization
function initPlantPartsSwiper() {
    const swiper = new Swiper('.plant-parts-slider', {
        // Basic configuration
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoHeight: false,
        speed: 1800,
        
        // Auto-update background images
        on: {
            slideChange: function() {
                updateSlideBackground(this.realIndex);
            },
            init: function() {
                updateSlideBackground(0);
            }
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination bullets
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                const parts = ['Leaves', 'Flowers', 'Seeds', 'Stems'];
                return '<span class="' + className + '" data-part="' + parts[index] + '"></span>';
            },
        },
        
        // Touch/swipe settings
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        
        // Keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        
        // Mouse wheel control
        mousewheel: {
            enabled: true,
            sensitivity: 1,
            thresholdDelta: 50,
        },
        
        // Accessibility
        a11y: {
            enabled: true,
            prevSlideMessage: 'Previous plant part',
            nextSlideMessage: 'Next plant part',
            firstSlideMessage: 'This is the first plant part',
            lastSlideMessage: 'This is the last plant part',
        },
        
        // Responsive breakpoints
        breakpoints: {
            768: {
                mousewheel: {
                    enabled: false,
                },
            },
            480: {
                navigation: {
                    enabled: false,
                },
            },
        }
    });
    
    // Update slide background based on data-background attribute
    function updateSlideBackground(slideIndex) {
        const slides = document.querySelectorAll('.plant-parts-slider .swiper-slide');
        const currentSlide = slides[slideIndex];
        
        if (currentSlide) {
            const backgroundImage = currentSlide.getAttribute('data-background');
            const slideBackground = currentSlide.querySelector('.slide-background');
            
            if (backgroundImage && slideBackground) {
                slideBackground.style.backgroundImage = `url('${backgroundImage}')`;
                slideBackground.style.opacity = '1';
            }
        }
        
        // Fade out other backgrounds
        slides.forEach((slide, index) => {
            if (index !== slideIndex) {
                const bg = slide.querySelector('.slide-background');
                if (bg) {
                    bg.style.opacity = '0.3';
                }
            }
        });
        
        // Announce to screen readers
        const slideTitle = document.querySelectorAll('.slide-title')[slideIndex]?.textContent;
        const totalSlides = slides.length;
        if (slideTitle) {
            announceToScreenReader(`Showing ${slideTitle}, slide ${slideIndex + 1} of ${totalSlides}`);
        }
    }
    
    // Auto-play functionality (optional)
    let autoplayTimer;
    
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            swiper.slideNext();
        }, 8000); // 8 seconds
    }
    
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }
    
    // Start autoplay
    startAutoplay();
    
    // Pause autoplay on hover
    const swiperContainer = document.querySelector('.plant-parts-slider');
    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', stopAutoplay);
        swiperContainer.addEventListener('mouseleave', startAutoplay);
        
        // Pause on touch
        swiperContainer.addEventListener('touchstart', stopAutoplay);
        swiperContainer.addEventListener('touchend', () => {
            setTimeout(startAutoplay, 3000); // Resume after 3 seconds
        });
    }
}

// Responsive Table Toggle for Compounds Section
function initResponsiveTableToggle() {
    const desktopView = document.querySelector('.desktop-view');
    const mobileView = document.querySelector('.mobile-view');
    
    function checkScreenSize() {
        if (window.innerWidth <= 1024) {
            if (desktopView) desktopView.style.display = 'none';
            if (mobileView) mobileView.style.display = 'block';
        } else {
            if (desktopView) desktopView.style.display = 'block';
            if (mobileView) mobileView.style.display = 'none';
        }
    }
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize events
    window.addEventListener('resize', debounce(checkScreenSize, 250));
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    let isMenuOpen = false;
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            // Toggle menu visibility
            if (isMenuOpen) {
                nav.style.display = 'flex';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.backgroundColor = 'white';
                nav.style.flexDirection = 'column';
                nav.style.padding = '1rem';
                nav.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                nav.style.zIndex = '1000';
                
                // Animate menu appearance
                nav.style.opacity = '0';
                nav.style.transform = 'translateY(-20px)';
                requestAnimationFrame(() => {
                    nav.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    nav.style.opacity = '1';
                    nav.style.transform = 'translateY(0)';
                });
                
                // Update toggle button
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                nav.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                nav.style.opacity = '0';
                nav.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    nav.style.display = 'none';
                    resetNavStyles(nav);
                }, 300);
                
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    nav.style.display = 'none';
                    resetNavStyles(nav);
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                isMenuOpen = false;
                nav.style.display = 'none';
                resetNavStyles(nav);
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    function resetNavStyles(nav) {
        nav.style.position = '';
        nav.style.top = '';
        nav.style.left = '';
        nav.style.right = '';
        nav.style.backgroundColor = '';
        nav.style.flexDirection = '';
        nav.style.padding = '';
        nav.style.boxShadow = '';
        nav.style.transition = '';
        nav.style.opacity = '';
        nav.style.transform = '';
    }
}

// Myth vs Fact Card Interactions with Background Switching
function initMythFactCards() {
    const cards = document.querySelectorAll('.myth-fact-card');
    
    cards.forEach(card => {
        const flipButtons = card.querySelectorAll('.flip-button');
        const cardBackground = card.querySelector('.card-background');
        const mythBg = card.getAttribute('data-myth-bg');
        const factBg = card.getAttribute('data-fact-bg');
        let isFlipped = false;
        
        // Set initial background
        if (cardBackground && mythBg) {
            cardBackground.style.backgroundImage = `url('${mythBg}')`;
        }
        
        // Add click listeners to flip buttons
        flipButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleCard();
            });
        });
        
        // Add click listener to entire card
        card.addEventListener('click', toggleCard);
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard();
            }
        });
        
        function toggleCard() {
            isFlipped = !isFlipped;
            card.classList.toggle('flipped', isFlipped);
            
            // Switch background image
            if (cardBackground) {
                if (isFlipped && factBg) {
                    cardBackground.style.backgroundImage = `url('${factBg}')`;
                } else if (mythBg) {
                    cardBackground.style.backgroundImage = `url('${mythBg}')`;
                }
            }
            
            // Update ARIA attributes for accessibility
            card.setAttribute('aria-expanded', isFlipped);
            
            // Add subtle scale effect
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 100);
            
            // Announce to screen readers
            const announcement = isFlipped ? 'Showing fact' : 'Showing myth';
            announceToScreenReader(announcement);
        }
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll using native API
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Focus management for accessibility
                setTimeout(() => {
                    targetElement.focus();
                }, 1000);
            }
        });
    });
}

// Header Scroll Effects
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = `translateY(-${header.offsetHeight}px)`;
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Accessibility Enhancements
function initAccessibility() {
    // Add ARIA labels and roles
    const cards = document.querySelectorAll('.myth-fact-card');
    cards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-label', `Myth vs Fact card ${index + 1}. Click to reveal the fact.`);
    });
    
    
    // Keyboard navigation for comparison table
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.setAttribute('tabindex', '0');
        row.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--qurist-yellow)';
        });
        row.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Utility Functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
});

// Resize handler with debouncing
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Update mobile menu state
        const nav = document.querySelector('.nav');
        if (window.innerWidth > 768 && nav) {
            nav.style.display = '';
            // Reset all nav styles
            nav.style.position = '';
            nav.style.top = '';
            nav.style.left = '';
            nav.style.right = '';
            nav.style.backgroundColor = '';
            nav.style.flexDirection = '';
            nav.style.padding = '';
            nav.style.boxShadow = '';
        }
    }, 250);
}, { passive: true });