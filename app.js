/**
 * FRONTIER HOUSE (POSTI HERITAGE INN) - WEB INTERACTIVE ENGINE
 * ==========================================================================
 * Contains all client-side logic for the custom premium single-page site.
 * Features: Scroll reveals, sticky headers, fullscreen menus, custom lightbox,
 * room details modals, rooms carousel slider, FAQs accordion, and WhatsApp link templates.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // CONFIGURATION: DIRECT CONTACT CHANNELS
  // ==========================================================================
  const CONTACT_CONFIG = {
    whatsappNumber: '919897449585', // Real Posti Family contact number
    phoneCallNumber: '+919897449585',
    whatsappMessageTemplates: {
      default: 'Namaste Frontier House (Posti Heritage Inn),\n\nI would like to enquire about staying at your guesthouse in Kedarnath.\n\nNumber of guests:\nTravel dates:\nAny special requirements:',
      deluxeRoom: 'Namaste Frontier House (Posti Heritage Inn),\n\nI would like to enquire about staying at your Deluxe Family Room in Kedarnath.\n\nNumber of guests:\nTravel dates:\nAny special requirements:',
      ctaSection: 'Namaste Frontier House (Posti Heritage Inn),\n\nI am planning my Kedarnath journey and would like to connect for rooms and local travel advice.\n\nNumber of guests:\nTravel dates:\nAny special requirements:'
    }
  };

  // Pre-fill all links on load
  updateContactLinks();

  function updateContactLinks() {
    const waLinks = document.querySelectorAll('.whatsapp-link-gen');
    waLinks.forEach(link => {
      let msg = CONTACT_CONFIG.whatsappMessageTemplates.default;
      
      if (link.closest('#rooms')) {
        msg = CONTACT_CONFIG.whatsappMessageTemplates.deluxeRoom;
      } else if (link.closest('.cta-section') || link.closest('#travel-assistance')) {
        msg = CONTACT_CONFIG.whatsappMessageTemplates.ctaSection;
      }
      
      const encodedMsg = encodeURIComponent(msg);
      link.href = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodedMsg}`;
    });

    const telLinks = document.querySelectorAll('a[href^="tel:"]');
    telLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.includes('9412913508') || href.includes('9876543210')) {
        link.href = `tel:${CONTACT_CONFIG.phoneCallNumber}`;
      }
    });
  }


  // ==========================================================================
  // HEADER SCROLL TRANSITION
  // ==========================================================================
  const header = document.getElementById('header');
  
  function checkHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Initial check on load
  }


  // ==========================================================================
  // MOBILE NAVIGATION OVERLAY
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    if (!menuBtn || !mobileOverlay) return;
    const isOpen = menuBtn.classList.contains('open');
    if (isOpen) {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = ''; // Enable scroll
    } else {
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Disable scroll
    }
  }

  if (menuBtn && mobileOverlay) {
    menuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (menuBtn.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }


  // ==========================================================================
  // GALLERY FILTER MECHANISM
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }


  // ==========================================================================
  // CUSTOM GALLERY LIGHTBOX
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeGalleryList = []; 
  let currentLightboxIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        activeGalleryList = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
        currentLightboxIndex = activeGalleryList.indexOf(item);
        
        openLightbox();
        updateLightboxContent();
      });
    });

    function openLightbox() {
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      if (mobileOverlay && !mobileOverlay.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    }

    function updateLightboxContent() {
      if (activeGalleryList.length === 0) return;
      const targetItem = activeGalleryList[currentLightboxIndex];
      
      const imgSrc = targetItem.getAttribute('data-src');
      const imgCaption = targetItem.getAttribute('data-caption');

      if (lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgCaption;
      }
      if (lightboxCaption) lightboxCaption.textContent = imgCaption;
      if (lightboxCounter) lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${activeGalleryList.length}`;
    }

    function nextLightboxImage() {
      currentLightboxIndex = (currentLightboxIndex + 1) % activeGalleryList.length;
      updateLightboxContent();
    }

    function prevLightboxImage() {
      currentLightboxIndex = (currentLightboxIndex - 1 + activeGalleryList.length) % activeGalleryList.length;
      updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    });
  }


  // ==========================================================================
  // ROOMS CAROUSEL SLIDER (ROOMS PAGE)
  // ==========================================================================
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const slides = document.querySelectorAll('.room-slide');
  const dots = document.querySelectorAll('.room-slider-dot');

  if (sliderPrev && sliderNext && slides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }

      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    sliderNext.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });

    sliderPrev.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(index);
      });
    });
  }


  // ==========================================================================
  // CUSTOM ROOM DETAILS MODAL
  // ==========================================================================
  const modalBackdrop = document.getElementById('room-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalButtons = document.querySelectorAll('.btn-room-modal');

  if (modalBackdrop && modalCloseBtn && openModalButtons.length > 0) {
    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const roomType = button.getAttribute('data-room');
        if (roomType === 'deluxe-family') {
          openRoomModal();
        }
      });
    });

    function openRoomModal() {
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeRoomModal() {
      modalBackdrop.classList.remove('open');
      if (mobileOverlay && !mobileOverlay.classList.contains('open') && (!lightbox || !lightbox.classList.contains('open'))) {
        document.body.style.overflow = '';
      }
    }

    modalCloseBtn.addEventListener('click', closeRoomModal);
    
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeRoomModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (modalBackdrop.classList.contains('open') && e.key === 'Escape') {
        closeRoomModal();
      }
    });
  }


  // ==========================================================================
  // FAQ ACCORDIONS (INDEX PAGE)
  // ==========================================================================
  const faqToggles = document.querySelectorAll('.faq-toggle');

  if (faqToggles.length > 0) {
    faqToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const item = toggle.closest('.faq-item');
        if (!item) return;

        const answer = item.querySelector('.faq-answer');
        const icon = toggle.querySelector('.faq-icon');
        const isOpen = item.classList.contains('active');

        // Close all other FAQs for a premium accordion feel
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) {
              otherIcon.textContent = '+';
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });

        // Toggle current FAQ
        if (isOpen) {
          item.classList.remove('active');
          if (answer) answer.style.maxHeight = '0';
          if (icon) {
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
          }
        } else {
          item.classList.add('active');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) {
            icon.textContent = '−'; // minus character
            icon.style.transform = 'rotate(180deg)';
          }
        }
      });
    });
  }


  // ==========================================================================
  // INTERSECTION OBSERVER: SCROLL REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }
});
