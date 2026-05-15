/**
 * TikTok Growth Strategist — Main JavaScript
 * Handles: Dark Mode, RTL, Hamburger Drawer, Scroll Animations, Counters, FAQs
 */

$(document).ready(function () {

  /* ============================================================
     Theme Management (Dark / Light)
     ============================================================ */
  const THEME_KEY = 'tiktok-theme';
  const RTL_KEY = 'tiktok-rtl';

  function setTheme(theme) {
    $('html').attr('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const isDark = theme === 'dark';
    $('.theme-icon-sun').toggle(isDark);
    $('.theme-icon-moon').toggle(!isDark);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(saved);
  }

  $(document).on('click', '.theme-toggle', function () {
    const current = $('html').attr('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ============================================================
     RTL Management
     ============================================================ */
  function setRTL(isRtl) {
    $('html').attr('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem(RTL_KEY, isRtl ? 'rtl' : 'ltr');
    updateRtlIcon(isRtl);
  }

  function updateRtlIcon(isRtl) {
    $('.rtl-icon-active').toggle(isRtl);
    $('.rtl-icon-default').toggle(!isRtl);
  }

  function initRTL() {
    const saved = localStorage.getItem(RTL_KEY) || 'ltr';
    setRTL(saved === 'rtl');
  }

  $(document).on('click', '.rtl-toggle', function () {
    const current = $('html').attr('dir');
    setRTL(current !== 'rtl');
  });

  /* ============================================================
     Mobile Hamburger Drawer
     ============================================================ */
  function openDrawer() {
    $('#mobileDrawer').addClass('open');
    $('#drawerOverlay').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeDrawer() {
    $('#mobileDrawer').removeClass('open');
    $('#drawerOverlay').removeClass('open');
    $('body').css('overflow', '');
  }

  $(document).on('click', '#hamburgerBtn', openDrawer);
  $(document).on('click', '#drawerClose, #drawerOverlay', closeDrawer);
  $(document).on('click', '#mobileDrawer .drawer-nav a', closeDrawer);

  /* ============================================================
     Navbar Scroll Effects
     ============================================================ */
  $(window).on('scroll', function () {
    const scrolled = $(this).scrollTop() > 50;
    $('.navbar').toggleClass('scrolled', scrolled);
    updateActiveNav();
  });

  function updateActiveNav() {
    const scrollPos = $(window).scrollTop() + 100;
    $('section[id]').each(function () {
      const top = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      if (scrollPos >= top && scrollPos < bottom) {
        const id = $(this).attr('id');
        // Only target anchor links, don't touch page links
        const anchorLink = $(`.nav-links a[href="#${id}"]`);
        if (anchorLink.length) {
          $('.nav-links a[href^="#"]').removeClass('active');
          anchorLink.addClass('active');
        }
      }
    });
  }

  /* ============================================================
     Scroll Reveal Animations
     ============================================================ */
  function revealOnScroll() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     Counter Animation
     ============================================================ */
  function animateCounter(el) {
    const target = parseFloat($(el).data('target'));
    const suffix = $(el).data('suffix') || '';
    const prefix = $(el).data('prefix') || '';
    const duration = parseInt($(el).data('duration')) || 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      $(el).text(prefix + display + suffix);
    }, stepTime);
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-value').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ============================================================
     FAQ Accordion
     ============================================================ */
  $(document).on('click', '.faq-question', function () {
    const item = $(this).closest('.faq-item');
    const isOpen = item.hasClass('open');
    const answer = item.find('.faq-answer');

    // Close all
    $('.faq-item').not(item).each(function () {
      $(this).removeClass('open');
      $(this).find('.faq-answer').css('max-height', '');
    });

    if (!isOpen) {
      item.addClass('open');
      answer.css('max-height', answer[0].scrollHeight + 'px');
    } else {
      item.removeClass('open');
      answer.css('max-height', '');
    }
  });

  /* ============================================================
     Tabs
     ============================================================ */
  $(document).on('click', '.tab-btn', function () {
    const target = $(this).data('tab');
    const group = $(this).closest('.tabs-wrapper');
    group.find('.tab-btn').removeClass('active');
    $(this).addClass('active');
    group.find('.tab-content').removeClass('active');
    group.find(`#${target}`).addClass('active');
  });

  /* ============================================================
     Smooth Scroll for Anchor Links
     ============================================================ */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const href = $(this).attr('href');
    if (href === '#') return;
    const target = $(href);
    if (target.length) {
      e.preventDefault();
      const offset = parseInt($('.navbar').css('height') || 72);
      $('html, body').animate({ scrollTop: target.offset().top - offset }, 600);
    }
  });

  /* ============================================================
     Ticker Duplication
     ============================================================ */
  function initTicker() {
    const inner = $('.ticker-inner');
    if (!inner.length) return;
    const clone = inner.html();
    inner.append(clone);
  }

  /* ============================================================
     Image Lazy Load Fallback
     ============================================================ */
  $('img[data-src]').each(function () {
    $(this).attr('src', $(this).data('src'));
  });

  /* ============================================================
     Typewriter Effect (for hero headings)
     ============================================================ */
  function typewriter(el, words) {
    if (!el.length || !words.length) return;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        el.text(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        el.text(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let delay = isDeleting ? 60 : 100;
      if (!isDeleting && charIndex === currentWord.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
      }
      setTimeout(type, delay);
    }
    type();
  }

  const typeEl = $('.typewriter-text');
  if (typeEl.length) {
    const words = typeEl.data('words');
    if (words) typewriter(typeEl, words.split('|'));
  }

  /* ============================================================
     Initialize All
     ============================================================ */
  initTheme();
  initRTL();
  revealOnScroll();
  initCounters();
  initTicker();

  // Init first FAQ open
  const firstFaq = $('.faq-item').first();
  if (firstFaq.length) {
    firstFaq.addClass('open');
    firstFaq.find('.faq-answer').css('max-height', firstFaq.find('.faq-answer')[0].scrollHeight + 'px');
  }

  /* ============================================================
     Back to Top
     ============================================================ */
  const backToTop = $('<button class="back-to-top" aria-label="Back to Top"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg></button>');
  $('body').append(backToTop);

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      backToTop.addClass('visible');
    } else {
      backToTop.removeClass('visible');
    }
  });

  backToTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });
});
