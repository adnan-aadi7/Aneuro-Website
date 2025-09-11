// utils/emailTemplates.js
export const incompleteQuizTemplate = (audienceName, quizTitle, completionLink) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2>Hi ${audienceName || 'there'},</h2>
    <p>We noticed you haven’t completed the quiz <strong>"${quizTitle}"</strong>.</p>
    <p>Your input is important! Please take a few minutes to complete it.</p>
    <a href="${completionLink}" style="
      display: inline-block;
      background-color: #007BFF;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
    ">
      Complete the Quiz
    </a>
    <p style="margin-top: 20px;">Thank you,<br>The Aneuro Team</p>
  </div>
`;

export const newsletterWelcomeTemplate = ({
  recipientName = 'there',
  unsubscribeUrl = '#',
} = {}) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Welcome to Aneuro</title>
    </head>
    <body style="margin:0;padding:0;background:#0f1115;color:#e5e7eb;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f1115;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#151924;border-radius:12px;overflow:hidden;border:1px solid #222836;">
              <tr>
                <td style="padding:28px 32px 8px 32px;" align="left">
                  <img src="https://aneuro.io/logo.png" alt="Aneuro" width="120" style="display:block" />
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 8px 32px;">
                  <h1 style="margin:0 0 8px 0;color:#e5e7eb;font-size:22px;line-height:28px;">Welcome aboard, ${recipientName} 🎉</h1>
                  <p style="margin:0;color:#aab2c8;font-size:14px;line-height:20px;">
                    Thanks for subscribing to the Aneuro newsletter. You’ll receive product updates,
                    tips, and exclusive content designed to help you innovate smarter.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px 24px 32px;">
                  <a href="https://aneuro.io" style="display:inline-block;background:#12DCF0;color:#0f1115;text-decoration:none;font-weight:600;border-radius:8px;padding:10px 16px;font-size:14px;">Explore Aneuro</a>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 32px 28px 32px;border-top:1px solid #222836;">
                  <p style="margin:0;color:#6b7280;font-size:12px;line-height:18px;">
                    If you didn’t subscribe, you can
                    <a href="${unsubscribeUrl}" style="color:#9ddaf0;text-decoration:underline;">unsubscribe here</a>.
                  </p>
                </td>
              </tr>
            </table>
            <p style="color:#6b7280;font-size:12px;line-height:18px;margin:12px 0 0 0;">
              © ${new Date().getFullYear()} Aneuro. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;
