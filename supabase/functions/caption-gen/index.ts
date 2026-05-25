// Supabase Edge Function: caption-gen
// Generates AI caption based on user archetype tone.
// Deploy: supabase functions deploy caption-gen

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

const MAX_PROMPT_LENGTH = 500;
const ALLOWED_TONES = ["Gaya casual dan friendly.", "Gaya edukatif, thoughtful, dan terstruktur.", "Gaya energetik, persuasif, dan ramah.", "Gaya catchy, trendy, dan pendek.", "Gaya hangat, trustworthy, dan personal."];

function sanitize(input: string, maxLen: number): string {
  return input.replace(/[\n\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

Deno.serve(async (req: Request) => {
  try {
    const { prompt, tone } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "MISSING_PROMPT", message: "prompt is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const safePrompt = sanitize(prompt, MAX_PROMPT_LENGTH);
    const safeTone = tone && typeof tone === "string" && ALLOWED_TONES.includes(tone)
      ? tone
      : ALLOWED_TONES[0];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Kamu adalah AI copywriter untuk platform creator digital. ${safeTone} Buat caption pendek (max 280 karakter) dalam Bahasa Indonesia. Gunakan emoji secukupnya. Format: langsung caption, tanpa prefix.`,
          },
          {
            role: "user",
            content: `Buat caption untuk: ${safePrompt}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ ok: false, error: { code: "AI_ERROR", message: err } }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const caption = data.choices?.[0]?.message?.content ?? "Maaf, gagal generate caption.";

    return new Response(
      JSON.stringify({ ok: true, data: { caption } }),
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
