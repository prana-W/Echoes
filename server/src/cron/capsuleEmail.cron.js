import cron from 'node-cron';
import TimeCapsule from '../models/timeCapsule/timeCapsule.model.js';
import sendEmail from '../utility/sendMail.util.js';
import {capsuleMaturationTemplate} from '../constants/emailTemplate.js';
import {SERVER_TIME} from '../constants/constants.js';

let cronStarted = false;

const startCapsuleEmailCron = () => {
    if (cronStarted) return;
    cronStarted = true;

    console.log('✅ Cron job for capsule emails started');

    // Runs every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = SERVER_TIME();

            const capsules = await TimeCapsule.find({
                isEventRelated: false,
                isOpened: false,
                emailSentOnOpen: false,
                openAt: {$lte: now},
            }).populate('owner', 'name email');

            for (const capsule of capsules) {
                await sendEmail({
                    to: capsule?.owner?.email,
                    subject: 'Your Time Capsule Is Ready to Be Opened',
                    html: capsuleMaturationTemplate,
                });

                capsule.emailSent = true;
                await capsule.save();
            }
        } catch (err) {
            console.error('Capsule email cron error:', err);
        }
    });
};

export default startCapsuleEmailCron;
