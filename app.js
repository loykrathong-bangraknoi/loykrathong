// app.js (PRO)
document.addEventListener('DOMContentLoaded', () => {
  (function(){ const h=new Date().getHours(); const r=document.documentElement; r.classList.remove('evening','late'); if(h>=18&&h<22) r.classList.add('evening'); else if(h>=22||h<2) r.classList.add('late'); })();
  const btn = document.getElementById('launchBtn')
  const input = document.getElementById('wish')
  const river = document.getElementById('river')
  const picker = document.getElementById('picker')
  const shareBox = document.getElementById('shareBox')
  const shareLinkEl = document.getElementById('shareLink')
  const copyBtn = document.getElementById('copyBtn')
  const nativeShareBtn = document.getElementById('nativeShareBtn')
  const toast = document.getElementById('toast')

  let styleId = 1

  function random(min, max){ return Math.random()*(max-min)+min }
  function setToast(msg){
    toast.textContent = msg
    toast.style.display = 'block'
    setTimeout(()=> toast.style.display = 'none', 1600)
  }
  function imgForStyle(id){ return `assets/krathong${id}.png` }
  
  function renderKrathong(text, id, name){
    const el = document.createElement('div')
    el.className = 'krathong'
    el.style.animation = 'none'
    el.style.bottom = '0px'
    el.style.left = '-60px'
    el.innerHTML = `<img class="emoji" src="${imgForStyle(id)}" alt="krathong"><div class="text"></div>`
    el.querySelector('.text').textContent = (name ? (name + ' · ') : '') + text
    river.appendChild(el)

    let last=0, x=-60, t=0
    const speed = 10
    const amp = 6
    const maxLeft = (river.getBoundingClientRect().width || window.innerWidth) + 150
    function step(ts){
      if(!last) last = ts
      const dt = Math.min(64, ts - last)/1000
      last = ts
      x += speed * dt
      t += dt * 1.4
      const y = Math.sin(t) * amp
      el.style.transform = `translate3d(${x}px, ${-y}px, 0)`
      if (x < maxLeft) requestAnimationFrame(step); else el.remove()
    }
    requestAnimationFrame(step)
  }
s`)
    el.style.bottom = `${random(0, 70)}px`
    el.style.left = `-140px`
    el.innerHTML = `<img class="emoji" src="${imgForStyle(id)}" alt="krathong"><div class="text"></div>`
    el.querySelector('.text').textContent = text
    river.appendChild(el)
    setTimeout(() => el.remove(), 26000)
  }
  function buildIdUrl(id){
    const url = new URL(window.location.href)
    url.searchParams.clear()
    url.searchParams.set('id', id)
    return url.toString()
  }

  
  async function launch(){
    const inputName = document.getElementById('name')
    const name = (inputName && inputName.value ? String(inputName.value).trim().slice(0,60) : '')
    const text = (input.value || 'สุขใจทุกคืนวันเพ็ญ 🌕').trim().slice(0,120)
    input.value = ''

    let id = ''
    try{
      const payload = { text, style: styleId, name }
      const res = await window.Storage.save(payload)
      id = res?.id || ''
    }catch(e){ }

    renderKrathong(text, styleId, name)

    const link = id ? buildIdUrl(id) : location.href
    shareLinkEl.textContent = link
    shareBox.style.display = 'block'

    nativeShareBtn.onclick = async () => {
      if (navigator.share){
        try{ await navigator.share({ title: 'ลอยกระทงออนไลน์', text: (name? name+' · ' : '') + text, url: link }) }catch(e){}
      }else{ setToast('อุปกรณ์นี้ไม่รองรับ Web Share API') }
    }
    copyBtn.onclick = async () => {
      try{ await navigator.clipboard.writeText(link); setToast('คัดลอกลิงก์แล้ว ✔') }
      catch(e){ setToast('คัดลอกไม่สำเร็จ') }
    }
  }
)
    const id = res?.id || ''
    renderKrathong(text, styleId)

    const link = id ? buildIdUrl(id) : location.href
    shareLinkEl.textContent = link
    shareBox.style.display = 'block'

    nativeShareBtn.onclick = async () => {
      if (navigator.share){
        try{ await navigator.share({ title: 'ลอยกระทงออนไลน์', text: text, url: link }) }catch(e){}
      }else{ setToast('อุปกรณ์นี้ไม่รองรับ Web Share API') }
    }
    copyBtn.onclick = async () => {
      try{ await navigator.clipboard.writeText(link); setToast('คัดลอกลิงก์แล้ว ✔') }
      catch(e){ setToast('คัดลอกไม่สำเร็จ') }
    }
  }

  picker?.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      picker.querySelectorAll('button').forEach(x=>x.classList.remove('active'))
      b.classList.add('active'); styleId = Number(b.dataset.style||'1')
    })
  })

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  
  if (id){
    window.Storage.getById(id).then(doc => {
      if (doc){
        styleId = Number(doc.style || 1)
        const nm = String(doc.name||'')
        renderKrathong(String(doc.text||'').slice(0,120), styleId, nm)
        const link = buildIdUrl(id)
        shareLinkEl.textContent = link
        shareBox.style.display = 'block'
      }
    })
  }


  btn.addEventListener('click', launch)
  input.addEventListener('keydown', e => { if (e.key === 'Enter'){ launch() } })
})


// ===== LIVE-FINAL ENHANCE =====
(function(){
  const isHome = () => location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.includes('/loy-krathong-online/');
  function patchSave(){
    const S = window.Storage; if (!S || !S.save || S.__live_final_patched) return;
    const orig = S.save.bind(S);
    S.save = async function(item){
      try{
        const name = (document.getElementById('name')?.value || '').trim().slice(0,50);
        const wishEl = document.getElementById('wish');
        const wish = (wishEl?.value || item.text || '').trim().slice(0,120);
        const text = name ? (name + ' : ' + wish) : wish;
        const style = item.style || 1;
        const merged = Object.assign({}, item, { text, style, name, ts: Date.now() });
        const res = await orig(merged);
        if (typeof window.renderKrathong === 'function') window.renderKrathong(text, style);
        return res;
      }catch(e){
        return await orig(item);
      }
    };
    S.__live_final_patched = true;
  }
  document.addEventListener('DOMContentLoaded', patchSave);
  setTimeout(patchSave, 800);

  document.addEventListener('DOMContentLoaded', function(){
    if (!isHome() || !window.Storage) return;
    const rendered = new Set();
    function renderList(list){
      for (const it of list){
        const key = it.id || (String(it.ts) + ':' + (it.text||''));
        if (rendered.has(key)) continue;
        rendered.add(key);
        const txt = String(it.text||'').slice(0,120);
        const style = Number(it.style||1);
        if (typeof window.renderKrathong === 'function') window.renderKrathong(txt, style);
      }
    }
    if (typeof window.Storage.getAllDetailed === 'function'){
      window.Storage.getAllDetailed().then(renderList).catch(()=>{});
    }
    if (typeof window.Storage.subscribeAll === 'function'){
      window.__lk_unsub = window.Storage.subscribeAll(renderList);
      window.addEventListener('beforeunload', ()=>{ if (typeof window.__lk_unsub === 'function') window.__lk_unsub(); });
    }
  });

  document.addEventListener('DOMContentLoaded', function(){
    if (!isHome()) return;
    const fx = window.fireworks || window.startFireworks || window.initFireworks;
    try{ if (typeof fx === 'function') fx(); }catch(e){}
    function playAudio(){
      try{
        const a = new Audio('assets/sound/fireworks-soft.wav');
        a.volume = 0.3;
        a.play().catch(()=>{});
      }catch(e){}
    }
    const unlock = ()=>{ playAudio(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock, { once:true });
    window.addEventListener('keydown', unlock, { once:true });
    const btn = document.getElementById('launchBtn');
    if (btn){ btn.addEventListener('click', ()=>{ playAudio(); }, { passive:true }); }
  });

  document.addEventListener('DOMContentLoaded', ()=>{
    const id='lk_text_style_live_final'; if (document.getElementById(id)) return;
    const s=document.createElement('style'); s.id=id;
    s.textContent='.krathong .text{color:#fff!important;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.7);font-family:"Sarabun","Noto Sans Thai",system-ui,sans-serif}';
    document.head.appendChild(s);
  });
})(); 
// ===== END LIVE-FINAL ENHANCE =====

// PRO-REVAMP enhance
(function(){
  // Save: merge name + wish for display
  function patchSave(){
    const S = window.Storage; if(!S || !S.save || S.__pro) return; const o=S.save.bind(S);
    S.save = async function(item){
      try{
        const name=(document.getElementById('name')?.value||'').trim().slice(0,50);
        const wish=(document.getElementById('wish')?.value||item.text||'').trim().slice(0,160);
        const text = name ? (name+' : '+wish) : wish;
        const style=item.style||1;
        const res = await o(Object.assign({ts:Date.now()}, item, {text,style,name}));
        if (typeof window.renderKrathong === 'function') window.renderKrathong(text,style);
        return res;
      }catch(e){ return await o(item); }
    };
    S.__pro = true;
  }
  document.addEventListener('DOMContentLoaded', patchSave); setTimeout(patchSave, 600);

  // Initial + realtime render at home
  function isHome(){ return location.pathname.endsWith('index.html') || location.pathname==='/' || location.pathname.includes('/loy-krathong-online/'); }
  document.addEventListener('DOMContentLoaded', function(){
    if (!isHome() || !window.Storage) return;
    const seen = new Set();
    function feed(list){
      for (const it of list){
        const key = it.id || (String(it.ts)+':'+(it.text||''));
        if (seen.has(key)) continue; seen.add(key);
        const txt=String(it.text||'').slice(0,160);
        const style=Number(it.style||1);
        if (typeof window.renderKrathong === 'function') requestAnimationFrame(()=>window.renderKrathong(txt,style));
      }
    }
    if (typeof window.Storage.getAllDetailed==='function') window.Storage.getAllDetailed().then(l=>feed(l.slice(-150))).catch(()=>{});
    if (typeof window.Storage.subscribeAll==='function') window.__lk_unsub = window.Storage.subscribeAll(feed);
    window.addEventListener('beforeunload', ()=>{ if (typeof window.__lk_unsub==='function') window.__lk_unsub(); });
  });

  // Sharebar (if present):
  document.addEventListener('DOMContentLoaded', function(){
    const bar=document.getElementById('sharebar'); if(!bar) return;
    function toast(m){ let t=document.querySelector('.toast'); if(t) t.remove(); t=document.createElement('div'); t.className='toast'; t.textContent=m; document.body.appendChild(t); setTimeout(()=>{t.remove();},2300);}
    const shareText="มาร่วมลอยกระทงออนไลน์กับองค์การบริหารส่วนตำบลบางรักน้อย 💧🌕✨"; const shareUrl=location.href;
    bar.addEventListener('click', async (e)=>{
      const btn=e.target.closest('.share-btn'); if(!btn) return; const pf=btn.getAttribute('data-platform');
      if(navigator.share && (pf==='copy'||pf==='tiktok')){ try{ await navigator.share({title:document.title,text:shareText,url:shareUrl}); return; }catch(e){} }
      if(pf==='facebook') window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareUrl),'_blank');
      else if(pf==='line') window.open('https://line.me/R/msg/text/?'+encodeURIComponent(shareText+' '+shareUrl),'_blank');
      else if(pf==='x') window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText)+'&url='+encodeURIComponent(shareUrl),'_blank');
      else if(pf==='tiktok'){ try{ await navigator.clipboard.writeText(shareText+'\n'+shareUrl); toast('เปิดแอป TikTok แล้ว “วาง” ได้เลย'); }catch(e){ toast('คัดลอกไม่สำเร็จ'); } }
      else if(pf==='copy'){ try{ await navigator.clipboard.writeText(shareText+'\n'+shareUrl); toast('คัดลอกลิงก์เรียบร้อย'); }catch(e){ toast('คัดลอกไม่สำเร็จ'); } }
    });
  });
})();