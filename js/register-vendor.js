/* ==============================
   Vendor Registration JS
   ============================== */

let selectedPlan = null;

function selectPlan(plan) {
  selectedPlan = plan;
  document.getElementById('planError')?.style.setProperty('display', 'none');
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function showError(fieldId, show) {
  const el = document.getElementById(fieldId + 'Error');
  if (el) el.classList[show ? 'add' : 'remove']('show');
}

function clearErrors(...ids) {
  ids.forEach(id => showError(id, false));
}

function updateStepIndicators(step) {
  const indicators = ['vStep1Indicator','vStep2Indicator','vStep3Indicator'];
  const lines = ['vLine1','vLine2'];

  indicators.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active','done');
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

function showVStep(n) {
  ['vFormStep1','vFormStep2','vFormStep3','vFormSuccess'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (idx === n - 1) ? 'block' : 'none';
  });
  updateStepIndicators(Math.min(n, 3));
}

// Step 1 → 2
function vGoToStep2() {
  clearErrors('vBusinessName','vBusinessType','vGstin','vBusinessAddress','vOwnerName','vPhone','vEmail');
  let valid = true;

  if (!getVal('vBusinessName')) { showError('vBusinessName', true); valid = false; }
  if (!getVal('vBusinessType')) { showError('vBusinessType', true); valid = false; }
  if (!getVal('vBusinessAddress')) { showError('vBusinessAddress', true); valid = false; }
  if (!getVal('vOwnerName')) { showError('vOwnerName', true); valid = false; }
  const phone = getVal('vPhone').replace(/\D/g,'');
  if (phone.length < 10) { showError('vPhone', true); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getVal('vEmail'))) { showError('vEmail', true); valid = false; }

  if (valid) {
    showVStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function vGoToStep1() {
  showVStep(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Step 2 → 3
function vGoToStep3() {
  clearErrors('vBankName','vAccountNumber','vIfsc');
  let valid = true;

  if (!getVal('vBankName')) { showError('vBankName', true); valid = false; }
  if (!getVal('vAccountNumber')) { showError('vAccountNumber', true); valid = false; }
  const ifsc = getVal('vIfsc');
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) { showError('vIfsc', true); valid = false; }

  if (!selectedPlan) {
    const planErr = document.getElementById('planError');
    if (planErr) planErr.style.display = 'block';
    valid = false;
  }

  if (valid) {
    showVStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function vGoToStep2() {
  showVStep(2);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Submit
function vSubmitRegistration() {
  clearErrors('vPassword','vConfirmPassword');
  const termsEl = document.getElementById('vTermsError');
  if (termsEl) termsEl.classList.remove('show');

  let valid = true;

  const pwd = getVal('vPassword');
  if (pwd.length < 8) { showError('vPassword', true); valid = false; }
  if (pwd !== getVal('vConfirmPassword')) { showError('vConfirmPassword', true); valid = false; }

  if (!document.getElementById('vTermsCheck')?.checked) {
    if (termsEl) termsEl.classList.add('show');
    valid = false;
  }

  if (valid) {
    const btn = document.getElementById('vSubmitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6-8.5"/></svg> Registering Business...`;
    }

    const vendorData = {
      businessName: getVal('vBusinessName'),
      email: getVal('vEmail'),
      plan: selectedPlan,
      type: 'vendor',
      registered: new Date().toISOString()
    };
    localStorage.setItem('biopay_user', JSON.stringify(vendorData));
    localStorage.setItem('biopay_logged_in', 'true');
    localStorage.setItem('biopay_user_type', 'vendor');

    setTimeout(() => {
      showVStep(4);
    }, 2000);
  }
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// IFSC uppercase
const vIfscInput = document.getElementById('vIfsc');
if (vIfscInput) {
  vIfscInput.addEventListener('input', () => {
    vIfscInput.value = vIfscInput.value.toUpperCase();
  });
}

const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
