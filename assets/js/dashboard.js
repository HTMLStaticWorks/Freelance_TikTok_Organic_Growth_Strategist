/**
 * TikTok Growth Strategist — Dashboard JavaScript
 * Handles: Sidebar, Charts, Dropdowns, Calendar, Interactions
 */

$(document).ready(function () {

  /* ============================================================
     Sidebar Toggle (Mobile)
     ============================================================ */
  $('#sidebarToggle').on('click', function () {
    $('.sidebar').toggleClass('open');
    $('#sidebarOverlay').toggleClass('open');
    $('body').css('overflow', $('.sidebar').hasClass('open') ? 'hidden' : '');
  });

  $('#sidebarOverlay').on('click', function () {
    $('.sidebar').removeClass('open');
    $(this).removeClass('open');
    $('body').css('overflow', '');
  });

  /* ============================================================
     Notification Dropdown
     ============================================================ */
  $('#notifBtn').on('click', function (e) {
    e.stopPropagation();
    $('#notifDropdown').toggleClass('open');
    $('#profileDropdown').removeClass('open');
  });

  /* ============================================================
     Profile Dropdown
     ============================================================ */
  $('#profileBtn').on('click', function (e) {
    e.stopPropagation();
    $('#profileDropdown').toggleClass('open');
    $('#notifDropdown').removeClass('open');
  });

  $(document).on('click', function () {
    $('#notifDropdown, #profileDropdown').removeClass('open');
  });

  /* ============================================================
     Logout
     ============================================================ */
  $('#logoutBtn').on('click', function () {
    window.location.href = '../pages/login.html';
  });

  /* ============================================================
     Theme Toggle (Dashboard)
     ============================================================ */
  $(document).on('click', '.theme-toggle', function () {
    const current = $('html').attr('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    $('html').attr('data-theme', next);
    localStorage.setItem('tiktok-theme', next);
    $('.theme-icon-sun').toggle(next === 'dark');
    $('.theme-icon-moon').toggle(next !== 'dark');
  });

  /* RTL Toggle */
  $(document).on('click', '.rtl-toggle', function () {
    const current = $('html').attr('dir');
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    $('html').attr('dir', next);
    localStorage.setItem('tiktok-rtl', next);
    $('.rtl-icon-active').toggle(next === 'rtl');
    $('.rtl-icon-default').toggle(next !== 'rtl');
  });

  /* Init stored preferences */
  const savedTheme = localStorage.getItem('tiktok-theme') || 'dark';
  $('html').attr('data-theme', savedTheme);
  $('.theme-icon-sun').toggle(savedTheme === 'dark');
  $('.theme-icon-moon').toggle(savedTheme !== 'dark');
  const savedDir = localStorage.getItem('tiktok-rtl') || 'ltr';
  $('html').attr('dir', savedDir);
  $('.rtl-icon-active').toggle(savedDir === 'rtl');
  $('.rtl-icon-default').toggle(savedDir !== 'rtl');

  /* ============================================================
     Active Sidebar Link
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop();
  $('.sidebar-link').removeClass('active');
  $(`.sidebar-link[href="${currentPage}"]`).addClass('active');

  /* ============================================================
     CHARTS (Chart.js)
     ============================================================ */
  const isDark = () => $('html').attr('data-theme') === 'dark';
  const gridColor = () => isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = () => isDark() ? '#B0B0D0' : '#7B7B9E';

  Chart.defaults.font.family = "'Inter', sans-serif";

  /* Follower Growth Line Chart */
  const followerCtx = document.getElementById('followerChart');
  if (followerCtx) {
    new Chart(followerCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Followers',
          data: [12000, 19000, 27000, 35000, 51000, 68000, 82000, 95000, 115000, 138000, 162000, 185000],
          borderColor: '#FF2D55',
          backgroundColor: 'rgba(255,45,85,0.05)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FF2D55',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { color: gridColor() }, ticks: { color: textColor(), font: { size: 11 } } },
          y: {
            grid: { color: gridColor() }, ticks: { color: textColor(), font: { size: 11 },
            callback: v => (v >= 1000 ? (v/1000).toFixed(0)+'K' : v) }
          }
        }
      }
    });
  }

  /* Engagement Rate Bar Chart */
  const engagementCtx = document.getElementById('engagementChart');
  if (engagementCtx) {
    new Chart(engagementCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Engagement %',
          data: [4.2, 6.8, 5.1, 8.3, 7.5, 9.2, 6.4],
          backgroundColor: 'rgba(0,242,234,0.7)',
          borderColor: '#00F2EA',
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor() }, ticks: { color: textColor() } },
          y: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => v+'%' } }
        }
      }
    });
  }

  /* Platform Split Doughnut Chart */
  const platformCtx = document.getElementById('platformChart');
  if (platformCtx) {
    new Chart(platformCtx, {
      type: 'doughnut',
      data: {
        labels: ['TikTok', 'Instagram', 'YouTube', 'Twitter'],
        datasets: [{
          data: [62, 21, 11, 6],
          backgroundColor: ['#FF2D55','#00F2EA','#7B2FBE','#FF6B35'],
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor(), padding: 16, font: { size: 12 } } }
        }
      }
    });
  }

  /* Views Area Chart */
  const viewsCtx = document.getElementById('viewsChart');
  if (viewsCtx) {
    new Chart(viewsCtx, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        datasets: [{
          label: 'Video Views',
          data: [250000, 480000, 320000, 650000, 890000, 1200000, 980000, 1450000],
          borderColor: '#7B2FBE',
          backgroundColor: 'rgba(123,47,190,0.07)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#7B2FBE',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor() }, ticks: { color: textColor() } },
          y: { grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => (v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v) } }
        }
      }
    });
  }

  /* Viral Score Gauge (Horizontal Bar) */
  const viralCtx = document.getElementById('viralChart');
  if (viralCtx) {
    new Chart(viralCtx, {
      type: 'bar',
      data: {
        labels: ['Hook Rate', 'Share Rate', 'Comment Rate', 'Save Rate', 'Watch Time'],
        datasets: [{
          data: [87, 72, 65, 81, 78],
          backgroundColor: ['#FF2D55','#00F2EA','#7B2FBE','#FF6B35','#10B981'],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { max: 100, grid: { color: gridColor() }, ticks: { color: textColor(), callback: v => v+'%' } },
          y: { grid: { display: false }, ticks: { color: textColor() } }
        }
      }
    });
  }

  /* Content Calendar */
  function renderCalendar() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const contentDays = [3, 6, 8, 10, 13, 15, 17, 20, 22, 24, 27];

    const calGrid = $('#calendarGrid');
    if (!calGrid.length) return;

    const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    let html = dayNames.map(d => `<div class="cal-day">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate();
      const hasContent = contentDays.includes(d);
      html += `<div class="cal-cell${isToday ? ' today' : ''}${hasContent ? ' has-content' : ''}">${d}</div>`;
    }

    calGrid.html(html);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    $('#calendarMonth').text(months[month] + ' ' + year);
  }

  renderCalendar();

  /* Progress Bars animate */
  function animateProgressBars() {
    $('.progress-fill').each(function () {
      const w = $(this).data('width') || 0;
      $(this).css('width', '0%');
      setTimeout(() => $(this).css('width', w + '%'), 300);
    });
  }
  animateProgressBars();

  /* Animate KPI counters */
  function animateDashCounters() {
    $('.kpi-value[data-count]').each(function () {
      const el = $(this);
      const target = parseFloat(el.data('count'));
      const suffix = el.data('suffix') || '';
      const prefix = el.data('prefix') || '';
      let current = 0;
      const steps = 40;
      const increment = target / steps;
      const timer = setInterval(function () {
        current = Math.min(current + increment, target);
        const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
        el.text(prefix + display + suffix);
        if (current >= target) clearInterval(timer);
      }, 40);
    });
  }
  animateDashCounters();
});
