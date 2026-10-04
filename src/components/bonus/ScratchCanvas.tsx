import { useCallback, useEffect, useRef, useState } from "react";

export function ScratchCanvas({
  disabled,
  onComplete,
}: {
  disabled: boolean;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const completed = useRef(false);
  const [hint, setHint] = useState("SCRATCH TO REVEAL");

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#5b6478");
    gradient.addColorStop(1, "#2c3344");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f4d27a";
    ctx.font = "bold 16px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", canvas.width / 2, canvas.height / 2);
  }, []);

  useEffect(() => {
    if (completed.current) return;
    paintCover();
    setHint("SCRATCH TO REVEAL");
  }, [paintCover]);

  function scratchAt(clientX: number, clientY: number) {
    if (disabled || completed.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < sample.length; i += 16) {
      const alpha = sample[i] ?? 255;
      if (alpha < 40) cleared += 1;
    }
    const total = sample.length / 16;
    if (cleared / total > 0.45) {
      completed.current = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHint("");
      onComplete();
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <canvas
        ref={canvasRef}
        width={360}
        height={180}
        className="relative z-10 h-44 w-full cursor-crosshair touch-none"
        onPointerDown={(event) => {
          scratching.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          scratchAt(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (scratching.current) scratchAt(event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          scratching.current = false;
        }}
      />
      {hint ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-2 z-20 text-center text-[10px] font-bold text-primary-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
