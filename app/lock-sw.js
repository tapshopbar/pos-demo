const CACHE='tsb-pos-demo-unlocked-v1'; const BASE=new URL('./',self.location).pathname;
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(BASE))return;
 let rel=u.pathname.slice(BASE.length); if(rel==='lock-sw.js'||rel==='bundle.enc')return;
 const cands=[]; if(rel===''||rel.endsWith('/'))cands.push(rel+'index.html'); else {cands.push(rel); if(!/\.[a-z0-9]+$/i.test(rel)){cands.push(rel+'/index.html');cands.push(rel+'.html');}}
 e.respondWith((async()=>{const c=await caches.open(CACHE); for(const k of cands){const hit=await c.match(BASE+k); if(hit)return hit;} if(e.request.mode==='navigate'&&(await c.match(BASE+'index.html'))){return (await c.match(BASE+'404.html'))||fetch(e.request);} return fetch(e.request);})());});
