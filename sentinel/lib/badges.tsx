import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Flame,
  GraduationCap,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export type BadgeRarity = "Common" | "Rare" | "Epic" | "Legendary";

type BadgeVisual = {
  icon: LucideIcon;
  title: string;
  accent: string;
  iconTint: string;
  panelBackground: string;
  patternBackground: string;
  crestClassName: string;
  accentClassName: string;
  hover: {
    y: number;
    rotate: number;
    scale: number;
    iconRotate: number;
    iconScale: number;
  };
  sparkles: {
    top: string;
    left: string;
    size: string;
    duration: number;
    delay: number;
    driftX: number;
    driftY: number;
  }[];
};

const badgeVisuals: Record<string, BadgeVisual> = {
  "Fast Learner": {
    icon: Zap,
    title: "Speed Run",
    accent: "#38BDF8",
    iconTint: "#7DD3FC",
    panelBackground:
      "radial-gradient(420px circle at 18% 18%, rgba(56,189,248,0.28) 0%, transparent 48%), radial-gradient(360px circle at 78% 82%, rgba(99,102,241,0.22) 0%, transparent 58%), linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(8,15,28,0.94) 100%)",
    patternBackground:
      "linear-gradient(125deg, transparent 0%, transparent 34%, rgba(125,211,252,0.16) 34%, rgba(125,211,252,0.16) 38%, transparent 38%, transparent 56%, rgba(129,140,248,0.14) 56%, rgba(129,140,248,0.14) 60%, transparent 60%)",
    crestClassName: "rounded-[1.35rem] rotate-[8deg]",
    accentClassName: "bg-sky-300/20 border-sky-300/25",
    hover: { y: -8, rotate: -2, scale: 1.02, iconRotate: -8, iconScale: 1.12 },
    sparkles: [
      { top: "16%", left: "18%", size: "0.4rem", duration: 2.8, delay: 0, driftX: 10, driftY: -8 },
      { top: "26%", left: "76%", size: "0.28rem", duration: 2.4, delay: 0.35, driftX: -8, driftY: 10 },
    ],
  },
  "Streak Master": {
    icon: Flame,
    title: "On Fire",
    accent: "#F97316",
    iconTint: "#FDBA74",
    panelBackground:
      "radial-gradient(420px circle at 22% 16%, rgba(249,115,22,0.28) 0%, transparent 48%), radial-gradient(340px circle at 75% 80%, rgba(239,68,68,0.20) 0%, transparent 55%), linear-gradient(180deg, rgba(31,12,9,0.96) 0%, rgba(19,10,12,0.94) 100%)",
    patternBackground:
      "radial-gradient(circle at 50% 0%, rgba(253,186,116,0.20) 0 10%, transparent 11%), radial-gradient(circle at 22% 55%, rgba(251,146,60,0.12) 0 10%, transparent 11%), radial-gradient(circle at 78% 60%, rgba(248,113,113,0.14) 0 10%, transparent 11%)",
    crestClassName: "rounded-[40%_60%_55%_45%/50%_48%_52%_50%]",
    accentClassName: "bg-orange-300/20 border-orange-300/25",
    hover: { y: -9, rotate: 2, scale: 1.025, iconRotate: 10, iconScale: 1.14 },
    sparkles: [
      { top: "18%", left: "20%", size: "0.38rem", duration: 2.2, delay: 0.1, driftX: 6, driftY: -14 },
      { top: "14%", left: "72%", size: "0.34rem", duration: 2.6, delay: 0.5, driftX: -6, driftY: -10 },
    ],
  },
  "Quiz Whiz": {
    icon: GraduationCap,
    title: "Perfect Score",
    accent: "#FACC15",
    iconTint: "#FDE68A",
    panelBackground:
      "radial-gradient(420px circle at 50% 12%, rgba(250,204,21,0.24) 0%, transparent 46%), radial-gradient(340px circle at 14% 86%, rgba(245,158,11,0.16) 0%, transparent 52%), linear-gradient(180deg, rgba(27,23,10,0.97) 0%, rgba(17,15,10,0.94) 100%)",
    patternBackground:
      "radial-gradient(circle at 50% 50%, transparent 0 42%, rgba(253,230,138,0.20) 43% 45%, transparent 46%), conic-gradient(from 0deg, rgba(253,230,138,0.14), transparent 20%, rgba(253,230,138,0.12) 40%, transparent 60%, rgba(253,230,138,0.14) 80%, transparent 100%)",
    crestClassName: "rounded-full",
    accentClassName: "bg-yellow-200/20 border-yellow-200/25",
    hover: { y: -7, rotate: 0, scale: 1.03, iconRotate: 6, iconScale: 1.12 },
    sparkles: [
      { top: "18%", left: "22%", size: "0.34rem", duration: 2.9, delay: 0.15, driftX: 6, driftY: -8 },
      { top: "22%", left: "76%", size: "0.24rem", duration: 3.1, delay: 0.55, driftX: -8, driftY: -6 },
    ],
  },
  "Team Player": {
    icon: Users,
    title: "Squad Sync",
    accent: "#34D399",
    iconTint: "#6EE7B7",
    panelBackground:
      "radial-gradient(420px circle at 20% 20%, rgba(52,211,153,0.24) 0%, transparent 46%), radial-gradient(380px circle at 76% 76%, rgba(20,184,166,0.18) 0%, transparent 58%), linear-gradient(180deg, rgba(7,27,24,0.97) 0%, rgba(8,18,18,0.94) 100%)",
    patternBackground:
      "radial-gradient(circle at 24% 28%, rgba(110,231,183,0.20) 0 6%, transparent 7%), radial-gradient(circle at 74% 24%, rgba(110,231,183,0.18) 0 6%, transparent 7%), radial-gradient(circle at 50% 72%, rgba(45,212,191,0.18) 0 7%, transparent 8%), linear-gradient(rgba(110,231,183,0.12), rgba(110,231,183,0.12)) 24% 28%/50% 1px no-repeat, linear-gradient(rgba(45,212,191,0.12), rgba(45,212,191,0.12)) 50% 28%/1px 44% no-repeat",
    crestClassName: "rounded-[38%_62%_60%_40%/45%_40%_60%_55%]",
    accentClassName: "bg-emerald-300/20 border-emerald-300/25",
    hover: { y: -6, rotate: -1, scale: 1.018, iconRotate: -6, iconScale: 1.08 },
    sparkles: [
      { top: "20%", left: "18%", size: "0.28rem", duration: 2.7, delay: 0.2, driftX: 8, driftY: -8 },
      { top: "24%", left: "80%", size: "0.28rem", duration: 2.9, delay: 0.6, driftX: -8, driftY: -8 },
    ],
  },
  "Winter Sprint": {
    icon: Star,
    title: "Event Rush",
    accent: "#A78BFA",
    iconTint: "#C4B5FD",
    panelBackground:
      "radial-gradient(420px circle at 22% 18%, rgba(167,139,250,0.28) 0%, transparent 46%), radial-gradient(360px circle at 78% 82%, rgba(125,211,252,0.16) 0%, transparent 60%), linear-gradient(180deg, rgba(16,18,36,0.97) 0%, rgba(11,12,24,0.94) 100%)",
    patternBackground:
      "radial-gradient(circle at 25% 32%, rgba(196,181,253,0.18) 0 5%, transparent 6%), radial-gradient(circle at 72% 25%, rgba(196,181,253,0.18) 0 4%, transparent 5%), radial-gradient(circle at 60% 70%, rgba(125,211,252,0.18) 0 5%, transparent 6%), radial-gradient(circle at 36% 68%, rgba(196,181,253,0.14) 0 4%, transparent 5%)",
    crestClassName: "rounded-[26px] rotate-[12deg]",
    accentClassName: "bg-violet-300/20 border-violet-300/25",
    hover: { y: -8, rotate: 3, scale: 1.022, iconRotate: 12, iconScale: 1.1 },
    sparkles: [
      { top: "18%", left: "22%", size: "0.24rem", duration: 3.2, delay: 0.1, driftX: 10, driftY: -10 },
      { top: "16%", left: "74%", size: "0.34rem", duration: 2.8, delay: 0.45, driftX: -10, driftY: -12 },
    ],
  },
  "Risk Analyst I": {
    icon: Trophy,
    title: "Strategist",
    accent: "#8B5CF6",
    iconTint: "#C4B5FD",
    panelBackground:
      "radial-gradient(420px circle at 20% 18%, rgba(139,92,246,0.26) 0%, transparent 46%), radial-gradient(350px circle at 80% 78%, rgba(59,130,246,0.16) 0%, transparent 58%), linear-gradient(180deg, rgba(16,16,36,0.97) 0%, rgba(10,11,26,0.94) 100%)",
    patternBackground:
      "linear-gradient(135deg, transparent 0 28%, rgba(196,181,253,0.15) 28% 30%, transparent 30% 60%, rgba(96,165,250,0.14) 60% 62%, transparent 62%), linear-gradient(0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08)) 18% 76%/64% 1px no-repeat",
    crestClassName: "rounded-[30%_70%_64%_36%/36%_42%_58%_64%]",
    accentClassName: "bg-violet-300/20 border-violet-300/25",
    hover: { y: -7, rotate: -2, scale: 1.02, iconRotate: -8, iconScale: 1.1 },
    sparkles: [
      { top: "18%", left: "18%", size: "0.24rem", duration: 2.8, delay: 0.1, driftX: 8, driftY: -8 },
      { top: "18%", left: "78%", size: "0.28rem", duration: 3, delay: 0.45, driftX: -9, driftY: -8 },
    ],
  },
  "Safety First": {
    icon: Shield,
    title: "No Incidents",
    accent: "#22C55E",
    iconTint: "#86EFAC",
    panelBackground:
      "radial-gradient(420px circle at 18% 18%, rgba(34,197,94,0.26) 0%, transparent 46%), radial-gradient(360px circle at 78% 82%, rgba(14,165,233,0.12) 0%, transparent 58%), linear-gradient(180deg, rgba(10,24,17,0.97) 0%, rgba(9,15,15,0.94) 100%)",
    patternBackground:
      "radial-gradient(circle at 50% 50%, transparent 0 38%, rgba(134,239,172,0.16) 39% 41%, transparent 42%), linear-gradient(90deg, transparent 0 20%, rgba(134,239,172,0.10) 20% 21%, transparent 21% 79%, rgba(134,239,172,0.10) 79% 80%, transparent 80%)",
    crestClassName: "rounded-[28px]",
    accentClassName: "bg-emerald-300/20 border-emerald-300/25",
    hover: { y: -6, rotate: 1, scale: 1.02, iconRotate: 5, iconScale: 1.08 },
    sparkles: [
      { top: "18%", left: "24%", size: "0.24rem", duration: 2.6, delay: 0.05, driftX: 6, driftY: -6 },
      { top: "18%", left: "76%", size: "0.24rem", duration: 2.8, delay: 0.35, driftX: -6, driftY: -6 },
    ],
  },
  "Early Bird": {
    icon: Clock3,
    title: "Sunrise",
    accent: "#FB7185",
    iconTint: "#FDA4AF",
    panelBackground:
      "radial-gradient(420px circle at 20% 18%, rgba(251,113,133,0.24) 0%, transparent 44%), radial-gradient(340px circle at 80% 78%, rgba(251,191,36,0.14) 0%, transparent 54%), linear-gradient(180deg, rgba(33,15,24,0.97) 0%, rgba(18,12,18,0.94) 100%)",
    patternBackground:
      "linear-gradient(180deg, rgba(253,164,175,0.12) 0%, transparent 55%), radial-gradient(circle at 50% 78%, rgba(251,191,36,0.16) 0 16%, transparent 17%), linear-gradient(90deg, transparent 0 20%, rgba(253,164,175,0.10) 20% 21%, transparent 21% 40%, rgba(253,164,175,0.10) 40% 41%, transparent 41% 60%, rgba(253,164,175,0.10) 60% 61%, transparent 61% 80%, rgba(253,164,175,0.10) 80% 81%, transparent 81%)",
    crestClassName: "rounded-full",
    accentClassName: "bg-rose-300/20 border-rose-300/25",
    hover: { y: -7, rotate: 2, scale: 1.022, iconRotate: 8, iconScale: 1.1 },
    sparkles: [
      { top: "18%", left: "20%", size: "0.24rem", duration: 3, delay: 0.15, driftX: 9, driftY: -10 },
      { top: "20%", left: "74%", size: "0.3rem", duration: 3.2, delay: 0.5, driftX: -9, driftY: -8 },
    ],
  },
};

const rarityFallbackAccent: Record<BadgeRarity, string> = {
  Common: "#A3A3A3",
  Rare: "#38BDF8",
  Epic: "#7F77DD",
  Legendary: "#BA7517",
};

export function getBadgeVisual(name: string, rarity: BadgeRarity): BadgeVisual {
  return (
    badgeVisuals[name] ?? {
      icon: Star,
      title: rarity,
      accent: rarityFallbackAccent[rarity],
      iconTint: "#FFFFFF",
      panelBackground:
        "radial-gradient(420px circle at 20% 18%, rgba(127,119,221,0.22) 0%, transparent 46%), linear-gradient(180deg, rgba(20,20,28,0.97) 0%, rgba(10,10,16,0.94) 100%)",
      patternBackground:
        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10) 0 4%, transparent 5%), radial-gradient(circle at 72% 62%, rgba(255,255,255,0.10) 0 4%, transparent 5%)",
      crestClassName: "rounded-[24px]",
      accentClassName: "bg-white/10 border-white/15",
      hover: { y: -6, rotate: 0, scale: 1.02, iconRotate: 6, iconScale: 1.08 },
      sparkles: [
        { top: "18%", left: "22%", size: "0.24rem", duration: 2.8, delay: 0.1, driftX: 8, driftY: -8 },
        { top: "22%", left: "76%", size: "0.24rem", duration: 3, delay: 0.45, driftX: -8, driftY: -8 },
      ],
    }
  );
}
