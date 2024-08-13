import React from "react";

export function Glass({
  onClick = () => {},
  opacity = 0.8,
  contentClassName = "",
  children,
  className = "",
  backgroundContent,
}) {
  return (
    <div
      onClick={typeof onClick === "function" ? onClick : () => {}}
      style={{ display: "flex", position: "relative" }}
      className={`${className}`}
    >
      <div className="peer flex-grow" style={{ zIndex: 2 }}>
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(20px)",
          opacity: typeof opacity === "number" ? opacity : 0.8,
          zIndex: 1,
          display: "flex",
        }}
        className={`${contentClassName}`}
      >
        {backgroundContent}
      </div>
    </div>
  );
}
