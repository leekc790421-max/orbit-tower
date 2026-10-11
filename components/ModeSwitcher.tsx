"use client";

export type ViewMode = "classic" | "spatial";

interface ModeSwitcherProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher" role="group" aria-label="網站模式">
      <button type="button" className={mode === "classic" ? "is-active" : ""} aria-pressed={mode === "classic"} onClick={() => onChange("classic")} title="網站首頁">
        <span>網站</span>
      </button>
      <button type="button" className={mode === "spatial" ? "is-active" : ""} aria-pressed={mode === "spatial"} onClick={() => onChange("spatial")} title="開啟 3D 空間">
        <span>3D</span>
      </button>
    </div>
  );
}
