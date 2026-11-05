const CACHE='tsb-pos-demo-unlocked-v2'; const META='tsb-pos-demo-meta'; const BASE=new URL('./',self.location).pathname;
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('tsb-pos-demo-unlocked')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function expired(){const mc=await caches.open(META);const r=await mc.match(BASE+'__exp');if(!r)return false;const exp=+(await r.text());if(Date.now()<=exp)return false;await caches.delete(CACHE);await mc.delete(BASE+'__exp');return true;}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if((e.request.method!=='GET'&&e.request.method!=='HEAD')||u.origin!==location.origin||!u.pathname.startsWith(BASE))return;
 let rel=u.pathname.slice(BASE.length); if(rel==='lock-sw.js'||rel.endsWith('.enc'))return;
 const cands=[]; if(rel===''||rel.endsWith('/'))cands.push(rel+'index.html'); else {cands.push(rel); if(!/\.[a-z0-9]+$/i.test(rel)){cands.push(rel+'/index.html');cands.push(rel+'.html');}}
 e.respondWith((async()=>{if(await expired()){if(e.request.mode==='navigate')return Response.redirect(new URL(BASE+'?expired=1',location.origin).href,302);return new Response('expired',{status:410});}
  const c=await caches.open(CACHE); for(const k of cands){const hit=await c.match(BASE+k); if(hit)return hit;} if(e.request.mode==='navigate'&&(await c.match(BASE+'index.html'))){return (await c.match(BASE+'404.html'))||fetch(e.request);} return fetch(e.request);})());});
