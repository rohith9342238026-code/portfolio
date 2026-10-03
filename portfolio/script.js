const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".nav-dot")];
const current = document.getElementById("current");
let index = 0;
let locked = false;

function goTo(n){
  n = Math.max(0, Math.min(slides.length - 1, n));
  if(n === index && slides[index].classList.contains("active")) return;
  slides[index].classList.remove("active");
  dots[index].classList.remove("active");
  index = n;
  slides[index].classList.add("active");
  dots[index].classList.add("active");
  current.textContent = String(index + 1).padStart(2,"0");
}

document.querySelectorAll("[data-go]").forEach(el=>{
  el.addEventListener("click", e=>{
    const target = Number(el.dataset.go) - 1;
    goTo(target);
  });
});

dots.forEach(dot => dot.addEventListener("click",()=>goTo(Number(dot.dataset.go)-1)));

window.addEventListener("wheel", e=>{
  if(locked) return;
  locked = true;
  if(e.deltaY > 0) goTo(index + 1);
  else if(e.deltaY < 0) goTo(index - 1);
  setTimeout(()=>locked=false,750);
},{passive:true});

let touchStart = 0;
window.addEventListener("touchstart",e=>touchStart=e.touches[0].clientY,{passive:true});
window.addEventListener("touchend",e=>{
  const diff = touchStart - e.changedTouches[0].clientY;
  if(Math.abs(diff)>50) goTo(index + (diff>0?1:-1));
},{passive:true});

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowDown" || e.key==="PageDown") goTo(index+1);
  if(e.key==="ArrowUp" || e.key==="PageUp") goTo(index-1);
});

const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☾" : "☼";
});

const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mouseX=innerWidth/2, mouseY=innerHeight/2, ringX=mouseX, ringY=mouseY;

window.addEventListener("mousemove",e=>{
  mouseX=e.clientX; mouseY=e.clientY;
  dot.style.left=mouseX+"px"; dot.style.top=mouseY+"px";
  const target=e.target.closest("[data-float], .magnetic, a, button");
  ring.classList.toggle("hover",!!target);

  document.querySelectorAll(".portrait-wrap").forEach(card=>{
    const r=card.getBoundingClientRect();
    if(r.width && e.clientX>r.left && e.clientX<r.right && e.clientY>r.top && e.clientY<r.bottom){
      const rx=((e.clientY-r.top)/r.height-.5)*-7;
      const ry=((e.clientX-r.left)/r.width-.5)*7;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  });
});

function cursorLoop(){
  ringX += (mouseX-ringX)*.16;
  ringY += (mouseY-ringY)*.16;
  ring.style.left=ringX+"px"; ring.style.top=ringY+"px";
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

document.querySelectorAll("[data-float]").forEach(el=>{
  el.addEventListener("mouseenter",()=>el.classList.add("float-active"));
  el.addEventListener("mouseleave",()=>el.classList.remove("float-active"));
});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.10;
    const y=(e.clientY-r.top-r.height/2)*.10;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="translate(0,0)");
});
