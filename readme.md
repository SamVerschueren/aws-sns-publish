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

snsPublish('SMS Message', {phone: '+14155552671'}).then(messageId => {
	console.log(messageId);
	//=> '6014fe16-26c1-11e7-93ae-92361f002671'
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

##### phone

Type: `string`

Phone number to which you want to deliver an SMS message. Use [E.164 format](https://en.wikipedia.org/wiki/E.164).

##### subject

Type: `string`

Subject of the message when delivered to email endpoints.

#### json

Type: `boolean`<br>
Default: `false`

Set to `true` if you want to send a different message for each protocol.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
