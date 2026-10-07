// Physics layer (Rapier). No three.js here — this file also runs in Node for balance tests.
import { ARENA, PHYSICS, bowlProfileY } from './config.js';

export function buildBowlTrimesh(radialSegments, rings) {
  const R = ARENA.radius;
  const verts = [0, bowlProfileY(0), 0];
  for (let i = 1; i <= rings; i++) {
    const t = i / rings;
    const r = t * R;
    const y = bowlProfileY(t);
    for (let j = 0; j < radialSegments; j++) {
      const a = (j / radialSegments) * Math.PI * 2;
      verts.push(Math.cos(a) * r, y, Math.sin(a) * r);
    }
  }
  const idx = [];
  const ringStart = (i) => 1 + (i - 1) * radialSegments;
  for (let j = 0; j < radialSegments; j++) {
    const a = ringStart(1) + j;
    const b = ringStart(1) + ((j + 1) % radialSegments);
    idx.push(0, b, a);
  }
  for (let i = 1; i < rings; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = ringStart(i) + j;
      const b = ringStart(i) + ((j + 1) % radialSegments);
      const c = ringStart(i + 1) + j;
      const d = ringStart(i + 1) + ((j + 1) % radialSegments);
      idx.push(a, b, d, a, d, c);
    }
  }
  return { vertices: new Float32Array(verts), indices: new Uint32Array(idx) };
}

export class Physics {
  constructor(RAPIER) {
    this.R = RAPIER;
    this.world = new RAPIER.World({ x: 0, y: PHYSICS.gravity, z: 0 });
    this.world.timestep = PHYSICS.timestep;
    this.world.numSolverIterations = PHYSICS.solverIterations;
    this.events = new RAPIER.EventQueue(true);
    this.arenaColliders = new Set();
    this._buildArena();
  }
  _buildArena() {
    const R = this.R;
    const { vertices, indices } = buildBowlTrimesh(ARENA.physicsRadialSegments, ARENA.physicsRings);
    const floorBody = this.world.createRigidBody(R.RigidBodyDesc.fixed());
    const flags = R.TriMeshFlags ? R.TriMeshFlags.FIX_INTERNAL_EDGES : undefined;
    const bowl = this.world.createCollider(
      R.ColliderDesc.trimesh(vertices, indices, flags).setFriction(PHYSICS.arena.friction).setRestitution(PHYSICS.arena.restitution),
      floorBody,
    );
    this.arenaColliders.add(bowl.handle);
    const slab = this.world.createCollider(
      R.ColliderDesc.cylinder(0.5, ARENA.radius * 0.35).setTranslation(0, bowlProfileY(0) - 0.5 + 0.001, 0)
        .setFriction(PHYSICS.arena.friction).setRestitution(PHYSICS.arena.restitution),
      floorBody,
    );
    this.arenaColliders.add(slab.handle);
    const N=48,rIn=ARENA.radius,th=ARENA.wallThickness,yBottom=ARENA.depth-.6,yTop=ARENA.physicsWallTop,halfH=(yTop-yBottom)/2;
    const halfLen=Math.tan(Math.PI/N)*(rIn+th)+.05;
    for(let i=0;i<N;i++){
      const a=i/N*Math.PI*2,rc=rIn+th/2,q=quatFromYaw(-a);
      const c=this.world.createCollider(
        R.ColliderDesc.cuboid(th/2,halfH,halfLen).setTranslation(Math.cos(a)*rc,yBottom+halfH,Math.sin(a)*rc).setRotation(q).setFriction(.3).setRestitution(.2),
        floorBody,
      );
      this.arenaColliders.add(c.handle);
    }
  }
  createBall(x,y,z,radius,vel){
    const R=this.R,B=PHYSICS.ball;
    const body=this.world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(x,y,z).setLinearDamping(B.linearDamping).setAngularDamping(B.angularDamping).setCcdEnabled(true).setCanSleep(true));
    if(vel)body.setLinvel(vel,true);
    const collider=this.world.createCollider(R.ColliderDesc.ball(radius).setDensity(B.density).setFriction(B.friction).setRestitution(B.restitution).setActiveEvents(R.ActiveEvents.COLLISION_EVENTS),body);
    return{body,collider};
  }
  removeBall(body){this.world.removeRigidBody(body)}
  step(onCollision){this.world.step(this.events);this.events.drainCollisionEvents((h1,h2,started)=>onCollision(h1,h2,started))}
  castDrop(x,fromY,z,radius){
    const R=this.R,shape=new R.Ball(radius);
    const hit=this.world.castShape({x,y:fromY,z},{x:0,y:0,z:0,w:1},{x:0,y:-1,z:0},shape,0,fromY+10,true);
    if(!hit)return null;
    const toi=hit.time_of_impact??hit.toi??0;
    return{centerY:fromY-toi,point:hit.witness1,normal:hit.normal1,collider:hit.collider};
  }
}
function quatFromYaw(a){return{x:0,y:Math.sin(a/2),z:0,w:Math.cos(a/2)}}
