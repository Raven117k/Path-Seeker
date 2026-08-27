const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function getPasswordResetEmail(otp) {
  const text = `Reset your PathSeeker password\n\nYour password reset code is: ${otp}\n\nThis code expires in 15 minutes. If you did not request this, you can safely ignore this email.\n\nPathSeeker Career Passport\nFrom Curiosity to Career`;
  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset your PathSeeker password</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;color:#0f172a;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f5f9;">
      <tr>
        <td align="center" style="padding:38px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="height:7px;background:#6366f1;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 52%,#ec4899 100%);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:30px 36px 22px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td valign="middle" style="width:46px;">
                      <div style="width:38px;height:38px;border-radius:10px;background:#6366f1;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-align:center;font-size:17px;font-weight:800;line-height:38px;">PS</div>
                    </td>
                    <td valign="middle" style="padding-left:11px;">
                      <div style="font-size:19px;font-weight:800;line-height:1.2;color:#0f172a;">PathSeeker</div>
                      <div style="font-size:11px;line-height:1.5;color:#64748b;letter-spacing:.4px;">FROM CURIOSITY TO CAREER</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 36px;">
                <div style="font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:#6366f1;margin-bottom:12px;">Career Passport Security</div>
                <h1 style="margin:0 0 14px;font-size:30px;line-height:1.2;color:#0f172a;">Reset your password</h1>
                <p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#475569;">We received a request to reset your PathSeeker password. Use the secure code below to continue your journey.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <tr>
                    <td align="center" style="padding:24px 16px 22px;">
                      <div style="font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:#64748b;margin-bottom:10px;">Your verification code</div>
                      <div style="font-size:34px;line-height:1.2;font-weight:800;letter-spacing:8px;color:#6366f1;padding-left:8px;">${otp}</div>
                      <div style="font-size:13px;line-height:1.5;color:#64748b;margin-top:10px;">This code expires in 15 minutes.</div>
                    </td>
                  </tr>
                </table>
                <p style="margin:25px 0 0;font-size:13px;line-height:1.7;color:#64748b;">If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 36px;background:#0f172a;">
                <div style="font-size:13px;font-weight:700;color:#ffffff;">PathSeeker Career Passport</div>
                <div style="font-size:12px;line-height:1.6;color:#cbd5e1;margin-top:4px;">A clearer next step, built for Pakistan.</div>
              </td>
            </tr>
          </table>
          <div style="max-width:600px;padding:16px 12px 0;font-size:11px;line-height:1.5;color:#94a3b8;text-align:center;">This is an automated security email. Please do not reply.</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

async function sendPasswordResetOtp({ to, otp }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL must be configured');
  }

  const email = getPasswordResetEmail(otp);
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Your PathSeeker password reset code',
      text: email.text,
      html: email.html
    })
  });

  if (!response.ok) {
    let details = '';
    try {
      const payload = await response.json();
      details = payload.message || payload.name || '';
    } catch {
      details = '';
    }
    throw new Error(`Resend email failed (${response.status})${details ? `: ${details}` : ''}`);
  }
}

module.exports = { getPasswordResetEmail, sendPasswordResetOtp };
