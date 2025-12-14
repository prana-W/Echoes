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

            console.log('Cron has ran at', now.toISOString());

            const capsules = await TimeCapsule.find({
                isEventRelated: false,
                isOpened: false,
                isEmailSent: false,
                isSealed: true,
                openAt: {$lte: now},
            }).populate('owner', 'name email');

            for (const capsule of capsules) {
                await sendEmail({
                    to: capsule?.owner?.email,
                    subject: 'Your Time Capsule Is Ready to Be Opened',
                    html: capsuleMaturationTemplate(capsule?.owner?.name, capsule?.title),
                });

                capsule.isEmailSent = true;

                console.log('Email sent for capsule ID:', capsule._id);

                await capsule.save();
            }
        } catch (err) {
            console.error('Capsule email cron error:', err);
        }
    });
};

export default startCapsuleEmailCron;
