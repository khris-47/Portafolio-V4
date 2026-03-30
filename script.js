// Aplica el tema guardado antes de cargar los componentes para evitar parpadeos visuales
// (flash de tema incorrecto) durante el primer render.
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
} else {
    document.documentElement.classList.add('dark'); // Tema por defecto si no hay preferencia previa.
}

// Carga un componente HTML externo e inyecta su contenido dentro del elemento destino.
// - elementId: id del contenedor donde se insertara el HTML.
// - componentPath: ruta relativa del archivo HTML del componente.
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        // Se registra el error para depuracion si un componente no existe o falla la red.
        console.error('Error loading component:', error);
    }
}

// Inicializa todos los comportamientos interactivos que dependen de elementos
// insertados dinamicamente (tema, menu movil, formulario de contacto y filtros).
function initializeInteractions() {
    // ---- Logica de cambio de tema ----
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement; // Referencia al elemento <html>, donde vive la clase "dark".

    if (themeToggleBtn) {
        // Sincroniza la UI con la preferencia guardada para mantener consistencia.
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            htmlEl.classList.remove('dark');
            themeIcon.textContent = 'dark_mode'; // En modo claro, el icono sugiere cambiar a oscuro.
        } else {
            // Si no hay preferencia o existe "dark", se mantiene el tema oscuro por defecto.
            htmlEl.classList.add('dark');
            themeIcon.textContent = 'light_mode'; // En modo oscuro, el icono sugiere cambiar a claro.
        }

        themeToggleBtn.addEventListener('click', () => {
            if (htmlEl.classList.contains('dark')) {
                // Cambia de oscuro a claro y persiste la seleccion.
                htmlEl.classList.remove('dark');
                themeIcon.textContent = 'dark_mode';
                localStorage.setItem('theme', 'light');
            } else {
                // Cambia de claro a oscuro y persiste la seleccion.
                htmlEl.classList.add('dark');
                themeIcon.textContent = 'light_mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ---- Logica del menu movil ----
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        // Alterna visibilidad del menu al tocar el boton hamburguesa.
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });

        // Cierra el menu cuando el usuario selecciona una opcion de navegacion.
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // ---- Inicializacion de EmailJS ----
    // Se inicializa una sola vez con la public key para permitir envios
    // desde el formulario sin exponer credenciales privadas del correo real.
    emailjs.init('p4wTevDYreiDPmL7o');

    // ---- Logica del formulario de contacto ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // Evita el envio tradicional del formulario para manejarlo via JavaScript.
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Captura y limpia espacios en blanco para enviar datos consistentes.
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            // Estado de carga: previene doble envio y brinda feedback inmediato.
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Debe coincidir con las variables definidas en la plantilla de EmailJS.
            const templateParams = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };

            // Envia el correo usando el service ID y template ID configurados en EmailJS.
            emailjs.send('service_gmce6o7', 'template_9dv2879', templateParams)
                .then(function () {
                    // Exito: confirma al usuario y limpia formulario.
                    submitBtn.textContent = '¡Mensaje enviado!';
                    submitBtn.classList.remove('bg-primary', 'hover:bg-primary/90', 'shadow-primary/20');
                    submitBtn.classList.add('bg-green-500', 'shadow-green-500/20');
                    contactForm.reset();

                    // Restaura estado visual y funcional del boton tras unos segundos.
                    setTimeout(function () {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.classList.add('bg-primary', 'hover:bg-primary/90', 'shadow-primary/20');
                        submitBtn.classList.remove('bg-green-500', 'shadow-green-500/20');
                    }, 4000);
                }, function (error) {
                    // Error: registra detalles para diagnostico y muestra feedback visible.
                    console.error('EmailJS error:', error);
                    submitBtn.textContent = 'Error al enviar. Intenta de nuevo.';
                    submitBtn.classList.remove('bg-primary', 'hover:bg-primary/90', 'shadow-primary/20');
                    submitBtn.classList.add('bg-red-500', 'shadow-red-500/20');

                    // Restaura el boton para permitir reintento del usuario.
                    setTimeout(function () {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        submitBtn.classList.add('bg-primary', 'hover:bg-primary/90', 'shadow-primary/20');
                        submitBtn.classList.remove('bg-red-500', 'shadow-red-500/20');
                    }, 4000);
                });
        });
    }

    // ---- Logica de filtrado de habilidades ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Reinicia estilo de todos los botones para reflejar estado inactivo.
                filterBtns.forEach(b => {
                    // Elimina clases del estado activo.
                    b.classList.remove('active', 'bg-primary', 'text-white', 'border-primary/20');
                    // Aplica clases del estado inactivo con soporte claro/oscuro.
                    b.classList.add('bg-white', 'dark:bg-slate-900/50', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800', 'hover:border-primary/50', 'hover:bg-primary/5', 'dark:hover:bg-primary/10', 'shadow-sm', 'dark:shadow-none');
                });

                // Marca como activo el boton seleccionado por el usuario.
                btn.classList.add('active', 'bg-primary', 'text-white', 'border-primary/20');
                // Remueve las clases de inactivo para evitar conflictos visuales.
                btn.classList.remove('bg-white', 'dark:bg-slate-900/50', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800', 'hover:border-primary/50', 'hover:bg-primary/5', 'dark:hover:bg-primary/10', 'shadow-sm', 'dark:shadow-none');

                // Muestra u oculta tarjetas segun la categoria seleccionada.
                skillCards.forEach(card => {
                    if (filter === 'general') {
                        // "general" representa la vista completa sin filtros.
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

// Punto de entrada: espera a que el DOM base este listo para comenzar.
document.addEventListener('DOMContentLoaded', async () => {
    // Carga de componentes en paralelo para mejorar tiempo de render inicial.
    await Promise.all([
        loadComponent('header-container', 'components/header.html'),
        loadComponent('home-container', 'components/home.html'),
        loadComponent('skills-container', 'components/skills.html'),
        loadComponent('education-container', 'components/education.html'),
        loadComponent('projects-container', 'components/projects.html'),
        loadComponent('contact-container', 'components/contact.html'),
        loadComponent('footer-container', 'components/footer.html')
    ]);

    // Una vez inyectado el HTML dinamico, se enlazan eventos e interacciones.
    initializeInteractions();
});
