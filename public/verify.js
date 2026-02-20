const form = document.getElementById('verifyForm');
const tokenInput = document.getElementById('verifyToken');
const otpInput = document.getElementById('otpInput');

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + (type || 'success');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const token = tokenInput.value.trim();
  const otp = otpInput.value.trim();
  if (!token || !otp) {
    showToast('Please enter the code from your email', 'error');
    return;
  }

  fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, otp }),
  })
    .then((r) => {
      if (!r.ok) return r.json().then((d) => Promise.reject(d));
      return r.json();
    })
    .then(() => {
      showToast('Verified! Redirecting...');
      window.location.href = '/';
    })
    .catch((err) => showToast(err.error || 'Verification failed', 'error'));
});
