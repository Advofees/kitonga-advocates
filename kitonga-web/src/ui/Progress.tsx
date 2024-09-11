import { useEffect, useRef, useState } from "react";

export interface ProgressProps {
  percentage?: number;
  width?: number;
  completeColor?: string;
  incompleteColor?: string;
  innerClassName?: string;
}

export function Progress({
  percentage = 60,
  width = 20,
  completeColor = "white",
  incompleteColor = "transparent",
  innerClassName = "",
}: ProgressProps) {
  const canvasWrapper = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasRefresher, setCanvasRefresher] = useState(0);
  const textDiv = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setCanvasRefresher((p) => p + 1);
    });
  }, []);

  const getCanvas = () => {
    // Create a new canvas
    const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasWrapperDiv: HTMLDivElement =
      canvasWrapper.current as HTMLDivElement;

    // Make the canvas' background transparent
    canvas.width = canvasWrapperDiv.offsetWidth;
    canvas.height = canvasWrapperDiv.offsetWidth;

    return { canvas, div: canvasWrapperDiv };
  };

  const circleProgress = ({
    radius,
    ctx,
    start,
    strokeColor,
  }: {
    radius: number;
    ctx: CanvasRenderingContext2D | null;
    start: number;
    strokeColor: string;
  }) => {
    if (ctx) {
      ctx.lineWidth = width;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, (start / 100) * 2 * Math.PI);
      ctx.stroke();
    }
  };

  useEffect(() => {
    let start = percentage;

    const { canvas, div } = getCanvas();

    textDiv.current!.style.fontSize = `${(div.offsetWidth / 85) * 100}%`;

    setCount(Math.round(start));

    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);

    circleProgress({
      ctx: context,
      start: 100,
      strokeColor: incompleteColor,
      radius: Math.min(canvas.width, canvas.height) / 2,
    });

    circleProgress({
      ctx: context,
      start: start,
      strokeColor: completeColor,
      radius: Math.min(canvas.width, canvas.height) / 2,
    });
  }, [percentage, width, completeColor, incompleteColor, canvasRefresher]);

  return (
    <div className="relative overflow-hidden rounded-full" ref={canvasWrapper}>
      <div
        ref={textDiv}
        className={`absolute inset-0 flex items-center justify-center ${innerClassName}`}
      >
        {count}%
      </div>
      <canvas
        style={{
          background: "transparent",
          transform: "rotate(-90deg)",
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
