import { useEffect, useRef, useState } from "react";

export function Progress({
  percentage = 60,
  width = 20,
  completeColor = "white",
  incompleteColor = "transparent",
  innerClassName = "",
}) {
  const canvasWrapper = useRef();
  const canvasRef = useRef();
  const [canvasRefresher, setCanvasRefresher] = useState(0);
  const textDiv = useRef();

  const [count, setCount] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setCanvasRefresher((p) => p + 1);
    });
  }, []);

  const createCanvas = () => {
    // Create a new canvas
    const canvas = document.createElement("canvas");
    if (canvasRef.current) {
      canvasRef.current.remove();
    }

    // Make the canvas' background transparent
    canvas.style.backgroundColor = "transparent";
    canvas.style.transform = "rotate(-90deg)";
    canvas.width = canvasWrapper.current.offsetWidth;
    canvas.height = canvasWrapper.current.offsetWidth;
    canvasWrapper.current.appendChild(canvas);
    canvasRef.current = canvas;
  };

  const circleProgress = ({ radius, ctx, start, strokeColor }) => {
    ctx.lineWidth = width;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, (start / 100) * 2 * Math.PI);
    ctx.stroke();
  };

  useEffect(() => {
    let start = 0;
    createCanvas();
    textDiv.current.style.fontSize = `${
      (canvasWrapper.current.offsetWidth / 85) * 100
    }%`;

    circleProgress({
      ctx: canvasRef.current.getContext("2d"),
      start: 100,
      strokeColor: incompleteColor,
      radius: canvasRef.current.width / 2,
    });

    const interval = setInterval(() => {
      if (start > percentage) {
        clear();
        return;
      }

      setCount(Math.round(start));

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      circleProgress({
        ctx: canvasRef.current.getContext("2d"),
        start: start,
        strokeColor: completeColor,
        radius: canvasRef.current.width / 2,
      });

      start += 0.1;
    }, 1);

    const clear = () => {
      clearInterval(interval);
    };

    return clear;
  }, [percentage, width, completeColor, incompleteColor, canvasRefresher]);

  return (
    <div className="relative overflow-hidden rounded-full" ref={canvasWrapper}>
      <div
        ref={textDiv}
        className={`absolute inset-0 flex items-center justify-center ${innerClassName}`}
      >
        {count}%
      </div>
    </div>
  );
}
