import './style.css';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { PROJECTS } from './projects.js';
/* ---------------------------------------------------------------- setup */
const PREFERS_REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const THEME = {
  wall: 0x2c4fc4,
  navy: 0x232d4c,
  yellow: 0xf0bd4a,
  red: 0xd9483a,
  orange: 0xe8792c,
  mint: 0x4fb9a3,
  coral: 0xf06a52,
  blue: 0x3d6bd8,
  brass: 0xe0b25c,
};

const PROJECT_IDS = ['wangchan-dorm', 'foodqueue', 'repairdesk', 'barber-booking', 'smartqueue'];
const DOT = {
  'wangchan-dorm': '#f0bd4a',
  foodqueue: '#d9483a',
  repairdesk: '#e8792c',
  'barber-booking': '#8fa6ef',
  smartqueue: '#4fb9a3',
};

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) { g.roundRect(x, y, w, h, r); return; }
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* ------------------------------------------------------------ textures */
function woodTexture() {
  return canvasTexture(1024, 512, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#f2dbae');
    grad.addColorStop(0.55, '#ecd0a0');
    grad.addColorStop(1, '#e7c795');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);

    const rnd = mulberry32(23);
    for (let i = 0; i < 130; i++) {
      const y = rnd() * h;
      const amp = 3 + rnd() * 9;
      const alpha = 0.035 + rnd() * 0.06;
      g.strokeStyle = `rgba(146,102,52,${alpha})`;
      g.lineWidth = 0.8 + rnd() * 2.4;
      g.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const yy = y + Math.sin(x / 120 + i * 1.7) * amp + Math.sin(x / 37 + i) * amp * 0.22;
        if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
      }
      g.stroke();
    }
    g.globalAlpha = 0.10;
    for (let i = 0; i < 5; i++) {
      const x = rnd() * w, y = rnd() * h;
      g.strokeStyle = '#8e5f30'; g.lineWidth = 2;
      for (let r = 6; r < 34; r += 7) {
        g.beginPath(); g.ellipse(x, y, r * 1.9, r * 0.55, 0.2, 0, Math.PI * 2); g.stroke();
      }
    }
    g.globalAlpha = 1;
  });
}

function wallTexture() {
  return canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = '#2c4fc4'; g.fillRect(0, 0, w, h);
    const lg = g.createRadialGradient(w * 0.25, h * 0.1, 20, w * 0.25, h * 0.1, w * 0.9);
    lg.addColorStop(0, 'rgba(126,160,255,0.32)');
    lg.addColorStop(1, 'rgba(18,32,96,0.30)');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
  });
}

function titleScreenTexture() {
  return canvasTexture(1280, 720, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#111d47');
    bg.addColorStop(1, '#1a2b62');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);

    g.strokeStyle = 'rgba(150,175,255,0.10)'; g.lineWidth = 2;
    for (let x = 0; x < w; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }

    g.textAlign = 'center';
    g.textBaseline = 'middle';

    // monogram badge
    g.fillStyle = '#4fb9a3';
    roundRect(g, w / 2 - 52, 92, 104, 104, 26); g.fill();
    g.fillStyle = '#0e1b45';
    g.font = '800 52px Baloo2, sans-serif';
    g.fillText('HK', w / 2, 148);

    g.fillStyle = '#ffffff';
    g.font = '800 84px Baloo2, sans-serif';
    g.fillText('Hirun Kongpetch', w / 2, 292);

    g.fillStyle = '#ffd977';
    g.font = '600 40px Baloo2, sans-serif';
    g.fillText('full-stack developer', w / 2, 364);

    g.strokeStyle = 'rgba(160,185,255,0.35)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(w / 2 - 250, 414); g.lineTo(w / 2 + 250, 414); g.stroke();

    g.fillStyle = '#93a7e6';
    g.font = '400 30px Rubik, sans-serif';
    g.fillText('five small-business systems, standing on this desk', w / 2, 466);

    const dots = ['#f0bd4a', '#d9483a', '#e8792c', '#8fa6ef', '#4fb9a3'];
    const startX = w / 2 - (dots.length - 1) * 28;
    dots.forEach((c, i) => {
      g.fillStyle = c;
      roundRect(g, startX + i * 56 - 14, 528, 28, 28, 8); g.fill();
    });
  });
}

function keyTagTexture() {
  return canvasTexture(256, 360, (g, w, h) => {
    g.fillStyle = '#4fb9a3'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 9;
    roundRect(g, 22, 22, w - 44, h - 44, 26); g.stroke();

    g.fillStyle = 'rgba(11,38,36,0.55)';
    g.beginPath(); g.arc(w / 2, 78, 21, 0, Math.PI * 2); g.fill();

    g.fillStyle = '#0d3330';
    g.textAlign = 'center';
    g.font = '600 26px Rubik, sans-serif';
    g.fillText('ROOM', w / 2, 150);
    g.font = '800 84px Baloo2, sans-serif';
    g.fillText('A101', w / 2, 240);

    // little door pictogram
    g.strokeStyle = 'rgba(13,51,48,0.75)'; g.lineWidth = 8;
    roundRect(g, w / 2 - 30, 268, 60, 56, 6); g.stroke();
    g.beginPath(); g.arc(w / 2 + 16, 297, 5, 0, Math.PI * 2); g.fillStyle = 'rgba(13,51,48,0.75)'; g.fill();
  });
}

function ticketTexture() {
  return canvasTexture(512, 300, (g, w, h) => {
    g.fillStyle = '#fbf6e7'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#efe6cd';
    for (let y = 14; y < h - 10; y += 26) {
      g.beginPath(); g.arc(18, y, 7, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#4fb9a3'; g.fillRect(40, 0, 14, h);
    g.fillStyle = '#9c9377';
    g.font = '600 26px Rubik, sans-serif';
    g.fillText('SMARTQUEUE', 84, 62);
    g.fillStyle = '#132a4d';
    g.font = '800 118px Baloo2, sans-serif';
    g.fillText('A 017', 80, 186);
    g.fillStyle = '#7d7660';
    g.font = '500 24px Rubik, sans-serif';
    g.fillText('please take a seat', 84, 236);
    g.fillStyle = '#e8792c';
    g.fillRect(84, 258, 148, 10);
  });
}

function qrCardTexture() {
  return canvasTexture(384, 512, (g, w, h) => {
    g.fillStyle = '#fbf4e2'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1d2a4d';
    g.font = '800 31px Baloo2, sans-serif';
    g.textAlign = 'center';
    g.fillText('SCAN TO ORDER', w / 2, 58);

    const x0 = 56, y0 = 92, size = 272, n = 21, cell = size / n;
    g.fillStyle = '#ffffff';
    g.fillRect(x0 - 12, y0 - 12, size + 24, size + 24);
    g.fillStyle = '#15203e';
    const rnd = mulberry32(97);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (x < 7 && y < 7) continue;
        if (x > n - 8 && y < 7) continue;
        if (x < 7 && y > n - 8) continue;
        if (rnd() > 0.52) g.fillRect(x0 + x * cell, y0 + y * cell, cell * 0.94, cell * 0.94);
      }
    }
    const finder = (fx, fy) => {
      g.fillStyle = '#15203e';
      g.fillRect(fx, fy, cell * 7, cell * 7);
      g.fillStyle = '#ffffff';
      g.fillRect(fx + cell, fy + cell, cell * 5, cell * 5);
      g.fillStyle = '#15203e';
      g.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3);
    };
    finder(x0, y0);
    finder(x0 + cell * 14, y0);
    finder(x0, y0 + cell * 14);

    g.fillStyle = '#7a6c4e';
    g.font = '500 24px Rubik, sans-serif';
    g.fillText('FoodQueue · table service', w / 2, 426);
    g.fillStyle = '#d9483a';
    g.fillRect(w / 2 - 38, 452, 76, 8);
  });
}

function phoneScreenTexture() {
  return canvasTexture(256, 512, (g, w, h) => {
    g.fillStyle = '#161d33'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#4fb9a3';
    roundRect(g, 22, 30, w - 44, 452, 18); g.fill();
    g.fillStyle = '#0f3a36';
    g.font = '700 24px Rubik, sans-serif';
    g.fillText('RepairDesk', 44, 84);
    g.fillStyle = '#fbf6e7';
    roundRect(g, 38, 110, w - 76, 316, 12); g.fill();
    g.fillStyle = '#cdd6e8';
    for (let i = 0; i < 8; i++) g.fillRect(58, 140 + i * 34, i % 3 === 0 ? 140 : 110, 9);
    g.fillStyle = '#e8792c';
    roundRect(g, 58, 384, 84, 26, 6); g.fill();
    g.fillStyle = '#0f3a36';
    g.font = '600 20px Rubik, sans-serif';
    g.fillText('TICKET', 44, 452);
  });
}

function barberTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#f7efe0'; g.fillRect(0, 0, 256, 256);
  const bands = [
    ['#d9483a', 0], ['#f7efe0', 18], ['#2f55c0', 46], ['#f7efe0', 64],
    ['#d9483a', 92], ['#f7efe0', 110], ['#2f55c0', 138], ['#f7efe0', 156],
    ['#d9483a', 184], ['#f7efe0', 202], ['#2f55c0', 230],
  ];
  g.save();
  g.translate(128, 128); g.rotate(-0.7); g.translate(-260, -260);
  bands.forEach(([color, y]) => {
    g.fillStyle = color;
    g.fillRect(0, y, 520, 22);
  });
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

function matTexture() {
  return canvasTexture(512, 612, (g, w, h) => {
    g.fillStyle = '#f6efdc'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(120,100,60,0.05)';
    for (let i = 0; i < 900; i++) {
      const rnd = mulberry32(i + 3)();
      g.fillRect(rnd * w, ((i * 37) % h), 2, 2);
    }
    g.fillStyle = '#2b7f72';
    g.font = '700 54px Baloo2, sans-serif';
    g.textAlign = 'center';
    g.letterSpacing = '14px';
    g.fillText('HK', w / 2 + 7, h - 34);
    g.letterSpacing = '0px';
  });
}

/* -------------------------------------------------------------- helpers */
const rbox = (w, h, d, r = 0.04, material, seg = 2) =>
  new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2, h / 2, d / 2)), material);

const plastic = (color, opts = {}) => new THREE.MeshStandardMaterial({
  color, roughness: 0.42, metalness: 0.0, envMapIntensity: 0.55, ...opts,
});

function shadows(root, cast = true, receive = true) {
  root.traverse((o) => {
    if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; }
  });
  return root;
}

function setupWorld(renderer, { plain = false } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(plain ? 0xdfe3ec : THEME.wall);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // sigma above ~0.04 needs more blur samples than three allows and warns
  scene.environmentIntensity = plain ? 0.45 : 0.38;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(0xb4c9ff, 0x6d5a3f, plain ? 0.7 : 0.55);
  scene.add(hemi);
  const amb = new THREE.AmbientLight(0xffffff, plain ? 0.35 : 0.26);
  scene.add(amb);

  const key = new THREE.DirectionalLight(0xfff3dd, plain ? 2.3 : 2.6);
  key.position.set(-9, 8.5, 6);
  key.target.position.set(0.8, 0, -0.4);
  scene.add(key.target);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xc7d6ff, plain ? 0.4 : 0.55);
  fill.position.set(7, 4, 4);
  scene.add(fill);
  return { scene, key };
}

function makeRenderer(canvas) {
  // Hi-DPI screens already hide edges, so MSAA and a full 2x buffer are wasted fill there. The loop lowers the ratio further if frames run slow.
  const dpr = devicePixelRatio || 1;
  const r = new THREE.WebGLRenderer({
    canvas, antialias: dpr < 1.5, powerPreference: 'high-performance',
  });
  r.setPixelRatio(Math.min(dpr, 1.5));
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  // The key light never moves, so the shadow map is drawn once and redrawn only when an object moves (see needsUpdate).
  r.shadowMap.autoUpdate = false;
  r.toneMapping = THREE.NeutralToneMapping;
  r.toneMappingExposure = 1.02;
  r.outputColorSpace = THREE.SRGBColorSpace;
  return r;
}

/* ---------------------------------------------------------------- desk */
const DESK_W = 9.6, DESK_D = 4.6, DESK_TOP = 0;

function buildRoom(woodTex) {
  const g = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(46, 30),
    new THREE.MeshStandardMaterial({ color: 0x7e8bad, roughness: 0.94, metalness: 0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.06, -1.5);
  floor.receiveShadow = true;
  g.add(floor);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 18),
    new THREE.MeshStandardMaterial({ map: wallTexture(), roughness: 0.97, metalness: 0 })
  );
  wall.position.set(0, 5, -3.55);
  wall.receiveShadow = true;
  g.add(wall);

  const baseboard = new THREE.Mesh(
    new THREE.BoxGeometry(40, 0.17, 0.07),
    plastic(0x172a6e, { roughness: 0.62 })
  );
  baseboard.position.set(0, -0.98, -3.51);
  baseboard.receiveShadow = true;
  g.add(baseboard);

  // desk slab
  const slab = rbox(DESK_W, 0.26, DESK_D, 0.055, plastic(0xd8b585, { roughness: 0.64 }));
  slab.position.set(0, DESK_TOP - 0.14, 0);
  g.add(slab);

  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.68, metalness: 0, envMapIntensity: 0.22 });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(DESK_W - 0.02, DESK_D - 0.02), woodMat);
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, DESK_TOP + 0.002, 0);
  top.receiveShadow = true;
  g.add(top);

  // legs + apron
  const legMat = plastic(0xcfa878, { roughness: 0.62 });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const leg = rbox(0.19, 0.8, 0.19, 0.035, legMat);
    leg.position.set(sx * (DESK_W / 2 - 0.34), -0.27 - 0.4, sz * (DESK_D / 2 - 0.3));
    g.add(leg);
  });
  const apronFront = rbox(DESK_W - 0.8, 0.16, 0.07, 0.025, plastic(0xc9a071, { roughness: 0.7 }));
  apronFront.position.set(0, -0.37, DESK_D / 2 - 0.14);
  g.add(apronFront);

  // little drawer on the right
  const drawer = rbox(1.24, 0.2, 0.05, 0.025, plastic(0xe0bd8e, { roughness: 0.6 }));
  drawer.position.set(2.15, -0.36, DESK_D / 2 - 0.15);
  g.add(drawer);
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.042, 16, 12),
    plastic(0x8a6539, { roughness: 0.45 })
  );
  knob.position.set(2.15, -0.36, DESK_D / 2 - 0.115);
  g.add(knob);

  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  top.castShadow = false;
  floor.castShadow = false;
  return g;
}


/* ------------------------------------------------------------- monitor */
function buildMonitor(titleTex) {
  const group = new THREE.Group();
  const bezelMat = plastic(THEME.navy, { roughness: 0.32 });

  const bezel = rbox(3.46, 2.0, 0.14, 0.06, bezelMat);
  bezel.position.y = 1.42;
  group.add(bezel);

  const screenMat = new THREE.MeshBasicMaterial({ map: titleTex });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 1.766), screenMat);
  screen.position.set(0, 1.42, 0.073);
  group.add(screen);

  const led = new THREE.Mesh(
    new THREE.CircleGeometry(0.017, 12),
    new THREE.MeshBasicMaterial({ color: 0x4fb9a3 })
  );
  led.position.set(0, 0.44, 0.072);
  group.add(led);

  const base = rbox(1.06, 0.06, 0.5, 0.024, bezelMat);
  base.position.set(0, 0.03, 0.04);
  group.add(base);

  const neck = rbox(0.16, 0.34, 0.11, 0.022, bezelMat);
  neck.position.set(0, 0.22, -0.02);
  group.add(neck);

  const plate = rbox(0.48, 0.3, 0.055, 0.022, bezelMat);
  plate.position.set(0, 0.39, -0.02);
  group.add(plate);

  group.position.set(-0.62, 0, -1.66);
  group.rotation.y = 0.14;
  shadows(group, true, false);
  return { group, screenMat, screen };
}

/* ------------------------------------------------------------- objects */
function buildDorm(keyTex) {
  const g = new THREE.Group();
  const wallMat = plastic(0xf1dfb6, { roughness: 0.5 });
  const trimMat = plastic(THEME.mint, { roughness: 0.34 });

  const block = rbox(0.64, 0.84, 0.5, 0.055, wallMat);
  block.position.y = 0.42;
  g.add(block);

  const roof = rbox(0.7, 0.07, 0.56, 0.025, trimMat);
  roof.position.y = 0.875;
  g.add(roof);

  const winMat = plastic(0x2b3f74, { roughness: 0.25 });
  const winGeo = new RoundedBoxGeometry(0.15, 0.16, 0.03, 1, 0.014);
  const winPos = [
    [-0.15, 0.66, 0.251], [0.15, 0.66, 0.251],
    [-0.15, 0.44, 0.251], [0.15, 0.44, 0.251],
    [-0.15, 0.22, 0.251], [0.15, 0.22, 0.251],
  ];
  winPos.forEach(([x, y, z]) => {
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(x, y, z);
    g.add(win);
  });
  const sideWinGeo = new RoundedBoxGeometry(0.03, 0.16, 0.16, 1, 0.01);
  [0.6, 0.34].forEach((y) => {
    const win = new THREE.Mesh(sideWinGeo, winMat);
    win.position.set(0.326, y, 0.05);
    g.add(win);
  });

  const door = rbox(0.15, 0.19, 0.03, 0.012, plastic(0x2f7a6e, { roughness: 0.4 }));
  door.position.set(0.02, 0.105, 0.252);
  g.add(door);

  // key ring + key + room tag leaning at the base
  const ringMat = new THREE.MeshStandardMaterial({ color: THEME.brass, roughness: 0.28, metalness: 0.65 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.019, 10, 26), ringMat);
  ring.position.set(-0.14, 0.12, 0.4);
  ring.rotation.set(-0.35, 0.2, 0.1);
  g.add(ring);

  const key = new THREE.Group();
  const shaft = rbox(0.03, 0.2, 0.015, 0.008, ringMat);
  shaft.position.y = 0.03;
  key.add(shaft);
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 8, 18), ringMat);
  bow.position.y = 0.14;
  key.add(bow);
  const tooth1 = rbox(0.055, 0.022, 0.015, 0.006, ringMat);
  tooth1.position.set(0.03, -0.04, 0);
  key.add(tooth1);
  const tooth2 = rbox(0.04, 0.022, 0.015, 0.006, ringMat);
  tooth2.position.set(0.024, -0.08, 0);
  key.add(tooth2);
  key.position.set(0.02, 0.1, 0.42);
  key.rotation.set(0.12, 0.55, 0.22);
  g.add(key);

  const tag = new THREE.Group();
  const tagBody = rbox(0.235, 0.33, 0.022, 0.02, plastic(THEME.mint, { roughness: 0.38 }));
  tag.add(tagBody);
  const tagFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.223, 0.318),
    new THREE.MeshBasicMaterial({ map: keyTex })
  );
  tagFace.position.z = 0.012;
  tag.add(tagFace);
  tag.position.set(0.17, 0.185, 0.38);
  tag.rotation.set(-0.12, -0.3, 0.14);
  g.add(tag);

  shadows(g, true, true);
  return { group: g, anchor: new THREE.Vector3(0.02, 0.98, 0.05) };
}

function buildFoodQueue(qrTex) {
  const g = new THREE.Group();
  const potMat = plastic(THEME.red, { roughness: 0.32 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe0b25c, roughness: 0.26, metalness: 0.6 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.37, 0.27, 40, 1, true), potMat);
  body.position.y = 0.135;
  body.material.side = THREE.DoubleSide;
  g.add(body);

  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.37, 40), plastic(0xb93a2f, { roughness: 0.5 }));
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = 0.003;
  g.add(bottom);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.026, 12, 48), goldMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.27;
  g.add(rim);

  const broth = new THREE.Mesh(
    new THREE.CircleGeometry(0.378, 40),
    new THREE.MeshStandardMaterial({ color: 0xb06a33, roughness: 0.28, metalness: 0 })
  );
  broth.rotation.x = -Math.PI / 2;
  broth.position.y = 0.255;
  g.add(broth);

  // vegetables / tofu floating
  const tofuMat = plastic(0xf6edd6, { roughness: 0.55 });
  const greenMat = plastic(0x5ea64a, { roughness: 0.5 });
  const mushMat = plastic(0xd9b38c, { roughness: 0.5 });
  const bits = [
    [-0.16, 0.28, 0.06, 0.075, 'box'], [0.1, 0.28, -0.12, 0.065, 'box'],
    [0.19, 0.285, 0.11, 0.055, 'sph'], [-0.05, 0.29, 0.19, 0.05, 'sph'],
    [-0.2, 0.29, -0.14, 0.045, 'sph'],
  ];
  bits.forEach(([x, y, z, s, kind]) => {
    const mat = kind === 'box' ? tofuMat : (s > 0.05 ? greenMat : mushMat);
    const mesh = kind === 'box'
      ? rbox(s, s * 0.62, s, 0.008, mat, 1)
      : new THREE.Mesh(new THREE.SphereGeometry(s, 12, 8), mat);
    mesh.position.set(x, y, z);
    g.add(mesh);
  });

  // handles
  [-1, 1].forEach((s) => {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 18, Math.PI * 0.9), goldMat);
    handle.position.set(s * 0.415, 0.17, 0);
    handle.rotation.set(Math.PI / 2, 0, s > 0 ? -0.2 : Math.PI + 0.2);
    g.add(handle);
  });

  // QR table tent
  const tent = new THREE.Group();
  const cardMat = new THREE.MeshStandardMaterial({ map: qrTex, roughness: 0.6, metalness: 0 });
  const backMat = plastic(0xefe4c9, { roughness: 0.7 });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.37), cardMat);
  front.position.set(0, 0.185, 0.03);
  front.rotation.x = -0.2;
  tent.add(front);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.37), backMat);
  back.position.set(0, 0.185, -0.03);
  back.rotation.x = 0.2;
  back.rotation.y = Math.PI;
  tent.add(back);
  const fold = rbox(0.28, 0.012, 0.06, 0.006, backMat);
  fold.position.y = 0.372;
  tent.add(fold);
  tent.position.set(0.44, 0, 0.2);
  tent.rotation.y = 0.32;
  g.add(tent);

  shadows(g, true, true);
  return { group: g, anchor: new THREE.Vector3(0.44, 0.5, 0.24) };
}

function buildRepairDesk(phoneTex) {
  const g = new THREE.Group();
  const boxMat = plastic(THEME.orange, { roughness: 0.36 });
  const lidMat = plastic(0xd2661f, { roughness: 0.34 });
  const darkMat = plastic(0x2a3247, { roughness: 0.4 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd8ab55, roughness: 0.3, metalness: 0.5 });

  const body = rbox(0.68, 0.3, 0.38, 0.045, boxMat);
  body.position.y = 0.16;
  g.add(body);

  const lid = rbox(0.7, 0.09, 0.4, 0.03, lidMat);
  lid.position.y = 0.355;
  g.add(lid);

  const latch = rbox(0.1, 0.06, 0.025, 0.01, goldMat);
  latch.position.set(0, 0.29, 0.2);
  g.add(latch);

  // handle: two posts + bar
  [-0.13, 0.13].forEach((x) => {
    const post = rbox(0.035, 0.1, 0.035, 0.012, darkMat);
    post.position.set(x, 0.44, 0);
    g.add(post);
  });
  const bar = rbox(0.32, 0.04, 0.04, 0.018, darkMat);
  bar.position.set(0, 0.49, 0);
  g.add(bar);

  // phone leaning on the tool box
  const phone = new THREE.Group();
  const slab = rbox(0.17, 0.32, 0.025, 0.012, darkMat);
  phone.add(slab);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 0.29),
    new THREE.MeshBasicMaterial({ map: phoneTex })
  );
  face.position.z = 0.013;
  phone.add(face);
  phone.position.set(0.24, 0.17, 0.29);
  phone.rotation.set(-0.22, 0.24, -0.06);
  g.add(phone);

  // screwdriver lying beside the box
  const driver = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.15, 14), plastic(0xd9483a, { roughness: 0.42 }));
  handle.rotation.z = Math.PI / 2;
  driver.add(handle);
  const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.19, 10), new THREE.MeshStandardMaterial({ color: 0xbfc6d4, roughness: 0.3, metalness: 0.7 }));
  shaft2.rotation.z = Math.PI / 2;
  shaft2.position.x = 0.17;
  driver.add(shaft2);
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.018), new THREE.MeshStandardMaterial({ color: 0xbfc6d4, roughness: 0.3, metalness: 0.7 }));
  tip.position.x = 0.262;
  driver.add(tip);
  driver.position.set(-0.36, 0.032, 0.32);
  driver.rotation.set(0, 0.42, 0);
  g.add(driver);

  shadows(g, true, true);
  return { group: g, anchor: new THREE.Vector3(-0.02, 0.66, 0.1) };
}

function buildBarber(stripeTex) {
  const g = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe0b25c, roughness: 0.26, metalness: 0.55 });
  const navyMat = plastic(0x22325c, { roughness: 0.32 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.16, 0.06, 26), navyMat);
  base.position.y = 0.03;
  g.add(base);

  const collarB = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 26), goldMat);
  collarB.position.y = 0.085;
  g.add(collarB);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.088, 0.6, 28, 1, true),
    new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.26, metalness: 0.04 })
  );
  pole.position.y = 0.41;
  g.add(pole);

  const collarT = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 26), goldMat);
  collarT.position.y = 0.735;
  g.add(collarT);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.098, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), goldMat);
  dome.position.y = 0.758;
  g.add(dome);

  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), goldMat);
  finial.position.y = 0.855;
  g.add(finial);

  // comb leaning against the base, teeth toward the camera
  const comb = new THREE.Group();
  const combMat = plastic(0x2c554d, { roughness: 0.42 });
  const spine = rbox(0.4, 0.038, 0.03, 0.012, combMat);
  comb.add(spine);
  for (let i = 0; i < 15; i++) {
    const tooth = rbox(0.015, 0.1, 0.026, 0.006, combMat, 1);
    tooth.position.set(-0.17 + i * 0.0243, -0.06, 0);
    comb.add(tooth);
  }
  comb.position.set(0.17, 0.055, 0.19);
  comb.rotation.set(-0.42, 0.28, -0.26);
  g.add(comb);

  shadows(g, true, true);
  return { group: g, anchor: new THREE.Vector3(0, 0.94, 0) };
}

function buildSmartQueue(ticketTex) {
  const g = new THREE.Group();
  const bodyMat = plastic(THEME.mint, { roughness: 0.35 });
  const darkMat = plastic(0x1f3a44, { roughness: 0.4 });

  const body = rbox(0.4, 0.42, 0.32, 0.05, bodyMat);
  body.position.y = 0.24;
  g.add(body);

  const top = rbox(0.42, 0.05, 0.34, 0.02, plastic(0x3ea38e, { roughness: 0.34 }));
  top.position.y = 0.465;
  g.add(top);

  const slot = rbox(0.2, 0.024, 0.03, 0.008, darkMat);
  slot.position.set(0, 0.488, 0.03);
  g.add(slot);

  const panel = rbox(0.28, 0.16, 0.02, 0.015, plastic(0x2f8b79, { roughness: 0.4 }));
  panel.position.set(0, 0.3, 0.163);
  g.add(panel);

  const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), new THREE.MeshBasicMaterial({ color: 0xfbf6e7 }));
  lamp.position.set(0, 0.3, 0.174);
  g.add(lamp);

  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 20), plastic(THEME.coral, { roughness: 0.32 }));
  button.position.set(0.135, 0.495, -0.11);
  g.add(button);

  const ticket = new THREE.Mesh(
    new THREE.PlaneGeometry(0.27, 0.158),
    new THREE.MeshBasicMaterial({ map: ticketTex, side: THREE.DoubleSide })
  );
  ticket.position.set(0.0, 0.6, 0.05);
  ticket.rotation.set(-0.3, -0.26, 0.02);
  g.add(ticket);

  [[-0.16, 0.06], [0.16, 0.06], [-0.16, -0.1], [0.16, -0.1]].forEach(([x, z]) => {
    const foot = rbox(0.06, 0.02, 0.06, 0.008, darkMat, 1);
    foot.position.set(x, 0.01, z);
    g.add(foot);
  });

  shadows(g, true, true);
  return { group: g, anchor: new THREE.Vector3(0.01, 0.66, 0.06) };
}

function buildMouse() {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 24, 16),
    plastic(0xf3ead6, { roughness: 0.42 })
  );
  shell.scale.set(1, 0.52, 1.36);
  shell.position.y = 0.068;
  g.add(shell);
  const split = rbox(0.008, 0.02, 0.12, 0.004, plastic(0xd8cfba, { roughness: 0.6 }), 1);
  split.position.set(0, 0.128, 0.055);
  g.add(split);
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.026, 12), plastic(0x2c3550, { roughness: 0.4 }));
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(0, 0.116, 0.03);
  g.add(wheel);
  shadows(g, true, true);
  return g;
}

function buildNotepad() {
  const g = new THREE.Group();

  const sheetTex = canvasTexture(256, 340, (gg, w, h) => {
    gg.fillStyle = '#fbf5e3'; gg.fillRect(0, 0, w, h);
    gg.strokeStyle = 'rgba(90,110,160,0.28)'; gg.lineWidth = 1.6;
    for (let y = 44; y < h - 10; y += 26) {
      gg.beginPath(); gg.moveTo(14, y); gg.lineTo(w - 14, y); gg.stroke();
    }
    gg.strokeStyle = 'rgba(217,72,58,0.5)'; gg.lineWidth = 2;
    gg.beginPath(); gg.moveTo(34, 0); gg.lineTo(34, h); gg.stroke();
    gg.fillStyle = 'rgba(28,42,80,0.75)';
    gg.font = '600 19px Rubik, sans-serif';
    gg.fillText('A101  ·  meter  2148', 46, 46);
    gg.fillText('A102  ·  meter  1190', 46, 98);
    gg.fillText('send bills?', 46, 150);
    gg.strokeStyle = 'rgba(28,42,80,0.7)'; gg.lineWidth = 3;
    gg.beginPath(); gg.moveTo(140, 145); gg.lineTo(196, 145); gg.stroke();
    gg.beginPath(); gg.moveTo(140, 145); gg.lineTo(150, 138); gg.stroke();
    gg.beginPath(); gg.moveTo(140, 145); gg.lineTo(150, 152); gg.stroke();
  });

  const padMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86 });
  const stack = rbox(0.62, 0.075, 0.82, 0.012, padMat);
  stack.position.y = 0.038;
  g.add(stack);

  const top = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.8), new THREE.MeshStandardMaterial({ map: sheetTex, roughness: 0.9 }));
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, 0.0765, 0);
  g.add(top);

  const band = rbox(0.64, 0.09, 0.1, 0.014, plastic(0x33629c, { roughness: 0.5 }));
  band.position.set(0, 0.04, -0.44);
  g.add(band);

  // pencil resting beside it
  const pencil = new THREE.Group();
  const bodyCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 10), plastic(0xe8b93f, { roughness: 0.45 }));
  bodyCyl.rotation.z = Math.PI / 2;
  pencil.add(bodyCyl);
  const coneTip = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.1, 10), plastic(0xe4c9a4, { roughness: 0.7 }));
  coneTip.rotation.z = -Math.PI / 2;
  coneTip.position.x = 0.3;
  pencil.add(coneTip);
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.03, 8), plastic(0x33373f, { roughness: 0.5 }));
  lead.rotation.z = -Math.PI / 2;
  lead.position.x = 0.355;
  pencil.add(lead);
  const eraser = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 10), plastic(0xe07a72, { roughness: 0.6 }));
  eraser.rotation.z = Math.PI / 2;
  eraser.position.x = -0.27;
  pencil.add(eraser);
  pencil.position.set(-0.12, 0.024, 0.56);
  pencil.rotation.y = 0.34;
  g.add(pencil);

  shadows(g, true, true);
  top.castShadow = false;
  return g;
}

function buildKeyboard() {
  const g = new THREE.Group();
  const base = rbox(1.28, 0.055, 0.44, 0.024, plastic(0x2c3550, { roughness: 0.42 }));
  base.position.y = 0.028;
  g.add(base);

  const keyMat = plastic(0xf3ead6, { roughness: 0.5 });
  const modMat = plastic(0x8e9cb8, { roughness: 0.5 });
  const unit = 0.084;
  const keyW = unit - 0.008;
  const keyGeo = new RoundedBoxGeometry(keyW, 0.028, keyW, 1, 0.008);

  const rows = [
    { z: -0.145, n: 13, mods: [0, 12] },
    { z: -0.062, n: 13, mods: [0, 12] },
    { z: 0.021, n: 12, mods: [0, 11] },
    { z: 0.104, n: 10, mods: [] },
  ];
  rows.forEach((row) => {
    for (let i = 0; i < row.n; i++) {
      const k = new THREE.Mesh(keyGeo, row.mods.includes(i) ? modMat : keyMat);
      k.position.set((i - (row.n - 1) / 2) * unit, 0.068, row.z);
      g.add(k);
    }
  });

  const space = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.028, keyW, 1, 0.008), modMat);
  space.position.set(0, 0.068, 0.186);
  g.add(space);

  shadows(g, true, true);
  return g;
}

function buildMug() {
  const g = new THREE.Group();
  const ceramic = plastic(0xf6eedd, { roughness: 0.3 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.135, 0.3, 32, 1, true), ceramic);
  body.material.side = THREE.DoubleSide;
  body.position.y = 0.15;
  g.add(body);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.135, 32), ceramic);
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = 0.003;
  g.add(bottom);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.15, 0.055, 32, 1, true), plastic(THEME.blue, { roughness: 0.36 }));
  band.material.side = THREE.DoubleSide;
  band.position.y = 0.205;
  g.add(band);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.137, 32), plastic(0x4a2f22, { roughness: 0.25 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.285;
  g.add(coffee);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.024, 10, 20, Math.PI * 1.25), ceramic);
  handle.position.set(0.155, 0.16, 0);
  handle.rotation.z = -0.35;
  handle.rotation.y = 0;
  g.add(handle);
  shadows(g, true, true);
  return g;
}

function buildPlant() {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.3, 24), plastic(THEME.yellow, { roughness: 0.48 }));
  pot.position.y = 0.15;
  g.add(pot);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 10, 24), plastic(0xe6ae3c, { roughness: 0.45 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.3;
  g.add(rim);
  const soil = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), plastic(0x4a3626, { roughness: 0.9 }));
  soil.rotation.x = -Math.PI / 2;
  soil.position.y = 0.302;
  g.add(soil);

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.105, 0.15, 0, 0.33);
  leafShape.quadraticCurveTo(-0.105, 0.15, 0, 0);
  const leafGeo = new THREE.ExtrudeGeometry(leafShape, {
    depth: 0.016, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006,
    bevelSegments: 2, curveSegments: 8,
  });
  const greens = [0x4f8f4b, 0x69a95c, 0x3f7a41];
  const leaves = [
    [0.0, 0.0, 0.0, 1.15], [0.55, 0.0, -0.35, 1.0], [-0.6, 0.0, 0.3, 0.95],
    [0.2, 0.25, 0.15, 0.9], [-0.25, 0.2, -0.25, 0.85], [0.75, 0.12, 0.1, 0.7],
    [-0.8, 0.1, -0.05, 0.75],
  ];
  leaves.forEach(([rz, ry, tilt, s], i) => {
    const leaf = new THREE.Mesh(leafGeo, plastic(greens[i % 3], { roughness: 0.62 }));
    leaf.position.set(0, 0.3, 0);
    leaf.rotation.set(tilt, ry + i * 0.7, rz);
    leaf.scale.setScalar(s);
    g.add(leaf);
  });
  shadows(g, true, true);
  return g;
}

function buildLamp() {
  const g = new THREE.Group();
  const yellow = plastic(THEME.yellow, { roughness: 0.38 });
  const darkYellow = plastic(0xc9922c, { roughness: 0.44 });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.055, 28), darkYellow);
  base.position.y = 0.028;
  g.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.034, 0.62, 18), yellow);
  stem.position.y = 0.35;
  g.add(stem);

  const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), darkYellow);
  knuckle.position.y = 0.66;
  g.add(knuckle);

  const shade = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.235, 30, 18, 0, Math.PI * 2, 0, Math.PI * 0.52),
    new THREE.MeshStandardMaterial({ color: THEME.yellow, roughness: 0.36, side: THREE.DoubleSide })
  );
  shade.add(dome);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.233, 0.016, 8, 30), darkYellow);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.004;
  shade.add(rim);

  const inner = new THREE.Mesh(
    new THREE.CircleGeometry(0.228, 30),
    new THREE.MeshBasicMaterial({ color: 0xfff1cf, side: THREE.DoubleSide })
  );
  inner.rotation.x = Math.PI / 2;
  inner.position.y = -0.002;
  shade.add(inner);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.062, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0xfffaf0 })
  );
  bulb.position.y = -0.05;
  shade.add(bulb);

  shade.position.set(0, 0.74, 0);
  shade.rotation.set(0.16, 0.3, 0.06);
  g.add(shade);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), darkYellow);
  knob.position.set(0.0, 0.1, 0.19);
  g.add(knob);

  shadows(g, true, true);
  inner.castShadow = false;
  bulb.castShadow = false;
  return g;
}

/* --------------------------------------------------------- photo frame */
function buildPhotoFrame(photoTex, matTex, baseYaw, blobScale = 1) {
  const pivot = new THREE.Group();
  const inner = new THREE.Group();
  pivot.add(inner);

  const frameMat = plastic(0x3f9b8a, { roughness: 0.34 });
  const W = 0.58, H = 0.7, D = 0.055;
  const frame = rbox(W, H, D, 0.028, frameMat);
  frame.position.y = H / 2;
  inner.add(frame);

  const matMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.55),
    new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.8, metalness: 0 })
  );
  matMesh.position.set(0, H / 2 + 0.02, D / 2 + 0.001);
  inner.add(matMesh);

  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.36),
    new THREE.MeshStandardMaterial({ map: photoTex, roughness: 0.62, metalness: 0 })
  );
  photo.position.set(0, H / 2 + 0.058, D / 2 + 0.004);
  inner.add(photo);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.465, 0.555),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.1, roughness: 0.04,
      metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6,
      depthWrite: false,
    })
  );
  glass.position.set(0, H / 2 + 0.02, D / 2 + 0.006);
  inner.add(glass);

  const glint = new THREE.Mesh(
    new THREE.PlaneGeometry(0.045, 0.55),
    new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  glint.position.set(-0.168, H / 2 + 0.02, D / 2 + 0.008);
  glint.rotation.z = -0.52;
  inner.add(glint);

  const glint2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.022, 0.33),
    new THREE.MeshBasicMaterial({
      color: 0xdff3ff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  glint2.position.set(-0.125, H / 2 + 0.02, D / 2 + 0.008);
  glint2.rotation.z = -0.52;
  inner.add(glint2);

  const glassGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.47, 0.56),
    new THREE.MeshBasicMaterial({
      color: 0xbfe4ff, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  glassGlow.position.set(0, H / 2 + 0.02, D / 2 + 0.007);
  inner.add(glassGlow);

  // easel leg
  const leg = rbox(0.05, 0.36, 0.02, 0.01, frameMat);
  leg.position.set(0, 0.24, -0.06);
  leg.rotation.x = 0.42;
  inner.add(leg);

  const hit = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, H + 0.14, 0.2));
  hit.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  hit.position.y = H / 2;
  inner.add(hit);

  shadows(pivot, true, true);
  hit.castShadow = false;
  hit.receiveShadow = false;
  glint.castShadow = false;
  glint2.castShadow = false;
  glassGlow.castShadow = false;
  glass.castShadow = false;
  matMesh.castShadow = false;
  photo.castShadow = false;

  // soft contact shadow that tightens when lifted
  const blobTex = canvasTexture(128, 128, (g, w, h) => {
    const rg = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    rg.addColorStop(0, 'rgba(0,0,0,0.55)');
    rg.addColorStop(0.55, 'rgba(0,0,0,0.25)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, w, h);
  });
  const blob = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.8),
    new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.16, depthWrite: false })
  );
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.004;
  pivot.parent; // blob is added separately by caller

  pivot.rotation.y = baseYaw;
  pivot.rotation.x = -0.24;

  const api = {
    pivot, inner, glint, glint2, glassGlow, glass, hit, blob,
    state: 0,
    yawIdle: baseYaw,
    set(t) {
      api.state = t;
      const ease = t * t * (3 - 2 * t);
      pivot.rotation.x = -0.3 + 0.313 * ease;
      pivot.position.y = 0.3 * ease;
      pivot.rotation.y = api.yawIdle + (api.yawLive - api.yawIdle) * ease;
      inner.scale.setScalar(1 + 0.07 * ease);
      glint.material.opacity = 0.2 * ease;
      glint.position.x = -0.168 + 0.02 * ease;
      glint2.material.opacity = 0.14 * ease;
      glint2.position.x = -0.125 + 0.02 * ease;
      glassGlow.material.opacity = 0.035 * ease;
      blob.material.opacity = 0.16 + 0.12 * ease;
      const bs = blobScale * (1 - 0.42 * ease);
      blob.scale.set(bs, bs, 1);
      glass.material.opacity = 0.1 + 0.1 * ease;
    },
    yawLive: baseYaw,
  };
  api.set(0);
  return api;
}

/* ----------------------------------------------------------- desk scene */
function glowTexture() {
  return canvasTexture(256, 256, (g, w, h) => {
    const rg = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    rg.addColorStop(0, 'rgba(255,255,255,0.0)');
    rg.addColorStop(0.55, 'rgba(255,255,255,0.55)');
    rg.addColorStop(0.84, 'rgba(255,255,255,0.9)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, w, h);
  });
}

function buildDeskScene(renderer, tex) {
  const { scene } = setupWorld(renderer);
  const room = buildRoom(tex.wood);
  scene.add(room);

  const roomGroup = room;
  roomGroup.position.x = 0.45;

  const monitor = buildMonitor(tex.title);
  scene.add(monitor.group);

  const objects = {};
  const glow = glowTexture();
  const add = (id, built, pos, tagOff, ringSize = 0.86, s = 1) => {
    built.group.position.set(pos[0], 0, pos[1]);
    built.group.scale.setScalar(s);
    scene.add(built.group);

    const ring = new THREE.Mesh(
      new THREE.PlaneGeometry(ringSize, ringSize * 0.78),
      new THREE.MeshBasicMaterial({
        map: glow, transparent: true, opacity: 0, depthWrite: false,
        color: new THREE.Color(DOT[id]), blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos[0], 0.006, pos[1] + 0.06);
    ring.renderOrder = 2;
    scene.add(ring);

    objects[id] = {
      id, ...built, baseY: 0, tagOff, ring, s,
      anchor: built.anchor.clone().multiplyScalar(s),
    };
  };

  add('wangchan-dorm', buildDorm(tex.keyTag), [-2.62, -1.0], [96, -86], 1.36, 1.4);
  add('foodqueue', buildFoodQueue(tex.qr), [-1.12, 0.52], [-118, -6], 1.2, 1.4);
  add('repairdesk', buildRepairDesk(tex.phone), [1.76, 0.28], [30, -56], 1.16, 1.36);
  add('barber-booking', buildBarber(tex.barber), [2.96, -0.52], [-14, -74], 0.9, 1.34);
  add('smartqueue', buildSmartQueue(tex.ticket), [0.44, -1.06], [58, -30], 0.9, 1.5);

  const keyboard = buildKeyboard();
  keyboard.position.set(0.56, 0, 1.95);
  keyboard.rotation.y = -0.04;
  keyboard.scale.setScalar(1.08);
  scene.add(keyboard);

  const mouse = buildMouse();
  mouse.position.set(2.62, 0, 2.16);
  mouse.rotation.y = -0.5;
  scene.add(mouse);

  const pad = buildNotepad();
  pad.position.set(1.92, 0, 1.82);
  pad.rotation.y = -0.18;
  scene.add(pad);

  const mug = buildMug();
  mug.position.set(-1.42, 0, 2.02);
  mug.rotation.y = -0.9;
  mug.scale.setScalar(1.15);
  scene.add(mug);

  const plant = buildPlant();
  plant.position.set(-4.12, 0, -1.18);
  plant.rotation.y = 0.5;
  plant.scale.setScalar(1.18);
  scene.add(plant);

  const lamp = buildLamp();
  lamp.position.set(3.66, 0, -2.34);
  lamp.rotation.y = 0.14;
  lamp.scale.setScalar(1.04);
  scene.add(lamp);

  // warm pool from the lamp bulb
  const glowLight = new THREE.PointLight(0xffd8a0, 2.6, 5.2, 2);
  glowLight.position.set(3.5, 0.95, -2.05);
  scene.add(glowLight);

  const frame = buildPhotoFrame(tex.photo, tex.mat, 0.5, 1.65);
  frame.pivot.position.set(-3.0, 0, 1.58);
  frame.pivot.scale.setScalar(1.42);
  frame.yawLive = Math.atan2(HOME_CAM.pos.x - -3.0, HOME_CAM.pos.z - 1.58);
  scene.add(frame.pivot);
  scene.add(frame.blob);
  frame.blob.position.set(-3.0, 0.004, 1.58);

  return { scene, monitor, objects, frame };
}

/* --------------------------------------------------------------- canvas */
function makeTexSet(photo, title, keyTag, qr, phone, barber, ticket, mat) {
  const wood = woodTexture();
  return { photo, title, keyTag, qr, phone, barber, ticket, mat, wood };
}

async function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error('image failed: ' + src));
    img.src = src;
  });
}

async function screenTexture(imagePath, project) {
  const c = document.createElement('canvas');
  c.width = 1280; c.height = 720;
  const g = c.getContext('2d');
  g.fillStyle = '#0d1534'; g.fillRect(0, 0, 1280, 720);

  if (imagePath) {
    const img = await loadImage(imagePath);
    const scale = Math.min(1280 / img.width, 720 / img.height);
    const w = img.width * scale, h = img.height * scale;
    g.drawImage(img, (1280 - w) / 2, (720 - h) / 2, w, h);
  } else {
    // synthetic queue display for SmartQueue (no screenshot in the repo)
    const bg = g.createLinearGradient(0, 0, 1280, 720);
    bg.addColorStop(0, '#10254f'); bg.addColorStop(1, '#173b63');
    g.fillStyle = bg; g.fillRect(0, 0, 1280, 720);
    g.strokeStyle = 'rgba(120,180,220,0.16)'; g.lineWidth = 2;
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(0, 90 + i * 90); g.lineTo(1280, 90 + i * 90); g.stroke(); }
    g.fillStyle = '#4fb9a3';
    g.fillRect(0, 0, 1280, 12);
    g.font = '600 34px Rubik, sans-serif';
    g.fillStyle = '#8fd8c8';
    g.fillText('NOW SERVING', 96, 140);
    g.font = '800 300px Baloo2, sans-serif';
    g.fillStyle = '#ffffff';
    g.fillText('A 017', 90, 430);
    g.fillStyle = '#f0bd4a';
    g.font = '600 40px Rubik, sans-serif';
    g.fillText('SmartQueue · queue display', 96, 540);
    g.fillStyle = 'rgba(255,255,255,0.55)';
    g.font = '400 28px Rubik, sans-serif';
    g.fillText('Illustration — no screenshot in the repository', 96, 610);
    ['A 018', 'A 019', 'A 021'].forEach((t, i) => {
      g.fillStyle = 'rgba(255,255,255,0.08)';
      roundRect(g, 96 + i * 240, 640, 200, 54, 10); g.fill();
      g.fillStyle = 'rgba(220,235,255,0.55)';
      g.font = '600 28px Rubik, sans-serif';
      g.fillText(t, 130 + i * 240, 676);
    });
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}


/* ------------------------------------------------------------- home view */
const HOME_CAM = { pos: new THREE.Vector3(1.55, 2.92, 8.45), target: new THREE.Vector3(-0.15, 0.92, -0.5), fov: 35 };
const MOBILE_CAM = { pos: new THREE.Vector3(0.4, 2.62, 8.6), target: new THREE.Vector3(-0.3, 1.0, -0.62), fov: 42 };
// Object floor positions (x, z) match buildDeskScene. The monitor stands at x -0.62, z -1.66.
const FOCUS_AT = {
  'wangchan-dorm': [-2.62, -1.0],
  foodqueue: [-1.12, 0.52],
  repairdesk: [1.76, 0.28],
  'barber-booking': [2.96, -0.52],
  smartqueue: [0.44, -1.06],
};
// The camera looks along the home direction at the box that holds the object and the monitor (which shows the
// project screenshot), backed off until that box fits the width the panel leaves free.
const HOME_DIR = HOME_CAM.pos.clone().sub(HOME_CAM.target).normalize();
const FOCUS_FOV = 34;
const HOME_SPAN = 8.4; // world width of the desk composition at the home camera
function focusPreset(id, freeAspect) {
  const [ox, oz] = FOCUS_AT[id];
  const left = Math.min(ox - 0.9, -0.62 - 1.6);
  const right = Math.max(ox + 0.9, -0.62 + 1.6);
  const target = new THREE.Vector3((left + right) / 2, 0.95, oz * 0.6 + -1.66 * 0.4);
  const visibleWidthPerDist = 2 * Math.tan((FOCUS_FOV * Math.PI) / 360) * freeAspect;
  const dist = Math.min(20, Math.max(5.5, (right - left + 1.0) / visibleWidthPerDist));
  return { pos: target.clone().addScaledVector(HOME_DIR, dist), target, fov: FOCUS_FOV };
}

const isMobile = () => matchMedia('(max-width: 760px)').matches;

/* ---------------------------------------------------------------- panel */
const panel = document.getElementById('panel');
const panelBody = document.getElementById('panel-body');

function renderPanel(p, { onClose, onPick }) {
  panelBody.replaceChildren();

  const close = el('button', 'xclose', 'Close');
  close.type = 'button';
  close.setAttribute('aria-label', `Close ${p.name} details`);
  close.addEventListener('click', onClose);
  panelBody.appendChild(close);

  const title = el('h2', 'pname', p.name);
  title.id = 'panel-title';
  title.tabIndex = -1;
  panelBody.appendChild(title);
  panelBody.appendChild(el('p', 'ptag', p.tagline));

  // Actions come first: a recruiter or client should not have to scroll the panel to reach the repo or the demo.
  const links = el('div', 'links');
  if (p.demo) {
    const demo = el('a', 'btn', p.demoLabel || 'Open live demo');
    demo.href = p.demo; demo.target = '_blank'; demo.rel = 'noopener';
    links.appendChild(demo);
  }
  const gh = el('a', p.demo ? 'btn ghost' : 'btn', 'GitHub repository');
  gh.href = p.repo; gh.target = '_blank'; gh.rel = 'noopener';
  links.appendChild(gh);
  panelBody.appendChild(links);
  if (!p.demo) {
    panelBody.appendChild(el('p', 'synthetic', 'No hosted demo. Clone the repo and run it locally.'));
  }

  const sum = el('div', 'psum');
  p.summary.forEach((s) => sum.appendChild(el('p', null, s)));
  panelBody.appendChild(sum);

  if (!p.image) {
    panelBody.appendChild(el('p', 'synthetic', 'The monitor shows a synthetic illustration: this project has no screenshot in its repository.'));
  }

  panelBody.appendChild(el('h3', 'sect', 'What it does'));
  const hl = el('ul', 'hl');
  p.highlights.forEach((h) => hl.appendChild(el('li', null, h)));
  panelBody.appendChild(hl);

  panelBody.appendChild(el('h3', 'sect', 'Stack'));
  const stack = el('ul', 'stack');
  p.stack.forEach((s) => stack.appendChild(el('li', null, s)));
  panelBody.appendChild(stack);

  const i = PROJECTS.indexOf(p);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const nav = el('div', 'pnav');
  [[prev, 'Previous object', ''], [next, 'Next object', 'nx']].forEach(([q, label, cls]) => {
    const b = el('button', cls);
    b.type = 'button';
    b.appendChild(el('span', 'k', label));
    b.appendChild(document.createTextNode(q.name));
    b.addEventListener('click', () => onPick(q.slug));
    nav.appendChild(b);
  });
  panelBody.appendChild(nav);
  panel.scrollTop = 0;
}

/* ----------------------------------------------------------------- home */
async function setupHome() {
  const canvas = document.getElementById('gl');
  const home = document.getElementById('view-home');
  const backBtn = document.getElementById('back');
  const renderer = makeRenderer(canvas);
  const [photo, title, keyTag, qr, phone, barber, ticket, mat] = await Promise.all([
    loadImage('assets/profile.jpg'),
    Promise.resolve(titleScreenTexture()),
    Promise.resolve(keyTagTexture()),
    Promise.resolve(qrCardTexture()),
    Promise.resolve(phoneScreenTexture()),
    Promise.resolve(barberTexture()),
    Promise.resolve(ticketTexture()),
    Promise.resolve(matTexture()),
  ]);
  const photoTex = new THREE.Texture(photo);
  photoTex.colorSpace = THREE.SRGBColorSpace;
  photoTex.needsUpdate = true;

  const tex = makeTexSet(photoTex, title, keyTag, qr, phone, barber, ticket, mat);
  const world = buildDeskScene(renderer, tex);
  const { scene, monitor, objects, frame } = world;

  const cam = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
  const state = {
    target: new THREE.Vector3(),
    tween: null,
    focus: null,
    shift: 0, // 0..1: how far the view is pushed left to make room for the panel
    frameLocked: false,
  };
  let dirty = true;
  let opener = null;

  // Smaller windows than the design size (tight 0..0.5): the desk shifts right by homeDx px and backs off a little so it clears the title column.
  let tight = 0, homeDx = 0;
  // Keeps the original composition wherever the window is wide enough (the desk spans about 85% of an 8.4-unit-wide view); narrower aspects back the camera off so the desk is never cropped.
  const homePreset = () => {
    if (isMobile()) return MOBILE_CAM;
    const baseDist = HOME_CAM.pos.distanceTo(HOME_CAM.target);
    const perDist = 2 * Math.tan((HOME_CAM.fov * Math.PI) / 360);
    const dist = Math.max(baseDist, HOME_SPAN / (perDist * (canvas.clientWidth / canvas.clientHeight))) * (1 + 0.2 * tight);
    if (dist <= baseDist) return HOME_CAM;
    return { pos: HOME_CAM.target.clone().addScaledVector(HOME_DIR, dist), target: HOME_CAM.target, fov: HOME_CAM.fov };
  };
  const focusCam = (id) => focusPreset(id, Math.max(0.6, (canvas.clientWidth - panel.offsetWidth) / canvas.clientHeight));
  const applyCam = (p) => {
    cam.fov = p.fov;
    cam.position.copy(p.pos);
    state.target.copy(p.target);
    cam.lookAt(state.target);
    cam.updateProjectionMatrix();
  };

  // shifts the rendered image: left by half the panel width so the focused object lands in the free area; right by homeDx at home so the desk clears the title column in small windows
  const applyShift = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const ox = isMobile() ? 0 : state.shift * (panel.offsetWidth / 2) - homeDx * (1 - state.shift);
    if (Math.abs(ox) > 0.5) cam.setViewOffset(w, h, ox, 0, w, h);
    else cam.clearViewOffset();
  };

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const fit = isMobile() ? 1 : Math.min(w / 1440, h / 900); // 1 = the layout the page was designed at
    tight = Math.min(0.5, Math.max(0, 1 - fit));
    homeDx = tight * 150;
    home.classList.toggle('tight', tight > 0.05);
    home.style.setProperty('--s', Math.min(1, Math.max(0.82, fit)).toFixed(3)); // title block follows the desk scale; floor keeps the 16.5px lede at 13.5px
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    if (!state.tween) {
      applyCam(state.focus && !isMobile() ? focusCam(state.focus) : homePreset());
    }
    applyShift();
    dirty = true;
  };

  /* tags + leaders */
  const tagHost = document.getElementById('tags');
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'leaders');
  svg.setAttribute('aria-hidden', 'true');
  tagHost.appendChild(svg);
  const tagEls = {};
  const leaderEls = {};
  const dotEls = {};

  PROJECT_IDS.forEach((id) => {
    const p = PROJECTS.find((x) => x.slug === id);
    const a = document.createElement('a');
    a.className = 'tag';
    a.href = `#${id}`;
    a.dataset.id = id;
    a.style.setProperty('--c', DOT[id]);
    a.appendChild(el('span', 'dot'));
    a.appendChild(document.createTextNode(p.name));
    tagHost.appendChild(a);
    tagEls[id] = a;

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('stroke', 'rgba(253,251,244,0.55)');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
    leaderEls[id] = line;

    const dotc = document.createElementNS(svgNS, 'circle');
    dotc.setAttribute('r', '3.2');
    dotc.setAttribute('fill', 'rgba(253,251,244,0.9)');
    svg.appendChild(dotc);
    dotEls[id] = dotc;
  });

  function layoutTags() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const placed = [];
    PROJECT_IDS.forEach((id) => {
      const o = objects[id];
      const a = o.group.position.clone().add(o.anchor);
      const v = a.clone().project(cam);
      let x = (v.x * 0.5 + 0.5) * w + o.tagOff[0];
      let y = (-v.y * 0.5 + 0.5) * h + o.tagOff[1];
      const t = tagEls[id];
      if (!o.tw) { o.tw = t.offsetWidth || 120; o.th = t.offsetHeight || 32; }
      const tw = o.tw, th = o.th;
      x = Math.max(tw / 2 + 14, Math.min(w - tw / 2 - 14, x));
      y = Math.max(th / 2 + 14, Math.min(h - th / 2 - 14, y));

      // keep chips from overlapping each other
      let guard = 0;
      while (guard++ < 12 && placed.some((r) => Math.abs(r.x - x) < (r.w + tw) / 2 + 6 && Math.abs(r.y - y) < (r.h + th) / 2 + 6)) {
        y -= th + 8;
        if (y < th / 2 + 12) { y += th + 8; break; }
      }
      placed.push({ x, y, w: tw, h: th });
      t.style.left = x + 'px';
      t.style.top = y + 'px';

      const startX = (v.x * 0.5 + 0.5) * w, startY = (-v.y * 0.5 + 0.5) * h;
      const dx = x - startX, dy = y - startY;
      const len = Math.hypot(dx, dy) || 1;
      const line = leaderEls[id];
      line.setAttribute('x1', startX.toFixed(1));
      line.setAttribute('y1', startY.toFixed(1));
      line.setAttribute('x2', (x - (dx / len) * 22).toFixed(1));
      line.setAttribute('y2', (y - (dy / len) * 22).toFixed(1));
      dotEls[id].setAttribute('cx', startX.toFixed(1));
      dotEls[id].setAttribute('cy', startY.toFixed(1));
    });
  }

  /* monitor content */
  const homeScreenTex = monitor.screenMat.map;
  const screenCache = new Map(); // slug -> Promise<Texture>, so idle warm-up and a click never build the same texture twice
  const screenFor = (p) => {
    if (!screenCache.has(p.slug)) screenCache.set(p.slug, screenTexture(p.image, p));
    return screenCache.get(p.slug);
  };
  async function setScreen(slug) {
    if (!slug) { monitor.screenMat.map = homeScreenTex; monitor.screenMat.needsUpdate = true; dirty = true; return; }
    const tex = await screenFor(PROJECTS.find((x) => x.slug === slug));
    if (state.focus === slug) {
      monitor.screenMat.map = tex;
      monitor.screenMat.needsUpdate = true;
      dirty = true;
    }
  }

  /* camera */
  function flyTo(preset, shift, ms = 850) {
    if (PREFERS_REDUCED) {
      applyCam(preset);
      state.shift = shift;
      state.tween = null;
      applyShift();
      dirty = true;
      return;
    }
    state.tween = {
      t0: performance.now(), ms,
      fromPos: cam.position.clone(), fromTarget: state.target.clone(), fromFov: cam.fov, fromShift: state.shift,
      toPos: preset.pos.clone(), toTarget: preset.target.clone(), toFov: preset.fov, toShift: shift,
    };
  }

  /* open / close a project */
  function focusProject(slug, { push = true } = {}) {
    const p = PROJECTS.find((x) => x.slug === slug);
    if (!p) return;
    const wasOpen = state.focus !== null;
    if (!wasOpen) opener = document.activeElement;
    state.focus = slug;
    if (isMobile()) { state.shift = 0; } else { flyTo(focusCam(slug), 1); }
    setScreen(slug);
    renderPanel(p, { onClose: () => resetView(), onPick: (s) => focusProject(s, { push: false }) });
    panel.inert = false;
    panel.classList.add('open');
    home.classList.add('focused');
    backBtn.hidden = false;
    tagHost.querySelectorAll('.tag').forEach((t) => t.classList.toggle('is-open', t.dataset.id === slug));
    objectList.forEach((o) => { o.ring.material.opacity = o.id === slug ? 0.55 : 0; });
    document.title = `${p.name} — Hirun Kongpetch`;
    if (location.hash.slice(1) !== slug) {
      history[push && !wasOpen ? 'pushState' : 'replaceState'](null, '', `#${slug}`);
    }
    document.getElementById('panel-title').focus({ preventScroll: true });
    dirty = true;
  }

  function resetView({ push = true } = {}) {
    if (!state.focus) return;
    state.focus = null;
    flyTo(homePreset(), 0);
    setScreen(null);
    panel.classList.remove('open');
    panel.inert = true;
    home.classList.remove('focused');
    backBtn.hidden = true;
    tagHost.querySelectorAll('.tag').forEach((t) => t.classList.remove('is-open'));
    objectList.forEach((o) => { if (o.id !== hoverId) o.ring.material.opacity = 0; });
    document.title = 'Hirun Kongpetch — full-stack developer';
    if (push && location.hash) history.pushState(null, '', location.pathname + location.search);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    opener = null;
    dirty = true;
  }

  function syncFromHash() {
    const slug = location.hash.slice(1);
    if (PROJECTS.some((p) => p.slug === slug)) focusProject(slug, { push: false });
    else resetView({ push: false });
  }

  /* hover + picking */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const objectList = Object.values(objects);
  let hoverId = null;
  let frameHover = false;

  function setHot(id) {
    if (hoverId === id) return;
    if (hoverId && objects[hoverId]) {
      const prev = objects[hoverId];
      prev.group.position.y = 0;
      prev.group.scale.setScalar(prev.s);
      prev.ring.material.opacity = state.focus === hoverId ? 0.55 : 0;
      tagEls[hoverId].classList.remove('is-hot');
    }
    hoverId = id;
    if (id && objects[id]) {
      const cur = objects[id];
      cur.group.position.y = 0.05;
      cur.group.scale.setScalar(cur.s * 1.04);
      cur.ring.material.opacity = 0.55;
      tagEls[id].classList.add('is-hot');
    }
    dirty = true;
    renderer.shadowMap.needsUpdate = true; // the lifted object moved, so its shadow must follow
  }

  function pickAt(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointer, cam);
    const hits = raycaster.intersectObjects([...objectList.map((o) => o.group), frame.hit], true);
    for (const h of hits) {
      if (h.object === frame.hit) return { id: null, onFrame: true };
      let o = h.object;
      while (o && !objectList.some((x) => x.group === o)) o = o.parent;
      if (o) return { id: objectList.find((x) => x.group === o).id, onFrame: false };
    }
    return { id: null, onFrame: false };
  }

  let moveEvt = null; // latest pointer sample, consumed once by the loop
  let lastPtr = null;
  canvas.addEventListener('pointermove', (e) => { lastPtr = moveEvt = e; });
  canvas.addEventListener('pointerleave', () => { lastPtr = moveEvt = null; setHot(null); frameHover = false; canvas.style.cursor = ''; });
  canvas.addEventListener('click', (e) => {
    const { id, onFrame } = pickAt(e.clientX, e.clientY);
    if (id) focusProject(id);
    else if (onFrame) { state.frameLocked = !state.frameLocked; frame.set(state.frameLocked ? 1 : 0); renderer.shadowMap.needsUpdate = true; dirty = true; }
  });

  tagHost.addEventListener('click', (e) => {
    const a = e.target.closest('.tag');
    if (!a) return;
    e.preventDefault();
    focusProject(a.dataset.id);
  });
  tagHost.addEventListener('mouseover', (e) => { const a = e.target.closest('.tag'); if (a) setHot(a.dataset.id); });
  tagHost.addEventListener('mouseout', (e) => {
    const a = e.target.closest('.tag');
    if (a && !a.contains(e.relatedTarget)) setHot(null);
  });

  backBtn.addEventListener('click', () => resetView());
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.focus) resetView(); });
  addEventListener('popstate', syncFromHash);
  addEventListener('resize', resize);

  /* mobile list opens the same panel as a bottom sheet */
  document.getElementById('m-list').addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    focusProject(a.dataset.id);
  });

  /* render loop: draws only when something changed */
  let last = performance.now();
  let lastDraw = 0;
  let slow = 0;
  let pr = renderer.getPixelRatio();
  const MIN_PR = 0.75;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (state.tween) {
      const tw = state.tween;
      const t = Math.min(1, (now - tw.t0) / tw.ms);
      const k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      cam.position.lerpVectors(tw.fromPos, tw.toPos, k);
      state.target.lerpVectors(tw.fromTarget, tw.toTarget, k);
      cam.fov = tw.fromFov + (tw.toFov - tw.fromFov) * k;
      state.shift = tw.fromShift + (tw.toShift - tw.fromShift) * k;
      cam.lookAt(state.target);
      cam.updateProjectionMatrix();
      applyShift();
      if (t >= 1) { state.tween = null; moveEvt = lastPtr; } // objects slid under a resting pointer: re-pick once
      dirty = true;
    }

    if (moveEvt) {
      const { id, onFrame } = pickAt(moveEvt.clientX, moveEvt.clientY);
      moveEvt = null;
      setHot(id);
      frameHover = onFrame;
      canvas.style.cursor = onFrame || id ? 'pointer' : '';
    }

    const wantFrame = frameHover || state.frameLocked ? 1 : 0;
    if (Math.abs(frame.state - wantFrame) > 0.001) {
      const next = frame.state + (wantFrame - frame.state) * Math.min(1, dt * 9);
      frame.set(next);
      if (!wantFrame && Math.abs(next) < 0.02) {
        frame.set(0);
        frame.pivot.rotation.y = frame.yawIdle;
      } else if (wantFrame) {
        frame.pivot.rotation.y = frame.yawIdle + (frame.yawLive - frame.yawIdle) * next;
      }
      renderer.shadowMap.needsUpdate = true;
      dirty = true;
    }

    if (dirty) {
      renderer.render(scene, cam);
      layoutTags();
      dirty = false;
      // dynamic resolution: when frames keep running long (weak GPU, high-DPI screen), step the pixel ratio down
      if (lastDraw && now - lastDraw < 80) {
        slow = now - lastDraw > 26 ? slow + 1 : Math.max(0, slow - 1);
        if (slow > 20 && pr > MIN_PR) {
          pr = Math.max(MIN_PR, pr - 0.25);
          renderer.setPixelRatio(pr);
          resize();
          slow = 0;
        }
      }
      lastDraw = now;
    }
    requestAnimationFrame(loop);
  };

  applyCam(homePreset());
  resize();
  renderer.shadowMap.needsUpdate = true; // shadows are baked once; see makeRenderer
  await renderer.compileAsync(scene, cam); // link shaders off the main thread instead of stalling the first frame
  home.classList.add('ready');
  if (location.hash) syncFromHash();
  requestAnimationFrame(loop);

  // warm the monitor textures while the page is idle so the first click does not decode and upload an image mid-flight
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 300));
  const warm = (i) => {
    if (i >= PROJECTS.length) return;
    idle(async () => {
      const tex = await screenFor(PROJECTS[i]);
      renderer.initTexture(tex);
      warm(i + 1);
    });
  };
  warm(0);
}

/* ---------------------------------------------------------- mobile list */
function buildMobileList() {
  const host = document.getElementById('m-list');
  PROJECTS.forEach((p) => {
    const li = el('li');
    const a = el('a');
    a.href = `#${p.slug}`;
    a.dataset.id = p.slug;
    a.style.setProperty('--c', DOT[p.slug] || '#f0bd4a');
    const txt = el('span', 'txt');
    txt.appendChild(el('span', 'n', p.name));
    txt.appendChild(el('span', 'd', p.tagline));
    a.appendChild(el('span', 'dot'));
    a.appendChild(txt);
    li.appendChild(a);
    host.appendChild(li);
  });
}

/* ----------------------------------------------------------------- boot */
async function boot() {
  await document.fonts.load('800 100px Baloo2');
  await document.fonts.load('600 30px Rubik');
  await document.fonts.ready;
  buildMobileList();
  await setupHome();
}

boot().catch((err) => {
  console.error(err);
  document.getElementById('gl-error').hidden = false;
});
