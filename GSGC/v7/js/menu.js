// Burger menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.navbar ul');
    
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', function() {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnBurger = burgerMenu.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnBurger && navMenu.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
