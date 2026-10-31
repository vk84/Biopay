/* ==============================
   Vendor Dashboard JS
   ============================== */

// --- Dynamic Vendor View Router ---
const vNavToViewMap = {
  vNavOverview: 'vViewOverview',
  vNavTransactions: 'vViewTransactions',
  vNavAnalytics: 'vViewAnalytics',
  vNavCustomers: 'vViewCustomers',
  vNavTerminal: 'vViewTerminal',
  vNavSettlement: 'vViewSettlement',
  vNavBusiness: 'vViewBusiness',
  vNavSecurity: 'vViewSecurity',
  vNavAbout: 'vViewAbout'
};

function switchVendorTab(navId) {
  // Update nav item highlighting
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const activeNav = document.getElementById(navId);
  if (activeNav) activeNav.classList.add('active');

  // Switch view
  const targetViewId = vNavToViewMap[navId];
  document.querySelectorAll('.dashboard-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(targetViewId);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (navId === 'vNavOverview' || navId === 'vNavAnalytics') {
    animateVendorCharts();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(vNavToViewMap).forEach(navId => {
    const el = document.getElementById(navId);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        switchVendorTab(navId);
      });
    }
  });

  // Load business name if saved in localStorage
  const savedVendor = localStorage.getItem('biopay_user');
  if (savedVendor) {
    try {
      const v = JSON.parse(savedVendor);
      if (v.businessName) {
        const titleEl = document.querySelector('.page-header h1');
        if (titleEl) titleEl.textContent = `${v.businessName} Dashboard 🏪`;
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName) sidebarName.textContent = v.businessName;
      }
    } catch (e) {}
  }
});

// --- Accept Payment Modal & Simulation ---
function openAcceptModal() {
  document.getElementById('acceptModal').style.display = 'flex';
  document.getElementById('aPayStep1').style.display = 'block';
  document.getElementById('aPayStep2').style.display = 'none';
  document.getElementById('aPayStep3').style.display = 'none';
  document.getElementById('aModalAmount').value = '';
}

function closeAcceptModal() {
  document.getElementById('acceptModal').style.display = 'none';
}

function startVendorScan() {
  const amount = document.getElementById('aModalAmount').value;

  if (!amount || parseFloat(amount) <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  document.getElementById('aPayStep1').style.display = 'none';
  document.getElementById('aPayStep2').style.display = 'block';

  const statusEl = document.getElementById('vScanStatus');
  const messages = [
    'Place finger on terminal scanner...',
    'Fingerprint detected on 500 DPI optical prism...',
    'Matching Aadhaar token minutiae...',
    'Debiting customer linked bank...',
    'Settling payment to your account...'
  ];

  let msgIdx = 0;
  const interval = setInterval(() => {
    if (statusEl && msgIdx < messages.length) {
      statusEl.textContent = messages[msgIdx++];
    }
  }, 600);

  setTimeout(() => {
    clearInterval(interval);
    document.getElementById('aPayStep2').style.display = 'none';
    document.getElementById('aPayStep3').style.display = 'block';

    document.getElementById('vPayAmount').textContent = '₹ ' + parseFloat(amount).toFixed(2);
    document.getElementById('vPayRef').textContent = 'BP-TXN-' + Date.now().toString().slice(-9);
  }, 3500);
}

// Close on overlay click
document.getElementById('acceptModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('acceptModal')) closeAcceptModal();
});

// --- Vendor Txn Filtering ---
function filterVendorTxns() {
  const query = document.getElementById('vTxnSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#vTxnTable tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function setVendorTxnFilter(status, btn) {
  document.querySelectorAll('#vViewTransactions .filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const rows = document.querySelectorAll('#vTxnTable tbody tr');
  rows.forEach(row => {
    if (status === 'all') {
      row.style.display = '';
    } else {
      row.style.display = (row.dataset.status === status) ? '' : 'none';
    }
  });
}

// Animate charts
function animateVendorCharts() {
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach(bar => {
    const targetH = bar.style.height || '70%';
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.transition = 'height 1s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.height = targetH;
    }, 200);
  });

  document.querySelectorAll('.progress-fill').forEach(fill => {
    const targetW = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = 'width 1.2s ease';
      fill.style.width = targetW;
    }, 300);
  });
}

window.addEventListener('load', () => {
  animateVendorCharts();
});

