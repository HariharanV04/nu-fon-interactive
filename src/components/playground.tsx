import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Gamepad2, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doodle } from "./doodle";
import { StickMan } from "./stickman";
import { clampPosition, isSparkCollected, SPARK_COUNT } from "@/lib/game";

export function Playground() {
  const [active, setActive] = useState(false);
  const [collected, setCollected] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [spots, setSpots] = useState<{x:number;y:number}[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);
  const keys = useRef(new Set<string>());
  const target = useRef<{x:number;y:number}|null>(null);
  const won = collected.length === SPARK_COUNT;
  useEffect(() => {
    if (!active) return;
    let stopped = false;
    let frame = 0;
    const found = new Set<number>();
    const sparkSpots = [{x:.18,y:.26},{x:.78,y:.21},{x:.52,y:.43},{x:.85,y:.68},{x:.25,y:.72}].map(p => ({x:p.x*window.innerWidth,y:p.y*window.innerHeight}));
    setSpots(sparkSpots);
    keys.current.clear(); target.current = null;
    const down = (e: KeyboardEvent) => { if (e.key === "Escape") {setActive(false);return;} if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)) {e.preventDefault();keys.current.add(e.key);} };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    const click = (e: PointerEvent) => { if ((e.target as HTMLElement).closest("button,a,input,[data-game-controls]")) return; target.current = {x:e.clientX,y:e.clientY}; };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown",down); window.addEventListener("keyup",up); window.addEventListener("pointerdown",click); window.addEventListener("blur",blur);
    import("matter-js").then(({default: Matter}) => {
      if (stopped) return;
      const engine = Matter.Engine.create({gravity:{x:0,y:0,scale:0}});
      const body = Matter.Bodies.circle(48,46,24,{frictionAir:.15});
      Matter.Composite.add(engine.world,body);
      let last = performance.now();
      const tick = (now:number) => {
        if(stopped) return;
        const k = keys.current;
        let x = Number(k.has("ArrowRight") || k.has("d"))-Number(k.has("ArrowLeft") || k.has("a"));
        let y = Number(k.has("ArrowDown") || k.has("s"))-Number(k.has("ArrowUp") || k.has("w"));
        if(x || y) target.current = null;
        else if(target.current) { const dx = target.current.x-body.position.x; const dy = target.current.y-body.position.y; const dist = Math.hypot(dx,dy); if(dist>5) {x=dx/dist;y=dy/dist;} else target.current = null; }
        Matter.Body.setVelocity(body,{x:x*6,y:y*6});
        Matter.Engine.update(engine,Math.min(now-last,32)); last=now;
        Matter.Body.setPosition(body,{x:clampPosition(body.position.x,window.innerWidth),y:clampPosition(body.position.y,window.innerHeight)});
        if(playerRef.current) playerRef.current.style.transform = `translate3d(${body.position.x-32}px,${body.position.y-32}px,0) rotate(${x*8}deg)`;
        sparkSpots.forEach((spot,i) => {if(!found.has(i) && isSparkCollected(body.position,spot)) {found.add(i);setCollected([...found]);}});
        frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    });
    return () => {stopped=true;cancelAnimationFrame(frame);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("pointerdown",click);window.removeEventListener("blur",blur);keys.current.clear();};
  },[active,round]);
  const start = () => {setCollected([]);setRound(v=>v+1);setActive(true);};
  return <>
    {active && <div className="game-layer" aria-label="Doodle playground">
      {spots.map((p,i)=> !collected.includes(i) && <div key={i} className="game-spark" style={{left:p.x,top:p.y}}><Sparkles size={23}/></div>)}
      <div ref={playerRef} className="game-player" data-testid="player"><Doodle happy={won}/></div>
    </div>}
    <aside className={`play-dock ${active ? "playing" : ""}`} data-game-controls>
      <div className="dock-logo"><Doodle happy={won}/></div>
      <div className="dock-copy"><span className="dock-eyebrow">{active ? (won ? "MISSION COMPLETE" : "A LITTLE ADVENTURE") : "OUR LOGO HAS OTHER PLANS"}</span><strong>{active ? (won ? "You found your spark." : "Find the five sparks.") : "All work? Not quite."}</strong></div>
      {active ? <><span className="game-score" aria-live="polite">{won ? <Check size={17}/> : <Sparkles size={15}/>} {collected.length} / {SPARK_COUNT}</span><Button variant="ghost" size="icon" title="Restart adventure" aria-label="Restart adventure" onClick={start}><RotateCcw/></Button><Button variant="ghost" size="icon" title="Close game" aria-label="Close game" onClick={()=>setActive(false)}><X/></Button></> : <Button className="play-button" onClick={start} title="Move with arrow keys or WASD, or tap anywhere"><Gamepad2/> Let’s play <ArrowRight/></Button>}
    </aside>
    {active && !won && <div className="direction-pad" data-game-controls>{[["ArrowUp",ArrowUp],["ArrowLeft",ArrowLeft],["ArrowDown",ArrowDown],["ArrowRight",ArrowRight]].map(([key,Icon])=>{const Arrow = Icon as typeof ArrowUp;return <Button key={String(key)} variant="outline" size="icon" aria-label={`Move ${String(key).replace("Arrow","").toLowerCase()}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(String(key));}} onPointerUp={()=>keys.current.delete(String(key))} onPointerCancel={()=>keys.current.delete(String(key))}><Arrow/></Button>;})}</div>}
  </>;
}