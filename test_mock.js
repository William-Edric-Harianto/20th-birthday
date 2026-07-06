const Audio = function(){}; const document = { getElementById: ()=>({ classList: {add:()=>{}, remove:()=>{}}, style: {}, addEventListener: ()=>{} }), querySelectorAll: ()=>({ forEach: ()=>{} }), body: { classList: {add:()=>{}, remove:()=>{}}, appendChild: ()=>{}, style: {} }, documentElement: { style: {setProperty: ()=>{}} }, addEventListener: ()=>{} }; const window = { innerWidth: 1000, innerHeight: 1000, addEventListener: ()=>{} }; const requestAnimationFrame = (cb)=> setTimeout(cb, 16); const cancelAnimationFrame = clearTimeout; 
    // ═══════════════════════════════════════
    //  LYRIC TIMELINE — Total = 149,000ms (2:29)
    // ═══════════════════════════════════════
    const lyricTimeline = [
      { text: "Happy", duration: 4000, charSpeed: 1.2 },
      { text: "Birthday", duration: 4000, charSpeed: 1.2 },
      { text: "to", duration: 2500, charSpeed: 1.0 },
      { text: "You", duration: 7500, charSpeed: 1.2, effect: "climax" },

      { text: "Chagiii", duration: 1800, charSpeed: 2.5 },

      { text: "yang", duration: 3500, charSpeed: 1.0 },
      { text: "sekarang", duration: 5000, charSpeed: 1.2 },
      { text: "sudah", duration: 3500, charSpeed: 1.0 },
      { text: "20", duration: 4000, charSpeed: 0.8 },
      { text: "20", duration: 8000, charSpeed: 0.8, effect: "morph" },
      { text: "( ˶°ㅁ°) !!", duration: 5000, charSpeed: 1.5, effect: "pop" },
      { text: "tambah lucu lagi ya", duration: 5500, charSpeed: 1.3 },
      { text: "dan semoga semuanya lancar", duration: 6000, charSpeed: 1.3 },
      { text: "biar kamu ga kebanyakan pikiran", duration: 7000, charSpeed: 1.4 },
      { text: "jangan", duration: 4000, charSpeed: 1.0 },
      { text: "nakal..", duration: 4500, charSpeed: 1.0 },
      { text: "nakal", duration: 4500, charSpeed: 1.0, effect: "side-left" },
      { text: "ya", duration: 3500, charSpeed: 1.0 },
      { text: "udah gede", duration: 5500, charSpeed: 1.2 },
      { text: "⸜(｡˃ ᵕ ˂ )⸝♡", duration: 8000, charSpeed: 1.5, effect: "climax" },
      { text: "eman banget ga bisa ketemu", duration: 8000, charSpeed: 1.5 },
      { text: "bikin kangen aja", duration: 7000, charSpeed: 1.3 },
      { text: "cepet balik surabaya", duration: 7500, charSpeed: 1.4 },
      { text: "yaaaaaaaaaaaaaaaaaaaaaaa..............................", duration: 13000, charSpeed: 3.0, effect: "side-right" },
      { text: "cHagii", duration: 1800, charSpeed: 2.5 },
      { text: "chAgii", duration: 1800, charSpeed: 2.5 },
      { text: "chaGii", duration: 1800, charSpeed: 2.5 },
      { text: "chagIi", duration: 1800, charSpeed: 2.5 },
      { text: "chagiI", duration: 2500, charSpeed: 2.5, effect: "wave" },
      { text: "CHAGII", duration: 4500, charSpeed: 3.0, effect: "pulse" }
    ];

    // Verify total
    const TOTAL_MS = lyricTimeline.reduce((s, l) => s + l.duration, 0);
    console.log(`Total duration: ${TOTAL_MS}ms = ${(TOTAL_MS/1000).toFixed(1)}s`);

    // ═══════════════════════════════════════
    //  AUDIO SETUP
    // ═══════════════════════════════════════
    const audio = new Audio();
    const playBtn = document.getElementById('playBtn');
    const loadingLabel = document.getElementById('loadingLabel');
    const progressWrap = document.getElementById('progressWrap');
    const progressBar = document.getElementById('progressBar');
    const lyricText = document.getElementById('lyricText');
    const endScreen = document.getElementById('endScreen');

    let audioReady = false;

    audio.preload = 'auto';
    audio.src = 'assets/liebestraum_ending.mp3';

    function markAudioReady() {
      if (!audioReady) {
        audioReady = true;
        loadingLabel.style.pointerEvents = 'none'; // instantly allow clicks through
        loadingLabel.style.opacity = '0';
        setTimeout(() => { loadingLabel.style.display = 'none'; }, 500);
        playBtn.classList.add('ready');
      }
    }

    audio.addEventListener('canplaythrough', markAudioReady, { once: true });
    audio.addEventListener('canplay', markAudioReady, { once: true });
    
    // Fallback if canplaythrough doesn't fire
    audio.addEventListener('loadeddata', () => {
      if (audio.readyState >= 2) {
        markAudioReady();
      }
    });

    // Polling fallback for strict browsers
    const readyPoll = setInterval(() => {
      if (audio.readyState >= 3) {
        markAudioReady();
        clearInterval(readyPoll);
      }
    }, 500);

    // Absolute fallback: Force loading label away after 1.5 seconds
    setTimeout(markAudioReady, 1500);

    // Kickstart audio loading on mobile (requires user interaction)
    const kickstartAudio = () => { if (!audioReady) audio.load(); };
    document.addEventListener('touchstart', kickstartAudio, { once: true, passive: true });
    document.addEventListener('click', kickstartAudio, { once: true, passive: true });

    // ═══════════════════════════════════════
    //  AMBIENT ELEMENTS
    // ═══════════════════════════════════════
    const glowAura = document.getElementById('glowAura');
    const lensFlare = document.getElementById('lensFlare');
    const vignette = document.getElementById('vignette');
    const auroraOrbs = document.querySelectorAll('.aurora-orb');
    const lightRaysDiv = document.getElementById('lightRays');
    const raysCanvas = document.getElementById('raysCanvas');
    const raysCtx = raysCanvas.getContext('2d');
    let shootingStars = [];  // shooting star streaks
    let dustMoteInterval = null;
    let raysAngle = 0;
    let raysActive = false;
    let prevLineText = '';

    // ═══════════════════════════════════════
    //  HEART + STAR PARTICLE CANVAS
    // ═══════════════════════════════════════
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];
    let stars = []; // twinkling star field
    let canvasW, canvasH;

    function resizeCanvas() {
      canvasW = canvas.width = window.innerWidth;
      canvasH = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawHeart(cx, cy, size) {
      ctx.beginPath();
      const topY = cy - size * 0.4;
      ctx.moveTo(cx, cy + size * 0.6);
      ctx.bezierCurveTo(cx - size, cy, cx - size, topY, cx, topY + size * 0.2);
      ctx.bezierCurveTo(cx + size, topY, cx + size, cy, cx, cy + size * 0.6);
      ctx.closePath();
    }

    function spawnHeart() {
      const palettes = [
        'rgba(249,168,212,',
        'rgba(196,181,253,',
        'rgba(253,164,175,',
        'rgba(165,180,252,',
        'rgba(251,191,236,',
      ];
      return {
        x: Math.random() * canvasW,
        y: canvasH + 20,
        size: 6 + Math.random() * 14,
        speed: 0.25 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.4,
        opacity: 0.08 + Math.random() * 0.18,
        color: palettes[Math.floor(Math.random() * palettes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    // Twinkling stars
    function spawnStar() {
      return {
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        size: 0.5 + Math.random() * 2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        maxOpacity: 0.15 + Math.random() * 0.35,
      };
    }

    // Initial particles
    for (let i = 0; i < 35; i++) {
      const h = spawnHeart();
      h.y = Math.random() * canvasH;
      hearts.push(h);
    }
    for (let i = 0; i < 80; i++) {
      stars.push(spawnStar());
    }

    let emotionIntensity = 0; // 0-1, affects background warmth

    // ═══════════════════════════════════════
    //  SHOOTING STARS
    // ═══════════════════════════════════════
    function spawnShootingStar() {
      return {
        x: Math.random() * canvasW * 0.8,
        y: Math.random() * canvasH * 0.4,
        vx: 3 + Math.random() * 4,
        vy: 1.5 + Math.random() * 2.5,
        length: 40 + Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.4,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.01,
      };
    }

    // ═══════════════════════════════════════
    //  LIGHT RAYS RENDERER
    // ═══════════════════════════════════════
    function resizeRaysCanvas() {
      raysCanvas.width = window.innerWidth;
      raysCanvas.height = window.innerHeight;
    }
    resizeRaysCanvas();
    window.addEventListener('resize', resizeRaysCanvas);

    function drawLightRays() {
      if (!raysActive) return;
      const w = raysCanvas.width, h = raysCanvas.height;
      raysCtx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;
      const numRays = 12;
      raysAngle += 0.002;

      for (let i = 0; i < numRays; i++) {
        const angle = raysAngle + (Math.PI * 2 * i) / numRays;
        const len = Math.max(w, h) * 0.9;

        raysCtx.save();
        raysCtx.translate(cx, cy);
        raysCtx.rotate(angle);

        const grad = raysCtx.createLinearGradient(0, 0, len, 0);
        const intensity = 0.02 + emotionIntensity * 0.03;
        grad.addColorStop(0, `rgba(249, 168, 212, ${intensity})`);
        grad.addColorStop(0.5, `rgba(196, 181, 253, ${intensity * 0.5})`);
        grad.addColorStop(1, 'rgba(249, 168, 212, 0)');

        raysCtx.fillStyle = grad;
        raysCtx.beginPath();
        raysCtx.moveTo(0, 0);
        raysCtx.lineTo(len, -12);
        raysCtx.lineTo(len, 12);
        raysCtx.closePath();
        raysCtx.fill();
        raysCtx.restore();
      }

      requestAnimationFrame(drawLightRays);
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // ── Draw twinkling stars ──
      for (const s of stars) {
        s.twinkle += s.twinkleSpeed;
        const op = s.maxOpacity * (0.3 + 0.7 * Math.abs(Math.sin(s.twinkle)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
        ctx.fill();

        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 168, 212, ${op * 0.15})`;
          ctx.fill();
        }
      }

      // ── Shooting stars ──
      if (isPlaying && Math.random() < 0.008 + emotionIntensity * 0.012) {
        shootingStars.push(spawnShootingStar());
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;
        if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = ss.opacity * ss.life;
        const angle = Math.atan2(ss.vy, ss.vx);
        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(angle) * ss.length,
          ss.y - Math.sin(angle) * ss.length
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.3, 'rgba(249,168,212,0.4)');
        grad.addColorStop(1, 'rgba(249,168,212,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(angle) * ss.length * ss.life,
          ss.y - Math.sin(angle) * ss.length * ss.life
        );
        ctx.stroke();
        ctx.restore();
      }

      // ── Spawn hearts ──
      const spawnRate = 0.06 + emotionIntensity * 0.08;
      if (Math.random() < spawnRate && hearts.length < 80) {
        hearts.push(spawnHeart());
      }

      // ── Draw hearts ──
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y -= h.speed;
        h.x += h.drift;
        h.rotation += h.rotSpeed;
        h.pulse += 0.02;

        const pSize = h.size + Math.sin(h.pulse) * 1.5;

        if (h.y < -30) {
          hearts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.globalAlpha = h.opacity;

        drawHeart(0, 0, pSize);
        ctx.fillStyle = h.color + h.opacity + ')';
        ctx.fill();

        if (h.opacity > 0.12) {
          ctx.globalAlpha = h.opacity * 0.3;
          drawHeart(0, 0, pSize * 1.6);
          ctx.fillStyle = h.color + (h.opacity * 0.2) + ')';
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // ═══════════════════════════════════════
    //  SPARKLE SPAWNER
    // ═══════════════════════════════════════
    let sparkleInterval = null;

    function startSparkles() {
      sparkleInterval = setInterval(() => {
        const lyricRect = lyricText.getBoundingClientRect();
        if (lyricRect.width < 10) return;

        // More sparkles when more emotional
        const count = emotionIntensity > 0.6 ? 2 : 1;
        for (let n = 0; n < count; n++) {
          const x = lyricRect.left + Math.random() * lyricRect.width;
          const y = lyricRect.top + Math.random() * lyricRect.height;

          const spark = document.createElement('div');
          spark.className = 'sparkle';
          spark.style.left = x + 'px';
          spark.style.top = y + 'px';
          spark.style.setProperty('--sx', (Math.random() - 0.5) * 50 + 'px');
          spark.style.setProperty('--sy', -(10 + Math.random() * 40) + 'px');
          spark.style.setProperty('--sx2', (Math.random() - 0.5) * 70 + 'px');
          spark.style.setProperty('--sy2', -(20 + Math.random() * 60) + 'px');
          spark.style.setProperty('--spark-dur', (1 + Math.random() * 1.5) + 's');
          const sz = (2 + Math.random() * 3 + emotionIntensity * 2);
          spark.style.width = spark.style.height = sz + 'px';

          document.body.appendChild(spark);
          setTimeout(() => spark.remove(), 2500);
        }
      }, Math.max(80, 180 - emotionIntensity * 80));
    }

    function stopSparkles() {
      if (sparkleInterval) {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
      }
    }

    // ═══════════════════════════════════════
    //  SCREEN SHAKE
    // ═══════════════════════════════════════
    function triggerScreenShake() {
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 500);
    }

    // ═══════════════════════════════════════
    //  EMOJI RAIN (on climax)
    // ═══════════════════════════════════════
    function triggerEmojiRain() {
      const emojis = ['💕', '💖', '✨', '💗', '🌸', '💓', '🦋', '💝'];
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const el = document.createElement('div');
          el.className = 'emoji-rain';
          el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          el.style.left = (5 + Math.random() * 90) + 'vw';
          el.style.top = -(10 + Math.random() * 30) + 'px';
          el.style.setProperty('--rain-dur', (3 + Math.random() * 3) + 's');
          el.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 6500);
        }, i * 120);
      }
    }

    // ═══════════════════════════════════════
    //  DUST MOTES
    // ═══════════════════════════════════════
    function startDustMotes() {
      dustMoteInterval = setInterval(() => {
        const mote = document.createElement('div');
        mote.className = 'dust-mote';
        const sz = 1 + Math.random() * 3;
        mote.style.width = sz + 'px';
        mote.style.height = sz + 'px';
        mote.style.left = Math.random() * 100 + 'vw';
        mote.style.top = (20 + Math.random() * 60) + 'vh';
        mote.style.background = Math.random() > 0.5
          ? `rgba(249,168,212,${0.15 + emotionIntensity * 0.15})`
          : `rgba(196,181,253,${0.12 + emotionIntensity * 0.12})`;
        const dur = 6 + Math.random() * 6;
        mote.style.setProperty('--dust-dur', dur + 's');
        mote.style.setProperty('--dust-dx', (Math.random() - 0.5) * 150 + 'px');
        mote.style.setProperty('--dust-dy', -(10 + Math.random() * 40) + 'px');
        mote.style.setProperty('--dust-op', (0.2 + emotionIntensity * 0.2).toString());
        document.body.appendChild(mote);
        setTimeout(() => mote.remove(), (dur + 1) * 1000);
      }, 400);
    }
    function stopDustMotes() {
      if (dustMoteInterval) { clearInterval(dustMoteInterval); dustMoteInterval = null; }
    }

    // ═══════════════════════════════════════
    //  GHOST TRAIL (previous text afterimage)
    // ═══════════════════════════════════════
    function spawnGhostTrail(text) {
      if (!text || text.length < 2) return;
      const ghost = document.createElement('div');
      ghost.className = 'ghost-trail';
      ghost.textContent = text;
      document.body.appendChild(ghost);
      setTimeout(() => ghost.remove(), 2200);
    }

    // ═══════════════════════════════════════
    //  HEARTBEAT PULSE RING
    // ═══════════════════════════════════════
    function triggerPulseRing(size) {
      const ring = document.createElement('div');
      ring.className = 'pulse-ring';
      ring.style.width = (size || 200) + 'px';
      ring.style.height = (size || 200) + 'px';
      ring.style.setProperty('--ring-dur', (1.5 + Math.random()) + 's');
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 3000);
    }

    // ═══════════════════════════════════════
    //  EMOTION MOOD SYSTEM
    // ═══════════════════════════════════════
    function setMoodForLine(index) {
      const total = lyricTimeline.length;
      const progress = index / total;
      const line = lyricTimeline[index];

      let hue = 260;
      let sat = '40%';
      let light = '7%';
      let auraColor1 = 'rgba(249,168,212,0.12)';
      let auraColor2 = 'rgba(196,181,253,0.06)';

      if (progress < 0.15) {
        hue = 260;
        emotionIntensity = 0.2;
      } else if (progress < 0.4) {
        hue = 280;
        emotionIntensity = 0.4;
        auraColor1 = 'rgba(249,168,212,0.15)';
        auraColor2 = 'rgba(251,191,236,0.08)';
      } else if (progress < 0.65) {
        hue = 300;
        sat = '45%';
        emotionIntensity = 0.5;
        auraColor1 = 'rgba(253,164,175,0.18)';
        auraColor2 = 'rgba(249,168,212,0.1)';
      } else if (progress < 0.85) {
        hue = 320;
        sat = '50%';
        light = '8%';
        emotionIntensity = 0.7;
        auraColor1 = 'rgba(244,114,182,0.2)';
        auraColor2 = 'rgba(249,168,212,0.12)';
      } else {
        hue = 330;
        sat = '55%';
        light = '9%';
        emotionIntensity = 1.0;
        auraColor1 = 'rgba(244,114,182,0.25)';
        auraColor2 = 'rgba(253,164,175,0.15)';
      }

      if (line.effect === 'climax') {
        emotionIntensity = 1.0;
        light = '10%';
        auraColor1 = 'rgba(244,114,182,0.3)';
        auraColor2 = 'rgba(249,168,212,0.2)';
      }

      document.documentElement.style.setProperty('--bg-hue', hue);
      document.documentElement.style.setProperty('--bg-sat', sat);
      document.documentElement.style.setProperty('--bg-light', light);

      // Dynamic aura color
      glowAura.style.setProperty('--aura-color1', auraColor1);
      glowAura.style.setProperty('--aura-color2', auraColor2);

      // Aura size scales with emotion
      const auraSize = 300 + emotionIntensity * 150;
      glowAura.style.width = auraSize + 'px';
      glowAura.style.height = auraSize + 'px';

      vignette.style.opacity = 0.5 + (1 - emotionIntensity) * 0.3;

      // Pulse rings during emotional moments
      if (emotionIntensity >= 0.6 && Math.random() > 0.3) {
        triggerPulseRing(150 + emotionIntensity * 100);
      }
    }

    // ═══════════════════════════════════════
    //  CLIMAX BURST — exploding hearts + screen shake + emoji rain
    // ═══════════════════════════════════════
    function triggerClimaxBurst() {
      const symbols = ['♡', '❤', '💕', '💖', '✨', '💗', '♥', '💓'];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const count = 35 + Math.floor(Math.random() * 15);

      // Screen shake!
      triggerScreenShake();

      // Background pulse
      document.body.classList.add('bg-pulse');
      setTimeout(() => document.body.classList.remove('bg-pulse'), 1200);

      // Lens flare flash
      lensFlare.classList.add('active');
      setTimeout(() => lensFlare.classList.remove('active'), 1500);

      // Emoji rain
      triggerEmojiRain();

      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'burst-heart';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = 120 + Math.random() * 320;
        const bx = Math.cos(angle) * dist;
        const by = Math.sin(angle) * dist;
        const br = (Math.random() - 0.5) * 720;

        el.style.left = cx + 'px';
        el.style.top = cy + 'px';
        el.style.setProperty('--bx', bx + 'px');
        el.style.setProperty('--by', by + 'px');
        el.style.setProperty('--br', br + 'deg');
        el.style.fontSize = (1 + Math.random() * 1.8) + 'rem';
        el.style.animationDelay = (Math.random() * 0.2) + 's';

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
      }

      // Boost canvas hearts
      for (let i = 0; i < 25; i++) {
        const h = spawnHeart();
        h.y = canvasH / 2;
        h.x = canvasW / 2 + (Math.random() - 0.5) * 250;
        h.speed = 1.5 + Math.random() * 2.5;
        h.opacity = 0.2 + Math.random() * 0.25;
        h.size = 10 + Math.random() * 18;
        hearts.push(h);
      }
    }

    // ═══════════════════════════════════════
    //  DISPLAY LYRIC LINE
    // ═══════════════════════════════════════
    let currentLine = 0;
    let lineTimeout = null;
    let morphInterval = null;
    let isPlaying = false;
    let startTime = 0;

    function clearMorphInterval() {
      if (morphInterval) {
        clearInterval(morphInterval);
        morphInterval = null;
      }
    }

    function displayLine(index) {
      if (index >= lyricTimeline.length) {
        finishShow();
        return;
      }

      const line = lyricTimeline[index];
      currentLine = index;

      // Ghost trail of previous text
      if (prevLineText) {
        spawnGhostTrail(prevLineText);
      }
      prevLineText = line.text;

      // Reset classes
      lyricText.className = '';
      clearMorphInterval();

      // Activate ambient effects
      glowAura.classList.add('active');
      setMoodForLine(index);

      // Handle alignment effects
      if (line.effect === 'side-left') {
        lyricText.classList.add('align-left');
      } else if (line.effect === 'side-right') {
        lyricText.classList.add('align-right');
      }

      // Handle morph effect (special — cycles through variants)
      if (line.effect === 'morph') {
        handleMorphEffect(line);
        return;
      }

      // Handle pop effect
      if (line.effect === 'pop') {
        lyricText.innerHTML = '';
        const span = document.createElement('span');
        span.textContent = line.text;
        span.style.display = 'inline-block';
        span.style.opacity = '1';
        span.classList.add('pop-text');
        span.style.textShadow = `
          0 1px 0 #fecdd3,
          0 2px 0 #fda4af,
          0 3px 0 #fb7185,
          0 4px 6px rgba(244,114,182,0.25),
          0 0 20px rgba(249,168,212,0.15)`;
        span.style.color = 'transparent';
        span.style.background = 'inherit';
        span.style.webkitBackgroundClip = 'text';
        span.style.backgroundClip = 'text';
        lyricText.appendChild(span);

        // Screen shake for pop
        triggerScreenShake();

        scheduleNext(index, line.duration);
        return;
      }

      // Default: character pop-in
      renderCharsPopIn(line.text, line.charSpeed, line.effect);

      // Trigger effect after chars appear
      if (line.effect === 'climax') {
        const charTime = line.text.length * (60 / line.charSpeed);
        setTimeout(() => triggerClimaxBurst(), Math.min(charTime + 200, line.duration * 0.5));
      }

      if (line.effect === 'pulse') {
        const charTime = line.text.length * (60 / line.charSpeed);
        setTimeout(() => {
          lyricText.classList.add('pulse-text');
          // Also add lens flare for pulse
          lensFlare.classList.add('active');
          setTimeout(() => lensFlare.classList.remove('active'), 2000);
        }, charTime + 100);
      }

      scheduleNext(index, line.duration);
    }

    function renderCharsPopIn(text, charSpeed, effect) {
      lyricText.innerHTML = '';
      const baseDelay = 60 / charSpeed;
      const totalChars = [...text].length;
      const isIntense = emotionIntensity >= 0.6;

      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char-span';
        if (isIntense) span.classList.add('intense-glow');
        span.textContent = char === ' ' ? '\u00A0' : char;

        // Subtle per-character hue offset for rainbow shimmer
        if (isIntense && totalChars > 3) {
          const hueShift = (i / totalChars) * 20 - 10; // -10 to +10 degrees
          span.style.filter = `blur(8px) hue-rotate(${hueShift}deg)`;
        }

        // Wave effect: add staggered animation after pop-in
        if (effect === 'wave') {
          const waveDelay = i * 0.1;
          setTimeout(() => {
            span.classList.add('wave-char');
            span.style.animationDelay = waveDelay + 's';
          }, baseDelay * i + 350);
        }

        lyricText.appendChild(span);

        // Trigger pop-in with stagger
        setTimeout(() => {
          span.classList.add('visible');
          // Clear the hue-rotate after pop-in animation handles blur
          if (isIntense && totalChars > 3) {
            setTimeout(() => {
              span.style.filter = `hue-rotate(${((i / totalChars) * 20 - 10)}deg)`;
            }, 450);
          }
        }, baseDelay * i);
      });

      // Add blinking cursor after all chars appear
      const allDone = baseDelay * totalChars + 450;
      setTimeout(() => {
        const cursor = document.createElement('span');
        cursor.className = 'lyric-cursor';
        lyricText.appendChild(cursor);
      }, allDone);
    }

    function handleMorphEffect(line) {
      const morphVariants = [
        '20',
        '🎂 20 🎂',
        'TWENTY',
        '✨20✨',
        '🎉 T·W·E·N·T·Y 🎉',
        '②⓪',
      ];
      let morphIndex = 0;

      // Show first variant immediately with pop-in
      renderCharsPopIn(morphVariants[0], line.charSpeed);

      morphInterval = setInterval(() => {
        morphIndex = (morphIndex + 1) % morphVariants.length;
        renderCharsPopIn(morphVariants[morphIndex], 4.0); // fast char speed for morph
      }, 500);

      scheduleNext(currentLine, line.duration);
    }

    function scheduleNext(index, duration) {
      const fadeOutTime = 450;
      lineTimeout = setTimeout(() => {
        // Fade out current
        lyricText.classList.add('lyric-fade-out');

        setTimeout(() => {
          lyricText.classList.remove('lyric-fade-out');
          clearMorphInterval();
          displayLine(index + 1);
        }, fadeOutTime);
      }, duration - fadeOutTime);
    }

    // ═══════════════════════════════════════
    //  PROGRESS BAR UPDATE
    // ═══════════════════════════════════════
    function updateProgress() {
      if (!isPlaying) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / TOTAL_MS) * 100, 100);
      progressBar.style.width = pct + '%';
      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      }
    }

    // ═══════════════════════════════════════
    //  FINISH
    // ═══════════════════════════════════════
    function finishShow() {
      isPlaying = false;
      raysActive = false;
      lyricText.innerHTML = '';
      progressBar.style.width = '100%';
      stopSparkles();
      stopDustMotes();
      glowAura.classList.remove('active');
      lensFlare.classList.remove('active');
      lightRaysDiv.classList.remove('active');

      // Final climax burst for the ending
      triggerClimaxBurst();

      // Spawn multiple pulse rings for finale
      for (let i = 0; i < 3; i++) {
        setTimeout(() => triggerPulseRing(200 + i * 80), i * 400);
      }

      setTimeout(() => {
        progressWrap.style.opacity = '0';
        endScreen.classList.add('visible');
      }, 1200);
    }

    // ═══════════════════════════════════════
    //  PLAY BUTTON HANDLER
    // ═══════════════════════════════════════
    function startExperience(e) {
      if (e && e.cancelable) e.preventDefault(); // safely prevent double firing
      if (!audioReady || isPlaying) return;

      playBtn.classList.add('hiding');
      setTimeout(() => { playBtn.style.display = 'none'; }, 800);

      // Show progress bar
      progressWrap.style.opacity = '1';

      // Activate aurora orbs
      auroraOrbs.forEach(orb => orb.classList.add('active'));

      // Start all particle systems
      startSparkles();
      startDustMotes();

      // Activate light rays
      raysActive = true;
      lightRaysDiv.classList.add('active');
      drawLightRays();

      // Start audio safely (handles older mobile browsers/webviews that don't return a Promise)
      try {
        if (audio.readyState >= 1) {
          audio.currentTime = 0;
        }
        const playPromise = audio.play();
        if (playPromise !== undefined && typeof playPromise.catch === 'function') {
          playPromise.catch(err => console.warn('Audio play blocked:', err));
        }
      } catch (err) {
        console.warn('Audio play threw error:', err);
      }

      // Start lyric timeline
      isPlaying = true;
      startTime = Date.now();
      updateProgress();
      displayLine(0);
    }

    playBtn.addEventListener('click', startExperience);
    playBtn.addEventListener('touchstart', startExperience, { passive: false });
  