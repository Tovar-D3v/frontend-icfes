import React, { useRef, useState, useLayoutEffect, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function detectColumn(opcionTexto) {
  if (!opcionTexto) return null;
  const t = opcionTexto.toLowerCase();
  if (t.includes("col-start-1")) return 1;
  if (t.includes("col-start-2")) return 2;
  return null;
}

export default function Relacion({
  opciones = [],
  showFeedback,
  onSelectAnswer,
  onPairsChange,
  validacionRespuesta
}) {
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const [connections, setConnections] = useState([]);
  const [pendiente, setPendiente] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const l = [];
    const r = [];
    opciones.forEach((op, idx) => {
      const col = detectColumn(op.texto);
      if (col === 1) l.push({ op, idx });
      else if (col === 2) r.push({ op, idx });
      else {
        const mitad = Math.ceil(opciones.length / 2);
        if (idx < mitad) l.push({ op, idx });
        else r.push({ op, idx });
      }
    });
    setLeft(l);
    setRight(r);
  }, [opciones]);

  const recomputePositions = () => {
    const newPos = {};
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) {
      setPositions(newPos);
      return;
    }

    Object.entries(leftRefs.current).forEach(([k, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      newPos[`L-${k}`] = {
        x: r.left - containerRect.left + r.width,
        y: r.top - containerRect.top + r.height / 2,
      };
    });
    Object.entries(rightRefs.current).forEach(([k, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      newPos[`R-${k}`] = {
        x: r.left - containerRect.left,
        y: r.top - containerRect.top + r.height / 2,
      };
    });
    setPositions(newPos);
  };

  useLayoutEffect(() => {
    recomputePositions();
    const onResize = () => recomputePositions();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [left, right, connections]);

  const handleItemClick = (side, idx) => {
    if (showFeedback) return;

    if (!pendiente) {
      setPendiente({ side, idx });
      setHovered(null);
      return;
    }

    if (pendiente.side === side && pendiente.idx === idx) {
      setPendiente(null);
      return;
    }

    const leftIdx = pendiente.side === "left" ? pendiente.idx : idx;
    const rightIdx = pendiente.side === "right" ? pendiente.idx : idx;

    const exists = connections.find(
      (c) => c.leftIdx === leftIdx && c.rightIdx === rightIdx
    );
    if (exists) {
      setConnections((prev) => prev.filter((c) => c.id !== exists.id));
    } else {
      const id = `${leftIdx}-${rightIdx}-${Date.now()}`;
      const newConn = { id, leftIdx, rightIdx };
      setConnections((prev) => [
        ...prev.filter((c) => c.leftIdx !== leftIdx && c.rightIdx !== rightIdx),
        newConn,
      ]);
    }

    setPendiente(null);
  };

  const removeConnection = (id) =>
    setConnections((prev) => prev.filter((c) => c.id !== id));

  useEffect(() => {
    if (typeof onSelectAnswer !== "function") return;
    const pairs = connections
      .map((c) => {
        const origen = opciones?.[c.leftIdx]?.id ?? null;
        const destino = opciones?.[c.rightIdx]?.id ?? null;
        if (origen == null || destino == null) return null;
        return { origen_id: origen, destino_id: destino };
      })
      .filter(Boolean);
    onSelectAnswer(pairs);
  }, [connections, opciones, onSelectAnswer]);

  useEffect(() => {
    if (typeof onPairsChange !== "function") return;
    const expected = Math.min(left.length, right.length);
    const complete = expected > 0 && connections.length === expected;
    onPairsChange(complete);
  }, [connections, left, right, onPairsChange]);

  const renderOptionButton = (item, side) => {
    const idx = item.idx;
    const isSelected =
      pendiente && pendiente.side === side && pendiente.idx === idx;
    const participates = connections.some(
      (c) => c.leftIdx === idx || c.rightIdx === idx
    );

    let stateClass = "";
    if (!showFeedback) {
      stateClass = isSelected
        ? "quiz-option-selected"
        : participates
        ? "quiz-option-default"
        : "quiz-option-default";
    } else {
      stateClass = participates ? "quiz-option-correct" : "quiz-option-disabled";
    }

    const refSetter = (el) => {
      if (side === "left") leftRefs.current[idx] = el;
      else rightRefs.current[idx] = el;
    };

    return (
      <button
        key={item.op.id ?? idx}
        ref={refSetter}
        type="button"
        onClick={() => handleItemClick(side, idx)}
        onMouseEnter={() => setHovered({ side, idx })}
        onMouseLeave={() => setHovered(null)}
        disabled={showFeedback}
        aria-pressed={isSelected}
        className={classNames(
          "quiz-option-base relative z-20 py-2 px-4 text-base",
          stateClass,
        )}
        dangerouslySetInnerHTML={{ __html: item.op.texto }}
      />
    );
  };

  const makePath = (p1, p2) => {
    if (!p1 || !p2) return "";
    const dx = Math.abs(p2.x - p1.x);
    const curvature = Math.min(200, dx * 0.5);
    return `M ${p1.x} ${p1.y} C ${p1.x + curvature} ${p1.y} ${p2.x - curvature} ${p2.y} ${p2.x} ${p2.y}`;
  };

  return (
    <div ref={containerRef} className="relative mt-5">
      <svg
        className="absolute inset-0 w-full h-full z-10"
        style={{ overflow: "visible" }}
      >
        {connections.map((c) => {
          const p1 = positions[`L-${c.leftIdx}`];
          const p2 = positions[`R-${c.rightIdx}`];
          const d = makePath(p1, p2);
          if (!d) return null;
          return (
            <g key={c.id}>
              <path
                d={d}
                stroke={"#06b6d4"}
                strokeWidth={5}
                fill="none"
                style={{
                  transition: "stroke 120ms, stroke-width 120ms",
                  pointerEvents: "auto",
                }}
                onClick={() => removeConnection(c.id)}
                title="Haz clic para quitar la conexión"
              />
            </g>
          );
        })}
        {pendiente &&
          hovered &&
          pendiente.side !== hovered.side &&
          (() => {
            const p1 =
              positions[
                `L-${pendiente.side === "left" ? pendiente.idx : hovered.idx}`
              ];
            const p2 =
              positions[
                `R-${pendiente.side === "right" ? pendiente.idx : hovered.idx}`
              ];
            const d = makePath(p1, p2);
            if (!d) return null;
            return (
              <path
                key="temp"
                d={d}
                stroke="#60a5fa"
                strokeWidth={4}
                strokeDasharray="8 6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: "none", transition: "stroke 120ms" }}
              />
            );
          })()}
      </svg>

      <div className="grid grid-cols-2 gap-x-20 gap-y-5">
        <div className="flex flex-col space-y-5">
          {left.map((item) => renderOptionButton(item, "left"))}
        </div>
        <div className="flex flex-col space-y-5">
          {right.map((item) => renderOptionButton(item, "right"))}
        </div>
      </div>
    </div>
  );
}