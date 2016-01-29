# aws-sns-publish [![Build Status](https://travis-ci.org/SamVerschueren/aws-sns-publish.svg?branch=master)](https://travis-ci.org/SamVerschueren/aws-sns-publish)

> Publish messages to [AWS SNS](https://aws.amazon.com/sns)


## Install

```
$ npm install --save aws-sns-publish
```


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
```


## API

### snsPublish(message, options)

Returns a promise for the message id of the published message.

#### message

Type: `string` `object`

Message that should be send to the topic.

#### options

##### arn

*Required*  
Type: `string`

Topic or target ARN you want to publish to. The type is automatically detected.

##### subject

Type: `string`

Subject of the message when delivered to email endpoints.

#### json

Type: `boolean`  
Default: `false`

Set to `true` if you want to send a different message for each protocol.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
