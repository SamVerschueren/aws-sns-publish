import test from 'ava';
import sns from './fixtures/stub-sns';
import m from '.';

test.beforeEach(() => {
	delete process.env.AWS_ACCOUNT_ID;
	delete process.env.AWS_REGION;
});

test('error', async t => {
	await t.throws(m(), 'Please provide a message');
	await t.throws(m('message'), 'Please provide an `arn`, `name` or `phone` number');
	await t.throws(m('message', {name: 'f!'}), 'Provided topic name `f!` is not valid');
	await t.throws(m('message', {name: 'foo/bar'}), 'Provided topic name `foo/bar` is not valid');
	await t.throws(m('message', {name: 'foo'}), 'Provide a valid AWS account ID');
	await t.throws(m('message', {name: 'foo', accountId: '1234'}), 'Provide a valid AWS account ID');
	await t.throws(m('message', {name: 'foo', accountId: '123456789012'}), 'Provide a `region`');
	await t.throws(m('message', {phone: '021'}), 'Provided number `021` is not a valid E. 164 phone number');
});

test('topic', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}), 'foo');
});

test('application', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:GCM/MyTopic'}), 'bar');
});

test('subject', async t => {
	t.is(await m('foo', {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', subject: 'Hello World'}), 'baz');
});

test('name', async t => {
	t.is(await m('foo', {name: 'MyTopic', accountId: '123456789012', region: 'eu-west-1'}), 'name eu');
	t.is(await m('foo', {name: 'MyTopic', accountId: '123456789012', region: 'us-west-2'}), 'name us');
});

test.serial('name with environment variables set', async t => {
	process.env.AWS_ACCOUNT_ID = '123456789012';
	process.env.AWS_REGION = 'eu-west-1';

	t.is(await m('foo', {name: 'MyTopic'}), 'name eu');
	t.is(await m('foo', {name: 'MyTopic', region: 'us-west-2'}), 'name us');
});

test('phone number', async t => {
	t.is(await m('foo', {phone: '+14155552671'}), 'phone');
});

test('phone number and topic', async t => {
	t.is(await m('foo', {phone: '+14155552671', arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'}), 'phonearn');
});

test.serial('object', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});

test.serial('json', async t => {
	await m({foo: 'bar'}, {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: {foo: 'bar'},
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic'
	});
});

test.serial('phone, topic and subject', async t => {
	await m({foo: 'bar'}, {phone: '+14155552671', arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', subject: 'MySubject', json: true});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: {foo: 'bar'},
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		PhoneNumber: '+14155552671',
		Subject: 'MySubject'
	});
});

test.serial('message attributes - string', async t => {
	await m(JSON.stringify({foo: 'foo'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: 'bar'}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"foo"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'String',
				StringValue: 'bar'
			}
		}
	});
});

test.serial('message attributes - string array', async t => {
	await m(JSON.stringify({foo: 'bar'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: ['bar']}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'String.Array',
				StringValue: '["bar"]'
			}
		}
	});
});

test.serial('message attributes - number', async t => {
	await m(JSON.stringify({foo: 'bar'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: 0}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'Number',
				StringValue: '0'
			}
		}
	});
});

test.serial('message attributes - number array', async t => {
	await m(JSON.stringify({foo: 'bar'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: [0]}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'String.Array',
				StringValue: '[0]'
			}
		}
	});
});

test.serial('message attributes - boolean', async t => {
	await m(JSON.stringify({foo: 'bar'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: true}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'String',
				StringValue: 'true'
			}
		}
	});
});

test.serial('message attributes - boolean array', async t => {
	await m(JSON.stringify({foo: 'bar'}), {arn: 'arn:aws:sns:us-west-2:111122223333:MyTopic', json: true, attributes: {bar: [true]}});

	t.deepEqual(sns.publish.lastCall.args[0], {
		Message: '{"foo":"bar"}',
		TopicArn: 'arn:aws:sns:us-west-2:111122223333:MyTopic',
		MessageAttributes: {
			bar: {
				DataType: 'String.Array',
				StringValue: '[true]'
			}
		}
	});
});
