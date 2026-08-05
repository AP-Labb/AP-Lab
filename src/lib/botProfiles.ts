import { getLevelForXp } from "@/lib/xpProgression";

export interface BotProfileData {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  xp: number;
  level: number;
  credits: number;
  graduationYear: string;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  activeAvatarFrame: string;
  activeNameColor: string | null;
  activeNameGradient: string;
  bio: string;
  location: string;
  enrolledCourses: string[];
  totalStudyMinutes: number;
  streakDays: number;
  createdAt: string;
}

export const TOP_BOT_PROFILES: Record<string, BotProfileData> = {
  "bot-1": {
    uid: "bot-1",
    displayName: "Tyler Davis",
    photoURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    email: "tyler.davis@aplab.org",
    xp: 3450,
    level: getLevelForXp(3450),
    credits: 450,
    graduationYear: "2025",
    totalQuestionsAnswered: 342,
    totalQuestionsCorrect: 310,
    activeAvatarFrame: "frame-gold",
    activeNameColor: "#fbbf24",
    activeNameGradient: "grad-gold",
    bio: "Aspiring Pre-Med & AP Bio Scholar | Aiming for 5s on all AP Science Exams 🧬",
    location: "California, United States",
    enrolledCourses: ["ap-biology", "ap-chemistry", "ap-calc-bc", "ap-physics-c"],
    totalStudyMinutes: 1420,
    streakDays: 28,
    createdAt: "2025-09-01T00:00:00.000Z",
  },
  "bot-2": {
    uid: "bot-2",
    displayName: "Sofia Rodriguez",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    email: "sofia.rodriguez@aplab.org",
    xp: 2920,
    level: getLevelForXp(2920),
    credits: 380,
    graduationYear: "2026",
    totalQuestionsAnswered: 295,
    totalQuestionsCorrect: 268,
    activeAvatarFrame: "frame-cyber",
    activeNameColor: "#00f2ff",
    activeNameGradient: "grad-ocean",
    bio: "AP Chem & Calculus BC Enthusiast ⚗️ | Future Chemical Engineer!",
    location: "Texas, United States",
    enrolledCourses: ["ap-chemistry", "ap-calc-bc", "ap-physics-c"],
    totalStudyMinutes: 1180,
    streakDays: 19,
    createdAt: "2025-10-15T00:00:00.000Z",
  },
  "bot-3": {
    uid: "bot-3",
    displayName: "Alex Mercer",
    photoURL: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=400&auto=format&fit=crop&q=80",
    email: "alex.mercer@aplab.org",
    xp: 2480,
    level: getLevelForXp(2480),
    credits: 310,
    graduationYear: "2025",
    totalQuestionsAnswered: 250,
    totalQuestionsCorrect: 228,
    activeAvatarFrame: "frame-fire",
    activeNameColor: "#f97316",
    activeNameGradient: "grad-fire",
    bio: "Physics C & Computer Science nerd ⚡💻 | Building robotics projects in free time.",
    location: "New York, United States",
    enrolledCourses: ["ap-physics-c", "ap-csa", "ap-calc-bc"],
    totalStudyMinutes: 960,
    streakDays: 14,
    createdAt: "2025-11-02T00:00:00.000Z",
  },
  "bot-4": {
    uid: "bot-4",
    displayName: "Maya Lin",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    email: "maya.lin@aplab.org",
    xp: 2150,
    level: getLevelForXp(2150),
    credits: 260,
    graduationYear: "2026",
    totalQuestionsAnswered: 220,
    totalQuestionsCorrect: 198,
    activeAvatarFrame: "",
    activeNameColor: "#a855f7",
    activeNameGradient: "grad-holographic",
    bio: "Passionate about AP US History & Psychology 🏛️🧠 | Reader & Debate Team Captain.",
    location: "Toronto, Canada",
    enrolledCourses: ["ap-ush", "ap-psych", "ap-eng-lang"],
    totalStudyMinutes: 840,
    streakDays: 12,
    createdAt: "2025-11-20T00:00:00.000Z",
  },
  "bot-5": {
    uid: "bot-5",
    displayName: "Marcus Vance",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    email: "marcus.vance@aplab.org",
    xp: 1880,
    level: getLevelForXp(1880),
    credits: 210,
    graduationYear: "2027",
    totalQuestionsAnswered: 190,
    totalQuestionsCorrect: 172,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "AP Comp Sci A & Stats grinding for perfection 💻📊",
    location: "London, United Kingdom",
    enrolledCourses: ["ap-csa", "ap-stats", "ap-calc-bc"],
    totalStudyMinutes: 720,
    streakDays: 9,
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  "bot-6": {
    uid: "bot-6",
    displayName: "Elena Rostova",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    email: "elena.rostova@aplab.org",
    xp: 1620,
    level: getLevelForXp(1620),
    credits: 180,
    graduationYear: "2026",
    totalQuestionsAnswered: 165,
    totalQuestionsCorrect: 148,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "AP Biology & English Language scholar ✍️🧬 | Studying for College Board mastery.",
    location: "Illinois, United States",
    enrolledCourses: ["ap-biology", "ap-eng-lang", "ap-psych"],
    totalStudyMinutes: 610,
    streakDays: 8,
    createdAt: "2026-01-18T00:00:00.000Z",
  },
  "bot-7": {
    uid: "bot-7",
    displayName: "Kenji Sato",
    photoURL: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&auto=format&fit=crop&q=80",
    email: "kenji.sato@aplab.org",
    xp: 1390,
    level: getLevelForXp(1390),
    credits: 150,
    graduationYear: "2027",
    totalQuestionsAnswered: 140,
    totalQuestionsCorrect: 126,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "Tokyo student loving AP Physics C & Calculus 🇯🇵⚡",
    location: "Tokyo, Japan",
    enrolledCourses: ["ap-physics-c", "ap-calc-bc"],
    totalStudyMinutes: 520,
    streakDays: 7,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  "bot-8": {
    uid: "bot-8",
    displayName: "Nisha Patel",
    photoURL: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    email: "nisha.patel@aplab.org",
    xp: 1120,
    level: getLevelForXp(1120),
    credits: 120,
    graduationYear: "2026",
    totalQuestionsAnswered: 115,
    totalQuestionsCorrect: 102,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "AP Chemistry & Biology student preparing for 5s ⚗️🧬",
    location: "New Jersey, United States",
    enrolledCourses: ["ap-chemistry", "ap-biology"],
    totalStudyMinutes: 440,
    streakDays: 5,
    createdAt: "2026-02-14T00:00:00.000Z",
  },
  "bot-9": {
    uid: "bot-9",
    displayName: "Liam Gallagher",
    photoURL: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80",
    email: "liam.gallagher@aplab.org",
    xp: 950,
    level: getLevelForXp(950),
    credits: 90,
    graduationYear: "2028",
    totalQuestionsAnswered: 95,
    totalQuestionsCorrect: 82,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "AP History & Psychology enthusiast 🏛️🧠",
    location: "Sydney, Australia",
    enrolledCourses: ["ap-ush", "ap-psych"],
    totalStudyMinutes: 380,
    streakDays: 4,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  "bot-10": {
    uid: "bot-10",
    displayName: "Chloe Zhang",
    photoURL: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80",
    email: "chloe.zhang@aplab.org",
    xp: 750,
    level: getLevelForXp(750),
    credits: 70,
    graduationYear: "2028",
    totalQuestionsAnswered: 75,
    totalQuestionsCorrect: 64,
    activeAvatarFrame: "",
    activeNameColor: null,
    activeNameGradient: "",
    bio: "AP Comp Sci A & Statistics learner 💻📊",
    location: "Washington, United States",
    enrolledCourses: ["ap-csa", "ap-stats"],
    totalStudyMinutes: 310,
    streakDays: 3,
    createdAt: "2026-03-15T00:00:00.000Z",
  },
};

export function getBotProfile(uid: string): BotProfileData | null {
  if (TOP_BOT_PROFILES[uid]) {
    return TOP_BOT_PROFILES[uid];
  }

  if (uid.startsWith("placeholder-") || uid.startsWith("bot-")) {
    const num = parseInt(uid.replace(/\D/g, ""), 10) || 1;
    const xp = Math.max(15, Math.floor(1200 - num * 1.18));
    const level = getLevelForXp(xp);

    const locations = [
      "California, United States", "New York, United States", "Texas, United States",
      "Florida, United States", "London, United Kingdom", "Toronto, Canada",
      "Sydney, Australia", "Tokyo, Japan", "Berlin, Germany", "Singapore"
    ];
    const bios = [
      "AP Scholar working towards top exam scores 📚",
      "STEM student focused on AP Bio and AP Chemistry 🧬⚗️",
      "Grinding AP Calculus & Physics C daily ⚡",
      "History & Humanities enthusiast studying on AP Lab 🏛️",
      "Computer Science student aiming for a 5 in AP CSA 💻"
    ];
    const courses = [
      ["ap-biology", "ap-chemistry"],
      ["ap-calc-bc", "ap-physics-c"],
      ["ap-ush", "ap-psych"],
      ["ap-csa", "ap-stats"],
      ["ap-eng-lang", "ap-biology"]
    ];

    return {
      uid,
      displayName: `Scholar ${num}`,
      photoURL: "",
      email: `scholar${num}@aplab.org`,
      xp,
      level,
      credits: Math.floor(xp * 0.1),
      graduationYear: String(2025 + (num % 4)),
      totalQuestionsAnswered: Math.floor(xp / 10),
      totalQuestionsCorrect: Math.floor(xp / 11),
      activeAvatarFrame: "",
      activeNameColor: null,
      activeNameGradient: "",
      bio: bios[num % bios.length],
      location: locations[num % locations.length],
      enrolledCourses: courses[num % courses.length],
      totalStudyMinutes: Math.floor(xp * 0.25),
      streakDays: (num % 12) + 1,
      createdAt: "2026-01-01T00:00:00.000Z",
    };
  }

  return null;
}
