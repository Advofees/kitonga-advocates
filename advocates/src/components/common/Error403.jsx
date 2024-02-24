import React from "react";
import svg403 from "./Error-403-Forbidden-amico.svg";

function Error403({ imageClassName, className, children }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}
    >
      <div className={`w-64 h-64 ${imageClassName}`}>
        <img src={svg403} />
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

export default Error403;
