/* ==============================
   Customer Registration JS
   ============================== */

let currentStep = 1;
let uploadedPhotoBase64 = null;

function previewRegPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedPhotoBase64 = e.target.result;
    const preview = document.getElementById('regPhotoPreview');
    if (preview) preview.src = uploadedPhotoBase64;
  };
  reader.readAsDataURL(file);
}

// --- Step Navigation ---
function updateStepIndicators(step) {
  const indicators = ['step1Indicator', 'step2Indicator', 'step3Indicator'];
  const lines = ['line1', 'line2'];

  indicators.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (idx + 1 < step) el.classList.add('done');
    else if (idx + 1 === step) el.classList.add('active');
  });

  lines.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (idx + 1 < step) el.classList.add('done');
    else el.classList.remove('done');
  });
}

function showStep(n) {
  document.getElementById('formStep1')?.style.setProperty('display', n === 1 ? 'block' : 'none');
  document.getElementById('formStep2')?.style.setProperty('display', n === 2 ? 'block' : 'none');
  document.getElementById('formStep3')?.style.setProperty('display', n === 3 ? 'block' : 'none');
  document.getElementById('formSuccess')?.style.setProperty('display', n === 4 ? 'block' : 'none');
  updateStepIndicators(n);
  currentStep = n;
}

// --- Validation Helpers ---
function showError(fieldId, show) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.classList[show ? 'add' : 'remove']('show');
}

function clearErrors(...ids) {
  ids.forEach(id => showError(id, false));
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// --- Step 1 Validation ---
function goToStep2() {
  clearErrors('firstName', 'lastName', 'email', 'phone', 'dob', 'aadhar', 'address');
  let valid = true;

  if (!getVal('firstName')) { showError('firstName', true); valid = false; }
  if (!getVal('lastName')) { showError('lastName', true); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getVal('email'))) { showError('email', true); valid = false; }
  const phone = getVal('phone').replace(/\D/g, '');
  if (phone.length < 10) { showError('phone', true); valid = false; }
  if (!getVal('dob')) { showError('dob', true); valid = false; }
  const aadhar = getVal('aadhar').replace(/\s/g, '');
  if (aadhar.length !== 12 || !/^\d+$/.test(aadhar)) { showError('aadhar', true); valid = false; }
  if (!getVal('address')) { showError('address', true); valid = false; }

  if (valid) {
    showStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function goToStep1() {
  showStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Step 2 Validation ---
function goToStep3() {
  clearErrors('bankName', 'accountNumber', 'confirmAccount', 'ifsc');
  let valid = true;

  if (!getVal('bankName')) { showError('bankName', true); valid = false; }
  if (!getVal('accountNumber')) { showError('accountNumber', true); valid = false; }
  if (getVal('accountNumber') !== getVal('confirmAccount')) { showError('confirmAccount', true); valid = false; }
  const ifsc = getVal('ifsc');
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) { showError('ifsc', true); valid = false; }

  if (valid) {
    showStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --- Step 3 Validation & Submit ---
function getPin() {
  return ['pin1','pin2','pin3','pin4'].map(id => getVal(id)).join('');
}

function submitRegistration() {
  clearErrors('password', 'confirmPassword');
  const pinEl = document.getElementById('pinError');
  const termsEl = document.getElementById('termsError');
  if (pinEl) pinEl.classList.remove('show');
  if (termsEl) termsEl.classList.remove('show');

  let valid = true;

  const pwd = getVal('password');
  if (pwd.length < 8 || !/\d/.test(pwd)) { showError('password', true); valid = false; }
  if (pwd !== getVal('confirmPassword')) { showError('confirmPassword', true); valid = false; }

  const pin = getPin();
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    if (pinEl) pinEl.classList.add('show');
    valid = false;
  }

  const termsChecked = document.getElementById('termsCheck')?.checked;
  if (!termsChecked) {
    if (termsEl) termsEl.classList.add('show');
    valid = false;
  }

  if (valid) {
    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6-8.5"/></svg> Creating Account...`;
    }

    // Save to localStorage for demo
    const userData = {
      firstName: getVal('firstName'),
      lastName: getVal('lastName'),
      email: getVal('email'),
      phone: getVal('phone'),
      type: 'customer',
      registered: new Date().toISOString()
    };
    localStorage.setItem('biopay_user', JSON.stringify(userData));
    localStorage.setItem('biopay_logged_in', 'true');
    localStorage.setItem('biopay_user_type', 'customer');
    if (uploadedPhotoBase64) {
      localStorage.setItem('biopay_member_photo', uploadedPhotoBase64);
    }

    setTimeout(() => {
      showStep(4);
      // Reset step indicators to show all done
      ['step1Indicator','step2Indicator','step3Indicator'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.remove('active'); el.classList.add('done'); }
      });
      ['line1','line2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('done');
      });
    }, 2000);
  }
}

// --- Password Strength ---
const passwordInput = document.getElementById('password');
if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const meter = document.getElementById('strengthMeter');
    if (meter) meter.style.display = val.length > 0 ? 'block' : 'none';

    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(val)) strength++;

    const bars = ['sBar1','sBar2','sBar3','sBar4'];
    const colors = ['#EF4444','#F59E0B','#3B82F6','#10B981'];
    const labels = ['','Weak','Fair','Strong','Very Strong'];

    bars.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.background = idx < strength ? colors[strength - 1] : 'var(--border)';
    });

    const labelEl = document.getElementById('strengthLabel');
    if (labelEl) {
      labelEl.textContent = labels[strength] || '';
      labelEl.style.color = colors[strength - 1] || 'var(--text-muted)';
    }
  });
}

// --- PIN Input Auto-focus ---
['pin1','pin2','pin3','pin4'].forEach((id, idx, arr) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    if (el.value.length === 1 && idx < arr.length - 1) {
      document.getElementById(arr[idx + 1])?.focus();
    }
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !el.value && idx > 0) {
      document.getElementById(arr[idx - 1])?.focus();
    }
  });
});

// --- Aadhaar auto-format ---
const aadharInput = document.getElementById('aadhar');
if (aadharInput) {
  aadharInput.addEventListener('input', () => {
    let val = aadharInput.value.replace(/\D/g, '').slice(0, 12);
    aadharInput.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
  });
}

// IFSC uppercase
const ifscInput = document.getElementById('ifsc');
if (ifscInput) {
  ifscInput.addEventListener('input', () => {
    ifscInput.value = ifscInput.value.toUpperCase();
  });
}

// Password toggle
function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// Spin animation style
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
