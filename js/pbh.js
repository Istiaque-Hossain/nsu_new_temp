(function ($) {
  "use strict";

  // Slick carousel initialization
  $(document).ready(function () {
    $(".dept-banner").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      arrows: true,
      dots: false,
      fade: true,
      speed: 800,
      pauseOnHover: true,
      adaptiveHeight: true,
      prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
      nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right"></i></button>',
    });
  });

  // Department navigation functionality
  document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.querySelector(".department-nav-toggle");
    const navLinks = document.querySelector(".department-nav-links");
    const navItems = document.querySelectorAll(".nav-link-item");
    const deptNavSection = document.querySelector(".department-nav-section");
    const mainNav = document.querySelector(".navbar.sticky-top");

    if (!deptNavSection || !mainNav) return;

    let deptNavOriginalTop = 0;
    let deptNavHeight = 0;
    let isSticky = false;
    let placeholder = null;

    // Initialize original position
    function calculateOriginalPosition() {
      deptNavSection.classList.remove("is-sticky");
      deptNavSection.style.cssText = "";

      if (placeholder?.parentNode) {
        placeholder.remove();
        placeholder = null;
      }

      const rect = deptNavSection.getBoundingClientRect();
      deptNavOriginalTop = rect.top + window.pageYOffset;
      deptNavHeight = rect.height;
    }

    // Handle sticky navigation behavior
    function handleStickyNav() {
      const scrollY = window.pageYOffset;
      const mainNavHeight = mainNav.offsetHeight;
      const mainNavVisible = scrollY > 300;
      const passedDeptNav = scrollY > deptNavOriginalTop;
      const shouldBeSticky = mainNavVisible && passedDeptNav;

      if (shouldBeSticky && !isSticky) {
        isSticky = true;

        // Create and insert placeholder
        if (!placeholder) {
          placeholder = document.createElement("div");
          placeholder.style.height = `${deptNavHeight}px`;
          placeholder.className = "dept-nav-placeholder";
        }
        deptNavSection.parentNode.insertBefore(placeholder, deptNavSection);

        // Apply sticky positioning
        deptNavSection.classList.add("is-sticky");
        deptNavSection.style.cssText = "position: fixed; top: -100px; width: 100%; left: 0; z-index: 999;";

        // Slide in animation
        requestAnimationFrame(() => {
          deptNavSection.style.top = `${mainNavHeight}px`;
        });
      } else if (!shouldBeSticky && isSticky) {
        isSticky = false;

        placeholder?.remove();
        placeholder = null;

        deptNavSection.classList.remove("is-sticky");
        deptNavSection.style.cssText = "";
      }
    }

    // Mobile menu toggle
    navToggle?.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
    });

    // Close menu on nav item click (mobile)
    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        if (window.innerWidth <= 992) {
          navToggle.classList.remove("active");
          navLinks.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    // Active section highlighting on scroll
    let scrollTimeout;
    window.addEventListener("scroll", function () {
      handleStickyNav();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = document.querySelectorAll("section[id]");
        let current = "";

        sections.forEach((section) => {
          if (window.pageYOffset >= section.offsetTop - 150) {
            current = section.getAttribute("id");
          }
        });

        navItems.forEach((item) => {
          item.classList.remove("active");
          const href = item.getAttribute("href");
          if (href === `#${current}` || (window.pageYOffset < 300 && href === "#")) {
            item.classList.add("active");
          }
        });
      }, 50);
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener("click", function (event) {
      if (window.innerWidth <= 992 && navLinks.classList.contains("active")) {
        if (!event.target.closest(".department-navbar")) {
          navToggle.classList.remove("active");
          navLinks.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 992) {
          navToggle.classList.remove("active");
          navLinks.classList.remove("active");
          document.body.style.overflow = "";
        }

        isSticky = false;
        placeholder?.remove();
        placeholder = null;

        calculateOriginalPosition();
        handleStickyNav();
      }, 250);
    });

    // Initialize on load
    window.addEventListener("load", () => {
      setTimeout(calculateOriginalPosition, 200);
    });
  });
})(jQuery);
