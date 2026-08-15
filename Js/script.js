const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

function getSystemTheme() {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? "light" : "dark";
}

function applyTheme(theme, save = true) {
  root.dataset.theme = theme;
  if (save) localStorage.setItem("vijay-theme", theme);

  const isDark = theme === "dark";
  toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  const label = toggle.querySelector(".theme-label");
  if (label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
  toggle.classList.toggle("is-dark", isDark);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = isDark ? "#101010" : "#f7f6f2";
}

// First visit follows the visitor's browser/system timezone.
// A manual toggle becomes the saved preference until it is changed again.
const savedTheme = localStorage.getItem("vijay-theme");
applyTheme(savedTheme || getSystemTheme(), false);

toggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});

// If there is no manual preference, keep the theme aligned with local system time.
let lastAutoTheme = getSystemTheme();
setInterval(() => {
  if (!localStorage.getItem("vijay-theme")) {
    const systemTheme = getSystemTheme();
    if (systemTheme !== lastAutoTheme) {
      lastAutoTheme = systemTheme;
      applyTheme(systemTheme, false);
    }
  }
}, 60 * 1000);

menuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "×" : "☰";
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Smooth anchor navigation for browsers that respect it, without abrupt jumps.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Typewriter helper.
function startTypewriter(element, phrase, options = {}) {
  if (!element) return;
  const typeDelay = options.typeDelay ?? 90;
  const deleteDelay = options.deleteDelay ?? 55;
  const pause = options.pause ?? 1800;
  const restartPause = options.restartPause ?? 450;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = phrase;
    return;
  }

  let index = 0, deleting = false;
  function loop() {
    element.textContent = phrase.slice(0, index);
    if (!deleting) {
      index++;
      if (index > phrase.length) {
        deleting = true;
        return setTimeout(loop, pause);
      }
      return setTimeout(loop, typeDelay);
    }
    index--;
    if (index < 0) {
      index = 0;
      deleting = false;
      return setTimeout(loop, restartPause);
    }
    setTimeout(loop, deleteDelay);
  }
  loop();
}

startTypewriter(document.getElementById("typingText"), "HELLO, I'M VIJAY", {
  typeDelay: 95, deleteDelay: 55, pause: 1400, restartPause: 350
});
startTypewriter(document.getElementById("skillsTypingText"), "What I work with.", {
  typeDelay: 90, deleteDelay: 55, pause: 1800, restartPause: 450
});
startTypewriter(
  document.getElementById("contactTypingText"),
  "Not looking for a business project ? No worries — let’s just hang out over some snacks or tea. 😀☕",
  { typeDelay: 98, deleteDelay: 5, pause: 2600, restartPause: 700 }
);

// Formspree AJAX submission. Replace YOUR_FORMSPREE_ID in index.html with your real ID.
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const replyTo = document.getElementById("replyTo");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.action.includes("YOUR_FORMSPREE_ID")) {
      formStatus.textContent = "Please add your Formspree form ID in index.html first.";
      formStatus.dataset.error = "true";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const email = form.querySelector('[name="email"]');
    if (email && replyTo) replyTo.value = email.value;

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending…";
    formStatus.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      formStatus.textContent = "Thanks! Your enquiry has been sent successfully.";
      formStatus.dataset.success = "true";
    } catch (error) {
      formStatus.textContent = "Something went wrong. Please try again or email me directly.";
      formStatus.dataset.error = "true";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
}


// Keep the profile orb resilient: ImgBB share pages are not direct image files.
// If the provided share URL is changed to a direct image URL, the image will display automatically.
const orb = document.querySelector(".orb");
const orbImage = orb?.querySelector("img[data-remote-image]");
if (orbImage) {
  orbImage.addEventListener("load", () => orb?.classList.add("has-image"));
  orbImage.addEventListener("error", () => orb?.classList.remove("has-image"));
}
