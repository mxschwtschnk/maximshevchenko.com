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
  
  // Navigation indicator and anchor highlighting
  const navLinksAll = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  const desktopNavContainer = document.querySelector('.nav-container');
  const desktopNavLinks = desktopNavContainer?.querySelectorAll('.nav-links a');
  const observedSections = document.querySelectorAll('section[id]');
  let navIndicator;
  let moveIndicator = () => {};
  let setIndicatorToActive = () => {};

  const getLinkTargetId = (link) => {
    const href = link.getAttribute('href');
    if (!href) return '';

    try {
      const url = new URL(href, window.location.href);
      return url.hash.replace('#', '');
    } catch (e) {
      return href.replace('#', '');
    }
  };

  const setActiveLinkById = (targetId) => {
    if (!targetId) return;
    let matchFound = false;
    navLinksAll.forEach(link => {
      const linkTarget = getLinkTargetId(link);
      const isMatch = linkTarget === targetId;
      if (isMatch) {
        matchFound = true;
      }
      link.classList.toggle('active', isMatch);
    });
    if (matchFound) {
      setIndicatorToActive();
    }
  };

  if (desktopNavContainer && desktopNavLinks && desktopNavLinks.length) {
    navIndicator = document.createElement('span');
    navIndicator.className = 'nav-indicator';
    desktopNavContainer.appendChild(navIndicator);

    moveIndicator = (targetLink) => {
      if (!targetLink || !navIndicator) return;

      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = targetLink;
      const paddingX = 14;
      navIndicator.style.width = `${offsetWidth + paddingX * 2}px`;
      navIndicator.style.left = `${offsetLeft - paddingX}px`;
      navIndicator.style.top = `${offsetTop + offsetHeight / 2}px`;
      navIndicator.style.opacity = '1';
    };

    setIndicatorToActive = () => {
      const activeDesktopLink = desktopNavContainer.querySelector('.nav-links a.active') || desktopNavLinks[0];
      moveIndicator(activeDesktopLink);
    };

    desktopNavLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveIndicator(link));
      link.addEventListener('focus', () => moveIndicator(link));
    });

    desktopNavContainer.addEventListener('mouseleave', setIndicatorToActive);
    window.addEventListener('resize', setIndicatorToActive);
  }

  const scrollToTarget = (hash) => {
    const target = document.querySelector(hash);
    if (target) {
      const targetRect = target.getBoundingClientRect();
      const offset = window.innerHeight * 0.05;
      const targetPosition = targetRect.top + window.scrollY - offset;

      window.scrollTo({
        top: Math.max(targetPosition, 0),
        behavior: 'smooth'
      });
    }
  };

  const handleNavLinkClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href) return;

    const url = new URL(href, window.location.href);
    const targetHash = url.hash;

    if (targetHash && document.querySelector(targetHash)) {
      event.preventDefault();
      scrollToTarget(targetHash);
      history.replaceState(null, '', targetHash);
      setActiveLinkById(targetHash.replace('#', ''));
    }
  };

  navLinksAll.forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });

  if (observedSections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLinkById(entry.target.id);
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: '-20% 0px -40% 0px'
    });

    observedSections.forEach(section => observer.observe(section));
  }

  const initialActiveId = window.location.hash.replace('#', '') || observedSections[0]?.id || getLinkTargetId(navLinksAll[0]);
  if (initialActiveId) {
    setActiveLinkById(initialActiveId);
  }

  setIndicatorToActive();

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

  const desktopStage = document.querySelector('.desktop-stage');
  const desktopPanels = document.querySelectorAll('.desktop-panel');
  let didDrag = false;
  const desktopMediaQuery = window.matchMedia('(min-width: 861px)');
  let desktopPanelsInitialized = false;

  // Project modal interactions
  const projectModal = document.querySelector('.project-modal');
  const projectModalContent = projectModal?.querySelector('.project-modal__content');
  const projectModalThumb = projectModal?.querySelector('.project-modal__thumb');
  const projectModalTitle = projectModal?.querySelector('.project-modal__title');
  const projectModalDescription = projectModal?.querySelector('.project-modal__description');
  const projectModalMeta = projectModal?.querySelector('.project-modal__meta');
  const projectModalGallery = projectModal?.querySelector('.project-modal__gallery');
  const projectModalAccordion = projectModal?.querySelector('.project-modal__accordion');
  const projectModalAccordionToggle = projectModal?.querySelector('.project-modal__accordion-toggle');
  if (projectModalDescription) {
    projectModalDescription.id = 'project-description';
  }
  const projectModalClose = projectModal?.querySelector('.project-modal__close');
  const syncAccordionHeight = () => {
    if (!projectModalAccordion) return;

    const measuredHeight = projectModalThumb?.getBoundingClientRect().height;
    const accordionStyles = getComputedStyle(projectModalAccordion);
    const paddingTop = parseFloat(accordionStyles.paddingTop) || 0;
    const paddingBottom = parseFloat(accordionStyles.paddingBottom) || 0;
    const toggleHeight = projectModalAccordionToggle?.getBoundingClientRect().height || 0;
    const descriptionStyles = getComputedStyle(projectModalDescription || projectModalAccordion);
    const lineHeight = parseFloat(descriptionStyles.lineHeight) || 24;
    const sampleParagraph = projectModalDescription?.querySelector('p + p');
    const paragraphSpacing = sampleParagraph ? parseFloat(getComputedStyle(sampleParagraph).marginTop) || 0 : 0;
    const spacingTotal = paragraphSpacing * Math.max(0, (projectModalDescription?.childElementCount || 1) - 1);
    const defaultLines = 6;
    const defaultThumbHeight = 240;
    const availableHeight = measuredHeight ? Math.max(80, Math.round(measuredHeight - paddingTop - paddingBottom)) : Math.max(defaultThumbHeight - paddingTop - paddingBottom, 80);
    const maxTextHeight = Math.max(48, availableHeight - toggleHeight);
    const visibleLines = Math.max(2, Math.floor(maxTextHeight / lineHeight) || defaultLines);
    const clampedTextHeight = Math.round((visibleLines * lineHeight) + spacingTotal);
    const fullTextHeight = Math.max(projectModalDescription?.scrollHeight || clampedTextHeight, clampedTextHeight);
    const closedHeight = Math.round(clampedTextHeight + toggleHeight + paddingTop + paddingBottom);
    const openHeight = Math.round(fullTextHeight + toggleHeight + paddingTop + paddingBottom);

    projectModalAccordion.style.setProperty('--project-accordion-closed-max', `${closedHeight}px`);
    projectModalAccordion.style.setProperty('--project-accordion-open-max', `${openHeight}px`);
    projectModalAccordion.style.setProperty('--project-accordion-description-max', `${clampedTextHeight}px`);
    projectModalAccordion.style.setProperty('--project-accordion-description-open-max', `${fullTextHeight}px`);
    projectModalAccordion.style.setProperty('--project-accordion-lines', `${visibleLines}`);
  };
  const updateCloseButtonGlow = (event) => {
    if (!projectModalClose) return;

    const rect = projectModalClose.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    projectModalClose.style.setProperty('--glow-x', `${x}%`);
    projectModalClose.style.setProperty('--glow-y', `${y}%`);
  };

  const updateCtaButtonGlow = (event) => {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    target.style.setProperty('--glow-x', `${x}%`);
    target.style.setProperty('--glow-y', `${y}%`);
  };

  // CTA button glow tracking
  const ctaButtons = document.querySelectorAll('.cta-links .btn');
  const navCtaButtons = document.querySelectorAll('.nav-cta');

  [...ctaButtons, ...navCtaButtons].forEach(button => {
    button.addEventListener('pointermove', updateCtaButtonGlow);
    button.addEventListener('pointerleave', () => {
      button.style.removeProperty('--glow-x');
      button.style.removeProperty('--glow-y');
    });
  });

  const projectDetails = {
    mobility: {
      title: 'Mobility Platform',
      thumb: 'thumb_switch.png',
      image: 'switch1.png',
      gallery: ['switch1.png'],
      description: [
        'As a Senior Product Designer I lead the public transport area of the hvv switch app—Hamburg’s mobility platform that blends public transport with shared mobility.',
        'The role requires close collaboration with stakeholders from a publicly owned company, aligning high volumes of regulatory requirements with accessibility standards and a clear product vision.',
        'Critical design updates are in progress and not yet released publicly; visual material will follow once available.'
      ],
      tags: ['Product design', 'Consumer app', 'Accessibility', 'Compliance']
    },
    erp: {
      title: 'ERP Application',
      thumb: 'thumb_erp.png',
      image: 'erp1.png',
      gallery: ['erp1.png', 'erp2.png', 'erp3.png'],
      description: [
        'I led the end-to-end process from research and service blueprints to MVP prototypes, usability testing, and final UI delivery.',
        'The design translated complex requirements into a core tool for staff and students, improving efficiency and reducing operational bottlenecks.',
        'As this enterprise product is under NDA, the visuals illustrate the solution but do not match the exact final release.'
      ],
      tags: ['Enterprise UX', 'Design system', 'Data visualization', 'Service design']
    },
    telemedicine: {
      title: 'Telemedicine Platform',
      thumb: 'thumb_medicare.png',
      image: 'medicare1.png',
      gallery: ['medicare1.png'],
      description: [
        'I guided the project from research and journey mapping to prototyping, testing, and development sprints, focusing on accessibility for elderly users.',
        'Interfaces emphasize larger touch targets, intuitive navigation, and a clear visual language to lower cognitive load and build trust.',
        'The resulting platform lets seniors connect with doctors, manage prescriptions, and access medical records with ease.'
      ],
      tags: ['Health tech', 'Patient portal', 'Cross-platform', 'Accessibility']
    }
  };

  const openProjectModal = (panel) => {
    if (!projectModal || !projectModalContent || !projectModalThumb || !projectModalTitle || !projectModalMeta || !projectModalDescription || !projectModalGallery) return;

    const panelKey = panel.dataset.panel;
    const previewImg = panel.querySelector('img');
    const panelTitle = panel.querySelector('.desktop-panel__title');
    const details = projectDetails[panelKey] || {};

    const thumbSource = details.thumb || previewImg?.dataset.thumbnail || previewImg?.getAttribute('src') || '';
    const imageSource = details.image || previewImg?.dataset.fullsize || previewImg?.getAttribute('src') || '';
    const galleryItems = (details.gallery && details.gallery.length ? details.gallery : [imageSource]).filter(Boolean);
    const [primaryImage] = galleryItems.length ? galleryItems : [imageSource];

    projectModalThumb.src = thumbSource || primaryImage;
    projectModalThumb.alt = `${details.title || panelTitle?.textContent || 'Project'} preview`;
    projectModalTitle.textContent = details.title || panelTitle?.textContent || 'Project';
    projectModalDescription.innerHTML = '';
    (details.description || []).forEach(paragraph => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      projectModalDescription.appendChild(p);
    });

    if (projectModalAccordionToggle && projectModalAccordion) {
      projectModalAccordionToggle.textContent = 'Read more';
      projectModalAccordionToggle.setAttribute('aria-expanded', 'false');
      projectModalAccordionToggle.setAttribute('aria-controls', 'project-description');
      projectModalAccordionToggle.remove();
      projectModalAccordion.appendChild(projectModalAccordionToggle);
    }

    projectModalMeta.innerHTML = '';
    (details.tags || []).forEach(tag => {
      const pill = document.createElement('li');
      pill.className = 'project-modal__pill';
      pill.textContent = tag;
      projectModalMeta.appendChild(pill);
    });

    projectModalGallery.innerHTML = '';
    galleryItems.forEach((src, index) => {
      const galleryImage = document.createElement('img');
      galleryImage.src = src;
      galleryImage.alt = `${details.title || 'Project'} image ${index + 1}`;
      galleryImage.loading = 'lazy';
      projectModalGallery.appendChild(galleryImage);
    });

    projectModalAccordion?.classList.remove('is-open');
    projectModalAccordion?.setAttribute('data-open', 'false');

    syncAccordionHeight();
    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const attachDesktopPanelInteractions = () => {
    if (desktopPanelsInitialized || !desktopMediaQuery.matches) return;
    if (!projectModal || !desktopStage || !desktopPanels.length) return;

    desktopPanelsInitialized = true;
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
          didDrag = true;
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
          setTimeout(() => { didDrag = false; }, 0);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        if (panel.setPointerCapture) {
          panel.setPointerCapture(event.pointerId);
        }
      };

      panel.addEventListener('pointerdown', pointerDownHandler);
      panel.addEventListener('pointerdown', () => { didDrag = false; });
      panel.addEventListener('pointermove', () => { didDrag = true; });

      panel.addEventListener('click', (event) => {
        if (didDrag) {
          event.preventDefault();
          return;
        }
        openProjectModal(panel);
      });

      panel.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProjectModal(panel);
        }
      });
    });

    projectModal.addEventListener('click', (event) => {
      if (event.target === projectModal) {
        closeProjectModal();
      }
    });

    projectModalClose?.addEventListener('click', closeProjectModal);
    projectModalClose?.addEventListener('pointermove', updateCloseButtonGlow);
    projectModalClose?.addEventListener('pointerleave', () => {
      projectModalClose.style.removeProperty('--glow-x');
      projectModalClose.style.removeProperty('--glow-y');
    });

    projectModalAccordionToggle?.addEventListener('click', (event) => {
      event.preventDefault();
      syncAccordionHeight();
      const isOpen = projectModalAccordion?.classList.toggle('is-open');
      if (!projectModalAccordionToggle || !projectModalAccordion) return;
      projectModalAccordionToggle.textContent = isOpen ? 'Show less' : 'Read more';
      projectModalAccordionToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      projectModalAccordion.setAttribute('data-open', isOpen ? 'true' : 'false');
      syncAccordionHeight();
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && projectModal.classList.contains('is-active')) {
        closeProjectModal();
      }
    });

    projectModalThumb?.addEventListener('load', syncAccordionHeight);
    window.addEventListener('resize', syncAccordionHeight);
  };

  if (desktopMediaQuery.matches) {
    attachDesktopPanelInteractions();
  }

  desktopMediaQuery.addEventListener('change', (event) => {
    if (event.matches) {
      attachDesktopPanelInteractions();
    }
  });
});

