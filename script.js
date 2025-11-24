// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavLinks = document.querySelector('.mobile-nav-links');

  if (mobileMenu && mobileMenuToggle && mobileNavLinks) {
    const setMenuState = (isOpen) => {
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenuToggle.classList.toggle('open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
      mobileNavLinks.setAttribute('aria-hidden', (!isOpen).toString());
    };

    setMenuState(false);

    const toggleMenu = () => {
      const isOpen = !mobileMenu.classList.contains('open');
      setMenuState(isOpen);
    };

    const closeMenu = () => setMenuState(false);

    mobileMenuToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      toggleMenu();
    });

    mobileMenuToggle.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking on a link
    const links = mobileNavLinks.querySelectorAll('a');
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

  // Desktop panel dragging
  const desktopStage = document.querySelector('.desktop-stage');
  const desktopPanels = document.querySelectorAll('.desktop-panel');

  if (desktopStage && desktopPanels.length) {
    let highestZ = 30;

    desktopPanels.forEach(panel => {
      const bar = panel.querySelector('.desktop-panel__bar');
      if (!bar) return;

      panel.style.zIndex = (++highestZ).toString();

      const pointerDownHandler = (event) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        if (!bar.contains(event.target)) return;

        const panelRect = panel.getBoundingClientRect();
        const offsetX = event.clientX - panelRect.left;
        const offsetY = event.clientY - panelRect.top;

        panel.classList.add('is-dragging');
        panel.style.zIndex = (++highestZ).toString();

        const handlePointerMove = (moveEvent) => {
          const stageBounds = desktopStage.getBoundingClientRect();
          const currentPanelRect = panel.getBoundingClientRect();
          const maxLeft = stageBounds.width - currentPanelRect.width - 12;
          const maxTop = stageBounds.height - currentPanelRect.height - 12;

          let nextLeft = moveEvent.clientX - stageBounds.left - offsetX;
          let nextTop = moveEvent.clientY - stageBounds.top - offsetY;

          nextLeft = Math.max(12, Math.min(nextLeft, maxLeft));
          nextTop = Math.max(12, Math.min(nextTop, maxTop));

          panel.style.left = `${nextLeft}px`;
          panel.style.top = `${nextTop}px`;
        };

        const handlePointerUp = () => {
          panel.classList.remove('is-dragging');
          window.removeEventListener('pointermove', handlePointerMove);
          window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        if (panel.setPointerCapture) {
          panel.setPointerCapture(event.pointerId);
        }
      };

      panel.addEventListener('pointerdown', pointerDownHandler);
    });
  }
});

