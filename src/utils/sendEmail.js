const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (ToAddress, subject, bodyHtml, bodyText) => {
    const resolvedTextBody = bodyText
        ? bodyText
        : bodyHtml?.replace(/<[^>]*>/g, '').replace(/\s{2,}/g, ' ').trim();

    return new SendEmailCommand({
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [ToAddress],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                ...(bodyHtml ? { Html: { Data: bodyHtml } } : {}),
                ...(resolvedTextBody ? { Text: { Data: resolvedTextBody } } : {}),
            },
        },
        source: process.env.EMAIL_FROM,
    });
};

const run = async (ToAddress, subject, bodyHtml, bodyText) => {
    const command = createSendEmailCommand(ToAddress, subject, bodyHtml, bodyText);
    try {
        const result = await sesClient.send(command);
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { run };