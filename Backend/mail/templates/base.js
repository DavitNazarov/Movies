export function baseTemplate({ title = "", body = "" } = {}) {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu; background:#f6f7fb; padding:24px;margin:0;}
      .card{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,.06)}
      .brand{font-weight:700;font-size:18px;margin-bottom:16px}
      .muted{color:#6b7280;font-size:13px;margin-top:24px}
      a.button{display:inline-block;padding:10px 16px;border-radius:10px;text-decoration:none}
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">Movie Hub</div>
      ${body}
      <div class="muted">If you didn’t request this, you can ignore the message.</div>
    </div>
  </body>
  </html>`;
}
