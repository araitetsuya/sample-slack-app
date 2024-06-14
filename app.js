require('dotenv').config();

const { App, AwsLambdaReceiver } = require('@slack/bolt')
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda')

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
})

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver
})

app.message('hello', async ({message, say}) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    await say(`Hello, <@${message.user}>!`)
});

module.exports.handler = async (event, context, callback) => {
    console.log(event)

    const handler = await awsLambdaReceiver.start()
    return handler(event, context, callback)
}

module.exports.accept = async (event) => {
    const lambdaClient = new LambdaClient()
    const command = new InvokeCommand({
        FunctionName: 'my-slack-dev-bolt',
        InvocationType: 'Event',
        Payload: JSON.stringify(event)
    })

    const response = await lambdaClient.send(command)

    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}