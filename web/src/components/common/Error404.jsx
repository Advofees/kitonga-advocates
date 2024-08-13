import React from "react";
import errorSvg from "./error.svg";

function Error404({ children, className, imageClassName }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center ${className}`}
    >
      <div className={`w-64 h-64 ${imageClassName}`}>
        <img src={errorSvg} />
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

export default Error404;
