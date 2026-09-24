import { useEffect, useState } from "react";

const STORAGE_KEY = "latexly-history";
const MAX_ENTRIES = 30;
const THUMB_WIDTH = 224;
const THUMB_HEIGHT = 112;

function readHistory() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(entries)) return [];
    return entries.filter(
      (entry) => typeof entry?.id === "string" && typeof entry.latex === "string" && Number.isFinite(entry.createdAt)
    );
  } catch (err) {
    console.error("Failed to read history:", err);
    return [];
  }
}

function writeHistory(entries) {
  try {
    if (entries.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error("Failed to save history:", err);
  }
}

// Downscale the uploaded image to a small JPEG data URL so storage stays small
async function makeThumbnail(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const scale = Math.min(1, THUMB_WIDTH / img.naturalWidth, THUMB_HEIGHT / img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // JPEG has no alpha, so flatten transparent PNGs onto white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function useHistory() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Read storage after mount so the server render and first client render match
  useEffect(() => {
    setEntries(readHistory());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) writeHistory(entries);
  }, [entries, loaded]);

  const addEntry = async (latex, file) => {
    let thumbnail = null;
    try {
      if (file) thumbnail = await makeThumbnail(file);
    } catch (err) {
      console.error("Failed to create thumbnail:", err);
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      latex,
      thumbnail,
      createdAt: Date.now(),
    };
    setEntries((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  };

  const removeEntry = (id) => setEntries((prev) => prev.filter((entry) => entry.id !== id));

  const clearEntries = () => setEntries([]);

  return { entries, addEntry, removeEntry, clearEntries };
}
