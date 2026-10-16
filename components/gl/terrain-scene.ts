import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   TERRAIN SCENE
   An Endfield-style 3D topographical "data city": 8,640
   instanced columns whose heights, elevation contour rings,
   wireframe cap edges, cursor ripples, and radar sweeps are
   computed on the GPU.
   ──────────────────────────────────────────────────────────── */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform float uCell;
uniform vec2 uMouse;
uniform float uMouseAmp;
attribute vec3 aData; // x, z, rand
varying vec3 vN;
varying vec2 vUv;
varying float vH;
varying float vWorldY;
varying float vFrac;
varying float vRand;
varying float vDist;
varying float vScan;
${NOISE}
void main(){
  vec2 cell = aData.xy;
  float n  = snoise(vec3(cell * 0.052, uTime * 0.075));
  float n2 = snoise(vec3(cell * 0.16, uTime * 0.12 + 9.0));
  // Terraced + organic topographical heightfield
  float rawH = pow(max(n * 0.52 + 0.48, 0.0), 2.0) * 7.8 + n2 * 0.65 + 0.35;
  float terraced = floor(rawH * 3.0) / 3.0;
  float h = mix(rawH, terraced, 0.45);

  // Sculpted central valley with flanking mountain ridges
  h *= mix(0.38, 1.15, smoothstep(4.0, 20.0, abs(cell.x) + max(cell.y, 0.0) * 0.35));

  float md = distance(cell, uMouse);
  h += exp(-md * 0.2) * (sin(md * 1.1 - uTime * 4.5) * 0.5 + 0.5) * 3.6 * uMouseAmp;

  float d0 = length(cell);
  float intro = clamp(uIntro * 2.4 - d0 * 0.018 - aData.z * 0.2, 0.0, 1.0);
  intro = 1.0 - pow(1.0 - intro, 3.0);
  h = max(h * intro, 0.08);

  vec3 p = position;
  vFrac = p.y;
  p.y *= h;
  p.xz *= uCell;
  vec3 world = vec3(p.x + cell.x, p.y, p.z + cell.y);

  // Dual topographical sweep: Z-axis linear sweep + radial pulse
  float scanZ = mod(uTime * 10.0, 130.0) - 65.0;
  float pulseR = mod(uTime * 12.0, 75.0);
  vScan = exp(-abs(cell.y - scanZ) * 0.42) + exp(-abs(d0 - pulseR) * 0.35) * 0.55;

  vN = normal;
  vUv = uv;
  vH = h;
  vWorldY = world.y;
  vRand = aData.z;
  vec4 mv = modelViewMatrix * vec4(world, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uBg;
uniform vec3 uSignal;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vN;
varying vec2 vUv;
varying float vH;
varying float vWorldY;
varying float vFrac;
varying float vRand;
varying float vDist;
varying float vScan;
void main(){
  vec3 n = normalize(vN);
  float top = step(0.5, n.y);
  float side = abs(n.x) * 0.65 + abs(n.z) * 0.35;

  // Higher-contrast industrial slate for sides and caps
  vec3 sideCol = vec3(0.13, 0.14, 0.16) * (0.65 + side) * mix(0.25, 1.0, vFrac);
  vec3 topCol  = vec3(0.24, 0.25, 0.28) * (0.55 + vH * 0.12);
  vec3 col = mix(sideCol, topCol, top);

  // Topographical elevation contour lines along the column sides
  float contour = smoothstep(0.90, 0.97, fract(vWorldY * 1.25));
  col += (1.0 - top) * contour * mix(vec3(0.32, 0.34, 0.38), uSignal, smoothstep(2.5, 6.0, vH)) * 0.42;

  // Machined wireframe rim on every column cap
  float e = max(max(step(0.89, vUv.x), step(vUv.x, 0.11)), max(step(0.89, vUv.y), step(vUv.y, 0.11)));
  vec3 rimCol = mix(vec3(0.45, 0.47, 0.50), uSignal, smoothstep(2.6, 5.8, vH));
  col += top * e * rimCol * 0.55;

  // Signal-yellow beacon columns
  float hot = step(0.972, vRand) * (0.55 + 0.45 * sin(uTime * 2.8 + vRand * 80.0));
  col = mix(col, uSignal, hot * (top * 0.95 + (1.0 - top) * vFrac * 0.65));

  // Alert-orange tactical pings
  float alert = step(0.994, vRand) * step(0.45, fract(uTime * 0.4 + vRand * 13.0));
  col = mix(col, vec3(1.0, 0.29, 0.11), alert * (top + (1.0 - top) * vFrac * 0.5));

  // Topographical scanning sweep
  col += uSignal * vScan * (top * 0.65 + (1.0 - top) * vFrac * 0.22);

  float fog = smoothstep(uFogNear, uFogFar, vDist);
  col = mix(col, uBg, fog);
  gl_FragColor = vec4(col, 1.0);
}`;

const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
varying float vA;
void main(){
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.25 + aSeed * 0.6), 14.0);
  p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPx * (1.0 + aSeed * 2.0) * (14.0 / -mv.z);
  vA = (1.0 - smoothstep(20.0, 55.0, -mv.z)) * (0.25 + aSeed * 0.75) * smoothstep(0.0, 2.0, p.y) * (1.0 - smoothstep(10.0, 14.0, p.y));
  gl_Position = projectionMatrix * mv;
}`;

const DUST_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  if (max(abs(c.x), abs(c.y)) > 0.5) discard; // square particles — industrial, not bokeh
  gl_FragColor = vec4(uColor, vA * 0.85);
}`;

export class TerrainScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private material: THREE.ShaderMaterial;
  private dustMat: THREE.ShaderMaterial;
  private group = new THREE.Group();
  private raycaster = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private ndc = new THREE.Vector2(0, 0);
  private ndcSmooth = new THREE.Vector2(0, 0);
  private hit = new THREE.Vector3();
  private clock = new THREE.Clock();
  private disposed = false;
  private timeScale: number;

  public intro = { value: 0.35 };
  public scroll = 0;
  private scrollSmooth = 0;

  constructor(private canvas: HTMLCanvasElement, opts: { reduced?: boolean } = {}) {
    this.timeScale = opts.reduced ? 0.15 : 1;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    const bg = new THREE.Color("#0A0A0B");
    this.renderer.setClearColor(bg, 1);

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);

    const COLS = 120;
    const ROWS = 72;
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.setAttribute("position", box.getAttribute("position"));
    geo.setAttribute("normal", box.getAttribute("normal"));
    geo.setAttribute("uv", box.getAttribute("uv"));
    const data = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        data[i++] = c - COLS / 2;
        data[i++] = r - ROWS * 0.72;
        data[i++] = Math.random();
      }
    }
    geo.setAttribute("aData", new THREE.InstancedBufferAttribute(data, 3));
    geo.instanceCount = COLS * ROWS;

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uIntro: { value: 0.35 },
        uCell: { value: 0.82 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uMouseAmp: { value: 0 },
        uBg: { value: bg },
        uSignal: { value: new THREE.Color("#FFE100") },
        uFogNear: { value: 18 },
        uFogFar: { value: 68 },
      },
    });
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.frustumCulled = false;
    this.group.add(mesh);

    // floating square dust
    const DUST = 700;
    const dPos = new Float32Array(DUST * 3);
    const dSeed = new Float32Array(DUST);
    for (let k = 0; k < DUST; k++) {
      dPos[k * 3] = (Math.random() - 0.5) * 90;
      dPos[k * 3 + 1] = Math.random() * 14;
      dPos[k * 3 + 2] = -Math.random() * 50 + 12;
      dSeed[k] = Math.random();
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dGeo.setAttribute("aSeed", new THREE.BufferAttribute(dSeed, 1));
    this.dustMat = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPx: { value: 1.8 * this.renderer.getPixelRatio() },
        uColor: { value: new THREE.Color("#FFE100") },
      },
    });
    const dust = new THREE.Points(dGeo, this.dustMat);
    dust.frustumCulled = false;
    this.group.add(dust);

    this.scene.add(this.group);
    this.resize();
  }

  setPointer(x: number, y: number) {
    this.ndc.set(x, y);
  }

  resize() {
    const { clientWidth: w, clientHeight: h } =
      this.canvas.parentElement ?? this.canvas;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 1 ? 52 : 36;
    this.camera.updateProjectionMatrix();
  }

  render = () => {
    if (this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const u = this.material.uniforms;
    u.uTime.value += dt * this.timeScale;
    u.uIntro.value = this.intro.value;
    this.dustMat.uniforms.uTime.value = u.uTime.value;

    this.ndcSmooth.lerp(this.ndc, 0.06);
    this.scrollSmooth += (this.scroll - this.scrollSmooth) * 0.12;
    const s = this.scrollSmooth;

    // camera choreography: elevated tactical overlook → diving into the topographical valley on scroll
    const cx = this.ndcSmooth.x * 2.5;
    const cy = 9.5 - s * 5.2 + this.ndcSmooth.y * 0.9;
    const cz = 26 - s * 16;
    this.camera.position.set(cx, cy, cz);
    this.camera.lookAt(cx * 0.3, 1.0 - s * 0.5, -8 - s * 6);
    this.group.rotation.y = this.ndcSmooth.x * 0.06;

    // project pointer onto ground for the ripple
    this.raycaster.setFromCamera(this.ndc, this.camera);
    if (this.raycaster.ray.intersectPlane(this.plane, this.hit)) {
      const m = u.uMouse.value as THREE.Vector2;
      m.x += (this.hit.x - m.x) * 0.12;
      m.y += (this.hit.z - m.y) * 0.12;
      u.uMouseAmp.value += (1 - u.uMouseAmp.value) * 0.06;
    }

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
    this.renderer.dispose();
  }
}
