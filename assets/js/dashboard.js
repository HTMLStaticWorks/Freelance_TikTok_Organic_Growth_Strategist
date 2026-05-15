/**
 * ViralPro Dashboard - Premium Logic
 */

$(document).ready(function () {
  
  // --- Sidebar Logic ---
  const toggleSidebar = (show) => {
    $('#sidebar').toggleClass('open', show);
    $('#sidebarOverlay').toggleClass('open', show);
    $('body').css('overflow', show ? 'hidden' : '');
  };

  $('#hamburgerBtn').on('click', () => toggleSidebar(true));
  $('#sidebarClose, #sidebarOverlay').on('click', () => toggleSidebar(false));

  // --- Submenu Logic ---
  $('.sidebar-link').on('click', function (e) {
    const parent = $(this).closest('.nav-item-wrap');
    const hasSubmenu = parent.find('.submenu').length > 0;
    
    if (hasSubmenu) {
      e.preventDefault();
      
      // Close other submenus if needed (optional)
      // $('.nav-item-wrap').not(parent).removeClass('open');
      
      parent.toggleClass('open');
    } else {
      // Normal link behavior
      $('.sidebar-link').removeClass('active');
      $(this).addClass('active');
      
      // Close sidebar on mobile after clicking a link
      if ($(window).width() <= 768) {
        toggleSidebar(false);
      }
    }
  });

  // --- Logout ---
  $('#logoutBtn').on('click', () => {
    window.location.href = 'login.html';
  });

  // --- Theme Toggle ---
  $(document).on('click', '.theme-toggle', function () {
    const current = $('html').attr('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    $('html').attr('data-theme', next);
    localStorage.setItem('tiktok-theme', next);
    $('.theme-icon-sun').toggle(next === 'dark');
    $('.theme-icon-moon').toggle(next !== 'dark');
    
    // Refresh charts if they depend on theme colors
    updateChartsTheme();
  });

  // --- Dashboard Data & Charts ---
  
  const isDark = () => $('html').attr('data-theme') === 'dark';
  const getGridColor = () => isDark() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const getTextColor = () => isDark() ? '#94a3b8' : '#64748b';

  let charts = {};

  const initCharts = () => {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = getTextColor();

    // 1. Follower Chart
    const followerCtx = document.getElementById('followerChart');
    if (followerCtx) {
      charts.follower = new Chart(followerCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Followers',
            data: [45000, 52000, 68000, 95000, 142000, 185000],
            borderColor: '#FF2D55',
            backgroundColor: 'rgba(255, 45, 85, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: getGridColor() }, ticks: { callback: v => (v/1000) + 'K' } }
          }
        }
      });
    }

    // 2. Engagement Split (Doughnut)
    const platformCtx = document.getElementById('platformChart');
    if (platformCtx) {
      charts.platform = new Chart(platformCtx, {
        type: 'doughnut',
        data: {
          labels: ['TikTok', 'Instagram', 'YouTube'],
          datasets: [{
            data: [62, 21, 11],
            backgroundColor: ['#FF2D55', '#00F2EA', '#7B2FBE'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '80%',
          plugins: { legend: { display: false } }
        }
      });
    }

    // 3. Weekly Engagement (Bar)
    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
      charts.engagement = new Chart(engagementCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Engagement %',
            data: [7.2, 8.5, 6.9, 9.4, 8.8, 11.2, 9.8],
            backgroundColor: '#00F2EA',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: getGridColor() } }
          }
        }
      });
    }

    // 4. Viral Metrics (Horizontal Bar)
    const viralCtx = document.getElementById('viralChart');
    if (viralCtx) {
      charts.viral = new Chart(viralCtx, {
        type: 'bar',
        data: {
          labels: ['Hook', 'Watch Time', 'Shares', 'Saves'],
          datasets: [{
            data: [88, 76, 92, 84],
            backgroundColor: ['#FF2D55', '#00F2EA', '#7B2FBE', '#FF6B35'],
            borderRadius: 10
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { max: 100, grid: { color: getGridColor() } },
            y: { grid: { display: false } }
          }
        }
      });
    }
  };

  const updateChartsTheme = () => {
    Object.values(charts).forEach(chart => {
      chart.options.scales.y.grid.color = getGridColor();
      if (chart.options.scales.x.grid) chart.options.scales.x.grid.color = getGridColor();
      chart.options.color = getTextColor();
      chart.update();
    });
  };

  initCharts();

  // --- Counters ---
  const animateCounters = () => {
    $('.kpi-value').each(function () {
      const $this = $(this);
      const target = parseFloat($this.data('count'));
      const divisor = $this.data('divisor') || 1;
      const suffix = $this.data('suffix') || '';
      
      let current = 0;
      const duration = 1500;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        current = progress * (target / divisor);
        
        if (divisor === 1000000) {
          $this.text(current.toFixed(1) + suffix);
        } else if (target % 1 !== 0) {
          $this.text(current.toFixed(1) + suffix);
        } else {
          $this.text(Math.floor(current).toLocaleString() + suffix);
        }

        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  animateCounters();

  // --- Calendar ---
  const renderCalendar = () => {
    const grid = $('#calendarGrid');
    if (!grid.length) return;

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    let html = days.map(d => `<div class="cal-day">${d}</div>`).join('');

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    $('#calendarMonth').text(currentMonth);

    // Simple fixed grid for demo
    const startOffset = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      html += '<div class="cal-cell empty"></div>';
    }

    for (let i = 1; i <= totalDays; i++) {
      const isToday = i === today.getDate();
      const hasContent = [4, 7, 12, 15, 22, 25].includes(i);
      html += `<div class="cal-cell${isToday ? ' today' : ''}${hasContent ? ' has-content' : ''}">${i}</div>`;
    }

    grid.html(html);
  };

  renderCalendar();
});
