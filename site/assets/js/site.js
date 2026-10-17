/* ==========================================================================
   Sample Lodge Hotel — site interactions
   Vanilla ES2019, no dependencies. Everything is progressive: the pages are
   fully readable without JavaScript.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function on(element, event, handler, options) {
    if (element) element.addEventListener(event, handler, options);
  }

  function setStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = 'form-status' + (type ? ' is-' + type : '');
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------------------------------------------------------------------
     Header, back-to-top
     --------------------------------------------------------------------- */
  var header = doc.querySelector('[data-header]');
  var toTop = doc.querySelector('[data-to-top]');

  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    if (header) header.classList.toggle('is-solid', y > 60);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
  }
  on(window, 'scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  var menu = doc.getElementById('mobileMenu');
  var navToggle = doc.querySelector('[data-nav-toggle]');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    window.requestAnimationFrame(function () { menu.classList.add('is-open'); });
    doc.body.classList.add('nav-open', 'no-scroll');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
    }
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    doc.body.classList.remove('nav-open');
    if (!doc.querySelector('.lightbox:not([hidden])')) {
      doc.body.classList.remove('no-scroll');
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
    window.setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 520);
  }

  on(navToggle, 'click', function () {
    if (doc.body.classList.contains('nav-open')) closeMenu();
    else openMenu();
  });
  doc.querySelectorAll('[data-nav-close]').forEach(function (button) {
    on(button, 'click', closeMenu);
  });
  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      on(link, 'click', closeMenu);
    });
  }

  /* ---------------------------------------------------------------------
     Home hero slider
     --------------------------------------------------------------------- */
  var hero = doc.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var counter = hero.querySelector('[data-hero-current]');
    var current = 0;
    var timer = null;
    var paused = false;

    var show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      if (counter) counter.textContent = ('0' + (current + 1)).slice(-2);
    };

    var start = function () {
      stop();
      if (paused || reduceMotion || slides.length < 2) return;
      timer = window.setInterval(function () { show(current + 1); }, 7500);
    };
    var stop = function () {
      if (timer) { window.clearInterval(timer); timer = null; }
    };

    on(hero.querySelector('[data-hero-next]'), 'click', function () { show(current + 1); start(); });
    on(hero.querySelector('[data-hero-prev]'), 'click', function () { show(current - 1); start(); });
    dots.forEach(function (dot) {
      on(dot, 'click', function () { show(parseInt(dot.getAttribute('data-hero-dot'), 10)); start(); });
    });

    on(hero, 'mouseenter', function () { paused = true; stop(); });
    on(hero, 'mouseleave', function () { paused = false; start(); });
    on(hero, 'focusin', function () { paused = true; stop(); });
    on(hero, 'focusout', function () { paused = false; start(); });
    on(doc, 'keydown', function (event) {
      if (!hero.contains(doc.activeElement) && doc.activeElement !== doc.body) return;
      if (event.key === 'ArrowRight') { show(current + 1); start(); }
      if (event.key === 'ArrowLeft') { show(current - 1); start(); }
    });

    var touchStartX = null;
    on(hero, 'pointerdown', function (event) { touchStartX = event.clientX; });
    on(hero, 'pointerup', function (event) {
      if (touchStartX === null) return;
      var delta = event.clientX - touchStartX;
      if (Math.abs(delta) > 60) {
        if (delta < 0) show(current + 1); else show(current - 1);
        start();
      }
      touchStartX = null;
    });

    on(doc, 'visibilitychange', function () { if (doc.hidden) stop(); else start(); });
    show(0);
    start();
  }

  /* ---------------------------------------------------------------------
     Horizontal carousels (room cards)
     --------------------------------------------------------------------- */
  doc.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    var step = function () {
      var first = track.firstElementChild;
      if (!first) return 320;
      var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    };

    var update = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };

    on(prev, 'click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    on(next, 'click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    on(track, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  });

  /* ---------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------- */
  var revealItems = doc.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }
  // Failsafe: never leave content hidden if the observer cannot run.
  window.setTimeout(function () {
    doc.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(function (item) {
      item.classList.add('is-visible');
    });
  }, 2500);

  /* ---------------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------------- */
  var lightbox = doc.getElementById('lightbox');
  var lbImage = lightbox && lightbox.querySelector('[data-lb-img]');
  var lbCaption = lightbox && lightbox.querySelector('[data-lb-caption]');
  var lbCount = lightbox && lightbox.querySelector('[data-lb-count]');
  var lbItems = [];
  var lbIndex = 0;
  var lbTrigger = null;

  function renderLightbox() {
    var item = lbItems[lbIndex];
    if (!item) return;
    if (lbImage) { lbImage.src = item.src; lbImage.alt = item.caption || ''; }
    if (lbCaption) lbCaption.textContent = item.caption || '';
    if (lbCount) lbCount.textContent = (lbIndex + 1) + ' / ' + lbItems.length;
  }

  function openLightbox(items, index, trigger) {
    if (!lightbox || !items.length) return;
    lbItems = items;
    lbIndex = index >= 0 ? index : 0;
    lbTrigger = trigger || null;
    lightbox.hidden = false;
    doc.body.classList.add('no-scroll');
    renderLightbox();
    var closeButton = lightbox.querySelector('[data-lb-close]');
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lbImage) lbImage.removeAttribute('src');
    doc.body.classList.remove('no-scroll');
    if (lbTrigger) lbTrigger.focus();
    lbTrigger = null;
  }

  function stepLightbox(direction) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + direction + lbItems.length) % lbItems.length;
    renderLightbox();
  }

  if (lightbox) {
    on(lightbox.querySelector('[data-lb-prev]'), 'click', function () { stepLightbox(-1); });
    on(lightbox.querySelector('[data-lb-next]'), 'click', function () { stepLightbox(1); });
    lightbox.querySelectorAll('[data-lb-close]').forEach(function (node) { on(node, 'click', closeLightbox); });
  }

  /* Gallery grid lightbox */
  doc.querySelectorAll('[data-gallery-grid]').forEach(function (grid) {
    grid.querySelectorAll('[data-lightbox]').forEach(function (button) {
      on(button, 'click', function () {
        var visible = Array.prototype.slice.call(grid.querySelectorAll('[data-lightbox]')).filter(function (item) {
          var holder = item.closest('.gallery-item');
          return !holder || !holder.classList.contains('is-hidden');
        });
        var items = visible.map(function (item) {
          return { src: item.getAttribute('data-src'), caption: item.getAttribute('data-caption') };
        });
        openLightbox(items, visible.indexOf(button), button);
      });
    });
  });

  /* Image viewers (room / facility galleries) */
  doc.querySelectorAll('[data-viewer]').forEach(function (viewer) {
    var main = viewer.querySelector('[data-viewer-img]');
    var thumbs = Array.prototype.slice.call(viewer.querySelectorAll('[data-viewer-thumb]'));
    var index = 0;

    var items = function () {
      if (!thumbs.length) return [{ src: main.getAttribute('src'), caption: main.getAttribute('alt') }];
      return thumbs.map(function (thumb) {
        return {
          src: thumb.getAttribute('data-full') || thumb.querySelector('img').getAttribute('src'),
          caption: thumb.getAttribute('data-caption') || '',
        };
      });
    };

    var set = function (value) {
      if (!thumbs.length) return;
      index = (value + thumbs.length) % thumbs.length;
      var thumb = thumbs[index];
      main.src = thumb.getAttribute('data-full') || thumb.querySelector('img').getAttribute('src');
      main.alt = thumb.getAttribute('data-caption') || main.alt;
      thumbs.forEach(function (thumbItem, i) { thumbItem.classList.toggle('is-active', i === index); });
    };

    thumbs.forEach(function (thumb, i) { on(thumb, 'click', function () { set(i); }); });
    on(viewer.querySelector('[data-viewer-prev]'), 'click', function () { set(index - 1); });
    on(viewer.querySelector('[data-viewer-next]'), 'click', function () { set(index + 1); });

    var expand = viewer.querySelector('[data-lightbox-open]');
    on(expand, 'click', function () { openLightbox(items(), index, expand); });

    var startX = null;
    var stage = viewer.querySelector('.viewer__main');
    on(stage, 'pointerdown', function (event) { startX = event.clientX; });
    on(stage, 'pointerup', function (event) {
      if (startX === null) return;
      var delta = event.clientX - startX;
      if (Math.abs(delta) > 60) set(index + (delta < 0 ? 1 : -1));
      startX = null;
    });
  });

  /* Keyboard support for overlays */
  on(doc, 'keydown', function (event) {
    if (event.key === 'Escape') {
      closeLightbox();
      closeMenu();
    }
    if (!lightbox || lightbox.hidden) return;
    if (event.key === 'ArrowRight') { stepLightbox(1); event.preventDefault(); }
    if (event.key === 'ArrowLeft') { stepLightbox(-1); event.preventDefault(); }
  });

  /* ---------------------------------------------------------------------
     Gallery filters
     --------------------------------------------------------------------- */
  var filterButtons = doc.querySelectorAll('[data-filter]');
  var galleryItems = Array.prototype.slice.call(doc.querySelectorAll('.gallery-item'));

  filterButtons.forEach(function (button) {
    on(button, 'click', function () {
      var category = button.getAttribute('data-filter');
      filterButtons.forEach(function (other) {
        var active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      var shown = 0;
      galleryItems.forEach(function (item) {
        var visible = category === 'all' || item.getAttribute('data-category') === category;
        item.classList.toggle('is-hidden', !visible);
        if (visible) shown += 1;
      });
      var count = doc.querySelector('[data-gallery-count]');
      if (count) count.textContent = shown + (shown === 1 ? ' photograph' : ' photographs');
    });
  });

  /* ---------------------------------------------------------------------
     Booking enquiry form
     --------------------------------------------------------------------- */
  function slugify(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  doc.querySelectorAll('[data-booking-form]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var name = form.querySelector('[name="name"]');
    var email = form.querySelector('[name="email"]');
    var checkin = form.querySelector('[name="checkin"]');
    var checkout = form.querySelector('[name="checkout"]');
    var room = form.querySelector('[name="room"]');
    var guests = form.querySelector('[name="guests"]');
    var message = form.querySelector('[name="message"]');
    var to = form.getAttribute('data-email') || 'admin@samplewebsite.com';

    var today = new Date().toISOString().slice(0, 10);
    if (checkin) {
      checkin.min = today;
      on(checkin, 'change', function () {
        if (!checkout) return;
        if (checkin.value) {
          var nextDay = new Date(checkin.value);
          nextDay.setDate(nextDay.getDate() + 1);
          var min = nextDay.toISOString().slice(0, 10);
          checkout.min = min;
          if (checkout.value && checkout.value <= checkin.value) checkout.value = min;
        }
      });
    }
    if (checkout) checkout.min = today;

    var params = new URLSearchParams(window.location.search);
    if (params.get('room') && room) {
      var wanted = slugify(params.get('room'));
      Array.prototype.forEach.call(room.options, function (option) {
        if (slugify(option.value) === wanted) room.value = option.value;
      });
    }
    ['checkin', 'checkout'].forEach(function (key) {
      var value = params.get(key);
      if (value && form.querySelector('[name="' + key + '"]')) {
        form.querySelector('[name="' + key + '"]').value = value;
      }
    });

    on(form, 'submit', function (event) {
      event.preventDefault();
      var invalid = null;
      form.querySelectorAll('[required]').forEach(function (input) {
        var valid = input.value.trim() !== '';
        if (input.type === 'email') valid = valid && emailPattern.test(input.value.trim());
        if (checkin && checkout && input === checkout && checkin.value && checkout.value && checkout.value <= checkin.value) valid = false;
        input.classList.toggle('is-invalid', !valid);
        input.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && !invalid) invalid = input;
      });
      if (invalid) {
        setStatus(status, 'Please check the highlighted fields — we need your name, a valid email and both dates.', 'error');
        invalid.focus();
        return;
      }

      var nights = '';
      if (checkin && checkout && checkin.value && checkout.value) {
        var diff = Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
        if (diff > 0) nights = diff + (diff === 1 ? ' night' : ' nights');
      }

      var lines = [
        'Booking enquiry from the Sample Lodge Hotel website',
        '',
        'Name: ' + (name ? name.value.trim() : ''),
        'Email: ' + (email ? email.value.trim() : ''),
        'Check in: ' + (checkin ? checkin.value : ''),
        'Check out: ' + (checkout ? checkout.value : ''),
        nights ? 'Length of stay: ' + nights : '',
        'Room type: ' + (room ? room.value : ''),
        'Guests: ' + (guests ? guests.value : ''),
        '',
        'Notes:',
        (message && message.value.trim()) || '(none)',
        '',
        'Sent from samplewebsite.com',
      ].filter(function (line) { return line !== ''; }).join('\r\n');

      var subject = 'Booking enquiry — ' + (room && room.value ? room.value : 'Sample Lodge Hotel') +
        (checkin && checkin.value ? ' — ' + checkin.value : '');

      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines);

      setStatus(status, 'Thank you — your email app is opening with the enquiry ready to send. If it does not open, call +675 422 3395 or email ' + to + '.', 'success');
    });
  });

  /* ---------------------------------------------------------------------
     Newsletter
     --------------------------------------------------------------------- */
  doc.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var input = form.querySelector('input[type="email"]');
    on(form, 'submit', function (event) {
      event.preventDefault();
      var value = input ? input.value.trim() : '';
      if (!emailPattern.test(value)) {
        if (input) { input.classList.add('is-invalid'); input.setAttribute('aria-invalid', 'true'); }
        setStatus(status, 'Please enter a valid email address.', 'error');
        return;
      }
      if (input) { input.classList.remove('is-invalid'); input.setAttribute('aria-invalid', 'false'); }
      window.location.href = 'mailto:admin@samplewebsite.com?subject=' +
        encodeURIComponent('Newsletter signup') + '&body=' + encodeURIComponent('Please add me to the Sample Lodge newsletter: ' + value);
      setStatus(status, 'Thank you — your email app will open to confirm your subscription.', 'success');
    });
  });

  /* ---------------------------------------------------------------------
     Anchor smooth-scroll with fixed-header offset
     --------------------------------------------------------------------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (link) {
    on(link, 'click', function (event) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = doc.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });
})();
