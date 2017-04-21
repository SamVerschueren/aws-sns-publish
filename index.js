'use strict';
const AWS = require('aws-sdk');
const pify = require('pify');
const isTopicArn = require('is-sns-topic-arn');
const isObject = require('is-obj');
const isPhoneNumber = require('is-e164-phone-number');

const sns = new AWS.SNS();
const snsPublish = pify(sns.publish.bind(sns));

module.exports = (message, opts) => {
	opts = opts || {};

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!opts.arn && !opts.phone) {
		return Promise.reject(new Error('Please provide an `arn` or a `phone` number'));
	}

	if (opts.phone && !isPhoneNumber(opts.phone)) {
		return Promise.reject(new Error(`Provided number \`${opts.phone}\` is not a valid E. 164 phone number`));
	}

	const params = {
		Message: opts.json !== true && isObject(message) ? JSON.stringify(message) : message
	};

	if (opts.arn) {
		const arnType = isTopicArn(opts.arn) ? 'TopicArn' : 'TargetArn';
		params[arnType] = opts.arn;
	}

	if (opts.phone) {
		params.PhoneNumber = opts.phone;
	}

	if (opts.subject) {
		params.Subject = opts.subject;
	}

	return snsPublish(params).then(data => data.MessageId);
};
