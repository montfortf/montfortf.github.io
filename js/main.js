/**
 * Brite.AI Website JavaScript
 * Interactive Components & Functionality
 */

// ==========================================================================
// DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
  initAccordions();
  initTabs();
  initSliders();
  initCounters();
  initScrollAnimations();
  initMobileMenu();
  initSmoothScroll();
  initNavbarScroll();
});

// ==========================================================================
// Accordion Component
// ==========================================================================
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion__item');

    items.forEach(item => {
      const header = item.querySelector('.accordion__header');

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items in this accordion (single open mode)
        if (accordion.dataset.single !== 'false') {
          items.forEach(i => i.classList.remove('active'));
        }

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });
}

// ==========================================================================
// Tabs Component
// ==========================================================================
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs');

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tabs__btn');
    const contents = container.querySelectorAll('.tabs__content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Remove active from all
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Add active to clicked
        btn.classList.add('active');
        const targetContent = container.querySelector(`[data-tab-content="${target}"]`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  });
}

// ==========================================================================
// Slider / Carousel Component
// ==========================================================================
function initSliders() {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.slider__track');
    const slides = slider.querySelectorAll('.slider__slide');
    const dots = slider.querySelectorAll('.slider__dot');
    const prevBtn = slider.querySelector('.slider__arrow--prev');
    const nextBtn = slider.querySelector('.slider__arrow--next');

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let slidesPerView = 1;

    // Determine slides per view based on class
    if (slider.classList.contains('slider--3')) {
      slidesPerView = window.innerWidth > 768 ? 3 : 1;
    } else if (slider.classList.contains('slider--2')) {
      slidesPerView = window.innerWidth > 768 ? 2 : 1;
    }

    const totalSlides = Math.ceil(slides.length / slidesPerView);

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentSlide = index;
      const translateX = -(currentSlide * (100 / slidesPerView) * slidesPerView);
      track.style.transform = `translateX(${translateX}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-play
    if (slider.dataset.autoplay) {
      const interval = parseInt(slider.dataset.autoplay) || 5000;
      setInterval(() => goToSlide(currentSlide + 1), interval);
    }

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        goToSlide(currentSlide + 1);
      } else if (touchEndX - touchStartX > 50) {
        goToSlide(currentSlide - 1);
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (slider.classList.contains('slider--3')) {
        slidesPerView = window.innerWidth > 768 ? 3 : 1;
      } else if (slider.classList.contains('slider--2')) {
        slidesPerView = window.innerWidth > 768 ? 2 : 1;
      }
      goToSlide(0);
    });
  });
}

// ==========================================================================
// Animated Counter Component
// ==========================================================================
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';

        animateCounter(counter, 0, target, duration, prefix, suffix);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, prefix, suffix) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==========================================================================
// Scroll Animations
// ==========================================================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');

        // Add stagger delay if specified
        const delay = entry.target.dataset.delay;
        if (delay) {
          entry.target.style.transitionDelay = delay + 'ms';
        }
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

// ==========================================================================
// Mobile Menu
// ==========================================================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // Navbar height
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================================================
// Navbar Scroll Effect
// ==========================================================================
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // Hide/show on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScroll = currentScroll;
  });
}

// ==========================================================================
// Form Validation
// ==========================================================================
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      const inputs = form.querySelectorAll('[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            valid = false;
            input.classList.add('error');
          }
        }
      });

      if (!valid) {
        e.preventDefault();
      }
    });
  });
}

// ==========================================================================
// Tooltip Component
// ==========================================================================
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');

  tooltips.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const text = el.dataset.tooltip;
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = text;
      document.body.appendChild(tooltip);

      const rect = el.getBoundingClientRect();
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
      tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
    });

    el.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) tooltip.remove();
    });
  });
}

// ==========================================================================
// Progress Bar Animation
// ==========================================================================
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.dataset.value;
        bar.querySelector('.progress-bar__fill').style.width = value + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => observer.observe(bar));
}

// ==========================================================================
// Modal Component
// ==========================================================================
const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  init() {
    // Close button handlers
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) this.close(modal.id);
      });
    });

    // Open button handlers
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.open(btn.dataset.modalOpen);
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close(modal.id);
        }
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) this.close(activeModal.id);
      }
    });
  }
};

// Initialize modal on DOM ready
document.addEventListener('DOMContentLoaded', () => Modal.init());

// ==========================================================================
// Copy to Clipboard
// ==========================================================================
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}

// ==========================================================================
// Utility Functions
// ==========================================================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
