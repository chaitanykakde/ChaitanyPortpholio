// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Add active class to nav links on scroll and animate sections
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Animate project cards when in view
    const projectsSection = document.getElementById('projects');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsTop = projectsSection.offsetTop - window.innerHeight / 2;
    const projectsBottom = projectsTop + projectsSection.offsetHeight;

    if (window.pageYOffset >= projectsTop && window.pageYOffset <= projectsBottom) {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100); // Staggered animation
        });
    } else {
        projectCards.forEach(card => {
            card.classList.remove('visible');
        });
    }

    // Animate achievement cards when in view
    const achievementsSection = document.getElementById('achievements');
    const achievementCards = document.querySelectorAll('.achievement-item');
    const achievementsTop = achievementsSection.offsetTop - window.innerHeight / 2;
    const achievementsBottom = achievementsTop + achievementsSection.offsetHeight;

    if (window.pageYOffset >= achievementsTop && window.pageYOffset <= achievementsBottom) {
        achievementCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100); // Staggered animation
        });
    } else {
        achievementCards.forEach(card => {
            card.classList.remove('visible');
        });
    }
});

// Animate skill cards with Intersection Observer
const skillsSection = document.getElementById('skills');
const skillCards = document.querySelectorAll('.skill-card');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillCards.forEach((card, index) => {
                card.classList.remove('visible'); // Reset animation
                void card.offsetWidth; // Trigger reflow
                setTimeout(() => {
                    card.classList.add('visible'); // Reapply animation
                }, index * 100); // Staggered effect
            });
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% of the section is visible
});

skillsObserver.observe(skillsSection);
// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Fullscreen Image Modal
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeBtn = document.querySelector('.close-btn');
const achievementImages = document.querySelectorAll('.achievement-img');

achievementImages.forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'flex';
        modalImg.src = this.src;
    });
});

closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Dynamic Text Changing
const dynamicText = document.getElementById('dynamic-text');
const roles = [
    "I'm Chaitany Kakde",
    "I'm an App Developer",
    "I'm a Web Developer",
    "I'm a UI/UX Designer",
    "I'm a Unit Tester",
    "I'm a Game Developer",
    "I'm a Prototype Designer"
];
let index = 0;

function changeText() {
    dynamicText.style.animation = 'none';
    void dynamicText.offsetWidth;
    dynamicText.textContent = roles[index];
    dynamicText.style.animation = 'fadeInOut 3s ease-in-out';
    index = (index + 1) % roles.length;
}

changeText();
setInterval(changeText, 3000);

window.addEventListener('load', function () {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    loaderWrapper.classList.add('hidden');
    setTimeout(() => {
        loaderWrapper.style.display = 'none';
    }, 500);
});