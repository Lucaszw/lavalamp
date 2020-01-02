import * as p5 from 'p5';
import * as _ from 'lodash';

const v = 0.3;
const handleSize = 2;
const maxDistMultiplier = 0.5;

export class Particle {
  constructor({
    x=10,
    y,
    r=100
  }) {
    this.vector = createVector(x, y, 0);
    this.radius = r;
    this.id = Math.floor(Math.random() * 1e5);
    this.dx = (Math.random() > 0.5) ? 1 : -1;
    this.dy = (Math.random() > 0.5) ? 1 : -1;
  }
  move(bounds) {
    if (this.vector.x+this.radius >= bounds.maxX(this.vector.y)) this.dx = -1;
    if (this.vector.x-this.radius <= bounds.minX(this.vector.y)) this.dx = 1;
    if (this.vector.y+this.radius >= bounds.maxY(this.vector.x)) this.dy = -1;
    if (this.vector.y-this.radius <= bounds.minY(this.vector.x)) this.dy = 1;
    this.vector.x += v*this.dx;
    this.vector.y += v*this.dy;
    // this.vector.x += 1*Math.random();
    // this.vector.y += 2*Math.random();
  }
  draw() {
    circle(this.vector.x, this.vector.y, this.radius);
  }
  calculateDistance(p2) {
    return this.vector.dist(p2.vector);
  }
  calculateMaxSpread(p2) {
    let d = this.calculateDistance(p2);
    return Math.acos((this.radius - p2.radius) / d);
  }
  getAngleBetweenPoint(p2) {
    return Math.atan2(p2.vector.y - this.vector.y, p2.vector.x - this.vector.x);
  }
  getHandles(p2) {
    const angles = this.getAngles(p2);
    const points = this.getPoints(p2);
    const totalRadius = this.radius + p2.radius;
    const d = this.calculateDistance(p2);
    const d2Base = Math.min(v * handleSize, points[0].dist(points[2]) / totalRadius);
    const d2 = d2Base * Math.min(1, (d * 2) / totalRadius);

    const r1 = this.radius * d2;
    const r2 = p2.radius * d2;

    const h1 = p5.Vector.fromAngle(angles[0] - HALF_PI, r1);
    h1.x += points[0].x;
    h1.y += points[0].y;

    const h2 = p5.Vector.fromAngle(angles[1] + HALF_PI, r1);
    h2.x += points[1].x;
    h2.y += points[1].y;

    const h3 = p5.Vector.fromAngle(angles[2] + HALF_PI, r2);
    h3.x += points[2].x;
    h3.y += points[2].y;

    const h4 = p5.Vector.fromAngle(angles[3] - HALF_PI, r2);
    h4.x += points[3].x;
    h4.y += points[3].y;

    return [h1, h2, h3, h4];
  }
  getAngles(p2) {
    const maxSpread = this.calculateMaxSpread(p2);
    const angle = this.getAngleBetweenPoint(p2);
    const [u1, u2] = this.getOverlapValues(p2);
    const a1 = angle + u1 + (maxSpread - u1) * v;
    const a2 = angle - u1 - (maxSpread - u1) * v;
    const a3 = angle + PI - u2 - (PI - u2 - maxSpread) * v;
    const a4 = angle - PI + u2 + (PI - u2 - maxSpread) * v;
    return [a1, a2, a3, a4];
  }
  getOverlapValues(p2) {
    let u1, u2;
    const d = this.calculateDistance(p2);
    // console.log({d});
    if (d < this.radius + p2.radius) {
      u1 = Math.acos(
        (this.radius * this.radius + d * d - p2.radius * p2.radius) / (2 * this.radius * d)
      );
      u2 = Math.acos(
        (p2.radius * p2.radius + d * d - this.radius * this.radius) / (2 * p2.radius * d)
      );
      // console.log({u1, u2});
    } else {
      u1 = 0;
      u2 = 0;
    }
    return [u1, u2];
  }
  getPoints(p2) {
    let [a1, a2, a3, a4] = this.getAngles(p2);
    // a3 = PI - a1;
    // a4 = PI - a2;

    // Circle 1 (left)
    const point1 = p5.Vector.fromAngle(a1, this.radius / 2);
    point1.x += this.vector.x;
    point1.y += this.vector.y;

    const point2 = p5.Vector.fromAngle(a2, this.radius / 2);
    point2.x += this.vector.x;
    point2.y += this.vector.y;

    // Circle 2 (right)
    const point3 = p5.Vector.fromAngle(a3, p2.radius / 2);
    point3.x += p2.vector.x;
    point3.y += p2.vector.y;

    const point4 = p5.Vector.fromAngle(a4, p2.radius / 2);
    point4.x += p2.vector.x;
    point4.y += p2.vector.y;

    return [point1, point2, point3, point4];
  }
}

export class Particles {
  constructor(p5Instance) {
    this.particles = [];
  }

  add(particle) {
    let p = new Particle(particle);
    this.particles.push(p);
    this.draw();
    return p;
  }

  shouldJoin(particle1, particle2) {
    const d = particle1.calculateDistance(particle2);
    const maxDist = particle1.radius + particle2.radius * maxDistMultiplier;
    if (particle1.radius <= 0) return false;
    if (particle2.radius <= 0) return false;
    if (d > maxDist) return false;
    if (d <= Math.abs(particle1.radius - particle2.radius)) return false;
    return true;
  }

  calculateMaxSpreads() {
    for (let particle1 of this.particles) {
      for (let particle2 of this.particles) {
        if (particle1.id == particle2.id) continue;
        if (!this.shouldJoin(particle1, particle2)) continue;
        const [p1, p2, p3, p4] = particle1.getPoints(particle2);
        const [h1, h2, h3, h4] = particle1.getHandles(particle2);
        beginShape();
        vertex(p1.x, p1.y);
        vertex(p2.x, p2.y);
        if (particle1.calculateDistance(particle2) > particle1.radius)
          bezierVertex(h2.x, h2.y, h4.x, h4.y, p4.x, p4.y);
        else
          bezierVertex(h2.x, h2.y, h4.x, h4.y, p4.x, p4.y);
        vertex(p4.x, p4.y);
        vertex(p3.x, p3.y);
        if (particle1.calculateDistance(particle2) > particle1.radius)
          bezierVertex(h3.x, h3.y, h1.x, h1.y, p1.x, p1.y);
        else
          bezierVertex(h3.x, h3.y, h1.x, h1.y, p1.x, p1.y);
        endShape();
      }
    }
  }


  draw() {
    for (let p of this.particles) {
      p.draw();
    }
  }
}