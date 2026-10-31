/* ==============================
   Login JS
   ============================== */

let loginType = 'customer';

function switchType(type) {
  loginType = type;
  document.getElementById('toggleCustomer').classList[type === 'customer' ? 'add' : 'remove']('active');
  document.getElementById('toggleVendor').classList[type === 'vendor' ? 'add' : 'remove']('active');
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function showFieldError(id, show) {
  const el = document.getElementById(id + 'Error');
  if (el) el.classList[show ? 'add' : 'remove']('show');
}

function doLogin() {
  const loginError = document.getElementById('loginError');
  showFieldError('loginEmail', false);
  showFieldError('loginPassword', false);
  if (loginError) loginError.style.display = 'none';

  let valid = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getVal('loginEmail'))) {
    showFieldError('loginEmail', true);
    valid = false;
  }

  if (!getVal('loginPassword')) {
    showFieldError('loginPassword', true);
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('loginBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6-8.5"/></svg> Authenticating...`;
  }

  setTimeout(() => {
    // Demo credentials check
    const email = getVal('loginEmail');
    const password = getVal('loginPassword');

    // Demo: any well-formed email + password >= 6 chars = success
    if (email.length > 5 && password.length >= 6) {
      localStorage.setItem('biopay_logged_in', 'true');
      localStorage.setItem('biopay_user_type', loginType);

      if (loginType === 'vendor') {
        window.location.href = 'dashboard-vendor.html';
      } else {
        window.location.href = 'dashboard-customer.html';
      }
    } else {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Login to BioPay <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>`;
      }
      if (loginError) {
        loginError.style.display = 'flex';
        document.getElementById('loginErrorText').textContent = 'Invalid credentials. Please try again.';
      }
    }
  }, 1800);
}

function googleLogin() {
  alert('Google Sign-In integration would be configured here with Firebase Auth or Google OAuth.');
}

function aadharLogin() {
  alert('Aadhaar OTP login would be implemented via the UIDAI API (DigiLocker integration).');
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// Enter key login
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});

const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
