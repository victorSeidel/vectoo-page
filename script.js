// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes and observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero section
            section.classList.add('fade-in');
            observer.observe(section);
        }
    });

    // Add slide-in animations to specific elements
    const leftElements = document.querySelectorAll('.about-text, .values-text, .contact-form-container');
    leftElements.forEach(element => {
        element.classList.add('slide-in-left');
        observer.observe(element);
    });

    const rightElements = document.querySelectorAll('.about-visual, .values-grid, .contact-info');
    rightElements.forEach(element => {
        element.classList.add('slide-in-right');
        observer.observe(element);
    });

    // Service cards animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Value items animation
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
});

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    counterObserver.observe(aboutSection);
}

if (contactForm) 
{
    contactForm.addEventListener('submit', (e) => 
    {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) { showNotification('Por favor, preencha todos os campos.', 'error'); return; }
        
        if (!isValidEmail(email)) { showNotification('Por favor, insira um e-mail válido.', 'error'); return; }
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        emailjs.send("service_5w9ufpp", "template_wkmwv8x", { name: name, email: email, message: message })
        .then(() => 
        {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        })
        .catch((error) => 
        {
            showNotification('Erro ao envial e-mail. Tente novamente.', 'error');
        });
    });
}

function isValidEmail(email) { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return emailRegex.test(email); }

function showNotification(message, type = 'info') 
{
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.2rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
    
    notification.querySelector('.notification-close').addEventListener('click', () => { closeNotification(notification); });
    
    setTimeout(() => { closeNotification(notification); }, 5000);
}

function closeNotification(notification) 
{
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => { if (notification.parentNode) { notification.parentNode.removeChild(notification); } }, 300);
}

function getNotificationIcon(type) 
{
    switch (type) 
    {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) 
{
    switch (type) 
    {
        case 'success': return '#10B981';
        case 'error': return '#EF4444';
        case 'warning': return '#F59E0B';
        default: return '#3B82F6';
    }
}

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => closeNotification(notification));
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Header scroll effect
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(139, 92, 246, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.remove('loading');
        });
        
        if (!img.complete) {
            img.classList.add('loading');
        }
    });
});

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .service-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Vectoo website loaded successfully! 🚀');

