const userInfo = document.getElementById('userInfo');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const servicesGrid = document.getElementById('servicesGrid');
const bookingModal = document.getElementById('bookingModal');
const modalServiceName = document.getElementById('modalServiceName');
const bookingServiceId = document.getElementById('bookingServiceId');
const bookingForm = document.getElementById('bookingForm');
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const bookingNotes = document.getElementById('bookingNotes');
const bookingName = document.getElementById('bookingName');
const bookingEmail = document.getElementById('bookingEmail');

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  bookingDate.min = today;
}

function checkAuth() {
  fetch('/api/me', { credentials: 'include' })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      userInfo.textContent = data.user.email;
      userInfo.classList.remove('hidden');
      loginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
    })
    .catch(() => {
      userInfo.classList.add('hidden');
      loginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
    });
}

function loadServices() {
  fetch('/api/services')
    .then((r) => r.json())
    .then((list) => {
      servicesGrid.innerHTML = list
        .map(
          (s) => `
        <article class="service-card" data-id="${s.id}" data-name="${s.name}">
          <h3>${s.name}</h3>
          <div class="meta">${s.duration}</div>
          <div class="price">$${s.price}</div>
          <button type="button" class="btn btn-primary book-btn">Book now</button>
        </article>
      `
        )
        .join('');

      servicesGrid.querySelectorAll('.book-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const card = btn.closest('.service-card');
          openBookingModal(card.dataset.id, card.dataset.name);
        });
      });
    })
    .catch(() => showToast('Could not load services', 'error'));
}

function openBookingModal(serviceId, serviceName) {
  // Check if user is logged in and pre-fill form
  fetch('/api/me', { credentials: 'include' })
    .then((r) => {
      if (r.ok) {
        return r.json().then((data) => {
          // Pre-fill email and name if logged in
          bookingEmail.value = data.user.email || '';
          bookingName.value = data.user.name || '';
        });
      }
      // Not logged in - clear fields
      bookingEmail.value = '';
      bookingName.value = '';
    })
    .catch(() => {
      // Not logged in - clear fields
      bookingEmail.value = '';
      bookingName.value = '';
    })
    .finally(() => {
      modalServiceName.textContent = serviceName;
      bookingServiceId.value = serviceId;
      setMinDate();
      bookingModal.classList.remove('hidden');
    });
}

function closeModal() {
  bookingModal.classList.add('hidden');
}

bookingModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
bookingModal.querySelector('.modal-close').addEventListener('click', closeModal);
bookingModal.querySelector('.cancel-btn').addEventListener('click', closeModal);

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const payload = {
    serviceId: bookingServiceId.value,
    email: bookingEmail.value.trim(),
    name: bookingName.value.trim(),
    date: bookingDate.value,
    time: bookingTime.value,
    notes: bookingNotes.value.trim(),
  };
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
    .then((r) => {
      if (!r.ok) return r.json().then((d) => Promise.reject(d));
      return r.json();
    })
    .then(() => {
      closeModal();
      bookingForm.reset();
      showToast('Booking confirmed! Check your email for confirmation.');
    })
    .catch((err) => showToast(err.error || 'Booking failed', 'error'));
});

loginBtn.addEventListener('click', () => {
  window.location.href = '/auth/google';
});

logoutBtn.addEventListener('click', () => {
  fetch('/api/logout', { method: 'POST', credentials: 'include' })
    .then(() => {
      checkAuth();
      showToast('Logged out');
    });
});

// Show error from query string (e.g. ?error=email_failed)
const params = new URLSearchParams(location.search);
if (params.get('error') === 'email_failed') {
  showToast('Could not send verification email. Try again.', 'error');
  history.replaceState({}, '', location.pathname);
}

checkAuth();
loadServices();
setMinDate();
