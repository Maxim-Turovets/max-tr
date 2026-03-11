(function () {
  'use strict';

  /* ============================================================
     1. HERO PARTICLES — blockchain network graph
     ============================================================ */
  (function () {
    var home = document.getElementById('home');
    if (!home) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;' +
      'pointer-events:none;z-index:0;';
    home.insertBefore(canvas, home.firstChild);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var COUNT = 70;
    var LINK_DIST = 140;

    function resize() {
      canvas.width  = home.offsetWidth;
      canvas.height = home.offsetHeight;
    }

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.8;
      this.a  = Math.random() * 0.5 + 0.15;
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    };

    function init() {
      particles = [];
      for (var i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.update();

        /* dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,63,82,' + p.a + ')';
        ctx.fill();

        /* connections */
        for (var j = i + 1; j < particles.length; j++) {
          var q  = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            var alpha = (1 - d / LINK_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(212,63,82,' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    resize();
    init();
    animate();
    window.addEventListener('resize', function () { resize(); init(); });
  }());


  /* ============================================================
     2. GLITCH EFFECT — hero h1 (non-destructive)
     ============================================================ */
  (function () {
    var h1 = document.querySelector('#home h1');
    if (!h1) return;

    h1.setAttribute('data-text', h1.textContent);

    var isRunning = false;

    function triggerGlitch() {
      if (isRunning) return;
      isRunning = true;
      h1.classList.add('is-glitching');

      setTimeout(function () {
        h1.classList.remove('is-glitching');
        isRunning = false;
      }, 720);
    }

    setTimeout(triggerGlitch, 1800);
    setInterval(triggerGlitch, 9000);
  }());


  /* ============================================================
     3. PROGRESS BAR ANIMATION — fill from 0 on scroll-into-view
     ============================================================ */
  (function () {
    var bars = document.querySelectorAll('.progress-bar-danger');
    var targets = [];

    /* store original widths, reset to 0 */
    for (var i = 0; i < bars.length; i++) {
      targets.push(bars[i].style.width);
      bars[i].style.width = '0%';
      bars[i].style.transition = 'none';
    }

    var animated = false;

    function check() {
      if (animated) return;
      var sections = document.querySelectorAll('#skills-java,#skills-solidity,#skills-devops');
      var inView = false;
      for (var s = 0; s < sections.length; s++) {
        var r = sections[s].getBoundingClientRect();
        if (r.top < window.innerHeight - 80) { inView = true; break; }
      }
      if (!inView) return;
      animated = true;

      bars.forEach(function (bar, idx) {
        var delay = (idx % 15) * 60; /* stagger per section group */
        setTimeout(function () {
          bar.style.transition = 'width 1.1s cubic-bezier(0.25, 0.8, 0.25, 1)';
          bar.style.width = targets[idx];
        }, delay);
      });
    }

    window.addEventListener('scroll', check, { passive: true });
    setTimeout(check, 600);
  }());


  /* ============================================================
     4. NAVBAR — highlight active section on scroll
     ============================================================ */
  (function () {
    var navLinks = document.querySelectorAll('#navbar nav a');
    var sectionIds = [];
    navLinks.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      if (id) sectionIds.push(id);
    });

    function onScroll() {
      var scrollY = window.pageYOffset + 80;
      var active = sectionIds[0];
      sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = id;
      });
      navLinks.forEach(function (a) {
        var id = (a.getAttribute('href') || '').replace('#', '');
        a.classList.toggle('nav-active', id === active);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }());


  /* ============================================================
     5. SMOOTH SCROLL with navbar offset
     ============================================================ */
  (function () {
    var OFFSET = 70;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }());


  /* ============================================================
     6. CURSOR GLOW
     ============================================================ */
  (function () {
    var dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.style.cssText =
      'position:fixed;width:8px;height:8px;border-radius:50%;' +
      'background:#D43F52;pointer-events:none;z-index:99999;' +
      'transform:translate(-50%,-50%);transition:opacity .3s;' +
      'box-shadow:0 0 10px 3px rgba(212,63,82,0.45);opacity:0;';

    var ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.style.cssText =
      'position:fixed;width:30px;height:30px;border-radius:50%;' +
      'border:1px solid rgba(212,63,82,0.5);pointer-events:none;z-index:99998;' +
      'transform:translate(-50%,-50%);transition:left .12s ease,top .12s ease,opacity .3s;opacity:0;';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      dot.style.opacity = '1';
      ring.style.left = mx + 'px';
      ring.style.top  = my + 'px';
      ring.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    /* expand ring on click */
    document.addEventListener('mousedown', function () {
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.borderColor = 'rgba(212,63,82,0.9)';
    });
    document.addEventListener('mouseup', function () {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(212,63,82,0.5)';
    });
  }());

  /* ============================================================
     7. PORTFOLIO FX — reveal on scroll + magnetic hover + tilt
     ============================================================ */
  (function () {
    var thumbs = document.querySelectorAll('#portfolio .portfolio-thumb');
    if (!thumbs.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    thumbs.forEach(function (thumb, index) {
      thumb.style.animationDelay = (index * 0.16) + 's';
      thumb.classList.add('portfolio-reveal');

      if (prefersReduced) return;

      thumb.addEventListener('mousemove', function (e) {
        var rect = thumb.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var xRatio = (x / rect.width) - 0.5;
        var yRatio = (y / rect.height) - 0.5;
        var rx = yRatio * -7;
        var ry = xRatio * 9;
        var tx = xRatio * 12;
        var ty = yRatio * 10 - 7;
        thumb.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });

      thumb.addEventListener('mouseenter', function () {
        thumb.classList.add('is-magnetic');
      });

      thumb.addEventListener('mouseleave', function () {
        thumb.classList.remove('is-magnetic');
        thumb.style.transform = '';
      });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

      thumbs.forEach(function (thumb) {
        observer.observe(thumb);
      });
    } else {
      thumbs.forEach(function (thumb) {
        thumb.classList.add('is-visible');
      });
    }
  }());


  /* ============================================================
     8. SECTION REVEAL — smooth section appearance on scroll
     ============================================================ */
  (function () {
    var sectionContainers = document.querySelectorAll('#fullpage > .section > .container');
    if (!sectionContainers.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sectionContainers.forEach(function (container, index) {
      if (index === 0 || prefersReduced) {
        container.classList.add('is-visible');
      }
      container.classList.add('section-animate');
    });

    if (prefersReduced) return;

    function revealByHash() {
      var hash = (window.location.hash || '').replace('#', '');
      if (!hash) return;
      var activeContainer = document.querySelector('#' + hash + ' > .container');
      if (activeContainer) {
        activeContainer.classList.add('is-visible');
      }
    }

    window.addEventListener('hashchange', revealByHash);
    setTimeout(revealByHash, 250);

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

      sectionContainers.forEach(function (container) {
        observer.observe(container);
      });
    } else {
      sectionContainers.forEach(function (container) {
        container.classList.add('is-visible');
      });
    }
  }());

}());
