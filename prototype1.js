/* ========== VIEW NAVIGATION ========== */
(function () {
    // Switch between views (home, weather, deforestation, disaster, spacedebris)
    function switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        // Show target view
        const target = document.getElementById('view-' + viewName);
        if (target) {
            target.classList.add('active');
            // Set background image if data-bg is present
            const bg = target.getAttribute('data-bg');
            if (bg) {
                target.style.backgroundImage = `linear-gradient(to bottom, rgba(10,10,18,0.82), rgba(10,10,18,0.95)), url('${bg}')`;
                target.style.backgroundSize = 'cover';
                target.style.backgroundPosition = 'center';
            }
        }
        // Update active state in drawer nav
        document.querySelectorAll('.drawer-link[data-view]').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === viewName);
        });
        // Close drawer after navigation
        closeDrawer();
        // Scroll to top
        window.scrollTo(0, 0);
    }

    // All elements with data-view attribute act as navigation links
    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const viewName = this.getAttribute('data-view');
            if (viewName) switchView(viewName);
        });
    });

    /* ========== SIDE DRAWER ========== */
    const menuToggle = document.getElementById('menuToggle');
    const sideDrawer = document.getElementById('sideDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
        sideDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    }
    function closeDrawer() {
        sideDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    /* ========== ADD PROFILE MODAL ========== */
    const addProfileBtn = document.getElementById('addProfileBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalEnter = document.getElementById('modalEnter');
    const locationInput = document.getElementById('locationInput');

    function openModal() {
        modalOverlay.classList.add('open');
        closeDrawer();
        setTimeout(() => locationInput && locationInput.focus(), 300);
    }
    function closeModal() {
        modalOverlay.classList.remove('open');
    }

    if (addProfileBtn) addProfileBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });
    if (modalEnter) modalEnter.addEventListener('click', function () {
        const loc = locationInput ? locationInput.value.trim() : '';
        if (loc) {
            alert('Location saved: ' + loc);
            closeModal();
        }
    });

    /* ========== PARALLAX BACKGROUND ========== */
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;
        document.querySelectorAll('.parallax-bg-layer').forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
        document.querySelectorAll('.parallax-layer').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    /* ========== INDIA MAP TOOLTIPS ========== */
    function setupMapTooltips(mapWrapId, tooltipId, fields) {
        const wrap = document.getElementById(mapWrapId);
        const tooltip = document.getElementById(tooltipId);
        if (!wrap || !tooltip) return;

        const states = wrap.querySelectorAll('.state');
        const ttName = tooltip.querySelector('.tt-name');

        states.forEach(state => {
            state.addEventListener('mouseenter', function (e) {
                const name = this.getAttribute('data-name');
                if (ttName) ttName.textContent = name || '';

                fields.forEach(field => {
                    const val = this.getAttribute('data-' + field);
                    const span = tooltip.querySelector('[data-field="' + field + '"]');
                    if (span) span.textContent = val || '—';
                });

                tooltip.classList.add('visible');
            });

            state.addEventListener('mousemove', function (e) {
                const rect = wrap.getBoundingClientRect();
                let x = e.clientX - rect.left + 16;
                let y = e.clientY - rect.top - 10;
                // Keep tooltip within the map container
                const tw = tooltip.offsetWidth;
                const th = tooltip.offsetHeight;
                if (x + tw > rect.width) x = x - tw - 32;
                if (y + th > rect.height) y = rect.height - th - 8;
                if (y < 0) y = 8;
                tooltip.style.left = x + 'px';
                tooltip.style.top = y + 'px';
            });

            state.addEventListener('mouseleave', function () {
                tooltip.classList.remove('visible');
            });
        });
    }

    // Climate map
    setupMapTooltips('climateMap', 'climateTooltip', ['temp', 'humidity', 'aqi', 'rain']);
    // Deforestation map
    setupMapTooltips('deforestMap', 'deforestTooltip', ['cover', 'loss', 'cause', 'trend']);
    // Disaster map
    setupMapTooltips('disasterMap', 'disasterTooltip', ['risk', 'level', 'alerts', 'zone']);

})();
