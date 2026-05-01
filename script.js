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
            document.addEventListener('DOMContentLoaded', () => {

                // ================================
                // CARRUSEL
                // ================================
                const slides = document.querySelectorAll('.carousel-slide');
                const dots = document.querySelectorAll('.dot');
                const carouselSection = document.querySelector('.carousel-section');

                let currentIndex = 0;
                let isAnimating = false;
                let pausado = false;
                let tiempoRestante = 5000;
                let ultimoTiempo = null;
                let rafId = null;

                // muestra el slide indicado con bucle infinito
                const mostrarSlide = (index) => {
                    if (isAnimating) return;
                    isAnimating = true;

                    slides[currentIndex].classList.remove('active');
                    dots[currentIndex].classList.remove('active');

                    // el modulo hace que sea circular: despues del ultimo vuelve al primero
                    currentIndex = (index + slides.length) % slides.length;

                    slides[currentIndex].classList.add('active');
                    dots[currentIndex].classList.add('active');

                    setTimeout(() => { isAnimating = false; }, 800);
                };

                const siguiente = () => mostrarSlide(currentIndex + 1);

                // uso requestAnimationFrame en vez de setInterval
                // asi puedo pausar conservando el tiempo que queda, no reiniciarlo
                const tick = (timestamp) => {
                    if (pausado) return;

                    if (!ultimoTiempo) ultimoTiempo = timestamp;
                    const delta = timestamp - ultimoTiempo;
                    ultimoTiempo = timestamp;

                    tiempoRestante -= delta;

                    if (tiempoRestante <= 0) {
                        siguiente();
                        tiempoRestante = 5000;
                    }

                    rafId = requestAnimationFrame(tick);
                };

                const iniciar = () => {
                    pausado = false;
                    ultimoTiempo = null;
                    rafId = requestAnimationFrame(tick);
                };

                // pausa el temporizador guardando el tiempo restante
                const pausar = () => {
                    pausado = true;
                    ultimoTiempo = null;
                    if (rafId) cancelAnimationFrame(rafId);
                };

                // reanuda desde donde se quedo, no desde 5 segundos
                const reanudar = () => {
                    if (pausado) {
                        pausado = false;
                        ultimoTiempo = null;
                        rafId = requestAnimationFrame(tick);
                    }
                };

                // botones prev y next
                document.getElementById('prev').addEventListener('click', () => {
                    mostrarSlide(currentIndex - 1);
                    tiempoRestante = 5000;
                    ultimoTiempo = null;
                });

                document.getElementById('next').addEventListener('click', () => {
                    mostrarSlide(currentIndex + 1);
                    tiempoRestante = 5000;
                    ultimoTiempo = null;
                });

                // puntitos indicadores
                dots.forEach((dot) => {
                    dot.addEventListener('click', (e) => {
                        const index = parseInt(e.target.getAttribute('data-index'));
                        mostrarSlide(index);
                        tiempoRestante = 5000;
                        ultimoTiempo = null;
                    });
                });

                // hover escritorio: pausa al entrar, reanuda al salir
                carouselSection.addEventListener('mouseenter', pausar);
                carouselSection.addEventListener('mouseleave', reanudar);

                // touch movil: pausa al tocar, reanuda al soltar
                carouselSection.addEventListener('touchstart', pausar, { passive: true });
                carouselSection.addEventListener('touchend', reanudar, { passive: true });

                // arranca el carrusel solo cuando esta visible en pantalla
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                reanudar();
                            } else {
                                pausar();
                            }
                        });
                    },
                    { threshold: 0.3 }
                );

                observer.observe(carouselSection);

                // arranque inicial
                slides[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
                iniciar();


                // ================================
                // BOTON VOLVER ARRIBA
                // ================================
                const btn = document.getElementById("topBtn");

                window.addEventListener("scroll", () => {
                    btn.style.display = window.scrollY > 300 ? "block" : "none";
                });

                btn.addEventListener("click", () => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });


                // ================================
                // MENU HAMBURGUESA
                // ================================
                const btnHamburguesa = document.getElementById('hamburguesa');
                const menuMovil = document.getElementById('menu-movil');

                btnHamburguesa.addEventListener('click', function () {
                    btnHamburguesa.classList.toggle('abierto');
                    menuMovil.classList.toggle('activo');
                });

                // al tocar un enlace del menu movil se cierra el panel
                document.querySelectorAll('.menu-movil-link').forEach(function (enlace) {
                    enlace.addEventListener('click', function () {
                        btnHamburguesa.classList.remove('abierto');
                        menuMovil.classList.remove('activo');
                    });
                });

            });

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

    // logica del menu hamburguesa
    const btnHamburguesa = document.getElementById('hamburguesa');
    const menuMovil = document.getElementById('menu-movil');

    btnHamburguesa.addEventListener('click', function () {
        // alterna la clase abierto en el boton (para la animacion X)
        btnHamburguesa.classList.toggle('abierto');
        // alterna la clase activo en el panel para mostrarlo u ocultarlo
        menuMovil.classList.toggle('activo');
    });

    // cuando el usuario toca un enlace del menu movil, lo cierra
    document.querySelectorAll('.menu-movil-link').forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            btnHamburguesa.classList.remove('abierto');
            menuMovil.classList.remove('activo');
        });
    });


});

