import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Asterisk, Command, Layers3, MousePointer2, Orbit, PenTool, Sparkles, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doodle } from "@/components/doodle";
import { Playground } from "@/components/playground";
import heroImage from "@/assets/studio-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Nu Fon! — Serious about the unexpected" },
    { name: "description", content: "Nu Fon! is an independent creative studio for brands and digital experiences. Explore our world with our wandering doodle logo." },
    { property: "og:title", content: "Nu Fon! — Serious about the unexpected" },
    { property: "og:description", content: "Fresh thinking. Thoughtful design. A little unexpected. Meet the creative world of Nu Fon!" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});
const services = [
  { icon: PenTool, title: "Brand, with character.", description: "Identities that feel like you. From the first idea to the smallest detail, we make brands worth remembering." },
  { icon: MousePointer2, title: "Digital, with feeling.", description: "Websites and experiences that connect. Thoughtfully built to be useful, intuitive, and anything but ordinary." },
  { icon: Sparkles, title: "Ideas, with possibility.", description: "A fresh perspective on what’s next. We help ambitious businesses turn a good question into a great beginning." },
];
function Index() {
  return <>
    <header className="site-header"><a className="brand" href="#home" aria-label="Nu Fon! home"><Doodle/>Nu Fon!</a><nav className="nav-links" aria-label="Main navigation"><a href="#about">About us</a><a href="#services">What we do</a><a href="#work">Our work</a></nav><Button asChild className="header-cta"><a href="#contact">Let’s talk <ArrowUpRight/></a></Button></header>
    <main>
      <section className="hero" id="home"><img className="hero-image" src={heroImage} width={1536} height={1024} alt="A playful sculptural blue flower, created for the Nu Fon! studio"/><div className="hero-inner"><div className="eyebrow"><span className="status-dot"/> INDEPENDENT MINDS. SHARED AMBITION.</div><h1>Nu Fon!<br/>Serious about<br/>the <span>unexpected.</span></h1><p>We’re a creative company making brands and digital experiences a little more human.<br/>And a lot less ordinary.</p><div className="hero-actions"><Button asChild><a href="#work">Explore our work <ArrowUpRight/></a></Button><Button variant="ghost" className="text-action" asChild><a href="#about">Meet Nu Fon! <ArrowRight/></a></Button></div><div className="hero-note"><Asterisk size={17}/> A little curiosity goes a long way.</div></div><div className="hero-caption"><span>FRESH THINKING, IN FULL BLOOM.</span><span>© NU FON!</span></div></section>
      <section className="clients" aria-label="Creative company community"><div className="clients-label">GOOD COMPANY.<br/>GREAT POSSIBILITIES.</div><div className="client-logos"><span><Orbit size={23}/> orbit</span><span className="italic-logo">Layers</span><span><Triangle size={18} fill="currentColor"/> Quotient</span><span className="mono-logo"><Command size={19}/> Circooles</span><span>✳ Sisyphus</span></div></section>
      <section className="section" id="services"><div className="section-top"><div><div className="eyebrow">01 / WHAT WE DO</div><h2>Good thinking.<br/>Even better doing.</h2></div><p>Strategy meets imagination. Design meets purpose.<br/>We bring the right things together.</p></div><div className="services-grid">{services.map(({icon:Icon,title,description},i)=><article className="service" key={title}><div className="service-header"><div className="service-icon"><Icon size={20}/></div><span className="service-number">0{i+1}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section className="section work-section" id="work"><div className="section-top"><div><div className="eyebrow">02 / SELECTED EXPLORATIONS</div><h2>A different kind of familiar.</h2></div><p>A glimpse into our world.<br/>New perspectives. Unexpected connections.</p></div><div className="project-grid"><article className="project"><div className="project-image"><img src={heroImage} loading="lazy" width={1536} height={1024} alt="Full Bloom blue sculptural brand exploration"/></div><div className="project-info"><div><h3>Full Bloom</h3><p>BRAND EXPLORATION / ART DIRECTION</p></div><ArrowUpRight className="project-symbol" size={20}/></div></article><article className="project"><div className="project-image studio-project"><Doodle className="project-doodle" happy/><span className="studio-project-name">Small spark.<br/>Big possibilities.</span></div><div className="project-info"><div><h3>The curious company</h3><p>IDENTITY / DIGITAL EXPERIENCE</p></div><ArrowUpRight className="project-symbol" size={20}/></div></article></div></section>
      <section className="section about-section" id="about"><div><div className="eyebrow">03 / HELLO, WE’RE NU FON!</div><h2>Professional by nature.<br/>Playful by choice.</h2></div><div><span className="about-line">The best work starts with a little curiosity.</span><p>We’re an independent creative company with a shared belief: thoughtful work doesn’t have to play it safe. We combine clear thinking, a collaborative spirit, and a healthy appetite for the unexpected.</p><p>It’s how we work. It’s who we are.</p></div></section>
      <section className="contact-section" id="contact"><div><h2>What’s on your mind?</h2><p>A new idea. A fresh start. Something we haven’t thought of yet.</p></div><Button asChild className="contact-button"><a href="mailto:hello@nufon.example">Let’s start a conversation <ArrowUpRight/></a></Button></section>
    </main>
    <footer className="footer"><a href="#home" className="brand"><Doodle/>Nu Fon!</a><p>© 2026 Nu Fon!<br/>A little less ordinary.</p></footer>
    <Playground/>
  </>;
}
