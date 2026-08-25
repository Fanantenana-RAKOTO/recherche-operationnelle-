export function distanceToLine(px, py, x1, y1, x2, y2) {
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A * C + B * D;
  const len2 = C * C + D * D;
  if (len2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, dot / len2));
  return Math.hypot(px - (x1 + t * C), py - (y1 + t * D));
}

export function findVertexAt(vertices, x, y, radius = 25) {
  return vertices.find(v => Math.hypot(v.x - x, v.y - y) < radius) ?? null;
}