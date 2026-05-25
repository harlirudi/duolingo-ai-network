// Supabase Edge Function: mission-complete
// Server-side XP calculation and streak tracking.
// Prevents client-side cheating — XP and streaks are verified server-side.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "UNAUTHORIZED", message: "Missing auth header" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    const { missionId } = await req.json();
    if (!missionId) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "MISSING_ID", message: "missionId required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify mission belongs to user and is pending
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("id, profile_id, xp_reward, status")
      .eq("id", missionId)
      .eq("profile_id", user.id)
      .eq("status", "pending")
      .single();

    if (missionError || !mission) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "INVALID_MISSION", message: "Mission not found or already completed" } }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Mark mission as completed
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("missions")
      .update({ status: "completed", completed_at: now })
      .eq("id", missionId);

    if (updateError) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "UPDATE_FAILED", message: updateError.message } }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch current profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, streak, longest_streak, last_mission_at")
      .eq("id", user.id)
      .single();

    // Calculate streak
    let newStreak = 1;
    let newLongestStreak = profile?.longest_streak ?? 0;

    if (profile?.last_mission_at) {
      const lastDate = new Date(profile.last_mission_at);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = (profile.streak ?? 0) + 1;
      } else if (diffDays === 0) {
        newStreak = profile.streak ?? 1;
      }
    }

    if (newStreak > newLongestStreak) {
      newLongestStreak = newStreak;
    }

    const newXp = (profile?.xp ?? 0) + (mission.xp_reward ?? 50);

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        xp: newXp,
        streak: newStreak,
        longest_streak: newLongestStreak,
        last_mission_at: now,
      })
      .eq("id", user.id);

    if (profileError) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "PROFILE_UPDATE_FAILED", message: profileError.message } }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          xp: newXp,
          xpEarned: mission.xp_reward,
          streak: newStreak,
          longestStreak: newLongestStreak,
          level: Math.floor(newXp / 1000) + 1,
        },
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ ok: false, error: { code: "CRASH", message } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
