export const capsuleMaturationTemplate = (
    name = "User",
    title = "Untitled Time Capsule",
    capsuleLink = "#"
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Time Capsule Is Ready</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.06);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#0f172a; padding:28px; text-align:center;">
                     
                            <h1 style="color:#ffffff; margin:0; font-size:26px; letter-spacing:0.5px;">
                                Echoes
                            </h1>
                            <p style="color:#c7d2fe; margin:6px 0 0; font-size:13px;">
                                Preserve memories, unlock moments
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:36px; color:#111827;">
                            <h2 style="margin-top:0; font-size:22px;">
                                Hello ${name},
                            </h2>

                            <p style="font-size:15px; line-height:1.7; color:#374151;">
                                The wait is finally over.
                            </p>

                            <p style="font-size:15px; line-height:1.7; color:#374151;">
                                Your time capsule titled
                                <strong style="color:#111827;">“${title}”</strong>
                                has reached its moment in time.
                            </p>

                            <p style="font-size:15px; line-height:1.7; color:#374151;">
                                The memories sealed within are now ready to be opened —
                                reflections from the past, waiting patiently for this very day.
                            </p>

                            <div style="margin:36px 0; text-align:center;">
                                <a href="${capsuleLink}"
                                   style="
                                       display:inline-block;
                                       padding:14px 28px;
                                       background-color:#0f172a;
                                       color:#ffffff;
                                       text-decoration:none;
                                       border-radius:8px;
                                       font-size:14px;
                                       letter-spacing:0.4px;
                                   ">
                                    Open Your Time Capsule
                                </a>
                            </div>

                            <p style="font-size:14px; line-height:1.7; color:#6b7280;">
                                Take a quiet moment. Revisit what mattered.
                                Some memories are meant to be opened only when time says it’s right.
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

                            <p style="font-size:14px; color:#374151; margin-bottom:4px;">
                                With warmth,
                            </p>
                            <p style="font-size:14px; color:#111827; font-weight:bold; margin-top:0;">
                                — Team Echoes
                            </p>

                            <blockquote style="
                                margin:28px 0 0;
                                padding-left:16px;
                                border-left:3px solid #c7d2fe;
                                font-size:14px;
                                color:#4b5563;
                                font-style:italic;
                            ">
                                “The past beats inside us, quietly shaping who we become.”
                            </blockquote>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9fafb; padding:18px; text-align:center;">
                            <p style="font-size:12px; color:#9ca3af; margin:0;">
                                © ${new Date().getFullYear()} Echoes • All memories handled with care
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
