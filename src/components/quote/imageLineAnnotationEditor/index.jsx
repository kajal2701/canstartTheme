import { useState, useRef } from "react";
import Button from "@/components/ui/Button";

export default function ImageLineAnnotationEditor({ image, onSave }) {
  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [color, setColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [scale, setScale] = useState(1);
  const [removedLines, setRemovedLines] = useState([]);
  const containerRef = useRef();

  const getCoordinates = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCoordinates(e);
    setDrawing(true);
    setCurrentLine({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      color,
      strokeWidth,
    });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { x, y } = getCoordinates(e);
    setCurrentLine((prev) => ({
      ...prev,
      x2: x,
      y2: y,
    }));
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (currentLine) {
      setLines((prev) => [...prev, currentLine]);
      setCurrentLine(null);
    }
  };

  // ✅ Undo
  const handleUndo = () => {
    setLines((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const removed = updated.pop(); // remove last line

      setRemovedLines((prevRemoved) => [...prevRemoved, removed]);

      return updated;
    });
  };

  const handleReverse = () => {
    setRemovedLines((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const restored = updated.pop();

      setLines((prevLines) => [...prevLines, restored]);

      return updated;
    });
  };

  // ✅ Zoom
  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));

  const handleSave = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Create a canvas, draw original image + SVG lines on top
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw each line scaled to natural image dimensions
      const renderedWidth = containerRef.current.offsetWidth;
      const scaleX = img.naturalWidth / renderedWidth;
      const scaleY = img.naturalHeight / containerRef.current.offsetHeight;

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1 * scaleX, line.y1 * scaleY);
        ctx.lineTo(line.x2 * scaleX, line.y2 * scaleY);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.strokeWidth * scaleX;
        ctx.stroke();
      });

      const finalImageUrl = canvas.toDataURL("image/png");

      // Send back to parent
      if (onSave) onSave(finalImageUrl);
    };
    img.src = image;
  };

  return (
    <div>
      {/* ================= HEADER TOOLBAR ================= */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          padding: "10px",
          background: "#f3f4f6",
          marginBottom: "10px",
        }}
      >
        {/* Color Picker */}
        <div>
          <label>Choose line color: </label>
          <br />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {/* Line Weight */}
        <div>
          <label>Line weight: </label>
          <br />
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </div>

        {/* Buttons */}

        <Button
          onClick={handleUndo}
          icon="ph:arrow-clockwise"
          className="btn-warning h-9 w-9 rounded-full p-0"
        />
        <Button
          onClick={handleReverse}
          icon="ph:arrow-counter-clockwise"
          className="btn-warning h-9 w-9 rounded-full p-0 "
        />
        <Button
          onClick={zoomOut}
          icon="ph:magnifying-glass-minus"
          className="btn-danger h-9 w-9  p-0"
        />
        <Button
          onClick={zoomIn}
          icon="ph:magnifying-glass-plus"
          className="btn-danger h-9 w-9  p-0"
        />
        <Button text="Save" className="btn-secondary " onClick={handleSave} />
      </div>

      {/* ================= IMAGE + SVG ================= */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-block",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          src={image}
          alt="sample"
          style={{ width: "100%", display: "block" }}
        />

        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
            />
          ))}

          {currentLine && (
            <line
              x1={currentLine.x1}
              y1={currentLine.y1}
              x2={currentLine.x2}
              y2={currentLine.y2}
              stroke={currentLine.color}
              strokeWidth={currentLine.strokeWidth}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
