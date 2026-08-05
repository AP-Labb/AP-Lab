import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getLevelForXp } from "@/lib/xpProgression";
import { getBotProfile } from "@/lib/botProfiles";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  const { uid } = params;

  if (!uid) {
    return NextResponse.json({ error: "Missing UID" }, { status: 400 });
  }

  // Check if it's a bot or placeholder account
  const botProf = getBotProfile(uid);
  if (botProf) {
    return NextResponse.json(botProf);
  }

  try {
    const adminDb = getAdminDb();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Database timeout")), 5000)
    );

    const docPromise = adminDb.collection("userProgress").doc(uid).get();
    const doc = (await Promise.race([docPromise, timeoutPromise])) as any;

    if (!doc || !doc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const data = doc.data();
    const xp = data.xp || 0;
    const level = data.level || getLevelForXp(xp);

    return NextResponse.json({
      uid,
      displayName: data.displayName || "AP Scholar",
      photoURL: data.photoURL || "",
      email: data.email || "",
      xp,
      level,
      credits: data.credits || 0,
      graduationYear: data.graduationYear || null,
      totalQuestionsAnswered: data.totalQuestionsAnswered || 0,
      totalQuestionsCorrect: data.totalQuestionsCorrect || 0,
      activeAvatarFrame: data.activeAvatarFrame || "",
      activeNameColor: data.activeNameColor || null,
      activeNameGradient: data.activeNameGradient || "",
      bio: data.bio || "",
      location: data.location || "",
      profileBannerColor: data.profileBannerColor || "#7b39fc",
      enrolledCourses: data.enrolledCourses || data.selectedClasses || [],
      coursesProgress: data.coursesProgress || {},
      totalStudyMinutes: data.totalStudyMinutes || 0,
      streakDays: data.streakDays || data.streakCount || 0,
      followers: data.followers || ["bot-1", "bot-2", "bot-3"],
      following: data.following || ["bot-1", "bot-2"],
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user profile." },
      { status: 500 }
    );
  }
}
