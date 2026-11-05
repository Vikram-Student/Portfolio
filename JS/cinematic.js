
(() => {
  const section=document.querySelector('.cinematic-sequence');
  const canvas=document.getElementById('cinematic-canvas');
  if(!section||!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false});
  const total=2063, base='assets/cinematic-frames/';
  const files=[];
  for(let t=1;t<=12;t++){
    const folder=`Transition-${t}`;
    const count=t===1?179:(t<=7?149:198);
    for(let i=1;i<=count;i++)files.push(`${base}${folder}/ezgif-frame-${String(i).padStart(3,'0')}.jpg`);
  }
  const images=new Array(total), loaded=new Set();
  let target=0,current=0,last=-1,raf=0,started=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){const d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);canvas.style.width=w+'px';canvas.style.height=h+'px';draw(Math.round(current));}
  function load(i){
    if(i<0||i>=total||images[i])return;
    const im=new Image();images[i]=im;
    im.onload=()=>{loaded.add(i);if(Math.abs(i-Math.round(current))<4)draw(Math.round(current));};
    im.src=files[i];
  }
  function draw(n){
    n=Math.max(0,Math.min(total-1,n));if(n===last)return;
    let idx=n;
    if(!loaded.has(idx)){let found=-1;for(let d=1;d<30;d++){if(loaded.has(n-d)){found=n-d;break}if(loaded.has(n+d)){found=n+d;break}}if(found<0)return;idx=found;}
    const im=images[idx];if(!im||!im.complete)return;
    const w=canvas.width,h=canvas.height,portrait=innerWidth<768;
    ctx.fillStyle='#07080a';ctx.fillRect(0,0,w,h);
    const scale=portrait?Math.min(w/im.width,h/im.height):Math.max(w/im.width,h/im.height);
    const dw=im.width*scale,dh=im.height*scale;
    ctx.drawImage(im,(w-dw)/2,(h-dh)/2,dw,dh);last=n;
    const read=document.getElementById('cinematic-frame-readout');if(read)read.textContent=String(n+1).padStart(4,'0')+' / '+total;
  }
  function preloadAround(center){
    const c=Math.max(0,Math.min(total-1,center));
    for(let d=0;d<45;d++){load(c+d);if(c-d>=0)load(c-d);}
  }
  function update(){
    raf=0;
    const max=section.offsetHeight-innerHeight;
    const p=reduced?1:Math.max(0,Math.min(1,-section.getBoundingClientRect().top/Math.max(1,max)));
    target=p*(total-1);current+=(target-current)*.15;
    const frame=Math.round(current);preloadAround(frame);draw(frame);
    const bar=document.getElementById('cinematic-progress-bar');if(bar)bar.style.width=(p*100)+'%';
    const start=document.querySelector('.cinematic-copy-start'),end=document.querySelector('.cinematic-copy-end');
    if(start)start.style.opacity=String(Math.max(0,1-p*5));
    if(end)end.style.opacity=String(Math.max(0,Math.min(1,(p-.82)*6)));
    if(Math.abs(target-current)>.4)raf=requestAnimationFrame(update);
  }
  function request(){if(!raf)raf=requestAnimationFrame(update);}
  // Load opening frames first; progressively stream the rest in sequence.
  for(let i=0;i<Math.min(40,total);i++)load(i);
  let next=40;
  const stream=()=>{const stop=Math.min(total,next+35);for(;next<stop;next++)load(next);if(next<total)setTimeout(stream,90);};
  const begin=()=>{if(started)return;started=true;stream();request();};
  if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){begin();io.disconnect();}},{rootMargin:'300px'});io.observe(section);}else begin();
  addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{resize();request();});
  if(reduced){load(0);load(total-1);}
  resize();begin();
})();
