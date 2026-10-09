export type UnitStatus = "available" | "occupied" | "isolated";
export type UnitFace = "A" | "B" | "C" | "D" | "E" | "F";
export type Theme = "cyber" | "cloud" | "deepsea";
export type LightColor = "amber" | "emerald" | "cyber-blue" | "aurora";

export interface Unit {
  id: string;
  code: string;
  floor: number;
  face: UnitFace;
  number: string;
  status: UnitStatus;
  brand?: string;
  service?: string;
  website?: string;
  color?: string;
}

export interface FloorData {
  floor: number;
  label: string;
  units: Unit[];
}

export const FACE_LABELS: Record<UnitFace, string> = {
  A: "科技新創",
  B: "個人品牌",
  C: "自動金流商戶",
  D: "AI 診斷專區",
  E: "GEO 搜尋品牌",
  F: "機密沙盒實案",
};

export const FACE_LABELS_EN: Record<UnitFace, string> = {
  A: "Tech Startup",
  B: "Personal Brand",
  C: "Auto Payment",
  D: "AI Diagnostics",
  E: "GEO Search",
  F: "Sandbox Ops",
};

export const STATUS_LABELS: Record<UnitStatus, string> = {
  available: "空置中",
  occupied: "已進駐",
  isolated: "保護中",
};

export const THEME_LABELS: Record<Theme, { zh: string; en: string; ja: string; icon: string }> = {
  cyber: { zh: "霓虹夜城", en: "Cyber Night", ja: "ネオンナイト", icon: "🌃" },
  cloud: { zh: "雲海日出", en: "Cloud Mountain", ja: "雲海日の出", icon: "🌄" },
  deepsea: { zh: "深海秘境", en: "Deep Sea", ja: "深海秘境", icon: "🌊" },
};

export const LIGHT_COLORS: Record<LightColor, { label: string; hex: string; css: string }> = {
  amber: { label: "琥珀金", hex: "#F5A623", css: "rgb(245,166,35)" },
  emerald: { label: "翡翠綠", hex: "#00D68F", css: "rgb(0,214,143)" },
  "cyber-blue": { label: "賽博藍", hex: "#00D4FF", css: "rgb(0,212,255)" },
  aurora: { label: "極光紫", hex: "#A855F7", css: "rgb(168,85,247)" },
};

const OCCUPIED_BRANDS: Record<string, Partial<Unit>> = {
  "101": { brand: "NeuralForge", service: "unit.service101", color: "#F5A623", status: "occupied" },
  "102": { brand: "PixelMonk", service: "unit.service102", color: "#A855F7", status: "occupied" },
  "104": { brand: "PayStream", service: "unit.service104", color: "#00D68F", status: "occupied" },
  "203": { brand: "DeepSight AI", service: "unit.service203", color: "#00D4FF", status: "occupied" },
  "205": { brand: "GeoRank", service: "unit.service205", color: "#F5A623", status: "occupied" },
  "306": { brand: "Vault-X", service: "unit.service306", color: "#FF4444", status: "isolated" },
  "402": { brand: "QuantumLeap", service: "unit.service402", color: "#A855F7", status: "occupied" },
  "405": { brand: "SkyLabs", service: "unit.service405", color: "#00D4FF", status: "occupied" },
};

export function generateFloors(): FloorData[] {
  const floors: FloorData[] = [];
  const faces: UnitFace[] = ["A", "B", "C", "D", "E", "F"];

  for (let f = 1; f <= 6; f++) {
    const units: Unit[] = faces.map((face, i) => {
      const num = `${f}0${i + 1}`;
      const occ = OCCUPIED_BRANDS[num];
      return {
        id: `TOWER-F${f}${String.fromCharCode(65 + i)}-U${String(i + 1).padStart(2, "0")}`,
        code: num,
        floor: f,
        face,
        number: `${f}0${i + 1}`,
        status: occ?.status ?? "available",
        brand: occ?.brand,
        service: occ?.service,
        color: occ?.color,
      };
    });

    const labels = ["floor.f1", "floor.f2", "floor.f3", "floor.f4", "floor.f5", "floor.f6"];
    floors.push({ floor: f, label: labels[f - 1], units });
  }

  return floors;
}

export const FLOORS = generateFloors();
