'use strict';
const AWS = require('aws-sdk');
const pify = require('pify');
const isTopicArn = require('is-sns-topic-arn');
const isObject = require('is-obj');

const sns = new AWS.SNS();

module.exports = (message, opts) => {
	opts = opts || {};

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!opts.arn) {
		return Promise.reject(new Error('Please provide an arn'));
	}

	const arnType = isTopicArn(opts.arn) ? 'TopicArn' : 'TargetArn';
	const params = {
		Message: opts.json !== true && isObject(message) ? JSON.stringify(message) : message,
		[arnType]: opts.arn
	};

	if (opts.subject) {
		params.Subject = opts.subject;
	}

	return pify(sns.publish.bind(sns))(params).then(data => data.MessageId);
};
