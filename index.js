'use strict';
const AWS = require('aws-sdk');
const isTopicArn = require('is-sns-topic-arn');
const isObject = require('is-obj');
const isPhoneNumber = require('is-e164-phone-number');
const isAwsAccountId = require('is-aws-account-id');

const isValidTopicName = input => /^[\w-]{1,255}$/.test(input);

const convertObjectToMessageAttributes = input => {
	const result = {};

	for (const key of Object.keys(input)) {
		const value = input[key];
		let parsedValue = `${value}`;
		let dataType = 'String';

		if (Array.isArray(value)) {
			dataType = 'String.Array';
			parsedValue = JSON.stringify(value);
		} else if (typeof value === 'number') {
			dataType = 'Number';
		}

		result[key] = {
			DataType: dataType,
			StringValue: parsedValue
		};
	}

	return result;
};

module.exports = async (message, opts) => {
	const options = {
		region: process.env.AWS_REGION,
		accountId: process.env.AWS_ACCOUNT_ID,
		...opts
	};

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!options.arn && !options.name && !options.phone) {
		return Promise.reject(new Error('Please provide an `arn`, `name` or `phone` number'));
	}

	if (options.phone && !isPhoneNumber(options.phone)) {
		return Promise.reject(new Error(`Provided number \`${options.phone}\` is not a valid E. 164 phone number`));
	}

	if (!options.arn && options.name && !isValidTopicName(options.name)) {
		return Promise.reject(new Error(`Provided topic name \`${options.name}\` is not valid`));
	}

	if (options.name && !isAwsAccountId(options.accountId)) {
		return Promise.reject(new Error('Provide a valid AWS account ID'));
	}

	if (options.name && !options.region) {
		return Promise.reject(new Error('Provide a `region`'));
	}

	const params = {
		Message: options.json !== true && isObject(message) ? JSON.stringify(message) : message
	};

	if (options.arn) {
		const arnType = isTopicArn(options.arn) ? 'TopicArn' : 'TargetArn';
		params[arnType] = options.arn;
	} else if (options.name) {
		params.TopicArn = `arn:aws:sns:${options.region}:${options.accountId}:${options.name}`;
	}

	if (options.phone) {
		params.PhoneNumber = options.phone;
	}

	if (options.subject) {
		params.Subject = options.subject;
	}

	if (options.attributes) {
		params.MessageAttributes = convertObjectToMessageAttributes(options.attributes);
	}

	const sns = new AWS.SNS();

	const data = await sns.publish(params).promise();

	return data.MessageId;
};
