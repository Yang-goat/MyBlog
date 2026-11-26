const TAU = Math.PI * 2;
type Vector = [number, number, number];

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aTangent;
attribute vec2 aSurface;
uniform vec3 uPose;
uniform float uAspect;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec2 vSurface;

vec3 rotateModel(vec3 p) {
  vec3 c = cos(uPose), s = sin(uPose);
  p.yz = vec2(c.x * p.y - s.x * p.z, s.x * p.y + c.x * p.z);
  p.xz = vec2(c.y * p.x + s.y * p.z, -s.y * p.x + c.y * p.z);
  p.xy = vec2(c.z * p.x - s.z * p.y, s.z * p.x + c.z * p.y);
  return p;
}
void main() {
  vec3 p = rotateModel(aPosition);
  vPosition = p;
  vNormal = rotateModel(aNormal);
  vTangent = rotateModel(aTangent);
  vSurface = aSurface;
  vec2 framed = p.xy * (1.0 + p.z * 0.042) + vec2(-0.06, 0.15);
  float scale = min(uAspect / 3.85, 1.0 / 3.38);
  gl_Position = vec4(framed * vec2(scale / uAspect, scale), -p.z * 0.15, 1.0);
}`;

const fragmentSource = `
precision highp float;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec2 vSurface;
uniform float uResolution;
uniform sampler2D uLights;

vec3 studio(vec3 ray) {
  float h = dot(ray, vec3(0.17, 1.0, 0.0));
  float side = dot(ray, vec3(1.0, 0.13, -0.30));
  vec4 overhead = texture2D(uLights, vec2(0.5 + h * 0.4, 0.25));
  vec3 edges = texture2D(uLights, vec2(0.5 + side * 0.4, 0.75)).rgb;
  return overhead.rgb * 2.0 + edges
       + vec3(0.88, 0.50, 0.28) * overhead.a * smoothstep(0.22, 0.81, ray.x);
}
void main() {
  vec3 normal = normalize(vNormal), tangent = normalize(vTangent);
  float phase = vSurface.x * 6.2831853 * 166.0;
  float detail = smoothstep(180.0, 650.0, uResolution);
  normal = normalize(normal + tangent * (0.010 + 0.022 * detail) * sin(phase));
  vec3 eye = normalize(vec3(-vPosition.xy * 0.045, 1.0));
  float rim = pow(1.0 - max(0.0, dot(normal, eye)), 2.5);
  vec3 ray = reflect(-eye, normal);
  vec3 reflection = 0.64 * studio(ray)
                  + 0.18 * studio(normalize(ray + 0.09 * tangent))
                  + 0.18 * studio(normalize(ray - 0.09 * tangent));
  float ambient = 0.28 + 0.32 * max(0.0, dot(normal, normalize(vec3(-0.4, 0.8, 0.6))));
  vec3 color = reflection * (0.85 + 0.12 * rim) + vec3(0.14, 0.15, 0.19) * ambient;
  color *= mix(0.925, 1.01, 0.5 + 0.5 * cos(phase));
  color *= 1.0 - 0.48 * vSurface.y;
  vec3 compression = 0.76 + 0.24 * (1.0 - exp(-max(color - 0.76, 0.0) * 3.5));
  gl_FragColor = vec4(mix(color, compression, smoothstep(0.75, 0.8, color)), 1.0);
}`;

function center(t: number): Vector {
  return [
    1.06 * (Math.sin(t) + 2 * Math.sin(2 * t)),
    Math.cos(t) - 2 * Math.cos(2 * t),
    -1.08 * Math.sin(3 * t),
  ];
}

function unit(x: number, y: number, z: number): Vector {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

// The fixed studio lighting depends on just two angular coordinates.
// Precompute its overhead and side profiles once, including the warm rim in alpha.
function lightProfiles() {
  const width = 256;
  const pixels = new Uint8Array(width * 2 * 4);
  const smooth = (low: number, high: number, value: number) => {
    const t = Math.min(1, Math.max(0, (value - low) / (high - low)));
    return t * t * (3 - 2 * t);
  };
  for (let i = 0; i < width; i++) {
    const angle = ((i + 0.5) / width - 0.5) * 2.5;
    const panel = (low: number, high: number, blur: number) =>
      smooth(low - blur, low + blur, angle) * (1 - smooth(high - blur, high + blur, angle));
    const sky = smooth(-0.90, 0.94, angle);
    const top = panel(0.42, 0.84, 0.07);
    const blue = panel(-0.47, -0.22, 0.035);
    const flag = 1 - 0.84 * panel(-0.02, 0.22, 0.024);
    const violet = panel(0.61, 1.13, 0.10);
    const white = panel(-0.85, -0.70, 0.037);
    pixels.set([
      (0.038 + 0.392 * sky + 0.90 * top + 0.52 * blue) * flag * 127.5,
      (0.055 + 0.415 * sky + 0.92 * top + 0.69 * blue) * flag * 127.5,
      (0.099 + 0.471 * sky + 0.97 * top + 0.98 * blue) * flag * 127.5,
      panel(-0.78, -0.69, 0.035) * 255,
    ].map(Math.round), 4 * i);
    pixels.set([
      (0.54 * violet + 0.90 * white) * 255,
      (0.50 * violet + 0.84 * white) * 255,
      (0.82 * violet + 0.81 * white) * 255,
      255,
    ].map(Math.round), 4 * (i + width));
  }
  return pixels;
}

// A closed tube swept around the (2,3) torus knot. Estimate contact shadows
// against non-adjacent arcs so that crossings retain their depth as the view turns.
function knotGeometry() {
  const rings = 144, sides = 28;
  const vertices = new Float32Array((rings + 1) * (sides + 1) * 11);
  const indices = new Uint16Array(rings * sides * 6);
  const arcCenters = Array.from({ length: 72 }, (_, i) => center(TAU * i / 72));
  let vertex = 0, index = 0;
  for (let i = 0; i <= rings; i++) {
    const t = TAU * i / rings;
    const [cx, cy, cz] = center(t);
    const tangent = unit(1.06 * (Math.cos(t) + 4 * Math.cos(2 * t)),
      -Math.sin(t) + 4 * Math.sin(2 * t), -3.24 * Math.cos(3 * t));
    const [tx, ty, tz] = tangent;
    const [nx, ny] = unit(ty, -tx, 0);
    const bx = -tz * ny, by = tz * nx, bz = tx * ny - ty * nx;
    const radius = 0.46 + 0.028 * Math.cos(3 * t + 0.4);
    const reach = 2 * radius + 1.65;
    const neighbors = arcCenters.filter(([x, y, z], j) =>
      Math.cos(t - TAU * j / 72) < 0.75 && Math.hypot(x - cx, y - cy, z - cz) < reach);
    for (let j = 0; j <= sides; j++) {
      const angle = TAU * j / sides, c = Math.cos(angle), s = Math.sin(angle);
      const normal = unit(nx * c + bx * s, ny * c + by * s, bz * s);
      const [x, y, z] = [cx + radius * normal[0], cy + radius * normal[1], cz + radius * normal[2]];
      let shadow = 0;
      for (const point of neighbors) {
        const dx = point[0] - x, dy = point[1] - y, dz = point[2] - z;
        const distance = Math.hypot(dx, dy, dz);
        const facing = Math.max(0, (dx * normal[0] + dy * normal[1] + dz * normal[2]) / distance);
        shadow = Math.max(shadow, facing * Math.max(0, 1 - (distance - radius) / 1.65));
      }
      vertices.set([x, y, z, ...normal, ...tangent, i / rings, shadow], vertex);
      vertex += 11;
      if (i < rings && j < sides) {
        const a = i * (sides + 1) + j, b = a + sides + 1;
        indices.set([a, b, a + 1, a + 1, b, b + 1], index);
        index += 6;
      }
    }
  }
  return { vertices, indices };
}

export function createKnotRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true, antialias: true, depth: true, stencil: false, powerPreference: "low-power",
  });
  if (!gl) return null;
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
    const shader = gl.createShader(type);
    if (!shader) { gl.deleteProgram(program); return null; }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return null; }
  gl.useProgram(program);

  const geometry = knotGeometry();
  const indexCount = geometry.indices.length;
  const positions = gl.createBuffer(), elements = gl.createBuffer();
  const lights = gl.createTexture();
  if (!positions || !elements || !lights) {
    gl.deleteBuffer(positions); gl.deleteBuffer(elements); gl.deleteTexture(lights); gl.deleteProgram(program);
    return null;
  }
  gl.bindTexture(gl.TEXTURE_2D, lights);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, lightProfiles());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
  for (const [name, size, offset] of [["aPosition", 3, 0], ["aNormal", 3, 3], ["aTangent", 3, 6], ["aSurface", 2, 9]] as const) {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 44, offset * 4);
  }
  const pose = gl.getUniformLocation(program, "uPose");
  const aspect = gl.getUniformLocation(program, "uAspect");
  const resolution = gl.getUniformLocation(program, "uResolution");
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CW);
  gl.clearColor(0, 0, 0, 0);
  let width = 0, height = 0;
  return {
    draw(seconds: number, x: number, y: number) {
      if (width !== canvas.width || height !== canvas.height) {
        width = canvas.width;
        height = canvas.height;
        gl.viewport(0, 0, width, height);
        gl.uniform1f(aspect, width / height);
        gl.uniform1f(resolution, Math.min(width, height));
      }
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform3f(pose,
        0.48 + y * 0.18 + 0.075 * Math.sin(seconds * 0.34),
        -0.40 + x * 0.26 + 0.10 * Math.sin(seconds * 0.22),
        -0.27 + 0.035 * Math.sin(seconds * 0.28));
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    },
    dispose() {
      gl.deleteBuffer(positions); gl.deleteBuffer(elements); gl.deleteTexture(lights); gl.deleteProgram(program);
    },
  };
}
