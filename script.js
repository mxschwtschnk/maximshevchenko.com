// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuPanel = document.querySelector('.mobile-menu-panel');

  if (mobileMenu && mobileMenuToggle && mobileMenuPanel) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      mobileMenuToggle.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    };

    mobileMenuToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenuToggle.classList.toggle('open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close menu when clicking on a link
    const links = mobileMenuPanel.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target)) {
        closeMenu();
      }
    });
  }
  
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  
  navLinksAll.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html') || (currentPage === 'index.html' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Hero image tilt effect on cursor movement
  const heroImage = document.querySelector('.hero-image');
  const heroSection = document.querySelector('.hero');
  
  if (heroImage && heroSection) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    heroSection.addEventListener('mousemove', function(e) {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center
      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    });
    
    // Smooth animation loop
    function animate() {
      // Ease towards target
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      
      // Apply tilt (max 15 degrees)
      const rotateX = currentY * 15;
      const rotateY = currentX * -15;
      
      heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      requestAnimationFrame(animate);
    }
    
    // Reset on mouse leave
    heroSection.addEventListener('mouseleave', function() {
      mouseX = 0;
      mouseY = 0;
    });
    
    animate();
  }
});

