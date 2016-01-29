'use strict';
var AWS = require('aws-sdk');

// SNS
function SNS() {

}

SNS.prototype.publish = function (opts, cb) {
	cb(undefined, {MessageId: '8a98f4d0-078b-5176-9af2-bbd871660ecb'});
};

var sns = new SNS();

AWS.SNS = function () {
	return sns;
};

module.exports = sns;
