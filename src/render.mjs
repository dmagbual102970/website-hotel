// ---------------------------------------------------------------------------
// Render layer for the Sample Lodge Hotel site.
// Every page is assembled from the shared chrome below plus one page builder.
// ---------------------------------------------------------------------------
import {
  site, rooms, facilities, services, gallery, galleryCategories,
  slides, stats, highlights, contactFaq,
} from './content.mjs';

export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let assetRoot = '';
// Per-lead demos live in site/demos/<slug>/ and share the site-level /assets/.
export const setAssetRoot = (value = '') => { assetRoot = value; };

export const url = (depth, target = '') => {
  if (!target || /^(https?:|tel:|mailto:|#)/.test(target)) return target;
  // Content refers to imagery as img/..., which lives under assets/ once built.
  const resolved = target.charAt(0) === '/' ? target.slice(1) : target.startsWith('img/') ? 'assets/' + target : target;
  const isAsset = target.startsWith('img/') || target.startsWith('assets/') || target.charAt(0) === '/';
  return (isAsset ? assetRoot : '') + '../'.repeat(depth) + resolved;
};

const slugOf = (href = '') => href.split('/').pop().replace(/\.html$/, '');

// ---------------------------------------------------------------------------
// Icon sprite
// ---------------------------------------------------------------------------
const ICONS = {
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>',
  utensils: '<path d="M4 3v6a3 3 0 0 0 6 0V3"/><path d="M7 3v18"/><path d="M17 3c-1.7 1.3-3 3.5-3 6 0 2 1.3 3 3 3v9"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0-.1-7.7z"/>',
  presentation: '<path d="M2 4h20v12H2z"/><path d="M8 20h8"/><path d="M12 16v4"/>',
  briefcase: '<path d="M3 7h18v13H3z"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  car: '<path d="M4 15.5V12l1.8-4.5A2 2 0 0 1 7.6 6h8.8a2 2 0 0 1 1.8 1.5L20 12v3.5"/><path d="M4 15.5h16"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
  bus: '<path d="M4 5h16v11H4z"/><path d="M4 11h16"/><path d="M4 16v2"/><path d="M20 16v2"/><path d="M8 19h.01"/><path d="M16 19h.01"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  dumbbell: '<path d="M6.5 6.5v11"/><path d="M3 9v6"/><path d="M17.5 6.5v11"/><path d="M21 9v6"/><path d="M6.5 12h11"/>',
  droplet: '<path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z"/>',
  bed: '<path d="M3 4v16"/><path d="M3 11h18v9"/><path d="M3 16h18"/><path d="M7 11V8h5v3"/>',
  bath: '<path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z"/><path d="M7 12V5a2 2 0 0 1 4 0"/>',
  tv: '<path d="M3 7h18v12H3z"/><path d="M8 3l4 4 4-4"/>',
  coffee: '<path d="M18 8h1a3 3 0 0 1 0 6h-1"/><path d="M3 8h15v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><path d="M7 2v3"/><path d="M11 2v3"/><path d="M15 2v3"/>',
  users: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.5"/><path d="M22 20v-1.5a4 4 0 0 0-3-3.87"/><path d="M16.5 3.6a3.5 3.5 0 0 1 0 6.8"/>',
  calendar: '<path d="M4 5h16v16H4z"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 10h16"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9z"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M15.5 8.5H18V5h-2.5A4.5 4.5 0 0 0 11 9.5V12H8v3.5h3V21h3.5v-5.5H17l.5-3.5h-3V9.5a1 1 0 0 1 1-1z"/>',
  play: '<path fill="currentColor" stroke="none" d="M8 5.2v13.6L19 12z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  close: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
  menu: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
  chevronRight: '<path d="M9 18l6-6-6-6"/>',
  arrowRight: '<path d="M4 12h16"/><path d="M14 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 20V4"/><path d="M5 11l7-7 7 7"/>',
  arrowUpRight: '<path d="M7 17L17 7"/><path d="M8 7h9v9"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  expand: '<path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M16 21h5v-5"/>',
  leaf: '<path d="M4 20c8 2 16-4 16-16C10 4 4 10 4 18z"/><path d="M4 20l9-9"/>',
  menuDots: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
};

export const icon = (name, className = '') =>
  '<svg class="icon ' + className + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';

const sprite = () =>
  '<svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute">' +
  Object.entries(ICONS).map(([name, paths]) =>
    '<symbol id="i-' + name + '" viewBox="0 0 24 24">' + paths + '</symbol>').join('') +
  '</svg>';

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { key: 'home', label: 'Home', href: 'index.html' },
  {
    key: 'accommodation', label: 'Accommodation', href: 'accommodation/bay-apartments.html',
    children: rooms.map((room) => ({ label: room.name, href: 'accommodation/' + room.slug + '.html', meta: room.rate })),
  },
  {
    key: 'facilities', label: 'Facilities', href: 'facilities/waterfront-bar-restaurant.html',
    children: facilities.map((f) => ({ label: f.name, href: 'facilities/' + f.slug + '.html' })),
  },
  {
    key: 'services', label: 'Services', href: 'services/airport-transfers.html',
    children: services.map((s) => ({ label: s.name, href: 'services/' + s.slug + '.html' })),
  },
  { key: 'gallery', label: 'Gallery', href: 'gallery.html' },
  { key: 'location', label: 'Location', href: 'location.html' },
];

const isCurrent = (depth, target, current) => current != null && current !== '' && slugOf(target) === current;

function desktopNav(depth, active, current) {
  return NAV_ITEMS.map((item) => {
    const activeClass = item.key === active ? ' is-active' : '';
    const sub = item.children
      ? '<ul class="nav-sub">' + item.children.map((child) => {
          const cur = isCurrent(depth, child.href, current);
          return '<li><a href="' + url(depth, child.href) + '"' + (cur ? ' class="is-current" aria-current="page"' : '') + '>' +
            '<span>' + esc(child.label) + '</span>' + (child.meta ? '<em>' + esc(child.meta) + '</em>' : '') + '</a></li>';
        }).join('') + '</ul>'
      : '';
    return '<li class="nav-item' + (item.children ? ' nav-item--has-menu' : '') + activeClass + '">' +
      '<a class="nav-link" href="' + url(depth, item.href) + '"' + (item.key === active ? ' aria-current="page"' : '') + '>' +
      esc(item.label) + (item.children ? icon('chevronDown', 'nav-caret') : '') + '</a>' + sub + '</li>';
  }).join('');
}

function mobileNav(depth, active, current) {
  return NAV_ITEMS.map((item) => {
    if (!item.children) {
      return '<li class="m-item"><a class="m-link" href="' + url(depth, item.href) + '">' + esc(item.label) + icon('arrowRight', 'm-link__arrow') + '</a></li>';
    }
    return '<li class="m-item"><details class="m-group">' +
      '<summary class="m-link">' + esc(item.label) + '<span class="m-group__icon">' + icon('chevronDown') + '</span></summary>' +
      '<ul class="m-sub">' + item.children.map((child) => {
        const cur = isCurrent(depth, child.href, current);
        return '<li><a href="' + url(depth, child.href) + '"' + (cur ? ' class="is-current"' : '') + '>' + esc(child.label) + '</a></li>';
      }).join('') + '</ul></details></li>';
  }).join('');
}

// ---------------------------------------------------------------------------
// Header / footer / layout
// ---------------------------------------------------------------------------
function header(depth, active, current) {
  return '<header class="site-header" data-header>' +
    '<div class="container header-inner">' +
      '<a class="brand" href="' + url(depth, 'index.html') + '" aria-label="' + esc(site.name) + ' — home">' +
        '<img class="brand-logo brand-logo--white" src="' + url(depth, 'assets/img/logo-white.svg') + '" alt="" width="160" height="160">' +
        '<img class="brand-logo brand-logo--navy" src="' + url(depth, 'assets/img/logo-navy.svg') + '" alt="" width="160" height="160">' +
        '<span class="brand-text"><span class="brand-text__top">' + esc(site.brandTop) + '</span><span class="brand-text__sub">' + esc(site.brandSub) + '</span></span>' +
      '</a>' +
      '<nav class="primary-nav" aria-label="Primary"><ul class="nav-list">' + desktopNav(depth, active, current) + '</ul></nav>' +
      '<div class="header-actions">' +
        '<a class="header-phone" href="tel:' + site.phoneLocalRaw + '">' + icon('phone') + '<span>' + esc(site.phoneLocal) + '</span></a>' +
        '<a class="btn btn--primary btn--sm header-cta" href="' + url(depth, 'contact.html') + '">Book now</a>' +
        '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu" data-nav-toggle>' +
          '<span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '</button>' +
      '</div>' +
    '</div>' +
  '</header>' +
  '<div class="mobile-menu" id="mobileMenu" hidden>' +
    '<div class="mobile-menu__head">' +
      '<span class="mobile-menu__label">Menu</span>' +
      '<button class="mobile-menu__close" type="button" aria-label="Close menu" data-nav-close>' + icon('close') + '</button>' +
    '</div>' +
    '<nav aria-label="Mobile"><ul class="m-list">' + mobileNav(depth, active, current) + '</ul></nav>' +
    '<div class="mobile-menu__foot">' +
      '<a class="btn btn--primary btn--block" href="' + url(depth, 'contact.html') + '">Book now</a>' +
      '<a class="mobile-menu__phone" href="tel:' + site.phoneLocalRaw + '">' + icon('phone') + esc(site.phoneLocal) + '</a>' +
      '<a class="mobile-menu__phone" href="mailto:' + site.email + '">' + icon('mail') + esc(site.email) + '</a>' +
    '</div>' +
  '</div>';
}

const footerGallery = ['g01', 'g05', 'g09', 'g03', 'g11', 'g07'];

function footer(depth) {
  return '<footer class="site-footer">' +
    '<div class="container footer-grid">' +
      '<div class="footer-col footer-col--brand">' +
        '<a class="brand brand--footer" href="' + url(depth, 'index.html') + '">' +
          '<img class="brand-logo" src="' + url(depth, 'assets/img/logo-white.svg') + '" alt="" width="160" height="160">' +
          '<span class="brand-text"><span class="brand-text__top">' + esc(site.brandTop) + '</span><span class="brand-text__sub">' + esc(site.brandSub) + '</span></span>' +
        '</a>' +
        '<p class="footer-text">' + esc(site.description) + '</p>' +
      '</div>' +
      '<div class="footer-col">' +
        '<h2 class="footer-heading">Explore</h2>' +
        '<ul class="footer-links">' +
          '<li><a href="' + url(depth, 'accommodation/bay-apartments.html') + '">Accommodation</a></li>' +
          '<li><a href="' + url(depth, 'facilities/waterfront-bar-restaurant.html') + '">Facilities</a></li>' +
          '<li><a href="' + url(depth, 'services/airport-transfers.html') + '">Services</a></li>' +
          '<li><a href="' + url(depth, 'gallery.html') + '">Gallery</a></li>' +
          '<li><a href="' + url(depth, 'location.html') + '">Location</a></li>' +
          '<li><a href="' + url(depth, 'contact.html') + '">Contact &amp; bookings</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer-col">' +
        '<h2 class="footer-heading">Stay in touch</h2>' +
        '<ul class="footer-contact">' +
          '<li>' + icon('pin') + '<span>' + esc(site.street) + '<br>' + site.postal.map(esc).join('<br>') + '</span></li>' +
          '<li>' + icon('phone') + '<span><a href="tel:' + site.phoneLocalRaw + '">' + esc(site.phoneLocal) + '</a><br><a href="tel:' + site.phoneMobileRaw + '">' + esc(site.phoneMobile) + '</a></span></li>' +
          '<li>' + icon('mail') + '<a href="mailto:' + site.email + '">' + esc(site.email) + '</a></li>' +
        '</ul>' +
        newsletterForm(false) +
      '</div>' +
      '<div class="footer-col footer-col--gallery">' +
        '<h2 class="footer-heading">Gallery</h2>' +
        '<ul class="footer-gallery">' + footerGallery.map((id) =>
          '<li><a href="' + url(depth, 'gallery.html') + '"><img src="' + url(depth, 'assets/img/gallery/' + id + '-thumb.jpg') + '" alt="" width="640" height="427" loading="lazy"></a></li>').join('') +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<div class="container footer-bottom__inner">' +
        '<p>&copy; ' + new Date().getFullYear() + ' ' + esc(site.legalName) + '. All rights reserved.</p>' +
        '<p class="footer-bottom__meta">Check-in ' + esc(site.checkIn) + ' &middot; Check-out ' + esc(site.checkOut) + ' &middot; <a href="' + url(depth, 'credits.html') + '">Photo credits</a></p>' +
      '</div>' +
      (site.sampleNotice ? '<div class="container footer-demo-note">' + esc(site.sampleNotice) + '</div>' : '') +
    '</div>' +
  '</footer>';
}

const lightboxMarkup = () =>
  '<div class="lightbox" id="lightbox" hidden>' +
    '<div class="lightbox__backdrop" data-lb-close></div>' +
    '<button class="lightbox__close" type="button" aria-label="Close gallery" data-lb-close>' + icon('close') + '</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo" data-lb-prev>' + icon('chevronLeft') + '</button>' +
    '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo" data-lb-next>' + icon('chevronRight') + '</button>' +
    '<figure class="lightbox__figure"><img data-lb-img alt=""><figcaption class="lightbox__caption"><span data-lb-caption></span><em data-lb-count></em></figcaption></figure>' +
  '</div>';

export function layout(options) {
  const {
    depth = 0, title, description = site.description, active = '', current = '',
    bodyClass = '', ogImage = 'assets/img/hero-home-1.jpg', schema = null, children = '', preloadImage = '',
  } = options;
  const fullTitle = title ? title + ' — ' + site.name : site.name + ' — ' + site.tagline;
  const imagePath = ogImage.startsWith('http') ? ogImage : ogImage.startsWith('img/') ? 'assets/' + ogImage : ogImage;
  const image = ogImage.startsWith('http') ? ogImage : site.url + '/' + imagePath;
  return '<!doctype html>\n<html lang="en">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<script>document.documentElement.classList.add("js");</script>\n' +
    '<title>' + esc(fullTitle) + '</title>\n' +
    '<meta name="description" content="' + esc(description) + '">\n' +
    '<meta name="theme-color" content="#0a1f54">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="' + esc(site.name) + '">\n' +
    '<meta property="og:title" content="' + esc(fullTitle) + '">\n' +
    '<meta property="og:description" content="' + esc(description) + '">\n' +
    '<meta property="og:image" content="' + esc(image) + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<link rel="icon" type="image/png" sizes="64x64" href="' + url(depth, 'assets/img/favicon-64.png') + '">\n' +
    '<link rel="apple-touch-icon" href="' + url(depth, 'assets/img/apple-touch-icon.png') + '">\n' +
    '<link rel="preload" as="font" type="font/woff2" crossorigin href="' + url(depth, 'assets/fonts/montserrat-600.woff2') + '">\n' +
    '<link rel="preload" as="font" type="font/woff2" crossorigin href="' + url(depth, 'assets/fonts/hind-400.woff2') + '">\n' +
    (preloadImage ? '<link rel="preload" as="image" href="' + url(depth, preloadImage) + '" fetchpriority="high">\n' : '') +
    '<link rel="stylesheet" href="' + url(depth, 'assets/css/site.css') + '">\n' +
    (schema ? '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n' : '') +
    '</head>\n<body class="' + bodyClass + '">\n' +
    '<a class="skip-link" href="#main">Skip to content</a>\n' +
    sprite() + '\n' +
    header(depth, active, current) + '\n' +
    '<main id="main">\n' + children + '\n</main>\n' +
    footer(depth) + '\n' +
    '<a class="to-top" href="#top" aria-label="Back to top" data-to-top>' + icon('arrowUp') + '</a>\n' +
    lightboxMarkup() + '\n' +
    '<script src="' + url(depth, 'assets/js/site.js') + '" defer></script>\n' +
    '</body>\n</html>\n';
}

// ---------------------------------------------------------------------------
// Reusable blocks
// ---------------------------------------------------------------------------
export function sectionHead({ eyebrow = '', title, text = '', align = 'center', light = false, id = '' }) {
  const classes = ['section-head', align === 'left' ? 'section-head--left' : '', light ? 'section-head--light' : ''].filter(Boolean).join(' ');
  return '<header class="' + classes + '"' + (id ? ' id="' + id + '"' : '') + ' data-reveal>' +
    (eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + '</p>' : '') +
    '<h2 class="section-title">' + esc(title) + '</h2>' +
    '<span class="rule" aria-hidden="true"></span>' +
    (text ? '<p class="section-text">' + esc(text) + '</p>' : '') +
  '</header>';
}

const field = ({ name, label, type = 'text', placeholder = '', required = false, autocomplete = '', options = null, full = false, rows = null, min = null, value = '' }) => {
  const id = 'field-' + name + (rows ? '-page' : '');
  const req = required ? ' required' : '';
  const autocompleteAttr = autocomplete ? ' autocomplete="' + autocomplete + '"' : '';
  const minAttr = min ? ' min="' + min + '"' : '';
  let control;
  if (options) {
    control = '<select class="input" id="' + id + '" name="' + name + '"' + req + '>' +
      options.map((opt) => '<option value="' + esc(opt) + '"' + (opt === value ? ' selected' : '') + '>' + esc(opt) + '</option>').join('') +
      '</select>';
  } else if (rows) {
    control = '<textarea class="input" id="' + id + '" name="' + name + '" rows="' + rows + '" placeholder="' + esc(placeholder) + '">' + esc(value) + '</textarea>';
  } else {
    control = '<input class="input" id="' + id + '" type="' + type + '" name="' + name + '" placeholder="' + esc(placeholder) + '"' + req + autocompleteAttr + minAttr + ' value="' + esc(value) + '">';
  }
  return '<div class="field' + (full ? ' field--full' : '') + '">' +
    '<label class="field__label" for="' + id + '">' + esc(label) + (required ? ' <span class="field__req" aria-hidden="true">*</span>' : '') + '</label>' +
    control +
  '</div>';
};

export function bookingForm(depth, { compact = false, roomPreset = '' } = {}) {
  const roomOptions = ['Any room type'].concat(rooms.map((room) => room.name));
  return '<form class="form form--booking" action="' + url(depth, 'contact.html') + '" method="get" novalidate data-booking-form data-email="' + esc(site.email) + '">' +
    '<div class="form-grid">' +
      field({ name: 'name', label: 'Full name', placeholder: 'Your name', required: true, autocomplete: 'name' }) +
      field({ name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, autocomplete: 'email' }) +
      field({ name: 'checkin', label: 'Check in', type: 'date', required: true }) +
      field({ name: 'checkout', label: 'Check out', type: 'date', required: true }) +
      field({ name: 'room', label: 'Room type', options: roomOptions, value: roomPreset }) +
      field({ name: 'guests', label: 'Guests', options: ['1 guest', '2 guests', '3 guests', '4 guests', '5+ guests'], value: '2 guests' }) +
      field({ name: 'message', label: 'Anything we should know?', placeholder: 'Airport pickup, late arrival, dietary needs…', full: true, rows: compact ? 3 : 4 }) +
    '</div>' +
    '<div class="form-actions">' +
      '<button class="btn btn--primary btn--lg" type="submit">Send booking enquiry' + icon('arrowRight') + '</button>' +
      '<p class="form-note">' + icon('clock') + 'We reply within one business day. Prefer to talk? <a href="tel:' + site.phoneLocalRaw + '">' + esc(site.phoneLocal) + '</a></p>' +
    '</div>' +
    '<p class="form-status" role="status" aria-live="polite" data-form-status></p>' +
  '</form>';
}

export function newsletterForm(showHeading = true) {
  return '<form class="newsletter" action="#" method="post" novalidate data-newsletter-form>' +
    (showHeading ? '<p class="newsletter__label">Newsletter</p>' : '') +
    '<div class="newsletter__row">' +
      '<label class="visually-hidden" for="footer-email">Email address</label>' +
      '<input class="input" id="footer-email" type="email" name="email" placeholder="Your email address" required autocomplete="email">' +
      '<button class="btn btn--primary btn--icon" type="submit" aria-label="Subscribe">' + icon('arrowRight') + '</button>' +
    '</div>' +
    '<p class="newsletter__note">Seasonal offers and news from the lodge. No spam.</p>' +
    '<p class="form-status form-status--sm" role="status" aria-live="polite" data-form-status></p>' +
  '</form>';
}

export function pageHero({ depth, title, eyebrow, lede, banner, breadcrumbs = [] }) {
  const crumbs = breadcrumbs.map((crumb, index) => {
    const last = index === breadcrumbs.length - 1;
    return last
      ? '<li aria-current="page">' + esc(crumb.label) + '</li>'
      : '<li><a href="' + url(depth, crumb.href) + '">' + esc(crumb.label) + '</a></li>';
  }).join('');
  return '<section class="page-hero">' +
    '<div class="page-hero__media"><img src="' + url(depth, banner) + '" alt="" width="1680" height="900" fetchpriority="high"></div>' +
    '<div class="page-hero__overlay" aria-hidden="true"></div>' +
    '<div class="container page-hero__inner">' +
      (crumbs ? '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>' + crumbs + '</ol></nav>' : '') +
      (eyebrow ? '<p class="eyebrow eyebrow--light">' + esc(eyebrow) + '</p>' : '') +
      '<h1 class="page-hero__title">' + esc(title) + '</h1>' +
      (lede ? '<p class="page-hero__lede">' + esc(lede) + '</p>' : '') +
    '</div>' +
  '</section>';
}

export function ctaBand(depth, { title, text, image = 'img/banner-location.jpg' } = {}) {
  return '<section class="cta-band" style="background-image:url(' + url(depth, image) + ')">' +
    '<div class="cta-band__overlay" aria-hidden="true"></div>' +
    '<div class="container cta-band__inner">' +
      '<div class="cta-band__copy" data-reveal>' +
        '<p class="eyebrow eyebrow--light">Reservations</p>' +
        '<h2 class="cta-band__title">' + esc(title || 'Stay on the Papua New Guinea coast') + '</h2>' +
        '<p class="cta-band__text">' + esc(text || 'Rates from PGK 160 per night. Our team replies within one business day.') + '</p>' +
      '</div>' +
      '<div class="cta-band__actions" data-reveal>' +
        '<a class="btn btn--primary btn--lg" href="' + url(depth, 'contact.html') + '">Book your stay' + icon('arrowRight') + '</a>' +
        '<a class="btn btn--ghost btn--lg" href="tel:' + site.phoneLocalRaw + '">' + icon('phone') + esc(site.phoneLocal) + '</a>' +
      '</div>' +
    '</div>' +
  '</section>';
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
function heroSection(depth) {
  const items = slides.map((slide, index) => {
    const primary = '<a class="btn btn--primary btn--lg" href="' + url(depth, slide.primary.href) + '">' + esc(slide.primary.label) + icon('arrowRight') + '</a>';
    const secondary = '<a class="btn btn--ghost btn--lg" href="' + url(depth, slide.secondary.href) + '">' + esc(slide.secondary.label) + icon('arrowUpRight') + '</a>';
    const heading = index === 0
      ? '<h1 class="hero__title">' + esc(slide.title) + '</h1>'
      : '<p class="hero__title">' + esc(slide.title) + '</p>';
    return '<li class="hero__slide' + (index === 0 ? ' is-active' : '') + '" data-slide="' + index + '" role="group" aria-roledescription="slide" aria-label="' + (index + 1) + ' of ' + slides.length + '">' +
      '<img class="hero__img" src="' + url(depth, slide.image) + '" alt="" width="1920" height="1030"' + (index === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '>' +
      '<div class="hero__overlay" aria-hidden="true"></div>' +
      '<div class="container hero__content">' +
        '<p class="eyebrow eyebrow--light hero__eyebrow">' + esc(slide.eyebrow) + '</p>' +
        heading +
        '<p class="hero__text">' + esc(slide.text) + '</p>' +
        '<div class="hero__actions">' + primary + secondary + '</div>' +
      '</div>' +
    '</li>';
  }).join('');

  const dots = slides.map((slide, index) =>
    '<li><button class="hero__dot' + (index === 0 ? ' is-active' : '') + '" type="button" data-hero-dot="' + index + '" aria-label="Go to slide ' + (index + 1) + ': ' + esc(slide.title) + '"><span></span></button></li>').join('');

  return '<section class="hero" id="top" data-hero>' +
    '<div class="hero__viewport"><ul class="hero__slides" data-hero-track>' + items + '</ul></div>' +
    '<button class="hero__arrow hero__arrow--prev" type="button" data-hero-prev aria-label="Previous slide">' + icon('chevronLeft') + '</button>' +
    '<button class="hero__arrow hero__arrow--next" type="button" data-hero-next aria-label="Next slide">' + icon('chevronRight') + '</button>' +
    '<div class="container hero__footer">' +
      '<ul class="hero__dots" data-hero-dots>' + dots + '</ul>' +
      '<div class="hero__meta">' +
        '<span class="hero__count"><em data-hero-current>01</em> / ' + String(slides.length).padStart(2, '0') + '</span>' +
        '<span class="hero__rule" aria-hidden="true"></span>' +
        '<a class="hero__scroll" href="#welcome">Scroll<span class="hero__scroll-line" aria-hidden="true"></span></a>' +
      '</div>' +
    '</div>' +
  '</section>';
}

function welcomeSection(depth) {
  return '<section class="section section--welcome" id="welcome">' +
    '<div class="container split">' +
      '<div class="split__copy" data-reveal>' +
        '<p class="eyebrow">Boutique hotel &middot; Papua New Guinea</p>' +
        '<h2 class="section-title section-title--left">' + esc(site.name) + '</h2>' +
        '<span class="rule rule--left" aria-hidden="true"></span>' +
        '<p class="lead">' + esc(site.description) + '</p>' +
        '<p>The hotel offers rooms, serviced apartments and self-contained cottages, ten minutes from the airport and five minutes from the town centre.</p>' +
        (site.hideStats ? '' : '<ul class="stats">' + stats.map((stat) =>
          '<li><span class="stats__value">' + esc(stat.value) + '</span><span class="stats__label">' + esc(stat.label) + '</span></li>').join('') + '</ul>') +
        '<div class="split__actions">' +
          '<a class="btn btn--primary" href="' + url(depth, 'accommodation/bay-apartments.html') + '">Explore the rooms' + icon('arrowRight') + '</a>' +
          '<a class="link-arrow" href="' + url(depth, 'location.html') + '">Find us on the map' + icon('arrowUpRight') + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="split__media" data-reveal>' +
        '<figure class="media-frame"><img src="' + url(depth, 'assets/img/welcome-pool.jpg') + '" alt="The oceanfront pool and tropical gardens at the lodge" width="1400" height="750" loading="lazy">' +
          '<figcaption class="media-frame__badge">' + icon('pin') + '<span>' + esc(site.street) + '<br>Location, Papua New Guinea</span></figcaption>' +
        '</figure>' +
      '</div>' +
    '</div>' +
  '</section>';
}

function bookingSection(depth) {
  return '<section class="section section--booking" id="booking">' +
    '<div class="container split split--reverse">' +
      '<div class="split__copy" data-reveal>' +
        '<p class="eyebrow">Stay in paradise</p>' +
        '<h2 class="section-title section-title--left">Book your rooms</h2>' +
        '<span class="rule rule--left" aria-hidden="true"></span>' +
        '<p class="lead">' + esc(site.description) + '</p>' +
        '<ul class="check-list check-list--two">' +
          '<li>' + icon('check') + '54 rooms &amp; suites</li>' +
          '<li>' + icon('check') + '12 furnished apartments</li>' +
          '<li>' + icon('check') + '10 self-contained cottages</li>' +
          '<li>' + icon('check') + 'Restaurant, bar &amp; cafe</li>' +
          '<li>' + icon('check') + 'Oceanfront pool &amp; gym</li>' +
          '<li>' + icon('check') + 'Airport transfers</li>' +
        '</ul>' +
        '<p class="split__note">Rates from <strong>PGK 160</strong> per night. Book direct for the best available rate.</p>' +
      '</div>' +
      '<div class="booking-panel" data-reveal>' +
        '<div class="booking-panel__head">' +
          '<p class="booking-panel__label">Reservations</p>' +
          '<h3 class="booking-panel__title">Check availability</h3>' +
        '</div>' +
        bookingForm(depth) +
      '</div>' +
    '</div>' +
  '</section>';
}

function roomCard(depth, room) {
  return '<li class="room-card">' +
    '<a class="room-card__media" href="' + url(depth, 'accommodation/' + room.slug + '.html') + '" tabindex="-1" aria-hidden="true">' +
      '<img src="' + url(depth, room.images[0].src) + '" alt="' + esc(room.images[0].alt) + '" width="1000" height="575" loading="lazy">' +
      '<span class="room-card__rate">From <strong>' + esc(room.rate) + '</strong></span>' +
    '</a>' +
    '<div class="room-card__body">' +
      '<h3 class="room-card__title"><a href="' + url(depth, 'accommodation/' + room.slug + '.html') + '">' + esc(room.name) + '</a></h3>' +
      '<p class="room-card__text">' + esc(room.short) + '</p>' +
      '<span class="room-card__link">View room' + icon('arrowRight') + '</span>' +
    '</div>' +
  '</li>';
}

function roomsSection(depth) {
  return '<section class="section section--rooms" id="accommodation">' +
    '<div class="container">' +
      sectionHead({
        eyebrow: 'Where you will stay',
        title: 'Accommodation',
        text: 'Rooms, serviced apartments and self-contained cottages, ten minutes from the airport and a few minutes from the town centre.',
        light: true,
      }) +
      '<div class="carousel" data-carousel>' +
        '<ul class="carousel__track rooms-track" data-carousel-track>' + rooms.map((room) => roomCard(depth, room)).join('') + '</ul>' +
        '<div class="carousel__controls">' +
          '<button class="carousel__btn" type="button" data-carousel-prev aria-label="Previous rooms">' + icon('chevronLeft') + '</button>' +
          '<button class="carousel__btn" type="button" data-carousel-next aria-label="Next rooms">' + icon('chevronRight') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';
}

function featuresSection(depth) {
  const left = highlights.slice(0, 3);
  const right = highlights.slice(3);
  const item = (feature, align) => '<li class="feature feature--' + align + '">' +
    '<span class="feature__icon">' + icon(feature.icon) + '</span>' +
    '<div class="feature__body"><h3 class="feature__title">' + esc(feature.title) + '</h3><p class="feature__text">' + esc(feature.text) + '</p></div>' +
  '</li>';
  return '<section class="section section--features" id="facilities">' +
    '<div class="container">' +
      sectionHead({
        eyebrow: 'At your service',
        title: 'Professional services',
        text: 'Overlooking the ocean, the restaurant deck is the perfect spot to relax and unwind over a meal from the fusion menu.',
      }) +
      '<div class="features">' +
        '<ul class="features__col">' + left.map((f) => item(f, 'left')).join('') + '</ul>' +
        '<figure class="features__media" data-reveal><img src="' + url(depth, 'assets/img/services-feature.jpg') + '" alt="The lodge restaurant and grounds" width="780" height="1206" loading="lazy">' +
          '<figcaption class="features__media-caption">' + icon('leaf') + 'One of PNG best orchid collections, in the gardens</figcaption>' +
        '</figure>' +
        '<ul class="features__col">' + right.map((f) => item(f, 'right')).join('') + '</ul>' +
      '</div>' +
    '</div>' +
  '</section>';
}

function gallerySection(depth) {
  return '<section class="gallery-band" id="gallery-preview">' +
    '<img class="gallery-band__img" src="' + url(depth, 'assets/img/gallery-band.jpg') + '" alt="" width="1600" height="700" loading="lazy">' +
    '<div class="gallery-band__overlay" aria-hidden="true"></div>' +
    '<div class="gallery-band__content">' +
      '<p class="eyebrow eyebrow--light">Gallery</p>' +
      '<h2 class="gallery-band__title">Tropical gardens, ocean views<br><em>and long, slow evenings</em></h2>' +
      '<p class="gallery-band__text">A look around the lodge, the grounds and the coast.</p>' +
      '<a class="btn btn--primary btn--lg" href="' + url(depth, 'gallery.html') + '">Explore the gallery' + icon('arrowRight') + '</a>' +
    '</div>' +
  '</section>';
}

export function homePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneLocal,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: 'Location',
      addressRegion: 'Papua New Guinea',
      addressCountry: 'PG',
    },
    priceRange: 'PGK 160 - PGK 990',
    amenityFeature: ['Free Wi-Fi', 'Swimming pool', 'Fitness centre', 'Restaurant', 'Bar', 'Free parking', 'Airport transfers']
      .map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  };
  return layout({
    depth: 0,
    title: '',
    description: site.description,
    active: 'home',
    bodyClass: 'page-home',
    schema,
    preloadImage: slides[0].image,
    children: [
      heroSection(0),
      welcomeSection(0),
      bookingSection(0),
      roomsSection(0),
      featuresSection(0),
      gallerySection(0),
      ctaBand(0, {}),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Accommodation detail pages
// ---------------------------------------------------------------------------
function viewer(images, depth, label) {
  return '<div class="viewer" data-viewer data-gallery="' + esc(label) + '">' +
    '<div class="viewer__main">' +
      '<img class="viewer__img" data-viewer-img src="' + url(depth, images[0].src) + '" alt="' + esc(images[0].alt) + '" width="1000" height="575" fetchpriority="high">' +
      (images.length > 1
        ? '<button class="viewer__nav viewer__nav--prev" type="button" data-viewer-prev aria-label="Previous photo">' + icon('chevronLeft') + '</button>' +
          '<button class="viewer__nav viewer__nav--next" type="button" data-viewer-next aria-label="Next photo">' + icon('chevronRight') + '</button>'
        : '') +
      '<button class="viewer__expand" type="button" data-lightbox-open aria-label="View photo full screen">' + icon('expand') + '</button>' +
    '</div>' +
    (images.length > 1
      ? '<ul class="viewer__thumbs">' + images.map((image, index) =>
          '<li><button class="viewer__thumb' + (index === 0 ? ' is-active' : '') + '" type="button" data-viewer-thumb="' + index + '" data-full="' + url(depth, image.src) + '" data-caption="' + esc(image.alt) + '" aria-label="Show photo ' + (index + 1) + ': ' + esc(image.alt) + '">' +
          '<img src="' + url(depth, image.src) + '" alt="" width="1000" height="575" loading="lazy"></button></li>').join('') + '</ul>'
      : '') +
  '</div>';
}

function asideContact(depth) {
  return '<div class="aside-card">' +
    '<h2 class="aside-card__title">Quick contact</h2>' +
    '<ul class="aside-contact">' +
      '<li>' + icon('phone') + '<span><em>Landline</em><a href="tel:' + site.phoneLocalRaw + '">' + esc(site.phoneLocal) + '</a></span></li>' +
      '<li>' + icon('phone') + '<span><em>Mobile</em><a href="tel:' + site.phoneMobileRaw + '">' + esc(site.phoneMobile) + '</a></span></li>' +
      '<li>' + icon('mail') + '<span><em>Email</em><a href="mailto:' + site.email + '">' + esc(site.email) + '</a></span></li>' +
      '<li>' + icon('pin') + '<span><em>Find us</em>' + esc(site.street) + '</span></li>' +
    '</ul>' +
    '<a class="link-arrow" href="' + url(depth, 'contact.html') + '">Send an enquiry' + icon('arrowRight') + '</a>' +
  '</div>';
}

function asideLinks(depth, title, items) {
  return '<div class="aside-card">' +
    '<h2 class="aside-card__title">' + esc(title) + '</h2>' +
    '<ul class="aside-links">' + items.map((item) =>
      '<li><a href="' + url(depth, item.href) + '"><span>' + esc(item.label) + '</span>' + (item.meta ? '<em>' + esc(item.meta) + '</em>' : icon('chevronRight')) + '</a></li>').join('') + '</ul>' +
  '</div>';
}

function amenityIcon(label) {
  const value = label.toLowerCase();
  if (value.includes('wi-fi') || value.includes('wifi')) return 'wifi';
  if (value.includes('room service')) return 'bell';
  if (value.includes('parking')) return 'car';
  if (value.includes('water')) return 'droplet';
  if (value.includes('gym')) return 'dumbbell';
  if (value.includes('shuttle') || value.includes('transfer')) return 'bus';
  if (value.includes('breakfast') || value.includes('coffee')) return 'coffee';
  return 'check';
}

export function roomPage(room) {
  const depth = 1;
  const others = rooms.filter((item) => item.slug !== room.slug);
  return layout({
    depth,
    title: room.name,
    description: room.short,
    active: 'accommodation',
    current: room.slug,
    bodyClass: 'page-room',
    ogImage: room.images[0].src,
    children: [
      pageHero({
        depth,
        eyebrow: 'Accommodation',
        title: room.name,
        lede: room.short,
        banner: room.banner,
        breadcrumbs: [
          { label: 'Home', href: 'index.html' },
          { label: 'Accommodation', href: 'accommodation/bay-apartments.html' },
          { label: room.name },
        ],
      }),
      '<section class="section">' +
        '<div class="container layout">' +
          '<article class="layout__main">' +
            viewer(room.images, depth, room.name) +
            '<div class="prose" data-reveal>' +
              '<p class="eyebrow">The room</p>' +
              '<h2>' + esc(room.name) + '</h2>' +
              room.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join('') +
            '</div>' +
            '<dl class="facts" data-reveal>' + room.facts.map((fact) =>
              '<div class="facts__item"><dt>' + esc(fact.label) + '</dt><dd>' + esc(fact.value) + '</dd></div>').join('') + '</dl>' +
            '<div class="amenities" data-reveal>' +
              '<h2 class="amenities__title">In every room</h2>' +
              '<ul class="amenities__list">' + room.amenities.map((item) =>
                '<li>' + icon(amenityIcon(item)) + '<span>' + esc(item) + '</span></li>').join('') + '</ul>' +
            '</div>' +
          '</article>' +
          '<aside class="layout__aside">' +
            '<div class="aside-card aside-card--rate" data-reveal>' +
              '<p class="aside-card__label">Rates from</p>' +
              '<p class="rate"><span class="rate__value">' + esc(room.rate) + '</span><span class="rate__note">' + esc(room.rateNote) + '</span></p>' +
              '<a class="btn btn--primary btn--block" href="' + url(depth, 'contact.html?room=' + room.slug) + '">Enquire to book' + icon('arrowRight') + '</a>' +
              '<p class="aside-card__note">' + icon('clock') + 'Check-in ' + esc(site.checkIn) + ' &middot; check-out ' + esc(site.checkOut) + '</p>' +
            '</div>' +
            asideContact(depth) +
            asideLinks(depth, 'Other rooms', others.map((item) => ({ label: item.name, href: 'accommodation/' + item.slug + '.html', meta: item.rate }))) +
          '</aside>' +
        '</div>' +
      '</section>',
      ctaBand(depth, { title: 'Book the ' + room.name, text: 'Direct bookings receive our best available rate. Tell us your dates and we will confirm availability within one business day.' }),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Facility & service pages
// ---------------------------------------------------------------------------
function hoursCard(hours) {
  if (!hours.length) return '';
  return '<div class="aside-card aside-card--hours">' +
    '<h2 class="aside-card__title">Opening hours</h2>' +
    '<dl class="hours">' + hours.map((row) =>
      '<div class="hours__row"><dt>' + esc(row.label) + '</dt><dd>' + esc(row.value) + '</dd></div>').join('') + '</dl>' +
  '</div>';
}

export function facilityPage(facility) {
  const depth = 1;
  const others = facilities.filter((item) => item.slug !== facility.slug);
  const galleryImages = facility.images.length ? facility.images : [];
  return layout({
    depth,
    title: facility.name,
    description: facility.short,
    active: 'facilities',
    current: facility.slug,
    bodyClass: 'page-facility',
    ogImage: facility.banner,
    children: [
      pageHero({
        depth,
        eyebrow: 'Facilities',
        title: facility.name,
        lede: facility.short,
        banner: facility.banner,
        breadcrumbs: [
          { label: 'Home', href: 'index.html' },
          { label: 'Facilities', href: 'facilities/waterfront-bar-restaurant.html' },
          { label: facility.name },
        ],
      }),
      '<section class="section">' +
        '<div class="container layout">' +
          '<article class="layout__main">' +
            viewer(galleryImages.length ? galleryImages : [{ src: facility.banner, alt: facility.name }], depth, facility.name) +
            '<div class="prose" data-reveal>' +
              '<p class="eyebrow">Facilities</p>' +
              '<h2>' + esc(facility.name) + '</h2>' +
              facility.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join('') +
            '</div>' +
            (facility.hours.length
              ? '<div class="inline-hours" data-reveal><h2 class="inline-hours__title">When to visit</h2><dl class="hours hours--wide">' +
                facility.hours.map((row) => '<div class="hours__row"><dt>' + esc(row.label) + '</dt><dd>' + esc(row.value) + '</dd></div>').join('') + '</dl></div>'
              : '') +
          '</article>' +
          '<aside class="layout__aside">' +
            asideContact(depth) +
            asideLinks(depth, 'More facilities', others.map((item) => ({ label: item.name, href: 'facilities/' + item.slug + '.html' }))) +
            asideLinks(depth, 'Accommodation', rooms.map((item) => ({ label: item.name, href: 'accommodation/' + item.slug + '.html', meta: item.rate }))) +
          '</aside>' +
        '</div>' +
      '</section>',
      ctaBand(depth, {}),
    ].join('\n'),
  });
}

export function servicePage(service) {
  const depth = 1;
  const others = services.filter((item) => item.slug !== service.slug);
  return layout({
    depth,
    title: service.name,
    description: service.short,
    active: 'services',
    current: service.slug,
    bodyClass: 'page-service',
    ogImage: service.banner,
    children: [
      pageHero({
        depth,
        eyebrow: 'Services',
        title: service.name,
        lede: service.short,
        banner: service.banner,
        breadcrumbs: [
          { label: 'Home', href: 'index.html' },
          { label: 'Services', href: 'services/airport-transfers.html' },
          { label: service.name },
        ],
      }),
      '<section class="section">' +
        '<div class="container layout">' +
          '<article class="layout__main">' +
            viewer(service.images, depth, service.name) +
            '<div class="prose" data-reveal>' +
              '<p class="eyebrow">Services</p>' +
              '<h2>' + esc(service.name) + '</h2>' +
              service.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join('') +
            '</div>' +
            (service.hours.length
              ? '<div class="inline-hours" data-reveal><h2 class="inline-hours__title">Good to know</h2><dl class="hours hours--wide">' +
                service.hours.map((row) => '<div class="hours__row"><dt>' + esc(row.label) + '</dt><dd>' + esc(row.value) + '</dd></div>').join('') + '</dl></div>'
              : '') +
          '</article>' +
          '<aside class="layout__aside">' +
            hoursCard(service.hours) +
            asideContact(depth) +
            asideLinks(depth, 'Other services', others.map((item) => ({ label: item.name, href: 'services/' + item.slug + '.html' }))) +
          '</aside>' +
        '</div>' +
      '</section>',
      ctaBand(depth, {}),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Gallery page
// ---------------------------------------------------------------------------
export function galleryPage() {
  const depth = 0;
  const filters = galleryCategories.map((category, index) =>
    '<li><button class="filter' + (index === 0 ? ' is-active' : '') + '" type="button" data-filter="' + category.id + '" aria-pressed="' + (index === 0) + '">' + esc(category.label) + '</button></li>').join('');
  const items = gallery.map((image, index) =>
    '<li class="gallery-item" data-category="' + image.category + '" data-reveal>' +
      '<button class="gallery-item__btn" type="button" data-lightbox data-src="' + url(depth, image.src) + '" data-caption="' + esc(image.alt) + '" aria-label="Open photo: ' + esc(image.alt) + '">' +
        '<img src="' + url(depth, image.thumb) + '" alt="' + esc(image.alt) + '" width="640" height="427" loading="lazy">' +
        '<span class="gallery-item__zoom">' + icon('search') + '</span>' +
      '</button>' +
    '</li>').join('');
  return layout({
    depth,
    title: 'Gallery',
    description: 'Photographs of ' + site.name + ' — the gardens, pool, rooms, dining and the Papua New Guinea coast.',
    active: 'gallery',
    bodyClass: 'page-gallery',
    ogImage: 'img/banner-gallery.jpg',
    children: [
      pageHero({
        depth,
        eyebrow: 'Gallery',
        title: 'The lodge in pictures',
        lede: 'Tropical gardens, an oceanfront pool, local craft and the calm of the coast.',
        banner: 'img/banner-gallery.jpg',
        breadcrumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Gallery' }],
      }),
      '<section class="section section--gallery">' +
        '<div class="container">' +
          '<div class="gallery-toolbar" data-reveal><ul class="filters">' + filters + '</ul><p class="gallery-count" data-gallery-count>' + gallery.length + ' photographs</p></div>' +
          '<ul class="gallery-grid" data-gallery-grid>' + items + '</ul>' +
        '</div>' +
      '</section>',
      ctaBand(depth, { title: 'Come and see it for yourself', text: 'Rates from PGK 160 per night. Tell us your dates and we will confirm availability within one business day.' }),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Map / directions (deliberately image-based, so it works offline and does not
// depend on third-party embeds — the button opens Google Maps)
// ---------------------------------------------------------------------------
export function mapPanel(depth, { image = 'img/banner-location.jpg' } = {}) {
  return '<div class="map-panel" data-reveal>' +
    '<img class="map-panel__img" src="' + url(depth, image) + '" alt="The Papua New Guinea coastline" width="1680" height="900" loading="lazy">' +
    '<div class="map-panel__card">' +
      '<span class="map-panel__pin">' + icon('pin') + '</span>' +
      '<p class="map-panel__title">' + esc(site.name) + '</p>' +
      '<p class="map-panel__address">' + esc(site.street) + '<br>' + esc(site.postal.join(', ')) + '</p>' +
      '<a class="btn btn--primary btn--block" href="' + site.mapsUrl + '" target="_blank" rel="noopener">Open in Google Maps' + icon('arrowUpRight') + '</a>' +
      '<a class="map-panel__link" href="tel:' + site.phoneLocalRaw + '">' + icon('phone') + esc(site.phoneLocal) + '</a>' +
    '</div>' +
  '</div>';
}

export function directionsBand(depth) {
  return '<section class="directions-band">' +
    '<div class="directions-band__bg" aria-hidden="true"><img src="' + url(depth, 'img/banner-contact.jpg') + '" alt="" width="1680" height="900" loading="lazy"></div>' +
    '<div class="container directions-band__inner">' +
      '<div class="directions-band__copy" data-reveal>' +
        '<p class="eyebrow eyebrow--light">Getting here</p>' +
        '<h2 class="directions-band__title">Find us on the coast road</h2>' +
        '<p class="directions-band__text">' + esc(site.name) + ' is ten minutes from the airport and five minutes from the town centre. Airport transfers can be arranged through reception.</p>' +
      '</div>' +
      '<div class="directions-band__panel" data-reveal>' +
        '<ul class="directions-band__list">' +
          '<li>' + icon('car') + '<span><em>From the airport</em>10 minutes by road</span></li>' +
          '<li>' + icon('pin') + '<span><em>Address</em>' + esc(site.street) + ', Location, Papua New Guinea</span></li>' +
          '<li>' + icon('clock') + '<span><em>Transfers</em>5:00am &ndash; 6:00pm, by arrangement</span></li>' +
        '</ul>' +
        '<a class="btn btn--primary" href="' + site.mapsUrl + '" target="_blank" rel="noopener">Open in Google Maps' + icon('arrowUpRight') + '</a>' +
      '</div>' +
    '</div>' +
  '</section>';
}

// ---------------------------------------------------------------------------
// Location page
// ---------------------------------------------------------------------------
export function locationPage() {
  const depth = 0;
  const prose = [
    { title: 'The lodge', text: site.name + ' sits on a quiet stretch of coast, ten minutes from the airport and just a few minutes from the town centre. Flights arrive daily from the capital and other regional towns.' },
    { title: 'The province', text: 'The lodge is on the northern coast of Papua New Guinea, three degrees south of the equator. Average highs sit around 30 degrees Celsius all year, with lows of roughly 23 degrees.' },
    { title: 'A blend of cultures', text: 'The region is home to a blend of cultures and more than 170 languages. It is widely considered one of the most beautiful and untouched parts of the country.' },
    { title: 'The water', text: 'Clear water and reefs stretch along the coastline and around the islands scattered across the bay. Palm-lined volcanic shoreline and white sand beaches make a striking backdrop from every angle.' },
    { title: 'Diving & fishing', text: 'The ocean geography and climate offer some of the best diving and snorkelling in the world. Fishing is a way of life here, and traditional canoes can be seen on the water each morning and afternoon.' },
    { title: 'Local culture', text: 'Cultural shows and sing sings take place through the year, with groups gathering in painted faces, feathers, beads and shells. Ask reception for the dates of upcoming events during your stay.' },
  ];
  return layout({
    depth,
    title: 'Location',
    description: 'Sample Lodge Hotel is ten minutes from the airport and five minutes from the town centre, on the coast of Papua New Guinea.',
    active: 'location',
    bodyClass: 'page-location',
    ogImage: 'img/banner-location.jpg',
    children: [
      pageHero({
        depth,
        eyebrow: 'Location',
        title: 'On the Papua New Guinea coast',
        lede: 'Ten minutes from the airport, five minutes from town, with the water at the end of the road.',
        banner: 'img/banner-location.jpg',
        breadcrumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Location' }],
      }),
      '<section class="section">' +
        '<div class="container">' +
          '<div class="split split--top">' +
            '<div class="split__copy" data-reveal>' +
              '<p class="eyebrow">Finding us</p>' +
              '<h2 class="section-title section-title--left">A quiet stretch of the coast</h2>' +
              '<span class="rule rule--left" aria-hidden="true"></span>' +
              '<p class="lead">The lodge sits on a quiet stretch of coast, amongst manicured tropical gardens just minutes from the town centre.</p>' +
              '<ul class="contact-facts">' +
                '<li>' + icon('car') + '<span><em>From the airport</em>10 minutes by road</span></li>' +
                '<li>' + icon('pin') + '<span><em>From town</em>5 minutes down the coast road</span></li>' +
                '<li>' + icon('clock') + '<span><em>Transfers</em>5:00am &ndash; 6:00pm, by arrangement</span></li>' +
              '</ul>' +
              '<div class="split__actions">' +
                '<a class="btn btn--primary" href="' + url(depth, 'contact.html') + '">Arrange a transfer' + icon('arrowRight') + '</a>' +
                '<a class="link-arrow" href="tel:' + site.phoneLocalRaw + '">Call reception' + icon('phone') + '</a>' +
              '</div>' +
            '</div>' +
            mapPanel(depth, { image: 'img/banner-location.jpg' }) +
          '</div>' +
          '<div class="location-grid">' + prose.map((section) =>
            '<article class="location-card" data-reveal><h2 class="location-card__title">' + esc(section.title) + '</h2><p>' + esc(section.text) + '</p></article>').join('') + '</div>' +
        '</div>' +
      '</section>',
      ctaBand(depth, { title: 'Plan your stay', text: 'Tell us when you are travelling and we will help with rooms, transfers and anything else you need.' }),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Contact page
// ---------------------------------------------------------------------------
export function contactPage() {
  const depth = 0;
  const faq = contactFaq.map((item, index) =>
    '<details class="faq"' + (index === 0 ? ' open' : '') + '><summary class="faq__q">' + esc(item.q) + '<span class="faq__icon">' + icon('chevronDown') + '</span></summary><div class="faq__a"><p>' + esc(item.a) + '</p></div></details>').join('');
  return layout({
    depth,
    title: 'Contact & bookings',
    description: 'Contact Sample Lodge Hotel for reservations, airport transfers, conferences and spa bookings. Call ' + site.phoneLocal + ' or email ' + site.email + '.',
    active: 'contact',
    bodyClass: 'page-contact',
    ogImage: 'img/banner-contact.jpg',
    children: [
      pageHero({
        depth,
        eyebrow: 'Contact',
        title: 'Have a question?',
        lede: site.description,
        banner: 'img/banner-contact.jpg',
        breadcrumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact' }],
      }),
      '<section class="section">' +
        '<div class="container contact-grid">' +
          '<div class="contact-form-wrap" data-reveal>' +
            '<p class="eyebrow">Leave a message</p>' +
            '<h2 class="section-title section-title--left">Book direct with the lodge</h2>' +
            '<span class="rule rule--left" aria-hidden="true"></span>' +
            '<p class="lead">Tell us your dates and room preference, or ask us anything about the lodge. We reply within one business day.</p>' +
            bookingForm(depth) +
          '</div>' +
          '<aside class="contact-aside" data-reveal>' +
            '<div class="aside-card aside-card--dark">' +
              '<h2 class="aside-card__title">Contact details</h2>' +
              '<ul class="aside-contact aside-contact--light">' +
                '<li>' + icon('pin') + '<span><em>Postal address</em>' + site.postal.map(esc).join('<br>') + '</span></li>' +
                '<li>' + icon('phone') + '<span><em>Phone</em>Local: <a href="tel:' + site.phoneLocalRaw + '">' + esc(site.phoneLocal) + '</a><br>Mobile: <a href="tel:' + site.phoneMobileRaw + '">' + esc(site.phoneMobile) + '</a></span></li>' +
                '<li>' + icon('mail') + '<span><em>Email</em><a href="mailto:' + site.email + '">' + esc(site.email) + '</a></span></li>' +
                '<li>' + icon('clock') + '<span><em>Reception hours</em>Check-in from ' + esc(site.checkIn) + '<br>Check-out by ' + esc(site.checkOut) + '</span></li>' +
              '</ul>' +
            '</div>' +
            '<div class="aside-card">' +
              '<h2 class="aside-card__title">Prefer to call?</h2>' +
              '<p class="aside-card__text">Our reservations team is happy to help with rooms, airport transfers, conferences, the spa and the restaurant.</p>' +
              '<a class="btn btn--primary btn--block" href="tel:' + site.phoneLocalRaw + '">' + icon('phone') + esc(site.phoneLocal) + '</a>' +
              '<a class="link-arrow" href="' + url(depth, 'contact.html') + '">Send us a message' + icon('arrowRight') + '</a>' +
            '</div>' +
          '</aside>' +
        '</div>' +
        '<div class="container faq-wrap">' +
          sectionHead({ eyebrow: 'Before you arrive', title: 'Frequently asked questions', align: 'left' }) +
          '<div class="faq-list" data-reveal>' + faq + '</div>' +
        '</div>' +
      '</section>',
      directionsBand(depth),
      ctaBand(depth, { title: 'We look forward to welcoming you', text: 'Book direct for the best available rate. Our team replies within one business day.' }),
    ].join('\n'),
  });
}

// ---------------------------------------------------------------------------
// Redirect-style pages are not needed — links point at real pages.
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------
export function notFoundPage() {
  return layout({
    depth: 0,
    title: 'Page not found',
    description: 'The page you are looking for could not be found. Return to ' + site.name + '.',
    active: '',
    bodyClass: 'page-404',
    children: '<section class="notfound">' +
      '<div class="notfound__media"><img src="assets/img/banner-location.jpg" alt="" width="1680" height="900"></div>' +
      '<div class="notfound__overlay" aria-hidden="true"></div>' +
      '<div class="container notfound__inner">' +
        '<p class="eyebrow eyebrow--light">404</p>' +
        '<h1 class="notfound__title">This path leads to the garden, not a page</h1>' +
        '<p class="notfound__text">The page you were looking for has moved or never existed. Let us point you back to the lodge.</p>' +
        '<div class="notfound__actions">' +
          '<a class="btn btn--primary btn--lg" href="index.html">Back to home' + icon('arrowRight') + '</a>' +
          '<a class="btn btn--ghost btn--lg" href="accommodation/bay-apartments.html">View accommodation</a>' +
        '</div>' +
        '<ul class="notfound__links">' +
          '<li><a href="gallery.html">Gallery</a></li>' +
          '<li><a href="location.html">Location</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        '</ul>' +
      '</div>' +
    '</section>',
  });
}


// ---------------------------------------------------------------------------
// Photo credits
// ---------------------------------------------------------------------------
import credits from './credits.json' with { type: 'json' };

const creditRows = (() => {
  const seen = new Map();
  for (const entry of credits) {
    const key = entry.landing || entry.title;
    if (!seen.has(key)) seen.set(key, { ...entry, assets: [] });
    seen.get(key).assets.push(entry.asset);
  }
  return [...seen.values()].sort((a, b) => a.title.localeCompare(b.title));
})();

export function creditsPage() {
  const rows = creditRows.map((credit) => {
    const license = String(credit.license || 'cc0').toUpperCase().replace(/-/g, '-');
    const creator = credit.creator ? esc(credit.creator) : 'Unknown';
    return '<tr>' +
      '<td data-label="Image"><a href="' + esc(credit.landing) + '" target="_blank" rel="noopener">' + esc(credit.title || 'Untitled') + '</a></td>' +
      '<td data-label="Photographer">' + creator + '</td>' +
      '<td data-label="Licence"><span class="credits-license">' + license + '</span></td>' +
      '<td data-label="Source">' + esc(credit.source || 'Openverse') + '</td>' +
    '</tr>';
  }).join('');
  return layout({
    depth: 0,
    title: 'Photo credits',
    description: 'Attribution for the stock photography used on this demo website.',
    active: '',
    bodyClass: 'page-credits',
    children: '<section class="section credits">' +
      '<div class="container">' +
        sectionHead({ eyebrow: 'Attribution', title: 'Photo credits', align: 'left', text: 'This demo uses openly licensed photography from StockSnap, Rawpixel, Wikimedia Commons and WordPress Photo Directory, sourced through the Openverse index. Images are listed with their creator and licence. Replace them with your own photography before launching.' }) +
        '<div class="credits-table-wrap"><table class="credits-table"><thead><tr><th>Image</th><th>Photographer</th><th>Licence</th><th>Source</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p class="credits-note">Licences: CC0 and Public Domain require no attribution; CC BY and CC BY-SA require credit to the photographer, which is provided here. Trademarks and people depicted remain the property of their respective owners.</p>' +
      '</div>' +
    '</section>',
  });
}
