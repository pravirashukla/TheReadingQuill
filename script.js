document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  if (carousel) {
    const books = carousel.querySelectorAll("img");
    const total = books.length;
    const angle = 360 / total;
    let radius = 400; // distance from center
    if (window.innerWidth <= 768) {
      radius = 180;
    }
    books.forEach((book, i) => {
      const rotation = angle * i;
      book.style.transform = `rotateY(${rotation}deg) translateZ(${radius}px)`;
    });
  }
});

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

if (togglePassword && passwordField) {
  togglePassword.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
  });
}

// Handle login form
const form = document.getElementById("loginForm");
if (form) {
  const usernameField = document.getElementById("username");
  const passwordField2 = document.getElementById("password");
  const usernameError = document.getElementById("usernameError");
  const passwordError = document.getElementById("passwordError");

  function clearError(field, errorEl) {
    field.classList.remove("invalid");
    if (errorEl) errorEl.textContent = "";
  }

  function setError(field, errorEl, message) {
    field.classList.add("invalid");
    if (errorEl) errorEl.textContent = message;
  }

  [usernameField, passwordField2].forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      const errorEl = field === usernameField ? usernameError : passwordError;
      clearError(field, errorEl);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    if (!usernameField.value.trim()) {
      setError(usernameField, usernameError, "Please enter your user name.");
      valid = false;
    } else {
      clearError(usernameField, usernameError);
    }

    if (!passwordField2.value) {
      setError(passwordField2, passwordError, "Please enter your password.");
      valid = false;
    } else if (passwordField2.value.length < 6) {
      setError(passwordField2, passwordError, "Password must be at least 6 characters.");
      valid = false;
    } else {
      clearError(passwordField2, passwordError);
    }

    if (valid) {
      // ✅ Redirect back to home page after login
      window.location.href = "index.html";
    }
  });
}
function format(command) {
  document.execCommand(command, false, null);
  document.getElementById('editor').focus();
}

document.getElementById('writeBookBtn').addEventListener('click', function() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('editorContainer').style.display = 'flex';
});