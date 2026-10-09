export function StickMan({ className = "", happy = false }: { className?: string; happy?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="15" r="9.5" />
        <path d="M40 25V50" />
        {happy
          ? <path d="M40 33L23 23M40 33L57 23" />
          : <path d="M40 33L24 44M40 33L56 44" />}
        <path d="M40 50L27 72M40 50L53 72" />
      </g>
      <g className="stick-face" fill="currentColor" stroke="none">
        <circle cx="36.5" cy="13.5" r="1.7" />
        <circle cx="43.5" cy="13.5" r="1.7" />
        <path d={happy ? "M35 18Q40 24 45 18" : "M35.5 18.5Q40 21.5 44.5 18.5"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
