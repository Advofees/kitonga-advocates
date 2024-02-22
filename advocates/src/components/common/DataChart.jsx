import { useState, useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export function DataChart({ plot_data }) {
  const canvasRef = useRef();

  const wrapperRef = useRef();

  const [canvasRefresher, setCanvasRefresher] = useState(0);

  Chart.defaults.color = "black";
  Chart.defaults.font = {
    size: 12, // Set the font size (in pixels)
    weight: "bold", // Set the font weight to bold
    family: "'Arial', sans-serif", // Set the font family
  };

  async function loadChart(data) {
    new Chart(canvasRef.current, {
      type: data.graph_type ? data.graph_type : "line",
      options: {
        ...data.options,
        responsive: true,
        elements: {
          line: {
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ...data.options?.scales?.x,
          },
          y: {
            beginAtZero: false,
            suggestedMax: 10,
            ...data.options?.scales?.y,
          },
          ...data.options?.scales,
        },
        animations: {
          tension: {
            duration: 1000,
            easing: "easeInOutCubic",
            from: 1,
            to: 0,
          },
          ...data.options?.animations,
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
          },
          ...data.options?.plugins,
        },
      },
      data: data.data,
    });
  }

  window.addEventListener("resize", () => {
    setCanvasRefresher(canvasRefresher + 1);
  });

  function createCanvas() {
    // Remove the current canvas
    if (canvasRef.current) {
      canvasRef.current.remove();
    }
    // Create a new canvas
    const canvas = document.createElement("canvas");
    canvas.style.backgroundColor = "transparent";
    canvas.width = wrapperRef.current.offsetWidth;
    if (plot_data.dimensionRatio) {
      if (parseFloat(plot_data.dimensionRatio)) {
        canvas.height =
          wrapperRef.current.offsetWidth * parseFloat(plot_data.dimensionRatio);
      }
    }
    wrapperRef.current.appendChild(canvas);
    canvasRef.current = canvas;
  }

  useEffect(() => {
    createCanvas();
    loadChart(plot_data);
  }, [canvasRefresher, plot_data]);

  return (
    <div className="p-2 rounded flex-grow flex flex-col">
      <div className="text-xl dancing px-4 italic w-full">
        {plot_data.title}
      </div>
      <div ref={wrapperRef} className="flex-grow rounded-lg w-[100%]"></div>
    </div>
  );
}
