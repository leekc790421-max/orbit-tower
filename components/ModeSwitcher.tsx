"use client";

import { BookOpen, Globe2 } from "lucide-react";

export type ViewMode = "classic" | "spatial";

interface ModeSwitcherProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher" role="group" aria-label="閱讀模式切換">
      <button type="button" className={mode === "classic" ? "is-active" : ""} aria-pressed={mode === "classic"} onClick={() => onChange("classic")} title="經典平面／報紙模式">
        <BookOpen size={13} aria-hidden="true" /><span>2D 報紙</span>
      </button>
      <button type="button" className={mode === "spatial" ? "is-active" : ""} aria-pressed={mode === "spatial"} onClick={() => onChange("spatial")} title="3D 沉浸空間模式">
        <Globe2 size={13} aria-hidden="true" /><span>3D 空間</span>
      </button>
    </div>
  );
}
