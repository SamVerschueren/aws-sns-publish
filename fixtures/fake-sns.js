'use strict';
const AWS = require('aws-sdk');

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
