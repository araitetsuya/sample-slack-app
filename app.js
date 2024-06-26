require('dotenv').config();

const { App, AwsLambdaReceiver } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver
});

app.message('hello', async ({message, say}) => {
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});

app.action('button_click', async ({ body, ack, say }) => {
    // アクションのリクエストを確認
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
});

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}