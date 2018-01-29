'use strict';
const AWS = require('aws-sdk');
const pify = require('pify');
const isTopicArn = require('is-sns-topic-arn');
const isObject = require('is-obj');
const isPhoneNumber = require('is-e164-phone-number');
const isAwsAccountId = require('is-aws-account-id');

const sns = new AWS.SNS();
const snsPublish = pify(sns.publish.bind(sns));

const isValidTopicName = input => /^[\w-]{1,255}$/.test(input);

module.exports = (message, opts) => {
	opts = Object.assign({
		region: process.env.AWS_REGION,
		accountId: process.env.AWS_ACCOUNT_ID
	}, opts);

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!opts.arn && !opts.name && !opts.phone) {
		return Promise.reject(new Error('Please provide an `arn`, `name` or `phone` number'));
	}

	if (opts.phone && !isPhoneNumber(opts.phone)) {
		return Promise.reject(new Error(`Provided number \`${opts.phone}\` is not a valid E. 164 phone number`));
	}

	if (!opts.arn && opts.name && !isValidTopicName(opts.name)) {
		return Promise.reject(new Error(`Provided topic name \`${opts.name}\` is not valid`));
	}

	if (opts.name && !isAwsAccountId(opts.accountId)) {
		return Promise.reject(new Error('Provide a valid AWS account ID'));
	}

	if (opts.name && !opts.region) {
		return Promise.reject(new Error('Provide a `region`'));
	}

	const params = {
		Message: opts.json !== true && isObject(message) ? JSON.stringify(message) : message
	};

	if (opts.arn) {
		const arnType = isTopicArn(opts.arn) ? 'TopicArn' : 'TargetArn';
		params[arnType] = opts.arn;
	} else if (opts.name) {
		params.TopicArn = `arn:aws:sns:${opts.region}:${opts.accountId}:${opts.name}`;
	}

	if (opts.phone) {
		params.PhoneNumber = opts.phone;
	}

	if (opts.subject) {
		params.Subject = opts.subject;
	}

	return snsPublish(params).then(data => data.MessageId);
};
