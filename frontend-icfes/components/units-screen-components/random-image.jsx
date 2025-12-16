import React, { useState, useEffect } from "react";

const urls_izquierdas = [
  "https://res.cloudinary.com/dulrdwjul/image/upload/v1765248171/Gemini_Generated_Image_gc42dkgc42dkgc42__20251208213653_wu37wy.png",
  "https://res.cloudinary.com/dulrdwjul/image/upload/v1765248172/Gemini_Generated_Image_v61wftv61wftv61w_20251208213453_suiyt4.png",
  "https://res.cloudinary.com/dulrdwjul/image/upload/v1765248171/Gemini_Generated_Image_vfcaqlvfcaqlvfca_20251208130510_k2ifvu.png",
];

const urls_derechas = [
  "https://res.cloudinary.com/dulrdwjul/image/upload/v1765248591/Gemini_Generated_Image_cc0dxmcc0dxmcc0d_20251208130956_ltd2rx.png",
  "https://res.cloudinary.com/dulrdwjul/image/upload/v1765248171/Gemini_Generated_Image_xtpy7lxtpy7lxtpy_20251208213854_ydwnkb.png",
];

let leftIndex = 0;
let rightIndex = 0;

export function RandomImage({ snakeClass }) {
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    if (snakeClass === "-translate-x-34") {
      setCurrentUrl(urls_derechas[rightIndex]);
      rightIndex = (rightIndex + 1) % urls_derechas.length;
    } else {
      setCurrentUrl(urls_izquierdas[leftIndex]);
      leftIndex = (leftIndex + 1) % urls_izquierdas.length;
    }
  }, [snakeClass]);

  if (!currentUrl) {
    return null;
  }

  return <img src={currentUrl} alt="Ordered" className="h-3xs max-h-52" />;
}