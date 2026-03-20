// Ensures initial theme is set before components load to avoid flicker
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
} else {
    document.documentElement.classList.add('dark'); // Default
}

// Function to load HTML components into target elements
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Function to initialize dynamic behaviors after components are loaded
function initializeInteractions() {
    // ---- Theme Toggle Logic ----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement; // targeting <html class="dark">

    if (themeToggleBtn) {
        // Check local storage for existing preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            htmlEl.classList.remove('dark');
            themeIcon.textContent = 'dark_mode'; // Show moon icon when in light mode
        } else {
            // Default is dark (or if saved is 'dark')
            htmlEl.classList.add('dark');
            themeIcon.textContent = 'light_mode'; // Show sun icon when in dark mode
        }

        themeToggleBtn.addEventListener('click', () => {
            if (htmlEl.classList.contains('dark')) {
                // Switch to Light
                htmlEl.classList.remove('dark');
                themeIcon.textContent = 'dark_mode';
                localStorage.setItem('theme', 'light');
            } else {
                // Switch to Dark
                htmlEl.classList.add('dark');
                themeIcon.textContent = 'light_mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ---- Mobile Menu Logic ----
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // ---- Contact Form Logic ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            const targetEmail = 'rodriguezchris808@gmail.com'; // Recipient email address
            
            // Construct the email body
            const body = `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`;
            
            // Create the mailto link
            const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open the default email client
            window.location.href = mailtoLink;
        });
    }

    // ---- Skills Filter Logic ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button UI
                filterBtns.forEach(b => {
                    // Remove active state classes
                    b.classList.remove('active', 'bg-primary', 'text-white', 'border-primary/20');
                    // Add inactive state classes (responsive to light/dark mode)
                    b.classList.add('bg-white', 'dark:bg-slate-900/50', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800', 'hover:border-primary/50', 'hover:bg-primary/5', 'dark:hover:bg-primary/10', 'shadow-sm', 'dark:shadow-none');
                });
                
                // Add active state classes to the clicked button
                btn.classList.add('active', 'bg-primary', 'text-white', 'border-primary/20');
                // Remove inactive state classes
                btn.classList.remove('bg-white', 'dark:bg-slate-900/50', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800', 'hover:border-primary/50', 'hover:bg-primary/5', 'dark:hover:bg-primary/10', 'shadow-sm', 'dark:shadow-none');

                // Filter cards
                skillCards.forEach(card => {
                    if (filter === 'general') {
                        card.classList.remove('hidden');
                    } else {
                        if (card.getAttribute('data-category') === filter) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }
}

// Load all components
document.addEventListener('DOMContentLoaded', async () => {
    // Load components in parallel
    await Promise.all([
        loadComponent('header-container', 'components/header.html'),
        loadComponent('home-container', 'components/home.html'),
        loadComponent('skills-container', 'components/skills.html'),
        loadComponent('education-container', 'components/education.html'),
        loadComponent('projects-container', 'components/projects.html'),
        loadComponent('contact-container', 'components/contact.html'),
        loadComponent('footer-container', 'components/footer.html')
    ]);

    // Initialize scripts (like filtering) after DOM is injected
    initializeInteractions();
});
