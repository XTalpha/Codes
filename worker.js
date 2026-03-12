export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");

    if (!prompt) {
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; background: #0f0f0f; color: white;">
            <h2>🖼️ Image Generation API</h2>
            <p>Usage:</p>
            <code style="background: #1f1f1f; padding: 10px; display: block; border-radius: 6px;">
              /?prompt=your description here
            </code>
            <br/>
            <p>Example:</p>
            <code style="background: #1f1f1f; padding: 10px; display: block; border-radius: 6px;">
              /?prompt=a cat astronaut floating in space
            </code>
          </body>
        </html>
      `, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }

    try {
      const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt,
        num_steps: 4,
      });

      return new Response(result, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
