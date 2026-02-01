// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Set age
  const birthDate = '2002-07-12';
  const age = calculateAge(birthDate);
  const ageElement = document.getElementById('age');
  if (ageElement) {
    ageElement.textContent = age;
  }
  
  // Initialize all components
  initThemeToggle();
  initMobileMenu();
  initNavigation();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
  
  // Animate skill bars on scroll
  animateSkillsOnScroll();
});

// Age calculation
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  
  // Check saved theme or prefer-color-scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      icon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Mobile Menu
// Mobile Menu with animations
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;
    
    function openMenu() {
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    menuClose.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Add a slight delay to allow animation to complete
            setTimeout(() => {
                closeMenu();
            }, 300);
        });
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Navigation
function initNavigation() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

// Project Filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Contact Form
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitText = document.getElementById('submitText');
  const formLoader = document.getElementById('formLoader');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };
    
    // Show loading state
    submitText.style.opacity = '0';
    formLoader.style.display = 'block';
    
    try {
      // Send email using EmailJS
      await emailjs.send(
        "service_7m3hk2t",
        "template_whbr8hm",
        {
          subject: formData.subject,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          time: new Date().toLocaleString()
        }
      );
      
      // Show success modal
      successModal.classList.add('active');
      contactForm.reset();
      
    } catch (error) {
      console.error('Email send error:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      // Reset button state
      submitText.style.opacity = '1';
      formLoader.style.display = 'none';
    }
  });
  
  // Close modal
  modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
  });
  
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
    }
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1
  });
  
  animateElements.forEach(element => observer.observe(element));
}

// Animate skill bars on scroll
function animateSkillsOnScroll() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target;
        const width = progress.style.width;
        progress.style.width = '0%';
        
        setTimeout(() => {
          progress.style.width = width;
        }, 300);
        
        observer.unobserve(progress);
      }
    });
  }, {
    threshold: 0.5
  });
  
  skillBars.forEach(bar => observer.observe(bar));
}

// Add smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});