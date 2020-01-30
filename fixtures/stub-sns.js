'use strict';
const AWS = require('aws-sdk');
const sinon = require('sinon');

class SNS {
	publish() {
		return {
			promise: () => Promise.resolve({MessageId: '8a98f4d0-078b-5176-9af2-bbd871660ecb'})
		};
	}
}

const sns = new SNS();

AWS.SNS = function () {
	return sns;
};

module.exports = sns;

const wrap = result => ({
	promise: () => Promise.resolve(result)
});

// Stub `sns.publish`
const stub = sinon.stub(sns, 'publish');
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}).returns(wrap({MessageId: 'foo'}));
stub.withArgs({Message: 'foo', TargetArn: 'arn:aws:sns:us-west-2:111122223333:GCM/MyTopic'}).returns(wrap({MessageId: 'bar'}));
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', Subject: 'Hello World'}).returns(wrap({MessageId: 'baz'}));
stub.withArgs({Message: 'foo', PhoneNumber: '+14155552671'}).returns(wrap({MessageId: 'phone'}));
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', PhoneNumber: '+14155552671'}).returns(wrap({MessageId: 'phonearn'}));
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:eu-west-1:123456789012:MyTopic'}).returns(wrap({MessageId: 'name eu'}));
stub.withArgs({Message: 'foo', TopicArn: 'arn:aws:sns:us-west-2:123456789012:MyTopic'}).returns(wrap({MessageId: 'name us'}));
stub.returns(wrap({MessageId: 'bla'}));
