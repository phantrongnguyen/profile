// Rainy lake adapted from docs/interactive_rainy_lake_background.html.
// Shared across the profile pages; no CDN or build step required.
(() => {
    const host = document.querySelector('.bg');
    if (!host) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'rain-lake-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    host.replaceChildren(canvas);
    document.body.classList.add('rain-lake-enabled');
    const controls = document.createElement('div');
    controls.className = 'rain-weather';
    controls.innerHTML = `<button type="button" class="rain-weather-button" aria-haspopup="dialog" aria-controls="rain-weather-panel" aria-expanded="false" aria-label="Weather settings" title="Weather settings"><span aria-hidden="true">☂</span></button>
<dialog id="rain-weather-panel" class="rain-weather-panel" aria-labelledby="rain-weather-title">
  <header><h2 id="rain-weather-title">Weather settings</h2><button type="button" data-close aria-label="Close weather settings">✕</button></header>
  <p class="rain-weather-hint">Rain on the lake. Drag over open space to create ripples.</p>
  <fieldset><legend>Presets</legend><div class="rain-weather-options">
    <button type="button" data-preset="drizzle">Drizzle</button><button type="button" data-preset="storm">Storm</button><button type="button" data-preset="calm">Gentle</button>
  </div></fieldset>
  <label for="rainIntensity">Rain intensity <output id="rainVal" for="rainIntensity">120</output></label>
  <input type="range" id="rainIntensity" min="0" max="300" value="120">
  <label for="rippleFrequency">Ripple chance <output id="rippleVal" for="rippleFrequency">70%</output></label>
  <input type="range" id="rippleFrequency" min="10" max="100" value="70">
  <label for="windAngle">Wind <output id="windVal" for="windAngle">-12</output></label>
  <input type="range" id="windAngle" min="-45" max="45" value="-12">
  <fieldset><legend>Water aesthetics</legend><div class="rain-weather-options rain-weather-themes">
    <button type="button" data-theme="midnight" aria-pressed="false">Midnight Blue</button><button type="button" data-theme="emerald" aria-pressed="false">Emerald Lake</button><button type="button" data-theme="violet" aria-pressed="false">Deep Violet</button><button type="button" data-theme="monochrome" aria-pressed="true">Silver Night</button>
  </div></fieldset>
  <label class="rain-weather-toggle"><span>Lightning flashes</span><input type="checkbox" id="lightningToggle"></label>
  <label class="rain-weather-toggle"><span>Horizon line</span><input type="checkbox" id="horizonToggle" checked></label>
  <label class="rain-weather-toggle"><span>Atmospheric fog</span><input type="checkbox" id="fogToggle" checked></label>
  <button type="button" class="rain-weather-pause" aria-pressed="false">Pause animation</button>
</dialog>`;
    document.body.append(controls);
    const panel = controls.querySelector('dialog');
    const openButton = controls.querySelector('.rain-weather-button');
    const pauseButton = controls.querySelector('.rain-weather-pause');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    let width = window.innerWidth, height = window.innerHeight, horizonY = height * 0.35;
    let lastTime = null;
    let frame = 0;
    let lightningAlpha = 0;
    let lightningCooldown = 0;
    let pointerId = null;
    let lastRippleTime = -Infinity;
    const pendingRipples = [];
    const raindrops = [];
    const ripples = [];
    const config = { rainCount: 120, rippleChance: 0.7, wind: -12,
        enableLightning: false, enableHorizon: true, enableFog: true, theme: 'monochrome' };
    const background = document.createElement('canvas');
    const backgroundCtx = background.getContext('2d');
    if (!backgroundCtx) { controls.remove(); canvas.remove(); return; }
    const themes = {
        midnight: {
            sky: ['#040814', '#0d182e', '#16243e'],
            waterTop: '#091326',
            waterBottom: '#02050c',
            dropColor: 'rgba(186, 230, 253, ',
            rippleColor: 'rgba(125, 211, 252, '
        },
        emerald: {
            sky: ['#02120d', '#08251c', '#0f382a'],
            waterTop: '#07241b',
            waterBottom: '#010a07',
            dropColor: 'rgba(167, 243, 208, ',
            rippleColor: 'rgba(110, 231, 183, '
        },
        violet: {
            sky: ['#0d0714', '#1c0d2e', '#291440'],
            waterTop: '#170a29',
            waterBottom: '#06020c',
            dropColor: 'rgba(233, 213, 255, ',
            rippleColor: 'rgba(216, 180, 254, '
        },
        monochrome: {
            sky: ['#080a0c', '#12161a', '#1e2329'],
            waterTop: '#11151a',
            waterBottom: '#030405',
            dropColor: 'rgba(226, 232, 240, ',
            rippleColor: 'rgba(203, 213, 225, '
        }
    };

    // Raindrop Class
    class Raindrop {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * (width + 400) - 200;
            this.y = initial ? Math.random() * height : -50;
            this.z = Math.random(); // Depth factor (0 = far, 1 = near)
            this.length = 15 + this.z * 35;
            this.speed = 12 + this.z * 18;
            this.opacity = 0.15 + this.z * 0.55;
        }

        update(dt) {
            // Movement influenced by wind
            this.y += this.speed * dt;
            this.x += config.wind * 0.3 * dt;

            // Calculate water surface collision point based on perspective
            const targetY = horizonY + this.z * (height - horizonY);

            // When drop hits water surface
            if (this.y >= targetY) {
                // Spawn water ripple if within water horizon area
                if (Math.random() < config.rippleChance) {
                    addRipple(this.x, targetY, this.z);
                }
                this.reset();
            }

            // Reset if out of screen bounds
            if (this.y > height || this.x < -300 || this.x > width + 300) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.strokeStyle = `${themes[config.theme].dropColor}${this.opacity})`;
            ctx.lineWidth = 0.8 + this.z * 1.2;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - config.wind * 0.3 / this.speed * this.length,
                this.y - this.length
            );
            ctx.stroke();
        }
    }

    // Water Ripple Class (Elliptical Perspective)
    class Ripple {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z; // Depth relative scale
            this.radius = 1;
            this.maxRadius = (15 + Math.random() * 25) * (0.3 + z * 0.7);
            this.speed = (0.4 + Math.random() * 0.6) * (0.5 + z * 0.5);
            this.opacity = 0.7 + z * 0.3;
            this.lineWidth = 1 + z * 1.5;
        }

        update(dt) {
            this.radius += this.speed * dt;
            this.opacity -= 0.012 * (1.2 - this.z * 0.5) * dt;
        }

        draw() {
            if (this.opacity <= 0) return;

            ctx.save();
            ctx.beginPath();
            // Compress Y-axis to give perspective effect on water plane
            const perspectiveYScale = 0.35 + (this.y - horizonY) / (height - horizonY) * 0.25;
            ctx.ellipse(
                this.x,
                this.y,
                this.radius,
                this.radius * perspectiveYScale,
                0, 0, Math.PI * 2
            );
            ctx.strokeStyle = `${themes[config.theme].rippleColor}${this.opacity})`;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();

            // Optional inner secondary faint ring for realism
            if (this.radius > 6) {
                ctx.beginPath();
                ctx.ellipse(
                    this.x,
                    this.y,
                    this.radius * 0.5,
                    (this.radius * 0.5) * perspectiveYScale,
                    0, 0, Math.PI * 2
                );
                ctx.strokeStyle = `${themes[config.theme].rippleColor}${this.opacity * 0.5})`;
                ctx.lineWidth = this.lineWidth * 0.6;
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    // Draw Background, Horizon, Atmosphere
    function drawBackground() {
        const currentTheme = themes[config.theme];

        // 1. Sky Gradient
        const skyGrad = backgroundCtx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, currentTheme.sky[0]);
        skyGrad.addColorStop(0.5, currentTheme.sky[1]);
        skyGrad.addColorStop(1, currentTheme.sky[2]);
        backgroundCtx.fillStyle = skyGrad;
        backgroundCtx.fillRect(0, 0, width, horizonY);

        // 2. Water Surface Gradient
        const waterGrad = backgroundCtx.createLinearGradient(0, horizonY, 0, height);
        waterGrad.addColorStop(0, currentTheme.waterTop);
        waterGrad.addColorStop(1, currentTheme.waterBottom);
        backgroundCtx.fillStyle = waterGrad;
        backgroundCtx.fillRect(0, horizonY, width, height - horizonY);

        // 3. Subtle Horizon Glow Line
        if (config.enableHorizon) {
            backgroundCtx.beginPath();
            backgroundCtx.moveTo(0, horizonY);
            backgroundCtx.lineTo(width, horizonY);
            backgroundCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            backgroundCtx.lineWidth = 1;
            backgroundCtx.stroke();

            // Mist at horizon
            const horizonGlow = backgroundCtx.createLinearGradient(0, horizonY - 20, 0, horizonY + 40);
            horizonGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
            horizonGlow.addColorStop(0.5, 'rgba(186, 230, 253, 0.05)');
            horizonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            backgroundCtx.fillStyle = horizonGlow;
            backgroundCtx.fillRect(0, horizonY - 20, width, 60);
        }

        // 4. Fog / Mist Over Water
        if (config.enableFog) {
            const fogGrad = backgroundCtx.createLinearGradient(0, horizonY, 0, height);
            fogGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
            fogGrad.addColorStop(0.4, 'rgba(15, 23, 42, 0.1)');
            fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            backgroundCtx.fillStyle = fogGrad;
            backgroundCtx.fillRect(0, horizonY, width, height - horizonY);
        }

    }

    function addRipple(x, y, z) {
        if (ripples.length < 240) ripples.push(new Ripple(x, y, z));
    }
    function adjustRaindrops() {
        while (raindrops.length < config.rainCount) raindrops.push(new Raindrop());
        raindrops.length = config.rainCount;
    }
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        horizonY = height * 0.35;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        background.width = canvas.width;
        background.height = canvas.height;
        backgroundCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ripples.length = 0;
        pendingRipples.length = 0;
        raindrops.forEach(drop => drop.reset(true));
        drawBackground();
        render();
    }
    function render() {
        ctx.drawImage(background, 0, 0, width, height);
        if (lightningAlpha > 0.01) {
            ctx.fillStyle = `rgba(240,249,255,${lightningAlpha * 0.25})`;
            ctx.fillRect(0, 0, width, height);
        }
        ripples.forEach(ripple => ripple.draw());
        raindrops.forEach(drop => drop.draw());
    }
    function animate(time) {
        frame = 0;
        if (paused || document.hidden) return;
        const elapsed = lastTime === null ? 0 : Math.min(time - lastTime, 50);
        lastTime = time;
        const dt = elapsed / (1000 / 60);
        if (config.enableLightning) {
            lightningCooldown = Math.max(0, lightningCooldown - elapsed);
            lightningAlpha *= Math.pow(0.88, dt);
            if (!lightningCooldown && Math.random() < 1 - Math.pow(1 - 0.003, dt)) {
                lightningAlpha = 0.7 + Math.random() * 0.3;
                lightningCooldown = 500;
            }
        } else lightningAlpha = 0;
        for (let i = pendingRipples.length - 1; i >= 0; i--) {
            pendingRipples[i].delay -= elapsed;
            if (pendingRipples[i].delay <= 0) {
                const {x, y, z} = pendingRipples.splice(i, 1)[0];
                addRipple(x, y, z);
            }
        }
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            ripple.update(dt);
            if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) ripples.splice(i, 1);
        }
        raindrops.forEach(drop => drop.update(dt));
        render();
        frame = requestAnimationFrame(animate);
    }
    function syncAnimation() {
        cancelAnimationFrame(frame);
        lastTime = null;
        pointerId = null;
        if (!paused && !document.hidden) frame = requestAnimationFrame(animate);
        pauseButton.textContent = paused ? 'Resume animation' : 'Pause animation';
        pauseButton.setAttribute('aria-pressed', String(paused));
    }
    const interactive = 'a, button, input, select, textarea, label, dialog, [role="button"], [contenteditable="true"]';
    function customRipple(event) {
        if (paused || event.target.closest(interactive) || event.clientY < horizonY) return;
        const now = performance.now();
        if (now - lastRippleTime < 70) return;
        lastRippleTime = now;
        const x = event.clientX, y = event.clientY;
        const z = Math.max(0.1, (y - horizonY) / (height - horizonY));
        addRipple(x, y, z);
        if (pendingRipples.length < 12) pendingRipples.push({x, y, z, delay: 120});
    }
    window.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || event.target.closest(interactive)) return;
        pointerId = event.pointerId;
        customRipple(event);
    }, { passive: true });
    window.addEventListener('pointermove', event => {
        if (event.pointerId === pointerId) customRipple(event);
    }, { passive: true });
    ['pointerup', 'pointercancel', 'blur'].forEach(type => {
        window.addEventListener(type, () => { pointerId = null; });
    });
    function updateControls() {
        config.rainCount = Number(controls.querySelector('#rainIntensity').value);
        config.rippleChance = Number(controls.querySelector('#rippleFrequency').value) / 100;
        config.wind = Number(controls.querySelector('#windAngle').value);
        config.enableLightning = controls.querySelector('#lightningToggle').checked && !reducedMotion.matches;
        config.enableHorizon = controls.querySelector('#horizonToggle').checked;
        config.enableFog = controls.querySelector('#fogToggle').checked;
        controls.querySelector('#rainVal').value = config.rainCount;
        controls.querySelector('#rippleVal').value = `${Math.round(config.rippleChance * 100)}%`;
        controls.querySelector('#windVal').value = config.wind;
        if (!config.enableLightning) lightningAlpha = 0;
        controls.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed', 'false'));
        adjustRaindrops();
        drawBackground();
        render();
    }
    controls.addEventListener('input', updateControls);
    controls.querySelectorAll('[data-theme]').forEach(button => {
        button.addEventListener('click', () => {
            config.theme = button.dataset.theme;
            controls.querySelectorAll('[data-theme]').forEach(item => {
                item.setAttribute('aria-pressed', String(item === button));
            });
            drawBackground();
            render();
        });
    });
    const presets = {drizzle: [50, 40, -5, false], storm: [280, 95, -30, true], calm: [20, 20, 0, false]};
    controls.querySelectorAll('[data-preset]').forEach(button => {
        button.addEventListener('click', () => {
            const values = presets[button.dataset.preset];
            ['rainIntensity', 'rippleFrequency', 'windAngle'].forEach((id, i) => {
                controls.querySelector(`#${id}`).value = values[i];
            });
            controls.querySelector('#lightningToggle').checked = values[3] && !reducedMotion.matches;
            updateControls();
            button.setAttribute('aria-pressed', 'true');
        });
    });
    openButton.addEventListener('click', () => {
        if (panel.open) panel.close();
        else { panel.show(); openButton.setAttribute('aria-expanded', 'true'); }
    });
    controls.querySelector('[data-close]').addEventListener('click', () => panel.close());
    panel.addEventListener('close', () => {
        openButton.setAttribute('aria-expanded', 'false');
        openButton.focus({preventScroll: true});
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && panel.open) { event.preventDefault(); panel.close(); }
    });
    pauseButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
    reducedMotion.addEventListener('change', () => {
        paused = reducedMotion.matches;
        if (paused) { controls.querySelector('#lightningToggle').checked = false; lightningAlpha = 0; }
        updateControls();
        syncAnimation();
    });
    document.addEventListener('visibilitychange', syncAnimation);
    window.addEventListener('resize', resize);
    adjustRaindrops();
    resize();
    syncAnimation();
})();
