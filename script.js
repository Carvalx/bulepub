document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carousel = document.querySelector('.carousel');
    let currentIndex = 0;
    let interval;
    let isAnimating = false; // Para evitar animaciones simultáneas
    let direction = 1; // 1 para derecha, -1 para izquierda

    const changeSlide = (index, isManual = false) => {
        if (isAnimating) return; // Evitar cambios si ya está en transición

        isAnimating = true;

        // Aplica el rebote si se presiona el botón rápido (solo para dirección derecha)
        if (isManual && direction === 1) {
            slides[currentIndex].classList.add('bounce');
            setTimeout(() => {
                slides[currentIndex].classList.remove('bounce');
            }, 200);
        }

        // Desactivar la imagen y punto actual
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        // Cambiar el índice y activar la imagen y punto correspondiente
        currentIndex = index;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        // Mover el carrusel en la dirección deseada
        carousel.style.transition = "transform 1s ease";
        carousel.style.transform = `translateX(-${currentIndex * 50}%)`;

        // Reiniciar el contador del carrusel si es manual
        if (isManual) {
            clearInterval(interval);
            startCarousel();
        }

        // Desactivar animación después de la transición
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    };

    const startCarousel = () => {
        interval = setInterval(() => {
            const nextIndex = (currentIndex + direction + slides.length) % slides.length;
            changeSlide(nextIndex);
        }, 3000); // Cambiar cada 5 segundos
    };

    const stopCarousel = () => {
        clearInterval(interval);
    };

    // Control de los botones "previo" y "siguiente"
    document.getElementById('prev').addEventListener('click', () => {
        direction = -1; // Mover hacia la izquierda
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        changeSlide(prevIndex, true);
    });

    document.getElementById('next').addEventListener('click', () => {
        direction = 1; // Mover hacia la derecha
        const nextIndex = (currentIndex + 1) % slides.length;
        changeSlide(nextIndex, true);
    });

    // Control de los indicadores de puntos
    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            changeSlide(index, true);
        });
    });

    // Observa si el carrusel está en el viewport
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCarousel();
                } else {
                    stopCarousel();
                }
            });
        },
        { threshold: 0.5 }
    );

    observer.observe(document.querySelector('#carousel'));

    // Iniciar el carrusel con la primera imagen activa
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    changeSlide(currentIndex);


    //Boton para subir al inicio
    const btn = document.getElementById("topBtn");

    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    btn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });



});

