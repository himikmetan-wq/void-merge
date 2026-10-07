import * as THREE from 'three';
import { CAMERA } from './config.js';
export class CameraRig {
 constructor(aspect){this.camera=new THREE.PerspectiveCamera(CAMERA.fov,aspect,.1,400);this.target=new THREE.Vector3(...CAMERA.target);this.defaultPolar=CAMERA.polar;this.goal={azimuth:0,polar:CAMERA.polar,zoom:1};this.cur={...this.goal};this.fitDistance=20;this.shakeAmp=0;this.shakeT=0;this._off=new THREE.Vector3();this.resize(aspect);this.cur={...this.goal};this.update(1)}
 resize(aspect){const cam=this.camera;cam.aspect=aspect;const portrait=aspect<.8,P=CAMERA.portrait;cam.fov=portrait?CAMERA.fov+P.fovAdd:CAMERA.fov;cam.updateProjectionMatrix();const np=portrait?P.polar:CAMERA.polar;if(Math.abs(this.goal.polar-this.defaultPolar)<1e-6)this.goal.polar=np;this.defaultPolar=np;const v=THREE.MathUtils.degToRad(cam.fov/2),h=Math.atan(Math.tan(v)*aspect),r=portrait?P.fitRadius:CAMERA.fitRadius;this.fitDistance=Math.max(r/Math.sin(h),(r*.78)/Math.sin(v))}
 orbit(a,p){this.goal.azimuth=THREE.MathUtils.clamp(this.goal.azimuth+a,-CAMERA.azimuthLimit,CAMERA.azimuthLimit);this.goal.polar=THREE.MathUtils.clamp(this.goal.polar+p,CAMERA.polarMin,CAMERA.polarMax)}
 zoomBy(f){this.goal.zoom=THREE.MathUtils.clamp(this.goal.zoom*f,CAMERA.zoomMin,CAMERA.zoomMax)}
 reset(){this.goal.azimuth=0;this.goal.polar=this.defaultPolar;this.goal.zoom=1}
 shake(a){this.shakeAmp=Math.min(.35,this.shakeAmp+a)}
 update(dt){const k=1-Math.exp(-CAMERA.damping*dt),c=this.cur,g=this.goal;c.azimuth+=(g.azimuth-c.azimuth)*k;c.polar+=(g.polar-c.polar)*k;c.zoom+=(g.zoom-c.zoom)*k;const dist=this.fitDistance*c.zoom,sp=Math.sin(c.polar);this._off.set(Math.sin(c.azimuth)*sp,Math.cos(c.polar),Math.cos(c.azimuth)*sp).multiplyScalar(dist);this.camera.position.copy(this.target).add(this._off);this.camera.lookAt(this.target);if(this.shakeAmp>.001){this.shakeT+=dt*60;const a=this.shakeAmp;this.camera.position.x+=Math.sin(this.shakeT*1.7)*a*.3;this.camera.position.y+=Math.sin(this.shakeT*2.3)*a*.3;this.shakeAmp*=Math.exp(-dt*9)}}
}
