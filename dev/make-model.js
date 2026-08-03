// Generates a minimal valid GLB (glTF 2.0 binary) used by the Playwright smoke
// test: an orange cube named Box_1 sitting on a floor named Floor_1, placed in
// the positive quadrant so the card's default auto-camera frames it.
// Pure Node — no dependencies — so CI can generate the fixture without gltfpack.
const fs = require('fs');
const path = require('path');

const P = [];
const N = [];
const I = [];
const faces = [
  { n: [0, 0, 1], v: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]] },
  { n: [0, 0, -1], v: [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]] },
  { n: [1, 0, 0], v: [[0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]] },
  { n: [-1, 0, 0], v: [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]] },
  { n: [0, 1, 0], v: [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]] },
  { n: [0, -1, 0], v: [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]] },
];
faces.forEach((f, fi) => {
  const base = fi * 4;
  f.v.forEach((v) => {
    P.push(...v);
    N.push(...f.n);
  });
  I.push(base, base + 1, base + 2, base, base + 2, base + 3);
});

const pos = Buffer.from(new Float32Array(P).buffer);
const nor = Buffer.from(new Float32Array(N).buffer);
let idx = Buffer.from(new Uint16Array(I).buffer);
if (idx.length % 4 !== 0) idx = Buffer.concat([idx, Buffer.alloc(4 - (idx.length % 4))]);

const bin = Buffer.concat([pos, nor, idx]);

const json = {
  asset: { version: '2.0', generator: 'hass-3d-floorplan test harness' },
  scene: 0,
  scenes: [{ nodes: [0, 1] }],
  nodes: [
    { mesh: 0, name: 'Box_1', translation: [3, 0.55, 3] },
    { mesh: 0, name: 'Floor_1', scale: [6, 0.1, 6], translation: [3, -0.05, 3] },
  ],
  meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
  materials: [
    { pbrMetallicRoughness: { baseColorFactor: [0.8, 0.4, 0.2, 1], metallicFactor: 0.1, roughnessFactor: 0.8 } },
  ],
  buffers: [{ byteLength: bin.length }],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: pos.length, target: 34962 },
    { buffer: 0, byteOffset: pos.length, byteLength: nor.length, target: 34962 },
    { buffer: 0, byteOffset: pos.length + nor.length, byteLength: I.length * 2, target: 34963 },
  ],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 24, type: 'VEC3', min: [-0.5, -0.5, -0.5], max: [0.5, 0.5, 0.5] },
    { bufferView: 1, componentType: 5126, count: 24, type: 'VEC3' },
    { bufferView: 2, componentType: 5123, count: 36, type: 'SCALAR' },
  ],
};

let jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
if (jsonBuf.length % 4 !== 0) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(4 - (jsonBuf.length % 4), 0x20)]);

const total = 12 + 8 + jsonBuf.length + 8 + bin.length;
const out = Buffer.alloc(total);
let o = 0;
out.writeUInt32LE(0x46546c67, o); o += 4; // glTF
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(total, o); o += 4;
out.writeUInt32LE(jsonBuf.length, o); o += 4;
out.writeUInt32LE(0x4e4f534a, o); o += 4; // JSON
jsonBuf.copy(out, o); o += jsonBuf.length;
out.writeUInt32LE(bin.length, o); o += 4;
out.writeUInt32LE(0x004e4942, o); o += 4; // BIN
bin.copy(out, o);

const dest = path.join(__dirname, 'models', 'cube.glb');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log('Wrote ' + dest + ' (' + total + ' bytes)');
