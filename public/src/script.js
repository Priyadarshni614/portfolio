// Toggle compact navbar on scroll for the .navbar element
(function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const THRESHOLD = 24;
    const onScroll = () => {
        if (window.scrollY > THRESHOLD) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();