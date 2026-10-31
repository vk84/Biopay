/* ==============================
   Customer Dashboard JS
   ============================== */

// --- Dynamic View Router ---
const navToViewMap = {
  navOverview: 'viewOverview',
  navTransactions: 'viewTransactions',
  navBankAccounts: 'viewBankAccounts',
  navFingerprint: 'viewFingerprint',
  navProfile: 'viewProfile',
  navSecurity: 'viewSecurity',
  navNotifications: 'viewNotifications',
  navAbout: 'viewAbout'
};

function switchCustomerTab(navId) {
  // Update Nav Links
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = document.getElementById(navId);
  if (activeNav) activeNav.classList.add('active');

  // Switch View Container
  const targetViewId = navToViewMap[navId];
  document.querySelectorAll('.dashboard-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(targetViewId);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Trigger animations if navigating back to overview
  if (navId === 'navOverview') {
    animateCharts();
  }
}

// Bind all sidebar nav links
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(navToViewMap).forEach(navId => {
    const el = document.getElementById(navId);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        switchCustomerTab(navId);
      });
    }
  });

  // Load user name & member photo from localStorage if registered
  const savedUser = localStorage.getItem('biopay_user');
  if (savedUser) {
    try {
      const u = JSON.parse(savedUser);
      if (u.firstName) {
        const headerName = document.querySelector('.page-header h1');
        if (headerName) headerName.textContent = `Good Morning, ${u.firstName} 👋`;
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName) sidebarName.textContent = `${u.firstName} ${u.lastName || ''}`;
        const profName = document.getElementById('profilePhotoName');
        if (profName) profName.textContent = `${u.firstName} ${u.lastName || ''}`;
      }
    } catch (e) {}
  }

  // Load saved member photo
  const savedPhoto = localStorage.getItem('biopay_member_photo');
  if (savedPhoto) {
    updateMemberPhotoDisplay(savedPhoto);
  }
});

// --- Member Photo Management ---
function updateMemberPhotoDisplay(imgUrl) {
  const sidebarImg = document.getElementById('sidebarAvatarImg');
  const profileImg = document.getElementById('profileMainAvatar');
  if (sidebarImg) sidebarImg.src = imgUrl;
  if (profileImg) profileImg.src = imgUrl;
}

function handleMemberPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file (PNG, JPG, WebP)');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    updateMemberPhotoDisplay(dataUrl);
    localStorage.setItem('biopay_member_photo', dataUrl);
    alert('Profile photo updated successfully! Synced across your account.');
  };
  reader.readAsDataURL(file);
}

function choosePresetAvatar(url, btn) {
  document.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateMemberPhotoDisplay(url);
  localStorage.setItem('biopay_member_photo', url);
}

function resetMemberPhoto() {
  const defaultUrl = 'images/team/member-2.jpg';
  updateMemberPhotoDisplay(defaultUrl);
  localStorage.removeItem('biopay_member_photo');
  alert('Member photo reset to default avatar.');
}


// --- Payment Simulation Modal ---
function openPaymentModal() {
  document.getElementById('paymentModal').style.display = 'flex';
  document.getElementById('payStep1').style.display = 'block';
  document.getElementById('payStep2').style.display = 'none';
  document.getElementById('payStep3').style.display = 'none';
  document.getElementById('modalAmount').value = '500';
  document.getElementById('modalVendor').value = 'Sharma General Store';
}

function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

function startScan() {
  const amount = document.getElementById('modalAmount').value;
  const vendor = document.getElementById('modalVendor').value;

  if (!amount || parseFloat(amount) <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  document.getElementById('payStep1').style.display = 'none';
  document.getElementById('payStep2').style.display = 'block';

  const statusEl = document.getElementById('scanStatus');
  const messages = [
    'Scanning fingerprint sensor...',
    'Matching ISO/IEC 19794-2 template...',
    'Authenticating Aadhaar token...',
    'Debiting SBI Savings account...',
    'Confirming payment with merchant...'
  ];

  let msgIdx = 0;
  const interval = setInterval(() => {
    if (statusEl && msgIdx < messages.length) {
      statusEl.textContent = messages[msgIdx++];
    }
  }, 600);

  setTimeout(() => {
    clearInterval(interval);
    document.getElementById('payStep2').style.display = 'none';
    document.getElementById('payStep3').style.display = 'block';

    document.getElementById('payVendorName').textContent = vendor;
    document.getElementById('payAmount').textContent = '₹ ' + parseFloat(amount).toFixed(2);
    document.getElementById('payRef').textContent = 'BP' + Date.now().toString().slice(-9);
  }, 3200);
}

// --- Receipt Modal ---
function openReceipt(vendor, amount, date, status, category) {
  document.getElementById('rcptVendor').textContent = vendor;
  document.getElementById('rcptAmount').textContent = amount;
  document.getElementById('rcptDate').textContent = date;
  document.getElementById('rcptRef').textContent = 'BP-TXN-' + Math.floor(1000000 + Math.random() * 9000000);
  document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
  document.getElementById('receiptModal').style.display = 'none';
}

// --- Bank Accounts Modal & Utilities ---
function openAddBankModal() {
  document.getElementById('addBankModal').style.display = 'flex';
}

function closeAddBankModal() {
  document.getElementById('addBankModal').style.display = 'none';
}

function submitNewBank() {
  const bank = document.getElementById('newBankName').value;
  const acct = document.getElementById('newAccountNum').value.trim();
  const ifsc = document.getElementById('newIfsc').value.trim();

  if (!acct || acct.length < 8) {
    alert('Please enter a valid account number');
    return;
  }
  if (!ifsc || ifsc.length < 11) {
    alert('Please enter a valid 11-digit IFSC code');
    return;
  }

  alert(`Success! ${bank} account ending in •••• ${acct.slice(-4)} has been linked and tokenized for biometric payments.`);
  closeAddBankModal();
}

function toggleBalanceVisibility(balanceId) {
  const el = document.getElementById(balanceId);
  if (!el) return;
  if (el.dataset.hidden === 'true') {
    el.textContent = el.dataset.real;
    el.dataset.hidden = 'false';
  } else {
    el.dataset.real = el.textContent;
    el.textContent = '₹ ••••••••';
    el.dataset.hidden = 'true';
  }
}

function makeDefaultAccount(bankName) {
  alert(`${bankName} has been set as your primary biometric payment debit account.`);
}

// --- Test Scanner Modal ---
function openTestScanModal() {
  const modal = document.getElementById('testScanModal');
  const msg = document.getElementById('testScanMsg');
  modal.style.display = 'flex';
  msg.textContent = 'Connecting to Optical Sensor...';

  const steps = [
    'Optical Sensor: ONLINE',
    'Illuminating LED array (500 DPI)...',
    'Analyzing minutiae ridges...',
    'Template Match: 99.8% (FAR < 0.0001%)',
    'Diagnostic Passed! Ready for transactions ✓'
  ];

  let i = 0;
  const timer = setInterval(() => {
    if (i < steps.length) {
      msg.textContent = steps[i++];
    } else {
      clearInterval(timer);
    }
  }, 700);
}

function closeTestScanModal() {
  document.getElementById('testScanModal').style.display = 'none';
}

// --- Transactions Filter & Search ---
function filterTxnTable() {
  const query = document.getElementById('txnSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#allTxnTable tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function setTxnFilter(status, btn) {
  document.querySelectorAll('.filter-pills .filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('#allTxnTable tbody tr');
  rows.forEach(row => {
    if (status === 'all') {
      row.style.display = '';
    } else {
      row.style.display = (row.dataset.status === status) ? '' : 'none';
    }
  });
}

function exportStatement() {
  alert('Statement generating! Your password-protected PDF statement for October 2026 has been downloaded.');
}

function markAllNotificationsRead() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  const badge = document.querySelector('#navNotifications .nav-badge');
  if (badge) badge.style.display = 'none';
  alert('All notifications marked as read.');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  ['paymentModal', 'receiptModal', 'addBankModal', 'testScanModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el && e.target === el) {
      el.style.display = 'none';
    }
  });
});

// Chart animations
function animateCharts() {
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach(bar => {
    const targetH = bar.style.height || '70%';
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 1s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.height = targetH;
    }, 200);
  });
}

window.addEventListener('load', () => {
  animateCharts();
});

