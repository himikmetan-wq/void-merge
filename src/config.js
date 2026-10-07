// VOID MERGE — all tunable numbers live here.
// Physics/balance values are separate from cosmetics so skins can change without touching gameplay.

export const ARENA = {
  radius: 6.0,
  depth: 1.7,
  wallHeight: 1.35,
  wallThickness: 0.7,
  physicsWallTop: 16,
  physicsRadialSegments: 48,
  physicsRings: 16,
  visualRadialSegments: 96,
  visualRings: 28,
};
export function bowlProfileY(t) {
  const tt = t * t;
  return ARENA.depth * (0.55 * tt + 0.45 * tt * tt);
}
export const RIM_Y = ARENA.depth;
export const WALL_TOP_Y = ARENA.depth + ARENA.wallHeight;
export const PHYSICS = {
  gravity: -22, timestep: 1 / 60, maxSubSteps: 4, solverIterations: 6,
  ball: { density: 1.0, friction: 0.45, restitution: 0.22, linearDamping: 0.12, angularDamping: 0.85 },
  arena: { friction: 0.55, restitution: 0.15 },
};
export const GAME = {
  dropY: 6.0, dropCooldown: 0.42, aimEdgeMargin: 0.06, mergeMinAge: 0.10,
  mergeCooldown: 0.16, mergeUpImpulse: 3.2, mergeGrowTime: 0.20, comboWindow: 1.7,
  dangerY: WALL_TOP_Y + 0.35, dangerGraceAge: 1.6, dangerArmTime: 1.0,
  criticalSeconds: 3, criticalReleaseTime: 0.35, maxBalls: 90,
};
export const SPAWN_WEIGHTS = [
  { level: 0, weight: 55 }, { level: 1, weight: 30 }, { level: 2, weight: 12 }, { level: 3, weight: 3 },
];
export const LEVELS = [
  { value: 1, radius: 0.56, name:'Glass', pattern:'glass', base:'#c9d3e6', glow:'#dfe8ff', emissive:'#9fb4ff', css:['#ffffff','#9aa6bd','#3a4256'] },
  { value: 2, radius: 0.66, name:'Cyan', pattern:'veins', base:'#05303d', glow:'#38f0ff', emissive:'#3df2ff', css:['#b8fbff','#18c6e6','#053a4a'] },
  { value: 4, radius: 0.77, name:'Electric', pattern:'veins', base:'#061642', glow:'#3d7bff', emissive:'#4f8dff', css:['#bcd3ff','#2e6bff','#071a55'] },
  { value: 8, radius: 0.91, name:'Nebula', pattern:'nebula', base:'#1c0838', glow:'#a855ff', emissive:'#b066ff', css:['#e7c8ff','#8b3dff','#260a4d'] },
  { value: 16, radius: 1.06, name:'Lava', pattern:'lava', base:'#1a0c06', glow:'#ff7a1a', emissive:'#ff7d1f', css:['#ffd29a','#ff7a1a','#3b1606'] },
  { value: 32, radius: 1.24, name:'Stellar', pattern:'core', base:'#3a0606', glow:'#ff3030', emissive:'#ff3a24', css:['#ffc2b0','#ff2a1f','#4a0505'] },
  { value: 64, radius: 1.44, name:'Sun', pattern:'sun', base:'#4a2d00', glow:'#ffc233', emissive:'#ffbf2e', css:['#fff3c0','#ffbe2e','#5a3500'] },
  { value: 128, radius: 1.67, name:'Exotic', pattern:'nebula', base:'#022a26', glow:'#20e3c2', emissive:'#29f0cf', css:['#bdfff2','#16cfae','#03332d'] },
  { value: 256, radius: 1.92, name:'Star', pattern:'star', base:'#a9c4ff', glow:'#bfd6ff', emissive:'#d8e6ff', css:['#ffffff','#b7cfff','#3b5aa8'] },
  { value: 512, radius: 2.20, name:'VOID', pattern:'void', base:'#020205', glow:'#7a4dff', emissive:'#6b3cff', css:['#3a2a66','#0a0814','#000000'], ring:true },
];
export const MAX_LEVEL = LEVELS.length - 1;
export const MAX_MERGE_BONUS = 4096;
export const QUALITY = {
  HIGH:{dprCap:2.0,shadows:true,shadowMap:2048,glow:true},
  MEDIUM:{dprCap:1.5,shadows:true,shadowMap:1024,glow:true},
  LOW:{dprCap:1.0,shadows:false,shadowMap:512,glow:false},
};
export const CAMERA = {
  fov:42,target:[0,1.7,0],polar:0.80,polarMin:0.38,polarMax:1.18,azimuthLimit:1.15,
  zoomMin:0.62,zoomMax:1.45,fitRadius:9.0,portrait:{fitRadius:6.9,polar:0.62,fovAdd:14},damping:10,
};
export const STORAGE_KEY='voidmerge.v1';
