import {} from "react";
import { Background } from "./DottedBackground";

export function NoResults({ className, content }) {
  return (
    <div
      className={`${className}`}
    >
      <div className="z-20">{content}</div>
    </div>
  );
}
