// Futuristic particle interaction system
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
                life: Math.random() * 100 + 100
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += (dx / distance) * force * 0.01;
                particle.vy += (dy / distance) * force * 0.01;
            }

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Draw glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            particle.life--;
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
                    life: Math.random() * 100 + 100
                });
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
const particleSystem = new ParticleSystem();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced header background on scroll with clean white effects
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const scrollY = window.scrollY;

    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
    }

    // Fade out hero section on scroll
    const heroOpacity = Math.max(0, 1 - (scrollY / 500));
    hero.style.opacity = heroOpacity;
    hero.style.transform = `translateY(${scrollY * 0.3}px)`;
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const emailInput = this.querySelector('.email-input');
    const submitBtn = this.querySelector('.submit-btn');
    const successMessage = document.querySelector('.success-message');

    // Simple email validation
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
        // Get user information
        const userInfo = await getUserInfo();

        // Prepare data for webhook
        const formData = {
            x9Jt4Qb7L2vFp0MzWcR1nKd8HsE3yUgT: email,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            url: window.location.href,
            ...userInfo
        };

        // Send to webhook
        const response = await fetch('https://n8n.edbmotte.com/webhook/14760557-5bcd-4cfe-8cdc-5d107bae4062', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success
            emailInput.value = '';
            submitBtn.textContent = 'Notify me';
            submitBtn.disabled = false;
            successMessage.style.display = 'block';

            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        } else {
            throw new Error('Failed to submit form');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your email. Please try again.');
        submitBtn.textContent = 'Notify me';
        submitBtn.disabled = false;
    }
});

// Function to get user information
async function getUserInfo() {
    try {
        // Get IP and location info
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        return {
            ip: data.ip,
            country: data.country_name,
            countryCode: data.country_code,
            region: data.region,
            city: data.city,
            timezone: data.timezone,
            isp: data.org,
            latitude: data.latitude,
            longitude: data.longitude
        };
    } catch (error) {
        console.error('Error getting user info:', error);
        // Fallback - return basic info
        return {
            ip: 'unknown',
            country: 'unknown',
            error: 'Failed to retrieve location data'
        };
    }
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature, .news-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize animation styles
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature, .news-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Run animation on scroll
window.addEventListener('scroll', animateOnScroll);

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle (for future mobile implementation)
const createMobileMenu = () => {
    const nav = document.querySelector('.nav-container');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.display = 'none';
    
    nav.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('mobile-open');
    });
};

// Initialize mobile menu
createMobileMenu();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElement = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallaxElement) {
        parallaxElement.style.transform = `translateY(${speed}px)`;
    }
});

// Counter animation for statistics with professional easing
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach((counter, index) => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2500; // Slightly longer for more professional feel
        const startTime = performance.now();
        const startValue = 0;
        
        // Easing function for smooth acceleration/deceleration
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        
        // Add a subtle delay between counters for staggered effect
        const delay = index * 200;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime - delay;
            if (elapsed < 0) {
                requestAnimationFrame(animate);
                return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentValue = startValue + (target - startValue) * easedProgress;
            
            // Handle decimal places for percentage values
            if (target === 99.99) {
                counter.textContent = currentValue.toFixed(2);
            } else {
                counter.textContent = Math.floor(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Add completion effects
                counter.classList.add('animated');
                counter.style.textShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
                setTimeout(() => {
                    counter.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
                }, 500);
            }
        };
        
        requestAnimationFrame(animate);
    });
};

// Trigger counter animation when stats section comes into view
const observeCounters = () => {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsGrid);
};

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animatable elements
document.addEventListener('DOMContentLoaded', () => {
    const animatableElements = document.querySelectorAll('.feature, .news-item, .solution-type, .showcase-item');
    animatableElements.forEach(el => observer.observe(el));
    
    // Initialize counter observation
    observeCounters();
});

console.log('Eastern Lights website loaded successfully!');