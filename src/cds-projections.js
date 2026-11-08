import {clamp,dot} from './physics.js';
export function displayDirection(q,basis){return[basis.s0,basis.b1,basis.b2].map(e=>dot(q,e))}
export function mollweideAngles(lon,lat){let t=lat;for(let i=0;i<25;i++){const den=2+2*Math.cos(2*t);if(Math.abs(den)<1e-12)break;const dt=(2*t+Math.sin(2*t)-Math.PI*Math.sin(lat))/den;t-=clamp(dt,-.5,.5);if(Math.abs(dt)<1e-12)break}return[2*Math.SQRT2/Math.PI*lon*Math.cos(t),Math.SQRT2*Math.sin(t)]}
export function projectDirection(q,basis,mode='standard'){const d=displayDirection(q,basis);if(mode==='mollweide')return mollweideAngles(Math.atan2(d[1],d[0]),Math.asin(clamp(d[2],-1,1)));const tangent=Math.hypot(d[1],d[2]),rho=Math.atan2(tangent,clamp(d[0],-1,1));if(tangent<1e-14)return rho<Math.PI/2?[0,0]:null;return[rho*d[1]/tangent,rho*d[2]/tangent]}
/** Clip to the longitude seam before filling HEALPix polygons. */
export function projectMollweidePixel(vs,basis){const angular=[];for(const original of vs){const q=displayDirection(original,basis);let lon=Math.atan2(q[1],q[0]);if(angular.length){const prev=angular.at(-1)[0];while(lon-prev>Math.PI)lon-=2*Math.PI;while(lon-prev< -Math.PI)lon+=2*Math.PI}angular.push([lon,Math.asin(clamp(q[2],-1,1))])}
 const clip=(poly,bound,greater)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=greater?a[0]>=bound:a[0]<=bound,ib=greater?b[0]>=bound:b[0]<=bound;if(ia)out.push(a);if(ia!==ib){const t=(bound-a[0])/(b[0]-a[0]);out.push([bound,a[1]+t*(b[1]-a[1])])}}return out};
 const parts=[];for(const shift of [-2*Math.PI,0,2*Math.PI]){let p=clip(angular.map(q=>[q[0]+shift,q[1]]),-Math.PI,true);if(p.length)p=clip(p,Math.PI,false);if(p.length>=3)parts.push(p.map(q=>mollweideAngles(...q)))}return parts;
}
