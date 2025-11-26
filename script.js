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
});

// Helper function for Intersection Observer
function setupIntersectionObserver(sectionId, itemClass, threshold = 0.2) {
    const section = document.getElementById(sectionId);
    const items = document.querySelectorAll(itemClass);

    if (section && items.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        // Only add visible class if not already added to prevent re-animation flicker
                        if (!item.classList.contains('visible')) {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, index * 100); // Staggered delay
                        }
                    });
                    // Optional: Unobserve after triggering if you want it to animate only once
                    // observer.unobserve(section); 
                } 
                // Uncomment else block if you want repeated animations on scroll up/down
                /* else {
                    items.forEach(item => {
                        item.classList.remove('visible');
                    });
                } */
            });
        }, {
            threshold: threshold
        });

        observer.observe(section);
    }
}

// Setup observers for different sections
setupIntersectionObserver('projects', '.project-item');
setupIntersectionObserver('projects', '.project-card-grid'); // Observe new grid cards
setupIntersectionObserver('achievements', '.achievement-item');
setupIntersectionObserver('skills', '.skill-card', 0.3);
setupIntersectionObserver('services', '.service-card');
setupIntersectionObserver('contact', '.contact-item');

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Project Image Modal Logic
const projectCards = document.querySelectorAll('.project-item[data-project]');
const projectModal = document.createElement('div');
projectModal.classList.add('modal');
projectModal.id = 'project-modal';
projectModal.innerHTML = `
    <span class="close-btn project-close-btn">×</span>
    <div class="modal-content-scroll">
        <!-- Images will be injected here -->
    </div>
`;
document.body.appendChild(projectModal);

const projectModalContent = projectModal.querySelector('.modal-content-scroll');
const projectCloseBtn = projectModal.querySelector('.project-close-btn');

projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent opening modal if clicking the GitHub button or if clicking inside the gallery (optional, but user might want to expand from gallery too)
        // Let's allow clicking anywhere on the card except the button to open the full modal
        if(e.target.classList.contains('btn')) return;

        const projectId = this.getAttribute('data-project');
        let images = [];

        // Logic to fetch images based on projectId
        if (projectId === 'expense-tracker') {
             images = [
                'images/expense_tracker/login.jpeg',
                'images/expense_tracker/register.jpeg',
                'images/expense_tracker/home.jpeg',
                'images/expense_tracker/add_transaction.jpeg',
                'images/expense_tracker/transactions.jpeg',
                'images/expense_tracker/breakdown.jpeg',
                'images/expense_tracker/logout.jpeg'
            ];
        } else if (projectId === 'agewell') {
            images = [
                'images/agewell/1.jpeg',
                'images/agewell/2.jpeg',
                'images/agewell/3.jpeg',
                'images/agewell/4.jpeg',
                'images/agewell/5.jpeg',
                'images/agewell/6.jpeg',
                'images/agewell/7.jpeg'
            ];
        } else if (projectId === 'carbonview') {
            images = [
                'images/carbonview/1.jpeg',
                'images/carbonview/2.jpeg',
                'images/carbonview/3.jpeg',
                'images/carbonview/4.jpeg',
                'images/carbonview/5.jpeg',
                'images/carbonview/6.jpeg',
                'images/carbonview/7.jpeg',
                'images/carbonview/8.jpeg',
                'images/carbonview/9.jpeg'
            ];
        } else if (projectId === 'policebharti') {
            images = [
                'images/policebharti/1.jpeg',
                'images/policebharti/2.jpeg',
                'images/policebharti/3.jpeg',
                'images/policebharti/4.jpeg',
                'images/policebharti/5.jpeg'
            ];
        }

        if (images.length > 0) {
            projectModalContent.innerHTML = images.map(src => 
                `<img src="${src}" class="project-detail-img" alt="Project Screenshot">`
            ).join('');
            
            projectModal.style.display = 'flex';
        }
    });
});

projectCloseBtn.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
    }
});

// Fullscreen Image Modal (Achievements)
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

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Dynamic Text Changing
const dynamicText = document.getElementById('dynamic-text');
const roles = [
    "Chaitany Kakde",
    "a 5x National Hackathon Winner 🏆",
    "a 2x Ideathon Winner 💡",
    "Technical Head @C³Cube",
    "an Android Developer",
    "an iOS Developer",
    "a Full Stack Developer",
    "a UI/UX Designer",
    "a Unit Tester"
];
let index = 0;

function changeText() {
    if (dynamicText) {
        dynamicText.style.animation = 'none';
        void dynamicText.offsetWidth;
        dynamicText.textContent = roles[index];
        dynamicText.style.animation = 'fadeInOut 3s ease-in-out';
        index = (index + 1) % roles.length;
    }
}

changeText();
setInterval(changeText, 3000);

window.addEventListener('load', function () {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
        loaderWrapper.classList.add('hidden');
        setTimeout(() => {
            loaderWrapper.style.display = 'none';
        }, 500);
    }
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}
