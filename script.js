const slides = Array.from(document.querySelectorAll("[data-slide]"));
const dotWrap = document.querySelector("[data-dots]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const testimonialHost = document.querySelector("[data-testimonial]");
const testimonialTemplate = document.querySelector("#testimonial-template");
const testPrev = document.querySelector("[data-test-prev]");
const testNext = document.querySelector("[data-test-next]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const galleryItems = Array.from(document.querySelectorAll("[data-category]"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxClose = document.querySelector(".lightbox-close");

const testimonials = [
  {
    quote: "My child has become more confident, expressive, and eager to learn. The teachers are approachable and the campus feels warm and safe.",
    name: "Mrs. Priya S.",
    role: "Parent of Grade III student"
  },
  {
    quote: "The school balances academics and activities beautifully. We see visible growth in discipline, communication, and social confidence.",
    name: "Mr. Rakesh M.",
    role: "Parent of Grade VII student"
  },
  {
    quote: "The kindergarten environment is joyful and thoughtful. Our daughter settled in quickly and now loves coming to school every day.",
    name: "Mrs. Anitha K.",
    role: "Parent of Pre-KG student"
  }
];

let currentSlide = 0;
let testimonialIndex = 0;
let slideTimer;
let testimonialTimer;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === currentSlide));
  if (dotWrap) {
    Array.from(dotWrap.children).forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentSlide));
  }
}

function buildDots() {
  if (!dotWrap) return;
  dotWrap.innerHTML = slides.map((_, index) => `<button type="button" aria-label="Go to slide ${index + 1}"></button>`).join("");
  Array.from(dotWrap.children).forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetSlideTimer();
    });
  });
}

function resetSlideTimer() {
  if (!slides.length) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(currentSlide + 1), 6500);
}

function renderTestimonial(index) {
  if (!testimonialHost || !testimonialTemplate) return;
  const testimonial = testimonials[(index + testimonials.length) % testimonials.length];
  const fragment = testimonialTemplate.content.cloneNode(true);
  fragment.querySelector("[data-quote]").textContent = testimonial.quote;
  fragment.querySelector("[data-name]").textContent = testimonial.name;
  fragment.querySelector("[data-role]").textContent = testimonial.role;
  testimonialHost.replaceChildren(fragment);
}

function resetTestimonialTimer() {
  if (!testimonialHost || !testimonialTemplate) return;
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    testimonialIndex += 1;
    renderTestimonial(testimonialIndex);
  }, 7000);
}

function openLightbox(src, alt) {
  if (!src || src.startsWith("file:") || !lightbox || !lightboxImg) {
    return;
  }
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = "";
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const duration = 1300;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * progress).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  // Stagger reveal timings inside visual groups so cards animate sequentially.
  const groupedContainers = document.querySelectorAll(
    ".card-grid, .stats-grid, .message-grid, .admission-grid, .news-grid, .timeline, .gallery-grid, .contact-grid, .form-grid, .testimonial-shell"
  );

  groupedContainers.forEach((container) => {
    const groupedItems = container.querySelectorAll(".reveal");
    groupedItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index, 6) * 90}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
}

function filterGallery(category) {
  galleryItems.forEach((item) => {
    const matches = category === "all" || item.dataset.category === category;
    item.style.display = matches ? "block" : "none";
  });
}

function setupGallery() {
  if (!filterButtons.length || !galleryItems.length) return;
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      filterGallery(button.dataset.filter);
    });
  });

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item.dataset.full, item.querySelector("img").alt));
  });
}

function setupMobileNav() {
  if (!navToggle || !navLinks) return;
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("is-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  closeLightbox();

  if (slides.length) {
    buildDots();
    showSlide(0);
    resetSlideTimer();
  }

  if (testimonialHost && testimonialTemplate) {
    renderTestimonial(0);
    resetTestimonialTimer();
  }

  setupMobileNav();
  setupGallery();
  animateCounters();
  setupRevealAnimations();

  prevButton?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    resetSlideTimer();
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    resetSlideTimer();
  });

  if (testimonialHost && testimonialTemplate) {
    testPrev?.addEventListener("click", () => {
      testimonialIndex -= 1;
      renderTestimonial(testimonialIndex);
      resetTestimonialTimer();
    });

    testNext?.addEventListener("click", () => {
      testimonialIndex += 1;
      renderTestimonial(testimonialIndex);
      resetTestimonialTimer();
    });
  }

  document.querySelector("#enquiry-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Admission enquiry from ${data.get("name")}`);
    const body = encodeURIComponent([
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Grade: ${data.get("grade")}`,
      `Message: ${data.get("message")}`
    ].join("\n"));
    window.location.href = `mailto:hillfortcbseschool2015@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });

  document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Contact form from ${data.get("name")}`);
    const body = encodeURIComponent([
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Message: ${data.get("message")}`
    ].join("\n"));
    window.location.href = `mailto:hillfortcbseschool2015@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });

  document.querySelector("#newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    alert(`Thanks for subscribing, ${input.value}. We'll keep you updated.`);
    event.currentTarget.reset();
  });

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightboxClose) {
      closeLightbox();
    }
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
