const body = document.body;
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const progressLine = document.getElementById("progressLine");
const cursorGlow = document.getElementById("cursorGlow");
const typedText = document.getElementById("typedText");
const themeButtons = document.querySelectorAll("[data-theme-set]");
const yearEl = document.getElementById("year");
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

/* LOADER */
window.addEventListener("load", () => {
  setTimeout(() => {
    body.classList.add("loaded");
  }, 400);
});

/* YEAR */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* MOBILE NAV */
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
    body.classList.toggle("menu-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
    });
  });
}

/* REVEAL */
const revealItems = document.querySelectorAll(".reveal, .reveal-card");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ACTIVE NAV */
const sections = document.querySelectorAll("section[id]");
const menuLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 140;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  menuLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);

/* PROGRESS LINE */
function updateProgressLine() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressLine) {
    progressLine.style.width = `${progress}%`;
  }
}

window.addEventListener("scroll", updateProgressLine);

/* TYPING EFFECT */
const words = [
  "software engineering",
  "automation",
  "Linux environments",
  "interactive digital products",
  "real-world engineering solutions"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedText) return;

  const currentWord = words[wordIndex];
  typedText.textContent = currentWord.slice(0, charIndex);

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(typeLoop, 75);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 42);
  } else {
    isDeleting = !isDeleting;

    if (!isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeLoop, isDeleting ? 1100 : 250);
  }
}

typeLoop();

/* CURSOR GLOW */
if (cursorGlow && window.innerWidth > 900) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

/* TILT */
const tiltItems = document.querySelectorAll(".tilt");

tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 900) return;

    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    item.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

/* MAGNETIC */
const magneticItems = document.querySelectorAll(".magnetic");

magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    if (window.innerWidth <= 900) return;

    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translate(0, 0)";
  });
});

/* PROJECT FILTER */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";

      if (filter === "all" || categories.includes(filter)) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/* THEMES */
function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme && ["aurora", "ocean", "gold"].includes(savedTheme)) {
  setTheme(savedTheme);
} else {
  setTheme("aurora");
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.themeSet;
    if (theme) {
      setTheme(theme);
    }
  });
});

/* PARTICLES CANVAS */
if (canvas && ctx) {
  let width = 0;
  let height = 0;
  let particles = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function getAccentColor() {
    const styles = getComputedStyle(document.body);
    return styles.getPropertyValue("--accent").trim() || "#8b5cf6";
  }

  function createParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 28 : 48;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    const accent = getAccentColor();

    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      for (let j = index + 1; j < particles.length; j++) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.08;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

/* INIT */
updateActiveNav();
updateProgressLine();
