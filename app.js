// Aetheris Systems - Interactive Frontend Application Script

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initMobileMenu();
  initHeroCanvas();
  initHeroSparkline();
  initBacktestSimulator();
  initContactForm();
});

/* =========================================================================
   1. Scroll Effects & Navigation
   ========================================================================= */
function initScrollEffects() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const reveals = document.querySelectorAll('.reveal');

  // Header background scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active navigation state
    let currentSection = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.clientHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    // Scroll reveal animation handler
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const revealTop = reveal.getBoundingClientRect().top;
      const revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add('active');
      }
    });
  });

  // Trigger initial reveal check
  setTimeout(() => {
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const revealTop = reveal.getBoundingClientRect().top;
      if (revealTop < windowHeight - 50) {
        reveal.classList.add('active');
      }
    });
  }, 100);
}

function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksMenu = document.getElementById('nav-links-menu');

  if (menuToggle && navLinksMenu) {
    menuToggle.addEventListener('click', () => {
      navLinksMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when links are clicked
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

/* =========================================================================
   2. Hero Canvas - Floating Mathematics Particles
   ========================================================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Set size
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particleCount = 45;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw lines connecting particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const force = (100 - dist) / 100;
          ctx.strokeStyle = `rgba(0, 242, 254, ${force * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();
}

/* =========================================================================
   3. Hero Live Sparkline Simulator
   ========================================================================= */
function initHeroSparkline() {
  const canvas = document.getElementById('hero-sparkline');
  const streamProfit = document.getElementById('stream-profit');
  const streamSignals = document.getElementById('stream-signals');
  const streamLatency = document.getElementById('stream-latency');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  function resizeSparkline() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeSparkline();
  window.addEventListener('resize', resizeSparkline);

  // Sparkline data array
  const points = [];
  const maxPoints = 35;
  
  // Seed initial points
  let currentVal = 100;
  for (let i = 0; i < maxPoints; i++) {
    currentVal += Math.random() * 8 - 3.8;
    points.push(currentVal);
  }

  function drawSparkline() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (points.length < 2) return;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min;
    const padding = 10;
    
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    
    // Create gradient stroke
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#00f2fe');
    grad.addColorStop(1, '#00f5a0');
    ctx.strokeStyle = grad;

    for (let i = 0; i < points.length; i++) {
      const x = (i / (points.length - 1)) * canvas.width;
      const y = padding + ((max - points[i]) / range) * (canvas.height - padding * 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Fill under path
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fillGrad.addColorStop(0, 'rgba(0, 245, 160, 0.12)');
    fillGrad.addColorStop(1, 'rgba(7, 9, 14, 0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw last pulse dot
    const lastX = canvas.width;
    const lastY = padding + ((max - points[points.length - 1]) / range) * (canvas.height - padding * 2);
    ctx.beginPath();
    ctx.arc(lastX - 2, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5a0';
    ctx.fill();
  }

  // Live simulation update loop
  setInterval(() => {
    // Add point
    const change = Math.random() * 10 - 4.9;
    const nextVal = points[points.length - 1] + change;
    points.shift();
    points.push(nextVal);
    drawSparkline();

    // Update numbers
    const totalDiff = ((points[points.length - 1] - 100) / 100) * 100;
    const formatted = totalDiff >= 0 ? `+${totalDiff.toFixed(2)}%` : `${totalDiff.toFixed(2)}%`;
    streamProfit.textContent = formatted;
    if (totalDiff >= 0) {
      streamProfit.style.color = '#00f5a0';
    } else {
      streamProfit.style.color = '#ab47bc';
    }

    // Signals
    const active = Math.floor(1300 + Math.random() * 400);
    streamSignals.textContent = active.toLocaleString();

    // Latency
    const lat = (10 + Math.random() * 8).toFixed(1);
    streamLatency.textContent = `${lat} ms`;
  }, 1800);

  drawSparkline();
}

/* =========================================================================
   4. Backtesting Sandbox Engine & Visualization
   ========================================================================= */
function initBacktestSimulator() {
  const btnRun = document.getElementById('btn-run-backtest');
  const overlay = document.getElementById('chart-intro-overlay');
  const riskSlider = document.getElementById('risk-slider');
  const riskVal = document.getElementById('risk-val');
  
  const mReturn = document.getElementById('val-total-return');
  const mSharpe = document.getElementById('val-sharpe');
  const mDrawdown = document.getElementById('val-drawdown');
  const mWinRate = document.getElementById('val-win-rate');

  const tickerLogs = document.getElementById('ticker-logs-content');
  const tickerStatus = document.getElementById('ticker-status');

  const chartSvg = document.getElementById('main-chart');
  const tooltip = document.getElementById('chart-tooltip-box');

  let activeInterval = null;
  let simulatedData = [];

  // Update slider tag
  riskSlider.addEventListener('input', () => {
    riskVal.textContent = `${parseFloat(riskSlider.value).toFixed(1)}x`;
  });

  // Run Button Trigger
  btnRun.addEventListener('click', () => {
    // Prevent double clicking
    if (btnRun.disabled) return;
    btnRun.disabled = true;
    
    // Clear state
    if (activeInterval) clearInterval(activeInterval);
    overlay.classList.add('hidden');
    tickerLogs.innerHTML = '';
    tickerStatus.textContent = 'Initializing Data Stream...';
    
    mReturn.textContent = '...';
    mSharpe.textContent = '...';
    mDrawdown.textContent = '...';
    mWinRate.textContent = '...';

    // Parameters
    const asset = document.getElementById('asset-class').value;
    const strategy = document.getElementById('strategy-type').value;
    const leverage = parseFloat(riskSlider.value);
    const years = parseInt(document.getElementById('test-period').value);

    // Run strategy simulation
    executeSimulation(asset, strategy, leverage, years);
  });

  function executeSimulation(asset, strategy, leverage, years) {
    // Generate dates & mock equity curve
    const steps = 120; // data points
    let currentPort = 10000; // starting capital
    let benchmarkPort = 10000;
    
    simulatedData = [];
    const tickerEntries = [];
    
    // Parameter base config
    let drift = 0.05;      // strategy bias
    let volatility = 0.08; // base variance
    let assetName = 'BTC/USD';
    let entryAction = 'BUY';
    let exitAction = 'SELL';
    
    if (asset === 'equities') {
      drift = 0.03;
      volatility = 0.04;
      assetName = 'NDAQ100';
    } else if (asset === 'forex') {
      drift = 0.01;
      volatility = 0.012;
      assetName = 'EUR/USD';
    }

    // Strategy drift additions
    if (strategy === 'trend') {
      drift += 0.04;
      volatility += 0.02;
    } else if (strategy === 'reversion') {
      drift += 0.02;
      volatility -= 0.005;
    } else if (strategy === 'momentum') {
      drift += 0.06;
      volatility += 0.04;
    }

    // Apply leverage multiplier
    volatility *= leverage;
    drift *= Math.sqrt(leverage);

    const baseAssetPrice = asset === 'crypto' ? 62400 : (asset === 'equities' ? 19200 : 1.085);
    let assetPrice = baseAssetPrice;

    // Generate path data
    for (let i = 0; i < steps; i++) {
      const progress = i / steps;
      
      // Random walk for benchmark (typical beta/market index)
      const bChg = (Math.random() * 0.04 - 0.018) * (asset === 'forex' ? 0.2 : 1);
      benchmarkPort *= (1 + bChg);

      // Random walk for strategy
      // Strategy wins more often because of drift, but has drawdown spikes
      let sChg = (Math.random() * volatility * 2 - (volatility - drift / steps));
      
      // Introduce structural strategy features
      if (strategy === 'momentum' && Math.random() > 0.90) {
        sChg += 0.12 * leverage; // breakout boost
      }
      if (strategy === 'reversion' && Math.random() > 0.92) {
        sChg -= 0.06 * leverage; // mean reversion fail
      }
      if (strategy === 'trend' && i > 30 && i < 55) {
        sChg -= 0.02 * leverage; // whip-saw chop period
      }

      currentPort *= (1 + sChg);

      // Asset price tracking
      assetPrice *= (1 + bChg);

      // Keep array values
      simulatedData.push({
        step: i,
        capital: currentPort,
        benchmark: benchmarkPort,
        price: assetPrice
      });

      // Trade generation logger trigger (simulate trades)
      if (i > 0 && Math.random() > 0.8) {
        const pChange = sChg * 100;
        const type = pChange >= 0 ? 'buy' : 'loss';
        const msg = pChange >= 0 
          ? `MATCH: ${entryAction} ${assetName} Execution at $${assetPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} - Profit target filled (+${pChange.toFixed(2)}%)`
          : `RISK: STOP LOSS Triggered on ${assetName} at $${assetPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} - Position liquidated (${pChange.toFixed(2)}%)`;
        
        const timestamp = new Date(Date.now() - (steps - i) * 60000 * 20);
        tickerEntries.push({
          timeStr: timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          type: type,
          side: pChange >= 0 ? entryAction : exitAction,
          asset: assetName,
          change: `${pChange >= 0 ? '+' : ''}${pChange.toFixed(2)}%`,
          msg: msg
        });
      }
    }

    // Run rendering updates tick by tick to simulate live compute speed
    let drawIndex = 0;
    tickerStatus.textContent = 'Backtest Executing...';
    
    // Draw the metrics final values calculation
    const initialCap = 10000;
    const finalCap = simulatedData[steps - 1].capital;
    const totReturn = ((finalCap - initialCap) / initialCap) * 100;

    // Calculate drawdown
    let maxCap = initialCap;
    let maxDD = 0;
    for(let k = 0; k < steps; k++) {
      if(simulatedData[k].capital > maxCap) maxCap = simulatedData[k].capital;
      const dd = ((maxCap - simulatedData[k].capital) / maxCap) * 100;
      if(dd > maxDD) maxDD = dd;
    }

    const finalSharpe = (drift / volatility) * 2.8;
    const finalWinRate = strategy === 'momentum' ? 44 + Math.random() * 8 : (strategy === 'reversion' ? 58 + Math.random() * 8 : 50 + Math.random() * 6);

    activeInterval = setInterval(() => {
      if (drawIndex >= steps) {
        clearInterval(activeInterval);
        btnRun.disabled = false;
        tickerStatus.textContent = 'Simulate Done';
        
        // Solidify final statistics
        mReturn.textContent = `${totReturn >= 0 ? '+' : ''}${totReturn.toFixed(1)}%`;
        mReturn.style.color = totReturn >= 0 ? 'var(--accent-green)' : 'var(--accent-purple)';
        mSharpe.textContent = finalSharpe.toFixed(2);
        mDrawdown.textContent = `-${maxDD.toFixed(1)}%`;
        mWinRate.textContent = `${finalWinRate.toFixed(1)}%`;
        return;
      }

      // Draw chart up to drawIndex
      drawChartPath(simulatedData.slice(0, drawIndex + 1), steps);
      
      // Feed live logs
      const logFeed = tickerEntries.filter(entry => {
        const itemStep = Math.floor((steps * 0.8) / tickerEntries.length);
        return tickerEntries.indexOf(entry) * itemStep === drawIndex;
      });

      logFeed.forEach(log => {
        const row = document.createElement('div');
        row.className = `ticker-row ${log.type}`;
        row.innerHTML = `
          <span>[${log.timeStr}]</span>
          <span style="font-weight:700;">${log.side}</span>
          <span>${log.asset}</span>
          <span style="font-weight:700;">${log.change}</span>
          <span style="color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${log.msg}</span>
        `;
        tickerLogs.prepend(row);
      });

      // Stream statistics scrolling up
      const currentPct = ((simulatedData[drawIndex].capital - initialCap) / initialCap) * 100;
      mReturn.textContent = `${currentPct >= 0 ? '+' : ''}${currentPct.toFixed(1)}%`;
      mReturn.style.color = currentPct >= 0 ? 'var(--accent-cyan)' : 'var(--accent-purple)';

      drawIndex += 2;
    }, 45);
  }

  function drawChartPath(data, totalSteps) {
    const width = chartSvg.clientWidth || 800;
    const height = chartSvg.clientHeight || 320;
    chartSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Clear svg elements
    chartSvg.innerHTML = '';

    if (data.length < 2) return;

    // Get min and max across entire simulation range to keep scaling constant
    const allCapitals = simulatedData.map(d => d.capital);
    const allBenchmarks = simulatedData.map(d => d.benchmark);
    const minVal = Math.min(...allCapitals, ...allBenchmarks) * 0.95;
    const maxVal = Math.max(...allCapitals, ...allBenchmarks) * 1.05;
    const range = maxVal - minVal;

    // Grid coordinates helper
    const getX = (idx) => (idx / (totalSteps - 1)) * (width - 80) + 40;
    const getY = (val) => height - 30 - ((val - minVal) / range) * (height - 60);

    // Draw Grid Lines & Axes
    const gridColor = 'rgba(255, 255, 255, 0.04)';
    const textColor = 'var(--text-dim)';
    
    // Horizontal grids
    for (let k = 0; k <= 4; k++) {
      const val = minVal + (range * k) / 4;
      const y = getY(val);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '40');
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - 40);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', gridColor);
      line.setAttribute('stroke-dasharray', '4,4');
      chartSvg.appendChild(line);

      // Label text
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', '35');
      txt.setAttribute('y', y + 4);
      txt.setAttribute('fill', textColor);
      txt.setAttribute('font-size', '10px');
      txt.setAttribute('text-anchor', 'end');
      txt.textContent = `$${Math.round(val).toLocaleString()}`;
      chartSvg.appendChild(txt);
    }

    // Benchmark equity line (Gray)
    let bPathData = `M ${getX(0)} ${getY(data[0].benchmark)}`;
    for (let i = 1; i < data.length; i++) {
      bPathData += ` L ${getX(i)} ${getY(data[i].benchmark)}`;
    }
    const bPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bPath.setAttribute('d', bPathData);
    bPath.setAttribute('fill', 'none');
    bPath.setAttribute('stroke', 'rgba(255, 255, 255, 0.25)');
    bPath.setAttribute('stroke-width', '1.5');
    chartSvg.appendChild(bPath);

    // Strategy equity line (Cyan + Shadow Glow)
    let sPathData = `M ${getX(0)} ${getY(data[0].capital)}`;
    for (let i = 1; i < data.length; i++) {
      sPathData += ` L ${getX(i)} ${getY(data[i].capital)}`;
    }
    
    // Add SVG glow filter if not exists
    let defs = chartSvg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      `;
      chartSvg.appendChild(defs);
    }

    const sPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sPath.setAttribute('d', sPathData);
    sPath.setAttribute('fill', 'none');
    sPath.setAttribute('stroke', 'var(--accent-cyan)');
    sPath.setAttribute('stroke-width', '2.5');
    sPath.setAttribute('filter', 'url(#glow)');
    chartSvg.appendChild(sPath);

    // Interactivity: Tracker lines on mouse hover
    const rectTrigger = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectTrigger.setAttribute('x', '40');
    rectTrigger.setAttribute('y', '20');
    rectTrigger.setAttribute('width', width - 80);
    rectTrigger.setAttribute('height', height - 50);
    rectTrigger.setAttribute('fill', 'transparent');
    rectTrigger.style.cursor = 'crosshair';
    chartSvg.appendChild(rectTrigger);

    const trackerCol = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    trackerCol.setAttribute('stroke', 'rgba(0, 242, 254, 0.3)');
    trackerCol.setAttribute('stroke-width', '1');
    trackerCol.setAttribute('y1', '20');
    trackerCol.setAttribute('y2', height - 30);
    trackerCol.style.opacity = 0;
    chartSvg.appendChild(trackerCol);

    rectTrigger.addEventListener('mousemove', (e) => {
      const rect = chartSvg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      // Find closest step index
      const relativeX = (mouseX - 40) / (width - 80);
      let stepIndex = Math.round(relativeX * (data.length - 1));
      stepIndex = Math.max(0, Math.min(stepIndex, data.length - 1));

      const finalX = getX(stepIndex);
      trackerCol.setAttribute('x1', finalX);
      trackerCol.setAttribute('x2', finalX);
      trackerCol.style.opacity = 1;

      // Tooltip position
      const cap = data[stepIndex].capital;
      const bCap = data[stepIndex].benchmark;
      tooltip.style.opacity = 1;
      tooltip.style.left = `${e.clientX - rect.left + 15}px`;
      tooltip.style.top = `${e.clientY - rect.top - 40}px`;
      tooltip.innerHTML = `
        <div style="font-weight:700; color:var(--accent-cyan)">Strategy: $${Math.round(cap).toLocaleString()}</div>
        <div style="color:var(--text-muted)">Benchmark: $${Math.round(bCap).toLocaleString()}</div>
      `;
    });

    rectTrigger.addEventListener('mouseleave', () => {
      trackerCol.style.opacity = 0;
      tooltip.style.opacity = 0;
    });
  }
}

/* =========================================================================
   5. Contact Form Validations & Submissions
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit-form');
  const toast = document.getElementById('success-toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check fields
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const msg = document.getElementById('form-msg').value.trim();

      if (!name || !email || !msg) return;

      // Lock button to mock loading state
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <svg class="loading-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#07090e" stroke-width="3" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Transmitting Details...
      `;

      // Mock API trigger latency
      setTimeout(() => {
        // Reset button
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#07090e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Submit Consultation Request
        `;

        // Toast alert success triggers
        toast.classList.add('show');
        
        // Hide toast
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4000);

        form.reset();
      }, 1500);
    });
  }
}

// Spin animation rule injection for form button loader
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
