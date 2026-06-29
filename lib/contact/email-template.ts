type ContactEmailParams = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  siteName: string;
  siteUrl: string;
  jdFileUrl: string | null;
  jdFileName: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildFieldRow(
  label: string,
  value: string,
  linkType?: "mailto" | "tel"
): string {
  const safeValue = escapeHtml(value);
  let valueHtml = `<span style="color:#f1f5f9;font-weight:600;">${safeValue}</span>`;

  if (linkType === "mailto") {
    valueHtml = `<a href="mailto:${safeValue}" style="color:#60a5fa;text-decoration:none;font-weight:600;">${safeValue}</a>`;
  } else if (linkType === "tel") {
    const telHref = value.replace(/[^\d+]/g, "");
    valueHtml = `<a href="tel:${escapeHtml(telHref)}" style="color:#60a5fa;text-decoration:none;font-weight:600;">${safeValue}</a>`;
  }

  return `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid #334155;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">
          ${label}
        </p>
        <p style="margin:0;font-size:16px;line-height:1.5;">
          ${valueHtml}
        </p>
      </td>
    </tr>
  `.trim();
}

export function buildContactNotificationHtml({
  name,
  email,
  phone,
  subject,
  message,
  siteName,
  siteUrl,
  jdFileUrl,
  jdFileName,
}: ContactEmailParams): string {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safePhone = phone.trim();
  const replyUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  const phoneRow = safePhone
    ? buildFieldRow("HR contact number", safePhone, "tel")
    : buildFieldRow("HR contact number", "Not provided");
  const jdRow = jdFileName
    ? jdFileUrl
      ? `
                            <tr>
                              <td style="padding:14px 18px;border-bottom:1px solid #334155;">
                                <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">
                                  Job description
                                </p>
                                <p style="margin:0;font-size:16px;line-height:1.5;">
                                  <a href="${escapeHtml(jdFileUrl)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-weight:600;">
                                    ${escapeHtml(jdFileName)}
                                  </a>
                                </p>
                              </td>
                            </tr>`
      : buildFieldRow("Job description", `${jdFileName} (attached to this email)`)
    : "";

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      body{margin:0;background:#0b1120;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb}
    </style>
  </head>
  <body style="margin:0;background-color:#0b1120;">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td style="background-color:#0b1120;padding:32px 16px;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;">
              <tbody>
                <tr>
                  <td style="background:#111827;border:1px solid #24324a;border-radius:20px;overflow:hidden;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:40px 32px;background:linear-gradient(135deg,#2563eb,#7c3aed);text-align:center;">
                          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#dbeafe;">
                            Portfolio Contact
                          </p>
                          <h1 style="margin:0 0 10px;font-size:30px;line-height:1.2;color:#ffffff;">
                            New Message
                          </h1>
                          <p style="margin:0;font-size:16px;line-height:1.6;color:#e0e7ff;">
                            Someone reached out through your website contact form.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;">
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#1f2937;border:1px solid #334155;border-radius:14px;overflow:hidden;">
                            ${buildFieldRow("From", name)}
                            ${buildFieldRow("Email", email, "mailto")}
                            ${phoneRow}
                            ${buildFieldRow("Subject", subject)}
                            ${jdRow}
                            <tr>
                              <td style="padding:18px;">
                                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">
                                  Message
                                </p>
                                <p style="margin:0;font-size:16px;line-height:1.8;color:#e2e8f0;">
                                  ${safeMessage}
                                </p>
                              </td>
                            </tr>
                          </table>

                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
                            <tr>
                              <td align="center">
                                <a
                                  href="${replyUrl}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style="display:inline-block;padding:16px 32px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:700;">
                                  Reply to ${safeName} →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:24px 32px;border-top:1px solid #24324a;text-align:center;">
                          <p style="margin:0 0 8px;font-size:14px;color:#cbd5e1;">
                            <strong style="color:#f8fafc;">${escapeHtml(siteName)}</strong>
                          </p>
                          <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                            Sent from
                            <a href="${escapeHtml(siteUrl)}" style="color:#60a5fa;text-decoration:none;">${escapeHtml(siteUrl)}</a>
                            · Subject: ${safeSubject}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `.trim();
}

export function buildContactNotificationText({
  name,
  email,
  phone,
  subject,
  message,
  siteName,
  siteUrl,
  jdFileUrl,
  jdFileName,
}: ContactEmailParams): string {
  return [
    `New contact form message — ${siteName}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `HR contact number: ${phone.trim() || "Not provided"}`,
    `Subject: ${subject}`,
    jdFileName
      ? `Job description: ${jdFileUrl ?? `${jdFileName} (attached)`}`
      : "Job description: Not provided",
    "",
    "Message:",
    message,
    "",
    `Reply: mailto:${email}`,
    `Site: ${siteUrl}`,
  ].join("\n");
}

type ContactAcknowledgmentParams = {
  name: string;
  subject: string;
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  linkedinUrl: string;
  jdFileName: string | null;
};

function getFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first || "there";
}

export function buildContactAcknowledgmentHtml({
  name,
  subject,
  siteName,
  siteUrl,
  contactEmail,
  contactPhone,
  linkedinUrl,
  jdFileName,
}: ContactAcknowledgmentParams): string {
  const firstName = escapeHtml(getFirstName(name));
  const safeSubject = escapeHtml(subject);
  const safeSiteName = escapeHtml(siteName);
  const resumeUrl = `${escapeHtml(siteUrl)}/resume`;
  const jdNote = jdFileName
    ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#cbd5e1;">
            We have also received your job description file
            (<strong style="color:#f8fafc;">${escapeHtml(jdFileName)}</strong>).
          </p>`
    : "";

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      body{margin:0;background:#0b1120;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb}
    </style>
  </head>
  <body style="margin:0;background-color:#0b1120;">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td style="background-color:#0b1120;padding:32px 16px;">
            <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;width:100%;">
              <tbody>
                <tr>
                  <td style="background:#111827;border:1px solid #24324a;border-radius:20px;overflow:hidden;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:40px 32px;background:linear-gradient(135deg,#2563eb,#7c3aed);text-align:center;">
                          <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#dbeafe;">
                            Message Received
                          </p>
                          <h1 style="margin:0;font-size:28px;line-height:1.3;color:#ffffff;">
                            Thank you for reaching out
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:32px;">
                          <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#e2e8f0;">
                            Dear ${firstName},
                          </p>
                          <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#cbd5e1;">
                            Thank you for contacting me through my portfolio website. This email
                            confirms that your message has been received successfully.
                          </p>
                          ${jdNote}
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#1f2937;border:1px solid #334155;border-radius:14px;margin-bottom:24px;">
                            <tr>
                              <td style="padding:18px 20px;">
                                <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">
                                  Your inquiry
                                </p>
                                <p style="margin:0;font-size:17px;line-height:1.5;color:#f8fafc;font-weight:600;">
                                  ${safeSubject}
                                </p>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#cbd5e1;">
                            I review every message personally and will respond within
                            <strong style="color:#f8fafc;">1–2 business days</strong>.
                            If your inquiry is time-sensitive, please feel free to follow up
                            directly at
                            <a href="mailto:${escapeHtml(contactEmail)}" style="color:#60a5fa;text-decoration:none;">${escapeHtml(contactEmail)}</a>.
                          </p>
                          <p style="margin:0 0 28px;font-size:16px;line-height:1.8;color:#cbd5e1;">
                            In the meantime, you may review my resume and recent work on my portfolio.
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td align="center" style="padding-bottom:12px;">
                                <a
                                  href="${escapeHtml(siteUrl)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style="display:inline-block;padding:14px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:999px;font-size:15px;font-weight:700;">
                                  Visit Portfolio
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td align="center">
                                <a
                                  href="${resumeUrl}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style="display:inline-block;padding:14px 28px;background:#1f2937;border:1px solid #334155;color:#e2e8f0;text-decoration:none;border-radius:999px;font-size:15px;font-weight:600;">
                                  View Resume
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:24px 32px;border-top:1px solid #24324a;">
                          <p style="margin:0 0 8px;font-size:15px;color:#f8fafc;font-weight:600;">
                            ${safeSiteName}
                          </p>
                          <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#94a3b8;">
                            Data Analyst · SQL Server · Power BI
                          </p>
                          <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                            <a href="mailto:${escapeHtml(contactEmail)}" style="color:#60a5fa;text-decoration:none;">${escapeHtml(contactEmail)}</a>
                            ·
                            <a href="tel:${escapeHtml(contactPhone.replace(/\s/g, ""))}" style="color:#60a5fa;text-decoration:none;">${escapeHtml(contactPhone)}</a>
                            ·
                            <a href="${escapeHtml(linkedinUrl)}" style="color:#60a5fa;text-decoration:none;">LinkedIn</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `.trim();
}

export function buildContactAcknowledgmentText({
  name,
  subject,
  siteName,
  siteUrl,
  contactEmail,
  contactPhone,
  jdFileName,
}: ContactAcknowledgmentParams): string {
  const firstName = getFirstName(name);

  return [
    `Dear ${firstName},`,
    "",
    "Thank you for contacting me through my portfolio website. This email confirms that your message has been received successfully.",
    jdFileName ? `We have also received your job description file (${jdFileName}).` : "",
    "",
    `Your inquiry: ${subject}`,
    "",
    "I review every message personally and will respond within 1–2 business days.",
    `For urgent matters, you may reach me at ${contactEmail} or ${contactPhone}.`,
    "",
    `Portfolio: ${siteUrl}`,
    `Resume: ${siteUrl}/resume`,
    "",
    "Kind regards,",
    siteName,
  ].join("\n");
}
