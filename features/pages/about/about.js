// About JS - Enhanced functionality
console.log('About page loaded');

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and sections
const animatedElements = document.querySelectorAll('.feature-card, .info-card, .quote-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Smooth scroll for anchor links (only for internal page anchors, not SPA navigation)
document.querySelectorAll('.about-page a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle internal page anchors, not SPA navigation links
        const isInternalAnchor = href.startsWith('#') && 
                                !['#home', '#about', '#contact', '#logout', '#login', '#register', '#forgot-password'].includes(href) &&
                                href !== '#';
        
        if (isInternalAnchor) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});