// Toggle password visibility
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// Password strength
const createPw = document.getElementById('createPassword');
const confirmPw = document.getElementById('confirmPassword');
const fill = document.getElementById('strengthFill');
const label = document.getElementById('strengthLabel');
const matchError = document.getElementById('matchError');

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

createPw.addEventListener('input', () => {
  const pw = createPw.value;
  const score = getStrength(pw);
  const pct = pw.length === 0 ? 0 : (score / 4) * 100;
  const colors = ['', '#ff6b6b', '#f5a623', '#f5e642', '#a8e063'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  fill.style.width = pct + '%';
  fill.style.background = colors[score] || '';
  label.textContent = pw.length ? labels[score] : '';
});

// Password match check
function checkMatch() {
  if (confirmPw.value.length === 0) {
    matchError.textContent = '';
    confirmPw.classList.remove('error', 'success');
    return;
  }
  if (createPw.value !== confirmPw.value) {
    matchError.textContent = 'Passwords do not match.';
    confirmPw.classList.add('error');
    confirmPw.classList.remove('success');
  } else {
    matchError.textContent = '';
    confirmPw.classList.remove('error');
    confirmPw.classList.add('success');
  }
}
confirmPw.addEventListener('input', checkMatch);
createPw.addEventListener('input', checkMatch);

// Form submit
document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const pw    = createPw.value;
  const cpw   = confirmPw.value;

  let valid = true;

  [document.getElementById('name'),
   document.getElementById('email'),
   createPw, confirmPw].forEach(f => f.classList.remove('error'));

  if (!name) { document.getElementById('name').classList.add('error'); valid = false; }
  if (!email) { document.getElementById('email').classList.add('error'); valid = false; }
  if (!pw)   { createPw.classList.add('error'); valid = false; }
  if (pw !== cpw) { confirmPw.classList.add('error'); valid = false; }

  if (valid) {
    window.location.href = 'index.html';
  }
});

// Google
document.getElementById('googleSignup').addEventListener('click', () => {
  alert('Google sign-up coming soon!');
});