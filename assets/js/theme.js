(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const STORAGE_KEY = 'pref-theme';

  function applyStoredOrSystemTheme(){
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored === 'dark' || stored === 'light') {
      root.setAttribute('data-theme', stored);
    } else {
      // Default to light theme
      root.setAttribute('data-theme', 'light');
    }
    updateToggleIcon();
  }

  function updateToggleIcon(){
    if(!toggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
  }

  function toggleTheme(){
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggleIcon();
  }

  function initThemeToggle(){
    if(!toggle) return;
    applyStoredOrSystemTheme();
    toggle.addEventListener('click', toggleTheme);
  }

  function initNavToggle(){
    if(!navToggle || !nav) return;
    navToggle.addEventListener('click', function(){
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    initThemeToggle();
    initNavToggle();
  });
})();
