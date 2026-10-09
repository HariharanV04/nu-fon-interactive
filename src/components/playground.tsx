import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronsUp, Gamepad2, RotateCcw, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doodle } from "./doodle";
import { StickMan } from "./stickman";
import { clampPosition, cooldownFraction, DASH_COOLDOWN, dashDirection, isAbilityReady, isSparkCollected, JUMP_COOLDOWN, JUMP_HEIGHT, jumpOffset, movementSpeed, SPARK_COUNT } from "@/lib/game";

export function Playground() {
  const [active, setActive] = useState(false);
  const [collected, setCollected] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [spots, setSpots] = useState<{x:number;y:number}[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);
  const dashRingRef = useRef<HTMLSpanElement>(null);
  const jumpRingRef = useRef<HTMLSpanElement>(null);
  const keys = useRef(new Set<string>());
  const target = useRef<{x:number;y:number}|null>(null);
  const abilities = useRef({dashReq:false,jumpReq:false,dashAt:-1e9,jumpAt:-1e9,dir:{x:1,y:0}});
  const won = collected.length === SPARK_COUNT;
  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let frame = 0;
    const found = new Set<number>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sparkSpots = [{x:.18,y:.26},{x:.78,y:.21},{x:.52,y:.43},{x:.85,y:.68},{x:.25,y:.72}].map(p => ({x:p.x*window.innerWidth,y:p.y*window.innerHeight}));
    setSpots(sparkSpots);
    keys.current.clear(); target.current = null;
    abilities.current = {dashReq:false,jumpReq:false,dashAt:-1e9,jumpAt:-1e9,dir:{x:1,y:0}};
    const typing = (e: KeyboardEvent) => (e.target as HTMLElement)?.closest?.("input,textarea,[contenteditable]");
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {setActive(false);return;}
      if (typing(e)) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)) {e.preventDefault();keys.current.add(e.key);}
      else if (e.key === "Shift" || e.key === " ") { if ((e.target as HTMLElement)?.closest?.("button") && e.key === " ") return; e.preventDefault(); if(!e.repeat) abilities.current.dashReq = true; }
      else if (e.key === "j" || e.key === "J") { e.preventDefault(); if(!e.repeat) abilities.current.jumpReq = true; }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    const click = (e: PointerEvent) => { if ((e.target as HTMLElement).closest("button,a,input,[data-game-controls]")) return; target.current = {x:e.clientX,y:e.clientY}; };
    const blur = () => { keys.current.clear(); abilities.current.dashReq = false; abilities.current.jumpReq = false; };
    window.addEventListener("keydown",down); window.addEventListener("keyup",up); window.addEventListener("pointerdown",click); window.addEventListener("blur",blur);
    import("matter-js").then(({default: Matter}) => {
      if (stopped) return;
      const engine = Matter.Engine.create({gravity:{x:0,y:0,scale:0}});
      const body = Matter.Bodies.circle(48,46,24,{frictionAir:.15});
      Matter.Composite.add(engine.world,body);
      let last = performance.now();
      const tick = (now:number) => {
        if(stopped) return;
        const k = keys.current; const ab = abilities.current;
        let x = Number(k.has("ArrowRight") || k.has("d"))-Number(k.has("ArrowLeft") || k.has("a"));
        let y = Number(k.has("ArrowDown") || k.has("s"))-Number(k.has("ArrowUp") || k.has("w"));
        if(x || y) target.current = null;
        else if(target.current) { const dx = target.current.x-body.position.x; const dy = target.current.y-body.position.y; const dist = Math.hypot(dx,dy); if(dist>5) {x=dx/dist;y=dy/dist;} else target.current = null; }
        if(x || y) ab.dir = {x,y};
        if(ab.dashReq) { ab.dashReq=false; if(isAbilityReady(now,ab.dashAt,DASH_COOLDOWN)) { ab.dashAt=now; ab.dir=dashDirection(x,y,ab.dir); } }
        if(ab.jumpReq) { ab.jumpReq=false; if(isAbilityReady(now,ab.jumpAt,JUMP_COOLDOWN)) ab.jumpAt=now; }
        const speed = movementSpeed(now,ab.dashAt);
        const dashing = speed > 6;
        const v = dashing ? dashDirection(x,y,ab.dir) : {x,y};
        Matter.Body.setVelocity(body,{x:v.x*speed,y:v.y*speed});
        Matter.Engine.update(engine,Math.min(now-last,32)); last=now;
        Matter.Body.setPosition(body,{x:clampPosition(body.position.x,window.innerWidth),y:clampPosition(body.position.y,window.innerHeight)});
        const lift = jumpOffset(now,ab.jumpAt,reduced ? JUMP_HEIGHT/3 : JUMP_HEIGHT);
        const el = playerRef.current;
        if(el) {
          el.style.transform = `translate3d(${body.position.x-32}px,${body.position.y-32-lift}px,0) rotate(${x*8}deg)${dashing && !reduced ? " scale(1.08,.94)" : ""}`;
          el.classList.toggle("dashing",dashing); el.classList.toggle("jumping",lift>0);
        }
        dashRingRef.current?.style.setProperty("--cd",String(cooldownFraction(now,ab.dashAt,DASH_COOLDOWN)));
        jumpRingRef.current?.style.setProperty("--cd",String(cooldownFraction(now,ab.jumpAt,JUMP_COOLDOWN)));
        sparkSpots.forEach((spot,i) => {if(!found.has(i) && isSparkCollected(body.position,spot)) {found.add(i);setCollected([...found]);}});
        frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    });
    return () => {stopped=true;cancelAnimationFrame(frame);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("pointerdown",click);window.removeEventListener("blur",blur);keys.current.clear();abilities.current.dashReq=false;abilities.current.jumpReq=false;};
  },[active,round]);
  const start = () => {setCollected([]);setRound(v=>v+1);setActive(true);};
  return <>
    {active && <div className="game-layer" aria-label="Doodle playground">
      {spots.map((p,i)=> !collected.includes(i) && <div key={i} className="game-spark" style={{left:p.x,top:p.y}}><Sparkles size={23}/></div>)}
      <div ref={playerRef} className="game-player" data-testid="player"><StickMan happy={won}/></div>
    </div>}
    <aside className={`play-dock ${active ? "playing" : ""}`} data-game-controls>
      <div className="dock-logo"><Doodle happy={won}/></div>
      <div className="dock-copy"><span className="dock-eyebrow">{active ? (won ? "MISSION COMPLETE" : "A LITTLE ADVENTURE") : "OUR LOGO HAS OTHER PLANS"}</span><strong>{active ? (won ? "You found your spark." : "Find the five sparks.") : "All work? Not quite."}</strong></div>
      {active ? <><span className="game-score" aria-live="polite">{won ? <Check size={17}/> : <Sparkles size={15}/>} {collected.length} / {SPARK_COUNT}</span><Button variant="ghost" size="icon" title="Restart adventure" aria-label="Restart adventure" onClick={start}><RotateCcw/></Button><Button variant="ghost" size="icon" title="Close game" aria-label="Close game" onClick={()=>setActive(false)}><X/></Button></> : <Button className="play-button" onClick={start} title="Move with arrow keys or WASD, or tap anywhere"><Gamepad2/> Let’s play <ArrowRight/></Button>}
    </aside>
    {active && !won && <div className="game-controls" data-game-controls>
      <p className="controls-hint" id="controls-hint"><kbd>WASD</kbd>/<kbd>↑↓←→</kbd> move · <kbd>Shift</kbd>/<kbd>Space</kbd> dash · <kbd>J</kbd> jump</p>
      <div className="ability-row">
        <Button variant="outline" className="ability-button" aria-label="Dash (Shift or Space)" aria-describedby="controls-hint" onPointerDown={e=>{e.preventDefault();abilities.current.dashReq=true;}} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();abilities.current.dashReq=true;}}}><span ref={dashRingRef} className="cooldown-ring" aria-hidden="true"/><Zap/> Dash</Button>
        <Button variant="outline" className="ability-button" aria-label="Jump (J)" aria-describedby="controls-hint" onPointerDown={e=>{e.preventDefault();abilities.current.jumpReq=true;}} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();abilities.current.jumpReq=true;}}}><span ref={jumpRingRef} className="cooldown-ring" aria-hidden="true"/><ChevronsUp/> Jump</Button>
      </div>
      <div className="direction-pad">{[["ArrowUp",ArrowUp],["ArrowLeft",ArrowLeft],["ArrowDown",ArrowDown],["ArrowRight",ArrowRight]].map(([key,Icon])=>{const Arrow = Icon as typeof ArrowUp;return <Button key={String(key)} variant="outline" size="icon" aria-label={`Move ${String(key).replace("Arrow","").toLowerCase()}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(String(key));}} onPointerUp={()=>keys.current.delete(String(key))} onPointerCancel={()=>keys.current.delete(String(key))} onLostPointerCapture={()=>keys.current.delete(String(key))}><Arrow/></Button>;})}</div>
    </div>}
  </>;
}
