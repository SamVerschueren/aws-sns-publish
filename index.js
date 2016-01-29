'use strict';
var AWS = require('aws-sdk');
var pify = require('pify');
var Promise = require('pinkie-promise');
var isTopicArn = require('is-sns-topic-arn');
var isObject = require('is-obj');

var sns = new AWS.SNS();

module.exports = function (message, opts) {
	opts = opts || {};

	if (!message) {
		return Promise.reject(new TypeError('Please provide a message'));
	}

	if (!opts.arn) {
		return Promise.reject(new Error('Please provide an arn'));
	}

	var arnType = isTopicArn(opts.arn) ? 'TopicArn' : 'TargetArn';
	var params = {
		Message: opts.json !== true && isObject(message) ? JSON.stringify(message) : message
	};

	params[arnType] = opts.arn;

	if (opts.subject) {
		params.Subject = opts.subject;
	}

	return pify(sns.publish.bind(sns), Promise)(params).then(function (data) {
		return data.MessageId;
	});
};
