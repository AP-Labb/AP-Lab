import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { getLevelForXp } from "@/lib/xpProgression";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  const { uid } = params;

  if (!uid || uid.startsWith("bot-") || uid.startsWith("placeholder-")) {
    return NextResponse.json(
      { error: "Bot or placeholder account — no real profile data." },
      { status: 404 }
    );
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
      enrolledCourses: data.enrolledCourses || [],
      coursesProgress: data.coursesProgress || {},
      totalStudyMinutes: data.totalStudyMinutes || 0,
      streakDays: data.streakDays || 0,
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
