// DMX Controller PWA - Main JavaScript
// Service Worker Registration
if (‘serviceWorker’ in navigator) {
navigator.serviceWorker.register(‘sw.js’).then(() => {
console.log(‘Service Worker registered’);
});
}

// Show install prompt for 3 seconds
window.addEventListener(‘load’, () => {
const installPrompt = document.getElementById(‘installPrompt’);
if (!window.matchMedia(’(display-mode: standalone)’).matches) {
installPrompt.classList.add(‘show’);
setTimeout(() => installPrompt.classList.remove(‘show’), 10000);
}
});

function closeInstallPrompt() {
document.getElementById(‘installPrompt’).classList.remove(‘show’);
}

// Song Database
const songs = [
{
id: 0,
title: ‘TEST - Alle Lamper’,
desc: ‘Systematisk test’,
slides: [{ name: ‘Test’, test: true }]
},
{
id: 1,
title: ‘Gospel Medley’,
desc: ‘Glad - Gul/rav/hvid’,
slides: [
{ name: ‘Intro’, colors: [[255,200,0]], dim: 200 },
{ name: ‘This Little Light’, colors: [[255,150,50]], dim: 255 },
{ name: ‘Go Tell It’, colors: [[255,255,200]], dim: 255 },
{ name: ‘Saints’, colors: [[255,200,0], [255,255,255]], dim: 255, effect: ‘pulse’ }
]
},
{
id: 2,
title: ‘Human’,
desc: ‘Tæt - Blå/grå’,
slides: [
{ name: ‘Vers’, colors: [[50,100,200]], dim: 150 },
{ name: ‘Omkvæd’, colors: [[100,100,150]], dim: 200 }
]
},
{
id: 3,
title: ‘Beautiful Things’,
desc: ‘Blid - Grøn/varm’,
slides: [
{ name: ‘Intro’, colors: [[100,200,100]], dim: 150 },
{ name: ‘Vers’, colors: [[100,200,100], [255,200,150]], dim: 200, effect: ‘slowfade’ },
{ name: ‘Bridge’, colors: [[150,255,150]], dim: 230 }
]
},
{
id: 4,
title: ‘I østen stiger solen op’,
desc: ‘Solopgang’,
slides: [
{ name: ‘Nat’, colors: [[20,30,100]], dim: 50 },
{ name: ‘Tidlig morgen’, colors: [[50,20,80]], dim: 100 },
{ name: ‘Daggry’, colors: [[100,40,120]], dim: 150 },
{ name: ‘Solopgang’, colors: [[150,50,200]], dim: 200 },
{ name: ‘Solen stiger’, colors: [[200,80,150]], dim: 230 },
{ name: ‘Dagslys’, colors: [[255,120,80]], dim: 255 },
{ name: ‘Gylden’, colors: [[255,150,50]], dim: 255 }
]
},
{
id: 5,
title: ‘En drøm’,
desc: ‘Lilla/rosa’,
slides: [
{ name: ‘Intro’, colors: [[150,50,200]], dim: 180 },
{ name: ‘Vers’, colors: [[150,50,200], [200,100,150]], dim: 200, effect: ‘slowfade’ }
]
},
{
id: 6,
title: ‘Hallelujah’,
desc: ‘Intim - Lilla/amber’,
slides: [
{ name: ‘Solo’, colors: [[100,20,150]], dim: 120 },
{ name: ‘Vers’, colors: [[100,20,150], [200,100,50]], dim: 180, effect: ‘slowfade’ },
{ name: ‘Omkvæd’, colors: [[150,40,200]], dim: 220 }
]
},
{
id: 7,
title: ‘I morgen’,
desc: ‘Lyseblå/orange’,
slides: [
{ name: ‘Intro’, colors: [[100,150,255]], dim: 180 },
{ name: ‘Omkvæd’, colors: [[100,150,255], [255,150,50]], dim: 230, effect: ‘slowfade’ }
]
},
{
id: 8,
title: ‘Trosbekendelsen’,
desc: ‘Hiphop - Rød/cyan/magenta’,
slides: [
{ name: ‘Beat’, colors: [[255,0,0]], dim: 255 },
{ name: ‘Vers’, colors: [[255,0,0], [0,255,255]], dim: 255, effect: ‘beat’ },
{ name: ‘Omkvæd’, colors: [[255,0,0], [0,255,255], [255,0,255]], dim: 255, effect: ‘beat’ },
{ name: ‘Outro’, colors: [[255,255,255]], dim: 255 }
]
}
];

// Fixture Database
let fixtures = JSON.parse(localStorage.getItem(‘dmx_fixtures’)) || [
{ id: 1, name: ‘Højre Par’, type: ‘par’, dmx: 1, channels: { dim: 1, r: 2, g: 3, b: 4 } },
{ id: 2, name: ‘Venstre Par’, type: ‘par’, dmx: 17, channels: { dim: 1, r: 2, g: 3, b: 4 } },
{ id: 3, name: ‘Center front’, type: ‘par’, dmx: 33, channels: { dim: 1, r: 2, g: 3, b: 4 } },
{ id: 4, name: ‘Center bag’, type: ‘par’, dmx: 49, channels: { dim: 1, r: 2, g: 3, b: 4 } },
{ id: 5, name: ‘V Moving’, type: ‘moving’, dmx: 65, channels: { pan: 1, tilt: 3, dim: 6, r: 10, g: 11, b: 12 } },
{ id: 6, name: ‘H Moving’, type: ‘moving’, dmx: 81, channels: { pan: 1, tilt: 3, dim: 6, r: 10, g: 11, b: 12 } },
{ id: 7, name: ‘V Battery’, type: ‘battery’, dmx: 97, channels: { r: 1, g: 2, b: 3, w: 4 } },
{ id: 8, name: ‘VB Battery’, type: ‘battery’, dmx: 113, channels: { r: 1, g: 2, b: 3, w: 4 } },
{ id: 9, name: ‘HB Battery’, type: ‘battery’, dmx: 129, channels: { r: 1, g: 2, b: 3, w: 4 } },
{ id: 10, name: ‘H Battery’, type: ‘battery’, dmx: 145, channels: { r: 1, g: 2, b: 3, w: 4 } }
];

// State
let espIP = localStorage.getItem(‘esp_ip’) || ‘’;
let currentSong = -1;
let currentSlide = 0;
let currentEffect = null;
let isPaused = false;
let isConnected = false;
let frontDmx = [
parseInt(localStorage.getItem(‘front_dmx1’)) || 161,
parseInt(localStorage.getItem(‘front_dmx2’)) || 177
];

// Initialize
document.addEventListener(‘DOMContentLoaded’, () => {
renderSongs();
updateFrontlight();
if (espIP) {
document.getElementById(‘espIP’).value = espIP;
checkConnection();
}
});

// Tab Switching
function switchTab(n) {
document.querySelectorAll(’.tab’).forEach((t, i) => {
t.className = i === n ? ‘tab active’ : ‘tab’;
});
document.querySelectorAll(’.tab-content’).forEach((c, i) => {
c.className = i === n ? ‘tab-content active’ : ‘tab-content’;
});
if (n === 3) renderOverview();
}

// Song Management
function renderSongs() {
const list = document.getElementById(‘songList’);
list.innerHTML = ‘’;

songs.forEach((s, i) => {
const div = document.createElement(‘div’);
div.className = ‘song-item’;
if (i === currentSong) div.classList.add(‘active’);

```
div.innerHTML = `
  <span class="song-num">${i + 1}</span>
  <div class="song-title">${s.title}</div>
  <div class="song-desc">${s.desc} • ${s.slides.length} slides</div>
`;

div.onclick = () => playSong(i);
list.appendChild(div);
```

});

updateNowPlaying();
}

function updateNowPlaying() {
const np = document.getElementById(‘nowPlaying’);
if (currentSong >= 0) {
const s = songs[currentSong];
const slide = s.slides[currentSlide];

```
document.getElementById('npTitle').textContent = `${currentSong + 1}. ${s.title}`;
document.getElementById('npDesc').textContent = s.desc;

const si = document.getElementById('slideInfo');
si.style.display = 'block';
si.innerHTML = `<strong>Slide ${currentSlide + 1}/${s.slides.length}:</strong> ${slide.name}`;

np.style.display = 'block';

if (s.slides.length > 1) {
  document.getElementById('controls').style.display = 'none';
  document.getElementById('controlsFull').style.display = 'grid';
} else {
  document.getElementById('controls').style.display = 'grid';
  document.getElementById('controlsFull').style.display = 'none';
}
```

} else {
np.style.display = ‘none’;
}
}

function playSong(idx) {
currentSong = idx;
currentSlide = 0;
isPaused = false;
renderSongs();
applySlide();
}

function nextSlide() {
const s = songs[currentSong];
if (currentSlide < s.slides.length - 1) {
currentSlide++;
applySlide();
updateNowPlaying();
}
}

function prevSlide() {
if (currentSlide > 0) {
currentSlide–;
applySlide();
updateNowPlaying();
}
}

function stopSong() {
currentSong = -1;
currentSlide = 0;
stopEffect();
setAllColor(0, 0, 0, 0);
renderSongs();
}

function togglePause() {
isPaused = !isPaused;
document.getElementById(‘pauseBtn’).textContent = isPaused ? ‘▶ Resume’ : ‘⏸ Pause’;
if (isPaused) stopEffect();
else applySlide();
}

function applySlide() {
if (isPaused) return;
stopEffect();

const s = songs[currentSong];
const slide = s.slides[currentSlide];

if (slide.test) {
runTest();
} else if (slide.effect === ‘pulse’) {
runPulse(slide.colors, slide.dim);
} else if (slide.effect === ‘slowfade’) {
runSlowFade(slide.colors, slide.dim);
} else if (slide.effect === ‘beat’) {
runBeat(slide.colors, slide.dim);
} else {
setAllColor(slide.colors[0][0], slide.colors[0][1], slide.colors[0][2], slide.dim);
}
}

// DMX Communication
function sendDMX(channel, value) {
if (!isConnected || !espIP) return;
fetch(`http://${espIP}/dmx?ch=${channel}&val=${value}`).catch(e => console.error(‘DMX error:’, e));
}

function setAllColor(r, g, b, dim) {
fixtures.forEach(f => {
if (f.channels.dim) sendDMX(f.dmx + f.channels.dim - 1, dim);
if (f.channels.r) {
sendDMX(f.dmx + f.channels.r - 1, r);
sendDMX(f.dmx + f.channels.g - 1, g);
sendDMX(f.dmx + f.channels.b - 1, b);
}
});
}

function setColor(r, g, b) {
document.getElementById(‘redSlider’).value = r;
document.getElementById(‘greenSlider’).value = g;
document.getElementById(‘blueSlider’).value = b;
updateRGB();
}

function updateRGB() {
const r = parseInt(document.getElementById(‘redSlider’).value);
const g = parseInt(document.getElementById(‘greenSlider’).value);
const b = parseInt(document.getElementById(‘blueSlider’).value);

document.getElementById(‘redVal’).textContent = r;
document.getElementById(‘greenVal’).textContent = g;
document.getElementById(‘blueVal’).textContent = b;

setAllColor(r, g, b, 255);
}

// Frontlight Control
function updateFrontlight() {
const cold = parseInt(document.getElementById(‘coldSlider’).value);
const warm = parseInt(document.getElementById(‘warmSlider’).value);

document.getElementById(‘coldVal’).textContent = cold;
document.getElementById(‘warmVal’).textContent = warm;

sendDMX(frontDmx[0], cold);
sendDMX(frontDmx[0] + 1, warm);
sendDMX(frontDmx[1], cold);
sendDMX(frontDmx[1] + 1, warm);
}

function setFrontPreset(cold, warm) {
document.getElementById(‘coldSlider’).value = cold;
document.getElementById(‘warmSlider’).value = warm;
updateFrontlight();
}

// Effects
function stopEffect() {
if (currentEffect) {
clearInterval(currentEffect);
currentEffect = null;
}
}

function runSlowFade(colors, dim) {
let step = 0;
const stepsPerColor = 200;

currentEffect = setInterval(() => {
if (isPaused) return;

```
const colorIdx = Math.floor(step / stepsPerColor) % colors.length;
const nextIdx = (colorIdx + 1) % colors.length;
const progress = (step % stepsPerColor) / stepsPerColor;

const c1 = colors[colorIdx];
const c2 = colors[nextIdx];
const r = Math.round(c1[0] + (c2[0] - c1[0]) * progress);
const g = Math.round(c1[1] + (c2[1] - c1[1]) * progress);
const b = Math.round(c1[2] + (c2[2] - c1[2]) * progress);

setAllColor(r, g, b, dim);
step++;
```

}, 50);
}

function runPulse(colors, dim) {
let brightness = dim * 0.3;
let dir = 3;
let colorIdx = 0;

currentEffect = setInterval(() => {
if (isPaused) return;

```
const c = colors[colorIdx % colors.length];
const factor = brightness / dim;
const r = Math.round(c[0] * factor);
const g = Math.round(c[1] * factor);
const b = Math.round(c[2] * factor);

setAllColor(r, g, b, brightness);

brightness += dir;
if (brightness >= dim || brightness <= dim * 0.3) {
  dir *= -1;
  if (brightness <= dim * 0.3) colorIdx++;
}
```

}, 30);
}

function runBeat(colors, dim) {
let idx = 0;

currentEffect = setInterval(() => {
if (isPaused) return;

```
const c = colors[idx % colors.length];
setAllColor(c[0], c[1], c[2], dim);

setTimeout(() => {
  if (!isPaused) setAllColor(0, 0, 0, 50);
}, 100);

idx++;
```

}, 400);
}

function runTest() {
alert(‘Test-funktionen kræver ESP32 forbindelse og vil blive implementeret snart!’);
stopSong();
}

// Overview
function renderOverview() {
const ov = document.getElementById(‘fixtureOverview’);
ov.innerHTML = ‘’;

const colors = { par: ‘#ef4444’, moving: ‘#3b82f6’, battery: ‘#22c55e’ };

fixtures.forEach(f => {
const panel = document.createElement(‘div’);
panel.className = ‘channel-panel’;
panel.style.borderLeftColor = colors[f.type] || ‘#6b7280’;

```
let html = `<h3 style="margin-bottom:10px">${f.name} <span style="opacity:0.6;font-size:14px;font-weight:normal">(DMX ${f.dmx})</span></h3>`;

Object.keys(f.channels).forEach(key => {
  const chNum = f.dmx + f.channels[key] - 1;
  html += `
    <div class="channel-row">
      <div style="font-size:13px;opacity:0.8">CH ${chNum}</div>
      <div style="flex:1">
        <div style="font-size:12px;opacity:0.7">${key.toUpperCase()}</div>
        <input type="range" min="0" max="255" value="0" style="width:100%;height:30px;margin:5px 0" 
               oninput="sendDMX(${chNum}, this.value); this.nextElementSibling.textContent = this.value">
        <span style="text-align:right;font-family:monospace;font-weight:bold">0</span>
      </div>
    </div>
  `;
});

panel.innerHTML = html;
ov.appendChild(panel);
```

});
}

// Modals
function openMenu() {
document.getElementById(‘menuModal’).classList.add(‘active’);
}

function closeMenu() {
document.getElementById(‘menuModal’).classList.remove(‘active’);
}

function openConnection() {
closeMenu();
document.getElementById(‘connectionModal’).classList.add(‘active’);
}

function closeConnection() {
document.getElementById(‘connectionModal’).classList.remove(‘active’);
}

function saveConnection() {
espIP = document.getElementById(‘espIP’).value;
localStorage.setItem(‘esp_ip’, espIP);
closeConnection();
checkConnection();
}

function checkConnection() {
if (!espIP) return;

fetch(`http://${espIP}/ping`)
.then(r => r.text())
.then(() => {
isConnected = true;
document.getElementById(‘statusDot’).classList.add(‘connected’);
document.getElementById(‘statusText’).textContent = `Forbundet til ${espIP}`;
})
.catch(() => {
isConnected = false;
document.getElementById(‘statusDot’).classList.remove(‘connected’);
document.getElementById(‘statusText’).textContent = ‘Ikke forbundet’;
});
}

function testConnection() {
const ip = document.getElementById(‘espIP’).value;
const status = document.getElementById(‘connectionStatus’);
status.textContent = ‘Tester…’;

fetch(`http://${ip}/ping`)
.then(r => r.text())
.then(() => {
status.textContent = ‘✅ Forbindelse OK!’;
status.style.color = ‘#22c55e’;
})
.catch(() => {
status.textContent = ‘❌ Kunne ikke forbinde’;
status.style.color = ‘#ef4444’;
});
}

function openFixtureSetup() {
alert(‘Lampe setup kommer snart! Indtil da kan du redigere i app.js’);
closeMenu();
}

function saveAll() {
localStorage.setItem(‘dmx_fixtures’, JSON.stringify(fixtures));
localStorage.setItem(‘esp_ip’, espIP);
localStorage.setItem(‘front_dmx1’, frontDmx[0]);
localStorage.setItem(‘front_dmx2’, frontDmx[1]);
alert(‘✅ Alle indstillinger gemt!’);
closeMenu();
}

// Auto-reconnect
setInterval(checkConnection, 5000);
