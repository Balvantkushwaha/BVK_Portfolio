// Portfolio Website JavaScript
// script.js
// import portfolioConfig from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const name = portfolioConfig.personal.name;
  console.log("Config loaded:", portfolioConfig.personal.name);
  // =============== TYPING EFFECT ===============
  const typedTextSpan = document.getElementById("typed-text");
  const textArray = [
    name,
    "a Full Stack Developer",
    "a Problem Solver",
  ];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1,
      );
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingDelay + 1100);
    }
  }

  // Start typing effect after page loads
  setTimeout(type, 1000);

  // =============== MOBILE MENU TOGGLE ===============
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    nav.classList.toggle("active");
    document.body.style.overflow = nav.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // =============== SMOOTH SCROLL FOR ANCHOR LINKS ===============
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // =============== HEADER SCROLL EFFECT ===============
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 0, 20, 0)";
      header.style.backdropFilter = "blur(20px)";
      header.style.borderColor = "rgba(55, 21, 226, 0.21)";
    } else {
      header.style.background = "rgba(0, 0, 0, 0)";
      header.style.backdropFilter = "blur(4px)";
      header.style.borderColor = "rgba(255, 255, 255, 0.163)";
    }
  });

  // =============== ABOUT SECTION NUMBER COUNTER ===============
  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimated = false;

  function animateNumbers() {
    statNumbers.forEach((stat) => {
      // Store original content for fallback
      const originalContent = stat.textContent;
      const finalValue = parseInt(
        stat.getAttribute("data-count") ||
          stat.textContent.replace(/[^0-9]/g, ""),
      );
      const isPercentage = originalContent.includes("%");

      // Reset to 0
      if (isPercentage) {
        stat.textContent = "0%";
      } else {
        stat.textContent = "0";
      }

      let startValue = 0;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      function updateNumber() {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        // Easing function for smoother animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        if (isPercentage) {
          const currentValue = Math.floor(easeProgress * 100);
          stat.textContent = currentValue + "%";
        } else {
          const currentValue = Math.floor(easeProgress * finalValue);
          stat.textContent = currentValue + "+";
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          // Final value
          if (isPercentage) {
            stat.textContent = "100%";
          } else {
            stat.textContent = finalValue + "+";
          }

          // Add animation class for visual feedback
          stat.classList.add("animated");
          setTimeout(() => {
            stat.classList.remove("animated");
          }, 500);
        }
      }

      updateNumber();
    });
  }

  // Intersection Observer for about section animation
  const aboutSection = document.getElementById("about");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateNumbers();
          hasAnimated = true;
          console.log("Animation triggered via IntersectionObserver");
        }
      });
    },
    {
      threshold: 0.2, // Reduced threshold for mobile
      rootMargin: "0px 0px -100px 0px", // Adjusted for better mobile detection
    },
  );

  // Also add scroll event listener as fallback for older browsers
  let hasAnimatedScroll = false;
  function checkScroll() {
    if (hasAnimatedScroll || hasAnimated) return;

    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;

    const sectionRect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If section is in viewport (top is less than 80% of viewport height)
    if (sectionRect.top < windowHeight * 0.8 && sectionRect.bottom > 0) {
      animateNumbers();
      hasAnimatedScroll = true;
      hasAnimated = true;
      console.log("Animation triggered via scroll fallback");
      window.removeEventListener("scroll", checkScroll);
    }
  }

  // Initialize
  if (aboutSection) {
    // Debug info
    console.log("About section found:", aboutSection);
    console.log("Stat numbers found:", statNumbers.length);

    // Use IntersectionObserver (modern browsers)
    observer.observe(aboutSection);

    // Fallback for devices that don't support IntersectionObserver well
    window.addEventListener("scroll", checkScroll);

    // Also check on page load in case section is already visible
    setTimeout(checkScroll, 100);

    // Additional mobile touch/scroll detection
    window.addEventListener("touchmove", checkScroll);

    // Check after 1 second as well for slower loading pages
    setTimeout(() => {
      if (!hasAnimated) {
        checkScroll();
      }
    }, 1000);
  } else {
    console.error("About section not found!");
  }

  // Force animation on DOMContentLoaded if section is visible
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(checkScroll, 300);
  });

  // Optional: Add a button to manually trigger animation for testing
  // Remove this in production
  function triggerAnimationManually() {
    if (!hasAnimated) {
      animateNumbers();
      hasAnimated = true;
      console.log("Animation manually triggered");
    }
  }

  // For testing purposes - you can call triggerAnimationManually() from console
  window.debugAnimation = triggerAnimationManually;
  // =============== PROJECT CARD HOVER EFFECTS ===============
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // =============== FORM VALIDATION AND SUBMISSION ===============
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, textarea");

    // Add focus effects
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value.trim()) {
          this.parentElement.classList.remove("focused");
        }
      });

      // Add floating label effect on input
      input.addEventListener("input", function () {
        if (this.value.trim()) {
          this.parentElement.classList.add("has-value");
        } else {
          this.parentElement.classList.remove("has-value");
        }
      });
    });

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      // Validation
      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        console.log("data .....", name, email, subject, message);
        // API call  actual API intrigreation

        await submitToGoogleSheet({
          name: name,
          email: email,
          subject: subject,
          message: message,
        });

        // Success
        showNotification(
          "🎉 Message sent successfully! I'll get back to you soon.",
          "success",
        );
        contactForm.reset();

        // Remove has-value class after reset
        inputs.forEach((input) => {
          input.parentElement.classList.remove("has-value", "focused");
        });
      } catch (error) {
        showNotification(
          "😞 Failed to send message. Please try again or contact me directly.",
          "error",
        );
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // =============== NOTIFICATION SYSTEM ===============
  function showNotification(message, type = "success") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 10);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      clearTimeout(autoRemove);
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });
  }

  // =============== UTILITY FUNCTIONS ===============
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function submitToGoogleSheet(data) {
    console.log("data received:", data);

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzB3CY6gpNvXwBJY2N4zLxOuIeRdhNHZTWCrQpqnaR69JyhefIJv08tkd2AGi6FOdQp/exec";

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    // ✅ Debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(scriptURL, {
      method: "POST",
      body: formData, // ✅ CORRECT
    });
    console.log("respose ....", res);

    if (!res.ok) {
      throw new Error("Failed to submit form");
    }

    return await res.text();
  }

  const skillCards = document.querySelectorAll(".skill-card");

  skillCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("animate-on-scroll");
  });

  // Observe skills for animation
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  skillCards.forEach((card) => skillsObserver.observe(card));

  // =============== TOUCH OPTIMIZATION ===============
  if ("ontouchstart" in window) {
    document.documentElement.classList.add("touch-device");

    // Better touch feedback
    const touchElements = document.querySelectorAll(
      ".btn-primary, .btn-secondary, .skill-card, .project-card, .nav-link",
    );

    touchElements.forEach((element) => {
      element.addEventListener(
        "touchstart",
        function () {
          this.classList.add("touch-active");
        },
        { passive: true },
      );

      element.addEventListener(
        "touchend",
        function () {
          this.classList.remove("touch-active");
        },
        { passive: true },
      );
    });
  }

  // =============== LAZY LOAD IMAGES ===============
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // =============== CURRENT YEAR IN FOOTER ===============
  const yearSpan = document.querySelector(".current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =============== BACK TO TOP BUTTON ===============
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.className = "back-to-top";
  backToTopBtn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // =============== ACTIVE NAV LINK ON SCROLL ===============
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // =============== CONFIGURATION DATA ===============

  console.log("JS Loaded");

  document.querySelector(".developer-title").innerText =
    portfolioConfig.personal.role;

 
  document.querySelector(".hero-description").innerText =
    portfolioConfig.personal.tagline;
  


  document.querySelector(".contact-me-btn").href =
    portfolioConfig.personal.whatsappLink;

  // Set profile image and logo

  document.querySelector(".profile-img").src =
    portfolioConfig.personal.profileImage;
  
  document.querySelector(".profile-img").alt =
    portfolioConfig.personal.name;

  document.querySelector(".logo img").src = portfolioConfig.personal.logo;
  document.querySelector(".logo img").alt = portfolioConfig.personal.name + " Logo";

  document.querySelector(".nav-link.mobile-cv").href = portfolioConfig.personal.resumeLink;
  document.querySelector(".btn-secondary.contact-me-btn").href = portfolioConfig.personal.whatsappLink;


  // project

  const projectsGrid = document.querySelector(".projects-grid");

  projectsGrid.innerHTML = portfolioConfig.projects
    .map(
      (project) => `
    <div class="project-card">
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}">
        <div class="project-badge">${project.type}</div>
        <div class="project-links">
          <a href="${project.liveLink}" target="_blank" class="live-link">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        </div>
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-stack">
          ${project.tech.map((t) => `<span>${t}</span>`).join("")}
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  // contact info

  document.querySelector(".contact-info .email").innerText =
    portfolioConfig.contact.email;
  
  document.querySelector(".contact-info .phone").innerText =
    portfolioConfig.contact.phone;
  
  document.querySelector(".contact-info .location").innerText =
    portfolioConfig.contact.location;
 document.querySelector(".social-links-compact .fa-linkedin").parentElement.href =   
    portfolioConfig.contact.linkedin;

  document.querySelector(".social-links-compact .fa-github").parentElement.href = 
    portfolioConfig.contact.github;

  document.querySelector(".social-links-compact .fa-whatsapp").parentElement.href = 
    portfolioConfig.contact.whatsapp;


    // footer info 

   document.querySelector(".footer .creator").innerText =
    portfolioConfig.footer.credit;

   document.querySelector(".footer .visit").innerText =
    portfolioConfig.footer.message;
});

// =============== ADDITIONAL CSS FOR JS FEATURES ===============
const additionalStyles = `
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-family: var(--font-body);
        font-weight: 500;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        max-width: 350px;
        transform: translateX(150%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.error {
        background: #ff4757;
    }
    
    .notification.success {
        background: var(--primary-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
    }
    
    /* Back to Top Button */
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 100;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(141, 24, 231, 0.4);
    }
    
    .back-to-top.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .back-to-top:hover {
        background: var(--primary-dark);
        transform: translateY(-5px);
        box-shadow: 0 6px 20px rgba(141, 24, 231, 0.6);
    }
    
    /* Form Focus States */
    .input-group.focused label {
        color: var(--primary-color) !important;
        transform: translateY(-25px) scale(0.85) !important;
    }
    
    .input-group.has-value label {
        transform: translateY(-25px) scale(0.85) !important;
    }
    
    /* Skill Animation */
    .skill-card.animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .skill-card.animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Touch Feedback */
    .touch-device .touch-active {
        opacity: 0.9;
        transform: scale(0.98);
    }
    
    /* Loading Animation */
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Scroll Progress Bar */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
        z-index: 1001;
        transition: width 0.1s ease;
    }
    
    /* Mobile Menu Animation */
    .nav {
        transition: transform 0.4s cubic-bezier(0.77, 0.2, 0.05, 1.0);
    }
    
    /* Number Counter Animation */
    .stat-number {
        display: inline-block;
        transition: transform 0.3s ease;
    }
    
    .stat-number.animating {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Add scroll progress bar
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (window.pageYOffset / windowHeight) * 100;
  progressBar.style.width = scrolled + "%";
});

// Prevent scrolling when mobile menu is open
const originalBodyOverflow = document.body.style.overflow;

window.addEventListener("resize", () => {
  const nav = document.querySelector(".nav");
  const hamburger = document.getElementById("hamburger");

  if (window.innerWidth > 768 && nav.classList.contains("active")) {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
    document.body.style.overflow = originalBodyOverflow;
  }
});
