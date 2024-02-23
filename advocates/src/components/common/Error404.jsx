import React from "react";
import errorSvg from "./error.svg";

function Error404({ children, className, imageClassName }) {
  return (
    <div className={`${className}`}>
      <div className={`${imageClassName}`}>
        <img src={errorSvg} />
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

export default Error404;
