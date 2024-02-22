import { useEffect, useRef } from "react";

export function StrokeText({
  text = "",
  sz = 1,
  fillColor = "white",
  strokeColor = "black",
}) {
  const divRef = useRef();

  useEffect(() => {
    divRef.current.style.webkitTextStroke = `${sz}px ${strokeColor}`
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        display: "inline-block",
        color: `${fillColor}`,
        textStroke: `${sz}px ${strokeColor}`,
      }}
    >
      {text}
    </div>
  );
}
