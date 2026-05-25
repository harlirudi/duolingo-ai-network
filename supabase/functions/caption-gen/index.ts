// Supabase Edge Function: caption-gen
// Generates AI caption based on user archetype tone.
// Deploy: supabase functions deploy caption-gen

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

Deno.serve(async (req: Request) => {
  try {
    const { prompt, tone } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: "MISSING_PROMPT", message: "prompt is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

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
            content: `Kamu adalah AI copywriter untuk platform creator digital. ${tone ?? "Gaya casual dan friendly."} Buat caption pendek (max 280 karakter) dalam Bahasa Indonesia. Gunakan emoji secukupnya. Format: langsung caption, tanpa prefix.`,
          },
          {
            role: "user",
            content: `Buat caption untuk: ${prompt}`,
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
