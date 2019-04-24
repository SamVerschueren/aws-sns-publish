'use strict';
const AWS = require('aws-sdk');
const sinon = require('sinon');

class SNS {
	publish(opts, cb) {
		cb(undefined, {MessageId: '8a98f4d0-078b-5176-9af2-bbd871660ecb'});
	}
}

const sns = new SNS();

AWS.SNS = function () {
	return sns;
};

module.exports = sns;

// Stub `sns.publish`
const stub = sinon.stub(sns, 'publish');
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}).yields(undefined, {MessageId: 'foo'});
stub.withArgs({Message: 'foo', TargetArn: 'arn:aws:sns:us-west-2:111122223333:GCM/MyTopic'}).yields(undefined, {MessageId: 'bar'});
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', Subject: 'Hello World'}).yields(undefined, {MessageId: 'baz'});
stub.withArgs({Message: 'foo', PhoneNumber: '+14155552671'}).yields(undefined, {MessageId: 'phone'});
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', PhoneNumber: '+14155552671'}).yields(undefined, {MessageId: 'phonearn'});
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:eu-west-1:123456789012:MyTopic'}).yields(undefined, {MessageId: 'name eu'});
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:123456789012:MyTopic'}).yields(undefined, {MessageId: 'name us'});
stub.yields(undefined, {MessageId: 'bla'});
