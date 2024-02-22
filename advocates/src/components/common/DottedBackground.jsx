export function Background({ className = "", background = "rgba(245, 124, 15, .8)" }) {
  
  return (
    <div style={{position: "absolute", inset: 0, opacity: 1, zIndex: 5}} className={`${className}`}>
      <svg
        version="1.1"
        baseProfile="full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={background} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>
  );
}
