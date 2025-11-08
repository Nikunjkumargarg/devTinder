const cron = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns');
const ConnectionRequest = require('../modals/connectionRequest');
const sendEmail = require('./sendEmail');

try{
cron.schedule('50 22 * * *', async () => {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday); 
    console.log("yesterday",yesterday);
    console.log("yesterdayStart",yesterdayStart);
    console.log("yesterdayEnd",yesterdayEnd);
    const pendingRequests = await ConnectionRequest.find({
        status: 'interested',
        createdAt: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
        },
    }).populate("fromUserId")
    .populate("toUserId");

    console.log("pendingRequests",pendingRequests);
    // Loop through each pending request individually
    for (const request of pendingRequests) {
        const fromUser = request.fromUserId;
        const toUser = request.toUserId;
  
        if (!fromUser || !toUser) continue;
  
        const email = toUser.emailId;
        const fromName = `${fromUser.firstname} ${fromUser.lastname}`;
        const toName = `${toUser.firstname} ${toUser.lastname}`;
        const emailSubject = `${fromName} wants to connect with you on DevTinder`;
  
        const emailHtmlBody = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6fb; padding: 32px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);">
            <tr>
              <td style="padding: 28px 32px 16px;">
                <p style="margin: 0; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: #6366f1; font-weight: 600;">Connection Request</p>
                <h1 style="margin: 12px 0 0; font-size: 24px; color: #0f172a;">${fromName} wants to connect</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 32px 24px;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #475569;">
                  Hi ${toName},<br/><br/>
                  You just received a connection request from <strong>${fromName}</strong> on <strong>DevTinder</strong>.
                </p>
                <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.08)); border-radius: 12px;">
                  <p style="margin: 0; font-size: 15px; color: #1e293b;">
                    <strong>Quick Preview</strong><br/>
                    “Hey ${toName}, let's connect and explore opportunities together on DevTinder!”
                  </p>
                </div>
                <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                  Open DevTinder to accept, ask a question, or gently pass on this connection.
                </p>
                <a href="${process.env.APP_BASE_URL || '#'}" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #6366f1, #4f46e5); border-radius: 999px; text-decoration: none;">Review request</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px 28px; background-color: #f8fafc;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">You're receiving this email because you're part of DevTinder. Manage notification preferences in your profile settings.</p>
              </td>
            </tr>
          </table>
        </div>
        `;
  
        const emailResult = await sendEmail.run(
          'nikunj@euphotic.io',
          emailSubject,
          emailHtmlBody,
          `${fromName} has sent you a connection request on DevTinder. Sign in to review.`
        );
  
        console.log(`Email sent to ${email}:`, emailResult);
    }
});
} catch (error) {
    console.log("Error", error);
}

