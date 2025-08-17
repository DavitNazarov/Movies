export function verificationTemplate({
  name = "",
  code = "",
  appUrl = process.env.APP_URL,
} = {}) {
  return `
  <!doctype html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Verification</title>
    <style>
      html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
      * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
      body { background:#f6f7fb; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial, sans-serif; color:#111827; }
      a { text-decoration:none; }
      img { border:0; line-height:100%; outline:none; text-decoration:none; }
      table { border-collapse:collapse !important; }
      a[x-apple-data-detectors], u+#body a, #MessageViewBody a { color:inherit !important; text-decoration:none !important; }
      @media (prefers-color-scheme: dark) {
        body { background:#0b0c10 !important; color:#e5e7eb !important; }
        .card { background:#111317 !important; box-shadow:none !important; }
        .muted { color:#9ca3af !important; }
        .button { background:#2563eb !important; color:#ffffff !important; }
        .code-box { background:#0b0c10 !important; border-color:#1f2937 !important; color:#ffffff !important; }
      }
      @media screen and (max-width: 600px) {
        .container { width:100% !important; }
        .card { border-radius:0 !important; box-shadow:none !important; }
        .sp-24 { height:24px !important; line-height:24px !important; font-size:24px !important; }
      }
      .sp-8 { height:8px; line-height:8px; font-size:8px; }
      .sp-16 { height:16px; line-height:16px; font-size:16px; }
      .sp-24 { height:24px; line-height:24px; font-size:24px; }
      .sp-40 { height:40px; line-height:40px; font-size:40px; }
    </style>
  </head>
  <body id="body" style="margin:0; padding:0;">
    <div style="display:none; overflow:hidden; line-height:1px; opacity:0; max-height:0; max-width:0;">
      Your Movie Hub verification code: ${code}
    </div>

    <table role="presentation" width="100%" bgcolor="#f6f7fb">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" class="container" width="600" style="max-width:600px; width:600px;">
            <tr><td class="sp-24">&nbsp;</td></tr>
            <tr>
              <td>
                <table role="presentation" width="100%" class="card" style="background:#ffffff; border-radius:12px; box-shadow:0 8px 30px rgba(17,24,39,0.08);">
                  <tr>
                    <td style="padding:28px 28px 8px 28px; text-align:left;">
                      <div style="font-weight:800; font-size:18px; letter-spacing:0.2px;">Movie Hub</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 28px 0 28px; text-align:left;">
                      <div style="font-size:22px; font-weight:700; margin-top:8px;">Verify your email</div>
                      <div style="color:#6b7280; font-size:14px; margin-top:6px;">
                        Hi${
                          name ? `, ${name}` : ""
                        } — enter this code in the app to finish signing up.
                      </div>
                    </td>
                  </tr>
                  <tr><td class="sp-24">&nbsp;</td></tr>
                  <tr>
                    <td align="center" style="padding:0 28px;">
                      <table role="presentation" width="100%">
                        <tr>
                          <td align="center">
                            <div class="code-box" style="display:inline-block; min-width:320px; padding:18px 24px; border:1px solid #e5e7eb; border-radius:12px; background:#fafafa; text-align:center;">
                              <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
                                  font-weight:800; font-size:28px; letter-spacing:6px;">
                                ${code}
                              </div>
                            </div>
                            <div style="color:#6b7280; font-size:12px; margin-top:10px;">
                              This code expires in 10 minutes.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr><td class="sp-24">&nbsp;</td></tr>
                  <tr>
                    <td align="center" style="padding:0 28px;">
                      <a class="button" href="${appUrl}" style="display:inline-block; background:#111827; color:#ffffff; font-weight:600; font-size:14px; padding:12px 18px; border-radius:10px;">
                        Open Movie Hub
                      </a>
                    </td>
                  </tr>
                  <tr><td class="sp-24">&nbsp;</td></tr>
                  <tr>
                    <td style="padding:0 28px 28px 28px;">
                      <div class="muted" style="color:#6b7280; font-size:12px; line-height:1.5;">
                        If you didn’t request this, you can safely ignore this email. For help, contact us via the app.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td class="sp-40">&nbsp;</td></tr>
            <tr>
              <td align="center" style="color:#9ca3af; font-size:11px; line-height:1.4;">
                © ${new Date().getFullYear()} Movie Hub. All rights reserved.
              </td>
            </tr>
            <tr><td class="sp-8">&nbsp;</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
