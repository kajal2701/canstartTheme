import { useState, useRef } from "react";
import Button from "@/components/ui/Button";

export default function ImageAnnotationTextBox({ image }) {
  const [boxes, setBoxes] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [scale, setScale] = useState(1);

  const containerRef = useRef();
  const dragId = useRef(null);

  // ================= ADD BOX ON  CLICK =================
  const handleAddText = () => {
    if (!inputValue) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = rect.width / (15 * scale);
    const y = rect.height / (15 * scale);

    console.log(x, "x");
    console.log(y, "y");

    const newBox = {
      id: Date.now(),
      value: inputValue,
      x,
      y,
    };

    setBoxes((prev) => [...prev, newBox]);
    setRemoved([]);
    setInputValue("");
  };

  // ================= DRAG START =================
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    dragId.current = id;
  };

  // ================= DRAG MOVE =================
  const handleMouseMove = (e) => {
    if (!dragId.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setBoxes((prev) =>
      prev.map((box) => (box.id === dragId.current ? { ...box, x, y } : box)),
    );
  };

  const handleMouseUp = () => {
    dragId.current = null;
  };

  // ================= REMOVE =================
  const handleRemove = (id) => {
    const boxToRemove = boxes.find((b) => b.id === id);
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    setRemoved((prev) => [...prev, boxToRemove]);
  };

  // ================= UNDO =================
  const handleUndo = () => {
    if (boxes.length === 0) return;

    const updated = [...boxes];
    const removedBox = updated.pop();

    setBoxes(updated);
    setRemoved((prev) => [...prev, removedBox]);
  };

  // ================= REDO =================
  const handleReverse = () => {
    if (removed.length === 0) return;

    const updated = [...removed];
    const restored = updated.pop();

    setBoxes((prev) => [...prev, restored]);
    setRemoved(updated);
  };

  // ================= ZOOM =================
  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));

  // ================= SAVE =================
  const handleSave = () => {
    const svg = containerRef.current.querySelector("svg");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "annotation.svg";
    link.click();
  };

  return (
    <div>
      {/* ================= TOOLBAR ================= */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          padding: "10px",
          background: "#f3f4f6",
          marginBottom: "10px",
        }}
      >
        {/* INPUT FIELD */}
        <input
          type="text"
          placeholder="Enter number"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.-]/g, "");
            setInputValue(value);
          }}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "120px",
          }}
        />

        <Button
          text="Add Text"
          className="btn-secondary"
          onClick={handleAddText}
        />
        <Button
          onClick={handleUndo}
          icon="ph:arrow-clockwise"
          className="btn-warning h-9 w-9 rounded-full p-0"
        />
        <Button
          onClick={handleReverse}
          icon="ph:arrow-counter-clockwise"
          className="btn-warning h-9 w-9 rounded-full p-0"
        />
        <Button
          onClick={zoomOut}
          icon="ph:magnifying-glass-minus"
          className="btn-danger h-9 w-9 p-0"
        />
        <Button
          onClick={zoomIn}
          icon="ph:magnifying-glass-plus"
          className="btn-danger h-9 w-9 p-0"
        />
        <Button text="Save" className="btn-secondary" onClick={handleSave} />
      </div>

      {/* ================= IMAGE CONTAINER ================= */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "inline-block",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          cursor: "crosshair",
        }}
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
          {boxes.map((box) => (
            <foreignObject
              key={box.id}
              x={box.x}
              y={box.y}
              width="1"
              height="1"
              style={{ overflow: "visible" }}
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, box.id)}
                style={{
                  position: "relative",
                  background: "#f3f4f6",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  fontWeight: "bold",
                  cursor: "move",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  display: "inline-block", // Important: shrink to content
                  minWidth: "30px",
                }}
              >
                {box.value}

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(box.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "white",
                    border: "1px solid red",
                    color: "red",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ×
                </span>
              </div>
            </foreignObject>
          ))}
        </svg>
      </div>
    </div>
  );
}
