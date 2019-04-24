# aws-sns-publish

[![Build Status](https://travis-ci.org/SamVerschueren/aws-sns-publish.svg?branch=master)](https://travis-ci.org/SamVerschueren/aws-sns-publish)
[![Coverage Status](https://coveralls.io/repos/github/SamVerschueren/aws-sns-publish/badge.svg?branch=master)](https://coveralls.io/github/SamVerschueren/aws-sns-publish?branch=master)

> Publish messages to [AWS SNS](https://aws.amazon.com/sns)


## Install

```
$ npm install --save aws-sns-publish
```

If you are running outside AWS Lambda, make sure to install the [aws-sdk](https://github.com/aws/aws-sdk-js) as well. The SDK is not shipped with this library.


## Usage

```js
const snsPublish = require('aws-sns-publish');

snsPublish('Hello World', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}).then(messageId => {
	console.log(messageId);
	//=> '8a98f4d0-078b-5176-9af2-bbd871660ecb'
});

snsPublish('Hello World', {arn: 'arn:aws:sns:us-west-2:111122223333:app/GCM/MyApplication'}).then(messageId => {
	console.log(messageId);
	//=> '7b77f4d0-078b-5176-9af2-ccd871660ecb'
});

snsPublish('SMS Message', {name: 'MyTopic', region: 'eu-west-1', accountId: '111122223333'}).then(messageId => {
	console.log(messageId);
	//=> '47ff59e2-04e3-11e8-ba89-0ed5f89f718b'
});

snsPublish('SMS Message', {phone: '+14155552671'}).then(messageId => {
	console.log(messageId);
	//=> '6014fe16-26c1-11e7-93ae-92361f002671'
});

snsPublish('Hello World', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', messageAttributes: {hello: 'world'}}).then(messageId => {
	console.log(messageId);
	//=> 'ef5835d5-8a4b-4e8b-beff-6ccc314d2f6d'
});
```


## API

### snsPublish(message, options)

Returns a promise for the message id of the published message.

#### message

Type: `string` `object`

Message that should be send to the topic.

#### options

##### arn

Type: `string`

Topic or target ARN you want to publish to. The type is automatically detected.

##### name

Type: `string`

Name of the topic ARN you want to publish to. If used, `region` and `accountId` are mandatory.

##### phone

Type: `string`

Phone number to which you want to deliver an SMS message. Use [E.164 format](https://en.wikipedia.org/wiki/E.164).

##### subject

Type: `string`

Subject of the message when delivered to email endpoints.

##### json

Type: `boolean`<br>
Default: `false`

Set to `true` if you want to send a different message for each protocol.

##### region

Type: `string`<br>
Default: `process.env.AWS_REGION`

Region used when constructing the topic ARN when `name` is being used.

##### accountId

Type: `string`<br>
Default: `process.env.AWS_ACCOUNT_ID`

AWS Account Id used when constructing the topic ARN when `name` is being used.

#### messageAttributes

Type: `object`

Object which defines the message attributes to be set.

## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
