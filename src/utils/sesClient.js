const { SESClient } = require('@aws-sdk/client-ses');

const region = process.env.AWS_REGION;

const sesClient = new SESClient({
    region: region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

module.exports = { sesClient };