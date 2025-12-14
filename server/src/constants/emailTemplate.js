export const capsuleMaturationTemplate = (
    name = 'User',
    title = 'Untitled Time Capsule',
    capsuleLink = '#'
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Time Capsule Is Ready</title>
</head>
<body style="margin:0; padding:0; background-color:#1f1a14; font-family: Georgia, 'Times New Roman', serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="
                        max-width:600px;
                        background-color:#2a231b;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 8px 24px rgba(0,0,0,0.6);
                        border:1px solid #4a4035;
                    ">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#241e17; padding:30px; text-align:center;">
                            <h1 style="color:#d4a373; margin:0; font-size:26px; letter-spacing:0.6px;">
                                Echoes
                            </h1>
                            <p style="color:#b6ad9f; margin:6px 0 0; font-size:13px;">
                                Preserve memories, unlock moments
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:38px; color:#f5f2eb;">
                            <h2 style="margin-top:0; font-size:22px; font-weight:normal;">
                                Hello ${name},
                            </h2>

                            <p style="font-size:15px; line-height:1.8; color:#d6d1c7;">
                                The wait is finally over.
                            </p>

                            <p style="font-size:15px; line-height:1.8; color:#d6d1c7;">
                                Your time capsule titled
                                <strong style="color:#f5f2eb;">“${title}”</strong>
                                has reached its moment in time.
                            </p>

                            <p style="font-size:15px; line-height:1.8; color:#d6d1c7;">
                                The memories sealed within are now ready to be opened —
                                reflections from the past, waiting patiently for this very day.
                            </p>

                            <div style="margin:40px 0; text-align:center;">
                                <a href="${capsuleLink}"
                                   style="
                                       display:inline-block;
                                       padding:14px 30px;
                                       background-color:#d4a373;
                                       color:#1f1a14;
                                       text-decoration:none;
                                       border-radius:10px;
                                       font-size:14px;
                                       letter-spacing:0.5px;
                                       box-shadow:0 0 18px rgba(212,163,115,0.35);
                                   ">
                                    Open Your Time Capsule
                                </a>
                            </div>

                            <p style="font-size:14px; line-height:1.8; color:#b6ad9f;">
                                Take a quiet moment. Revisit what mattered.
                                Some memories are meant to be opened only when time says it’s right.
                            </p>

                            <hr style="border:none; border-top:1px solid #4a4035; margin:34px 0;" />

                            <p style="font-size:14px; color:#d6d1c7; margin-bottom:4px;">
                                With warmth,
                            </p>
                            <p style="font-size:14px; color:#f5f2eb; font-weight:bold; margin-top:0;">
                                — Team Echoes
                            </p>

                            <blockquote style="
                                margin:30px 0 0;
                                padding-left:16px;
                                border-left:3px solid #d4a373;
                                font-size:14px;
                                color:#b6ad9f;
                                font-style:italic;
                            ">
                                “The past beats inside us, quietly shaping who we become.”
                            </blockquote>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#241e17; padding:18px; text-align:center;">
                            <p style="font-size:12px; color:#8f877a; margin:0;">
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
